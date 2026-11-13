# MECT PHASE 19 — AUTOMATED REGRESSION TEST REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** QA Automation Lead & DevOps Engineer  
**Execution Timestamp:** 2026-11-13  
**Status:** **100% REGRESSION PASS — ZERO REGRESSION FAILURES**

---

## 1. COMPREHENSIVE AUTOMATED TEST EXECUTION LOG

| Quality Gate | Exact Command Line | Exit Code | Total Tests / Routes | Passed | Failed | Skipped | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Frontend TypeScript Typecheck** | `npm run typecheck` (`tsc --noEmit`) | **0** | All source files | **100%** | 0 | 0 | **PASS** |
| **Frontend ESLint Code Quality** | `npm run lint` (`eslint .`) | **0** | All source files | **100%** | 0 | 0 | **PASS** |
| **Frontend Production Build** | `npm run build` (`next build --webpack`) | **0** | 40 Routes | **40 / 40** | 0 | 0 | **PASS** |
| **Full Site Crawler Audit** | `npm run audit:site` (`node scripts/audit-site.mts`) | **0** | 20 HTML pages, 180 fragments | **100%** | 0 | 0 | **PASS** |
| **Motion, a11y & Bundle Audit** | `npm run audit:motion` (`node scripts/audit-motion.mts`) | **0** | 18 Routes (Bundle: 312.40 KB) | **100%** | 0 | 0 | **PASS** |
| **Backend Maven Test Suite** | `mvn test -B -f backend/pom.xml` | **0** | 58 Tests | **58 / 58** | 0 | 0 | **PASS** |

---

## 2. DETAILED TEST SUITE BREAKDOWNS

### 2.1 Backend Maven Test Suite (`mvn test -B`)
- **Total Execution Time:** 01:08 min
- **Suites Executed:**
  1. `AuthenticationAndSecurityTests`: RBAC, JWT validation, brute-force lockout, account locking, password encryption.
  2. `CashfreePaymentGatewayIntegrationTests`: Order creation, webhook validation, signature checking.
  3. `DonationEcosystemIntegrationTests`: Full donation lifecycle, manual claims, receipt generation.
  4. `DonationPaymentReceiptWorkflowTests`: Idempotency, 80G tax receipt calculations, fiscal year numbering.
  5. `ScholarshipApplicationSecurityAndLockingTests`: Input validation, Aadhaar last-4 masking, optimistic locking.
  6. `VolunteerConsentAndStatusSecurityTests`: Voluntary consent declaration, role assignment, status updates.
  7. `WebhookSecurityAndDeliveryTests`: Cashfree, Razorpay, and Resend Svix signature tampering rejection.
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0

### 2.2 Site Crawler Audit (`npm run audit:site`)
- **Pages Crawled:** 20
- **Sitemap Routes Discovered:** 18
- **Fragment Links Checked:** 180
- **Broken Internal Links:** 0
- **Missing / Duplicate Titles:** 0
- **Missing Meta Descriptions:** 0
- **Canonical Mismatches:** 0
- **Multiple H1 Tags:** 0
- **Tel Hrefs with Spaces:** 0
- **Image Alt Text Issues:** 0

### 2.3 Motion & Accessibility Audit (`npm run audit:motion`)
- **Routes Checked:** 18
- **First-Load JS (Home Page):** `312.40 KB gzipped` (well under the 60 KB delta threshold against baseline 279.75 KB).
- **Reduced-Motion Verification:** 0 violations (CSS `@media (prefers-reduced-motion: reduce)` respected).
- **No-JS Content Accessibility:** 0 violations (SSR HTML conveys core institutional data).
- **Forbidden Motion Props:** 0 violations.
- **Single Animation Owner:** 0 conflicts.

