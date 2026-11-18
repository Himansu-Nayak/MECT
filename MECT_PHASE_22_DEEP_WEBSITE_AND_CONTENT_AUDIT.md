# MECT PHASE 22 — DEEP WEBSITE & CONTENT AUDIT REPORT
**Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)**  
**Audit Baseline Date:** 18 November 2026  
**Auditor:** Senior Product Architect, Institutional Brand Strategist & Next.js Release Engineer  
**Branch:** `feat/phase-22-deep-redefinition` (derived from `feat/phase-21-1-design-system` @ commit `3fb88df`)  
**Production Site:** https://mect.org.in/  

---

## 1. EXECUTIVE SUMMARY & REPOSITORY FORENSICS

### 1.1 Source-of-Truth Reconciliation
- **Checked-out Base Commit:** `3fb88df docs: add phase engineering reports`
- **Previous Implementation Commit:** `a142b1b feat: complete website simplification, 9-section homepage, demo persona cleanup, motion QA & live deployment verification`
- **Baseline Health:**
  - TypeScript (`tsc --noEmit`): **PASSED (0 errors)**
  - ESLint (`eslint .`): **PASSED (0 errors, 4 non-blocking chart useEffect dependency warnings)**
- **Working Tree State:** Clean branch created: `feat/phase-22-deep-redefinition`.

---

## 2. COMPREHENSIVE COMPONENT & ROUTE AUDIT MATRIX

The audit classifies every public route and component according to the Phase 22 Governance Matrix:

| Classification | Meaning | Action Directive |
|---|---|---|
| **KEEP** | Essential and effective | Preserve without regression |
| **REFINE** | Useful but poorly presented | Improve typography, hierarchy and spacing |
| **SHORTEN** | Excessive copy | Edit down to concise, clear statements |
| **CONSOLIDATE** | Repeated information | Combine complementary components into unified units |
| **RELOCATE** | Useful but misplaced | Move to its designated canonical route |
| **REMOVE** | No longer contributes value | Eliminate safely |
| **VERIFY** | Claim needs evidence | Ground strictly in documented records |
| **REPAIR** | Functional or technical defect | Correct underlying logic / accessibility |
| **PROTECT** | Legal, financial or operational dependency | Safeguard idempotency, receipts and compliance |

---

## 3. HOMEPAGE ARCHITECTURE RESTRUCTURING

### 3.1 Initial State (Phase 21.1) vs Target State (Phase 22)

