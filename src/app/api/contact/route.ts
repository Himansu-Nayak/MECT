import { NextRequest, NextResponse } from "next/server";
import { MECT_ORG } from "@/config/org";

// In-memory sliding window rate-limiter (5 requests per 60 seconds per client IP)
// Note: In-memory store resets on server restart, suitable for single-node / edge rate limiting.
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

const VALID_CATEGORIES = [
  "Grievance",
  "RTI",
  "CSR",
  "Scholarship",
  "Volunteer",
  "General",
] as const;

type InquiryCategory = (typeof VALID_CATEGORIES)[number];

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        {
          error:
            "Too many submissions received from this network. Please wait 60 seconds before submitting another inquiry.",
        },
        { status: 429 }
      );
    }

    recentTimestamps.push(now);
    rateLimitMap.set(clientIp, recentTimestamps);

    let fullName = "";
    let email = "";
    let phone = "";
    let category = "";
    let message = "";
    let honeypot = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      fullName = body.fullName || body.name || "";
      email = body.email || "";
      phone = body.phone || "";
      category = body.category || "";
      message = body.message || "";
      honeypot = body._gotcha || body.honeypot || "";
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData();
      fullName = (formData.get("name") || formData.get("fullName") || "").toString();
      email = (formData.get("email") || "").toString();
      phone = (formData.get("phone") || "").toString();
      category = (formData.get("category") || "").toString();
      message = (formData.get("message") || "").toString();
      honeypot = (formData.get("_gotcha") || formData.get("honeypot") || "").toString();
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type. Please use application/json or form submission." },
        { status: 415 }
      );
    }

    // Honeypot check (anti-bot)
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json(
        { error: "Spam submission detected." },
        { status: 400 }
      );
    }

    // Server-side validations
    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 2 || cleanName.length > 150) {
      return NextResponse.json(
        { error: "Full legal name is required (between 2 and 150 characters)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail) || cleanEmail.length > 255) {
      return NextResponse.json(
        { error: "A valid email address is required for official written correspondence." },
        { status: 400 }
      );
    }

    const cleanDigits = phone.replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length < 10 || cleanDigits.length > 15) {
      return NextResponse.json(
        { error: "A valid 10-digit mobile number is required for telephone contact." },
        { status: 400 }
      );
    }

    const cleanCategory = category.trim();
    if (!VALID_CATEGORIES.includes(cleanCategory as InquiryCategory)) {
      return NextResponse.json(
        {
          error: `Invalid inquiry category. Must be one of: ${VALID_CATEGORIES.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    if (!cleanMessage || cleanMessage.length < 10) {
      return NextResponse.json(
        { error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }
    if (cleanMessage.length > 1000) {
      return NextResponse.json(
        { error: "Message length must not exceed 1000 characters." },
        { status: 400 }
      );
    }

    // Forward to Spring Boot backend
    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8081";
    let finalRef: string | number | null = null;
    let backendSuccess = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const backendRes = await fetch(`${backendUrl}/public/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`,
          category: cleanCategory,
          message: cleanMessage,
        }),
      });
      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData?.referenceId || backendData?.ticketNumber) {
          finalRef = backendData.referenceId || backendData.ticketNumber;
          backendSuccess = true;
        }
      }
    } catch {
      // Backend offline, timed out, or connection refused
    }

    if (backendSuccess && finalRef) {
      return NextResponse.json(
        {
          success: true,
          referenceId: finalRef,
          message: `Your inquiry has been registered in the official Secretariat intake log. Reference: ${finalRef}.`,
        },
        { status: 201 }
      );
    }

    // Local dev fallback: honoured ONLY when NODE_ENV !== "production" AND ALLOW_DEV_FALLBACK === "true"
    if (process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_FALLBACK === "true") {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const devRef = `MECT-INQ-${dateStr}-${randomSuffix}`;
      return NextResponse.json(
        {
          success: true,
          referenceId: devRef,
          message: `Your inquiry has been registered in the official Secretariat intake log. Reference: ${devRef}.`,
        },
        { status: 201 }
      );
    }

    // Fail closed: Never return 200/201 or generate a reference when the backend is unreachable
    return NextResponse.json(
      {
        error: `We could not save your submission. Nothing has been recorded. Please email ${MECT_ORG.contact.generalEmail} or call ${MECT_ORG.contact.primaryPhone} and quote your details.`,
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
