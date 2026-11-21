# MECT PHASE 29.5 — AUTHENTICATION SECURITY AUDIT
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Status:** COMPLETE — SECURITY AUDIT PASSED

---

## 1. Executive Summary

This security audit inspects the complete implementation of the dual-channel authentication system (Mobile SMS OTP and Email OTP) introduced across the MECT platform.

The audit encompasses backend controller endpoints, service layer validation, cryptographic hash generators, persistence mechanisms, rate limiters, token issue flows, and frontend customer journeys across `/login`, `/register`, and `/donate`.

Every security gate has been independently verified against source code and comprehensive automated test suites.

---

## 2. Component Architecture & Code Locations

| Component | File Path | Function / Responsibility |
| :--- | :--- | :--- |
| **REST Controller** | [PortalAuthController.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/controller/PortalAuthController.java) | Exposes `/portal/auth/request-otp`, `/verify-otp`, `/refresh`, `/logout`, `/me` |
| **Authentication Service** | [OtpAuthService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java) | OTP generation, cryptographic hashing, expiry, rate limiting, and user linkage |
| **Request DTO** | [OtpRequestPayload.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/dto/portal/OtpRequestPayload.java) | Validates channel (`EMAIL|PHONE`), target value, and purpose |
| **Verify DTO** | [OtpVerifyPayload.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/dto/portal/OtpVerifyPayload.java) | Validates channel, target, 6-digit regex code, and purpose |
| **Email Dispatcher** | [ResendEmailService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java) | Secure HTTP client dispatch to Resend API via `SimpleClientHttpRequestFactory` |
| **Template Renderer** | [EmailTemplateRenderer.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/notification/EmailTemplateRenderer.java) | Renders responsive HTML OTP and security notice emails |
| **Token Provider** | [JwtTokenProvider.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/security/JwtTokenProvider.java) | Generates scoped HMAC-SHA256 JWT access tokens and hashed refresh tokens |
| **Frontend Login** | [src/app/login/page.tsx](file:///<WORKSPACE_DIR>/src/app/login/page.tsx) | Dual-channel login interface with Phone/Email tabs and fallback prompts |
| **Frontend Register** | [src/app/register/page.tsx](file:///<WORKSPACE_DIR>/src/app/register/page.tsx) | Dual-channel registration interface with 80G profile completion |
| **Frontend Donation** | [UnifiedDonationExperience.tsx](file:///<WORKSPACE_DIR>/src/components/sections/UnifiedDonationExperience.tsx) | Step 3 mandatory dual-channel donor authentication |
| **API Client** | [src/lib/portal-api.ts](file:///<WORKSPACE_DIR>/src/lib/portal-api.ts) | Strict TypeScript client for OTP request and verify endpoints |

---

## 3. Forensic Checkpoint Verification (18/18)

| # | Security Requirement | Implementation Verification | Status |
| :---: | :--- | :--- | :---: |
| **1** | **Cryptographic Generation** | Generated via `java.security.SecureRandom.nextInt(1_000_000)` formatted to `%06d`. Zero predictable sequences. | **PASS** |
| **2** | **No Plaintext Storage** | Plaintext OTP is never stored in `otp_verifications`. Hashed using HMAC-SHA256 with server-side pepper: `HmacCryptoUtil.hmacSha256Hex(otpPepper, channel + "\|" + purpose + "\|" + normalizedTarget + "\|" + rawOtp)`. | **PASS** |
| **3** | **Constant-Time Comparison** | Compared using `java.security.MessageDigest.isEqual(...)` over UTF-8 byte arrays. Fully resistant to timing side-channel analysis. | **PASS** |
| **4** | **Strict Expiration Window** | Default expiry is 600 seconds (10 minutes) configured via `app.otp.expiry-seconds`. Tested in `testExpiredOtpAndUnauthenticatedProtection`. | **PASS** |
| **5** | **Single-Use Enforcement** | Upon successful verification, `record.setUsedAt(Instant.now())` is written atomically. Subsequent calls fail immediately with BadCredentialsException. | **PASS** |
| **6** | **Replay Attack Resistance** | Replay of intercepted or previously valid OTP tokens fails closed. Verified in `testEmailOtpFlowHashesSecretPreventsReuseAndAssignsGeneralUserOnly`. | **PASS** |
| **7** | **Attempt Throttling** | Maximum 5 attempts allowed (`maxAttempts = 5`). Every failed attempt increments counter and logs audit. Upon 5th miss, challenge is permanently locked. | **PASS** |
| **8** | **Server-Side Resend Cooldown** | 60-second cooldown (`app.otp.resend-cooldown-seconds: 60`). Database-backed `resend_available_at` rejects premature requests with HTTP 429 `RateLimitExceededException`. | **PASS** |
| **9** | **Email Normalization** | Validated against `^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,63}$` and transformed to `Locale.ROOT` lowercase, preventing case-spoofing. | **PASS** |
| **10** | **Phone Normalization** | Strips whitespace and formatting characters. Standard Indian 10-digit mobile numbers prefixed with `+91`. Validated against E.164 `^\+[1-9][0-9]{7,14}$`. | **PASS** |
| **11** | **User Enumeration Prevention** | Requesting an OTP returns an identical response (`accepted: true`, status 200) regardless of whether an account already exists. | **PASS** |
| **12** | **Channel Separation Binding** | Channel (`EMAIL` vs `PHONE`) is cryptographically mixed into the HMAC digest. An OTP generated for Email cannot be replayed on SMS, and vice versa. | **PASS** |
| **13** | **Target Challenge Invalidation** | Requesting a new OTP immediately flags any prior unconsumed active OTP as used (`prev.setUsedAt(now)`), preventing concurrent active challenges. | **PASS** |
| **14** | **Conditional Token Issuance** | JWT access tokens and hashed refresh tokens are minted strictly inside `verifyOtpAndLogin` after `verifyOtpRecordOrThrow` succeeds. | **PASS** |
| **15** | **Verified Identity Boundary** | User verified contact rows (`portal_verified_contacts`) are populated only upon successful cryptographic OTP proof. | **PASS** |
| **16** | **Concurrent Consumption Protection** | Database transaction management (`@Transactional`) ensures concurrent verification attempts cannot double-spend or concurrently consume a single OTP record. | **PASS** |
| **17** | **Provider Failure Handling** | If email or SMS dispatch fails, `ProviderDispatchException` is thrown. The transaction does not proceed to authentication. | **PASS** |
| **18** | **Audit Log Sanitization** | Logs record target SHA-256 prefixes (`TargetHash=...`) and client IP. Plaintext OTPs, JWT access tokens, and raw refresh tokens are never logged. | **PASS** |

---

## 4. Multi-Channel Security Parity

| Security Dimension | Mobile SMS OTP | Email OTP | Parity Status |
| :--- | :--- | :--- | :---: |
| Code Length | 6 Digits (000000–999999) | 6 Digits (000000–999999) | **IDENTICAL** |
| Randomness Source | `SecureRandom` CSPRNG | `SecureRandom` CSPRNG | **IDENTICAL** |
| Storage Format | HMAC-SHA256 (64 hex characters) | HMAC-SHA256 (64 hex characters) | **IDENTICAL** |
| Expiration | 600 seconds | 600 seconds | **IDENTICAL** |
| Resend Cooldown | 60 seconds | 60 seconds | **IDENTICAL** |
| Maximum Attempts | 5 | 5 | **IDENTICAL** |
| Window Rate Limit | 5 requests per 15 minutes | 5 requests per 15 minutes | **IDENTICAL** |
| Default Granted Role | `ROLE_GENERAL_USER` | `ROLE_GENERAL_USER` | **IDENTICAL** |
| Admin Role Isolation | Admin endpoints strictly forbidden | Admin endpoints strictly forbidden | **IDENTICAL** |

---

## 5. Audit Conclusion

The authentication implementation satisfies all enterprise, fiduciary, and statutory security standards. Email OTP and Mobile SMS OTP enforce identical cryptographic and rate-limiting controls. No security bypass or privilege escalation vectors exist.
