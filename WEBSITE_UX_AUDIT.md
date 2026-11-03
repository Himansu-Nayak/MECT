# MAHAVIR TRUST — Complete Website UX/UI Audit

**Document Reference**: `WEBSITE_UX_AUDIT.md`  
**Author**: Principal Product Designer, Senior Frontend Architect & UX Researcher  
**Target Environment**: Isolated Security Worktree (`.worktrees/security-patch`)  
**Git Branch**: `security/nextjs-patch-upgrade`  
**Date**: November 2, 2026  
**Audit Standard**: WCAG 2.2 Level AA, Institutional Best Practices (Benchmarked against RCM & Smile Foundation India)  

---

## Executive Summary

An exhaustive usability, visual design, technical architecture, and accessibility audit of the **MAHAVIR TRUST** website was conducted across all 12 public routes, 9 core components, the design token architecture, and backend integration points.

While the existing website establishes a solid foundation—employing an appropriate institutional color scheme (Forest Green `#072617`, Gold `#C5A059`, Warm Ivory `#FDFBF7`) and honoring statutory draft disclosures—it suffers from notable UX/UI deficiencies that limit its prestige, clarity, and conversion effectiveness as an institutional-grade educational foundation.

### Critical Audit Findings:
1. **Typography & Hierarchy**: Relying on generic system serif fonts (`Georgia, Cambria, serif`) produces inconsistent cross-platform rendering between Windows, macOS, and mobile devices. Heading scales lack rigorous baseline alignment and editorial contrast.
2. **Component Density & Visual Hierarchy**: Several sections (particularly the homepage Hero, From the Secretariat Desk, and Governance cards) are text-heavy without sufficient breathing room, leading to cognitive fatigue.
3. **Interactive Affordance & Micro-Interactions**: Interactive elements (Scheme Explorer, Quick Intake, Volunteer forms) lack tactile feedback, micro-animations, and animated state transitions (loading skeletons, success confirmations, field error cues).
4. **Mobile & Viewport Adaptability**: The quick action dock, large forms, and multi-column comparison tables experience pinch points between 360px and 390px, causing awkward line wrapping and overlapping elements.
5. **SEO & Structured Metadata**: Routes lack JSON-LD structured data (`EducationalOrganization`, `GovernmentPermit`/`NonprofitOrganization`, `FAQPage`, `BreadcrumbList`), OpenGraph image generation, and dynamic canonical tags.
6. **Accessibility (WCAG 2.2 AA)**: Certain muted gold text elements (`#C5A059` on `#FDFBF7`) fall below the 4.5:1 minimum contrast ratio for normal body copy (yielding ~3.1:1). Forms require enhanced `aria-describedby` linking for real-time validation errors.

---

## 1. Route-by-Route UX Audit & Gap Analysis

### 1.1 Homepage (`/`)
- **Current State**: Contains 11 sections (Hero with split-screen inquiry card, Accreditation marquee, Metrics strip, Introduction, 3 Pillars, Scheme Explorer, Secretariat Desk quote, Appraisal Norms, Beyond Grants, Perspectives, Volunteering, Philanthropic CTA, Ethics charter, Contact summary).
- **Strengths**: High content completeness; includes functional inquiry and volunteer forms linked to backend APIs; incorporates the statutory draft disclosure.
- **Weaknesses**:
  - The hero is visually overcrowded. Having a full 5-field inquiry form directly inside the hero right column competes with the primary value proposition and creates visual tension.
  - The metrics strip (`30 Districts Covered`, `100% Direct College Disbursal`) is static and lacks visual iconography or contextual interactive tooltips explaining the direct disbursal mechanism.
  - Visual pacing: The rhythm alternates strictly between `#FDFBF7` and `#F4EFE6` without dynamic container widths, editorial asymmetric layouts, or rich imagery/vector illustrations.
  - Testimonial/Perspective quotes feel detached from visual student contexts.
- **Recommended Transformation**:
  - Transform Hero into a grand institutional presence inspired by modern university and philanthropic endowments: impactful typography, trust emblem, dual primary CTAs (`Check Eligibility` and `Explore Scholarship Schemes`), trust verification badges, and an elegant floating "Quick Admissions & Eligibility Bar" or modular tabbed card.
  - Redesign the Scheme Explorer with rich category badges, grant amount indicators, eligible courses, application window indicators, and direct download/inquiry actions.
  - Add an interactive "Eligibility Calculator / Grant Discovery Widget" allowing students from Odisha to select their district, degree stream, and academic score to view qualified grants.
  - Integrate a dedicated "Transparency & Disbursal Guarantee" visual diagram showcasing the direct-to-college bank transfer workflow (Zero Cash Leakage).

---

