# MECT PHASE 21.5.1 — INSTITUTIONAL INTRODUCTION & EDITORIAL STORYTELLING REPORT
## Principal Creative & UI/UX Engineering Acceptance Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Current Branch:** `feat/phase-21-1-design-system`  
**Execution Phase:** Phase 21.5.1 (Subphase of 21.5 — Complete Homepage Experience)  
**Target:** Institutional Introduction & Documentary Storytelling  
**Status:** ACCEPTED & FULLY VERIFIED (10/10 Viewports, 0 Errors, 0px Overflow)  

---

## 1. Executive Summary

Phase 21.5.1 delivers an institutional editorial introduction immediately following the Phase 21.4 Cinematic Hero and intervening statutory ticker. The section establishes Mahaveer Educational & Charitable Trust's foundational credibility as a registered public charitable trust in Odisha (Trust Deed No. 40311302194, 2013).

Rejecting generic NGO cards and marketing tropes, this section combines:
- **Editorial Asymmetry:** A balanced 12-column layout (7 columns of narrative, principles, and vision/mission; 5 columns of archival documentary photography and statutory accreditation).
- **Authentic Documentary Photography:** Integrates `/images/hero/mect-trustees-campus-walk.webp` showing founding trustees and community participants in Balangir with an archival pill badge and gradient veil.
- **Statutory Transparency:** Highlights the Trust Deed number, Income Tax 12A URN (`AADTM5474FE20231`), 80G URN (`AADTM5474FF20241`), and CSR Registration (`CSR00081063`) with non-remunerative board governance (Clause XVI).
- **Responsive & Motion Resilience:** 10 responsive breakpoints tested via automated Playwright test suite with 0px horizontal overflow, full reduced-motion support, and instant font/image rendering.

---

## 2. Narrative & Creative Direction

Inspired by the tactile warmth, restrained rhythm, and institutional weight of Agrumea Farm, the visual treatment eschews saturated charity banners in favor of:
1. **Cream/Sand Canvas:** `bg-cream/45` background with subtle parchment ambient light rings (`radial-gradient`), transitioning seamlessly from the preceding statutory ticker without visual jarring.
2. **Institutional Eyebrow:** `Landmark` icon badge with `Founded 2013 • Balangir, Odisha` in uppercase tracked sans-serif (`text-terracotta-dark`).
3. **Balanced Serif Heading:** Lora serif H2 (`text-[clamp(1.85rem,4.4vw,2.75rem)] font-bold text-forest`) with balanced text wrapping (`[text-wrap:balance]`).
4. **Fiduciary Principles:** 4 distinct operational principles styled with monospace indices (`01`, `02`, `03`, `04`) on elevated white surfaces (`bg-white/85 border border-border-warm shadow-2xs`).
5. **Vision & Operational Mission Cards:** Dual editorial cards accented with terracotta and forest border-left tabs, clearly separating future aspirations from day-to-day community operations.

---

## 3. Component Architecture & Implementation

### 3.1 Component Location: `src/components/sections/InstitutionalIntroSection.tsx`
- **Root Element:** `<section id="about-mect" aria-labelledby="institutional-intro-title" className="...">`
- **Container:** Wrapped in `<Container size="default">` enforcing max-width constraints.
- **Editorial Columns:**
  - Left Column (`lg:col-span-7`):
    - Eyebrow badge + H2 serif title + summary paragraph.
    - Foundational Operating Principles list (4 cards with monospace numerical tags).
    - Institutional Vision (`Compass` icon) and Operational Mission (`ShieldCheck` icon) cards.
    - CTAs: Primary button (`/about`) and secondary button (`/governance`).
  - Right Column (`lg:col-span-5`):
    - Archival documentary photograph (`mect-trustees-campus-walk.webp`) with hover micro-scale (`1.02`), location pin badge (`Founding Trustees & Community Walk • Balangir`), and year tag (`Trust Deed 2013`).
    - Authoritative Statutory Registration card displaying Trust Deed, 12A URN, 80G URN, CSR Registration, Clause XVI clause mention, and direct link to `/statutory-disclosures`.

### 3.2 Integration in `src/app/page.tsx`
- Replaced the plain legacy about section with `<InstitutionalIntroSection />`.
- Preserves the intervening `<InstitutionalMarquee />` and `<section data-statutory-strip="true">` without breaking layout or DOM structure.

---

## 4. Documentary Photography & Visual Integration

| Property | Value |
|---|---|
| **Asset Path** | `/images/hero/mect-trustees-campus-walk.webp` |
| **Dimensions** | 1460 × 725 px (308 KB WebP) |
| **Depiction** | Founding trustees and community participants walking together outdoors in Balangir |
| **Aspect Ratio** | `aspect-[16/10]` (mobile/tablet) to `aspect-[16/11]` (desktop) |
| **Object Fit / Position** | `object-cover object-[50%_18%]` ensuring facial clarity and context |
| **Archival Tag** | Archival translucent pill: `Founding Trustees & Community Walk • Balangir` |
| **Sizes Prop** | `(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 40vw` |

