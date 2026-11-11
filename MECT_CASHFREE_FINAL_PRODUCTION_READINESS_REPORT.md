# MECT — Cashfree Payment Gateway Final Production Readiness Report

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MAHAVIR-TRUST`  
**Git Branch:** `feat/multi-sector-ngo-repositioning` (live VPS backend currently at `c0d4a8a`)  
**Generated:** 2026-11-12  

---

## 1. Repository & Branch Identity
- **Verified Remote (`origin`):** `https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git`
- **Active Local Branch:** `feat/multi-sector-ngo-repositioning`
- **Scope Boundary:** All changes reside strictly inside `MAHAVIR TRUST`. Co-hosted OHO TECH services, PM2 apps (`oho_tech`), Nginx configs, and unrelated credentials were neither modified nor accessed.
- **Uncommitted Pre-Existing Workspace Changes Noted (Phase A Audit):** Prior UI/UX refinement edits (`src/app/globals.css`, `src/app/page.tsx`, `src/app/donate/page.tsx`, `src/app/statutory-disclosures/page.tsx`, `src/components/Footer.tsx`, `src/components/QuickActionDock.tsx`, `src/components/ai/HImChatbot.tsx`, `src/components/sections/*`, `MECT_*.md`, `scratch/*`, `src/*.jpg/*.jpeg`) are also currently present in the local working tree and should be intentionally reviewed/staged when preparing the release commit.

---

## 2. Existing API Credential Discovery & Security Audit
- **Files Discovered in Repository Root:**
  - `APIKey (2).csv` (`90` bytes, `2` lines / `1` comma-separated data row, containing Cashfree **Production** `_prod_` secret format; `hasTest=False`).
  - `api keys.png` (Cashfree Dashboard **Production** `AppID` / `Secret Key` screenshot).
- **Environment Classification:** Both files contain **Cashfree Production credentials**. **No Cashfree Sandbox credentials** were provided or present in the workspace.
- **Git Exclusion & History Audit (`PASS`):**
  - `git check-ignore -v "APIKey (2).csv" "api keys.png"` confirmed both files are excluded by `.gitignore` rules (`APIkey (*).CSV`, `*api*keys*.png`).
  - `git log --all --stat -- "APIKey (2).csv" "api keys.png" "*APIkey*"` confirmed zero credential CSV/screenshot commits in Git history.
- **Secret Hygiene Audit (`PASS`):**
  - Post-build scan across `src/**/*.{ts,tsx}` and `.next/static/**/*.js` returned **`0` matches** for credential variables, headers, or key prefixes.
  - Existing credentials are preserved untouched per user direction (no keys regenerated or rotated automatically).
  - **Operator Handling Rule:** After moving the existing Production keys securely into `/opt/mect/backend/.env` (`chmod 600`), delete plaintext `APIKey (2).csv` and `api keys.png` from the project workspace. Note also that because `api keys.png` and `APIKey (2).csv` existed in plaintext locally, rotating them manually in the Cashfree Dashboard remains advisable once convenient unless the operator explicitly chooses to retain them.

---

## 3. Registered Cashfree Webhook Configuration (`2023-08-01`)
Confirmed Cashfree Merchant Dashboard registration:
- **Endpoint:** `https://mect.org.in/api/v1/webhooks/payments/cashfree`
- **Webhook API Version:** `2023-08-01`
- **Retry Policy / Attempts:** `DEFAULT` / `3` retries
- **Events Enabled & Backend Event Compatibility:**
  - `SUCCESS PAYMENT` -> `PAYMENT_SUCCESS_WEBHOOK`: Validated against `order_amount`, `payment_amount`, and `INR` currency; transitions payment & donation to `SUCCESSFUL`, records `verifiedAt`, bank ref & payment group, creates single `DonationReceipt` PDF, promotes linked portal user to `ROLE_DONOR`, and enqueues email outbox confirmation.
  - `FAILED PAYMENT` -> `PAYMENT_FAILED_WEBHOOK`: Records `FAILED` status with failure reason (`payment_message` with `error_details.error_description` fallback) and failure email; never downgrades already `SUCCESSFUL` donations.
  - `USER DROPPED PAYMENT` -> `PAYMENT_USER_DROPPED_WEBHOOK`: Records `USER_DROPPED` status and reconciliation log cleanly; never downgrades settled donations.
- **Signature & Replay Verification (`CashfreePaymentGatewayService.verifyWebhookSignature`):**
  - Computes constant-time (`MessageDigest.isEqual`) Base64 `HMAC-SHA256(secret, x-webhook-timestamp + rawPayload)`.
  - Falls back cleanly to `CASHFREE_SECRET_KEY` when `CASHFREE_WEBHOOK_SECRET` is omitted/blank.
  - Rejects missing/malformed timestamps or timestamps older than `300s` (`cashfree-webhook-tolerance-seconds=300`), missing/invalid signatures (`HTTP 401`), and amount/currency tampering (`HTTP 400`).
  - Deduplicates repeated deliveries via `payment_events(provider_event_id UNIQUE)` (`HTTP 200`, `IGNORED_DUPLICATE`).

---

