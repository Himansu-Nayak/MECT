# MECT Responsive QA Report

**Audit Date:** 2026-11-10
**Test Tooling:** Headless Chromium/Edge via Playwright (`scratch/verify-hero-gallery.mjs`) against production build (`next start -p 3000`).

---

## 1. 10-Viewport Responsive Verification Results (`https://localhost:3000` Build)

| Viewport Width | Track Behaviour | ScrollWidth / InnerWidth | Visible Broken Images | CLS | Status |
|---|---|---|---|---|---|
| `320px` (Mobile S) | Single track (`Track 1` active, `Track 2` hidden) | `320 / 320` (0 overflow) | `0 / 6` | `0` | PASS |
| `360px` (Mobile M) | Single track (`Track 1` active, `Track 2` hidden) | `360 / 360` (0 overflow) | `0 / 6` | `0` | PASS |
| `390px` (Mobile L) | Single track (`Track 1` active, `Track 2` hidden) | `390 / 390` (0 overflow) | `0 / 6` | `0` | PASS |
| `430px` (Mobile XL) | Single track (`Track 1` active, `Track 2` hidden) | `430 / 430` (0 overflow) | `0 / 6` | `0` | PASS |
| `768px` (Tablet) | Dual opposing tracks (`Track 1` + `Track 2`) | `768 / 768` (0 overflow) | `0 / 12` | `0` | PASS |
| `1024px` (Laptop) | Dual opposing tracks (`Track 1` + `Track 2`) | `1024 / 1024` (0 overflow) | `0 / 12` | `0` | PASS |
| `1280px` (Desktop) | 2-column split + 3 inline CTAs + dual tracks | `1280 / 1280` (0 overflow) | `0 / 12` | `0` | PASS |
| `1366px` (Desktop) | 2-column split + 3 inline CTAs + dual tracks | `1366 / 1366` (0 overflow) | `0 / 12` | `0` | PASS |
| `1440px` (Desktop) | 2-column split + 3 inline CTAs + dual tracks | `1440 / 1440` (0 overflow) | `0 / 12` | `0` | PASS |
| `1920px` (Desktop XL) | 2-column split + 3 inline CTAs + dual tracks | `1920 / 1920` (0 overflow) | `0 / 12` | `0` | PASS |

---

## 2. Iterative Fix & Visual Screenshot Audit Log

1. **Initial Run Issue Caught:** Non-priority `<Image>` elements in off-screen horizontal marquee slots remained lazy-loaded until entering the viewport (`broken=2/6` on mobile, `5/12` on desktop). **Fix:** Added `loading="eager"` and `decoding="async"` in `HeroPhotoGallery.tsx`.
2. **Visual Screenshot Inspection Fixes:**
   - Tightened mobile hero top/bottom padding (`pt-8 pb-12 sm:pt-14 sm:pb-16`) so the photography gallery appears sooner on `320px–430px` screens.
   - Adjusted CTA button horizontal padding so all three primary CTAs sit harmoniously on one row at `1280px` and `1440px` without wrapping onto two rows.
   - Re-verified rendered screenshots at `320px`, `360px`, `768px`, `1280px`, `1440px`, and `1440px` reduced motion (`0` console errors, `0` HTTP `>=400` errors).
