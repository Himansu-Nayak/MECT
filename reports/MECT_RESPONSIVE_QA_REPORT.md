# MECT — Complete Responsive, Functional & Regression QA Report

**Date:** 2026-11-11  
**Verification Command Suite:** `npx tsc --noEmit`, `npm run lint`, `npm run build`, `node scratch/verify-complete-release.mjs` (local `next start`)  
**Total Failures:** `0`

---

## 1. Automated Build, TypeScript & Lint Checks (Post-Final Edit)

| Check | Command | Observed Output | Status |
|---|---|---|---|
| TypeScript | `npx tsc --noEmit` | Exit code `0` (`0` errors) | **PASS** |
| ESLint | `npm run lint` | Exit code `0` (`0` errors) | **PASS** |
| Production Build | `npm run build` (`next build --webpack`) | Compiled in `25.7s`, TypeScript check `7.6s`, `37/37` static routes + dynamic `/api/ai/chat`, `/api/ai/health` built cleanly | **PASS** |

---

## 2. 10-Viewport Homepage Responsive, Animation & Performance Telemetry

| Viewport | Overflow (`scrollW/innerW`) | LTR Drift (`dx / 0.9s`, `hero-bg-marquee-ltr`) | Broken Visible Images | CLS | Console / Asset Errors | Result |
|---|---|---|---|---|---|---|
| `320 x 740` | `320 / 320` | `+65.7px` | `0 / 2` | `0` | `0` | **PASS** |
| `360 x 800` | `360 / 360` | `+73.9px` | `0 / 2` | `0` | `0` | **PASS** |
| `375 x 812` | `375 / 375` | `+77.0px` | `0 / 2` | `0` | `0` | **PASS** |
| `390 x 844` | `390 / 390` | `+80.1px` | `0 / 2` | `0` | `0` | **PASS** |
| `430 x 932` | `430 / 430` | `+87.5px` | `0 / 2` | `0` | `0` | **PASS** |
| `768 x 1024` | `768 / 768` | `+103.7px` | `0 / 3` | `0` | `0` | **PASS** |
| `1024 x 768` | `1024 / 1024` | `+124.3px` | `0 / 3` | `0` | `0` | **PASS** |
| `1280 x 800` | `1280 / 1280` | `+137.3px` | `0 / 3` | `0` | `0` | **PASS** |
| `1440 x 900` | `1440 / 1440` | `+153.2px` | `0 / 3` | `0` | `0` | **PASS** |
| `1920 x 1080` | `1920 / 1920` | `+207.8px` | `0 / 3` | `0` | `0` | **PASS** |

*Note on Lazy Image Loading (`Phase 8`):* Initial fold hero frames (`idx 0, 1, 6`) load eagerly (`priority` on lead photo `idx 0`), while off-screen hero panels (`idx 2..5`), CSR certificate thumbnail, and footer emblem use `loading="lazy"`.

---

## 3. Subroute Regression Coverage (`390px` Mobile & `1440px` Desktop)

| Route | `390px` HTTP & Overflow | `1440px` HTTP & Overflow | Errors | Result |
|---|---|---|---|---|
| `/about` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/programmes` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/impact` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/csr-partnerships` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/governance` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/donate` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |
| `/contact` | `200`, `390 / 390` | `200`, `1440 / 1440` | `0` | **PASS** |

*Local test note:* `SmartDonationCheckout` backend calls to `/api/v1/` are excluded from client error counts in offline `next start` mode because Nginx/Spring Boot runs on the production VPS.

---

## 4. Accessibility & Visual Inspection
- **Reduced Motion (`prefers-reduced-motion: reduce` at `390px`):** `{ anim: 'none', cloneDisplay: 'none' }`, `open=true`, `close=true` — PASS.
- **Visual Captures Inspected:**
  - `scratch/complete-qa/home-mobile-390.png`, `home-desktop-1440.png`
  - `scratch/complete-qa/qr-mobile-390.png`, `qr-desktop-1440.png`, `donate-qr-390.png`
  - `scratch/complete-qa/route-about-1440.png`, `route-programmes-1440.png`, `route-donate-1440.png`
