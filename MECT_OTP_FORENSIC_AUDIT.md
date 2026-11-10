# MECT OTP Authentication — Forensic Audit & Repair Report

**Audit Date:** 2026-11-11
**Scope:** Full-stack trace from `/portal/login` UI -> `src/lib/portal-api.ts` -> `PortalAuthController` -> `OtpAuthService` -> `ResendEmailService` -> PostgreSQL `otp_verifications` -> `GlobalExceptionHandler` -> Frontend banner rendering.

---

## 1. Root Cause Analysis
1. **Why the UI displayed only `"RESEND"`:**
   - When the running Spring Boot backend lacked `RESEND_API_KEY` in `backend/.env` / OS environment (`emailProvider.isConfigured() == false`), [`OtpAuthService.requestOtp`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java) threw `ProviderUnconfiguredException("RESEND", ...)`.
   - [`GlobalExceptionHandler.handleProviderUnconfigured`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/exception/GlobalExceptionHandler.java) serialized `List.of(ex.getProvider())` (`["RESEND"]`) into `ApiErrorResponse.validationErrors`.
   - [`parseErrorMessage`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/lib/portal-api.ts) prioritized `err.validationErrors[0]` over `err.message`, causing the UI red alert banner to show literally just the string `"RESEND"` (and for unconfigured Phone OTP, `"NONE"`).
2. **Primary Missing Environment Configuration:**
   - Verified `backend/.env` and Windows user/machine/process environment variables contain **no** `RESEND_API_KEY`.
   - Application defaults in [`application.yml`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/resources/application.yml) keep `RESEND_API_KEY` empty (`app.resend.api-key: ${RESEND_API_KEY:}`), and sender defaults to `MECT Notifications <notifications@mect.org.in>`.
3. **Additional Defects Discovered & Repaired Along the Trace:**
   - **Pre-check DB mutation bug:** `OtpAuthService.requestOtp` previously invalidated prior OTPs and inserted a new row into `otp_verifications` *before* verifying `emailProvider.isConfigured()` / `smsProvider.isConfigured()`.
   - **Unhandled dispatch failure (`500`):** If `ResendEmailService` returned a non-`SENT` dispatch result, `OtpAuthService` threw `IllegalStateException`, falling through to HTTP `500` instead of a clean `503` rollback.
   - **Public message leak:** Previously exposed internal env variable naming (`RESEND_API_KEY` / `SMS_PROVIDER=TWILIO`) inside public `503` JSON bodies.
   - **UTF-8 charset omission & error granularity:** Fixed `MessageDigest.isEqual` byte conversion in `verifyOtpRecordOrThrow` to explicitly use `StandardCharsets.UTF_8`, and added distinct clear messages for expired, already-used, attempt-locked, and incorrect OTP codes.
   - **Tab input persistence:** Switching between `Email OTP` and `Phone SMS OTP` in [`src/app/portal/login/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/portal/login/page.tsx) left the previous email value in the input box.

---

## 2. Changes Made
1. **Backend Exception & Status Handling:**
   - Created [`ProviderDispatchException`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/exception/ProviderDispatchException.java) for Resend/SMS runtime dispatch failures.
   - Updated [`GlobalExceptionHandler`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/exception/GlobalExceptionHandler.java): cleared `validationErrors` (`List.of()`) on `503` responses so internal provider codes never appear in UI banners; added `handleProviderDispatch` (`503 Service Temporarily Unavailable`); kept technical details strictly in server logs.
2. **Backend OTP Orchestration ([`OtpAuthService`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java)):**
   - Moved `isConfigured()` checks before any `otp_verifications` write so unconfigured providers never leave orphan OTP rows or trigger cooldown lockouts.
   - Replaced `IllegalStateException` on failed external dispatch with `ProviderDispatchException` (rolling back the unsent OTP row cleanly).
   - Replaced public internal config details with sanitized user-friendly messages; kept detailed failure diagnostics (`RESEND_API_KEY missing`, `dispatch.errorMessage()`) in `log.error(...)` / `log.warn(...)`.
   - Used `StandardCharsets.UTF_8` in `MessageDigest.isEqual` and distinguished expired vs already-used vs incorrect OTP error messages cleanly.
3. **Resend Client Hardening ([`ResendEmailService`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java)):**
   - Added HTTP connect (`5s`) and read (`10s`) timeouts via `SimpleClientHttpRequestFactory` and `User-Agent: MECT-Portal-Backend/1.0`.
   - Caught `RestClientResponseException` explicitly to classify Resend status codes (`401` `RESEND_INVALID_API_KEY`, `403` `RESEND_DOMAIN_OR_ACCESS_RESTRICTED`, `422` `RESEND_UNPROCESSABLE_SENDER_OR_PAYLOAD`, `429` `RESEND_RATE_LIMITED`) in server logs without leaking headers/secrets.
4. **Frontend Error Handling & UX ([`src/lib/portal-api.ts`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/lib/portal-api.ts), [`src/app/portal/login/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/portal/login/page.tsx)):**
   - Guarded `parseErrorMessage` against raw internal provider codes (`RESEND`, `NONE`, `TWILIO`, `MSG91`, `RAZORPAY`, `META_CLOUD`), restricted `validationErrors[0]` extraction to `400` validation failures, and added clean `503` / network-unreachable messages.
   - Added `noValidate` + consistent inline error (`Your email address is invalid.`), friendly Phone SMS unavailable feedback, and `setTarget("")` reset on channel tab switch.
