# MECT PHASE 21.5.5.2 — FINAL SOURCE, CSR REGISTRATION & PUBLIC DISCLOSURE PROVENANCE CLOSURE REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5.5 — How MECT Works: Institutional Operating Model  
**Current Subphase:** 21.5.5.2 — Final Source, CSR Registration & Public Disclosure Provenance Closure  
**Date of Completion:** November 16, 2026  
**Status:** **ACCEPTED & CLOSED**

---

## 1. Executive Summary & Verification Scope

Phase 21.5.5.2 represents the final source-grounding, legal provenance, and statutory disclosure audit closure for MECT's institutional operating model section (`HowMectWorksSection.tsx`) and related public compliance pages (`src/app/statutory-disclosures/page.tsx`).

The visual and engineering implementation delivered in Phase 21.5.5 was preserved without alteration. Every public-facing claim regarding CSR registration, community engagement, fund flow accounting, tax audit filings, and honorary trustee governance was audited against verified statutory trust records (Trust Deed No. 40311302194, MCA CSR-1 registration, Section 12A/80G orders, and Section 12A(1)(b) Form 10B audit reports).

### Core Audit Outcomes:
1. **CSR-1 Registration Terminology:** Legally accurate designation (`CSR-1 Registered`, Registration No. `CSR00081063`) with cautious public language confirming eligibility and corporate assessment requirements. Zero claims of "government endorsement", "pre-approved CSR partner", or "blanket eligibility".
2. **Community Needs Provenance:** Stage 01 grounded in MECT's charitable objects and local field logs in Balangir district, avoiding claims of formal statistical survey methodologies or non-existent external stakeholder studies.
3. **Fund Flow Accounting:** Eliminated the non-statutory phrase "central charitable reserve" in favor of the correct legal designation `"general charitable fund"` under Section 11 of the Income-tax Act, 1961. Retained explicit notice of standard bank/payment processing fees.
4. **Form 10B Audit Report vs. Balance Sheet Delineation:** Corrected `src/app/statutory-disclosures/page.tsx:459` to identify Form 10B as an `"income-tax audit report (Form 10B)"` under Section 12A(1)(b), clearly distinct from physical audited annual balance sheets preserved at the registered office.
5. **Honorary Trustee Service (Trust Deed Clause XVI):** Fiduciary notice precisely circumscribed to trustees serving without salary, sitting fees, or personal remuneration from trust funds, with zero unauthorized extrapolation to third-party merchant fees or vendor costs.
6. **CTA Matrix & Destination Health:** Verified 13 total CTA elements directing to 8 primary destinations and 1 secondary inquiry route (9 unique destinations total), all returning HTTP 200 OK.
7. **Responsive & Quality Gates:** Zero horizontal overflow (`0px`) across all 10 canonical viewports (320px–1920px + landscape), 0 console errors, 100% typecheck pass (`tsc --noEmit`), ESLint clean, and Next.js production build (`npm run build`) passing 40/40 routes.

---

## 2. CSR-1 Terminology & Regulatory Compliance

### Statutory Background:
The Ministry of Corporate Affairs (MCA) under Section 135 of the Companies Act, 2013 and Rule 4(2) of the Companies (CSR Policy) Rules, 2014 requires registered trusts to file Form CSR-1 to obtain a system-generated registration number. Form CSR-1 is an electronic filing registration, not a government certification, award, grant, or endorsement.

### Implemented Copy Standards:
- **Designation:** `CSR-1 Registered` (Registration No. `CSR00081063`).
- **Standard Disclosure Text (Stage 03 & Pathway 04):**
  > *"MECT holds CSR-1 registration number CSR00081063. Any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation."*
- **Prohibited & Removed Terms:**
  - ❌ "Approved CSR channel"
  - ❌ "Government-certified CSR partner"
  - ❌ "Government grant entitlement"
  - ❌ "Blanket CSR eligibility"

---

## 3. Community Needs Identification Provenance

### Statutory & Field Reality:
MECT's field operations in Balangir district are conducted by local trust volunteers and centre coordinators observing community needs directly. There is no formalized multi-year statistical survey system or formal meeting minute series for third-party educator panels.

