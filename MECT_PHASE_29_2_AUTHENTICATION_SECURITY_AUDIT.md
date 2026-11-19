# MECT PHASE 29.2 — DEEP AUTHENTICATION SECURITY AUDIT
## Independent Cryptographic Evaluation, Session Lifecycle, Token Rotation & Threat Vector Analysis

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Target Systems:** `PortalAuthController`, `OtpAuthService`, `JwtTokenProvider`, `PortalAuthContext`, `RateLimitingFilter`, `SecurityConfig`  
**Execution Date:** 19 November 2026  

---

## 1. EXECUTIVE AUDIT SUMMARY

An exhaustive cryptographic and operational security audit of the MECT Supporter Authentication system was conducted. The evaluation encompassed entropy generation, hash/pepper constructions, brute-force mitigation, account enumeration defenses, JWT signing integrity, refresh-token rotation, and cross-account isolation.

### Key Finding on OTP Storage Design:
The application employs **HMAC-SHA256 with a protected server-side key (`app.otp.pepper`)** bound to channel, purpose, normalized contact, and OTP code:
```java
HmacCryptoUtil.hmacSha256Hex(otpPepper, channel + "|" + purpose + "|" + normalizedTarget + "|" + rawOtp);
```
**Cryptographic Assessment:**
1. A standard 6-digit OTP has an entropy space of only $10^6$ (1,000,000) possibilities. If stored as a simple unsalted or salted unkeyed SHA-256 hash, an adversary who dumps the database can compute a rainbow table or perform offline brute-force across the entire $10^6$ keyspace in less than 5 milliseconds on commodity hardware.
2. The current **HMAC-SHA256 keyed construction using an isolated server-side pepper** prevents offline dictionary attacks. An attacker cannot verify candidate OTPs without possessing the runtime secret `OTP_HASH_PEPPER`.
3. Combined with strict database-level single-use flags (`used_at`), short time-to-live (`expires_at` = 10 minutes), per-record attempt counters (max 5 attempts), and constant-time comparison (`MessageDigest.isEqual`), the OTP architecture conforms to industry standards (NIST SP 800-63B guidelines for out-of-band authenticators).

---

## 2. 18-POINT SECURITY VERIFICATION MATRIX

