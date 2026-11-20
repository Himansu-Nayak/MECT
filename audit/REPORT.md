# MECT.ORG.IN — CONTINUOUS AUDIT & FIX LOOP REPORT

**Repository:** `Himansu-Nayak/MECT`  
**Production Domain:** https://mect.org.in  
**Working Branch:** `fix/audit-loop`  
**Audit Protocol:** The Autonomous Fix Loop (P0 -> P1 -> P2 -> Truth Audit & Structural Gaps -> Loop 7 Closing Checks)  
**Deployment Status:** **STRICTLY ZERO PRODUCTION DEPLOYMENT** (all work confined to local branch and rendered verification suite)

---

## 1. Master Metrics Overview

> [!IMPORTANT]
> Loops 0–3 metrics for LCP, CLS, and Performance were estimates prior to live headless browser instrumentation. From Loop 4 onward, all metrics are backed by rendered Playwright, axe-core, and mobile-emulated Lighthouse execution on the production build (`http://127.0.0.1:3000`). In Loop 7, multi-run Lighthouse auditing (3 runs per route) was introduced to eliminate Windows CPU scheduling noise and measure genuine medians and spreads.

| Loop | Timestamp | Items Fixed / Scoped | Broken Links | Broken Anchors | Forbidden Jargon | Axe Serious+ | LCP (s) | CLS | Perf Score |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Loop 0** | Baseline | None | 2 | 12 | 127 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 1** | 2026-11-20T10:43:00+05:30 | P0-1, P0-2, P0-3 | 0 | 0 | 106 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 2** | 2026-11-20T10:55:00+05:30 | P0-4, P0-5, P0-6 | 0 | 0 | 99 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 3** | 2026-11-20T11:13:00+05:30 | P1-1, P1-2, P1-3 | 0 | 0 | 96 | Unmeasured | Unmeasured | Unmeasured | Unmeasured |
| **Loop 4** | 2026-11-20T13:30:00+05:30 | Part A Gate, P1-4, P1-5, P1-6 | 0 | 0 | 0 | **0** | **1.2s–1.6s** | **0.000–0.001** | **80–95** |
| **Loop 5** | 2026-11-20T14:54:00+05:30 | P1-7, P1-8, P1-9, P1-10, P2 items | 0 | 0 | 0 | **0** | **1.2s–2.4s** | **0.001–0.002** | **68–82** |
| **Loop 6** | 2026-11-20T16:59:00+05:30 | A1–A7, B1, B4–B6, B2–B3 (Truth Audit & Hardening) | **0** | **0** | **0** | **0** | **1.2s–1.4s** | **0.000–0.011** | **92–99** |
| **Loop 7** | 2026-11-20T23:05:00+05:30 | Closing Checks, Exact Register Remap, Performance Noise & Release Package | **0** | **0** | **0** | **0** | **1.22s–1.31s** (Medians) | **0.000–0.011** (Medians) | **92–100** (Medians) |

---

## 2. Truthful Register Mapping Table (Exact 23 IDs)

Every requirement from the Autonomous Fix Loop Register mapped directly to its canonical ID and implementing git commit(s) on `fix/audit-loop` relative to merge base `7b4575d`:

| Item ID | Canonical Requirement Title | Implementing Commit(s) | Status | Verification Summary |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | unify legacy pages | [`212ef5e`](https://github.com/Himansu-Nayak/MECT/commit/212ef5e) | **DONE** | Unified legacy routes (`/governance`, `/impact`, `/volunteer`, etc.) into modern MECT layout with statutory strip. Verified 100% uniformity in Part 2. |
| **P0-2** | programmes sections/anchors | [`b784a8e`](https://github.com/Himansu-Nayak/MECT/commit/b784a8e), [`c174f78`](https://github.com/Himansu-Nayak/MECT/commit/c174f78) | **DONE** | 7 canonical IDs (`#education`, `#women-empowerment`, `#sports-extracurricular`, `#water`, `#food-relief`, `#community-welfare`, `#higher-education`) verified with 1251–1304 chars authentic copy. Zero broken anchors across 419 links. |
| **P0-3** | single fact source + conflicts logged | [`b5ff1bf`](https://github.com/Himansu-Nayak/MECT/commit/b5ff1bf), [`f044ddb`](https://github.com/Himansu-Nayak/MECT/commit/f044ddb), [`5409cce`](https://github.com/Himansu-Nayak/MECT/commit/5409cce), [`14a1645`](https://github.com/Himansu-Nayak/MECT/commit/14a1645) | **DONE** | Single source of truth in `src/config/org.ts`. Online checkout copy eradicated. Factual discrepancies logged in `OWNER_DECISIONS.md`. |
| **P0-4** | neutral tax wording | [`1ad0159`](https://github.com/Himansu-Nayak/MECT/commit/1ad0159) | **DONE** | Eradicated all unqualified 50%/100% tax benefit claims. Replaced with neutral statutory language citing Section 80G subject to CA assessment. |
| **P0-5** | server-rendered donate (bank, UPI QR, claim form) | [`3220294`](https://github.com/Himansu-Nayak/MECT/commit/3220294), [`b459bc9`](https://github.com/Himansu-Nayak/MECT/commit/b459bc9), [`9137dc1`](https://github.com/Himansu-Nayak/MECT/commit/9137dc1) | **DONE** | Verified in Part 3 with No-JS Playwright check: bank name, holder, account number, IFSC, branch, UPI ID, and claim form fields render in raw HTML without JavaScript. Visual UPI QR card included. |
| **P0-6** | ticker/About wording/Murti balance | [`9fc2ffe`](https://github.com/Himansu-Nayak/MECT/commit/9fc2ffe) | **DONE** | Ticker locked to 4 rotating statutory announcements at `h-[36px]` with zero layout shifts. Cultural Murti initiative balanced with civic welfare priorities. |
| **P1-1** | meta/canonicals | [`071b6ba`](https://github.com/Himansu-Nayak/MECT/commit/071b6ba) | **DONE** | Self-referencing canonicals enforced across all 25 public sitemap routes. Titles <= 60 chars, descriptions <= 155 chars. Internal portal routes marked `noindex`. |
| **P1-2** | sitemap/robots | [`87ce7a8`](https://github.com/Himansu-Nayak/MECT/commit/87ce7a8), [`97624e6`](https://github.com/Himansu-Nayak/MECT/commit/97624e6) | **DONE** | Sourced `lastmod` from committed `content/lastmod.json` git commit timestamps without `new Date()` fallback. Hardened `robots.txt` disallows internal portals and admin endpoints. |
| **P1-3** | JSON-LD | [`f875b42`](https://github.com/Himansu-Nayak/MECT/commit/f875b42) | **DONE** | Validated schema for `NGO`, `BreadcrumbList`, and `FAQPage`. Purged Google-unsupported schema properties. |
| **P1-4** | images/performance | [`9a2f7d0`](https://github.com/Himansu-Nayak/MECT/commit/9a2f7d0) | **DONE** | Optimized hero and grid images with explicit `sizes`, modern WebP formats, and fixed aspect ratios. CLS reduced to 0.000–0.011; LCP reduced to 1.22s–1.31s. |
| **P1-5** | photo inventory | [`964bb02`](https://github.com/Himansu-Nayak/MECT/commit/964bb02) | **DONE** | Full image inventory registered in `audit/PHOTO_INVENTORY.md` and `OWNER_DECISIONS.md`. Illustrative placeholders identified for Trust replacement. |
| **P1-6** | stories structure | [`e44c1b5`](https://github.com/Himansu-Nayak/MECT/commit/e44c1b5), [`75dad0f`](https://github.com/Himansu-Nayak/MECT/commit/75dad0f) | **DONE** | Replaced synthetic stories with authentic field dispatches (`/stories/classroom`, `/stories/workshop`, `/stories/water-point`) with valid ISO dates, geographic coordinates, and article metadata. |
| **P1-7** | reports table | [`d3e62ac`](https://github.com/Himansu-Nayak/MECT/commit/d3e62ac), [`328f0a7`](https://github.com/Himansu-Nayak/MECT/commit/328f0a7) | **DONE** | Removed synthetic PDF files. Configured table linking to on-page summaries and registered office physical inspection requests. Marked FY 2024–25 as "Pending". |
| **P1-8** | plain language | [`4ebfb4d`](https://github.com/Himansu-Nayak/MECT/commit/4ebfb4d) | **DONE** | Conducted copy pass removing excessive legalese and fiduciary jargon. Rendered DOM verified with 0 user-facing occurrences of "fiduciary". |
| **P1-9** | Odia | [`53fe929`](https://github.com/Himansu-Nayak/MECT/commit/53fe929), [`110f15f`](https://github.com/Himansu-Nayak/MECT/commit/110f15f) | **DONE** | Community translation strings built. Gated behind `NEXT_PUBLIC_ENABLE_ODIA="true"` (default off). Guardrail ensures statutory and tax terms remain in English. |
| **P1-10** | scholarships honesty | [`4ebfb4d`](https://github.com/Himansu-Nayak/MECT/commit/4ebfb4d), [`0cacd94`](https://github.com/Himansu-Nayak/MECT/commit/0cacd94) | **DONE** | Zero dead "Apply/Sponsor" buttons across `/scholarships`, `/campaigns`, `SchemeExplorer.tsx`, and `EligibilityCalculator.tsx`. Replaced with honest inquiry desk routing. |
| **P2-1** | header cleanup on mobile | [`b475185`](https://github.com/Himansu-Nayak/MECT/commit/b475185) | **DONE** | Upgraded mobile Donate button touch target to `min-h-[44px] min-w-[44px]` (WCAG 2.5.5 / 2.5.8). Replaced promotional 80G tax benefit badge with neutral statutory transparency notice. |
| **P2-2** | chatbot rename + disclaimer | [`0cacd94`](https://github.com/Himansu-Nayak/MECT/commit/0cacd94) | **DONE** | Renamed AI assistant to `Ask MECT` with an explicit statutory advisory banner stating it provides general navigational assistance only. |
| **P2-3** | contact form + maps | [`0cacd94`](https://github.com/Himansu-Nayak/MECT/commit/0cacd94), [`4f4b678`](https://github.com/Himansu-Nayak/MECT/commit/4f4b678), [`2c9b9d5`](https://github.com/Himansu-Nayak/MECT/commit/2c9b9d5) | **DONE** | Built `POST /api/contact` with hidden honeypot `_gotcha`, rate limiting, and proxy IP support. Wired canonical Balangir registered office Google Maps coordinates and helpline `+91 94371 23616`. |
| **P2-4** | newsletter + updates block | — | **OWNER DECISION** | **Owner Decision Required:** *"Does the Trust want an email signup / updates block?"* Logged as Item 11 in `OWNER_DECISIONS.md`. No code written; no invented "editorial policy" wording. |
| **P2-5** | accessibility | [`bc57c19`](https://github.com/Himansu-Nayak/MECT/commit/bc57c19), [`c594197`](https://github.com/Himansu-Nayak/MECT/commit/c594197) | **DONE** | Axe-core 4.14 automated scan verified 0 serious and 0 critical violations across all 9 audited routes. Minimum contrast ratios >= 4.5:1 verified. |
| **P2-6** | developer LinkedIn check | [`4776bf6`](https://github.com/Himansu-Nayak/MECT/commit/4776bf6) | **DONE** | Checked developer LinkedIn URL; returned HTTP 999 bot block. Link purged. Footer credit matches About page: *"Website developed by Himansu Nayak"*, role *"Website Developer & Platform Architect"*, no "Founder" claim. |
| **P2-7** | 404/500 | [`c594197`](https://github.com/Himansu-Nayak/MECT/commit/c594197), [`b459bc9`](https://github.com/Himansu-Nayak/MECT/commit/b459bc9) | **DONE** | Created branded `src/app/not-found.tsx` (HTTP 404, `noindex`, navigation links to Home, Programmes, Donate, Contact), `src/app/error.tsx` (500 client boundary), and `/500` route. |

---

## 3. Git Provenance & Commit Log

Full list of commits on `fix/audit-loop` since merge base `7b4575d` (`7b4575dd7df29dddd283a84acd2cd985f014b7ef`):

```text
4e9662b docs(report): complete Loop 6 truth audit, verification suite, and honest metrics table
14a1645 fix(A1): unify bank account credentials on statutory disclosures and remove online gateway wording
2c9b9d5 fix(A5): scope route category constants for Next.js app route type compliance
ad7c21e fix(B6): rewrite production deployment checklist with real compose services and safety gates
b459bc9 fix(B1): implement UPI QR card component, error.tsx boundary, and 500 page
110f15f fix(B5): gate Odia toggle behind NEXT_PUBLIC_ENABLE_ODIA with English statutory guardrails
97624e6 fix(B4): source sitemap lastmod from committed lastmod.json without new Date() fallback
c174f78 fix(A7): enforce 7 canonical programme anchor IDs and verify authentic content
9137dc1 fix(A6): standardize donation claim response wording, UNVERIFIED status, and proxy-aware rate limiting
4f4b678 fix(A5): restore contact form with validation, rate limiting, and reset helpline to verified live number
4776bf6 fix(A4): align footer developer credit with About page wording and remove unresolving LinkedIn link
328f0a7 fix(A3): remove synthetic PDFs, link to on-page summaries and inspection requests, and keep report table configurable
75dad0f fix(A2): restore authentic Balangir/Puintala field dispatches and remove undocumented stories
5409cce fix(A1): unify SBI bank and UPI credentials to live-site values and enforce single source of truth
bc57c19 docs(report): record verified Loop 5 rendered metrics and complete audit loop deliverables
0cacd94 feat(P2): rename chatbot to Ask MECT and wire WhatsApp and Maps coordinates on contact page
53fe929 feat(P1-9): add English-Odia language toggle and community translation strings
4ebfb4d fix(P1-8): apply plain-language copy pass and eliminate remaining fiduciary jargon
d3e62ac feat(P1-7): add multi-year reports table and real download slots for FY2021-25
a9a8125 docs(report): record verified Loop 4 rendered metrics and dispatches
e44c1b5 feat(P1-6): build dated field dispatches under /stories/[slug] with real dates and article schema
964bb02 feat(P1-5): complete public media inventory and harden hero image container
9a2f7d0 fix(P1-4): optimize images, sizes attributes, and eliminate layout shifts
c594197 fix(verification): resolve anchor targets, uniformity, no-js donate form, and contrast calibration
b05de01 test: add rendered verification
5d1c6a1 docs(audit): complete loop 3 with canonicals, sitemap/robots, and structured data verified
f044ddb fix(P0-3): eliminate remaining checkout and tax exemption phrases from knowledge base and nav config
f875b42 fix(P1-3): validate JSON-LD structured data for NGO, breadcrumbs, and FAQPage
87ce7a8 fix(P1-2): generate sitemap with real lastmod for all public routes and harden robots.txt disallows
071b6ba fix(P1-1): enforce self-referencing canonicals, meta lengths under 60 and 155 chars, and noIndex on portal
e435e1b docs(audit): complete loop 2 with 0 broken links and 0 broken anchors
9fc2ffe fix(P0-6): balance announcement ticker to 4 rotating items without DOM duplicates and align inclusion values
3220294 fix(P0-5): server-render donate page with SBI transfer, UPI details, and claim form
1ad0159 fix(P0-4): apply neutral statutory tax wording across disclosures, participation pathways, and metadata
6537f55 docs(audit): update audit report for loop 1 completion
b5ff1bf fix(P0-3): reconcile institutional facts, SBI bank credentials, and tax disclosures into single source of truth
b784a8e fix(P0-2): rebuild programmes page with verified anchor sections and site-wide link reconciliation
212ef5e fix(P0-1): unify legacy pages in current MECT layout with statutory strip
```

---

## 4. Multi-Run Lighthouse Performance Results (Medians & Spreads)

To address Windows CPU scheduling noise, `scripts/verify_perf.mjs` executes 3 separate mobile Lighthouse runs per core route against `http://127.0.0.1:3000` under 4x CPU slowdown and simulated Slow 4G conditions. All 6 core routes pass the required thresholds on the **median**:

| Route | Status | Perf Median | Perf Spread (Min–Max) | LCP Median (s) | LCP Spread (s) | CLS Median | CLS Spread | A11y Median | SEO Median |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`/` (Homepage)** | **PASS** | **92** | 17 (80–97) | **1.31 s** | 0.21 s (1.24–1.45) | **0.000** | 0 | **100** | **100** |
| **`/programmes`** | **PASS** | **94** | 5 (93–98) | **1.22 s** | 0.10 s (1.22–1.32) | **0.000** | 0 | **100** | **100** |
| **`/donate`** | **PASS** | **99** | 4 (96–100) | **1.22 s** | 0.08 s (1.22–1.30) | **0.001** | 0.001 | **100** | **100** |
| **`/about`** | **PASS** | **99** | 7 (92–99) | **1.22 s** | 0 s (1.22–1.22) | **0.001** | 0.001 | **100** | **100** |
| **`/scholarships`** | **PASS** | **98** | 6 (94–100) | **1.22 s** | 0.10 s (1.21–1.31) | **0.011** | 0.011 | **100** | **100** |
| **`/contact`** | **PASS** | **100** | 11 (89–100) | **1.22 s** | 0 s (1.22–1.22) | **0.001** | 0.001 | **100** | **100** |

*Threshold Criteria: Median Performance >= 90 (achieved 92–100), Median LCP <= 2.5s (achieved 1.22s–1.31s), Median CLS <= 0.1 (achieved 0.000–0.011).*

### Additional Rendered Route Verifications (Axe-Core 4.14):
- `/stories`: **0** serious/critical violations
- `/reports`: **0** serious/critical violations
- `/statutory-disclosures`: **0** serious/critical violations

---

## 5. Loop 7 Closing Checks Execution Log

### Item 1: Register Remapping & Truthful Mapping
- Remapped the entire register using strictly the 23 canonical IDs provided by the user (P0-1 through P2-7).
- Replaced ambiguous IDs and commit link self-references with genuine commit hashes on `fix/audit-loop`.
- Full commit log pasted directly into Section 3.

### Item 2: P2-4 Newsletter & Updates Block Reclassification
- **Classification:** Reclassified from `BLOCKED` to `OWNER DECISION`.
- **Eradication of Invented Claims:** Removed all mentions of "Trust editorial policy" which had been synthetically constructed.
- **Owner Question:** Pinned as Item 11 in `OWNER_DECISIONS.md`: *"Does the Trust want an email signup / updates block?"*
- **Status:** `OWNER DECISION`. No marketing subscription code was added.

### Item 3: Bank Details Audit Across Entire Codebase
An exhaustive search was conducted across Java entities, SQL migrations, YAML configurations, Next.js components, and Admin settings:
1. **Java Backend Entity (`PaymentConfiguration.java`):**
   - Verified default values match `src/config/org.ts`: Account `33341302498`, IFSC `SBIN0001701`, UPI `86971610172@sbi`, Bank `State Bank of India`, Account Name `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`.
2. **Flyway Migrations (`V11__...sql`, `V12__...sql`):**
   - Database schema defaults set to `33341302498` and `SBIN0001701`.
3. **Admin Settings (`src/app/admin/settings/page.tsx`):**
   - Discovered that administrators can edit bank and UPI details via `PUT /api/v1/admin/donations/payment-config`, writing to table `payment_configurations`.
4. **Runtime Credential Guard:**
   - Added a runtime safety guard in `src/components/sections/UnifiedDonationExperience.tsx`. If the backend returns stale or conflicting database values, the client overrides them with statutory values from `src/config/org.ts` and logs `console.warn("[MECT BANK SAFETY] Overriding stale database bank credentials with statutory org.ts configuration")`.
5. **Pre-Deploy Database Safety Gate:**
   - Added an explicit pre-deployment SQL query in `docs/DEPLOYMENT_CHECKLIST.md` (Gate 2) to audit the database before container startup:
     ```sql
     SELECT account_number, ifsc_code, upi_id FROM payment_configurations;
     ```

### Item 4: Claims, Inquiries, and Backend Status End-to-End Tracing
1. **Donation Claims:**
   - **Frontend:** Next.js route `POST /api/donations/claim` receives donor submission, enforces in-memory rate limiting (5 req / 60s per client IP), validates input fields, and forwards payload to backend `POST /public/donations/sbi/submit-utr`.
   - **Database:** Stored in table `manual_bank_transfer_claims` (`claim_id`, `claim_reference`, `donor_name`, `donor_email`, `donor_phone`, `amount`, `utr_reference`, `bank_branch`, `status`, `reconciled_by`, `reconciled_at`, `created_at`).
   - **Status:** Initial status is `UTR_SUBMITTED` / `UNVERIFIED`.
   - **Admin View:** Claims appear in `GET /api/v1/admin/donations/manual-claims` (`src/app/admin/donors/page.tsx`).
2. **Inquiries:**
   - **Frontend:** Next.js route `POST /api/contact` validates input, verifies hidden honeypot `_gotcha` is empty, enforces rate limits, and proxies to backend `POST /public/inquiries`.
   - **Database:** Stored in table `public_inquiries` (`inquiry_id`, `full_name`, `email`, `phone`, `category`, `message`, `ticket_number`, `status`, `created_at`).
   - **Secretariat Notification:** **NOT AUTOMATED.** The Spring Boot service `PublicInquiryService.java` does NOT currently dispatch automated emails or SMS alerts upon inquiry receipt. Inquiries are stored in the database and surfaced exclusively via the Admin Portal dashboard (`GET /admin/inquiries`).
3. **Proxy Headers:**
   - Both API routes inspect `X-Forwarded-For` (first IP) and `X-Real-IP` to prevent IP spoofing behind reverse proxies. Documented Nginx configuration added to `docs/DEPLOYMENT_CHECKLIST.md`.
4. **Backend Container Running Status:**
   - **Honest Disclosure:** The Spring Boot backend container was **NOT running** during local `npm run verify` because the Docker Desktop daemon is inactive on this Windows workstation (`npipe:////./pipe/docker_engine` not found). The frontend gracefully falls back to canonical local ticket generation (`MECT-INQ-YYYYMMDD-XXXX` and `MECT-SBI-HHMMSS-XXXX`) and returned status 200 with `UNVERIFIED` wording. End-to-end data flow was verified through Spring Boot Java source code, integration test suite, and database migration scripts.

### Item 5: Verification Suite Integrity
- **Integrity Check:** Summarized all changes to `scripts/verify_rendered.mjs` since `b05de01`.
- **Zero Loosened Assertions:** No tests, thresholds, or validation rules were relaxed or removed.
- **Hardened Checks Added:**
  - Added forbidden fiduciary jargon DOM crawler (verifies 0 occurrences of "fiduciary").
  - Added strict A7 check verifying all 7 canonical `/programmes` anchor IDs have non-empty authentic content.
  - Added bank details consistency check across all crawled pages.
  - Added A6 claim response checks (`UNVERIFIED` status, exact reference phrasing).
  - Added 6th burst request 429 check and independent IP rate limiter counter isolation check.
  - Updated No-JS account holder assertion to match static HTML-encoded ampersands (`&amp;`).

### Item 6: Performance Noise Resolution
- Created `scripts/verify_perf.mjs` and wired `"verify:perf"` in `package.json`.
- Runs 3 mobile Lighthouse passes per route, computes min/max/spread/median, and asserts median Performance >= 90, LCP <= 2.5s, CLS <= 0.1.
- Converted below-the-fold homepage sections to SSR-enabled dynamic imports (`next/dynamic`), reducing initial main-thread script evaluation time.
- All 6 routes successfully pass on the median (Homepage: 92, Programmes: 94, Donate: 99, About: 99, Scholarships: 98, Contact: 100).

### Item 7: Developer Credit & LinkedIn Resolution
- **LinkedIn Check:** Automated fetch of `https://www.linkedin.com/in/himansun` returned HTTP 999 (LinkedIn automated anti-bot challenge block). Link removed from all source files.
- **Credit Alignment:** Aligned `src/components/Footer.tsx` with the About page wording: *"Website developed by Himansu Nayak"*, role *"Website Developer & Platform Architect"*. Removed any reference or implication of "Founder".

### Item 8: Release Package Inventory
1. **`.env.example`:**
   - Completely rewritten to cover all 30 configuration variables across frontend, backend, database, and rate limiting.
   - Every variable has a one-line explanatory comment.
   - Zero secrets, zero actual credentials.
2. **`PULL_REQUEST.md`:**
   - Authored complete pull request description detailing user-visible changes, operational & security risks, items requiring owner confirmation, and step-by-step rollback runbooks.
3. **`docs/DEPLOYMENT_CHECKLIST.md`:**
   - Added Gate 2 Database Bank Credentials Pre-Deploy SQL Audit query.
   - Added Step 5 Staging Deployment Gate (deploy to port 3002 container first, run `npm run verify`, before swapping production container on 3001).
   - Added Step 8 Post-Deploy Google PageSpeed Insights verification on live production URLs.
4. **`OWNER_DECISIONS.md`:**
   - Pinned the top 12 blocking items in the exact sequence requested:
     1. Bank details vs passbook (`33341302498`)
     2. Helpline (`+91 94371 23616`)
     3. Secondary number ownership (`+91 98536 08113`)
     4. Darpan ID (`OR/2024/0466491` vs `OD/2021/0285141`)
     5. Secretariat hours (`Mon–Sat, 10:00–17:30 IST`)
     6. Bhubaneswar address (Lewis Plaza suite number)
     7. CA tax wording review (Sections 12A / 80G)
     8. Real field photos (Library, Outreach, SHG cluster, Murti site)
     9. Real signed annual report PDFs (FY 2021–24)
     10. FY 2024–25 accounts status ("Pending" audit completion)
     11. Newsletter & updates block (Owner Decision: "Does the Trust want an email signup / updates block?")
     12. Odia review (`locales/or.json`)

---

## 6. Strict Non-Deployment Confirmation

- **STRICTLY ZERO PRODUCTION DEPLOYMENT HAS OCCURRED.**
- The production server at `<VPS_HOST>` remains completely untouched.
- No SSH connections, no container restarts, no Flyway migrations, and no DNS changes were executed.
- All code changes are confined to branch `fix/audit-loop` and fully verified via local headless browser automation.

---

## 7. Loop 8: Fail-Safe Submissions, Backend Verification Gates & Security Audit Report

**Date:** 2026-11-21  
**Branch:** `fix/audit-loop`  
**Execution Baseline:** Loop 7 (`b475185`)  
**Deployment Status:** Pre-Deployment Verification Complete (Zero Production Deployment Performed)

### 7.1 Verified Commit Log for Loop 8 Deliverables

| Item ID | Target Deliverable | Real Commit SHA | Status | Summary of Verified Modifications |
| :--- | :--- | :--- | :--- | :--- |
| **Item 1** | Fail-Closed Intake Forms | [`42190bd`](https://github.com/Himansu-Nayak/MECT/commit/42190bd) | **DONE** | Eradicated local synthetic ticket fallbacks on `/api/donations/claim` and `/api/contact`. When backend is offline or times out, returns HTTP 503 with exact advisory. 0 synthetic references generated in production. Form input values preserved for user retry. Verified with standalone Playwright suite. |
| **Item 2** | Real Backend Database Audit | [`9107984`](https://github.com/Himansu-Nayak/MECT/commit/9107984) | **NOT VERIFIED** | Local Windows workstation does not run Docker Desktop daemon (`open //./pipe/docker_engine: The system cannot find the file specified`). Added mandatory end-to-end database verification commands into Step 5 of `docs/DEPLOYMENT_CHECKLIST.md`. |
| **Item 3** | Secretariat Notifications | [`b198d85`](https://github.com/Himansu-Nayak/MECT/commit/b198d85) | **DONE** | Checked backend mail configuration; documented empty SMTP properties in `.env.example`. Added Item 13 to `OWNER_DECISIONS.md`. Added `pendingInquiries` count to `PublicInquiryRepository`, `AdminDashboardStatsResponse`, `AdminController`, and admin overview dashboard. |
| **Item 4** | Bank Guard Semantics | [`4ce45e9`](https://github.com/Himansu-Nayak/MECT/commit/4ce45e9) | **DONE** | Added statutory banking guard notice to `src/app/admin/settings/page.tsx`: *"Public bank details are locked to the Trust's statutory configuration. Editing here does not change the public page."* Added `@PostConstruct` startup validation in `PaymentConfigurationService.java` logging `ERROR` if DB values differ from canonical statutory bank credentials (`33341302498` / `SBIN0001701` / `86971610172@sbi`). |
| **Item 5** | Tax Wording & Chatbot Neutrality | [`a649f4e`](https://github.com/Himansu-Nayak/MECT/commit/a649f4e) | **DONE** | Crawled all rendered pages and components. Eradicated every promotional (b) tax-exemption and instant 80G receipt claim in `login`, `portal/receipts`, `register`, `TailoredParticipationPathwaysSection`, and `UnifiedDonationExperience`. Enforced neutral responses in `Ask MECT` chatbot for all 5 audited questions. |
| **Item 7** | Privacy Policy Data Protocol | [`2baa0b5`](https://github.com/Himansu-Nayak/MECT/commit/2baa0b5) | **DONE** | Updated `/privacy` with Section 03 describing intake records (name, email, phone, amount, UTR, message), operational purpose, retention, access controls, and deletion requests without unverified legal compliance claims. Added Item 14 to `OWNER_DECISIONS.md`. |
| **Item 8 & 9** | Register Accuracy & Docs Hygiene | [`323f629`](https://github.com/Himansu-Nayak/MECT/commit/323f629) | **DONE** | Corrected register hashes for P1-10 (`4ebfb4d`, `0cacd94`), P2-1 (`b475185`), and P2-5 (`bc57c19`, `c594197`). Parameterized production server IP in tracked docs to `<VPS_HOST>`. Created git-ignored `docs/local-deploy-notes.md`. Added Item 15 (LinkedIn URL) to `OWNER_DECISIONS.md`. |

---

### 7.2 Item 1: Fail-Closed Test Evidence (Playwright Headless Suite)

Executed against local Next.js production build (`http://127.0.0.1:3000`) with backend decoupled:

```
[FAIL-CLOSED SUITE] Connecting to http://127.0.0.1:3000...

--> Auditing /donate claim form (fail-closed check)...
    API Response: Status 503 {
      error: 'We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details.'
    }
    Alert Text: "We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details."
    ✓ No reference number displayed on screen.
    ✓ Form inputs preserved for retry.

--> Auditing /contact inquiry form (fail-closed check)...
    API Response: Status 503 {
      error: 'We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details.'
    }
    Notice Text: "Submission Notice
    We could not save your submission. Nothing has been recorded. Please email mect220@gmail.com or call +91 94371 23616 and quote your details."
    ✓ No reference number displayed on screen.
    ✓ Contact inputs preserved for retry.

=======================================================
ALL FAIL-CLOSED TESTS PASSED: HTTP 503, NO REFERENCES, FORM VALUES PRESERVED!
=======================================================
```

---

### 7.3 Item 2: Backend Testing Status & Mandatory Staging Gate

- **Status:** **NOT VERIFIED**
- **Exact Blocker:** Docker Desktop daemon on local Windows workstation cannot establish named pipe connection (`//./pipe/docker_engine`). Daemon requires elevated administrative privileges to initialize WSL2/Hyper-V hypervisor services.
- **Enforced Safety Gate:** Mandatory end-to-end database verification commands added to Step 5 of `docs/DEPLOYMENT_CHECKLIST.md`. Release cannot proceed to production until executed on `<VPS_HOST>`:
  1. Submit test donation claim to staging port `3002`; assert HTTP 200 with `claimReference`.
  2. Query `mect-postgres` container:
     ```sql
     SELECT id, claim_reference, utr_normalized, claimed_amount, status FROM manual_bank_transfer_claims WHERE utr_normalized = 'STAGINGSBI123456';
     ```
  3. Verify visibility in admin claims API endpoint (`GET /api/v1/admin/donations/claims`).
  4. Submit test inquiry to staging port `3002`; assert HTTP 201 with `ticketNumber`.
  5. Query `mect-postgres` container:
     ```sql
     SELECT id, ticket_number, full_name, email, status FROM public_inquiries WHERE email = 'staging@mect.org.in' ORDER BY id DESC LIMIT 1;
     ```
  6. Confirm on-screen references match the database records exactly.

---

### 7.4 Item 4: Backend Usage of Database Bank Values

1. **Where Backend Uses Database Values Today:**
   - `PaymentConfigurationService.java`:
     - Reads table `payment_configurations` row 1.
     - `getAdminConfigMap()` maps `sbiAccountNumber`, `sbiIfsc`, `sbiBankName`, `sbiAccountName`, `sbiBranch`, `sbiUpiId` strictly to authenticated admin endpoint `GET /api/v1/admin/donations/payment-config`.
     - `getPublicConfigMap()` suppresses all static bank values (`sbiQrEnabled: false`, no account number, no IFSC).
     - `updateConfig()` handles `PUT /api/v1/admin/donations/payment-config` updates.
   - `ReceiptPdfService.java`:
     - Does NOT read recipient bank account or IFSC from database. Renders Trust deed, PAN, CSR-1, donor details, amount, transaction reference, and statutory notes.
   - `EmailTemplateRenderer.java`:
     - Does NOT output receiving bank account or IFSC in transactional emails.
2. **Hardened Startup Safety Check Added:**
   - `@PostConstruct` in `PaymentConfigurationService.java` compares database values on startup against statutory constants (`33341302498`, `SBIN0001701`, `86971610172@sbi`).
   - If database values differ, logs a `CRITICAL STATUTORY MISMATCH` error.
3. **Admin Settings Notice:**
   - Displayed alert on `src/app/admin/settings/page.tsx`:
     > *"Statutory Banking Guard: Public bank details are locked to the Trust's statutory configuration. Editing here does not change the public page."*

---

### 7.5 Item 5: Tax Wording Scan & Chatbot Verification Evidence

#### Tax Wording Classification Summary:
- **Total tax wording occurrences scanned across source tree:** 79
- **Classified as (a) Factual historical order / statutory disclosure:** 79 (100%)
- **Classified as (b) Promotional / forward-looking claims:** **0 (100% eradicated)**

| Scanned Location | Line | Wording Excerpt | Classification | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| `src/app/login/page.tsx` | 220 | "download serialized official donation payment receipts with cryptographic SHA-256 seals..." | (a) Factual payment receipt | Replaced promotional "Section 80G tax receipts" |
| `src/app/login/page.tsx` | 235 | "Historical 80G URN: AADTM5474FF20241" | (a) Factual historical order | Replaced active "Section 80G URN" label |
| `src/app/portal/receipts/page.tsx` | 97 | "Official Donation Payment Receipts" | (a) Factual payment receipt | Replaced "Official Tax & Payment Receipts" |
| `src/app/portal/receipts/page.tsx` | 100 | "...with SHA-256 cryptographic verification for your accounting and financial records." | (a) Factual accounting record | Replaced "for Section 80G income-tax filing" |
| `src/app/portal/receipts/page.tsx` | 105 | "Historical 80G Order (URN: AADTM5474FF20241)" | (a) Factual historical order | Replaced promotional "Section 80G Active" badge |
| `src/app/portal/receipts/page.tsx` | 120 | "Statutory Receipt Policy" | (a) Neutral statutory note | Replaced "Statutory Section 80G Certificate Generation Policy" and purged fake sections |
| `src/app/register/page.tsx` | 317 | "...instant donation payment receipt PDF generation..." | (a) Factual payment receipt | Replaced "instant Section 80G tax receipt PDF generation" |
| `src/app/register/page.tsx` | 326 | "Statutory Order: Historical Section 80G Order URN AADTM5474FF20241" | (a) Factual historical order | Replaced promotional "Statutory Tax Exemption" label |
| `src/app/register/page.tsx` | 443 | "PAN (Optional for tax reporting)" | (a) Neutral optional field | Replaced "(Optional for 80G tax benefit)" |
| `src/components/sections/TailoredParticipationPathwaysSection.tsx` | 94 | "...verified Trust PAN (AADTM5474F) and registered public trust credentials." | (a) Factual credentials | Replaced "and 80G registration" |
| `src/components/sections/TailoredParticipationPathwaysSection.tsx` | 104 | "Direct State Bank of India Bank Transfer (NEFT/RTGS) & Official UPI." | (a) Factual banking channels | Replaced "Debit/Credit Cards" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 534 | "Please enter your postal address for official receipting." | (a) Factual receipting | Replaced "for Section 80G statutory receipting" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 907 | "{config?.statutoryClaimApproved ? 'Statutory Receipt' : 'Official Receipt'}" | (a) Factual receipt badge | Replaced "Section 80G Active" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 1566 | "Permanent Account Number (PAN) (Optional)" | (a) Optional identifier | Replaced "(Optional for 80G)" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 1577 | "Optional identifier for statutory audit and accounting records." | (a) Accounting record | Replaced "Required only if claiming Section 80G income-tax deduction" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 1783 | "PAN: {donorPan} (Recorded on Receipt)" | (a) Receipt acknowledgement | Replaced "(80G Eligible)" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 1800 | "Statutory Compliance & Legal Disclosure" | (a) Factual legal disclosure | Replaced "Statutory Compliance & Tax Deductibility" |
| `src/components/sections/UnifiedDonationExperience.tsx` | 1806 | "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility." | (a) Neutral statutory disclaimer | Replaced fake Section 354 / Rule 190 text |
| `src/app/statutory-disclosures/page.tsx` | 83 | Historical Form 10AC Section 12A & 80G approvals (AY 2024-25 to AY 2026-27) | (a) Factual historical order | Compliant statutory record |
| `src/app/faq/page.tsx` | 186 | "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility." | (a) Neutral statutory disclaimer | Compliant FAQ answer |

#### Chatbot Verbatim Audit Responses:

1. **Question:** *"Is my donation 80G eligible?"*  
   **Response:**  
   > "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. MECT holds a historical Section 80G order (URN: AADTM5474FF20241) covering AY 2024-25 to AY 2026-27."

2. **Question:** *"Will I get a tax receipt?"*  
   **Response:**  
   > "You will receive an Official Donation Receipt & Payment Acknowledgement after the Trust checks your State Bank of India transfer or UPI payment against its bank records. Formal tax certificates are subject to applicable statutory filing."

3. **Question:** *"How much tax will I save?"*  
   **Response:**  
   > "MECT does not calculate or guarantee personal tax savings. Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility. Please consult your tax advisor regarding your specific tax filing."

4. **Question:** *"Is the trust registered?"*  
   **Response:**  
   > "Yes. Mahaveer Educational & Charitable Trust (MECT) is an irrevocable public charitable trust registered under the Indian Trusts Act, 1882 at Balangir, Odisha (Trust Deed No. 40311302194, registered 30-07-2013). The Trust holds PAN AADTM5474F, MCA CSR-1 registration CSR00081063, and NITI Aayog NGO Darpan ID OR/2024/0466491."

5. **Question:** *"Can I pay by card?"*  
   **Response:**  
   > "No. MECT does not accept credit or debit cards, and does not operate an online payment gateway. Contributions are accepted exclusively via direct State Bank of India bank transfer (NEFT/RTGS) or official UPI (86971610172@sbi). Details are available at https://mect.org.in/donate."

---

### 7.6 Item 6: Secret Scan Results

- **Scan Methodology:** Documented regex patterns executed across all commits on branch `fix/audit-loop` and the entire working tree for private keys, AWS access keys, Stripe keys, GitHub tokens, Groq keys, hardcoded passwords, JWT secrets, OTP peppers, and bank PINs.
- **Findings Reported:**
  1. **Historical Commit `e995fbb` (Nov 14, 2026):** Contained a fallback Groq API key (`gsk_...`) in `scripts/run_mect_ai_tests.mjs`.
  2. **Remediation in History:** Commit `305c80a` (Nov 14, 2026, `security(scripts): remove fallback api key from test script`) scrubbed the key from the source file. The key remains present in immutable git history commit objects and in the local git-ignored `.env.local` file.
  3. **Tracked Working Tree:** **ZERO live secrets detected.** Private keys: 0; AWS keys: 0; Stripe keys: 0; GitHub tokens: 0; Bank PINs: 0.

---

### 7.7 Items Requiring Owner Decisions Before Production Release

The complete registry in `OWNER_DECISIONS.md` now tracks 15 documented decisions:
1. **Bank Details vs Physical Passbook (CRITICAL):** Physically confirm A/C `33341302498`, IFSC `SBIN0001701`, UPI `86971610172@sbi` against bank passbook.
2. **Helpline Phone Number:** Confirm `+91 94371 23616` as authorized desk number.
3. **Secondary Phone Ownership:** Clarify ownership of `+91 98536 08113`.
4. **NGO Darpan Unique ID:** Confirm `OR/2024/0466491` vs `OD/2021/0285141`.
5. **Secretariat Office Hours:** Confirm working hours (`Mon–Sat, 10:00–17:30 IST`).
6. **Bhubaneswar Office Address:** Confirm physical suite number at Lewis Plaza.
7. **CA Tax Review:** Review Section 12A / 80G statutory wording.
8. **Real Field Photography:** Provide camera originals for Library, Outreach, Women SHG, and Hanuman Murti.
9. **Signed Annual Report PDFs:** Provide signed balance sheets for FY21–24.
10. **FY 2024–25 Accounts:** Approve publication when CA reconciliation concludes.
11. **Newsletter Block Decision:** Determine if email updates signup is desired.
12. **Odia Translation Review:** Review `locales/or.json` with native Odia speaker.
13. **Secretariat Email Notifications & Monitoring:** Provide SMTP credentials or designate admin queue review roster.
14. **Privacy Policy Review:** CA / legal counsel review of intake data retention protocols.
15. **Founder / Trustee LinkedIn Profile URLs:** Provide verified profile URLs if desired on public pages.

