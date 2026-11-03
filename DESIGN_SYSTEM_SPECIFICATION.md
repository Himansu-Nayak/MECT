# MAHAVIR TRUST — Institutional Design System Specification

**Document Reference**: `DESIGN_SYSTEM_SPECIFICATION.md`  
**Author**: Principal Product Designer & Senior Frontend Architect  
**Target Environment**: Isolated Security Worktree (`.worktrees/security-patch`)  
**Git Branch**: `security/nextjs-patch-upgrade`  
**Date**: November 2, 2026  
**Version**: 2.0.0-ENTERPRISE  
**Accessibility Target**: WCAG 2.2 Level AA Compliance  

---

## 1. Design Philosophy: Institutional Prestige & Empathetic Storytelling

The MAHAVIR TRUST design system merges the dignified authority of classical university endowments (such as [RCM](https://rcm.ac.in/)) with the warm empathy and transparency of modern philanthropic foundations (such as [Smile Foundation India](https://www.smilefoundationindia.org/)). 

### Core Tenets:
1. **Academic Dignity**: Scholarly serif headings, balanced letter-spacing, deep forest greens, and warm ivory paper textures reflect heritage and permanence.
2. **Gold Accents with High Contrast**: Gold is used selectively as an accent of excellence and warmth—never in low-contrast text applications that violate accessibility standards.
3. **Structured Clarity**: Information is presented in organized, bite-sized hierarchical tiers (Badges -> Headings -> Subtext -> Key Metrics -> Primary Actions).
4. **Tactile Interaction**: Every interactive control possesses intentional states (Rest, Hover, Focus-Visible, Active, Disabled, Loading) with smooth CSS transitions and accessible focus rings.

---

## 2. Color Palette & Semantic Tokens

### 2.1 The Core Triad
The brand identity is rooted in three foundational colors:

```
+-------------------------------------------------------------------------------------------------------+
| Color Name              | Hex Code  | RGB Equivalent      | Purpose & Application                    |
+-------------------------------------------------------------------------------------------------------+
| Forest Green (Darkest)  | #072617   | rgb(7, 38, 23)      | Hero backgrounds, footers, dark cards    |
| Forest Green (Primary)  | #0B3B24   | rgb(11, 59, 36)     | Primary brand color, dark headings, CTAs |
| Forest Green (Accent)   | #165B38   | rgb(22, 91, 56)     | Ambient glow, hover states, badges       |
| Gold (Heritage)         | #C5A059   | rgb(197, 160, 89)   | Accents, borders, badges, button icons   |
| Gold (Champagne)        | #E4C88A   | rgb(228, 200, 138)  | Text on dark green, icons, highlights    |
| Gold (High-Contrast)    | #7A5E24   | rgb(122, 94, 36)    | Text & labels on light/ivory backgrounds |
| Warm Ivory (Base)       | #FDFBF7   | rgb(253, 251, 247)  | Page background, elevated card surfaces  |
| Warm Surface (Warm)     | #F4EFE6   | rgb(244, 239, 230)  | Alternating section backgrounds, inputs  |
| Sand Accent             | #EDE6D8   | rgb(237, 230, 216)  | Subtle dividing lines, table headers     |
| Charcoal Text           | #1C2421   | rgb(28, 36, 33)     | High-contrast body text, primary copy    |
| Slate Text              | #4A5568   | rgb(74, 85, 104)    | Secondary descriptions, metadata subtext |
+-------------------------------------------------------------------------------------------------------+
```

### 2.2 Contrast Compliance Matrix (WCAG 2.2 AA)

| Foreground Color | Background Color | Contrast Ratio | Minimum AA Requirement | Compliance Status |
| :--- | :--- | :--- | :--- | :--- |
| `#FFFFFF` (White) | `#072617` (Dark Forest) | **15.8 : 1** | 4.5 : 1 (Normal Text) | **PASS (AAA)** |
| `#E4C88A` (Champagne) | `#072617` (Dark Forest) | **9.4 : 1** | 4.5 : 1 (Normal Text) | **PASS (AAA)** |
| `#E4C88A` (Champagne) | `#0B3B24` (Primary Forest) | **7.1 : 1** | 4.5 : 1 (Normal Text) | **PASS (AAA)** |
| `#1C2421` (Charcoal) | `#FDFBF7` (Ivory Base) | **14.2 : 1** | 4.5 : 1 (Normal Text) | **PASS (AAA)** |
| `#4A5568` (Slate Text) | `#FDFBF7` (Ivory Base) | **6.4 : 1** | 4.5 : 1 (Normal Text) | **PASS (AA)** |
| `#7A5E24` (Contrast Gold) | `#FDFBF7` (Ivory Base) | **4.9 : 1** | 4.5 : 1 (Normal Text) | **PASS (AA)** |
| `#0B3B24` (Forest Text) | `#FDFBF7` (Ivory Base) | **10.6 : 1** | 4.5 : 1 (Normal Text) | **PASS (AAA)** |

---

## 3. Typography System

### 3.1 Font Families
- **Display & Headings (Serif)**:
  `font-serif: "Playfair Display", "Baskerville", "Georgia", "Cambria", "Times New Roman", serif`
  - Evokes classical institutional heritage, scholarship, and legal gravitas.
- **Body & Interface (Sans-Serif)**:
  `font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - High legibility, crisp rendering on low-DPI mobile screens, and full character support.
- **Monospace & Numerical (Code & Registry Numbers)**:
  `font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace`
  - Used for application reference numbers (e.g., `#AppRef-2026-1049`), timestamps, and statutory registration numbers.

### 3.2 Type Scale (Fluid Desktop & Mobile)

```
Level       Mobile (360px)       Desktop (1440px)     Weight       Line Height   Letter Spacing
Display     36px (2.25rem)       56px (3.5rem)        700 Bold     1.15          -0.025em (tight)
Heading 1   30px (1.875rem)      44px (2.75rem)       700 Bold     1.20          -0.02em (tight)
Heading 2   24px (1.5rem)        32px (2.0rem)        700 Bold     1.25          -0.015em
Heading 3   20px (1.25rem)       24px (1.5rem)        600 SemiBold 1.30          -0.01em
Heading 4   17px (1.0625rem)     19px (1.1875rem)     600 SemiBold 1.35          0.00em
Body Large  16px (1.0rem)        18px (1.125rem)      400 Regular  1.60          0.00em
Body Normal 14px (0.875rem)      15px (0.9375rem)     400 Regular  1.60          0.00em
Body Small  12px (0.75rem)       13px (0.8125rem)     400 Regular  1.50          0.01em
Caption     10px (0.625rem)      11px (0.6875rem)     600 SemiBold 1.40          0.05em (wide/uppercase)
```

---

## 4. Spacing Scale & Grid System

Based on an **8-point spatial grid** (with a 4-point sub-grid for fine micro-alignments):

```
Token      Value (px)   Tailwind Class   Usage
space-1    4px          gap-1 / p-1      Micro padding, icon offsets
space-2    8px          gap-2 / p-2      Compact badge padding, form field gap
space-3    12px         gap-3 / p-3      Input vertical padding, card micro-spacing
space-4    16px         gap-4 / p-4      Standard button padding, compact card body
space-6    24px         gap-6 / p-6      Standard card padding, grid gutters
space-8    32px         gap-8 / p-8      Generous card padding, section sub-elements
space-12   48px         gap-12 / p-12    Section margin, multi-column row gap
space-16   64px         py-16            Standard section vertical padding
space-24   96px         py-24            Hero & landmark section vertical padding
```

### 4.1 Responsive Containers
- **Container Max Width**: `max-w-7xl` (1280px) centered via `mx-auto`.
- **Lateral Gutters**:
  - Mobile (360px - 639px): `px-4` (16px)
  - Tablet (640px - 1023px): `px-6` (24px)
  - Desktop (1024px+): `px-8` (32px)

---

## 5. Component Primitives & Styling Standards

### 5.1 Buttons (`Button.tsx`)
```tsx
// Variants:
// 1. primary:   bg-[#0B3B24] text-white hover:bg-[#072617] border border-[#0B3B24] shadow-xs active:scale-[0.99]
// 2. secondary: bg-[#F4EFE6] text-[#072617] hover:bg-[#EDE6D8] border border-[#0B3B24]/15
// 3. gold:      bg-[#C5A059] text-[#072617] hover:bg-[#B38D44] font-semibold border border-[#B38D44]/30 shadow-xs
// 4. outline:   border border-[#0B3B24] text-[#0B3B24] hover:bg-[#0B3B24] hover:text-white
// 5. ghost:     text-[#072617] hover:bg-[#0B3B24]/5
// 6. dark-outline: border border-white/30 text-white hover:bg-white/10
```
- **Focus Ring**: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]`.
- **States**: Includes built-in `isLoading` state replacing left icon with an animated spinning SVG (`Loader2`).

### 5.2 Cards (`Card.tsx`)
- **`default`**: `bg-[#FDFBF7] border border-[#0B3B24]/12 rounded-sm shadow-xs hover:border-[#0B3B24]/25 transition-all`
- **`elevated`**: `bg-white border border-[#0B3B24]/10 rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`
- **`accent`**: `bg-[#F4EFE6] border-l-4 border-l-[#C5A059] border-y border-r border-[#0B3B24]/10 rounded-r-sm`
- **`dark`**: `bg-[#072617] text-[#EDE6D8] border border-[#C5A059]/25 rounded-sm shadow-lg`

### 5.3 Badges (`Badge.tsx`)
- Pill-shaped or subtle rounded tags with micro-typography:
  - **`gold`**: `bg-[#C5A059]/15 text-[#7A5E24] border border-[#C5A059]/30` (Accessible on light surfaces)
  - **`gold-dark`**: `bg-[#C5A059]/20 text-[#E4C88A] border border-[#C5A059]/40` (Accessible on dark surfaces)
  - **`forest`**: `bg-[#0B3B24]/10 text-[#0B3B24] border border-[#0B3B24]/20`
  - **`success`**: `bg-emerald-50 text-emerald-800 border border-emerald-200`

### 5.4 Form Elements
- Standardized heights: 42px for single-line inputs.
- Background: `#FDFBF7` with border `#0B3B24]/20`.
- Focus State: Smooth transition to border `#C5A059` with subtle box-shadow ring `ring-2 ring-[#C5A059]/20`.
- Error State: Border `border-red-500` with text `text-red-700` and `role="alert"`.

### 5.5 Elevation & Shadows
- **`shadow-xs`**: `0 1px 2px 0 rgba(7, 38, 23, 0.05)` (subtle cards, buttons)
- **`shadow-sm`**: `0 2px 4px 0 rgba(7, 38, 23, 0.08)` (dropdown menus, floating docks)
- **`shadow-md`**: `0 4px 12px -2px rgba(7, 38, 23, 0.12)` (elevated cards on hover, popovers)
- **`shadow-2xl`**: `0 25px 50px -12px rgba(7, 38, 23, 0.25)` (modals, hero quick cards)

---

## 6. Motion & Micro-Interactions Standards

1. **Duration Tokens**:
   - `fast`: `150ms` (buttons, checkboxes, tooltips)
   - `medium`: `250ms` (dropdowns, card hover lifts, tabs)
   - `deliberate`: `400ms` (modal open/close, drawer sliding, accordion expansion)
2. **Timing Curves**:
   - Standard: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo for crisp, responsive physical feel)
3. **Reduced Motion Overrides**:
   - Every CSS animation and continuous marquee is guarded by:
     ```css
     @media (prefers-reduced-motion: reduce) {
       *, ::before, ::after {
         animation-duration: 0.01ms !important;
         animation-iteration-count: 1 !important;
         transition-duration: 0.01ms !important;
       }
     }
     ```

---

## 7. Component Library Primitives (Section 1 Deliverable)

All core components are exported from `src/components/ui/index.ts`:

```
src/components/ui/
├── Button.tsx          - 6 variants, 3 sizes, loading state, accessible focus rings
├── Badge.tsx           - Standalone primitive (gold, gold-dark, contrast-gold, forest, forest-dark, neutral, success, warning, outline)
├── Card.tsx            - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter (with Badge re-export)
├── Container.tsx       - Standardized responsive layout wrapper (default, narrow, prose, wide, full)
├── SectionHeader.tsx   - Editorial section introduction with badge, title, subtitle, and action slots
├── Input.tsx           - Accessible form input with label, error, helper text, and icon slots
├── Textarea.tsx        - Accessible multi-line input with label, error, helper, and character counter
├── Select.tsx          - Accessible form dropdown select with custom chevron and ARIA state bindings
└── StateFeedback.tsx   - Universal feedback primitive for loading, error, empty, and success states
```

---

## 8. Global Website Experience (Section 2 Deliverable)

The global shell unites all routes with institutional authority, statutory clarity, and responsive utility:

### 8.1 Institutional Header & Mega-Menu (`Header.tsx`)
- **Secretariat Announcement Ticker**: High-contrast top bar with marquee pause on hover/focus and reduced-motion detection.
- **Editorial Mega-Menu**: Multi-column flyouts for high-density academic navigation ("About Trust", "Scholarships") featuring categorized sub-sections, planned feature tags, and institutional callout cards ("Direct Disbursal Guarantee", "Fiduciary Charter").
- **Keyboard & Escape Trap**: `Escape` key closes active menus immediately; outside clicks are cleanly dismissed.
- **Off-Canvas Mobile Drawer**: Full-height slide-in drawer from viewport right with backdrop blur overlay, body scroll lock, and touch targets ≥44px.

### 8.2 Fiduciary Footer (`Footer.tsx`)
- **Tier 1 (Statutory Compliance Alert)**: Prominently highlights the 100% Direct-to-College Disbursal Policy and zero-cash rule.
- **Tier 2 (5-Column Grid)**: Organizes Trust identity, Secretariat desk, Academic Grants, Fiduciary Governance, and Community Engagement.
- **Tier 3 (Legal & Accessibility Bar)**: Dynamic copyright year, Privacy, Terms, Accessibility Statement (WCAG 2.2 AA), and Statutory Disclosures.
- **Layout Consistency**: Consumes the unified `<Container size="default">` primitive across all tiers.

### 8.3 Floating Quick Action Dock (`QuickActionDock.tsx`)
- **Desktop Ribbon**: Docked to right viewport edge with dark forest surface (`#072617`), gold borders (`#C5A059`/40), and accessible tooltips.
- **Mobile Action Sheet**: Floating Action Button (FAB) at bottom-right expanding into an accessible dialog with backdrop dismiss and `Escape` key listener.
- **Print Optimization**: Automatically suppressed on print (`print:hidden`).

### 8.4 Universal Page Hero (`PageHero.tsx`)
- Standardized across all 11 subpages (`/about`, `/governance`, `/scholarships`, `/programmes`, `/impact`, `/volunteer`, `/contact`, `/faq`, `/terms`, `/privacy`, `/accessibility`).
- Consumes `<Container>` for unified margins and `<Badge variant="gold-dark">` for subpage category labels.
- Implements Schema.org `BreadcrumbList` structured JSON-LD / microdata.

---

## 9. Homepage Narrative & High-Impact Editorial Layout (Section 3 Deliverable)

The landing page (`src/app/page.tsx`) serves as the flagship institutional experience:

### 9.1 Layout Containerization
- **Strict `<Container size="default">` Usage**: All 13 sections (Hero, Marquee, Calculator, About, Schemes, Disbursal Flowchart, Strategic Mission, Secretariat Callout, Enablement, Impact Outreach, Volunteer Desk, Inquiry Desk, Philanthropic CTA) operate under unified responsive gutters (`px-4 sm:px-6 lg:px-8`) and max-width (`1280px`).

### 9.2 Section Header Hierarchy (`SectionHeader.tsx`)
- Standardized section titles, badges, and explanatory subtext using `<SectionHeader>` to enforce typography scale, letter spacing, and WCAG AA contrast.

### 9.3 Institutional Form Controls
- **Accessible Form Controls**: Homepage forms (Volunteer Desk & Secretariat Inquiry) now consume `<Input>`, `<Select>`, and `<Textarea>` primitives with built-in labels, icon slots, accessible chevrons, and aria-described error states.
- **Server-Grounded Consent**: Volunteer submission binds affirmative consent (`consentDeclared: true`, `consentVersion: "v2.3"`), strictly synchronized with the Flyway V3/V4 schema and Spring Boot backend validators.

---

## 10. Institutional About Us & Heritage Page (Section 4 Deliverable)

The About Us page (`src/app/about/page.tsx`) articulates the founding philosophy, operational mission, values, and governance tiers:

### 10.1 Structured Sections
- **Page Hero**: High-impact banner with Schema.org breadcrumb integration and dual CTAs to `/governance` and `/scholarships`.
- **Foundational Narrative**: 2-column editorial layout pairing the post-secondary dropout crisis in Odisha with Vision & Mission cards.
- **Guiding Values Grid**: 4 elevated cards (`Fiduciary Integrity`, `Objective Blind-Appraisal`, `Student Dignity First`, `Non-Sectarian Universality`) with `<Badge variant="contrast-gold">`.
- **Organizational Architecture**: 4-tier governance hierarchy (`Board of Trustees`, `Academic Advisory Council`, `Appraisal & Scrutiny Committee`, `Secretariat Desk`) grounded in statutory disclaimers.
- **Phased Evolution Roadmap**: 4 milestone columns (`2025 Genesis`, `Early 2026 Platform`, `Mid 2026 Partnerships`, `2026-27 Launch`).

### 10.2 Primitives Deployed
- `<Container size="default">`, `<Badge>`, `<SectionHeader>`, `<Card variant="elevated">`, `<Button>`, and `<PageHero>`.

---

## 11. Statutory Governance & Fiduciary Charter Page (Section 5 Deliverable)

The Governance route (`src/app/governance/page.tsx`) codifies ethical boundaries, multi-tier committee mandates, and financial oversight:

### 11.1 Structural Architecture
- **Statutory Notice Strip**: Containerized banner highlighting the trust deed formalisation notice and compliance desk link.
- **Trustee Governance & Committee Architecture**: 4 elevated cards detailing committee scope, composition, and legal mandates (`Board of Trustees`, `Audit Panel`, `Appraisal Committee`, `Secretariat Office`).
- **Financial Oversight Standard**: 3 dark-themed cards detailing the 100% direct-to-college bank remittance, dual-signatory electronic authorization, and mandatory CA audits.
- **Conflict-of-Interest & Whistleblower Policies**: 4 cards outlining zero remuneration for trustees, the relatives exclusion rule, non-sectarian universality, and confidential reporting channels (`governance@mahavirtrust.org`).
- **Transparency Repository**: 4 official policy documents with provisional classification codes and inspection request actions.

### 11.2 Primitives Deployed
- `<Container size="default">`, `<Badge>`, `<SectionHeader theme="dark" / "light">`, `<Card variant="elevated">`, `<Button>`, and `<PageHero>`.

---

## 12. Scholarships & Financial Aid Hub (Section 6 Deliverable)

The Scholarships page (`src/app/scholarships/page.tsx`) provides an objective, transparent framework for students, guardians, and college principals across Odisha:

### 12.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#comparison` and `#checklist`.
- **Scheme Comparison Matrix**: Responsive tabular comparison of the 3 flagship initiatives (*Shiksha Protsahan Yojana*, *Pratibha Fellowship*, *Project Samarth*) comparing Target Audience, Academic Thresholds, Household Means Limits, Benefit Coverage, Disbursement Modes, and Annual Renewal Terms.
- **4-Step Appraisal & Disbursal Journey**: 4 elevated cards mapping the student journey from Inquiry & Submission to College Verification, Committee Scrutiny, and 100% Direct Bank RTGS Disbursal.
- **Mandatory Documentation Checklist**: 3 category cards (*Academic Records*, *Income & Residency Proofs*, *Institutional Banking Details*) equipped with verification safeguards and regulatory warnings.
- **Student Guidance FAQ**: Narrow-container accordion addressing dual-scholarship coordination, direct-to-college remittances, zero fees, college transfers, and renewal GPA criteria.
- **Interactive Action Callout Strip**: Dark forest container driving candidates to the interactive Scholar Eligibility Calculator (`/#eligibility-calculator`) or Secretariat Inquiry Desk (`/contact`).

### 12.2 Primitives Deployed
- `<Container size="default">`, `<Container size="narrow">`, `<Badge>`, `<SectionHeader>`, `<Card variant="elevated" / "accent">`, `<Button>`, `<Accordion>`, and `<PageHero>`.

---

## 13. Educational & Community Programmes (Section 7 Deliverable)

The Programmes route (`src/app/programmes/page.tsx`) presents the structural interventions deployed by MAHAVIR TRUST to overcome higher education dropouts and lack of study infrastructure:

### 13.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#flagship` and `#hubs`.
- **Three Flagship Initiatives in Depth**: 3 elevated institutional cards (*Mahavir Shiksha Protsahan Yojana*, *Pratibha Excellence Fellowship*, *Project Samarth*) featuring numeric milestone callouts, high-contrast badges, strategic objective lists, target beneficiary criteria, and scheme guideline links.
- **Project Samarth Community Study Hubs Blueprint**: Dark forest container with gold radial geometry detailing rural study infrastructure specifications (solar continuity, filtered academic Wi-Fi, reference archives, volunteer mentor desks) and a volunteer steward registration banner.
- **Odisha 30-District Engagement Strategy**: 3 elevated phase cards (*Phase 1 Pilot Cluster*, *Phase 2 Coastal & Industrial*, *Phase 3 Western & Southern*) outlining the systematic geographical scaling roadmap.

### 13.2 Primitives Deployed
- `<Container size="default">`, `<Badge>`, `<SectionHeader theme="light" / "dark">`, `<Card variant="elevated" / "dark">`, `<Button>`, and `<PageHero>`.

---

## 14. Community Impact & District Outreach Hub (Section 8 Deliverable)

The Impact route (`src/app/impact/page.tsx`) articulates the geographical mandate, objective impact metrics, and statutory accountability standards of MAHAVIR TRUST:

### 14.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#districts` and `#framework`.
- **Coverage Strategy Across All 30 Odisha Districts**: 4 regional zone cards (*Central Educational*, *Northern & Industrial*, *Western Academic*, *Southern & Aspirational*) categorizing all 30 districts by operational phase and institutional status, with gold badge counters.
- **Auditable Impact Framework**: 4 elevated cards measuring core non-profit milestones: College Retention Rate (>95%), Direct Disbursal Integrity (100% non-cash), First-Gen Scholar Focus (>70%), and Gender Equity in STEM.
- **Representative Scholar Journeys (Archetypes)**: 3 elevated narrative cards modeling realistic barriers and interventions across rural Kalahandi, coastal Balasore, and semi-urban Cuttack.
- **Statutory Annual Reports & Financial Disclosures**: Dark forest container detailing the annual Form 10B audit calendar, disbursement ledger reconciliations, and CA certified balance sheet publication terms.

### 14.2 Primitives Deployed
- `<Container size="default">`, `<Badge>`, `<SectionHeader theme="light" / "dark">`, `<Card variant="elevated" / "default" / "dark">`, `<Button>`, and `<PageHero>`.

---

## 15. Volunteer Onboarding & Fellowship Desk (Section 9 Deliverable)

The Volunteer route (`src/app/volunteer/page.tsx`) provides an institutional onboarding gateway and fellowship induction portal for educators, professionals, and community stewards across Odisha:

### 15.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#apply` and `#tracks`.
- **Engagement Philosophy Comparison**: Contrast matrix comparing ad-hoc volunteer charity against MAHAVIR TRUST's structured, curriculum-aligned institutional fellowship with measurable educational outcomes.
- **Fellowship & Mentorship Tracks**: 4 elevated cards detailing specific volunteer roles (*Academic Tutoring & Remedial Coaching*, *Career Mentorship & Entrance Prep*, *Study Hub Administration & Digital Literacy*, *Community Outreach & Scholar Verification*) with commitment hours and target qualifications.
- **Four-Stage Induction Roadmap**: 4 sequential step cards (*Online Application*, *Telephonic Credential Verification*, *Orientation & Safeguarding Workshop*, *District Deployment*) with step counters and timeline indicators.
- **Institutional Volunteer Intake Desk**: Structured form built with design system form controls (`<Input>`, `<Select>`, `<Textarea>`) featuring floating labels, validation states, character counters, and statutory consent declarations bound to the Spring Boot REST API (`POST /api/volunteers`).
- **Code of Conduct & Child Protection Accordion**: 4 interactive policy panels covering child safeguarding, non-commercial service pledge, institutional data privacy, and certificate issuance criteria.

### 15.2 Primitives Deployed
- `<Container size="default">`, `<Container size="narrow">`, `<Badge>`, `<SectionHeader theme="light" / "dark">`, `<Card variant="elevated" / "default" / "dark">`, `<Input>`, `<Select>`, `<Textarea>`, `<Button>`, and `<PageHero>`.

---

## 16. Contact Us & Grievance Redressal Desk (Section 10 Deliverable)

The Contact route (`src/app/contact/page.tsx`) provides an auditable secretariat gateway, physical verification directory, and three-tier grievance redressal mechanism for students, institutions, and citizens across Odisha:

### 16.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#inquiry-form`, `#secretariat-directory`, and `#grievance-charter`.
- **Institutional Directory & Verified Response SLAs**: 3 elevated cards detailing physical headquarters in Cuttack, digital communication desks (General & Scholarships), and the Ombudsman Compliance Desk, each with verified response time SLAs (same-day physical stamping, 24-48h electronic turnaround, 7-day grievance resolution).
- **Official Secretariat Inquiry Desk**: Institutional form powered by design system form controls (`<Input>`, `<Select>`, `<Textarea>`) with character limits, validation state feedback, and direct integration with the Spring Boot REST API (`POST /api/v1/public/inquiries`), rendering a dedicated reference ID confirmation banner.
- **Three-Tier Grievance Redressal Architecture**: Dark forest container outlining the multi-tier escalation protocol (*Tier 1: Secretariat Operations Desk*, *Tier 2: Fiduciary Ombudsman Committee*, *Tier 3: Board of Trustees Statutory Review*) per the Indian Trusts Act, 1882.
- **Critical Anti-Fraud & Non-Commercial Notice**: Prominent gold-bordered advisory declaring a zero-tolerance policy for fees, touts, or unauthorized intermediaries.

### 16.2 Primitives Deployed
- `<Container size="default">`, `<Container size="narrow">`, `<Badge>`, `<SectionHeader theme="light" / "dark">`, `<Card variant="elevated" / "dark">`, `<Input>`, `<Select>`, `<Textarea>`, `<Button>`, and `<PageHero>`.

---

## 17. Institutional FAQ & Knowledge Base Hub (Section 11 Deliverable)

The FAQ route (`src/app/faq/page.tsx`) provides an authoritative, categorized institutional knowledge base for students, guardians, educators, volunteers, and donors across Odisha:

### 17.1 Structural Architecture
- **Page Hero**: High-impact banner with Schema.org breadcrumbs and fast-jump actions to `#categories` and `#helpdesk`.
- **Thematic Directory Jump Cards**: 6 elevated cards with domain icons, titles, and question counters linking directly to each category section (*Scholarships & Aid*, *Mentorship & Fellows*, *Statutory Governance*, *Project Samarth*, *Volunteer Induction*, *Transparency Pledge*).
- **Thematic FAQ Sections (24 Questions Total)**:
  1. *Scholarships & Financial Aid*: 5 questions on eligibility, 100% direct college bank disbursals, zero application fees, documentation requirements, and supplemental aid.
  2. *Mentorship & Career Fellowship*: 4 questions on Pratibha Fellowship requirements, mentor qualifications, competitive exam prep, and rescheduling policies.
  3. *Statutory Governance & Audit*: 4 questions on double-blind beneficiary selection, Indian Trusts Act 1882 & 12AB/80G status, Form 10B public audit disclosures, and Trustee non-conflict rules.
  4. *Project Samarth Community Study Hubs*: 4 questions on quiet learning infrastructure, rooftop solar backup, free student registration, and 30-district deployment.
  5. *Volunteer Induction & Code of Conduct*: 4 questions on professional eligibility, 2-6 hour weekly commitments, mandatory child protection safeguarding, and institutional certification.
  6. *Transparency & Non-Intermediary Pledge*: 3 questions on pre-launch endowment status, Section 80G tax deductions, and zero fundraising commissions.
- **Direct Secretariat Support Desk**: Dark forest container with dual routing buttons to the official Inquiry Desk (`/contact`) and Volunteer Fellowship Portal (`/volunteer`), complete with direct helpline hours.

### 17.2 Primitives Deployed
- `<Container size="default">`, `<Container size="narrow">`, `<Badge>`, `<SectionHeader>`, `<Card variant="elevated" / "dark">`, `<Button>`, `<Accordion>`, and `<PageHero>`.

---

## 18. Statutory Legal, Privacy & Accessibility Hub (Section 12 Deliverable)

The Legal & Accessibility Hub (`src/app/terms/page.tsx`, `src/app/privacy/page.tsx`, `src/app/accessibility/page.tsx`) provides an integrated, transparent statutory compliance foundation across all MAHAVIR TRUST public portals:

### 18.1 Structural Architecture
- **Unified Cross-Policy Tab Bar**: Elevated sub-navigation bar shared across all 3 pages allowing visitors to switch between Terms of Engagement, Privacy & Confidentiality, and Accessibility Statement seamlessly.
- **Terms of Engagement (`/terms`)**:
  - 8 structured institutional clauses covering the Indian Trusts Act 1882 statutory preamble, authenticity of submissions, selection discretion, 100% direct-to-college bank disbursals, Project Samarth community guidelines, educational fair use, limitation of liability, and zero-fee / anti-bribery undertakings.
  - Dark forest statutory warning card with an absolute prohibition against application fees and touts.
- **Privacy & Student Confidentiality Policy (`/privacy`)**:
  - 6 comprehensive sections aligned with India's Digital Personal Data Protection Act, 2023 (DPDP Act) and Section 12AB transparency norms.
  - Highlights student dignity protections, categories of data collected, lawful charitable processing purposes, an inviolable non-commercialization pledge (zero tracking or data broker sharing), security safeguards, and Grievance Redressal Officer (GRO) contact channels.
- **Digital Accessibility Statement (`/accessibility`)**:
  - Grounded in WCAG 2.2 Level AA and Guidelines for Indian Government Websites (GIGW).
  - Documents high contrast ratios (>7:1 body, >10:1 headings), full keyboard tab navigation with visible 2px gold focus rings, native HTML5 landmarks with strict heading hierarchies, 44×44px touch targets, and `prefers-reduced-motion` vestibular comfort.
  - Assistive technology compatibility matrix covering NVDA, JAWS, VoiceOver, and TalkBack.
  - Dedicated Accessibility Feedback & Remediation Desk with a 48-hour response SLA.

### 18.2 Primitives Deployed
- `<Container size="narrow">`, `<Badge>`, `<SectionHeader>`, `<Card variant="elevated" / "dark">`, `<Button>`, and `<PageHero>`.

---

## 19. Full Suite Integration & Backend Security Architecture (Section 13 Deliverable)

The MAHAVIR TRUST technical platform bridges a static, accessible Next.js 16.4.3 frontend with a high-security Spring Boot 4.1.1 backend running on Java 21:

### 19.1 End-to-End Route Matrix (14 Static Pages)
All 14 routes are statically compiled, prerendered, and integrated with the institutional design system:
1. `/` — Homepage & Narrative Portal
2. `/about` — Institutional Heritage & Mission
3. `/governance` — Statutory Board & Fiduciary Charter
4. `/scholarships` — Scholarships & Financial Aid Hub
5. `/programmes` — Educational Interventions & Study Hubs
6. `/impact` — District Outreach & Auditable Outcomes Hub
7. `/volunteer` — Volunteer Intake Desk & Fellowship Portal
8. `/contact` — Secretariat Communications & Grievance Desk
9. `/faq` — 24-Topic Institutional Knowledge Base
10. `/terms` — Terms of Engagement & Fiduciary Clauses
11. `/privacy` — Student Data Privacy (DPDP Act 2023)
12. `/accessibility` — WCAG 2.2 Level AA Accessibility Statement
13. `/_not-found` — Branded 404 Institutional Fallback
14. `/robots.txt` / `/sitemap.xml` — SEO & Crawler Governance

### 19.2 Backend Security Controls
- **Stateless Authentication**: JWT tokens with cryptographically signed claims (`HMAC-SHA256`) and strict expiration windows.
- **Credential Protection**: BCrypt password hashing with cost factor 12 (`BCryptPasswordEncoder(12)`).
- **Brute-Force & Denial-of-Service Defense**: In-memory `RateLimitingFilter` enforcing IP-based token-bucket quotas on public API endpoints (`/public/inquiries`, `/public/volunteers`).
- **Account Lockout Policy**: Automated account lockout after 5 consecutive failed authentication attempts, audited directly in the security log.
- **SQL Injection & XSS Mitigations**: Parameterized Spring Data JPA repositories, Hibernate ORM parameter binding, Content Security Policy (`default-src 'self'`), and Frame Options (`DENY`).
- **Immutable Audit Trail**: `AuditLogService` logging every security event, administrative action, and status update with actor identity, resource ID, action tag, client IP, and UTC timestamp.