---

## 5. Fiduciary Principles & Statutory Disclosures

All presented data reflects authenticated trust governance records:
- **Trust Deed (2013):** Document No. `40311302194`
- **Income Tax 12A URN:** `AADTM5474FE20231` (Perpetual Tax Exemption)
- **Income Tax 80G URN:** `AADTM5474FF20241` (50% Donor Tax Deduction)
- **CSR Registration:** `CSR00081063` (Ministry of Corporate Affairs)
- **Governance Constraint:** Honorary, non-remunerative Board of Trustees under Trust Deed Clause XVI.

---

## 6. Typography Hierarchy & Responsive Fluid Scaling

| Element | Font Family | Size (Fluid Clamp) | Weight | Color |
|---|---|---|---|---|
| **Eyebrow** | Plus Jakarta Sans | `11px - 12px` (uppercase, `tracking-[0.12em]`) | SemiBold (600) | `text-terracotta-dark` |
| **H2 Section Title** | Lora Serif | `clamp(1.85rem, 4.4vw, 2.75rem)` | Bold (700) | `text-forest` |
| **Intro Summary** | Plus Jakarta Sans | `15px - 18px` (`text-[15px] sm:text-base md:text-lg`) | Regular (400) | `text-ink` |
| **Section Eyebrow H3** | Plus Jakarta Sans | `12px` (uppercase, `tracking-[0.14em]`) | Bold (700) | `text-forest` |
| **Principle Number** | JetBrains Mono | `12px` | Bold (700) | `text-terracotta-dark` |
| **Principle Body** | Plus Jakarta Sans | `12px - 14px` (`text-xs sm:text-sm`) | Regular (400) | `text-ink` |
| **Vision/Mission Header** | Plus Jakarta Sans | `11px` (uppercase, `tracking-wider`) | Bold (700) | `text-terracotta-dark` / `text-forest` |
| **Accreditation Number** | Plus Jakarta Sans | `12px` | SemiBold (600) | `text-forest` |

---

## 7. Interaction, Motion & Reduced Motion Behaviour

- **Motion Component:** `<Reveal direction="up" delay={...}>` with Framer Motion.
- **Scroll Triggers:** `once: true`, `margin: "-40px"` viewport trigger ensuring animations fire smoothly once visible and do not re-trigger erratically on subsequent scroll events.
- **Reduced Motion Support:** When `prefers-reduced-motion: reduce` is enabled:
  - Opacity is locked to `1` immediately.
  - Transforms (`y: 20 -> 0`) are bypassed (`transition: { duration: 0 }`).
  - Playwright automated verification confirmed `h2Opacity = "1"` and `imgOpacity = "1"`.

---

## 8. Multi-Viewport Automated Playwright Verification Matrix (10 Viewports)

The automated test script `scripts/intro-qa-phase21-5-1.mjs` executed against the Next.js production build (`http://localhost:3280`). Results recorded in `reports/intro-phase21-5-1-results.json`:

| Viewport | Dimensions | Overflow Px | Section Present | H2 Visible | H2 Font Size | Image Loaded | Principles | Accreditations | Errors | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| **320px** | 320 × 640 | **0px** | Yes | Yes | 29.6px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **360px** | 360 × 740 | **0px** | Yes | Yes | 29.6px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **390px** | 390 × 844 | **0px** | Yes | Yes | 29.6px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **430px** | 430 × 932 | **0px** | Yes | Yes | 29.6px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **768px** | 768 × 1024 | **0px** | Yes | Yes | 33.79px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **1024px** | 1024 × 768 | **0px** | Yes | Yes | 44.0px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **1280px** | 1280 × 800 | **0px** | Yes | Yes | 44.0px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **1440px** | 1440 × 900 | **0px** | Yes | Yes | 44.0px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **1920px** | 1920 × 1080 | **0px** | Yes | Yes | 44.0px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |
| **Landscape 844px** | 844 × 390 | **0px** | Yes | Yes | 37.14px | Yes (1460×725) | 4 | Verified | 0 | **PASS** |

---

## 9. CTA Routing & User Journey Analysis

All CTA buttons inside `<InstitutionalIntroSection />` were automatedly audited for route destination and accessible naming:
1. **"Read Full Institutional Charter"** → `/about` (Navigates to comprehensive institutional history and leadership charter).
2. **"Trust Deed & Governance"** → `/governance` (Navigates to trustee bios, board oversight policies, and bylaws).
3. **"View All Disclosures"** → `/statutory-disclosures` (Direct link to certified compliance scans, 80G/12A certificates, and annual accounts).

