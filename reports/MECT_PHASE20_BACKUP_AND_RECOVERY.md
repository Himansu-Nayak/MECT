# MECT Phase 20 — Automated Backup & Disaster Recovery Architecture

**Target Container:** `mect-postgres`  
**Host Storage Directory:** `/var/backups/mect`  
**Automated Cron Schedule:** Daily at 02:00 UTC (`/etc/cron.d/mect-backup`)  
**Retention Policy:** 30 Days (Rolling automated pruning)

---

## 1. Automated Backup Pipeline (`/opt/mect/scripts/backup-db.sh`)

The automated backup script performs a multi-step verification and rotation sequence:

1. **Dump Execution:** Executes `docker exec mect-postgres pg_dump -U mect_user -Fc mect_db` stream directly to timestamped archive `/var/backups/mect/mect_db_backup_<YYYYMMDD_HHMMSS>.dump`.
2. **Permission Hardening:** Applies `chmod 600` immediately to prevent read access from any non-root account.
3. **Integrity Preflight:** Parses the newly dumped archive using `pg_restore --list`. If TOC object entries are fewer than 50 or corrupted, the script flags a critical error and alerts.
4. **Digest Computation:** Computes SHA-256 hash and file size, appending metrics to `/var/backups/mect/backup.log`.
5. **Rolling Retention Pruning:** Deletes backup files matching `mect_db_backup_*.dump` older than 30 days.

---

## 2. Cron Job Scheduling

Installed at `/etc/cron.d/mect-backup`:

```cron
0 2 * * * root /opt/mect/scripts/backup-db.sh >/dev/null 2>&1
```

- **Execution User:** `root`
- **Schedule:** Every day at 02:00 UTC (07:30 IST).
- **Log Destination:** `/var/backups/mect/backup.log`

---

## 3. Verified Backup Execution Evidence

Test execution of `/opt/mect/scripts/backup-db.sh` on the VPS:

```text
[2026-11-13T08:03:35Z] Starting MECT production database backup...
[2026-11-13T08:03:35Z] Dumping from Docker container 'mect-postgres'...
[2026-11-13T08:03:36Z] Verifying backup archive structure via pg_restore --list...
[2026-11-13T08:03:36Z] Backup archive verified successfully (305 TOC entries).
[2026-11-13T08:03:36Z] Backup complete: /var/backups/mect/mect_db_backup_20261113_080335.dump (Size: 132K, SHA256: 260df65aeaa0f1b3330e7bd274ebe948fd59b52b160d2bbaa65f87a1f2041731)
[2026-11-13T08:03:36Z] Pruning backups older than 30 days...
[2026-11-13T08:03:36Z] MECT database backup finished successfully.
```

---

## 4. Disaster Recovery Procedure (`/opt/mect/scripts/restore-db.sh`)

To recover from a verified archive:

```bash
# 1. Inspect archive integrity
pg_restore --list /var/backups/mect/mect_db_backup_<timestamp>.dump

# 2. Execute safe restore script
/opt/mect/scripts/restore-db.sh /var/backups/mect/mect_db_backup_<timestamp>.dump
```

The restore script automatically:
1. Verifies the archive structure.
2. Stops `mect-backend` to terminate active transactions.
3. Restores schema and data with `--clean --if-exists --no-owner --no-privileges`.
4. Restarts `mect-backend`.
5. Validates actuator health `http://127.0.0.1:8081/api/v1/actuator/health`.
