# MECT — Automated Receipt & Document Generation Report

## Classification Summary
- **Implemented:** `ReceiptPdfService` using OpenPDF (`com.github.librepdf:openpdf:2.0.3`), deterministic unique receipt numbering (`MECT-RCPT-<Year>-<Id>`), SHA-256 integrity hashing (`pdf_sha256`), BYTEA storage in `donation_receipts`, authenticated portal download (`GET /api/v1/portal/receipts/{receiptNumber}/pdf`), and admin download (`GET /api/v1/admin/receipts/{receiptNumber}/pdf`).
- **Tested successfully:** Binary PDF generation (`%PDF-` signature validation), idempotent single-receipt issuance on webhook replay, cross-user ownership isolation (`403` when another portal user attempts download), and frontend download action.
- **Requires legal or organisational confirmation:** Section 80G tax-exemption status for FY 2026-27 (records in `src/lib/config.ts` establish 80G approval under URN `AADTM5474FF20241` for FY 2023-24 through FY 2025-26 only).

## Statutory Accuracy Safeguard
`DonationLifecycleService.FACTUAL_STATUTORY_NOTE` embeds MECT's verified permanent Trust particulars (**Balangir Trust Deed Doc No. 40311302194**, **Trust PAN `AADTM5474F`**, **MCA CSR-1 `CSR00081063`**) and explicitly labels each PDF an **Institutional Payment Receipt & Acknowledgement** rather than claiming unverified FY 2026-27 Section 80G deduction eligibility.

