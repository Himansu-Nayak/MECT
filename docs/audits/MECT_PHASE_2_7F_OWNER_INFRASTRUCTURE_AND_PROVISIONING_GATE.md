# MECT — PHASE 2.7F: OWNER INFRASTRUCTURE CONFIGURATION, RESOURCE SAFEGUARDS & FINAL STAGING PROVISIONING GATE AUDIT REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Proposed Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Proposed Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Reported Commit Baseline:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Audit Protocol:** Phase 2.7F Master Infrastructure & Provisioning Gate  
**Audit Date:** 2026-11-27  
**Final Verdict:** **`OWNER CONFIGURATION REQUIRED`**

---

## 1. STRICT PRODUCTION FREEZE CONFIRMATION

During this phase, absolute change-control boundaries were maintained:
- **No Production SSH:** Zero connections opened to Hostinger VPS.
- **No VPS Modifications:** Remote host filesystem, Docker daemon, and systemd units remain untouched.
- **No Production Database Operations:** Zero database mutations or remote migrations.
- **No Nginx Reload:** Remote Nginx service was neither modified nor reloaded.
- **No DNS / Cloudflare Modifications:** No records created or modified via API or web dashboard.
- **No Git Commit, Push, or Merge:** Local repository working tree remains uncommitted and unstaged.
- **Preservation of Existing Work:** All previously verified phase implementations, screenshots, and audit records remain intact.

---

## 2. FINAL VPS IP IDENTITY VERIFICATION

- **Reported Historical Candidate:** `200.97.161.128` (documented in Hostinger inventory and `deploy_vps.ps1`).
- **Audit Assessment:** This IP address is classified as a historical candidate, not confirmed current infrastructure data.
- **Authoritative Verification Evidence Required:**
  The owner must log in to the **Hostinger VPS Control Panel** and inspect the active server dashboard:
  1. Navigate to **VPS Dashboard** -> Select the active Ubuntu VPS instance hosting MECT and OHO Tech.
  2. Locate the **IPv4 Address** field under Server Information.
  3. Authoritatively confirm whether the public IPv4 is indeed `200.97.161.128` or has changed due to hypervisor reassignment.
  4. Only proceed to DNS configuration after this address is confirmed.

---

## 3. CLOUDFLARE DNS PREPARATION

### Records to Create (Post-IP Confirmation):
| Record | Type | Name | Content (IPv4 Target) | Proxy Status | TTL | Purpose |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Record A** | `A` | `staging` | Owner-confirmed VPS IPv4 | **Proxied (Orange Cloud)** | Auto | Frontend Web Application |
| **Record B** | `A` | `staging-api` | Owner-confirmed VPS IPv4 | **Proxied (Orange Cloud)** | Auto | Backend REST API |

### Zone Inspection & Collision Analysis:
Before adding these records, the owner must inspect the Cloudflare DNS zone for `mect.org.in`:
- **Existing `A` Records:** Verify that no existing `staging` or `staging-api` records point to obsolete servers or conflicting IP addresses.
- **Existing `AAAA` Records:** Ensure no conflicting IPv6 `AAAA` records exist for `staging` or `staging-api` (IPv6 traffic to an unconfigured IPv6 stack will cause intermittent connection drops).
- **Conflicting `CNAME` Records:** Ensure no wildcard or specific `CNAME` records alias `staging` to external providers (e.g. Vercel, Netlify).
- **Proxy Status:** Must be set to **Proxied (Orange Cloud)** so that Cloudflare WAF, DDoS mitigation, edge TLS termination, and Zero Trust Access policies protect origin servers.

---

## 4. CLOUDFLARE ZERO TRUST ACCESS & API ACCESS PROTECTION

Two protected Self-hosted Web Applications must be created in the **Cloudflare Zero Trust Dashboard**:

### Application 1: Staging Frontend (`staging.mect.org.in`)
- **Application Name:** `MECT Staging Frontend`
- **Domain:** `staging.mect.org.in`
- **Application Type:** Self-hosted
- **Session Duration:** 24 hours
- **Default Policy:** Default Deny.
- **Allowed Identities:** Explicitly authorized staging testers and auditors (via Email OTP or Google Workspace).
- **Cookie Scope:** Set cookie domain to `.mect.org.in` so authentication tokens are shared across subdomains.

