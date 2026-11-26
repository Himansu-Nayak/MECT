# MECT — PHASE 2.1: CANONICAL CONTENT ARCHITECTURE & SINGLE SOURCE OF TRUTH (SSOT) SPECIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Origin:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Audit Phase:** Phase 2.1 — Content Architecture & Single Source of Truth Formalization  
**Status:** Approved & Enforced  

---

## 1. Executive Summary & Objective

This document defines the **Canonical Content Architecture** for the Mahaveer Educational & Charitable Trust (MECT) digital ecosystem. Following the forensic duplication inventory in Phase 2.0, this architecture establishes an unambiguous **Single Source of Truth (SSOT)** hierarchy for:
1. Master Institutional Configuration and Legal Disclosures.
2. Canonical Contact Details, Helplines, and Desk Routing.
3. Statutory Credentials, Registrations, and Tax Status.
4. Official Banking Coordinates, UPI Identifiers, and Fiduciary Disclosures.
5. Canonical Programme Definitions and Operational Scopes.
6. Design Tokens, Brand Typography, and Palette Consistency.

Every component, route, PDF generator, email template, and background service must consume these canonical registries rather than defining localized or divergent constants.

---

## 2. Single Source of Truth (SSOT) Hierarchy

The MECT architecture enforces a strict four-tier configuration pipeline:

```
[Tier 1: Root Master Source]
       src/config/org.ts (MECT_ORG)
                │
                ├──► [Tier 2: Documentary Re-export]
                │         content/org.ts (ORG)
                │                  │
                │                  └──► [Tier 3: Master Nav & Layout Config]
                │                            src/lib/config.ts (TRUST_CONFIG)
                │
                └──► [Tier 2B: Detailed Fact & Programme Registry]
                          src/lib/content-registry.ts (MECT_CONTENT_REGISTRY)
                                   │
                                   └──► Frontend Pages, Cards, Donation Journey, 
                                        Backend PDF & Email Templates
```

### 2.1 Configuration File Roles

| Registry File | Canonical Role | Key Exports | Consumers |
| :--- | :--- | :--- | :--- |
| `src/config/org.ts` | **Root Canonical Source**. Contains verified data from scanned documents. | `MECT_ORG`, `PostalAddressConfig`, `StatutoryRegistrationConfig`, `BankConfig`, `ContactConfig` | `content/org.ts`, `src/lib/config.ts`, `ReceiptPdfService`, `EmailTemplateRenderer` |
| `content/org.ts` | **Content Layer Adapter**. Formats deed strings, office titles, and helpline getters. | `ORG` (Readonly object) | `Header.tsx`, `Footer.tsx`, `ContactCard.tsx`, SEO metadata generators |
| `src/lib/config.ts` | **Application Layout & Navigation Configuration**. Structures navbar hierarchy and legal disclaimers. | `TRUST_CONFIG` | Top navigation menus, mobile draw menus, institutional breadcrumbs |
| `src/lib/content-registry.ts` | **Operational Fact & Programme Registry**. Records verified outputs, documentary sources, and status flags. | `MECT_CONTENT_REGISTRY` | About page, Programme detail pages, Governance dossier, AI knowledge base (`mect-knowledge.ts`) |

---

## 3. Canonical Institutional Identity & Statutory Credentials

All public-facing references to MECT's legal constitution must match the following parameters verbatim:

### 3.1 Legal Identity
* **Official Registered Legal Name:** `Mahaveer Educational & Charitable Trust (MECT)`
* **Short Name / Acronym:** `MECT`
* **Legal Form:** Irrevocable Public Charitable Trust
* **Governing Deed:** Trust Deed No. `40311302194`
* **Registration Reference:** Book No. 4, Volume No. 45, Document No. 40311302194
* **Executing Authority:** District Sub-Registrar, Balangir, Government of Odisha
* **Date of Deed Execution:** 27th July 2013
* **Date of Deed Registration:** 30th July 2013
* **Institutional Motto:** *"Knowledge, Compassion & Self-Reliance Across Odisha"*
* **Founding Year:** 2013

