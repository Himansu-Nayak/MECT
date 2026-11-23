# PHASE M0 CORRECTION REPORT — Motion + UI Baseline, Housekeeping & Audit Integrity

- **Phase:** `PHASE M0` (Revised)
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## 1. Audit Integrity (`scripts/audit-motion.mts`)

- **Git history:** `scripts/audit-motion.ts` (now `scripts/audit-motion.mts`) was an untracked file created during M0.2 and had **no prior git commit**, so `git diff` against HEAD before the correction commit was empty.
- **Edits made before the correction pass:**
  1. Replaced stale route label `"Hunger"` with `"Food Security"` to match the actual `/sectors/food-security` route.
  2. Replaced ES2018 regex `/s` flag with `[\s\S]*?` for ES2017 TypeScript target compatibility.
  3. Added a type assertion for `getComputedStyle(...).animationName` to satisfy `npm run typecheck`.
- **No check was loosened:** `REDUCED_MOTION` still flags any computed `animationName !== "none"` or `transitionDuration > 0.05s` under `emulateMedia({ reducedMotion: "reduce" })`.
- **Why `reports/motion-baseline-original.txt` shows 0 `REDUCED_MOTION` failures vs the earlier 36:**
  - The initial `task-6122` run occurred while `.next/` was incomplete/stale. Once a clean production build completed, `src/app/globals.css` (`@media (prefers-reduced-motion: reduce)`) already suppressed `animation: none !important` and `transition-duration: 0.01ms !important` across all elements (`animate-hero-marquee`, `animate-marquee`, `header.sticky`, `a.group`, etc.).
  - Regenerated original baseline via `npm run audit:motion -- --baseline-mode --out=reports/motion-baseline-original.txt --shots=reports/shots/m0`: **0 failures** across 18 routes, **279.75 KB** gzipped (`delta 0.00 KB`).

## 2. Expected Failures & Gate M0

- Added `EXPECTED_FAIL_UNTIL` annotation support (`M2.7` for marquees/ticker, `M1.1`/`M2.1` for component transitions) and `--baseline-mode` in `scripts/audit-motion.mts`.
- Gate M0 passes when `npm run audit:motion` runs cleanly and records the immutable baseline (`reports/motion-baseline.txt` and `reports/motion-baseline-bundle.txt`).

## 3. Baseline Safety

- `--save-baseline` in `scripts/audit-motion.mts` refuses to overwrite `reports/motion-baseline.txt` or `reports/motion-baseline-bundle.txt` unless `--force` is explicitly passed.
- Verified by running `npm run audit:motion -- --save-baseline` (without `--force`): exited `0` with `[audit-motion] Baseline files already exist and are immutable (pass --force to overwrite). Keeping existing baseline.`
- Normal `npm run audit:motion` runs write exclusively to `reports/motion-latest.txt`, keeping `reports/motion-baseline.txt` and `reports/motion-baseline-bundle.txt` immutable.

## 4. Bundle Measurement & Top 10 Contributors (`/` First-Load JS)

- **Canonical measurement method (documented in `docs/MOTION.md`):** Sum of `zlib.gzipSync(buffer).length` across all 16 unique `/_next/static/chunks/*.js` `<script src>` tags rendered in `/`.
- **Why `199.78 KB` vs `279.75 KB` gzipped appeared:** The earlier `199.78 KB` figure came from `task-6122` reading a partial/stale `.next` directory before a clean `next build --webpack` completed (missing `polyfills` `38.70 KB` + `motion` chunk `4461` `38.21 KB`, totaling ~77 KB + smaller route chunks). Every clean production build measures **`279.75 KB` gzipped** (`939,200` bytes raw across `16` chunks).
- **`@next/bundle-analyzer` output (`reports/bundle-top.md`):** Generated `.next/analyze/client.html` via `$env:ANALYZE="true"; npm run build` and extracted the Top 10 module contributors to `/` first-load JS (report only; no app code changed in M0):
  1. `react-dom-client.production.js` — `62.36 KB` gzipped (`static/chunks/4bd1b696-e199e788e58acf79.js`)
  2. `src/app/page.tsx` + 7 concatenated modules — `13.18 KB` gzipped (`static/chunks/app/page-7afc69af76894052.js`)
  3. `react-server-dom-webpack-client.browser.production.js` — `7.63 KB` gzipped (`static/chunks/3794-76809258438a3d8c.js`)
  4. `next/dist/client/components/segment-cache/cache.js` — `6.23 KB` gzipped (`static/chunks/3794-76809258438a3d8c.js`)
  5. `motion/dist/es/react.mjs` + 248 modules — `6.16 KB` gzipped (`static/chunks/4461-befd70f718b91343.js`, `38.21 KB` total chunk)
  6. `src/components/ai/HImChatbot.tsx` + 2 modules — `6.02 KB` gzipped (`static/chunks/app/layout-637e8808e68d92d6.js`)
  7. `next/dist/client/components/render-tree.js` — `3.89 KB` gzipped (`static/chunks/3794-76809258438a3d8c.js`)
  8. `next/dist/client/components/segment-cache/scheduler.js` — `3.87 KB` gzipped (`static/chunks/3794-76809258438a3d8c.js`)
  9. `src/components/Header.tsx` + 1 module — `3.38 KB` gzipped (`static/chunks/app/layout-637e8808e68d92d6.js`)
  10. `src/components/sections/SbiDonationSection.tsx` — `3.35 KB` gzipped (`static/chunks/1410-fdd6e670307e5062.js`)

