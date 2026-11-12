# MECT Motion & UI Architecture (`docs/MOTION.md`)

## 1. Library Ownership (Strict Single-Owner Rule)
Every animated element is owned by **one** library only. Every animated component must declare its owner in a top-of-file comment (`// motion: owner = Motion` or `// motion: owner = Anime.js`).

- **Motion (`motion/react`):** React UI transitions (`LazyMotion` + `domAnimation`, `MotionConfig reducedMotion="user"`), `AnimatePresence`, `layoutId`, hover/press feedback, `useScroll`, `whileInView`, and calibrated springs.
- **Anime.js v4 (`animejs`):** SVG path drawing (`createDrawable`), motion paths (`createMotionPath`), `stagger` grids, number count-ups, and scroll-synced SVGs (`onScroll`, `createScope`).
- **Kokonut UI (`@kokonutui`):** Open-source shadcn components copied as owned source in `src/components/`, re-mapped strictly to MECT palette tokens.
- **Bklit UI (`@bklit`):** Open-source shadcn-based charts in `src/components/charts/` used exclusively for confirmed data on `/impact`.

If a component coordinates both libraries on separate child elements, it must include `// motion: split` with a brief explanation.

## 2. Shared Tokens (`src/lib/motion.ts`)
- Durations: `fast = 0.2s`, `base = 0.4s`, `slow = 0.7s`
- Easings: `easeOut = [0.22, 1, 0.36, 1]`, `easeInOut = [0.4, 0, 0.2, 1]`
- Spring: `{ type: "spring", stiffness: 120, damping: 22 }`
- Viewport: `{ once: true, amount: 0.2 }`

## 3. Accessibility & Performance Rules
- Respect `prefers-reduced-motion: reduce` everywhere (animations become instant or simple opacity fades; no running Web Animations after load).
- Animate **only** `transform` and `opacity` (never `width`, `height`, `top`, `left`).
- All text, headings, pillars, bank details, and links must be present and visible in server-rendered HTML with JavaScript disabled.
- Banned effects: Glitch Text, Pull Cord, Tear Button, Bell Button, Particle Button, Plucked Text, confetti, body-text parallax, bouncing/overshooting springs, flashing effects, sound, or any payment-like slide/tear gesture.

## 4. Canonical Bundle Measurement Method
First-load JS for `/` is measured using **one canonical method** implemented in `scripts/audit-motion.mts` (`measureHomeFirstLoadJs`):
1. Build the production app (`npm run build`).
2. Fetch the production HTML of `/` from `next start`.
3. Extract every unique `<script src="/_next/static/chunks/*.js">` tag referenced in the HTML response.
4. Read each corresponding `.js` file from `.next/static/chunks/` on disk and sum `zlib.gzipSync(buffer).length` across all unique chunks.
5. Compare against the immutable baseline in `reports/motion-baseline-bundle.txt`; the budget fails if `/` first-load JS grows by more than **+60.00 KB gzipped** (`61,440` bytes).
