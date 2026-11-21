# Pull Request: Autonomous Fix Loop — Truth Audit, Structural Hardening & Production Release Readiness

**Target Branch:** `main`  
**Source Branch:** `fix/audit-loop`  
**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Deployment Status:** Pre-Deployment Verification Complete (Zero Production Deployment Performed; No Remote Push Executed)

---

## 1. Executive Summary

This Pull Request represents the culmination of Loops 1 through 9 of the autonomous fix and truth audit protocol on `fix/audit-loop`. It resolves critical factual discrepancies, eliminates dead links and broken anchors, hardens public contact and donation verification workflows to fail closed without issuing unverified ticket numbers, aligns banking credentials to the physically verified SBI account, replaces unverified cryptographic receipt claims with truthful statutory wording, compiles and tests all backend Java additions (127/127 tests passing), audits rendered tax language across 34 routes and chatbot interactions (100% neutral), establishes a repeatable secret scanning suite, and defines a strict pre-production staging gate.

---

## 2. User-Visible & Architectural Changes

1. **Unified SBI Banking & UPI Details:**
   - Single-sourced to verified State Bank of India account in `src/config/org.ts` (A/C `33341302498`, IFSC `SBIN0001701`, Branch `Rajendra College Square, Bolangir`, UPI `86971610172@sbi`).
   - Integrated `UpiQrCard` component on `/donate` with 1-click copy, deep link (`upi://pay`), and payment instructions.
   - Completely eradicated deprecated account `33091993247`, conflicting Union Bank references, and errant IFSC codes.
2. **Fail-Closed Submissions (Highest Priority):**
   - Eliminated synthetic local-ticket fallbacks (`MECT-SBI-HHMMSS-XXXX`, `MECT-INQ-...`) from `/api/donations/claim` and `/api/contact`.
   - If the backend is unreachable or returns 5xx: routes return HTTP 503 with an explicit fail-closed message stating that nothing has been recorded and directing the user to the secretariat email or helpline.
   - Reference numbers are displayed to the user **only** when issued by the backend database.
   - Optional local simulation is gated behind `ALLOW_DEV_FALLBACK=true` and active only when `NODE_ENV !== 'production'`.
3. **Truthful Receipt Terminology:**
   - Audited `ReceiptPdfService.java` and `DonationLifecycleService.java`: confirmed SHA-256 hash was computed for database storage but never printed on the generated PDF receipt nor verifiable via a public endpoint.
   - Replaced all unverified "SHA-256 cryptographic seal" claims across 8 frontend routes with truthful "numbered receipt" terminology.
4. **Standardized Neutral Statutory Tax Disclosures:**
   - Standardized tax disclaimer across `/donate`, `/statutory-disclosures`, `/about`, and `/faq`:
     > *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility."*
   - Executed Playwright rendered crawl across 34 routes: eradicated all 4 promotional Class (b) phrases.
   - Added required closing sentence to AI chatbot 80G response: *"This order does not by itself confirm eligibility for donations made now."*
5. **Authentic Field Dispatches & Documentary Integrity:**
   - Restored authentic historical Balangir and Puintala field dispatches under `/stories` (`classroom`, `workshop`, `water-point`).
   - Purged all unverified retrospective stories and pseudo-privacy markers (`[Name withheld for privacy]`).
6. **Statutory Annual Reports Multi-Year Table:**
   - Structured multi-year reporting table on `/reports` linking to on-page summaries and physical inspection requests.
   - Purged synthetic generated PDFs; FY 2024–25 clearly designated as "Pending" audit completion.
7. **Hardened Public Contact Form:**
   - Real server-side contact route (`POST /api/contact`) with honeypot (`_gotcha`), IP sliding-window rate limiting (5 req/min), character counter (1000 max), and noscript fallback.
   - Single-sourced public helpline telephone to documented number `+91 94371 23616`. Removed unverified external links.
8. **Canonical Programme Anchors:**
   - Enforced 7 canonical programme IDs on `/programmes`: `#education`, `#women-empowerment`, `#sports-extracurricular`, `#water`, `#food-relief`, `#community-welfare`, `#higher-education` (1251–1304 chars each).
   - Purged dead anchor references (`#hunger-relief`, `#pillars`).
9. **Backend Compilation & Failsafe Startup:**
   - Compiled backend with JDK 21 (`mvn -q -DskipTests compile`).
   - Injected `ManualBankTransferClaimRepository` into `AdminController` to populate `pendingClaims` alongside `pendingInquiries`.
   - Wrapped `@PostConstruct` in `PaymentConfigurationService` in `try/catch` with safe fallback and error logging to ensure backend startup is never aborted by database discrepancies.
   - Verified Spring Boot test suite: **127/127 tests passed** (0 failures, 0 errors).
