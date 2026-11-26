# MECT — PHASE 1.2 FINAL DONOR AUTHENTICATION VERIFICATION & CHANGE CONTROL GATE

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Feature Baseline:** `2eaaeb0a6f6c3d18f4fbf797066a10f9ba66d25a`  
**Production Baseline:** `origin/main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`  
**Evaluation Date:** 2026-11-26  
**Final Release Gate Verdict:** **VERIFIED — READY FOR OWNER COMMIT REVIEW**

---

## 1. CHANGE CONTROL & AUDIT BOUNDARIES

In strict compliance with the change-control governance mandates:
1. **Repository Commit Boundary Preserved:** No Git commits were created automatically.
2. **Production Freeze Maintained:** No production VPS commands, SSH sessions, production database connections, or remote Git branch pushes were executed.
3. **No Real Notifications Dispatched:** Zero real SMS, email, or WhatsApp messages were transmitted; all provider calls executed against mocked test harnesses.
4. **Zero Production PII Exposure:** No production donor records, real PAN numbers, or real credentials were used or logged.
5. **Baseline Integrity:**
   - Active Branch: `feat/complete-website-redefinition-and-deduplication`
   - Committed HEAD: `2eaaeb0a6f6c3d18f4fbf797066a10f9ba66d25a`
   - Working Tree: All modifications preserved and reconciled.

---

## 2. GOOGLE OIDC CRYPTOGRAPHIC VERIFICATION AUDIT

### 2.1 Architecture & Implementation Review
The cryptographic verification boundary is implemented in `DefaultGoogleTokenVerifier.java` implementing `GoogleTokenVerifier.java`:
- **Cryptographic Signature Engine:** Java Cryptography Architecture (JCA) + JJWT 0.12.6.
- **Algorithm Enforcement:** Strictly asserts `alg == "RS256"`. Tokens using `none`, symmetric HMAC (`HS256`), or unapproved algorithms are rejected immediately.
- **JWKS Key Resolution & HTTPS Retrieval:** Fetches Google's public JSON Web Key Set from `https://www.googleapis.com/oauth2/v3/certs` via Spring `RestClient` with a 5-second connect timeout and 10-second read timeout.
- **In-Memory Dynamic Key Caching:** Public keys are parsed into `RSAPublicKey` instances and cached by `kid` in a thread-safe `ConcurrentHashMap` with a 6-hour TTL. If an unknown `kid` is encountered, dynamic cache refresh is triggered automatically to support Google key rotation without downtime.
- **Claims & Context Assertions:**
  - `iss`: Validated against `https://accounts.google.com` or `accounts.google.com`.
  - `aud`: Validated against configured `app.google.client-id`.
  - `exp`: Evaluated with 60-second clock skew tolerance via JJWT parser.
  - `sub`: Must be non-null and non-blank; stable unique immutable identifier.
  - `email_verified`: Mandatory boolean check. Tokens with unverified email addresses fail with HTTP 401.

### 2.2 Account Linking & Anti-Takeover Protections
In `GoogleOidcService.java`:
- **Lookup Boundary:** Donor lookups occur strictly via immutable `google_sub`.
- **Anti-Takeover Defense:** If an unauthenticated Google sign-in presents an email matching an existing donor account registered via Mobile OTP, silent account takeover is strictly prohibited. The system challenges the request with `BadCredentialsException`, directing the user to sign in with their existing Mobile OTP first.
- **Authenticated Account Linking:** In-session linking (`POST /portal/me/link-google`) in `PortalAccountController.java` requires an active session (`ROLE_GENERAL_USER` or `ROLE_DONOR`), ensures the Google identity is not already linked to another user, and ensures the current account is not already bound to a conflicting Google identity.

### 2.3 Automated Test Coverage
All test cases executed in `PortalAuthAndOtpSecurityTests.java`:
- `testGoogleSignIdTokenCryptographicAuthenticationAndUserCreation` (RS256 valid signature & profile creation)
- `testGoogleSignInRejectsCryptographicallyInvalidSignature` (Untrusted RSA key signature rejection)
- `testGoogleSignInRejectsInvalidOrExpiredToken` (Expired tokens, audience mismatch, issuer mismatch, unverified email, missing subject claim)
- `testGoogleSignInRejectsUnauthenticatedEmailAccountTakeover` (Rejects silent takeover of existing email user)
- `testAuthenticatedGoogleAccountLinkingFlow` (Full in-session linking lifecycle & conflicting account claim rejection)
- `testUnauthenticatedGoogleAccountLinkingRejected` (Rejects unauthenticated linking requests with HTTP 401)

