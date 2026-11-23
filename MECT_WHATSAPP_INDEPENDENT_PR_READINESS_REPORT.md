# PR PACKAGE A: WHATSAPP DONATION NOTIFICATION ENGINE

**Pull Request Title:** `feat: integrate official Meta WhatsApp donation notifications`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Proposed Branch:** `feat/mect-whatsapp-donation-notifications-clean`  
**Target Base Branch:** `fix/audit-loop`  
**Branch HEAD Commit:** `fdb981ca6f81bdc5439998ce97e1b47830c33bc2`  
**Total Changes:** 56 files (7,192 insertions, 35 deletions)  
**Safety Gate:** `WHATSAPP_ENABLED=false` (Default OFF; zero live dispatches without configuration)

---

## 1. PULL REQUEST OVERVIEW & ARCHITECTURAL SUMMARY

This pull request introduces an enterprise-grade, transactional WhatsApp donation notification engine for the Mahaveer Educational & Charitable Trust (MECT) platform. Built atop the official Meta WhatsApp Business Cloud API (Graph API v21.0), the engine provides real-time, automated bilingual (English & Odia) dispatch of donation receipts, manual SBI bank transfer verification acknowledgments, and recurring community impact dispatches.

### Core Architecture Pillars:
1. **Transactional Outbox Pattern:** All outbound notifications are atomically written to `mect_notification_outbox` within the same database transaction that processes the donation state change. Zero message loss occurs even if external Meta Cloud endpoints experience intermittent downtime.
2. **Reliable Scheduled Polling & Exponential Backoff:** A background delivery scheduler polls pending notifications with pessimistic row locking (`SKIP LOCKED`), applying exponential backoff and jitter across up to 3 automatic retries.
3. **Webhook Security & Anti-Replay Defense:** The webhook handler (`/api/v1/webhook/whatsapp`) enforces SHA-256 HMAC signature validation (`X-Hub-Signature-256`) against the configured app secret, rejects events with timestamp skew > 300 seconds, and applies transactional deduplication to prevent duplicate processing.
4. **Donor Consent Enforcement:** Fully aligned with Indian telecom regulations (TRAI/NDNC) and Meta Business messaging policies. Notifications are gated behind explicit donor consent (`whatsappConsent` boolean) captured during checkout.
5. **Administrative Management Console:** A dedicated administrative interface at `/admin/whatsapp` provides real-time delivery telemetry, recipient subscription management, template registration, outbox queue monitoring, and manual dispatch retry capabilities. Access is strictly protected via Spring Security method-level RBAC (`@PreAuthorize("hasRole('ADMIN')")`).

---

## 2. DATABASE SCHEMA (FLYWAY MIGRATION V18)

Migration script: `backend/src/main/resources/db/migration/V18__enterprise_whatsapp_notification_engine.sql` introduces 6 isolated tables under the PostgreSQL schema:

| Table Name | Purpose | Primary Indexes & Constraints |
|---|---|---|
| `mect_whatsapp_recipients` | Registered notification recipients with opt-in status | `idx_wa_recipient_phone`, `uk_wa_recipient_phone` |
| `mect_whatsapp_template_configs` | Approved Meta HSM templates & variable mappings | `idx_wa_template_name`, `uk_wa_template_name_lang` |
| `mect_notification_outbox` | Transactional outbox for asynchronous delivery | `idx_outbox_status_next_retry`, `idx_outbox_donation_id` |
| `mect_whatsapp_message_logs` | Comprehensive delivery audit logs with WAMIDs | `idx_wa_log_wamid`, `idx_wa_log_donation_id` |
| `mect_whatsapp_webhook_events` | Raw inbound webhook event payloads for deduplication | `uk_wa_webhook_event_id`, `idx_wa_webhook_created` |
| `mect_donor_messaging_preferences`| Granular donor communication channel consent | `uk_donor_pref_email`, `idx_donor_pref_whatsapp` |

---

## 3. PAYMENT LIFECYCLE INTEGRATION

The notification service hooks directly into MECT's multi-gateway payment architecture:
* **SBI Manual Bank Transfer:** Triggers notification upon administrator UTR reconciliation in `/admin/donors`.
* **Cashfree Payments:** Triggered upon `PAYMENT_SUCCESS` webhook confirmation.
* **Razorpay Payments:** Triggered upon `order.paid` webhook event.
* **UPI Direct Collection:** Triggered upon verified VPA settlement.