10. **Secret Scanner & Pre-Push Hygiene:**
    - Authored `scripts/scan_secrets.mjs` checking 10 credential patterns with strict masking (max first 4 chars).
    - Verified **0 active secrets** in tracked files. Registered pre-push check `npm run scan:secrets`.
    - Documented historical commit `e995fbb` remediation in `docs/HISTORY_CLEANUP.md`.
11. **Error Boundaries & Resilience:**
    - Added `src/app/error.tsx` (client error boundary with retry) and `/500` route with `robots: noindex`.
    - Verified branded `src/app/not-found.tsx` (404) with navigation shortcuts.
12. **Feature-Gated Odia Language Toggle:**
    - Bilingual English/Odia toggle safely gated behind `NEXT_PUBLIC_ENABLE_ODIA="true"` (default off until Trust review).

---

## 3. Database Migrations & Reversibility Analysis

The following 7 Flyway database migrations were added in `backend/src/main/resources/db/migration/` since `main`:

| Migration File | Description & Schema Impact | Reversible? | Rollback Mechanism / SQL |
| :--- | :--- | :---: | :--- |
| **`V10__cashfree_payment_gateway_schema.sql`** | Adds `cf_order_id`, `payment_session_id`, `gateway_raw_status`, `payment_group`, `bank_reference`, `verified_at`, and `version` columns to `payments`; adds `version` column to `donations`; creates composite indexes for provider orders and status expiry. | **YES** | ```sql<br>DROP INDEX IF EXISTS idx_donations_status_created_at;<br>DROP INDEX IF EXISTS idx_payments_provider_status_expires;<br>DROP INDEX IF EXISTS uq_payments_provider_order;<br>ALTER TABLE donations DROP COLUMN IF EXISTS version;<br>ALTER TABLE payments DROP COLUMN IF EXISTS version, DROP COLUMN IF EXISTS verified_at, DROP COLUMN IF EXISTS bank_reference, DROP COLUMN IF EXISTS payment_group, DROP COLUMN IF EXISTS gateway_raw_status, DROP COLUMN IF EXISTS payment_session_id, DROP COLUMN IF EXISTS cf_order_id;<br>``` |
| **`V11__donation_ecosystem_cms_and_rbac.sql`** | Adds `communication_consent` to `donations`; inserts `GENERAL_FUND` into `donation_programmes`; creates `payment_configurations` table (seeds row id=1); creates `manual_bank_transfer_claims`, `content_pages`, `content_revisions`, and `media_assets` tables with indexes. | **YES** | ```sql<br>DROP TABLE IF EXISTS media_assets CASCADE;<br>DROP TABLE IF EXISTS content_revisions CASCADE;<br>DROP TABLE IF EXISTS content_pages CASCADE;<br>DROP TABLE IF EXISTS manual_bank_transfer_claims CASCADE;<br>DROP TABLE IF EXISTS payment_configurations CASCADE;<br>DELETE FROM donation_programmes WHERE code = 'GENERAL_FUND';<br>ALTER TABLE donations DROP COLUMN IF EXISTS communication_consent;<br>``` |
| **`V12__him_payment_gateway_schema.sql`** | Adds `him_*` configuration columns to `payment_configurations`; creates `him_payment_attempts` table (with UTR indexes) and `him_webhook_events` table (with delivery indexes). | **YES** | ```sql<br>DROP TABLE IF EXISTS him_webhook_events CASCADE;<br>DROP TABLE IF EXISTS him_payment_attempts CASCADE;<br>ALTER TABLE payment_configurations DROP COLUMN IF EXISTS him_webhook_secret, DROP COLUMN IF EXISTS him_verification_mode, DROP COLUMN IF EXISTS him_instructions, DROP COLUMN IF EXISTS him_merchant_name, DROP COLUMN IF EXISTS him_upi_id, DROP COLUMN IF EXISTS him_enabled;<br>``` |
| **`V13__public_documents_library_schema.sql`** | Creates `public_documents` statutory documents catalog table with category, status, and visibility indexes; pre-seeds foundational charter deed (`DOC-TR-2013-DEED`) and PAN card (`DOC-IT-PAN-2013`). | **YES** | ```sql<br>DROP TABLE IF EXISTS public_documents CASCADE;<br>``` |
| **`V14__hanuman_murti_and_campaigns_schema.sql`** | Inserts `HANUMAN_MURTI` into `donation_programmes` (segregated ledger); creates `campaign_updates` table and seeds 3 initial project milestones. | **YES** | ```sql<br>DROP TABLE IF EXISTS campaign_updates CASCADE;<br>DELETE FROM donation_programmes WHERE code = 'HANUMAN_MURTI';<br>``` |
| **`V15__sanitize_public_donation_instructions.sql`** | Data-only update sanitizing `payment_instructions` and `gateway_notice_text` in `payment_configurations` (id=1). | **YES** (Data Compensation) | ```sql<br>UPDATE payment_configurations<br>SET payment_instructions = 'Verify beneficiary name MAHAVEER EDUCATIONAL CHARITA in your UPI app before confirming transfer, then submit your 12-digit UTR/reference for verification.',<br>    gateway_notice_text = 'Online payments are processed via Cashfree. Direct SBI UPI/bank transfers are verified manually by MECT Accounts before final receipt issuance.'<br>WHERE id = 1;<br>``` |
| **`V16__donor_authentication_and_district_schema.sql`** | Adds `district` column to `portal_user_profiles`; adds indexes `idx_portal_user_profiles_district` and `idx_donations_portal_user_status`. | **YES** | ```sql<br>DROP INDEX IF EXISTS idx_donations_portal_user_status;<br>DROP INDEX IF EXISTS idx_portal_user_profiles_district;<br>ALTER TABLE portal_user_profiles DROP COLUMN IF EXISTS district;<br>``` |