### Implemented Copy Standards:
- **Title:** `Community-Informed Programme Planning`
- **Classification:** `Field Consultation Practice` (`ACTIVE_PROGRAMME`)
- **Description:**
  > *"Programme planning is informed by MECT's charitable objectives and available community-level information from Balangir district. Trust coordinators and local volunteers observe scholastic retention, seasonal drinking-water distress, and household livelihood needs to guide grassroots initiatives."*
- **Operational Scope:**
  > *"Informal local community consultations in Balangir district; not a standardized survey or statistical assessment system."*
- **Primary Source Citation:**
  > `Trust Objectives & Local Field Logs • Balangir District`

---

## 4. Donation Accounting & General Charitable Fund

### Statutory Fund Allocation:
Under Indian trust accounting and Section 11 of the Income-tax Act, 1961, unconditional donations received by a public charitable trust flow into the trust's general charitable fund for application towards charitable objects.

### Implemented Copy Standards:
- **Title:** `Institutional Banking & General Charitable Fund`
- **Classification:** `Documented Banking Channel` (`DOCUMENTED_PRACTICE`)
- **Description:**
  > *"Charitable support is received through institutional banking channels (State Bank of India electronic transfer and verified UPI) and voluntary public contributions. In accordance with Indian trust regulations, general donations enter the general charitable fund to support approved educational, healthcare, and relief activities. MECT holds CSR-1 registration number CSR00081063; any CSR project engagement remains subject to applicable eligibility requirements, contributing company assessment and approval, and relevant project documentation."*
- **Operational Scope:**
  > *"Direct institutional banking via State Bank of India; donations enter the general charitable fund. Standard bank/gateway processing fees may apply."*
- **Primary Source Citation:**
  > `State Bank of India Trust Account • Sections 12A, 80G & CSR-1 Registration`

---

## 5. Statutory Records & Inspection Delineation

### Legal Distinction:
- **Form 10B:** The mandatory audit report prescribed under Section 12A(1)(b) of the Income-tax Act, 1961, certifying that the trust's accounts have been audited and that income has been applied to charitable purposes in accordance with Section 11. It is an income-tax audit report, not a general corporate balance sheet.
- **Physical Books & Registers:** Complete audited financial statements (balance sheet, income & expenditure account), trustee minutes, and cash books are preserved at the registered office under trust law.

### Corrected File: `src/app/statutory-disclosures/page.tsx:459`
- **Previous Text:**
  > *"...certified copies of our Trust Deed, audited annual financial statements (Form 10B), and regulatory returns are open for public inspection..."*
- **Corrected Text:**
  > *"...certified copies of our Trust Deed, income-tax audit reports (Form 10B), and regulatory returns are open for institutional inspection at our Balangir Registered Office and Bhubaneswar Liaison Secretariat during working hours."*

### Standard Section Copy in `HowMectWorksSection.tsx` (Stage 05):
> *"Internal operational records (attendance rosters, toolkit issue logs, seasonal kiosk summaries) are maintained at field centres for administrative management. Statutory compliance filings—including income-tax audit reports (Form 10B), annual tax returns, and 12A/80G orders—are published in our online statutory disclosures vault. Audited annual financial statements are preserved at the registered office for formal institutional review."*

---

## 6. Honorary Trustee Fiduciary Verification (Clause XVI)

### Trust Deed Rule:
Under Clause XVI of Trust Deed No. 40311302194, trustees serve strictly in an honorary capacity without salary, allowance, sitting fees, or personal remuneration from trust funds.

### Boundary Enforcement:
- The statement applies strictly to **trustee remuneration**.
- It does **not** claim zero vendor processing fees or merchant charges on payment gateways.
- All references in `HowMectWorksSection.tsx` and `InstitutionalImpactSection.tsx` strictly qualify trustee non-remuneration without invalid broad claims.

---

## 7. Full CTA Matrix & Route Verification

The component contains **13 total CTA elements** resolving to **9 unique internal destinations** (8 primary + 1 secondary inquiry):

