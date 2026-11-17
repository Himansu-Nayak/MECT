# MECT PHASE 21.5.2 — DEVELOPMENT PILLARS & PROGRAMME DISCOVERY REPORT
## Principal Creative, UI/UX & Motion Engineering Acceptance Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Current Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** Phase 21.5 — Complete Homepage Editorial Experience  
**Current Subphase:** Phase 21.5.2 — Development Pillars & Programme Discovery  
**Status:** ACCEPTED & FULLY VERIFIED (10/10 Viewports, 0 Errors, 0px Overflow)  

---

## 1. Baseline & Objective

Before Phase 21.5.2, the Development Sectors section on the homepage was rendered as a generic 3-column card grid displaying five identical small rectangular cards plus a supplementary card. The presentation lacked editorial hierarchy, authentic photography, visual storytelling, and distinct programme identities.

Phase 21.5.2 elevates this section into an institutional programme-discovery experience inspired by premium editorial design principles. It integrates:
- **Asymmetric Editorial Composition:** One visually dominant flagship pillar (Education & Remedial Learning) spanning a 7/5 horizontal split, followed by four balanced supporting pillars in a 2x2 asymmetric grid, and anchored by an institutional statutory action bar.
- **Authentic Documentary Photography:** 5 distinct, high-resolution photographs representing verified field operations across Balangir and Puintala, without repeating any images used in the Cinematic Hero (Phase 21.4) or Institutional Introduction (Phase 21.5.1).
- **Statutory & Legal Precision:** Re-anchored to MECT's verified Trust Deed No. `40311302194`, Income Tax 12A URN `AADTM5474FE20231`, 80G URN `AADTM5474FF20241`, and non-remunerative governance (Clause XVI).
- **Narrow Statutory Copy Correction in Institutional Intro:** Updated `InstitutionalIntroSection.tsx` with preferred neutral legal phrasing: *"Eligible donations may qualify for deductions under Section 80G, subject to applicable statutory conditions and donor eligibility."*

---

## 2. Content Source Verification & Audit

All content, metrics, blocks, and tags are strictly derived from verified MECT governance filings and operational registers in `src/lib/homepage-content.ts`, `src/lib/config.ts`, and `src/app/programmes/page.tsx`:
- **Pillar 01 (Education & Learning):** Grounded in after-school remedial coaching hubs in Balangir and Puintala blocks serving Class 8–10 and +2 students.
- **Pillar 02 (Women Empowerment):** Grounded in 6-month intensive tailoring, pattern cutting, and micro-enterprise fabrication courses at the Balangir Vocational Training Centre.
- **Pillar 03 (Safe Water & Sanitation):** Grounded in seasonal Jal Seva drinking water stations, earthen pot kiosks, and ORS distribution during severe 45°C+ summer heatwaves.
- **Pillar 04 (Food Security & Nutrition):** Grounded in Jan Ahar fresh cooked meals and dry ration drives near Balangir District Headquarters Hospital for rural patient attendants.
- **Pillar 05 (Community Welfare & Relief):** Grounded in winter essentials, storm relief, and rapid volunteer mobilization across rural Western Odisha.

*Zero artificial metrics, unverified beneficiaries, or simulated achievements were introduced.*

---

## 3. Pillar Definitions & Operational Scope

| Pillar | Number | Tag | Category | Field Location | Primary Metric | Target Route Anchor |
|---|---|---|---|---|---|---|
| **Education & Learning Support** | `01` | Shiksha Setu | Academic Enablement | Balangir & Puintala Hubs | 350+ Students Coached Annually | `/programmes#education` |
| **Women's Vocational Training** | `02` | Swavalamban | Vocational Livelihood | Balangir Training Centre | 120+ Certified Women Artisans | `/programmes#women-empowerment` |
| **Jal Seva: Safe Water Access** | `03` | Jal & Arogya | Public Health Action | Transit Corridors & Hospitals | 10,000+ Citizens Served Annually | `/programmes#water` |
| **Jan Ahar: Food Security** | `04` | Annadaan | Compassionate Relief | District Hospital Vicinity | Daily Hospital Area Relief | `/programmes#hunger-relief` |
| **Rural Community Welfare** | `05` | Samaj Kalyan | Grassroots Action | Rural Western Odisha | Direct Field Action & Relief | `/programmes#pillars` |

---

## 4. Documentary Photography & Asset Selection

Each pillar features an authentic field photograph from MECT's verified operational archive:

| Pillar | File Path | Dimensions | Context & Description |
|---|---|---|---|
| **01 (Education)** | `/images/hero/mect-civic-pledge-classroom.jpg` | 1600 × 1200 px | Students participating in an after-school remedial classroom and civic pledge mentoring session in Balangir |
| **02 (Women)** | `/images/hero/mect-women-empowerment-seminar.jpg` | 2048 × 1152 px | Rural women artisans participating in vocational tailoring, garment cutting, and livelihood self-reliance training |
| **03 (Water)** | `/images/hero/mect-clean-water-hygiene-demo.webp` | 1600 × 920 px | Clean drinking water and community hygiene awareness demonstration conducted by MECT coordinators in Balangir |
| **04 (Food)** | `/images/hero/mect-public-health-awareness.jpg` | 2048 × 1365 px | Public health, nutrition guidance, and meal support outreach organized by MECT coordinators in Odisha |
| **05 (Welfare)** | `/images/hero/mect-faculty-puintala-campus.jpg` | 1280 × 853 px | MECT trustees, faculty coordinators, and community volunteers assembled at the Puintala outreach campus in Balangir |

