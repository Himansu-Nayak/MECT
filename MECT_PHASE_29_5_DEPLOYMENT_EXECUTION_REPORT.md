# MECT PHASE 29.5 — DEPLOYMENT EXECUTION REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS:** `<PROD_VPS_IP>` (Hostname: `<PROD_HOSTNAME>`)  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Execution Status:** **BLOCKED — OWNER ACTION REQUIRED (DEPLOYMENT NOT EXECUTED)**

---

## 1. Execution Gate Status & Blocking Reasons

Per the strict authorization rules of Phase 29.5, deployment execution to the live production VPS (`<PROD_VPS_IP>`) has **NOT** been performed. 

Deployment is currently held at the Authorization Gate due to the following two non-negotiable blockers:

### Blocker 1: Missing SSH Authentication Identity
- **Required Identity File:** `<SSH_KEY_PATH>` on the operator workstation.
- **Current Status:** Not present in the local filesystem.
- **Policy Enforcement:** Automated agents are strictly forbidden from guessing SSH passwords, brute-forcing accounts, disabling host-key checks, or creating unauthorized remote keys. Remote execution cannot proceed without the owner-configured private key.

### Blocker 2: Explicit Owner Deployment Window Authorization
- **Requirement:** Phase 10 specifies that the project owner must explicitly authorize this exact release commit (`6a9de87`) and approve the scheduled maintenance window.
- **Current Status:** Awaiting explicit affirmative authorization from the project owner.

---

## 2. Pre-Approved Non-Destructive Deployment Runbook

Once the owner configures the SSH key and provides deployment authorization, the following reviewed, non-destructive procedure is ready for immediate sequential execution:

### Step 1: Establish Authenticated SSH Session
```bash
ssh -i "<SSH_KEY_PATH>" -o StrictHostKeyChecking=yes deploy@<PROD_VPS_IP>
cd /opt/mect
```

### Step 2: Execute Pre-Deployment Database Backup
```bash
# Execute verified atomic backup
./scripts/backup_production_db.sh
# Verify checksum and confirm file is > 0 bytes
ls -lh /opt/mect/backups/
```

### Step 3: Preserve Current Running Container Images
```bash
# Tag current images as instant rollback baseline
docker tag mect-backend:production mect-backend:rollback-baseline
docker tag mect-frontend:production mect-frontend:rollback-baseline
```

### Step 4: Synchronize Approved Git Commit
```bash
# Fetch latest branch without overwriting local config
git fetch origin feat/phase-29-complete-website-excellence
git checkout 6a9de8787baa32a5e74814d5c2f8d6a5322bf227
# Confirm working tree commit
git rev-parse HEAD
```

### Step 5: Verify Environment Configuration
```bash
# Ensure RESEND_API_KEY and RESEND_FROM_EMAIL are configured in .env.production
grep -E "^RESEND_API_KEY=" .env.production || echo "WARNING: RESEND_API_KEY missing"
grep -E "^AUTH_PEPPER=" .env.production || echo "WARNING: AUTH_PEPPER missing"
```

### Step 6: Build Immutable Production Images
```bash
# Build backend and frontend images
docker compose -f compose.production.yaml build mect-backend mect-frontend
```

### Step 7: Restart Containers in Non-Destructive Fashion
```bash
# Recreate only MECT application containers; preserve database and volumes
docker compose -f compose.production.yaml up -d --no-deps mect-backend
# Wait for backend health
docker compose -f compose.production.yaml exec mect-backend curl -f http://127.0.0.1:8080/actuator/health || sleep 10

docker compose -f compose.production.yaml up -d --no-deps mect-frontend
```

### Step 8: Verify Container and Reverse Proxy Health
```bash
# Verify container status
docker compose -f compose.production.yaml ps

# Verify loopback endpoints
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:8081/actuator/health

# Verify public domain via host Nginx
curl -I https://mect.org.in/
```

---

## 3. Strict Safety Invariants Enforced During Deployment

1. **Volume Preservation:** The database volume `mect-pgdata` is NEVER removed or recreated. `docker compose down -v` is strictly prohibited.
2. **Co-located Workload Isolation:** The Docker Compose project namespace `-p mect` ensures that unrelated OHO Tech containers and services running on the VPS are completely undisturbed.
3. **Database Migration Restraint:** Because commit `6a9de87` requires 0 new Flyway migrations, no database DDL locks are acquired, guaranteeing zero database downtime.

---

## 4. Execution Summary & Deliverable Verdict

- **Actual VPS Modified:** No (0 remote commands executed).
- **Production Files Mutated:** None.
- **Current Production Availability:** 100% unaffected.

**Verdict: BLOCKED — DEPLOYMENT NOT EXECUTED PENDING OWNER ACTION**
