# MECT — DONOR AUTHENTICATION PHASE 1.1 AUDIT & ACCEPTANCE REPORT
## SECURITY REMEDIATION, JOURNEY CORRECTION & COMPLIANCE VERIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Starting Local HEAD:** `2eaaeb0a6f6c3d18f4fbf797066a10f9ba66d25a`  
**Production Baseline:** `origin/main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`  
**Evaluation Date:** 2026-11-26  
**Final Release Gate Verdict:** **IMPLEMENTATION COMPLETE — EXTERNAL CONFIGURATION PENDING**

---

## 1. EXECUTIVE SUMMARY & STRICT PRESERVATION AUDIT

Phase 1.1 was executed as a focused security remediation, journey correction, and final acceptance gate for donor authentication. In compliance with strict engineering safeguards:
- **No Git commits were automatically created** (preserving the repository commit boundary for owner authorization).
- **No production infrastructure, VPS, PostgreSQL database, or remote branches were contacted or modified**.
- **Preserved Core Assets Verified Intact**:
  - `src/components/auth/ProgressiveDonorAuth.tsx`
  - `src/components/donation/DonationJourney.tsx`
  - `src/context/PortalAuthContext.tsx`
  - `backend/.../service/portal/GoogleOidcService.java`
  - `backend/.../controller/PortalAuthController.java`
  - `backend/.../controller/PortalAccountController.java`
  - `backend/.../service/portal/PortalAccountService.java`
  - `backend/.../service/portal/ConfigurableSmsService.java`
  - `backend/.../service/portal/OtpAuthService.java`
  - `V20__donor_portal_and_statutory_accounts.sql` Flyway migration
  - All existing donor ledgers, receipt counters, and audit log tables.

---

## 2. GOOGLE OIDC CRYPTOGRAPHIC SIGNATURE VERIFICATION AUDIT

### 2.1 Vulnerability Remediated
Previously, `GoogleOidcService.java` decoded the Google ID token JSON payload directly without cryptographic RS256 signature verification. While sufficient in local test mode, this would have permitted forged identity tokens in production.

### 2.2 Architectural Remediation
We introduced a dedicated cryptographic token verification boundary:
- **Interface:** `GoogleTokenVerifier.java`
- **Implementation:** `DefaultGoogleTokenVerifier.java`
- **Cryptographic Engine:** Java Cryptography Architecture (JCA) + JJWT 0.12.6.
- **Key Resolution & Dynamic Caching:**
  - Queries Google's public JSON Web Key Set (JWKS) at `https://www.googleapis.com/oauth2/v3/certs`.
  - Caches RSA public keys by `kid` (Key ID) in memory with a rolling TTL and automatic refresh on cache miss.
  - Supports test harness injection via `registerTestPublicKey(kid, publicKey)` for hermetic, offline test execution without external internet dependencies.
- **Strict Cryptographic & Claim Assertions:**
  1. **Algorithm:** Must be `RS256`. Rejects tokens with `none`, symmetric HMAC (`HS256`), or unapproved algorithms.
  2. **Signature:** Must be cryptographically signed by Google's private key corresponding to the published `kid`.
  3. **Issuer (`iss`):** Must exactly equal `https://accounts.google.com` or `accounts.google.com`.
  4. **Audience (`aud`):** Must match the configured Google Client ID (`app.google.client-id`).
  5. **Expiration (`exp`):** Must not be expired (evaluates clock drift with 60-second skew tolerance).
  6. **Subject (`sub`):** Must be non-blank, stable Google unique identifier.
  7. **Email Verification (`email_verified`):** Mandatory boolean check. Tokens with unverified email addresses are rejected with HTTP 401.

### 2.3 Automated Test Evidence
In `PortalAuthAndOtpSecurityTests.java`:
- Generates 2048-bit RSA keypairs (`validGoogleKeyPair` and `untrustedKeyPair`).
- Test `testGoogleSignIdTokenCryptographicAuthenticationAndUserCreation`: **PASS** (authenticated, registered user in DB with `auth_provider = 'GOOGLE'`, verified claims, created profile).
- Test `testGoogleSignInRejectsCryptographicallyInvalidSignature`: **PASS** (forged token signed by untrusted keypair rejected with HTTP 401 `Invalid Google ID token cryptographic signature`).
- Test `testGoogleSignInRejectsInvalidOrExpiredToken`: **PASS** (verified rejection for expired token, audience mismatch, invalid issuer, and unverified email).

