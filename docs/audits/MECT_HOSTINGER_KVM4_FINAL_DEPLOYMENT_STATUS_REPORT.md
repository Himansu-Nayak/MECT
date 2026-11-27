# MECT — HOSTINGER KVM 4 DEPLOYMENT STATE AUDIT & FINAL RELEASE STATUS REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Deployment Directory:** `/opt/mect-staging`  
**Docker Project:** `mect-staging`  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Deployed Commit SHA:** `8caa818915d0b4af0d3f3fb0173081d43b330ce3`  
**Release Code Baseline:** `feea54152552ece67119090ae9243c4ca8301fa8` (Backend & Frontend application bundle)  
**Staging Frontend Upstream:** `http://127.0.0.1:3002`  
**Staging Backend API Upstream:** `http://127.0.0.1:8082`  
**Staging PostgreSQL Database:** `mect_staging_db` on internal network `mect-staging-network` (0 published host ports)  
**Report Date:** 2026-11-27  
**Current Phase Status:** **`VERIFIED HOSTINGER KVM 4 DEPLOYMENT — AWAITING OWNER CLOUDFLARE ACTIVATION`**

---

## 1. READ-ONLY DEPLOYMENT STATE AUDIT (HOSTINGER KVM 4)

A comprehensive read-only audit of the Hostinger VPS runtime state was executed:

### A. Git Working Tree in `/opt/mect-staging`
- **Branch:** `feat/complete-website-redefinition-and-deduplication` (synced with remote origin)
- **Local HEAD SHA:** `8caa818915d0b4af0d3f3fb0173081d43b330ce3`
- **Working Tree:** Clean (0 uncommitted changes, 0 untracked files)
- **Last Commit:** `8caa818 docs(audit): create Phase 2.7H.2 DNS correction and final staging activation report`

### B. Docker Container Runtime Inventory

```
NAMES                   STATUS                    PORTS                      IMAGE
mect-frontend-staging   Up 32 minutes (healthy)   127.0.0.1:3002->3000/tcp   mect-frontend:staging
mect-backend-staging    Up 32 minutes (healthy)   127.0.0.1:8082->8080/tcp   mect-backend:staging
mect-postgres-staging   Up 2 hours (healthy)      5432/tcp                   postgres:18-alpine
mect-frontend           Up 3 days (healthy)       127.0.0.1:3001->3000/tcp   mect-frontend:production
mect-backend            Up 3 days (healthy)       127.0.0.1:8081->8080/tcp   mect-backend:production
mect-postgres           Up 9 days (healthy)       127.0.0.1:5433->5432/tcp   postgres:18-alpine
```

### C. Container Resource Consumption

| Container | CPU Usage | Memory Usage | Memory Limit | Memory % | Host Ports Bound |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `mect-frontend-staging` | 0.05% | 44.5 MiB | 384 MiB | 11.59% | `127.0.0.1:3002->3000` |
| `mect-backend-staging` | 0.22% | 383.2 MiB | 768 MiB | 49.90% | `127.0.0.1:8082->8080` |
| `mect-postgres-staging` | 0.02% | 45.4 MiB | 256 MiB | 17.73% | *None* (Internal only) |
| **Total Staging Footprint** | **0.29%** | **473.1 MiB** | **1.40 GiB** | — | — |

---

## 2. DATA PRESERVATION & PRODUCTION ISOLATION

### A. Volume & Database Preservation
- **Volumes Verified:**
  - `mect-staging-pgdata` &rarr; Preserved (100% data intact across restarts).
  - `mect-staging-media` &rarr; Preserved.
  - `mect-staging-receipts` &rarr; Preserved.
- **Database Backup:** Cold logical SQL dump created and archived at `/opt/mect-staging/backups/mect_staging_backup_1795762316.sql` (155,800 bytes).
- **Zero Volumes Destroyed:** No `docker volume rm` or destructive compose commands executed.

### B. Production Non-Interference Verification
- **Production MECT:** Ports `3001` (frontend), `8081` (backend), `5433` (Postgres) probed live &rarr; **HTTP 200 OK, zero downtime**.
- **OHO Tech:** Ports `3000` (frontend), `8080` (backend), `5432` (Postgres) probed live &rarr; **HTTP 200 OK, zero downtime**.
- **Systemd Units:** `/etc/systemd/system/mect-backend-staging.service` is inactive/disabled (migrated to Docker).

---

## 3. DATABASE SCHEMA & FLYWAY MIGRATION STATUS

The staging PostgreSQL database `mect_staging_db` was forensically verified via internal Docker socket:

```
Database: jdbc:postgresql://mect-postgres-staging:5432/mect_staging_db (PostgreSQL 18.7)
Flyway Schema History Count: 20 migrations
Latest Migration: V20 - "google oidc and donor identity linking" (Installed: 2026-11-27 05:08:20, Success: t)
Pending Migrations: 0
Total Public Tables: 37 tables
Integrity Constraints: 37 PKs, 26 FKs, 31 Unique Constraints, 2 Check Constraints
```

---

## 4. COMPREHENSIVE INTEGRATION TEST SUITE RESULTS

A complete automated Python integration test suite (`/tmp/staging_smoke_tests.py`) was executed directly on the Hostinger VPS against the running staging processes:

