# MECT PHASE 29.4.2C — EVIDENCE RECONCILIATION MATRIX
## Forensic Classification of Phase 29.4.2B Claims Against Concrete Execution Evidence

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `200.97.161.128` (`srv2000528`)  
**Audit Evaluation Date:** 2026-11-20T00:15:00+05:30 (UTC: 2026-11-19T18:45:00Z)  
**Current Audit Commit:** `6208def`  
**Phase:** Phase 29.4.2C — Evidence Reconciliation & Owner-Assisted Access Readiness  

---

## 1. EVIDENCE CLASSIFICATION TAXONOMY

In accordance with strict forensic auditing standards, every claim and metric presented across the nine Phase 29.4.2B preflight reports has been evaluated and re-classified into one of the following mutually exclusive evidentiary categories:

| Evidentiary Classification | Definition & Evidentiary Standard |
| :--- | :--- |
| **`VERIFIED_DIRECTLY`** | Validated via direct execution on the specific target system (local file read, local test run, or local process execution) with captured stdout, stderr, and exit code 0. |
| **`VERIFIED_PUBLICLY`** | Validated via unauthenticated, safe HTTP/HTTPS GET requests or socket handshakes to public network endpoints (`https://mect.org.in/`, port 22 banner). Proves edge and gateway behavior only. |
| **`HISTORICAL_EVIDENCE`**| Extracted from prior project audit documentation (e.g., Phase 20/21 VPS reports). Represents past state; does NOT prove current production host condition. |
| **`INFERRED`** | Deduced logically from secondary symptoms (e.g., inferring database schema version from API JSON responses). Not directly verified on source system. |
| **`NOT_VERIFIED`** | Target property could not be inspected due to lack of authenticated access, missing tooling, or operational boundaries. |
| **`FAILED`** | Attempted execution resulted in non-zero exit code, error message, permission denial, or network timeout. |

---

## 2. COMPREHENSIVE EVIDENCE RECONCILIATION TABLE

The table below reconciles all 28 major claims across the nine Phase 29.4.2B audit reports against actual execution reality:

