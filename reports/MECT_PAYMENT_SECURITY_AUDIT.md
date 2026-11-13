# MECT Payment Security & Reconciliation Audit

**Date:** 2026-11-12  
**Branch:** `motion-ui`

## 1. Cashfree Primary Gateway Controls
- **Server-side order creation & validation:** `/public/donations/initiate` validates active programme (`GENERAL_FUND` gated by admin `generalFundEnabled`), configured `minAmount` / `maxAmount`, and `cashfreeEnabled` before calling Cashfree PG (`2023-08-01`).
- **Secret isolation:** `CASHFREE_SECRET_KEY` and webhook secrets remain exclusively in backend environment configuration and are never stored in `payment_configurations` or returned to frontend clients.
- **Authenticated settlement:** Receipts (`DonationReceipt`) and `SUCCESSFUL` status transitions occur exclusively via verified Cashfree webhook events (`/api/v1/webhooks/payments/cashfree` with HMAC + timestamp verification and `payment_events` deduplication) or authenticated server-side order status checks (`verifyCashfreeOrderStatus`).
- **Intelligent failure fallback:** Pending/unknown states prompt status reconciliation before retrying; definitive failures preserve the original `donationReference` and offer either Cashfree retry or switching to verified SBI transfer.

## 2. SBI Direct UPI / QR / Bank Transfer Controls
- **No false auto-success:** Submitting a UTR via `POST /public/donations/sbi/submit-utr` creates a `Donation(status="PENDING_VERIFICATION", paymentMethod="SBI_DIRECT")`, `Payment(status="PENDING_VERIFICATION")`, and `ManualBankTransferClaim(status="UTR_SUBMITTED")`. Zero receipts are issued on submission.
- **Unique UTR deduplication:** UTR strings are normalized (`A-Z0-9`, uppercase) and enforced with a database `UNIQUE` constraint on `manual_bank_transfer_claims.utr_normalized`. Duplicate submissions return `409 Conflict` (`DuplicateResourceException`), record an audit event (`MANUAL_SBI_UTR_DUPLICATE`), and never create a second settled donation.
- **Staff verification & audit trail:** Only `SUPER_ADMIN`, `ADMIN`, `FINANCE_OFFICER`, or `DONATION_VERIFICATION_OFFICER` can transition claims to `UNDER_REVIEW`, `NEEDS_REVIEW`, `REJECTED`, or `VERIFIED`. `VERIFIED` atomically settles the `Payment` and `Donation`, writes `PaymentReconciliationLog` + `AuditLog`, grants `ROLE_DONOR` if linked, generates the PDF receipt, and enqueues the receipt email outbox.

## 3. Statutory Honesty
- `statutoryClaimApproved` defaults to `false` in `V11`. Both `/donate` review disclosures and generated PDF receipts render factual institutional acknowledgement text without unverified 80G promises unless explicitly verified and enabled by MECT administration.

