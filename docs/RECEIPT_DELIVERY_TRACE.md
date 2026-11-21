# MECT Receipt Generation & Delivery Trace

## 1. Lifecycle Overview
When an administrator reviews and marks a manual direct SBI transfer / UPI claim as **VERIFIED**:
1. **Endpoint**: `POST /api/v1/admin/donations/claims/{claimId}/verify` (handled in `AdminDonorController.java`).
2. **Service Method**: `DonationLifecycleService.reviewManualSbiClaim(claimId, ClaimReviewAction.VERIFY, ...)`:
   - Updates `ManualBankTransferClaim` status to `VERIFIED`.
   - Updates or creates associated `Payment` (`provider = PaymentProvider.SBI_DIRECT`) status to `SUCCESSFUL`.
   - Updates or creates associated `Donation` status to `SUCCESSFUL`.
   - Triggers `grantDonorRoleAndIssueReceiptAndNotify(...)`.

## 2. Receipt Generation & Storage
- Deterministic PDF generation is executed by `ReceiptPdfService.generateReceiptPdf(receipt, donation, payment)`:
  - Generates serialized PDF bytes containing official MECT trust identification, PAN `AADTM5474F`, donor name, address, PAN, UTR reference, amount, and programme allocation.
- A `DonationReceipt` entity is persisted in PostgreSQL table `donation_receipts`:
  - Stores `receipt_number`, `receipt_date`, `receipt_pdf` (byte array BLOB), and foreign keys to `donation_id`.
  - The receipt is permanently recorded in the database and immutable.

## 3. Email Outbox & Missing `RESEND_API_KEY` Behavior
- The email dispatch is decoupled via `NotificationOutboxService.enqueueEmail(...)`:
  - A record is inserted into `notification_outbox` with `status = 'PENDING'` and `nextRetryAt = Instant.now()`.
- **Scheduled Dispatch**:
  - The outbox worker picks up pending rows and calls `ResendEmailService.sendEmailWithAttachment(...)`.
- **Behavior when `RESEND_API_KEY` is missing or blank**:
  - `ResendEmailService` checks `apiKey == null || apiKey.trim().isEmpty()`.
  - Returns `ProviderDispatchResult.unconfigured("RESEND_API_KEY is not configured.")`.
  - `NotificationOutboxService` marks the outbox item as:
    - `status = "REQUIRES_PROVIDER_CONFIG"`
    - `nextRetryAt = null`
  - **Does claim verification fail?** **NO**. Claim verification is already committed (HTTP 200). The donation and receipt PDF remain securely persisted.
  - **Does the outbox retry forever?** **NO**. `nextRetryAt = null` prevents the scheduled worker from re-querying or retrying the item endlessly.

## 4. Manual Fallback for Trust Secretariat / Admin
If `RESEND_API_KEY` is not yet configured:
1. **Admin Page**: Navigate to `/admin/donors` (Donors & Contributions Management).
2. **Verified Records Table**: In the donations list, locate the donor's record. Every record with a generated receipt displays a **PDF** download button.
3. **Endpoint**: Clicking **PDF** issues `GET /api/v1/admin/receipts/{receiptNumber}/pdf`, handled by `AdminDonorController.downloadReceiptPdf`, which returns `application/pdf` with `Content-Disposition: attachment; filename="MECT-Receipt-{receiptNumber}.pdf"`.
4. **Manual Delivery**: The administrator downloads the PDF and emails it directly to the donor from the Trust secretariat email (`mect.balangir@gmail.com`).
5. **Outbox Recovery**: Once `RESEND_API_KEY` is added to production environment, administrators can trigger the "Retry" action in `/admin/donors` outbox monitor to automatically dispatch any stalled emails.
