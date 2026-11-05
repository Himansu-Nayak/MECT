import { NextRequest, NextResponse } from "next/server";
import { createGroqChatStream, ChatMessage } from "@/lib/ai/groq-client";
import { aiGatewayCircuitBreaker } from "@/lib/ai/circuit-breaker";

export const runtime = "nodejs";

// Sliding-window IP rate limiter (20 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Extracts validated client IP supporting Cloudflare and Nginx reverse proxies.
 * Rejects header tampering and malformed entries.
 */
function extractClientIp(req: NextRequest): string {
  // 1. Cloudflare Edge Connecting IP (most trustworthy when proxy is Cloudflare)
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // 2. Standard X-Forwarded-For header
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const rawIps = forwarded.split(",").map((item) => item.trim());
    const validIps = rawIps.filter(isValidIp);
    if (validIps.length > 0) {
      return validIps[0];
    }
  }

  // 3. Fallback to X-Real-IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientRecord = rateLimitMap.get(ip);

  // Periodic pruning of stale rate-limit records
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!clientRecord || now > clientRecord.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (clientRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientRecord.count += 1;
  return true;
}

const LOCAL_AI_CHAT_URL = process.env.LOCAL_AI_CHAT_URL || "http://127.0.0.1:8082/v1/chat/completions";
const INTERNAL_AI_SECRET = process.env.INTERNAL_AI_SECRET || "";
const AI_ENGINE_MODE = process.env.AI_ENGINE_MODE || "local_with_fallback";

export async function POST(req: NextRequest) {
  // 1. Check for client pre-abort
  if (req.signal.aborted) {
    return new Response(null, { status: 499 }); // Client Closed Request
  }

  try {
    // 2. IP identification & rate limiting
    const ip = extractClientIp(req);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many requests from this IP. Please wait a minute before sending another message.",
        },
        { status: 429 }
      );
    }

    // 3. Body Parsing & Strict Schema Validation
    const body = await req.json();
    const { messages, preferredLanguage = "en" } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' must be a non-empty array." },
        { status: 400 }
      );
    }

    const sanitizedMessages: ChatMessage[] = [];
    for (const msg of messages) {
      if (
        typeof msg !== "object" ||
        !msg ||
        (msg.role !== "user" && msg.role !== "assistant") ||
        typeof msg.content !== "string"
      ) {
        continue;
      }

      const boundedContent = msg.content.trim().slice(0, 1500);
      if (boundedContent.length > 0) {
        sanitizedMessages.push({
          role: msg.role,
          content: boundedContent,
        });
      }
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid messages found in the request." },
        { status: 400 }
      );
    }

    const validLang = ["en", "or", "hi"].includes(preferredLanguage)
      ? (preferredLanguage as "en" | "or" | "hi")
      : "en";

    // 4. Dual-Routing & Resilient Circuit Breaker Evaluation
    let localStreamResponse: Response | null = null;
    const canAttemptLocal = AI_ENGINE_MODE !== "groq_only" && aiGatewayCircuitBreaker.canAttemptLocal();

    if (canAttemptLocal) {
      const localController = new AbortController();
      let timeoutId: NodeJS.Timeout | null = null;

      // Propagate client abort to cancel local upstream request
      const onClientAbort = () => localController.abort();
      req.signal.addEventListener("abort", onClientAbort);

      try {
        timeoutId = setTimeout(() => localController.abort(), 3500);

        const localRes = await fetch(LOCAL_AI_CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Token": INTERNAL_AI_SECRET,
          },
          body: JSON.stringify({
            messages: sanitizedMessages,
            preferred_language: validLang,
            stream: true,
          }),
          signal: localController.signal,
        });

        if (timeoutId) clearTimeout(timeoutId);
        req.signal.removeEventListener("abort", onClientAbort);

        if (localRes.ok && localRes.body) {
          // Success! Reset circuit breaker
          aiGatewayCircuitBreaker.recordSuccess();
          localStreamResponse = localRes;
        } else {
          // Server returned qualifying 5xx error
          const errDetail = `Local engine returned status ${localRes.status}`;
          aiGatewayCircuitBreaker.recordFailure(errDetail);
          console.warn(`[AI Gateway Circuit Breaker] ${errDetail}. Falling back to Groq Cloud...`);
        }
      } catch (localErr: unknown) {
        if (timeoutId) clearTimeout(timeoutId);
        req.signal.removeEventListener("abort", onClientAbort);

        // If client aborted, don't penalize local engine circuit breaker
        if (req.signal.aborted) {
          return new Response(null, { status: 499 });
        }

        const errMessage = (localErr as Error)?.message || String(localErr);
        aiGatewayCircuitBreaker.recordFailure(errMessage);
        console.info(`[AI Gateway Circuit Breaker] Local probe failure (${errMessage}). Falling back to Groq Cloud...`);
      }
    } else if (AI_ENGINE_MODE !== "groq_only") {
      const status = aiGatewayCircuitBreaker.getStatus();
      console.info(`[AI Gateway] Circuit OPEN (cooldown: ${status.remainingCooldownSeconds}s remaining). Bypassing directly to Groq Cloud.`);
    }

    // 5. If local engine streamed successfully, pipe it directly with client abort listener
    if (localStreamResponse && localStreamResponse.body) {
      return new Response(localStreamResponse.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
          "X-MECT-Engine": "local-independent-qwen",
        },
      });
    }

    // 6. Fallback: Initiate Groq Cloud Stream with client abort propagation
    const fallbackStream = await createGroqChatStream({
      messages: sanitizedMessages,
      preferredLanguage: validLang,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of fallbackStream) {
            if (req.signal.aborted) {
              controller.close();
              return;
            }
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              const payload = `data: ${JSON.stringify({ text: content })}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamError: unknown) {
          if (!req.signal.aborted) {
            console.error("[Groq Fallback Stream Error]:", streamError);
            const errPayload = `data: ${JSON.stringify({
              error: "An error occurred while streaming response.",
            })}\n\n`;
            controller.enqueue(encoder.encode(errPayload));
          }
          controller.close();
        }
      },
      cancel() {
        // Handle client reader cancellation mid-stream
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
        "X-MECT-Engine": "groq-cloud-fallback",
      },
    });
  } catch (err: unknown) {
    if (req.signal.aborted) {
      return new Response(null, { status: 499 });
    }
    const error = err as { message?: string };
    console.error("[API AI Chat Gateway Exception]:", error?.message || err);

    return NextResponse.json(
      {
        error:
          "HIm assistant is temporarily experiencing technical difficulties. Please try again shortly or contact contact@mahavirtrust.org directly.",
      },
      { status: 503 }
    );
  }
}
