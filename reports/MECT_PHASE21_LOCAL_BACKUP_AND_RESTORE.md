# MECT PHASE 21 — LOCAL BACKUP & RESTORATION AUDIT REPORT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Storage Directory:** `/var/backups/mect`  
**Audit Timestamp:** 2026-11-13T10:24:00Z (UTC)  
**Auditor:** PostgreSQL Database Administrator & SRE  
**Status:** PASS — LOCAL BACKUP & RESTORE VERIFIED (OFF-SITE DEFERRED)  

---

## 1. Local Backup System Status

- **Automated Cron Schedule:** `/etc/cron.d/mect-backup`
  ```cron
  0 2 * * * root /opt/mect/scripts/backup-db.sh >/dev/null 2>&1
  ```
- **Primary Production Archive:** `/var/backups/mect/mect_db_backup_20261113_100627.dump`
  - Timestamp: `2026-11-13 10:06:28 UTC`
  - File Size: `136 KB` (135,168 bytes)
  - SHA-256 Checksum: `5b0ff2ffdf0b58c4fa0d3d28e54d28a606a954c756b720e514133ccdd0c8be7e`
  - Format: PostgreSQL Custom Compressed Archive (`pg_dump -Fc`)
  - TOC Integrity: **305 verified Table of Contents entries**.
- **PostgreSQL Globals Backup:** `/var/backups/mect/mect_globals_20261113_100651.sql` (SHA-256: `03481bdf9cd82369352ed07b6af15f7f919699c3776e71a755149adc170e6d53`).
- **Disk Availability:** 174 GB free on root mount (10% utilization).
- **Local Retention Policy:** 30 days (`find /var/backups/mect -name "*.dump" -mtime +30 -delete`).

---

## 2. Restore Time Metrics (RTO & RPO)

- **Database-Only Restore Time:** **1.8 seconds** (Verified via isolated restore drill into temporary database).
- **Full-Service Recovery Time (RTO):** **~2.5 minutes** (Cold start of 3 Docker containers + database restore).
- **Observed Recovery Point Objective (RPO):** **< 24 hours** (Daily automated backup cycle).

---

## 3. Explicit Risk Disclosure: Deferred Off-Site Backups

Per Phase 21 instructions, external cloud accounts and paid services (Cloudflare R2, AWS S3) are **explicitly excluded and deferred**.
- **Limitation:** All backups currently reside locally on the Hostinger VPS disk at `/var/backups/mect/`.
- **Catastrophe Risk:** Local backups do NOT protect against total physical VPS destruction, hypervisor-level data loss, or account-level termination.
- **Standing Operational Recommendation:** Off-site replication to encrypted cloud storage remains recommended as a future non-blocking operational enhancement.

