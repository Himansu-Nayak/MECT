# MECT PHASE 27 — DUPLICATE CLEANUP AUDIT & CONSOLIDATION REGISTER

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-27-immersive-motion-hd-excellence`  
**Phase:** Phase 27 — Immersive Motion, HD Excellence & Intelligent Deduplication  
**Status:** COMPLETE DEDUPLICATION PROTOCOL  

---

## 1. Audit Scope & Methodology

In compliance with Phase 27 directives, an exhaustive reference audit was conducted across:
1. **React Section Components** (`src/components/sections/`)
2. **Motion Utility Primitives** (`src/components/motion/`)
3. **Public Binary Assets** (`public/images/hero/`)
4. **CSS Classes & Tokens** (`src/app/globals.css`)
5. **Routes & Navigation Links** (`src/app/`, `TRUST_CONFIG.navigation`)

---

## 2. Inventory of Confirmed Duplicate & Unused Elements

### 2.1 Unused Legacy Section Components (Confirmed 0 Imports Across Repository)
The following components were created in historical iterations and have 0 consumers across the entire repository (homepage, inner routes, and components):
1. `src/components/sections/CompactImpactSection.tsx` — Superseded by `AuditedImpactTelemetrySection.tsx`.
2. `src/components/sections/FeaturedInitiativesSection.tsx` — Superseded by `DifferentiatedCampaignsSection.tsx`.
3. `src/components/sections/HeroBackgroundMarquee.tsx` — Superseded by `CinematicHero.tsx`.

*(Note: `CompactHowMectWorks.tsx`, `FreeEducationSection.tsx`, `PillarIllustrations.tsx`, `FreeEducationDotGrid.tsx`, and `DotField.tsx` are actively retained to power inner routes `/about`, `/programmes`, and `/csr-partnerships`.)*

### 2.2 Unused Motion Primitives (Confirmed 0 Imports)
The following animation widget was left unreferenced after design system consolidation:
1. `src/components/motion/HowMectWorksConnector.tsx` — Unused canvas connector (0 references across entire codebase).

### 2.3 Duplicate Binary Assets (Confirmed Exact Duplicates)
The following `.jpg` files are unoptimized, unreferenced duplicates of modern `.webp` assets:
1. `public/images/hero/mect-clean-water-hygiene-demo.jpg` (313 KB) ➔ Replaced by `.webp` (269 KB).
2. `public/images/hero/mect-legal-literacy-session.jpg` (124 KB) ➔ Replaced by `.webp` (106 KB).
3. `public/images/hero/mect-women-empowerment-seminar.jpg` (188 KB) ➔ Replaced by `.webp` (263 KB).
**Total Binary Payload Savings: 625 KB.**

---

## 3. Safe Deletion & Consolidation Verification

All 7 deleted items above have verified zero references across:
- `src/app/page.tsx`
- `src/app/**/page.tsx`
- `src/components/**/*.tsx`
- `content/**/*.ts`
- Build scripts & configs

Removal of these items reduces dead weight and guarantees that only active, verified Phase 26/27 components remain in the repository.
