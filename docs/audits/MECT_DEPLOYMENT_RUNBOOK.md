# MECT — PRODUCTION DEPLOYMENT RUNBOOK

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Production Domain:** `https://mect.org.in/`  
**Staging Domain:** `https://staging.mect.org.in/`  
**Deploy Path:** `/opt/mect`  
**Staging Path:** `/opt/mect-staging`  

---

## 1. PRE-DEPLOYMENT SAFETY CHECKLIST

1. **Verify Neighboring Systems Isolation:**
   - Confirm OHO Tech on ports 3000 (web), 8080 (api), and 5432 (system postgres) is running and will not be impacted.
   - Confirm MECT staging on ports 3002 (web), 8082 (api), and internal 5432 is running.
2. **Pre-Deployment Cold Database Backup:**
   - Command:
     ```bash
     docker exec mect-postgres pg_dump -U mect_user -d mect_db > /opt/mect/backups/mect_prod_backup_pre_deploy_$(date +%s).sql
     ```
3. **Rollback Container Image Tagging:**
   - Command:
     ```bash
     ts=$(date +%s)
     docker tag mect-frontend:production mect-frontend:rollback_$ts
     docker tag mect-backend:production mect-backend:rollback_$ts
     ```

---

## 2. REBUILD & DEPLOYMENT PROCEDURE

1. **Git Synchronization on VPS:**
   ```bash
   cd /opt/mect-staging
   git fetch origin feat/complete-website-redefinition-and-deduplication
   git reset --hard origin/feat/complete-website-redefinition-and-deduplication
   ```
2. **Build Audited Spring Boot Backend Image:**
   ```bash
   cd /opt/mect-staging/backend
   mvn clean package -DskipTests
   cd /opt/mect-staging
   docker build -t mect-backend:production -f backend/Dockerfile backend/
   ```
3. **Build Audited Next.js Frontend Image:**
   ```bash
   cd /opt/mect-staging
   docker build -t mect-frontend:production \
     --build-arg NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1 \
     --build-arg NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1 \
     --build-arg ENABLE_DONOR_PORTAL=true \
     --build-arg NEXT_PUBLIC_ENABLE_DONOR_PORTAL=true .
   ```
4. **Recreate Production Containers:**
   ```bash
   cd /opt/mect
   docker compose --env-file .env.production -f compose.production.yaml up -d --force-recreate mect-backend mect-frontend
   ```
5. **Verify Health:**
   ```bash
   docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
   ```

---

## 3. POST-DEPLOYMENT SMOKE & ACCEPTANCE AUDIT

1. **Execute Live Production Verifier:**
   ```bash
   python scripts/verify_production_live.py
   ```
2. **Verify 13/13 Probes Pass 100% Green.**
3. **Verify Zero Impact on OHO Tech:**
   ```bash
   curl -sI http://127.0.0.1:3000 | head -n 2
   curl -s http://127.0.0.1:8080/actuator/health
   ```

---

## 4. INSTANT ROLLBACK PLAN

In the event of an unexpected regression:
```bash
docker tag mect-frontend:rollback_$ts mect-frontend:production
docker tag mect-backend:rollback_$ts mect-backend:production
cd /opt/mect && docker compose --env-file .env.production -f compose.production.yaml up -d --force-recreate mect-backend mect-frontend
```
If database restoration is required:
```bash
docker exec -i mect-postgres psql -U mect_user -d mect_db < /opt/mect/backups/mect_prod_backup_pre_deploy_$ts.sql
```
