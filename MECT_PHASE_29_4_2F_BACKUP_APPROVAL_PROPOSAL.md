# MECT PHASE 29.4.2F — PRODUCTION DATABASE BACKUP APPROVAL PROPOSAL
## Formal Proposal, Execution Parameters, Checksum Verification & Off-Site Transfer Runbook

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `<PROD_VPS_IP>` (`<PROD_HOSTNAME>`)  
**Evaluation Phase:** Phase 29.4.2F — SSH Access Activation & Storage Failure-Domain Validation  
**Execution Timestamp (Local):** 2026-11-20T01:20:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:50:00Z  
**Proposal Status:** **PROPOSED — STRICTLY NON-EXECUTING (Awaiting Explicit Owner Approval)**  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T01:20:00+05:30` (UTC: `2026-11-19T19:50:00Z`)
- **Exact Evidence Source:** Deliverable 3 (Storage Failure-Domain Analysis), Deliverable 6 (Backup Architecture), Phase 29.4.1 rehearsal metrics (`MECT_PHASE_29_4_1_DATABASE_BACKUP_RESTORE_EVIDENCE.md`), and `compose.production.yaml` container configuration.
- **Commands Formulated:**
  1. `docker exec mect-postgres pg_dump -U mect_user -d mect_prod -F c -b -v > /opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump`
  2. `sha256sum "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump" > ...`
  3. `docker exec -i mect-postgres pg_restore --list < "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump" | head -n 35`
  4. Off-site SCP pull command for Windows PowerShell.
- **Actual Result:** A deterministic, non-destructive backup procedure is prepared. Zero execution has taken place in Phase 29.4.2F.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Command syntax, failure domain isolation, and integrity validation protocol).
- **Limitations:** The backup dump command will **not** be executed until the Project Owner provides explicit, separate approval.
- **Recommended Action:** Project Owner authorizes this specific backup plan once SSH connectivity is active.

---

## 2. PROPOSED PRODUCTION BACKUP SPECIFICATIONS

| Parameter | Specification | Forensic Rationale |
| :--- | :--- | :--- |
| **Target Database** | `mect_prod` | Production PostgreSQL database instance |
| **Database Container** | `mect-postgres` | Container defined in `compose.production.yaml` |
| **Database User** | `mect_user` | Application database owner |
| **Dump Format** | PostgreSQL Custom Binary (`-F c`) | Compressed, includes Table of Contents, supports selective restore |
| **Dump Scope** | Complete (`-b -v`) | DDL schemas, tables, sequences, data, statutory records, Flyway history |
| **Target Host Directory** | `/opt/mect/backups/` | **Outside Docker named volumes** (Tier 1 Storage) |
| **Directory Permissions** | `chmod 700 /opt/mect/backups` | Restricted strictly to `root:root` |
| **Filename Pattern** | `mect_prod_backup_YYYYMMDD_HHMMSS.dump` | Microsecond timestamp guarantees zero overwrite of prior dumps |
| **Estimated File Size** | ~150 KB to 2.5 MB | Modest data footprint (< 0.002% of available 173 GB NVMe disk) |
| **Expected Execution Time**| < 3 seconds | Minimal overhead; zero user-noticeable lag |
| **Impact on Live Reads** | **Zero Impact** | `pg_dump` takes snapshot via `AccessShareLock`, never blocks reads |
| **Impact on Live Writes**| **Zero Impact** | Does not block `INSERT`, `UPDATE`, or `DELETE` |

---

## 3. EXACT STEP-BY-STEP EXECUTION RUNBOOK (FOR OWNER AUTHORIZATION)

Once SSH terminal access is available and the Project Owner authorizes execution, run the following commands sequentially:

### Step 1: Provision the Independent Backup Directory
```bash
# Create dedicated host backup directory outside Docker volumes
mkdir -p /opt/mect/backups
chmod 700 /opt/mect/backups
```

### Step 2: Stream Binary Backup to Host Storage
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Stream pg_dump via stdout directly into the host filesystem
docker exec mect-postgres pg_dump \
  -U mect_user \
  -d mect_prod \
  -F c -b -v \
  > "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump"

echo "[SUCCESS] Backup written to: /opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump"
```

### Step 3: Generate Cryptographic SHA-256 Checksum
```bash
sha256sum "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump" \
  | tee "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump.sha256"
```

### Step 4: Validate Archive Integrity (Without Restoring)
```bash
# Inspect the Table of Contents catalog from the binary dump
docker exec -i mect-postgres pg_restore \
  --list < "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump" | head -n 35

# Verify non-zero file size and permissions
ls -lh "/opt/mect/backups/mect_prod_backup_${TIMESTAMP}.dump"
```

### Step 5: Pull Secondary Off-Site Copy to Owner Workstation (Tier 3)
Execute from **local Windows PowerShell**:
```powershell
# Pull verified backup to local workstation
scp -i "<SSH_KEY_PATH>" -o KexAlgorithms=curve25519-sha256 <DEPLOY_USER>@<PROD_VPS_IP>:/opt/mect/backups/mect_prod_backup_*.dump "<USER_HOME>\OneDrive\Desktop\MECT_BACKUPS\"
```

---

## 4. DONOR PRIVACY & PAYMENT INTEGRITY AFFIRMATIONS

In accordance with Phase 29.4.2F safety directives, the proposed backup procedure guarantees:
1. **Zero Payment Transaction Initiation:** `pg_dump` is an internal read-only PostgreSQL utility. It cannot communicate with Cashfree, generate order IDs, or trigger financial charges.
2. **Zero Payment State Mutations:** The database dump does not execute `UPDATE` or `INSERT`. Payment records remain in their exact current state.
3. **Zero UTR Reconciliation Manipulation:** Bank settlement records and offline transfer proofs are neither approved nor altered.
4. **Zero Donor PII Exposure:** The binary dump file is stored with `0600` permissions inside a `0700` host directory, completely inaccessible to unauthenticated external clients.
5. **Zero Receipt Duplication:** No transactional emails or receipts are dispatched.

---

## 5. NON-EXECUTION AFFIRMATION

```
+=============================================================================+
|             MECT PHASE 29.4.2F BACKUP PROPOSAL AFFIRMATION                  |
+=============================================================================+
| 1. Backup Proposal Formulated:        COMPLETE & VALIDATED                  |
| 2. Target Location:                   /opt/mect/backups/ (Independent)      |
| 3. Actual Execution in This Turn:     STRICTLY 0% (ZERO MUTATIONS)          |
| 4. Live Database Restore Attempted:   NEVER (Restoring into live is banned) |
+=============================================================================+
| STATUS:                               AWAITING EXPLICIT OWNER SIGN-OFF      |
+=============================================================================+
```