| Test ID | Target / Feature | Request Details | Observed Response | Result |
| :--- | :--- | :--- | :--- | :---: |
| **TEST-01** | **Frontend Web Server** | `GET http://127.0.0.1:3002` | HTTP 200 OK (228,038 bytes HTML rendered) | **`PASS`** |
| **TEST-02** | **Backend Actuator Health** | `GET http://127.0.0.1:8082/api/v1/actuator/health` | HTTP 200 `{"status":"UP","groups":["liveness","readiness"]}` | **`PASS`** |
| **TEST-03** | **Canonical Programmes API** | `GET http://127.0.0.1:8082/api/v1/public/donations/programmes` | HTTP 200 OK (6 active trust programmes returned) | **`PASS`** |
| **TEST-04** | **Dual-Path Programmes Alias** | `GET http://127.0.0.1:8082/api/v1/public/programmes` | HTTP 200 OK (6 active trust programmes returned) | **`PASS`** |
| **TEST-05** | **Public Donations Config** | `GET http://127.0.0.1:8082/api/v1/public/donations/config` | HTTP 200 OK (Bank coordinates, UPI ID, gateway policy) | **`PASS`** |
| **TEST-06** | **Donor OTP Request** | `POST /portal/auth/request-otp` (`PHONE`, `+919438200001`) | HTTP 200 `{"accepted":true,"cooldownSeconds":60,"expiresInSeconds":600}` | **`PASS`** |
| **TEST-07** | **Donor OTP Verification** | `POST /portal/auth/verify-otp` (PIN: `123456`) | HTTP 200 OK (Donor JWT access token generated, 319 chars) | **`PASS`** |
| **TEST-08** | **Donor Dashboard API** | `GET /portal/me/dashboard` (Bearer JWT) | HTTP 200 OK (Donor profile authenticated, 0 donations) | **`PASS`** |
| **TEST-09** | **Manual SBI UTR Submission** | `POST /public/donations/sbi/submit-utr` (Bearer JWT) | HTTP 201 Created (`ClaimRef=MECT-UTR-2026-14F04F`) | **`PASS`** |
| **TEST-10** | **Database Persistence** | SQL `SELECT count(*) FROM manual_bank_transfer_claims;` | Database returned 3 verified claims recorded in PostgreSQL | **`PASS`** |
| **TEST-11** | **Production Non-Interference** | Probe `3001` (MECT Web) and `8081` (MECT API) | Both endpoints returned HTTP 200 OK, zero disturbance | **`PASS`** |

**Summary: 11 / 11 Integration Tests Passed (100% Pass Rate, 0 Failures).**

---

## 5. DOMAIN & INGRESS CONFIGURATION STATUS

### A. Origin Nginx Configuration
- **File:** `/etc/nginx/sites-available/staging.mect.org.in.conf`
- **Syntax Preflight:** `nginx -t` passed with exit code 0 (`syntax is ok, test is successful`).
- **TLS Certificate:** `/etc/ssl/mect/fullchain.pem` (Cloudflare Origin CA wildcard covering `*.mect.org.in`, valid until Oct 29, 2041).
- **Same-Origin API Routing:** Location `/api/` reverse-proxies directly to `127.0.0.1:8082`, eliminating cross-origin browser cookie omission.
- **Actuator Shield:** `/api/v1/actuator/*` denied (`return 404`), except `/health`.
- **Search Engine Shield:** `X-Robots-Tag "noindex, nofollow, noarchive" always;`.

### B. Cloudflare DNS & Public Ingress Status

| Subdomain | Queried DNS | Resolved Address | Current Edge Status | Action Required |
| :--- | :---: | :---: | :---: | :--- |
| `staging.mect.org.in` | `1.1.1.1` | `200.97.161.128` | **Unproxied Wildcard Fallback** | Owner must set A record `staging` to Proxied (Orange Cloud) in Cloudflare. |
| `staging-api.mect.org.in` | `1.1.1.1` | `200.97.161.128` | **Unproxied Wildcard Fallback** | Owner must set A record `staging-api` to Proxied (Orange Cloud) in Cloudflare. |
| `mect.org.in` (Prod) | `1.1.1.1` | `104.21.44.48`, `172.67.195.21` | **Cloudflare Anycast Proxied** | Active & Protected. |

---

## 6. REMAINING ACTIVATION GATES & IMMEDIATE NEXT STEPS

The application is fully deployed, healthy, tested, and waiting inside the Hostinger KVM 4 VPS.

To make `https://staging.mect.org.in` accessible to the owner:
1. **Cloudflare DNS Correction (Owner Action):**
   - In Cloudflare DNS for `mect.org.in`:
     - Set `staging` &rarr; `A` &rarr; `200.97.161.128` &rarr; **Proxied (Orange Cloud: ON)** &rarr; Click **Save**.
     - Set `staging-api` &rarr; `A` &rarr; `200.97.161.128` &rarr; **Proxied (Orange Cloud: ON)** &rarr; Click **Save**.
2. **Cloudflare Access Application (Owner Action):**
   - Create Self-Hosted Access Application for `staging.mect.org.in` in Cloudflare Zero Trust, restricted to owner's email via OTP PIN.
3. **Owner Approval for Nginx Ingress:**
   - Once DNS is switched to Proxied, owner grants authorization to run `ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/` and `systemctl reload nginx`.
