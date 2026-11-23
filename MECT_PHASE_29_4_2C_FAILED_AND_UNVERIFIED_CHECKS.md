# MECT PHASE 29.4.2C — FAILED AND UNVERIFIED AUDIT CHECKS
## Forensic Root Cause Analysis, Execution Discrepancies & Mandatory Corrections

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `<PROD_VPS_IP>` (`<PROD_HOSTNAME>`)  
**Audit Evaluation Date:** 2026-11-20T00:15:00+05:30 (UTC: 2026-11-19T18:45:00Z)  
**Phase:** Phase 29.4.2C — Evidence Reconciliation & Owner-Assisted Access Readiness  

---

## 1. EXECUTIVE OVERVIEW

A core mandate of Phase 29.4.2C is absolute technical truthfulness: **"Accuracy takes priority over a green scorecard. An unavailable check is NOT VERIFIED, not PASSED."**

This document catalogues every check that failed, every claim from Phase 29.4.2B that was refuted or mischaracterized, and every infrastructure property that remains unverified due to the absence of authenticated shell access to the production VPS.

---

## 2. FORENSIC CATALOGUE OF FAILED CHECKS

### 2.1 Failed Check 1: Direct VPS SSH Authentication
- **Command Attempted:** `ssh -o KexAlgorithms=curve25519-sha256 <DEPLOY_USER>@<PROD_VPS_IP>`
- **Result:** `<DEPLOY_USER>@<PROD_VPS_IP>: Permission denied (publickey,password).` (Exit code: 255)
- **Root Cause Investigation:**
  1. OpenSSH client on Windows attempted authentication using default keys in `<USER_HOME>\.ssh\`.
  2. Inspection of `<USER_HOME>\.ssh\` revealed that **zero private key files** exist in the user profile (only `known_hosts` of length 97 bytes is present).
  3. No SSH agent (`ssh-agent`) is active with pre-loaded identities.
  4. The remote OpenSSH 10.2p1 server on Ubuntu requested interactive password or public key authentication. In non-interactive automated subshell execution, password prompting is impossible.
- **Consequence:** Direct VPS inspection was completely blocked. No host commands (`docker ps`, `df -h`, `free -m`, `ufw status`, `ps aux`) could be executed on the production server.
- **Mandatory Correction to Phase 29.4.2B:** Phase 29.4.2B Deliverables 1 and 2 implied that host hardware, RAM, disk, and Docker runtime metrics were live measurements. They are now officially classified as **`HISTORICAL_EVIDENCE`** from prior Phase 20/21 audits, NOT live Phase 29.4 measurements.

---

### 2.2 Failed Check 2: Sandboxed Outbound Git Network Check
- **Command Attempted:** `git ls-remote origin refs/heads/feat/phase-29-complete-website-excellence`
- **Result:** `fatal: unable to access 'https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git/': Could not resolve host: github.com` (Exit code: 1)
- **Root Cause:** Standard security sandbox enforces network isolation.
- **Remediation & Analysis:** Git branch tracking analysis performed locally showed that `feat/phase-29-complete-website-excellence` has no remote tracking branch configured (`origin/feat/phase-29-complete-website-excellence` does not exist in local branch cache).

---

### 2.3 Failed & Refuted Check 3: Phase 29.4.2B Mischaracterization of Migrations V15 & V16
- **Phase 29.4.2B Report Claims (Deliverable 7):**
  - Claimed `V15` was `V15__donor_auth_reconciliation.sql` creating `otp_audit_log` and `donor_sessions` tables.
  - Claimed `V16` was `V16__donor_experience_enhancements.sql` adding `preferred_language` and `communication_channel` columns.
- **Forensic Inspection of Actual Files on Disk:**
  - File 1: `backend/src/main/resources/db/migration/V15__sanitize_public_donation_instructions.sql` (707 bytes).
  - File 2: `backend/src/main/resources/db/migration/V16__donor_authentication_and_district_schema.sql` (592 bytes).
- **Actual Migration DDL Inspection:**
  - `V15` performs a single, safe `UPDATE payment_configurations` to sanitize public donation instructions:
    ```sql
    UPDATE payment_configurations
    SET payment_instructions = 'All contributions are processed securely online through authorized payment gateways. Digital receipts are issued immediately upon transaction confirmation.',
        gateway_notice_text = 'Online payments are processed securely via authorized payment gateways. MECT operates strictly through verified digital banking channels.'
    WHERE id = 1;
    ```
  - `V16` enhances `portal_user_profiles` with district support and adds two performance indexes:
    ```sql
    ALTER TABLE portal_user_profiles ADD COLUMN IF NOT EXISTS district VARCHAR(100);
    CREATE INDEX IF NOT EXISTS idx_portal_user_profiles_district ON portal_user_profiles(district);
    CREATE INDEX IF NOT EXISTS idx_donations_portal_user_status ON donations(portal_user_id, status);
    ```
- **Correction:** The actual scripts are significantly simpler, fully idempotent, and 100% additive. However, Phase 29.4.2B's narrative was factually inaccurate. This correction restores the exact truth.

---

### 2.4 Refuted Claim 4: "Preflight PASSED with Zero Defects"
- **Phase 29.4.2B Claim:** Deliverable 9 issued a "CONDITIONAL GO" while asserting that "all technical preflight criteria have PASSED with zero defects."
- **Correction:** This statement was premature and logically contradictory. Because direct VPS terminal inspection and production database verification failed due to SSH permission denial, critical infrastructure parameters remain **`NOT_VERIFIED`**. The scorecard cannot be claimed as "zero defects" when fundamental access gates were unverified.

---

## 3. CATALOGUE OF UNVERIFIED PRODUCTION INFRASTRUCTURE PROPERTIES

The following infrastructure attributes cannot be verified from the outside and require authenticated VPS terminal access:

| Infrastructure Attribute | Why It Cannot Be Verified Publicly | Required Authenticated Command on VPS |
| :--- | :--- | :--- |
| **1. Remote Flyway Migration State** | Public API responses showing data do not prove what records exist in the `flyway_schema_history` table. Data could have been seeded manually or via partial JPA updates. | `docker exec mect-postgres psql -U mect_user -d mect_prod -c "SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;"` |
| **2. Production Database Backup Existence** | Local backup/restore drills (Phase 29.4.1) only prove local tooling works. They cannot verify that backup dump files exist on the VPS filesystem or that `cron` dump jobs are active. | `ls -la /var/lib/postgresql/data/backups/` and `crontab -l` |
| **3. Live Docker Container Health & Restart Counts** | Public HTTP 200 proves the web server is answering, but containers could be flapping, experiencing memory pressure, or restarting periodically. | `docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"` and `docker stats --no-stream` |
| **4. Host Nginx Configuration & Duplicate Header Anomaly** | Edge HTTP headers show duplicated security headers (`X-Frame-Options: DENY` twice, `X-Content-Type-Options: nosniff` twice, `Referrer-Policy` twice). Direct config inspection is required to determine whether Nginx or Next.js is injecting duplicates. | `cat /etc/nginx/sites-available/mect.conf` and `nginx -t` |
| **5. Coexisting Workload Health (OHO Tech)** | Outside probes cannot monitor the health or isolation of non-MECT workloads running under PM2 on the same host. | `pm2 list` and `netstat -tlpn` |
| **6. Fast2SMS Production Account Status & Delivery** | Outbound SMS delivery cannot be verified without owner confirmation of wallet balance, DLT sender IDs, and delivery logs. | Owner login to Fast2SMS Portal |