## 5. Installs, Registries & Licences (`THIRD_PARTY.md`)

- **`package.json` dependencies:**
  - `"animejs": "^4.5.0"` (installed `4.5.0`, MIT)
  - `"motion": "^12.4.7"` (installed `12.43.0`, MIT)
  - `"@next/bundle-analyzer": "^16.4.6"` (devDependency)
  - `"playwright": "^1.65.0"` (devDependency)
- **`components.json` registries:**
  - `"@kokonutui": "https://kokonutui.com/r/{name}.json"` (MIT open-source components; Pro excluded)
  - `"@bklit": "https://ui.bklit.com/r/{name}.json"`
- **Bklit install docs followed:** `https://bklit.com/docs/installation` (`@bklit` registry added to `components.json`; components will be added via `npx shadcn@latest add @bklit/<name>` when needed in M3).
- **Bklit licence (`THIRD_PARTY.md`):** Core Bklit UI registry packages in `github.com/bklit/bklit-ui` are **MIT**; Bklit Studio uses a separate proprietary `LICENSE-STUDIO.md` and is **not used**.

## 6. Housekeeping & Verification

- Eliminated `MODULE_TYPELESS_PACKAGE_JSON` warnings by renaming `scripts/check-confirm.ts`, `scripts/audit-site.ts`, and `scripts/audit-motion.ts` to `.mts` and updating `package.json` scripts.
- Set `outputFileTracingRoot: path.resolve(process.cwd())` in `next.config.ts`.
- Renamed package in `package.json` from `"mahavir-trust"` to `"mect"`.
- **Verification results:**
  - `npm run lint`: **PASS** (exit `0`)
  - `npm run typecheck`: **PASS** (exit `0`)
  - `$env:ANALYZE="true"; npm run build`: **PASS** (exit `0`, 37/37 routes, 0 `MODULE_TYPELESS_PACKAGE_JSON` warnings, 0 `package-lock.json` root warnings)
  - `npm run audit:site`: exit `1` — expected pre-Phase-4/8 content findings only (`2` `FORBIDDEN_TEXT` on `/faq` + `28` `IMAGE_ALT_ISSUE` on `/`; `0` `MODULE_TYPELESS_PACKAGE_JSON` warnings)
  - `npm run audit:motion`: **PASS** (exit `0`, `TOTAL FAILURES: 0`, `279.75 KB` gzipped, `delta 0.00 KB`)
  - Desktop & mobile baseline screenshots saved: `reports/shots/m0-home-desktop.png`, `reports/shots/m0-home-mobile.png`.

## 7. Admin & Portal Check (Report Only)

- **Server protection:** **GAP IDENTIFIED.** Neither `src/middleware.ts` nor `src/proxy.ts` exists, and `src/app/admin/layout.tsx` / `src/app/portal/layout.tsx` do not perform server-side session checks. Protection is currently client-side only (`AdminClientLayout.tsx` + `PortalAuthProvider` redirecting via `router.push`).
- **`noindex` metadata:** **PRESENT.** `src/app/admin/layout.tsx` and `src/app/portal/login/layout.tsx` (as well as portal dashboard/profile/welcome layouts) export `createPageMetadata({ ..., noIndex: true })`.
- **`sitemap.xml` exclusion:** **PRESENT.** `src/app/sitemap.ts` excludes `/admin/*` and `/portal/*`.
- **`robots.ts`:** Disallows `/admin/`, `/admin`, and `/api/`, but does **not** currently disallow `/portal/`.