### Application 2: Staging Backend API (`staging-api.mect.org.in`)
- **Application Name:** `MECT Staging Backend API`
- **Domain:** `staging-api.mect.org.in`
- **Application Type:** Self-hosted
- **Session Duration:** 24 hours
- **CORS Preflight Bypass Policy:**
  - **Rule Name:** `CORS Preflight Allow`
  - **Action:** `Bypass`
  - **Selector:** HTTP Method = `OPTIONS`
  - *Technical Scope: Browsers never transmit cookies or credentials during CORS preflight `OPTIONS` requests. Bypassing OPTIONS strictly allows browser fetch calls to negotiate `Access-Control-Allow-*` headers without granting access to state-changing operations.*
- **Protected Request Policy:**
  - **Action:** `Allow`
  - **Selectors:** Valid `CF_Authorization` session cookie or Service Token headers (`CF-Access-Client-Id` / `CF-Access-Client-Secret`).

### Compatibility Analysis: Nginx Basic Auth vs. Cloudflare Access
A deep technical evaluation revealed that relying on Nginx HTTP Basic Auth on `staging-api.mect.org.in` introduces severe protocol collisions:
1. **`Authorization` Header Collision:** HTTP Basic Auth populates the browser's `Authorization: Basic ...` header. The MECT donor portal and admin UI use `Authorization: Bearer <jwt>` to authenticate REST calls. If Nginx Basic Auth is active on the API host, the browser cannot attach the JWT Bearer token without overwriting or failing the Basic Auth challenge.
2. **CORS Rejection:** Browsers do not send Basic Auth credentials across origins during initial fetch calls unless `credentials: 'include'` is set, and preflights never include them.
3. **Google Identity Services (GIS):** Third-party pop-up and credential iframe flows are frequently suppressed by browsers when parent pages are gated by HTTP Basic Auth dialogs.
4. **Architectural Resolution:**
   - **Primary Edge Protection:** Cloudflare Access is designated as the sole external gatekeeper because it utilizes the `CF_Authorization` cookie at the network edge, leaves the application's `Authorization: Bearer` header completely unmolested, and handles CORS preflights seamlessly.
   - **Nginx Basic Auth:** Retained purely as a local emergency fallback if Cloudflare Access is bypassed or unavailable, with explicit warnings documented in `staging.mect.org.in.conf`.

---

## 5. HOST RESOURCE SAFEGUARDS & CPU ALLOCATION

### The Shared Server Dilemma:
The Hostinger VPS possesses **4 vCPUs, ~15 GiB RAM, and 193 GB SSD**. It concurrently runs:
1. MECT Production Stack (`mect-frontend-prod:3001`, `mect-backend-prod:8081`, `mect-postgres-prod:5433`).
2. OHO Tech Production Stack (`frontend:3000`, `backend:8080`, `postgres:5432`).
3. Host Nginx reverse proxy, SSH daemon, and system services.

The previous staging resource caps totaled **3.5 CPUs**, which permitted staging to consume up to 87.5% of host CPU capacity. This was flagged as an unacceptable operational risk to live services.

### Conservative Resource Allocation Implemented in `compose.staging.yaml`:
| Service | Previous CPU Cap | **Hardened CPU Cap** | Previous RAM Cap | **Hardened RAM Cap** | JVM / Node Heap Setting |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `mect-postgres-staging` | 1.0 | **0.25** | 512M | **256M** | Shared buffers 64M, max conns 20 |
| `mect-backend-staging` | 1.5 | **0.75** | 1024M | **768M** | `-Xms128m -Xmx384m -XX:+UseG1GC` |
| `mect-frontend-staging` | 1.0 | **0.50** | 512M | **384M** | Next.js Node SSR (~200M RSS) |
| **Total Staging Stack** | **3.50 CPUs** | **1.50 CPUs** | **2048 MB** | **1408 MB (~1.4 GB)** | **Guarantees 2.5 CPUs (62.5%) for Prod** |

### Build-Time CPU Isolation:
Compiling Next.js bundles and building Maven JARs directly on a shared VPS can spike all 4 cores to 100%. To protect production during staging container builds:
1. `next.config.ts` enforces `experimental: { cpus: 1 }`, pinning Next.js compilation concurrency to a single thread.
2. Build commands executed on the VPS must be wrapped in `nice` and `ionice`:
   ```bash
   nice -n 19 ionice -c 3 docker compose -f compose.staging.yaml build
   ```
   This assigns the lowest CPU scheduling priority and idle I/O priority to staging builds, ensuring Production MECT and OHO Tech web traffic always preempts build workloads.

