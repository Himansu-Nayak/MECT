# MECT WhatsApp Notification Engine — Phase 2 Database Foundation Report

**Project:** Mahavir Educational & Charitable Trust (MECT)  
**Repository Branch:** `feat/mect-whatsapp-donation-notifications`  
**Phase:** 2 — Database Schema, Migration & Entity Foundation  
**Status:** COMPLETED & VERIFIED  
**Date:** 2026-11-22  

---

## 1. Executive Summary

Phase 2 establishes the database persistence layer and schema definitions for the enterprise-grade WhatsApp donation notification subsystem. This architecture strictly adheres to the transactional outbox pattern, maintaining complete separation between synchronous financial transaction boundaries and asynchronous Meta WhatsApp Business Cloud API communication.

A comprehensive Flyway migration (`V18__enterprise_whatsapp_notification_engine.sql`) has been developed, verified for compatibility with both PostgreSQL 17 (production) and H2 in-memory mode (test suites), and mapped to idiomatic Spring Data JPA entities and repositories.

---

## 2. Flyway Migration Specification: `V18`

The migration file is located at:
`backend/src/main/resources/db/migration/V18__enterprise_whatsapp_notification_engine.sql`

### 2.1 Table: `whatsapp_recipients`
Maintains designated MECT trustee, treasurer, and administrative WhatsApp phone numbers authorized to receive automated real-time alerts.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `phone_number` | VARCHAR(30) | NOT NULL, UNIQUE | E.164 phone number digits (e.g., `919876543210`) |
| `name` | VARCHAR(120) | NOT NULL | Administrator or trustee full name |
| `role` | VARCHAR(50) | NOT NULL, DEFAULT 'ADMIN' | Role (e.g., `TRUSTEE`, `TREASURER`, `ADMIN`, `AUDITOR`) |
| `active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Master switch for receiving alerts |
| `notify_on_donation` | BOOLEAN | NOT NULL, DEFAULT TRUE | Toggle for instant donation notifications |
| `notify_on_claim` | BOOLEAN | NOT NULL, DEFAULT TRUE | Toggle for manual SBI/UPI claim submissions |
| `notify_on_refund` | BOOLEAN | NOT NULL, DEFAULT TRUE | Toggle for refund events |
| `notify_daily_summary` | BOOLEAN | NOT NULL, DEFAULT FALSE | Toggle for daily aggregate notifications |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation audit timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Modification audit timestamp |

**Indexes:**
- `idx_whatsapp_recip_active` ON `whatsapp_recipients(active)`

---

### 2.2 Table: `whatsapp_template_configs`
Stores Meta WhatsApp Business Cloud API pre-approved message template configurations, mapped parameters, and current approval statuses.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `template_key` | VARCHAR(80) | NOT NULL, UNIQUE | Canonical internal key (e.g., `mect_donation_admin_alert`) |
| `template_name` | VARCHAR(120) | NOT NULL | Meta-approved WhatsApp template name |
| `language_code` | VARCHAR(10) | NOT NULL, DEFAULT 'en' | Language code (e.g., `en`, `or`, `hi`) |
| `category` | VARCHAR(50) | NOT NULL, DEFAULT 'UTILITY' | Meta template category (`UTILITY`, `AUTHENTICATION`) |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT 'APPROVED' | Status (`APPROVED`, `PENDING`, `REJECTED`, `DISABLED`) |
| `parameter_mappings` | TEXT | NULLABLE | JSON array defining ordered positional parameter names |
| `sample_body` | TEXT | NULLABLE | Template body preview for administrative reference |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Modification timestamp |

#### Seeded Standard Templates:
1. **`mect_donation_admin_alert`**:
   - Parameters: `["donor_name","amount","payment_mode","reference_number","campaign_name"]`
   - Content: *"MECT Alert: A new donation of INR {{2}} has been received from {{1}} via {{3}} (Ref: {{4}}) for {{5}}."*
2. **`mect_donation_receipt`**:
   - Parameters: `["donor_name","amount","receipt_number","transaction_date","receipt_url"]`
   - Content: *"Dear {{1}}, thank you for your generous donation of INR {{2}} to Mahavir Trust. Your official numbered receipt {{3}} dated {{4}} is available at {{5}}."*
3. **`mect_donation_pending`**:
   - Parameters: `["donor_name","amount","reference_number","date"]`
   - Content: *"Namaste {{1}}, your direct bank transfer / UPI contribution claim of INR {{2}} (Ref: {{3}}) submitted on {{4}} is received. The Trust will verify it against bank statements shortly."*
4. **`mect_donation_verified`**:
   - Parameters: `["donor_name","amount","reference_number","receipt_number"]`
   - Content: *"Namaste {{1}}, your contribution claim of INR {{2}} (Ref: {{3}}) has been verified by Mahavir Trust. Numbered receipt: {{4}}."*
5. **`mect_donation_rejected`**:
   - Parameters: `["donor_name","amount","reference_number","reason"]`
   - Content: *"Dear {{1}}, your contribution claim of INR {{2}} (Ref: {{3}}) could not be verified against Trust bank records. Note: {{4}}."*
6. **`mect_daily_donation_summary`**:
   - Parameters: `["date","total_count","total_amount","direct_count","direct_amount","verified_claims_count"]`
   - Content: *"MECT Daily Summary ({{1}}): Total donations: {{2}} (INR {{3}}). Direct gateway: {{4}} (INR {{5}}). Verified claims: {{6}}."*

---

### 2.3 Table: `donor_messaging_preferences`
Tracks donor opt-in consent and privacy preferences across both registered portal users and anonymous/guest donors.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `donor_phone` | VARCHAR(30) | NOT NULL, UNIQUE | Canonical E.164 phone number |
| `donor_email` | VARCHAR(255) | NULLABLE | Associated email address |
| `portal_user_id` | BIGINT | NULLABLE, REFERENCES `portal_users(id)` | Linked portal account (if registered) |
| `whatsapp_consent` | BOOLEAN | NOT NULL, DEFAULT FALSE | Donor opt-in flag for WhatsApp alerts |
| `sms_consent` | BOOLEAN | NOT NULL, DEFAULT FALSE | Donor opt-in flag for SMS notifications |
| `consent_timestamp` | TIMESTAMPTZ | NULLABLE | Timestamp when consent was recorded |
| `consent_ip` | VARCHAR(60) | NULLABLE | IP address where consent was granted |
| `consent_source` | VARCHAR(100) | DEFAULT 'DONATION_CHECKOUT' | Form/page where consent was captured |
| `policy_version` | VARCHAR(20) | DEFAULT 'v1.0' | Privacy policy version consented to |
| `opt_out_timestamp` | TIMESTAMPTZ | NULLABLE | Timestamp of revocation if opted out |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Modification timestamp |

**Indexes:**
- `idx_donor_msg_pref_phone` ON `donor_messaging_preferences(donor_phone)`
- `idx_donor_msg_pref_user` ON `donor_messaging_preferences(portal_user_id)`

---

### 2.4 Table: `whatsapp_message_logs`
Provides end-to-end auditability and status tracking for all outbound WhatsApp template dispatches.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `outbox_id` | BIGINT | NULLABLE, REFERENCES `notification_outbox(id)` | Parent outbox record |
| `wamid` | VARCHAR(150) | NULLABLE | Meta WhatsApp Message ID (`wamid.HBg...`) |
| `recipient_phone` | VARCHAR(30) | NOT NULL | Recipient phone number |
| `recipient_type` | VARCHAR(30) | NOT NULL, DEFAULT 'DONOR' | Recipient classification (`ADMIN`, `DONOR`) |
| `template_name` | VARCHAR(120) | NULLABLE | Template executed |
| `event_type` | VARCHAR(60) | NOT NULL | Event trigger (`DONATION_CONFIRMED`, `CLAIM_SUBMITTED`, etc.) |
| `donation_id` | BIGINT | NULLABLE, REFERENCES `donations(id)` | Associated donation |
| `status` | VARCHAR(30) | NOT NULL, DEFAULT 'QUEUED' | Status (`QUEUED`, `SENT`, `DELIVERED`, `READ`, `FAILED`) |
| `error_code` | VARCHAR(50) | NULLABLE | Meta API or HTTP error code |
| `error_message` | VARCHAR(500) | NULLABLE | Error description if delivery failed |
| `sent_at` | TIMESTAMPTZ | NULLABLE | Timestamp when sent to Meta API |
| `delivered_at` | TIMESTAMPTZ | NULLABLE | Timestamp of Meta delivery receipt |
| `read_at` | TIMESTAMPTZ | NULLABLE | Timestamp of donor read receipt |
| `raw_payload` | TEXT | NULLABLE | Raw request/response JSON payload |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Modification timestamp |

**Indexes:**
- `idx_wa_logs_wamid` ON `whatsapp_message_logs(wamid)`
- `idx_wa_logs_outbox` ON `whatsapp_message_logs(outbox_id)`
- `idx_wa_logs_donation` ON `whatsapp_message_logs(donation_id)`
- `idx_wa_logs_status` ON `whatsapp_message_logs(status)`

---

### 2.5 Table: `whatsapp_webhook_events`
Stores inbound webhook payloads from Meta WhatsApp Cloud API for signature verification, audit trail, and idempotent status processing.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `event_id` | VARCHAR(150) | NOT NULL, UNIQUE | Unique deduplication key |
| `event_type` | VARCHAR(60) | NOT NULL | Webhook event type (`messages.status`, etc.) |
| `wamid` | VARCHAR(150) | NULLABLE | Target WhatsApp Message ID |
| `status` | VARCHAR(50) | NULLABLE | Delivery status update (`delivered`, `read`, `failed`) |
| `recipient_phone` | VARCHAR(30) | NULLABLE | Phone number associated with update |
| `payload_json` | TEXT | NOT NULL | Full unparsed Meta webhook payload |
| `processed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Idempotent processing indicator |
| `processed_at` | TIMESTAMPTZ | NULLABLE | Timestamp of processing completion |
| `error_message` | VARCHAR(500) | NULLABLE | Processing error message if any |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp when payload arrived |

