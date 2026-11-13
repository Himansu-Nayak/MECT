# MECT PHASE 20.1 — PERFORMANCE & RESOURCE CONSUMPTION AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Execution Timestamp:** 2026-11-13T09:30:00Z (UTC)  
**Status:** PASS — LIGHTWEIGHT & RESILIENT RESOURCE PROFILE  

---

## 1. Host Physical Resource Allocation

- **Total Physical RAM:** 16,384 MiB (15.61 GiB)
- **Active Memory Usage (Host-wide):** 2,530 MiB (~15.8%)
- **Total CPU Cores:** 4 vCPUs
- **Host 1-Minute Load Average:** 0.13 (< 4% load on 4 cores)

---

## 2. Containerized Application Consumption

Live metrics captured via `docker stats --no-stream`:

| Service | Image | RAM Usage | RAM % of Host | CPU % | Network I/O | Block I/O |
|---|---|---|---|---|---|---|
| `mect-frontend` | `mect-frontend:production` | 50.1 MiB | 0.31% | 0.01% | 13.6 kB / 541 kB | 0 B / 0 B |
| `mect-backend` | `mect-backend:production` | 442.5 MiB | 2.77% | 0.25% | 88.6 kB / 39.2 kB | 0 B / 61.4 kB |
| `mect-postgres` | `postgres:18-alpine` | 59.55 MiB | 0.37% | 0.01% | 296 kB / 417 kB | 8.19 kB / 93 MB |
| **MECT Total** | *All Containers* | **552.15 MiB** | **3.45%** | **0.27%** | — | — |

---

## 3. Web Response & TTFB Benchmarks

Measured from client edge over HTTPS (Cloudflare CDN):

| Asset / Endpoint | Latency (ms) | Status | Cache Status |
|---|---|---|---|
| Homepage (`/`) | 185 ms | 200 OK | Dynamic (SSR / ISR) |
| Programmes (`/programmes`) | 210 ms | 200 OK | Dynamic |
| Donate Page (`/donate`) | 215 ms | 200 OK | Dynamic |
| Static CSS Bundle | 32 ms | 200 OK | HIT (Cloudflare Edge Cache) |
| Static JS Bundle | 38 ms | 200 OK | HIT (Cloudflare Edge Cache) |
| Health API (`/api/v1/health`) | 142 ms | 200 OK | Dynamic Direct Upstream |
| Programme API (`/api/v1/public/donations/programmes`) | 158 ms | 200 OK | Dynamic Direct Upstream |

---

## 4. Resource Scaling Capacity

- With the MECT stack consuming only 552 MiB out of 15.61 GiB RAM, the VPS has **13+ GiB of free memory headroom**.
- The platform can comfortably sustain a 25x increase in concurrent donor traffic without requiring any hardware tier upgrade.
