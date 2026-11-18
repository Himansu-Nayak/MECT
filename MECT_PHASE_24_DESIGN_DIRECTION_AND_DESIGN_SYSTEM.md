# MECT PHASE 24 — DESIGN DIRECTION & DESIGN SYSTEM
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Execution Date:** 18 November 2026  
**Status:** APPROVED DESIGN SYSTEM SPECIFICATION  
**Working Branch:** `feat/phase-24-digital-reinvention`

---

## 1. Evaluation of Three Contemporary Design Directions

To move away from generic NGO tropes (endless green cards, rounded rectangles, repetitive icon grids), we evaluated three contemporary design philosophies:

### Direction A: Contemporary Editorial Institution
- **Characteristics:** Asymmetric layouts, generous whitespace, stark typography contrast with serif editorial headers and clean geometric sans body, quiet confidence, documentary photojournalism style, subtle warm stone/sand/cream tones with deep forest/moss accents.
- **Strengths:** Commands institutional gravitas; conveys high trust, literary warmth, and serious purpose. Fits an irrevocable charitable trust with 13+ years of documented history.
- **Potential Weakness if unmitigated:** Could feel too academic or static without rich visual motion and interactive elements.

### Direction B: Cinematic Human Impact
- **Characteristics:** Full-width documentary photo essays, deep human portraits, immersive storytelling journeys, dark and rich atmospheric palettes, cinematic transitions.
- **Strengths:** Emotionally resonant, authentic, celebrates the dignity of rural Odisha communities.
- **Potential Weakness if unmitigated:** Heavy media overhead if not optimized; can obscure statutory disclosures and technical governance.

### Direction C: Architectural Modernism
- **Characteristics:** Structural grid lines, technical precision, museum-grade typography, monochrome base with selective terracotta/saffron/gold accents, data-driven visualization, clean geometric alignment.
- **Strengths:** Demonstrates meticulous fiduciary discipline, accountability, and modern engineering standards.
- **Potential Weakness if unmitigated:** Can feel overly clinical or corporate if lacking human warmth.

---

## 2. The Selected Direction: "Editorial Humanism with Architectural Discipline"

We synthesize the best traits of all three into a bespoke institutional design language:

```
+--------------------------------------------------------------------------+
|                  EDITORIAL HUMANISM WITH ARCHITECTURAL DISCIPLINE         |
+--------------------------------------------------------------------------+
|  1. Editorial Gravitas (Direction A)                                      |
|     - Lora serif display typography with refined line-heights             |
|     - Asymmetric, narrative-driven content staging                        |
|     - Warm cream, sand, and terracotta palette                            |
+--------------------------------------------------------------------------+
|  2. Cinematic Reality (Direction B)                                       |
|     - High-definition documentary photography from Balangir               |
|     - Micro-location markers, authentic context, no fake stock smiles    |
|     - Full-screen lightbox gallery for documentary proof                  |
+--------------------------------------------------------------------------+
|  3. Architectural Discipline (Direction C)                                |
|     - Precision hairline dividers (border-border-warm / border-forest/20) |
|     - JetBrains Mono audited telemetry counters & statutory badges        |
|     - Interconnected safety net flow diagrams                             |
|     - Interactive 3D WebGL structural exploration                         |
+--------------------------------------------------------------------------+
```

---

## 3. Design System Tokens & Specifications

### 3.1 Typography Hierarchy

| Style Role | Font Family | Weight | Scaling Range | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Editorial Display** | Lora (Serif) | Bold (700), SemiBold (600) | `clamp(2rem, 5vw, 3.75rem)` | Hero headlines, primary section titles |
| **Editorial Subheading** | Lora (Serif) | Medium (500), Regular (400) | `clamp(1.25rem, 2.5vw, 1.75rem)` | Section subtitles, narrative callouts |
| **Interface & Body** | Plus Jakarta Sans (Geometric Sans) | Regular (400), Medium (500), SemiBold (600) | `13px` to `16px` | Paragraph prose, UI buttons, navigation, cards |
| **Telemetry & Codes** | JetBrains Mono (Monospace) | Regular (400), Bold (700) | `10px` to `13px` | Statutory URNs, Deed numbers, telemetry timestamps, metric labels |

### 3.2 Color Palette & Semantic Assignment

- **Deep Forest (`#1D2924` / `bg-forest-deep`):** Primary institutional brand background, cinematic hero backdrop, primary footer container. Represents enduring roots, trust, and permanence.
- **Forest Medium (`#283730` / `bg-forest`):** Secondary dark container, badges, primary button surfaces, icon backdrops.
- **Terracotta Clay (`#A45E44` / `text-terracotta`, `bg-terracotta`):** Vibrant civic accent, energetic action callouts, high-priority interactive touchpoints.
- **Terracotta Dark (`#874A35`):** High-contrast text links, hover states, active indicators.
- **Sand Gold (`#E5C499` / `text-sand`, `bg-sand`):** Warm highlights, badge accents, subtle borders on dark backgrounds.
- **Cream (`#FDFBF7` / `bg-cream`):** Primary page canvas. Eliminates harsh artificial pure white (`#FFFFFF`) in favor of warm, human parchment.
- **Sand Light (`#F3E4D2` / `bg-sand-light`):** Subtle secondary panel background, card highlights, table striping.
- **Ink Primary (`#1A2421` / `text-ink`):** Highest contrast reading text for maximum readability (WCAG AAA compliant on cream).
- **Ink Sand / Slate (`#5A6B64` / `text-ink-sand`):** Secondary metadata, sub-labels, timestamps, captions.

### 3.3 Structural & Grid Architecture

- **Page Container Max Width:** `1280px` (`max-w-7xl` in standard containers), `960px` in focused narrative / article reads (`max-w-4xl`).
- **Horizontal Paddings:** `px-4 sm:px-6 lg:px-8` ensuring perfect edge margins on all devices.
- **Borders & Dividers:** Subtle, structural hairlines (`border-border-warm` `#DDD4C7` on light backgrounds; `border-sand/20` or `border-white/15` on dark backgrounds).
- **Border Radius:** Clean, modern, restrained radius tokens: `rounded-xs` (4px), `rounded-sm` (6px), and `rounded-md` (8px). Eliminates childish, oversized round pills.

### 3.4 Motion & Interactive Micro-Physics

- **Library:** `motion/react` (Motion v12 / Framer Motion).
- **Easing Function:** Cubic bezier curve `[0.16, 1, 0.3, 1]` (smooth deceleration, zero rubber-banding).
- **Duration Scale:**
  - Micro-interactions (hover, tap, toggle): `150ms` - `200ms`
  - Entrance animations: `350ms` - `500ms`
  - Deep narrative transitions: `600ms`
- **Accessibility:** Full native support for `prefers-reduced-motion`. When active, motion triggers automatically degrade to instant opacity fades or pure CSS layout stability with zero translation transforms.
