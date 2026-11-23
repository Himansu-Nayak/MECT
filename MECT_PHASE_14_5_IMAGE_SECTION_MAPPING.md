# MECT — PHASE 14.5 IMAGE-TO-SECTION MAPPING SPECIFICATION

**Project:** MAHAVIR TRUST / Mahaveer Educational & Charitable Trust (MECT)  
**Date:** November 23, 2026  
**Auditor:** Principal DevSecOps Engineer & UI/UX Architect  

---

## 1. COMPREHENSIVE IMAGE PLACEMENT REGISTER

| # | Source Path | Target Component / File | Website Route | Section & Purpose | Display Ratio | Object Fit & Position | Optimization Method | Verification Status |
|---|---|---|---|---|---|---|---|---|
| **1** | `public/images/leadership/er-japabandhu-kampa.webp` (derived from `public/Er. Japabandhu Kampa.jpeg`) | `src/app/governance/page.tsx` | `/governance` | Section 01 Institutional Leadership: Managing Trustee Card (replaces initials avatar `JK`) | `4:5` portrait | `object-cover object-top` | Next.js `<Image>`, WebP, quality 90 | **VERIFIED** (Authentic portrait; face preserved) |
| **2** | `public/images/leadership/er-japabandhu-kampa.webp` (derived from `public/Er. Japabandhu Kampa.jpeg`) | `src/app/about/page.tsx` | `/about` | Section 05 Governance Architecture: Settler Founder & Managing Trustee Profile Card | `4:5` portrait | `object-cover object-top` | Next.js `<Image>`, WebP, quality 90 | **VERIFIED** (Editorial framed presentation) |
| **3** | `public/images/leadership/er-japabandhu-kampa.webp` (derived from `public/Er. Japabandhu Kampa.jpeg`) | `src/components/sections/StatutoryGovernanceSection.tsx` | `/` (Homepage) | Section 08 Statutory Governance: Managing Trustee Custodianship Card | `4:5` portrait | `object-cover object-top` | Next.js `<Image>`, WebP, quality 90 | **VERIFIED** (Anchors institutional transparency) |
| **4** | `/images/hero/mect-civic-pledge-classroom.webp` | `src/app/campaigns/page.tsx` | `/campaigns` | Campaign Card 02: Free Education for 200 Students (replaces flat placeholder icon box) | `16:10` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Authentic student study pledge) |
| **5** | `/images/hero/mect-civic-pledge-classroom.webp` | `src/components/sections/DifferentiatedCampaignsSection.tsx` | `/` (Homepage) | Priority 01 Education Campaign Showcase (replaces icon placeholder with documentary visual) | `16:10` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Documentary student photo) |
| **6** | `/images/hero/mect-women-empowerment-seminar.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 02: Women Vocational Training & Swavalamban (replaces stock placeholder) | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (*Sakshama Nari* field seminar) |
| **7** | `/images/hero/mect-civic-pledge-classroom.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 01: Free Education & Remedial Learning (replaces stock library photo) | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Documentary classroom photo) |
| **8** | `/images/hero/mect-clean-water-hygiene-demo.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 03: Jal Seva Drinking Water & Hygiene | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Summer water kiosk operation) |
| **9** | `/images/hero/mect-legal-literacy-session.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 04: Legal Literacy & Citizen Rights Awareness | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Rural citizen rights camp) |
| **10** | `/images/hero/mect-public-health-awareness.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 05: Public Health Screening & Hospital Meal Drives | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Hospital patient attendant meals) |
| **11** | `/images/hero/mect-trustees-campus-walk.webp` | `src/app/programmes/page.tsx` | `/programmes` | Programme 06: Rural Infrastructure & Community Hubs | `16:9` card | `object-cover object-center` | Next.js `<Image>`, WebP | **VERIFIED** (Trustees reviewing site) |
| **12** | `/images/hero/mect-faculty-puintala-campus.webp` | `src/components/sections/InstitutionalStorySection.tsx` | `/` (Homepage) | Section 02 Institutional Story: Rural Outreach Centre Plaque | `4:3` feature | `object-cover object-center` | Next.js `<Image>`, WebP, scale hover | **VERIFIED** (Faculty assembled at Puīntalā) |

---

## 2. PLACEMENT & INTEGRATION RULES
1. **No Face Distortion:** All portrait cards utilize `object-cover object-top` within aspect-ratio locked containers (`aspect-[4/5]` or `aspect-[3/4]`), guaranteeing that Er. Japabandhu Kampa's head, facial features, and natural proportions are completely preserved.
2. **Authenticity Guarantee:** Only genuine project photographs from MECT charitable drives in Balangir are deployed; third-party stock placeholders are eliminated.
3. **No Financial or Content Regression:** All existing text, statutory citations (Trust Deed No. 40311302194), donation buttons, and navigation anchors are preserved 100%.
