# MECT Phase 20 — PostgreSQL Docker Deployment Report

**Database Engine:** PostgreSQL 18.7  
**Container Name:** `mect-postgres`  
**Image Tag:** `postgres:18-alpine`  
**Host Loopback Binding:** `127.0.0.1:5433:5432`  
**Docker Network:** `mect-network` (`mect-postgres:5432`)  
**Volume:** `mect-pgdata` (`/var/lib/postgresql/data`)

---

## 1. Engine & Version Compatibility

- **Host PostgreSQL Version:** `18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)`
- **Container PostgreSQL Version:** `18.7 (Alpine)`
- **Major Version Delta:** `0` (Zero major version migration risk; binary dump compatibility preserved).
- **Timezone:** `UTC`
- **Encoding / Collation:** `UTF-8`

---

## 2. Security & Network Isolation

1. **Private Docker Network:** The container communicates with `mect-backend` directly over the private internal bridge network `mect-network`.
2. **Zero Public Internet Exposure:** Port `5432` is not published to `0.0.0.0`.
3. **Loopback Administration Port:** Mapped exclusively to `127.0.0.1:5433` on the VPS loopback interface, allowing automated host backup scripts to run without exposing database ports.
4. **Least-Privilege User:** All application access operates through `mect_user` with restricted grants on schema `public`.

---

## 3. Data Integrity & Persistence Verification

- **Persistent Volume Mounted:** `mect-pgdata` -> `/var/lib/postgresql/data`
- **Tables Present:** 29 tables (including Flyway 11 schema history, audit logs, CMS, media assets, donations, and payments).
- **Row Count Integrity:**
  - `donations`: 4 rows
  - `payments`: 4 rows
  - `donation_receipts`: 3 rows
  - `portal_users`: 2 rows
  - `payment_configurations`: 1 row
- **Healthcheck Definition:**
  ```yaml
  test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER:-mect_user} -d $${POSTGRES_DB:-mect_db}"]
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 10s
  ```
- **Live Status:** `Up 27+ minutes (healthy)`
- **Memory Consumption:** `46.49 MiB` (0.29% host RAM).
