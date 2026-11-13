# PHASE 0 — FORENSIC INVESTIGATION REPORT & IMPLEMENTATION SEQUENCE

- **Repository:** `https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git`
- **Active Local Branch / HEAD:** `motion-ui` @ `cb5b554`
- **Production Branch / Stage 1 Commit:** `feat/multi-sector-ngo-repositioning` (`155dd00` deployed in Stage 1 per `MECT_CASHFREE_FINAL_PRODUCTION_READINESS_REPORT.md`; `9c7033e` tip; `origin/main` @ `a630ec7`)
- **Divergence:** `motion-ui` is `37` commits ahead, `0` commits behind `feat/multi-sector-ngo-repositioning`. All `155dd00` Cashfree & `V10` changes are already present on `motion-ui`.
- **Working Tree:** Contains pre-existing user/QA artifacts (`MECT_*.md`, `scratch/*`, `src/*.jpg/*.jpeg`, `reports/phase-*.md`, etc.) which are preserved untouched.
- **Backend Baseline Test Run:** `mvn -f backend/pom.xml test -B` -> **`54/54` tests passed, `0` failures, `0` errors, `0` skipped** (H2 `MODE=PostgreSQL`, Flyway `V1–V10`).

---

## 1. Existing Functionality Verified in Checkout

- **Backend (`backend/`, Java 21 / Spring Boot / PostgreSQL / Flyway `V1–V10`):**
  - `donations`, `donation_programmes`, `payments`, `payment_events`, `payment_reconciliation_logs`, `donation_receipts` (`V8`, `V10` with `uq_payments_provider_order` and `@Version` optimistic locking).
  - `portal_users`, `portal_user_roles`, `portal_user_profiles`, `portal_verified_contacts`, `otp_verifications`, `portal_refresh_tokens`, `communication_consents`, `notification_preferences` (`V7`).
  - `notification_outbox`, `notification_delivery_logs` (`V9`) with Resend email integration.
  - `CashfreePaymentGatewayService`, `CashfreePaymentController` (`/payments/cashfree/create-order`, `/status/{orderId}`, `/verify`), `WebhookController` (`/webhooks/payments/cashfree` with HMAC-SHA256 + 300s timestamp replay guard + `provider_event_id` deduplication).
  - `DonationController` (`/public/donations/programmes`, `/gateway-status`, `/initiate`, `/{ref}/status`, `/verify-checkout`).
  - `PortalAuthController` + `PortalAccountController` (`/portal/me/dashboard`, `/me/profile`, `/me/contacts/verify-change`, `/me/preferences`, `/me/deletion-request`, `/receipts/{receiptNumber}/pdf`).
  - `ReceiptPdfService` (OpenPDF institutional PDF receipt + SHA-256).
  - `AdminDonorController` (`/admin/donors`, `/admin/donations`, `/reconcile`, `/csv`, `/outbox`, `/programmes`).
- **Frontend (`src/`, Next.js 16 / React 19 / TypeScript):**
  - `/donate` (`src/app/donate/page.tsx`) + `SmartDonationCheckout.tsx` + `SbiDonationSection.tsx` + `/portal/login`, `/portal/dashboard`, `/portal/profile`, `/portal/welcome` + `/admin/*`.

## 2. Missing Functionality & Conflicting Sources of Truth

1. **Fragmented `/donate` & Homepage Donation Duplication:**
   - `/donate` renders three separate uncoordinated blocks: `SbiDonationSection` (static details), `#receipt-claim` (`submitInquiry` creating a generic `PublicInquiry` instead of a structured manual bank transfer claim), and `SmartDonationCheckout` at the bottom.
   - Homepage `src/app/page.tsx` embeds a second full donation section (`#donate` with `SbiDonationSection` + `EligibilityCalculator`), competing with `/donate`.
2. **Manual SBI Transfer State Machine Missing (`PENDING_TRANSFER → UTR_SUBMITTED → UNDER_REVIEW → VERIFIED | REJECTED | DUPLICATE_REFERENCE | NEEDS_REVIEW`):**
   - Currently `#receipt-claim` logs a `PublicInquiry` rather than a `Donation` + `ManualBankTransferClaim` with unique UTR deduplication, amount/date validation, optional proof metadata, admin verification, audit trail, and unified `DonationReceipt` PDF + email outbox generation upon approval.
