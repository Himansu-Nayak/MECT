# MECT Phase 20 — Frontend Docker Deployment Report

**Application:** Next.js 16.4.3 / React 19 / TypeScript 5.7  
**Container Name:** `mect-frontend`  
**Image Tag:** `mect-frontend:production`  
**Host Binding:** `127.0.0.1:3001:3000`  
**Deployment Path:** `/opt/mect/frontend`

---

## 1. Container Build & Architecture

- **Base Image:** `node:22-alpine`
- **Build Strategy:** Multi-stage Docker build:
  1. `deps`: Installs `libc6-compat`, deterministic dependency resolution via `npm ci`.
  2. `builder`: Compiles Next.js with `output: "standalone"`, generating `.next/standalone` with all traced dependencies and server bundle.
  3. `runner`: Unprivileged Alpine container running as non-root `nextjs` (UID 1001, GID 1001).
- **Traced Bundle Size:** 83.7 MB compressed (338 MB uncompressed image).
- **Compiled Routes:** 40/40 routes compiled statically and dynamically without errors.

---

## 2. Environment Variables & Secret Separation

Frontend environment configuration conforms to strict isolation rules:

| Variable | Scope | Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Container | `production` | Enables optimized production React runtime |
| `PORT` | Container | `3000` | Internal listening port |
| `HOSTNAME` | Container | `0.0.0.0` | Container network bind address |
| `NEXT_PUBLIC_API_BASE_URL` | Client / Browser | `https://mect.org.in` | Base canonical domain for public assets |
| `NEXT_PUBLIC_API_URL` | Client / Browser | `https://mect.org.in/api/v1` | Public REST API base URL |
| `AI_ENGINE_MODE` | Server Route | `local_with_fallback` | AI chat execution mode |
| `GROQ_API_KEY` | Server Route (Protected) | Configured in `.env.production` | Server-side LLM completion key (never in client JS) |
| `GROQ_MODEL` | Server Route | `qwen/qwen3.8-27b` | Primary high-intelligence open model |

---

## 3. Healthcheck & Liveness Verification

- **Docker Healthcheck Definition:**
  ```dockerfile
  HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/ai/health || exit 1
  ```
- **Local Host Probe:** `curl -i http://127.0.0.1:3001/api/ai/health`
  - Status: `200 OK`
  - Payload: `{"status":"operational","service":"MECT AI Assistant (HIm)"}`
- **Memory Consumption:** `51.63 MiB` / `15.61 GiB` (0.32% host memory).
- **Restart Policy:** `unless-stopped` verified across daemon restart.
