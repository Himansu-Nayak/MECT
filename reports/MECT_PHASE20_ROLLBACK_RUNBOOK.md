# MECT Phase 20 — Production Rollback Runbook

**Purpose:** Comprehensive, step-by-step procedure to instantly revert production traffic back to pre-Docker baseline services in the event of an unforeseen container regression.

---

## 1. Rollback Pre-Conditions & Stored State

All pre-cutover state is safely preserved on the VPS:

1. **Host PostgreSQL:** `mect_db` on port 5432 is untouched and running.
2. **Pre-Cutover Database Dump:** `/var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump` (SHA-256: `93c762bdd3c22982cace2b0d83efb59c60365f0441e8f4537188a829fa68418a`).
3. **Legacy Backend Service:** `/etc/systemd/system/mect-backend.service` pointing to `/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar` (backed up at `/opt/mect/backups/backend-pre-docker-phase20`).
4. **Legacy Frontend App:** PM2 `mect_frontend` (`id: 1`) stopped in PM2 process table.
5. **Nginx:** Already points to loopback ports `8081` (backend) and `3001` (frontend).

---

## 2. Emergency 60-Second Rollback Sequence

Execute as `root` via SSH on `srv2000528` (`200.97.161.128`):

### Step 1: Stop Docker Containers
```bash
cd /opt/mect
docker compose -f compose.production.yaml --env-file .env.production stop mect-frontend mect-backend
```
*(This immediately frees loopback ports 3001 and 8081).*

### Step 2: Restart Legacy PM2 Frontend
```bash
pm2 start mect_frontend
# Or pm2 start 1
```

### Step 3: Re-Enable & Start Legacy Backend Service
```bash
systemctl enable mect-backend.service
systemctl start mect-backend.service
```

### Step 4: Verify Service Ports
```bash
ss -tulpn | grep -E ':(8081|3001)'
```
Expected output:
- `127.0.0.1:8081` -> `java` (PID of legacy Spring Boot)
- `*:3001` -> `next-server` (PID of PM2 `mect_frontend`)

### Step 5: Verify Live Website
```bash
curl -I https://mect.org.in/
curl -I https://mect.org.in/api/v1/actuator/health
```

---

## 3. Database Reversion (If Data Inconsistency Occurred)

If corrupted transactions must be discarded and replaced with the pre-deployment snapshot:

```bash
sudo -u postgres pg_restore -d mect_db --clean --if-exists /var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump
```

---

## 4. Rollback Verification Checklist

- [ ] `mect-frontend` container stopped.
- [ ] `mect-backend` container stopped.
- [ ] PM2 `mect_frontend` status: `online`.
- [ ] `systemctl is-active mect-backend.service` returns `active`.
- [ ] OHO TECH (`pm2 id 0`, port 3000, port 8080) confirmed untouched and online.
- [ ] `https://mect.org.in/` returning HTTP `200 OK`.

