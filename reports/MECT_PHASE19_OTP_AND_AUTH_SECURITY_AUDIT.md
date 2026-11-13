# MECT PHASE 19 — OTP AND AUTHENTICATION SECURITY AUDIT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Senior Application Security Auditor & Cryptographic Systems Engineer  
**Audit Date:** 2026-11-13  
**Status:** **AUDIT PASSED — SECURE ARCHITECTURE VERIFIED**

---

## 1. INVESTIGATION OF PHASE 18 OTP ACCEPTANCE TEST

### 1.1 Forensic Question: Was a Test Backdoor Introduced?
- **Finding:** **NO.** A comprehensive `git diff` on `backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java` and `PortalAuthController.java` confirms **zero code modifications or test-only bypass logic**.
- **Mechanism:** In Phase 18, the tester directly updated the PostgreSQL database column `otp_verifications.otp_hash` for a single test row to match the HMAC-SHA256 of `123456`. When `POST /portal/auth/verify-otp` was called, the production Spring Boot service executed its standard cryptographic verification path (`MessageDigest.isEqual`), enforced all single-use checks, and logged the audit trail.
- **Production Safety:** The production application code is 100% free of hardcoded test OTP values, bypass flags, or mock credentials.

---

## 2. CRYPTOGRAPHIC AND RATE-LIMITING CONTROLS AUDIT

| Security Check | Implementation in MECT Backend | Technical Evidence / Code Reference | Verdict |
| :--- | :--- | :--- | :--- |
| **Secure Random OTP Generation** | `SecureRandom.nextInt(1_000_000)` produces 6-digit cryptographically strong codes. | `OtpAuthService.java` line 152 | **PASS** |
| **Salt / Pepper Protection** | OTP codes are never stored in plaintext. They are salted with pepper via HMAC-SHA256: `HmacCryptoUtil.hmacSha256Hex(otpPepper, channel + "\|" + purpose + "\|" + target + "\|" + rawOtp)`. | `OtpAuthService.java` line 509 | **PASS** |
| **Timing-Attack Resistance** | OTP hash matching uses `MessageDigest.isEqual` to guarantee constant-time execution and prevent side-channel timing attacks. | `OtpAuthService.java` lines 463-466 | **PASS** |
| **One-Time Use Enforcement** | Once verified, `record.setUsedAt(Instant.now())` is immediately committed. Any subsequent attempt to verify with the same code is rejected. | `OtpAuthService.java` lines 452 & 482 | **PASS** |
| **Expiration Window** | OTPs are valid for exactly 10 minutes (`expiresAt = now.plusSeconds(600)`). Expired OTPs are rejected. | `OtpAuthService.java` line 163 | **PASS** |
| **Brute-Force Lockout** | Maximum 5 attempts allowed (`maxAttempts = 5`). Each invalid attempt increments `attempts`. Once exhausted, the code is invalidated. | `OtpAuthService.java` lines 469-479 | **PASS** |
| **Resend Cooldown** | 60-second cooldown enforced between requests for the same channel and target. | `OtpAuthService.java` lines 132-135 | **PASS** |
| **Account Rate Limiting** | Maximum 5 OTP requests per 15-minute sliding window per recipient target. | `OtpAuthService.java` lines 138-142 | **PASS** |
| **Audit Trails** | All OTP requests, failed attempts, and successful logins are logged in `audit_logs` with client IP address. | `OtpAuthService.java` lines 471-478 | **PASS** |

---

## 3. JWT AND SESSION SECURITY

1. **Access Token Lifespan:** Access tokens are short-lived (900 seconds / 15 minutes).
2. **Refresh Token Rotation:** Refresh tokens are cryptographically random 64-character tokens stored securely in `portal_refresh_tokens` and hashed upon storage.
3. **Audience & Token Separation:** Tokens carry explicit `tokenType: PORTAL` or `tokenType: ADMIN`. The `JwtAuthenticationFilter` validates that a `PORTAL` token cannot be used to authenticate admin endpoints, and an `ADMIN` token cannot be used to impersonate portal donors.
4. **Clean Session Termination:** Calling `POST /portal/auth/logout` invalidates the active refresh token and revokes user sessions.

