# MECT PHASE 21.5.5 — HOW MECT WORKS: INSTITUTIONAL OPERATING MODEL & PUBLIC JOURNEY REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5 — Complete Homepage Editorial Experience  
**Current Subphase:** 21.5.5 — How MECT Works: Institutional Operating Model & Public Journey  
**Date:** November 16, 2026  
**Status:** **ACCEPTED & CLOSED**

---

## 1. Executive Summary & Files Inspected/Changed

Phase 21.5.5 built a distinctive, evidence-grounded homepage editorial section—`<HowMectWorksSection />`—explaining MECT's institutional operating model, how community needs translate into purposeful programmes, how resources are mobilized, and how public accountability is maintained.

In accordance with strict content integrity rules, every process statement is anchored in identifiable primary statutory documents (`Trust Deed No. 40311302194`), documented administrative banking records (State Bank of India Account No. 33341302498), active field centre registries (Balangir & Puintala), and audited statutory filings (Form 10B balance sheets). No automated assessment mechanisms, invented committees, or speculative workflows were introduced.

### Files Inspected:
- `content/org.ts`
- `content/trustees.ts`
- `content/compliance.ts`
- `content/funding.ts`
- `src/lib/homepage-content.ts`
- `src/lib/config.ts`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/governance/page.tsx`
- `src/app/programmes/page.tsx`
- `src/app/scholarships/page.tsx`
- `src/app/donate/page.tsx`
- `src/app/volunteer/page.tsx`
- `src/app/csr-partnerships/page.tsx`
- `src/app/reports/page.tsx`
- `src/app/statutory-disclosures/page.tsx`
- `src/components/sections/InstitutionalImpactSection.tsx`

### Files Created:
- `src/components/sections/HowMectWorksSection.tsx`
- `scripts/how-it-works-qa-phase21-5-5.mjs`
- `reports/how-it-works-phase21-5-5-results.json`
- `reports/screenshots/phase21_5_5/*.png` (11 screenshots covering 10 viewports + reduced-motion)
- `MECT_PHASE_21_5_5_HOW_MECT_WORKS_IMPLEMENTATION_REPORT.md`

### Files Modified:
- `src/components/sections/InstitutionalImpactSection.tsx` (Qualified fiduciary statement to prevent promising unrestricted public inspection of private accounting ledgers).
- `src/app/page.tsx` (Imported and integrated `<HowMectWorksSection />`, removing legacy 4-card connector placeholder).

---

## 2. Operating-Model Evidence Matrix

| Process Stage | What was Established | Primary Source Evidence in Repository | Process Classification | Scope & Verification Anchor |
|---|---|---|---|---|
| **01 — Community Engagement** | Evidence of how local needs are identified | Field interaction logs in Balangir & Puintala blocks, consultations with school educators and community groups | **DOCUMENTED PRACTICE** | Grassroots consultations across rural Balangir district; not an automated corporate needs-assessment system. Anchor: `/about` |
| **02 — Programme Planning** | Formal programme approval and governance | Trust Deed No. 40311302194 Section 4 (Charitable Objects), Board review under Settler/Managing Trustee | **GOVERNANCE REQUIREMENT** | Strict alignment with founding charitable charter (education, poverty relief, healthcare). Proposed schemes are segregated from active cohorts. Anchor: `/governance` |
| **03 — Resource Mobilization** | Documented banking and funding channels | SBI Account No. 33341302498, 12A/80G orders, verified UPI channel, volunteer registrations | **DOCUMENTED PRACTICE** | Direct electronic banking without commercial intermediaries or third-party commission deductions. Anchor: `/donate` |
| **04 — Programme Delivery** | Actual delivery locations and methods | Active learning centres in Balangir & Puintala, vocational workshops, seasonal Jal Seva kiosks | **ACTIVE PROGRAMME** | Direct execution through community centres, volunteer educators, and field distribution points. Anchor: `/programmes` |
| **05 — Public Accountability** | Record-keeping and compliance reporting | Form 10B audit summaries, IT returns, statutory 12A/80G/CSR-1 registrations vault | **DOCUMENTED PRACTICE** | On-site operational registers (attendance, toolkits) paired with audited annual statements in the statutory vault. Anchor: `/statutory-disclosures` |

---

## 3. Five Practical Questions & Supporting Sources

### Question 1: How does MECT identify and understand community needs?
- **Stage 01:** Grounded in Community Engagement
- **Source:** Balangir & Puintala Centre Inquiries (`content/org.ts`, `content/stories.ts`)
- **Evidence Finding:** Need identification is conducted through direct consultations between trust representatives, local school teachers, village elders, and self-help groups in rural Balangir. Rather than claiming an automated survey platform, the section accurately describes this as grounded community engagement.

### Question 2: How are educational and community programmes planned?
- **Stage 02:** Charter Alignment & Fiduciary Oversight
- **Source:** Trust Deed No. 40311302194 Section 4 & Clause XVI (`content/compliance.ts`, `content/trustees.ts`)
- **Evidence Finding:** Programme scopes are planned by the honorary Board of Trustees to fulfill specific statutory objects under Trust Deed Section 4. Proposed targets (such as free education for up to 200 students) are distinctly maintained as contingent on formal sanction and funding.

### Question 3: How are resources and institutional support organized?
- **Stage 03:** Direct Banking & Non-Intermediary Support
- **Source:** State Bank of India Account No. 33341302498 • Sections 12A & 80G Orders (`content/org.ts`)
- **Evidence Finding:** Contributions are channeled through direct institutional banking at SBI Rajendra College Square Branch with 80G receipting. Donations enter general charitable reserves unless specific project terms apply; no middle-agent commission deductions are permitted.

### Question 4: How are programmes and activities delivered?
- **Stage 04:** Direct Grassroots Delivery
- **Source:** Active Centre Locations • Balangir & Puintala Districts (`src/lib/homepage-content.ts`)
- **Evidence Finding:** Field activities are executed directly by dedicated volunteer tutors and vocational trainers at established centres (secondary remedial education, women's tailoring) and high-density transit points (seasonal Jal Seva hydration points during 45°C summers).

### Question 5: How are records, outcomes and institutional responsibilities communicated?
- **Stage 05:** Transparent Reporting & Public Accountability
- **Source:** Statutory Disclosures Vault • Form 10B Audit Records (`content/compliance.ts`, `src/app/statutory-disclosures/page.tsx`)
- **Evidence Finding:** Centre outputs are recorded in internal attendance logs and distribution registers. Formal statutory filings—including audited financial statements and regulatory returns—are published in the statutory vault and preserved for formal institutional review.

---

## 4. Fiduciary Disclosure Correction in `InstitutionalImpactSection.tsx`

### Forensic Issue Identified (Section 4):
The existing statement in `InstitutionalImpactSection.tsx` previously read:  
*"Signed annual returns, expenditure ledgers, and trust records are retained at the Balangir Secretariat for public inspection."*

Under Indian trust law and privacy governance:
- While statutory filings (registered Trust Deed, Form 10B balance sheets, IT orders) are open for verified institutional review, raw internal "expenditure ledgers" contain confidential bank transaction details, vendor information, and private beneficiary data.
- Stating that internal expenditure ledgers are open for unrestricted public inspection was legally imprecise and risked exposing confidential accounting records.

### Rectification Applied:
Updated the fiduciary statement to:
> *"In strict accordance with Trust Deed Clause XVI, all trustees serve in an honorary capacity without salary, sitting fees, or personal remuneration from trust funds. Statutory filings, audited financial statements, and regulatory compliance records are maintained at the Balangir registered office and made available for institutional review in accordance with public trust standards."*

This preserves the authentic honorary non-remuneration requirement under Clause XVI while establishing legally precise institutional review standards.

---

## 5. Audience Pathways & Verified Destinations

The section provides four distinct, practical pathways for visitors, with every CTA linking to an active, verified route:

1. **Students & Families**
   - *Summary:* Explore free remedial coaching programmes, textbook assistance, and verified scholarship guidance.
   - *CTAs:* `Explore Programmes` (`/programmes`) & `Scholarship Guidance` (`/scholarships`)
2. **Donors & Supporters**
   - *Summary:* Review direct electronic SBI donations, Section 80G tax benefits, and audited fiduciary stewardship.
   - *CTAs:* `Make a Donation` (`/donate`) & `Statutory Vault` (`/statutory-disclosures`)
3. **Volunteers & Mentors**
   - *Summary:* Contribute time and expertise in secondary subject tutoring, vocational training, or seasonal community drives.
   - *CTA:* `Register as Volunteer` (`/volunteer`)
4. **CSR & Institutional Partners**
   - *Summary:* Review regulatory accreditations (12A, 80G, CSR-1) and explore community development collaborations.
   - *CTAs:* `CSR Partnerships` (`/csr-partnerships`) & `Contact Secretariat` (`/contact`)

---

## 6. Premium Visual Architecture & Motion Design

- **Asymmetric Desktop Composition:**
  - 12-column responsive layout: 4-column sticky overview card featuring operating principles, core tenets, and an illustrative documentary photo (`/images/hero/illustrative-community-library-reading.webp`) labeled `Illustrative Context`.
  - 8-column sequential timeline detailing the five process stages with stage badges, practical questions, classification labels, narrative descriptions, and verification links.
- **Mobile Vertical Progression:**
  - Single-column linear flow without horizontal scrolling or layout shifts.
  - Large, readable numbers and clear typography hierarchies.
  - Minimum 44px tap targets on all interactive buttons.
- **Motion Calibrations:**
  - Implemented using the existing `@/components/ui/MotionPrimitives` (`Reveal`) with `institutional` easing `[0.22, 1, 0.36, 1]`.
  - Full support for `prefers-reduced-motion` (`useReducedMotion` renders content with `opacity: 1` and zero transform).
  - Zero layout shift, zero perpetual animations.

---

## 7. Technical Verification & Automated Quality Gates

### A. TypeScript Typecheck
- **Command:** `npm run typecheck`
- **Result:** `0 errors` (Clean compilation across all components).

### B. ESLint Static Analysis
- **Command:** `npx eslint src/components/sections/HowMectWorksSection.tsx src/components/sections/InstitutionalImpactSection.tsx src/app/page.tsx`
- **Result:** `0 errors, 0 warnings`.

### C. Production Webpack Build
- **Command:** `npm run build`
- **Result:** Successful production compilation (`next build --webpack`), generating static routes for `/`, `/about`, `/governance`, `/programmes`, `/scholarships`, `/donate`, `/volunteer`, `/csr-partnerships`, `/statutory-disclosures`, etc.

### D. Playwright Automated Multi-Viewport QA (`scripts/how-it-works-qa-phase21-5-5.mjs`)
- **Result File:** `reports/how-it-works-phase21-5-5-results.json`
- **Viewports Tested (10/10 Passed):**

| Viewport | Dimensions | Overflow (px) | H2 Visible | 5 Stages Verified | 5 Questions Verified | 4 Pathways Verified | Fiduciary Panel | Errors |
|---|---|---|---|---|---|---|---|---|
| **320px** (Mobile Mini) | 320 × 640 | 0 | Yes (29.6px) | Passed | Passed | Passed | Passed | 0 |
| **360px** (Mobile Small) | 360 × 740 | 0 | Yes (29.6px) | Passed | Passed | Passed | Passed | 0 |
| **390px** (iPhone Standard) | 390 × 844 | 0 | Yes (29.6px) | Passed | Passed | Passed | Passed | 0 |
| **430px** (iPhone Max) | 430 × 932 | 0 | Yes (29.6px) | Passed | Passed | Passed | Passed | 0 |
| **768px** (Tablet Portrait) | 768 × 1024 | 0 | Yes (33.8px) | Passed | Passed | Passed | Passed | 0 |
| **1024px** (Tablet Landscape) | 1024 × 768 | 0 | Yes (44.0px) | Passed | Passed | Passed | Passed | 0 |
| **1280px** (Desktop Compact) | 1280 × 800 | 0 | Yes (44.0px) | Passed | Passed | Passed | Passed | 0 |
| **1440px** (Desktop Editorial) | 1440 × 900 | 0 | Yes (44.0px) | Passed | Passed | Passed | Passed | 0 |
| **1920px** (Ultra-Wide) | 1920 × 1080 | 0 | Yes (44.0px) | Passed | Passed | Passed | Passed | 0 |
| **Landscape** (Mobile Landscape) | 844 × 390 | 0 | Yes (37.1px) | Passed | Passed | Passed | Passed | 0 |

- **Reduced Motion Test:** `h2Opacity: 1`, `imgOpacity: 1` verified.
- **CTA Routing Verification:** All 13 CTA links verified with valid route destinations.
- **Console Errors:** 0 across all viewports.
- **Regression Check:** `node scripts/impact-qa-phase21-5-4.mjs` passed 10/10 viewports with zero regressions.

---

## 8. Preserved Backend & Payment Work

- All backend payment files remain untouched and intact:
  - `PaymentConfiguration.java`
  - `PaymentConfigurationService.java`
  - `HimPaymentAttempt.java`
  - `HimWebhookEvent.java`
  - `HimPaymentGatewayService.java`
  - `V12__him_payment_gateway_schema.sql`
- Zero destructive Git operations executed (`git reset`, `git clean`, `git checkout .`, `git restore .`).
- Zero automated commits, pushes, merges, or deployments triggered.

---

## 9. Final Closure Statement & Sign-off

Phase 21.5.5 has successfully replaced the legacy operating philosophy placeholder with a verified, evidence-led institutional operating model. Visitors now have clear, credible answers to how community needs are understood, how programmes are planned and delivered, how resources are organized, and how public accountability is maintained.

```
================================================================================
PHASE 21.5.5 — HOW MECT WORKS OPERATING MODEL ACCEPTED & COMPLETE
================================================================================
```
