# MECT PHASE 21.5.7.1 — MANAGING TRUSTEE AUTHORITY, FIDUCIARY CHARTER & PUBLICATION AUTHORIZATION CLOSURE REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-21-1-design-system`  
**Current Subphase:** 21.5.7.1 — Managing Trustee Authority, Fiduciary Charter & Publication Authorization Closure  
**Parent Phase:** 21.5.7 — Managing Trustee Message & Fiduciary Charter  
**Primary Destination:** `/governance` (`src/app/governance/page.tsx`)  
**Date:** November 2024 / November 2026 Audit Cycle  
**Status:** COMPLETE & VERIFIED

---

## 1. Leadership Evidence & Current Appointment Verification

### 1.1 Constitutional & Historical Foundations
- **Registered Document:** Trust Deed No. 40311302194, Book No. 4, Volume No. 13, Pages 194 to 204.
- **Execution & Registration:** Executed on 27 July 2013; registered on 30 July 2013 at the Office of the Sub-Registrar, Balangir, Odisha.
- **Settler & Managing Trustee:** **Er. Japabandhu Kampa** is named as the Settler of the Trust and is designated under founding Deed **Clause 8(2)** and **Clause 10** as **Chairman cum Managing Trustee**.
- **Founding Powers:** Clause 10 outlines executive and administrative duties:
  1. Custody of trust properties and title documents.
  2. Maintenance of regular books of accounts and records.
  3. Presiding over Board meetings and convening trust proceedings.
  4. Day-to-day administrative custodianship under the collective oversight of the Board.

### 1.2 Separation of Historical Settler Status vs. Ongoing Custodianship
- In previous iterations, the page risked conflating historical settler status with automatic, unbounded personal authority.
- **Correction Applied:** The Managing Trustee profile card on `/governance` was revised to clearly distinguish:
  - **Founding Settler Status:** Execution of the founding deed on 27 July 2013 in Balangir.
  - **Statutory Custodianship:** Custodial authority derived from founding deed Clauses 8(2) and 10, operating in an honorary, non-remunerated capacity subject to collective Board quorum.
  - **Board Roster Transparency:** Clarified that the Board operates with 3 to 9 trustees per Clause 8(1), and that individual consented trustee biographical profiles for the full current roster are tracked under active secretariat confirmation (`content/todo-confirm.md`, Item 3).

---

## 2. Message Authorization Status & Stewardship Statement Refactoring

### 2.1 Refactoring of Simulated Speeches/Letters
- **Previous Risk:** The section had simulated a first-person personal letter/speech with colloquial quotation marks, implied personal signatures, and promotional rhetoric.
- **Correction Applied:**
  - Section title relabeled from a personal speech to: **`Institutional Stewardship Statement`**.
  - Badge updated to: **`Governance Statement`** and footer categorized under **`Institutional Policy`** / **`Deed-Bound Covenant`**.
  - All artificial first-person personal quotes and simulated signatures were eliminated.
  - Narrative reframed as an institutional declaration of operating ethics, fiduciary discipline, and community commitments adopted by the Trust.

### 2.2 Institutional Stewardship Principles Expressed
1. **Public Stewardship Principle:** Charitable contributions represent a public fiduciary obligation requiring transparent administration and verifiable outcomes.
2. **Statutory Non-Remuneration (Clause XVI):** Reaffirms that every trustee serves without salary, sitting fees, or financial commissions.
3. **Evidence Distinction:** Explicitly distinguishes documented operational achievements (e.g., Balangir and Puintala learning circles, tailoring cohorts, Jal Seva kiosks) from aspirational programs currently under planning.

---

## 3. Final Statutory Registration Labels & Credential Verification

### 3.1 Renaming of the "Accreditation Strip"
- **Previous Label:** "Accreditation Strip" / "Real-Time Verification Strip".
- **Critique:** Statutory tax registrations (12A/80G) and corporate CSR registrations are statutory compliance authorizations, not voluntary educational or technical accreditations (like NAAC or NBA). Furthermore, "real-time" implied a live API heartbeat to government databases that is neither present nor lawful without official API gateways.
- **Corrected Label:** **`Statutory Registrations & Institutional Identifiers`** with `aria-label="Statutory Registrations & Institutional Identifiers"`.
- **Temporal Baseline:** Replaced "real-time" with `"Verified against Government registries as of November 2024."`

### 3.2 Matrix of the 6 Verified Statutory Identifiers

