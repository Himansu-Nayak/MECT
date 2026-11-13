# PHASE M7 REPORT — Content Pages

- **Phase:** `PHASE M7`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M7.1** Created `src/components/motion/SmoothTab.tsx`, `src/components/motion/HelpfulRating.tsx`, and `src/components/sections/FaqFilterWrapper.tsx` (`// motion: owner = Motion`); updated `src/components/Accordion.tsx` with server-rendered `AnimatePresence` + GPU-only opacity/translateY + `HelpfulRating`; wired into `src/app/faq/page.tsx`.
- **M7.2** Created `src/components/motion/ScrollIndex.tsx` (`// motion: owner = Motion`, sticky IntersectionObserver TOC with shared `layoutId` pill) and added `<ScrollIndex />` + `<Reveal>` document cards to `src/app/statutory-disclosures/page.tsx` and `src/app/reports/page.tsx`.
- **M7.3** Created `src/components/motion/LightboxGrid.tsx` (`// motion: owner = Motion`, `layoutId` modal zoom, Escape close, focus return, `next/image` lazy-loaded verified field photos) and mounted it on `src/app/impact/page.tsx`.
- **M7.4** Created `src/components/motion/EmptyState.tsx` (`// motion: owner = Motion`) and mounted it in the News & Press Releases section on `src/app/reports/page.tsx`.
- **M7.5** Created `src/components/motion/DotField.tsx` (`// motion: owner = Motion`, static under `prefers-reduced-motion`) and mounted it behind the Corporate Governance Guarantee section in `src/app/csr-partnerships/page.tsx`.
- **M7.6** Wrapped Board of Trustees cards in `src/app/governance/page.tsx` with `<Reveal>` while keeping all Trust Deed legal text static.

## Verification

- `npm run lint`: **PASS** (exit `0`, 0 errors, 4 pre-existing upstream warnings in `src/components/charts/`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m7`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0) | `NO_JS_CONTENT`: **PASS** (0) | `FORBIDDEN_PROPS`: **PASS** (0) | `SINGLE_OWNER`: **PASS** (0) | `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `319.68 KB` gzipped (baseline `279.75 KB`, delta `39.93 KB`, within `<= 60.00 KB` budget)
- **Screenshots:** `reports/shots/m7-home-desktop.png`, `reports/shots/m7-home-mobile.png`

