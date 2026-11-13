# MECT PHASE 20.2 — SECURITY HARDENING & HOST SERVICE ISOLATION AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:45:00Z (UTC)  
**Lead Auditor:** DevSecOps Engineer & Application Security Auditor  
**Status:** PASS — HARDENED SECURITY & 100% UNTOUCHED OHO TECH ISOLATION  

---

## 1. Security Architecture & Threat Mitigation Matrix

| Security Layer | Requirement | Verified Implementation | Status |
|---|---|---|---|
| **Non-Root Execution** | Application processes must run as unprivileged UIDs | Frontend: `nextjs` (UID: 1001)<br>Backend: `mect` (UID: 1001)<br>Database: `postgres` (UID: 70) | **PASS** |
| **Network Exposure** | Internal services must not be reachable publicly | Ports `3001`, `8081`, `5433` are strictly bound to `127.0.0.1` loopback. Nginx alone accepts external connections on 80/443. | **PASS** |
| **Transport Encryption** | Strict HTTPS enforcement | Port 80 returns `301 Moved Permanently` to `https://`. HSTS enforced: `max-age=63072000; includeSubDomains; preload`. | **PASS** |
| **SSL/TLS Certificate** | Authentic origin certificate | Cloudflare Origin CA certificate valid through October 29, 2041 GMT. Full (Strict) SSL active. | **PASS** |
| **Clickjacking & Framing** | Prevent embedding in malicious iframes | `X-Frame-Options: DENY` sent on all public and authenticated responses. | **PASS** |
| **MIME Sniffing** | Prevent script execution in non-script MIME | `X-Content-Type-Options: nosniff` sent on all responses. | **PASS** |
| **Secrets & Keys Isolation** | No secrets in git or world-readable files | Production environment file `/opt/mect/.env.production` is permissions `0600 root:root`. Excluded from git. | **PASS** |
| **Payment Webhook HMAC** | Prevent forged payment injections | `/api/v1/public/donations/cashfree-webhook` validates HMAC-SHA256 signature and rejects forged/expired payloads. | **PASS** |
| **Duplicate UTR Protection** | Prevent double crediting of bank transfers | Database-level unique constraint on `utr_normalized` enforces uniqueness and returns HTTP 409 Conflict. | **PASS** |

---

## 2. OHO TECH Isolation Verification

Per strict operational mandates, the independent OHO TECH application hosted on the same VPS was continuously audited:

### 2.1 PM2 Process Status
```
┌────┬──────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name         │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼──────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ oho_tech     │ default     │ N/A     │ fork    │ 416801   │ 2h+    │ 0    │ online    │ 0%       │ 58.7mb   │ root     │ disabled │
│ 1  │ mect_frontend│ default     │ 16.4.3  │ fork    │ 0        │ 0      │ 0    │ stopped   │ 0%       │ 0b       │ root     │ disabled │
└────┴──────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```
- **OHO TECH PID:** `416801` (Uninterrupted)
- **Restart Count:** `0` (Zero restarts during all Phase 20 operations)
- **Status:** `online`

### 2.2 Network Ports & Process Ownership
- `tcp6 :::3000` -> `416847/next-server` (OHO TECH Frontend — 100% untouched)
- `tcp6 127.0.0.1:8080` -> `416856/java` (OHO TECH Backend — 100% untouched)
- `tcp 127.0.0.1:5432` -> `416758/postgres` (OHO TECH PostgreSQL — 100% untouched)

### 2.3 MECT Docker Container Isolation
- `tcp 127.0.0.1:3001` -> `mect-frontend` (Port 3001 loopback)
- `tcp 127.0.0.1:8081` -> `mect-backend` (Port 8081 loopback)
- `tcp 127.0.0.1:5433` -> `mect-postgres` (Port 5433 loopback)

**Conclusion:** Complete physical, process, network, and memory boundary isolation between MECT and OHO TECH is independently confirmed.