---

## 6. DISK AND VOLUME GROWTH SAFEGUARDS

### Named Volume Quota Reality:
In Docker on standard Linux ext4/xfs filesystems, named volumes (`mect-staging-pgdata`, `mect-staging-media`, `mect-staging-receipts`) do **not** have automatic hard disk quotas unless underlying filesystem project quotas are enabled. Without active monitoring, unbounded logs or test uploads could fill the 193 GB SSD.

### Defensive Storage Safeguards Configured:
1. **Container Log Capping:** Every staging container in `compose.staging.yaml` enforces log rotation:
   - Driver: `json-file`
   - `max-size: "10m"`
   - `max-file: "3"`
   - Maximum staging log footprint across all 3 containers is strictly capped at **90 MB**.
2. **Staging Artifact Purge Policy:**
   - Test receipts in `mect-staging-receipts` and test media in `mect-staging-media` older than 14 days are eligible for automatic purging.
   - Purge command: `find /var/lib/docker/volumes/mect-staging-receipts/_data -type f -mtime +14 -delete`.
3. **Automated Host Disk Space Monitor:**
   A lightweight cron script must be installed on the host to monitor disk usage:
   ```bash
   #!/bin/bash
   # /usr/local/bin/check_disk_safeguard.sh
   USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')
   if [ "$USAGE" -ge 85 ]; then
       echo "CRITICAL: Disk usage at ${USAGE}% on $(hostname)! Triggering staging image cleanup." | mail -s "MECT Disk Alert" admin@mect.org.in
       docker image prune -f
       docker builder prune -f --keep-storage 500MB
   elif [ "$USAGE" -ge 80 ]; then
       echo "WARNING: Disk usage at ${USAGE}% on $(hostname)." | mail -s "MECT Disk Warning" admin@mect.org.in
   fi
   ```
4. **Emergency Recovery Procedure:**
   - Run `docker system prune -f` to clear dangling test containers and unreferenced images.
   - Run `docker builder prune -f` to purge build caches.
   - **Production Volume Insulation:** Production volumes (`mect-pgdata`, `mect-media`, `mect-receipts`, and OHO Tech `postgres_data`) are never targeted by staging cleanup scripts.

---

## 7. TLS CERTIFICATE READINESS

- **Reported Origin Certificate:** `/etc/ssl/mect/fullchain.pem` (Cloudflare Origin CA wildcard certificate).
- **Reported Private Key:** `/etc/ssl/mect/origin.key`.
- **Pre-Reload Verification Commands:**
  Before reloading Nginx on the host, the operator must execute the following non-destructive inspection commands:
  ```bash
  # 1. Verify Issuer and Subject Alternative Names (SANs)
  sudo openssl x509 -in /etc/ssl/mect/fullchain.pem -noout -issuer -subject -dates -ext subjectAltName

  # 2. Verify Private Key Matches Certificate without exposing contents
  sudo openssl x509 -in /etc/ssl/mect/fullchain.pem -noout -modulus | openssl sha256
  sudo openssl rsa -in /etc/ssl/mect/origin.key -noout -modulus | openssl sha256
  # (Both SHA256 hashes must be identical)

  # 3. Verify Restrictive Private Key Permissions
  ls -la /etc/ssl/mect/origin.key
  # (Must be -rw------- 1 root root or 600 permissions)
  ```
- **Cloudflare Encryption Mode:** Must be set to **Full (Strict)** in the Cloudflare SSL/TLS overview. Because `*.mect.org.in` covers both `staging.mect.org.in` and `staging-api.mect.org.in`, TLS termination will validate end-to-end without handshake failures.

---

## 8. NGINX VALIDATION READINESS

- **Configuration File:** `docker/nginx/staging.mect.org.in.conf`.
- **Local Validation Status:** In the local Windows development environment, native `nginx -t` cannot execute due to missing Windows Nginx binaries and an inactive Docker daemon pipe. Local verification was completed using comprehensive AST and directive syntax parsing.
- **Server-Side Native Preflight Requirement:**
  AST parsing is not a substitute for native validation. Before reloading Nginx on the server, the operator must execute:
  ```bash
  # 1. Copy staging configuration to sites-available
  sudo cp docker/nginx/staging.mect.org.in.conf /etc/nginx/sites-available/staging.mect.org.in.conf

  # 2. Link to sites-enabled
  sudo ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/staging.mect.org.in.conf

  # 3. Execute native syntax check
  sudo nginx -t

  # 4. ONLY if exit code is 0, reload Nginx gracefully
  sudo systemctl reload nginx
  ```
