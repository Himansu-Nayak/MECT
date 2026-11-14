# MECT AI — ROOT CAUSE ANALYSIS (RCA)

**Incident:** Chatbot Connectivity Failure for Institutional Inquiries  
**Date of Incident:** November 13–14, 2026  
**Severity:** High (User-Facing Chatbot Service Interruption)  
**Affected Service:** HIm AI Digital Assistant (`/api/ai/chat`)  
**Resolution Time:** Resolved  

---

## 1. Problem Statement

Two standard user inquiries submitted through the public website (`https://mect.org.in`):

1. *"How can I volunteer or mentor students in Odisha?"*
2. *"What I have to do?"*

Both failed to stream any generative response and immediately rendered the client-side error message:
> *"I apologize, but I am experiencing temporary connectivity difficulties. Please try again in a few moments or email the Secretariat at <contact@mect.org.in>."*

---

## 2. Root Cause Breakdown (The "5 Whys")

1. **Why did the user see the temporary connectivity difficulties error?**  
   Because the Next.js client (`HImChatbot.tsx`) caught a rejected fetch promise when calling `/api/ai/chat`. The server returned HTTP status `503 Service Unavailable`.

2. **Why did `/api/ai/chat` return HTTP 503?**  
   Because both the primary local inference engine and the cloud fallback service failed during request execution.

3. **Why did the primary local inference engine fail?**  
   The local Python inference service (`http://127.0.0.1:8082/v1/chat/completions`) was not running as an active daemon on Hostinger VPS `srv2000528`. After 3 consecutive socket connection refused errors (`ECONNREFUSED`), the gateway's `aiGatewayCircuitBreaker` correctly transitioned to the `OPEN` state to prevent thread exhaustion.

4. **Why did the cloud fallback service (Groq Cloud) fail?**  
   When the gateway executed `createGroqChatStream()`, `getGroqClient()` evaluated `process.env.GROQ_API_KEY`. Inside the `mect-frontend` Docker container, the environment variable was empty (`""`). `getGroqClient()` threw an exception: `GROQ_API_KEY is not configured in server environment`.

5. **Why was `GROQ_API_KEY` empty inside the container?**  
   The Docker container had been launched with `docker compose up -d` without specifying the `--env-file .env.production` flag. In Docker Compose, variables mapped as `GROQ_API_KEY: "${GROQ_API_KEY}"` resolve to empty strings when no environment file is supplied to the CLI, despite `.env.production` existing on the host disk.

---

## 3. Contributing Factor: Groq Free-Tier Rate Limits (ITPM)

During load testing, an additional operational constraint was discovered:

- Groq's on-demand free tier imposes an **Input Tokens Per Minute (ITPM) limit of 7,000 tokens**.
- Rapid sequential requests with comprehensive system prompts can temporarily trigger HTTP 429 (`rate_limit_exceeded`).
- **Remediation:** Configured automatic hot-standby model switching in `groq-client.ts` to `openai/gpt-oss-20b` when primary model `qwen/qwen3.8-27b` encounters a 429 status code.

---

## 4. Remediation Steps Taken

1. **Populated Runtime Secret:** Relaunched `mect-frontend` with `--env-file .env.production`, injecting the active API key directly into container environment.
2. **Model Pinning:** Pinned primary model to active `qwen/qwen3.8-27b` and secondary fallback to `openai/gpt-oss-20b`.
3. **Correlation ID Tracking:** Added `X-Correlation-Id` to all API responses for unambiguous log correlation.
4. **UI Recovery Action:** Added an inline `Retry Question` button in `HImChatbot.tsx` so users can re-attempt transient failures without refreshing or re-typing.
5. **System Prompt Optimization:** Trimmed and structured knowledge base system prompt, reducing token consumption per turn by ~35%, effectively preventing ITPM quota starvation.

---

## 5. Preventative Measures

- Added automated health check probe to `/api/ai/health` verifying `keyConfigured: true`.
- Documented Compose invocation standard requiring `--env-file .env.production` in operations runbook.
- Implemented multi-turn conversational pruning (`messages.slice(-8)`) to bound prompt token growth over long sessions.
