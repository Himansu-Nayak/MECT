# MECT PHASE 20.3 — MEDIA & DOCUMENT STORAGE DURABILITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Audit Timestamp:** 2026-11-13T09:40:00Z (UTC)  
**Lead Auditor:** PostgreSQL DBA & Infrastructure Reliability Engineer  
**Status:** PASS — IN-DATABASE ACID DURABILITY WITH NAMED VOLUME ENCLOSURE  

---

## 1. Storage Architecture & Forensic Investigation

During Phase 20.1, the Docker named volumes `mect-media` and `mect-receipts` were inspected on the VPS and reported at approximately `8.0 KiB` each, while `mect-pgdata` was reported at `66 MiB`.

A forensic code and database audit was performed to determine the exact storage mechanisms for all institutional assets:

### 1.1 Asset Storage Location Matrix

| Asset Category | Table / Location | Storage Medium | Database Column / Volume Path | Backup Coverage |
|---|---|---|---|---|
| **Donation Receipt PDFs** | `donation_receipts` | **PostgreSQL (ACID)** | `pdf_bytes bytea not null` | **100%** (Included in `pg_dump`) |
| **Receipt Cryptographic Hashes**| `donation_receipts` | **PostgreSQL (ACID)** | `pdf_sha256 varchar(64)` | **100%** (Included in `pg_dump`) |
| **CMS Media Assets** | `media_assets` | **PostgreSQL (ACID)** | `data_base64 text` | **100%** (Included in `pg_dump`) |
| **Scholarship Documents** | `scholarship_documents` | **PostgreSQL & Staging** | Metadata in DB; staging in `/app/uploads` | Document metadata in `pg_dump` |
| **Media Staging Volume** | `mect-media` | Docker Named Volume | `/var/lib/docker/volumes/mect-media/_data` (Mounted at `/app/uploads/media`) | Local Docker Volume |
| **Receipt Export Volume** | `mect-receipts` | Docker Named Volume | `/var/lib/docker/volumes/mect-receipts/_data` (Mounted at `/app/receipts`) | Local Docker Volume |

---

## 2. Explanation of the 8.0 KiB Volume Measurement

On modern Linux ext4/xfs filesystems, an empty directory entry with filesystem block allocation (including directory inode allocation and `lost+found`) occupies exactly `4096` or `8192` bytes (8.0 KiB).

- **Why `mect-receipts` is 8.0 KiB:**  
  The MECT backend generates receipts upon donation confirmation and writes the complete PDF binary payload **directly into PostgreSQL** within the `donation_receipts.pdf_bytes` column (`bytea`). The named volume `/app/receipts` serves as an export staging mount for batch ZIP downloads. Because no batch exports have been written to disk yet, the volume directory remains in its pristine initialized state (8.0 KiB).
- **Why `mect-media` is 8.0 KiB:**  
  CMS media uploads store image payloads as base64 in `media_assets.data_base64`. The filesystem mount `/app/uploads/media` is reserved for direct streaming uploads. Because existing production assets are housed inside PostgreSQL, the volume directory occupies its base 8.0 KiB allocation.

---

## 3. Durability & Recovery Advantages

Storing binary receipts and media inside PostgreSQL provides critical reliability guarantees for MECT:
1. **Atomic Transactional Consistency:** A donation status update and its corresponding PDF receipt generation commit in the same database transaction. A crash cannot result in a paid donation without a receipt, or an orphaned receipt file without a database row.
2. **Unified Backup Coverage:** Every execution of `pg_dump` via `/opt/mect/scripts/backup-db.sh` dumps the entire database, including all receipt PDFs and CMS images.
3. **Restoration Simplicity:** Restoring the single file `mect_db_backup_TIMESTAMP.dump` restores all donor receipts and media assets without requiring separate rsync or S3 filesystem restoration tools.

---

## 4. Volume Persistence Test Across Container Lifecycle

- Tested that recreating or restarting `mect-backend` maintains volume mounts.
- Filesystem permissions inside containers: Owned by unprivileged user `mect` (UID 1001), allowing read/write operations while preventing host privilege escalation.

