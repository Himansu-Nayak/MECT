# MECT — PRODUCTION RELEASE DEPLOYMENT RUNBOOK (V18 & VISUAL ELEVATION)
**Document ID:** MECT-DOC-2026-FDR-02  
**Project:** MAHAVIR TRUST (Mahaveer Educational & Charitable Trust — MECT)  
**Target Environment:** Hostinger VPS KVM 4 (Ubuntu 24.04 LTS), Production  
**Production Domain:** https://mect.org.in  
**Base Branch:** `fix/audit-loop`  
**Unified Release Commit:** `04b8932` (on `feat/mect-whatsapp-donation-notifications`)  
**Clean WhatsApp Branch:** `feat/mect-whatsapp-donation-notifications-clean` (`fdb981c`)  
**Clean Visual Identity Branch:** `feat/mect-visual-identity-image-library` (`8e02914`)  
**Database Schema Version:** Flyway V18 (`mect_whatsapp_*` notification engine)  
**Execution Authority:** Managing Trustee & Production Release Engineer  

---

## 1. RELEASE PRE-CONDITIONS & GO/NO-GO GATES

Before executing deployment commands on the production VPS, verify:
- [x] All 3 feature branches published to canonical GitHub remote (`https://github.com/Himansu-Nayak/MECT.git`).
- [x] Base branch `fix/audit-loop` published to remote origin.
- [x] Frontend TypeScript typecheck passed (0 errors).
- [x] Frontend ESLint passed (0 errors).
- [x] Frontend production build passed (57–58 routes prerendered).
- [x] Playwright visual QA passed (25/25 viewports across 320px–1440px with 0px overflow).
- [x] Tracked file secret scan passed (0 active credentials).
- [ ] Maintenance window scheduled (expected downtime: < 2 minutes).
- [ ] Production `.env.production` verified on VPS host.

---

## 2. PRODUCTION HOST DEPLOYMENT PROCEDURE

### Step 1: Connect to Production VPS via SSH
```bash
ssh -i ~/.ssh/mect_deploy_key <DEPLOY_USER>@<VPS_STATIC_IPV4>
```

### Step 2: Navigate to Production Application Directory
```bash
cd /opt/mect
```

### Step 3: Mandatory Pre-Deployment Database Snapshot
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
echo "Database snapshot verified: /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump"
```

### Step 4: Fetch Latest Remote References
```bash
git fetch origin
```

### Step 5: Checkout Release Target
* **For Unified Release (Recommended):**
  ```bash
  git checkout origin/feat/mect-whatsapp-donation-notifications
  ```
* **Or, if merged into `fix/audit-loop` via GitHub PR:**
  ```bash
  git checkout origin/fix/audit-loop
  ```

### Step 6: Verify Environment Settings in `.env.production`
```bash
chmod 600 .env.production
grep "^WHATSAPP_ENABLED" .env.production || echo "WHATSAPP_ENABLED=false" >> .env.production
grep "^PAYMENT_PROVIDER" .env.production
grep "^BACKEND_API_URL" .env.production
```

> [!TIP]
> Keep `WHATSAPP_ENABLED=false` during initial deployment. The application and database tables will initialize cleanly in passive mode. You can enable live dispatch later once Meta API credentials are provisioned.

### Step 7: Build and Restart Production Containers
```bash
docker compose -f compose.production.yaml --env-file .env.production build
docker compose -f compose.production.yaml --env-file .env.production up -d
```

### Step 8: Verify Flyway V18 Migration
```bash
docker compose -f compose.production.yaml logs backend | grep -i "flyway"
```
**Expected Success Marker:**
```
Successfully applied 1 migration to schema "public", now at version v18 (enterprise whatsapp notification engine)
```

---

## 3. POST-DEPLOYMENT SMOKE TESTS

Execute immediately after container restart:

| Step | Verification Command | Expected Output | Status |
|:---:|:---|:---|:---:|
| **1** | `curl -s -f http://127.0.0.1:8081/actuator/health` | `{"status":"UP"}` | [ ] |
| **2** | `curl -s -f -I https://mect.org.in/` | `HTTP/2 200` | [ ] |
| **3** | `curl -s -f -I https://mect.org.in/about` | `HTTP/2 200` | [ ] |
| **4** | `curl -s -f -I https://mect.org.in/governance` | `HTTP/2 200` | [ ] |
| **5** | `curl -s -f -I https://mect.org.in/images/leadership/er-japabandhu-kampa.webp` | `HTTP/2 200` (image/webp) | [ ] |
| **6** | `curl -s -f -I https://mect.org.in/images/hero/mect-classroom-study-circle.webp` | `HTTP/2 200` (image/webp) | [ ] |
| **7** | `curl -s -f -I https://mect.org.in/admin/whatsapp` | `HTTP/2 200` | [ ] |

---

## 4. ROLLBACK PROCEDURE (FAIL-SAFE)

If any critical issue arises during deployment:
```bash
# 1. Rollback code to previous release commit
git checkout ca1c8175c038f79a22801d29f1278bd396116d16

# 2. Rebuild containers
docker compose -f compose.production.yaml --env-file .env.production up -d --build

# 3. If database restore is needed:
docker exec -i mect-postgres pg_restore -U mahavir_prod -d mahavir_db --clean < /var/backups/mect/mect_prod_pre_${TIMESTAMP}.dump
```
