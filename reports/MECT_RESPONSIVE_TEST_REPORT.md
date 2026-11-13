# MECT Responsive & Cross-Route QA Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Target Server:** `http://localhost:3000` (`next build --webpack` served via `npm run start`)  
**Verification Scripts:** `scratch/verify-live-browser.mjs` & `scratch/verify-all-routes-complete.mjs`  
**QA Date:** 2026-11-10

---

## 1. Homepage Multi-Viewport Responsive Sweep (Zero Horizontal Overflow)

Verified cleanly at both 9 legacy QA breakpoints (`320px`–`1920px`) and the 8 mandated breakpoints (`360px`, `390px`, `430px`, `768px`, `1024px`, `1366px`, `1440px`, `1920px`):

| Viewport Width | Result | `scrollWidth / innerWidth` | Broken Images | Notes |
|---|---|---|---|---|
| `320px` (Small mobile) | **PASS** | `320 / 320` | `0` | Mobile CTA & drawer intact |
| `360px` (Mobile) | **PASS** | `360 / 360` | `0` | Zero horizontal scroll |
| `375px` (Mobile) | **PASS** | `375 / 375` | `0` | Zero clipped hero or card copy |
| `390px` (Mobile) | **PASS** | `390 / 390` | `0` | Clean vertical stacking |
| `430px` (Large mobile) | **PASS** | `430 / 430` | `0` | Zero horizontal scroll |
| `768px` (Tablet) | **PASS** | `768 / 768` | `0` | 2-column grid balance verified |
| `1024px` (Laptop) | **PASS** | `1024 / 1024` | `0` | Desktop nav bar fits without wrap |
| `1280px` (Desktop) | **PASS** | `1280 / 1280` | `0` | Clean spacing & dock clearance |
| `1366px` (Desktop) | **PASS** | `1366 / 1366` | `0` | Verified all 19 routes |
| `1440px` (Desktop) | **PASS** | `1440 / 1440` | `0` | 5 footer columns aligned on 1 row |
| `1920px` (Wide Desktop) | **PASS** | `1920 / 1920` | `0` | Centered container proportions |

---

## 2. Complete 19-Route Responsive & Asset Check (`1366px` Desktop & `360px` Mobile + `1280px`/`375px`)

All **19** public & admin entry routes returned **HTTP 200**, **`overflow=false`**, **`brokenImgs=0`**, and **`lowContrast=0`**:
- `/`
- `/about`
- `/governance`
- `/statutory-disclosures`
- `/programmes`
- `/csr-partnerships`
- `/donate`
- `/impact`
- `/reports`
- `/contact`
- `/scholarships`
- `/scholarships/apply`
- `/scholarships/track`
- `/volunteer`
- `/faq`
- `/privacy`
- `/terms`
- `/accessibility`
- `/admin/login` (plus verified unauthenticated `/admin` redirect guard -> `/admin/login`)

---

## 3. Interactive Functional Verification Results

- **CSR Certificate Modal (`CsrRegistrationSection.tsx`):** Opens full PNG preview cleanly, toggles 100% actual size zoom (`ZoomIn`/`ZoomOut`), closes cleanly via Escape key or Close button.
- **Section 202 Tax Regime Estimator (`src/app/page.tsx`):** Correctly updates estimated deduction and offset values (`₹0` under Section 202 Simplified Regime).
- **FAQ Accordion (`Accordion.tsx`):** Expands items cleanly on click with updated `aria-expanded` attributes across all 24 `/faq` entries.
- **HIm AI Assistant (`HImChatbot.tsx`):** Dialog opens cleanly in the Terracotta & Forest Charcoal theme and closes via control button.
- **Console & Runtime Exceptions:** **`0` console errors and `0` page errors** recorded across the complete sweep.