| # | Registration / Identifier | Formal Number / ID | Issuing Authority & Provenance | Validity / Orders |
|---|---|---|---|---|
| **1** | **Trust Deed Registration** | Doc No. **40311302194** | Sub-Registrar, Balangir, Govt. of Odisha | Executed 27-07-2013; Registered 30-07-2013 |
| **2** | **Income Tax Section 12A** | URN **AAATM1840ME20210** | Commissioner of Income Tax (Exemption), CBDT | Order dt. 24-09-2021; AY 2022-23 to 2026-27 |
| **3** | **Income Tax Section 80G** | URN **AAATM1840MF20210** | Commissioner of Income Tax (Exemption), CBDT | Order dt. 24-09-2021; 50% Donor Tax Exemption |
| **4** | **MCA CSR-1 Registration** | **CSR00081063** | Ministry of Corporate Affairs, Govt. of India | Approval dt. 09-11-2024; SRN: N14617237 |
| **5** | **NITI Aayog NGO Darpan** | **OR/2024/0466491** | NITI Aayog Voluntary Sector Registry | Registered state: Odisha (District: Balangir) |
| **6** | **Permanent Account Number** | **AAATM1840M** | Income Tax Department, Govt. of India | Entity Type: Trust (4th char: 'T') |

---

## 4. Clause-by-Clause Verification Matrix

The registered Trust Deed (Document No. 40311302194) was audited clause-by-clause. Eight fundamental clauses were extracted, codified, and presented in the UI matrix:

| Deed Clause | Title in UI | Constitutional Mandate & Fiduciary Limitation | UI Location & Implementation |
|---|---|---|---|
| **Clause 8(1)** | **Board Size (3–9 Trustees)** | Mandates a Board of Trustees comprising not less than 3 and not more than 9 members. Enforces collective fiduciary governance rather than sole-proprietor control. | Rendered in Deed Matrix and Board Composition Card. |
| **Clause 8(2) & 10** | **Managing Trustee Powers & Custodianship** | Designates Settler Er. Japabandhu Kampa as Chairman cum Managing Trustee. Assigns custody of records, books of accounts, and property. | Rendered in Deed Matrix and Managing Trustee Card. |
| **Clause 12** | **Meeting Quorum Requirements** | Prescribes that meeting quorum requires at least 2 trustees or one-third of the total Board of Trustees, whichever is greater. | Rendered in Deed Matrix and Board Composition Card. |
| **Section 9 Clause XVI** | **Strict Honorary Non-Remuneration** | Trustees serve in an honorary capacity without salary, sitting fees, or profit-sharing. Reimbursable claims are restricted strictly to actual, vouched expenses properly incurred on Trust duties. | Rendered in Deed Matrix, Fiduciary Charter Card 01, and Alert Banner. |
| **Section 9(VII) & Clause 16** | **Lawful Investments & Annual CA Audit** | Mandates investment of trust funds strictly in modes authorized under Section 11(5) of the Income-tax Act. Mandates regular books of accounts and annual audit by a certified Chartered Accountant. | Rendered in Deed Matrix and Fiduciary Charter Card 04. |
| **Clause 23** | **Preservation of Charitable Intent** | Mandates that no power, rule, or regulation shall be altered or applied in any manner repugnant to Section 12A/80G or public charitable trust norms. | Rendered in Deed Matrix and Fiduciary Charter Card 02. |
| **Clause 24** | **Dissolution & Asset-Transfer Safeguards** | In the event of dissolution or winding up, net assets cannot be distributed to founders or trustees, but must transfer to another registered trust with similar charitable objects. | Rendered in Deed Matrix and Fiduciary Charter Card 03. |
| **Clause 25** | **Perpetual Irrevocable Character** | Declares the Trust and its endowment funds irrevocable for all times, dedicating assets permanently to public charitable purposes. | Rendered in Deed Matrix. |

---

## 5. Board Composition & Quorum Evidence

### 5.1 Constitutional Range & Collective Governance
- **Clause 8(1)** establishes that the Board shall comprise between 3 and 9 trustees.
- Fiduciary decisions (budget allocations, bank mandates, statutory filings) require collective Board consensus and cannot be executed ultra vires by an individual trustee.

### 5.2 Quorum Rules
- **Clause 12** requires:
  $$\text{Quorum} = \max\left(2, \left\lceil \frac{N}{3} \right\rceil\right)$$
  where $N$ is the active number of trustees ($3 \le N \le 9$).
- For $N = 3$, quorum is 2 trustees. For $N = 9$, quorum is 3 trustees.

### 5.3 Public Disclosure Policy for Additional Trustees
- To uphold data privacy and statutory integrity, individual trustee profiles are disclosed only upon verified consent and certified secretarial documentation.
- The UI explicitly informs visitors:
  > *"Under Clause 8(1) of the registered Trust Deed, the Board comprises not less than 3 and not more than 9 honorary trustees. Trustees exercise collective oversight over charitable budgets, audit approvals, and statutory compliance. Formal updated biographical records and consented profiles for the full current roster are tracked under secretariat confirmation."*

