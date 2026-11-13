# MECT — OTP & Centralized Email Template Report

## Centralized Versioned Templates ([`EmailTemplateRenderer`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/notification/EmailTemplateRenderer.java))
All transactional emails use pure table-based HTML and inline CSS (`max-width: 600px`, `role="presentation"`, MECT emblem `#FFFFFF`/`#E5C499` badge in Forest Charcoal `#283730` header, Terracotta `#A45E44` rule, Warm Cream `#F3E4D2` highlights, Light Sand `#F0DEC5` Balangir footer) designed for Gmail, Outlook, Apple Mail, and mobile viewports without external CSS or JavaScript.

| Template Method | Version Tag | Status & Verification Classification |
|---|---|---|
| `renderOtpEmail` | `otp-v2.0` | **Visually inspected & Live Resend API dispatched (`HTTP 200 OK`, `messageId=01a1c6f6-aa0f-729c-aac4-fbc64e5fe04e`)** to Resend's official `delivered@resend.dev` sink from `notifications@mect.org.in`. |
| `renderWelcomeEmail` | `welcome-v2.0` | **Implemented, unit-tested & visually inspected in Chromium**. Sent exclusively on first registration via deduplicated outbox key `WELCOME_USER:<userId>`. |
| `renderProfileCompletedEmail` | `profile-v2.0` | **Implemented & unit-tested** (`PROFILE_COMPLETED:<userId>` idempotency). |
| `renderDonationInitiatedEmail` | `don-init-v2.0` | **Implemented** in `EmailTemplateRenderer` (awaiting live Razorpay checkout keys). |
| `renderDonationConfirmedReceiptEmail` | `don-rcpt-v2.0` | **Implemented & tested with mocked email provider** alongside OpenPDF receipt attachments. |
| `renderDonationFailedEmail` | `don-fail-v2.0` | **Implemented** in `EmailTemplateRenderer` (sanitized failure notice + SBI/retry CTA). |
| `renderRefundEmail` | `don-refund-v2.0` | **Implemented** in `EmailTemplateRenderer` (refund ledger confirmation). |
| `renderSecurityNoticeEmail` | `sec-v2.0` | **Implemented** for verified contact-change security alerts. |

## Important Honest Distinction
- **`otp-v2.0` Delivery Verified Against Resend:** Verified HTTP `200 OK` acceptance from `MECT Notifications <notifications@mect.org.in>` via the Spring Boot backend (`ResendEmailService`). Rendering was also inspected visually in Chromium (`720x880`).
- **Outlook / Apple Mail Live Native Client Screenshots:** Native Outlook Desktop and Apple Mail hardware apps were not launched locally; email markup adheres strictly to Outlook-safe HTML `<table>` layout with inline styles and zero flexbox/grid dependencies.

