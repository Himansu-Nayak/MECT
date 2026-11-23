# MECT — WhatsApp Business Cloud Integration & Opt-In Boundary Report

## Classification Summary
- **Implemented:** `MetaWhatsAppCloudService` (`WhatsAppProvider` SPI supporting `NONE` or `META_CLOUD` Graph API `v21.0` template dispatch), webhook receiver with Meta `X-Hub-Signature-256` verification (`/webhooks/whatsapp` in `WebhookController`), explicit unchecked-by-default WhatsApp opt-in controls in `src/app/portal/profile/page.tsx`, and timestamped consent audit persistence in `communication_consents`.
- **Tested successfully:** Default opted-out state enforcement (no WhatsApp outbox row created when user has not explicitly opted in), explicit opt-in/opt-out consent transitions, and fail-closed unconfigured reporting when credentials/template names are absent.
- **Requires provider credentials:** `WHATSAPP_PROVIDER=META_CLOUD`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, and `WHATSAPP_WEBHOOK_VERIFY_TOKEN` are not configured in `backend/.env`.
- **Requires external approval:** Meta Business Verification, WhatsApp Business Account (WABA) onboarding, and Meta-approved Utility message templates (`WHATSAPP_TEMPLATE_DONATION_CONFIRMED`, `WHATSAPP_TEMPLATE_RECEIPT_READY`) must be approved in Meta Business Manager before any live WhatsApp notification is transmitted.