3. **Guest Donation Claiming / Account Linking Missing:**
   - Verified guest donations cannot yet be claimed/linked by an authenticated donor in `/portal/dashboard` via OTP-verified email/mobile ownership checks.
4. **Configurable Admin Payment Settings & Statutory Eligibility Missing:**
   - Suggested amounts, min/max amounts, payment method toggles/order, fallback flags, SBI QR URL/bank instructions, and FY statutory eligibility (`80G` status/year/dates/claim approval) are hardcoded rather than DB-backed (`payment_configurations`, `statutory_eligibility_configs`) and editable from `/admin`.
5. **SaaS-Style CMS, Media Library & Expanded RBAC Missing:**
   - No `content_pages` / `content_revisions` / `media_assets` backend/admin CMS for Homepage, Programmes, Navigation, or Media Library; `Role.java` lacks `ROLE_CONTENT_ADMIN`, `ROLE_DONATION_VERIFICATION_OFFICER`, `ROLE_SUPPORT_ADMIN`, `ROLE_AUDITOR`.
6. **Homepage & Public IA Simplification:**
   - Homepage (`1,510` lines) mixes scholarship eligibility calculators, full donation blocks, inquiry/volunteer forms, and repeated statutory text.

## 3. Risks & Mitigations

- **Live Cashfree Activation Guard:** Preserve fail-closed `CASHFREE_APP_ID`/`CASHFREE_SECRET_KEY` environment checks and never deploy/flip `PAYMENT_PROVIDER` without passing gates and explicit authorization.
- **Database Safety:** All new tables/columns added strictly via additive, rollback-safe `V11__...sql` Flyway migration (H2 `MODE=PostgreSQL` + PostgreSQL 18 compatible).
- **Zero Duplicate Receipts:** Enforce `donation_receipts` uniqueness per `donation_id` and issue receipts strictly after server-side Cashfree webhook/gateway verification or authorized Admin SBI verification.

## 4. Implementation Sequence

1. **DB & Backend Core (`V11` migration + Entities + Services + Controllers):**
   - `PaymentConfiguration` (min/max, presets, method toggles/order, QR image path, bank info, statutory eligibility config) + public read endpoint + super-admin/finance write with audit log.
   - `ManualBankTransferClaim` + `DonationLifecycleService` SBI UTR workflow (`PENDING_TRANSFER → UTR_SUBMITTED → UNDER_REVIEW → VERIFIED / REJECTED / DUPLICATE_REFERENCE / NEEDS_REVIEW`) + unified PDF receipt & email outbox on verification.
   - Guest donation linking (`POST /portal/me/donations/claim`) with verified email/phone ownership check.
   - Expanded RBAC roles (`Role.java`) + `ContentPage`, `ContentRevision`, `MediaAsset` CMS & media library APIs.
2. **Unified `/donate` 5-Step Experience + Entry Point Consolidation:**
   - Single canonical `/donate` 5-step wizard (Programme → Amount from admin config → Donor Details → Review → Cashfree Primary + Intelligent SBI Fallback + Structured UTR Claim).
   - Redirect/route all Donate CTAs (`Header`, `Footer`, `Homepage`, `Portal`) cleanly to `/donate`.
3. **Donor Portal Enhancements (`/portal/dashboard`):**
   - Add Overview, My Donations, Payment History, Download Receipts, Pending Payment Verification, Claim Guest Donation, Profile, Preferences, Help & Support, Account Security.
4. **SaaS-Style Admin Panel (`/admin`):**
   - Enhanced Dashboard metrics, Donations & SBI UTR Verification Queue, Payment & Statutory Settings (`/admin/settings`), CMS & Media Library (`/admin/cms`, `/admin/media`), RBAC enforcement.
5. **Homepage & Public Content Simplification + Content Audit (`reports/MECT_CONTENT_AUDIT.md`).**
6. **Comprehensive Backend, Frontend & Playwright E2E Tests (Scenarios A–G) + Security Audit + Final Reports.**

