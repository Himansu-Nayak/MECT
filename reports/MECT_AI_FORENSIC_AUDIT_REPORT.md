# MECT AI — FORENSIC AUDIT REPORT
**Platform:** HIm Institutional Intelligence Platform  
**Target Environment:** Production (`https://mect.org.in`) — Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Date:** November 14, 2026  
**Auditor:** Principal AI & SRE Engineering Team  
**Status:** COMPLETED & REMEDIATED  

---

## 1. Executive Summary

During production validation of the **MECT AI Assistant (HIm)**, users reported two sequential interaction failures from the live chatbot UI (`https://mect.org.in`):
1. **Question 1:** *"How can I volunteer or mentor students in Odisha?"*
2. **Question 2:** *"What I have to do?"*

Both questions returned an identical generic error message:
> *"I apologize, but I am experiencing temporary connectivity difficulties. Please try again in a few moments or email the Secretariat at contact@mect.org.in."*

A full-stack forensic audit was executed spanning the Next.js client component (`HImChatbot.tsx`), the API Gateway route (`/api/ai/chat`), the Circuit Breaker (`circuit-breaker.ts`), Groq Cloud integration (`groq-client.ts`), and the VPS Docker runtime container (`mect-frontend`).

---

## 2. End-to-End Trace & Failure Chain

The interaction journey was traced across all 13 lifecycle stages:

```
[User Input]
     │
     ▼
[HImChatbot.tsx (React Client)]
     │ HTTP POST /api/ai/chat
     ▼
[Nginx Reverse Proxy (:443)]
     │ Proxy pass -> http://127.0.0.1:3001
     ▼
[Next.js API Route (/api/ai/chat/route.ts)]
     │
     ├─► [Circuit Breaker: canAttemptLocal()]
     │        └─► Local engine (http://127.0.0.1:8082) -> CONNECTION REFUSED (offline)
     │        └─► Circuit trips to OPEN (60s cooldown)
     │
     └─► [Fallback: createGroqChatStream() in groq-client.ts]
              └─► Read process.env.GROQ_API_KEY
              └─► ERROR: Key is empty string `""` in container environment!
              └─► Throws: "GROQ_API_KEY is not configured in server environment"
              └─► Route catches error -> returns HTTP 503 JSON:
                  {"error": "HIm assistant is temporarily experiencing technical difficulties..."}
     │
     ▼
[HImChatbot.tsx Catch Block]
     └─► Receives HTTP 503 non-OK response
     └─► Fallback string substituted: "I apologize, but I am experiencing temporary connectivity difficulties..."
```

---

## 3. Detailed Component Findings

### 3.1 Frontend Client (`src/components/ai/HImChatbot.tsx`)
- **Observation:** The component handled streaming via `ReadableStream` (`fetch("/api/ai/chat")`).
- **Vulnerability:** When a non-200 HTTP code was returned, the client simply fell back to the hardcoded apology message without providing a **Retry** option or detailing whether the error was due to rate limiting (HTTP 429) vs server downtime (HTTP 503).
- **Remediation:** Added inline `Retry Question` action button when a prompt encounters a connectivity failure.

### 3.2 Gateway Route (`src/app/api/ai/chat/route.ts`)
- **Observation:** Dual-routing gateway designed to prioritize local engine (`127.0.0.1:8082`) and fail over to Groq Cloud.
- **Vulnerability:** Lacked correlation ID tracking on streaming response headers (`X-Correlation-Id`), making distributed log tracing opaque.
- **Remediation:** Injected UUID correlation IDs on every request, logging errors with correlation tokens.

### 3.3 Container Environment (`compose.production.yaml` & Docker Runtime)
- **Observation:** The production Docker Compose service `mect-frontend` declared:
  ```yaml
  environment:
    GROQ_API_KEY: "${GROQ_API_KEY}"
  ```
- **Root Cause:** When `docker compose up -d` was previously invoked without explicitly passing `--env-file .env.production`, Docker defaulted to an empty string for `${GROQ_API_KEY}`. The container was thus running without an API key in its process environment.
- **Remediation:** Restarted container specifying `--env-file .env.production`, securely populating the Groq API key into container runtime.

### 3.4 Provider & Model Compatibility (`groq-client.ts`)
- **Observation:** Historical configuration referenced `qwen-2.5-32b`, which was decommissioned by Groq.
- **Remediation:** Updated primary model to active production model `qwen/qwen3.8-27b`, with seamless hot-standby fallback to `openai/gpt-oss-20b`.

---

## 4. Verification & Status

- Direct API health check (`/api/ai/health`) confirmed:
  - `circuitBreaker`: CLOSED
  - `cloudFallback.keyConfigured`: TRUE
  - `routingMode`: fallback_only / dual_mode
- End-to-end streaming tests verified:
  - Question 1 ("How can I volunteer or mentor students in Odisha?"): **HTTP 200 SUCCESS (28 words)**
  - Question 2 ("What I have to do?"): **HTTP 200 SUCCESS (28 words, seamless follow-up)**
- Status: **FULL REMEDIATION VERIFIED**.

