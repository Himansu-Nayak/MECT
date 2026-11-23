# MECT PHASE 21.5.7.2 — FINAL STATUTORY & LEADERSHIP SOURCE RECONCILIATION REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5.7 — Managing Trustee Message & Fiduciary Charter  
**Current Subphase:** 21.5.7.2 — Final Statutory & Leadership Source Reconciliation  
**Primary Destination:** `/governance` (`src/app/governance/page.tsx`) & `/statutory-disclosures`  
**Date:** November 2024 / November 2026 Audit Cycle  
**Status:** COMPLETE, RECONCILED & FORENSICALLY VERIFIED

---

## 1. Conflicting Identifier Inventory

A comprehensive forensic audit of project documentation and previous phase reports revealed an acute conflict between two distinct sets of institutional identifiers:

| Identifier Attribute | Set A (Earlier Historical Records & Codebase) | Set B (Phase 21.5.7.1 Report Discrepancy) | Nature of Discrepancy & Root Cause |
|---|---|---|---|
| **Permanent Account Number (PAN)** | `AADTM5474F` | `AAATM1840M` | `AAATM1840M` was an erroneous hallucination introduced solely in the Markdown table of report `MECT_PHASE_21_5_7_1_GOVERNANCE_AUTHORITY_CLOSURE_REPORT.md`. No such PAN exists in the codebase or in any certificate on file. |
| **Section 12A URN** | `AADTM5474FE20231` | `AAATM1840ME20210` | Derived from the respective PAN prefix. Set B was completely fictitious. |
| **Section 12A DIN** | `AADTM5474FE2023101` | *Unstated in Set B* | Official CBDT Document Identification Number present only on Form 10AC for Set A. |
| **Section 80G URN** | `AADTM5474FF20241` | `AAATM1840MF20210` | Derived from the respective PAN prefix. Set B was completely fictitious. |
| **Section 80G DIN** | `AADTM5474FF2024101` | *Unstated in Set B* | Official CBDT Document Identification Number present only on Form 10AC for Set A. |
| **Trust Deed Registration** | `No. 40311302194` | `No. 40311302194` | Concordant across all records (Book 4, Vol 45, Sub-Registrar Balangir). |

---

## 2. Original Source-Document Register

All primary scanned documents were located in the project's primary documentary archive `MECT Proposal - Jindal_compressed (1).pdf` (71 pages) and extracted/OCR-verified:

