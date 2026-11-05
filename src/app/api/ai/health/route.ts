import { NextResponse } from "next/server";
import { PRIMARY_GROQ_MODEL, FALLBACK_GROQ_MODEL } from "@/lib/ai/groq-client";
import { aiGatewayCircuitBreaker } from "@/lib/ai/circuit-breaker";

export const runtime = "nodejs";

const LOCAL_AI_HEALTH_URL = process.env.LOCAL_AI_HEALTH_URL || "http://127.0.0.1:8082/v1/health";

export async function GET() {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY);
  let localEngineStatus = {
    reachable: false,
    details: null as Record<string, unknown> | null,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    const res = await fetch(LOCAL_AI_HEALTH_URL, {
      signal: controller.signal,
      headers: { "Accept": "application/json" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      localEngineStatus = {
        reachable: true,
        details: data,
      };
    }
  } catch {
    // Local engine offline or not running in current environment
  }

  const activeMode = process.env.AI_ENGINE_MODE || "local_with_fallback";
  const circuitStatus = aiGatewayCircuitBreaker.getStatus();

  const activeRouting = localEngineStatus.reachable && activeMode !== "groq_only" && !circuitStatus.isCoolingDown
    ? "local_independent_engine"
    : "groq_cloud_hot_standby";

  return NextResponse.json(
    {
      status: "operational",
      service: "MECT AI Assistant (HIm)",
      routingMode: activeMode,
      activeEngine: activeRouting,
      circuitBreaker: circuitStatus,
      localEngine: localEngineStatus,
      cloudFallback: {
        provider: "Groq Cloud",
        primaryModel: PRIMARY_GROQ_MODEL,
        fallbackModel: FALLBACK_GROQ_MODEL,
        keyConfigured: hasGroqKey,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