---

## 6. Clause XVI Non-Remuneration Wording Verification & Bounded Scope

### 6.1 The Misinterpretation Risk
- In unvetted NGO messaging, "100% of donations go to the cause" or "Trustees take no money" can be erroneously conflated with "Zero overhead" or "Zero administrative costs".
- Such assertions are legally problematic and accounting fallacies, as every functioning public trust incurs:
  - Bank transfer charges and NEFT/RTGS gateway fees.
  - Statutory Chartered Accountant audit fees under Clause 16.
  - Direct supplier costs (textbooks, sewing machines, tailoring cloth).
  - Essential administrative utilities and office rent.

### 6.2 Bounded Scope Implementation
The scope of Clause XVI was strictly qualified in two prominent locations on `/governance`:
1. **Deed Clause Matrix (`keyDeedClauses[3]`):**
   > *"Trustees serve purely in an honorary capacity without salary, allowance, sitting fees, or personal commissions from trust funds. Reimbursable claims are restricted strictly to actual, documented, and vouched expenses properly incurred in discharging Trust duties. Note: This non-remuneration standard applies to Trustees and does not imply zero operational, banking, or vendor procurement expenses."*
2. **Prominent Alert Banner (`#fiduciary-charter`):**
   > *"Trustees serve strictly in an honorary capacity without salary or fees. This non-remuneration standard applies strictly to Trustees and does not imply zero operational, banking, or vendor procurement expenses; legitimate third-party operational costs (e.g. bank transfer charges, certified Chartered Accountant audit fees, college fee remittances, and workshop supplies) are incurred and accounted for under strict ledger controls."*

---

## 7. Auditor & Public Document Inspection Evidence

### 7.1 Certified Chartered Accountant Audit (Clause 16)
- **Trust Deed Mandate:** Clause 16 mandates that regular books of accounts, receipts, disbursements, and annual balance sheets be audited annually by a certified Chartered Accountant.
- **Accurate Wording:** Avoids inflated phrases such as "independent multinational statutory audit firm" without specific engagement letters; accurately cites "certified Chartered Accountant under Clause 16".

### 7.2 Secretariat Document Inspection Procedure
- **Physical Venue:**
  Mahaveer Educational & Charitable Trust (MECT)  
  Registered Office: Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001
- **Inspection Protocol:**
  - Hours: Monday through Saturday, 10:00 to 17:00 IST.
  - Requirement: **By prior written appointment only**.
- **Scope of Public Inspection:**
  - Certified copies of the registered Trust Deed (Doc No. 40311302194).
  - Official CBDT Section 12A and Section 80G approval orders.
  - Ministry of Corporate Affairs CSR-1 registration acknowledgement.
  - Annual certified Balance Sheet summaries.
- **Data Protection & Confidentiality Safeguards:**
  - The UI explicitly clarifies:
    > *"Public inspection applies strictly to statutory registrations and audited annual financial summaries. Individual student scholarship applications, personal identifying documents, and donor transaction records are protected under institutional privacy standards and applicable data protection legislation."*

---

## 8. Exact Content Corrections Summary

| File / Component | Old / Problematic Phrasing | New / Corrected Phrasing | Reason for Correction |
|---|---|---|---|
| `src/app/governance/page.tsx` | `aria-label="Accreditation Strip"` | `aria-label="Statutory Registrations & Institutional Identifiers"` | Statutory tax registrations are not educational accreditations. |
| `src/app/governance/page.tsx` | `"Real-Time Statutory Credential Registry"` | `"Statutory Registrations & Institutional Identifiers Strip"` | Eliminates false implication of a live API handshake. |
| `src/app/governance/page.tsx` | `"Real-time verification against central registries"` | `"Verified against Government registries as of November 2024."` | Cites accurate temporal verification baseline. |
| `src/app/governance/page.tsx` | `Section 02: "Managing Trustee Message"` (with personal speech quotes) | `Section 02: "Institutional Stewardship Statement"` (Badge: `Governance Statement`) | Converts simulated personal speech into dignified institutional policy. |
| `src/app/governance/page.tsx` | Clause XVI unqualified statement ("zero overhead / 100% voluntary") | Qualified bounded scope: *"This non-remuneration standard applies strictly to Trustees and does not imply zero operational, banking, or vendor procurement expenses"* | Prevents misleading financial representations. |
| `src/app/governance/page.tsx` | Unqualified open public inspection of records | Inspection at Balangir Secretariat *"by prior written appointment"*; student and donor data protected | Protects beneficiary and donor privacy under Indian data protection standards. |
| `scripts/governance-qa-phase21-5-7.mjs` | Tested old element IDs and unstructured strings | Automated checks for all 8 deed clauses, bounded scope, qualified inspection, and 10 viewports | Ensures rigorous, repeatable regression protection. |

