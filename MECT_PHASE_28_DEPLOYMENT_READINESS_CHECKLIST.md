# MECT PHASE 28 — PRODUCTION DEPLOYMENT READINESS CHECKLIST
## Pre-Release Verification, Rollback Procedures, Secret Validation & Safe Handover Charter

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 28 — Premium Donor Authentication & Donation Experience Transformation  
**Production Host:** `200.97.161.128` (Protected VPS)  
**Deployment Policy:** **STRICT PRODUCTION FREEZE.** Under no circumstances may this checklist be executed against production without the Project Owner's explicit written authorization.

---

## 1. PRE-DEPLOYMENT GATES & VERIFICATION AUDIT

All 8 pre-deployment gates have been verified in the local staging environment:

| Gate | Verification Check | Automated Staging Result | Staging Evidence |
| :--- | :--- | :--- | :--- |
| **Gate 01** | **Static Route Generation** | **PASS (51/51 Routes)** | `npm run build` completed with zero errors. |
| **Gate 02** | **TypeScript Compilation** | **PASS (0 Errors)** | `npm run typecheck` (`tsc --noEmit`) clean. |
| **Gate 03** | **ESLint Syntax & Hook Audit** | **PASS (0 Errors)** | `npm run lint` clean. |
| **Gate 04** | **Backend Unit & Integration Tests** | **PASS (126/126 Tests)** | `mvn test` BUILD SUCCESS in 49.7s. |
| **Gate 05** | **Authentication Access Control** | **PASS (Verified)** | Unauthenticated requests to `/initiate` return HTTP 401. |
| **Gate 06** | **Database Migration Integrity** | **PASS (V16 Applied)** | Flyway migration `V16` verified on PostgreSQL and H2. |
| **Gate 07** | **Visual Regression Review** | **PASS (15 Viewports)** | High-resolution screenshots captured in `reports/mect-phase-28/` and `reports/mect-phase-29/`. |
| **Gate 08** | **Zero Hardcoded Secrets** | **PASS (Audited)** | All API keys, secrets, and credentials read from environment variables. |

---

## 2. PRODUCTION ENVIRONMENT VARIABLES CHECKLIST

Ensure the following environment variables are properly set in the production container runtime prior to unfreezing:

### 2.1 Backend Environment Configuration
```ini
# Database Connection
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/mect_prod
SPRING_DATASOURCE_USERNAME=mect_db_user
SPRING_DATASOURCE_PASSWORD=***** (Secure Vault)

# JWT Signing Secret (Minimum 256-bit high-entropy key)
APP_JWT_SECRET=***** (Secure Vault)
APP_JWT_EXPIRATION_MINUTES=15
APP_JWT_REFRESH_EXPIRATION_DAYS=30

# SMS Provider Integration (Authorized Gateway)
SMS_PROVIDER_NAME=SMS_COUNTRY_OR_MSG91
SMS_AUTH_KEY=***** (Secure Vault)
SMS_SENDER_ID=MECTOD
SMS_DLT_TE_ID_OTP=110716... (DLT Registered Template)

# Payment Gateway Keys
CASHFREE_APP_ID=***** (Production Merchant App ID)
CASHFREE_SECRET_KEY=***** (Production Secret)
CASHFREE_API_VERSION=2023-08-01
CASHFREE_WEBHOOK_SECRET=***** (Production Webhook Signature Key)

# Fiduciary Coordinates
MECT_OFFICIAL_HELPLINE=+919853608113
MECT_OFFICIAL_EMAIL=mect220@gmail.com
```

### 2.2 Frontend Staging Configuration
```ini
NEXT_PUBLIC_BASE_URL=https://mect.org.in
NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=PRODUCTION
```

---

## 3. STEP-BY-STEP DEPLOYMENT RUNBOOK (WHEN AUTHORIZED)

> [!WARNING]
> DO NOT EXECUTE THESE STEPS WITHOUT EXPLICIT PROJECT-OWNER WRITTEN CONSENT.

### Step 1: Pre-Release Database Backup
```bash
# On Production VPS:
ssh root@200.97.161.128
cd /opt/mect
./scripts/backup-db.sh
# Verify snapshot size > 0 and file exists in /opt/mect/backups/
```

### Step 2: Fetch and Inspect Feature Branch
```bash
git fetch origin
git checkout feat/phase-29-complete-website-excellence
git verify-commit HEAD
```

### Step 3: Execute Flyway Schema Migration
```bash
# Verify schema migration V16 applies cleanly:
docker compose run --rm backend-migrate
```

### Step 4: Build and Deploy Staged Containers
```bash
docker compose build frontend backend
docker compose up -d --no-deps backend
# Await health check HTTP 200 on /actuator/health
docker compose up -d --no-deps frontend
```

### Step 5: Post-Deployment Smoke Verification
1. Open `https://mect.org.in/donate` in an incognito window.
2. Select a programme and amount; verify that Step 3 prompts for mobile OTP.
3. Test OTP request and verify receipt on registered test phone.
4. Verify donor dashboard loads at `https://mect.org.in/portal/dashboard`.
5. Check backend logs for any unhandled exceptions:
   ```bash
   docker compose logs -f --tail=100 backend
   ```

---

## 4. ROLLBACK & DISASTER RECOVERY PROTOCOL

If any unexpected degradation or gateway failure occurs post-release:

1. **Immediate Container Rollback:**
   ```bash
   git checkout 40b8cae # Phase 28 baseline
   docker compose up -d --build
   ```
2. **Database Schema Rollback (If Required):**
   ```bash
   ./scripts/restore-db.sh /opt/mect/backups/pre_phase28_backup.sql
   ```
3. **Notify Secretariat:**
   Immediate alert to MECT Technical Lead at `9853608113` / `mect220@gmail.com`.
