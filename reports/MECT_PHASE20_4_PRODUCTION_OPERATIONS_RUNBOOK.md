# MECT PHASE 20.4 — PRODUCTION OPERATIONS & DISASTER RECOVERY RUNBOOK

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Host Target:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Deployment Directory:** `/opt/mect`  
**Docker Compose File:** `/opt/mect/compose.production.yaml`  
**Author:** Principal Site Reliability Engineer & Operations Lead  

---

## 1. Quick Emergency Diagnostic Command

Log in to VPS via SSH:
```bash
ssh <DEPLOY_USER>@<PROD_VPS_IP>
```

Run comprehensive health check:
```bash
cd /opt/mect
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -i http://127.0.0.1:8081/api/v1/health
curl -I http://127.0.0.1:3001/
```

---

## 2. Practical Runbooks for 12 Operational Scenarios

### Runbook 1: VPS Host Outage
- **Symptoms:** Domain unreachable (`HTTP 521 Web Server Is Down`), SSH times out.
- **Diagnostics:** Check Hostinger Cloud Console status for instance `<PROD_HOSTNAME>`.
- **Recovery Steps:**
  1. Trigger soft reboot via Hostinger Cloud Console.
  2. Once online, SSH into VPS: `ssh <DEPLOY_USER>@<PROD_VPS_IP>`.
  3. Verify Docker daemon started: `systemctl status docker`.
  4. Verify containers automatically restarted: `docker ps`.
  5. If stopped, start stack: `cd /opt/mect && docker compose -f compose.production.yaml up -d`.

### Runbook 2: Frontend Container Failure (`mect-frontend`)
- **Symptoms:** Static pages return `HTTP 502 Bad Gateway` from Nginx, while `/api/` endpoints work.
- **Diagnostics:**
  ```bash
  docker logs --tail 50 mect-frontend
  docker inspect mect-frontend --format '{{.State.Status}}'
  ```
- **Recovery Steps:**
  ```bash
  cd /opt/mect
  docker restart mect-frontend
  # Wait 5 seconds and test:
  curl -I http://127.0.0.1:3001/
  ```

### Runbook 3: Backend Container Failure (`mect-backend`)
- **Symptoms:** Public pages load, but donation checkout, contact form, or `/api/v1/health` return `502 Bad Gateway`.
- **Diagnostics:**
  ```bash
  docker logs --tail 80 mect-backend
  ```
- **Recovery Steps:**
  ```bash
  cd /opt/mect
  docker restart mect-backend
  # Wait 25 seconds for Spring Boot / Tomcat warmup:
  curl -i http://127.0.0.1:8081/api/v1/health
  ```

### Runbook 4: PostgreSQL Failure (`mect-postgres`)
- **Symptoms:** Backend logs report `Connection refused` or HikariCP pool timeout.
- **Diagnostics:**
  ```bash
  docker logs --tail 50 mect-postgres
  docker exec mect-postgres pg_isready -U mect_user -d mect_db
  ```
- **Recovery Steps:**
  ```bash
  cd /opt/mect
  docker restart mect-postgres
  docker restart mect-backend
  ```

### Runbook 5: Database Point-in-Time Restore
- **Symptoms:** Data corruption or accidental administrative deletion.
- **Recovery Steps (Safe Isolated Procedure):**
  1. Identify latest clean dump: `ls -lt /var/backups/mect/*.dump | head -n 1`.
  2. Perform pre-restore safety dump:
     ```bash
     docker exec mect-postgres pg_dump -U mect_user -Fc mect_db > /var/backups/mect/emergency_pre_restore_$(date +%s).dump
     ```
  3. Stop backend container to pause active writes:
     ```bash
     docker stop mect-backend
     ```
  4. Restore database:
     ```bash
     docker exec -i mect-postgres pg_restore -U mect_user -d mect_db --clean --if-exists -v < /var/backups/mect/LATEST_DUMP.dump
     ```
  5. Restart backend:
     ```bash
     docker start mect-backend
     ```

### Runbook 6: Full Application Cold-Start Recovery
- **Symptoms:** Host rebooted without container autostart.
- **Recovery Steps:**
  ```bash
  cd /opt/mect
  docker compose -f compose.production.yaml up -d
  # Verify all 3 services healthy:
  docker ps
  ```

### Runbook 7: Backup Archive Corruption Detected
- **Symptoms:** Daily backup log shows `TOC entry count too low` or `pg_restore --list` fails.
- **Recovery Steps:**
  1. Trigger manual backup immediately:
     ```bash
     /opt/mect/scripts/backup-db.sh
     ```
  2. Verify output in `/var/backups/mect/backup.log`.
  3. Inspect disk space: `df -h /`.

### Runbook 8: Cashfree Webhook Failure / Payment Desync
- **Symptoms:** Donor payment succeeded on Cashfree, but donation status remains `PENDING`.
- **Diagnostics:**
  ```bash
  docker logs --tail 100 mect-backend | grep -i 'cashfree'
  ```
- **Recovery Steps:**
  1. The backend scheduled reconciliation job (`EXPIRY_JOB` / reconcile sweep) automatically queries Cashfree for pending orders.
  2. If manual check is needed, inspect payment status via Admin Console at `/admin/donors`.

### Runbook 9: Manual SBI Direct UTR Verification
- **Symptoms:** Donor submitted SBI UTR claim awaiting verification.
- **Procedure:**
  1. Log in to [https://mect.org.in/admin/donors](https://mect.org.in/admin/donors) as Finance Officer or Admin.
  2. Locate claim reference (e.g. `MECT-UTR-2026-845467`).
  3. Compare UTR number and claimed amount against MECT's official State Bank of India account credit statement.
  4. Only after physical bank statement credit is confirmed, click **Verify & Issue Receipt**.

### Runbook 10: Receipt PDF Retrieval Failure
- **Symptoms:** Donor portal download button fails with 500 or timeout.
- **Diagnostics:** Check database bytea size:
  ```bash
  docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT id, receipt_number, octet_length(pdf_bytes) FROM donation_receipts WHERE receipt_number = 'TARGET_RECEIPT';"
  ```

### Runbook 11: SSL / TLS Certificate Issues
- **Symptoms:** Browser displays `SSL Handshake Failed` (Error 525 / 526).
- **Diagnostics:**
  ```bash
  openssl x509 -in /etc/ssl/certs/mect_origin.crt -noout -dates
  nginx -t
  ```
- **Recovery Steps:**
  - Verify Cloudflare SSL mode is set to **Full (Strict)** on Cloudflare Dashboard.
  - If Nginx stopped: `systemctl restart nginx`.

### Runbook 12: Security Incident Response
- **Symptoms:** Brute-force attack, suspicious IP activity, or compromised administrative credentials.
- **Containment Steps:**
  1. Block attacking IP at host firewall:
     ```bash
     ufw insert 1 deny from <ATTACKER_IP> to any
     ```
  2. Invalidate compromised user session:
     ```sql
     docker exec mect-postgres psql -U mect_user -d mect_db -c "
     UPDATE admin_users SET status = 'SUSPENDED' WHERE username = 'TARGET_USER';
     DELETE FROM refresh_tokens WHERE user_id = (SELECT id FROM admin_users WHERE username = 'TARGET_USER');
     "
     ```
  3. Inspect audit trail:
     ```sql
     docker exec mect-postgres psql -U mect_user -d mect_db -c "SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50;"
     ```