---

## 9. Test & Build Verification Results

### 9.1 TypeScript Typecheck
- **Command:** `npm run typecheck`
- **Result:** **Exit Code 0** (0 type errors across entire codebase).

### 9.2 ESLint Static Analysis
- **Command:** `npx eslint src/app/governance/page.tsx`
- **Result:** **Exit Code 0** (0 errors, 0 warnings).

### 9.3 Next.js Production Build
- **Command:** `npm run build`
- **Result:** **Exit Code 0**. All 41 routes static prerendered cleanly.
- Route `/governance` compiled size: **6.01 kB**, First Load JS: **137 kB**.

### 9.4 Playwright Comprehensive Automated QA Suite
- **Script:** `scripts/governance-qa-phase21-5-7.mjs`
- **Execution Date:** 2026-11-16T18:10:06.487Z
- **Results Output:** `reports/governance-phase21-5-7-results.json`
- **Key Assertions:**
  - `governancePageAudit.httpStatus`: `200`
  - `governancePageAudit.managingTrusteeName`: `"Er. Japabandhu Kampa"`
  - `governancePageAudit.managingTrusteeBadge`: `"Deed Clause 8(2) & 10"`
  - `statutoryStripAudit.isCorrectlyRenamed`: `true` (`Statutory Registrations & Institutional Identifiers`)
  - `stewardshipStatementAudit.isStatementNamed`: `true` (`Institutional Stewardship Statement`)
  - `stewardshipStatementAudit.hasNoFabricatedQuotes`: `true`
  - `clauseMatrixAudit.allClausesPresent`: `true` (8/8 clauses verified: Clauses 8(1), 8(2) & 10, 12, XVI, 9(VII) & 16, 23, 24, 25)
  - `clauseMatrixAudit.hasBoundedScope`: `true`
  - `inspectionProcedureAudit.inspectionQualified`: `true` (Appointment required: `true`, Confidentiality safeguard: `true`)
  - `reducedMotionTest`: `PASS` (CSS animations safely disabled under `prefers-reduced-motion: reduce`)
  - `consoleErrors`: `0`
- **Responsive Viewport Matrix (0px Horizontal Overflow Verified):**

| Viewport Name | Resolution ($W \times H$) | Horizontal Overflow | Result | Screenshot Artifact |
|---|---|---|---|---|
| **Mobile Extra Small** | $320 \times 640$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_320px.png` |
| **Mobile Small** | $360 \times 740$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_360px.png` |
| **Mobile Standard (iPhone)** | $390 \times 844$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_390px.png` |
| **Mobile Large (Pixel / Max)** | $430 \times 932$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_430px.png` |
| **Tablet Portrait** | $768 \times 1024$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_768px.png` |
| **Tablet Landscape / Small Laptop**| $1024 \times 768$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_1024px.png` |
| **Desktop Standard** | $1280 \times 800$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_1280px.png` |
| **Desktop Wide (MacBook / FHD)** | $1440 \times 900$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_1440px.png` |
| **Desktop 1080p Ultra** | $1920 \times 1080$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_1920px.png` |
| **Mobile Landscape** | $844 \times 390$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_landscape.png` |

### 9.5 Homepage 5-Section Architecture Retention
- **Audit Tool:** Verified during Playwright run against `http://localhost:3000/`.
- **Results:**
  - `totalSectionsFound`: `5`
  - `exactFiveCount`: `true`
  - `orderMatches`: `true`
  - `noSixthSection`: `true`
  - **Verified Sequence:**
    1. `#hero` (`CinematicHero`)
    2. `#institutional-intro` (`InstitutionalIntroSection`)
    3. `#development-pillars` (`DevelopmentPillarsSection`)
    4. `#stories` (`StoriesRailSection` — Field Dispatches)
    5. `#institutional-impact` (`InstitutionalImpactSection`)

---

## 10. Final Git Status & Work Preservation Confirmation

### 10.1 Active Branch & Clean Staging
- **Active Branch:** `feat/phase-21-1-design-system`
- **Git State:** Working tree clean of accidental staged commits; all uncommitted changes preserved.

### 10.2 Preserved Financial Backend & Previous Phase Work
The following critical backend services, payment implementations, migrations, and prior phase artifacts remain intact:
- `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java`
- `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql`
- All phase reports (Phases 21.1 through 21.5.7).

### 10.3 Mandate Compliance
- No destructive git operations were executed (`git reset`, `git clean`, `git checkout .`, `git restore .`).
- No blanket staging (`git add .`), commits, pushes, or deployments were performed.
- Subphase 21.5.7.1 is complete. Development is halted prior to Phase 21.5.8 in accordance with explicit stopping instructions.
