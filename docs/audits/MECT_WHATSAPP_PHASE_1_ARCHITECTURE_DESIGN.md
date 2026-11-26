# MECT — WHATSAPP CLOUD API INTEGRATION
## PHASE 1: ENTERPRISE ARCHITECTURE AND INTEGRATION DESIGN SPECIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Production Baseline:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`  
**Classification:** Enterprise Notification Architecture & Compliance Specification  
**Status:** APPROVED & AUDITED  
**Execution Environment:** Isolated Local Test Environment (Strict Production Freeze)

---

## 1. EXECUTIVE SUMMARY & OBJECTIVES

The Mahaveer Educational & Charitable Trust (MECT) requires a resilient, institutional-grade, privacy-first WhatsApp Business notification capability powered directly by the official **Meta WhatsApp Business Platform / Cloud API**.

The architecture must provide end-to-end messaging reliability across key operational workflows:
1. Instant acknowledgement of confirmed donations.
2. Real-time administrative notifications for verified payments and incoming claims.
3. Official numbered donation receipt delivery with secure permalinks.
4. Direct SBI manual bank-transfer / UTR claim acknowledgements.
5. Lifecycle status updates for claim reviews (Verification and Rejection).
6. Volunteer registration acknowledgements.
7. Public and institutional inquiry acknowledgements.
8. Role-based administrative broadcast alerts.
9. Two-way delivery status reconciliation (`sent`, `delivered`, `read`, `failed`).
10. Inbound message handling with automatic keyword-based opt-out (`STOP`, `UNSUBSCRIBE`).

### Crucial Safety Directives
- **Zero Account Collision / Phone Number Preservation:** The Trust leadership maintains an active WhatsApp Business app on their physical mobile device. The system architecture isolates Cloud API phone number configurations (`WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`), ensuring zero account migration, deletion, or registration conflicts.
- **Fail-Safe Transaction Decoupling:** Under no circumstances shall a WhatsApp dispatch failure cause a database transaction rollback for donations, claims, or registrations. The transactional outbox pattern guarantees complete operational resilience.
- **Privacy & Regulatory Compliance:** All messages require affirmative consent recorded in `donor_messaging_preferences`, complying with the Digital Personal Data Protection (DPDP) Act, 2023, and Meta Commercial Messaging policies.

---

## 2. SYSTEM TOPOLOGY & DECOUPLING ARCHITECTURE

```
                                  +---------------------------------------+
                                  |     MECT Frontend / Donors / Users    |
                                  |    (Next.js 16 / TypeScript / React)  |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS REST (API)
                                                      v
+-----------------------------------------------------------------------------------------------------+
| SPRING BOOT ENTERPRISE BACKEND (Java 21)                                                            |
|                                                                                                     |
|  +------------------------+  +------------------------+  +------------------------+                 |
|  | DonationLifecycleSvc   |  | VolunteerRegistration  |  | PublicInquiryService   |                 |
|  +-----------+------------+  +-----------+------------+  +-----------+------------+                 |
|              |                           |                           |                              |
|              +---------------------------+---------------------------+                              |
|                                          |                                                          |
|                                          v                                                          |
|                        +------------------------------------+                                       |
|                        |   WhatsAppNotificationService      |                                       |
|                        +-----------------+------------------+                                       |
|                                          |                                                          |
|                                          | (Atomic Local DB Transaction)                            |
|                                          v                                                          |
|                        +------------------------------------+                                       |
|                        |       NotificationOutbox           |                                       |
|                        |       (PostgreSQL Table)           |                                       |
|                        +-----------------+------------------+                                       |
|                                          |                                                          |
|               +--------------------------+--------------------------+                               |
|               | (Synchronous Instant Dispatch)                      | (Scheduled Async Poller)      |
|               v                                                     v (60s Retry Schedule)          |
|    +------------------------+                            +------------------------+                 |
|    | NotificationOutboxSvc  |                            | NotificationOutboxSvc  |                 |
|    +-----------+------------+                            +-----------+------------+                 |
|                |                                                     |                              |
|                +--------------------------+--------------------------+                              |
|                                           |                                                         |
|                                           v                                                         |
|                             +----------------------------+                                          |
|                             |   WhatsAppCloudApiClient   |                                          |
|                             +-------------+--------------+                                          |
+-------------------------------------------|---------------------------------------------------------+
                                            |
                                            | Outbound HTTPS POST
                                            v (v21.0 /messages)
                       +------------------------------------------+
                       |    Meta Graph API (WhatsApp Cloud)       |
                       +--------------------+---------------------+
                                            |
                                            | Inbound Webhooks
                                            | (HMAC-SHA256 Signed POST)
                                            v
+-----------------------------------------------------------------------------------------------------+
| SPRING BOOT WEBHOOK INGESTION ENGINE                                                                |
|                                                                                                     |
|  +------------------------------------+                                                             |
|  | WebhookController (/webhooks/wa)   | <--- Signature Verification (X-Hub-Signature-256)           |
|  +-----------------+------------------+                                                             |
|                    |                                                                                |
|                    v                                                                                |
|  +------------------------------------+                                                             |
|  | WhatsAppWebhookService             |                                                             |
|  +--------+--------------------+------+                                                             |
|           |                    |                                                                    |
|           | Statuses Event     | Inbound Messages (e.g. "STOP")                                     |
|           v                    v                                                                    |
|  +--------------------+   +-------------------------------------+                                   |
|  | WhatsAppMessageLog |   | DonorMessagingPreferenceService     |                                   |
|  | (SENT/DELIVERED/   |   | (Revoke consent, mark opt_out_time) |                                   |
|  |  READ/FAILED)      |   +-------------------------------------+                                   |
|  +--------------------+                                                                             |
|                                                                                                     |
|  +------------------------------------+                                                             |
|  | WhatsAppWebhookEvent (Idempotency) |                                                             |
|  +------------------------------------+                                                             |
+-----------------------------------------------------------------------------------------------------+
```

