# MECT WhatsApp Notification Engine — Phase 3 Meta Integration Report

**Project:** Mahavir Educational & Charitable Trust (MECT)  
**Repository Branch:** `feat/mect-whatsapp-donation-notifications`  
**Phase:** 3 — Meta WhatsApp Cloud API Client & Subsystem Modules  
**Status:** COMPLETED & VERIFIED  
**Date:** 2026-11-22  

---

## 1. Executive Summary

Phase 3 implements the enterprise Meta WhatsApp Business Cloud API client subsystem and its supporting service modules. The architecture guarantees:
1. **Isolated HTTP Transport:** Built upon Spring `RestClient` using `SimpleClientHttpRequestFactory` to avoid native Windows loopback named-pipe socket issues and enforce 5-second connect and 10-second read timeouts.
2. **Strict Cryptographic Security:** Enforces HMAC SHA-256 signature verification (`X-Hub-Signature-256`) on all inbound webhook callbacks via `HmacCryptoUtil` using `WHATSAPP_APP_SECRET`.
3. **Template-Driven Notifications:** Complies with Meta's Utility Category policies by binding strongly typed parameters to pre-approved templates.
4. **Resilient Outbox & Idempotent Audit:** Messages are dispatched through the transactional outbox pattern; inbound webhook delivery events (`sent`, `delivered`, `read`, `failed`) are deduplicated and logged.
5. **Administrative Management:** Provides full REST API controls for configuring authorized admin recipient phone numbers, template parameters, delivery log inspection, test dispatches, and manual re-queuing.

---

## 2. Core Subsystem Modules Implemented

The subsystem is implemented under `org.mahavirtrust.backend.service.notification.whatsapp` and `org.mahavirtrust.backend.controller`:

### 2.1 `WhatsAppCloudApiClient`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppCloudApiClient.java`
- **Implements:** `WhatsAppProvider` (marked `@Primary`)
- **Key Capabilities:**
  - Phone Number Normalization: Automatically sanitizes phone input, strips non-digits, and normalizes 10-digit Indian numbers to E.164 standard (`91XXXXXXXXXX`).
  - Meta Graph API Integration: Dispatches POST requests to `https://graph.facebook.com/{apiVersion}/{phoneNumberId}/messages` with Bearer token authentication.
  - Parameter Component Serialization: Automatically formats dynamic template body parameters (`{"type": "body", "parameters": [{"type": "text", "text": "..."}]}`).
  - Response Parsing: Extracts Meta message ID (`wamid.HBg...`) and categorizes status into `SENT`, `REQUIRES_PROVIDER_CONFIG`, `REQUIRES_TEMPLATE_APPROVAL`, or `FAILED`.
  - Signature Verification: Verifies `X-Hub-Signature-256` using constant-time HMAC SHA-256 comparison.

### 2.2 `NotificationRecipientService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/NotificationRecipientService.java`
- **Responsibilities:**
  - Manages authorized trustee and administrator WhatsApp numbers stored in `whatsapp_recipients`.
  - Filters active recipients based on event triggers:
    - `isNotifyOnDonation`: For direct and verified donation receipts.
    - `isNotifyOnClaim`: For manual bank transfer / UPI claims submitted for verification.
    - `isNotifyOnRefund`: For refund alerts.
    - `isNotifyDailySummary`: For daily aggregate reports.
  - CRUD operations with phone validation and active toggle support.

### 2.3 `NotificationTemplateService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/NotificationTemplateService.java`
- **Responsibilities:**
  - Manages template configurations in `whatsapp_template_configs`.
  - Maps named model attributes (e.g., `donor_name`, `amount`, `reference_number`, `receipt_number`) to positional template parameters `{{1}}`, `{{2}}`, etc., as approved in Meta Business Manager.

### 2.4 `DonorMessagingPreferenceService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/DonorMessagingPreferenceService.java`
- **Responsibilities:**
  - Stores explicit WhatsApp opt-in consent for guest donors and portal users.
  - Captures IP address, source form, and policy version (`v1.0`).
  - Supports instant opt-out and preference lookup.

### 2.5 `WhatsAppMessageLogService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppMessageLogService.java`
- **Responsibilities:**
  - Records initial queued state, dispatched `wamid`, timestamps, and delivery outcomes.
  - Updates delivery timestamps (`sent_at`, `delivered_at`, `read_at`) and captures error codes upon webhook delivery callbacks.
  - Aggregates delivery metrics for admin reporting.