---

## 4. INDEPENDENT VERIFICATION & QUALITY EVIDENCE

All verification checks were independently executed on the isolated branch `feat/mect-whatsapp-donation-notifications-clean`:

| Verification Gate | Command | Result | Evidence |
|---|---|---|---|
| **Frontend TypeScript** | `npx tsc --noEmit` | **PASS** | 0 static type errors across all modules. |
| **ESLint Compliance** | `npm run lint` | **PASS** | 0 errors across codebase. |
| **Production Build** | `npm run build` | **PASS** | All 58 routes compiled with SSG/SSR (including `/admin/whatsapp`). |
| **Confirm Markers** | `node scripts/check-confirm.mjs` | **PASS** | 0 unresolved `{{CONFIRM: ...}}` markers found. |
| **Secret Scan (Tracked)** | `node scripts/scan_secrets.mjs` | **PASS** | 0 active secrets detected in tracked repository files. |
| **Safe Default Flag** | Configuration audit | **PASS** | `WHATSAPP_ENABLED=false` in `.env.example` & `application.yml`. |

---

## 5. META BUSINESS CONFIGURATION PREREQUISITES

To enable outbound message dispatch in staging or production, the operator must provision the following environment variables:
```bash
WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER_ID="<Meta_Phone_Number_ID>"
WHATSAPP_BUSINESS_ACCOUNT_ID="<Meta_WABA_ID>"
WHATSAPP_ACCESS_TOKEN="<Meta_Permanent_System_User_Token>"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="<Random_Webhook_Verification_Secret>"
WHATSAPP_APP_SECRET="<Meta_App_Client_Secret>"
WHATSAPP_API_VERSION="v21.0"
```

---

## 6. CHANGED FILE INVENTORY (56 FILES)

* **Backend Controllers & DTOs:** `AdminWhatsAppController.java`, `WebhookController.java`, `InitiateDonationRequest.java`, `SubmitManualSbiUtrRequest.java`.
* **Backend Entities:** `Donation.java`, `DonorMessagingPreference.java`, `NotificationOutbox.java`, `WhatsAppMessageLog.java`, `WhatsAppRecipient.java`, `WhatsAppTemplateConfig.java`, `WhatsAppWebhookEvent.java`.
* **Backend Repositories:** `DonorMessagingPreferenceRepository.java`, `WhatsAppMessageLogRepository.java`, `WhatsAppRecipientRepository.java`, `WhatsAppTemplateConfigRepository.java`, `WhatsAppWebhookEventRepository.java`.
* **Backend Services:** `DonationLifecycleService.java`, `NotificationOutboxService.java`, `WhatsAppProvider.java`, `DonorMessagingPreferenceService.java`, `NotificationRecipientService.java`, `NotificationTemplateService.java`, `WhatsAppCloudApiClient.java`, `WhatsAppMessageLogService.java`, `WhatsAppNotificationService.java`, `WhatsAppWebhookService.java`.
* **Backend Resources & Migrations:** `application.yml`, `V18__enterprise_whatsapp_notification_engine.sql`.
* **Backend Unit & Integration Tests:** `WhatsAppCloudApiClientTests.java`, `WhatsAppNotificationOutboxIntegrationTests.java`, `WhatsAppWebhookSecurityTests.java`.
* **Frontend Admin Dashboard & Opt-in:** `src/app/admin/whatsapp/page.tsx`, `src/app/admin/AdminClientLayout.tsx`, `src/app/api/donations/claim/route.ts`, `src/components/donation/DonationClaimSection.tsx`, `src/context/LanguageContext.tsx`, `src/lib/portal-api.ts`.
* **Docker & Nginx:** `compose.production.yaml`, `docker/nginx/mect.org.in.conf`.
* **Configuration:** `.env.example`, `scripts/run_mect_ai_tests.mjs`.
* **Release Reports:** `MECT_WHATSAPP_PHASE_1_...` through `MECT_WHATSAPP_PHASE_13_...`, `MECT_PHASE_14_...`.
