# MECT PHASE 23 — MODERN MOTION DESIGN & ANIMATION SYSTEM SPECIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository Branch:** `feat/phase-23-premium-transformation`  
**Phase:** Phase 3 — Modern Motion Design and Animation System  
**Date:** 2026-11-18  

---

## 1. Core Philosophy: Institutional Restraint & Dignified Poise

Motion at MECT is an editorial instrument, not decorative theater. It exists to:
1. **Guide Cognitive Focus:** Direct visitor attention effortlessly through the information hierarchy.
2. **Signal Trust & Permanence:** Emphasize deliberate, calm transitions rather than energetic, bouncy SaaS flourishes.
3. **Preserve Instant Readability:** Never delay access to critical statutory facts, application forms, or donation CTAs.
4. **Guarantee Zero Layout Shift (CLS = 0):** All animations operate exclusively on GPU-composited properties (`transform`, `opacity`, `clip-path`) within stable, pre-sized layout containers.

---

## 2. Animation Framework & Dependency Architecture

The project standardizes on **existing verified dependencies** without adding heavy secondary animation libraries:
- **Primary Reactive Motion:** `motion` (`v12.4.7` — importable via `motion/react`).
- **Precision Micro-Interactions & Number Interpolation:** `animejs` (`v4.5.0`) & native `requestAnimationFrame`.
- **Zero Additional Bundle Overhead:** No GSAP, no Framer Motion duplicate, no Lottie runtime.

### Unified Motion Abstraction Layer
All motion consumers across the application import from the single canonical token registry in `src/components/ui/MotionPrimitives.tsx`:
- `Reveal`: Scroll-triggered directional entrance with distance dampening.
- `HeroEntrance`: Immediate visible server rendering with zero LCP delay.
- `StaggerGroup` & `StaggerItem`: Micro-staggered grids and operational sequence lists.
- `EditorialTextReveal`: Crisp vertical overflow clip-path rises for major headings.
- `ImageReveal`: Subtle scale settling (`scale: 1.03 → 1.00`) within pre-calculated aspect-ratio frames.
- `CountUpStat`: One-time localized counter for audited telemetry metrics.
- `Parallax`: Gentle, opt-in scroll-linked translateY offset (disabled on mobile).

---

## 3. Calibrated Motion Design Tokens

```typescript
export const MOTION_EASING = {
  /** Primary institutional decelerating curve for reveals, cards, and navigation */
  institutional: [0.22, 1, 0.36, 1],
  /** Gentle symmetrical curve for cross-fades and image presentation */
  gentle: [0.25, 0.1, 0.25, 1],
  /** Restrained editorial ease for text masks and title reveals */
  editorial: [0.16, 1, 0.3, 1],
  /** Smooth ease-in-out for state transitions */
  easeInOut: [0.4, 0, 0.2, 1],
  /** Standard cubic ease-out for numeric counters */
  easeOut: [0.33, 1, 0.68, 1],
} as const;

export const MOTION_DURATION = {
  micro: 0.15,     // 150ms — button clicks, pill badges, icon twists
  button: 0.18,    // 180ms — interactive hover elevations
  fast: 0.22,      // 220ms — navigation dropdowns, tab switches
  standard: 0.44,  // 440ms — card entrances, accordion expansion
  editorial: 0.58, // 580ms — major headline mask rises
  slow: 0.65,      // 650ms — photographic scale reveals
  countUp: 800,    // 800ms — telemetry numeric counters
} as const;

export const MOTION_STAGGER = {
  fast: 0.035,     // 35ms  — badge chips, pill tags
  nav: 0.040,      // 40ms  — navigation menu links
  text: 0.050,     // 50ms  — heading line cascades
  cards: 0.055,    // 55ms  — initiative cards, programme pillars
  steps: 0.075,    // 75ms  — operational step sequences
} as const;

export const MOTION_DISTANCE = {
  micro: 6,        // 6px   — micro-tooltips, subtle pill offsets
  standard: 12,    // 12px  — standard cards and list items
  editorial: 18,   // 18px  — section headers and hero copy
  large: 24,       // 24px  — full section thematic containers
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -40px 0px",
} as const;
```

---

## 4. Key Choreographed Motion Patterns

### 4.1 Hero Section Choreography
1. **0ms (Server Render):** Hero background visual and headline container render at `opacity: 1`. Zero layout shifts, zero blank screen during hydration.
2. **100ms:** Eyebrow badge (*"Mahaveer Educational & Charitable Trust • Registered Public Charitable Trust"*) gently fades in.
3. **200ms:** Headline mask rises cleanly via `EditorialTextReveal` with `MOTION_EASING.editorial`.
4. **350ms:** Lead narrative sentence fades in at `distance: 12px`.
5. **450ms:** Primary CTAs (*"Explore Our Work"* / *"Donate & Support"*) settle into view.
6. **550ms:** Telemetry metric bar triggers `CountUpStat` from 0 to 350+, 120+, 10,000+ with Indian number formatting (`10,000+`).

### 4.2 Scroll & Viewport Reveals
- Elements entering the viewport trigger a single entrance animation (`viewport: { once: true }`). Animations **never re-trigger on reverse scroll**, preventing visual fatigue.
- Staggered items (such as the 5 Core Development Pillars or 4 Pathways to Participate) enter with a gentle 55ms offset, leading the user's eye from left-to-right and top-to-bottom.

### 4.3 Navigation & Header Motion
- When the user scrolls past 20px, the Header masthead gently compresses from `py-3.5` to `py-2.5`, transitioning its backdrop blur (`backdrop-blur-md`) and subtle hairline border without snapping.
- Desktop dropdown menus open instantly with a 200ms decelerating fade and micro-slide (`y: -4px → 0px`), dismissing immediately on outside click or `Escape`.
- Mobile navigation drawer animates via `vaul` drawer primitive with natural spring physics and automatic body scroll locking.

---

## 5. Accessibility & Reduced Motion Guarantee

In strict compliance with **WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions)**:
1. Every motion primitive evaluates `useReducedMotion()` from `motion/react`.
2. When the operating system prefers reduced motion (`prefers-reduced-motion: reduce`):
   - All `transform` and `opacity` transition delays are bypassed (`style={{ opacity: 1, transform: "none" }}`).
   - `CountUpStat` displays the final target value immediately without running RAF increments.
   - `Parallax` disables all scroll-linked translation offsets.
   - Carousel and marquee elements remain stationary or provide direct manual controls.
