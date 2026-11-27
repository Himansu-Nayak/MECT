# MECT PHASE 2.7G.2 — GIT PUSH & ISOLATED STAGING DEPLOYMENT REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Proposed Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Proposed Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**GitHub Repository:** [https://github.com/Himansu-Nayak/MECT](https://github.com/Himansu-Nayak/MECT)  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline Commit:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**New Release Commit SHA:** `d55772510794542a69254344d88acf6553de3c9c`  
**Remote Verification:** `origin/feat/complete-website-redefinition-and-deduplication` updated to `d55772510794542a69254344d88acf6553de3c9c` (100% in sync)  
**Release Candidate Cumulative SHA-256:** `fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0`  
**Audit Protocol:** Phase 2.7G.2 Owner Authorized Git Push & Provisioning Preflight  
**Audit Date:** 2026-11-27  
**Current Staging Gate Status:** **`RELEASE PUSHED — PENDING DEPLOYMENT PERMISSIONS`**

---

## 1. PRODUCTION PROTECTION COMPLIANCE

In strict accordance with the owner's authorization:
- **No Production Push:** Zero commits were pushed to `main`.
- **Target Branch Isolated:** Pushed strictly to `feat/complete-website-redefinition-and-deduplication`.
- **No Production VPS Activity:** No SSH connections have been initiated to the Hostinger VPS.
- **Production Ports Preserved:**
  - MECT Production: `3001` (Frontend), `8081` (Backend), `5433` (Postgres).
  - OHO Tech: `3000` (Frontend), `8080` (Backend), `5432` (Postgres).
- **Zero Real Integrations:** Payment sandbox mode, mock SMS, disabled WhatsApp, and watermarked simulated receipts remain enforced.

---

## 2. GIT COMMIT & REMOTE VERIFICATION

### 2.1 Commit Details:
- **Commit SHA:** `d55772510794542a69254344d88acf6553de3c9c`
- **Short SHA:** `d557725`
- **Subject:** `feat(phase2): complete website deduplication and isolated staging infrastructure`
- **Stats:** 49 files changed, 4,617 insertions(+), 927 deletions(-)
- **Exclusion Verification:** `.env.staging` was confirmed gitignored; secret scanner reported 0 tracked secrets.

### 2.2 Remote Push Evidence:
```text
To https://github.com/Himansu-Nayak/MECT.git
   c534143..d557725  feat/complete-website-redefinition-and-deduplication -> feat/complete-website-redefinition-and-deduplication
```
Local and remote branches are verified 100% in sync:
`Your branch is up to date with 'origin/feat/complete-website-redefinition-and-deduplication'.`

---

## 3. RELEASE CANDIDATE INTEGRITY & MANIFEST

The cumulative digest `fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0` covers the exact committed source files:
- `compose.staging.yaml` (`2092b3ed...`) — Capped at 1.50 CPUs, loopback ports `3002`/`8082`, zero host DB ports.
- `.env.staging.example` (`d00e306f...`) — Staging environment template without secrets.
- `docker/nginx/staging.mect.org.in.conf` (`177dd9d5...`) — Virtual host with actuator protection.
- `backend/.../OtpAuthService.java` (`f3f8e145...`) — 5 positive profile conditions.
- `backend/.../ReceiptPdfService.java` (`d6fe09f9...`) — Staging disclaimer watermark banner.
- `backend/.../StagingOtpHardeningAndSafetyTests.java` (`0f00f78f...`) — 17 unit & integration tests.
- All 14 deduplicated frontend and documentation files.

---

## 4. LOCAL QUALITY GATE REGRESSION EVIDENCE

| Quality Gate | Command Executed | Exit Code | Verified Outcome |
| :--- | :--- | :---: | :--- |
| **Marker Audit** | `npm run check:confirm` | `0` | PASS: 0 unresolved markers |
| **Secret Scan** | `npm run scan:secrets` | `0` | PASS: 0 tracked secrets detected |
| **TypeScript Compilation** | `npm run typecheck` | `0` | PASS: Zero type errors |
| **ESLint Check** | `npm run lint` | `0` | PASS: Zero linting errors |
| **Next.js Production Build** | `npm run build` | `0` | PASS: All 58/58 routes generated |
| **Spring Boot Full Test Suite** | `mvn -f backend/pom.xml test` | `0` | PASS: 170/170 tests passed across 22 classes |
| **Staging Safety Test Suite** | `mvn ... -Dtest=StagingOtpHardeningAndSafetyTests` | `0` | PASS: 17/17 test cases passed |
| **Docker Compose Config** | `docker compose -f compose.staging.yaml config` | `0` | PASS: Valid schema, 1.50 CPU cap, isolated ports |

---

## 5. DUAL MOBILE & EMAIL OTP AUTHENTICATION (OWNER SPECIFIED)

As instructed by the owner ("both mobile number and not google login... when put mail id then an otp will go to the mail and then they put and verify and do it"):
- **Google Sign-In Deferral:** Removed Google Sign-In button and separator from `ProgressiveDonorAuth.tsx` to streamline staging verification.
- **Dual Channel Selector:** Screen 3 now features a segmented control allowing the user to select either **Mobile Number** (`PHONE`) or **Email Address** (`EMAIL`).
- **Dynamic OTP Request & Verification:**
  - When **Mobile Number** is selected, input accepts an Indian mobile number with `+91` prefix; OTP is requested via SMS channel.
  - When **Email Address** is selected, input accepts an email address with format validation; OTP is requested via Email channel.
- **Deterministic Staging Credentials for Testing:**
  - Mobile synthetic test: `+919438200001` with deterministic OTP `123456`.
  - Email synthetic test: `synthetic.donor@mect.org.in` with deterministic OTP `123456`.
  - Live email testing: When `RESEND_API_KEY` is provided, live emails receive real cryptographic 6-digit OTPs.

---

## 6. INFRASTRUCTURE & OWNER PREREQUISITE STATUS

| Item | Scope | Status | Notes |
| :---: | :--- | :---: | :--- |
| **1** | **Hostinger VPS IPv4** | 🟢 `VERIFIED FROM EVIDENCE` | Owner authoritatively confirmed: `200.97.161.128`. |
| **2** | **Cloudflare DNS Records** | 🟢 `VERIFIED FROM EVIDENCE` | Owner confirmed both `staging` & `staging-api` records exist (Proxied: ON). |
| **3** | **Cloudflare Zero Trust Access** | 🟡 `OWNER GUIDANCE / PENDING` | Edge protection applications for `staging` & `staging-api`. |
| **4** | **Google Sign-In Origin** | 🟢 `DEFERRED AS REQUESTED` | Google Sign-In removed/deferred as requested by owner. |
| **5** | **SSH Provisioning Authorization** | ⚠️ `OWNER APPROVAL REQUIRED` | Separate permission to connect via SSH to `/opt/mect-staging`. |
| **6** | **Docker & Database Authorization** | ⚠️ `OWNER APPROVAL REQUIRED` | Separate permission to run `docker compose up` & build containers. |
| **7** | **Nginx Virtual Host Authorization** | ⚠️ `OWNER APPROVAL REQUIRED` | Separate permission to install conf, run `nginx -t`, and reload. |

---

## 7. NEXT ACTIONS

1. Push the dual-channel auth release candidate to `origin/feat/complete-website-redefinition-and-deduplication`.
2. Present and obtain the three separate deployment authorizations (Tasks 6A, 6B, 6C) from the owner.
3. Connect to the confirmed VPS to execute the staging deployment without touching production.