---

## 3. OTP AND SMS SERVICE VERIFICATION

### 3.1 Review of `OtpAuthService.java` & `ConfigurableSmsService.java`
- **SMS Provider Implementations:** `ConfigurableSmsService.java` supports `TWILIO`, `MSG91`, `CONSOLE`, `DEV_LOG`, and `MOCK`.
- **Credential Requirements:**
  - MSG91: `app.sms.msg91-auth-key`, `app.sms.msg91-template-id`
  - Twilio: `app.sms.twilio-account-sid`, `app.sms.twilio-auth-token`, `app.sms.twilio-from-number`
- **Absence of Credentials:** If credentials are unconfigured or `SMS_PROVIDER=NONE`, `isConfigured()` returns `false`. `OtpAuthService.requestOtp` catches unconfigured states and raises `ProviderUnconfiguredException`, returning HTTP 503 with user-friendly error messages and zero stored OTP records.
- **Cryptographic OTP Generation:** Generated using `java.security.SecureRandom` producing a 6-digit numeric string (`%06d`).
- **Storage & Hashing:** Stored as an HMAC-SHA256 hash salted with `otpPepper`, channel, purpose, and normalized recipient (`HmacCryptoUtil.hmacSha256Hex`). Raw OTPs are never stored.
- **Timing Attack Prevention:** OTP verification uses `MessageDigest.isEqual(...)` for constant-time byte comparison.
- **Lifecycle & Security Controls:**
  - *Expiry:* Enforces 600-second (10-minute) lifetime.
  - *Single Use:* Upon successful verification, `record.setUsedAt(now)` is set. Replay attempts are rejected with "This verification code has already been used."
  - *Resend Invalidation:* Requesting a new OTP immediately sets `usedAt` on any prior active OTP for that contact.
  - *Rate Limits:* 60-second resend cooldown enforced; max 5 requests per 15 minutes per target.
  - *Brute-Force Protection:* Enforces max 5 verification attempts. Each failed attempt increments the counter and is audit-logged; reaching the limit locks the record.
  - *Privacy & Sanitization:* Zero OTP codes in logs (only SHA-256 target prefixes). Zero OTP codes in API responses.

---

## 4. CANONICAL DONOR ACCOUNT VERIFICATION

- **Single Canonical Identity:** `PortalUser` serves as the sole canonical user entity across both Mobile OTP and Google authentication.
- **Duplicate Prevention:** Unique constraints and queries on `portal_users(google_sub)`, `portal_users(primary_phone)`, and `portal_verified_contacts(contact_type, contact_value)` prevent duplicate account creation.
- **Session Protection:** Issues stateless HMAC-SHA256 / RSA JWT access tokens with rotating refresh tokens stored with SHA-256 hashes in `portal_refresh_tokens`.
- **Donor Data Isolation:** All `/portal/**` endpoints strictly extract the authenticated user ID from `PortalPrincipal` in the SecurityContext; donors cannot access other records.
- **Statutory Auditability:** All authentication events (`PORTAL_REGISTERED`, `PORTAL_LOGIN_SUCCESS`, `PORTAL_GOOGLE_REGISTERED`, `PORTAL_GOOGLE_LOGIN_SUCCESS`, `PORTAL_GOOGLE_LINKED`, `OTP_DISPATCHED`, `OTP_VERIFY_FAILED`) are permanently recorded in the immutable `audit_logs` table.

---

## 5. DONATION JOURNEY REGRESSION AUDIT