| # | Document Category | Source Document File & Pages | Issuing Authority | Legal Entity Name on Document | Document Date & Validity |
|---|---|---|---|---|---|
| **1** | **Permanent Account Number (PAN) Card** | `MECT Proposal - Jindal_compressed (1).pdf`, Page 27 (`page_27_0_X26.jpg`) | Income Tax Department, Government of India | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | Allotment Date: `27/07/2013`; PAN: **`AADTM5474F`** (Entity: Trust / 4th char: 'T') |
| **2** | **Form 10AC Section 12A Provisional Order** | `MECT Proposal - Jindal_compressed (1).pdf`, Pages 29–30 (`page_29_0_X28.jpg`, `page_30_0_X29.jpg`) | Principal Commissioner / Commissioner of Income Tax (Signed by Amrita Ranjan) | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`, Plot No. 1592/9994, Kampa Tower, Near LIC Office, Chandrasekhar Nagar, Balangir - 767002 | Order Date: **`29-01-2024`**; Validity: **AY 2024-25 to AY 2026-27**; URN: **`AADTM5474FE20231`**; DIN: **`AADTM5474FE2023101`**; App No: `905152030180124` |
| **3** | **Form 10AC Section 80G Provisional Approval** | `MECT Proposal - Jindal_compressed (1).pdf`, Pages 31–32 (`page_31_0_X30.jpg`, `page_32_0_X31.jpg`) | Principal Commissioner / Commissioner of Income Tax (Signed by Amrita Ranjan) | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`, Plot No. 1592/9994, Kampa Tower, Near LIC Office, Chandrasekhar Nagar, Balangir - 767002 | Order Date: **`29-01-2024`**; Validity: **AY 2024-25 to AY 2026-27**; URN: **`AADTM5474FF20241`**; DIN: **`AADTM5474FF2024101`**; App No: `905076250180124` |
| **4** | **MCA CSR-1 Registration Letter** | `MECT Proposal - Jindal_compressed (1).pdf`, Page 28 (Digital text) | Office of Registrar of Companies, Ministry of Corporate Affairs, Govt of India | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`, Chandrasekhar Nagar, Post Rajendra College, Balangir - 767001 | Approval Date: **`09-11-2024`**; SRN: **`N14617237`**; Registration No: **`CSR00081063`**; PAN printed: `AADTM5474F` |
| **5** | **NITI Aayog NGO Darpan Enrollment** | `MECT Proposal - Jindal_compressed (1).pdf`, Page 33 (`page_33.jpg`) | NITI Aayog in association with National Informatics Centre (NIC) | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | Unique ID: **`OR/2024/0466491`**; State: Odisha; District: Balangir |
| **6** | **Registered Trust Deed No. 40311302194** | `MECT Proposal - Jindal_compressed (1).pdf`, Pages 10–26 (`deed_p10` to `deed_p26`) | Office of the District Sub-Registrar, Balangir, Govt of Odisha | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | Execution: **`27-07-2013`**; Registration: **`30-07-2013`**; Book No: **4**, Vol: **45**, Doc No: **`40311302194`** |

---

## 3. Final Verified PAN, 12A and 80G Values

As evidenced directly by the official scans:

| Statutory Attribute | Confirmed Value | Verification Authority & Provenance | Public Disclosure Policy |
|---|---|---|---|
| **Legal Entity Name** | **Mahaveer Educational & Charitable Trust (MECT)** | Registered Trust Deed 2013, PAN Card, Form 10AC Orders | Full public disclosure sitewide. |
| **Trust PAN** | **`AADTM5474F`** | Income Tax Dept Card (27/07/2013), Form 10AC Orders | Published in Statutory Disclosures, CSR filings, and Footer. |
| **Section 12A URN** | **`AADTM5474FE20231`** | Form 10AC Order dt. 29-01-2024 (DIN: `AADTM5474FE2023101`) | Published with explicit order date and AY window (2024-25 to 2026-27). |
| **Section 80G URN** | **`AADTM5474FF20241`** | Form 10AC Order dt. 29-01-2024 (DIN: `AADTM5474FF2024101`) | Published with explicit historical boundary (FY 2023-24 to FY 2025-26; AY 2024-25 to AY 2026-27). Tax Year 2026-27 regular approval noted as unverified. |
| **MCA CSR-1 ID** | **`CSR00081063`** | ROC Approval Letter dt. 09-11-2024 (SRN: `N14617237`) | Published sitewide for institutional CSR partnerships. |
| **NITI Aayog Darpan** | **`OR/2024/0466491`** | Portal Certificate (Page 33 of Proposal archive) | Published sitewide. |
| **Status of Set B (`AAATM1840M`)** | **`EXPUNGED & INVALID`** | None (clerical hallucination in Phase 21.5.7.1 report) | Permanently purged from all reports and tests. |

---

## 4. Managing Trustee Authority Assessment

### 4.1 Historical Settler Founder vs. Present Office-Holder Authority
- **Deed Evidence (Executed 27-07-2013, Registered 30-07-2013):**
  - Sri Japabandhu Kampa is designated under **Clause 8(2)** as the *"life founder Chairman cum Managing Trustee of the Trust"*.
  - Under **Clause 10(I)**: *"The administrative power of the Trust shall vest with Founder Chairman/ Chairman cum Managing Trustee."*
  - Under **Clause 10(V)**: *"The entire property, movable or immovable shall be hold, acquired and possessed by the Chairman cum Managing Trustee on behalf of the Trust."*
- **Current Office-Holding Status:**
  - While founding deed Clause 8(2) designated Sri Japabandhu Kampa as life founder Chairman cum Managing Trustee, present-day governance rules prohibit asserting independent third-party verification of ongoing office-holding without contemporaneous board resolutions and updated trustee registers.
- **Adopted Public Display Policy on `/governance`:**
  - Badge updated to: **`Settler Founder (Deed 2013)`**.
  - Narrative explicitly states: *"Named as Settler Founder in the registered Trust Deed (executed 27 July 2013; registered 30 July 2013, Office of the District Sub-Registrar Balangir, Book 4, Vol 45, Doc No. 40311302194) and designated life founder Chairman cum Managing Trustee under founding deed Clauses 8(2) and 10. Custodianship of Trust properties and statutory filings is derived from founding deed provisions; formal re-confirmation of the active board roster and present resolutions is tracked under secretariat records."*
  - Footer tag: **`Founder Custodian`** / **`Honorary Service`**.

---

## 5. Clause-by-Clause Source Verification Matrix

Verbatim analysis of registered Trust Deed No. `40311302194` (Book 4, Vol 45):

| Cited Deed Provision | Verbatim Heading / Numbering in Registered Deed | Exact Quoted Deed Text / Mandate | UI Codification in `keyDeedClauses` |
|---|---|---|---|
| **Clause 8(1)** | `8. BOARD OF TRUSTEES` / `1.` | *"The management and control of the Trust and the Trust properties shall vest in Board of Trustees, which shall comprise not less than three and not more than nine Trustees at any point of time including one Chairman cum Managing Trustee."* | `Clause 8(1)`: Board size 3–9 Trustees at any point of time. |
| **Clause 8(2) & 10** | `8. BOARD OF TRUSTEES` / `2.` & `10. POWER AND FUNCTIONS OF THE CHAIRMAN MANAGING TRUSTEE` | *"Sri Japabandhu Kampa shall be the life founder Chairman cum Managing Trustee of the Trust and shall have powers duties and functions as assigned to him under these presents."* / *"The administrative power of the Trust shall vest with Founder Chairman/ Chairman cum Managing Trustee."* | `Clause 8(2) & 10`: Managing Trustee Powers & Custodianship. |
| **Clause 12** | `12. QUORUM` | *"A minimum numbers of 2 or of one third of the total Trustees in the Board which ever is more shall constitute quorum for a valid meeting of the Board."* | `Clause 12`: Quorum: $\ge 2$ or $1/3$ of Board, whichever is more. |
| **Clause 9(XVI)** | `9. POWER & FUNCTION OF BOARD OF TRUSTEES` / `XVI.` *(Resolved from ambiguous "Section 9 Clause XVI")* | *"The Trustee shall not be entitled to any remuneration and shall work in an honorary capacity. However Trustee may reimburse himself, or pay or discharge out of the Trust fund all expenses properly incurred in or about the execution of the Trust, or the realization, preservation, or benefit of the Trust. Besides conveyance may be paid to the member for attending meeting..."* | `Clause 9(XVI)`: Strict Honorary Non-Remuneration (with bounded scope noting third-party operating expenses). |
| **Clause 9(VII) & Clause 16** | `9. POWER & FUNCTION...` / `VII.` & `16. MAINTAINANCE OF BOOKS OF ACCOUNTS` *(Resolved from "Clause 16 audit vs Clause XVI honorary")* | *"Subject to any mandatory provision of any law for the time being in force and applicable to the Trust, the Board of Trustees shall invest fund which requires investment of whatsoever nature in the manner..."* / *"The books of account of the trust shall be maintained regularly... At the end of the every financial year the Income and expenditure account shall be prepared and the Balance Sheet shall be drawn. The account shall be audited by a Charted Accountant./ Cost Accountant or by any public Auditor appointed by the Government of Orissa"* | `Clause 9(VII) & Clause 16`: Lawful Investments & Books of Accounts / Annual CA Audit. |
| **Clause 23** | `23. AMMENDMENTSOE THE CLAUSES OF THIS TRUST` | *"neither the settler Founder nor the Board of trustees shall have the power to revoke the trust deed and alter the aims and objectives of the trust and also they shall have no power to change, alter or amend the trust deed which may prove to be repugnant to the provisions of section 2(15), section 11 to section 13 and section 80G of the Income Tax Act 1961... general meeting... unanimously agree..."* | `Clause 23`: Preservation of Charitable Intent & Non-Repugnance. |
| **Clause 24** | `24. DECLARATIONS` | *"The income as also the corpus of the trust fund shall be applied and be applicable only to or for such public educational and charitable purposes only and within such territories and subject to such conditions or limitations... as may from time to time be laid down in the Income Tax Act 1961... It is expressly declared that no part of the trust property or its income or any accretion thereto shall be applied for any purpose outside India..."* | `Clause 24`: Territorial Application Solely Within India & Tax Exemption. |
| **Clause 25** | `25. EXUNGUISIIMENT OF TRUST.` | *"The Trust and the Trust fund shall be irrevocable for all times. In case, for any compelling reason, the Trust becomes incapable of functioning... the entire trust fund and property shall be handed over to other Trust (s) or Institution (s) having similar [objects]"* | `Clause 25`: Perpetual Irrevocability & Extinguishment Safeguards. |

---

## 6. Correct Quorum Interpretation

### 6.1 Verbatim Deed Formula
Clause 12 states verbatim:
> *"A minimum numbers of 2 or of one third of the total Trustees in the Board which ever is more shall constitute quorum for a valid meeting of the Board."*

### 6.2 Mathematical & Fiduciary Meaning
- The quorum condition is unambiguously:
  $$\text{Quorum} = \max\left(2, \left\lceil \frac{N}{3} \right\rceil\right)$$
  where $N$ is the total active trustees in the Board ($3 \le N \le 9$).
- If $N = 3$, $\max(2, 1) = 2$ trustees.
- If $N = 6$, $\max(2, 2) = 2$ trustees.
- If $N = 7$, $\max(2, 3) = 3$ trustees.
- If $N = 9$, $\max(2, 3) = 3$ trustees.
- In all constitutional states ($3 \le N \le 9$), a minimum of 2 trustees is required to convene a valid meeting, ensuring that no unilateral trustee action can bind the institution.

---

## 7. Annual Audit Evidence & Reporting Periods

### 7.1 Deed Provision vs. Professional Terminology
- **Deed Mandate (Clause 16):** Mandates that at the end of every financial year, income & expenditure accounts and balance sheets be prepared and audited by a Chartered Accountant, Cost Accountant, or public auditor.
- **Reporting Status:**
  - Scanned proposal archive contains financial statement summaries for FY 2021–22, FY 2022–23, and FY 2023–24.
  - Public claims avoid asserting "independent global statutory audit firm" without specific engagement letters; accurately cites "certified Chartered Accountant under Clause 16".

---

## 8. Public Inspection Protocol Evidence

### 8.1 Inspection Venue & Realistic Access Terms
- **Inspection Venue:** Mahaveer Educational & Charitable Trust (MECT), Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001.
- **Access Protocol:**
  - Removed rigid unverified office inspection windows ("10:00 to 17:00 IST").
  - Replaced with: **"Physical inspection available by prior written appointment via contact@mect.org.in."**
- **Document Boundaries:**
  - **Available for Institutional Review:** Certified copies of registered Trust Deed, official CBDT Form 10AC orders, MCA CSR-1 approval, and audited balance sheet summaries.
  - **Strictly Confidential:** Individual student scholarship applications, personal identifying cards, and donor transaction/banking details are protected under institutional privacy standards and applicable data protection legislation.

---

## 9. Tax-Law Transition Corrections

### 9.1 Section 354 vs. Section 536(2)(j) of Income-tax Act, 2025
- **Section 354:** Specifically governs procedures for **applications and examination orders for eligible donations** (corresponding to Form 105 applications and Form 107 orders).
- **Section 536(2)(j):** The specific **repeal-and-savings** provision of the Income-tax Act, 2025 governing the legal continuity of qualifying previous approvals, orders, and recognitions granted under the repealed Income-tax Act, 1961.
- **Corrections Implemented in `src/app/statutory-disclosures/page.tsx` & `src/lib/ai/mect-knowledge.ts`:**
  - Updated Section 80G disclosure: *"Under the Income-tax Act, 2025, applications and examination orders for eligible donations are governed by Section 354 (Form 105 and Form 107), while the continuity of historical qualifying approvals is governed by Section 536(2)(j) repeal-and-savings provisions. Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed."*
  - Updated tax mechanic card: *"For Tax Year 2026-27 onward, regular donation approval is governed by Section 354 (Form 105/107) while continuity of historical qualifying approvals is governed by Section 536(2)(j) of the Income-tax Act, 2025, and should not be assumed until confirmed by an applicable Form 107 order or CA certification."*

---

## 10. Final Published Statutory-Strip Copy

### 10.1 Provenance-Accurate Headline & Subtext on `/governance`
```html
<section id="statutory-strip" aria-label="Statutory Registrations & Institutional Identifiers">
  <!-- Heading -->
  <h2>Governed under Indian Trusts Act, 1882 • Section 12A/80G & MCA CSR-1 Registered</h2>
  <!-- Body text -->
  <p>
    Registered Office: Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001 • Trust PAN: AADTM5474F • Section 12A URN: AADTM5474FE20231 (Order dated 29-01-2024) • Documents on file.
  </p>
