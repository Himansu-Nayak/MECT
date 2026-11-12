# MECT Motion & UI Inventory (`reports/motion-inventory.md`)

**Branch:** `motion-ui`  
**Owner Rule:** One element is animated by ONE library only (`// motion: owner = Motion | Anime.js`). All colours map strictly to the locked MECT Terracotta / Warm Sand / Forest Charcoal / Cream palette.

## 1. Global Foundation (Phase M1) & Site Shell (Phase M2)
- **Root Layout (`src/app/layout.tsx`):** `MotionProvider` (`LazyMotion` + `domAnimation` + `MotionConfig reducedMotion="user"`) — **Motion**
- **Route Enter Transition (`src/app/template.tsx`):** Enter-only opacity fade (`fast: 0.2s`), zero exit transition — **Motion**
- **Header (`src/components/Header.tsx`):** `morphic-navbar` pattern + `useScroll` subtle shrink (transform/opacity only); all nav items real links in server HTML; official MECT emblem locked — **Kokonut UI + Motion**
- **Mobile Drawer (`src/components/Header.tsx`):** `smooth-drawer` with `AnimatePresence`, focus trap, Escape-to-close, focus return, 44px touch targets — **Kokonut UI + Motion**
- **Site Search (`src/components/Header.tsx` / search modal):** `action-search-bar` indexed from real routes and FAQ titles (`/` and `Ctrl/Cmd+K`) — **Kokonut UI + Motion**
- **Reading Progress Bar:** Decorative 3px `useScroll` bar (`aria-hidden`) on `/statutory-disclosures`, `/faq`, `/governance` — **Motion**
- **Form Feedback & Notices:** `promise-toast` for form submit states (with ARIA live region); `inline-alert` for `<TaxStatusNotice />` (no animation on legal text) — **Kokonut UI + Motion**
- **Statutory Ticker (`src/components/layout/StatutoryTicker.tsx`):** Pauses on hover/focus + visible pause control; static wrapped list under `prefers-reduced-motion`; duplicates marked `aria-hidden="true"` + `inert` — **Motion / CSS**
- **Footer (`src/components/Footer.tsx`):** Subtle `<Reveal>` on outer container only; bank details remain 100% static — **Motion**

## 2. Home Page `/` (Phase M3)
- **Hero Carousel:** Keep real photography; eager-load slide 1 (`priority`), lazy-load slides 2–7 (no 4x duplication); opacity cross-fade (`6s`), visible pause/play & prev/next buttons, no auto-advance under reduced motion — **Motion**
- **Hero Marker Emphasis:** `marker-text` used once on a single mission phrase; static under reduced motion — **Kokonut UI**
- **Five Pillars Grid:** `bento-grid` linking to real `/programmes#<id>` anchors, subtle hover lift (`scale: 1.01`, touch-ignored) — **Kokonut UI + Motion**
- **Headline Impact Metrics:** `metric-card` with **Anime.js** count-up (`1.2s` from server-rendered final number; instant under reduced motion), confirmed scope labels, and `/reports` source link — **Kokonut UI + Anime.js**
- **How MECT Works (4 Steps):** **Anime.js** `createDrawable` + `onScroll({ sync: true })` connecting SVG line; step cards use **Motion** `<Reveal>` — **Anime.js + Motion** (`// motion: split` if co-located)
- **Statutory Strip:** Static (zero motion) — **None**
- **Stories Rail:** `carousel-cards` only if consented stories exist in `content/stories.ts`, otherwise Kokonut `empty-state` — **Kokonut UI**

