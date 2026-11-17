# MECT PHASE 21.2 — ADVANCED MOTION ARCHITECTURE & INTERACTION ENGINE
## Principal Engineering Implementation & Final Quality Acceptance Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Working Branch:** `feat/phase-21-1-design-system`  
**Reference Character:** Agrumea Farm (`https://www.agrumeafarm.it/en`) — Restrained, editorial, institutional, purposeful motion  
**Final Status:** **PHASE 21.2 — ACCEPTED** (Phase 21.2 ONLY — Motion architecture and primitives fully verified with real browser execution; Phase 21.3 is not started)

---

## 1. Executive Summary

Phase 21.2 establishes a unified, high-performance, accessible motion foundation for the Mahaveer Educational & Charitable Trust (MECT) web platform. Guided by the editorial restraint and institutional dignity demonstrated by Agrumea Farm, the motion system replaces ad-hoc transitions and inconsistent animations with a calibrated token architecture and robust component primitives.

### Key Deliverables:
1. **Installed Engine Verification:** Verified the existing `motion` package at version `12.43.0` (`motion/react` entry point) operating under Next.js 16.4.3 and React 19. Zero additional dependencies were introduced.
2. **Standardised Motion Tokens:** Standardized easing cubic beziers (`[0.22, 1, 0.36, 1]`), durations (150ms–900ms), stagger offsets (35ms–85ms), and scroll threshold parameters.
3. **Engineered Motion Primitives (`src/components/ui/MotionPrimitives.tsx` & `src/components/motion/index.ts`):**
   - `Reveal`: Directional entrance (`up`, `down`, `left`, `right`, `fade`) with distance and delay controls.
   - `HeroEntrance`: Zero-delay, zero-CLS entrance for Above-The-Fold elements ensuring optimal LCP.
   - `StaggerGroup` & `StaggerItem`: Coordinated cascade orchestration with directional offsets.
   - `EditorialTextReveal`: Heading overflow-clip mask reveals with semantic HTML element tag selection.
   - `ImageReveal` & `GalleryReveal`: Restrained image container zoom/pan reveals with overflow containment.
   - `Parallax`: Gentle scroll-linked translation automatically disabled on mobile screens (<768px) and reduced-motion environments.
   - `CountUpStat`: Frame-budgeted count-up engine with Indian numerical formatting (`en-IN`), SSR fallback, cancellation cleanup, and reduced-motion instantaneous completion.
4. **CSS Animation Infrastructure (`src/app/globals.css`):** Resolved previously unsupported Tailwind classes (`animate-in`, `fade-in`, `slide-in-from-bottom-2`) across the application using GPU-accelerated `@utility` definitions without third-party plugins.
5. **Accessibility & Reduced Motion:** Full reduced-motion integration via `useReducedMotion()`, CSS `@media (prefers-reduced-motion: reduce)`, immediate layout rendering, and zero perceptual flicker.
6. **Automated Multi-Viewport & Isolated QA Verification:** Verified 7 standard viewports (320px, 360px, 390px, 768px, 1024px, 1440px, 1920px) under normal and reduced-motion states with headless browser automation, capturing screenshots with zero horizontal overflow, zero console errors, measured CLS of `0.0011`, and zero long animation tasks.

---

## 2. Baseline Architecture Audit

Prior to implementation, an audit of the repository was conducted:

| Component / Subsystem | Pre-Implementation State | Audit Finding | Resolution in Phase 21.2 |
|---|---|---|---|
| `motion` package | Installed (`12.43.0`) | Modern `motion/react` entry point available. | Verified and pinned; avoided deprecated `framer-motion` aliases. |
| `src/components/ui/MotionPrimitives.tsx` | Partial implementation | Missing standard easing tokens; `CountUpStat` lacked `en-IN` formatting and had no mobile parallax guards. | Completely rewritten with comprehensive token architecture and primitives. |
| `src/components/motion/index.ts` | Partial re-exports | Diverged from `ui/MotionPrimitives.tsx`. | Synchronized to re-export all primitives, hooks, and token constants. |
| `animate-in` / `fade-in` CSS classes | Present in modal, chatbot, and form components | Classes were no-ops because `tailwindcss-animate` was not installed in Tailwind CSS v4. | Defined native `@utility` classes with GPU keyframes in `globals.css`. |
| `CountUpStat` | Basic rAF loop | Layout shift during hydration; no immediate rendering on reduced motion. | Implemented SSR pre-rendering with `tabular-nums` and instantaneous display when reduced motion is preferred. |
| Reduced Motion Support | Incomplete | Some motion components ignored user system preferences. | Universal `useReducedMotion()` integration across all primitives and CSS overrides. |

