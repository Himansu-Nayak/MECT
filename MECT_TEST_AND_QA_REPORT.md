# MECT — Automated Test & Quality Assurance Report

**Verification Run Date:** 2026-11-11

## 1. Backend Test Execution (`cd backend && mvn test -B`)
- **Result:** `Tests run: 43, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`)
- **Runtime Profile:** `test` (`H2` in `MODE=PostgreSQL` with Flyway `V1`–`V9`, JVM timezone locked to `UTC`)
- **Test Suites Executed:**
  1. `AuthenticationAndSecurityTests` (admin JWT auth, brute-force lockout, token refresh rotation, RBAC, SQLi defense)
  2. `MahavirTrustBackendApplicationTests` (context boot, health, public inquiry & volunteer submission validation)
  3. `ScholarshipApplicationTests` (application workflow, tracking, optimistic locking, dashboard stats)
  4. `VolunteerConsentAndStatusSecurityTests` (consent versioning, status transition validation, optimistic locking, audit rollback)
  5. `PortalAuthAndOtpSecurityTests` (HMAC-SHA256 OTP hashing & single-use burn, cooldown & max-attempts lockout, fail-closed `SMS_PROVIDER=NONE`, anti-enumeration, verified contact change deduplication, strict `PORTAL` vs `/admin/**` RBAC isolation)
  6. `DonationPaymentReceiptWorkflowTests` (5 verified programmes check, Dynamic UPI QR + Order initiation in sandbox profile, spoofed Razorpay webhook `401` rejection, signed `payment.captured` HMAC-SHA256 settlement -> OpenPDF `%PDF-` receipt generation -> `ROLE_DONOR` promotion, idempotent replay defense, anonymous donation attribution, email outbox retry recovery, cross-user `403` receipt download protection, and Finance Officer vs Coordinator CSV RBAC enforcement)

## 2. Frontend Typecheck, Lint, Build & Regression Checks
- `npx tsc --noEmit`: Passed (`0` errors)
- `npm run lint`: Passed (`0` errors, `0` warnings)
- `npm run build`: Passed (`next build --webpack`, all `36/36` static/app routes compiled cleanly including `/portal/login`, `/portal/profile`, `/portal/dashboard`, `/donate`, and `/admin/donors`)
- `node scratch/test-all-phases-regression.mjs`: `16 Passed, 0 Failed (Total 16 Suites)` including `test-phase9-donate.mjs` (`9/9` assertions preserved on `/donate`).

## 3. Browser & Responsive Inspection (`chrome-devtools-mcp` on `http://localhost:3000`)
- Verified `/portal/login` and `/donate#smart-donate`: `0` console errors, `0` horizontal overflow (`scrollWidth <= clientWidth`), visual inspection confirmed clean Warm Cream/Terracotta/Forest Charcoal hierarchy, intact SBI bank fallback alongside Smart Donation Checkout, and mobile-first OTP card ordering.
- Verified unauthenticated client route guards:
  - `/portal/dashboard` redirects to `/portal/login?next=/portal/dashboard`
  - `/admin/donors` redirects to `/admin/login`

## 4. Known Test & Verification Boundaries
- **Mocked / Sandbox Scope:** Backend payment, SMS, email, and WhatsApp provider tests run against mocked beans (`@MockitoBean`) and sandbox config without transmitting real external SMS messages, Resend API emails, Razorpay live charges, or Meta WhatsApp template messages.
- **UI End-to-End Flow Against Live Database:** Unauthenticated guards, responsive layout, and checkout UI were verified in headless Chrome against Next.js production build; full interactive browser OTP-to-PDF-download session clickthrough requires starting Spring Boot against PostgreSQL with configured provider keys or sandbox profile.

