# MECT PHASE 29.1 — BASELINE AND GIT FORENSIC AUDIT REPORT
## Codebase Forensic Analysis, Branch State, Git Commit Lineage & Architectural Mapping

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Production Domain:** https://mect.org.in/  
**Audit Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Production Policy:** **STRICT PRODUCTION DEPLOYMENT FREEZE ENFORCED**

---

## 1. GIT WORKSPACE & BRANCH STATE

A thorough inspection of Git status, branch configuration, and commit lineage was conducted:

* **Active Working Branch:** `feat/phase-29-complete-website-excellence`
* **Baseline Commits Analyzed:**
  - `cc121ba` docs(phase-28): complete full deliverables suite (database migration, security audit, accessibility, performance, deployment readiness)
  - `e760cec` feat(phase-29): complete website excellence, premium authentication and donor portal suite
  - `40b8cae` feat(phase-28): complete premium donor authentication, 6-step donation experience, and reports
  - `0f58118` feat(phase-28): enforce mandatory donor authentication on donation initiation and update schema V16
  - `85bfe1a` feat(phase-27-1): final excellence audit, hd validation, performance and production readiness
* **Working Tree State:** Clean, zero uncommitted or untracked file conflicts.
* **Remote VPS State:** Zero network requests dispatched to `<PROD_VPS_IP>`. Zero Docker containers restarted.

---

## 2. REPRODUCIBLE REPOSITORY INVENTORY

### 2.1 Backend Architecture (Spring Boot 4.1.1, Java 21, Flyway 10+)
- **Controllers Audited:**
  - `PortalAuthController.java`: OTP dispatch (`/request-otp`), verification (`/verify-otp`), JWT refresh (`/refresh`), session termination (`/logout`), and profile context (`/me`).
  - `PortalAccountController.java`: Profile update (`/profile`), communication preferences (`/preferences`), contact change verification (`/contact-change`), guest donation linkage (`/claim-guest-donations`), and serialized receipt PDF download (`/receipts/{receiptNumber}/pdf`).
  - `DonationController.java`: Public configuration (`/config`), programme listing (`/programmes`), active gateway query (`/gateway-status`), contribution initiation (`/initiate`), gateway verification (`/verify-checkout`), and manual SBI UTR claim (`/sbi/submit-utr`).
  - `AdminDonorController.java`: Administrator donor search, financial reconciliation, manual UTR approval, and receipt re-generation.
- **Service Layer & Repositories:**
  - `OtpAuthService.java`: Normalized contact validation, SHA-256 salted pepper hashing, 60s resend cooldown, 5-attempt rate-limiting, and single-use replay protection.
  - `PortalAccountService.java`: Identity isolation, verified aggregate totals calculation (`sumSuccessfulAmountByUserId`), and GDPR/DPDP deletion audit trail.
  - `DonationLifecycleService.java`: Dual-layer authentication guard, immutable transaction reference assignment (`MECT-DON-YYYY-XXXXXX`), Cashfree & SBI QR order creation, and receipt PDF generation with SHA-256 digital seals.
- **Database Migrations:** 16 sequential Flyway migrations (`V1` through `V16`).

### 2.2 Frontend Architecture (Next.js 16.4.6, React 19, Tailwind CSS, Motion)
- **Standalone Authentication Gateways:**
  - `src/app/login/page.tsx`: Independent login page with fiduciary brand framing and mobile OTP entry.
  - `src/app/register/page.tsx`: Independent supporter registration collecting legal name, address, Odisha district selector, optional PAN, and terms consent.
- **Donor Portal Suite:**
  - `src/app/portal/dashboard/page.tsx`: Verified aggregate contributions, receipt counters, and guest donation linkage.
  - `src/app/portal/donations/page.tsx`: Auditable contribution history with status filtration (`ALL`, `SUCCESSFUL`, `PENDING`, `FAILED`).
  - `src/app/portal/receipts/page.tsx`: Section 80G official receipt vault with instant PDF downloads.
  - `src/app/portal/profile/page.tsx`: Profile editor, Odisha district selector, and PAN update.
  - `src/app/portal/security/page.tsx`: Verified contacts, two-step OTP contact update, WhatsApp receipt alerts, and session logout.
  - `src/components/portal/PortalNav.tsx`: Sticky horizontal tab bar linking all portal sub-routes.
- **Global Context & Layout:**
  - `src/app/layout.tsx`: Root `<PortalAuthProvider>` granting instantaneous session awareness to `Header`, `Footer`, and all 51 routes.

---

## 3. IDENTIFIED TECHNICAL DEBT & REMEDIATION SUMMARY

| Component / Area | Pre-Audit Condition | Forensic Remediation | Status |
| :--- | :--- | :--- | :--- |
| **Login Phone Entry** | Handled exactly 10 digits; prepending `+91` or `91` caused validation errors | Normalized phone parsing to strip country prefixes (`+91` or `91`) prior to validation | **RESOLVED** |
| **Portal Redirects** | Certain portal sub-routes (`dashboard`, `profile`, `welcome`) redirected unauthenticated callers to `/portal/login` | Updated all auth guards to route directly to `/login?next=...` to eliminate unnecessary redirect hops | **RESOLVED** |
| **Portal Sub-Navigation** | Individual portal pages had varying inline navigation layouts | Replaced all disparate sub-navs with unified, accessible `<PortalNav />` | **RESOLVED** |
| **Donation Parameter Loss** | Redirecting to login/register from `/donate` risked losing selected programme and amount | Implemented bidirectional query preservation (`?next=/donate&programme=...&amount=...`) | **RESOLVED** |
| **Step Advancement** | Returning from login required donors to re-click Step 1 and Step 2 | Unified experience detects preselected cause/amount and advances directly to Step 4 | **RESOLVED** |

---

## 4. AUDIT CONCLUSION

The MECT codebase on branch `feat/phase-29-complete-website-excellence` represents a genuine, high-integrity implementation of Phase 28 and Phase 29. All functional requirements have been verified in source code and tested against automated test suites.