*Note: The SQL statements above document the technical reversibility of schema objects for reference and isolated test teardowns. In production, refer to Section 8: **NEVER execute manual SQL DROP statements on a running database after launch**; use binary `pg_restore` instead.*

---

## 4. Environment Variables Inventory

The following environment variables are newly introduced or updated across the stack (documented in `.env.example` and `compose.production.yaml`):

| Variable Name | Scope | Default / Recommended Value | Description & Sensitivity |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_ENABLE_ODIA` | Frontend (Next.js) | `false` | Feature flag toggling Odia language switcher. Non-sensitive. |
| `NEXT_PUBLIC_API_URL` | Frontend (Next.js) | `https://mect.org.in/api/v1` | Public API base URL alias for client components. Non-sensitive. |
| `BACKEND_API_URL` | Next.js Server | `http://mect-backend:8080` (Compose) / `http://127.0.0.1:8081` (Host dev) | Upstream backend API URL for Next.js server route proxies. Non-sensitive. |
| `ALLOW_DEV_FALLBACK` | Next.js Server | `false` | Development-only fallback for simulated claim/inquiry tickets. Must remain `false` in production. |
| `TRUSTED_PROXY_HEADER` | Next.js Server | `X-Forwarded-For` | Reverse proxy header used for client IP rate limiting. Non-sensitive. |
| `PORT` | Next.js Server | `3000` | Local port binding for frontend container. Non-sensitive. |
| `HOSTNAME` | Next.js Server | `0.0.0.0` | Network interface binding for container runtime. Non-sensitive. |
| `NODE_ENV` | Next.js Server | `production` | Node.js execution environment mode. Non-sensitive. |
| `DB_HOST` | Backend (Spring) | `mect-postgres` | Hostname/service name of PostgreSQL database. Non-sensitive. |
| `DB_PORT` | Backend (Spring) | `5432` | PostgreSQL network port. Non-sensitive. |
| `DB_NAME` | Backend (Spring) | `mect_db` | PostgreSQL database name. Non-sensitive. |
| `DB_USERNAME` | Backend (Spring) | `mect_user` | PostgreSQL database user. Non-sensitive. |
| `DB_PASSWORD` | Backend (Spring) | *(Secret)* | PostgreSQL database password. **HIGH SENSITIVITY**. |
| `SERVER_PORT` | Backend (Spring) | `8080` | Internal Spring Boot HTTP port. Non-sensitive. |
| `CORS_ALLOWED_ORIGINS` | Backend (Spring) | `https://mect.org.in,https://www.mect.org.in` | Permitted origins for CORS filtering. Non-sensitive. |
| `APP_PUBLIC_BASE_URL` | Backend (Spring) | `https://mect.org.in` | Public canonical base URL for link and receipt generation. Non-sensitive. |
| `JWT_SECRET` | Backend (Spring) | *(Secret)* | Minimum 256-bit cryptographic key for donor portal JWT signing. **HIGH SENSITIVITY**. |
| `JWT_ACCESS_VALIDITY` | Backend (Spring) | `900` | Access token lifespan in seconds (15 minutes). Non-sensitive. |
| `JWT_REFRESH_VALIDITY` | Backend (Spring) | `604800` | Refresh token lifespan in seconds (7 days). Non-sensitive. |
| `OTP_HASH_PEPPER` | Backend (Spring) | *(Secret)* | Cryptographic pepper combined with OTP codes before hashing. **HIGH SENSITIVITY**. |
| `RESEND_API_KEY` | Backend (Spring) | *(Secret / Optional)* | Resend REST API key for transactional emails. **MEDIUM SENSITIVITY**. |
| `RESEND_FROM_NOTIFICATIONS`| Backend (Spring) | `notifications@mect.org.in` | Sender address for system notifications. Non-sensitive. |
| `RESEND_FROM_DONATIONS` | Backend (Spring) | `donations@mect.org.in` | Sender address for donation acknowledgements. Non-sensitive. |
| `PAYMENT_PROVIDER` | Backend (Spring) | `SBI_DIRECT` | Active payment method mode. Set to `SBI_DIRECT` (no online PG). Non-sensitive. |
| `PAYMENT_SANDBOX_MODE` | Backend (Spring) | `false` | Gateway simulation toggle. Non-sensitive. |
| `CASHFREE_APP_ID` | Backend (Spring) | *(Optional)* | Cashfree App ID (dormant when `PAYMENT_PROVIDER=SBI_DIRECT`). |
| `CASHFREE_SECRET_KEY` | Backend (Spring) | *(Optional)* | Cashfree Secret Key. **HIGH SENSITIVITY**. |
| `CASHFREE_ENV` | Backend (Spring) | `PRODUCTION` | Cashfree environment mode. Non-sensitive. |
| `CASHFREE_API_VERSION` | Backend (Spring) | `2023-08-01` | Cashfree REST API version header. Non-sensitive. |
| `CASHFREE_WEBHOOK_SECRET` | Backend (Spring) | *(Optional)* | Cashfree webhook signature key. **HIGH SENSITIVITY**. |
| `CASHFREE_WEBHOOK_TOLERANCE_SECONDS` | Backend (Spring) | `300` | Webhook timestamp drift tolerance in seconds. Non-sensitive. |
| `CASHFREE_RETURN_URL` | Backend (Spring) | `https://mect.org.in/donate?order_id={order_id}` | Donor redirect return URL. Non-sensitive. |
| `CASHFREE_NOTIFY_URL` | Backend (Spring) | `https://mect.org.in/api/v1/webhooks/payments/cashfree` | Server-to-server webhook destination. Non-sensitive. |

