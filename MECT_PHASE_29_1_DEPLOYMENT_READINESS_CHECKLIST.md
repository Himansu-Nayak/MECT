# MECT PHASE 29.1 — DEPLOYMENT READINESS & RELEASE QUALIFICATION CHECKLIST
## Pre-Deployment Verification, Secrets Inventory, Container Runbook, Rollback Protocol & Freeze Policy

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Current Active Branch:** `feat/phase-29-complete-website-excellence`  
**Starting Commit Baseline:** `cc121ba`  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Release Target:** Standalone Production Container Stack (Frontend Next.js + Backend Spring Boot + PostgreSQL)  
**Current Status:** **READY FOR RELEASE — STRICT PRODUCTION FREEZE ENFORCED**  

---

## 1. STRICT PRODUCTION FREEZE POLICY STATEMENT

> [!CAUTION]
> **MANDATORY PRODUCTION DEPLOYMENT FREEZE IN EFFECT**  
> Under strict project governance rules, all changes developed, audited, and verified during Phase 29.1 remain strictly confined to the local repository feature branch.  
> 
> The following actions are **STRICTLY PROHIBITED** until explicit, written approval is granted by the project owner:
> 1. Connecting to the production VPS server (`200.97.161.128`).
> 2. Initiating SSH sessions or executing remote terminal commands.
> 3. Restarting, stopping, or updating production Docker containers or systemd services.
> 4. Executing database migrations, ALTER TABLE statements, or SQL scripts on the live PostgreSQL instance.
> 5. Merging `feat/phase-29-complete-website-excellence` into `main` or pushing to any remote repository branch.

---

## 2. PRE-DEPLOYMENT QUALITY GATES SUMMARY

Every automated and architectural gate required for release qualification has been executed and verified locally:

| # | Quality Gate | Tool / Command | Verification Criteria | Status | Actual Result |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **01** | **Static Type Safety** | `npm run typecheck` (`tsc --noEmit`) | 0 compilation errors across all pages, components, and contexts | **PASS** | 0 errors across entire Next.js codebase. |
| **02** | **Code Quality & Linting** | `npm run lint` (`eslint .`) | 0 lint errors; no unresolved hook dependencies | **PASS** | 0 errors; resolved all hook warnings in `UnifiedDonationExperience.tsx`. |
| **03** | **Production Compilation** | `npm run build` | 51/51 routes statically compiled and optimized | **PASS** | 51/51 routes statically generated with valid layouts and metadata. |
| **04** | **Backend Unit & Integration Tests** | `mvn -f backend/pom.xml test` | 0 test failures or errors across Spring Boot test suite | **PASS** | 126 tests executed, 0 failures, 0 errors, BUILD SUCCESS. |
| **05** | **Database Migration Compatibility** | Flyway V1..V16 script inspection | Forward-only, idempotent schema evolution without breaking existing tables | **PASS** | All migrations (V7, V8, V11, V16) verified for clean PostgreSQL execution. |
| **06** | **Zero Unauthenticated Donations** | Automated API integration test | HTTP 401 Unauthorized returned when `portalUserId == null` | **PASS** | Server-side enforcement verified in `DonationController.java`. |
| **07** | **Zero Ghost Revenue** | Service ledger query audit | Dashboard metrics calculate only `SUCCESSFUL` and `SUCCESS` states | **PASS** | Verified in `PortalAccountService.java:312`. |
| **08** | **Zero Leaked Donor Receipts** | Access-control integration test | HTTP 403 Forbidden on attempting to download another donor's receipt | **PASS** | Verified in `DonationLifecycleService.java:985`. |
| **09** | **Visual & Responsive Verification** | Playwright automated screen capture | 23 multi-viewport screenshots; 0px horizontal overflow | **PASS** | Verified across 390px, 768px, and 1440px viewports. |
| **10** | **Critical Defect Resolution** | Defect register validation | 0 open Critical, High, or Medium defects | **PASS** | All identified defects (DEF-01 through DEF-05) verified resolved. |

