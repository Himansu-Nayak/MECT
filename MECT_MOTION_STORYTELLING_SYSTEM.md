# MECT — MOTION STORYTELLING SYSTEM SPECIFICATION

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Classification:** Motion Design Tokens, Animation Choreography & Accessibility Specification  
**Effective Date:** 2026-11-18  

---

## 1. Institutional Motion Philosophy

Motion at MECT serves as an editorial guide, pacing the visitor through the narrative steps of **Discover → Understand → Differentiate → Believe → Trust → Connect → Act**.

### Principles:
1. **Calm Deceleration (Zero Bouncing):** The tone is established, dignified, and reflective. Springs with high overshoot or playful SaaS elasticity are prohibited.
2. **Instant LCP & Zero Shift (CLS = 0):** Above-the-fold hero content renders at `opacity: 1` immediately on the server. Below-the-fold animations operate strictly on GPU-composited `transform`, `opacity`, and `clip-path` within fixed-dimension wrappers.
3. **Strict Accessibility Compliance (WCAG 2.2 AA SC 2.3.3):** Full integration with `useReducedMotion()` from `motion/react`. When reduced motion is preferred by the operating system, all transition delays and transform offsets are bypassed immediately (`style={{ opacity: 1, transform: "none" }}`).

---

## 2. Canonical Token Architecture (`src/components/ui/MotionPrimitives.tsx`)

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
  micro: 0.15,     // 150ms — button micro-clicks, pills, icon tilts
  button: 0.18,    // 180ms — interactive card hover elevation
  fast: 0.22,      // 220ms — navigation dropdowns, tab changes
  standard: 0.44,  // 440ms — card entrances, accordion expansion
  editorial: 0.58, // 580ms — headline mask overflow rises
  slow: 0.65,      // 650ms — photographic scale reveals
  countUp: 800,    // 800ms — telemetry numeric counters
} as const;

export const MOTION_STAGGER = {
  fast: 0.035,     // 35ms  — badge chips, pill tags
  nav: 0.040,      // 40ms  — navigation menu links
  text: 0.050,     // 50ms  — heading line cascades
  cards: 0.055,    // 55ms  — development pillar cards
  steps: 0.075,    // 75ms  — operational step sequences
} as const;

export const MOTION_DISTANCE = {
  micro: 6,        // 6px   — micro-offsets
  standard: 12,    // 12px  — cards and list items
  editorial: 18,   // 18px  — section headers and hero copy
  large: 24,       // 24px  — full section containers
} as const;

export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -40px 0px",
} as const;
```

---

## 3. Key Storytelling Motion Patterns

1. **Cinematic Hero Entrance:**
   - Pre-rendered server markup ensures 0ms Largest Contentful Paint (LCP).
   - Eyebrow badge fades in at 100ms.
   - Main headline rises cleanly from an overflow-hidden clip container (`EditorialTextReveal`) with `MOTION_EASING.editorial`.
   - Primary and secondary CTAs settle smoothly into view with zero bouncing.
2. **Staggered Development Pillars:**
   - The 5 focus areas enter sequentially using `StaggerGroup` with a 55ms offset, guiding the reader naturally across the multi-sector safety net.
3. **Audited Telemetry Counters:**
   - Telemetry figures (350+, 120+, 10,000+) use `CountUpStat` with Indian number formatting (`10,000+`) and cubic deceleration over 800ms upon scrolling into view.
4. **Interactive 3D Monument Orbit:**
   - The proposed Hanuman Murti monument supports smooth pointer/touch 3D yaw and tilt orbiting with continuous specular golden light calculation.
