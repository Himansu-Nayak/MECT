# MECT PHASE 3.3 — PRODUCTION DISCREPANCY & ENDPOINT REGISTER

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Date:** 2026-11-28  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Target VPS:** Hostinger KVM 4 (`200.97.161.128`)  
**Audit Scope:** Complete Forensic Backend Endpoint Inventory & Manual Failure Analysis  
**Status:** **`100% AUDITED & REMEDIATED`**

---

## 1. Executive Summary & Forensic Audit Methodology

During Phase 3.2 and Phase 3.3, a comprehensive forensic audit of all backend Spring Boot endpoints and Next.js frontend API route handlers was executed. The objective was to uncover why manual API testing by the trust administration encountered errors despite earlier automated unit tests passing.

### Core Forensic Findings:
1. **Contract Asymmetry Between Frontend & Flyway Schema:** Automated unit tests utilized mock data matching canonical database codes (`GENERAL_FUND`, `EDUCATION_LEARNING`), whereas manual frontend testing submitted shortened codes (`GENERAL`, `EDUCATION`). This triggered `400 Bad Request` ("Selected donation programme is unavailable or inactive").
2. **Strict Deserialization on Incomplete Payloads:** Request records in Java Spring Boot expected non-null parameters or primitive types. When manual curl probes or external HTTP clients omitted optional flags (`anonymous`, `communicationConsent`, `paymentMethod`), Jackson 3 threw a `HttpMessageNotReadableException` (400 Bad Request).
3. **Overly Restrictive Guest Remittance Guard:** `DonationController.submitSbiUtrClaim` previously enforced `if (portalUserId == null) return 401 Unauthorized;` blocking guest donors from claiming direct SBI/UPI remittances without signing in first.
4. **Timezone Delta in Transfer Date Validation:** Strict date validation rejected transfers made in IST timezone when validated against UTC server time if the client sent the current calendar day while the server was hours behind.

---

## 2. Complete Backend Endpoint Inventory & Contract Specification

### 2.1 Public & Informational Endpoints

| Endpoint Route | Method | Auth Req. | Request DTO / Parameters | Required Headers | Expected Response | Observed / Historical Failure | Root Cause | Severity | Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `/api/v1/health` | GET | None | None | None | `{"status":"UP"}` | HTTP 200 OK | None | None | Verified operational. |
| `/api/v1/actuator/health` | GET | None | None | None | `{"status":"UP","groups":[...]}` | HTTP 200 OK | None | None | Actuator health groups exposed cleanly. |
| `/api/v1/public/donations/config` | GET | None | None | None | Combined map of programmes, gateway status & config | HTTP 200 OK | None | Low | Centralized public configuration provider. |
| `/api/v1/public/donations/programmes` | GET | None | None | None | List of active donation programmes | HTTP 200 OK | None | Low | Returns active programmes with canonical codes. |
| `/api/v1/public/donations/gateway-status` | GET | None | None | None | Cashfree & payment provider flags | HTTP 200 OK | None | Low | Reflects live gateway configuration. |
| `/api/v1/public/documents` | GET | None | None | None | Published public governance documents | HTTP 200 OK | None | Low | Serves statutory governance library metadata. |
| `/api/v1/public/inquiries` | POST | None | `PublicInquiryRequest` (fullName, email, phone, category, message) | `Content-Type: application/json` | HTTP 201 Created | HTTP 400 when category casing mismatched | Strict enum parsing | Medium | Casing normalization applied; Next.js loopback proxy configured. |
| `/api/v1/public/volunteers` | POST | None | `VolunteerRegistrationRequest` (fullName, email, phone, roleInterest, availability, consentDeclared) | `Content-Type: application/json` | HTTP 201 Created | HTTP 201 Created | None | Low | Verified persistence into `volunteer_registry`. |

---

### 2.2 Authentication & Identity Endpoints

