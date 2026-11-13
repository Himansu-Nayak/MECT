# MECT SaaS-Style Admin Panel & CMS Report

**Date:** 2026-11-12  
**Branch:** `motion-ui`

## 1. Expanded RBAC Roles (`Role.java` & `SecurityConfig.java`)
- `ROLE_SUPER_ADMIN` — Full administrative, financial, CMS, user, and audit access.
- `ROLE_ADMIN` / `ROLE_TRUSTEE` — Operational governance, donors, and ledger access.
- `ROLE_FINANCE_OFFICER` — Financial summary, CSV export, SBI UTR verification, payment/80G configuration.
- `ROLE_DONATION_VERIFICATION_OFFICER` — View donation ledger and review/verify SBI UTR claims (`/admin/manual-claims/**`).
- `ROLE_CONTENT_ADMIN` — Draft, preview, publish CMS pages (`/admin/cms/**`) and manage Media Library (`/admin/media/**`); blocked (`403`) from `/admin/payment-config`.
- `ROLE_SUPPORT_ADMIN` — Support/inquiry administration.
- `ROLE_AUDITOR` — Read-only access to financial summaries, SBI UTR queue, payment config, and CMS; blocked (`403`) from mutating claims or settings.

## 2. Admin Modules Implemented
1. **Executive Overview (`/admin`):** Live `AdminDonationSummaryDto` (`totalVerifiedAmount`, `last30DaysVerifiedAmount`, Cashfree vs SBI split, `utrReviewQueueCount`, pending/failed gateway counts) alongside Scholarship, Volunteer, and Inquiry metrics.
2. **Donations & SBI UTR Verification Queue (`/admin/donors`):**
   - Tabbed interface: `Donors & Supporters`, `Donations & Reconciliation`, `SBI UTR Verification Queue`, `Notification Outbox`, `Programmes & Campaigns`.
   - Staff can filter claims (`ALL`, `UTR_SUBMITTED`, `UNDER_REVIEW`, `NEEDS_REVIEW`, `VERIFIED`, `REJECTED`), enter `bankStatementReference` and `verificationNotes`, and verify claims to deterministically generate PDF receipts and enqueue email confirmations.
3. **Payment, Limits & Statutory Settings (`/admin/settings`):**
   - Admin-configurable toggles for Cashfree, SBI Direct, Intelligent Fallback, and General Fund (`GENERAL_FUND`).
   - Configurable `minAmount`, `maxAmount`, and `presetAmounts`.
   - Editable SBI account details, UPI ID, QR image URL, beneficiary verification warning, FY, 80G status, `statutoryClaimApproved` flag, URNs, validity dates, and public/receipt disclosure text.
   - Zero gateway secret keys stored in database or exposed to frontend.
4. **CMS Pages (`/admin/cms`) & Media Library (`/admin/media`):**
   - `ContentPage` + `ContentRevision` entities supporting `DRAFT -> DRAFT_PENDING_PUBLISH -> PUBLISHED` workflow, draft preview, and revision history restoration.
   - `MediaAsset` database storage (PNG/JPEG/WEBP/SVG up to 2 MB) with alt text, focal point, copyable `/api/v1/public/cms/media/{assetKey}` URL, and audit logging.

