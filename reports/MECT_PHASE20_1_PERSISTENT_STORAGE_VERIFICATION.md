# MECT PHASE 20.1 — PERSISTENT STORAGE & FILE DURABILITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:15:00Z (UTC)  
**Status:** PASS — DURABLE AND ACID PERSISTED  

---

## 1. Storage Architecture Overview

MECT utilizes a hybrid persistence architecture combining PostgreSQL transactional storage and Docker named volumes:

1. **Transactional Database Storage (`mect-pgdata`):**
   - Host Mount: `/var/lib/docker/volumes/mect-pgdata/_data`
   - Disk Usage: 66 MiB
   - Scope: Complete PostgreSQL cluster, tables, indices, WAL, and in-database binary blobs (receipt PDFs and CMS media).
2. **Dedicated Media Storage (`mect-media`):**
   - Host Mount: `/var/lib/docker/volumes/mect-media/_data`
   - Scope: File-based media asset staging.
3. **Dedicated Receipts Storage (`mect-receipts`):**
   - Host Mount: `/var/lib/docker/volumes/mect-receipts/_data`
   - Scope: File-based PDF export cache.

---

## 2. In-Database Binary Object Durability

### 2.1 Donation Receipts (`donation_receipts.pdf_bytes`)
- Receipt PDFs are generated upon successful donation confirmation and stored directly in PostgreSQL as `bytea` with a corresponding SHA-256 digest (`pdf_sha256`).
- Total records: 3
- Size footprint: ~2.6 KB per receipt.
- **Durability Guarantee:** Protected by PostgreSQL Write-Ahead Logging (WAL), atomic commit guarantees, and daily automated pg_dump backups. No external filesystem synchronization risk.

### 2.2 CMS Media Assets (`media_assets.data_base64`)
- CMS uploaded images and hero banners are stored within `media_assets` with complete base64 data, MIME types, and versioning.
- Total records: 0 (freshly initialized CMS ready for administrative upload).

---

## 3. Volume Persistence Across Container Lifecycle

- **Restart Survival Test:** Verified that running `docker restart mect-backend` and `docker restart mect-frontend` does not impact filesystem mounts or database connections.
- **Isolation Protection:** Named volumes are isolated from ephemeral container layers. Container re-creation (`docker compose up -d`) mounts the existing volumes without data loss.
- **Anti-Loss Configuration:**
  - `docker-compose.production.yaml` defines `external: false` with persistent top-level volume definitions.
  - No prune scripts or automated volume cleanups exist on the host.
