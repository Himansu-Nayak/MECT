# MECT PHASE 21.5.5.2.1 — FINAL TAX TERMINOLOGY & SOURCE REGISTER CLOSURE REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5.5 — How MECT Works: Institutional Operating Model  
**Current Subphase:** 21.5.5.2.1 — Final Tax Terminology & Source Register Correction  
**Date of Completion:** November 16, 2026  
**Status:** **ACCEPTED & CLOSED**

---

## 1. Executive Summary & Verification Scope

Phase 21.5.5.2.1 provides the final targeted correction and statutory delineation for tax terminology, donation accounting classifications, and source provenance registers.

### Primary Clarification & Core Audit Principle:
**No statutory provision may be presented as establishing an accounting term or institutional practice that it does not actually establish.**

Specifically:
1. **Section 11 Income-tax Act Delineation:** Section 11 of the Income-tax Act, 1961 (and its transition under the Income-tax Act, 2025) grants exemption from income tax for income derived from property held under trust wholly for charitable or religious purposes to the extent applied to such purposes. It does **not** create, define, or mandate an accounting fund term titled "general charitable fund".
2. **Internal Accounting Classification:** In MECT's verified operational records and database architecture (`donation_programmes` table with code `GENERAL_FUND`), `"General Charitable Fund"` / `GENERAL_FUND` is strictly MECT's internal accounting classification for unrestricted contributions, alongside designated programme categories (`EDUCATION_LEARNING`, `WOMEN_EMPOWERMENT`, `SAFE_WATER_SANITATION`, `FOOD_SECURITY_RELIEF`, `COMMUNITY_WELFARE`). It has been explicitly recategorized as an **internal accounting practice**, eliminating any false assertion of statutory origin.
3. **Historical vs. Current Direct Tax Statutory References:** The Income-tax Act, 2025 took effect on 1 April 2026. MECT's Form 10AC Section 12A order (`AADTM5474FE20231`) and Section 80G order (`AADTM5474FF20241`) were issued on 29-01-2024 under the Income-tax Act, 1961, covering Assessment Years AY 2024-25 to AY 2026-27. Public copy now qualifies these as historical orders on file, noting that savings, renewal, and transition (e.g. Section 354 of the 2025 Act) remain under review with the Trust's Chartered Accountant.
4. **Form 10B Legal Definition:** Strictly identified as an income-tax audit report under former Section 12A(1)(b) of the Income-tax Act, 1961 for historical assessment periods, completely distinct from physical audited annual balance sheets and ledgers retained at the registered office.

---

## 2. Exact Wording Corrections

### A. `src/components/sections/HowMectWorksSection.tsx` (Stage 03)

| Component Property | Previous Text (Phase 21.5.5.2) | Corrected Text (Phase 21.5.5.2.1) | Rationale |
|--------------------|--------------------------------|-----------------------------------|-----------|
| `title` | `Institutional Banking & General Charitable Fund` | `Institutional Banking & General Fund Administration` | Clarifies administrative scope rather than suggesting a statutory legal body. |
| `description` | *"Charitable support is received through institutional banking channels (State Bank of India electronic transfer and verified UPI) and voluntary public contributions. In accordance with Indian trust regulations, general donations enter the general charitable fund to support approved educational, healthcare, and relief activities..."* | *"Charitable support is received through institutional banking channels (State Bank of India electronic transfer and verified UPI) and voluntary public contributions. Under MECT's internal accounting practice, unrestricted donations are administered under its General Fund classification to support trustee-approved charitable activities, while designated gifts support donor-selected programmes. MECT holds CSR-1 registration number CSR00081063; any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation."* | Removes false implication that Indian trust regulations dictate a "general charitable fund"; accurately presents General Fund as MECT's internal accounting category for unrestricted gifts alongside designated programmes. |
| `operationalScope` | *"Direct institutional banking via State Bank of India; donations enter the general charitable fund. Standard bank/gateway processing fees may apply."* | *"Direct institutional banking via State Bank of India; unrestricted donations administered under MECT's internal General Fund classification. Standard bank/gateway processing fees may apply."* | Replaces blanket fund absorption claim with accurate internal classification wording. |
| `primarySource` | `State Bank of India Trust Account • Sections 12A, 80G & CSR-1 Registration` | `State Bank of India Trust Account • Historical 12A/80G Orders & CSR-1 Registration` | Avoids presenting historical 12A/80G sections as unanchored current statutes; cites actual historical orders. |

