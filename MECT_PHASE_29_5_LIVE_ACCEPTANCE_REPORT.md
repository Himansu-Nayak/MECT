# MECT PHASE 29.5 — LIVE ACCEPTANCE REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS:** `200.97.161.128` (Hostname: `srv2000528`)  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Status:** **BLOCKED / PENDING DEPLOYMENT — COMPREHENSIVE ACCEPTANCE PROTOCOL SPECIFIED**

---

## 1. Acceptance Status Overview

Because production deployment execution is held at the Authorization Gate (pending owner SSH private key registration and explicit deployment scheduling), live acceptance testing against the live production URL (`https://mect.org.in/`) for release `6a9de87` **cannot be conducted until deployment occurs**.

In strict accordance with Phase 13 and Phase 14 guidelines (*"Never claim deployment success without verifying the live release"*), this report is marked **BLOCKED / PENDING DEPLOYMENT**.

The complete 18-point post-deployment acceptance protocol is detailed below, pre-approved and ready for immediate execution once deployment completes.

---

## 2. 18-Point Live Acceptance Verification Protocol

Upon deployment completion, the release engineer and project owner will execute the following tests sequentially using dedicated owner-controlled test credentials:

| Test ID | Test Category | Verification Step | Expected Outcome | Execution Status |
| :--- | :--- | :--- | :--- | :--- |
| **LAT-01** | **Infrastructure** | Query `https://mect.org.in/actuator/health` | HTTP `200 OK`, `{"status":"UP"}` | PENDING DEPLOYMENT |
| **LAT-02** | **Infrastructure** | Query `https://mect.org.in/` (Homepage) | HTTP `200 OK`, Next.js 16.1.1 prerendered HTML | PENDING DEPLOYMENT |
| **LAT-03** | **TLS / SSL** | Inspect TLS certificate on `mect.org.in` | Valid Let's Encrypt certificate, TLS 1.3 | PENDING DEPLOYMENT |
| **LAT-04** | **Static Assets** | Verify CDN and static images / fonts | All fonts, logos, and hero images load with HTTP 200 | PENDING DEPLOYMENT |
| **LAT-05** | **Auth - UI** | Navigate to `https://mect.org.in/login` | Dual-channel login tab visible ("Mobile SMS" & "Email OTP") | PENDING DEPLOYMENT |
| **LAT-06** | **Auth - Mobile OTP**| Request OTP for owner test phone (`+91XXXXXXXXXX`) | OTP sent via SMS, 60s cooldown timer begins, HTTP 200 | PENDING DEPLOYMENT |
| **LAT-07** | **Auth - Email OTP** | Request OTP for owner test email (`owner@mect.org.in`) | OTP dispatched via Resend, countdown active | PENDING DEPLOYMENT (Req. `RESEND_API_KEY`) |
| **LAT-08** | **Auth - Negative** | Enter incorrect OTP on `/login` | HTTP 400, "Invalid verification code", attempt count decrements | PENDING DEPLOYMENT |
| **LAT-09** | **Auth - Negative** | Enter expired OTP (>600 seconds) | HTTP 400, "Verification code expired" | PENDING DEPLOYMENT |
| **LAT-10** | **Auth - Positive** | Enter valid OTP for owner test identity | JWT access cookie set (HttpOnly, Secure, SameSite=Lax), redirects to `/portal` | PENDING DEPLOYMENT |
| **LAT-11** | **Donor Portal** | Verify donor dashboard (`/portal`) | Profile loads with correct phone/email, donation history table renders | PENDING DEPLOYMENT |
| **LAT-12** | **Donation Flow** | Navigate to `/donate` | Unified donation experience loads with preset amounts and cause selector | PENDING DEPLOYMENT |
| **LAT-13** | **Donation Auth** | Initiate donation with email/phone | OTP modal appears, verification links donor without page reload | PENDING DEPLOYMENT |
| **LAT-14** | **Payment Modal** | Trigger Cashfree/Razorpay checkout | Modal opens in test mode, order ID generated | PENDING DEPLOYMENT |
| **LAT-15** | **Manual SBI UTR** | Submit test UTR claim (`/donate/sbi-utr`) | Status set to `PENDING_VERIFICATION`, no receipt issued prematurely | PENDING DEPLOYMENT |
| **LAT-16** | **Receipt Download**| Download historical receipt PDF in portal | PDF downloads cleanly, displays statutory disclaimer, valid SHA-256 | PENDING DEPLOYMENT |
| **LAT-17** | **Public Content** | Inspect `/programmes`, `/governance`, `/about` | All statutory disclosures, trustee lists, and CSR-1 references intact | PENDING DEPLOYMENT |
| **LAT-18** | **Log Inspection** | Inspect `docker logs mect-backend` | Zero plain-text OTPs, zero leaked JWT secrets, zero stack traces | PENDING DEPLOYMENT |

---

## 3. Pre-Deployment Staging & Local Rehearsal Evidence

While live acceptance is pending, the equivalent scenarios were rigorously validated locally during Phase 29.5:

- **Typecheck & Linter:** 0 errors across all frontend routes (`npm run typecheck`, `npm run lint`).
- **Production Build:** All 51 Next.js routes compiled and prerendered cleanly (`npm run build`).
- **Backend Test Suite:** 127/127 tests passed cleanly (`mvn test`), including all OTP controllers, JWT filters, payment services, and receipt PDF rendering.

---

## 4. Operational Safety Constraints for Live Acceptance

During the live acceptance phase, the following rules apply:
1. **No Real Donor Interruption:** Test OTPs must only be delivered to designated test email and phone numbers owned by the trust administration.
2. **No Real Financial Charges:** Live payment gateways must remain in sandbox/test mode or use simulated minimal test transfers.
3. **Log Safeguards:** Log monitoring must confirm that OTP codes are masked (`[OTP_REQUESTED: PHONE]`) and never written to container logs.

---

## 5. Report Verdict

**Verdict: BLOCKED — PENDING DEPLOYMENT EXECUTION & OWNER LIVE VERIFICATION**