## 4. Backend Architecture & Safe Infrastructure Defaults
- **Safe Default Provider Preserved (`application.yml`):**
  - `app.payment.provider: ${PAYMENT_PROVIDER:RAZORPAY}` and `sandbox-mode: ${PAYMENT_SANDBOX_MODE:false}` ensure deploying this release to the VPS **does not automatically flip live payments to Cashfree or disable Razorpay** until explicitly enabled via `PAYMENT_PROVIDER=CASHFREE`.
- **Fail-Closed Credential & Environment Mismatch Guard:**
  - `CashfreePaymentGatewayService` throws `ProviderUnconfiguredException` (`HTTP 503`) if `CASHFREE_APP_ID` or `CASHFREE_SECRET_KEY` is blank **or** if `isEnvironmentMismatch()` detects a `_prod_` key with `CASHFREE_ENV=SANDBOX` or a `_test_` key with `CASHFREE_ENV=PRODUCTION`.
- **Key Backend Files:**
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/CashfreePaymentGatewayService.java`
  - `backend/src/main/java/org/mahavirtrust/backend/controller/CashfreePaymentController.java` (`/payments/cashfree/create-order`, `/payments/cashfree/status/{orderId}`, `/payments/cashfree/verify`)
  - `backend/src/main/java/org/mahavirtrust/backend/controller/WebhookController.java` (`POST /webhooks/payments/cashfree`)
  - `backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java`
  - `backend/src/main/java/org/mahavirtrust/backend/controller/AdminDonorController.java` (`GET /admin/donations` search/provider filters, `POST /admin/donations/{ref}/reconcile`, CSV gateway columns)
  - `backend/src/main/java/org/mahavirtrust/backend/security/RateLimitingFilter.java` & `SecurityConfig.java`

---

## 5. Frontend Integration (`SmartDonationCheckout` & Admin Dashboard)
- **[src/components/sections/SmartDonationCheckout.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/SmartDonationCheckout.tsx) & [src/lib/portal-api.ts](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/lib/portal-api.ts):**
  - Loads Cashfree JS SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`) dynamically with backend-supplied `checkoutEnvironment` (`sandbox` / `production`) and `paymentSessionId`.
  - Handles desktop & mobile `_modal` checkout, `?order_id=...` return URL verification strictly via backend `POST /api/v1/payments/cashfree/verify`, background polling for `PENDING`, `SUCCESSFUL` receipt panel, `USER_DROPPED`/`FAILED`/`EXPIRED` recovery + Retry button (with URL query cleanup), and preserves direct SBI Bank Transfer (`33341302498`, `SBIN0001701`) and Static SBI UPI QR (`86971610172@sbi`).
- **[src/app/admin/donors/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/admin/donors/page.tsx):**
  - Fixed `SUCCESS` vs `SUCCESSFUL` status filter bug; added `USER_DROPPED`, gateway provider filter (`CASHFREE`/`RAZORPAY`), search bar, Cashfree `cfOrderId`/`paymentGroup` display, **Verify** manual reconciliation trigger, audit history modal, PDF downloads, and CSV export (`GatewayProvider`, `GatewayOrderId`, `GatewayPaymentId`, `BankReference`).

---

## 6. Database Migration (`V10`)
- **[V10__cashfree_payment_gateway_schema.sql](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/resources/db/migration/V10__cashfree_payment_gateway_schema.sql):**
  - Non-destructively adds `cf_order_id`, `payment_session_id`, `gateway_raw_status`, `payment_group`, `bank_reference`, `verified_at` (`IF NOT EXISTS`), unique index `uq_payments_provider_order ON payments(provider, provider_order_id)`, and status lookup indexes compatible with both PostgreSQL and H2 `MODE=PostgreSQL`.
  - Preserves all existing `donations`, `payments`, `payment_events`, and `donation_receipts` records.

---

## 7. Automated Local Verification Results (Executed Post-Final-Edits)
- **Backend Compile + Maven Suite:** `mvn -f backend/pom.xml test -B` -> **`54/54` tests passed, `0` failures, `0` errors, `0` skipped** (against H2 `MODE=PostgreSQL`, Flyway `V1–V10`, Hibernate `ddl-auto: validate`, and `MockRestServiceServer`).
- **Frontend ESLint (`npm run lint`):** **`0` errors, `0` warnings**.
- **Frontend TypeScript (`npx tsc --noEmit`):** **`0` errors**.
- **Next.js Production Build (`npm run build`):** **`37/37` routes built cleanly**.
- **Playwright Desktop & Mobile E2E (`node scratch/verify-cashfree-donation-e2e.mjs`):** **`14/14` checks passed** (`1440×900` Desktop & `390×844` Mobile, mocked backend + SDK stub, `0` console/page errors, validation `< ₹10`, `USER_DROPPED` -> Retry -> `SUCCESSFUL`, `?order_id=` server verification, SBI fallback intact).
- **Secret Leak Scan (`Select-String` across `src/` & `.next/static/`):** **`0` matches** (`SECRET_HYGIENE_CLEAN`).

---

