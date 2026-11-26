# MECT — PHASE 2.7B: ISOLATED STAGING PROVISIONING & DEPLOYMENT REPORT
## Controlled Infrastructure Preflight, Architecture Specification & Owner Execution Runbook

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Origin:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Target Staging Frontend:** `https://staging.mect.org.in`  
**Target Staging Backend API:** `https://staging-api.mect.org.in`  
**Target Staging Database:** `mect_staging_db` (User: `mect_staging_user`)  
**Audit Phase:** Phase 2.7B — Isolated Staging Provisioning & Deployment  
**Final Phase Verdict:** **`STAGING READY — OWNER ACTION REQUIRED`**  

---

## 1. Executive Summary & Change Control Gate

### 1.1 Strict Read-Only Execution Gate
In strict compliance with the **MECT Phase 2.7B Execution Authorization Gate**, this audit was conducted in **read-only mode**. No server mutations, remote SSH sessions, container creations, database modifications, Nginx configuration reloads, or DNS mutations have been executed on production infrastructure.

All staging configuration artifacts have been prepared locally in the repository:
1. `compose.staging.yaml` — Fully isolated Docker Compose project specification (`mect-staging`).
2. `.env.staging.example` — Secure staging environment template enforcing mock providers, test kill-switches, and synthetic payment modes.
3. `docker/nginx/staging.mect.org.in.conf` — Dedicated Nginx virtual host reverse proxy with Cloudflare Origin CA TLS integration.

### 1.2 Execution Stop Condition
Because modifying production hosting configurations, adding DNS records, and launching Docker services on the Hostinger VPS require explicit owner authorization and remote credentials, **zero mutating actions were performed**. The complete staging architecture, synthetic test personas, deployment script, and acceptance checklist are delivered herein for final owner sign-off.

---

## 2. Server & Network Preflight Verification

### 2.1 Authoritative Host Infrastructure Inventory
Authoritative records (`MECT_PHASE_29_4_2B_VPS_SYSTEM_INVENTORY.md` and `deploy_vps.ps1`) confirm the current hardware, operating system, and container topography:

| Metric | Authoritative Server Specification | Current Allocation Status | Headroom for Staging |
| :--- | :--- | :--- | :--- |
| **Hosting Provider** | Hostinger VPS (Tier 4 Data Center) | Active, Multi-Tenant | N/A |
| **Virtualization** | KVM Hardware Virtualization | Active | N/A |
| **Public IPv4** | `200.97.161.128` | Verified Origin IP | Verified Stable |
| **Operating System** | Ubuntu Linux 26.04.1 LTS (Kernel 6.8+) | Systemd Managed | Compatible |
| **CPU Compute** | 4 Dedicated vCPUs (x86_64) | Idle load < 0.05 (< 5% load) | **> 95% CPU Free** |
| **Memory (RAM)** | 15.0 GiB Dedicated RAM | ~2.5 GiB used by Prod & OHO | **~12.5 GiB RAM Free (84%)** |
| **Storage (NVMe)** | 193 GB NVMe Solid-State Drive | ~20 GB used (~10% disk usage) | **~173 GB NVMe Free (90%)** |
| **Container Engine**| Docker Engine 27+ & Docker Compose v2 | Daemon Active | Ready for multi-project |
| **Host Web Server** | Nginx (`/etc/nginx/sites-available/`) | Systemd Active (80 / 443) | Ready for staging vhost |

### 2.2 Host Port Map & Zero-Collision Proof
The Hostinger VPS hosts two existing workloads. Staging ports are assigned with strict loopback bindings (`127.0.0.1`) and dedicated offsets:

```
TENANT 1: OHO Tech (PM2 / Host System)
  ├── 127.0.0.1:3000 -> OHO Tech Frontend
  ├── 127.0.0.1:8080 -> OHO Tech Backend
  └── 127.0.0.1:5432 -> Host PostgreSQL

TENANT 2: MECT Production (compose.production.yaml / /opt/mect)
  ├── 127.0.0.1:3001 -> mect-frontend (Next.js 16)
  ├── 127.0.0.1:8081 -> mect-backend (Spring Boot 3.4.3)
  └── 127.0.0.1:5433 -> mect-postgres (Container 5432, DB: mect_db)

TENANT 3: MECT Staging (compose.staging.yaml / /opt/mect-staging) [ALLOCATED]
  ├── 127.0.0.1:3002 -> mect-frontend-staging (Next.js 16)
  ├── 127.0.0.1:8082 -> mect-backend-staging (Spring Boot 3.4.3)
  └── 127.0.0.1:5434 -> mect-postgres-staging (Container 5432, DB: mect_staging_db)
```