| Section Index | Phase 21.1 Component | Phase 22 Redefinition Target | Action |
|---|---|---|---|
| **01** | `CinematicHero` | **SECTION 01: Cinematic Institutional Hero**<br>Headline: "Creating Opportunities. Strengthening Communities." Primary CTA: `Explore Our Work`. Secondary CTA: `Support Our Mission`. Immediate visibility, zero clutter. | **REFINE** |
| **02** | `CompactTrustStrip` | **SECTION 02: Institutional Identity & Trust**<br>Combine `CompactTrustStrip` and `CompactAboutSection` into one coherent, unified composition. 50–80 word intro, 4 key verified credentials (12A/80G, CSR-1, NGO Darpan, Deed 2013), and statutory link. | **CONSOLIDATE** |
| **03** | `CompactAboutSection` | (Consolidated into Section 02 above; frees slot for Section 07) | **CONSOLIDATE** |
| **04 → 03** | `CompactWorkAreasSection` | **SECTION 03: Our Areas of Work**<br>5 concise programme cards (Education, Women's Livelihoods, Safe Water, Food Security, Community Welfare). 20–35 words each. | **REFINE & SHORTEN** |
| **05 → 04** | `FeaturedInitiativesSection` | **SECTION 04: Featured Initiatives**<br>Side-by-side presentation: Proposed Education Target (Up to 200 Students, contingent on board sanction/funding) + Proposed Hanuman Murti Project (strictly proposed, zero unsupported construction claims). | **REFINE & PROTECT** |
| **06 → 05** | `CompactImpactSection` | **SECTION 05: Documented Impact**<br>3 core metrics (350+ student participation entries FY 2023–24; 120+ vocational course enrolments FY 2021–23; 10,000+ water & relief service instances) + 4th metric: 13+ years trust tenure. Link to methodology. | **REFINE & PROTECT** |
| **07 → 06** | `CompactHowMectWorks` | **SECTION 06: How MECT Works**<br>4 concise sequential steps (Understand Needs → Plan Accountably → Deliver Directly → Monitor & Document). | **REFINE & SHORTEN** |
| **NEW → 07** | *None (misplaced thumbnails in About)* | **SECTION 07: Memories & Gallery Preview**<br>Compact editorial preview of 4–6 authentic approved field photographs with single CTA: `Explore All Memories` linking to `/memories-gallery`. | **IMPLEMENT** |
| **08** | `CompactGetInvolvedSection` | **SECTION 08: Get Involved**<br>3 pathways: Online Donation, Volunteer Fellowship, Corporate CSR. Concise copy, 1 CTA each. | **REFINE & SHORTEN** |
| **09** | `CompactFinalCtaSection` | **SECTION 09: Final Institutional CTA**<br>Concise institutional commitment, 2 primary actions (`Support Our Mission`, `Contact Secretariat`). | **REFINE & SHORTEN** |

---

## 4. PAGE-BY-PAGE AUDIT & ACTION INVENTORY

### 4.1 `/about` (About Us)
- **Current State:** 430 lines. Contains `DeveloperCreditCard` inside the institutional narrative, plus redundant duplicate `HowMectWorksSection` and text-heavy paragraphs.
- **Audit Findings:** 
  1. A formal institutional NGO About page should not feature developer portfolio cards in the primary narrative.
  2. The full operating model flowchart duplicates the homepage Section 06.
  3. Narrative blocks exceed recommended word lengths.
- **Required Action:**
  - **REMOVE** `DeveloperCreditCard` from the main institutional about page to maintain high-trust institutional credibility.
  - **SHORTEN** foundational paragraphs into 3 concise, punchy sections (Foundational Purpose, Irrevocable Fiduciary Safeguards, Multi-Tier Governance).
  - **RELOCATE** granular statutory orders to `/statutory-disclosures`.
  - **REFINE** visual layout with authentic field photography and clear CTAs to `/governance` and `/programmes`.

### 4.2 `/programmes` (Our Work)
- **Current State:** 466 lines. Heading states "Four Connected Areas", omitting "Community Welfare" from the primary list. Includes a heavy, 695-line `FreeEducationSection`.
- **Audit Findings:**
  1. Missing 5th institutional area (Community Welfare & Winter Relief).
  2. FreeEducationSection is verbose and repeats disclaimers multiple times.
- **Required Action:**
  - **REFINE** to accurately present all 5 evidence-backed pillars:
    1. Education & Learning Support (Balangir Remedial Centres)
    2. Women's Vocational Skills & Livelihoods (Balangir Vocational Training Centre)
    3. Safe Water & Community Wellbeing (Jal Seva Kiosks)
    4. Food Security & Nutrition (Jan Ahar Relief)
    5. Community Welfare & Winter Relief (Warm clothing and legal literacy)
  - **SHORTEN** `FreeEducationSection` to highlight the proposed nature (up to 200 students, zero cash transfers, direct college fee remittances).
  - Distinguish operational vs proposed programmes clearly.

### 4.3 `/impact` (Documented Community Impact)
- **Current State:** 323 lines. Uses older `LightboxGrid` that is hardcoded to 6 unverified photo objects and duplicates gallery logic.
- **Audit Findings:**
  1. Older LightboxGrid is disconnected from the canonical `content/gallery.ts` safeguarding registry.
  2. Text blocks for the 30-district framework need clearer distinction between active hubs and planned expansion areas.
- **Required Action:**
  - **REPLACE** older `LightboxGrid` with a curated preview linked directly to `/memories-gallery`.
  - **PROTECT** the exact metric definitions (participation entries ≠ unique students; course enrolments ≠ certified women; service instances ≠ unique citizens).
  - **REFINE** layout with high-contrast data presentation and full methodology links.

### 4.4 `/governance` (Fiduciary Governance)
- **Current State:** 574 lines. Rich deed citations (Deed 2013 No. 40311302194, Clauses 8, 9, 10, 12, 16, 23, 24, 25).
- **Audit Findings:**
  1. Factual and legally sound.
  2. Spacing and card typography can be tightened for better executive reading rhythm.
- **Required Action:**
  - **KEEP & REFINE** all deed citations, honorary non-remuneration clauses, and managing trustee custodianship records.
  - Improve typographic contrast and visual badges.

### 4.5 `/reports` (Public Records Library)
- **Current State:** 190 lines. Connects to `ReportsLibrarySection` and authentic statutory documents.
- **Audit Findings:** Clean, functional document archive.
- **Required Action:**
  - **KEEP & REFINE** document classifications (Audited Statements, Annual Reports, Governance Policies). Ensure zero placeholder download links.

### 4.6 `/campaigns` & `/campaigns/hanuman-murti`
- **Current State:** Dedicated campaign pages.
- **Audit Findings:**
  1. Properly reflects Hanuman Murti as proposed (80–100 ft).
  2. Strictly segregated project ledger.
  3. Zero claims of completed construction or government permits.
- **Required Action:**
  - **PROTECT** all factual constraints. Ensure no fake donation progress bars or fictional engineering certifications.

### 4.7 `/csr-partnerships` (CSR Collaborations)
- **Current State:** 449 lines. Contains repetitive corporate promise text.
- **Audit Findings:** Can be much more punchy and professional for corporate CSR decision makers.
- **Required Action:**
  - **SHORTEN** narrative into 4 structured pillars: Schedule VII Eligible Activities, Registration Credentials (CSR00081063), Direct Banking Transparency, and Milestone Utilization Certificates.
  - Keep single, dedicated inquiry workflow.

### 4.8 `/donate` (Unified Donation Journey)
- **Current State:** 59 lines wrapping `UnifiedDonationExperience`.
- **Audit Findings:**
  1. Successfully sanitized in Phase 21 (no public manual SBI bank details/QR codes).
  2. Cryptographic receipt generation with SHA-256 hash intact.
  3. Neutral tax language (FY 2026–27 unconfirmed).
- **Required Action:**
  - **PROTECT** the payment gateway contracts, webhook validation, and receipt PDF workflows. Ensure no breaking changes to donation state machine.

### 4.9 `/scholarships` & `/scholarships/apply`
- **Current State:** 401 lines on overview, 933 lines on apply.
- **Audit Findings:**
  1. Overview page can be simplified for parents and students.
  2. Application form must clearly emphasize direct college bank transfers (zero cash).
- **Required Action:**
  - **REFINE & SHORTEN** overview page. Clarify 4 simple steps: Eligibility Check → Online Application → Institute Verification → Direct Disbursement.

### 4.10 `/volunteer` (Volunteer Fellowship)
- **Current State:** 859 lines!
- **Audit Findings:** Extremely long, multi-screen explanatory text.
- **Required Action:**
  - **SHORTEN** copy substantially. Focus on 3 core volunteer streams: Academic Mentors, Vocational Trainers, and Relief Coordinators.
  - Simplify registration form and retain safeguarding checks.

### 4.11 `/contact` (Institutional Secretariat & Offices)
- **Current State:** 598 lines. Multiple redundant contact info cards.
- **Audit Findings:**
  1. Repetitive address blocks.
  2. Form has excessive text surrounding inputs.
- **Required Action:**
  - **CONSOLIDATE** into two clear office pillars: Balangir Registered HQ and Bhubaneswar Corporate Secretariat.
  - Clean, accessible inquiry form.

### 4.12 `/faq` (Frequently Asked Questions)
- **Current State:** 458 lines.
- **Audit Findings:** Several overlapping questions about 80G, scholarships, and donations.
- **Required Action:**
  - **CONSOLIDATE & SHORTEN** into 4 crisp categories with 3–4 questions each (30–80 words per answer).

### 4.13 `/statutory-disclosures` (Statutory Disclosures Vault)
- **Current State:** 446 lines.
- **Audit Findings:** Legally required disclosure archive.
- **Required Action:**
  - **PROTECT** all mandatory disclosure documents. Refine visual presentation and accessibility.

### 4.14 `/memories-gallery` (Documentary Memories & Archival Gallery)
- **Current State:** 127 lines with `GalleryLightbox` and `content/gallery.ts`.
- **Audit Findings:** Excellent architecture with child safeguarding clearance and 7-stage review lifecycle.
- **Required Action:**
  - **VERIFY & POLISH** category filtering, keyboard navigation, modal focus traps, and image descriptions.

---

## 5. EDITORIAL METRICS TARGET SUMMARY

| Section / Element | Target Word Count | Current Status | Redefinition Target |
|---|---|---|---|
| Homepage Hero Heading | 4–10 words | 4 words | "Creating Opportunities. Strengthening Communities." |
| Homepage Hero Description | 20–40 words | 24 words | Compliant |
| Section 02 Intro Copy | 50–80 words | ~85 words | Consolidate with Trust Strip into 65 words |
| Work Area Descriptions | 20–35 words each | 20–25 words each | Compliant |
| Impact Explanations | 10–20 words each | 15 words each | Compliant |
| Inner-Page Introductions | 35–70 words | 80–120 words | Reduce to 40–60 words |
| FAQ Answers | 30–80 words | 100–180 words | Reduce to 40–70 words |

---

## 6. RELEASE CRITERIA CHECKLIST

- [x] Initial source recovery baseline verified (branch `feat/phase-22-deep-redefinition`).
- [x] Pre-implementation TypeScript compilation: 0 errors.
- [x] Pre-implementation ESLint: 0 errors.
- [ ] Section 02 consolidated: CompactTrustStrip + CompactAboutSection unified.
- [ ] Section 07 implemented: Memories & Gallery Preview with 4–6 authentic photos and link to `/memories-gallery`.
- [ ] Complete 9-section homepage verified.
- [ ] Inner pages reviewed and copy reduced (/about, /programmes, /impact, /volunteer, /contact, /faq, /csr-partnerships).
- [ ] DeveloperCreditCard removed from About page narrative.
- [ ] Five core work areas accurately reflected across all routes.
- [ ] Strict child safeguarding and media rights enforced in `/memories-gallery`.
- [ ] Payment and donation receipt systems protected.
- [ ] Full regression typecheck, lint, and build verified.