- **Actuator Protection:** Actuator endpoint `/api/v1/actuator/health` is permitted for monitoring; all other endpoints (`/api/v1/actuator/*`) return `404 Not Found` via `deny all; return 404;`.

---

## 9. GOOGLE OIDC STAGING CONFIGURATION

The donor authentication system implements Google Identity Services (GIS) client-side token acquisition.
- **OAuth Web Client ID:** `926210200845-q1a73v1eghb6f4e3c5aam5k4602fcl74.apps.googleusercontent.com`.
- **Client Flow:** Client-side JavaScript prompt/button initializes via `google.accounts.id.initialize`. Upon user sign-in, Google returns a signed ID token (JWT) to the client callback, which forwards it to `POST /api/v1/portal/auth/google`.
- **Google Cloud Console Actions Required:**
  1. Open Google Cloud Console -> APIs & Services -> Credentials.
  2. Edit Web Client ID `926210200845-...`.
  3. Under **Authorized JavaScript origins**, add:
     `https://staging.mect.org.in`
  4. Under **Authorized redirect URIs**: **NONE REQUIRED** (the GIS credential flow does not use redirect grant URIs).
  5. Save changes.

---

## 10. STAGING SECRET GENERATION & GIT HYGIENE

### Git Protection:
- `.gitignore` was updated to explicitly ignore `.env.staging` (verified via `git check-ignore -v .env.staging` returning `.gitignore:38:.env.staging`).
- `.env.staging.example` contains only configuration keys with zero real secret values.

### Secure Secret Generation Procedure (Owner Execution):
The owner must generate cryptographically strong, independent values on their local terminal:
```bash
# Generate DB_PASSWORD (32-byte hex string)
openssl rand -hex 32

# Generate JWT_SECRET (64-byte base64 string, 512 bits)
openssl rand -base64 48

# Generate OTP_HASH_PEPPER (32-byte hex string)
openssl rand -hex 32
```
> [!IMPORTANT]
> Never print, copy, paste, or commit real secret values into conversation prompts, git commits, or audit markdown reports. Staging secrets must be installed directly on the server via `.env.staging`.

---

## 11. STAGING PAYMENT & NOTIFICATION SAFETY

Staging operates under strict kill-switches:
- `PAYMENT_SANDBOX_MODE=true` (Cashfree sandbox active; zero real bank or UPI transactions).
- `WHATSAPP_ENABLED=false` (Meta Cloud API disabled).
- `SMS_PROVIDER=MOCK` (Zero outbound HTTP calls; verified via unit test 16).
- `RESEND_API_KEY=""` (No real donor emails).
- **Watermarked Receipts:** Simulated receipts generated by `ReceiptPdfService` prominently display:
  ```
  TEST / STAGING — SIMULATED TRANSACTION — NOT VALID FOR TAX DEDUCTION
  ```
  (Verified via unit test 17 in `StagingOtpHardeningAndSafetyTests.java`).

---

## 12. FINAL QUALITY REGRESSION VERIFICATION

Every verification gate passed with exit code 0:

| Quality Gate | Command Executed | Exit Code | Verified Outcome |
| :--- | :--- | :---: | :--- |
| **Marker Audit** | `npm run check:confirm` | `0` | PASS: 0 unresolved markers |
| **Secret Scan** | `npm run scan:secrets` | `0` | PASS: 0 tracked secrets detected |
| **TypeScript Compilation** | `npm run typecheck` | `0` | PASS: Zero type errors |
| **ESLint Check** | `npm run lint` | `0` | PASS: Zero linting errors |
| **Next.js Production Build** | `npm run build` | `0` | PASS: All 58/58 routes generated |
| **Spring Boot Full Test Suite** | `mvn -f backend/pom.xml test` | `0` | PASS: 170/170 tests passed across 22 classes |
| **Staging Safety Test Suite** | `mvn ... -Dtest=StagingOtpHardeningAndSafetyTests` | `0` | PASS: 17/17 test cases passed |
| **Docker Compose Config** | `docker compose -f compose.staging.yaml config` | `0` | PASS: Valid schema, 1.5 CPU cap, isolated ports |