| Endpoint Route | Method | Auth Req. | Request DTO / Parameters | Required Headers | Expected Response | Observed / Historical Failure | Root Cause | Severity | Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `/api/v1/portal/auth/request-otp` | POST | None | `OtpRequestPayload` (channel: PHONE/EMAIL, target, purpose) | `Content-Type: application/json` | HTTP 200 OK `{"message":"OTP dispatched"}` | HTTP 429 Too Many Requests | Rate limiting trigger on rapid retries | Medium | 60-second cooldown enforced; rate limiter calibrated. |
| `/api/v1/portal/auth/verify-otp` | POST | None | `OtpVerifyPayload` (channel, target, otpCode, purpose, fullName, city) | `Content-Type: application/json` | HTTP 200 OK with `PortalAuthResponse` (JWT accessToken, refreshToken) | HTTP 400 Invalid OTP | Expired or single-use OTP reuse | High | Clear error diagnostics returned; secure 6-digit hashing. |
| `/api/v1/portal/auth/google` | POST | None | `GoogleAuthPayload` (idToken) | `Content-Type: application/json` | HTTP 200 OK with `PortalAuthResponse` | HTTP 400 Unverified Google Token | Invalid audience or unconfigured Client ID in staging | High | Validates Google OIDC signature against Google certs. |
| `/api/v1/portal/auth/refresh` | POST | None | `TokenRefreshRequest` (refreshToken) | `Content-Type: application/json` | HTTP 200 OK with refreshed JWT | HTTP 401 Invalid Refresh Token | Revoked session or token expiry | Medium | Issues fresh short-lived access token. |
| `/api/v1/portal/auth/logout` | POST | `ROLE_DONOR` / `ROLE_GENERAL_USER` | None | `Authorization: Bearer <JWT>` | HTTP 200 OK | HTTP 401 if token expired | Client-side token discard | Low | Session revoked in Redis/DB; clean logout message returned. |
| `/api/v1/auth/login` (Admin) | POST | None | `AdminLoginRequest` (username, password) | `Content-Type: application/json` | HTTP 200 OK with Admin JWT | HTTP 401 Bad Credentials | Tested `superadmin` in prod when prod had `admin@mect.org.in` | High | Documented exact admin credentials in runbook; BCrypt hash verified. |

---

### 2.3 Donor Portal Endpoints

| Endpoint Route | Method | Auth Req. | Request DTO / Parameters | Required Headers | Expected Response | Observed / Historical Failure | Root Cause | Severity | Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `/api/v1/portal/me/dashboard` | GET | `ROLE_DONOR` / `ROLE_GENERAL_USER` | None | `Authorization: Bearer <JWT>` | HTTP 200 OK (donations, profile, stats) | HTTP 401 if header omitted | Missing bearer token | Medium | Returns comprehensive donor history and receipts summary. |
| `/api/v1/portal/me/profile` | GET | `ROLE_DONOR` / `ROLE_GENERAL_USER` | None | `Authorization: Bearer <JWT>` | HTTP 200 OK (donor personal details) | HTTP 200 OK | None | Low | Verified profile loading. |
| `/api/v1/portal/me/profile` | PUT | `ROLE_DONOR` / `ROLE_GENERAL_USER` | `UpdatePortalProfileRequest` | `Authorization: Bearer <JWT>` | HTTP 200 OK | HTTP 200 OK | None | Low | Updates profile; triggers `PROFILE_UPDATED` email notice. |
| `/api/v1/portal/receipts/{receiptNo}/pdf` | GET | `ROLE_DONOR` / `ROLE_GENERAL_USER` | Path variable `receiptNo` | `Authorization: Bearer <JWT>` | HTTP 200 OK `application/pdf` | HTTP 403 Forbidden | User requesting receipt belonging to another donor | High | Enforced tenant isolation: verifies `portalUserId == receipt.userId`. |

---

### 2.4 Payment & Unified Remittance Endpoints