---

## 10. Performance, Asset Optimization & Layout Stability

- **CLS Mitigation:** Image dimensions are constrained by aspect ratio wrapper (`aspect-[16/10]` / `aspect-[16/11]`) with `fill` mode and Next.js responsive `sizes` prop.
- **Zero Horizontal Overflow:** All 10 tested viewports registered exactly `0px` scrollWidth overflow.
- **Lazy Loading:** `loading="lazy"` specified on documentary image since it sits below the fold (below the hero and ticker), freeing initial bandwidth for hero LCP.

---

## 11. Accessibility & Standards Compliance (WCAG 2.1 AA)

- **Semantic Landmark:** `<section id="about-mect" aria-labelledby="institutional-intro-title">` provides clear navigational hierarchy for screen readers.
- **Heading Level:** H2 (`id="institutional-intro-title"`) sits directly below the Hero's H1 in the outline without skipping levels.
- **Color Contrast:**
  - `text-forest` (`#1F3A2E`) on `bg-cream/45`: Contrast ratio > 11.2:1 (exceeds 4.5:1 requirement).
  - `text-terracotta-dark` (`#8B4228`) on sand/white badges: Contrast ratio > 5.4:1.
  - `text-ink` (`#24201D`) on white cards: Contrast ratio > 13.5:1.
- **Decorative Elements:** All decorative icons (`Landmark`, `ShieldCheck`, `Compass`, `MapPin`, `ArrowRight`) have `aria-hidden="true"`.
- **Keyboard Navigation:** All CTAs are native semantic anchors wrapped in accessible button elements with visible focus rings.

---

## 12. Repository Integrity & Uncommitted Code Preservation

- **Git Branch:** `feat/phase-21-1-design-system`
- **Preserved Backend Files:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java` (Preserved intact)
  - `backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java` (Preserved intact)
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java` (Preserved intact)
  - `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql` (Preserved intact)
- **Zero Destructive Actions:** No `git reset`, `git checkout`, or `git clean` commands were invoked.

---

## 13. Technical Quality Gates

- **`npm run typecheck`:** PASSED (0 errors).
- **`npm run lint`:** PASSED (0 errors, 4 baseline chart warnings preserved).
- **`npm run build`:** PASSED (0 errors, all 40 static routes compiled).

---

## 14. Screenshots & Evidence Artifacts

Generated and verified in `reports/screenshots/phase21_5_1/`:
- [intro_320px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_320px.png)
- [intro_360px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_360px.png)
- [intro_390px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_390px.png)
- [intro_430px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_430px.png)
- [intro_768px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_768px.png)
- [intro_1024px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_1024px.png)
- [intro_1280px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_1280px.png)
- [intro_1440px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_1440px.png)
- [intro_1920px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_1920px.png)
- [intro_landscape_844px.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_landscape_844px.png)
- [intro_reduced_motion.png](file:///<WORKSPACE_DIR>/reports/screenshots/phase21_5_1/intro_reduced_motion.png)
- [intro-phase21-5-1-results.json](file:///<WORKSPACE_DIR>/reports/intro-phase21-5-1-results.json)

---

## 15. Scope Boundary Adherence

- Strictly limited to **Phase 21.5.1** (`InstitutionalIntroSection`).
- Did not touch subsequent sections:
  - Pillars & Programme Discovery (Phase 21.5.2) — **UNTROUCHED**
  - Institutional Impact & Metrics Counter (Phase 21.5.3) — **UNTOUCHED**
  - Geographic Reach & Regional Presence (Phase 21.5.4) — **UNTOUCHED**
  - Beneficiary Voices & Testimonials (Phase 21.5.5) — **UNTOUCHED**
  - Statutory Disclosures & Fiduciary CTA (Phase 21.5.6) — **UNTOUCHED**
- No unrelated pages or backend files modified.

---

## 16. Next Subphase Readiness (Phase 21.5.2)

The introduction section provides a clean visual exit with a warm border-b separator. Phase 21.5.2 (Pillars & Programme Discovery) can now naturally anchor below it to guide visitors from institutional governance directly into MECT's four charitable focus areas:
1. Legal Aid & Tribal Rights
2. Women Empowerment & Self-Help
3. Rural Education & Digital Literacy
4. Healthcare & Disaster Relief

---

## 17. Engineering Acceptance Sign-Off

- **Architect:** Principal Frontend Architect & Senior Design Systems Engineer
- **Verification Status:** ACCEPTED
- **Quality Gates:** 100% Passed (Typecheck: 0 errors; Lint: 0 errors; Build: 0 errors; 10/10 Viewports Verified).
