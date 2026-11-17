# MECT PHASE 21.5.5.1 — OPERATING MODEL, GOVERNANCE & PUBLIC CLAIMS INTEGRITY CLOSURE REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5.5 — How MECT Works  
**Current Phase:** 21.5.5.1 — Institutional Operating Model Integrity Closure  
**Date:** November 16, 2026  
**Status:** **ACCEPTED & COMPLETE**

---

## 1. Executive Summary & Files Inspected/Changed

Phase 21.5.5.1 conducted a targeted forensic verification and integrity remediation across the public-facing statements of the newly implemented **How MECT Works** section (`src/components/sections/HowMectWorksSection.tsx`), the **Institutional Impact** section (`src/components/sections/InstitutionalImpactSection.tsx`), and supporting institutional content.

The visual layout and motion architecture were preserved intact. Every public claim was scrutinized to eliminate unsupported operational assertions, legally misclassified regulatory documents, exaggerated environmental figures, embedded banking account credentials, and inaccurate disclosure claims.

### Files Inspected:
- `src/components/sections/HowMectWorksSection.tsx`
- `src/components/sections/InstitutionalImpactSection.tsx`
- `content/org.ts`
- `content/trustees.ts`
- `content/compliance.ts`
- `content/funding.ts`
- `src/lib/homepage-content.ts`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/governance/page.tsx`
- `src/app/donate/page.tsx`
- `src/app/programmes/page.tsx`
- `src/app/statutory-disclosures/page.tsx`
- `src/app/scholarships/page.tsx`
- `src/app/volunteer/page.tsx`
- `src/app/csr-partnerships/page.tsx`
- `src/app/contact/page.tsx`

### Files Modified:
- `src/components/sections/HowMectWorksSection.tsx` (Remediated community engagement, charter alignment, banking descriptions, removed 45°C, corrected Form 10B definition, removed bank account numbers, qualified CSR-1 terminology).
- `scripts/how-it-works-qa-phase21-5-5.mjs` (Added automated integrity checks: zero embedded account numbers, zero unverified temperatures, zero Form 10B balance sheet confusion).
- `reports/how-it-works-phase21-5-5-results.json` (Updated Playwright test output reflecting 100% passing integrity assertions).

### Files Created:
- `MECT_PHASE_21_5_5_1_OPERATING_MODEL_INTEGRITY_CLOSURE_REPORT.md`

---

## 2. Evidence Matrix for All Five Operating Stages

| Stage & Question | Remediated Title | Evidence Classification | Scope & Repository Grounding |
|---|---|---|---|
| **01 — Understand the Need**<br>*How does MECT identify and understand community needs?* | **Community Dialogue & Local Outreach** | `ACTIVE_PROGRAMME`<br>(Field Consultation Practice) | Local field dialogue conducted through centre coordinators and volunteers with village families and school educators in Balangir district. Qualified as an informal engagement approach; not an automated survey system. Anchor: `/about` |
| **02 — Plan with Purpose**<br>*How are educational and community programmes planned?* | **Charitable Charter Alignment** | `GOVERNANCE_REQUIREMENT`<br>(Statutory Trust Rule) | Legally governed by the founding objects in Trust Deed No. 40311302194 Section 4. Honorary non-remuneration under Clause XVI. Proposed targets (up to 200 scholarship seats) remain subject to formal sanction and funding. Anchor: `/governance` |
| **03 — Organize Resources**<br>*How are resources and institutional support organized?* | **Institutional Banking & Central Reserves** | `DOCUMENTED_PRACTICE`<br>(Documented Banking Channel) | Support received via institutional banking (SBI and verified UPI) entering the central charitable fund. Zero embedded account numbers. Explains standard bank/gateway fees may apply; clarifies CSR-1 registration. Anchor: `/donate` |
| **04 — Deliver Through Programmes**<br>*How are programmes and activities delivered?* | **Direct Grassroots Delivery** | `ACTIVE_PROGRAMME`<br>(Active Field Operations) | Active remedial coaching centres in Balangir and Puintala, vocational tailoring cohorts for women, and seasonal Jal Seva drinking-water and ORS kiosks during severe summer heatwaves in Western Odisha (unverified 45°C removed). Anchor: `/programmes` |
| **05 — Record and Communicate**<br>*How are records, outcomes and institutional responsibilities communicated?* | **Transparent Reporting & Public Accountability** | `DOCUMENTED_PRACTICE`<br>(Audited Public Compliance) | Internal operational registers (attendance, toolkits) maintained at centres; online statutory vault publishes tax audit reports (Form 10B), IT returns, and 12A/80G orders; audited annual financial statements preserved at registered office. Anchor: `/statutory-disclosures` |

---

## 3. Community Engagement Evidence Assessment

- **Previous Phrasing:** Described formal interactions with "village educators, school teachers, and self-help groups" and labeled them as a formal `DOCUMENTED_PRACTICE` with an implied systematic survey regime.
- **Forensic Audit:** The repository contains no formal meeting minutes, scheduled attendance rolls for educator meetings, or standardized survey instruments. The actual practice is informal, localized community dialogue conducted by field volunteers and centre personnel in Balangir district.
- **Corrective Remediation:**
  - Qualified title to `Community Dialogue & Local Outreach`.
  - Re-classified as `ACTIVE_PROGRAMME` with the descriptive label `Field Consultation Practice`.
  - Exact text: *"Informed by local community dialogue in Balangir district. Trust volunteers and centre coordinators engage with local families, village elders, and government school educators to understand primary educational needs, seasonal drinking-water distress, and household livelihood barriers."*
  - Explicit operational scope: *"Informal local community consultations in Balangir district; not a standardized survey or statistical assessment system."*

---

## 4. Board Oversight & Programme Planning Assessment

- **Previous Phrasing:** Claimed that the "Honorary Board reviews annual programme scopes" on a recurring schedule.
- **Forensic Audit:** While Trust Deed Section 4 establishes charitable advancement objects and Clause XVI establishes trustee non-remuneration, no Board meeting minutes, formal annual resolutions, or recurring planning calendars exist in the repository to document recurring annual operational reviews.
- **Corrective Remediation:**
  - Removed the unverified operational claim of recurring annual board reviews.
  - Replaced with a factual statutory governance statement:
    *"All Trust initiatives are legally governed by the founding charitable objectives defined in Trust Deed Section 4 (educational advancement, relief of poverty, medical relief). Under Clause XVI, all trustees serve in an honorary capacity without salary or fees. Proposed initiatives (such as the target of up to 200 scholarship students) remain subject to formal trustee sanction and confirmed funding."*

---

## 5. Donation, Banking & Resource Mobilization Verification

- **Bank Account Number Removal:** Removed the specific bank account number (`A/C 33341302498`) from `HowMectWorksSection.tsx`. Per Section 5 of the directive, public educational sections must direct visitors to the secure donation route (`/donate`) rather than embedding raw account numbers.
- **Fee Claims & Commercial Deductions:**
  - Removed the absolute phrase "zero commercial broker deductions" and removed any implication that payment transactions are entirely fee-free.
  - Acknowledged that standard banking and payment gateway processing fees may apply.
- **Fund Allocation:**
  - Verified that general donations enter the Trust's central charitable reserve in accordance with Indian trust law.
  - Avoided claiming that donations are automatically ear-marked to specific programmes or independently audited on a per-donation basis.
- **Primary Source Citation:** Updated from account numbers to `"State Bank of India Trust Account • Sections 12A, 80G & CSR-1 Filings"`.

---

## 6. CSR and Statutory Registration Terminology

- **Section 12A / 12AB:** Income-tax exemption for charitable trusts (URN: `AADTM5474FE20231`, Order dated 29-01-2024 for AY 2024-25 to AY 2026-27). Distinct from donor deduction certificates.
- **Section 80G:** Income-tax certificate enabling donor tax deductions (URN: `AADTM5474FF20241`, Order dated 29-01-2024 for AY 2024-25 to AY 2026-27), subject to applicable limits and statutory conditions under the Income-tax Act, 1961.
- **CSR-1 Registration:** Ministry of Corporate Affairs filing (Registration No. `CSR00081063`, Approved 09-11-2024, SRN: `N14617237`).
- **Correction Applied:** Removed the phrase "approved CSR channel" (which implied a blanket government endorsement). Replaced with precise legal language: *"Corporate social responsibility partnerships operate under our registered CSR-1 filing (CSR00081063)."*

---

## 7. Programme Delivery Status & 45°C Reference

- **45°C Temperature Figure Removed:** Removed the unsupported, precise temperature claim ("extreme 45°C summer heatwaves"). Replaced with factually accurate language: *"during severe summer heatwaves in Western Odisha."*
- **Operational Status Delineation:**
  - **Active Operations:** Secondary remedial instruction in Balangir and Puintala; women's vocational tailoring instruction; seasonal Jal Seva drinking-water and ORS kiosks.
  - **Planned Programme:** Free education for up to 200 students is distinctly classified as a proposed planning target subject to formal sanction and verified funding.

---

## 8. Financial Reporting Terminology & Publication Assessment

- **Form 10B Forensic Correction:**
  - **Critical Finding:** Form 10B is the statutory **Audit Report under Section 12A(1)(b) of the Income-tax Act, 1961**, executed by an independent Chartered Accountant. It is **NOT** a balance sheet.
  - Previous text incorrectly referred to "Form 10B audited balance sheets".
  - **Correction Applied:** Separated into precise legal terms:
    *"Statutory compliance filings—including income-tax audit reports (Form 10B), annual tax returns, and 12A/80G orders—are published in our online statutory disclosures vault. Audited annual financial statements are preserved at the registered office for formal institutional review."*
- **Public vs Institutional Records:**
  - *Publicly Accessible Online:* Statutory regulatory orders (12A, 80G, CSR-1, NGO Darpan) and public audit summaries via `/statutory-disclosures`.
  - *Institutional Review upon Formal Request:* Audited balance sheets, income and expenditure accounts, and signed annual returns preserved at the Balangir registered office.
  - *Confidential Administrative Records:* Internal student attendance logs, sewing toolkit registers, and bank account ledgers.

---

## 9. Fiduciary Governance Statement Verification

- **Trust Deed Clause XVI Verification:**
  - *Clause XVI verbatim principle:* All trustees serve in an honorary capacity without salary, fee, sitting fees, or personal remuneration from trust funds.
  - Verified that this rule applies exclusively to trustees, not third-party contractors, suppliers, or employees.
  - Prohibited claiming "zero commissions" or "zero operating costs".
- **Consistent Wording in Both Sections:**
  - **In `HowMectWorksSection.tsx`:**
    > *"In strict accordance with Trust Deed Clause XVI, all trustees serve in an honorary capacity without salary, sitting fees, or personal remuneration from trust funds. Statutory filings, audited financial statements, and regulatory compliance records are maintained at the Balangir registered office and made available for institutional review in accordance with public trust standards."*
  - **In `InstitutionalImpactSection.tsx`:**
    > *"In strict accordance with Trust Deed Clause XVI, all trustees serve in an honorary capacity without salary, sitting fees, or personal remuneration from trust funds. Statutory filings, audited financial statements, and regulatory compliance records are maintained at the Balangir registered office and made available for institutional review in accordance with public trust standards."*

---

## 10. Complete Audience Pathway & CTA Route Matrix

### Clarification on Route Counting:
- **Total Visible CTA Elements in Component:** **13 instances**
- **Unique Destination Routes:** **8 unique routes** (plus `/contact` as secondary inquiry)

| # | Visible CTA Label | Context / Audience | Destination URL | Route Exists? | HTTP Status | Functionality Verified |
|---|---|---|---|---|---|---|
| 1 | `Verify` | Stage 01 (Community Outreach) | `/about` | Yes | `200 OK` | Institutional mission & foundation |
| 2 | `Verify` | Stage 02 (Charter Alignment) | `/governance` | Yes | `200 OK` | Trust Deed governance & trustee rules |
| 3 | `Verify` | Stage 03 (Banking & Support) | `/donate` | Yes | `200 OK` | SBI banking channels & 80G instructions |
| 4 | `Verify` | Stage 04 (Field Delivery) | `/programmes` | Yes | `200 OK` | 5 active development pillars overview |
| 5 | `Verify` | Stage 05 (Public Compliance) | `/statutory-disclosures` | Yes | `200 OK` | 12A, 80G, CSR-1 orders & vault |
| 6 | `Inspect Statutory Disclosures` | Fiduciary Assurance Panel | `/statutory-disclosures` | Yes | `200 OK` | Statutory certificates & legal disclosures |
| 7 | `Explore Programmes` | Pathway 1 (Students & Families) | `/programmes` | Yes | `200 OK` | Remedial education & centres |
| 8 | `Scholarship Guidance` | Pathway 1 (Students & Families) | `/scholarships` | Yes | `200 OK` | Scholarship eligibility & guidelines |
| 9 | `Make a Donation` | Pathway 2 (Donors & Supporters) | `/donate` | Yes | `200 OK` | Direct donation options & tax details |
| 10 | `Statutory Vault` | Pathway 2 (Donors & Supporters) | `/statutory-disclosures` | Yes | `200 OK` | Public statutory certificates |
| 11 | `Register as Volunteer` | Pathway 3 (Volunteers & Mentors) | `/volunteer` | Yes | `200 OK` | Volunteer registration form & details |
| 12 | `CSR Partnerships` | Pathway 4 (CSR & Partners) | `/csr-partnerships` | Yes | `200 OK` | CSR-1 details & collaboration intake |
| 13 | `Contact Secretariat` | Pathway 4 (CSR & Partners) | `/contact` | Yes | `200 OK` | Secretariat office address & inquiry form |

*All 8 unique destination routes responded with HTTP 200 OK on production server testing.*

---

## 11. Technical Quality Verification & Automated QA

### A. TypeScript Typecheck
- **Command:** `npm run typecheck`
- **Result:** `0 errors` (Clean compilation across all TypeScript files).

### B. ESLint Static Analysis
- **Command:** `npx eslint src/components/sections/HowMectWorksSection.tsx`
- **Result:** `0 errors, 0 warnings`.

### C. Production Webpack Build
- **Command:** `npm run build`
- **Result:** Successful production build (`40/40` static and dynamic routes compiled).

### D. Playwright Automated Multi-Viewport QA (`scripts/how-it-works-qa-phase21-5-5.mjs`)
- **Result File:** `reports/how-it-works-phase21-5-5-results.json`
- **Viewports Tested (10/10 Passed):**

| Viewport | Width | Overflow (px) | H2 Visible | 5 Stages Verified | Integrity Checks Passed | Fiduciary Panel | Errors |
|---|---|---|---|---|---|---|---|
| **320px** | 320px | 0 | Yes (29.6px) | Passed | **Passed** | Passed | 0 |
| **360px** | 360px | 0 | Yes (29.6px) | Passed | **Passed** | Passed | 0 |
| **390px** | 390px | 0 | Yes (29.6px) | Passed | **Passed** | Passed | 0 |
| **430px** | 430px | 0 | Yes (29.6px) | Passed | **Passed** | Passed | 0 |
| **768px** | 768px | 0 | Yes (33.8px) | Passed | **Passed** | Passed | 0 |
| **1024px** | 1024px | 0 | Yes (44.0px) | Passed | **Passed** | Passed | 0 |
| **1280px** | 1280px | 0 | Yes (44.0px) | Passed | **Passed** | Passed | 0 |
| **1440px** | 1440px | 0 | Yes (44.0px) | Passed | **Passed** | Passed | 0 |
| **1920px** | 1920px | 0 | Yes (44.0px) | Passed | **Passed** | Passed | 0 |
| **844px Landscape** | 844px | 0 | Yes (37.1px) | Passed | **Passed** | Passed | 0 |

- **Integrity Assertions Verified (`integrityVerified: true` across all viewports):**
  - Zero embedded bank account numbers (`!textContent.includes("33341302498")`).
  - Zero exaggerated temperature claims (`!textContent.includes("45°C")`).
  - Zero Form 10B balance sheet confusion (`!textContent.includes("Form 10B audited balance sheets")`).
- **Reduced Motion:** Verified (`opacity: 1`, zero layout shift).
- **Console Errors:** 0 errors across all viewports.

---

## 12. Final Git Status & Work Preservation Confirmation

- **Branch:** `feat/phase-21-1-design-system`
- **Preserved Uncommitted Work:**
  - `PaymentConfiguration.java`
  - `PaymentConfigurationService.java`
  - `HimPaymentAttempt.java`
  - `HimWebhookEvent.java`
  - `HimPaymentGatewayService.java`
  - `V12__him_payment_gateway_schema.sql`
- **Prohibited Git Commands Avoided:**
  - Zero destructive operations (`git reset`, `git clean`, `git checkout .`, `git restore .`).
  - Zero automated commits, pushes, merges, or deployments.

---

## 13. Final Closure Statement & Sign-off

Phase 21.5.5.1 has systematically closed all public claims, governance descriptions, banking disclosures, and financial terminology issues in the How MECT Works operating model. The section now communicates institutional credibility through factual accuracy, grounded evidence, and strict statutory precision.

```
================================================================================
PHASE 21.5.5.1 — OPERATING MODEL INTEGRITY CLOSURE ACCEPTED & COMPLETE
================================================================================
```