### 1.2 About Trust (`/about`)
- **Current State**: Documents the foundational philosophy, mission, vision, four pillars, and Odisha educational landscape context.
- **Weaknesses**:
  - Text-heavy layout resembling a legal brief rather than an inspirational institutional story.
  - Lacks visual timeline of the Trust's formulation and planned phases.
  - Missing visual representation of leadership stewardship principles and governance committee structure.
- **Recommended Improvements**:
  - Introduce an interactive "Our Journey & Roadmap" timeline (Phase 1: Deed Formalisation -> Phase 2: College Affiliation Network -> Phase 3: Scholar Onboarding).
  - Add an "Institutional Values Grid" with distinct iconography and micro-hover states.
  - Add an executive message card from the Secretariat Board.

---

### 1.3 Governance & Fiduciary Charter (`/governance`)
- **Current State**: Focuses on the Code of Ethics, Trustee structure placeholder, direct disbursal policy, and statutory registration notice.
- **Weaknesses**:
  - Lacks structured downloadable PDF charters (e.g., "Draft Fiduciary Charter 2026-27").
  - Lacks visual breakdown of the Committee Structure (e.g., Academic Scrutiny Committee, Financial Audit Committee, Ethics Panel).
- **Recommended Improvements**:
  - Implement a 3-tier Governance Framework diagram.
  - Add an "Integrity Safeguards" accordion detailing the anti-bribery, conflict of interest, and zero-cash disbursement mechanisms.
  - Include an official "Whistleblower & Grievance Redressal" policy card with direct email access to the audit desk.

---

### 1.4 Scholarships & Grants (`/scholarships`)
- **Current State**: Lists the 3 proposed schemes (Mahavir Shiksha Protsahan Yojana, Pratibha Fellowship, Project Samarth), appraisal guidelines, and a 3-step appraisal journey.
- **Weaknesses**:
  - Information is presented in static cards without filtering, search, or comparison capabilities.
  - The document requirement list is generic and does not clarify file formats, verification authorities, or common rejection reasons.
- **Recommended Improvements**:
  - Add a "Scholarship Comparison Matrix" comparing eligibility criteria, benefit coverage (tuition vs. books vs. exam fees), target degree levels, and renewal conditions.
  - Add a dedicated "Documentation Checklist" with downloadable template guides (Income Certificate issuing authorities in Odisha, Tahsildar requirements).
  - Add a live "Check Your Eligibility" interactive modal/stepper.

---

### 1.5 Educational Programmes (`/programmes`)
- **Current State**: Comprehensive breakdown of Academic Fee Support, Career Mentorship, Project Samarth Learning Hubs, and Emergency Hardship Grants.
- **Weaknesses**:
  - No visual distinction between currently active pilot programmes and future planned initiatives.
  - Lacks a district-level cluster map or directory of planned learning hub locations in Odisha.
- **Recommended Improvements**:
  - Add an "Interactive Programme Directory" with filter tags (`Active Pilot`, `Curriculum Design`, `Cluster Rollout`).
  - Add a "District Rollout Map & Cluster Index" showing target outreach across Coastal, Western, and Southern Odisha zones.

---

### 1.6 Community Impact (`/impact`)
- **Current State**: Outlines the 30-district vision, student challenges in Odisha, and strategic intervention impact areas.
- **Weaknesses**:
  - Presents qualitative aspirations without visual infographics, demographic breakdowns, or regional educational indicators (e.g., Gross Enrollment Ratio in Odisha higher education).
  - Missing structured case studies / hypothetical scholar scenarios demonstrating real-life interventions.
- **Recommended Improvements**:
  - Add an "Odisha Higher Education Landscape" data dashboard featuring verified public educational statistics (AISHE/UGC context).
  - Create 3 detailed "Scholar Journey Archetypes" (e.g., First-generation B.Tech candidate from Kalahandi, Nursing diploma scholar from Balasore, Meritorious civil services aspirant from Cuttack).
  - Add an "Impact Monitoring Framework" outlining how academic retention, semester GPAs, and placement outcomes will be measured.

---

### 1.7 Volunteer & Mentor Network (`/volunteer`)
- **Current State**: Features mentor role descriptions, institutional partnership scope, and the interactive volunteer registration form.
- **Weaknesses**:
  - The form is long and monolithic on mobile screens.
  - Does not detail the volunteer onboarding roadmap, time commitment expectations, or code of conduct.
- **Recommended Improvements**:
  - Add a "Volunteer Journey Roadmap" (`Register -> Orientation & Code of Conduct -> Scholar Pairing -> Monthly Reviews`).
  - Introduce an interactive "Commitment Calculator" (e.g., "2 hours/month = Mentoring 1 Final Year Scholar").
  - Upgrade the registration form with field grouping, real-time input masking, and clear progress states.

---

