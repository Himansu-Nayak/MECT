# MECT.ORG.IN — CONTINUOUS AUDIT & FIX LOOP REPORT

**Repository:** `Himansu-Nayak/MECT`  
**Production Domain:** https://mect.org.in  
**Working Branch:** `fix/audit-loop`  
**Audit Protocol:** The Autonomous Fix Loop (P0 -> P1 -> P2 -> Truth Audit & Structural Gaps)  
**Deployment Status:** **STRICTLY ZERO PRODUCTION DEPLOYMENT** (all work confined to local branch and rendered verification suite)

---

## 1. Master Metrics Overview

> [!IMPORTANT]
> Loops 0–3 metrics for LCP, CLS, and Performance were estimates prior to live headless browser instrumentation. From Loop 4 onward, all metrics are backed by rendered Playwright, axe-core, and mobile-emulated Lighthouse execution on the production build (`http://127.0.0.1:3000`).

| Loop | Timestamp | Items Fixed / Scoped | Broken Links | Broken Anchors | Forbidden Jargon | Axe Serious+ | LCP (s) | CLS | Perf Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Loop 0** | Baseline | None | 2 | 12 | 127 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 1** | 2026-11-20T10:43:00+05:30 | P0-1, P0-2, P0-3 | 0 | 0 | 106 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 2** | 2026-11-20T10:55:00+05:30 | P0-4, P0-5, P0-6 | 0 | 0 | 99 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 3** | 2026-11-20T11:13:00+05:30 | P1-1, P1-2, P1-3 | 0 | 0 | 96 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 4** | 2026-11-20T13:30:00+05:30 | Part A Gate, P1-4, P1-5, P1-6 | 0 | 0 | 0 | **0** | **1.2s–1.6s** | **0.000–0.001** | **80–95** |
| **Loop 5** | 2026-11-20T14:54:00+05:30 | P1-7, P1-8, P1-9, P1-10, P2 items | 0 | 0 | 0 | **0** | **1.2s–2.4s** | **0.001–0.002** | **68–82** |
| **Loop 6** | 2026-11-20T16:59:00+05:30 | A1–A7, B1, B4–B6, B2–B3 (Truth Audit & Hardening) | **0** | **0** | **0** | **0** | **1.2s–1.4s** | **0.000–0.011** | **92–99** |

---

## 2. Register Mapping Table (P0-1 through P2-7)

Every requirement from the Autonomous Fix Loop Register mapped directly to its implementing git commit(s) on `fix/audit-loop`:

| Item ID | Classification & Title | Implementing Commit(s) | Status | Verification Summary |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | Unify legacy pages into modern layout & statutory strip | [`212ef5e`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Verified in Part 2 layout uniformity (100% across all audited routes). |
| **P0-2** | Rebuild programmes page with verified anchor sections | [`b784a8e`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`c174f78`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | 7 canonical IDs `#education`, `#women-empowerment`, `#sports-extracurricular`, `#water`, `#food-relief`, `#community-welfare`, `#higher-education` verified with 1251–1304 chars authentic copy. |
| **P0-3** | Reconcile institutional facts, eliminate gateway wording | [`b5ff1bf`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`f044ddb`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`5409cce`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`14a1645`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Bank details single-sourced in `src/config/org.ts`. Online checkout copy eradicated. |
| **P0-4** | Apply neutral statutory tax wording across disclosures | [`1ad0159`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | All 50%/100% tax claims replaced with neutral statutory eligibility text. |
| **P0-5** | Server-render /donate with SBI transfer, UPI details, claim form | [`3220294`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`b459bc9`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`9137dc1`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Verified with No-JS Playwright check; native inputs and UPI QR visual card rendered. |
| **P0-6** | Balance announcement ticker to 4 rotating items without duplicates | [`9fc2ffe`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Ticker locked to `h-[36px]` without layout shifts or duplicate DOM nodes. |
| **P1-1** | Enforce self-referencing canonicals, meta length, portal noIndex | [`071b6ba`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Verified across all 25 sitemap routes in Part 1 rendered check. |
| **P1-2** | Dynamic sitemap with real lastmod & hardened robots.txt | [`87ce7a8`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`97624e6`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Sourced from `content/lastmod.json` git commit timestamps without `new Date()` fallback. |
| **P1-3** | Validate JSON-LD structured data for NGO, breadcrumbs, FAQ | [`f875b42`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Verified JSON-LD schema parsing and absence of google-unsupported fields. |
| **P1-4** | Optimize images, sizes attributes, eliminate layout shifts | [`9a2f7d0`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | LCP reduced to 1.2s–1.4s, CLS reduced to 0.000–0.011 across all mobile audits. |
| **P1-5** | Complete media inventory and harden hero image container | [`964bb02`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Registered in `audit/PHOTO_INVENTORY.md` and `OWNER_DECISIONS.md`. |
| **P1-6** | Build authentic field dispatches with real dates and schema | [`e44c1b5`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`75dad0f`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Restored 3 authentic historical dispatches (`classroom`, `workshop`, `water-point`); unverified stories purged. |
| **P1-7** | Multi-year reports table FY2021-25 with real download/inspection slots | [`d3e62ac`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`328f0a7`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Synthetic PDFs removed; links point to on-page summaries and inspection requests; FY2024-25 is "Pending". |
| **P1-8** | Plain-language copy pass and eliminate fiduciary jargon | [`4ebfb4d`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Rendered DOM verified 0 user-facing occurrences of "fiduciary". |
| **P1-9** | Odia language toggle with community translation strings | [`53fe929`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`110f15f`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Gated behind `NEXT_PUBLIC_ENABLE_ODIA="true"` (default off); statutory terms guardrail enforced. |
| **P1-10** | Error handling boundaries, branded 404, and 500 error page | [`c594197`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`b459bc9`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | `src/app/not-found.tsx`, `src/app/error.tsx`, and `/500` route created and verified. |
| **P2-1** | Scholarships honesty and inquiry desk routing | [`0cacd94`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Zero dead clicks; prospective applicant inquiry desk routing verified. |
| **P2-2** | Archival photo inventory and documentation | [`0cacd94`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Registered in `audit/PHOTO_INVENTORY.md` with illustrative replacements logged. |
| **P2-3** | Rename chatbot to Ask MECT with statutory disclaimer | [`0cacd94`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | `Ask MECT` branded with explicit statutory advisory notice. |
| **P2-4** | Newsletter subscription feature | — | **BLOCKED** | **Blocked by Trust editorial policy:** MECT operates strictly by public statutory notices, official gazette disclosures, and direct donor inquiries. No bulk marketing newsletter exists. Documented in `OWNER_DECISIONS.md`. |
| **P2-5** | Contact page phone, secretariat hours, and verified form | [`0cacd94`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`4f4b678`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`2c9b9d5`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Reset to authentic live helpline `+91 94371 23616`; built real rate-limited inquiry form with honeypot & proxy support. |
| **P2-6** | CSR partnerships direct proposal submission | [`0cacd94`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Dedicated CSR desk routing with verified statutory documentation. |
| **P2-7** | Production deployment checklist with real compose services | [`ad7c21e`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md) | **FIXED** | Built in `docs/DEPLOYMENT_CHECKLIST.md` referencing real production services from `compose.production.yaml`. |

---

## 3. Honest Metrics Table (Mobile Emulation & Axe-Core)

Audited against the production Next.js 16 build (`http://127.0.0.1:3000`) under simulated mobile CPU throttling (4x slowdown) and Slow 4G network profile via Google Chrome Lighthouse and axe-core 4.14:

| Route | Performance Score | Accessibility Score | SEO Score | LCP (s) | CLS | INP | Axe Serious+Critical | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`/` (Homepage)** | **92** | **100** | **100** | **1.2 s** | **0.000** | N/A | **0** | **PASS** |
| **`/programmes`** | **98** | **100** | **100** | **1.4 s** | **0.000** | N/A | **0** | **PASS** |
| **`/donate`** | **96** | **100** | **100** | **1.2 s** | **0.000** | N/A | **0** | **PASS** |
| **`/about`** | **99** | **100** | **100** | **1.2 s** | **0.001** | N/A | **0** | **PASS** |
| **`/scholarships`** | **98** | **100** | **100** | **1.2 s** | **0.011** | N/A | **0** | **PASS** |
| **`/contact`** | **98** | **100** | **100** | **1.2 s** | **0.000** | N/A | **0** | **PASS** |

### Additional Routes Verified via Axe-Core 4.14:
- `/stories`: **0** serious/critical violations (0 total)
- `/reports`: **0** serious/critical violations (0 total)
- `/statutory-disclosures`: **0** serious/critical violations (0 total)

*All 6 core routes surpass all project thresholds: Performance >= 90 (achieved 92–99), Accessibility = 100, SEO = 100, LCP < 2.5s (achieved 1.2s–1.4s), CLS < 0.1 (achieved 0.000–0.011), Axe Serious+Critical = 0.*

---

## 4. Loop 6 Truth Audit & Structural Gaps Execution Log

### Part A: Things That Must Be Correct or Removed

#### A1. Bank & UPI Credentials Reconciliation
- **Forensic Git Provenance:**
  - `git log -p -S"43849182390"` returned 0 commits in the codebase (it was an errant number in audit report prose).
  - `git log -p -S"33341302498"` revealed introduction in commit `ea4ab59` (March 8, 2026), matching the live authenticated account at `mect.org.in`.
  - Legacy `33091993247` introduced in `b5ff1bf` was completely eradicated.
- **Code Fix:** Single-sourced all banking credentials in `src/config/org.ts`:
  - Account Holder: `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
  - Bank: `State Bank of India`
  - Account Number: `33341302498`
  - IFSC Code: `SBIN0001701`
  - Branch: `Rajendra College Square, Bolangir`
  - UPI ID: `86971610172@sbi`
- **Disclosures Page:** Removed lingering "encrypted online gateways" copy in `src/app/statutory-disclosures/page.tsx` and aligned account details.
- **Owner Action:** Physical passbook verification notice pinned as line 1 of `OWNER_DECISIONS.md`.
- **Commits:** [`5409cce`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`14a1645`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A2. Field Stories & Beneficiary Quotes Restoration
- **Code Fix:** Reverted synthetic unverified dispatches (`arogya-health-camp-rayagada`, `scholarship-distribution-fy2024`, `emergency-relief-2024`) and all instances of `[Name withheld for privacy]`. Restored the original authentic field dispatches from historical commit `a142b1b`:
  - `/stories/classroom`: The Balangir Community Classroom.
  - `/stories/workshop`: The Puintala Skills Workshop.
  - `/stories/water-point`: The Western Odisha Heatwave Water Point (with explicit note: "service instances, not unique-person census").
- **Owner Registry:** Added Section 6 ("Needs a documentary source before publishing") in `OWNER_DECISIONS.md`.
- **Commit:** [`75dad0f`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A3. PDF Annual Reports Cleanup
- **Code Fix:** Deleted generated synthetic PDFs (`public/reports/*.pdf`) and script `scripts/generate_report_pdfs.mjs`. Updated `AnnualReportsYearTable.tsx` and `ReportsLibrarySection.tsx` so rows link to on-page summaries and physical inspection requests. FY 2024-25 remains marked "Pending". Unticked historical PDF checkmarks in `OWNER_DECISIONS.md`.
- **Commit:** [`328f0a7`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A4. Developer Credit Alignment
- **Code Fix:** Aligned `src/components/Footer.tsx` with the About page wording: *"Website developed by Himansu Nayak"*. Removed dead bot-blocked LinkedIn profile link (`linkedin.com/in/himansun`) from `about-content.ts` and `DeveloperCreditCard.tsx`.
- **Commit:** [`4776bf6`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A5. Contact Page Phone & Real Contact Form
- **Code Fix:** Reset helpline globally to verified live number `+91 94371 23616` across `src/config/org.ts`, `content/org.ts`, `about/page.tsx`, `faq/page.tsx`, `login/page.tsx`, `register/page.tsx`, and `mect-knowledge.ts`. Removed dead/unverified WhatsApp link.
- **Form Implementation:** Built `src/app/api/contact/route.ts` with:
  - Hidden honeypot `_gotcha` field.
  - In-memory rate limiting (5 requests / 60 seconds per IP with proxy header support).
  - Validation: `fullName` (>= 2 chars), valid email regex, Indian phone (10 digits / +91), category in `[General, Grievance, RTI, CSR, Scholarship, Volunteer]`, message max 1000 characters.
  - Proxy to backend `http://127.0.0.1:8081/public/inquiries` with fallback ticket generation `MECT-INQ-YYYYMMDD-XXXX`.
  - Full `<noscript>` fallback and 1000-character counter in `src/app/contact/page.tsx`.
- **Commits:** [`4f4b678`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md), [`2c9b9d5`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A6. Donation Claim API Wording & Database Schema Documentation
- **Code Fix:** Updated `src/app/api/donations/claim/route.ts` response to return status `"UNVERIFIED"` and canonical message:
  `"Claim received. Reference: {claimReference}. The Trust will check your transfer against its bank records before issuing a receipt."`
- **Documentation:** Documented backend table `sbi_donation_claims` (`claim_id`, `claim_reference`, `donor_name`, `donor_email`, `donor_phone`, `amount`, `utr_reference`, `bank_branch`, `status`, `reconciled_by`, `reconciled_at`, `created_at`), in-memory rate limiter reset notes, and proxy IP resolution.
- **Testing:** Rendered test suite confirmed status 200, status `UNVERIFIED`, canonical wording, burst 6th request 429, and independent client IP counters.
- **Commit:** [`9137dc1`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### A7. Programme Anchor IDs
- **Code Fix:** Purged legacy `#hunger-relief` and `#pillars` everywhere in `src/`. Enforced the 7 canonical IDs: `#education`, `#women-empowerment`, `#sports-extracurricular`, `#water`, `#food-relief`, `#community-welfare`, `#higher-education`.
- **Testing:** Playwright assertion verified all 7 IDs exist on `/programmes` with authentic non-empty content (1251–1304 characters each).
- **Commit:** [`c174f78`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

---

### Part B: Structural Gaps Addressed

#### B1. UPI QR Component, Client Error Boundary & 500 Page
- Built `src/components/donation/UpiQrCard.tsx` with QR code visualization, deep link `upi://pay?pa=86971610172@sbi&pn=MAHAVEER%20EDUCATIONAL%20%26%20CHARITABLE%20TRUST`, one-click copy, and payment instructions.
- Created `src/app/error.tsx` (Next.js 500 client error boundary) with Home, Programmes, Donate, Contact links and retry action.
- Created `src/app/500/page.tsx` (`/500` route) with `robots: noindex`.
- **Commit:** [`b459bc9`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### B4. Dynamic Sitemap Lastmod from Git Commit Timestamps
- Created `scripts/generate_lastmod.mjs` and committed `content/lastmod.json` containing real git commit timestamps for all 25 routes.
- Updated `src/app/sitemap.ts` to source from `content/lastmod.json` when git binary is unavailable in containerized production environments, eliminating `new Date()` fallback.
- **Commit:** [`97624e6`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### B5. Odia Language Toggle Gating
- Gated `LanguageToggle` and `LanguageContext` behind `process.env.NEXT_PUBLIC_ENABLE_ODIA === "true"` (default off until Trust review).
- Guardrails in translation helper `t()` enforce that statutory, tax, governance, and deed terms always remain in English regardless of toggle state.
- **Commit:** [`110f15f`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

#### B6. Production Deployment Checklist
- Authored `docs/DEPLOYMENT_CHECKLIST.md` using parameterized variables (`<VPS_HOST>`, `<DEPLOY_USER>`, `<APP_DIR>`, `<BACKUP_DIR>`).
- Sourced real container names and services from `compose.production.yaml`: `mect-postgres`, `mect-backend`, `mect-frontend`, `mect-network`, and named volumes.
- Defined 4 strict pre-flight gates, database dump/restore runbooks, and rollback procedures.
- **Commit:** [`ad7c21e`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR TRUST/audit/REPORT.md).

---

## 5. Deployment Confirmation

**Strict Compliance with Non-Negotiable Instructions:**
- **No production deployment has occurred.**
- The production server at `200.97.161.128` remains untouched.
- All verification was conducted on local production builds (`npm run build && next start -p 3000`).
- The branch `fix/audit-loop` is ready for review and pull request.
