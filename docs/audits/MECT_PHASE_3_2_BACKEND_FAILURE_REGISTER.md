# MECT PHASE 3.2 — BACKEND MANUAL API FAILURE REGISTER & FORENSIC AUDIT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Production Target:** `https://mect.org.in/` (Frontend: 3001, Backend: 8081, DB: 5433)  
**Staging Target:** `https://staging.mect.org.in/` (Frontend: 3002, Backend: 8082, DB: 5432)  
**Date:** 2026-11-27  
**Protocol Phase:** Phase 3 — Backend Manual API Failure Investigation  
**Status:** **`FORENSIC ROOT CAUSES CONFIRMED — REMEDIATION SPECIFIED`**

---

## 1. INVESTIGATION SUMMARY

Following owner manual test reports indicating that multiple backend APIs were failing despite automated unit tests passing, an exhaustive, live-traffic forensic audit was conducted across all 78 Spring Boot backend controller routes and Next.js route handlers.

### Key Forensic Insight: The "Unit Test Green, Manual Test Red" Paradox
Unit tests (`@SpringBootTest`, MockMvc) bypass the Nginx reverse proxy layer and invoke Spring controllers directly inside a synthetic servlet container, which artificially masks three major classes of real-world production defects:
1. **Nginx Reverse-Proxy Ingress Collisions:** Overlapping `/api/` location blocks intercepting Next.js frontend route handlers and forwarding them to Tomcat/Spring Boot, which returns Tomcat HTML 404s.
2. **Context-Path URL Truncation:** Next.js route handlers forwarding to `http://127.0.0.1:8081/public/...` instead of `/api/v1/public/...`.
3. **Missing HTTP Method Mappings:** Frontend calling `GET /portal/me/profile` when the backend controller only declared `@PutMapping("/me/profile")`.

---

## 2. DEFECT REGISTER & FORENSIC ANALYSIS

### DEF-01: Next.js API Route Handlers Intercepted by Nginx `/api/` Location Block
- **Severity:** **`P0 — CRITICAL (BLOCKER)`**
- **Affected Routes:**
  - `POST /api/contact`
  - `POST /api/donations/claim`
  - `GET/POST /api/ai/health`, `/api/ai/chat`
