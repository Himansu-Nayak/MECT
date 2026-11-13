# MECT — Live Production Release Report

**Date:** 2026-11-11  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Previous Live Production Commit:** `064126323d1d0e9d55e685003b3e129eacee8f21`  
**Deployed Commit SHA:** `989e0da0344d3e1ffded971edbdfb6a2633d624f` (`0641263..989e0da`)  
**Release Status:** **DEPLOYED LIVE & VERIFIED ON `https://mect.org.in/` (Owner Approved Prior to Push/Cutover)**

---

## 1. GitHub Commit & Push

- **Repository Remote:** `https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git` (redirects to `Himansu-Nayak/MECT.git`)
- **Commit Scope (`22` MECT files staged selectively, secret scan clean):**
  - Differentiated motion tokens & primitives: `src/components/ui/MotionPrimitives.tsx`
  - UI & route refinements: `src/components/Header.tsx`, `src/components/PageHero.tsx`, `src/components/Footer.tsx`, `src/components/ui/Button.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/impact/page.tsx`, `src/app/donate/page.tsx`
  - Section & QR updates: `src/lib/config.ts`, `src/components/sections/SbiDonationSection.tsx`, `src/components/sections/SmartDonationCheckout.tsx`, `src/components/sections/FreeEducationSection.tsx`, `src/components/sections/SmileFundraisingSection.tsx`, `src/components/sections/CsrRegistrationSection.tsx`, `src/components/sections/HeroBackgroundMarquee.tsx`, `public/images/mect-sbi-upi-qr.png`
  - Reports & QA script: `MECT_COMPLETE_VISUAL_AUDIT.md`, `MECT_MOTION_DESIGN_SYSTEM.md`, `MECT_RESPONSIVE_QA_REPORT.md`, `scratch/verify-complete-release.mjs`
- **Remote Synchronization:** Fast-forward pushed without force-push; `git rev-parse HEAD` === `git ls-remote origin refs/heads/feat/multi-sector-ngo-repositioning` (`989e0da0344d3e1ffded971edbdfb6a2633d624f`).

---

## 2. Hostinger VPS Cutover (`200.97.161.128` / `srv2000528`)

- **Pre-Deploy Frontend Backup:** `/opt/mect/backups/mect_frontend_0641263_20261111_124553.tar.gz` (`92M`, `chmod 600`, `mect:mect`)
- **Deployed Directory (`/opt/mect/frontend`):** `989e0da0344d3e1ffded971edbdfb6a2633d624f` (fast-forward pulled & built cleanly via `npm run build` on Next.js `16.4.3`, `37/37` static routes + dynamic routes compiled in `9.8s`)
- **Process & Service Isolation:**
  - `mect_frontend` (PM2 `id: 1`): restarted cleanly (`PID 368450`, `online`, `MECT_ROOT=200`, `MECT_DONATE=200`)
  - `mect-backend.service`: `active` (`MECT_API=200`, untouched, no DB migration or restart needed)
  - `nginx`: `active` (untouched)
  - `oho_tech` (PM2 `id: 0`, `PID 200322`): completely untouched (`uptime: 10D`, `OHO_TECH=200`, live `https://ohotechn.com/` = `HTTP 200`)

---

## 3. Live Production Verification (`https://mect.org.in/` via `scratch/verify-live-final.mjs`)

| Check | Result |
|---|---|
| `https://mect.org.in/` (`390 x 844` Mobile) | **PASS** (`http=200`, `scroll=390/390`, `dx=+80.8px`, `imgs=0/2`, `drawer=true`, `cls=0`, `errs=0`) |
| `https://mect.org.in/` (`1440 x 900` Desktop) | **PASS** (`http=200`, `scroll=1440/1440`, `dx=+158.7px`, `imgs=0/3`, `cls=0`, `errs=0`) |
| `https://mect.org.in/donate#donate-sbi` (`390 x 844`) | **PASS** (`http=200`, `scroll=390/390`, `qrLoaded=true`, `qrStationary=true`, `hasUpi=true`, `copyToast=true`, `hasDownload=true`, `errs=0`) |
| `https://mect.org.in/donate#donate-sbi` (`1440 x 900`) | **PASS** (`http=200`, `scroll=1440/1440`, `qrLoaded=true`, `qrStationary=true`, `hasUpi=true`, `copyToast=true`, `hasDownload=true`, `errs=0`) |
| Subroutes (`/about`, `/programmes`) | **PASS** (`HTTP 200`) |
| Co-hosted `https://ohotechn.com/` | **PASS** (`HTTP 200`, unaffected) |
| Live Visual Screenshots Inspected | `scratch/live-final-qa/live-mobile-390.png`, `live-desktop-1440.png`, `live-donate-qr-390.png`, `live-donate-qr-1440.png` |
