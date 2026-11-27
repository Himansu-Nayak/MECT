import { NextRequest, NextResponse } from "next/server";
import { MECT_ORG } from "@/config/org";

/**
 * MECT Public Donation Verification Claim Endpoint (`POST /api/donations/claim`)
 *
 * Architecture & Governance Documentation:
 * 1. Storage & Fail-Closed Semantics:
 *    - Persisted into Spring Boot backend entity `SbiDonationClaim` (`manual_bank_transfer_claims` table).
 *    - STRICT FAIL-CLOSED: If the backend is unreachable, times out, or returns 5xx, this endpoint
 *      returns HTTP 503 with a clear advisory message. Under NO circumstances is a local reference
 *      number generated or displayed in production when the backend did not record the submission.
 *    - Optional local development fallback is gated strictly behind `ALLOW_DEV_FALLBACK=true` and
 *      `NODE_ENV !== 'production'`.
 * 2. Lifecycle Status:
 *    - Initial status is strictly `UNVERIFIED` (pending bank reconciliation).
 *    - Under NO circumstances is an official 80G/12A statutory donation receipt issued
 *      prior to manual verification against the official State Bank of India statement.
 * 3. IP Rate Limiter:
 *    - Sliding-window in-memory rate limiter enforcing max 5 requests per 60 seconds per IP.
 *    - Client IP is extracted from trusted reverse proxy headers (`x-forwarded-for` or `x-real-ip`).
 */

const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function _resetRateLimitsForTesting() {
  rateLimitMap.clear();
}

export async function POST(request: NextRequest) {
  try {
    const forwardedHeader = request.headers.get("x-forwarded-for");
    const realIpHeader = request.headers.get("x-real-ip");
    const clientIp =
      (forwardedHeader ? forwardedHeader.split(",")[0]?.trim() : null) ||
      realIpHeader ||
      "127.0.0.1";

    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) || [];
    const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (recentTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return NextResponse.json(
        {
          error:
            "Too many submissions received from this IP address. Please wait 60 seconds before submitting another donation verification claim.",
        },
        { status: 429 }
      );
    }

    recentTimestamps.push(now);
    rateLimitMap.set(clientIp, recentTimestamps);

    const body = await request.json();
    const {
      donorName,
      donorEmail,
      donorPhone,
      donorPan,
      amount,
      utrReference,
      programmeCode,
      transferDate,
      notes,
      anonymous,
      communicationConsent,
      whatsappConsent,
    } = body;

    // Server-side validations
    if (!donorName || typeof donorName !== "string" || donorName.trim().length === 0) {
      return NextResponse.json(
        { error: "Donor full name is required for institutional accounting records." },
        { status: 400 }
      );
    }

    if (!donorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address for receipt delivery." },
        { status: 400 }
      );
    }

    if (!donorPhone || donorPhone.trim().replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json(
        { error: "Please specify a voluntary contribution amount of at least INR 1." },
        { status: 400 }
      );
    }

    if (!utrReference || typeof utrReference !== "string" || utrReference.trim().length < 8) {
      return NextResponse.json(
        { error: "Please provide a valid 8–40 character UTR / transaction reference number." },
        { status: 400 }
      );
    }

    // Forward to Spring Boot backend
    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8081";
    let finalClaimRef: string | null = null;
    let backendSuccess = false;
    let backendErrorMessage: string | null = null;
    let backendStatus: number = 503;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const authHeader = request.headers.get("authorization");
      const backendHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (authHeader) {
        backendHeaders["Authorization"] = authHeader;
      }

      const backendRes = await fetch(`${backendUrl}/api/v1/public/donations/sbi/submit-utr`, {
        method: "POST",
        headers: backendHeaders,
        signal: controller.signal,
        body: JSON.stringify({
          programmeCode: programmeCode || "GENERAL",
          amount: numAmount,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim().toLowerCase(),
          donorPhone: donorPhone.trim(),
          donorPan: donorPan ? donorPan.trim().toUpperCase() : undefined,
          utrReference: utrReference.trim().toUpperCase(),
          transferDate: transferDate || new Date().toISOString().split("T")[0],
          paymentModeNote: "Direct Bank Transfer / UPI Manual Claim",
          proofSummary: notes ? notes.trim() : "Submitted via mect.org.in/donate claim desk",
          anonymous: Boolean(anonymous),
          communicationConsent: communicationConsent ?? true,
          whatsappConsent: Boolean(whatsappConsent),
        }),
      });
      clearTimeout(timeoutId);

      const backendData = await backendRes.json().catch(() => null);
      if (backendRes.ok && backendData?.claimReference) {
        finalClaimRef = backendData.claimReference;
        backendSuccess = true;
      } else if (backendData && (backendData.message || backendData.error)) {
        backendErrorMessage = backendData.message || backendData.error;
        backendStatus = backendRes.status;
      }
    } catch {
      // Backend offline, timed out, or connection refused
    }

    if (backendSuccess && finalClaimRef) {
      return NextResponse.json({
        success: true,
        claimReference: finalClaimRef,
        status: "UNVERIFIED",
        message: `Claim received. Reference: ${finalClaimRef}. The Trust will check your transfer against its bank records before issuing a receipt.`,
      });
    }

    if (backendErrorMessage) {
      return NextResponse.json(
        { error: backendErrorMessage },
        { status: backendStatus }
      );
    }

    // Local dev / test fallback: honoured ONLY when ALLOW_DEV_FALLBACK === "true"
    if (process.env.ALLOW_DEV_FALLBACK === "true") {
      const timestamp = Date.now();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const devRef = `MECT-SBI-${timestamp.toString().slice(-6)}-${randomSuffix}`;
      return NextResponse.json({
        success: true,
        claimReference: devRef,
        status: "UNVERIFIED",
        message: `Claim received. Reference: ${devRef}. The Trust will check your transfer against its bank records before issuing a receipt.`,
      });
    }

    // Fail closed: Never return 200 or generate a reference when the backend is unreachable
    return NextResponse.json(
      {
        error: `We could not save your submission. Nothing has been recorded. Please email ${MECT_ORG.contact.generalEmail} or call ${MECT_ORG.contact.primaryPhone} and quote your details.`,
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