5. **Automated Regression Coverage ([`PortalAuthAndOtpSecurityTests`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/test/java/org/mahavirtrust/backend/PortalAuthAndOtpSecurityTests.java)):**
   - Added `testUnconfiguredResendAndDispatchFailureReturnSanitizedMessagesWithNoOrphanOtp` asserting `503`, empty `validationErrors`, zero secret/env key leakage, zero orphan DB rows, and explicit expired-OTP message verification.

---

## 3. Resend API Response Category & OTP Security Audit
- **Live Key & Domain Verification Result:**
  - `GET https://api.resend.com/domains` -> `HTTP 401` (key is scoped strictly to **Sending access**, not domain administration—this is best-practice least privilege).
  - Direct probe `POST https://api.resend.com/emails` (`from: MECT Notifications <notifications@mect.org.in>`, `to: delivered@resend.dev`) -> **`HTTP 200 OK`**, accepted with Resend `id: "01a1c6dd-1459-7887-a10a-20106e6f25bc"`.
  - Live backend `/api/v1/portal/auth/request-otp` dispatch (`ResendEmailService`) -> **`HTTP 200 OK`**, `Resend email dispatched successfully (messageId=01a1c6de-2ed5-77b1-8634-8f0aade97a89)`, paired with audit log `OTP_DISPATCHED`.
- **OTP Security Checklist Verified:**
  - `SecureRandom` 6-digit code generation (`%06d`).
  - HMAC-SHA256 hashed via `HmacCryptoUtil.hmacSha256Hex(otpPepper, channel|purpose|target|code)` prior to PostgreSQL storage (`otp_hash` length `64`, plaintext never persisted or returned in HTTP responses).
  - Constant-time `MessageDigest.isEqual(..., UTF_8)` verification, `600s` UTC expiry, `60s` resend cooldown, `5` attempt limit before lockout, single-use `used_at` invalidation + invalidation of prior unused OTPs on re-request, 15-minute sliding rate cap (`>= 5` requests).
  - Resend HTTP call executes strictly server-side via Spring `RestClient` (`Bearer` header never exposed to browser).
- **Phone SMS OTP Distinction:** Intentionally isolated via `SmsProvider` (`ConfigurableSmsService`, `SMS_PROVIDER=NONE`). Never spoofs SMS through Resend; returns `"SMS verification is currently unavailable. Please use Email OTP to sign in."`.

---

## 4. Tests Executed
1. `cd backend && mvn test -B`: **Passed** (`Tests run: 44, Failures: 0, Errors: 0, Skipped: 0`, H2 PostgreSQL mode with mocked `EmailProvider`/`SmsProvider`).
2. Direct & Backend Live Resend API Verification (`delivered@resend.dev`):
   - Before setting `RESEND_API_KEY`: Backend returned `HTTP 503` with `validationErrors: []` and UI showed `"Email service is temporarily unavailable. Please try again shortly."` (confirmed `"RESEND"` error banner eliminated).
   - After configuring `RESEND_API_KEY` and `RESEND_FROM_NOTIFICATIONS` in gitignored `backend/.env` and restarting Spring Boot (`task-3713`):
     - UI click on `/portal/login` with `delivered@resend.dev` returned **`HTTP 200 OK`**, backend logged `Resend email dispatched successfully (messageId=01a1c6de-2ed5-77b1-8634-8f0aade97a89)`, and UI switched to `Enter 6-Digit Verification Code` displaying `"Verification code sent successfully. Please check your inbox."` and the 60s resend timer.
     - Immediate re-request blocked with `HTTP 429` (`"Please wait ... seconds before requesting another verification code."`).
     - Incorrect OTP entry (`000000`) rejected with `HTTP 401` and UI banner `"Incorrect verification code. Please check the 6-digit code and try again."`.
     - Invalid email rejected client-side with `"Your email address is invalid."`.
     - Phone SMS OTP request rejected cleanly (`HTTP 503`) with `"SMS verification is currently unavailable. Please use Email OTP to sign in."`.
3. Final frontend `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `node scratch/test-all-phases-regression.mjs`: All passed (`36/36` routes built; `16/16` phase suites passed).

---

## 5. Actual Email Delivery Result & Remaining Actions
- **Actual Live Resend Delivery Result:** **VERIFIED WORKING (`HTTP 200 OK`)** from `MECT Notifications <notifications@mect.org.in>` against Resend's live `/emails` endpoint (`messageId=01a1c6de-2ed5-77b1-8634-8f0aade97a89` via Spring Boot backend to Resend's official sink `delivered@resend.dev`). Human inbox read-back of a live 6-digit OTP to complete step-2 login in browser can now be performed immediately at `http://localhost:3000/portal/login` using your own email address.
- **Remaining Operational / Security Recommendations:**
  1. **Phone SMS OTP (`SMS_PROVIDER`):** Remains disabled (`NONE`) by design until Twilio or MSG91 credentials are supplied in `backend/.env`.
  2. **Key Rotation Before Production Deployment:** Since the Resend key was shared in chat during debugging, rotate/re-issue the key in the Resend dashboard when deploying to the live Hostinger VPS and set it solely via untracked production environment variables.

