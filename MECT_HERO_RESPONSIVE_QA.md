# MECT Hero Responsive QA Report (Final)

**Verification Tool:** Playwright (Microsoft Edge Chromium headless) via `scratch/verify-hero-bg-qa.mjs` against production `next start` (`npm run build`).  
**Date:** 2026-11-11

---

## 1. 10-Viewport Browser Results (Latest Post-Refinement Run)

| Viewport | Scroll / Inner Width | Hero Height | +X Motion / 1s (LTR Verified) | `<h1>` Topmost | Nav Clear of `<h1>` | Broken Images | CLS | Status |
|---|---|---|---|---|---|---|---|---|
| `320 x 740` | `320 / 320` | `1013px` | `+27.9px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `360 x 800` | `360 / 360` | `882px` | `+31.2px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `390 x 844` | `390 / 390` | `790px` | `+33.8px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `430 x 932` | `430 / 430` | `775px` | `+36.9px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `768 x 1024` | `768 / 768` | `768px` | `+61.8px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `1024 x 768` | `1024 / 1024` | `758px` | `+74.3px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `1280 x 800` | `1280 / 1280` | `750px` | `+86.8px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `1366 x 768` | `1366 / 1366` | `750px` | `+91.8px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `1440 x 900` | `1440 / 1440` | `750px` | `+97.6px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |
| `1920 x 1080` | `1920 / 1920` | `750px` | `+131.2px` (`LTR=true`) | `true` | `true` | `0 / 10` | `0` | **PASS** |

---

## 2. Regression, Route & Screenshot Checks

- **CTA & Governance Routes Verified (`HTTP 200`):** `/programmes`, `/donate`, `/csr-partnerships`, `/governance`.
- **Unrelated Sections Intact:** `#free-education-200` present and `<footer>` visible.
- **Pause Toggle & Reduced Motion:** `Pause Backdrop` paused animation cleanly (`aria-pressed="true"`); `prefers-reduced-motion: reduce` rendered static grid with cloned track hidden (`display: none`).
- **Visual Screenshots Inspected (`scratch/hero-qa/`):** Verified `hero-mobile-320.png`, `hero-mobile-390.png`, `hero-tablet-768.png`, `hero-laptop-1024.png`, `hero-desktop-1440.png`, and `hero-desktop-1920.png`.
- **Runtime Hygiene:** `0` console errors, `0` page errors, `0` HTTP `>=400` asset responses.