### 3.2 Statutory Registrations & Tax Exemption Credentials
* **Permanent Account Number (PAN):** `AADTM5474F` (Allotment Date: 27-07-2013)
* **Section 12A URN:** `AADTM5474FE20231`  
  * *Order DIN:* `AADTM5474FE2023101`  
  * *Date of Order:* 29-01-2024  
  * *Assessment Years:* AY 2024-25 to AY 2026-27  
  * *Issuing Authority:* Income Tax Department (Central Processing Centre)
* **Section 80G URN:** `AADTM5474FF20241`  
  * *Order DIN:* `AADTM5474FF2024101`  
  * *Date of Order:* 29-01-2024  
  * *Assessment Years:* AY 2024-25 to AY 2026-27  
  * *Issuing Authority:* Income Tax Department (Central Processing Centre)
* **MCA Form CSR-1 Registration:** `CSR00081063`  
  * *SRN:* `N14617237`  
  * *Approval Date:* 09-11-2024  
  * *Filing Authority:* Registrar of Companies (ROC-Delhi), Ministry of Corporate Affairs
* **NITI Aayog NGO Darpan Identifier:** `OR/2024/0466491` (Primary verified national listing)
* **MoSJE e-Anudaan Portal Code:** `OR/00040466` (Ministry of Social Justice & Empowerment)

### 3.3 Mandatory Neutral Tax Disclosure Language
All donation routes, forms, receipts, and footers must display the standardized neutral statutory wording:
> *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility (URN: AADTM5474FF20241)."*

---

## 4. Canonical Communication Channels & Official Coordinates

Following the Phase 2.0 unification audit, all conflicting and legacy numbers (`+91 94371 23616`, `9853608113`) have been decommissioned. The sole canonical telephone contact across all systems is:

### 4.1 Phone & WhatsApp
* **Canonical Telephone Number:** `+91 94382 95223`
* **Display Format:** `+91 94382 95223`
* **E.164 International Format:** `+919438295223`
* **Click-to-Call Link:** `tel:+919438295223`
* **Official WhatsApp Service Link:** `https://wa.me/919438295223`
* **Operational Hours:** Monday – Saturday, 10:00 – 17:30 IST

### 4.2 Electronic Mail Desks
* **Official Organizational Email:** `trust@mect.org.in`
* **General Enquiries & Support:** `mect220@gmail.com`
* **Scholarship Intake Inquiries:** `mect220@gmail.com`
* **Grievance Redressal Desk:** `mect220@gmail.com`

### 4.3 Verified Institutional Postal Addresses
1. **Registered Office (Headquarters):**  
   Near Sai Mandir, Rugudipara, Balangir, Odisha – 767001, India  
   *Coordinates Query:* `https://www.google.com/maps/search/?api=1&query=Rugudipara,+Balangir,+Odisha+767001`
2. **Administrative & Corporate Liaison Secretariat:**  
   A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha – 751014, India  
   *Coordinates Query:* `https://www.google.com/maps/search/?api=1&query=Lewis+Plaza,+BJB+Nagar,+Bhubaneswar,+Odisha+751014`

---

## 5. Canonical Banking & Fiduciary Payment Coordinates

MECT strictly enforces a zero-cash, direct-institutional-banking policy. No commercial intermediary payment gateways (e.g. Razorpay, Cashfree, Stripe) are permitted to collect public funds without explicit trust resolution.