### 5.1 Canonical 7-Step Sequence
Verified the exact 7-step sequence in `src/components/donation/DonationJourney.tsx`:
1. **Step 1: Programme Selection** — 6 verified programmes (General, Education, Water, Women, Food, Hanuman Murti).
2. **Step 2: Donation Amount** — Presets (₹500 to ₹25,000) or custom amount; displays chosen programme badge.
3. **Step 3: Donor Authentication** — `ProgressiveDonorAuth` embedded; displays badges for selected programme and amount; retains back navigation.
4. **Step 4: Donor Details** — Full Name, Email, Mobile Phone, PAN, Address, Section 80G eligibility, DPDP consent.
5. **Step 5: Review Summary** — Consolidated contribution summary, Section 80G tax disclosure, and trust registration credentials.
6. **Step 6: Payment Remittance** — Institutional SBI account (33341302498, IFSC SBIN0001701), QR code, and mandatory 8–40 character UTR reference input.
7. **Step 7: Confirmation & Reconciliation Status** — Submission confirmation, tracking reference, and pending ledger reconciliation badge.

### 5.2 Context Continuity & Governance Checks
- **Context Retention:** Selected programme and amount survive authentication through state retention and URL search parameters.
- **Zero Bypass:** The unapproved guest bypass button has been eliminated from the donation journey.
- **React 19 Compatibility:** Converted hydration detection to `useSyncExternalStore` and removed cascading `useEffect` state updates, resolving React 19 ESLint compliance.
- **Statutory Badges:** Verified institutional registrations match statutory records (`src/config/org.ts`):
  - Trust PAN: `AADTM5474F`
  - 12A URN: `AADTM5474FE20231`
  - 80G Provisional URN: `AADTM5474FF20241`
  - MCA CSR-1 Reg Number: `CSR00081063` (Approved 09-11-2024, SRN: N14617237)

---

## 6. DATABASE AND MIGRATION VALIDATION

### 6.1 Flyway Migration `V20__google_oidc_and_donor_identity_linking.sql`
```sql
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(100);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_email VARCHAR(255);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) DEFAULT 'OTP';

CREATE UNIQUE INDEX IF NOT EXISTS idx_portal_users_google_sub ON portal_users(google_sub);
CREATE INDEX IF NOT EXISTS idx_portal_users_google_email ON portal_users(google_email);
```
- **Idempotence & Safety:** Uses `IF NOT EXISTS` on all schema modifications.
- **Backward Compatibility:** All new columns are nullable or provide default values (`DEFAULT 'OTP'`). Existing users are preserved without data mutation.
- **Integrity:** `idx_portal_users_google_sub` enforces a unique constraint preventing duplicate Google bindings across distinct donor accounts.
- **Flyway Clean Execution:** Validated in test schema migrations during test suite initialization.

---

## 7. AUTOMATED QUALITY GATES & TEST RESULTS

### 7.1 Backend Maven Test Suite
```bash
mvn -f backend/pom.xml test
```
- **Exit Code:** `0`
- **Total Tests Run:** **153**
- **Failures:** **0**
- **Errors:** **0**
- **Skipped:** **0**
- **Execution Time:** 03:08 min
- **Key Suites Included:**
  - `PortalAuthAndOtpSecurityTests`: 12 tests run, 0 failures (cryptographic OIDC, OTP lifecycle, account linking)
  - `WhatsAppNotificationOutboxIntegrationTests`: 6 tests run, 0 failures (all 10 WhatsApp workflows)
  - `WhatsAppWebhookSecurityTests`: 6 tests run, 0 failures (signature verification, consent toggles)
  - `AuthenticationAndSecurityTests`: Full admin security, RBAC, and rate limiting suite

### 7.2 Frontend Static Quality Gates
| Tool / Command | Command Executed | Exit Code | Result | Details |
| :--- | :--- | :---: | :---: | :--- |
| **Check Confirm** | `npm run check:confirm` | 0 | **PASS** | 0 unresolved `{{CONFIRM: ...}}` markers |
| **TypeScript Validation** | `npm run typecheck` | 0 | **PASS** | 0 type errors across codebase |
| **ESLint Analysis** | `npm run lint` | 0 | **PASS** | 0 errors, 0 warnings (React 19 rules verified) |
| **Secrets Scanner** | `npm run scan:secrets` | 0 | **PASS** | Tracked working tree is 100% clean of hardcoded secrets |
| **Next.js Production Build** | `npm run build` | 0 | **PASS** | 58/58 static routes compiled successfully |

---

## 8. VISUAL VERIFICATION & EVIDENCE DOSSIER

