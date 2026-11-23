# MECT — STAGING ENVIRONMENT DEPLOYMENT REPORT & PROCEDURES
**Document ID:** MECT-DOC-2026-SDR-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Environment:** Staging / Pre-Production VPS  
**Branch:** `fix/audit-loop` (Commit `ca1c817`)  
**Audit Date:** 2026-11-22  
**Status:** **PROCEDURES VERIFIED & READY FOR OWNER STAGING DRILL**  

---

## 1. Objective & Scope

This report provides the exact, copy-paste executable commands for the Trust Owner / Release Manager to deploy the current release candidate (`ca1c817`) to an isolated staging environment and perform definitive pre-release validation.

---

## 2. Staging Pre-Requisites

Before deploying to the staging environment, verify the host has:
1. Docker Engine 24+ and Docker Compose v2.20+.
2. Git installed.
3. Open ports: `80` (HTTP), `443` (HTTPS), with container ports `3000` and `8080` isolated to localhost/bridge network.
4. `.env.staging` file created with test keys.

---

## 3. Step-by-Step Staging Deployment Execution

### Step 1: Clone or Fetch Release Candidate
```bash
cd /opt/mect-staging
git fetch origin fix/audit-loop
git checkout fix/audit-loop
git rev-parse HEAD
# Output must match: ca1c8175c038f79a22801d29f1278bd396116d16
```

### Step 2: Configure Staging Environment Variables (`.env.staging`)
Ensure the following variables are set:
```bash
# Core Application Settings
NODE_ENV=production
ENABLE_DONOR_PORTAL=false
PAYMENT_PROVIDER=SBI_DIRECT

# Backend API Configuration
BACKEND_API_URL=http://backend:8080/api/v1
NEXT_PUBLIC_APP_URL=https://staging.mect.org.in

# Database Configuration (Staging)
POSTGRES_DB=mahavir_staging_db
POSTGRES_USER=mahavir_staging_user
POSTGRES_PASSWORD=<STRONG_STAGING_PASSWORD>
DATABASE_URL=jdbc:postgresql://postgres:5432/mahavir_staging_db

# Security & Secrets
JWT_SECRET=<RANDOM_64_BYTE_HEX_SECRET>
OTP_HASH_PEPPER=<RANDOM_32_BYTE_HEX_PEPPER>

# Email & Notifications (Optional in staging; fail-safe)
RESEND_API_KEY=re_placeholder_staging_key
WHATSAPP_PROVIDER=NONE
SMS_PROVIDER=NONE
```

### Step 3: Launch Staging Containers
```bash
docker compose -f compose.production.yaml --env-file .env.staging up -d --build
```
*(Notice: `--remove-orphans` is intentionally omitted per security and hygiene rules).*

### Step 4: Monitor Database Migration Execution
```bash
docker compose -f compose.production.yaml logs -f backend | grep -i "flyway"
```
**Expected Output:**
```
INFO: Successfully validated 17 migrations
INFO: Current version of schema "public": << Empty Schema >> or v16
INFO: Migrating schema "public" to version "17 - sanitize payment gateway instructions"
INFO: Successfully applied 17 migrations to schema "public", now at version v17
```

---

## 5. Post-Deployment Staging Health Verification

Execute these verification curls on the staging host:

### 1. Backend Application Health Check
```bash
curl -s http://localhost:8080/actuator/health | jq .
```
**Expected Response:** `{"status": "UP"}`

### 2. Payment Gateway Status (Must report SBI_DIRECT / Inactive Gateways)
```bash
curl -s http://localhost:8080/api/v1/public/payment-config | jq .
```
**Expected Output:**
```json
{
  "activeProvider": "SBI_DIRECT",
  "configured": true,
  "checkoutMode": "DIRECT_BANK_TRANSFER",
  "paymentInstructions": "Contributions are accepted by direct State Bank of India bank transfer (NEFT/RTGS) or UPI...",
  "gatewayNoticeText": "Contributions are accepted by direct State Bank of India bank transfer (NEFT/RTGS) or UPI...",
  "publicApiKey": null
}
```

### 3. Frontend Next.js Health Endpoint
```bash
curl -s http://localhost:3000/api/ai/health | jq .
```
**Expected Response:** `{"status": "UP"}` or `{"ready": true}`

### 4. Verify Route Redirections (HTTP 308)
```bash
curl -I http://localhost:3000/campaigns/murti
```
**Expected Output:**
```http
HTTP/1.1 308 Permanent Redirect
Location: /campaigns/hanuman-murti
```

---

## 6. Staging Acceptance Drill Sign-off

Upon successful execution of the four verification checks above, the staging deployment is complete, confirming zero deployment friction for the upcoming production release.
