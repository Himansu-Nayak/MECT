# MECT PHASE 27 — MOTION & INTERACTION DESIGN SYSTEM

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-27-immersive-motion-hd-excellence`  
**Phase:** Phase 27 — Immersive Motion, HD Excellence & Intelligent Deduplication  
**Status:** PRODUCTION MOTION SPECIFICATION DEFINED  

---

## 1. System Philosophy: Purposeful Institutional Motion

Motion at MECT is not decorative animation; it is an **editorial storytelling instrument**.

Every animation must:
1. **Guide visitor attention** to institutional evidence, factual qualifications, and participation pathways.
2. **Convey dignity, stability, and gravitas** — using calm deceleration curves without bouncy or playful spring physics.
3. **Enhance perceived performance** — rendering the page instantly (Zero CLS, no artificial loading gates) while content gracefully unfolds.
4. **Respect accessibility boundaries** — honoring `prefers-reduced-motion` unconditionally across all devices.

---

## 2. Motion Token Architecture

### 2.1 Cubic Bézier Curves
```typescript
export const MOTION_EASING = {
  /** Primary institutional decelerating curve for cards, sections, and navigation */
  institutional: [0.22, 1, 0.36, 1] as const,
  /** Literary editorial ease for headlines and textual mask reveals */
  editorial: [0.16, 1, 0.3, 1] as const,
  /** Symmetrical gentle curve for documentary photo fades and zoom settling */
  gentle: [0.25, 0.1, 0.25, 1] as const,
  /** Linear smooth curve for continuous ambient lighting and 3D rotation */
  linear: [0, 0, 1, 1] as const,
};
```

### 2.2 Duration Scale
- `micro`: `150ms` — Button micro-press, checkbox check, link underline.
- `fast`: `220ms` — Navigation disclosure popover, icon translation.
- `standard`: `380ms` — Card elevation, tab switching, telemetry indicator fill.
- `editorial`: `560ms` — Heading overflow rise, photo zoom-settle.
- `cinematic`: `750ms` — Hero entrance orchestration, modal window expansion.

### 2.3 Stagger Intervals
- `nav`: `35ms` — Sequential menu link reveal.
- `cards`: `55ms` — Sequential grid item entrance.
- `ledger`: `75ms` — Chronological statutory principles sequence.

---

## 3. Cinematic Page Entrance & Hero Choreography

To guarantee fast LCP and immediate usability, the website **never displays a full-screen loading screen**. The DOM is interactive instantly upon load, with CSS transforms hardware-accelerated via `will-change: transform, opacity`.

```
Timeline:
[ 0ms ]   DOM Interactive & Layout Settled (Zero CLS)
    │
[ 100ms ] Archival Tag fades & translates up (8px)
    │
[ 250ms ] Main Headline Line 1 rises through masked overflow
    │
[ 420ms ] Italicized Accent Line 2 rises into position
    │
[ 560ms ] Contextual Deck Copy & Dual CTAs fade in smoothly
    │
[ 700ms ] Hero Documentary Photograph scales from 1.04 to 1.0 with subtle opacity settle
    │
[ 820ms ] Clause XVI Floating Guarantee Plaque translates into place
    │
[ 950ms ] Live Telemetry Count-Up Ribbon triggers
```

---

## 4. Scroll Choreography & Storytelling

### 4.1 Strict No-Hijacking Rule
- The native browser scroll mechanism is **strictly preserved**.
- No mousewheel interception, no forced velocity alterations, and no artificial scroll locks.

### 4.2 Viewport Triggers
- Sections and components trigger animation only once (`once: true`) when entering the viewport:
  - `margin: "0px 0px -50px 0px"`
  - `amount: 0.15` (15% visibility threshold).
- Transform offsets are restrained: `12px` to `18px` maximum vertical translation to prevent disorienting jumps.

---

## 5. Living Interconnected Safety Net Interactions

In Section 03 & 04 (`InterconnectedSafetyNetSection`), the 5 intervention pillars form a living causal ecosystem:
1. **Interactive Node Selection:** Clicking or keyboard-navigating (`ArrowLeft`/`ArrowRight`) to a pillar smoothly highlights the active node using Framer Motion's `layoutId="active-pillar-pill"`.
2. **Causal Vector Animation:** An animated SVG flow indicator visualizes the cause-and-effect relationship between upstream water/nutrition security and downstream educational success.
3. **Smooth Dossier Transition:** Dossier text transitions with cross-fade (`opacity: 0 -> 1`, duration: `220ms`), preventing sudden container height shifts.

---

## 6. Museum Lightbox Modal Experience

In Section 06 (`DocumentaryFieldExhibitionSection`):
1. **Entrance:** Modal backdrop blurs and fades (`duration: 200ms`). Photograph smoothly scales into focus from center.
2. **Sequential Browsing:** Full keyboard navigation support:
   - `ArrowRight`: Next documentary field dispatch.
   - `ArrowLeft`: Previous field dispatch.
   - `Escape`: Close modal with focus restoration to the originating thumbnail button.
3. **Accessibility:** Focus is trapped inside the active modal dialog; background body scroll is locked gracefully with padding compensation to eliminate scrollbar jump.

---

## 7. Accessibility & Motion Safety (`prefers-reduced-motion`)

Compliance with WCAG 2.2 AA/AAA motion guidelines is absolute:
- When a user has enabled reduced motion in their OS:
  - All translations (`y`, `x`) collapse to `0px`.
  - All scale animations collapse to `1.0`.
  - Durations reduce to instantaneous or `100ms` opacity fades.
  - Telemetry counters render immediately at their final verified values (`350+`, `120+`, `10,000+`) without count-up rolling.
  - 3D WebGL scenes render in static, resting camera angles with zero auto-rotation.
