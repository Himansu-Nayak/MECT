# MECT — Authentication & Security Implementation Report

## Classification Summary
- **Implemented:** Passwordless Email OTP flow (`PortalAuthController` + `OtpAuthService`), HMAC-SHA256 OTP hashing via `HmacCryptoUtil`, 10-minute expiry (`app.otp.expiry-seconds: 600`), 60-second resend cooldown (`app.otp.resend-cooldown-seconds: 60`), 5 max verification attempts (`app.otp.max-attempts: 5`), constant-time hash comparison (`MessageDigest.isEqual`), anti-enumeration generic responses, fail-closed contact-change OTP verification, isolated `PORTAL` JWT claim namespace (`JwtTokenProvider.generatePortalAccessToken`), SHA-256 hashed rotating `portal_refresh_tokens`, Role-Based Access Control (`ROLE_GENERAL_USER`, `ROLE_DONOR` isolated from internal `admin_users` roles), rate-limiting on `/public/` & `/portal/auth/` via `RateLimitingFilter`, CSV financial export restricted to `ROLE_SUPER_ADMIN`/`ROLE_TRUSTEE`/`ROLE_FINANCE_OFFICER`.
- **Tested successfully (automated test suite):** Covered in `PortalAuthAndOtpSecurityTests` (Spring MockMvc + H2 PostgreSQL mode + mocked providers) and Next.js redirect guard checks; see `MECT_TEST_AND_QA_REPORT.md` for exact run results.
- **Requires provider credentials:** Live Phone SMS OTP dispatch (`ConfigurableSmsService` supports `TWILIO`, `MSG91`, or fail-closed `NONE` — no SMS provider credentials are present in `backend/.env`), live Resend email dispatch (`RESEND_API_KEY` not yet configured in `backend/.env`).
- **Requires legal or organisational confirmation:** Key rotation of any secret previously shared in chat (`RESEND_API_KEY` must be rotated in Resend dashboard before entering production environment variables).

## 1. Account & Role Isolation (`portal_users` vs `admin_users`)
- Internal Trust staff/trustees authenticate against `admin_users` (`AuthController`) receiving standard admin JWTs (`CustomUserDetailsService`).
- Public community supporters and donors authenticate against `portal_users` (`PortalAuthController`) receiving JWTs carrying claim `tokenType="PORTAL"`, loaded exclusively by `PortalUserDetailsService`.
- There is **zero automatic or endpoint-exposed bridge** from `PORTAL` tokens to `/admin/**` endpoints (`SecurityConfig` restricts `/portal/**` to `hasAnyRole("GENERAL_USER", "DONOR")` and `/admin/**` strictly to Trust staff roles).
- Every newly verified portal user receives `ROLE_GENERAL_USER`; `ROLE_DONOR` is granted **exclusively** inside `DonationLifecycleService` after server-side cryptographic payment verification (`SUCCESS`).

## 2. Passwordless OTP Threat Mitigations (`OtpAuthService`)
1. **No Plaintext OTPs Stored:** Raw 6-digit `SecureRandom` OTPs are HMAC-SHA256 hashed with server pepper (`app.otp.pepper`) before persistence to `otp_verifications.otp_hash`.
2. **Short TTL & Bruteforce Lockout:** Single-use codes expire in 600 seconds (UTC normalized), enforce 60-second resend cooldown, and burn permanently upon reaching 5 failed attempts (`attempts >= maxAttempts`).
3. **Anti-Enumeration:** Email login requests return a consistent uniform status message regardless of whether the address already exists in `portal_users`.
4. **Contact-Change Protection:** Adding or updating a verified email/phone requires an authenticated session plus OTP verification with `purpose = "CONTACT_CHANGE"` against `PortalAccountController` and rejects duplicate ownership across accounts.
5. **Fail-Closed SMS Boundary:** Phone OTP does **not** fall back to email or fabricate delivery; when `SMS_PROVIDER=NONE` (or credentials are blank), `ConfigurableSmsService` fails closed and throws `ProviderUnconfiguredException` (HTTP `503`).
6. **Secret Hygiene:** No API keys or secrets are stored in git-tracked files, source code, tests, or `.env` templates.

