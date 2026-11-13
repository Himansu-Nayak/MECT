# MECT Hero Production Release Report

**Date:** 2026-11-11  
**Live URL:** `https://mect.org.in/`  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Previous Production Commit:** `c0d4a8adbc3317fc0bc20d7ff1905a797a5d156b`  
**New Release Commit SHA:** `679b38a561a10a8c0499c74ed72a496dd246a086`

---

## 1. Stage Status Distinction
- **Locally Verified:** **PASS** — TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), production build (`next build --webpack`, `37/37` static routes + dynamic routes), 10-viewport Playwright + screenshot QA (`node scratch/verify-hero-bg-qa.mjs`), secret scan of `git diff --cached`.
- **Pushed to GitHub:** **PASS** — Fast-forward pushed `c0d4a8a..679b38a` to `origin feat/multi-sector-ngo-repositioning` (`git rev-parse HEAD` === `git ls-remote origin refs/heads/feat/multi-sector-ngo-repositioning` = `679b38a561a10a8c0499c74ed72a496dd246a086`).
- **Deployed to VPS:** **PASS** — `/opt/mect/frontend` checked out `679b38a561a10a8c0499c74ed72a496dd246a086`, built cleanly with `npm run build` as `mect`, restarted ONLY `mect_frontend` PM2 (`id: 1`, `PID 365380`), confirmed `HTTP 200` on `127.0.0.1:3001/`.
- **Verified on Live Website (`https://mect.org.in/`):** **PASS** — Headless Edge verification passed across `390px`, `768px`, `1024px`, `1440px`, and `1920px` with live screenshots visually inspected; OHO TECH verified isolated and unaffected.

---

## 2. Files Changed in Commit `679b38a` (17 Files)
- **Modified:**
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/components/Footer.tsx`
- **Added:**
  - `src/components/sections/HeroBackgroundMarquee.tsx`
  - `public/images/hero/illustrative-women-self-help-group.webp`
  - `public/images/hero/mect-legal-literacy-session.webp`
  - `public/images/hero/illustrative-community-library-reading.webp`
  - `public/images/hero/mect-women-empowerment-seminar.webp`
  - `public/images/hero/mect-clean-water-hygiene-demo.webp`
  - `scratch/verify-hero-bg-qa.mjs`
  - `MECT_HERO_VISUAL_AUDIT.md`, `MECT_HERO_IMAGE_ASSET_REGISTER.md`, `MECT_HERO_ANIMATION_IMPLEMENTATION.md`, `MECT_HERO_RESPONSIVE_QA.md`, `MECT_HERO_PERFORMANCE_REPORT.md`, `MECT_HERO_FINAL_IMPLEMENTATION_REPORT.md`
- **Deleted:**
  - `src/components/sections/HeroPhotoGallery.tsx` (replaced by `HeroBackgroundMarquee.tsx`)

---

## 3. Image Assets Deployed & Licence/Attribution Status
| Asset | Classification | Dimensions & VPS Size | Attribution & Licence |
|---|---|---|---|
| `illustrative-women-self-help-group.webp` | Illustrative Stock Photography | `1920 x 913` (`277K`) | Ganesh Dhamodkar — CC BY 4.0 (Wikimedia Commons); credited & linked in live `Footer.tsx` |
| `mect-legal-literacy-session.webp` | Actual MECT Photograph | `1920 x 1050` (`104K`) | MECT Balangir Archive |
| `illustrative-community-library-reading.webp` | Illustrative Stock Photography | `1920 x 889` (`312K`) | Sumitsurai — CC BY-SA 4.0 (Wikimedia Commons); credited & linked in live `Footer.tsx` |
| `mect-women-empowerment-seminar.webp` | Actual MECT Photograph | `1920 x 1080` (`258K`) | MECT Balangir Archive |
| `mect-clean-water-hygiene-demo.webp` | Actual MECT Photograph | `1600 x 920` (`264K`) | MECT Balangir Archive |

All 5 assets contain zero watermarks, zero private donor data, and clear commercial-web licence rights.

---

## 4. Local & Production Build Verification
- `npx tsc --noEmit`: `0` errors
- `npm run lint` (`eslint .`): `0` errors
- Local `npm run build`: `37/37` static routes + dynamic AI routes compiled (`15.4s`)
- VPS `npm run build`: `37/37` static routes + dynamic AI routes compiled (`26.9s`)

---

## 5. VPS Deployment Details (`200.97.161.128`)
- **Application Directory:** `/opt/mect/frontend` (owned by `mect:mect`)
- **Frontend Process:** PM2 `mect_frontend` (`id: 1`, `PID 365380`, `restarts: 8`, `status: online`, upstream `127.0.0.1:3001`)
- **Backend Service:** `mect-backend.service` remained `active` on `127.0.0.1:8081` (context path `/api/v1`) — **NOT rebuilt or restarted**
- **Nginx Config:** `/etc/nginx/sites-available/mect.org.in` untouched; `nginx -t` syntax ok / test successful
- **Backup Created:** `/opt/mect/backups/mect_frontend_c0d4a8a_20261111_094321.tar.gz` (`29M`, `chmod 600`, `mect:mect`)
  - Includes previous `.next`, `src`, `public`, `package.json`, and `next.config.ts`.
  - Pre-existing backend JAR (`/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar`) and `mect_db` backups in `/opt/mect/backups/` preserved untouched.

---

## 6. Live Production URL, Responsive & Performance Results (`https://mect.org.in/`)
- **Live Route Status:**
  - `https://mect.org.in/` -> `HTTP 200`
  - `/programmes` -> `HTTP 200`
  - `/donate` -> `HTTP 200`
  - `/csr-partnerships` -> `HTTP 200`
  - `/governance` -> `HTTP 200`
