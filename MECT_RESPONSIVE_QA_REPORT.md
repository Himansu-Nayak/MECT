# MECT Responsive, Accessibility & Cross-Viewport QA Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Verification Target:** `http://localhost:3000` (compiled `next build --webpack` served via `npm run start`)  
**QA Date:** 2026-11-10  

---

## 1. Automated Verification Summary

| Check Suite / Script | Scope | Result | Status |
|---|---|---|---|
| `npx tsc --noEmit` | Full TypeScript type check | Exit `0` (0 errors) | Passed |
| `npm run lint` | ESLint code quality & rules check | Exit `0` (0 errors) | Passed |
| `npm run build` | Production build (`next build --webpack`) | `32/32` routes compiled (`30 ○`, `2 ƒ`) | Passed |
| `node scratch/test-all-phases-regression.mjs` | Institutional phase regression tests | `16 Passed, 0 Failed (16 Suites)` | Passed |
| `node scratch/audit-contrast-and-sections.mjs` | Live DOM WCAG contrast & section count across 10 routes | `lowContrast=0` across all 10 routes | Passed |
| `node scratch/verify-live-browser.mjs` | Playwright live browser QA (viewports, interactions, errors) | `9/9` viewports, `2/2` interactions, `20/20` routes, `0` errors | Passed |

---

## 2. WCAG Contrast & Section Coverage (`audit-contrast-and-sections.mjs`)

Every audited route reported **`lowContrast=0`** after ensuring small text (`< 14px`) over `#52796F` uses pure `#FFFFFF` rather than `#EAF0EC` (which measures `4.20:1` vs `#FFFFFF` meeting `>= 4.5:1`):

| Route | Audited Sections | Low-Contrast Violations |
|---|---|---|
| `/` | 20 | `0` |
| `/about` | 8 | `0` |
| `/governance` | 8 | `0` |
| `/programmes` | 6 | `0` |
| `/impact` | 5 | `0` |
| `/donate` | 6 | `0` |
| `/csr-partnerships` | 6 | `0` |
| `/statutory-disclosures` | 7 | `0` |
| `/reports` | 5 | `0` |
| `/contact` | 5 | `0` |

---

## 3. Multi-Viewport Layout & Interaction QA (`verify-live-browser.mjs`)

### 3.1 Homepage Viewport Sweep (`9/9` Passed)
Tested at `320px`, `375px`, `390px`, `430px`, `768px`, `1024px`, `1280px`, `1440px`, and `1920px`:
- Horizontal overflow check: `scrollW === innerW` on all 9 viewports (`0` horizontal overflow).
- Image integrity check: `imgs=4 (broken=0)` across tested homepage breakpoints.

### 3.2 Route Matrix Sweep (`20/20` Passed)
- Audited core public routes at both desktop (`1280px`) and mobile (`375px`) with zero layout regressions.
- Console errors and uncaught page errors: **`0`**.
- Content safety assertions verified on live DOM: `!hasRemovedTrustees`, `!hasUnionBank`, `!hasMcaText`.

### 3.3 Interactive Controls (`2/2` Passed)
1. **CSR Registration Certificate Modal ([CsrRegistrationSection.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/CsrRegistrationSection.tsx)):** Verified modal open/close and interactive `ZoomIn`/`ZoomOut` actual-size (`100%`) toggle.
2. **Section 202 / Income Tax Estimator Interactive Toggle:** Verified interactive toggle responsiveness without errors.

---

## 4. Visual Screenshot Inspection Archive

Refreshed desktop and mobile screenshots were visually inspected in `public/images/audit/`:
- **Desktop (`1440px`):** `final-hero-desktop-1440.png`, `final-overview-1440.png`, `final-free-edu-1440.png`, `final-fundraising-1440.png`, `final-csr-1440.png`, `final-sbi-1440.png`, `final-footer-1440.png`.
- **Mobile (`375px` & `320px`):** `final-hero-mobile-375.png`, `final-hero-mobile-320.png`, `final-sbi-mobile-375.png`, `final-sbi-mobile-320.png`.

All inspected captures confirm Sage Green palette consistency (`#52796F`, `#344F46`, `#EAF0EC`, `#F5F7FA`, `#FFFFFF`, `#D5A36A`), clear typographic hierarchy, preserved MECT emblem proportions, and zero clipped text on narrow `320px` viewports.

---

## 5. Pending / Deferred Checks

- **Lighthouse Performance / Best Practices / Accessibility Audit:** Not executed in this local pass (run against live staging/production URL).
- **Backend Integration Suite (`backend/` / `mvn test`):** Untouched and not run in this frontend QA pass.

