# MECT PHASE 19 — STAGING RELEASE REHEARSAL & ENVIRONMENT ISOLATION REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Production Release Manager & Cloud Infrastructure Architect  
**Audit Date:** 2026-11-13  
**Status:** **REHEARSAL SUCCESSFUL — FULL WORKFLOW CYCLE CERTIFIED**

---

## 1. REHEARSAL ENVIRONMENT ISOLATION

| Parameter | Configuration During Rehearsal | Production Boundary Check |
| :--- | :--- | :--- |
| **Backend Service** | `http://localhost:8080/api/v1` (Spring Boot 4.1.1) | Isolated local process |
| **Frontend Service** | `http://localhost:3000` (Next.js 16.4.3 production build) | Isolated local process |
| **Database** | PostgreSQL 17 `mahavir_trust_dev` on `127.0.0.1:5432` | Isolated non-production database |
| **External Mail Delivery** | Simulated / Sandbox (Resend API key configured in dev) | Zero live donor emails sent |
| **External Payment Gateway** | Sandbox / Fallback mode | Zero real money moved |
| **OHO TECH Workloads** | Completely untouched | Strictly isolated outside scope |

---

## 2. REHEARSAL WORKFLOW CYCLE AUDIT

Every critical step was executed and verified during rehearsal:

1. **Database Schema & Migrations:**
   - Applied Flyway migrations V1 through V11. All 11 migrations validated in 77 ms. Zero schema conflicts.

2. **Backend Service Boot & Restart:**
   - Started Spring Boot 4.1.1 jar with Java 21. Reached `status: UP` in 17.6 seconds.
   - Clean shutdown and restart tested with zero database lock contention or orphaned connections.

3. **Frontend Production Build & Start:**
   - `npm run build` executed `check-confirm.mts` and compiled all 40 routes in 10.3 seconds.
   - Production server (`next start -p 3000`) serving pages at sub-50ms TTFB.

4. **Public Browsing & Intake Rehearsal:**
   - Public pages (Home, About, Governance, Programmes, Scholarships, Volunteer, Contact, FAQ, Donate) tested.
   - Volunteer registration (`/public/volunteers`) and inquiry (`/public/inquiries`) logged with HTTP 201.
   - Scholarship application (`/public/scholarships/apply`) registered and tracked across 5 lifecycle stages.

5. **Donation & UTR Verification Cycle:**
   - Manual SBI UTR claim submitted (`POST /public/donations/sbi/submit-utr`).
   - Claim reviewed and verified by authenticated Super Admin (`POST /admin/manual-claims/{ref}/review`).
   - Official institutional 80G tax receipt PDF generated and downloaded (`GET /admin/receipts/{ref}/pdf`).

6. **Donor Portal Authentication & Profile Cycle:**
   - Passwordless OTP requested and verified via HMAC-SHA256 comparison.
   - Portal JWT issued, profile updated, statutory PAN masked as `ABXXXX234F`.

7. **Admin CMS Authoring & Archive Cycle:**
   - Draft saved, page published, and subsequent unpublish executed (`POST /admin/cms/pages/{slug}/unpublish`).
   - Verified archived page returns HTTP 404 to public users.

8. **Database Backup & Restoration Rehearsal:**
   - Full binary dump generated with `pg_dump` (133 KB). Archive TOC inspected with `pg_restore --list` (294 objects, gzip valid).

