# MECT PHASE 19 — PRODUCTION DEPLOYMENT & ROLLBACK RUNBOOK

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** https://mect.org.in/  
**Target Repository:** `MAHAVIR-TRUST`  
**Candidate Release Commit:** `cb5b55486e4d8105a321554e579c972492f6f62d`  
**Branch:** `motion-ui`  
**Status:** **AWAITING EXPLICIT PRODUCTION DEPLOYMENT AUTHORIZATION**

---

## 1. PRE-DEPLOYMENT PREREQUISITES & CHECKLIST

- [ ] **Explicit Human Authorization:** Written sign-off from Trust Management / System Owner.
- [ ] **Target Isolation Confirmed:** Verify deployment scripts target exclusively MECT directories and systemd services (`mect-backend`, `mect-frontend`). **Zero touch of OHO TECH or other VPS applications.**
- [ ] **Full Production Backup:** Run `pg_dump` on production database before applying any files or migrations.
- [ ] **Environment Secrets Verified:** Verify production `.env` contains valid production credentials (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `RESEND_API_KEY`, `JWT_SECRET`, `OTP_HASH_PEPPER`, `DB_PASSWORD`).

---

## 2. PRODUCTION DEPLOYMENT SEQUENCE (STEP-BY-STEP)

### Step 1: Database Pre-Deployment Snapshot
```bash
sudo -u postgres pg_dump -d mahavir_trust_prod -F c -b -v -f "/var/backups/mect/mect_prod_pre_release_$(date +%Y%m%d_%H%M%S).dump"
```

### Step 2: Backend Application Release
1. Build artifact: `backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar`
2. Copy jar to production directory: `/opt/mect/backend/mahavir-backend.jar`
3. Restart backend systemd service:
   ```bash
   sudo systemctl restart mect-backend
   ```
4. Check backend health endpoint:
   ```bash
   curl -s http://127.0.0.1:8080/api/v1/actuator/health
   # Expected output: {"status":"UP"}
   ```
5. Verify Flyway migration logs: Check `journalctl -u mect-backend -n 100` to confirm Flyway applied V11 cleanly.

### Step 3: Frontend Application Release
1. Install dependencies & build:
   ```bash
   npm run build
   ```
2. Restart frontend systemd service:
   ```bash
   sudo systemctl restart mect-frontend
   ```
3. Verify local HTTP 200 response:
   ```bash
   curl -I http://127.0.0.1:3000/
   ```

### Step 4: Reverse Proxy & Live Smoke Checks
1. Reload Nginx without downtime:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```
2. Run public smoke tests:
   - Check `https://mect.org.in/`
   - Check `https://mect.org.in/donate`
   - Check `https://mect.org.in/api/v1/actuator/health`
   - Check `https://mect.org.in/sitemap.xml`
   - Verify that test page `https://mect.org.in/api/v1/public/cms/pages/qa-acceptance` returns 404.

---

## 3. ROLLBACK PROCEDURES & TRIGGERS

### 3.1 Rollback Triggers
Initiate immediate rollback if any of the following occur:
- Backend fails to reach `status: UP` within 60 seconds of restart.
- PostgreSQL throws unresolvable connection pool or migration exceptions.
- HTTP 500 error rate exceeds 0.5% during post-deployment smoke tests.
- Online payment initiation fails or produces unhandled exceptions.

### 3.2 Rollback Actions by Subsystem

#### A. Frontend Rollback (Zero Data Risk)
1. Revert to previous build directory or checkout previous release commit `155dd00`.
2. Run `npm run build && sudo systemctl restart mect-frontend`.

#### B. Backend Rollback (Code Revert)
1. Restore previous application jar:
   ```bash
   sudo cp /opt/mect/backend/mahavir-backend.jar.bak /opt/mect/backend/mahavir-backend.jar
   sudo systemctl restart mect-backend
   ```

#### C. Database Recovery Strategy
- **Forward-Recovery Preferred:** Schema migration V11 is strictly additive (creates new tables and adds nullable columns). Because of this, previous backend versions can run against the V11 schema without schema modification.
- **Full Database Rollback (Extreme Disaster Recovery):**
  If catastrophic data corruption occurred:
  ```bash
  sudo systemctl stop mect-backend
  sudo -u postgres pg_restore -d mahavir_trust_prod --clean --if-exists /var/backups/mect/mect_prod_pre_release_<timestamp>.dump
  sudo systemctl start mect-backend
  ```

