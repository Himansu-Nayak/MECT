# PHASE M4 REPORT — Programmes Illustrations & 200-Seat Dot Grid

- **Phase:** `PHASE M4`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M4.1–M4.5** Created `src/components/motion/PillarIllustrations.tsx` (`// motion: owner = Anime.js`, scoped via `withScope` + `canAnimate()`):
  - `EducationBookIllustration` (`createDrawable` open book)
  - `WomenStitchIllustration` (`createDrawable` curved stitch seam)
  - `SafeWaterDropletIllustration` (droplet + `scaleY` fill rise, transform-only)
  - `FoodSecurityPlateIllustration` (`stagger` steam wisps over plate)
  - `CommunityWelfareHouseIllustration` (`createTimeline` roof/walls/door)
  Mounted on `/programmes` (`src/app/programmes/page.tsx`).
- **M4.6** Created `content/funding.ts` (`FREE_EDUCATION_200`, `confirmedFundedPlaces: 0` — zero invented numbers) and `src/components/motion/FreeEducationDotGrid.tsx` (`// motion: owner = Anime.js`, 20×10 grid with `stagger({ grid: [20, 10], from: "first" })`), mounted in `src/components/sections/FreeEducationSection.tsx`.

## Verification

- `npm run lint`: **PASS** (exit `0`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m4`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0) | `NO_JS_CONTENT`: **PASS** (0) | `FORBIDDEN_PROPS`: **PASS** (0) | `SINGLE_OWNER`: **PASS** (0) | `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `316.97 KB` gzipped (baseline `279.75 KB`, delta `+37.22 KB`, within `<= +60.00 KB` budget)
- **Screenshots:** `reports/shots/m4-home-desktop.png`, `reports/shots/m4-home-mobile.png`