- **Live 5-Viewport Playwright Check (`node scratch/verify-live-hero.mjs`):**
  - `390px`: `scroll=390/390`, `dx=+33.8px/s` (`LTR=true`), `0/10` broken images, `attr=true`, `cls=0` (**PASS**)
  - `768px`: `scroll=768/768`, `dx=+62.8px/s` (`LTR=true`), `0/10` broken images, `attr=true`, `cls=0` (**PASS**)
  - `1024px`: `scroll=1024/1024`, `dx=+73.7px/s` (`LTR=true`), `0/10` broken images, `attr=true`, `cls=0` (**PASS**)
  - `1440px`: `scroll=1440/1440`, `dx=+96.0px/s` (`LTR=true`), `0/10` broken images, `attr=true`, `cls=0` (**PASS**)
  - `1920px`: `scroll=1920/1920`, `dx=+132.2px/s` (`LTR=true`), `0/10` broken images, `attr=true`, `cls=0` (**PASS**)
- **Interactive Controls & Semantics:** `Pause Backdrop` button set `animationPlayState=paused` & `aria-pressed="true"`; `prefers-reduced-motion: reduce` disabled marquee transforms & hid cloned sequence (`display: none`); `0` console errors; `0` HTTP `>=400` errors; all 5 live screenshots inspected cleanly.
- **Live Performance Measurements (`1440x900` via Playwright PerformanceObserver):**
  - `TTFB`: `750 ms`
  - `DOMContentLoaded`: `1931 ms`
  - `Load`: `2192 ms`
  - `LCP`: `2360 ms`
  - `CLS`: `0`
  - Transferred image payload on load (`_next/image`): `220 KB` across `7` requests.
- **Limitation:** Standalone `lighthouse` CLI was unavailable on local PATH (`Get-Command lighthouse` empty), so numeric Lighthouse category scores (0–100) could not be generated.

---

## 7. OHO TECH Isolation Verification (`PASS`)
- PM2 `oho_tech` (`id: 0`, `PID 200322`, `uptime: 10D`, `restarts: 8`) remained completely untouched.
- `https://ohotechn.com` returned `HTTP 200`.
- `https://api.ohotechn.com/api/v1/auth/login` (`POST {}`) returned `HTTP 401`.

---

## 8. Rollback Procedure
If an emergency rollback to `c0d4a8a` is ever needed:
```bash
ssh root@200.97.161.128 '
  set -e
  tar -xzf /opt/mect/backups/mect_frontend_c0d4a8a_20261111_094321.tar.gz -C /opt/mect
  chown -R mect:mect /opt/mect/frontend
  pm2 restart mect_frontend
'
```
Or via Git:
```bash
sudo -u mect git -C /opt/mect/frontend checkout c0d4a8adbc3317fc0bc20d7ff1905a797a5d156b
```
(paired with extracting the `.next` artifact from the backup tarball and running `pm2 restart mect_frontend`).

