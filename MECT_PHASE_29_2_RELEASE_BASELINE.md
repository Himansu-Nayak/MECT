# MECT PHASE 29.2 — REPOSITORY AND RELEASE BASELINE
## Baseline Forensic Verification, Working Tree Inspection, Migration Index & Dependency State

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/phase-29-complete-website-excellence`  
**Starting Commit Baseline:** `bf107a1`  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Execution Mode:** Autonomous Forensic Audit, Defect Remediation & Release Qualification  
**Production Freeze:** **STRICT ENFORCEMENT** (Zero VPS connections, zero SSH executions, zero Docker alterations, zero remote pushes).  

---

## 1. GIT REPOSITORY & BRANCH STATUS

| Property | Value / Verification Result | Forensic Confirmation |
| :--- | :--- | :--- |
| **Current Branch** | `feat/phase-29-complete-website-excellence` | Verified via `git status` |
| **Current Local HEAD** | `bf107a1ba7bce7411df8a6cb19c385966fe31c24` | `feat(mect): complete phase 29.1 forensic audit and acceptance readiness` |
| **Parent Commit** | `cc121ba` | `docs(phase-28): complete full deliverables suite...` |
| **Working Tree State** | Pristine / Clean | 0 uncommitted changes, 0 untracked files |
| **Remote Sync State** | Frozen Locally | No unapproved pushes to remote `origin` |

### Recent Commit Ancestry:
```
* bf107a1 (HEAD -> feat/phase-29-complete-website-excellence) feat(mect): complete phase 29.1 forensic audit and acceptance readiness
* cc121ba docs(phase-28): complete full deliverables suite (database migration, security audit, accessibility, performance, deployment readiness)
* e760cec feat(phase-29): complete website excellence, premium authentication and donor portal suite
* 40b8cae feat(phase-28): complete premium donor authentication, 6-step donation experience, and reports
* 0f58118 feat(phase-28): enforce mandatory donor authentication on donation initiation and update schema V16
* 85bfe1a feat(phase-27-1): final excellence audit, hd validation, performance and production readiness
```

---

## 2. PHASE 29.1 IMPLEMENTATION DELTA & REGRESSION CHECK

Phase 29.1 remediated 5 defects (DEF-01 through DEF-05) and generated the forensic review suite:

### 2.1 Code Changes in Phase 29.1:
1. `src/app/login/page.tsx`: Added telephone input normalisation to strip leading `+91` or `91` prefixes when pasted, preventing 12-digit format rejections.
2. `src/app/register/page.tsx`: Added identical phone normalisation logic for registration form.
3. `src/app/portal/dashboard/page.tsx`: Updated unauthorized redirect target from legacy `/portal/login` to direct `/login?next=/portal/dashboard`.
4. `src/app/portal/profile/page.tsx`: Direct redirect target updated to `/login?next=/portal/profile`.
5. `src/app/portal/welcome/page.tsx`: Direct redirect target updated to `/login?next=/portal/welcome`.
6. `src/context/PortalAuthContext.tsx`: `logout()` now transitions directly to `/login`.
7. `src/lib/config.ts`: Header link updated to `/login`.

### 2.2 Regression Verification:
- **Static Compilation:** `npm run typecheck` passes with 0 errors.
- **Code Linting:** `npm run lint` passes with 0 errors.
- **Production Build:** `npm run build` statically compiles all 51 routes.
- **Backend Tests:** `mvn -f backend/pom.xml test` executes 126 tests with 0 failures and 0 errors.
- **Regression Finding:** No regressions were introduced by Phase 29.1 code modifications.

---

## 3. DATABASE MIGRATION BASELINE (FLYWAY V1..V16)

The backend database schema is managed via Flyway with 16 versioned migrations in `backend/src/main/resources/db/migration/`:

| Version | Migration Script Name | Primary Schema Scope |
| :--- | :--- | :--- |
| **V1** | `V1__initial_schema.sql` | Core schema, initial entities |
| **V2** | `V2__auth_and_audit_schema.sql` | Administrative authentication, audit logging |
| **V3** | `V3__volunteer_consent_and_district.sql` | Volunteer enrollment and district mapping |
| **V4** | `V4__volunteer_consent_integrity.sql` | Volunteer legal consent checks |
| **V5** | `V5__volunteer_optimistic_locking.sql` | Optimistic locking on volunteer records |
| **V6** | `V6__scholarship_applications_schema.sql` | Student scholarship application workflow |
| **V7** | `V7__portal_users_and_otp_schema.sql` | `portal_users` entity, `donor_otps` table |
| **V8** | `V8__donations_payments_and_receipts_schema.sql` | `donations`, `payments`, `receipts` core financial tables |
| **V9** | `V9__notification_outbox_schema.sql` | Asynchronous transactional notification queue |
| **V10** | `V10__cashfree_payment_gateway_schema.sql` | Cashfree order IDs and transaction references |
| **V11** | `V11__donation_ecosystem_cms_and_rbac.sql` | RBAC roles and CMS dynamic donation causes |
| **V12** | `V12__him_payment_gateway_schema.sql` | Gateway fallback structures |
| **V13** | `V13__public_documents_library_schema.sql` | Public statutory PDF repository tables |
| **V14** | `V14__hanuman_murti_and_campaigns_schema.sql` | Dedicated monument and cultural campaign tables |
| **V15** | `V15__sanitize_public_donation_instructions.sql` | Clean up legacy unauthenticated instruction strings |
| **V16** | `V16__donor_authentication_and_district_schema.sql` | Explicit `portal_user_id` foreign keys and Odisha district enums |

All migrations are forward-only, idempotent, and testable against PostgreSQL and in-memory H2.

---

## 4. ARCHITECTURAL & DEPENDENCY OVERVIEW

### 4.1 Frontend Architecture (`frontend`)
- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS, Lucide React icons, Framer Motion animations.
- **Design Language:** Documentary Editorial (Archival Parchment `#FAF7F2`, Carbon Basalt `#0F1714`, Terracotta `#B85D3B`, Deep Fiduciary Ochre `#C4924A`, Lora serif).
- **Public Routes:** 51 statically prerendered routes (`/`, `/about`, `/programmes`, `/impact`, `/donate`, `/login`, `/register`, `/portal/*`, etc.).

### 4.2 Backend Architecture (`backend`)
- **Framework:** Spring Boot 3.3.5, Java 21, Spring Security 6.
- **Authentication:** JWT Bearer token authentication + mobile OTP via transactional SMS gateway.
- **Database Access:** Spring Data JPA / Hibernate, Flyway migration management.
- **Payment Modules:** Cashfree PG REST integration + SBI manual NEFT/RTGS UTR submission.
- **Receipt Engine:** Cryptographically sealed PDF generation with SHA-256 digital seals.

---

## 5. BASELINE SUMMARY CONCLUSION

The working tree at commit `bf107a1` on branch `feat/phase-29-complete-website-excellence` is verified as healthy, stable, and completely documented. Phase 29.2 will proceed directly to deep forensic auditing across authentication security, donor privacy, statutory integrity, payment flows, database safety, full regression, and infrastructure readiness.