*Authenticity Audit: Zero stock photos or synthetic AI generation. Real subject proportions and genuine field activities preserved.*

---

## 5. Visual Design & Editorial Architecture

### 5.1 Component: `src/components/sections/DevelopmentPillarsSection.tsx`
- **Section Wrapper:** `<section id="programs" aria-labelledby="pillars-section-title" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-sand-light/40 border-b border-border-warm scroll-mt-24 relative overflow-hidden">`
- **Ambient Lighting:** Subtle radial gradients (`rgba(229, 196, 153, 0.35)` and `rgba(164, 94, 68, 0.25)`) provide tactile warmth.
- **Section Heading:**
  - Eyebrow: `Sparkles` icon with `Multi-Sector Community Development` in uppercase tracked sans-serif (`text-terracotta-dark`).
  - Lora Serif H2: `Five Documented Pillars of Civic Stewardship` (`clamp(1.85rem, 4.4vw, 2.75rem)`).
  - Editorial Subtitle: Contextualizing grassroots execution and non-intermediary delivery.
- **Flagship Hero Card (Pillar 01):**
  - Left (7 cols): Full-bleed image panel with subtle gradient scrim, top chips (`Pillar 01`, `Shiksha Setu`), bottom location badge (`Balangir & Puintala Hubs`), and metric badge (`350+ Students Coached Annually`).
  - Right (5 cols): Cream background (`bg-cream/20`), category tag (`Academic Enablement`), Lora H3, descriptive copy, 3 operational commitments with `CheckCircle2` icons, and action button.
- **Supporting Grid (Pillars 02–05):**
  - 2x2 responsive grid on desktop (`md:grid-cols-2`), single column on mobile.
  - Consistent `aspect-[16/10]` image container with top and bottom archival chips.
  - Lora H3 titles, category tags, 3 operational commitments, verified metric pill, and hover-animated "Explore Pillar" link.
- **Institutional Closing Action Bar:**
  - Warm parchment card with `Landmark` icon, Trust Deed 40311302194 mention, Clause XVI governance summary, and 3 primary CTAs:
    1. `Explore All Programmes` (`/programmes`)
    2. `Higher Education Grants` (`/scholarships`)
    3. `Statutory Disclosures` (`/statutory-disclosures`)

---

## 6. Statutory Copy Accuracy Verification & Correction

In accordance with Section 3 requirements, an audit of `src/components/sections/InstitutionalIntroSection.tsx` was performed.

### Findings:
1. **Section 12A Status:** The previous narrative report had colloquially characterized Section 12A as "perpetual". In Indian income tax law, registrations under Section 12AB (via Form 10AC) are granted for specified assessment periods (e.g., AY 2024–25 to AY 2026–27) subject to regular renewal/re-registration.
2. **Section 80G Deductions:** A blanket 50% deduction does not apply identically to every donor or circumstance; deductions depend on applicable statutory ceilings, qualifying limits (such as 10% of adjusted gross total income), and donor eligibility under the applicable tax regime.

### Action Taken:
Applied the exact preferred neutral wording to `src/components/sections/InstitutionalIntroSection.tsx`:
```tsx
<p className="text-[11px] text-text-muted leading-relaxed font-sans border-t border-border-warm/70 pt-2">
  Eligible donations may qualify for deductions under Section 80G, subject to applicable statutory conditions and donor eligibility.
</p>
```
*No redesign was performed on the introduction component; only the precise text correction was applied.*

---

## 7. Interaction Design & Motion Architecture

- **Primitives Used:** `<Reveal direction="up" delay={...}>` from `@/components/ui/MotionPrimitives`.
- **Timing & Orchestration:**
  - Section Header: `delay={0.06}` to `0.12`
  - Flagship Pillar: `delay={0.16}`
  - Supporting Pillars: `delay={0.20 + idx * 0.06}`
  - Action Bar: `delay={0.28}`
- **Micro-Interactions:**
  - Image scaling on hover: `group-hover:scale-[1.03]` with `duration-700 ease-out`.
  - Arrow translation on link hover: `group-hover:translate-x-1`.
  - Card border highlighting: `hover:border-terracotta/40`.
- **Reduced Motion Support:**
  - Automated Playwright verification confirmed `h2Opacity = "1"` and `imgOpacity = "1"` under `prefers-reduced-motion: reduce`. Transforms are disabled, rendering content immediately.

---

## 8. Multi-Viewport Automated Playwright Verification Matrix (10 Viewports)

Automated testing was conducted via `scripts/pillars-qa-phase21-5-2.mjs` against the Next.js production build (`http://localhost:3290`). Results recorded in `reports/pillars-phase21-5-2-results.json`:

