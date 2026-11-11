# MECT — Razorpay Webhook & UPI Audit Report

## A. Findings from the MECT Repository
1. **Endpoint & Controller:** Implemented at `WebhookController.handleRazorpayWebhook` (`POST /api/v1/webhooks/payments/razorpay`).
2. **UPI & Payment Architecture Unified Under Razorpay (`PaymentGatewayProvider`):**
   - MECT has **one** unified payment integration ([`RazorpayPaymentGatewayService`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/payment/RazorpayPaymentGatewayService.java)):
     - Creates Razorpay Orders (`POST https://api.razorpay.com/v1/orders`) and single-use fixed-amount Dynamic UPI QRs (`POST https://api.razorpay.com/v1/payments/qr_codes`, `type="upi_qr"`, `usage="single_use"`), rendered via ZXing SVG (`DynamicQrSvgService`) + frontend 4.5s status polling (`GET /api/v1/public/donations/{ref}/status`) alongside verified SBI manual remittance.
   - **No separate Cashfree or standalone NPCI/UPI webhook exists or is needed:** Razorpay's webhook endpoint handles **both** Standard Checkout payments (`payment.captured`, `order.paid`) and Dynamic UPI QR payments (`qr_code.credited`, `qr_code.closed`).
3. **Cryptographic Verification & Fail-Closed Confirmation ([`DonationLifecycleService`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java)):**
   - Verifies `X-Razorpay-Signature` as lowercase hex HMAC-SHA256 of raw request body against `RAZORPAY_WEBHOOK_SECRET`. Rejected payloads are recorded in `payment_events` (`REJECTED`) + `audit_logs` and return `HTTP 401`.
   - Browser navigation or polling **never** sets `SUCCESSFUL`; only a verified Razorpay webhook or HMAC-SHA256 verified `/verify-checkout` signature transitions `Donation` & `Payment`, grants `ROLE_DONOR`, generates deterministic OpenPDF receipt (`MECT-RCPT-...`), logs `PaymentReconciliationLog`, and enqueues idempotent receipt emails.
4. **Remediation Applied Locally (Phase 11):** Added `REFUND_REF:<refundId>` deduplication so subscribing to both `refund.created` and `refund.processed` cannot double-add `refundedAmount`, and mapped malformed post-signature JSON cleanly to `400 Bad Request`.
5. **Reconciliation & UTR Matching:** Currently tracks Razorpay `providerOrderId`, `providerQrId`, and `providerPaymentId`. Manual SBI UTR bank transfer claims continue to route via the existing `/donate` SBI transfer disclosure + inquiry submission flow (manual staff verification).

## B. Findings from Official Razorpay Documentation
- Signature header: `X-Razorpay-Signature` = HMAC-SHA256 hex digest of raw request body using webhook secret.
- Deduplication header: `x-razorpay-event-id`.
- Endpoint SLA: Respond HTTP `2XX` within **5 seconds**.
- Relevant supported events verified against code handlers: `payment.captured`, `order.paid`, `qr_code.credited`, `payment.failed`, `qr_code.closed`, `refund.processed` (and `refund.created` deduplicated safely).

## C. Production Readiness & Blockers
- **Code Ready; Credentials Required:** `/api/v1/public/donations/gateway-status` currently returns `configured: false` because `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` are not configured in `/opt/mect/backend/.env`. Do not configure Razorpay dashboard live webhooks until Merchant KYC & API keys are ready.

