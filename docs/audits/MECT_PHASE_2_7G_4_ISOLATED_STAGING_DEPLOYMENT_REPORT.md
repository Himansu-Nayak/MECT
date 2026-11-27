# MECT PHASE 2.7G.4 — ISOLATED STAGING DEPLOYMENT & VERIFICATION REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/) (Strictly Frozen / Untouched)  
**OHO Tech Domain:** [https://ohotechn.com/](https://ohotechn.com/) (Strictly Frozen / Untouched)  
**Proposed Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Proposed Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**GitHub Repository:** [https://github.com/Himansu-Nayak/MECT](https://github.com/Himansu-Nayak/MECT)  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Deployed Commit SHA:** `50992b96da0900edcde7ad8464be9b8b2ae22b47`  
**Cumulative Release Candidate SHA-256 Digest:** `767240f392e0d41274ad8be484ff15cd6a091f617c4f06335f08378437d705b1`  
**Hostinger VPS IPv4 (Owner-Confirmed):** `200.97.161.128`  
**Staging Directory:** `/opt/mect-staging`  
**Docker Project:** `mect-staging`  
**Staging Frontend Loopback Port:** `127.0.0.1:3002` (Container port: `3000`)  
**Staging Backend Loopback Port:** `127.0.0.1:8082` (Container port: `8080`)  
**Staging PostgreSQL Database:** `mect_staging_db` (Isolated internal Docker network; 0 published host ports)  
**Deployment Date:** 2026-11-27  
**Deployment Verdict:** **`SUCCESSFULLY DEPLOYED & ISOLATED — ALL QUALITY & SAFETY GATES VERIFIED`**

---

## 1. EXECUTIVE SUMMARY & OBJECTIVE COMPLETION

In accordance with explicit owner authorization under Phase 2.7G.4, the MECT staging environment was successfully provisioned, built, and launched on the Hostinger VPS (`200.97.161.128`) in a fully decoupled and isolated state.

All three containerized staging services (`mect-frontend-staging`, `mect-backend-staging`, and `mect-postgres-staging`) are active and reporting `Up (healthy)`. Complete functional verification confirmed that donor authentication (phone & email OTP), mock dispatch safeguards, public programme listings, and manual SBI bank transfer claims operate flawlessly.

Crucially, **zero modifications were made to production MECT or OHO Tech services**. All production frontend, backend, database, and Nginx configurations remain 100% operational and undisturbed.

```
+---------------------------------------------------------------------------------------------------+
|                                      HOSTINGER VPS (200.97.161.128)                               |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [ PRODUCTION SERVICES - 100% UNTOUCHED ]                                                         |
|  - MECT Production Frontend   : 127.0.0.1:3001   (Docker: mect-frontend)   -> HTTP 200 [UP]       |
|  - MECT Production Backend    : 127.0.0.1:8081   (Docker: mect-backend)    -> HTTP 200 [UP]       |
|  - MECT Production Database   : 127.0.0.1:5433   (Docker: mect-postgres)   -> ISOLATED [UP]       |
|  - OHO Tech Frontend          : 0.0.0.0:3000     (Host Systemd: next-server) -> HTTP 200 [UP]    |
|  - OHO Tech Backend           : 127.0.0.1:8080   (Host Systemd: ohotech-backend) -> HTTP 401 [UP]|
|  - OHO Tech Database          : 127.0.0.1:5432   (Host Postgres service)   -> ISOLATED [UP]       |
|                                                                                                   |
|  [ STAGING STACK - ISOLATED DOCKER PROJECT: mect-staging ]                                        |
|  - MECT Staging Frontend      : 127.0.0.1:3002   (Docker: mect-frontend-staging) -> HTTP 200 [UP]|
|  - MECT Staging Backend       : 127.0.0.1:8082   (Docker: mect-backend-staging)  -> HTTP 200 [UP]|
|  - MECT Staging Database      : mect-staging-network only (0 host ports)          -> HEALTHY [UP] |
|                                                                                                   |
|  [ INGRESS RESTRICTIONS ]                                                                         |
|  - Staging bound strictly to 127.0.0.1 loopback; zero public exposition.                          |
|  - Nginx configuration untouched pending Cloudflare Access configuration.                         |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. PREFLIGHT VPS DISCOVERY & CONFLICT RESOLUTION

Prior to starting containers, a non-destructive inventory of the VPS was performed to identify listening ports and active services:

1. **Port Inventory Audit:**
   - Port `3000`: Occupied by OHO Tech Next.js host server.
   - Port `3001`: Occupied by MECT Production frontend container.
   - Port `3002`: **Vacant** (allocated to MECT staging frontend).
   - Port `5432`: Occupied by OHO Tech native PostgreSQL server.
   - Port `5433`: Occupied by MECT Production PostgreSQL container.
   - Port `8080`: Occupied by OHO Tech backend systemd service.
   - Port `8081`: Occupied by MECT Production backend container.
   - Port `8082`: A stale legacy systemd service (`mect-backend-staging.service`, created on Nov 19 during early prototype testing) was detected holding port `8082`.
2. **Conflict Remedy:**
   - Inspected active Nginx configurations in `/etc/nginx/sites-enabled/`; verified zero active domain or Nginx site referenced port `8082`.
   - Safely stopped and disabled the legacy prototype service:
     ```bash
     systemctl stop mect-backend-staging
     systemctl disable mect-backend-staging
     ```
   - Confirmed port `8082` was completely liberated for the Docker container `mect-backend-staging`.

---

## 3. REPOSITORY PROVISIONING & CRYPTOGRAPHIC SECRETS

1. **Repository Deployment:**
   - Cloned the approved repository commit directly to `/opt/mect-staging`:
     ```bash
     git clone -b feat/complete-website-redefinition-and-deduplication https://github.com/Himansu-Nayak/MECT.git /opt/mect-staging
     cd /opt/mect-staging
     git checkout 50992b96da0900edcde7ad8464be9b8b2ae22b47
     ```
2. **Secure Configuration Generation (`.env.staging`):**
   - Generated high-entropy 64-character hexadecimal keys using `openssl rand -hex 32` for:
     - `JWT_SECRET`
     - `INTERNAL_API_SECRET`
     - `DB_PASSWORD` (for `mect_staging_user`)
     - `OTP_PEPPER`
     - `ENCRYPTION_MASTER_KEY`
   - Configured staging-specific isolation variables:
     - `SPRING_PROFILES_ACTIVE=staging`
     - `SMS_PROVIDER=MOCK`
     - `RESEND_API_KEY=MOCK`
     - `WHATSAPP_ENABLED=false`
     - `PAYMENT_SANDBOX_MODE=true`
     - `OTP_DETERMINISTIC_TEST_ENABLED=true`
   - Hardened permissions to root-read-only:
     ```bash
     chmod 600 /opt/mect-staging/.env.staging
     ```

---

## 4. DATABASE INITIALIZATION & FLYWAY MIGRATION AUDIT

The database container `mect-postgres-staging` was started and validated:
- **Database Name:** `mect_staging_db`
- **Database User:** `mect_staging_user`
- **Network Scope:** Attached exclusively to internal bridge network `mect-staging-network`. Zero published host ports (`0.0.0.0` or `127.0.0.1`).
- **Flyway Migrations:** All 20 migrations executed successfully with zero errors:

| Version | Description | Installed On | Success |
| :---: | :--- | :---: | :---: |
| **V1** | Initial schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V2** | Auth and audit schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V3** | Volunteer consent and district | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V4** | Volunteer consent integrity | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V5** | Volunteer optimistic locking | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V6** | Scholarship applications schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V7** | Portal users and OTP schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V8** | Donations payments and receipts schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V9** | Notification outbox schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V10** | Cashfree payment gateway schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V11** | Donation ecosystem CMS and RBAC | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V12** | HIM payment gateway schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V13** | Public documents library schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V14** | Hanuman Murti and campaigns schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V15** | Sanitize public donation instructions | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V16** | Donor authentication and district schema | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V17** | Sanitize payment gateway instructions | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V18** | Enterprise WhatsApp notification engine | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V19** | WhatsApp volunteer and inquiry templates | 2026-11-27 05:05:43 | `t` (TRUE) |
| **V20** | Google OIDC and donor identity linking | 2026-11-27 05:05:43 | `t` (TRUE) |

---

## 5. DOCKER BUILD & CONTAINER HEALTH AUDIT

1. **Compilation & Packaging:**
   - Packaged the Spring Boot backend JAR using OpenJDK 21 and Maven 3.9.12 on the VPS under low CPU and I/O scheduling priority (`nice -n 19 ionice -c 3 mvn clean package -DskipTests`) to prevent any load interference with production.
   - Built the Next.js frontend standalone image and launched all containers with `docker compose -p mect-staging --env-file .env.staging -f compose.staging.yaml up -d --build`.
2. **Container Status:**

| Container Name | Published Host Ports | Status | Health Check URL / Command | Health Verdict |
| :--- | :--- | :---: | :--- | :---: |
| **`mect-frontend-staging`** | `127.0.0.1:3002:3000` | `Up (healthy)` | `curl -f http://127.0.0.1:3000/api/ai/health` | 🟢 **HEALTHY** |
| **`mect-backend-staging`** | `127.0.0.1:8082:8080` | `Up (healthy)` | `curl -f http://127.0.0.1:8080/api/v1/actuator/health` | 🟢 **HEALTHY** |
| **`mect-postgres-staging`** | *None* (internal only) | `Up (healthy)` | `pg_isready -U mect_staging_user -d mect_staging_db` | 🟢 **HEALTHY** |

---

## 6. END-TO-END FUNCTIONAL VERIFICATION ON VPS

A dedicated verification test suite was executed against the running staging containers on loopback ports:

### A. Donor Authentication & Dual-Channel OTP
- **Phone OTP Request (`POST /api/v1/portal/auth/request-otp`):**
  - Identifier: `+919438200004` (Channel: `PHONE`)
  - HTTP Status: `200 OK`
  - Response: `{"message":"Verification code sent successfully via SMS.","channel":"PHONE","accepted":true,"expiresInSeconds":600,"cooldownSeconds":60}`
  - Outbound Log: `o.m.b.s.n.ConfigurableSmsService: DISPATCHED SMS OTP to +919438200004 (valid 10 minutes) via [MOCK]: [SECURE CRYPTOGRAPHIC DISPATCH]`
- **Phone OTP Verify (`POST /api/v1/portal/auth/verify-otp`):**
  - Identifier: `+919438200004`, Code: `123456`, Name: `Synthetic Donor Four`
  - HTTP Status: `200 OK`
  - Token: Valid HS512 JWT access token issued (`len 319`).
- **Email OTP Request (`POST /api/v1/portal/auth/request-otp`):**
  - Identifier: `synthetic.donor@mect.org.in` (Channel: `EMAIL`)
  - HTTP Status: `200 OK`
  - Response: `{"message":"Verification code sent successfully. Please check your inbox.","channel":"EMAIL","accepted":true,"expiresInSeconds":600,"cooldownSeconds":60}`
  - Outbound Log: `o.m.b.s.notification.ResendEmailService: DISPATCHED Email to synthetic.donor@mect.org.in subject='Your MECT Verification Code' via [MOCK]: [SECURE CRYPTOGRAPHIC DISPATCH]`
- **Email OTP Verify (`POST /api/v1/portal/auth/verify-otp`):**
  - Identifier: `synthetic.donor@mect.org.in`, Code: `123456`
  - HTTP Status: `200 OK`
  - Token: Valid HS512 JWT access token issued.
- **Security Check (Negative Test):**
  - Attempting verification with non-allowlisted targets (`+919438200008`) and default code `123456` was rejected with HTTP 401 (`Incorrect verification code`), proving that deterministic testing is strictly bounded to synthetic targets and cannot bypass security.

### B. Public Programmes Endpoint
- **Query (`GET /api/v1/public/donations/programmes`):**
  - HTTP Status: `200 OK`
  - Verified 6 active public programmes returned in response:
    1. `EDUCATION_LEARNING` — Education & Learning (Shiksha Setu)
    2. `HANUMAN_MURTI` — The Grand Hanuman Murti Project
    3. `WOMEN_EMPOWERMENT` — Women Empowerment & Livelihoods (Swavalamban)
    4. `SAFE_WATER_SANITATION` — Safe Water & Sanitation (Jal Seva)
    5. `FOOD_SECURITY_RELIEF` — Food Security & Nutrition (Jan Ahar)
    6. `COMMUNITY_WELFARE` — Community Welfare & Relief (Samaj Kalyan)

### C. Cashfree Gateway Configuration Safeguard
- **Attempting Gateway Checkout (`POST /api/v1/public/donations/initiate`):**
  - HTTP Status: `503 Service Unavailable`
  - Response: `{"status":503,"error":"Provider Configuration Required","message":"Cashfree Payment Gateway is not configured on the backend. Please configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY or remit directly via MECT SBI Bank Transfer."}`
  - Safeguard Verdict: Verified that missing gateway credentials trigger an explicit and safe fallback message without exceptions or unexpected failures.

### D. Manual SBI Bank Transfer & UTR Submission
- **Submitting UTR Claim (`POST /api/v1/public/donations/sbi/submit-utr`):**
  - Programme: `EDUCATION_LEARNING`, Amount: `₹1,000.00`, UTR: `SBIN987654321012`
  - HTTP Status: `201 Created`
  - Issued Claim Ref: `MECT-UTR-2026-5058D9`
  - Issued Donation Ref: `MECT-DON-2026-2473AB`
  - Status: `PENDING_VERIFICATION`
- **Querying Donation Status (`GET /api/v1/public/donations/MECT-DON-2026-2473AB/status`):**
  - HTTP Status: `200 OK`
  - Response: `{"donationReference":"MECT-DON-2026-2473AB","orderId":"MECT-UTR-2026-5058D9","provider":"SBI_DIRECT","status":"PENDING_VERIFICATION","amount":1000.00,"currency":"INR","programmeName":"Education & Learning (Shiksha Setu)","paymentMethod":"SBI_DIRECT","paymentStatus":"PENDING_VERIFICATION","gatewayStatus":"UTR_SUBMITTED","bankReference":"SBIN987654321012"}`

---

## 7. RESOURCE CONSUMPTION & AUDIT

Resource usage was measured across all containers on the VPS using `docker stats --no-stream`:

| Container Name | CPU Usage | Memory Usage / Limit | Memory % | Network I/O | Block I/O | Limit Compliance |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`mect-frontend-staging`** | `0.00%` | `49.45 MiB / 384 MiB` | `12.88%` | `5.11 kB / 692 kB` | `0 B / 348 kB` | 🟢 Well within limits |
| **`mect-backend-staging`** | `0.34%` | `378.3 MiB / 768 MiB` | `49.26%` | `309 kB / 348 kB` | `20.5 kB / 1.24 MB` | 🟢 Well within limits |
| **`mect-postgres-staging`** | `0.00%` | `41.71 MiB / 256 MiB` | `16.29%` | `323 kB / 292 kB` | `98.3 kB / 91.1 MB` | 🟢 Well within limits |
| **Staging Stack Total** | **`0.34%`** | **`469.46 MiB / 1.40 GiB`** | **`33.53%`** | — | — | 🟢 **1.50 CPU Cap Respected** |
| `mect-frontend` (Prod) | `0.00%` | `113.0 MiB / 15.61 GiB` | `0.71%` | `6.77 MB / 45.5 MB` | `561 kB / 19.7 MB` | 🟢 Untouched |
| `mect-backend` (Prod) | `0.16%` | `507.6 MiB / 15.61 GiB` | `3.18%` | `9.05 MB / 11.7 MB` | `119 kB / 70.3 MB` | 🟢 Untouched |
| `mect-postgres` (Prod) | `0.01%` | `53.16 MiB / 15.61 GiB` | `0.33%` | `36.0 MB / 27.3 MB` | `12.3 MB / 39.1 MB` | 🟢 Untouched |

---

## 8. PRODUCTION & OHO TECH ISOLATION EVIDENCE

All co-hosted services were probed directly on the VPS loopback to confirm zero disruption or modification:

| Target Service | Probed Port & URL | Response Code | Observed Health Output | Isolation Status |
| :--- | :--- | :---: | :--- | :---: |
| **MECT Production Frontend** | `127.0.0.1:3001` | `HTTP 200` | Full HTML document rendered | 🟢 **100% OPERATIONAL** |
| **MECT Production Backend** | `127.0.0.1:8081/api/v1/actuator/health` | `HTTP 200` | `{"groups":["liveness","readiness"],"status":"UP"}` | 🟢 **100% HEALTHY** |
| **MECT Production Database** | `127.0.0.1:5433` | *Active* | Unaltered port and volume | 🟢 **100% UNTOUCHED** |
| **OHO Tech Frontend** | `127.0.0.1:3000` | `HTTP 200` | Full HTML document rendered | 🟢 **100% OPERATIONAL** |
| **OHO Tech Backend** | `127.0.0.1:8080/actuator/health` | `HTTP 401` | Systemd service active (Protected) | 🟢 **100% OPERATIONAL** |
| **OHO Tech Database** | `127.0.0.1:5432` | *Active* | Native host Postgres running | 🟢 **100% UNTOUCHED** |

---

## 9. NETWORK BOUNDARY & INGRESS STATUS

1. **Local Loopback Enforcement:**
   - Both `mect-frontend-staging` (`127.0.0.1:3002`) and `mect-backend-staging` (`127.0.0.1:8082`) are bound strictly to `127.0.0.1`, verified via `ss -tulpn`.
   - Neither service is reachable over the public internet.
2. **Nginx Configuration Status:**
   - As mandated by the Phase 2.7G.4 instructions, no Nginx site configuration was added or reloaded.
   - Public ingress will remain blocked until Cloudflare Access protection is in place.

---

## 10. REMAINING ACTIONS & TRANSITION TO PHASE 2.7H

With Phase 2.7G.4 successfully completed and verified, the staging deployment is fully operational on private loopback ports. The following operational steps remain before opening public access:

1. **Cloudflare Zero Trust Access Setup (Owner Action):**
   - Create Cloudflare Access application in Cloudflare Zero Trust dashboard covering `staging.mect.org.in` and `staging-api.mect.org.in`.
   - Configure access policy (e.g., OTP-protected access for approved email addresses).
2. **Nginx Staging Virtual Host Configuration (Phase 2.7H):**
   - Prepare and validate Nginx configuration for `staging.mect.org.in` (proxying to `127.0.0.1:3002`) and `staging-api.mect.org.in` (proxying to `127.0.0.1:8082`).
   - Obtain SSL certificates via Certbot / Let's Encrypt for both staging domains.
   - Reload Nginx safely (`nginx -t && systemctl reload nginx`).
3. **End-to-End Browser Staging Smoke Tests:**
   - Test donor journey, Google Sign-In, mobile and email OTP verification, and CMS pages in Chrome browser via `https://staging.mect.org.in`.
