# MECT — Resend Transactional Email Integration Report

## Classification Summary
- **Implemented:** `ResendEmailService` (`RestClient` HTTP integration to `https://api.resend.com/emails` with Base64 PDF attachment support and idempotency/tags), `EmailTemplateRenderer` (branded OTP HTML + Donation Receipt HTML using the Terracotta/Forest/Cream palette), `NotificationOutboxService` (`@Scheduled` worker with retries & dead-letter transition), `WebhookController` (`/webhooks/resend` Svix HMAC signature verification + `notification_delivery_logs`), and `/admin/donors` Notification Outbox monitor + manual Retry button.
- **Tested successfully (with mocked `EmailProvider` / outbox test):** Outbox enqueueing on receipt issuance, retry recovery from transient provider failure (`FAILED` -> `SENT` on retry), and delivery log creation.
- **Requires provider credentials:** Live email sending requires setting a newly rotated `RESEND_API_KEY` and `RESEND_WEBHOOK_SECRET` in the server's untracked runtime environment (`backend/.env`).
- **Requires organisational confirmation:** Rotate the Resend API key previously pasted in prompt text via the Resend dashboard, verify sender addresses (`notifications@mect.org.in`, `donations@mect.org.in`, `receipts@mect.org.in`, `support@mect.org.in`) against the verified `mect.org.in` DNS DKIM/SPF domain, and subscribe the `/api/v1/webhooks/resend` endpoint for `email.delivered`/`email.bounced`/`email.complained`.