---

## 3. ACCOUNT LINKING SAFETY MODEL & TAKEOVER DEFENSE

### 3.1 Unauthenticated Account Takeover Defense
Silent account linking based purely on email match introduces an account-takeover vector. If an attacker registers a Google account with the victim's email, or if a user signs in with Google without owning the pre-existing mobile-registered account, a silent merge would compromise the donor profile.

### 3.2 Implemented Policy
1. `GoogleOidcService.java` performs user lookup **exclusively** by immutable Google `sub` (`findByGoogleSub`).
2. If no user is found by `sub`, but an existing user exists with a matching email (`findByPrimaryEmail`):
   - **Silent linking is strictly forbidden**.
   - Throws `BadCredentialsException`: `"An existing donor account was found for <email>. For your security, please sign in with your Mobile OTP first, then link your Google account in Portal Security Settings."`
3. **In-Session Authenticated Linking:**
   - Endpoint: `POST /portal/me/link-google`
   - Requires valid JWT Bearer token of an already-authenticated donor.
   - Verifies the Google ID token cryptographically.
   - Ensures the Google `sub` is not already linked to another user.
   - Links `googleSub`, `googleEmail`, and sets `authProvider = "DUAL"`.
- Automated Test `testGoogleSignInRejectsUnauthenticatedEmailAccountTakeover`: **PASS** (rejected silent hijack).
- Automated Test `testAuthenticatedGoogleAccountLinkingFlow`: **PASS** (in-session authenticated linking succeeds).

---

## 4. CANONICAL AUTHENTICATION POLICY RECONCILIATION

### 4.1 Supported Methods
The canonical supported authentication methods across MECT are:
- **Method A:** Mobile Number authentication with mandatory OTP verification.
- **Method B:** Google account authentication with cryptographically validated Google identity.

Both methods resolve into one unified canonical MECT donor account.

### 4.2 Removal of Unapproved Email OTP Fallback
The following unapproved Email OTP elements were completely removed:
- Removed `suggestEmailOtp` state and fallback toggle banner from `ProgressiveDonorAuth.tsx`.
- Removed `"Prefer Email OTP?"`, `"Use Email OTP instead"`, `"Try Email verification"`, and `"Use Email address instead"` links from `ProgressiveDonorAuth.tsx`.
- Set channel to `"PHONE"` as the mandatory primary OTP channel.
- Removed `channelParam === "EMAIL"` auto-selection from `src/app/login/page.tsx` and `src/app/register/page.tsx`.

---

## 5. DONATION JOURNEY SEQUENCE REORDERING & UX HARDENING

### 5.1 Canonical Step Progression
The donation flow in `src/components/donation/DonationJourney.tsx` was reordered to match the institutional donor journey:

| Step # | Step Title | Description & Context Preservation |
|---|---|---|
| **Step 1** | **Programme Selection** | Donor selects one of 6 verified programmes (General Fund, Education, Jal Seva, Women Livelihoods, Jan Ahar, Hanuman Murti). |
| **Step 2** | **Donation Amount** | Donor chooses preset (₹500, ₹1000, ₹2500, ₹5000, ₹10000, ₹25000) or custom amount (minimum ₹1). Displays selected programme badge. |
| **Step 3** | **Donor Authentication** | Donor authenticates via Mobile OTP or Google Sign-In. Retains and displays both selected programme and selected donation amount. If already authenticated, displays active session card with 1-click continuation. |
| **Step 4** | **Donor Details** | Full Name, Email for receipt delivery, Mobile, PAN for 80G certificate, and residential city. Displays programme and amount badges. |
| **Step 5** | **Review Summary** | Comprehensive contribution coordinates, Section 80G tax treatment, Trust deed guarantee. |
| **Step 6** | **Payment Remittance** | Displays SBI manual bank transfer details (Account 33341302498, IFSC SBIN0001701), QR code, UTR reference input, and payment gateways when active. |
| **Step 7** | **Confirmation** | Displays serialized transaction reference, reconciliation status, WhatsApp acknowledgment opt-in status, and receipt download option. |

