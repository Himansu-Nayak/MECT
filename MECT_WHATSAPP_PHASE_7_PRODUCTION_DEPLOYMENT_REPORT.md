# MECT Enterprise WhatsApp Donation Notification Engine
## Phase 7 Deliverable: Production Deployment & Operations Runbook

**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production Domain:** https://mect.org.in  
**Repository Branch:** `feat/mect-whatsapp-donation-notifications`  
**Date:** 2026-11-22  
**Integration:** Meta WhatsApp Business Cloud API (Graph API v21.0)  
**Backend:** Java 21 + Spring Boot  
**Database:** PostgreSQL 17 / Flyway V18  
**Frontend:** Next.js (App Router)

---

## 1. Executive Summary

This production deployment guide documents the complete end-to-end operational procedure for deploying, configuring, activating, and monitoring the **MECT Enterprise WhatsApp Donation Notification Engine**.

The subsystem delivers automated, real-time donation notifications to:
1. **MECT Administrative Leadership / Trustees:** Instant alerts whenever a donation or manual payment claim is submitted, verified, refunded, or settled.
2. **Opted-in Donors:** Transactional verification messages, official receipt notifications, and status updates directly on WhatsApp using Meta-approved utility templates.

The architecture is built on the **Transactional Outbox Pattern**: donation and claim persistence is 100% decoupled from WhatsApp API availability. If Meta API is unreachable, down, or credentials are unconfigured, donations and claims succeed without disruption, while events are queued in `whatsapp_message_logs` with clear diagnostic status.

---

## 2. Meta WhatsApp Business Cloud API Setup Runbook

To connect MECT's production platform to Meta WhatsApp Business Cloud API, complete the following administrative setup in the [Meta for Developers Portal](https://developers.facebook.com/) and [Meta Business Manager](https://business.facebook.com/).

