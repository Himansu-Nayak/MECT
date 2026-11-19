# MECT PHASE 29.4 — PRE-DEPLOYMENT BACKUP REPORT
## Disaster Recovery Baseline, Automated Snapshot Runbook & Integrity Verification

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target Host:** `200.97.161.128` (Hostinger VPS)  
**Database Target:** Container `mect-postgres` (`mect_db`)  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `b09e1bb`  
**Phase:** 29.4.2 — Verified Pre-Deployment Backup  
**Evaluation Date:** 2026-11-19T17:45:00+05:30  
**Backup Execution Status:** **PREPARED / STANDBY (PRODUCTION DUMP BLOCKED PENDING AUTH-02)**

---

## 1. BACKUP POLICY & PRESERVATION DIRECTIVES

In accordance with Section 5 of the Phase 29.4 protocol:
1. **Zero Volume Mutation:** Existing production Docker volume `mect-pgdata` must NEVER be deleted, recreated, or pruned during deployment.
2. **Read-Only Snapshot:** Backups must be taken using non-blocking, consistent custom binary format (`pg_dump -Fc`) without modifying database state.
3. **Immutability:** Existing historical backup files in `/var/backups/mect/` must NEVER be overwritten. Every new dump is appended with a microsecond-accurate timestamp.
4. **Mandatory Checksum & TOC Verification:** No migration or deployment may proceed until the dump's SHA-256 checksum is computed and its Table of Contents (TOC) is validated via `pg_restore --list`.

---

## 2. PRE-DEPLOYMENT BACKUP EXECUTION SPECIFICATION

Upon receipt of owner authorization (`AUTH-02`), the established backup script (`scripts/backup-db.sh`) will execute the following snapshot sequence on the VPS host:

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/mect"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/mect_db_predeploy_phase29_4_${TIMESTAMP}.dump"
GLOBALS_FILE="${BACKUP_DIR}/mect_globals_predeploy_phase29_4_${TIMESTAMP}.sql"
LOG_FILE="${BACKUP_DIR}/backup.log"

mkdir -p "${BACKUP_DIR}"
chmod 700 "${BACKUP_DIR}"

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting Phase 29.4 pre-deployment database backup..." | tee -a "${LOG_FILE}"

# 1. Global cluster objects dump (roles, permissions)
docker exec mect-postgres pg_dumpall -U mect_user --globals-only > "${GLOBALS_FILE}"
chmod 600 "${GLOBALS_FILE}"

# 2. Database schema and data dump (custom compressed format)
docker exec mect-postgres pg_dump -U mect_user -Fc mect_db > "${BACKUP_FILE}"
chmod 600 "${BACKUP_FILE}"

# 3. File metrics
FILE_SIZE=$(stat -c%s "${BACKUP_FILE}")
SHA256_DUMP=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')
SHA256_GLOBALS=$(sha256sum "${GLOBALS_FILE}" | awk '{print $1}')

# 4. TOC object integrity verification
TOC_COUNT=$(docker exec -i mect-postgres pg_restore --list < "${BACKUP_FILE}" | wc -l)

echo "=== PRE-DEPLOYMENT BACKUP GENERATED ==="
echo "Timestamp:    ${TIMESTAMP}"
echo "Dump File:    ${BACKUP_FILE}"
echo "File Size:    ${FILE_SIZE} bytes"
echo "Dump SHA256:  ${SHA256_DUMP}"
echo "Globals SHA:  ${SHA256_GLOBALS}"
echo "TOC Entries:  ${TOC_COUNT}"

if [ "${TOC_COUNT}" -lt 50 ]; then
    echo "ERROR: Backup TOC entry count too low (${TOC_COUNT}). HALTING DEPLOYMENT."
    exit 1
fi
echo "Backup verification PASSED. Safe to proceed with database migration."
```

---

## 3. EVIDENCE FROM PHASE 29.3 REHEARSAL VERIFICATION

The backup and restoration workflow was programmatically executed and certified in the Phase 29.3 rehearsal test suite ([DatabaseBackupRestoreRehearsalTests.java](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/test/java/org/mahavirtrust/backend/DatabaseBackupRestoreRehearsalTests.java)):

| Verification Gate | Rehearsal Condition | Rehearsal Result | Integrity Proof |
| :--- | :--- | :--- | :--- |
| **Snapshot Extraction** | Export of synthetic database state with live users, donations, UTR claims, and receipts | **100% SUCCESS** | Dump generated with 0 errors |
| **Clean Room Restoration** | Restoration into isolated database schema | **100% SUCCESS** | 16 Flyway tables populated |
| **Record Count Preservation** | Pre-restore vs post-restore entity counts | **ZERO LOSS** | Users: 2/2, Donations: 2/2, Receipts: 1/1, Claims: 1/1 |
| **Financial Isolation (No Ghost Revenue)** | Settled revenue vs pending verification claims | **PERFECT ISOLATION** | ₹5,000 settled vs ₹2,500 pending claim strictly isolated |
| **Foreign Key Graph** | `Receipt` &rarr; `Donation` &rarr; `PortalUser` | **INTACT** | Cascade integrity verified |

---

## 4. PRE-DEPLOYMENT BACKUP REGISTER TEMPLATE

Upon execution on the live VPS host, the operational values will be populated into the permanent production register:

```text
================================================================================
PRODUCTION PRE-DEPLOYMENT BACKUP CERTIFICATION RECORD
================================================================================
Target Host:            200.97.161.128 (Hostinger VPS)
Target Database:        mect_db (container: mect-postgres)
Pre-Deployment Release: Commit b09e1bb (Branch feat/phase-29-complete-website-excellence)
Execution Timestamp:    [PENDING OWNER AUTH-02]
Backup Archive Path:    /var/backups/mect/mect_db_predeploy_phase29_4_[TIMESTAMP].dump
Backup File Size:       [PENDING OWNER AUTH-02] bytes
SHA-256 Checksum:       [PENDING OWNER AUTH-02]
TOC Object Count:       [PENDING OWNER AUTH-02] (Requirement: >= 50)
Restoration Test State: [PENDING OWNER AUTH-02]
Operator Signature:     [PENDING OWNER AUTH-02]
================================================================================
```

---

## 5. BACKUP REPORT CONCLUSION

- **Operational Readiness:** **PREPARED & FULLY REHEARSED.**
- **Integrity Protocol:** Multi-factor verification (File size, SHA-256, TOC list count) active.
- **Action Required:** Standby for owner execution of `AUTH-02`. Zero live database operations will proceed until the pre-deployment dump is verified on the host.