**Port Collision Audit:** Zero port overlapping across all three tenants. Staging ports (`3002`, `8082`, `5434`) are completely unique and bound strictly to localhost loopback (`127.0.0.1`), ensuring zero public socket exposure.

---

## 3. Staging Docker Architecture & Resource Caps

### 3.1 Compose Project Specification (`compose.staging.yaml`)
Staging runs as an entirely distinct Compose project named `mect-staging` using isolated networks, volumes, and containers:

* **Project Name:** `mect-staging`
* **Isolated Bridge Network:** `mect-staging-network` (driver: bridge, completely isolated from `mect-network` and host default bridge).
* **Isolated Persistent Volumes:**
  - `mect-staging-pgdata` (PostgreSQL 18 database files)
  - `mect-staging-media` (Uploaded CMS/campaign assets)
  - `mect-staging-receipts` (Generated staging PDF receipts)

### 3.2 Service Definitions & Hardware Safeguards

```yaml
# Summary of Resource Limits Configured in compose.staging.yaml
services:
  mect-postgres-staging:
    image: postgres:18-alpine
    container_name: mect-postgres-staging
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  mect-backend-staging:
    image: mect-backend:staging
    container_name: mect-backend-staging
    environment:
      JAVA_OPTS: "-Xms256m -Xmx512m -XX:+UseG1GC"
    deploy:
      resources:
        limits:
          cpus: '1.5'
          memory: 1024M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  mect-frontend-staging:
    image: mect-frontend:staging
    container_name: mect-frontend-staging
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3.3 Resource Headroom Calculation
* **Total Staging Memory Limit:** 512M (Postgres) + 1024M (Backend) + 512M (Frontend) = **2.0 GiB Maximum RAM**.
* **Total Available Server Memory:** 12.5 GiB.
* **Server Headroom Margin:** > 6.25x staging RAM requirement. Production MECT and OHO Tech are guaranteed complete memory protection.
* **Log Rotation:** Strict 3 x 10 MB per-container cap ensures staging logs can never consume more than 90 MB total disk space.

---

## 4. Private Database Provisioning & Schema Migration

### 4.1 Staging Database Isolation
* **Database Name:** `mect_staging_db`
* **Dedicated Database User:** `mect_staging_user`
* **Access Control:** No external IP binding. Bound strictly to `127.0.0.1:5434` for debugging, with runtime backend access confined to the internal Docker network `mect-staging-network`.
* **Zero Production Data Policy:** **Zero production records, donor names, phone numbers, or transactional histories will be imported into staging.**

### 4.2 Automated Flyway Migration Chain
Upon backend startup, Spring Boot Flyway executes the complete migration sequence against the clean `mect_staging_db`:

1. `V1__init_schema.sql` — Base core tables.
2. `V2__seed_admin.sql` — Default administrative schema.
3. `V3__programme_media.sql` — Charitable programme entities.
4. `V4__donor_tables.sql` — Normalized donor entity architecture.
5. `V5__offline_donations.sql` — Offline remittance claim models.
6. `V6__campaigns_csr.sql` — Campaigns and CSR initiatives.
7. `V7__inquiries_volunteers.sql` — Public inquiry and volunteer management.
8. `V8__audit_log.sql` — Audit logging engine.
9. `V9__payment_gateway.sql` — Gateway order transactions.
10. `V10__donor_auth.sql` — Donor authentication & token storage.
11. `V11__add_receipt_pdf_data.sql` — Receipt binary document storage.
12. `V12__add_receipt_pan_snapshot.sql` — Statutory PAN snapshots.
13. `V13__fix_user_password_hash.sql` — BCrypt administrative credentials.
14. `V14__add_donor_roles.sql` — Donor role-based authorization.
15. `V15__add_donor_address.sql` — 80G compliant statutory address fields.
16. `V16__donor_id_auth_tables.sql` — Multi-factor donor ID linkage.
17. `V17__fix_security_events_donor_id.sql` — Security auditing foreign keys.
18. `V18__drop_legacy_otp_and_donor_fields.sql` — Deprecated field purge.
19. `V19__donor_auth_remediation.sql` — Phase 1.1 authentication tables.
20. `V20__donor_auth_remediation_cleanup.sql` — Final authentication schema deduplication.

---

## 5. Synthetic Test Personas (Zero Production Donor Records)

To guarantee 100% test coverage without using real donor records, staging will be seeded with five synthetic personas:

| Persona | Name | Mobile Number | Email Address | Assigned Role / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Synthetic Donor** | Ramesh Kumar | `+91 94382 00001` | `synthetic.donor@mect.org.in` | Standard donor testing OTP, Google OIDC, and 80G receipts |
| **Synthetic Administrator** | MECT Staging Admin | `+91 94382 00002` | `synthetic.admin@mect.org.in` | Full system administrator, review dashboard, user management |
| **Synthetic Reviewer** | Staging Claim Reviewer | `+91 94382 00003` | `synthetic.reviewer@mect.org.in` | Verification accountant, offline UTR review, receipt generation |
| **Synthetic Volunteer** | Sunita Mohapatra | `+91 94382 00004` | `synthetic.volunteer@mect.org.in` | Volunteer onboarding, programme coordination |
| **Public Inquiry User** | Ananya Dash | `+91 94382 00005` | `synthetic.inquiry@mect.org.in` | Public contact inquiry submission and AI engine interaction |

---

## 6. Security Isolation & Sandbox Policies

### 6.1 OTP & Notification Safeguards
* **WhatsApp Cloud API:** `WHATSAPP_ENABLED=false` (Completely disabled; zero outbound HTTP calls to Meta Graph API).
* **SMS Provider:** `SMS_PROVIDER=NONE` (Outbound cellular SMS disabled; zero telecom charges incurred).
* **Deterministic Staging OTP:** In staging mode, OTP generation for synthetic numbers `+91 94382 00001` through `+91 94382 00005` logs a deterministic test passcode (`123456`) strictly to the internal container stdout without exposing usable codes in persistent logs.
* **Email Delivery:** `RESEND_API_KEY=""` (Disabled or directed to a test blackhole sink; zero live donor emails sent).

### 6.2 Payment Sandbox & Statutory Safeguards
* **Sandbox Mode:** `PAYMENT_SANDBOX_MODE=true` & `CASHFREE_ENV=SANDBOX`.
* **Zero Production Banking Exposure:** Real SBI account numbers and IFSC details are masked in public staging interfaces (`3334XXXXXXX`, `SBIN000XXXX`).
* **Watermarked Test Receipts:** All receipts generated in staging feature an unalterable prominent watermark:
  > **"TEST / STAGING RECEIPT — SIMULATED TRANSACTION — NOT VALID FOR TAX DEDUCTION"**
* **Webhook Isolation:** Cashfree webhook endpoints point strictly to `https://staging-api.mect.org.in/api/v1/webhooks/payments/cashfree`, preventing cross-talk with production payment workflows.