---

## 3. Motion Token Architecture

All animations derive from strict mathematical tokens defined in `src/components/ui/MotionPrimitives.tsx`:

### 3.1 Easing Curves
```typescript
export const MOTION_EASING = {
  institutional: [0.22, 1, 0.36, 1] as [number, number, number, number], // Smooth editorial cubic-bezier (default)
  gentle: [0.25, 0.1, 0.25, 1] as [number, number, number, number],       // Subtle deceleration
  editorial: [0.16, 1, 0.3, 1] as [number, number, number, number],        // Dramatic editorial reveal
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],         // Smooth symmetric transition
} as const;
```

### 3.2 Durations
```typescript
export const MOTION_DURATION = {
  micro: 0.15,      // 150ms - Micro-interactions (hover, focus, toggles)
  fast: 0.2,        // 200ms - Tooltips, dropdowns, badges
  standard: 0.42,   // 420ms - Cards, accordions, tabs
  editorial: 0.58,  // 580ms - Section headers, text reveals, image reveals
  slow: 0.72,       // 720ms - Hero backgrounds, atmospheric transitions
  countUp: 900,     // 900ms - Impact statistics count-up
} as const;
```

### 3.3 Stagger Offsets
```typescript
export const MOTION_STAGGER = {
  fast: 0.035, // 35ms - Fast item grids
  nav: 0.04,   // 40ms - Navigation menu items
  text: 0.05,  // 50ms - Lines of editorial text
  cards: 0.065,// 65ms - Content card lists
  steps: 0.085,// 85ms - Timeline / process steps
} as const;
```

### 3.4 Spatial Displacement
```typescript
export const MOTION_DISTANCE = {
  micro: 6,     // 6px - Subtle hover or focus shifts
  standard: 14, // 14px - Standard component entrance
  editorial: 22,// 22px - Section and heading reveals
  large: 32,    // 32px - Hero and major feature reveals
} as const;
```

### 3.5 Viewport Thresholds
```typescript
export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.08,
  margin: "0px 0px -30px 0px",
} as const;
```

---

## 4. Component Primitives Implementation

### 4.1 `Reveal`
Provides directional, viewport-triggered entrance animation.
- **Directions:** `up`, `down`, `left`, `right`, `fade`.
- **Configurability:** `distance`, `duration`, `delay`, `tone`, `as` semantic tag.
- **Reduced Motion Behavior:** Renders instantly at `opacity: 1, transform: none`.

### 4.2 `HeroEntrance`
Optimized specifically for Above-The-Fold hero elements to safeguard Core Web Vitals:
- Uses 0ms initial delay.
- Immediate `opacity: 1, transform: none` layout styling for optimal Largest Contentful Paint (LCP).

### 4.3 `StaggerGroup` & `StaggerItem`
Orchestrates sequential entrances for grid cards, navigation lists, and institutional process steps.
- Supports configurable parent delay and stagger step intervals.
- `StaggerItem` supports customizable entrance directions (`up`, `down`, `left`, `right`, `fade`).

### 4.4 `EditorialTextReveal`
Creates high-end editorial heading masks inspired by Agrumea Farm:
- Employs an outer wrapper with `overflow: hidden`.
- Animates an inner `m.span` translating vertically within the clipping boundary.
- Accepts semantic heading tag prop `as` (`h1`, `h2`, `h3`, `h4`, `p`, `span`, `div`).
- Renders statically without translation when reduced motion is detected.

### 4.5 `ImageReveal` & `GalleryReveal`
Delivers institutional image presentations:
- Outer wrapper preserves `overflow: hidden` with configurable border radii and aspect ratios.
- Inner image element undergoes a subtle scale settle (`1.03` → `1.0`) combined with an opacity fade on viewport entry.
- Statutory documents, donation QR codes, and banking details are kept separate from decorative scale/pan effects.

### 4.6 `Parallax`
Implements subtle scroll-coupled translation:
- Bound to container `useScroll`.
- **Mobile Guard:** Automatically disabled when screen width is under 768px via resize listener and media checks.
- **Accessibility Guard:** Automatically disabled when `prefers-reduced-motion` is active.
- **Memory Safety:** Cleans up listeners on unmount; maintains stable DOM structure.

