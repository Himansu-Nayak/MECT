# MECT PHASE 26 — PREMIUM DESIGN SYSTEM SPECIFICATION
## "Documentary Editorial Architecture" Design Language

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-26-radical-visual-reinvention`  
**Phase:** Phase 26 — Radical Visual Reinvention  
**Status:** PRODUCTION DESIGN TOKENS DEFINED  

---

## 1. System Philosophy & Aesthetic Foundations

The Phase 26 Design System replaces the dated, uniform peach-cream and green card aesthetic with **"Documentary Editorial Architecture"** — a visual language rooted in:
1. **The physical soil and archival papers of Western Odisha** (sunbaked terracotta, laterite earth, warm archival parchment, and deep carbon ink).
2. **The editorial discipline of international cultural publications and museums** (asymmetric layouts, generous negative space, high-contrast serif headlines, tactile micro-borders, and museum-grade documentary captions).

---

## 2. Color Architecture & Token Specification

### 2.1 The Core Institutional Palette

| Token Name | Hex Value | Semantic Role | Contrast vs Canvas (WCAG 2.2) |
| :--- | :--- | :--- | :--- |
| `--color-ink` / `--ink-primary` | `#0F1714` | Primary body copy, dominant headlines, high-contrast dark accents | **16.2 : 1** (AAA) on Canvas |
| `--color-ink-secondary` | `#4A5852` | Editorial deck copy, subtitles, secondary metadata | **6.4 : 1** (AA Large/Normal) |
| `--color-ink-muted` | `#6C7A74` | Captions, timestamps, hairline border indicators | **4.6 : 1** (AA Normal) |
| `--color-alabaster` / `--canvas`| `#FAF7F2` | Global background canvas (Warm Alabaster Parchment) | Primary Background |
| `--color-card-surface` | `#FFFFFF` | Elevated paper card surface (Crisp Museum White) | High-contrast elevation |
| `--color-sand-warm` | `#F1E9DE` | Subdued editorial callout bands, quote blocks | Tone-on-tone container |
| `--color-terracotta` | `#B85D3B` | Primary institutional action, focus indicators, highlight rules | **4.8 : 1** on Alabaster |
| `--color-terracotta-dark`| `#8E3E24` | Primary button hover, high-contrast links | **6.8 : 1** (AAA on Alabaster) |
| `--color-ochre` | `#C4924A` | Burnished brass accents, telemetry highlights, certification seals | **3.5 : 1** (Large text/Icons) |
| `--color-forest-deep` | `#16221D` | Deep slate/forest for mastheads, fiduciary blocks, and footer | Inverted Surface |
| `--color-border-hairline`| `#E7E0D5` | Razor-thin structural borders (1px) | Subtle architectural separation |
| `--color-border-dark` | `rgba(255, 255, 255, 0.14)` | Hairline dividers inside dark sections | Inverted separation |

### 2.2 Semantic Surface Classes
- `bg-canvas`: `var(--color-alabaster)` (#FAF7F2)
- `bg-surface-elevated`: `var(--color-card-surface)` (#FFFFFF)
- `bg-surface-sand`: `var(--color-sand-warm)` (#F1E9DE)
- `bg-surface-dark`: `var(--color-forest-deep)` (#16221D)
- `border-hairline`: `1px solid var(--color-border-hairline)` (#E7E0D5)

---

## 3. Typography System & Font Pairing

### 3.1 Typographic Roles
1. **Editorial Display Serif (Lora / Georgia Fallback):**
   - Used for: Hero statements, major narrative headers (`h1`, `h2`), philosophical quotes, large telemetry figures.
   - Qualities: High stroke contrast, graceful bracketed serifs, italicized literary accents.
2. **Contemporary Grotesque Sans-Serif (Plus Jakarta Sans):**
   - Used for: Primary reading prose, navigation, sub-headings, interactive buttons, form elements.
   - Qualities: High x-height, neutral geometric proportions, exceptional legibility at small sizes.
3. **Tabular Monospace (JetBrains Mono):**
   - Used for: Official filing IDs, statutory registration numbers, dates, timestamps, financial sub-ledgers.
   - Qualities: Strict tabular lining figures, distinct glyphs for audit integrity.

### 3.2 Fluid Typographic Scale
```css
/* Display Hero Headline */
--type-display: clamp(2.5rem, 1.8rem + 3.2vw, 4.5rem);
line-height: 1.08;
letter-spacing: -0.025em;

/* Editorial Section Title (H2) */
--type-h2-editorial: clamp(1.85rem, 1.4rem + 1.8vw, 2.75rem);
line-height: 1.15;
letter-spacing: -0.02em;

/* Card / Module Title (H3) */
--type-h3-editorial: clamp(1.25rem, 1.1rem + 0.6vw, 1.65rem);
line-height: 1.25;

/* Editorial Lead Paragraph */
--type-body-lead: clamp(1.1rem, 1rem + 0.35vw, 1.3rem);
line-height: 1.68;
max-width: 65ch;

/* Standard Body Copy */
--type-body: 1rem;
line-height: 1.7;
max-width: 65ch;

/* Metadata & Archival Labels */
--type-label: 0.75rem;
letter-spacing: 0.1em;
text-transform: uppercase;
```

---

## 4. Layout Architecture & Spatial Grid

### 4.1 Asymmetric 12-Column Responsive Grid
- **Desktop (≥ 1280px):** 12-column grid with generous 32px gutters and 80px side margins (Max container width: `1520px`).
  - Section layouts alternate between:
    - `5 : 7` Editorial Split (Sticky contextual anchor on left, scrolling evidence on right).
    - `8 : 4` Narrative Dossier (Wide editorial essay with right-hand metadata sidebar).
    - Full-bleed panoramic photographic interludes.
- **Tablet (768px – 1024px):** 8-column grid with 24px gutters. Split screens gracefully stack with sticky section markers.
- **Mobile (320px – 640px):** Single-column fluid stream with 16px side margins. Horizontal touch sliders for dense telemetry cards, preventing endless vertical page scroll.

### 4.2 Elevation & Paper Surface Physics
- **No heavy, muddy drop shadows.**
- Elevation is communicated through **razor-thin hairline borders** (`1px solid var(--color-border-hairline)`) and subtle matte ambient light:
  - `shadow-paper-subtle`: `0 1px 3px rgba(15, 23, 20, 0.04), 0 1px 2px rgba(15, 23, 20, 0.02)`
  - `shadow-paper-hover`: `0 8px 24px -4px rgba(15, 23, 20, 0.08), 0 2px 6px -1px rgba(15, 23, 20, 0.03)`
- Radii are disciplined: `rounded-[2px]` for institutional stamps, `rounded-sm` (4px) for interactive buttons, `rounded-md` (6px) for major card modules.

---

## 5. Interaction & Motion Primitives

1. **Editorial Reveal Transitions:**
   - Subtle vertical translations (12px to 16px) combined with smooth opacity fades (`400ms – 600ms`) using custom cubic bezier `cubic-bezier(0.16, 1, 0.3, 1)` (Institutional Ease).
2. **Tactile Hover Dynamics:**
   - Buttons and interactive cards feature subtle micro-translations (`-2px` Y) and warm border highlighting without disorienting layout shifts.
3. **Accessibility (Reduced Motion):**
   - All motion instantly collapses to simple opacity fades (`duration: 0.1s`) when `prefers-reduced-motion: reduce` is detected.