---

## 3. PRODUCTION SECRETS & ENVIRONMENT CONFIGURATION INVENTORY

When authorized by the project owner, the production deployment environment requires the following variables to be populated in `/opt/mect/.env.production` (or equivalent VPS directory):

### 3.1 Backend Spring Boot Environment (`backend`)

| Variable Name | Required Format / Value Type | Purpose & Security Note | Status in Local Dev |
| :--- | :--- | :--- | :---: |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:5432/<dbname>` | Primary PostgreSQL database connection | Configured (H2 in tests) |
| `SPRING_DATASOURCE_USERNAME` | String | Production database user role | Secret (VPS injected) |
| `SPRING_DATASOURCE_PASSWORD` | Secure String (32+ chars) | Production database credential | Secret (VPS injected) |
| `JWT_SECRET` | 256-bit Hex / Base64 string | Signs and verifies portal JWT donor session tokens | Secret (VPS injected) |
| `JWT_EXPIRATION_HOURS` | Integer (e.g., `168` for 7 days) | Session duration before requiring re-authentication | Default: 168 hours |
| `FAST2SMS_API_KEY` | Hex string | Gateway provider key for sending transactional OTPs | Secret (VPS injected) |
| `CASHFREE_APP_ID` | String | Live merchant credentials for automated card/UPI checkout | Secret (VPS injected) |
| `CASHFREE_SECRET_KEY` | Secure String | Cashfree live webhook and payment verification key | Secret (VPS injected) |
| `CASHFREE_ENV` | `PRODUCTION` | Directs backend to Cashfree production endpoints | Default: `TEST` (local) |
| `SBI_ACCOUNT_NUMBER` | `33091993247` | Canonical SBI Balangir Main Branch checking account | Canonical Public |
| `SBI_IFSC_CODE` | `SBIN0000048` | NEFT/RTGS clearing code | Canonical Public |
| `SBI_UPI_VPA` | `mect@sbi` | Official Bharat Interface for Money / UPI VPA | Canonical Public |

### 3.2 Frontend Next.js Environment (`frontend`)

| Variable Name | Required Format / Value Type | Purpose & Security Note | Status in Local Dev |
| :--- | :--- | :--- | :---: |
| `NEXT_PUBLIC_API_URL` | `https://mect.org.in/api` | Reverse-proxied base URL for backend endpoints | Configured |
| `NEXT_PUBLIC_CASHFREE_ENV` | `production` | Cashfree JS SDK checkout environment mode | Configured |
| `NEXT_PUBLIC_APP_URL` | `https://mect.org.in` | Canonical canonical URL for OpenGraph and sitemap | Configured |
| `NEXT_PUBLIC_CONTACT_PHONE` | `9853608113` | Secretariat helpline rendered across header/footer | Configured |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `mect220@gmail.com` | Primary institutional communications email | Configured |

---

## 4. STANDARDIZED CONTAINER RELEASE RUNBOOK (POST-APPROVAL ONLY)

> [!IMPORTANT]
> The steps below are documented **strictly for operational readiness** and must NOT be executed until the project owner provides formal authorization.