### 4.7 `CountUpStat`
Calculates and animates numerical impact metrics:
- **Frame-Budgeted Engine:** Leverages `requestAnimationFrame` with performance-timestamp easing.
- **Clean Cancellation:** Cleans up active rAF loops on component unmount or target value changes.
- **Zero CLS Fallback:** Pre-renders formatted target numbers during SSR to prevent layout shifts.
- **Indian Number System:** Formats metrics using `en-IN` (e.g., `1,00,000+` or `₹50,000`) with support for prefixes and suffixes.
- **Reduced Motion:** Skips animation completely, displaying the target value immediately upon mounting.

---

## 5. CSS Animation Audit & Remediation

Inspection of the codebase identified instances of `animate-in`, `fade-in`, and `slide-in-from-bottom-2` in components such as `Contact.tsx`, `Volunteer.tsx`, `QuickActionDock.tsx`, and `HImChatbot.tsx`. Because Tailwind CSS v4 is used without `tailwindcss-animate`, these classes had no effect.

Rather than installing an external package, native GPU-accelerated keyframes and utility rules were embedded directly into `src/app/globals.css`:

```css
@keyframes mect-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes mect-slide-in-bottom-2 {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@utility animate-in {
  animation-duration: 240ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: both;
}

@utility fade-in {
  animation-name: mect-fade-in;
}

@utility slide-in-from-bottom-2 {
  animation-name: mect-slide-in-bottom-2;
}

@media (prefers-reduced-motion: reduce) {
  .animate-in,
  .fade-in,
  .slide-in-from-bottom-2 {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 6. Multi-Viewport Baseline QA

Automated browser QA was conducted using Microsoft Edge headless execution against a compiled Next.js production build (`http://localhost:3220`).

### 6.1 Test Suite Parameters
- **Pages Evaluated:**
  - `/` (Home)
  - `/about` (About Us)
  - `/programmes` (Programmes & Impact)
  - `/csr-partnerships` (CSR Partnerships)
- **Viewports Evaluated:**
  1. `320px` (320 × 640 — Minimum supported mobile)
  2. `360px` (360 × 740 — Standard compact Android)
  3. `390px` (390 × 844 — Standard iOS iPhone)
  4. `768px` (768 × 1024 — Tablet portrait / iPad)
  5. `1024px` (1024 × 768 — Tablet landscape / Small laptop)
  6. `1440px` (1440 × 900 — Desktop high-density standard)
  7. `1920px` (1920 × 1080 — Full HD widescreen)
- **Special Conditions:**
  - Reduced Motion (`prefers-reduced-motion: reduce`) tested at `360px` and `1440px`.

### 6.2 QA Results Matrix

| Viewport | Mode | Tested Pages | Horizontal Overflow | H1 Visibility | Stat Counter Behavior | Console Errors |
|---|---|---|---|---|---|---|
| **320px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **360px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **390px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **768px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **1024px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **1440px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **1920px** | Normal | 4 | PASS (0px) | PASS (100% visible) | PASS (13+ Years, 350+, 200) | 0 |
| **360px** | Reduced Motion | 4 | PASS (0px) | PASS (Instant visible) | PASS (Instant target render) | 0 |
| **1440px** | Reduced Motion | 4 | PASS (0px) | PASS (Instant visible) | PASS (Instant target render) | 0 |

---

## 7. Build and Verification Suite Results

All standard verification gates completed with zero errors:

```bash
# 1. TypeScript Strict Typechecking
$ npm run typecheck
> mect@0.1.0 typecheck
> tsc --noEmit
# Result: Exit code 0 (Zero type errors)

# 2. ESLint Static Analysis
$ npm run lint
> mect@0.1.0 lint
> eslint .
# Result: Exit code 0 (Zero errors; 4 pre-existing warnings in unreferenced charts/ directory)

# 3. Production Compilation & Prerendering
$ npm run build
> mect@0.1.0 build
> node scripts/check-confirm.mts && next build --webpack
▲ Next.js 16.4.3 (webpack)
✓ Compiled successfully in 7.6s
✓ Running TypeScript (5.5s)
✓ Generating static pages (40/40) in 4.0s
# Result: Exit code 0 (All 40 routes compiled and prerendered cleanly)
```

---

## 8. Working Tree & Git Status

Per strict safety constraints, all pre-existing uncommitted backend files and Phase 21.1 deliverables remain preserved without destructive operations:

