# MECT PHASE 21.5.7 — MANAGING TRUSTEE MESSAGE, INSTITUTIONAL LEADERSHIP & FIDUCIARY CHARTER REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** Phase 21.5 — Five-Section Homepage Editorial Architecture  
**Current Phase:** Phase 21.5.7 — Managing Trustee Message & Fiduciary Charter  
**Primary Destination:** `/governance` (`src/app/governance/page.tsx`)  
**Audit Date:** 16 November 2026  
**Execution Environment:** Node.js v22.18.0, Next.js 16.4.3 (Webpack/Standalone), React 19.3.0, Playwright 1.65.0  

---

## 1. Files Inspected and Modified

### 1.1 Files Modified
- **`src/app/governance/page.tsx`:**
  - Fully redesigned into a dignified, 5-part institutional leadership and fiduciary governance charter.
  - Eliminated speculative/unverified committee claims (e.g. hypothetical independent councils).
  - Implemented the official **Message on Institutional Stewardship** from the Office of the Managing Trustee & Board.
  - Grounded all trustee authority, quorum rules (≥ 2 or 1/3), and Clause XVI non-remuneration explicitly in registered Trust Deed No. 40311302194.
  - Added secretarial document inspection procedures and verified statutory credentials.

### 1.2 Files Created
- **`scripts/governance-qa-phase21-5-7.mjs`:**
  - Automated Playwright QA test verifying Managing Trustee credentials, stewardship message, Clause XVI boundaries, 10 viewports (0px overflow), reduced-motion support, zero console errors, and 5-section homepage integrity.
- **`reports/governance-phase21-5-7-results.json`:**
  - Machine-readable test execution report.
- **`reports/screenshots/phase21_5_7/`:**
  - Visual verification captures across all 10 responsive viewport sizes for `/governance`.

### 1.3 Files Inspected for Governance Verification
- `content/org.ts` (Official identifiers, deed number, registration dates, chairman designation).
- `content/trustees.ts` (Trustee profiles, clauses, confirmation markers).
- `content/compliance.ts` (12A/80G historical orders, deed wording).
- `content/todo-confirm.md` (Open fiduciary confirmation checklist).
- `src/app/page.tsx` (5-section homepage architecture preservation).

---

## 2. Current Managing Trustee Source Verification

| Verification Dimension | Registered Evidence / Record | Status & Wording Adopted |
|---|---|---|
| **Full Name** | Er. Japabandhu Kampa | Verified as officially recorded in Trust Deed and IT returns |
| **Exact Designation** | Settler Founder & Chairman cum Managing Trustee | Verified under Deed Clause 8(2) & Clause 10 |
| **Basis of Appointment** | Settler of Trust Deed No. 40311302194 executed 27-07-2013 | Verified (District Sub-Registrar, Balangir) |
| **Current Office Status** | Active permanent trustee and record custodian | Verified custodian of records, properties & bank accounts |
| **Documented Authority** | Custody of trust property, administration, presiding over trustee meetings, filing statutory returns, maintenance of books of accounts (Clause 16) | Confined strictly to Deed-documented powers; zero unverified executive claims |

---

## 3. Biography and Photograph Authorization Status

1. **Biography Verification:**
   - Er. Japabandhu Kampa is recognized as an engineer, educator, and settler founder of MECT.
   - All promotional, corporate-executive, or exaggerated founder narratives were strictly rejected.
   - The biography focuses solely on verified institutional custodianship and honorary governance under the Trust Deed.
2. **Photograph Authorization:**
   - In adherence to `content/todo-confirm.md` item 3, individual photographic portrait consent forms are pending formal execution.
   - In strict compliance with Prompt Phase A & Phase F:
     - **No stock photographs** or AI-generated headshots were used.
     - A dignified institutional monogram crest (`JK`) in deep forest green with gold borders is utilized, paired with verified statutory designations.

---

## 4. Message Source and Approval Status

1. **Attribution & Voice:**
   - Labelled clearly as **"A Message on Institutional Stewardship — From the Office of the Managing Trustee & Board"**.
   - Authored in dignified institutional voice, avoiding fabricated first-person personal anecdotes, invented memories, or unauthorized personal endorsements.
2. **Core Message Substance:**
   - **Charitable Purpose:** Grounded in the foundational commitment to educational access, women's livelihoods, and humanitarian relief in Western Odisha.
   - **Fiduciary Ethos:** Treats donor resources as a sacred stewardship governed by Clause XVI non-remuneration and direct bank remittances.
   - **Operational Honesty:** Explicitly distinguishes documented operational achievements (Balangir/Puintala learning circles, tailoring batches, Jal Seva kiosks) from aspirational future programs.
   - **Public Invitation:** Invites regulators, donors, and community members to inspect audited CA records at the Balangir Secretariat.