## 8. Live VPS, Reverse Proxy, & Production Verification Status
- **Live Read-Only Reverse-Proxy Probe on `https://mect.org.in`:**
  - `GET /api/v1/public/donations/gateway-status` returned **`HTTP 200`**: `{"provider":"RAZORPAY","configured":false,"sandboxMode":false,...}`.
  - `POST /api/v1/webhooks/payments/cashfree` (unsigned `{}`) returned **`HTTP 500 Internal Server Error`** (proving Cloudflare + Nginx route `/api/v1/webhooks/payments/cashfree` cleanly to `127.0.0.1:8081` Tomcat, where older release `c0d4a8a` is still running without Cashfree endpoints).
  - `HEAD /donate` returned **`HTTP 200`** with no restrictive `script-src` CSP blocking `https://sdk.cashfree.com/js/v3/cashfree.js`.
- **Operations Pending Explicit Authorization (`BLOCKED`):**
  1. VPS `pg_dump` backup & live `V10` migration on PostgreSQL database `mect_db`.
  2. Configuring existing Production Cashfree keys in `/opt/mect/backend/.env` (keeping `PAYMENT_PROVIDER=RAZORPAY` initially during infra rollout), removing workspace CSV/screenshot exports cleanly, and restarting `mect-backend.service` + `mect_frontend` PM2 (without touching `oho_tech`).
  3. Post-deploy probe verifying unsigned `POST https://mect.org.in/api/v1/webhooks/payments/cashfree` transitions from `HTTP 500` to **`HTTP 401`**.
  4. Controlled authorized test transaction + live signed Cashfree webhook delivery verification + live PostgreSQL row, receipt PDF, email notification, and Admin reconciliation verification.

---

## 9. Deployment Plan & Rollback Procedure
Detailed step-by-step commands (`pg_dump`, JAR backup, `/opt/mect/backend/.env`, `mvn clean package`, `systemctl restart mect-backend.service`, `npm run build`, `pm2 restart mect_frontend`, smoke tests, and instant `PAYMENT_PROVIDER=RAZORPAY` + JAR rollback) are documented in [CASHFREE_VPS_DEPLOYMENT_GUIDE.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/CASHFREE_VPS_DEPLOYMENT_GUIDE.md).

---

## 10. Final Verification Matrix

| Component | Status | Notes / Evidence |
|---|---|---|
| Repository identity | **PASS** | `Himansu-Nayak/MAHAVIR-TRUST` (`feat/multi-sector-ngo-repositioning`), `mect.org.in` |
| Existing credentials | **PASS** | Located `APIKey (2).csv` & `api keys.png` (Production `_prod_` keys; preserved, not rotated) |
| Secret hygiene | **PASS** | `.gitignore` verified, zero Git history commits, `0` matches in `src/` & `.next/static/` |
| Webhook registration | **PASS** | `https://mect.org.in/api/v1/webhooks/payments/cashfree` (`2023-08-01`, `DEFAULT`, `3` retries) |
| Event compatibility | **PASS** | `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `PAYMENT_USER_DROPPED_WEBHOOK` |
| Backend compilation | **PASS** | `124` main + `9` test Java classes compiled cleanly on Java 21 |
| Maven tests | **PASS** | `54/54` passing (`MockRestServiceServer` + `H2 MODE=PostgreSQL`) |
| TypeScript | **PASS** | `npx tsc --noEmit` (`0` errors) |
| ESLint | **PASS** | `npm run lint` (`0` errors, `0` warnings) |
| Next.js build | **PASS** | `npm run build` (`37/37` routes) |
| Database migration | **PASS (H2)** / **BLOCKED (Live PostgreSQL)** | `V10` validated on H2 PostgreSQL mode; live `mect_db` awaits authorized deploy |
| Webhook signature | **PASS** | Constant-time Base64 HMAC + `300s` replay tolerance tested in integration & unit tests |
| Actual webhook delivery | **BLOCKED** | VPS currently serves `c0d4a8a` (`HTTP 500` on unsigned POST); awaiting authorized deploy & live delivery |
| Live PostgreSQL | **BLOCKED** | Awaits authorized VPS deployment & Flyway `V10` run on `mect_db` |
| Donation checkout | **PASS (Mocked E2E)** / **BLOCKED (Live Production)** | `14/14` Playwright checks passed; live Cashfree Production checkout awaits authorized activation |
| Receipt generation | **PASS (Integration)** / **BLOCKED (Live Production)** | MockMvc verified single PDF receipt & email outbox per settlement; live test pending |
| Admin reconciliation | **PASS** | RBAC `FINANCE_OFFICER`/`TRUSTEE`/`SUPER_ADMIN`, search/filter/verify/CSV export verified |
| Payment security | **PASS** | Amount/currency tamper rejection, replay window, dedup, non-downgrade, fail-closed key mismatch |
| VPS deployment | **BLOCKED** | Deployment guide ready in `CASHFREE_VPS_DEPLOYMENT_GUIDE.md`; requires explicit authorization |
| Production activation | **BLOCKED** | Requires authorized VPS deployment, live `401` probe, explicit switch to `PAYMENT_PROVIDER=CASHFREE`, and 1 controlled live test verification |