### 5.1 Official Domestic Bank Coordinates
* **Account Name:** `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
* **Bank Name:** `State Bank of India` (SBI)
* **Branch:** `Rajendra College Square, Bolangir, Odisha`
* **Account Number:** `33341302498`
* **IFSC Code:** `SBIN0001701`
* **Account Type:** `Current Account`
* **Primary UPI VPA:** `86971610172@sbi`
* **Secondary / Registered Mobile VPA:** `9438295223@sbi`
* **Official Static QR Graphic:** `/images/donate/mect-sbi-qr.png`

### 5.2 Fiduciary Remittance Standards
1. **Direct Educational Disbursals:** All scholarship grants are remitted directly to the college bursar/principal bank account. Zero cash is handled.
2. **Honorary Trustee Service:** Under Trust Deed Clause XVI, 100% of Trustees serve in an honorary capacity without salary, honorarium, sitting fees, or commercial commissions.

---

## 6. Canonical Programmes Taxonomy

The Trust categorizes its grassroots initiatives into active operational programmes, historical completed drives, and proposed pipeline projects:

### 6.1 Verified Active Operational Programmes

| Code | Programme Name | Focus Area | Grassroots Location | Target Beneficiaries |
| :--- | :--- | :--- | :--- | :--- |
| `GENERAL` / `GENERAL_FUND` | **General Charitable Fund** | Comprehensive Community Relief | Statewide Odisha | Most urgent rural and vulnerable needs |
| `EDUCATION` / `EDUCATION_LEARNING` | **Remedial Education (Shiksha Setu)** | High School Retention & Learning Kits | Balangir & Puintala Blocks | Students in rural government schools |
| `WATER` / `SAFE_WATER_SANITATION` | **Jal Seva Clean Water Relief** | Public Hydration & Heatwave Stations | Bus stands, hospitals, railway stations | Summer commuters, daily laborers, patient families |
| `WOMEN` / `WOMEN_EMPOWERMENT` | **Women's Vocational Tailoring (Swavalamban)** | Garment Craft & Self-Reliance | Rugudipara & Chandrasekhar Nagar | Rural women, single mothers, dropouts |
| `FOOD` / `FOOD_SECURITY_RELIEF` | **Jan Ahar Food Relief** | Destitute Attendant Nutrition | District Headquarters Hospital (DHH) Balangir | Vulnerable patient attendants and destitute families |
| `HANUMAN_MURTI` | **Shri Hanuman Murti Cultural Project** | Seva Monument & Heritage Landmark | Planned Heritage Site, Western Odisha | Cultural preservation and public service focus |

### 6.2 Proposed Pipeline Projects (Explicitly Flagged)
* **Project Samarth:** Solar-powered rural digital learning centers and study halls.
* **Higher Education Endowed Scholarship Fund:** Multi-year tuition remission pipeline for professional engineering/medical students.
* **Mobile Rural Health Unit:** Preventative mobile diagnostic van for remote tribal habitations.

---

## 7. Canonical URL & Route Structure

The canonical URL architecture eliminates legacy aliases and maintains 301 redirects or client-side forwarders:

| Old / Conflicting URL | Canonical Production URL | Component / Handler | Status |
| :--- | :--- | :--- | :--- |
| `/privacy-policy` | `/privacy` | `src/app/privacy/page.tsx` | Deduplicated |
| `/terms-of-service` | `/terms` | `src/app/terms/page.tsx` | Canonical |
| `/portal/login` | `/login` | `src/app/portal/login/page.tsx` (Client Redirect) | Preserved |
| `/donate/claim` | `/donate` (Integrated Step 6) | `src/components/donation/DonationJourney.tsx` | Consolidated |
| `/programmes/women` | `/programmes/women-empowerment` | Dynamic Programme Routing | Canonical |

---

## 8. Architectural Enforcement & Verification Checklist

To guarantee zero regression of duplicate content or conflicting constants:
1. **No Hardcoded Phone Numbers:** All telephone references must import from `@/config/org` or `@content/org`.
2. **No Duplicate Banking Details:** Banking coordinates must be consumed exclusively from `MECT_ORG.bank` or `MECT_CONTENT_REGISTRY.banking`.
3. **No Unanchored Tax Claims:** The tax exemption disclosure must accompany every bank details presentation.
4. **Automated Secret and Consistency Scanning:** `npm run scan:secrets` and `npm run check:confirm` must validate before any commit.