All 11 screenshots in `reports/screenshots/recent-work/` and mirrored in the artifact directory were inspected:

| Screenshot | Step / Screen | Viewport | Verified Controls & Visual Integrity |
| :--- | :--- | :---: | :--- |
| `01_step1_programme_selection.png` | Step 1: Programme Selection | 1280x900 | Programme cards, goal indicators, Section 80G badge, continue button. |
| `02_step2_amount_selection.png` | Step 2: Donation Amount | 1280x900 | Preset tiles (₹500 to ₹25,000), custom amount input, selected programme badge. |
| `03a_step3_auth_identity.png` | Step 3: Auth Identity | 1280x900 | Donor full name input, statutory purpose badge, Amount badge. |
| `03b_step3_auth_location.png` | Step 3: Auth Location | 1280x900 | District/city selector (Balangir selected), continue button. |
| `03c_step3_auth_contact.png` | Step 3: Auth Contact | 1280x900 | Mobile number field (+91 prefilled), WhatsApp opt-in toggle, SMS badge. |
| `03d_step3_auth_otp.png` | Step 3: Auth OTP | 1280x900 | 6-cell numeric inputs, SMS indicator, back navigation, resend countdown. |
| `04_step4_donor_details.png` | Step 4: Donor Details | 1280x900 | Prepopulated name & phone, PAN field, address line, DPDP consent checkboxes. |
| `05_step5_review_summary.png` | Step 5: Review Summary | 1280x900 | Donation breakdown, Section 80G URN, Trust PAN, statutory disclosures. |
| `06_step6_payment_remittance.png` | Step 6: Payment Remittance | 1280x900 | SBI account number (33341302498), IFSC (SBIN0001701), UTR reference input. |
| `07_step7_confirmation.png` | Step 7: Confirmation | 1280x900 | Tracking reference, Pending Reconciliation badge, donor receipt advice. |
| `10_mobile_step2_amount.png` | Mobile Viewport | 390x844 | Responsive single-column layout, touch-friendly preset buttons, clean typography. |

### Visual Quality Review
- **Typography & Brand Consistency:** Strictly terracotta (`#A45E44`), forest green (`#283730`), and neutral cream (`#FAF7F2`) palette.
- **Responsiveness:** Zero horizontal overflow; all form fields, buttons, and progress steps resize cleanly on mobile viewports.
- **Privacy & Safety:** All automated screenshot runs use synthetic test fixtures (`Asha Patnaik`, `+919876543210`); zero real donor records or credentials exposed.

---

## 9. COMPLETE CHANGESET RECONCILIATION

### Category A: Production Code Changes
1. `backend/src/main/java/org/mahavirtrust/backend/service/portal/GoogleTokenVerifier.java`
   - *Purpose:* Interface defining `verifyToken(idToken)` and claims record.
   - *Why Changed:* Required to establish cryptographic boundary for Google token verification.
   - *Safe for Commit:* **YES** (Required).
2. `backend/src/main/java/org/mahavirtrust/backend/service/portal/DefaultGoogleTokenVerifier.java`
   - *Purpose:* RS256 token verifier using HTTPS Google JWKS with dynamic caching and strict claims checks.
   - *Why Changed:* Remediates unverified JWT decoding vulnerability.
   - *Safe for Commit:* **YES** (Required).
3. `backend/src/main/java/org/mahavirtrust/backend/service/portal/GoogleOidcService.java`
   - *Purpose:* Core Google OIDC authentication and account-linking service.
   - *Why Changed:* Integrates cryptographic verifier; replaces unauthenticated email linking with security challenge; adds authenticated in-session linking.
   - *Safe for Commit:* **YES** (Required).
4. `backend/src/main/java/org/mahavirtrust/backend/controller/PortalAccountController.java`
   - *Purpose:* Portal account controller.
   - *Why Changed:* Exposes authenticated endpoint `POST /portal/me/link-google`.
   - *Safe for Commit:* **YES** (Required).
5. `src/components/auth/ProgressiveDonorAuth.tsx`
   - *Purpose:* Primary donor authentication UI component.
   - *Why Changed:* Removes unapproved Email OTP fallback/toggles; enforces Mobile Number + SMS OTP and Google Sign-In; adds statutory compliance badge.
   - *Safe for Commit:* **YES** (Required).
