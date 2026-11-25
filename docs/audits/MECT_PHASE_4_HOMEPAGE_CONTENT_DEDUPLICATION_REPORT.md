# MECT — PHASE 4: HOMEPAGE CONTENT DEDUPLICATION & REGISTRY WIRING REPORT

- **Project:** Mahaveer Educational & Charitable Trust (MECT)
- **Domain:** `https://mect.org.in/`
- **Canonical Repository:** `https://github.com/Himansu-Nayak/MECT.git`
- **Active Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Base Commit:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (`99c8b1c`)
- **Starting Feature Commit:** `e47b9af`
- **Review Date:** 2026-11-24
- **Lead Architect:** Principal Software Architect & QA Director

---

## 1. Absolute Preservation Mandate (Golden Rule)

In strict compliance with user instructions:
- **Preserved in Full:**
  1. `CinematicHero.tsx`
  2. `InstitutionalStorySection.tsx`
  3. `InterconnectedSafetyNetSection.tsx`
  4. `AuditedImpactTelemetrySection.tsx`
  5. `DocumentaryFieldExhibitionSection.tsx`
  6. `DifferentiatedCampaignsSection.tsx`
  7. `StatutoryGovernanceSection.tsx`
  8. `TailoredParticipationPathwaysSection.tsx`
  9. `ClosingTrustPledgeSection.tsx`
- **Zero Deletion of Unique Content:** Headings, unique storytelling paragraphs, documentary photographs, campaign narratives, impact qualifications, and statutory disclosures are preserved verbatim.
- **Visual & Layout Stability:** Section order, typography, color palette, animations, and responsive layouts remain untouched.
- **Architectural Scope:** The sole objective of Phase 4 is to eliminate redundant hardcoded string literals by wiring repeated institutional facts to the canonical content registry (`MECT_CONTENT_REGISTRY`, `ORG`, `HOMEPAGE_CONTENT`).

---

## 2. Phase 4.1 — Pre-Implementation Inventory & Section-by-Section Source Mapping

Below is the exhaustive pre-implementation inventory of all 9 homepage sections, recording their current displayed facts, headings, paragraphs, CTAs, and images, along with their mapped canonical sources:

### Section 01: `CinematicHero.tsx`
- **Section ID / Aria:** `#hero`, `aria-label="Institutional Introduction"`
- **Headings & Copy:**
  - Classification badge: `"MECT ARCHIVAL REGISTER • ESTD. 2013 • BALANGIR, ODISHA"`
  - Main H1: `"Dignity Through Education. Resilience Through Community."`
  - Narrative deck: `"In Western Odisha, where agrarian distress and seasonal hardship test rural families, Mahaveer Educational & Charitable Trust (MECT) builds an interconnected safety net — uniting rural education, women's vocational self-reliance, safe drinking water, and hospital relief."`
- **Telemetry Counters:**
  - `350+` Student Entries `(FY 23–24)`
  - `120+` Women Enrolled `(21–23 Cohorts)`
  - `10,000+` Relief Servings `(Summer Kiosks)`
- **Trust Guarantee Plaque:**
  - Title: `"Clause XVI Guarantee"`
  - Text: `"100% Honorary Trusteeship. Zero salaries, sitting fees, or administrative commissions."`
- **CTAs:**
  - Primary: `"Support Rural Education"` -> `/donate`
  - Secondary: `"Explore Interconnected Model"` -> `#work-areas`
  - Scroll Cue: `"Section 02 • Institutional Heritage"` -> `#why-mect-exists`
- **Photographic Assets:**
  - Primary image: `/images/hero/mect-trustees-campus-walk.webp`
  - Overlay: `"Puīntalā Campus • Balangir, Odisha"`, `"DOC-2024-FL"`
- **Canonical Source Mapping:**
  - `ESTD. 2013` -> `ORG.foundedYear`
  - `BALANGIR, ODISHA` -> `ORG.addresses.registered.city`, `ORG.addresses.registered.state`
  - `Clause XVI Guarantee` -> `ORG.chairman.honoraryClause`
  - `350+`, `120+`, `10,000+` telemetry -> `HOMEPAGE_CONTENT.hero.metrics` / `MECT_CONTENT_REGISTRY.programmes.activeOperational`

---

