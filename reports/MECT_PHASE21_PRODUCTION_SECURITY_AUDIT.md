# MECT PHASE 21 — PRODUCTION SECURITY & HARDENING AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T10:22:00Z (UTC)  
**Auditor:** Application Security Engineer & DevSecOps Lead  
**Status:** PASS — HARDENED POSTURE & DEFENSE IN DEPTH  

---

## 1. Security Baseline & Verification Summary

| Security Domain | Standard / Mechanism | Live Verified Result | Verdict |
|---|---|---|---|
| **Non-Root Execution** | Unprivileged container UIDs | `nextjs` (1001), `mect` (1001), `postgres` (70) | **PASS** |
| **Network Exposure** | Loopback binding only | 3001, 8081, 5433 bound strictly to `127.0.0.1` | **PASS** |
| **TLS/SSL Encryption** | TLS 1.3 / Full (Strict) | Cloudflare Origin CA valid to Oct 29, 2041 GMT | **PASS** |
| **HTTP Security Headers**| Defense-in-depth headers | HSTS preload (63072000), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` | **PASS** |
| **REST API Security** | Spring Security 6 RBAC | `/api/v1/admin/*` returns 401 unauthenticated; 403 on role mismatch | **PASS** |
| **Frontend SSR Protection**| Zero-leak initial HTML | Raw SSR responses contain only skeletons; 0 donor records in initial HTML | **PASS** |
| **Hidden File Blocking** | Deny access to sensitive files | `/.env`, `/.git/config`, `compose.yaml`, `.map` return `404 Not Found` | **PASS** |
| **Payment Integrity** | HMAC-SHA256 signatures | Fake signatures rejected; expired timestamps (> 300s) rejected | **PASS** |
| **Password Hashing** | Cryptographic work factor | BCrypt strength 12 enforced on all administrative accounts | **PASS** |

---

## 2. Sensitive Data Scan Results

- Scanned public health (`/api/v1/health`), public programmes (`/api/v1/public/donations/programmes`), and homepage HTML:
  - `JWT_SECRET`: Zero occurrences.
  - `CASHFREE_CLIENT_SECRET`: Zero occurrences.
  - `POSTGRES_PASSWORD`: Zero occurrences.
- Private donor PII (PAN, residential addresses, phone numbers) are masked from public listings and only accessible to authenticated administrators with designated roles (`ROLE_FINANCE_OFFICER`, `ROLE_ADMIN`).