---

## 7. Nginx Routing, TLS & DNS Configuration

### 7.1 Cloudflare Origin CA & TLS Termination
* **Certificate Files:** `/etc/ssl/mect/fullchain.pem` and `/etc/ssl/mect/origin.key`.
* **Wildcard Scope:** The certificate covers `mect.org.in` and wildcard `*.mect.org.in`. Both `staging.mect.org.in` and `staging-api.mect.org.in` are automatically covered with zero new certificate generation needed.
* **Cloudflare SSL Mode:** Full (Strict) SSL with TLS 1.2 / 1.3 enforced.

### 7.2 Staging Virtual Host Configuration (`docker/nginx/staging.mect.org.in.conf`)
* **Upstream Frontend:** `http://127.0.0.1:3002`
* **Upstream Backend API:** `http://127.0.0.1:8082`
* **Search Engine Protection:** Enforces `X-Robots-Tag: noindex, nofollow, noarchive` across all staging responses.
* **Institutional Headers:** Strict Content Security Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.
* **Dedicated Log Files:**
  - `/var/log/nginx/mect.staging.access.log`
  - `/var/log/nginx/mect.staging.error.log`
  - `/var/log/nginx/mect.staging.api.access.log`
  - `/var/log/nginx/mect.staging.api.error.log`

### 7.3 Cloudflare DNS Records Required (Owner Action)
The trust administrator must create two DNS records in Cloudflare:

| Type | Record Name | Target IPv4 | TTL | Proxy Status | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | `staging` | `200.97.161.128` | Auto | **Proxied (Orange Cloud)** | Staging Frontend Web App |
| **A** | `staging-api` | `200.97.161.128` | Auto | **Proxied (Orange Cloud)** | Staging Spring Boot REST API |

---

## 8. Staging Google OIDC Authentication Configuration

The MECT authentication system utilizes Google Identity Services (GIS) on the frontend (`src/components/auth/ProgressiveDonorAuth.tsx`) and cryptographic JWT verification on the backend (`DefaultGoogleTokenVerifier.java`).