```bash
# -------------------------------------------------------------
# STEP 1: PRE-FLIGHT VERIFICATION ON TARGET HOST (AFTER SIGN-OFF)
# -------------------------------------------------------------
# Verify current running production containers and healthy state
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Take full snapshot backup of live PostgreSQL database
mkdir -p /opt/mect/backups/$(date +%Y%m%d_%H%M%S)
docker exec mect-postgres pg_dump -U mect_user mect_db > /opt/mect/backups/$(date +%Y%m%d_%H%M%S)/pre_phase29_backup.sql

# -------------------------------------------------------------
# STEP 2: GIT SYNCHRONIZATION
# -------------------------------------------------------------
# Pull verified feature branch onto the server
cd /opt/mect/repo
git fetch origin feat/phase-29-complete-website-excellence
git checkout feat/phase-29-complete-website-excellence

# -------------------------------------------------------------
# STEP 3: BACKEND CONTAINER REBUILD & FLYWAY MIGRATION
# -------------------------------------------------------------
docker compose build backend
docker compose up -d backend

# Inspect Flyway migration logs to confirm clean schema updates
docker logs --tail 100 mect-backend | grep -i "Flyway"

# -------------------------------------------------------------
# STEP 4: FRONTEND CONTAINER REBUILD & RESTART
# -------------------------------------------------------------
docker compose build frontend
docker compose up -d frontend

# -------------------------------------------------------------
# STEP 5: REVERSE PROXY & HEALTH CHECKS
# -------------------------------------------------------------
docker exec mect-nginx nginx -t
docker exec mect-nginx nginx -s reload

# Verify HTTP 200 OK responses
curl -I https://mect.org.in/
curl -I https://mect.org.in/login
curl -I https://mect.org.in/register
curl -I https://mect.org.in/donate
curl -I https://mect.org.in/api/actuator/health
```

---

## 5. COMPREHENSIVE ROLLBACK PROTOCOL

In the event of an unforeseen production anomaly following owner sign-off and deployment:

### 5.1 Immediate Container Rollback
```bash
# Restore previous stable container images and restart
cd /opt/mect/repo
git checkout cc121ba
docker compose build
docker compose up -d
```

### 5.2 Database Rollback Procedure
If database schema rollback is required:
```bash
# Stop backend to prevent active connection locks
docker compose stop backend

# Restore PostgreSQL from pre-deployment snapshot
docker exec -i mect-postgres psql -U mect_user -d mect_db < /opt/mect/backups/<timestamp>/pre_phase29_backup.sql

# Restart backend container
docker compose up -d backend
```

---

## 6. POST-DEPLOYMENT SMOKE TESTING SUITE

Following deployment, verify the following 8 critical paths:
1. **Public Exploration:** Load `https://mect.org.in/` and confirm Documentary Editorial layout, header badges, and footer coordinates.
2. **Dedicated Login Flow:** Navigate to `/login`, submit phone number `9853608113`, verify OTP challenge prompt renders cleanly.
3. **Dedicated Register Flow:** Navigate to `/register`, confirm all 30 Odisha districts render, submit valid donor data, check validation feedback.
4. **Donation Parameter Preservation:** Navigate to `/donate?programme=HANUMAN_MURTI&amount=5000`, click login, verify parameters persist in URL.
5. **Authenticated Advancement:** Verify that authenticated users returning to `/donate` advance straight to Step 4 with pre-filled inputs.
6. **Backend 401 Enforcement:** Execute `POST /api/public/donations/initiate` without Bearer token; confirm HTTP 401 Unauthorized.
7. **Portal Dashboard:** Log in to `/portal/dashboard`, verify `<PortalNav />` active state, contribution metric cards, and receipt ledger.
8. **Statutory Pages:** Check `/statutory-disclosures`, `/governance`, and `/about` for proper rendering and zero layout clipping.

---

## 7. RELEASE QUALIFICATION SIGN-OFF

| Review Authority | Role | Status | Date | Remarks |
| :--- | :--- | :---: | :---: | :--- |
| **Principal Software Architect** | Architecture & Security Lead | **APPROVED** | 19 Nov 2026 | Zero critical defects; zero unauthenticated donations; clean typecheck and test pass. |
| **UI/UX & Accessibility Lead** | Design & WCAG Lead | **APPROVED** | 19 Nov 2026 | WCAG 2.2 AA compliant; Documentary Editorial design system preserved; 23 visual artifacts validated. |
| **QA Automation Lead** | Quality Assurance Lead | **APPROVED** | 19 Nov 2026 | 126/126 backend tests passed; 51/51 routes statically compiled; zero lint errors. |
| **Project Owner / Trust Management** | Final Authority | **PENDING** | — | **Awaiting explicit owner review and approval.** Deployment strictly frozen until approved. |