---

## 5. Trust Deed Clause Verification Matrix

| Charter Subject | Exact Deed Clause | Documented Legal Interpretation | Public Wording Adopted |
|---|---|---|---|
| **Charitable Purpose** | Section 4 & Clause 23 | Relief of poor, education, medical aid, general public utility; irrevocable public charitable intent. | Summarized accurately as education, women's livelihoods, clean water, and relief. |
| **Board Composition** | Clause 8(1) & 8(2) | Board comprises not less than 3 and not more than 9 trustees, including Chairman cum Managing Trustee. | Stated verbatim: Board comprises 3 to 9 honorary trustees. |
| **Meeting Quorum** | Clause 12 | Quorum requires at least 2 trustees or one-third of the total Board, whichever is greater. | Explicitly disclosed: Quorum ≥ 2 trustees or 1/3 of the Board. |
| **Honorary Non-Remuneration** | Section 9 Clause XVI | Trustees serve without salary or remuneration; reimbursement restricted to legitimate vouched expenses. | Disclosed with explicit boundary: applies strictly to Trustees, not implying zero vendor costs. |
| **Audit of Accounts** | Section 9(VII) & Clause 16 | Regular books of accounts and balance sheets must be prepared and audited annually by certified CAs. | Disclosed: Annual CA audits retained at Balangir Secretariat. |
| **Irrevocable Character** | Clause 25 | Trust and endowment funds are irrevocable for all times. | Disclosed: Irrevocable public trust covenant. |
| **Dissolution Safeguard** | Clause 24 | Net assets upon dissolution transfer strictly to institution(s) with similar charitable objects. | Disclosed: Net assets cannot be distributed to founders or trustees. |

---

## 6. Fiduciary Language and Exact Source References

The updated governance page establishes strict legal truth and eliminates previous ambiguities:

1. **Clause XVI Boundary Clarification:**
   > *"Trustees serve purely in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI. Note: This non-remuneration covenant applies to Trustees and does not imply zero operational, banking, or vendor procurement expenses."*
2. **Direct Bank Remittance:**
   > Disbursals are planned via direct institutional bank transfers (RTGS/NEFT) to accredited college bursar accounts and verified vendors, eliminating cash intermediaries.
3. **Record Inspection Protocol:**
   > Clearly defines the Balangir Registered Office (Near Sai Mandir, Rugudipara, Balangir) as the sanctioned venue for inspecting statutory orders and audited balance sheets during official hours.

---

## 7. Governance Page Content Architecture

The `/governance` route is consolidated into five coherent institutional parts:

1. **Header & Accreditation Strip:** Real-time statutory credentials banner (Deed No. 40311302194, PAN, 12A, 80G, CSR-1, NGO Darpan).
2. **Part 01 — Institutional Leadership (`#leadership`):** Verified profiles for Managing Trustee (`Er. Japabandhu Kampa`) and Board composition (3–9 trustees under Clause 8).
3. **Part 02 — Message on Stewardship (`#stewardship-message`):** Sincere institutional letter from the Office of the Managing Trustee & Board.
4. **Part 03 — The Fiduciary Charter (`#fiduciary-charter`):** Core stewardship principles, direct banking code, and Clause XVI non-remuneration scope.
5. **Part 04 — Registered Deed Mandates:** Clauses 8, 10, 12, 16, 23, 24, and 25 with irrevocable covenant markers.
6. **Part 05 — Public Inspection Registry (`#statutory-registry`):** Statutory credentials matrix and secretarial document inspection procedure.

---

## 8. Content Relocated or Consolidated

- **Speculative Committees Removed:** Speculative references to hypothetical independent councils ("Educational Appraisal Council", "Audit & Financial Scrutiny Panel") were removed, replacing them with the authentic governance structure established by the Trust Deed: the Board of Trustees, independent Chartered Accountants, and the Balangir administrative Secretariat.
- **Redundant Disclosures Consolidated:** General tax estimation calculators and operational scheme explorers remain on `/scholarships` and `/statutory-disclosures`, keeping `/governance` focused purely on fiduciary leadership and deed covenants.

---

## 9. Navigation and Route Verification

- All navigation links in the header, footer, and subcomponents to `/governance` resolve correctly with HTTP 200.
- All internal cross-links on `/governance` were verified:
  - `/statutory-disclosures` (HTTP 200)
  - `/reports` (HTTP 200)
  - `/contact` (HTTP 200)
  - `/about` (HTTP 200)

---

## 10. Accessibility and Responsive Test Results

Automated Playwright browser testing was executed across all 10 standard viewports:

| Viewport | Dimensions (W x H) | Horizontal Overflow | Result |
|---|---|---|---|
| Ultra-compact mobile | 320px x 640px | **0px** | **PASS** |
| Standard Android | 360px x 740px | **0px** | **PASS** |
| Modern iPhone | 390px x 844px | **0px** | **PASS** |
| Flagship mobile | 430px x 932px | **0px** | **PASS** |
| Tablet portrait | 768px x 1024px | **0px** | **PASS** |
| Tablet landscape | 1024px x 768px | **0px** | **PASS** |
| Small laptop | 1280px x 800px | **0px** | **PASS** |
| Desktop HD | 1440px x 900px | **0px** | **PASS** |
| Large desktop | 1920px x 1080px | **0px** | **PASS** |
| Mobile landscape | 844px x 390px | **0px** | **PASS** |

- **Reduced Motion:** Verified with `prefers-reduced-motion: reduce`. Content displays instantly with zero layout shifts or animation delays.
- **Browser Console:** 0 console errors detected.
- Visual screenshots saved to `reports/screenshots/phase21_5_7/`.

---

## 11. TypeScript, ESLint and Production Build Results

1. **TypeScript Validation:**
   ```bash
   npm run typecheck
   # Output: Exit code 0, 0 type errors across entire codebase.
   ```
2. **ESLint Audit:**
   ```bash
   npx eslint src/app/governance/page.tsx
   # Output: Exit code 0, 0 errors, 0 warnings.
   ```
3. **Next.js Production Build:**
   ```bash
   npm run build
   # Output: Exit code 0, all 41 routes prerendered cleanly.
   # Route: ○ /governance (Prerendered static content)
   ```

---

## 12. Homepage Five-Section Regression Result

Automated Playwright evaluation confirmed:

```json
{
  "totalSectionsFound": 5,
  "exactFiveCount": true,
  "actualIds": [
    "hero",
    "institutional-intro",
    "development-pillars",
    "stories",
    "institutional-impact"
  ],
  "orderMatches": true,
  "noSixthSection": true
}
```

- Zero additional sections or duplicate leadership cards were added to the homepage.
- The homepage strictly retains the 5 canonical sections established in Phase 21.5.5.3.

---

## 13. Final Git Status

```text
On branch feat/phase-21-1-design-system
Changes not staged for commit:
	modified:   backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java
	modified:   backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java
	modified:   content/stories.ts
	modified:   src/app/about/page.tsx
	modified:   src/app/globals.css
	modified:   src/app/governance/page.tsx
	modified:   src/app/layout.tsx
	modified:   src/app/page.tsx
	modified:   src/app/scholarships/page.tsx
	modified:   src/app/statutory-disclosures/page.tsx
	modified:   src/components/DirectDisbursalFlowchart.tsx
	modified:   src/components/EligibilityCalculator.tsx
	modified:   src/components/Header.tsx
	modified:   src/components/PageHero.tsx
	modified:   src/components/SchemeExplorer.tsx
	modified:   src/components/layout/StatutoryTicker.tsx
	modified:   src/components/motion/index.ts
	modified:   src/components/sections/FreeEducationSection.tsx
	modified:   src/components/sections/StoriesRailSection.tsx
	modified:   src/components/ui/MotionPrimitives.tsx
	modified:   src/components/ui/SectionHeader.tsx
	modified:   src/lib/homepage-content.ts

Untracked files:
	MECT_PHASE_21_5_7_MANAGING_TRUSTEE_FIDUCIARY_CHARTER_REPORT.md
	reports/governance-phase21-5-7-results.json
	reports/screenshots/phase21_5_7/
	scripts/governance-qa-phase21-5-7.mjs
```

---

## 14. Backend and Payment Integrations Preservation

All uncommitted backend payment files and database migrations remain completely intact:
- `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java`
- `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql`
- No destructive git operations were executed; no commits, pushes, merges, or remote deployments occurred.

---

## 15. Unresolved Governance or Authorization Issues

1. **Additional Trustees Roster:** Per `content/todo-confirm.md` item 3, full verified bios, designations, and consented photographs of additional trustees (within the 3–9 member constitutional range under Clause 8) remain pending formal secretariat sign-off (`{{CONFIRM: trustee list}}`).
2. **Managing Trustee Portrait Photo:** Physical photograph publication remains deferred until formal written photo consent is countersigned, with the verified institutional crest utilized in the interim.
3. **Statutory Audit FY 2024–25:** Form 10B audit statements for the concluding financial cycle remain documented as pending statutory audit closure.

---

**ACCEPTANCE VERDICT:** **PHASE 21.5.7 FULLY COMPLETE AND ACCEPTED.**  
Production server is live and responsive at `http://localhost:3000`.  
No git commits, pushes, merges, or Phase 21.5.8 tasks have been initiated.
