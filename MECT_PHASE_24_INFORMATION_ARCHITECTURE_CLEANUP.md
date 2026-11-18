# MECT PHASE 24 — INFORMATION ARCHITECTURE CLEANUP & SITE MAP
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Execution Date:** 18 November 2026  
**Status:** COMPLETE & VERIFIED  
**Working Branch:** `feat/phase-24-digital-reinvention`

---

## 1. Information Architecture Principles & Rationalisation

Phase 24 establishes a lean, purposeful, and non-redundant site hierarchy. Prior iterations accumulated disconnected components, unindexed routes, and repetitive cards.

### Core Architecture Rules:
1. **No Redundant Pages:** Operational processes (Scholarship application, inquiry submission, donation checkout, grievance redressal) live on single canonical routes.
2. **Consolidation of Dead Branches:** Old standalone blog fragments (`/stories/*`) are unified under `/memories-gallery#field-dispatches` with 308 permanent server redirects.
3. **Dead Component Purge:**
   - Previous phase purged 9 unused legacy section components (112.5 KB reduction).
   - Phase 24 purged `CompactWorkAreasSection.tsx` in favor of the systemic `InterconnectedSafetyNetSection.tsx`.
4. **Single Source of Truth for Identity & Contacts:** `content/org.ts` feeds `src/lib/config.ts`, `src/app/layout.tsx` (JSON-LD), `Header.tsx`, `Footer.tsx`, and all downstream consumer views.

---

## 2. Canonical Sitemap & Page Hierarchy

```
https://mect.org.in
├── / (Homepage: 7-tier editorial narrative, 3D experience, audited telemetry)
├── /about (Heritage, Trustees, Honorary Clause XVI, 4-step execution sequence)
├── /programmes (Education, Women's Livelihoods, Water, Jan Ahar, Community Welfare)
├── /impact (Audited Telemetry, Odisha Impact Sphere 3D, Field metrics)
├── /governance (Registered Trust Deed, Trustees Registry, Fiduciary Charter)
├── /reports (Audited Annual Statements, Tax Filings, Public Records Library)
├── /campaigns
│   └── /campaigns/hanuman-murti (Proposed Cultural Project, 3D Orbital Experience)
├── /csr-partnerships (MCA CSR-1 Schedule VII, Corporate collaboration framework)
├── /donate (Dual-Fund Disbursal, 80G tax policy, Instant receipting)
├── /scholarships (Need-cum-merit grants, direct college payment policy)
│   ├── /scholarships/apply (Applicant intake form)
│   └── /scholarships/track (Live application status tracker)
├── /volunteer (Fellowship onboarding, Child Safeguarding Code)
├── /memories-gallery (Curated Balangir field documentary photography & dispatches)
├── /contact (Specialized institutional desks, canonical phone 9853608113, mect220@gmail.com)
├── /faq (Frequently asked questions across 6 categories)
├── /statutory-disclosures (Deed No. 40311302194, PAN AADTM5474F, CSR00081063)
├── /portal/login (Donor and supporter authenticated self-service desk)
├── /privacy (DPDP Act, 2023 compliance)
├── /terms (Terms of institutional engagement)
└── /accessibility (WCAG 2.1 AA accessibility standards)
```

---

## 3. Redirect & Dead-Link Audit

All historical URL structures are permanently preserved via Next.js 308 redirects in `next.config.ts`:
- `/stories` -> `/memories-gallery#field-dispatches` (308)
- `/stories/*` -> `/memories-gallery#field-dispatches` (308)
- Tel link formats normalized to `tel:+919853608113`
- Mailto link formats normalized to `mailto:mect220@gmail.com`

---

## 4. Verification Check

All canonical routes return HTTP 200 with zero broken internal anchors, zero circular redirects, and full Schema.org structured data integrity.