### 1.8 Contact & Secretariat (`/contact`)
- **Current State**: Displays location, email channels, compliance notice, and the public inquiry form.
- **Weaknesses**:
  - Lacks an interactive district secretariat directory or office hours schedule.
  - Form categories do not dynamically adapt the inquiry form fields based on whether the inquirer is a student, college principal, or corporate donor.
- **Recommended Improvements**:
  - Implement a dynamic category selector that reveals relevant contextual fields (e.g., selecting "College Institutional Partnership" displays College Name & Affiliation Number).
  - Add interactive department cards (`Scholarship Desk`, `Trustee Secretariat`, `Volunteer Coordination`, `Legal & Statutory Desk`).

---

### 1.9 Frequently Asked Questions (`/faq`)
- **Current State**: Single-page accordion grouped into 4 categories (General, Scholarships, Governance, Volunteering).
- **Weaknesses**:
  - Lacks real-time search filtering.
  - Lacks "Was this helpful?" feedback buttons.
- **Recommended Improvements**:
  - Add instant client-side search filtering with highlighted keyword matches.
  - Add category filter tabs across top for fast scanning.
  - Include an interactive "Still have questions?" card linking directly to the inquiry desk with pre-filled category.

---

### 1.10 Legal & Compliance Pages (`/privacy`, `/terms`, `/accessibility`)
- **Current State**: Standard institutional text pages covering data privacy, terms of usage, and accessibility commitment.
- **Weaknesses**:
  - Plain typography lacking table of contents, reading time indicators, or jump-to-section navigation.
- **Recommended Improvements**:
  - Add a sticky sidebar Table of Contents on desktop.
  - Include statutory GDPR / Digital Personal Data Protection Act (DPDP India 2023) compliance highlights.

---

## 2. Component System Audit

| Component | Current State | Deficiencies Identified | Action Required |
| :--- | :--- | :--- | :--- |
| **`Header.tsx`** | Top notification ticker + Logo + Navigation items + Contact CTA. | Mobile menu drawer is plain; ticker is jarring on slower connections; lacks mega-menu dropdown cards with visual previews. | Redesign with institutional mega-menu, accessible keyboard traps, search trigger, and smooth mobile sliding drawer. |
| **`Footer.tsx`** | 5-column layout with compliance notice, links, address. | Text density is high; lacks newsletter/announcement subscription input; lacks social/accreditation emblems. | Modernize layout with distinct visual tiers, accreditation badges, and clear copyright/statutory disclaimers. |
| **`Button.tsx`** | Primary, secondary, outline, ghost, gold variants. | Lacks tactile depth; button text in gold variant can suffer from contrast issues on light backgrounds; lacks ripple/hover micro-transforms. | Enhance with polished states, accessible contrast overrides, loading spinners, and icon alignment. |
| **`Card.tsx`** | Default, elevated, accent, dark variants. | Flat visual language; border radii are minimal (2px `rounded-xs`); hover transitions lack elevation polish. | Introduce refined border treatments, subtle inner gold borders, smooth shadow lifts, and card header/body/footer sub-components. |
| **`SchemeExplorer.tsx`** | Filter tabs (`all`, `grants`, `stem`, `mentorship`) with grid cards. | Cards contain heavy paragraphs; lack structured specs (grant amount, eligibility bar, cycle badge, CTA). | Redesign with rich card architecture, eligibility highlights, tabular tags, and quick-apply inquiry triggers. |
| **`PageHero.tsx`** | Dark forest green header banner with breadcrumbs and title. | Hero looks identical across all sub-pages; lacks subtle background textures, illustrative crests, or dynamic breadcrumb navigation. | Upgrade with rich radial gradients, architectural pattern overlays, and structured breadcrumb schema. |
| **`QuickActionDock.tsx`**| Floating right-side desk with 4 quick links; mobile FAB button. | On smaller tablets, dock can overlap content; mobile FAB modal lacks backdrop blur and full keyboard trapping. | Implement collision detection, smooth collapsible drawer, and accessible focus management. |
| **`Accordion.tsx`** | Standard disclosure widget with plus/minus or chevron. | Abrupt expand animation; lacks smooth height interpolation on older devices. | Implement CSS grid 0fr -> 1fr smooth height transitions with fluid chevron rotations. |

---

## 3. Design Tokens & Styling Audit

### 3.1 Color Palette & Contrast Ratios
- **Forest Green (`#072617` / `#0B3B24`)**: Excellent contrast with white (`#FFFFFF`) at **14.8:1** (AAA compliance).
- **Gold (`#C5A059`)**:
  - On `#072617` (Dark Forest): Contrast ratio is **7.2:1** (Passes AAA).
  - On `#FDFBF7` (Ivory): Contrast ratio is **3.1:1** (**Fails WCAG AA for normal text!**).
  - *Fix*: Create a darkened gold variant (`#8C6D2D` or `#7A5E24`) for body text and labels on light backgrounds to achieve at least **4.6:1** contrast, while reserving `#C5A059` for backgrounds, icons, and borders.