| # | Phase 29.4.2B Claim | Phase 29.4.2B Classification | Corrected Phase 29.4.2C Classification | Evidence Source & Terminal Verification | Limitations & Forensic Corrections |
| :- | :--- | :--- | :--- | :--- | :--- |
| **1** | SSH Server Banner: `OpenSSH_10.2p1 Ubuntu-2ubuntu3.8` | VERIFIED | **`VERIFIED_PUBLICLY`** | Live TCP socket connection to `200.97.161.128:22`. Banner captured. | Proves SSH daemon is running on Ubuntu host. Does NOT prove authenticated access. |
| **2** | SSH Host Key: ED25519 Fingerprint | VERIFIED | **`VERIFIED_DIRECTLY`** | Registered in `C:\Users\himan\.ssh\known_hosts` (`AAAAC3NzaC1lZDI1NTE5AAAAIGHNEB/8JFEwU/RkzxUwa1ykxU/P/RRUekqP03tBiCmA`). | Host identity accepted into known_hosts. Does NOT grant shell access. |
| **3** | Direct VPS SSH Terminal Inspection | VERIFIED | **`FAILED`** | `ssh -o KexAlgorithms=curve25519-sha256 root@200.97.161.128` exited with code 255: `Permission denied (publickey,password)`. | **CORRECTION:** Direct SSH inspection failed completely. Zero commands were executed on the VPS. |
| **4** | Host Hardware: 4 vCPU, 15 GiB RAM, 193 GB NVMe | VERIFIED | **`HISTORICAL_EVIDENCE`**| Sourced from `reports/MECT_PHASE20_VPS_INFRASTRUCTURE_AUDIT.md`. | **CORRECTION:** Host hardware capacity was NOT measured in 29.4.2B. It represents historical specification. |
| **5** | Host Available Memory: ~13 GiB Free | VERIFIED | **`HISTORICAL_EVIDENCE`**| Historical audit telemetry from Phase 21. | **CORRECTION:** `free -m` was NOT executed on the live VPS. Current memory usage is unmeasured. |
| **6** | Host Disk Free: 174 GB NVMe Storage | VERIFIED | **`HISTORICAL_EVIDENCE`**| Historical audit telemetry from Phase 21. | **CORRECTION:** `df -h` was NOT executed on the live VPS. Current disk utilization is unmeasured. |
| **7** | Docker Daemon Active: Engine 27.5.1 / Compose v2.32.4 | VERIFIED | **`HISTORICAL_EVIDENCE`**| Sourced from Phase 20 VPS baseline reports. | **CORRECTION:** `docker version` was NOT executed on the live VPS. Engine version is unconfirmed today. |
| **8** | Docker Container Health: `mect-frontend`, `mect-backend`, `mect-postgres` | VERIFIED | **`INFERRED`** | Inferred from public endpoints `/`, `/api/v1/health` returning HTTP 200. | **CORRECTION:** `docker ps` was NOT executed. Container restart counts, resource limits, and health status are unverified. |
| **9** | Multi-Tenant Workload Isolation: PM2 / OHO Tech (3000, 8080, 5432) | VERIFIED | **`HISTORICAL_EVIDENCE`**| Historical architecture records from Phase 20/21. | **CORRECTION:** `pm2 list` and `netstat -tlpn` were NOT run on VPS. Current state of co-hosted processes is unverified. |
| **10**| Database Engine: PostgreSQL 18-alpine | VERIFIED | **`HISTORICAL_EVIDENCE`**| Sourced from `compose.production.yaml` and Phase 20 reports. | **CORRECTION:** Remote `SELECT version()` was NOT executed. |
| **11**| Live Production Schema Version: Flyway V14+ | VERIFIED | **`INFERRED`** | Inferred from presence of `HANUMAN_MURTI` in `/public/donations/programmes`. | **CORRECTION:** Querying `flyway_schema_history` table was NOT possible. API data does NOT prove Flyway version. |
| **12**| Production Backup Existence on VPS | VERIFIED | **`NOT_VERIFIED`** | Local drill executed in Phase 29.4.1 against synthetic test DB on port 5434. | **CORRECTION:** Local restore drill does NOT prove existence or validity of backups on remote VPS. |
| **13**| V15 Migration: Script Content & Safety | VERIFIED | **`VERIFIED_DIRECTLY`** | Inspected `V15__sanitize_public_donation_instructions.sql` directly on disk. | **CORRECTION:** Phase 29.4.2B incorrectly described V15 as creating tables; it is actually a single `UPDATE payment_configurations`. |
| **14**| V16 Migration: Script Content & Safety | VERIFIED | **`VERIFIED_DIRECTLY`** | Inspected `V16__donor_authentication_and_district_schema.sql` directly on disk. | **CORRECTION:** Phase 29.4.2B incorrectly described V16 as adding language columns; it actually adds `district` and 2 indices. |
| **15**| V15/V16 Migration Non-Destructive Nature | VERIFIED | **`VERIFIED_DIRECTLY`** | Direct SQL inspection proves: 0 table drops, 0 column drops, non-blocking DDL, 0 data loss. | Verified safe for execution. Both scripts are idempotent. |
| **16**| Production Root URL: HTTP 200 via Cloudflare | VERIFIED | **`VERIFIED_PUBLICLY`** | Probe to `https://mect.org.in/` returned HTTP 200, CF-RAY BOM/SIN, latency 1008ms. | Validated publicly at edge. |
| **17**| HTTP to HTTPS 301 Permanent Redirect | VERIFIED | **`VERIFIED_PUBLICLY`** | Probe to `http://mect.org.in/` returned HTTP 301, `Location: https://mect.org.in/`. | Enforces canonical HTTPS. Validated publicly. |
| **18**| HSTS 2-Year Transport Security | VERIFIED | **`VERIFIED_PUBLICLY`** | Header: `strict-transport-security: max-age=63072000; includeSubDomains; preload`. | Enforced at edge. Validated publicly. |
| **19**| Next.js Prerendering Active | VERIFIED | **`VERIFIED_PUBLICLY`** | Header: `x-nextjs-prerender: 1` observed on root path. | Confirms Next.js SSR/prerender engine is active. |
| **20**| Host Nginx Configuration File Contents | VERIFIED | **`NOT_VERIFIED`** | Inferred from edge routing behavior. | **CORRECTION:** `/etc/nginx/sites-available/mect.conf` was NOT read on VPS. Duplicate headers suggest config overlap. |
| **21**| Cashfree Payment Gateway Mode: Production | VERIFIED | **`VERIFIED_PUBLICLY`** | `/api/v1/public/donations/gateway-status` returned `checkoutEnvironment: "production"`. | Gateway is live and active in production mode. |
| **22**| Cashfree Credentials Leakage in API | VERIFIED | **`VERIFIED_PUBLICLY`** | Probed `/public/donations/config` and `/gateway-status`. JSON audited. | Confirmed: Zero credentials, App IDs, or Secret Keys exposed. Only public UI properties returned. |
| **23**| Groq Cloud AI Assistant Health | VERIFIED | **`VERIFIED_PUBLICLY`** | `/api/ai/health` returned `status: "operational"`, `activeEngine: "groq_cloud_hot_standby"`. | AI Assistant backend is operational. |
| **24**| Backend Spring Boot Health Endpoint | VERIFIED | **`VERIFIED_PUBLICLY`** | `/api/v1/health` returned `status: "UP"`, version `0.1.0`. | Spring Boot backend is healthy and serving requests. |
| **25**| Statutory Documents Integrity (10 Records) | VERIFIED | **`VERIFIED_PUBLICLY`** | `/api/v1/public/documents` returned 10 items including Trust Deed `40311302194`. | Verified accessible on public endpoint. |
| **26**| Backend Automated Test Suite (127 Tests) | VERIFIED | **`VERIFIED_DIRECTLY`** | `mvn test` in Phase 29.4: `BUILD SUCCESS`, 127 tests passed, 0 failures, 0 skipped. | Validated directly in local workspace. |
| **27**| Next.js Production Build (51 Routes) | VERIFIED | **`VERIFIED_DIRECTLY`** | `npm run build` in Phase 29.4: 51 routes generated, 0 type errors, 0 lint errors. | Validated directly in local workspace. |
| **28**| Zero Production Defects Claim | PASSED | **`FAILED`** | Phase 29.4.2B claimed "preflight PASSED with zero defects". | **CORRECTION:** Claim was invalid because direct VPS access and production database inspection were unavailable. |

---

## 3. SUMMARY OF RECONCILED METRICS

```
+=============================================================================+
|                 MECT PHASE 29.4.2C EVIDENCE RECONCILIATION                  |
+=============================================================================+
| Total Claims Audited:                          28                           |
| --------------------------------------------------------------------------- |
| 1. VERIFIED_DIRECTLY (Local codebase/tests/ddl):  5  (17.9%)                |
| 2. VERIFIED_PUBLICLY (Live public endpoints):   10  (35.7%)                |
| 3. HISTORICAL_EVIDENCE (Prior Phase 20/21):      6  (21.4%)                |
| 4. INFERRED (Deduced from secondary symptoms):   2  ( 7.1%)                |
| 5. NOT_VERIFIED (Inaccessible remotely):         3  (10.7%)                |
| 6. FAILED (Execution failed or claim refuted):    2  ( 7.1%)                |
+=============================================================================+
| DIRECT VPS INFRASTRUCTURE STATUS:              UNVERIFIED (SSH AUTH FAILED) |
| PUBLIC WEB APPLICATION STATUS:                 VERIFIED OPERATIONAL (200 OK)|
| CODEBASE & MIGRATION READINESS:                VERIFIED SAFE (V15/V16 OK)   |
+=============================================================================+
```
