# PHASE M1 REPORT — Motion Foundation

- **Phase:** `PHASE M1`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M1.1** Created `src/components/motion/MotionProvider.tsx` (`LazyMotion` + `domAnimation` + `MotionConfig reducedMotion="user"`) and wrapped `RootLayout` in `src/app/layout.tsx`.
- **M1.2** Created `src/components/motion/Reveal.tsx` (and `src/components/motion/index.ts`) exporting `<Reveal>`, `<RevealList>`, `<RevealListItem>`, and `<FadeIn>` using `m` from `"motion/react"` and `@/lib/motion` tokens. Components render visible server HTML (`opacity: 1`) for SSR/no-JS and animate below-the-fold elements post-hydration. Also updated `src/components/ui/MotionPrimitives.tsx` to use `m.div` from `"motion/react"`.
- **M1.3** Created `src/lib/anime.ts` exporting `canAnimate()` and `withScope(ref, fn)` using `createScope({ root: ref })` with `scope.revert()` cleanup on unmount.
- **M1.4** Created `src/app/template.tsx` with an enter-only opacity route fade (`MOTION_TRANSITIONS.fast`), keeping initial SSR/hydration at `opacity: 1` for 0 ms LCP and no-JS visibility.
- **M1.5** Updated `docs/MOTION.md` with library ownership (`// motion: owner = ...`), M1 foundation primitives, shared tokens, accessibility/no-JS rules, banned effects, and canonical bundle measurement method.

## Verification

- `npm run lint`: **PASS** (exit `0`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m1`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0)
  - `NO_JS_CONTENT`: **PASS** (0)
  - `FORBIDDEN_PROPS`: **PASS** (0)
  - `SINGLE_OWNER`: **PASS** (0)
  - `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `284.04 KB` gzipped (baseline `279.75 KB`, delta `+4.29 KB`, well within `<= +60.00 KB` budget)
- **Screenshots:** `reports/shots/m1-home-desktop.png`, `reports/shots/m1-home-mobile.png`