---

## 3. CORE ARCHITECTURAL PRINCIPLES

### 3.1. Transaction Decoupling (Fail-Safe Outbox Pattern)
- Outbound WhatsApp notifications are persisted as records in `notification_outbox` and `whatsapp_message_logs` inside the originating database transaction.
- The external HTTP call to Meta Graph API is dispatched inside an isolated `try/catch` block.
- If Meta's endpoint returns an HTTP 5xx, network timeout, or connection error, the parent transaction remains committed and intact.
- The outbox poller (`NotificationOutboxService.retryScheduledOutboxItems`) retries failed notifications at exponential backoff intervals (1 minute, 5 minutes, 15 minutes) up to `maxRetries = 3`.

### 3.2. Error Classification & Non-Retriable Handling
- **4xx Permanent Failures:** Invalid phone format, unapproved template name, deleted template, or permission errors are flagged as `FAILED` or `REQUIRES_TEMPLATE_APPROVAL` immediately with `next_retry_at = NULL`. They are never queued in endless retry loops.
- **5xx / Network Transient Failures:** Connection timeouts, read timeouts, and HTTP 500/502/503 responses are marked `RETRY_SCHEDULED`.
- **Circuit Breaker / Disabled Mode:** When `app.whatsapp.enabled = false`, messages are categorized as `REQUIRES_PROVIDER_CONFIG` with zero remote invocations, ensuring safe offline testing and zero external leaks.

### 3.3. Zero Secrets & Strict Information Hiding
- Meta Access Tokens (`WHATSAPP_ACCESS_TOKEN`) and App Secrets (`WHATSAPP_APP_SECRET`) are never logged in plaintext.
- The `WhatsAppCloudApiClient.getMaskedToken()` method renders tokens in masked format (`EAAB...xx12`).
- Recipient phone numbers in application logs are masked according to telecom privacy guidelines (e.g., `919876543210` -> `919876****10` or `********3210`).

### 3.4. Inbound Webhook Security & Idempotency
- **Challenge Verification:** `GET /webhooks/whatsapp` strictly validates `hub.mode == 'subscribe'` and tests `hub.verify_token` against the encrypted/secured application configuration.
- **HMAC-SHA256 Payload Signature Verification:** `POST /webhooks/whatsapp` calculates HMAC-SHA256 across the raw request body using `WHATSAPP_APP_SECRET` and performs a constant-time comparison against `X-Hub-Signature-256`.
- **Event Deduplication:** Every webhook event is indexed by a unique `eventId` (`wamid + ":" + status` or `wamid + ":inbound"`). Repeated callbacks from Meta are discarded idempotently without re-triggering logs or database mutations.

---

## 4. TEN WORKFLOW SPECIFICATIONS & DATA MAPPINGS

