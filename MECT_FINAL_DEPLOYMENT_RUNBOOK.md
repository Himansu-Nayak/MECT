# MECT — PRODUCTION RELEASE DEPLOYMENT RUNBOOK
**Document ID:** MECT-DOC-2026-FDR-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Target Environment:** Hostinger VPS KVM 4 (Ubuntu 26.04 LTS), Production  
**Target Domain:** https://mect.org.in  
**Approved Release Commit:** `ca1c8175c038f79a22801d29f1278bd396116d16`  
**Execution Authority:** Trust Managing Trustee & Release Manager  

---

## 1. Release Pre-Conditions & Go/No-Go Checklist

Before executing any commands on the production host, verify:
- [x] Branch `fix/audit-loop` head matches commit `ca1c817` exactly.
- [x] Backend compilation & test suite passed (127/127 tests passed).
- [x] Next.js production build succeeded with `ENABLE_DONOR_PORTAL=false`.
- [x] Flyway migrations V1–V17 validated and tested.
- [x] Statutory bank details verified: SBI A/C `3334****498`, IFSC `SBIN0001701`.
- [ ] Maintenance window announced (estimated downtime: < 3 minutes).
- [ ] Owner has `.env.production` ready with production secrets.

---

## 2. Step-by-Step Production Deployment Execution

### Step 1: Establish Authenticated SSH Session to VPS
```bash
ssh -i ~/.ssh/mect_deploy_key <DEPLOY_USER>@<VPS_STATIC_IPV4>
```

### Step 2: Navigate to Production Deployment Directory
```bash
cd /opt/mect
```

### Step 3: Execute Pre-Deployment Database Backup (MANDATORY GATE)
> [!IMPORTANT]
> Never proceed to image pulling or container restart without a verified pre-deployment snapshot.

```bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p /var/backups/mect

docker exec mect-postgres pg_dump \
  -U mahavir_prod \
  -d mahavir_db \
  -Fc \
  --file=/tmp/backup_pre_${TIMESTAMP}.dump

docker cp mect-postgres:/tmp/backup_pre_${TIMESTAMP}.dump /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump
docker exec mect-postgres rm -f /tmp/backup_pre_${TIMESTAMP}.dump

sha256sum /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump > /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump.sha256
echo "Pre-deployment backup verified: /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump"
```

### Step 4: Checkout Release Candidate Commit
```bash
git fetch origin fix/audit-loop
git checkout ca1c8175c038f79a22801d29f1278bd396116d16

# Verify clean state
git status
```

### Step 5: Verify Production Environment File (`.env.production`)
Confirm permissions are restricted:
```bash
chmod 600 .env.production
```
Verify essential variables:
```bash
grep "^PAYMENT_PROVIDER" .env.production      # Must output: PAYMENT_PROVIDER=SBI_DIRECT
grep "^ENABLE_DONOR_PORTAL" .env.production   # Must output: ENABLE_DONOR_PORTAL=false
grep "^BACKEND_API_URL" .env.production       # Must output: BACKEND_API_URL=http://backend:8080/api/v1
```

### Step 6: Build & Restart Containers
```bash
docker compose -f compose.production.yaml --env-file .env.production build
docker compose -f compose.production.yaml --env-file .env.production up -d
```
*(Notice: `--remove-orphans` is omitted to protect external host services).*

### Step 7: Inspect Flyway Migration Execution
```bash
docker compose -f compose.production.yaml logs -f backend | grep -i "flyway"
```
**Required Log Marker:**
`Successfully applied 17 migrations to schema "public", now at version v17`

---

## 3. Post-Deployment Verification & Smoke Testing

Execute immediately following container restart:

| Step | Verification Command | Expected Output | Status |
| :---: | :--- | :--- | :---: |
| **1** | `curl -s http://localhost:8080/actuator/health` | `{"status":"UP"}` | [ ] |
| **2** | `curl -s http://localhost:8080/api/v1/public/payment-config` | `"activeProvider":"SBI_DIRECT"` | [ ] |
| **3** | `curl -s -I https://mect.org.in` | `HTTP/2 200` | [ ] |
| **4** | `curl -s -I https://mect.org.in/donate` | `HTTP/2 200` | [ ] |
| **5** | `curl -s -I https://mect.org.in/campaigns/murti` | `HTTP/2 308 Permanent Redirect` | [ ] |
| **6** | `curl -s -I https://mect.org.in/login` | `HTTP/2 404 Not Found` (Donor portal disabled) | [ ] |

---

## 4. Rollback Plan

### 4.1 Application-Only Rollback (No Data Loss)
If a critical UI defect or runtime issue occurs in the frontend or backend application:
1. Revert to previous Docker image tags or git commit:
   ```bash
   git checkout <PREVIOUS_STABLE_COMMIT>
   docker compose -f compose.production.yaml up -d --build backend frontend
   ```
2. The database remains at version V17. Because migrations V10–V17 are backward-compatible, older application code operates without errors.

### 4.2 Full Disaster Recovery (Database Restoration)
If catastrophic database corruption occurs:
1. Stop the application stack:
   ```bash
   docker compose -f compose.production.yaml stop backend frontend
   ```
2. Restore the pre-deployment snapshot:
   ```bash
   docker cp /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump mect-postgres:/tmp/restore.dump
   docker exec mect-postgres pg_restore -U mahavir_prod -d mahavir_db -c --if-exists /tmp/restore.dump
   docker exec mect-postgres rm -f /tmp/restore.dump
   ```
3. Restart application containers:
   ```bash
   docker compose -f compose.production.yaml start backend frontend
   ```

---

## 5. Deployment Sign-off

Upon completion of all post-deployment checks, notify the Trust Managing Trustee that the release is live and stable.
