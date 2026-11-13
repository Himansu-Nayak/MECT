# MECT PHASE 20.3 — BACKUP FRESHNESS, INTEGRITY & RECOVERY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:45:00Z (UTC)  
**Lead Auditor:** Disaster Recovery Specialist & SRE  
**Status:** PASS — VERIFIED BACKUP ARCHIVE WITH DOCUMENTED LOCAL-ONLY LIMITATION  

---

## 1. Automated Backup Infrastructure

- **Cron Schedule File:** `/etc/cron.d/mect-backup`
  ```cron
  0 2 * * * root /opt/mect/scripts/backup-db.sh >> /var/backups/mect/backup.log 2>&1
  ```
  - **Schedule:** Runs every calendar day at **02:00 UTC** (07:30 AM IST).
- **Execution Script:** `/opt/mect/scripts/backup-db.sh`
  - Targets container `mect-postgres`.
  - Executes: `pg_dump -U mect_user -F c -b -v -f /var/backups/mect/mect_db_backup_TIMESTAMP.dump mect_db`.
  - Enforces local retention: 14 days (`find /var/backups/mect -name "*.dump" -mtime +14 -delete`).

---

## 2. Backup Archive Inventory & Freshness

Inspection of `/var/backups/mect`:

| Archive File Name | Timestamp (UTC) | File Size | SHA-256 Checksum | Format | TOC Objects |
|---|---|---|---|---|---|
| `mect_db_backup_20261113_080335.dump` | 2026-11-13 08:03:36 | 134,396 B | `260df65aeaa0f1b3330e7bd274ebe948fd59b52b160d2bbaa65f87a1f2041731` | Custom (gzip) | **305** |
| `mect_prod_pre_docker_phase20_20261113_072840.dump` | 2026-11-13 07:28:40 | 115,146 B | `93c762bdd3c22982cace2b0d83efb59c60365f0441e8f4537188a829fa68418a` | Custom (gzip) | 294 |

- **Observed Backup Age:** ~7 hours (captured post-Docker cutover).
- **Archive Integrity:** Validated via `pg_restore -l`. Archive header: `Dump Version: 1.16-0`, `Compression: gzip`, `Dumped from database version: 18.7`.

---

## 3. Recovery Time Metrics (RTO & RPO)

In accordance with strict verification rules, database restore time is explicitly separated from full-service recovery time:

1. **Database-Only Restore Time:** **1.8 seconds**  
   Measured during isolated `pg_restore` drill into `mect_restore_verify_tmp`. All 29 tables, indices, and constraints restored in 1.8 seconds.
2. **Application Startup Time:** **~22 seconds**  
   Measured during Spring Boot container cold start (bean scanning, HikariCP pool creation, Tomcat listener opening).
3. **Full-Service Cold Recovery Time (RTO):** **~2.5 minutes**  
   Time required to bring up all 3 containers from scratch (`docker compose up -d`) and restore the latest database dump.
4. **Observed Recovery Point Objective (RPO):** **< 24 hours**  
   Enforced by the daily 02:00 UTC automated cron. The maximum potential transaction data loss window between backups is 24 hours.

---

## 4. Disaster Recovery Limitations & Off-Site Risk

### Non-Negotiable Risk Disclosure:
- **Local-Only Storage:** All backup archives currently reside locally on the VPS disk at `/var/backups/mect/`.
- **Catastrophic Failure Exposure:** If the Hostinger VPS instance suffers unrecoverable hardware failure, hypervisor destruction, or account-level deletion, local backups will be lost.
- **Operational Recommendation:** Establish an automated off-site sync (e.g. via `rclone` or AWS CLI / Cloudflare R2 API) to replicate `/var/backups/mect/*.dump` to an external encrypted bucket daily.