### 2.6 `WhatsAppWebhookService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppWebhookService.java`
- **Responsibilities:**
  - Handles GET challenge verification: `hub.mode == "subscribe"` and `hub.verify_token == WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
  - Idempotently parses POST webhook payloads with deduplication via `event_id` (`wamid:status`).
  - Updates message logs and notifies `NotificationOutboxService`.

### 2.7 `WhatsAppNotificationService`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/service/notification/whatsapp/WhatsAppNotificationService.java`
- **Responsibilities:**
  - Central orchestrator invoked during donation lifecycles.
  - Admin Alert Dispatch: Broadcasts alerts to all active administrators matching event criteria.
  - Donor Notification Dispatch: Enqueues donor receipt/status templates strictly if donor consented.
  - Atomic Transaction Safety: All outbox entries are committed atomically; dispatches run in isolated try-catch blocks to prevent financial transaction rollback.

### 2.8 `AdminWhatsAppController`
- **Location:** `backend/src/main/java/org/mahavirtrust/backend/controller/AdminWhatsAppController.java`
- **Security:** Secured by `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'FINANCE_OFFICER', 'AUDITOR')")`
- **Endpoints:**
  - `GET /api/v1/admin/whatsapp/status`: System health, credentials mask, recipient and template counts, message delivery metrics.
  - `GET /api/v1/admin/whatsapp/recipients`: List of authorized recipient numbers.
  - `POST /api/v1/admin/whatsapp/recipients`: Add new authorized recipient.
  - `PUT /api/v1/admin/whatsapp/recipients/{id}`: Edit recipient details and notification toggles.
  - `DELETE /api/v1/admin/whatsapp/recipients/{id}`: Remove recipient.
  - `PATCH /api/v1/admin/whatsapp/recipients/{id}/toggle`: Toggle active status.
  - `GET /api/v1/admin/whatsapp/templates`: View approved Meta templates and parameter mappings.
  - `PUT /api/v1/admin/whatsapp/templates/{key}`: Update template configuration.
  - `GET /api/v1/admin/whatsapp/logs`: Audit trail of recent WhatsApp messages and statuses.
  - `POST /api/v1/admin/whatsapp/test`: Send a test template message.
  - `POST /api/v1/admin/whatsapp/retry/{outboxId}`: Trigger an immediate retry of a failed or queued message.

---

## 3. Configuration & Environment Variables

Added to `application.yml` with sensible defaults and complete backward compatibility:
```yaml
app:
  whatsapp:
    enabled: ${WHATSAPP_ENABLED:false}
    provider: ${WHATSAPP_PROVIDER:META_CLOUD}
    api-version: ${WHATSAPP_GRAPH_API_VERSION:${WHATSAPP_API_VERSION:v21.0}}
    phone-number-id: ${WHATSAPP_PHONE_NUMBER_ID:}
    business-account-id: ${WHATSAPP_BUSINESS_ACCOUNT_ID:}
    access-token: ${WHATSAPP_ACCESS_TOKEN:}
    verify-token: ${WHATSAPP_WEBHOOK_VERIFY_TOKEN:}
    app-secret: ${WHATSAPP_APP_SECRET:}
    admin-template: ${WHATSAPP_ADMIN_TEMPLATE:mect_donation_admin_alert}
    donor-receipt-template: ${WHATSAPP_DONOR_RECEIPT_TEMPLATE:mect_donation_receipt}
    pending-template: ${WHATSAPP_PENDING_TEMPLATE:mect_donation_pending}
    verified-template: ${WHATSAPP_VERIFIED_TEMPLATE:mect_donation_verified}
    rejected-template: ${WHATSAPP_REJECTED_TEMPLATE:mect_donation_rejected}
    daily-summary-template: ${WHATSAPP_DAILY_SUMMARY_TEMPLATE:mect_daily_donation_summary}
```

---

## 4. Verification & Build Results

Compiled using Java 21 and Maven 3.9.11:
```powershell
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-21.0.11'
Set-Location 'backend'
& 'C:\Program Files\Maven\apache-maven-3.9.11\bin\mvn.cmd' test-compile
```
**Output:**
- 177 source files compiled to `target/classes`.
- 17 test source files compiled to `target/test-classes`.
- `BUILD SUCCESS` (Total time: 27.730 s).

---

## 5. Next Steps (Phase 4)
Phase 4 connects `WhatsAppNotificationService` directly into `DonationLifecycleService` to trigger automated notifications across all 4 payment pathways:
1. Cashfree payments (`confirmPaymentInternal`).
2. Razorpay payments (`confirmPaymentInternal`).
3. Self-hosted UPIHost payments.
4. SBI Direct manual transfer claims (`submitManualSbiUtr`, `reviewManualSbiClaim` -> `VERIFIED` / `REJECTED`).
5. Refunds (`processRefundInternal`).
