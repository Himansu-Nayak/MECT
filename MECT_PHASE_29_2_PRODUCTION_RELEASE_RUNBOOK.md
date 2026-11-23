# MECT PHASE 29.2 — PRODUCTION RELEASE RUNBOOK
## Controlled Deployment Sequence, Pre-Flight Gates, Owner Authorization Boundaries & Rollback Protocols

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Release Feature Branch:** `feat/phase-29-complete-website-excellence`  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Target Host Architecture:** Linux VPS (`<PROD_VPS_IP>`) with Docker Engine + Nginx + PostgreSQL  
**Current Status:** **READY FOR RELEASE — STRICT PRODUCTION FREEZE ENFORCED**  

---

## 1. OWNER AUTHORIZATION BOUNDARIES

> [!CAUTION]
> **GOVERNANCE GATE: MANDATORY OWNER APPROVAL**  
> Under no circumstances may any operation listed in this section be executed without **explicit written authorization from the project owner**.  
> The development and audit teams have **zero standing permission** to interact with production infrastructure.

The following operations **STRICTLY REQUIRE EXPLICIT OWNER APPROVAL**:
1. Initiating an SSH connection to `<PROD_VPS_IP>`.
2. Pushing the feature branch `feat/phase-29-complete-website-excellence` to GitHub remote `origin`.
3. Merging `feat/phase-29-complete-website-excellence` into `main`.
4. Executing Docker build or container restart commands on the production host.
5. Triggering Flyway database migrations against the production PostgreSQL instance.
6. Reloading or updating the production Nginx virtual host configuration.
7. Switching payment gateway credentials from `TEST` mode to `PRODUCTION` live mode.

---

## 2. PRE-DEPLOYMENT QUALIFICATION CHECKLIST

Before the owner issues authorization, verify that all pre-flight conditions are satisfied:

- [x] All 126 Spring Boot unit and integration tests execute successfully (`mvn test`).
- [x] TypeScript compilation passes with 0 errors (`npm run typecheck`).
- [x] Static analysis passes with 0 lint errors (`npm run lint`).
- [x] All 51 Next.js routes statically prerender without errors (`npm run build`).
- [x] 0 open critical or high defects exist in the Defect Register.
- [x] Server-side donor authentication is strictly enforced on all donation endpoints.
- [x] Webhook signatures and pessimistic locking prevent duplicate or concurrent settlements.
- [x] Database migrations (V1..V16) are tested and confirmed forward-compatible.
- [x] No secrets or credentials are hardcoded into Git.

---

## 3. STEP-BY-STEP PRODUCTION RELEASE SEQUENCE (POST-APPROVAL ONLY)

> [!IMPORTANT]
> Execute the following sequence **only after explicit owner approval has been granted**.

### Step 3.1: Host Snapshot & Pre-Deployment Backup
```bash
# Connect to production VPS host (Authorized Operator Only)
ssh mect-admin@<PROD_VPS_IP>

# Verify currently running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Take full atomic snapshot of production PostgreSQL database
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p /opt/mect/backups/$TIMESTAMP
docker exec mect-postgres pg_dump -U mect_user -d mect_db > /opt/mect/backups/$TIMESTAMP/pre_release_dump.sql

# Verify backup size and integrity
ls -lh /opt/mect/backups/$TIMESTAMP/pre_release_dump.sql
```

### Step 3.2: Code Synchronization
```bash
cd /opt/mect/repo

# Fetch the approved feature branch from GitHub
git fetch origin feat/phase-29-complete-website-excellence
git checkout feat/phase-29-complete-website-excellence

# Verify clean working tree at the expected commit hash
git status
git log -1 --oneline
```

### Step 3.3: Backend Container Rebuild & Migration Execution
```bash
# Rebuild the backend container image
docker compose build backend

# Bring up backend container in detached mode
docker compose up -d backend

# Inspect Flyway migration logs to confirm clean execution through V16
docker logs --tail 150 mect-backend | grep -i "Flyway"

# Verify backend health check endpoint
curl -f http://127.0.0.1:8081/api/v1/actuator/health
```

### Step 3.4: Frontend Container Rebuild & Restart
```bash
# Rebuild the Next.js standalone frontend container
docker compose build frontend

# Restart frontend container on port 3001
docker compose up -d frontend

# Verify frontend health probe
curl -f http://127.0.0.1:3001/api/ai/health
```

### Step 3.5: Nginx Reverse Proxy Validation
```bash
# Test Nginx syntax
docker exec mect-nginx nginx -t

# Reload Nginx without dropping existing connections
docker exec mect-nginx nginx -s reload

# Validate public HTTPS endpoints
curl -I https://mect.org.in/
curl -I https://mect.org.in/login
curl -I https://mect.org.in/register
curl -I https://mect.org.in/donate
curl -I https://mect.org.in/api/v1/actuator/health
```

---

## 4. POST-DEPLOYMENT SMOKE TESTING SUITE

Following deployment, verify the following 6 core journeys in a live browser:
1. **Public Exploration:** Open `https://mect.org.in/` in an incognito window. Verify header, masthead, verified cards, and footer coordinates.
2. **Dedicated Supporter Login:** Navigate to `https://mect.org.in/login`. Enter authorized phone number; verify OTP prompt.
3. **Dedicated Supporter Registration:** Navigate to `https://mect.org.in/register`. Confirm 30 Odisha districts render.
4. **Donation Journey & Auth Gate:** Navigate to `https://mect.org.in/donate`. Select programme and amount; verify Step 3 mandates authentication before checkout.
5. **Backend 401 Enforcement:** Test `POST https://mect.org.in/api/v1/public/donations/initiate` without Authorization header; verify HTTP 401 response.
6. **Statutory Vault:** Open `https://mect.org.in/statutory-disclosures`. Confirm display of Deed, 12A, 80G, CSR-1, and Darpan numbers.

---

## 5. EMERGENCY ROLLBACK PROTOCOL

If any unexpected malfunction occurs post-deployment:

### Immediate Rollback Command Sequence:
```bash
# 1. Stop backend and frontend containers
cd /opt/mect/repo
docker compose stop frontend backend

# 2. Restore previous known-stable commit
git checkout cc121ba

# 3. Restore PostgreSQL database if schema corruption occurred
docker exec -i mect-postgres psql -U mect_user -d mect_db < /opt/mect/backups/$TIMESTAMP/pre_release_dump.sql

# 4. Rebuild and restart previous stable containers
docker compose build
docker compose up -d

# 5. Reload Nginx and verify recovery
docker exec mect-nginx nginx -s reload
curl -I https://mect.org.in/
```

---

## 6. RELEASE AUTHORIZATION SIGN-OFF

| Authority | Role | Decision | Signature / Date |
| :--- | :--- | :---: | :---: |
| **Principal Security Auditor** | Technical Assessment | **APPROVED** | 19 Nov 2026 |
| **Lead QA Engineer** | Test Qualification | **APPROVED** | 19 Nov 2026 |
| **Project Owner / Managing Trustee** | Governance Authority | **PENDING** | *(Awaiting Owner Sign-Off)* |