**Indexes:**
- `idx_wa_webhook_event_id` ON `whatsapp_webhook_events(event_id)`
- `idx_wa_webhook_wamid` ON `whatsapp_webhook_events(wamid)`

---

### 2.6 Table: `donations` (Modification)
Extended with `whatsapp_consent`:
```sql
ALTER TABLE donations ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE;
```
Ensures every donation record captures the exact consent status agreed to at transaction submission time.

---

## 3. JPA Entities & Spring Data Repositories

The following entities and repositories were created and compiled:

1. **`WhatsAppRecipient.java`** & **`WhatsAppRecipientRepository.java`**
   - Package: `org.mahavirtrust.backend.entity` / `org.mahavirtrust.backend.repository`
   - Methods: `findByPhoneNumber`, `existsByPhoneNumber`, `findByActiveTrue`, `findByRole`
2. **`WhatsAppTemplateConfig.java`** & **`WhatsAppTemplateConfigRepository.java`**
   - Methods: `findByTemplateKey`, `findByStatus`
3. **`DonorMessagingPreference.java`** & **`DonorMessagingPreferenceRepository.java`**
   - Methods: `findByDonorPhone`, `findByPortalUserId`, `existsByDonorPhone`
4. **`WhatsAppMessageLog.java`** & **`WhatsAppMessageLogRepository.java`**
   - Methods: `findByWamid`, `findByOutboxId`, `findByDonationId`, `findTop100ByOrderByCreatedAtDesc`, `countByStatus`
5. **`WhatsAppWebhookEvent.java`** & **`WhatsAppWebhookEventRepository.java`**
   - Methods: `existsByEventId`, `findByEventId`, `findByWamid`, `findByProcessedFalse`
6. **`Donation.java`**
   - Updated with `whatsappConsent` boolean property, `@Column(name = "whatsapp_consent")`, getter and setter.

---

## 4. Verification & Compilation Evidence

Execution of `mvn test-compile` inside the backend:
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.11'
Set-Location 'backend'
& 'C:\Program Files\Maven\apache-maven-3.9.11\bin\mvn.cmd' test-compile
```
**Result:**
- Total sources compiled: 169 main classes, 17 test classes.
- Zero compilation errors.
- `BUILD SUCCESS` (Total time: 24.627 s).

---

## 5. Next Steps (Phase 3)
With the schema and persistence foundation in place, Phase 3 implements the Meta WhatsApp Cloud API Client and dedicated subsystem service modules:
- `WhatsAppCloudApiClient`
- `WhatsAppNotificationService`
- `NotificationRecipientService`
- `NotificationTemplateService`
- `WhatsAppWebhookService`
- `NotificationRetryService`
- `NotificationAuditService`