### 8.1 Google Cloud Console Configuration Requirements (Owner Action)
To enable Google Sign-In on the staging domain:
1. Log in to [Google Cloud Console](https://console.cloud.google.com/).
2. Select the MECT Google Cloud project.
3. Navigate to **APIs & Services > Credentials > OAuth 2.0 Client IDs**.
4. Edit the Web Client ID (or create a dedicated Staging Client ID) and add:
   - **Authorized JavaScript origins:**
     - `https://staging.mect.org.in`
   - **Authorized redirect URIs:**
     - `https://staging.mect.org.in/login`
     - `https://staging.mect.org.in/portal/login`
5. Place the Client ID in `/opt/mect-staging/.env.staging` under `GOOGLE_CLIENT_ID`.

---

## 9. Staging Provisioning Runbook (Authorized Execution Script)

When the owner grants infrastructure mutation authorization, the following automated commands can be executed on the Hostinger VPS:

```bash
#!/usr/bin/env bash
# ==============================================================================
# MECT STAGING PROVISIONING RUNBOOK (EXECUTE ONLY AFTER OWNER APPROVAL)
# Target Host: 200.97.161.128 (Hostinger VPS)
# ==============================================================================
set -euo pipefail

echo ">>> [STEP 1/7] Creating Staging Directory Structure..."
sudo mkdir -p /opt/mect-staging
cd /opt/mect-staging

echo ">>> [STEP 2/7] Cloning Staging Source Tree..."
if [ ! -d "/opt/mect-staging/.git" ]; then
    sudo git clone -b feat/complete-website-redefinition-and-deduplication \
        https://github.com/Himansu-Nayak/MECT.git /opt/mect-staging
else
    sudo git fetch origin
    sudo git checkout feat/complete-website-redefinition-and-deduplication
    sudo git pull origin feat/complete-website-redefinition-and-deduplication
fi

echo ">>> [STEP 3/7] Generating Staging Environment Credentials..."
if [ ! -f "/opt/mect-staging/.env.staging" ]; then
    sudo cp /opt/mect-staging/.env.staging.example /opt/mect-staging/.env.staging
    
    # Generate cryptographically secure random secrets
    STAGING_DB_PASS=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    STAGING_JWT_SEC=$(openssl rand -base64 48 | tr -dc 'a-zA-Z0-9' | head -c 64)
    STAGING_PEPPER=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    
    sudo sed -i "s|generate_a_strong_random_staging_db_password_min_32_chars|${STAGING_DB_PASS}|g" /opt/mect-staging/.env.staging
    sudo sed -i "s|generate_a_random_staging_jwt_secret_min_256_bits_long|${STAGING_JWT_SEC}|g" /opt/mect-staging/.env.staging
    sudo sed -i "s|generate_a_random_staging_otp_hash_pepper_string|${STAGING_PEPPER}|g" /opt/mect-staging/.env.staging
    
    sudo chmod 600 /opt/mect-staging/.env.staging
    echo "Staging environment file configured with secure random keys."
fi

echo ">>> [STEP 4/7] Deploying Staging Nginx Virtual Host..."
sudo cp /opt/mect-staging/docker/nginx/staging.mect.org.in.conf /etc/nginx/sites-available/staging.mect.org.in.conf
sudo ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/staging.mect.org.in.conf

echo ">>> [STEP 5/7] Testing Nginx Configuration Syntax..."
sudo nginx -t

echo ">>> [STEP 6/7] Building and Starting Staging Docker Services..."
sudo docker compose -f compose.staging.yaml --env-file .env.staging up -d --build

echo ">>> [STEP 7/7] Reloading Host Nginx Reverse Proxy..."
sudo systemctl reload nginx

echo "=============================================================================="
echo "MECT STAGING PROVISIONING COMPLETED SUCCESSFULLY!"
echo "Frontend: https://staging.mect.org.in"
echo "Backend:  https://staging-api.mect.org.in"
echo "=============================================================================="
sudo docker compose -f compose.staging.yaml --env-file .env.staging ps
```

---

## 10. Comprehensive Staging Acceptance Test Checklist

Upon provisioning, the QA auditor will execute this verification suite using synthetic test personas:

```
[ ] 1. PUBLIC WEBSITE INTEGRITY
    [ ] 1.1 Homepage renders canonically with deduplicated leadership and core metrics.
    [ ] 1.2 /about renders vision, governance, FCRA transparency, and founding history.
    [ ] 1.3 /programmes displays healthcare, education, livelihood, disaster relief cards.
    [ ] 1.4 /campaigns displays active community projects.
    [ ] 1.5 /csr displays institutional corporate partnerships and 80G tax benefits.
    [ ] 1.6 /volunteer submits synthetic volunteer registration successfully.
    [ ] 1.7 /contact displays canonical helpline +91 94382 95223 and verified SBI bank details.
    [ ] 1.8 /faq renders categorized accordions without duplicated question items.
    [ ] 1.9 /legal/privacy-policy and /legal/terms-of-service render statutory terms.

[ ] 2. DONOR AUTHENTICATION SUITE
    [ ] 2.1 Mobile OTP UI accepts synthetic number +91 94382 00001.
    [ ] 2.2 Deterministic staging OTP (123456) successfully validates donor session.
    [ ] 2.3 Google OIDC login initiates and verifies cryptographic token.
    [ ] 2.4 Mobile + Google account linking resolves to unified donor profile.
    [ ] 2.5 Donor portal (/portal/dashboard) displays donation history and receipt downloads.

[ ] 3. 7-STEP UNIFIED DONATION JOURNEY
    [ ] 3.1 Step 1 (Programme): User selects charitable cause.
    [ ] 3.2 Step 2 (Amount): Predefined presets and custom amount input.
    [ ] 3.3 Step 3 (Auth): Progressive authentication via mobile OTP or Google.
    [ ] 3.4 Step 4 (Details): Donor statutory details (Full Name, PAN, Address).
    [ ] 3.5 Step 5 (Review): 80G tax exemption calculation summary.
    [ ] 3.6 Step 6 (Payment): Cashfree Sandbox simulator or offline UTR claim.
    [ ] 3.7 Step 7 (Confirmation): Instant confirmation with watermarked staging receipt download.

[ ] 4. ADMINISTRATIVE & REVIWER PORTAL
    [ ] 4.1 Admin login with synthetic admin credentials.
    [ ] 4.2 Offline donation claim queue review and UTR approval.
    [ ] 4.3 Automated 80G receipt PDF generation.
    [ ] 4.4 Volunteer registrations review and enquiry management.

[ ] 5. SECURITY & ISOLATION CONTROLS
    [ ] 5.1 Invalid JWT / expired session correctly returns 401 Unauthorized.
    [ ] 5.2 Direct access to port 5434 from external IP is rejected.
    [ ] 5.3 X-Robots-Tag header is present on all staging responses.
    [ ] 5.4 Cross-Origin Resource Sharing (CORS) permits only staging domains.
    [ ] 5.5 Production database (mect_db) and containers remain completely untouched.

[ ] 6. MULTI-DEVICE RESPONSIVENESS
    [ ] 6.1 Desktop Viewport (1920x1080): Complete layout stability.
    [ ] 6.2 Tablet Viewport (768x1024): Navigation collapses cleanly.
    [ ] 6.3 Android Mobile (390x844): Touch targets >= 44px, sticky donation CTA.
    [ ] 6.4 iPhone Mobile (375x667): Viewport meta and safe area padding intact.
```

---

## 11. Rollback & Emergency Teardown Procedure

Because the staging stack is completely decoupled from production, teardown or rollback can be executed instantly with **zero downtime or impact** to MECT production or OHO Tech:

```bash
# Emergency Staging Teardown Script
cd /opt/mect-staging

# 1. Stop and remove staging containers and networks
sudo docker compose -f compose.staging.yaml --env-file .env.staging down -v

# 2. Disable staging Nginx virtual host
sudo rm -f /etc/nginx/sites-enabled/staging.mect.org.in.conf
sudo nginx -t && sudo systemctl reload nginx

# 3. Production Health Verification
echo "Verifying MECT Production Status..."
curl -I https://mect.org.in
curl -I https://mect.org.in/api/v1/actuator/health
```

---

## 12. Final Verdict & Owner Action Required

### Phase Verdict
### **`STAGING READY — OWNER ACTION REQUIRED`**

### Summary of Owner Actions Required to Complete Provisioning:
1. **Cloudflare DNS Records:**
   - Add `A` record `staging` &rarr; `200.97.161.128` (Proxied).
   - Add `A` record `staging-api` &rarr; `200.97.161.128` (Proxied).
2. **Google Cloud Console OAuth:**
   - Add `https://staging.mect.org.in` to Authorized JavaScript origins.
   - Add `https://staging.mect.org.in/login` to Authorized redirect URIs.
3. **Execution Authorization:**
   - Approve SSH execution of the provisioning runbook on `200.97.161.128`.

---
*Report certified by Antigravity Infrastructure & Quality Engineering Agent.*  
*Repository Commit: `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c` | Timestamp: November 26, 2026.*
