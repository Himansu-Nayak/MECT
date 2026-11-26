# MECT WHATSAPP CLOUD API INTEGRATION — PHASE 0 FORENSIC BASELINE REPORT
## READ-ONLY AUDIT, EXISTING ARCHITECTURE & REUSABILITY ASSESSMENT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Repository:** [https://github.com/Himansu-Nayak/MECT](https://github.com/Himansu-Nayak/MECT)  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Production Baseline:** `origin/main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (Strictly Untouched)  
**Current HEAD:** `997a40d` (`docs(donation): capture high-res visual screenshots across 7-step donation flow`)  
**Audit Phase:** Phase 0 — Read-Only Forensic Baseline Audit  
**Date of Audit:** November 26, 2026  
**Status:** COMPLETE (Read-Only)  

---

## 1. EXECUTIVE SUMMARY & FORENSIC STATUS

In accordance with Phase 0 instructions, a forensic read-only audit of the MECT codebase was executed. 

### Critical Project Truths Established:
1. **Existing WhatsApp Implementation:** An enterprise-grade, asynchronous WhatsApp notification engine was previously established in the Java Spring Boot backend and PostgreSQL schema via Flyway Migration `V18__enterprise_whatsapp_notification_engine.sql`.
2. **Zero Duplication Policy:** We MUST NOT create duplicate controllers, entities, repositories, or competing notification systems. The existing `WhatsAppProvider`, `WhatsAppCloudApiClient`, `WhatsAppNotificationService`, `WhatsAppWebhookService`, `NotificationOutboxService`, and `AdminWhatsAppController` form the solid foundation.
3. **Existing Phone Number Protection:** The owner has active conversations on the official WhatsApp Business app on their physical mobile device. As required:
   - The existing WhatsApp Business account and physical number must NEVER be deleted, disconnected, or subjected to conflicting unapproved migration workflows.
   - The Meta test phone number currently used in the Meta Developer Hub is isolated and is **NOT** the MECT production phone number.
4. **Strict Production Freeze:** The integration is governed by `WHATSAPP_ENABLED=false` by default in `application.yml`. All automated testing and verification run strictly in local, isolated, non-production environments with mock HTTP fixtures. Zero secrets are committed to git or exposed to the frontend.

---

## 2. EXISTING CODEBASE INVENTORY & FILE PATHS

### A. Backend Spring Boot Components (Java 21 / Spring Boot 4.x)
- **Client & Provider Adapter:**
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/WhatsAppProvider.java` (Interface)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppCloudApiClient.java` (Meta Graph API client, sanitizes phone numbers, builds template payload, verifies HMAC SHA-256)
- **Notification Services & Lifecycle Orchestrators:**
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppNotificationService.java` (Dispatches alerts on donation, claim, refund, verified receipt)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppWebhookService.java` (Validates webhook challenges, HMAC signatures, deduplicates events, updates delivery status)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppMessageLogService.java` (Audit trail for queued/sent/delivered/failed messages)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/DonorMessagingPreferenceService.java` (Consent & opt-out management)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/NotificationRecipientService.java` (Admin recipient management)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/NotificationTemplateService.java` (Template parameter binding)
  - `backend/src/main/java/org/mahavirtrust/backend/service/notification/NotificationOutboxService.java` (Transactional outbox pattern with scheduled bounded retry)
- **Controllers & Webhook Endpoints:**
  - `backend/src/main/java/org/mahavirtrust/backend/controller/WebhookController.java` (`GET /webhooks/whatsapp` challenge verification; `POST /webhooks/whatsapp` HMAC verification)
  - `backend/src/main/java/org/mahavirtrust/backend/controller/AdminWhatsAppController.java` (`/admin/whatsapp` REST API for status, recipient CRUD, template inspection, log monitoring, and safe test dispatch)
