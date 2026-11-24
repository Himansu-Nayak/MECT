# MECT — Website Content Architecture

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)
**Domain:** `https://mect.org.in`
**Branch:** `feat/multi-sector-ngo-repositioning`
**Date:** 2026-11-10
**Benchmarks Studied (Structural Quality Only):** Smile Foundation India (`https://www.smilefoundationindia.org/`), The Akshaya Patra Foundation (`https://www.akshayapatra.org/`)

---

## 1. Architectural Principles
1. **Organisation-First Positioning:** MECT is presented as a registered multi-sector public charitable trust rooted in Odisha (registered under Indian Trusts Act, 1882; Deed No. `40311302194`), rather than a single-scheme landing page.
2. **Clear Separation of Operational vs. Planned Scope:** Active Balangir ground hubs (`Balangir` & `Puintala` blocks, `DHH Balangir` vicinity) and `Bhubaneswar` liaison operations are separated cleanly from approved/targeted cohorts (`Free Education for 200 Students`) and strategic expansion pathways (`Project Samarth`, `Statewide Higher Education Tuition Grants`, `Corporate CSR Turnkey Implementation`).
3. **Zero Fabricated Metrics or Visuals:** No placeholder counters, synthetic donor QR codes, unverified corporate partners, or unconsented beneficiary photography are published.
4. **Rhythmic Alternating Composition:** Homepage sections alternate between Sage Green anchors (`#52796F`, `#344F46`), clean `Pure White` (`#FFFFFF`) editorial splits, `Porcelain White` (`#F5F7FA`) content bands, and `Soft Sage` (`#EAF0EC`) framing bands to prevent monotonous identical card grids.

---

## 2. Primary Navigation & Sitemap Map

| Top Nav Label | Sub-Routes / Anchors | Purpose |
| :--- | :--- | :--- |
| **About** (`/about`) | `/about`, `/governance`, `/statutory-disclosures` | Legal heritage, Board of Trustees (`Er. Japabandhu Kampa` & Honorary Board), Trust Deed clauses, statutory certificates. |
| **Our Work** (`/programmes`) | `/programmes`, `/programmes#free-education-200`, `/scholarships`, `/scholarships/apply`, `/scholarships/track` | Priority cohort (`Free Education for 200 Students`), core community pillars (`Education & Learning`, `Women Empowerment`, `Jal Seva`, `Jan Ahar`), higher-education grant matrix & application lifecycle. |
| **Impact & Accountability** (`/impact`) | `/impact`, `/reports` | Documented ground indicators, regional hub vs. outreach distinction, FY 2021–24 annual activity summaries & Secretariat inspection procedure. |
| **Get Involved** (`/volunteer`) | `/donate`, `/volunteer`, `/csr-partnerships` | State Bank of India donation gateway & illustrative tax deduction model, volunteer/mentor registration, CSR collaboration (`CSR00081063`). |
| **Resources & Help** (`/contact`) | `/contact`, `/faq`, `/accessibility` | Balangir/Bhubaneswar offices, secretariat enquiry form, FAQ accordion, WCAG 2.2 AA & DPDP/Terms policies (`/privacy`, `/terms`). |

---

## 3. Homepage Section Cadence (`src/app/page.tsx`)

1. **Institutional Hero:** Editorial statement, verified subtext, direct links to programmes, donation, CSR collaboration, and registered Trust Deed governance dossier panel.
2. **Accreditation Marquee & Credential Bar (`InstitutionalMarquee`):** Deed `40311302194`, 12A URN `AADTM5474FE20231`, 80G URN `AADTM5474FF20241`, PAN `AADTM5474F`, NGO Darpan `OR/2024/0466491`, MoSJE `OR/00040466`.
3. **Institutional Introduction + Asymmetric Vision & Mission Split (`#about-overview`):** Concise overview of MECT since 2013 with distinct left editorial narrative and right Vision/Mission accent panels.
4. **Flagship Priority Initiative (`FreeEducationSection`, `#free-education-200`):** `FREE EDUCATION FOR 200 STUDENTS` (`EDUCATION TODAY. A BETTER TOMORROW.` + `"Expanding access to educational support for children from underserved communities."`) plus 6-point specification grid covering eligibility, selection, duration, funding, monitoring, and explicit targeted-cohort capacity disclosure.
5. **Resource Mobilisation Appeal (`SmileFundraisingSection`, `#fundraising`):** `SUPPORT EDUCATION. TRANSFORM LIVES.` detailing resource kits, remedial support, direct SBI banking, intended beneficiaries, and explicit bilateral independence disclaimer.
6. **Five Documented Areas of Public Charitable Work (`#programs`):** `Shiksha Setu`, `Swavalamban`, `Jal & Arogya`, `Annadaan`, `Samaj Kalyan`, plus the direct-to-institution higher education grant bridge card.
7. **Impact & Activities Overview:** Static verified figures (`13+` Years, `350+` Students Coached, `120+` Women Skilled, `10,000+` Citizens Served) tied to Balangir logs and annual activity summaries.
8. **Operational Model (`How MECT Works`):** Four-step survey, design, field delivery, and fiduciary oversight progression.
9. **Scholarship Discovery Suite:** Interactive `SchemeExplorer`, `EligibilityCalculator`, and `DirectDisbursalFlowchart`.
10. **CSR Registration & Organisational Details (`CsrRegistrationSection`, `#csr-registration`):** Verified dossier paired with official `CSR00081063` letter preview, 100% zoom modal, and PNG download.
11. **Managing Trustee & Governance Desk:** Message from Settler Founder & Chairman cum Managing Trustee `Er. Japabandhu Kampa` under Clause XVI honorary governance.
12. **Donation Gateway (`#donate`, `SbiDonationSection`, Tax Estimator), Participation (`#participate` & `#contact-desk`), & Footer:** Direct SBI NEFT/RTGS/IMPS details (`33341302498`, `SBIN0001701`), prepared pending UPI QR container, Income-tax Act, 2025 estimator (`Sections 133/202/354/536`), volunteer/secretariat forms, and 3-tier footer.