6. `src/app/login/page.tsx`
   - *Purpose:* Standalone donor login page.
   - *Why Changed:* Updates MCA CSR-1 Reg number to approved `CSR00081063`; removes email channel queryParam override.
   - *Safe for Commit:* **YES** (Required).
7. `src/app/register/page.tsx`
   - *Purpose:* Standalone donor registration page.
   - *Why Changed:* Updates MCA CSR-1 Reg number to approved `CSR00081063`; removes email channel queryParam override.
   - *Safe for Commit:* **YES** (Required).
8. `src/components/donation/DonationJourney.tsx`
   - *Purpose:* Systematic 7-step donation journey component.
   - *Why Changed:* Reorders step progression to canonical sequence (Programme -> Amount -> Auth -> Details -> Review -> Payment -> Confirmation); eliminates guest bypass button; remediates React 19 ESLint state synchronization via `useSyncExternalStore`.
   - *Safe for Commit:* **YES** (Required).

### Category B: Tests
9. `backend/src/test/java/org/mahavirtrust/backend/PortalAuthAndOtpSecurityTests.java`
   - *Purpose:* Security integration tests for portal authentication.
   - *Why Changed:* Adds comprehensive tests for RS256 verification, invalid signatures, expired tokens, missing subjects, account takeover prevention, and account linking conflict handling.
   - *Safe for Commit:* **YES** (Required).

### Category C: Audit Documents
10. `docs/audits/MECT_DONOR_AUTH_PHASE_1_1_REMEDIATION_AND_ACCEPTANCE.md`
    - *Purpose:* Phase 1.1 acceptance audit. Evidence-only. Safe for commit.
11. `docs/audits/MECT_DONOR_AUTH_PHASE_1_2_FINAL_VERIFICATION.md`
    - *Purpose:* Phase 1.2 final verification audit report. Evidence-only. Safe for commit.

### Category D: Visual Evidence
12. `reports/screenshots/recent-work/` (11 high-res screenshots)
    - *Purpose:* Visual proof of donation flow and mobile responsiveness. Evidence-only.

### Category E: Temporary Development & QA Tooling
13. `scripts/capture_donation_flow_screenshots.mjs`
    - *Purpose:* Playwright automation script to generate visual verification evidence.
    - *Why Changed:* Updated to capture the canonical 7-step donation flow with mock network routes. Safe for commit as developer regression tooling.

---

## 10. PRODUCTION READINESS & EXTERNAL CONFIGURATION PREREQUISITES

The code and database migration are fully implemented and verified locally. The following external configuration steps are required by the repository owner prior to production VPS activation:

1. **Google OAuth 2.0 Web Client ID:**
   - Configure `GOOGLE_CLIENT_ID` in production `.env` and `app.google.client-id` in Spring Boot `application-prod.yml`.
   - Add `https://mect.org.in` to Authorized JavaScript Origins in Google Cloud Console.
2. **SMS Gateway Credentials (DLT Approved):**
   - Configure `SMS_PROVIDER=MSG91` (or `TWILIO`) in production backend environment.
   - Supply `SMS_MSG91_AUTH_KEY` and registered DLT `SMS_MSG91_TEMPLATE_ID`.
3. **Database Migration Execution:**
   - Flyway migration `V20__google_oidc_and_donor_identity_linking.sql` will execute automatically upon Spring Boot production container start.

---

## 11. FINAL VERDICT

# **VERIFIED — READY FOR OWNER COMMIT REVIEW**

All 10 verification dimensions have passed without regressions:
- Cryptographic RS256 token verification: **VERIFIED**
- OTP security and rate limiting: **VERIFIED**
- Canonical donor identity and anti-takeover: **VERIFIED**
- Canonical 7-step donation journey: **VERIFIED**
- Flyway V20 migration idempotence: **VERIFIED**
- 153/153 backend tests passing: **VERIFIED**
- Frontend quality gates (TypeScript, ESLint, Secrets, Build): **VERIFIED (0 errors)**
- Visual evidence and responsiveness: **VERIFIED (11 screenshots)**
- Changeset cleanly reconciled: **VERIFIED**

**Stopping here per safety mandate. No automated Git commit has been created. Awaiting owner instructions.**