### Section 02: `InstitutionalStorySection.tsx`
- **Section ID / Aria:** `#why-mect-exists`, `aria-labelledby="story-section-title"`
- **Headings & Copy:**
  - Eyebrow: `"Section 02 • Institutional Heritage & Founding Values"`
  - Main H2: `"Why MECT Exists: Building a Permanent Institutional Buffer in Western Odisha"`
  - Archival Manifesto Quote: Quote referencing drought cycles, 45°C heatwaves, agrarian distress, and founding on 27 July 2013.
  - Sub-citation: `"Balangir Registered Deed No. 40311302194"`, `"Deed Book 4, Volume 45, Pages 32–48"`
- **Core Principles (Ledger Cards):**
  1. `100% Honorary Trusteeship (Clause XVI)`: Pro bono service, zero salaries or honoraria.
  2. `Direct College Fee Remittance Model`: 100% direct bank-to-college transfers, zero cash.
  3. `13+ Years of Continuous Grassroots Tenure`: Executed 27 July 2013, Registered Doc No. 40311302194.
- **Deed Milestones Drawer:**
  - 27 July 2013: Deed Execution by Settler Founder
  - 30 July 2013: Official Registration (Doc 40311302194)
  - Book 4, Vol 45: Sub-Registrar Balangir Registry
- **Public Registry Notice:**
  - Physical inspection notice at Balangir registered office.
- **CTAs:**
  - Primary: `"Read Full Institutional History"` -> `/about`
  - Interactive: Toggle Deed Milestones drawer
- **Photographic Assets:**
  - `/images/hero/mect-faculty-puintala-campus.webp`
- **Canonical Source Mapping:**
  - Deed number & book volume -> `ORG.trustDeed.deedNumber`, `ORG.trustDeed.bookVolume`
  - Execution date -> `ORG.trustDeed.executedDateDisplay`
  - Registration date -> `ORG.trustDeed.registeredDateDisplay`
  - Sub-registrar -> `ORG.trustDeed.subRegistrar`
  - Registered address -> `ORG.addresses.registered.city`

---

### Section 03 & 04: `InterconnectedSafetyNetSection.tsx`
- **Section ID / Aria:** `#work-areas`, `aria-labelledby="safety-net-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 03 & 04 • The Interconnected Safety Net"`
  - Main H2: Five interconnected pillars illustrating ecosystem reinforcement.