### B. `src/components/sections/HowMectWorksSection.tsx` (Stage 05)

| Component Property | Previous Text (Phase 21.5.5.2) | Corrected Text (Phase 21.5.5.2.1) | Rationale |
|--------------------|--------------------------------|-----------------------------------|-----------|
| `description` | *"...Statutory compliance filings—including income-tax audit reports (Form 10B), annual tax returns, and 12A/80G orders—are published in our online statutory disclosures vault. Audited annual financial statements are preserved at the registered office for formal institutional review."* | *"...Statutory compliance filings—including historical income-tax audit reports (Form 10B for relevant assessment periods), annual tax returns, and Form 10AC registration orders—are referenced in our online statutory disclosures vault. Audited annual financial statements and ledgers are preserved at the registered office for formal institutional review."* | Specifies Form 10B as historical income-tax audit reports for relevant assessment periods and references Form 10AC orders verbatim. |
| `primarySource` | `Statutory Disclosures Vault • Form 10B Audit Records` | `Statutory Disclosures Vault • Historical Form 10B Audit Records` | Explicitly identifies historical nature of Form 10B audit records. |

### C. `src/components/sections/HowMectWorksSection.tsx` (Audience Pathway 02)

| Component Property | Previous Text | Corrected Text | Rationale |
|--------------------|---------------|----------------|-----------|
| `summary` | *"Review direct electronic SBI donations, Section 80G tax benefits, and audited fiduciary stewardship."* | *"Review direct electronic SBI donations, statutory tax deduction guidelines, and audited fiduciary stewardship."* | Accords with `content/compliance.ts` where current FY 2026-27 position under Income-tax Act, 2025 is subject to CA confirmation. |

### D. `src/app/statutory-disclosures/page.tsx`

| Line Reference | Previous Text | Corrected Text | Rationale |
|----------------|---------------|----------------|-----------|
| Line 81 (Section 12A Order) | *"Formal order issued under Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 (DIN: AADTM5474FE2023101). Exempts trust surplus, donations, and educational endowment returns from Indian Income Tax."* | *"Formal order issued under Section 12A(1)(ac)(vi) of the Income-tax Act, 1961 (DIN: AADTM5474FE2023101, valid AY 2024-25 to AY 2026-27). Exempts trust surplus, donations, and educational endowment returns under legacy provisions; savings and transition under the Income-tax Act, 2025 remain subject to CA confirmation."* | Clarifies historical statutory coverage under the 1961 Act and notes 2025 Act transition provisions. |
| Line 459 (Inspection Notice) | *"...certified copies of our Trust Deed, income-tax audit reports (Form 10B), and regulatory returns are open for institutional inspection..."* | *"...certified copies of our Trust Deed, income-tax audit reports (Form 10B for relevant assessment periods), and regulatory returns are open for institutional inspection at our Balangir Registered Office and Bhubaneswar Liaison Secretariat during working hours."* | Form 10B anchored to relevant historical assessment periods. |

---

## 3. Accounting Classification Evidence (Internal Records vs. Statutory Fact)

### Database & Schema Verification:
In `backend/src/main/resources/db/migration/V10__unified_donation_flow.sql` and `V11__donation_enhancements.sql`:
```sql
INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'GENERAL_FUND', 'General Charitable Fund', 'Unrestricted trust corpus allocation', 
       'Supports verified charitable initiatives across education, poverty relief, and healthcare based on trustee allocation.', 
       true, true, 0
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'GENERAL_FUND');
```

In `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java` & `src/app/admin/settings/page.tsx`:
```tsx
// Field toggle:
generalFundEnabled: boolean; // "General Fund Authorised"
```

