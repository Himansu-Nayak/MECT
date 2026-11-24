# MECT — DESIGN SYSTEM & HERITAGE TOKEN SPECIFICATION
**Phase 6 Institutional Design Token Audit & Accessibility Matrix**

- **Project:** Mahaveer Educational & Charitable Trust (MECT)
- **Domain:** `https://mect.org.in/`
- **Audit Deliverable:** `docs/audits/MECT_DESIGN_SYSTEM_AUDIT.md`
- **Active Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Auditor:** Antigravity UX/UI Design Director & Accessibility Lead
- **Design Baseline:** Option A Heritage Palette & Documentary Editorial Architecture

---

## 1. Visual Identity & Color Tokens

The visual identity of MECT preserves the historical heritage of Western Odisha and public trust fiduciary authority, utilizing warm earth tones, deep forest charcoal, sunbaked terracotta, and ivory parchment.

### 1.1 Core Palette Tokens
| Token Name | Hex Code | Purpose & Application | Contrast Ratio (WCAG) | Compliance |
| :--- | :--- | :--- | :--- | :--- |
| `--color-primary` | `#B25430` | Sunbaked Terracotta: Primary interactive accents, buttons, active indicators | 4.9:1 on White / 4.6:1 on Cream | WCAG AA |
| `--color-primary-dark`| `#8E3E24` | Deep Terracotta: Hover states, emphasized links, contrast badges | 7.5:1 on White | WCAG AAA |
| `--color-forest` | `#16221D` | Deep Slate Charcoal: Header mastheads, footers, solemn plaques | 15.8:1 with Cream text | WCAG AAA |
| `--color-forest-deep` | `#0D1612` | High-Contrast Deep Slate: Background for hero, ambient lighting surfaces | 17.2:1 with Cream text | WCAG AAA |
| `--color-cream` | `#FAF7F2` | Archival Alabaster Cream: Global page canvas background | Neutral Canvas | — |
| `--color-sand` | `#EFE6D9` | Warm Sand: Surface fills, card backgrounds, accent borders | 13.2:1 with Carbon Ink | WCAG AAA |
| `--color-sand-light` | `#F7F2EA` | Soft Ivory: Secondary card surface, subtle alternating rows | 14.5:1 with Carbon Ink | WCAG AAA |
| `--color-ochre` | `#C4924A` | Burnished Brass / Temple Ochre: Archival badge borders, gold accents | 3.8:1 on Dark / 4.5:1 graphic | WCAG AA Large |
| `--color-text` | `#0F1714` | Carbon Basalt Ink: Primary typography and body copy | 16.2:1 on Cream | WCAG AAA |
| `--color-text-secondary`| `#4A5852` | Editorial Secondary Ink: Subheadings, metadata labels, captions | 6.4:1 on Cream | WCAG AA |
| `--color-ink-muted` | `#4E5B55` | Muted Regulatory Text: Timestamps, footnotes, deed citations | 6.6:1 on Cream | WCAG AA |
| `--color-border` | `#E7E0D5` | Hairline Parchment Border: 1px structural dividing lines | Visual separator | — |

---

## 2. Typography Scale & Fluid Hierarchy

All typography is driven by fluid CSS `clamp()` tokens, delivering seamless proportional scaling from 320px mobile up to 1920px widescreen displays without abrupt breakpoint jumps or text overflow.

| Level | CSS Token | Size Range (`clamp`) | Line Height | Tracking | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `--type-display-size` | `clamp(2.25rem, 1.8rem + 2vw, 3.625rem)` | 1.12 | `-0.025em` | Serif (Playfair/Georgia) |
| **Heading 1** | `--type-h1-size` | `clamp(1.875rem, 1.55rem + 1.45vw, 2.75rem)` | 1.16 | `-0.02em` | Serif |
| **Heading 2** | `--type-h2-size` | `clamp(1.5rem, 1.25rem + 1.1vw, 2.125rem)` | 1.22 | `-0.018em` | Serif |
| **Heading 3** | `--type-h3-size` | `clamp(1.25rem, 1.125rem + 0.55vw, 1.5rem)` | 1.28 | `-0.012em` | Serif |
| **Body Large** | `--type-body-lg-size` | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | 1.62 | `0em` | Sans (Inter/System) |
| **Body Base** | `--type-body-size` | `clamp(0.9375rem, 0.9rem + 0.15vw, 1.0rem)` | 1.65 | `0em` | Sans |
| **Body Small** | `--type-body-sm-size`| `clamp(0.8125rem, 0.8rem + 0.08vw, 0.875rem)`| 1.55 | `+0.01em` | Sans |
| **Monospace / Legal**| `--type-mono-size` | `clamp(0.75rem, 0.72rem + 0.08vw, 0.8125rem)`| 1.45 | `+0.05em` | Monospace (Filing IDs) |

---

## 3. Layout Containers & Breakpoint Grid

1. **Narrow Container (`max-w-4xl` / ~896px):** Used for solemn pledges, single-column reading experiences, and focused legal policies.
2. **Standard Container (`max-w-7xl` / ~1280px):** Primary container for content grids, multi-column cards, and telemetry registers.
3. **Wide Container (`max-w-[1600px]`):** Masthead navigation, statutory ticker, and cinematic split-viewports.
4. **Horizontal Overflow Guarantee:**
   - Universal `overflow-x: clip` applied to outer layout wrappers.
   - All flex and grid items include `min-w-0` to eliminate intrinsic flex shrink anomalies.
   - Tested 0px horizontal scroll across 320px, 360px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px.

---

## 4. Accessibility Standards & WCAG 2.1 AA Compliance

### 4.1 Minimum Touch Targets (44px Rule)
- All interactive elements (navigation buttons, dropdown disclosures, form inputs, pagination controls, social action pills) maintain a minimum computed bounding box of **44px × 44px** on touch viewports (`min-h-[44px]` or `p-2.5` touch padding).
- Desktop inline links include expanded vertical hit targets (`py-1 min-h-[24px]`).

### 4.2 Keyboard Focus Navigation
- All interactive controls feature visible, high-contrast focus rings:
  `focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2`
- Modal overlays and mobile drawers implement robust focus trapping:
  - Tab cycle restricted inside open dialog.
  - Escape key immediately dismisses overlay and restores focus to triggering element.

### 4.3 Reduced Motion Architecture
- Respects `prefers-reduced-motion: reduce`:
  - Ambient radial lighting motion stops.
  - Marquee animations pause or collapse into static columns.
  - CountUp statistics render final values immediately without counting animation.
  - CSS animations use `@media (prefers-reduced-motion: reduce) { animation-duration: 0.01ms !important; }`.

---

## 5. UI Component Primitives

1. **Button (`src/components/ui/Button.tsx`):**
   - Variants: `primary` (Terracotta), `secondary` (Sand), `outline` (Parchment border), `dark` (Forest), `gold` (Ochre).
   - States: idle, hover (translate-y-0.5), focus-visible, active, disabled (opacity-50 pointer-events-none), loading (animated spinner).
2. **Card (`src/components/ui/Card.tsx`):**
   - Razor 1px hairline border (`border-border`), subtle shadow elevation, rounded-xs (`2px`) architectural radius.
3. **Badge (`src/components/ui/Badge.tsx`):**
   - Verified statutory badges (`forest`, `terracotta`, `gold`, `outline`) with high-contrast font-mono typography.
4. **SectionHeader (`src/components/ui/SectionHeader.tsx`):**
   - Unified uppercase category eyebrow, serif title with `[text-wrap:balance]`, and sans descriptive subtext.