---

## 13. OWNER ACTION CHECKLIST & SERVICE IMPACT ANALYSIS

| # | Action Item | Target Service / Platform | Potential Impact | Recovery / Rollback Plan |
| :---: | :--- | :--- | :--- | :--- |
| **1** | Confirm active VPS IPv4 address | Hostinger VPS Dashboard | None (Read-only lookup). | If IP has changed, update DNS records accordingly. |
| **2** | Add Cloudflare `A` records (`staging`, `staging-api`) | Cloudflare DNS Dashboard | None to production (`staging` subdomains are new). | Delete or update DNS entries if incorrect. |
| **3** | Configure Cloudflare Zero Trust Access applications | Cloudflare Zero Trust | None to production; gates staging traffic at edge. | Delete Access application or switch to Bypass. |
| **4** | Verify Origin SSL wildcard SANs | Hostinger VPS terminal (`openssl`) | None (Read-only certificate inspection). | If SANs missing, reissue origin certificate. |
| **5** | Add Google OIDC JavaScript origin | Google Cloud Console | None (Appends authorized origin to existing client). | Remove origin from client configuration. |
| **6** | Generate staging secrets into `.env.staging` | Local terminal & VPS | None (Staging-only environment file). | Re-generate secrets if compromised. |
| **7** | Authorize staging Docker provisioning | Hostinger VPS terminal (`docker compose`) | CPU/Disk usage during build. Mitigated by `nice -n 19`. | `docker compose -f compose.staging.yaml down`. |
| **8** | Authorize isolated staging database creation | Staging PostgreSQL container | None (Internal Docker volume `mect-staging-pgdata`). | `docker volume rm mect-staging-pgdata`. |
| **9** | Authorize staging Nginx virtual host addition | Hostinger VPS Nginx (`nginx -t`) | Risk of Nginx syntax error during reload. Mitigated by `nginx -t`. | Remove symlink from `sites-enabled` and reload Nginx. |
| **10**| Review shared firewall rules | Hostinger VPS UFW | High risk if rules misconfigured. No changes recommended now. | Revert UFW rules to previous state via saved ruleset. |

---

## 14. REMAINING BLOCKERS & FINAL VERDICT

### Remaining Blockers:
1. Owner confirmation of the active Hostinger VPS IPv4 address.
2. Owner creation of Cloudflare DNS records (`staging`, `staging-api`).
3. Owner creation of Cloudflare Zero Trust Access applications.
4. Owner addition of `https://staging.mect.org.in` in Google Cloud Console.
5. Owner generation of staging credentials in `.env.staging`.

### Final Verdict:

```
====================================================================================================
                             MECT STAGING INFRASTRUCTURE GATE VERDICT
====================================================================================================

  [x] Section 1: Strict Production Freeze:           100% Adhered (Zero Mutations, Working Tree Intact)
  [x] Section 2: VPS IP Identity Protocol:           Authoritative Verification Checklist Defined
  [x] Section 3: Cloudflare DNS Architecture:        Records & Anti-Collision Checks Documented
  [x] Section 4: Zero Trust Access & CORS Preflight: Dual-App Architecture + OPTIONS Bypass Defined
  [x] Section 5: Host Resource Safeguards:           Staging CPU Cap Reduced to 1.50 Cores (was 3.50)
  [x] Section 6: Disk & Storage Safeguards:          Log Rotation (90MB Max) + Purge Scripts Defined
  [x] Section 7: TLS Certificate Readiness:          Inspection Commands Prepared (Full Strict Compatible)
  [x] Section 8: Nginx Validation Readiness:         Native 'nginx -t' Procedure Scripted
  [x] Section 9: Google OIDC Integration:            GIS Flow Confirmed, JS Origin Specified
  [x] Section 10: Secret Generation & Git Ignore:    .env.staging Gitignored, OpenSSL Commands Provided
  [x] Section 11: Payment & Messaging Kill-Switches: Sandbox Active, Mock SMS, Watermarked Receipts
  [x] Section 12: Full Quality Regression Suite:     170 Backend Tests + 58 Routes Pass (Exit Code 0)
  [x] Section 13: Owner Action Checklist:            10-Point Step-by-Step Guide with Impact Analysis

  FINAL VERDICT:
  >>> OWNER CONFIGURATION REQUIRED <<<

====================================================================================================
```