| # | Workflow Name | Trigger Event | Recipient | Approved Template Key | Body Parameters Mapping |
|---|---------------|---------------|-----------|------------------------|-------------------------|
| 1 | Donation Acknowledgement | Online Donation Success | Donor (Opted-in) | `mect_donation_receipt` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Receipt No<br>`{{4}}`: Date (YYYY-MM-DD)<br>`{{5}}`: Receipt URL |
| 2 | Donation Verification Alert | Any Confirmed Donation | Admins (Active) | `mect_donation_admin_alert` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Payment Mode<br>`{{4}}`: Reference No<br>`{{5}}`: Campaign Name |
| 3 | Donation Receipt Delivery | Receipt Number Generated | Donor (Opted-in) | `mect_donation_receipt` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Receipt No<br>`{{4}}`: Date<br>`{{5}}`: Receipt URL |
| 4 | Manual Claim Acknowledgement | SBI Direct UTR Submitted | Donor (Opted-in) | `mect_donation_pending` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Reference / UTR<br>`{{4}}`: Date |
| 5a| Claim Verified Update | Admin Verifies SBI Claim | Donor (Opted-in) | `mect_donation_verified` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Claim Ref / UTR<br>`{{4}}`: Receipt No |
| 5b| Claim Rejection Update | Admin Rejects SBI Claim | Donor (Opted-in) | `mect_donation_rejected` | `{{1}}`: Donor Name<br>`{{2}}`: Amount (INR)<br>`{{3}}`: Claim Ref / UTR<br>`{{4}}`: Reason for Rejection |
| 6 | Volunteer Acknowledgement | Volunteer Registration | Volunteer | `mect_volunteer_enquiry_received` | `{{1}}`: Full Name<br>`{{2}}`: Role Interest<br>`{{3}}`: Reference ID |
| 7 | Inquiry Acknowledgement | Public Contact Inquiry | Inquirer | `mect_enquiry_received` | `{{1}}`: Full Name<br>`{{2}}`: Category<br>`{{3}}`: Inquiry ID |
| 8 | Administrative Notifications | Admin Role Subscriptions | Selected Admins | `mect_donation_admin_alert` | `{{1}}`: Subject / Type<br>`{{2}}`: Amount / Count<br>`{{3}}`: Mode<br>`{{4}}`: Reference<br>`{{5}}`: Scope |
| 9 | Status Tracking Lifecycle | Meta Webhook Callback | System / Audit | N/A (Status Event) | Updates `whatsapp_message_logs` (`SENT` -> `DELIVERED` -> `READ` or `FAILED`) |
| 10| Inbound "STOP" Opt-out | Donor sends "STOP" text | System / Consent | N/A (Inbound Text) | Sets `whatsapp_consent=false` and records `opt_out_timestamp` in `donor_messaging_preferences` |

---

## 5. DATABASE SCHEMA RECONCILIATION

The schema is anchored in migration `V18__enterprise_whatsapp_notification_engine.sql` and extended as needed:

1. **`donations` table:** Column `whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE`.
2. **`whatsapp_recipients` table:** Manages administrator phone numbers and event triggers (`notify_on_donation`, `notify_on_claim`, `notify_on_refund`, `notify_daily_summary`).
3. **`whatsapp_template_configs` table:** Stores metadata, parameter order, category, and approval state for Meta templates.
4. **`donor_messaging_preferences` table:** Tracks phone numbers, consent status, IP address, consent source, and opt-out timestamps.
5. **`whatsapp_message_logs` table:** Records every dispatched message, provider `wamid`, timestamps for `sent`, `delivered`, and `read`, and error codes.
6. **`whatsapp_webhook_events` table:** Deduplicates incoming webhooks to guarantee idempotency.

---

## 6. VERIFICATION CRITERIA FOR SUBSEQUENT PHASES

1. **Phase 2:** Configuration properties verified in `application.yml` with fail-safe `false` defaults.
2. **Phase 3:** Error handling and client sanitization unit tests verified with 100% pass rate.
3. **Phase 4:** Template registry verified and extended with `mect_volunteer_enquiry_received` and `mect_enquiry_received`.
4. **Phase 5:** Event hooks wired for claim verification, volunteer registration, and public inquiry.
5. **Phase 6:** Inbound webhook parser updated to process `messages` and execute opt-out upon receiving "STOP".
6. **Phase 7:** End-to-end integration tests verifying all 10 workflows pass cleanly with zero mock leakage.
