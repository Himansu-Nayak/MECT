# PHASE M3 REPORT — Home Page

- **Phase:** `PHASE M3`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M3.1** Updated `src/components/sections/HeroBackgroundMarquee.tsx` (`// motion: owner = Motion`): first slide eager, remaining 6 slides lazy-loaded, accessible Pause/Play & Prev/Next controls, and auto-advance disabled under `prefers-reduced-motion: reduce`.
- **M3.2** Updated the Five Pillars bento grid in `src/app/page.tsx` with subtle hover lift (`hover:-translate-y-0.5`) and verified `/programmes#<id>` links.
- **M3.3** Created `src/components/motion/AnimeCountUp.tsx` (`// motion: owner = Anime.js`, 1.2s count-up from server HTML via `withScope`, static under reduced motion) and replaced `<CountUpStat />` in Section 5 with `<AnimeCountUp />`, `data-metric-card`, and explicit `Source:` links.
- **M3.4** Created `src/components/motion/HowMectWorksConnector.tsx` (`// motion: owner = Anime.js`, `createDrawable` + `onScroll`) above the Motion-animated 4-step "How MECT Works" cards.
- **M3.5** Annotated Section 2 (`Verified Regulatory Vault`) with `data-statutory-strip="true"` and preserved static confirmed wording.
- **M3.6** Created `src/components/motion/MarkerText.tsx` (`// motion: owner = Anime.js`, `createDrawable`, static under reduced motion) and applied it once on `/`.
- **M3.7** Created `content/stories.ts` (`CONSENTED_STORIES = []` — zero invented testimonials) and `src/components/sections/StoriesRailSection.tsx` (`// motion: owner = Motion`), rendering an honest `empty-state` fallback (and ready `carousel-cards` rail when consented stories are added).

## Verification

- `npm run lint`: **PASS** (exit `0`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m3`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0) | `NO_JS_CONTENT`: **PASS** (0) | `FORBIDDEN_PROPS`: **PASS** (0) | `SINGLE_OWNER`: **PASS** (0) | `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `314.41 KB` gzipped (baseline `279.75 KB`, delta `+34.66 KB`, within `<= +60.00 KB` budget)
- **Screenshots:** `reports/shots/m3-home-desktop.png`, `reports/shots/m3-home-mobile.png`

