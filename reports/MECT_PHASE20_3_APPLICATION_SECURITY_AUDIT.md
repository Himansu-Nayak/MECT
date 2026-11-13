# MECT PHASE 20.3 — APPLICATION & API SECURITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production Stack:** Next.js 16 (Node 22) + Spring Boot 3 (Java 21) + PostgreSQL 18.7  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:55:00Z (UTC)  
**Lead Auditor:** Senior Application Security Engineer & DevSecOps Lead  
**Status:** PASS — OWASP TOP 10 MITIGATIONS IMPLEMENTED  

---

## 1. Security Architecture & Policy Matrix

| Security Domain | Control Mechanism | Implementation Details | Verdict |
|---|---|---|---|
| **A01: Broken Access Control** | Spring Security 6 RBAC + Next.js Route Guards | Protected paths enforce `hasAnyRole()`; unauthenticated calls return 401; insufficient privileges return 403. | **PASS** |
| **A02: Cryptographic Failures** | TLS 1.3 + BCrypt 12 + HMAC-SHA256 | Strict HTTPS enforced via Cloudflare Full (Strict); BCrypt work factor 12 for password hashes; JWT signed with 256-bit secret. | **PASS** |
| **A03: Injection** | Spring Data JPA Parameterized Queries | Hibernate entity mapping and typed criteria eliminate raw SQL concatenations across all 29 tables. | **PASS** |
| **A04: Insecure Design** | Idempotency & Unique Constraints | Duplicate UTR submissions blocked via database unique index; checkout expiry jobs automatically expire abandoned sessions. | **PASS** |
| **A05: Security Misconfiguration** | Hardened Nginx & Non-Root Containers | Docker containers run as UID 1001 (`nextjs`, `mect`); loopback-only port bindings (3001, 8081, 5433); directory browsing disabled. | **PASS** |
| **A06: Vulnerable Components** | Minimal Alpine Runtime Images | Eclipse Temurin 21 JRE Alpine (136 MB) and Node 22 Alpine (83.7 MB) with 0 unpatched critical CVEs. | **PASS** |
| **A07: Identification & Auth** | OTP Rate Limiting & Cooldown | OTPs expire in 600s, max 5 attempts, 60s resend cooldown; peppered SHA-256 OTP storage. | **PASS** |
| **A08: Software & Data Integrity** | Webhook HMAC Signatures | Cashfree webhooks validate HMAC-SHA256 signature and reject timestamps older than 300s (replay protection). | **PASS** |
| **A09: Logging & Monitoring** | Audit Logs & Exception Masking | `GlobalExceptionHandler` masks internal stack traces from API responses; audit trail recorded in `audit_logs` and `payment_reconciliation_logs`. | **PASS** |
| **A10: SSRF** | Restricted Public Fetching | Application does not accept untrusted external URLs for server-side fetches. | **PASS** |

---

## 2. Webhook Replay & Signature Security Verification

1. **HMAC-SHA256 Verification:** Tested in Phase 20.1 and re-verified. Sending POST requests to `/api/v1/public/donations/cashfree-webhook` with fake signatures (`INVALID_FAKE_SIGNATURE`) triggers immediate rejection.
2. **Replay Window Enforcement:** Webhook timestamps with a delta greater than 300 seconds are rejected by the backend verification filter, preventing captured packet replays.

---

## 3. Rate Limiting Architecture

- **Filter:** `RateLimitingFilter.java` placed before `UsernamePasswordAuthenticationFilter`.
- **Algorithm:** In-memory token-bucket rate limiter tracking client IP addresses.
- **Protected Endpoints:** Public intake endpoints (contact forms, volunteer applications, OTP requests) are throttled to prevent automated volumetric abuse and denial-of-service attempts.