---

## 5. Deployment Safety: Omission of `--remove-orphans`

The production deployment commands in `docs/DEPLOYMENT_CHECKLIST.md` and `RELEASE_READINESS.md` strictly omit `--remove-orphans`:
```bash
docker compose -f compose.production.yaml up -d
```
**Justification:**  
The host VPS (`<PROD_VPS_IP>`) hosts other applications, standalone containers, and temporary staging containers (e.g. `mect-frontend-staging`). Using `--remove-orphans` causes Docker Compose to stop and remove any containers in the project/network space not defined in `compose.production.yaml`. Omission of `--remove-orphans` ensures Docker Compose strictly manages declared MECT services without disrupting unrelated workloads.

---

## 6. What Needs Owner Confirmation Before Merging

Refer to [OWNER_DECISIONS.md](file:///<WORKSPACE_DIR>/OWNER_DECISIONS.md) for full context. The critical gates requiring explicit Trust management sign-off are:

1. **Groq API Key Revocation ([OWNER_DECISIONS.md](file:///<WORKSPACE_DIR>/OWNER_DECISIONS.md) Item 1):** Revoke the historical key exposed in commit `e995fbb` in the Groq console and issue a new secret for production.
2. **Bank Details vs Physical Passbook ([OWNER_DECISIONS.md](file:///<WORKSPACE_DIR>/OWNER_DECISIONS.md) Item 3):** Physical inspection of SBI passbook confirming A/C `33341302498`, IFSC `SBIN0001701`, UPI `86971610172@sbi`.
3. **Statutory Credentials ([OWNER_DECISIONS.md](file:///<WORKSPACE_DIR>/OWNER_DECISIONS.md) Items 2, 4, 5):** Confirmation of sole helpline (`+91 94371 23616`), Darpan ID (`OR/2024/0466491`), and official secretariat email (`mect220@gmail.com`).
4. **Chartered Accountant Tax Review ([OWNER_DECISIONS.md](file:///<WORKSPACE_DIR>/OWNER_DECISIONS.md) Item 8):** Finalize CA confirmation of Section 12A / 80G disclosure notes.
5. **Manual VPS Staging Execution:** Owner will manually run the staging gate in `docs/DEPLOYMENT_CHECKLIST.md` Step 5 on loopback port `3002` before swapping production containers.

---

## 7. Verification & Test Evidence

- **Lint & Typecheck:** `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.
- **Production Build:** `npm run build` succeeds cleanly across all 57 static and dynamic routes.
- **Backend Compilation:** `mvn -q -DskipTests compile` (JDK 21) builds with 0 errors.
- **Backend Test Suite:** `mvn test` passes with **127/127 tests successful** (0 failures, 0 errors, 0 skipped).
- **Rendered Verification Suite (`npm run verify`):**
  - 34 routes crawled (HTTP 200).
  - 419 internal anchors checked (0 broken).
  - 7 official programme IDs verified with authentic content.
  - Fail-closed 503 behavior verified for unbacked donation claims and contact submissions.
  - Axe-core 4.14 accessibility: 0 serious or critical violations across all audited routes.
- **Rendered Tax Neutrality Crawl (`node scripts/verify_rendered_tax.mjs`):**
  - 110 Class (a) neutral statutory disclosures found.
  - 0 Class (b) promotional phrases detected across all 34 rendered routes and 5 chatbot test queries (**100% PASS**).
- **Secret Scanning Suite (`npm run scan:secrets`):**
  - 0 active secrets detected across all tracked files in working tree (**PASS**).
- **Multi-Run Mobile Performance Suite (`npm run verify:perf`):**
  - 3-run median Performance >= 90 across all 6 core pages.
  - 3-run median LCP <= 1.4s (< 2.5s gate).
  - 3-run median CLS <= 0.011 (< 0.1 gate).

---

## 8. Step-by-Step Rollback Runbook: Application Rollback vs Database Restore

If any regression occurs upon staging or production deployment, choose the appropriate rollback tier:

### 8.1 Application Rollback (Code Regression, Schema Intact)
When frontend or backend code has a defect, but database schema changes (V10–V16) are not the cause:
1. Check out the previous release commit:
   ```bash
   cd <APP_DIR>
   git checkout <PREVIOUS_RELEASE_COMMIT_SHA>
   ```
2. **Flyway Compatibility Notice:**  
   Because Flyway defaults to `validateOnMigrate: true` without ignoring future migrations (`ignoreMigrationPatterns` is empty), an older backend image lacking V10–V16 scripts on its classpath will fail startup with:
   `FlywayValidateException: Validate failed: Detected applied migration not resolved locally: 10, 11, ...`  
   To allow an older backend container to boot against the existing V10–V16 schema without rolling back the database, pass the Flyway ignore flag in its environment or JVM args:
   `-Dflyway.ignoreMigrationPatterns=*:future` or set `FLYWAY_IGNORE_MIGRATION_PATTERNS=*:future`.
3. Restart containers:
   ```bash
   docker compose -f compose.production.yaml up -d --build
   ```

### 8.2 Database Restore (Migration Failure or State Corruption)
When database schema migrations failed or state corruption occurred:
1. **NEVER RUN MANUAL SQL DROP STATEMENTS AFTER LAUNCH:**  
   Dropping tables (`DROP TABLE ...`) or columns (`DROP COLUMN ...`) on a live production database will permanently destroy live donor records, break foreign keys, desynchronize `flyway_schema_history`, and cause catastrophic data loss.
2. Revert the database cleanly from the pre-deployment binary dump taken in Step 5:
   ```bash
   docker exec -i mect-postgres pg_restore -U ${DB_USERNAME:-mect_user} -d ${DB_NAME:-mect_db} --clean --if-exists < <BACKUP_DIR>/mect_db_pre_deploy_<TIMESTAMP>.dump
   ```
3. Checkout previous release and restart containers:
   ```bash
   git checkout <PREVIOUS_RELEASE_COMMIT_SHA>
   docker compose -f compose.production.yaml up -d --build
   ```

### 8.3 Post-Rollback Verification
Verify all restored endpoints:
```bash
curl -fsS http://127.0.0.1:3001/api/ai/health
curl -fsS http://127.0.0.1:8081/api/v1/actuator/health
curl -I https://mect.org.in/
```