### 2.1. Create Meta Developer App & Add WhatsApp
1. Log in to [Meta for Developers](https://developers.facebook.com/) with the authorized MECT organizational account.
2. Navigate to **My Apps** > **Create App**.
3. Select **Other** > **Business** app type.
4. App Name: `MECT Notifications Engine`.
5. Link to the official **MECT Meta Business Account**.
6. In the App Dashboard, click **Set Up** on the **WhatsApp** product.

### 2.2. Register Phone Number & Obtain IDs
1. Under **WhatsApp** > **API Setup**:
   - Locate the **Phone number ID** (e.g. `104829182948291`).
   - Locate the **WhatsApp Business Account ID (WABA ID)** (e.g. `109283746501928`).
2. Add the Trust's official dedicated WhatsApp phone number (must be capable of receiving SMS/voice verification code and not already registered on personal WhatsApp).
3. Complete the business display name review (e.g. `Mahavir Educational & Charitable Trust`).

### 2.3. Generate Permanent System User Access Token
> [!IMPORTANT]
> Never use temporary 24-hour test tokens in production. A permanent System User token must be generated.

1. Navigate to [Meta Business Settings](https://business.facebook.com/settings).
2. Go to **Users** > **System Users**.
3. Click **Add**, name the user `mect-whatsapp-bot`, and assign the role **Admin System User**.
4. Click **Generate New Token**:
   - Select the `MECT Notifications Engine` app.
   - Set Token Expiration to **Never**.
   - Select the following required permissions:
     - `whatsapp_business_messaging` (Required for sending template messages)
     - `whatsapp_business_management` (Required for reading phone number and template status)
5. Copy the generated permanent access token and save it into the VPS production environment vault as `WHATSAPP_ACCESS_TOKEN`.

### 2.4. Configure Webhooks
1. In Meta App Dashboard, navigate to **WhatsApp** > **Configuration** > **Webhooks**:
   - **Callback URL:** `https://mect.org.in/api/v1/webhooks/whatsapp` (also aliased at `https://mect.org.in/webhooks/whatsapp`)
   - **Verify Token:** Set to a secure random string (min 32 chars), matching `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
2. Click **Verify and Save**. The backend verifies `hub.challenge` and returns `200 OK`.
3. In the Webhook fields list, click **Subscribe** on the `messages` field to receive delivery status receipts (`sent`, `delivered`, `read`, `failed`).

---

## 3. Message Template Registration Guide

Meta requires all business-initiated messages to use pre-approved templates under the **UTILITY** category. Submit the following 6 templates in Meta WhatsApp Manager:

### Template 1: `mect_donation_admin_alert` (Admin Instant Alert)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
🚨 *MECT Donation Alert*

A new contribution has been received.
• *Amount:* {{1}}
• *Donor:* {{2}}
• *Programme:* {{3}}
• *Payment Mode:* {{4}}
• *Reference:* {{5}}

Thank you for serving the community.
```
- **Sample Values:** `INR 5,000.00`, `Ramesh Chandra Sharma`, `General Charitable Fund`, `DIRECT_SBI_TRANSFER`, `MECT-DON-2026-A1B2C3`

### Template 2: `mect_donation_receipt` (Online Gateway Donation Receipt)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
🙏 *Namaste {{1}}*,

Thank you for your generous contribution of *{{2}}* to *Mahavir Educational & Charitable Trust (MECT)*.

• *Programme:* {{3}}
• *Reference:* {{4}}
• *Receipt No:* {{5}}

Access your verified receipt on the Trust portal:
{{6}}

Your contribution supports education, healthcare, and humanitarian welfare.
```
- **Sample Values:** `Sunil Kumar`, `INR 2,500.00`, `Education Support`, `MECT-DON-2026-001`, `MECT-RCPT-2026-9871`, `https://mect.org.in/portal/dashboard`

### Template 3: `mect_donation_pending` (SBI / Manual Claim Submission)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
🙏 *Namaste {{1}}*,

We have received your direct bank transfer submission of *{{2}}* for *Mahavir Educational & Charitable Trust (MECT)*.

• *Programme:* {{3}}
• *UTR / Reference:* {{4}}

Our treasury team will verify this transfer against bank records. You will receive an official numbered receipt once verified.

Track status at:
{{5}}
```
- **Sample Values:** `Pooja Nayak`, `INR 10,000.00`, `Community Healthcare`, `SBI9876543210`, `https://mect.org.in/donate/status`

### Template 4: `mect_donation_verified` (Manual Claim Verified & Receipt Issued)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
🙏 *Namaste {{1}}*,

Your direct contribution of *{{2}}* has been *verified* by the Trust treasury.

• *Reference:* {{3}}
• *Receipt No:* {{4}}

View and download your official numbered receipt:
{{5}}

With sincere gratitude,
*Mahavir Educational & Charitable Trust (MECT)*
```
- **Sample Values:** `Pooja Nayak`, `INR 10,000.00`, `MECT-DON-2026-X9Y8Z7`, `MECT-RCPT-2026-8812`, `https://mect.org.in/portal/dashboard`

### Template 5: `mect_donation_rejected` (Manual Claim Discrepancy Alert)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
🙏 *Namaste {{1}}*,

Regarding your payment claim of *{{2}}* (Ref: {{3}}):

The Trust treasury was unable to reconcile this transfer against bank statements.
*Reason:* {{4}}

Please verify your bank statement or contact the Trust Secretariat at contact@mect.org.in for assistance.
```
- **Sample Values:** `Alok Mohanty`, `INR 1,000.00`, `MECT-DON-2026-T1T2`, `UTR not found in bank ledger`

### Template 6: `mect_daily_donation_summary` (Daily Digest for Leadership)
- **Category:** UTILITY
- **Language:** English (`en_US` or `en`)
- **Header:** None
- **Body:**
```
📊 *MECT Daily Donation Digest — {{1}}*

• *Total Collected:* {{2}}
• *Donation Count:* {{3}}
• *Direct Bank Transfers:* {{4}}
• *Gateway Transactions:* {{5}}

Portal: {{6}}
```
- **Sample Values:** `22-Nov-2026`, `INR 45,000.00`, `12`, `8`, `4`, `https://mect.org.in/admin/dashboard`

---

## 4. Production Environment Configuration

Add the following environment variables to the production `.env` file on the VPS:

```ini
# ==============================================================================
# Enterprise WhatsApp Notification Engine Configuration
# ==============================================================================
WHATSAPP_ENABLED=true
WHATSAPP_PHONE_NUMBER_ID=104829182948291
WHATSAPP_BUSINESS_ACCOUNT_ID=109283746501928
WHATSAPP_API_VERSION=v21.0
WHATSAPP_ACCESS_TOKEN=EAAB...your_system_user_permanent_token_here...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_secure_random_verification_token_min_32_chars
WHATSAPP_APP_SECRET=your_meta_app_secret_from_app_dashboard
```

---

## 5. Deployment Step-by-Step Execution Plan

### Step 5.1: Database Migration Execution
- When the backend application starts, Flyway automatically discovers and applies `V18__enterprise_whatsapp_notification_engine.sql`.
- Migration creates:
  - Column `whatsapp_consent` on `donations`.
  - Tables: `whatsapp_recipients`, `whatsapp_template_configs`, `donor_messaging_preferences`, `whatsapp_message_logs`, `whatsapp_webhook_events`.
  - Seeds the 6 utility template configurations with default bindings.

### Step 5.2: Docker Container Build & Restart
```bash
# Build backend with Java 21
docker compose -f compose.production.yaml build backend

# Build frontend with Next.js
docker compose -f compose.production.yaml build frontend

# Restart services with zero-downtime rolling update
docker compose -f compose.production.yaml up -d --no-deps backend frontend
```

### Step 5.3: Verify Deployment Health
1. **Flyway Migration Check:**
   ```bash
   docker compose -f compose.production.yaml logs backend | grep -i "V18"
   # Expected output: Successfully applied 1 migration to schema 'public': V18__enterprise_whatsapp_notification_engine.sql
   ```
2. **Spring Boot Health Probe:**
   ```bash
   curl -s http://127.0.0.1:8080/actuator/health
   # Expected output: {"status":"UP"}
   ```
3. **WhatsApp Engine Status Probe (as Admin):**
   ```bash
   curl -s -H "Authorization: Bearer <ADMIN_JWT>" http://127.0.0.1:8080/api/v1/admin/whatsapp/status
   # Expected output: {"enabled":true,"configured":true,"phoneNumberId":"...","apiVersion":"v21.0"}
   ```

---

## 6. Post-Deployment Administrative Setup

1. **Configure Admin Recipients:**
   - Log into the MECT Admin Portal: `https://mect.org.in/admin/whatsapp`.
   - In the **Recipients** tab, click **Add Recipient**.
   - Enter Administrator Name, WhatsApp Phone Number (e.g. `+91 98765 43210`), and role (`Treasurer`, `Trustee`, `Secretariat`).
   - Enable event subscriptions:
     - `Notify on Donations` (Enabled)
     - `Notify on Claims` (Enabled)
     - `Notify on Refunds` (Enabled)
     - `Daily Summary` (Enabled)
2. **Send Test Dispatch:**
   - Navigate to the **Test Dispatcher** tab.
   - Enter a test recipient phone number.
   - Select template `mect_donation_admin_alert`.
   - Provide test positional parameters.
   - Click **Send Test Notification**.
   - Verify receipt on the target WhatsApp device and confirm log entry in **Delivery Logs**.

---

## 7. Rollback & Fail-Safe Procedures

### 7.1. Emergency Circuit Breaker (Instant Disable)
If Meta API experiences rate limiting, service degradation, or configuration issues:
- Set `WHATSAPP_ENABLED=false` in `.env` and run `docker compose -f compose.production.yaml restart backend`.
- Alternatively, toggle off the subsystem in `AdminWhatsAppController` or deactivate all recipient rows in `whatsapp_recipients`.
- **Financial impact:** **NONE.** All donations, claims, receipts, and portal logins continue normal operation without delay.

### 7.2. Database Rollback Note
- `V18` adds additive tables and non-null default columns (`whatsapp_consent BOOLEAN DEFAULT FALSE`).
- Rolling back the backend application image without dropping tables is completely safe: older code simply ignores the new tables.

---

## 8. Maintenance & Operational Monitoring

- **Delivery Status Monitoring:** Review `/admin/whatsapp` delivery logs periodically. Statuses include:
  - `QUEUED`: Enqueued for dispatch.
  - `SENT`: Accepted by Meta Cloud API.
  - `DELIVERED`: Delivered to recipient handset.
  - `READ`: Read by recipient.
  - `FAILED`: Delivery failed (e.g., number not on WhatsApp, expired template window).
- **Outbox Retry Mechanism:** Failed dispatches can be retried individually or in batches via the admin dashboard button `Retry Failed Dispatches`.
- **Audit Logs:** All admin modifications and dispatch triggers are recorded in `audit_logs` under action `ADMIN_WHATSAPP_*`.
