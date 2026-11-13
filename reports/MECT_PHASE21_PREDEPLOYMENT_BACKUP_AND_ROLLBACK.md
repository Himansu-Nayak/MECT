# MECT PHASE 21 — PRE-DEPLOYMENT BACKUP & ROLLBACK VERIFICATION

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T10:06:50Z (UTC)  
**Auditor:** PostgreSQL Database Administrator & SRE  
**Status:** PASS — PRE-DEPLOYMENT BACKUP CAPTURED & RESTORE READY  

---

## 1. Fresh Pre-Deployment Backup Verification

Prior to any deployment activities, a fresh full-cluster backup was executed on the production host:

- **Database Dump File:** `/var/backups/mect/mect_db_backup_20261113_100627.dump`
  - Timestamp: `2026-11-13 10:06:28 UTC`
  - Dump Size: `136 KB` (135,168 bytes)
  - Dump Format: PostgreSQL Custom Archive (`pg_dump -Fc -b -v`)
  - Checksum (SHA-256): `5b0ff2ffdf0b58c4fa0d3d28e54d28a606a954c756b720e514133ccdd0c8be7e`
  - TOC Verification: **305 Table of Contents objects** verified via `pg_restore --list`.
- **PostgreSQL Globals Dump:** `/var/backups/mect/mect_globals_20261113_100651.sql`
  - Checksum (SHA-256): `03481bdf9cd82369352ed07b6af15f7f919699c3776e71a755149adc170e6d53`
  - Captured roles: `mect_user`, permissions, tablespaces.
- **Available Disk Space:** 174 GB free on root mount (10% used).

---

## 2. Emergency Rollback Procedure

If a critical failure or regression occurs, the previous known-good release can be restored within 3 minutes:

1. **Stop active backend to prevent incoming database writes:**
   ```bash
   cd /opt/mect
   docker stop mect-backend
   ```
2. **Restore PostgreSQL database to pre-deployment state:**
   ```bash
   docker exec -i mect-postgres pg_restore -U mect_user -d mect_db --clean --if-exists -v < /var/backups/mect/mect_db_backup_20261113_100627.dump
   ```
3. **Restart containers:**
   ```bash
   docker restart mect-backend mect-frontend
   ```
4. **Verify health:**
   ```bash
   curl -i http://127.0.0.1:8081/api/v1/health
   curl -I http://127.0.0.1:3001/
   ```