- **Pillars:**
  1. `water` (Clean Drinking Water / Jal Seva Kiosks): 10,000+ documented service instances.
  2. `nutrition` (Food Security & Hospital Relief / Jan Ahar): Documented seasonal relief drives.
  3. `livelihoods` (Women's Vocational Livelihoods / Swavalamban): 120+ cumulative course enrolments.
  4. `education` (Remedial & Higher Education / Shiksha Setu): 350+ recorded student participation entries.
  5. `welfare` (Community Welfare & Social Upliftment / Samaj Kalyan): Continuous emergency aid logs.
- **CTAs:**
  - Dynamic link for each pillar -> `/programmes#water`, `/programmes#food-relief`, `/programmes#women-empowerment`, `/programmes#education`, `/programmes#community-welfare`.
- **Canonical Source Mapping:**
  - Operational programmes -> `MECT_CONTENT_REGISTRY.programmes.activeOperational`
  - Pillar metadata & tags -> `HOMEPAGE_CONTENT.pillars`

---

### Section 05: `AuditedImpactTelemetrySection.tsx`
- **Section ID / Aria:** `#evidence-of-impact`, `aria-labelledby="impact-evidence-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 05 • Audited Telemetry & Field Registers"`
  - Main H2: `"Evidence of Impact: Factual Field Records with Rigorous Qualifications"`
  - Lead paragraph: Explains qualification of metrics distinguishing cumulative instances from unique individuals.
- **4 Metrics:**
  1. `350+` Student Participation Entries (`FY 2023–24 Activity Register`, `REG-EDU-2023-R04`)
  2. `120+` Vocational Course Enrolments (`FY 2021–23 Multi-Cohort Cycles`, `REG-VOC-2021-23`)
  3. `10,000+` Water & Relief Service Instances (`Multi-Year Field Service Log`, `LOG-RELIEF-2019-24`)
  4. `13+ Years` Continuous Statutory Tenure (`2013 – Present Continuous Record`, `DEED-40311302194`)
- **CTAs:**
  - Metric inspection drawer -> details and citation.
  - Button -> `/programmes`
- **Canonical Source Mapping:**
  - Telemetry numbers & definitions -> `HOMEPAGE_CONTENT.hero.metrics` and `MECT_CONTENT_REGISTRY.programmes.activeOperational`
  - Deed tenure reference -> `ORG.trustDeed.deedNumber`, `ORG.foundedYear`

---

### Section 06: `DocumentaryFieldExhibitionSection.tsx`
- **Section ID / Aria:** `#field-exhibition`, `aria-labelledby="exhibition-title"`
- **Headings & Copy:**
  - Eyebrow: `"Section 06 • Real Stories, Real People"`
  - Main H2: `"Documentary Field Exhibition: Authentic Chronicles from Western Odisha"`
- **Exhibition Records:**
  - `MECT-FL-2024-01`: Faculty & Trustee Review at Puīntalā Rural Campus (`mect-faculty-puintala-campus.webp`)
  - `MECT-FL-2023-02`: Women's Vocational Tailoring Cohort (`mect-women-empowerment-seminar.webp`)
  - `MECT-FL-2023-03`: Summer Heatstroke Hydration Demo (`mect-clean-water-hygiene-demo.webp`)
  - `MECT-FL-2023-04`: Classroom Remedial Coaching (`mect-civic-pledge-classroom.webp`)
  - `MECT-FL-2023-05`: Village Legal Literacy & Welfare Scheme (`mect-legal-literacy-session.webp`)
- **Safeguarding Notice:** Child protection and editorial ethics notice.
- **Canonical Source Mapping:**
  - Child safeguarding charter -> `MECT_CONTENT_REGISTRY` / Trust Ethical Code.

---

### Section 07: `DifferentiatedCampaignsSection.tsx`
- **Section ID / Aria:** `#campaigns-and-initiatives`, `aria-labelledby="campaigns-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 07 • Differentiated Campaigns & Initiatives"`
  - Main H2: `"Differentiated Priorities: Educational Opportunity vs. Cultural Landmark"`
  - Subtext: Strict accounting and sub-ledger segregation between humanitarian education and cultural landmark.
- **Dual Splits:**
  1. `Higher Education Target: Up to 200 Students`: Proposed target, confirmed funded 0/200. Direct disbursal guarantee box. Link: `/scholarships`.
  2. `Cultural Landmark: Proposed 80–100 ft Hanuman Murti 3D`: Ring-fenced accounting disclosure (`HANUMAN_MURTI`). Interactive 3D WebGL viewport. Link: `/campaigns/hanuman-murti`.
- **Canonical Source Mapping:**
  - Target 200 education program -> `HOMEPAGE_CONTENT.freeEducation200`
  - Direct disbursal guarantee -> `MECT_CONTENT_REGISTRY.fiduciaryStandards.directCollegeDisbursal`

---

### Section 08: `StatutoryGovernanceSection.tsx`
- **Section ID / Aria:** `#transparency-and-governance`, `aria-labelledby="statutory-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 08 • Transparency, Governance & Statutory Docket"`
  - Main H2: `"Statutory Transparency: Verifiable Sovereign Registrations"`
- **6 Credentials:**
  1. Registered Public Trust Deed -> `ORG.trustDeed.deedNumber`, `ORG.trustDeed.bookVolume`
  2. Permanent Account Number (PAN) -> `ORG.ids.pan`
  3. Historical 12A & 80G Orders -> `ORG.ids.urn12A`, `ORG.ids.urn80G`, `ORG.ids.taxOrderValidityPeriod`
  4. MCA CSR-1 Registration -> `ORG.ids.csr1`, `ORG.ids.csr1Srn`, `ORG.ids.csr1ApprovalDate`
  5. NITI Aayog NGO Darpan -> `ORG.ids.darpan`
  6. MoSJE e-Anudaan Portal -> `ORG.ids.eAnudaan`
- **Actions:**
  - Copy filing reference buttons.
  - Link -> `/governance` and `/statutory-disclosures`.
- **Canonical Source Mapping:**
  - Directly maps to `ORG.ids`, `ORG.trustDeed`, and `MECT_CONTENT_REGISTRY.statutoryCredentials`.

---

### Section 09: `TailoredParticipationPathwaysSection.tsx`
- **Section ID / Aria:** `#participate-in-mission`, `aria-labelledby="participate-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 09 • Meaningful Participation Pathways"`
  - Main H2: `"Participate in the Mission: Tailored Channels of Engagement"`
- **6 Pathways:**
  1. Individual Donors (Direct Giving & Tuition Fee Sponsorship): References PAN `AADTM****F`, direct bank transfer (SBI) and UPI. Link: `/donate`.
  2. Corporate CSR Partners (Turnkey CSR Partnerships): References MCA CSR-1 `CSR00081063`, Schedule VII. Link: `/csr-partnerships`.
  3. Academic Mentors & Educators: Link: `/volunteer`.
  4. Institutional Partners & Colleges: Link: `/contact`.
  5. Grassroots Volunteers: Link: `/volunteer`.
  6. Cultural Heritage Donors: Link: `/campaigns/hanuman-murti`.
- **Canonical Source Mapping:**
  - PAN -> `ORG.ids.pan`
  - CSR-1 -> `ORG.ids.csr1`
  - Bank details -> `ORG.bank`

---

### Section 10: `ClosingTrustPledgeSection.tsx`
- **Section ID / Aria:** `#closing-pledge`, `aria-labelledby="closing-pledge-heading"`
- **Headings & Copy:**
  - Eyebrow: `"Section 10 • Institutional Trusteeship Covenant"`
  - Main H2: `"An Earned Commitment to Grassroots Dignity and Financial Accountability"`
  - Board pledge paragraph referencing Clause XVI.
- **Canonical Contact Coordinates:**
  - Helpline phone -> `ORG.helpline.display`, `ORG.helpline.href`
  - Office hours -> `ORG.helpline.hours`
  - Secretariat email -> `ORG.emails.official`
  - Registered office address -> `ORG.addresses.registered.full`
- **CTAs:**
  - Primary: `"Make a Contribution (Numbered Receipt)"` -> `/donate`
  - Secondary: `"Contact Secretariat Desk"` -> `/contact`
- **Canonical Source Mapping:**
  - Sourced directly from `ORG` and `MECT_CONTENT_REGISTRY.offices`.

---

## 3. Phase 4.2 — Content Ownership Architecture

To prevent architectural competition between registries, content ownership is strictly demarcated:

| Content Classification | Nature of Content | Canonical Source File | Downstream Consuming Components |
| :--- | :--- | :--- | :--- |
| **Institutional Sovereign Data** | Legal deed numbers, dates, PAN, CSR-1, Darpan, e-Anudaan, 12A/80G, bank particulars, official phone, email, addresses, trustee names, Clause XVI. | `content/org.ts` & `src/config/org.ts` & `src/lib/content-registry.ts` | `CinematicHero`, `InstitutionalStorySection`, `StatutoryGovernanceSection`, `TailoredParticipationPathwaysSection`, `ClosingTrustPledgeSection`, Nav & Footer. |
| **Documented Telemetry & Programme Records** | Qualified metrics (`350+` entries, `120+` enrolments, `10,000+` relief instances), 5 active operational programmes, historical activities, pipeline projects. | `src/lib/content-registry.ts` & `src/lib/homepage-content.ts` | `CinematicHero`, `InterconnectedSafetyNetSection`, `AuditedImpactTelemetrySection`, `DifferentiatedCampaignsSection`. |
| **Page-Specific Editorial Copy** | High-impact headlines, storytelling paragraphs, photographic curation, UI animations, responsive layouts. | Component JSX & `src/lib/homepage-content.ts` | Individual homepage section components. |

---

## 4. Phase 4.3 — Section-by-Section Implementation Log

The 9 homepage sections were audited individually. Code refactoring was strictly confined to replacing redundant string literals in 5 components, while 4 components were reviewed and confirmed to already meet canonical standards without code changes:

### A. Modified & Refactored Components (5 Components)
| Section Name & File | Hardcoded Literals Replaced | Canonical Source Applied | Status |
| :--- | :--- | :--- | :---: |
| **01. Cinematic Hero**<br>`src/components/sections/CinematicHero.tsx` | `"MECT ARCHIVAL REGISTER • ESTD. 2013 • BALANGIR, ODISHA"` | `{ORG.shortName} ARCHIVAL REGISTER • ESTD. {ORG.foundedYear} • {ORG.addresses.registered.city.toUpperCase()}, {ORG.addresses.registered.state.toUpperCase()}` | **MODIFIED & WIRED** |
| **02. Institutional Story**<br>`src/components/sections/InstitutionalStorySection.tsx` | `Executed on 27 July 2013 (Registered Doc No. 40311302194 at Balangir)`<br>`Balangir Registered Deed No. 40311302194`<br>`Deed Book 4, Volume 45`<br>`27 July 2013`<br>`30 July 2013`<br>`Balangir registered office` | `${ORG.trustDeed.executedDateDisplay}`<br>`${ORG.trustDeed.registeredDateDisplay}`<br>`${ORG.trustDeed.deedNumber}`<br>`${ORG.addresses.registered.city}`<br>`${ORG.trustDeed.subRegistrar}`<br>`${ORG.trustDeed.deedBookVolumeDisplay}` (restored historical display verbatim) | **MODIFIED & WIRED** |
| **05. Audited Telemetry**<br>`src/components/sections/AuditedImpactTelemetrySection.tsx` | `execution of public Trust Deed on 27 July 2013 (Registered Doc No. 40311302194 at Balangir)`<br>`2013 – Present Continuous Record`<br>`DEED-40311302194 • Sub-Registrar Balangir Registry` | `${ORG.trustDeed.executedDateDisplay}`<br>`${ORG.trustDeed.deedNumber}`<br>`${ORG.addresses.registered.city}`<br>`${ORG.foundedYear} – Present Continuous Record`<br>`DEED-${ORG.trustDeed.deedNumber} • ${ORG.trustDeed.subRegistrar} Registry` | **MODIFIED & WIRED** |
| **08. Statutory Governance**<br>`src/components/sections/StatutoryGovernanceSection.tsx` | Replaced 6 hardcoded credential registration numbers, dates, authorities, and SRN references. | `ORG.trustDeed.deedNumber`<br>`ORG.ids.pan`<br>`ORG.ids.urn12A` / `urn80G`<br>`ORG.ids.taxOrderValidityPeriod`<br>`ORG.ids.csr1` / `csr1Srn`<br>`ORG.ids.darpan`<br>`ORG.ids.eAnudaan` | **MODIFIED & WIRED** |
| **09. Participation Pathways**<br>`src/components/sections/TailoredParticipationPathwaysSection.tsx` | `verified Trust PAN (AADTM****F)`<br>`Direct State Bank of India Bank Transfer`<br>`MCA CSR-1 CSR00081063` | `ORG.ids.pan`<br>`ORG.bank.bankName`<br>`ORG.ids.csr1` | **MODIFIED & WIRED** |

### B. Reviewed Components — No Code Changes Required (4 Components)
| Section Name & File | Review Findings | Status |
| :--- | :--- | :---: |
| **03 & 04. Interconnected Safety Net**<br>`src/components/sections/InterconnectedSafetyNetSection.tsx` | All 5 intervention pillar evidence strings conform strictly to qualified metrics definitions (`10,000+ service instances`, `120+ course enrolments`, `350+ entries`). | **REVIEWED (UNCHANGED)** |
| **06. Documentary Field Exhibition**<br>`src/components/sections/DocumentaryFieldExhibitionSection.tsx` | Verified 5 archival exhibitions, captions, and child safeguarding charter notice. Correct WebP asset references. | **REVIEWED (UNCHANGED)** |
| **07. Differentiated Campaigns**<br>`src/components/sections/DifferentiatedCampaignsSection.tsx` | Confirmed funded: 0/200 telemetry, ring-fenced cultural landmark disclosure, separate sub-ledgers. | **REVIEWED (UNCHANGED)** |
| **10. Closing Trust Pledge**<br>`src/components/sections/ClosingTrustPledgeSection.tsx` | Verified canonical contact coordinates already wired to `ORG.helpline.display`, `ORG.helpline.href`, `ORG.emails.official`, and `ORG.addresses.registered.full`. | **REVIEWED (UNCHANGED)** |

---

## 5. Phase 4.4 & 4.5 — CTA & Factual Safeguards Audit

1. **CTA Deduplication & Destination Integrity:**
   - No gratuitous or duplicate buttons repeat the same action in the same context.
   - All primary navigation, deep-links, and query parameters (`/donate`, `#work-areas`, `#why-mect-exists`, `/about`, `/programmes#water`, `/scholarships`, `/campaigns/hanuman-murti`, `/governance`, `/statutory-disclosures`, `/csr-partnerships`, `/contact`) operate with 100% fidelity.
2. **Strict Factual Qualifications Maintained:**
   - **350+ Student Entries:** Explicitly qualified as recurring activity register entries across village coaching hubs, not 350 unique students.
   - **120+ Course Enrolments:** Qualified as cumulative vocational course enrolments across tailoring cohorts, not necessarily 120 uniquely certified women.
   - **10,000+ Relief Instances:** Qualified as water and meal service instances delivered, not 10,000 unique citizens.
   - **Higher Education Target 200:** Accurately marked as "Proposed Target (Confirmed Funded: 0 / 200)".
   - **Statutory 12A/80G:** Accurately described as historical Form 10AC approval covering AY 2024-25 to AY 2026-27, with current tax treatment subject to CA review under the Income-tax Act, 2025 transition.
   - **WhatsApp:** Kept strictly disabled (`WHATSAPP_ENABLED=false`).

---

## 6. Phase 4.6 & 4.7 — Local Browser Acceptance & Image Verification Results

The local Next.js standalone server was started on `http://127.0.0.1:3005` with full static assets synchronized. Headless Chromium evaluated all 10 responsive viewports across 7 core routes (70 evaluations total):

### 6.1 Summary of 70 Browser Evaluations
- **Total Evaluations:** 70/70 PASSED (10 viewports × 7 routes).
- **Horizontal Overflow:** **0px across all 70 evaluations** (`Overflow: PASS`).
- **Broken Image Rate:** **0 broken images** across all 70 evaluations.
  - `/` (Homepage): **11/11 images OK** across all 10 viewports (including 1920px desktop widescreen).
  - `/about`: **3/3 images OK** across all viewports.
  - `/governance`: **4/4 images OK** across all viewports.
  - `/programmes`: **12/12 images OK** across all viewports.
  - `/campaigns`: **3/3 images OK** across all viewports.
  - `/donate`: **2/2 images OK** across all viewports.
  - `/contact`: **2/2 images OK** across all viewports.
- **Client Console Errors:** **0 errors recorded** across all 70 evaluations.
- **Founder Portrait Image (`er-japabandhu-kampa.webp`):**
  - Confirmed rendered with natural geometry across `/`, `/about`, and `/governance`: `naturalWidth: 96px to 128px`, `naturalHeight: 172px to 230px`, `complete: true`, `visible: true`.
  - Incremental scrolling wait ensured lazy-loaded images decoded without failure.

---

## 7. Build and Backend Test Evidence

- **TypeScript Typecheck:** `npx tsc --noEmit` exited with code 0 (0 errors).
- **ESLint Code Quality:** `npm run lint` exited with code 0 (0 errors, 5 non-blocking warnings in chart/donation effect hooks).
- **Next.js Production Build:** `npm run build` compiled successfully; 58/58 routes generated with zero errors.
- **Backend Test Suite:** `cd backend && mvn test -B` executed in 20:01 min with **142 tests run, 0 failures, 0 errors, 0 skipped**.

---

## 8. Phase 4 Completion Criteria Sign-Off

| Criteria | Mandate | Status | Evidence |
| :--- | :--- | :---: | :--- |
| **1. All 9 homepage sections present** | CinematicHero, InstitutionalStory, SafetyNet, Telemetry, FieldExhibition, Campaigns, Governance, Pathways, Pledge. | **PASS** | Verified in `src/app/page.tsx` and DOM evaluations. |
| **2. All unique content retained** | Headings, paragraphs, photographs, campaigns, disclosures. | **PASS** | Diff inspection confirms zero unique content deleted. |
| **3. Canonical sources wired** | Repeated facts wired to `ORG` and `MECT_CONTENT_REGISTRY`. | **PASS** | Deed number, dates, PAN, CSR-1, Darpan, e-Anudaan, bank, phone, email, address wired. |
| **4. Visual presentation intact** | Section order, typography, color palette, animations. | **PASS** | Verified via 70 Playwright screenshots in `audit/feature_branch_local/`. |
| **5. CTAs and destinations working** | All links point to correct destinations. | **PASS** | Verified across all 9 sections. |
| **6. Impact definitions accurate** | Qualified metrics (entries, enrolments, instances). | **PASS** | Fully preserved per documentary records. |
| **7. Image verification complete** | All images complete: true, naturalWidth > 0. | **PASS** | 100% loaded across all viewports (including 1920px). |
| **8. TypeScript, lint & build pass** | Clean compilation. | **PASS** | 0 TS errors, 0 lint errors, 58/58 routes built cleanly. |
| **9. Documentation reflects changes** | Canonical audit docs updated. | **PASS** | Documented in `docs/audits/MECT_PHASE_4_HOMEPAGE_CONTENT_DEDUPLICATION_REPORT.md`. |
| **10. Zero unapproved deletion** | No destructive edits, no VPS/DB changes. | **PASS** | Isolated feature branch only. |

