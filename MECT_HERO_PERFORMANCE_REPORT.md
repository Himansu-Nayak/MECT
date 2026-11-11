# MECT Hero Performance & Regression Report (Final)

**Date:** 2026-11-11

---

## 1. Image Payload & Rendering Performance
- All 5 hero `.webp` assets were cropped cleanly from high-resolution masters (`1600px–5786px`) and encoded via `sharp` (`quality: 84`, `effort: 6`, `withoutEnlargement: true`):
  - `mect-legal-literacy-session.webp`: `1920 x 1050` (`104 KB`)
  - `mect-women-empowerment-seminar.webp`: `1920 x 1080` (`257 KB`)
  - `mect-clean-water-hygiene-demo.webp`: `1600 x 920` (`264 KB`)
  - `illustrative-women-self-help-group.webp`: `1920 x 913` (`277 KB`)
  - `illustrative-community-library-reading.webp`: `1920 x 889` (`312 KB`)
- Served via `next/image` with AVIF/WebP negotiation and responsive `sizes`. Both halves of the infinite marquee share identical URLs so each of the 5 images is downloaded at most once.
- **Observed CLS:** `0` across all 10 viewports (`320px–1920px`).
- **Remaining Tool Limitation:** Standalone `lighthouse` CLI was not installed in the local PATH (`Get-Command lighthouse` empty), so numeric Lighthouse scores were not claimed or fabricated; runtime layout/CLS/image/HTTP checks were measured directly in headless Edge via Playwright.

---

## 2. Build & Check Summary (Latest Run)
1. `npx tsc --noEmit`: Passed (`0` errors)
2. `npm run lint` (`eslint .`): Passed (`0` errors)
3. `npm run build` (`next build --webpack`): Compiled in `12.2s`, TypeScript check `6.9s`, `37/37` static routes + dynamic routes built cleanly.
4. `node scratch/verify-hero-bg-qa.mjs`: `10/10` viewports passed, `4/4` CTA/governance route requests `HTTP 200`, `0/10` broken images, `CLS = 0`, `0` console/network errors.