```
Branch: feat/phase-21-1-design-system

Modified (Phase 21.2 & Phase 21.1):
  M src/app/globals.css
  M src/app/layout.tsx
  M src/components/PageHero.tsx
  M src/components/motion/index.ts
  M src/components/ui/MotionPrimitives.tsx
  M src/components/ui/SectionHeader.tsx

Preserved Unrelated Backend Work:
  M backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java
  M backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java
  ?? backend/src/main/java/org/mahavirtrust/backend/dto/him/
  ?? backend/src/main/java/org/mahavirtrust/backend/entity/HimPaymentAttempt.java
  ?? backend/src/main/java/org/mahavirtrust/backend/entity/HimWebhookEvent.java
  ?? backend/src/main/java/org/mahavirtrust/backend/repository/HimPaymentAttemptRepository.java
  ?? backend/src/main/java/org/mahavirtrust/backend/repository/HimWebhookEventRepository.java
  ?? backend/src/main/java/org/mahavirtrust/backend/service/him/
  ?? backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java
  ?? backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql

Phase Documentation & Artifacts:
  ?? MECT_PHASE_21_1_DESIGN_SYSTEM_IMPLEMENTATION_REPORT.md
  ?? MECT_PHASE_21_2_MOTION_ARCHITECTURE_REPORT.md
  ?? reports/screenshots/
  ?? scripts/motion-final-qa.mjs
  ?? scripts/motion-qa-phase21-2.mjs
```

---

## 9. Final Motion Verification & Quality Acceptance

To fulfill the requirements of the Supplementary Engineering QA, a dedicated isolated fixture and automation harness (`scripts/motion-final-qa.mjs`) were deployed and executed on a standalone test port (`http://localhost:3230`). The temporary test fixture was completely removed after verification.

### 9.1 Component-by-Component Empirical Test Results

| Component | Target Tested | Initial State | Viewport Trigger / Animation | Completed State | Status |
|---|---|---|---|---|---|
| **`HeroEntrance`** | `#hero-title` & wrapper | `opacity: 1`, `transform: none` | Immediate render (0ms delay) | `opacity: 1`, `transform: none` | **PASS** |
| **`Reveal` (Up)** | `#reveal-up` | `opacity: 0`, `translateY(14px)` | Decelerates on in-view | `opacity: 1`, `transform: none` | **PASS** |
| **`Reveal` (Down)** | `#reveal-down` | `opacity: 0`, `translateY(-14px)` | Decelerates on in-view | `opacity: 1`, `transform: none` | **PASS** |
| **`Reveal` (Left)** | `#reveal-left` | `opacity: 0`, `translateX(-14px)` | Decelerates on in-view | `opacity: 1`, `transform: none` | **PASS** |
| **`Reveal` (Right)** | `#reveal-right` | `opacity: 0`, `translateX(14px)` | Decelerates on in-view | `opacity: 1`, `transform: none` | **PASS** |
| **`Reveal` (Fade)** | `#reveal-fade` | `opacity: 0`, `transform: none` | Fades on in-view | `opacity: 1`, `transform: none` | **PASS** |
| **`StaggerGroup` & `Item`** | 4 Process steps | Hidden state with parent stagger | Sequential cascade (35ms step) | All 4 visible in sequence | **PASS** |
| **`EditorialTextReveal`** | `<h2>` & `<p>` masks | Container `overflow: hidden` | Vertical rise within mask | `opacity: 1`, mask clipped | **PASS** |
| **`ImageReveal`** | Classroom Image | `opacity: 0` (before scroll) | Settle scale `1.03 → 1.0` | `opacity: 1` (after scroll) | **PASS** |
| **`GalleryReveal`** | Dispensary Image | Container `overflow: hidden` | Settle scale `1.03 → 1.0` | `opacity: 1` (after scroll) | **PASS** |
| **`Parallax` (Desktop)** | Heritage Card | Initial matrix offset | Smooth translation on scroll | Delta: `16.83px` movement | **PASS** |
| **`Parallax` (Mobile)** | Mobile Viewport (375px) | Transform `none` | Scroll applied | Transform stays `none` | **PASS** |
| **`CountUpStat`** | 7 format cases | Target string SSR rendered | Smooth deceleration rAF loop | Exact target string restored | **PASS** |
| **Native CSS Animate** | Modal Target | Class `animate-in` attached | Keyframe `mect-slide-in-bottom-2` | `opacity: 1, duration: 0.24s` | **PASS** |

