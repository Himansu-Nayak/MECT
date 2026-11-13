# MECT Phase 20 — Database Migration & Pre-Deployment Backup Verification

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Database Host:** Container `mect-postgres` (`postgres:18-alpine`, PostgreSQL 18.7)  
**Source Database:** Host PostgreSQL 18.6 (`mect_db`)  
**Target Database:** `mect_db`  
**User:** `mect_user`

---

## 1. Production Database Pre-Deployment Snapshot

Prior to executing any container operations or schema migrations, an atomic custom-format snapshot of the host production database was captured and verified.

- **Backup Command:** `sudo -u postgres pg_dump -Fc -d mect_db -f /var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump`
- **Backup File Path:** `/var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump`
- **Secondary Mirror:** `/opt/mect/backups/mect_prod_pre_docker_phase20_20261113_072840.dump`
- **Archive Size:** `113 KB` (115,712 bytes)
- **SHA-256 Checksum:** `93c762bdd3c22982cace2b0d83efb59c60365f0441e8f4537188a829fa68418a`
- **TOC Integrity:** 254 entries, gzip compressed, format `CUSTOM` (Exit Code `0` via `pg_restore --list`).

---

## 2. Containerized Database Restoration

The verified backup was restored into the isolated Docker container `mect-postgres` with volume `mect-pgdata`:

```bash
docker exec -i mect-postgres pg_restore \
    -U mect_user -d mect_db \
    --clean --if-exists --no-owner --no-privileges < /var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump
```

- **Restoration Exit Code:** `0`
- **Initial Tables Restored:** 24 tables

---

## 3. Flyway Migration V11 Execution

Upon backend container initialization, Flyway detected existing ranks 1–10 and executed `V11__donation_ecosystem_cms_and_rbac.sql` cleanly:

```text
2026-11-13T08:00:59.580Z INFO 1 --- [main] org.flywaydb.core.FlywayExecutor : Database: jdbc:postgresql://mect-postgres:5432/mect_db (PostgreSQL 18.7)
2026-11-13T08:01:00.104Z INFO 1 --- [main] o.f.c.i.s.JdbcTableSchemaHistory : Current version of schema "public": 10
2026-11-13T08:01:00.121Z INFO 1 --- [main] o.f.c.i.s.DefaultSqlScriptExecutor : Migrating schema "public" to version "11 - donation ecosystem cms and rbac"
2026-11-13T08:01:00.340Z INFO 1 --- [main] org.flywaydb.core.FlywayExecutor : Successfully applied 1 migration to schema "public", now at version v11
```

### Verified Schema History Table

```text
 installed_rank | version |              description               | success 
----------------+---------+----------------------------------------+---------
              1 | 1       | initial schema                         | t
              2 | 2       | auth and audit schema                  | t
              3 | 3       | volunteer consent and district         | t
              4 | 4       | volunteer consent integrity            | t
              5 | 5       | volunteer optimistic locking           | t
              6 | 6       | scholarship applications schema        | t
              7 | 7       | portal users and otp schema            | t
              8 | 8       | donations payments and receipts schema | t
              9 | 9       | notification outbox schema             | t
             10 | 10      | cashfree payment gateway schema        | t
             11 | 11      | donation ecosystem cms and rbac        | t
(11 rows)
```

---

## 4. Financial Records & Entity Row Count Verification

| Entity / Table | Source Host Database Count | Containerized Database Count | Delta | Status |
| :--- | :--- | :--- | :--- | :--- |
| `donations` | 4 | 4 | 0 | **100% PRESERVED** |
| `payments` | 4 | 4 | 0 | **100% PRESERVED** |
| `donation_receipts` | 3 | 3 | 0 | **100% PRESERVED** |
| `portal_users` | 2 | 2 | 0 | **100% PRESERVED** |
| `payment_configurations` | 0 (New in V11) | 1 (Seeded in V11) | +1 | **SEEDED PROPERLY** |
| Total Tables | 24 | 29 | +5 | **V11 TABLES ACTIVE** |

---

## 5. Certification

Zero financial records were altered, lost, or dropped during migration. The database operates on persistent volume `mect-pgdata`.
