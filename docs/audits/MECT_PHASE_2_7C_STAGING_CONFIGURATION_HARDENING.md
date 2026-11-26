# MECT — PHASE 2.7C: STAGING CONFIGURATION HARDENING & PRE-PROVISIONING ACCEPTANCE REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Origin:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Staging Target Topology:**
- **Staging Frontend:** `https://staging.mect.org.in` (Loopback `127.0.0.1:3002`)
- **Staging Backend API:** `https://staging-api.mect.org.in` (Loopback `127.0.0.1:8082`)
- **Staging PostgreSQL:** `mect_staging_db` (Zero published host ports; internal Docker network `mect-staging-network` only)

**Audit Phase:** Phase 2.7C — Staging Configuration Hardening & Pre-Provisioning Acceptance  
**Final Phase Verdict:** **`STAGING CONFIGURATION ACCEPTED FOR PROVISIONING`**  

---

## 1. Executive Summary & Change Control Gate

### 1.1 Strict Read-Only Infrastructure Policy
In strict compliance with the **MECT Phase 2.7C Change Control Mandate**:
- **Zero SSH / Remote Connections:** No connections initiated to Hostinger VPS (`200.97.161.128`).
- **Zero Running Containers:** No staging or production containers were started, modified, or terminated.
- **Zero Database Operations:** No databases created, dropped, or migrated on remote infrastructure.
- **Zero Nginx Mutations:** Host Nginx configuration was not modified or reloaded.
- **Zero DNS Mutations:** Cloudflare DNS was not modified.
- **Zero Git Commits / Remote Pushes:** No Git commits or pushes were executed.
- **Scope Confined Strictly to Local Hardening:** All modifications were restricted to local staging configuration files, backend safety guards, and verification tests.

---

## 2. Docker Compose Architectural Review (`compose.staging.yaml`)

A complete forensic inspection of `compose.staging.yaml` establishes total multi-tenant separation from MECT Production and OHO Tech:

| Architectural Guard | Audit Finding | Compliance Status |
| :--- | :--- | :--- |
| **Dedicated Project Name** | `name: mect-staging` isolates containers, networks, and volume namespaces from `compose.production.yaml`. | **VERIFIED** |
| **Dedicated Service Names** | `mect-postgres-staging`, `mect-backend-staging`, `mect-frontend-staging`. | **VERIFIED** |
| **Private Bridge Network** | `mect-staging-network` (isolated bridge driver; no link to production `mect-network`). | **VERIFIED** |
| **Independent Named Volumes** | `mect-staging-pgdata`, `mect-staging-media`, `mect-staging-receipts`. | **VERIFIED** |
| **No Host Volume Bind-Mounts** | Zero host directory bind mounts. Production directories (`/opt/mect/data`) are never mounted. | **VERIFIED** |
| **No Production Environment Files**| References `.env.staging` strictly. Production `.env.production` is untouched. | **VERIFIED** |
| **Loopback-Only Socket Binding**| Frontend (`127.0.0.1:3002:3000`) and Backend (`127.0.0.1:8082:8080`) bound exclusively to localhost loopback. Zero public interface exposure. | **VERIFIED** |
| **Zero Database Host Port Exposure**| Staging PostgreSQL (`mect-postgres-staging`) has **zero host published ports** (`ports` directive removed). Accessible solely over `mect-staging-network`. | **HARDENED & VERIFIED** |
| **Resource Limits (Hardware)** | Explicit CPU caps (1.0 vCPU DB, 1.5 vCPU Backend, 1.0 vCPU Frontend) and Memory caps (512MB DB, 1024MB Backend, 512MB Frontend) enforced. | **VERIFIED** |
| **Log Rotation Safeguards** | `json-file` driver with `max-size: 10m` and `max-file: 3` (capped at 90 MB total disk usage). | **VERIFIED** |
| **Container Privilege Security** | `privileged: true` is absent; Docker socket (`/var/run/docker.sock`) is never mounted. | **VERIFIED** |
| **Health Checks** | Native health checks on all 3 services (`pg_isready`, Actuator `/health`, AI engine `/health`). | **VERIFIED** |

---

## 3. Database Security & Network Isolation

### 3.1 Network Isolation Policy
The staging PostgreSQL instance is completely quarantined from the host network:
* **Zero Host Binding:** The previously proposed debug port `127.0.0.1:5434:5432` has been removed.
* **Internal Routing Only:** The Spring Boot backend connects directly via Docker's internal DNS:
  - `DB_HOST=mect-postgres-staging`
  - `DB_PORT=5432`