### 9.2 Parallax Movement Verification
- **Desktop Scroll Test:** Measured element matrix transform before scroll (`matrix(1, 0, 0, 1, 0, 8.169)`) and after mouse wheel scroll (`matrix(1, 0, 0, 1, 0, 25)`). Verified dynamic translation delta with zero layout shifts.
- **Mobile Suppression Test (<768px):** At 375px viewport, measured transform before and after scroll: both evaluated strictly to `none`. Scroll-linked movement is cleanly disabled on mobile.
- **Unmount Cleanliness:** Toggled unmount via state button; element unmounted cleanly with zero dangling event listeners and zero console errors.

### 9.3 Numerical Counter (CountUpStat) Verification Matrix

| Format Case | Input Value | Initial SSR Output | Mid-Animation Behavior | Final Completed Display | Reduced Motion Display |
|---|---|---|---|---|---|
| Simple Counter | `"13+"` | `"13+"` | Integer count `1+ → 13+` | `"13+"` | `"13+"` (Immediate) |
| Standard Metric | `"350+"` | `"350+"` | Integer count `1+ → 350+` | `"350+"` | `"350+"` (Immediate) |
| Thousands Grouping | `"1,000+"` | `"1,000+"` | Grouped count with `en-IN` | `"1,000+"` | `"1,000+"` (Immediate) |
| Large Metric | `"10,000+"` | `"10,000+"` | Smooth cubic deceleration | `"10,000+"` | `"10,000+"` (Immediate) |
| Currency Prefix | `"₹50,000"` | `"₹50,000"` | Prefix preserved throughout | `"₹50,000"` | `"₹50,000"` (Immediate) |
| Indian Lakhs | `"1,00,000+"` | `"1,00,000+"` | Indian format grouping (`1,00,000`) | `"1,00,000+"` | `"1,00,000+"` (Immediate) |
| Decimal Percentage | `"99.5%"` | `"99.5%"` | Decelerates to target | `"99.5%"` | `"99.5%"` (Immediate) |

*All actual institutional impact figures in existing content files were strictly preserved.*

### 9.4 Reduced-Motion Verification (`prefers-reduced-motion: reduce`)
Emulating `prefers-reduced-motion: reduce` in the browser confirmed:
- All content (`HeroEntrance`, `Reveal`, `EditorialTextReveal`, `ImageReveal`) renders at `opacity: 1, transform: none` immediately upon mount.
- `CountUpStat` does not execute rAF ticking; displays the final target value immediately.
- `Parallax` translation is inactive.
- CSS utilities `.animate-in`, `.fade-in`, and `.slide-in-from-bottom-2` evaluate computed styles to `animation: none`, `opacity: 1`, `transform: none`.
- No vestibular triggers or excessive motions occur.

### 9.5 Performance Measurements
Measured using in-browser `PerformanceObserver` APIs during active motion and scroll:
- **Cumulative Layout Shift (CLS):** **`0.0011`** (far below the Google Core Web Vitals threshold of `< 0.1`).
- **Long Tasks Count:** **`0`** tasks > 50ms detected during animation execution.
- **Console Errors:** **`0`** errors logged during execution across all viewports.
- **Off-screen Paint Prevention:** Verified that `ImageReveal` elements outside the initial viewport remain at `opacity: 0` until scrolled into view, preventing unnecessary GPU off-screen rasterization.

### 9.6 Exact Commands Executed
1. `npm run typecheck` (`tsc --noEmit`) → Code 0 (PASS)
2. `npm run lint` (`eslint .`) → Code 0 (PASS, 0 errors, 4 pre-existing warnings)
3. `npm run build` (`node scripts/check-confirm.mts && next build --webpack`) → Code 0 (PASS, 40 static pages prerendered)
4. `node scripts/motion-final-qa.mjs` → Code 0 (PASS, all primitives and performance checks passed)

### 9.7 Remaining Defects
- **Zero (0)** defects in motion architecture, tokens, or component primitives.
- **4 pre-existing warnings** in `src/components/charts/` (`bar-chart.tsx`, `pie-ticks.tsx`, `chart-tooltip.tsx`), which are preserved per scope restrictions.

---

## 10. Phase Acceptance Decision

**FINAL STATUS: PHASE 21.2 — ACCEPTED**

All quality gates, primitive verifications, accessibility guarantees, and performance criteria for Phase 21.2 are met and empirically validated.

Per the master prompt instructions, execution stops here. Phase 21.3 (Public Experience & Institutional Storytelling Redesign) will not be initiated without explicit instructions from the user.
