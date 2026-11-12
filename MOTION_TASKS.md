# MECT Motion & UI Implementation Checklist (`MOTION_TASKS.md`)

Branch: `motion-ui`

## PHASE M0 — Install, audit script, inventory

- [x] **M0.1** Create branch `motion-ui`, install `motion` & `animejs`, configure Kokonut & Bklit registries in `components.json`, record versions/licences in `THIRD_PARTY.md`.
- [x] **M0.2** Create `src/lib/motion.ts` with shared durations (`fast 0.2s`, `base 0.4s`, `slow 0.7s`), easings, spring (`{ stiffness: 120, damping: 22 }`), and viewport settings (`{ once: true, amount: 0.2 }`).
- [x] **M0.3** Build `scripts/audit-motion.ts` (`npm run audit:motion`) covering reduced-motion, no-JS, forbidden properties, single-owner check, and `/` first-load JS bundle delta (`<= 60 KB gzipped`), and save baseline to `reports/motion-baseline.txt` and `reports/motion-baseline-bundle.txt`.
- [x] **M0.4** Write `reports/motion-inventory.md` listing every page and section where motion or a component will be added and any items recommended dropping.

## PHASE M1 — Motion foundation

- [x] **M1.1** Create `src/components/motion/MotionProvider.tsx` (`LazyMotion` + `domAnimation` + `MotionConfig reducedMotion="user"`), wrap root layout.
- [x] **M1.2** Create reusable wrappers `<Reveal>`, `<RevealList>`, and `<FadeIn>` rendering server HTML first and animating post-hydration.
- [x] **M1.3** Create `src/lib/anime.ts` (`canAnimate()`, `withScope(ref, fn)` with `createScope` + `revert()` on unmount).
- [x] **M1.4** Add enter-only route fade in `src/app/template.tsx` (opacity only, `fast`).
- [x] **M1.5** Document library ownership, tokens, reduced-motion, and banned effects in `docs/MOTION.md`.

## PHASE M2 — Site shell

- [x] **M2.1** Header (`morphic-navbar` + `useScroll` shrink, transform/opacity only, real server links, locked logo).
- [x] **M2.2** Mobile menu (`smooth-drawer` + `AnimatePresence`, focus trap, Escape, focus return, 44px targets).
- [x] **M2.3** Site search (`action-search-bar` indexed from content files, `/` and `Ctrl/Cmd+K`, no 404s).
- [x] **M2.4** Reading progress (`useScroll` 3px decorative bar on statutory, FAQ, governance).
- [x] **M2.5** Toasts (`promise-toast` with ARIA live region for form submits).
- [x] **M2.6** Inline notices (`inline-alert` for `<TaxStatusNotice />`, steady legal text).
- [x] **M2.7** Ticker (hover/focus pause, visible pause button, static wrap under reduced motion, `aria-hidden` + `inert` duplicates).
- [x] **M2.8** Footer (Reveal only; static bank details).

## PHASE M3 — Home page

- [x] **M3.1** Hero cross-fade (first slide eager, lazy-load rest <= 7, opacity 6s, pause/play & prev/next, no auto-advance under reduced motion).
- [x] **M3.2** Five pillars (`bento-grid` linking to `/programmes#<id>`, subtle hover lift).
- [x] **M3.3** Impact numbers (`metric-card` + Anime.js count-up 1.2s from server HTML, confirmed labels + Source link).
- [x] **M3.4** "How MECT works" flow (Anime.js `createDrawable` + `onScroll` line; Motion `<Reveal>` cards).
- [x] **M3.5** Statutory strip (static confirmed wording).
- [x] **M3.6** Marker emphasis (`marker-text` max once per page, static under reduced motion).
- [x] **M3.7** Stories rail (`carousel-cards` if consented stories exist in `content/stories.ts`, otherwise `empty-state`).

## PHASE M4 — Programmes: one illustration per pillar (Anime.js)

- [x] **M4.1** Education book illustration (`createDrawable`).
- [x] **M4.2** Women Empowerment stitch illustration (`createDrawable` / `createMotionPath`).
- [x] **M4.3** Safe Water droplet & fill rise (`createMotionPath` + transform scale).
- [x] **M4.4** Food Security plate & steam (`stagger`).
- [x] **M4.5** Community Welfare house outline (`createTimeline`).
- [x] **M4.6** Free Education for 200 dot grid (`20x10` `stagger`, confirmed funded places from `content/funding.ts` or outlined target).

## PHASE M5 — Impact page: Bklit charts and district map

- [x] **M5.1** Install needed `@bklit` chart components.
- [x] **M5.2** Create `src/components/charts/` wrappers (chart + one-sentence summary + accessible data table).
- [x] **M5.3** Confirmed charts / Kokonut `empty-state` fallbacks (students, women, pillar share, 200-student gauge, sparkline).
- [x] **M5.4** Odisha 30-district view (Bklit choropleth or 30-tile Anime.js `stagger` grid including Angul and Dhenkanal).
- [x] **M5.5** Optional `topo-background` behind Impact hero at low contrast.

## PHASE M6 — Donate and forms

- [x] **M6.1** `amount-pad` in "Record your intended donation" (pledge/intent only, presets from `content/org.ts`).
- [x] **M6.2** Copy buttons micro-feedback (150ms icon swap + ARIA live "Copied").
- [x] **M6.3** Receipt desk `promise-toast`, `save-status`, `inline-alert` field errors with focus-first-error.
- [x] **M6.4** Scholarship `file-upload` (gated behind `intakeOpen === true`).
- [x] **M6.5** Optional `slot-picker` for document inspection (only if backend exists — skipped: no booking backend exists).
- [x] **M6.6** `slide-text-button` secondary actions + single hero `attract-button` (disabled on touch/reduced motion).

## PHASE M7 — Content pages

- [x] **M7.1** FAQ (`smooth-tab`, server-rendered `AnimatePresence` accordion, `helpful-rating`).
- [x] **M7.2** Statutory & Reports (`<Reveal>` document cards, `scroll-index` sticky TOC).
- [x] **M7.3** Gallery (`lightbox-grid` with `layoutId`, captions, Escape, focus return, lazy-loaded).
- [x] **M7.4** News & empty states (`empty-state`).
- [x] **M7.5** CSR page (`dot-field` subtle background, static under reduced motion).
- [x] **M7.6** Governance (`<Reveal>` trustee cards, static legal text).

## PHASE M8 — Ask HIm(AI) assistant

- [x] **M8.1** Restyle with `ai-prompt`, `ai-loading`, Motion `AnimatePresence`.
- [x] **M8.2** Add `ai-citations` + visible disclaimer ("This assistant can make mistakes. Check the Statutory Disclosures page.").
- [x] **M8.3** Respect reduced motion, no auto-open.

## PHASE M9 — Regression, performance, documentation

- [ ] **M9.1** Full `audit:site`, `audit:motion`, `lint`, `typecheck`, `build`, `test` green.
- [ ] **M9.2** Lighthouse mobile (`Performance >= 80`, `Accessibility >= 95`, `CLS <= 0.05`) + `axe` across routes.
- [ ] **M9.3** Playwright desktop/mobile screenshots + home scroll video trace (`reports/video/`).
- [ ] **M9.4** Bundle comparison & dead-code pruning.
- [ ] **M9.5** Update `README.md`, `docs/MOTION.md`, `THIRD_PARTY.md`.
- [ ] **M9.6** Write `reports/motion-final-report.md`.