- **Warm Ivory (`#FDFBF7`) & Warm Surface (`#F4EFE6`)**: Calming, sophisticated parchment feel that evokes traditional academic institutions. Must maintain consistent border contrast (`rgba(11, 59, 36, 0.12)`).

### 3.2 Typography System
- Currently uses system fallback `Georgia, Cambria, serif` for headings and `ui-sans-serif, system-ui` for body.
- *Problem*: Rendering varies significantly between Windows (`Georgia`), macOS (`Times New Roman`/`New York`), and Android (`Noto Serif` fallback).
- *Solution*: Define a cohesive, robust web-safe font stack with explicit serif and sans pairings, fluid responsive font scales using `clamp()`, and standardized line heights (`1.2` for headings, `1.6` for long-form prose).

---

## 4. Accessibility (WCAG 2.2 Level AA) Audit

| Area | Current Status | Issues Found | Remediation Plan |
| :--- | :--- | :--- | :--- |
| **Keyboard Navigation** | Partial | Skip-to-content link is missing. Mobile drawer cannot be fully operated via Tab/Esc. | Add `<a href="#main-content" className="sr-only focus:not-sr-only">` as first element. Add Escape key listener to close modals/menus. |
| **Color Contrast** | Non-Compliant in Muted Gold text | Text like `text-[#9E7D3B]` or `#C5A059` on `#FDFBF7` has contrast ~3.1:1. | Introduce high-contrast accessible tokens: `--color-gold-text-on-light: #7A5E24` (4.8:1). |
| **Form Labels & Error States** | Partial | Form inputs have standard `<label>`, but error messages lack `role="alert"` and `aria-describedby`. | Link input fields to error containers using `aria-invalid` and `aria-describedby="field-error"`. |
| **Reduced Motion** | Partial | Continuous ticker animation (`@keyframes marquee`) runs indefinitely without `@media (prefers-reduced-motion: reduce)`. | Wrap all infinite animations in `@media (prefers-reduced-motion: no-preference)` and provide a pause/resume control. |
| **Screen Reader Semantics** | Good | Header, main, footer semantic landmarks present. | Add explicit `aria-current="page"` on active navigation links and `aria-expanded` on dropdowns. |

---

## 5. Viewport Breakpoint Testing (360px - 1920px)

- **360px - 390px (Mobile Compact - iPhone SE, Galaxy S21)**:
  - Form grids in hero and volunteer pages wrap tightly; button text breaks into two awkward lines.
  - Ticker text takes up significant vertical space if user font-size is zoomed.
  - *Fix*: Use single-column layouts below 480px, adjust padding to `px-4`, and use flexible button padding with responsive font sizing (`text-xs sm:text-sm`).
- **768px (Tablet Portrait - iPad Mini)**:
  - Multi-column grids (4 cards) split into 2x2 awkwardly with uneven card heights.
  - *Fix*: Implement CSS subgrid or flexbox layout with uniform card stretch and consistent min-heights.
- **1024px (Tablet Landscape / Small Laptop)**:
  - Navigation links in header can bump into the CTA button on narrow desktop screens (1024px - 1180px).
  - *Fix*: Adjust desktop navigation breakpoint to `xl:flex` (1280px) and display mobile hamburger on `lg` screens if nav items exceed 6.
- **1440px - 1920px (Desktop & Ultra-wide)**:
  - Content appropriately constrained by `max-w-7xl mx-auto`.
  - Margins look balanced, but large displays can benefit from subtle lateral decorative borders or framed parchment borders to preserve institutional elegance.

---

## 6. Actionable Recommendations Summary

1. **Immediate Execution**:
   - Establish a comprehensive Design System Specification (`DESIGN_SYSTEM_SPECIFICATION.md`) with accessible tokens, typography scales, container grids, and component primitives.
   - Restructure the Homepage (`/`) to deliver an authoritative, inspiring first impression with a prestige hero, interactive eligibility calculator, dynamic scheme explorer, direct disbursal transparency flowchart, and high-conversion intake desks.
   - Refactor `Header.tsx` and `Footer.tsx` into institutional-grade anchors with full WCAG 2.2 AA keyboard navigation, contrast compliance, and responsive menus.
2. **Follow-on Execution**:
   - Execute the multi-page redesign across all remaining 11 public pages according to the Route Implementation Matrix (`ROUTE_IMPLEMENTATION_MATRIX.md`).
   - Implement the complete Student Portal and Administrative Portal architecture roadmaps according to `WEBSITE_REDESIGN_ROADMAP.md`.