## 3. Programmes Page `/programmes` (Phase M4)
Each SVG illustration is original, `< 6 KB`, `role="img"` with `<title>`/`aria-label`, shows final drawn state with JS off or reduced motion, and loads Anime.js via dynamic import on `/programmes` only:
- **Education (`#education`):** Book pages drawing (`createDrawable`, `draw: '0 1'`) — **Anime.js**
- **Women Empowerment (`#women-empowerment`):** Needle-and-thread stitch path (`createDrawable` / `createMotionPath`) — **Anime.js**
- **Safe Water (`#water`):** Droplet path into pot (`createMotionPath`) + fill rise via `scaleY` transform — **Anime.js**
- **Food Security (`#hunger-relief`):** Plate and steam lines (`stagger`) — **Anime.js**
- **Community Welfare (`#pillars`):** House outline (`createTimeline`) — **Anime.js**
- **Free Education for 200 (`#free-education-200`):** `20×10` dot grid (`stagger` from center); filled dots only for confirmed funded seats in `content/funding.ts`, otherwise outlined with `"200 is the target, not current enrolment"` — **Anime.js**

## 4. Impact Page `/impact` (Phase M5)
- **Hero Background:** Optional `topo-background` at low contrast, static under reduced motion — **Kokonut UI**
- **Confirmed Charts (`src/components/charts/`):** Dynamically imported **Bklit UI** wrappers with 1-sentence summary + accessible data table; unconfirmed series render Kokonut `empty-state` with `"Figures are being confirmed"` — **Bklit UI + Kokonut UI**
- **Odisha 30-District View:** Bklit choropleth if custom Odisha GeoJSON is supported, otherwise 30-tile **Anime.js** `stagger` grid (all 30 districts including Angul & Dhenkanal) with keyboard-focusable status tiles — **Bklit UI or Anime.js**

## 5. Donate & Forms `/donate`, `/scholarships/apply`, `/contact`, `/volunteer` (Phase M6)
- **Amount Selector (`Record your intended donation`):** `amount-pad` using `content/org.ts` presets (pledge/intent only) — **Kokonut UI**
- **Bank Copy Buttons:** 150ms icon swap + ARIA live `"Copied"` feedback — **Motion**
- **Form Submit & Drafts:** `promise-toast` submit lifecycle, `save-status` autosave indicator, `inline-alert` field errors with focus-first-error — **Kokonut UI + Motion**
- **Scholarship Upload:** `file-upload` gated strictly behind `intakeOpen === true` — **Kokonut UI**
- **Buttons:** `slide-text-button` for secondary actions; single hero `attract-button` (disabled on touch/reduced motion) — **Kokonut UI + Motion**

## 6. Content Pages & Assistant (Phases M7 & M8)
- **FAQ (`/faq`):** `smooth-tab`, server-rendered `AnimatePresence` accordion (`grid-template-rows`), `helpful-rating` — **Kokonut UI + Motion**
- **Statutory & Reports (`/statutory-disclosures`, `/reports`):** `<Reveal>` document cards, `scroll-index` sticky TOC, `empty-state` for reports in preparation — **Kokonut UI + Motion**
- **Gallery & News (`/gallery`, `/news`):** `lightbox-grid` (`layoutId`), `empty-state` — **Kokonut UI + Motion**
- **CSR (`/csr-partnerships`) & Governance (`/governance`):** Subtle `dot-field` background (static under reduced motion); `<Reveal>` trustee cards — **Kokonut UI + Motion**
- **Ask HIm(AI) (`src/components/HImChatbot.tsx`):** `ai-prompt`, `ai-loading`, `ai-citations`, `AnimatePresence` (no auto-open), visible Statutory Disclosures disclaimer — **Kokonut UI + Motion**

## 7. Recommended Drops / Exclusions
- **Excluded per Rule #4 (Dignity over delight):** Glitch Text, Pull Cord, Tear Button, Bell Button, Particle Button, Plucked Text, confetti, parallax on body text, overshooting springs, sound effects.
- **Excluded per Rule #3 (No payment gateway):** Any slide-to-pay / checkout gesture UI.
- **Skipped unless backend exists:** `slot-picker` on `/statutory-disclosures` (skipped unless an appointment scheduling endpoint is added) and `page-flip` (used only when real PDFs exist in `public/documents/`).

