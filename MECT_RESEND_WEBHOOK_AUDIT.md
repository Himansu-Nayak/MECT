# MECT — Resend Webhook Audit Report

## A. Findings from the MECT Repository
1. **Endpoint & Controller:** Implemented at `WebhookController.handleResendWebhook` (`POST /api/v1/webhooks/resend` under `server.servlet.context-path=/api/v1`).
2. **Raw Request Body Preservation:** Uses Spring MVC `@RequestBody String rawPayload`, preserving exact payload bytes before JSON parsing.
3. **Svix Signature Verification ([`ResendEmailService.verifyWebhookSignature`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java)):**
   - Supports Base64-decoded `whsec_` signing secrets (and plain UTF-8 secrets) and compares `Base64(HMAC-SHA256(svix-id + "." + svix-timestamp + "." + rawPayload))` using constant-time `MessageDigest.isEqual` across space-delimited `v1,<sig>` tokens.
   - **Remediation Applied Locally (Phase 11):** Added strict `±300 seconds` (5-minute) `svix-timestamp` replay protection, `svix-id` deduplication via `NotificationDeliveryLogRepository.existsByWebhookEventId(svixId)`, and automatic `NotificationOutbox.lastError` flagging when `email.bounced` or `email.complained` events arrive.
4. **Functional Boundary — Are Resend Webhooks Needed to Send OTPs?**
   - **Works WITHOUT webhooks:** OTP email dispatch (`POST /api/v1/portal/auth/request-otp`), OTP verification, welcome emails, profile completion emails, and receipt PDF attachments work synchronously/via outbox using `RESEND_API_KEY` alone (`Message-ID` returned synchronously on `POST https://api.resend.com/emails`).
   - **Requires Resend webhook (`RESEND_WEBHOOK_SECRET`):** Asynchronous post-send lifecycle tracking in `notification_delivery_logs` (`email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`).

## B. Findings from Official Resend Documentation
- Resend webhooks are powered by Svix and transmit headers `svix-id`, `svix-timestamp`, and `svix-signature` with a default **5-minute timestamp tolerance** (`±300s`).
- Resend Dashboard creation uses **Webhooks -> Add Endpoint** with **Endpoint URL**, **Events** selection (`email.sent`, `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`; optional `email.opened`/`email.clicked`), and outputs a `whsec_...` **Signing Secret**.

## C. Engineering Recommendations
- Subscribe **only** to `email.delivered`, `email.delivery_delayed`, `email.bounced`, and `email.complained` (optionally `email.sent`). Avoid subscribing to `email.opened` / `email.clicked` unless click/open tracking is explicitly enabled and disclosed in MECT's privacy policy.
- Deploy the local `ResendEmailService` + `NotificationOutboxService` hardening commit to the VPS and set `RESEND_WEBHOOK_SECRET=whsec_...` in `/opt/mect/backend/.env` when ready to enable delivery tracking.

