# MECT Unified Donor Experience Report

**Date:** 2026-11-12  
**Branch:** `motion-ui`

## 1. Canonical 5-Step `/donate` Journey (`UnifiedDonationExperience.tsx`)
1. **Step 1 — Select Programme:** Dynamically loads active programmes from `GET /public/donations/config` (respecting admin `generalFundEnabled`).
2. **Step 2 — Select Amount:** Renders admin-configured preset amounts (default `₹500`, `₹1,000`, `₹1,500`, `₹3,000`, `₹5,000`, `₹10,000`) plus custom amount validated against admin `minAmount`/`maxAmount`.
3. **Step 3 — Donor Information:** Minimal required fields (Full Name + Email for receipt delivery); optional Mobile, PAN, Postal Address, Dedication, Anonymous public display toggle, and Privacy/Communication consent. Auto-fills when signed into the Donor Portal without blocking guest checkout.
4. **Step 4 — Review:** Displays selected programme, amount, donor details, payment channel selector (`Cashfree Online Checkout` or `SBI Direct UPI / Bank Transfer`), processing notice, and configurable statutory eligibility disclosure.
5. **Step 5 — Payment & Verification:** Launches Cashfree modal/checkout with intelligent reconciliation/fallback on failure, or displays the official SBI QR (`33341302498`, `SBIN0001701`, `86971610172@sbi`), copy buttons, QR download, beneficiary verification warning, and structured UTR claim submission.

## 2. Donor Portal (`/portal/dashboard`)
- **Overview KPIs:** Verified contributions total, downloadable receipts count, pending verification count, communication & security summary.
- **Claim Guest Donations:** `POST /portal/me/donations/claim` matches unlinked guest donations (`portal_user_id IS NULL`) against the user's OTP-verified email/phone contacts and promotes the account to `ROLE_DONOR` when verified donations are linked.
- **SBI Transfer Verification Tracker:** Displays `UTR_SUBMITTED -> UNDER_REVIEW -> VERIFIED` status and staff notes.
- **Unified Ledger & PDF Receipts:** Filterable/searchable history across both Cashfree and verified SBI donations with authenticated PDF receipt downloads (`/portal/receipts/{receiptNumber}/pdf`).

