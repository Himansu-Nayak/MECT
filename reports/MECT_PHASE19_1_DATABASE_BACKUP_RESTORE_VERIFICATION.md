# MECT PHASE 19.1 — DATABASE BACKUP ARCHIVE & RESTORE VERIFICATION REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Database Reliability Engineer  
**Database Engine:** PostgreSQL 17.8  
**Backup File:** `backups/mahavir_trust_dev_release_gate.dump` (133,110 bytes)  
**Execution Timestamp:** 2026-11-13T12:12:00+05:30  
**Status:** **RESTORE TEST PASSED IN ISOLATION / PRODUCTION BACKUP DISTINCTION CLARIFIED**

---

## 1. INVESTIGATION OF INITIAL ARCHIVE LISTING EXIT CODE

### 1.1 The Failure Event (Phase 19 Step 8511)
During Phase 19, `pg_restore.exe --list` returned exit code `1`:
```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_restore.exe" --list "backups/mahavir_trust_dev_release_gate.dump" | Select-Object -First 20
# Returned exit code 1
```

### 1.2 Root Cause Analysis
1. **Broken Pipe (SIGPIPE Equivalent in Windows):**
   - The native command was piped into PowerShell's `Select-Object -First 20`.
   - As designed, `Select-Object` terminates the downstream pipeline immediately after consuming 20 lines.
   - When the native `pg_restore.exe` process attempted to write line 21 to standard output, the OS signaled a broken pipe (`ERROR_BROKEN_PIPE`).
   - `pg_restore` exited with code 1 due to the prematurely closed pipe, not due to an archive corruption.
2. **Re-Test Without Pipe Truncation:**
   ```powershell
   $toc = & $pgRestore --list $backupFile
   # $LASTEXITCODE: 0
   # Total TOC lines: 305 (294 TOC objects, Format: CUSTOM, Compression: gzip)
   ```
   **Result:** Verified with exit code 0. The archive is 100% syntactically valid and uncorrupted.

---

## 2. ISOLATED RESTORE TEST EXECUTION (MANDATORY GATE)

To prove that the archive is not merely readable but fully restorable into a live PostgreSQL engine, an end-to-end restore test was executed in an isolated temporary database:

### 2.1 Test Execution Steps
1. **Created Isolated Database:**
   ```sql
   CREATE DATABASE mahavir_restore_test_tmp OWNER mahavir_app;
   ```
2. **Restored Backup:**
   ```powershell
   pg_restore.exe -h 127.0.0.1 -U mahavir_app -d mahavir_restore_test_tmp -v "backups/mahavir_trust_dev_release_gate.dump"
   # Exit Code: 0
   ```
3. **Database Objects Verified in Restored Database:**
   - **Public Tables Count:** `29` (all 29 application and Flyway tables present).
   - **Flyway Max Schema Version:** `11` (fully up to date with production target).
   - **Donations Table Count:** `1` (test donation record restored with full integrity).
   - **Manual Claims Table Count:** `1` (test UTR claim restored with constraints intact).
4. **Clean Teardown:**
   ```sql
   DROP DATABASE mahavir_restore_test_tmp;
   ```
   Database was dropped cleanly without affecting the active development or test database.

---

## 3. PRODUCTION BACKUP READINESS CLASSIFICATION

### 3.1 Strict Separation of Environments
- **Critical Clarification:** The backup artifact `mahavir_trust_dev_release_gate.dump` was generated from the local development database `mahavir_trust_dev`.
- **Release Gate Rule:** Under safety rules, a development database backup cannot and must not be used as proof that a production backup exists.
- **Formal Status Classification:**
  ```
  BLOCKED — PRODUCTION BACKUP NOT INDEPENDENTLY VERIFIED
  ```
- **Deployment Requirement:** Before any release artifact is copied or migration applied on the production VPS (`https://mect.org.in/`), a mandatory production snapshot must be created directly on the VPS host:
  ```bash
  sudo -u postgres pg_dump -d mahavir_trust_prod -F c -b -v -f "/var/backups/mect/mect_prod_pre_release_$(date +%Y%m%d_%H%M%S).dump"
  ```
  This is codified as **Step 1** in the production release runbook.