| # | CTA Anchor Text | Destination Route | Category | HTTP Status |
|---|-----------------|-------------------|----------|-------------|
| 1 | "Verify" (Stage 01) | `/about` | Primary | 200 OK |
| 2 | "Verify" (Stage 02) | `/governance` | Primary | 200 OK |
| 3 | "Verify" (Stage 03) | `/donate` | Primary | 200 OK |
| 4 | "Verify" (Stage 04) | `/programmes` | Primary | 200 OK |
| 5 | "Verify" (Stage 05) | `/statutory-disclosures` | Primary | 200 OK |
| 6 | "Inspect Statutory Disclosures" (Fiduciary Banner) | `/statutory-disclosures` | Primary | 200 OK |
| 7 | "Explore Programmes" (Pathway 1) | `/programmes` | Primary | 200 OK |
| 8 | "Scholarship Guidance" (Pathway 1) | `/scholarships` | Primary | 200 OK |
| 9 | "Make a Donation" (Pathway 2) | `/donate` | Primary | 200 OK |
| 10 | "Statutory Vault" (Pathway 2) | `/statutory-disclosures` | Primary | 200 OK |
| 11 | "Register as Volunteer" (Pathway 3) | `/volunteer` | Primary | 200 OK |
| 12 | "CSR Partnerships" (Pathway 4) | `/csr-partnerships` | Primary | 200 OK |
| 13 | "Contact Secretariat" (Pathway 4) | `/contact` | Secondary Inquiry | 200 OK |

**Route Matrix Summary:**
- Primary unique destinations: **8**
- Secondary inquiry destinations: **1** (`/contact`)
- Total unique destinations: **9**
- Broken links: **0**

---

## 8. Visual QA & Responsive Viewport Matrix

Automated Playwright tests (`scripts/how-it-works-qa-phase21-5-5.mjs`) verified rendering and layout across 10 viewports using Microsoft Edge headless:

| Viewport | Dimensions (WxH) | Horizontal Overflow | Section Heading | Image Loaded | Stages (01–05) | Integrity Verified | Console Errors |
|----------|------------------|---------------------|-----------------|--------------|----------------|--------------------|----------------|
| Mobile S | 320 x 640 | 0 px | Visible (29.6px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| Mobile M | 360 x 740 | 0 px | Visible (29.6px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| iPhone 14 | 390 x 844 | 0 px | Visible (29.6px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| Mobile XL | 430 x 932 | 0 px | Visible (29.6px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| iPad Mini | 768 x 1024 | 0 px | Visible (33.8px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| iPad Pro | 1024 x 768 | 0 px | Visible (44.0px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| Laptop | 1280 x 800 | 0 px | Visible (44.0px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| Desktop HD | 1440 x 900 | 0 px | Visible (44.0px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| UltraWide | 1920 x 1080 | 0 px | Visible (44.0px) | Loaded & Visible | All 5 Verified | PASS | 0 |
| Landscape | 844 x 390 | 0 px | Visible (37.1px) | Loaded & Visible | All 5 Verified | PASS | 0 |

### Accessibility & Reduced Motion Test:
- `prefers-reduced-motion: reduce`: Heading opacity = `1`, image opacity = `1`.
- Clean instantaneous rendering without unrendered layout shifts.

---

## 9. Preflight & Git Safety Confirmation

- **Branch:** `feat/phase-21-1-design-system`
- **Prohibited Commands Run:** None (`git reset`, `git clean`, `git checkout .`, `git restore`, `git add .`, automatic commit/push/merge were **never** executed).
- **Preserved Uncommitted Assets:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java` (Preserved)
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java` (Preserved)
  - `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql` (Preserved)
  - All existing reports, scripts, and previous phase implementations are 100% intact.

---

## 10. Final Verification Sign-Off

All objectives of Phase 21.5.5.2 have been completely satisfied:
- CSR-1 registration claims are legally exact, grounded, and cautious.
- Community consultation practices are accurately characterized without overstated statistical claims.
- Fund accounting accurately reflects Indian trust law ("general charitable fund").
- Form 10B is correctly identified as an income-tax audit report under Section 12A(1)(b), distinct from balance sheets preserved at the registered office.
- Clause XVI trustee honorary service is accurately stated.
- All 13 CTAs resolve cleanly to 9 valid routes.
- Quality gates (TypeScript, ESLint, Next.js build, Playwright QA) passed with zero errors and zero horizontal overflow.

**PHASE 21.5.5.2 — FINAL SOURCE & PROVENANCE CLOSURE ACCEPTED**