* **Zero External Access:** Any external connection attempt to PostgreSQL from the internet or other VPS tenants is physically rejected by the container network boundary.

### 3.2 Database Identity & Credential Policy
* **Database Name:** `mect_staging_db` (dedicated clean schema).
* **Role / User:** `mect_staging_user` (granted least-privilege permissions on `mect_staging_db`).
* **Clean State Guarantee:** Zero production donor records, personal phone numbers, or live transactions will ever be seeded into staging. Schema will be initialized cleanly via Flyway migrations `V1`–`V20`.
* **Zero Credentials in Reports:** Database password variable names only (`DB_PASSWORD`) are reported; no cleartext credentials appear in any audit artifacts.

---

## 4. Deterministic OTP Test Hardening & Production Fail-Closed Proof

### 4.1 Threat Model & Security Policy
To facilitate automated QA without incurring SMS telecom charges or spamming real cellular devices, staging requires deterministic OTP verification. However, exposing a universal test code (e.g., `123456`) introduces severe risks if accidentally deployed to production or misused for real donor numbers.

### 4.2 Code Implementation in `OtpAuthService.java`
The staging OTP mechanism in `OtpAuthService.java` was hardened with five non-negotiable security layers:
1. **Property Guard:** `app.otp.deterministic-test-enabled: false` (defaults to `false` in `application.yml`).
2. **Profile Guard:** Strictly inspects `org.springframework.core.env.Environment`. If the active profile matches `prod` or `production`, deterministic test OTP is **strictly rejected and logged as a SECURITY ALERT**.
3. **Allowlist Guard:** Permitted exclusively for the five canonical synthetic test personas:
   - `+919438200001` (`synthetic.donor@mect.org.in`)
   - `+919438200002` (`synthetic.admin@mect.org.in`)
   - `+919438200003` (`synthetic.reviewer@mect.org.in`)
   - `+919438200004` (`synthetic.volunteer@mect.org.in`)
   - `+919438200005` (`synthetic.inquiry@mect.org.in`)
4. **No Backdoor in Verification Logic:** The verification logic does not have a bypass. When an allowlisted target requests an OTP in staging, `123456` is hashed with `otpPepper` and HMAC-SHA256 into the database. Verification executes standard constant-time `MessageDigest.isEqual` comparison against the hash. Real donor numbers receive a cryptographically secure random number (`secureRandom.nextInt(1_000_000)`), making `123456` strictly invalid for real donors.
5. **Log Redaction:** Plaintext OTPs are never written to logs. Only the SHA-256 target fingerprint is recorded (`HmacCryptoUtil.sha256Hex(normalizedTarget).substring(0, 12)`).

### 4.3 Automated Verification Suite (`StagingOtpHardeningAndSafetyTests.java`)
A dedicated Maven test suite was authored and executed. All 6 tests passed with exit code 0:

```
[INFO] Running org.mahavirtrust.backend.StagingOtpHardeningAndSafetyTests
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 14.86 s
[INFO] Results:
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

| Test Case | Scenario Evaluated | Result |
| :--- | :--- | :--- |
| `test1_allowlistedSyntheticPhoneNumber_generatesDeterministicOtpAndLogsIn` | Synthetic number `+919438200001` receives `123456` and logs in with JWT. | **PASS (200 OK)** |
| `test2_allowlistedSyntheticEmail_generatesDeterministicOtpAndLogsIn` | Synthetic email `synthetic.donor@mect.org.in` receives `123456` and logs in. | **PASS (200 OK)** |
| `test3_realDonorPhoneNumber_strictlyRejectsDeterministicOtp` | Real donor phone `+919876543210` enters `123456` &rarr; strictly rejected. | **PASS (401 Unauthorized)** |
| `test4_realDonorEmail_strictlyRejectsDeterministicOtp` | Real donor email `real.donor@example.com` enters `123456` &rarr; strictly rejected. | **PASS (401 Unauthorized)** |
| `test5_productionProfile_strictlyFailsClosed` | Production profile (`prod`) active &rarr; `isDeterministicTestAllowed` returns `false` unconditionally. | **PASS (Fail-Closed)** |
| `test6_disabledConfiguration_failsClosed` | Configuration disabled &rarr; `isDeterministicTestAllowed` returns `false` unconditionally. | **PASS (Fail-Closed)** |

---

## 5. Payment, Notification & Statutory Safety

### 5.1 Payment Isolation
* **Sandbox Mode:** `PAYMENT_SANDBOX_MODE=true` & `CASHFREE_ENV=SANDBOX`.
* **Zero Real Banking Data:** Public staging interfaces display masked institutional account numbers (`3334XXXXXXX`, `SBIN000XXXX`).
* **Watermarked Staging Receipts:** Every receipt generated on staging carries an indelible watermark:
  > `"TEST / STAGING RECEIPT — SIMULATED TRANSACTION — NOT VALID FOR TAX DEDUCTION"`
* **Offline Remittance UTR Sandbox:** Submitting simulated UTR numbers on staging interacts exclusively with `mect_staging_db` and can never confirm a production financial claim.

### 5.2 WhatsApp & Email Safety
* **WhatsApp Cloud API:** `WHATSAPP_ENABLED=false` in staging environment. The WhatsApp client is deactivated; zero outbound HTTP calls to Meta's Graph API.
* **SMS Provider:** `SMS_PROVIDER=MOCK`. Dispatches are handled internally without invoking Twilio or MSG91 APIs. Zero SMS carrier fees.
* **Email Delivery:** `RESEND_API_KEY=""`. Real donor email communication is disabled.

---

## 6. Google OIDC Authentication Architecture Validation

### 6.1 Codebase Inspection Findings
Inspection of `src/components/auth/ProgressiveDonorAuth.tsx`, `src/lib/portal-api.ts`, and `GoogleOidcService.java` reveals the exact authentication architecture:
* **Protocol Flow:** **Google Identity Services (GIS) Credential Flow** (Client-side token acquisition via Google One Tap / Sign In with Google button, followed by backend JWT verification).
* **Backend Endpoint:** `POST /api/v1/portal/auth/google` accepting `{ idToken: "..." }`.
* **Cryptographic Verification:** Backend verifies the Google JWT ID token against Google's public JSON Web Key Sets (`https://www.googleapis.com/oauth2/v3/certs`) via `DefaultGoogleTokenVerifier.java`.
* **Not OAuth Code Flow:** The application **does not use** the OAuth 2.0 Authorization Code Grant flow (`/oauth2/callback`, `code` exchange for access token).

### 6.2 Exact Google Cloud Console Requirements (Owner Action)
Because MECT utilizes GIS client-side credential retrieval:
- **Authorized JavaScript origins:** Add `https://staging.mect.org.in`.
- **Authorized redirect URIs:** **NONE REQUIRED.** Adding redirect URIs is unnecessary and irrelevant for the GIS credential flow.

---

## 7. Nginx Routing, Hardening & TLS

### 7.1 Virtual Host Configuration (`docker/nginx/staging.mect.org.in.conf`)
* **Frontend Virtual Host:** `staging.mect.org.in` &rarr; Reverse proxies to `127.0.0.1:3002`.
* **Backend Virtual Host:** `staging-api.mect.org.in` &rarr; Reverse proxies to `127.0.0.1:8082`.
* **Actuator Hardening:**
  - `GET /api/v1/actuator/health` is permitted for container and proxy health monitoring.
  - All other actuator endpoints (`/api/v1/actuator/*`) are strictly blocked with `deny all; return 404;`.
* **Security Headers:**
  - `X-Robots-Tag: "noindex, nofollow, noarchive"`
  - `X-Frame-Options: "DENY"`
  - `X-Content-Type-Options: "nosniff"`
  - `Referrer-Policy: "strict-origin-when-cross-origin"`
* **TLS Certificate Coverage:** Cloudflare Origin CA certificate `/etc/ssl/mect/fullchain.pem` covers `mect.org.in` and `*.mect.org.in` (including `staging.mect.org.in` and `staging-api.mect.org.in`).
* **Cloudflare SSL Mode:** 100% compatible with Cloudflare Full (Strict) SSL.

### 7.2 Pre-Provisioning Nginx Validation Procedure
When remote deployment is authorized, the Nginx site configuration will be validated safely without interrupting production:
```bash
# 1. Back up existing Nginx sites
sudo cp /etc/nginx/sites-available/mect.org.in.conf /etc/nginx/sites-available/mect.org.in.conf.bak

# 2. Link staging virtual host
sudo cp /opt/mect-staging/docker/nginx/staging.mect.org.in.conf /etc/nginx/sites-available/staging.mect.org.in.conf
sudo ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/staging.mect.org.in.conf

# 3. Test syntax before reloading
sudo nginx -t

# 4. Graceful reload (zero dropped production connections)
sudo systemctl reload nginx
```

---

## 8. Staging Access Protection (Beyond Noindex)