### Institutional Treatment:
- **Unrestricted Contributions:** When a donor contributes without designating a specific project, the gift is credited under the internal accounting code `GENERAL_FUND` and applied by the trustees towards charitable purposes (educational advancement, relief of poverty, medical relief) as defined in Trust Deed Section 4.
- **Designated Contributions:** When a donor selects an active charitable programme (e.g. Remedial Education, Women's Vocational Skilling, or Jal Seva), the contribution is tagged with the specific programme code (`programme_id`) for that purpose.
- **Legal Characterization:** "General Charitable Fund" is **not** a statutory accounting classification created by Section 11 of the Income-tax Act, 1961. It is MECT's **internal operational accounting category** for tracking unrestricted public gifts.

---

## 4. Historical vs. Current Statutory References

### Direct Tax Transition Context:
The **Income-tax Act, 2025** came into force on **1 April 2026**, superseding the Income-tax Act, 1961.

| Statutory Topic | Legacy Reference (Income-tax Act, 1961) | Current Statutory Framework (Income-tax Act, 2025) | MECT Documentary Reality |
|-----------------|----------------------------------------|---------------------------------------------------|--------------------------|
| **12A Exemption** | Section 12A(1)(ac)(vi), Section 12AB | Section 348 / transition sections | Form 10AC Order dated 29-01-2024 issued under Section 12A(1)(ac)(vi) of the 1961 Act. URN: `AADTM5474FE20231`. Validity: AY 2024-25 to AY 2026-27. Transition governed by Section 536 savings. |
| **80G Donor Deductions** | Section 80G(5)(vi) (Form 10AC) | Section 354 (Form 105 & Form 107) | Form 10AC Order dated 29-01-2024 issued under legacy Section 80G(5)(vi). URN: `AADTM5474FF20241`. Covered donations FY 2023-24 to FY 2025-26. Current approval for FY 2026-27 is under CA review. |
| **Audit Report** | Section 12A(1)(b) / Rule 17B (Form 10B) | Modern audit filing schedules | Form 10B is the historical income-tax audit report filed under the 1961 Act for completed financial years; not an audited balance sheet. |

---

## 5. Comprehensive Documentary Source Register

The following register provides the verifiable documentary provenance for every institutional claim presented on the homepage:

### 1. Corporate Social Responsibility (CSR-1)
- **Filing Document:** MCA Form CSR-1 Approval Order
- **Filing Reference / SRN:** `N14617237`
- **Registration Number:** `CSR00081063`
- **Registration Date:** 9 November 2024 (`09-11-2024`)
- **Issuing Authority:** Ministry of Corporate Affairs (MCA), Office of the Registrar of Companies
- **Governing Law:** Section 135, Companies Act, 2013 read with Rule 4(2), Companies (CSR Policy) Rules, 2014
- **Public Claim Standard:** *"MECT holds CSR-1 registration number CSR00081063. Any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation."*
- **Verification Status:** **VERIFIED**

### 2. Community Engagement & Needs Identification
- **Field Record Name:** `Field Centre Operational & Attendance Logs • Balangir & Puintala Clusters`
- **Reporting Periods:** Operating cycles FY 2021-22, FY 2022-23, FY 2023-24, and current cycles
- **Locations:** Balangir Municipality (Rugudipara, Sailashree Palace vicinity, District Headquarters Hospital road) and Puintala Block, Balangir District, Odisha
- **Supported Activities:**
  - Secondary school remedial coaching classes (Grade 8–10 scholastic retention)
  - Women's vocational tailoring instruction and machine kit issuance
  - Seasonal summer hydration points (Jal Seva) and ORS distribution
- **Public Claim Standard:** *"Programme planning is informed by MECT's charitable objectives and available community-level information from Balangir district. Trust coordinators and local volunteers observe scholastic retention, seasonal drinking-water distress, and household livelihood needs to guide grassroots initiatives."*
- **Verification Status:** **VERIFIED (Field Log Practice; Qualified as Non-Census/Non-Survey)**

### 3. Resource Administration & Donation Flow
- **Accounting Record:** Database migration `donation_programmes` schema (`V10__unified_donation_flow.sql`), code `GENERAL_FUND`
- **General Donations:** Unrestricted public gifts administered under MECT's internal General Fund accounting category to support trustee-approved charitable activities under its charter.
- **Designated Donations:** Donor-selected contributions allocated directly to specific active programmes (education, tailoring livelihoods, Jal Seva).
- **Processing Fees:** Net receipt subject to standard payment gateway and banking deductions.
- **Verification Status:** **VERIFIED (Internal Accounting Classification)**

### 4. Regulatory Vault & Financial Disclosures
- **Form 10AC Section 12A Order:** URN `AADTM5474FE20231`, DIN `AADTM5474FE2023101`, dated 29-01-2024 (AY 2024-25 to AY 2026-27).
- **Form 10AC Section 80G Order:** URN `AADTM5474FF20241`, DIN `AADTM5474FF2024101`, dated 29-01-2024 (AY 2024-25 to AY 2026-27).
- **Income-Tax Audit Reports (Form 10B):** Filed historically under former Section 12A(1)(b) of the Income-tax Act, 1961 for completed assessment periods.
- **Physical Books & Balance Sheets:** Complete audited balance sheets, income & expenditure statements, and ledgers preserved at Balangir Registered Office (Near Sai Mandir, Rugudipara, Balangir - 767001).
- **Verification Status:** **VERIFIED (Orders and Vault Delineation)**

### 5. Trust Deed Governance & Honorary Service
- **Deed Reference:** Trust Deed No. `40311302194`, executed 27 July 2013, registered 30 July 2013, Sub-Registrar Balangir, Book 4, Vol 45.
- **Section 4:** Founding charitable objects (educational advancement, relief of poverty, medical relief, community welfare).
- **Clause XVI:** Trustees shall serve strictly in an honorary capacity without salary, allowance, sitting fees, or personal remuneration from trust funds.
- **Verification Status:** **VERIFIED**

---

## 6. Technical Quality Gates & Visual QA Verification

All technical quality gates passed without warnings or regressions:

1. **TypeScript Typecheck:**
   - Command: `npm run typecheck` (`tsc --noEmit`)
   - Result: **0 errors** (Exit code 0).

2. **ESLint:**
   - Command: `npx eslint src/components/sections/HowMectWorksSection.tsx src/app/statutory-disclosures/page.tsx`
   - Result: **0 errors, 0 warnings** (Exit code 0).

3. **Next.js Production Build:**
   - Command: `npm run build`
   - Result: **Compiled successfully in 59s; 40/40 routes prerendered cleanly** (Exit code 0).

4. **Playwright Responsive & Integrity QA Suite (`scripts/how-it-works-qa-phase21-5-5.mjs`):**
   - Executed against production server on port 3300 across 10 viewports:
     - 320px (Mobile S): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 360px (Mobile M): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 390px (iPhone 14): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 430px (Mobile XL): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 768px (iPad Mini): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 1024px (iPad Pro): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 1280px (Laptop): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 1440px (Desktop HD): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 1920px (UltraWide): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
     - 844x390 (Landscape): `overflowPx: 0`, `integrityVerified: true`, `stagesVerified: true`
   - **Horizontal Overflow:** **0px across all 10 viewports**.
   - **Browser Console Errors:** **0 errors**.
   - **Reduced Motion Test:** `h2Opacity: 1`, `imgOpacity: 1`.

5. **CTA Routing & Count Verification:**
   - **Total CTA Elements in Component:** **13**
   - **Unique Destinations:** **9** (8 primary + 1 secondary inquiry):
     - `/about` (HTTP 200)
     - `/governance` (HTTP 200)
     - `/donate` (HTTP 200)
     - `/programmes` (HTTP 200)
     - `/statutory-disclosures` (HTTP 200)
     - `/scholarships` (HTTP 200)
     - `/volunteer` (HTTP 200)
     - `/csr-partnerships` (HTTP 200)
     - `/contact` (HTTP 200)

---

## 7. Git Safety & Integrity Status

- **Active Branch:** `feat/phase-21-1-design-system`
- **Prohibited Git Commands Executed:** None. No destructive commands (`git reset`, `git clean`, `git checkout .`, `git restore`), no stashing, no blanket staging (`git add .`), and no unauthorized commits, pushes, merges, or deployments.
- **Preserved Backend & Integration Assets:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java` (Preserved)
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java` (Preserved)
  - `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql` (Preserved)
  - All migration files, scripts, and previous phase reports remain completely intact.

---

## 8. Final Sign-Off & Mandatory Stop

All objectives of Phase 21.5.5.2.1 have been achieved:
- Assertion that "general charitable fund" is a statutory accounting term under Section 11 of the Income-tax Act has been completely eliminated.
- "General Fund" is accurately characterized as MECT's internal accounting category for unrestricted contributions alongside designated programmes.
- Historical direct tax references (Income-tax Act, 1961 vs. Income-tax Act, 2025) have been qualified with their exact Form 10AC orders and CA transition review status.
- Form 10B is correctly defined as a historical income-tax audit report for relevant assessment periods, distinct from registered office balance sheets.
- Source provenance register has been populated with verbatim documentary references.
- All technical gates and responsive visual checks passed with zero errors and zero overflow.

**PHASE 21.5.5.2.1 — FINAL TAX TERMINOLOGY & SOURCE REGISTER CLOSURE ACCEPTED**

*(Execution halted per mandatory stop instruction. Phase 21.5.6 has not been started.)*