</section>
```
- **Removed:** Stale claim `"Verified against Government registries as of November 2024"`.
- **Added:** Fact-based `"Documents on file"` and explicit order date `"Order dated 29-01-2024"`.

---

## 11. Automated Quality Verification Results

### 11.1 TypeScript Typecheck
- **Command:** `npm run typecheck`
- **Result:** **Exit Code 0** (0 type errors).

### 11.2 ESLint Static Analysis
- **Command:** `npx eslint src/app/governance/page.tsx src/app/statutory-disclosures/page.tsx`
- **Result:** **Exit Code 0** (0 errors, 0 warnings).

### 11.3 Next.js Production Build
- **Command:** `npm run build`
- **Result:** **Exit Code 0**. All 41 routes statically prerendered without errors.

### 11.4 Playwright Comprehensive Automated QA Suite
- **Script:** `scripts/governance-qa-phase21-5-7.mjs`
- **Execution Timestamp:** 2026-11-16T18:29:04.434Z
- **Results Output:** `reports/governance-phase21-5-7-results.json`
- **Detailed Assertions:**
  - `httpStatus`: **200**
  - `managingTrusteeName`: **"Er. Japabandhu Kampa"**
  - `isCorrectlyRenamed`: **true** (`Statutory Registrations & Institutional Identifiers`)
  - `hasPan`: **true** (`AADTM5474F`)
  - `has12AUrn`: **true** (`AADTM5474FE20231`)
  - `hasNoStaleDate`: **true** (no stale "November 2024 registry check" assertion)
  - `hasDocumentsOnFile`: **true**
  - `hasNoHallucinatedPan`: **true** (zero `AAATM1840` references)
  - `isStatementNamed`: **true** (`Institutional Stewardship Statement`)
  - `allClausesPresent`: **true** (8/8 exact clauses verified)
  - `hasBoundedScope`: **true** (explicitly disclaims zero third-party overhead)
  - `inspectionQualified`: **true** (requires prior written appointment; safeguards privacy)
  - `allChecksPassed`: **true**
  - `prefers-reduced-motion`: **PASS**
  - `consoleErrors`: **0**

### 11.5 Viewport Overflow Verification Matrix (0px Horizontal Overflow Verified)

| Viewport Name | Target Dimensions | Horizontal Overflow | Result | Screenshot File |
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
| **Mobile Landscape** | $844 \times 390$ | **0 px** | **PASS** | `reports/screenshots/phase21_5_7/governance_landscape_844px.png` |

### 11.6 Homepage 5-Section Architecture Retention
- **Audit Against:** `http://localhost:3000/`
- **Result:** **PASS** (Exact 5 primary content sections preserved in correct order):
  1. `#hero` (`CinematicHero`)
  2. `#institutional-intro` (`InstitutionalIntroSection`)
  3. `#development-pillars` (`DevelopmentPillarsSection`)
  4. `#stories` (`StoriesRailSection` — Field Dispatches)
  5. `#institutional-impact` (`InstitutionalImpactSection`)

---

## 12. Final Git Status & Work Preservation Confirmation

- **Active Branch:** `feat/phase-21-1-design-system`
- **Critical Uncommitted Preserved Files:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java`
  - `backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java`
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java`
  - `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql`
  - All phase reports (Phases 21.1 through 21.5.7.1)
- **Mandate Compliance:**
  - Zero destructive git commands run.
  - Zero commits, pushes, merges, or deployments executed.
  - Phase 21.5.8 has NOT been started.
  - Complete stop enforced at Phase 21.5.7.2.