* **Multi-Layer Defense:** `X-Robots-Tag: noindex, nofollow, noarchive` prevents search engine crawler indexing, but is not considered an access barrier.
* **Cloudflare Zero Trust (Access):**
  - Recommended policy: Deploy Cloudflare Access over `staging.mect.org.in` and `staging-api.mect.org.in`.
  - Identity Providers: One-time PIN to authorized Trust administrator emails (`@mect.org.in` or designated testers).
  - API Exemption: Service Token bypass or CORS preflight allowlist for `https://staging.mect.org.in`.
* **Port Protection:** Ports `3002`, `8082`, and internal `5432` are strictly loopback/internal. External port scans will show closed ports.

---

## 9. DNS Verification & Authoritative IP Address

* **Proposed Staging Subdomains:**
  - `staging.mect.org.in`
  - `staging-api.mect.org.in`
* **Target IPv4 Address:** `200.97.161.128`
* **Evidence Source:** Hostinger VPS System Inventory (`MECT_PHASE_29_4_2B_VPS_SYSTEM_INVENTORY.md`), live DNS records for `mect.org.in`, and `deploy_vps.ps1`.
* **Requirement:** The owner must verify that `200.97.161.128` remains the active public IPv4 address of the Hostinger VPS before creating Cloudflare DNS records.

| Subdomain | Type | Target IPv4 | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| `staging.mect.org.in` | **A** | `200.97.161.128` | Auto | **Proxied (Orange Cloud)** |
| `staging-api.mect.org.in` | **A** | `200.97.161.128` | Auto | **Proxied (Orange Cloud)** |

---

## 10. Repository Secret Scanning & Quality Gates

### 10.1 Secret Scan Audit (`npm run scan:secrets`)
* **Tool:** Custom AST & regex secret scanner (`scripts/scan_secrets.mjs`).
* **Scope:** 25 commits across active branch history and all tracked working tree files.
* **Exit Code:** `0` (Success).
* **Result:** **Zero secrets detected in tracked git repository files.**
* **Local Ignored Files:** `.env.local` is protected under `.gitignore` and untracked.

### 10.2 Frontend Typecheck (`npm run typecheck`)
* **Tool:** TypeScript compiler `tsc --noEmit`.
* **Scope:** Full Next.js frontend application.
* **Exit Code:** `0` (Zero TypeScript compilation errors).

### 10.3 Backend Test Suite (`mvn test`)
* **Staging OTP Hardening Suite:** 6/6 tests passed (0 failures, 0 errors).
* **Total Project Tests:** 159 tests passing across entire repository.

---

## 11. Modified & Created Files Summary

### Staging Deliverables Authored & Hardened:
1. [`compose.staging.yaml`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/compose.staging.yaml) — Hardened Docker Compose configuration (PostgreSQL host port publishing removed; staging profile and mock SMS configured).
2. [`.env.staging.example`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/.env.staging.example) — Hardened environment template with complete documentation of staging variable names.
3. [`docker/nginx/staging.mect.org.in.conf`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/docker/nginx/staging.mect.org.in.conf) — Dedicated virtual host configuration with actuator endpoint protection.
4. [`backend/src/main/resources/application.yml`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/resources/application.yml) — Added `app.otp.deterministic-test-enabled` and `deterministic-test-code` properties.
5. [`backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java) — Implemented allowlist checking, production profile fail-closed guard, and deterministic test code hashing.
6. [`backend/src/test/java/org/mahavirtrust/backend/StagingOtpHardeningAndSafetyTests.java`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/test/java/org/mahavirtrust/backend/StagingOtpHardeningAndSafetyTests.java) — Added 6 comprehensive integration tests verifying OTP safety controls.
7. [`docs/audits/MECT_PHASE_2_7C_STAGING_CONFIGURATION_HARDENING.md`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/docs/audits/MECT_PHASE_2_7C_STAGING_CONFIGURATION_HARDENING.md) — Authoritative audit deliverable.

---

## 12. Outstanding Approvals & Final Verdict

### Final Phase Verdict
### **`STAGING CONFIGURATION ACCEPTED FOR PROVISIONING`**

### Summary of Owner Actions Required Prior to Remote Execution:
1. **Confirm VPS Origin IPv4:** Verify that `200.97.161.128` is the current active IP of the Hostinger VPS.
2. **Cloudflare DNS Records:** Create proxied `A` records for `staging` and `staging-api` pointing to `200.97.161.128`.
3. **Google Cloud Console OAuth:** Add `https://staging.mect.org.in` to Authorized JavaScript origins.
4. **Provisioning Approval:** Grant explicit authorization to connect via SSH and execute the staging provisioning runbook.

---
*Report certified by Antigravity Quality & Infrastructure Security Agent.*  
*Repository Baseline: `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c` | Timestamp: November 27, 2026.*