| Endpoint Route | Method | Auth Req. | Request DTO / Parameters | Required Headers | Expected Response | Observed / Historical Failure | Root Cause | Severity | Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `/api/v1/public/donations/initiate` | POST | Optional (Guest or Authenticated) | `InitiateDonationRequest` (programmeCode, amount, donorName, email, phone, paymentMethod) | `Content-Type: application/json` | HTTP 201 Created with orderId, session token | HTTP 400 "Inactive programme" or invalid paymentMethod | Shortened programme code or paymentMethod casing | Critical | **Resolved:** Added alias normalization and compact constructor default fallbacks. |
| `/api/v1/payments/cashfree/create-order` | POST | Optional | `InitiateDonationRequest` | `Content-Type: application/json` | HTTP 201 Created with Cashfree paymentSessionId | HTTP 400 JSON parse error | Deserialization on omitted boolean fields | Critical | **Resolved:** Compact constructor defaults `anonymous=false`, `paymentMethod=GATEWAY_CHECKOUT`. |
| `/api/v1/payments/cashfree/status/{orderId}` | GET | None | Path variable `orderId` | None | HTTP 200 OK with verified gateway status | HTTP 200 OK | Optimistic lock race on concurrent webhook | High | **Resolved:** Handled `ObjectOptimisticLockingFailureException` by reading authoritative DB status. |
| `/api/v1/webhooks/cashfree` | POST | None | Raw Cashfree webhook payload | `x-webhook-signature`, `x-webhook-timestamp` | HTTP 200 OK | HTTP 401 Webhook signature verification failure | Timestamp drift or incorrect webhook secret | Critical | Verified HMAC-SHA256 signature verification with tolerance window. |
| `/api/v1/public/donations/sbi/submit-utr` | POST | Optional | `SubmitManualSbiUtrRequest` (programmeCode, amount, donorName, email, phone, utrReference, transferDate) | `Content-Type: application/json` | HTTP 201 Created with `claimReference` | HTTP 401 Unauthorized for guests | Hardcoded `portalUserId != null` check | Critical | **Resolved:** Made `portalUserId` optional; guest claims linked by phone/email. |
| `/api/donations/claim` (Next.js Route) | POST | Optional | Unified claim JSON payload | `Content-Type: application/json` | HTTP 200/201 with claimReference | HTTP 400 Future date | Timezone difference (client date > server UTC) | High | **Resolved:** Date validation accepts client calendar day with graceful boundary. |

---

### 2.5 Administrative Endpoints

| Endpoint Route | Method | Auth Req. | Request DTO / Parameters | Required Headers | Expected Response | Observed / Historical Failure | Root Cause | Severity | Remediation |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `/api/v1/admin/donations/summary` | GET | Admin Roles | None | `Authorization: Bearer <AdminJWT>` | HTTP 200 OK with financial sums | HTTP 200 OK | None | Low | Sums successful, pending, and failed totals. |
| `/api/v1/admin/manual-claims` | GET | Admin Roles | Query param `status=ALL/UTR_SUBMITTED` | `Authorization: Bearer <AdminJWT>` | HTTP 200 OK list of remittance claims | HTTP 200 OK | None | Low | Unified queue for both SBI and UPI transfer claims. |
| `/api/v1/admin/manual-claims/{ref}/review` | POST | Admin Roles | `ReviewManualSbiClaimRequest` (decision: VERIFIED/REJECTED, bankStatementReference, notes) | `Authorization: Bearer <AdminJWT>` | HTTP 200 OK with verified claim | HTTP 400 on duplicate verification | Double-spending prevention guard | High | Verified state transition locks: only `UTR_SUBMITTED` can be verified. Generates PDF receipt upon approval. |
| `/api/v1/admin/outbox` | GET | Admin Roles | Page parameters | `Authorization: Bearer <AdminJWT>` | HTTP 200 OK page of outbox events | HTTP 200 OK | None | Low | Displays email & notification dispatch logs. |
| `/api/v1/admin/outbox/{id}/retry` | POST | Admin Roles | Path variable `id` | `Authorization: Bearer <AdminJWT>` | HTTP 200 OK with retry dispatch result | HTTP 200 OK | None | Medium | Allows manual re-trigger of failed transactional outbox events. |

---

## 3. Discrepancy Analysis: Automated Tests vs. Manual Testing

| Automated Test Assumption | Manual Testing Reality | Engineering Resolution |
| :--- | :--- | :--- |
| Tests always supplied canonical codes (`GENERAL_FUND`). | Humans selected UI pills sending shortened names (`GENERAL`). | Added `resolveActiveProgramme()` in `DonationLifecycleService` mapping all aliases. |
| Tests always passed complete JSON payloads. | Manual curl calls omitted optional fields like `anonymous`. | Added compact constructors in Record DTOs supplying smart defaults. |
| Tests executed inside an authenticated mock session. | Donors contributed as unauthenticated public guests. | Made authentication optional in `DonationController` for both donations and UTR claims. |
| Tests checked HTTP 200 without checking DB row insertion. | Production requires verified PostgreSQL ledger entries. | Verified that claims insert rows into `manual_bank_transfer_claims` and donations insert into `donations`. |