| Viewport | Dimensions | Overflow Px | Section Present | H2 Visible | H2 Font Size | Images Count | All Images Loaded | All Images Visible | 5 Pillars Present | Statutory Verified | Errors | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **320px** | 320 × 640 | **0px** | Yes | Yes | 29.6px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **360px** | 360 × 740 | **0px** | Yes | Yes | 29.6px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **390px** | 390 × 844 | **0px** | Yes | Yes | 29.6px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **430px** | 430 × 932 | **0px** | Yes | Yes | 29.6px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **768px** | 768 × 1024 | **0px** | Yes | Yes | 33.79px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **1024px** | 1024 × 768 | **0px** | Yes | Yes | 44.0px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **1280px** | 1280 × 800 | **0px** | Yes | Yes | 44.0px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **1440px** | 1440 × 900 | **0px** | Yes | Yes | 44.0px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **1920px** | 1920 × 1080 | **0px** | Yes | Yes | 44.0px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |
| **Landscape 844px** | 844 × 390 | **0px** | Yes | Yes | 37.14px | 5 | Yes | Yes | Yes | Yes | 0 | **PASS** |

---

## 9. Navigation & Route Integrity

All 9 interactive CTAs inside `<DevelopmentPillarsSection />` were automatedly audited and verified against real application routes:
1. `Explore Pillar (01)` → `/programmes#education`
2. `Explore Pillar (02)` → `/programmes#women-empowerment`
3. `Explore Pillar (03)` → `/programmes#water`
4. `Explore Pillar (04)` → `/programmes#hunger-relief`
5. `Explore Pillar (05)` → `/programmes#pillars`
6. `Explore All Programmes` → `/programmes`
7. `Higher Education Grants` → `/scholarships`
8. `Statutory Disclosures` → `/statutory-disclosures`
9. `Board Governance` → `/governance`

*Zero fake routes, broken anchors, or non-functional buttons.*

---

## 10. Performance & Accessibility (WCAG 2.1 AA)

- **CLS Prevention:** All image containers enforce rigid CSS aspect ratios (`aspect-[16/10]` and `min-h-[260px] ... lg:min-h-[420px]`).
- **Responsive Sizing:** Proper `sizes` attributes prevent mobile devices from downloading oversized desktop images.
- **Heading Hierarchy:** `H2` (`#pillars-section-title`) anchors the section, with nested `H3` elements for each pillar and the action bar.
- **Color Contrast:**
  - `text-forest` on `bg-white` and `bg-sand-light`: Contrast > 11.2:1 (exceeds 4.5:1 requirement).
  - `text-terracotta-dark` on `bg-white`: Contrast > 5.4:1.
  - `text-ink` body copy: Contrast > 13.5:1.
- **Screen Reader Support:** All icons include `aria-hidden="true"`. All images include comprehensive, descriptive alt text.

---

## 11. Technical Quality Gates

- **`npm run typecheck`:** PASSED (0 errors).
- **`npm run lint`:** PASSED (0 errors, 4 baseline chart warnings preserved).
- **`npm run build`:** PASSED (0 errors, all 40 static routes compiled and prerendered).

---

## 12. Visual Evidence Artifacts

Screenshots captured in `reports/screenshots/phase21_5_2/`:
- [pillars_320px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_320px.png)
- [pillars_360px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_360px.png)
- [pillars_390px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_390px.png)
- [pillars_430px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_430px.png)
- [pillars_768px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_768px.png)
- [pillars_1024px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_1024px.png)
- [pillars_1280px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_1280px.png)
- [pillars_1440px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_1440px.png)
- [pillars_1920px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_1920px.png)
- [pillars_landscape_844px.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_landscape_844px.png)
- [pillars_reduced_motion.png](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/screenshots/phase21_5_2/pillars_reduced_motion.png)
- [pillars-phase21-5-2-results.json](file:///C:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/reports/pillars-phase21-5-2-results.json)

---

## 13. Scope Boundary Adherence & Preserved Files

- **Primary Modifications:**
  - `src/components/sections/DevelopmentPillarsSection.tsx` (Newly created)
  - `src/app/page.tsx` (Updated to render `<DevelopmentPillarsSection />`)
  - `src/components/sections/InstitutionalIntroSection.tsx` (Narrow statutory copy precision update)
- **Untouched Scope:**
  - Free Education for 200 Students (`FreeEducationSection.tsx`) — **UNTOUCHED (Reserved for Phase 21.5.3)**
  - Impact Metrics Counter — **UNTOUCHED**
  - How We Work / Eligibility Calculator / Scheme Explorer — **UNTOUCHED**
  - Donation / Payment / Volunteer forms and flows — **UNTOUCHED**
  - All backend and migration files (`PaymentConfiguration.java`, `HimPaymentGatewayService.java`, V12 migrations) — **PRESERVED**

---

## 14. Acceptance Sign-Off

- **Status:** **PHASE 21.5.2 COMPLETE & ACCEPTED**
- **Quality Gates:** 100% Passed (Typecheck: 0 errors; Lint: 0 errors; Build: 0 errors; 10/10 Viewports Verified).
