# PHASE M2 REPORT — Site Shell

- **Phase:** `PHASE M2`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M2.1** Updated `src/components/Header.tsx` (`// motion: owner = Motion`): replaced window scroll listener with `useScroll` + `useMotionValueEvent`, switched Motion elements to `m.*` (`domAnimation`), kept locked MECT logo and real `<Link>` server links, and replaced `layoutId` active indicator with `m.span` (`scaleX` + `opacity`).
- **M2.2** Upgraded mobile drawer in `src/components/Header.tsx` to `m.div` + `AnimatePresence`, preserving focus trap, `Escape` close, focus return, and `min-h-[44px]` touch targets.
- **M2.3** Created `src/components/layout/SiteSearch.tsx` (`SiteSearchTrigger`) mounted in `Header.tsx`, bound to `/` and `Ctrl/Cmd+K`, indexing verified MECT routes (`TRUST_CONFIG.navigation` + core statutory/governance/donate pages, zero 404s).
- **M2.4** Created `src/components/motion/ReadingProgress.tsx` (`useScroll` + `useSpring` 3px `scaleX` decorative bar) and mounted it on `/statutory-disclosures`, `/faq`, and `/governance`.
- **M2.5** Created `src/components/ui/PromiseToast.tsx` (`ToastProvider` + `useToast` with `aria-live="polite"` + `role="status"`) and wrapped `SiteLayout` in `src/app/layout.tsx`.
- **M2.6** Annotated `src/components/compliance/TaxStatusNotice.tsx` with `data-inline-alert="tax-status"`, keeping legal text steady and server-rendered.
- **M2.7** Updated `src/components/layout/StatutoryTicker.tsx`: added hover/focus-within pause, visible Pause/Resume toggle button (`aria-pressed`), static wrap under `prefers-reduced-motion: reduce`, and `aria-hidden` + `inert` on duplicate ticker copy.
- **M2.8** Updated `src/components/Footer.tsx` to use the M1 SSR-first `Reveal` from `@/components/motion` while keeping bank details static.

## Verification

- `npm run lint`: **PASS** (exit `0`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m2`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0) | `NO_JS_CONTENT`: **PASS** (0) | `FORBIDDEN_PROPS`: **PASS** (0) | `SINGLE_OWNER`: **PASS** (0) | `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `292.82 KB` gzipped (baseline `279.75 KB`, delta `+13.07 KB`, within `<= +60.00 KB` budget)
- **Screenshots:** `reports/shots/m2-home-desktop.png`, `reports/shots/m2-home-mobile.png`

