# MECT PHASE 20.2 — DATABASE CONFIGURATION & BACKUP ARCHIVE VERIFICATION

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** `mect-postgres` on Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Database:** `mect_db`  
**Audit Timestamp:** 2026-11-13T09:30:00Z (UTC)  
**Lead Auditor:** PostgreSQL Database Administrator & SRE  
**Status:** PASS — ARCHIVE INTEGRITY CONFIRMED & DOCUMENTED  

---

## 1. Production PostgreSQL Specification

- **PostgreSQL Version:** `PostgreSQL 18.7 on x86_64-pc-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit`
- **Container Image:** `postgres:18-alpine` (Image ID: `sha256:1018733457011bf88d81db98cf43aac6d5150afc18787dbe204771fedf80ff95`)
- **Database Name:** `mect_db`
- **Database Owner / User:** `mect_user`
- **Server Encoding:** `UTF8`
- **Database Collation:** `en_US.utf8`
- **Database Ctype:** `en_US.utf8`
- **Extensions Installed:** `plpgsql` (Version 1.0)
- **Active Connection Pool:** 11 connections (HikariCP pool via `mect-backend`) | Limit: 100
- **Database Disk Footprint:** 10 MB

---

## 2. Flyway Schema Migrations Verification

Querying `flyway_schema_history` confirms that all 11 migrations are applied and verified:

```
 installed_rank | version |              description               | type |                     script                     |  checksum   |        installed_on        | execution_time | success 
----------------+---------+----------------------------------------+------+------------------------------------------------+-------------+----------------------------+----------------+---------
              1 | 1       | initial schema                         | SQL  | V1__initial_schema.sql                         | -1695258357 | 2026-11-04 10:45:22.151321 |             31 | t
              2 | 2       | auth and audit schema                  | SQL  | V2__auth_and_audit_schema.sql                  | -1924590625 | 2026-11-04 10:45:22.21732  |             40 | t
              3 | 3       | volunteer consent and district         | SQL  | V3__volunteer_consent_and_district.sql         | -2123652304 | 2026-11-04 10:45:22.286261 |             13 | t
              4 | 4       | volunteer consent integrity            | SQL  | V4__volunteer_consent_integrity.sql            |  1467867273 | 2026-11-04 10:45:22.315528 |             22 | t
              5 | 5       | volunteer optimistic locking           | SQL  | V5__volunteer_optimistic_locking.sql           |  -905459182 | 2026-11-04 10:45:22.352488 |              5 | t
              6 | 6       | scholarship applications schema        | SQL  | V6__scholarship_applications_schema.sql        |    61761631 | 2026-11-04 10:45:22.370154 |             33 | t
              7 | 7       | portal users and otp schema            | SQL  | V7__portal_users_and_otp_schema.sql            |   135976469 | 2026-11-10 20:08:35.686276 |             84 | t
              8 | 8       | donations payments and receipts schema | SQL  | V8__donations_payments_and_receipts_schema.sql |  1429323930 | 2026-11-10 20:08:35.828002 |             51 | t
              9 | 9       | notification outbox schema             | SQL  | V9__notification_outbox_schema.sql             |  1527538704 | 2026-11-10 20:08:35.901513 |             17 | t
             10 | 10      | cashfree payment gateway schema        | SQL  | V10__cashfree_payment_gateway_schema.sql       |  1115715128 | 2026-11-11 20:16:28.962173 |             48 | t
             11 | 11      | donation ecosystem cms and rbac        | SQL  | V11__donation_ecosystem_cms_and_rbac.sql       |  1171883131 | 2026-11-13 08:00:59.732691 |             75 | t
```

---

## 3. Production Backup Archive Verification

### 3.1 Primary Baseline Dump Archive
- **Path:** `/var/backups/mect/mect_db_backup_20261113_080335.dump`
- **Creation Timestamp:** `2026-11-13 08:03:36 UTC`
- **Dump Format:** PostgreSQL Custom Format (gzip compressed)
- **File Size:** `134,396 bytes` (132 KB)
- **SHA-256 Digest:** `260df65aeaa0f1b3330e7bd274ebe948fd59b52b160d2bbaa65f87a1f2041731`
- **TOC Integrity:** Verified using `pg_restore -l`. Contains exactly **305 Table of Contents (TOC) entries** covering all 29 tables, sequences, primary keys, indices, and foreign key constraints.

### 3.2 Pre-Docker Historical Backup
- **Path:** `/var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump`
- **Creation Timestamp:** `2026-11-13 07:28:40 UTC`
- **File Size:** `115,146 bytes` (113 KB)
- **SHA-256 Digest:** `93c762bdd3c22982cace2b0d83efb59c60365f0441e8f4537188a829fa68418a`

---

## 4. Persistent Storage & Named Volumes Verification

Inspection of Docker volumes on the production host confirms:
- `mect-pgdata` (`/var/lib/docker/volumes/mect-pgdata/_data`): **66 MiB** (PostgreSQL base data directory, WAL, binary PDF bytes).
- `mect-media` (`/var/lib/docker/volumes/mect-media/_data`): **8.0 KiB** (Staging directory for CMS file uploads).
- `mect-receipts` (`/var/lib/docker/volumes/mect-receipts/_data`): **8.0 KiB** (Staging directory for receipt PDF filesystem exports).

---

## 5. RTO and RPO Distinctions

| Parameter | Database-Only Scope | Full-Service Scope | Verification Evidence |
|---|---|---|---|
| **RTO (Recovery Time Objective)** | **1.8 seconds** | **~2.5 minutes** | `pg_restore` drill into temporary DB took 1.8s. Full cold-start of 3 containers from scratch takes ~2.5 minutes. |
| **RPO (Recovery Point Objective)** | **< 24 hours** | **< 24 hours** | Enforced by daily cron `/etc/cron.d/mect-backup` running at 02:00 UTC. |
