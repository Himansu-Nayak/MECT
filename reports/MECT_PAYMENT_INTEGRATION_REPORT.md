# MECT — Payment Gateway, Dynamic UPI QR & Donation Lifecycle Report

## Classification Summary
- **Implemented:** `SmartDonationCheckout.tsx` (`/donate`), `DonationController` (`/public/donations/programmes`, `/public/donations/gateway-status`, `/public/donations/initiate`, `/public/donations/{ref}/status`, `/public/donations/{ref}/verify-checkout`), `RazorpayPaymentGatewayService`, `DynamicQrSvgService` (ZXing SVG generator), `DonationLifecycleService`, and `WebhookController` (`/webhooks/payments/razorpay`).
- **Tested successfully (sandbox/mocked webhook verification):** Initiating `UPI_QR` & `GATEWAY_CHECKOUT` donations, rejecting unverified/spoofed `X-Razorpay-Signature` webhooks (`401`), settling via valid HMAC-SHA256 webhook -> issuing receipt -> promoting donor to `ROLE_DONOR`, idempotent duplicate webhook replay (`no duplicate receipt`), and anonymous public attribution.
- **Requires provider credentials:** Live Razorpay Orders & Dynamic UPI QR creation (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` are NOT yet configured in `backend/.env`).
- **Requires organisational confirmation:** Activating `PAYMENT_SANDBOX_MODE=false` with live merchant KYC-approved Razorpay credentials and configuring the Razorpay webhook URL (`https://<api-domain>/api/v1/webhooks/payments/razorpay`).

## Key Safeguards
1. **Fail-Closed Without Live Credentials:** When `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are blank and `app.payment.sandbox-mode=false`, `/public/donations/gateway-status` transparently reports `configured: false` and `/public/donations/initiate` returns HTTP `503` instead of generating fake live QR codes, while the verified **State Bank of India (`33341302498`, `SBIN0001701`)** remittance panel on `/donate` remains 100% functional.
2. **One-Time Contributions Only:** Database schema and DTO validation enforce `frequency = ONE_TIME` without unapproved recurring/mandate logic.
3. **Server-Side Cryptographic Verification:** Client navigation cannot mark any payment `SUCCESS`. Only a verified HMAC-SHA256 Razorpay webhook (`payment.captured` / `qr_code.credited` / `order.paid`) or HMAC-verified Razorpay checkout signature settles a donation, records an idempotent row in `payment_events` (`provider_event_id` unique), appends a `payment_reconciliation_logs` row, issues the PDF receipt, and upgrades the authenticated portal user with `ROLE_DONOR`.