| # | Security Attribute | Evaluated Component | Finding / Verification Proof | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | **OTP Entropy & Generation** | `OtpAuthService.java:152` | Generated via `SecureRandom.nextInt(1_000_000)` formatted as 6-digit zero-padded string (`%06d`). Cryptographically strong PRNG. | **PASS** |
| **02** | **OTP Hashing Strategy** | `OtpAuthService.java:508` | Keyed HMAC-SHA256 binding channel, purpose, normalized contact, and OTP code. Constant-time comparison via `MessageDigest.isEqual`. | **PASS** |
| **03** | **Server-Side Secret Protection** | `application.yml:61` | Pepper configured via environment variable `OTP_HASH_PEPPER`. Never committed or logged. | **PASS** |
| **04** | **OTP Expiry Enforcement** | `OtpAuthService.java:455` | Expiry strictly enforced via `expires_at` column (default 600 seconds / 10 min). Rejects expired codes with `BadCredentialsException`. | **PASS** |
| **05** | **Single-Use Enforcement** | `OtpAuthService.java:452, 482` | `used_at` timestamp set upon successful verification. Subsequent attempts immediately rejected. Prior active codes auto-invalidated on resend. | **PASS** |
| **06** | **Resend Cooldown** | `OtpAuthService.java:132` | 60-second cooldown enforced via `resend_available_at`. Rapid resend requests trigger `RateLimitExceededException` (HTTP 429). | **PASS** |
| **07** | **Brute-Force Prevention** | `OtpAuthService.java:458, 469` | Max 5 failed attempts per OTP record. Attempts incremented in DB with `noRollbackFor = BadCredentialsException.class`. | **PASS** |
| **08** | **Rate Limiting (IP & Target)** | `RateLimitingFilter.java:43` | Target rate-limit: max 5 requests per 15 minutes per contact. IP rate-limit: max 30 requests per minute across `/portal/auth/*`. | **PASS** |
| **09** | **Account Enumeration Protection** | `OtpAuthService.java:217` | `requestOtp` returns identical success message regardless of whether the target user already exists or is new. | **PASS** |
| **10** | **JWT Signing & Integrity** | `JwtTokenProvider.java:37` | Signed using HMAC-SHA256 with minimum 256-bit key. TokenType distinction (`PORTAL` vs `ADMIN`). Expiration checked on every parse. | **PASS** |
| **11** | **Refresh-Token Rotation** | `OtpAuthService.java:396, 407` | Refresh tokens are strictly single-use. Existing token is marked `revoked = true` before issuing a new hashed token. | **PASS** |
| **12** | **Refresh-Token Revocation** | `OtpAuthService.java:433` | `logoutPortalUser` invokes `refreshTokenRepository.revokeAllForUser(portalUserId)`, terminating all sessions. | **PASS** |
| **13** | **Logout Behaviour** | `PortalAuthContext.tsx:88` | Client calls backend `/portal/auth/logout`, clears local storage key `mt_portal_refresh_token`, resets state, and redirects to `/login`. | **PASS** |
| **14** | **Session Expiry** | `application.yml:55, 56` | Access token lifetime: 900 seconds (15 minutes). Refresh token lifetime: 604,800 seconds (7 days). | **PASS** |
| **15** | **Cross-Account Isolation** | `PortalAuthController.java:70` | Controller extracts authenticated `PortalPrincipal` from `SecurityContextHolder`. Client cannot forge user identity via parameters. | **PASS** |
| **16** | **Token Storage & Transport** | `PortalAuthContext.tsx` | Short-lived access token held in React state; refresh token in localStorage for silent renewal; transported via `Authorization: Bearer`. | **PASS** |
| **17** | **CSRF Protection** | `SecurityConfig.java:55` | Stateless architecture using Bearer tokens in headers. Browsers do not automatically attach Bearer headers, preventing CSRF attacks. | **PASS** |
| **18** | **CORS Configuration** | `SecurityConfig.java:101` | Explicit allowed origins (`CORS_ALLOWED_ORIGINS`), methods, and headers (`Content-Type`, `Authorization`, `X-Requested-With`). | **PASS** |

---

## 3. THREAT VECTOR RESILIENCE ANALYSIS

### 3.1 Offline Rainbow Table & Hash Inversion Attacks
- **Vulnerability Description:** If database read access is obtained via SQL injection or backup leak, attackers attempt to invert OTP hashes.
- **Defense Mechanism:** The hash is computed using `HmacSHA256` keyed with `app.otp.pepper`. Because the pepper is injected into memory at application boot and resides outside the database, the attacker cannot generate valid HMACs for candidate 6-digit values without also compromising server environment secrets.

### 3.2 Online Distributed Brute-Force Attacks
- **Vulnerability Description:** Attackers attempt to guess the 6-digit OTP across multiple rotating IP proxies.
- **Defense Mechanism:**
  1. The OTP record limits total verification attempts to 5 (`maxAttempts = 5`).
  2. Each failed guess increments the database counter immediately via a non-rolling transaction.
  3. Upon reaching 5 failed attempts, the code is permanently locked, rendering further attempts useless regardless of client IP rotation.
  4. With 5 attempts out of 1,000,000 possibilities, the probability of guessing a valid OTP is $5 / 1,000,000 = 0.0005\%$ (1 in 200,000).

### 3.3 SMS Toll Fraud & Flooding
- **Vulnerability Description:** Malicious actors attempt to drain SMS API balances by submitting continuous OTP requests to premium or random numbers.
- **Defense Mechanism:**
  1. `resend_available_at`: Enforces 60-second cooldown between requests to the same number.
  2. 15-minute sliding window: Max 5 OTP dispatches per target number within any 15-minute window (`countByChannelAndTargetValueAndCreatedAtAfter`).
  3. IP-level rate limiting: 30 requests per minute per IP via `RateLimitingFilter`.

---

## 4. CONCLUSION & RECOMMENDATIONS

The authentication implementation is robust, cryptographically sound, and resistant to modern automated credential attacks. No critical or high authentication vulnerabilities were identified.
