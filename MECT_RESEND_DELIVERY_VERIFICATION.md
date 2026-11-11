# MECT — Resend Email Delivery & Integration Verification Report

## Integration & Security Status
- **Server-Side Only Architecture:** Browser code calls only Spring Boot (`/api/v1/portal/auth/*`); [`ResendEmailService`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java) calls `https://api.resend.com/emails` server-side with `Authorization: Bearer <RESEND_API_KEY>`, `5s` connect / `10s` read timeouts, and zero client exposure.
- **Credential & Environment Loading:** Loaded via gitignored `backend/.env` (`.gitignore:40`, never committed to Git or bundled in `.next`).
- **Authorized Domain & Sender Identity:** `MECT Notifications <notifications@mect.org.in>` (`mect.org.in`).
- **API Key Scope Check:**
  - `GET https://api.resend.com/domains` -> `HTTP 401` (key is strictly scoped to **Sending access**, not admin APIs).
  - Direct probe `POST https://api.resend.com/emails` -> **`HTTP 200 OK`**, accepted ID `01a1c6dd-1459-7887-a10a-20106e6f25bc`.
  - Live `/portal/login` backend dispatch (`delivered@resend.dev`) -> **`HTTP 200 OK`**, `Resend email dispatched successfully (messageId=01a1c6f6-aa0f-729c-aac4-fbc64e5fe04e)`.
- **Error Handling Isolation:** When `RESEND_API_KEY` is absent or Resend rejects a call, `OtpAuthService` + `GlobalExceptionHandler` return `HTTP 503` with sanitized copy and empty `validationErrors: []`—never rendering `"RESEND"` or stack traces in browser UI.

## Remaining Action for Production & Human Inbox Verification
1. **Rotate Key on Production Deploy:** Rotate any API key pasted into chat during development before configuring the production Hostinger VPS environment.
2. **Human Inbox Sign-In Verification:** Test a full 2-step OTP login against your personal inbox at `http://localhost:3000/portal/login` and verify both the OTP email and the post-registration Welcome email in Gmail/Outlook.
3. **Optional Resend Webhook Setup:** Configure `RESEND_WEBHOOK_SECRET` and point Resend webhooks to `/api/v1/webhooks/resend` when deploying to production for automated delivery/bounce status logging.