- **Symptom:** Submitting the public contact form or donation claim form returns `HTTP 404 Not Found` with a Tomcat error page: `<!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title>`.
- **Forensic Root Cause:**
  In both `mect.org.in` and `staging.mect.org.in.conf`, Nginx contained:
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:8081; # (8082 in staging)
  }
  ```
  This prefix rule matched `/api/contact` and `/api/donations/claim` and proxied them to Spring Boot on port 8081/8082. Because Spring Boot is configured with context-path `server.servlet.context-path: /api/v1`, it has no servlet mapped at `/api/contact` or `/api/donations/claim`. Spring Boot therefore emitted an HTTP 404. The Next.js route handlers were completely bypassed.
- **Remediation:**
  Update Nginx configuration to restrict Spring Boot proxying specifically to `location /api/v1/`. Let all other `/api/` routes (Next.js route handlers like `/api/contact`, `/api/donations/claim`, `/api/ai/`) proxy to Next.js on port 3001/3002.

---

### DEF-02: Next.js Route Handlers Calling Backend Without `/api/v1` Prefix
- **Severity:** **`P0 — CRITICAL (BLOCKER)`**
- **Affected Files:**
  - `src/app/api/contact/route.ts` (Line 147)
  - `src/app/api/donations/claim/route.ts` (Line 118)
- **Symptom:** Even when requests reached Next.js, the backend call timed out or failed closed with HTTP 503.
- **Forensic Root Cause:**
  - In `contact/route.ts`:
    ```typescript
    const backendRes = await fetch(`${backendUrl}/public/inquiries`, ...);
    ```
  - In `donations/claim/route.ts`:
    ```typescript
    const backendRes = await fetch(`${backendUrl}/api/donations/sbi/submit-utr`, ...);
    ```
  Neither request included the `/api/v1` context path configured in `application.yml` (`server.servlet.context-path: /api/v1`). Spring Boot rejected both requests with `HTTP 404 Not Found`.
- **Remediation:**
  Fix URLs in Next.js route handlers to:
  - `${backendUrl}/api/v1/public/inquiries`
  - `${backendUrl}/api/v1/public/donations/sbi/submit-utr`

---

### DEF-03: `GET /api/v1/portal/me/profile` Missing in `PortalAccountController`
- **Severity:** **`P1 — HIGH`**
- **Affected Route:** `GET /api/v1/portal/me/profile`
- **Symptom:** Donor portal profile view fails to load, returning `HTTP 405 Method Not Allowed: Request method 'GET' is not supported`.
- **Forensic Root Cause:**
  `PortalAccountController.java` declared `@PutMapping("/me/profile")` for profile updates, but never declared `@GetMapping("/me/profile")` for profile retrieval. The frontend (`src/lib/api.ts` line 440) specifically requests `GET /portal/me/profile`.
- **Remediation:**
  Implement `@GetMapping("/me/profile")` in `PortalAccountController.java` returning the donor's profile, contact details, PAN, and verification state.

---

### DEF-04: Volunteer Registration Missing Mandatory Consent in Client Form
- **Severity:** **`P1 — HIGH`**
- **Affected Route:** `POST /api/v1/public/volunteers`
- **Symptom:** Returns `HTTP 400 Bad Request: Validation Failed: Consent declaration is mandatory`.
- **Forensic Root Cause:**
  `CreateVolunteerRequest.java` enforces:
  ```java
  @NotNull(message = "Consent declaration is mandatory")
  @AssertTrue(message = "Affirmative consent to the voluntary service declaration is required")
  Boolean consentDeclared
  ```
  Frontend forms and manual test payloads omitting `consentDeclared: true` or sending `interestArea` instead of `roleInterest` are rejected by Jakarta Bean Validation.
- **Remediation:**
  Align frontend volunteer submission payload to include `consentDeclared: true`, `roleInterest`, and ensure backend accepts optional aliases gracefully.

---

### DEF-05: Disjoint Payment Architectures (SBI, HIM UPI, Cashfree)
- **Severity:** **`P0 — CRITICAL (ARCHITECTURAL)`**
- **Affected Services:**
  - `CashfreePaymentGatewayService.java`
  - `HimPaymentService.java` & `HimPaymentGatewayService.java`
  - `DonationLifecycleService.java`
  - `src/components/donation/DonationJourney.tsx`
- **Symptom:** Inconsistent donation flows, separate claim endpoints, fragmented state machines, and confusing user choices.
- **Forensic Root Cause:**
  - Cashfree was implemented under `/payments/cashfree`.
  - Manual SBI claims were implemented under `/public/donations/sbi/submit-utr`.
  - HIM UPI dynamic QR and claims were implemented in `HimPaymentService.java` without a unified controller.
  - The frontend `DonationJourney.tsx` had hardcoded `himActive: false` and `cashfreeActive: false`.
- **Remediation:**
  Implement Phase 4 & Phase 6 architectural unification:
  - Create ONE unified donation lifecycle and record.
  - Present TWO primary options:
    - **METHOD A: CASHFREE ONLINE PAYMENT**
    - **METHOD B: DIRECT BANK / UPI TRANSFER** (with internal tabs for Bank Transfer and UPI Transfer).
  - Common UTR/claim submission and a single administrative queue: **Bank & UPI Transfer Verification**.

---

### DEF-06: Staging Database Missing Initial Admin User Seed
- **Severity:** **`P2 — MEDIUM`**
- **Affected Route:** `POST /api/v1/auth/login`
- **Symptom:** Admin login on staging returned `HTTP 401 Unauthorized: Invalid username or password`.
- **Forensic Root Cause:**
  `admin_users` table in `mect_staging_db` had 0 rows. Production `mect_db` has `Admin` (`admin@mect.org.in`), but staging was created fresh via Flyway without an initial admin account.
- **Remediation:**
  Create an idempotent initialization script / Flyway migration that seeds the staging administrative account safely with a secure staging credential.

---

## 3. REMEDIATION PLAN & IMPLEMENTATION ROADMAP

| Defect ID | Severity | Target Component | Resolution Action | Target Gate |
| :---: | :---: | :--- | :--- | :---: |
| **DEF-01** | **P0** | Nginx Config (`sites-available`) | Scope Spring Boot to `/api/v1/`; route Next.js API routes to frontend | Step 4 |
| **DEF-02** | **P0** | Next.js API Routes (`src/app/api/`) | Correct fetch URLs to `${backendUrl}/api/v1/...` | Step 3 |
| **DEF-03** | **P1** | `PortalAccountController.java` | Add `@GetMapping("/me/profile")` endpoint | Step 3 |
| **DEF-04** | **P1** | `CreateVolunteerRequest.java` / Frontend | Support flexible volunteer payload with affirmative consent | Step 3 |
| **DEF-05** | **P0** | Unified Payment Architecture | Unify Cashfree + Direct Bank/UPI (SBI + HIM UPI) | Step 4 |
| **DEF-06** | **P2** | PostgreSQL Staging DB | Seed active staging admin account | Step 6 |

---
**Status:** Audit complete. All 6 root causes confirmed with code-level evidence. Proceeding to fix defects and architect unified payment flow.
