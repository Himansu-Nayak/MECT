# MECT Mobile Homepage Hero — Final QA Report

**Date:** 2026-11-11  
**Verification Scope:** Local Next.js production server (`npx tsc --noEmit`, `npm run lint`, `npm run build` + `next start` via `scratch/verify-mobile-qa.mjs`)  
**Status:** Verified locally after final edits across all 11 responsive viewports (`320px–1920px`); ready for GitHub push & VPS release upon user authorization.

---

## 1. Automated TypeScript, Lint & Build Results
All checks ran cleanly with exit code `0` after the final source and CSS edits:
- **TypeScript (`npx tsc --noEmit`):** **PASS** (`0` errors)
- **ESLint (`npm run lint`):** **PASS** (`0` errors)
- **Production Build (`npm run build`):** **PASS** (`next build --webpack` on Next.js `16.4.3`, compiled successfully in `11.0s`, finished TypeScript in `4.7s`, generated `37/37` static pages in `4.3s`, plus dynamic routes `/api/ai/chat` and `/api/ai/health`).

---

## 2. 11-Viewport Responsive, Animation & Layout Telemetry

Measured live via Playwright (`scratch/verify-mobile-qa.mjs`) against all `14` rendered `<img>` elements (`7` primary slides + `7` seamless marquee loop clones across mobile & desktop sequences):

| Viewport | Scroll / Inner Width | Animation Active (`LTR=true`) | +X Drift (`dx`) | Broken / Unloaded Images | Header Fits (`headerOk`) | Top FAB Clear (`quickHiddenAtTop`) | CLS | Result |
|---|---|---|---|---|---|---|---|---|
| `320 x 740` | `320 / 320` | `hero-bg-marquee-ltr` (`LTR=true`) | `65.1px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `360 x 800` | `360 / 360` | `hero-bg-marquee-ltr` (`LTR=true`) | `73.9px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `375 x 812` | `375 / 375` | `hero-bg-marquee-ltr` (`LTR=true`) | `77.0px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `387 x 866` | `387 / 387` | `hero-bg-marquee-ltr` (`LTR=true`) | `80.2px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `390 x 844` | `390 / 390` | `hero-bg-marquee-ltr` (`LTR=true`) | `79.4px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `430 x 932` | `430 / 430` | `hero-bg-marquee-ltr` (`LTR=true`) | `88.3px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `768 x 1024` | `768 / 768` | `hero-bg-marquee-ltr` (`LTR=true`) | `106.6px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `1024 x 768` | `1024 / 1024` | `hero-bg-marquee-ltr` (`LTR=true`) | `122.1px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `1280 x 800` | `1280 / 1280` | `hero-bg-marquee-ltr` (`LTR=true`) | `138.6px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `1440 x 900` | `1440 / 1440` | `hero-bg-marquee-ltr` (`LTR=true`) | `155.9px` | `0 / 14` | `true` | `true` | `0` | **PASS** |
| `1920 x 1080` | `1920 / 1920` | `hero-bg-marquee-ltr` (`LTR=true`) | `243.8px` | `0 / 14` | `true` | `true` | `0` | **PASS** |

- **Console Errors:** `0`
- **HTTP `>= 400` Asset Errors:** `0`
- **Failures:** `0`

---

## 3. Accessibility & Functional Interaction Checks
- **Mobile Navigation Drawer (`390px`):** `open=true, close=true`
- **Scroll-Activated Mobile Floating Controls (`390px` after scroll):** `dockAfterScroll=true, chatAfterScroll=true`
- **Reduced Motion (`prefers-reduced-motion: reduce` on mobile):** `{ anim: 'none', cloneDisplay: 'none', extraDisplay: 'none' }` — locks lead frame static and collapses duplicate marquee clones and extra panels cleanly.

---

## 4. Before & After Visual Verification
- **Before (Reference Mobile Defect State at `387 x 866`):** `scratch/mobile-qa/before-387x866.png`
- **After (Inspected Final Screenshots):**
  - Mobile: `scratch/mobile-qa/after-mobile-320.png`, `scratch/mobile-qa/after-mobile-360.png`, `scratch/mobile-qa/after-mobile-375.png`, `scratch/mobile-qa/after-mobile-387.png`, `scratch/mobile-qa/after-mobile-390.png`, `scratch/mobile-qa/after-mobile-430.png`
  - Tablet & Desktop: `scratch/mobile-qa/after-tablet-768.png`, `scratch/mobile-qa/after-desktop-1280.png`, `scratch/mobile-qa/after-desktop-1440.png`, `scratch/mobile-qa/after-desktop-1920.png`

Visual inspection confirms mobile renders full uncropped human subjects across the landscape `HeroMobilePhotoStrip` gliding left-to-right above crisp typography, symmetric CTAs, unobstructed metrics, and clean desktop `1440px`/`1920px` behind-the-text 7-slide integration (including `mect-trustees-campus-walk.webp` and `illustrative-child-support-outreach.webp`).

---

## 5. Remaining Limitations & Scope Notes
- **User-Supplied Documentary Reference Licence:** Slide 2 (`illustrative-child-support-outreach.webp` from `src/NGO PIC 2.jpg`, `735 x 581`) is retained at native resolution per user instruction, with original third-party copyright/licence attribution unverified.
- **No Visible Pause/Play Overlay Button:** A visible floating `[Pause Backdrop]` toggle is omitted per prior user direction (`"why this is not required"`), while `@media (prefers-reduced-motion: reduce)` deterministically freezes the marquee and hides cloned slides (`{ anim: 'none', cloneDisplay: 'none', extraDisplay: 'none' }`).
- **Deployment Scope:** All verification was run locally against the production build (`next build --webpack` + `next start`). Live production (`https://mect.org.in/`) remains untouched pending GitHub push / VPS release approval.