---

## 4. ANOMALY INVESTIGATION: DUPLICATE HTTP SECURITY HEADERS

A live HTTP GET probe against `https://mect.org.in/` revealed duplicated HTTP response headers:

```http
X-Frame-Options: DENY
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Referrer-Policy: strict-origin-when-cross-origin
x-nextjs-prerender: 1
x-nextjs-prerender: 1
```

### Forensic Analysis:
1. **Source 1:** Next.js application runtime configured via `src/middleware.ts` or `next.config.ts` sets security headers.
2. **Source 2:** Host Nginx reverse proxy block (`/etc/nginx/sites-available/mect.conf`) sets `add_header X-Frame-Options "DENY" always;`.
3. **Source 3 (or Cloudflare):** Cloudflare Managed Transform Rules or HTTP response headers set at edge.
4. **Impact:** Modern browsers parse duplicate identical values cleanly, but duplicate differing values or duplicate `x-nextjs-prerender` headers demonstrate a configuration overlap between Nginx and Next.js.
5. **Resolution:** During the authenticated VPS maintenance window, the owner/operator should inspect `/etc/nginx/sites-available/mect.conf` and deduplicate headers.

---

## 5. SUMMARY VERDICT ON UNVERIFIED CHECKS

```
+=============================================================================+
|             MECT PHASE 29.4.2C FAILED & UNVERIFIED CHECKS SUMMARY           |
+=============================================================================+
| 1. Direct VPS SSH Shell Access:           FAILED (Key missing, password req)|
| 2. Remote Production Flyway Table:        UNVERIFIED (Requires SSH / psql)  |
| 3. Remote VPS Backup Files:               UNVERIFIED (Requires SSH / ls)    |
| 4. Live Docker Container Runtime Stats:   UNVERIFIED (Requires SSH / docker)|
| 5. Host Nginx Configuration File:         UNVERIFIED (Requires SSH / cat)   |
| 6. Fast2SMS Wallet Balance & Delivery:    UNVERIFIED (Requires Owner Portal)|
+=============================================================================+
| CONCLUSION:                               CRITICAL PREREQUISITES REMAIN     |
|                                           PENDING OWNER INTERACTIVE ACCESS  |
+=============================================================================+
```