### 5.2 Bypass Elimination
The `"Skip Verification & Enter Details Directly"` bypass button on Step 2/3 was **completely removed**. All donations are now systematically anchored to a verified donor record.

---

## 6. STATUTORY CLAIMS & COMPLIANCE ALIGNMENT

Single Source of Truth (`src/config/org.ts`) reconciliation:
- **Trust PAN:** `AADTM5474F`
- **Section 12A URN:** `AADTM5474FE20231` (Order Date: 29-01-2024, Validity: AY 2024-25 to AY 2026-27)
- **Section 80G Provisional URN:** `AADTM5474FF20241` (Order Date: 29-01-2024, Validity: AY 2024-25 to AY 2026-27)
- **MCA CSR-1 Registration:** `CSR00081063` (Approved 09-11-2024, SRN: `N14617237`).
  - Replaced legacy string `CSR00067341` in `src/app/login/page.tsx` and `src/app/register/page.tsx`.
- **Trust Deed:** Deed No. `40311302194` (Registered 30-07-2013, Balangir Sub-Registrar).
- **Bank Account:** State Bank of India, Balangir Branch, A/C `33341302498`, IFSC `SBIN0001701`.

---

## 7. OTP INFRASTRUCTURE & SMS READINESS

- Backend implementation: `ConfigurableSmsService.java` supports `TWILIO`, `MSG91`, `CONSOLE`, `DEV_LOG`, `MOCK`, and `NONE`.
- Default runtime setting: `NONE`.
- Safe failure mode: When SMS credentials are not yet provisioned in production VPS environment variables, `ProviderUnconfiguredException` is raised, resulting in a safe HTTP 503 response stating that SMS delivery is temporarily unconfigured, rather than failing silently or hanging.

---

## 8. BUILD & TEST SUITE VERIFICATION EVIDENCE

### 8.1 Backend Test Results (`mvn test`)
Command: `mvn -f backend/pom.xml "-Dtest=PortalAuthAndOtpSecurityTests,WhatsAppNotificationOutboxIntegrationTests,DonationFinancialIntegrityPhase21_5_9_1Tests" test`
```
[INFO] Running org.mahavirtrust.backend.DonationFinancialIntegrityPhase21_5_9_1Tests
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running org.mahavirtrust.backend.PortalAuthAndOtpSecurityTests
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running org.mahavirtrust.backend.WhatsAppNotificationOutboxIntegrationTests
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] Results:
[INFO] Tests run: 24, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 01:31 min
```
**Backend Verification Status:** **100% PASS (24/24 tests passing, Exit Code 0)**.

### 8.2 Frontend Build Results (`npm run build`)
Command: `npm run build`
```
[check-confirm] PASS: 0 unresolved {{CONFIRM: ...}} markers found.
▲ Next.js 16.4.6 (webpack)
✓ Running next.config.ts took 237ms
✓ Compiled successfully in 41s
  Running TypeScript ...
  Finished TypeScript in 10.5s ...
✓ Generating static pages using 1 worker (58/58) in 13.4s
✓ Finalizing page optimization
```
**Frontend Verification Status:** **100% PASS (58/58 static routes compiled and optimized, Exit Code 0, 0 TypeScript errors)**.

---

## 9. RELEASE-READINESS VERDICT & OPERATIONAL RECOMMENDATIONS

### Final Verdict:
**IMPLEMENTATION COMPLETE — EXTERNAL CONFIGURATION PENDING**

### Pending Production Configurations (For Release Operations Team):
1. **Google OAuth Client ID & Secret:** Configure `GOOGLE_CLIENT_ID` in production `.env` and `app.google.client-id` in Spring Boot environment.
2. **SMS Gateway Credentials:** Configure `SMS_PROVIDER=MSG91` (or `TWILIO`), `SMS_API_KEY`, `SMS_SENDER_ID`, and `SMS_TEMPLATE_ID` in production environment.
3. **Commit Authorization:** Once the product owner reviews this report and test evidence, create the authorized release commit for Phase 1.1.