- **JPA Persistence Entities:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/WhatsAppRecipient.java` (`whatsapp_recipients`)
  - `backend/src/main/java/org/mahavirtrust/backend/entity/WhatsAppTemplateConfig.java` (`whatsapp_template_configs`)
  - `backend/src/main/java/org/mahavirtrust/backend/entity/WhatsAppMessageLog.java` (`whatsapp_message_logs`)
  - `backend/src/main/java/org/mahavirtrust/backend/entity/WhatsAppWebhookEvent.java` (`whatsapp_webhook_events`)
  - `backend/src/main/java/org/mahavirtrust/backend/entity/NotificationOutbox.java` (`notification_outbox`)
  - `backend/src/main/java/org/mahavirtrust/backend/entity/DonorMessagingPreference.java` (`donor_messaging_preferences`)
- **Database Migrations:**
  - `backend/src/main/resources/db/migration/V18__enterprise_whatsapp_notification_engine.sql`
- **Automated Backend Test Suite:**
  - `backend/src/test/java/org/mahavirtrust/backend/WhatsAppCloudApiClientTests.java` (7 unit tests)
  - `backend/src/test/java/org/mahavirtrust/backend/WhatsAppNotificationOutboxIntegrationTests.java` (4 integration tests)
  - `backend/src/test/java/org/mahavirtrust/backend/WhatsAppWebhookSecurityTests.java` (4 security tests)
  - **Status:** All 15 tests compiled and verified passing (`mvn test` exit code 0).

### B. Frontend Next.js Components (React 19 / TypeScript)
- **Administrative Interface:**
  - `src/app/admin/whatsapp/page.tsx` (Complete admin dashboard with Recipient management, Template registry, Dispatch logs, and Diagnostic test panel)
- **Public Donation Flow:**
  - `src/components/donation/DonationJourney.tsx` (Step 3 includes explicit, unbundled WhatsApp opt-in consent checkbox per DPDP Act)
  - `src/app/api/donations/claim/route.ts` (Ingests `whatsappConsent` flag and forwards to backend `submit-utr`)
- **API Client:**
  - `src/lib/portal-api.ts` (Admin WhatsApp status, recipient CRUD, template inspection, dispatch testing)

---

## 3. AUDIT OF THE 10 ORGANIZATIONAL MESSAGING WORKFLOWS

| # | Messaging Workflow | Architectural Status | Implementation Evidence | Remaining Action / Owner Decision |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Donation Acknowledgement** | **EXISTING / VERIFIED** | `WhatsAppNotificationService.notifyDonorOnDonation()` enqueues receipt notification to opted-in donors. | Active when configured |
| **2** | **Payment Verification Notification** | **EXISTING / VERIFIED** | `DonationLifecycleService` triggers `notifyAdminsOnDonation()` upon authoritative payment confirmation. | Active when configured |
| **3** | **Donation Receipt Notification** | **EXISTING / VERIFIED** | `notifyDonorOnDonation()` dispatches `mect_donation_receipt` with protected receipt URL. | Active when configured |
| **4** | **Manual Transfer / UTR Claim Acknowledgement** | **EXISTING / VERIFIED** | `notifyDonorOnClaimSubmitted()` dispatches `mect_donation_pending` with UTR reference. | Active when configured |
| **5** | **Donation Claim Status Updates** | **EXISTING / VERIFIED** | `notifyDonorOnClaimVerified()` and `notifyDonorOnClaimRejected()` implemented for review decisions. | Connect `notifyDonorOnClaimVerified` explicitly in claim verification lifecycle |
| **6** | **Volunteer Enquiry Acknowledgement** | **MISSING** | `VolunteerRegistrationService.java` currently records volunteer applications but does not trigger WhatsApp notifications. | **Scope for Phase 5**: Add notification event hook for approved template `mect_volunteer_enquiry_received` |
| **7** | **General Contact Enquiry Acknowledgement** | **MISSING** | `PublicInquiryService.java` records contact submissions but does not trigger WhatsApp notifications. | **Scope for Phase 5**: Add notification event hook for approved template `mect_enquiry_received` |
| **8** | **Administrative Notifications (Authorized)** | **EXISTING / VERIFIED** | `whatsapp_recipients` table and `notifyAdminsOnDonation`, `notifyAdminsOnClaim`, `notifyAdminsOnRefund`. | Fully operational |
| **9** | **Message Delivery Status Tracking** | **EXISTING / VERIFIED** | `POST /webhooks/whatsapp` ingests `sent`, `delivered`, `read`, `failed` statuses and updates `whatsapp_message_logs`. | Fully operational |
| **10** | **Incoming Message Processing (Opt-Out / STOP)** | **MISSING** | `WhatsAppWebhookService.java` currently processes `statuses` array only; it does not process `messages` array for "STOP" / opt-out requests. | **Scope for Phase 7/8**: Add incoming message handler to process STOP/opt-out per DPDP Act |

---

## 4. SECURITY, DATA PRIVACY & CREDENTIAL AUDIT

1. **Zero Secret Exposure:**
   - Property mapping in `application.yml`:
     - `app.whatsapp.enabled`: `${WHATSAPP_ENABLED:false}`
     - `app.whatsapp.phone-number-id`: `${WHATSAPP_PHONE_NUMBER_ID:}`
     - `app.whatsapp.business-account-id`: `${WHATSAPP_BUSINESS_ACCOUNT_ID:}`
     - `app.whatsapp.access-token`: `${WHATSAPP_ACCESS_TOKEN:}`
     - `app.whatsapp.verify-token`: `${WHATSAPP_WEBHOOK_VERIFY_TOKEN:}`
     - `app.whatsapp.app-secret`: `${WHATSAPP_APP_SECRET:}`
   - No hardcoded tokens, secrets, or API keys exist in git history or properties files.
2. **Token Masking:**
   - `WhatsAppCloudApiClient.getMaskedToken()` exposes only the first 4 and last 4 characters (`EAAB...yyxx`) in admin diagnostic views.
3. **Webhook Security:**
   - Verification token challenge (`hub.mode=subscribe`, `hub.verify_token`, `hub.challenge`) is validated with strict equality.
   - Incoming payloads are cryptographically validated against `X-Hub-Signature-256` using HMAC SHA-256 with the configured app secret.
4. **Donor PII Masking:**
   - Phone numbers are masked in all application log statements (`recipientPhone.replaceAll("\\d(?=\\d{4})", "*")`).
   - Donor financial information is not logged in message logs.
5. **Fail-Safe Decoupling:**
   - All WhatsApp notification dispatches run asynchronously or within isolated `try/catch` wrappers. Under NO circumstances does a WhatsApp network failure or Meta Cloud API timeout fail or roll back a legitimate donation transaction.

---

## 5. RISK ASSESSMENT & PRODUCTION COEXISTENCE RULES

| Risk Area | Risk Description | Mitigation Control |
| :--- | :--- | :--- |
| **Existing Phone Number Conflict** | Owner's physical phone number has active WhatsApp Business app conversations. Registering via Cloud API without migration would disable mobile app. | **STRICT RULE:** Use isolated Meta Developer Test Number for all pre-production testing. Do NOT initiate Cloud API registration for the primary mobile number until formal coexistence eligibility is verified. |
| **Production Account Freeze** | Accidental message dispatch to real donors or administrators during development. | Integration remains gated behind `WHATSAPP_ENABLED=false`. All automated tests use mocked RestClient responses. |
| **Meta Template Rejection** | Messages sent with unapproved template names fail immediately with Meta API error 100/132000. | Template abstraction enforces status check (`status=APPROVED`). Unapproved templates default to `UNAPPROVED_TEMPLATE` and are held in Outbox without calling Graph API. |
| **Webhook Replay / Duplication** | Meta may deliver duplicate webhook notifications during network retries. | `whatsapp_webhook_events` enforces a `UNIQUE(event_id)` constraint where `event_id = wamid + ":" + status`. Duplicates are detected and safely no-opped. |
| **Rate Limiting by Meta** | Tier 1 messaging limits (1,000 unique recipients / 24 hours). | Outbox queue with bounded retries and exponential backoff throttles dispatch rate safely. |

---

## 6. PROPOSED PHASE-BY-PHASE IMPLEMENTATION PLAN

Based on this forensic baseline, the remaining phases will build directly upon existing assets without duplication:

- **Phase 1 (Design Review):** Finalize the unified architecture diagram and formalize the data flow.
- **Phase 2 (Configuration):** Verify configuration defaults, property precedence, and environment variable bindings.
- **Phase 3 (Provider Client Hardening):** Ensure `WhatsAppCloudApiClient` supports template messages, text replies for customer service windows, and timeout bounds.
- **Phase 4 (Approved Templates):** Add template validation for proposed enquiry templates (`mect_enquiry_received`, `mect_volunteer_enquiry_received`) alongside existing donation templates.
- **Phase 5 (Donation & Enquiry Event Hooks):** Connect `notifyDonorOnClaimVerified` into `DonationLifecycleService` and add notification hooks to `PublicInquiryService` and `VolunteerRegistrationService`.
- **Phase 6 (Consent & Opt-Out):** Implement automated "STOP" opt-out processing that updates `donor_messaging_preferences` and halts non-essential notifications.
- **Phase 7 (Webhook Extension):** Extend `WhatsAppWebhookService.processPayload()` to parse inbound user messages (`messages` array) and trigger opt-out or admin alert hooks.
- **Phase 8 (Event Deduplication & Tracking):** Verify delivery status updates across the full lifecycle (`QUEUED` ➔ `SENT` ➔ `DELIVERED` ➔ `READ` / `FAILED`).
- **Phase 9 (Outbox & Failure Recovery):** Verify dead-letter handling, retry limits (max 3 attempts), and manual retry capabilities via the Admin UI.
- **Phase 10 (Admin Control Center):** Audit the `/admin/whatsapp` dashboard against existing RBAC (`ROLE_ADMIN`, `ROLE_SUPER_ADMIN`, `ROLE_AUDITOR`).
- **Phase 11 (Frontend Verification):** Verify consent checkboxes in `DonationJourney.tsx` and public forms without exposing internal API endpoints.
- **Phase 12 (Database Verification):** Confirm PostgreSQL / Flyway migration `V18` is intact and zero redundant migrations are introduced.
- **Phase 13 (Security Audit):** Execute comprehensive security checks (HMAC verification, secret protection, SSRF resistance).
- **Phase 14 (Automated Testing):** Execute and expand the automated JUnit test suite to cover all 10 workflows with 100% pass rate.

---

## 7. PHASE 0 CONCLUSION & VERDICT

- **Baseline Status:** **VERIFIED**
- **Existing Reusable Architecture:** **100% Intact (Zero Duplication Needed)**
- **Production Freeze:** **STRICTLY PRESERVED**
- **Next Step:** Proceed to **Phase 1: Architecture and Integration Design**.
