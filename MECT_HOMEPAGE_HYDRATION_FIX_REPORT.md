# MECT HOMEPAGE REACT HYDRATION MISMATCH FIX & AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-21-1-design-system`  
**Primary Route:** `/` (Institutional Homepage)  
**Status:** FULLY RESOLVED — 100% Deterministic SSR/CSR Hydration  
**Report Date:** November 17, 2026  

---

## 1. Executive Summary

During SSR (Server-Side Rendering) on Next.js 16.4.3 / React 19, the institutional homepage emitted hydration mismatch warnings in the browser console:
```text
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
- opacity: "0" vs 1
- transform: "translateY(14px)" vs "none"
- transform: "translateY(10px)" vs "none"
- Component stack pointing to: src/components/sections/CinematicHero.tsx (239:13) around <ChevronDown />
```

A root-cause forensic investigation revealed that the issue originated from an **asymmetric Reduced-Motion SSR/CSR state split**:
- On the server (Node.js runtime), `window.matchMedia` is absent, causing motion state hooks (`useReducedMotion`) to evaluate to `null` (or `false`).
- In environments or browsers with OS-level reduced motion preferences enabled (common in accessibility settings and Windows OS), the client immediately evaluated `useReducedMotion()` to `true` during the initial mount.
- This discrepancy led to server/client HTML divergence:
  1. `CinematicHero.tsx` line 239: server rendered `className="... animate-bounce"`, client rendered `className="... "` (missing bounce class).
  2. `src/components/ui/MotionPrimitives.tsx`: components (`Reveal`, `StaggerGroup`, `StaggerItem`, `EditorialTextReveal`, `ImageReveal`) had early return branches returning unstyled plain HTML elements (`<Component style={{ opacity: 1, transform: "none" }}>`) instead of the motion elements (`<m.div>`) rendered by SSR.
  3. `src/components/sections/StoriesRailSection.tsx` line 150: server rendered `initial={{ opacity: 0, y: 10 }}` while client rendered `initial={false}` (`style="opacity: 1; transform: none"`).

### Remedy Applied
We eliminated all runtime JS branch branching that altered the initial DOM tree and replaced them with deterministic, SSR-safe styling and Motion's native `<MotionConfig reducedMotion="user">` propagation.

All 18 automated Playwright test scenarios (across 9 viewports in both `reduce` and `no-preference` modes) passed with **0 errors and 0 hydration mismatch warnings**.

---

## 2. Root-Cause Analysis

### 2.1 The Mechanism of Hydration Failure
In React 19 and Next.js App Router:
1. The server renders the component tree to HTML strings.
2. The browser downloads the HTML and renders it immediately.
3. React's client bundle hydrates the DOM by walking the existing DOM nodes and attaching event handlers and reactive state.
4. If an attribute, style, or tag on the client differs from what was rendered on the server during the initial render pass, React emits hydration errors:
   - `Minified React error #418 / #423 / #425`
   - `"A tree hydrated but some attributes of the server rendered HTML didn't match the client properties."`

### 2.2 Asymmetric Hook Behavior (`useReducedMotion`)
In `motion/react` v12.43.0:
- Server execution has `isBrowser = false`. Therefore, `useReducedMotion()` returns `null` or `false`.
- Client execution has `isBrowser = true`. If the client machine has `prefers-reduced-motion: reduce` configured in Windows Settings (`Accessibility > Visual effects > Animation effects = Off`) or macOS/iOS, `useReducedMotion()` immediately returns `true`.
- The following code patterns triggered the exact differences reported:

#### Pattern A: `CinematicHero.tsx:239` (`<ChevronDown />`)
```tsx
// BEFORE (Caused className mismatch):
const shouldReduceMotion = useReducedMotion();
// ...
<ChevronDown
  className={cn(
    "h-4 w-4 text-warm-white/70 transition-colors group-hover:text-primary-gold",
    !shouldReduceMotion && "animate-bounce" // Server rendered 'animate-bounce', client rendered ''
  )}
/>
```

#### Pattern B: `MotionPrimitives.tsx` (`Reveal`, `StaggerGroup`, `StaggerItem`, `EditorialTextReveal`, `ImageReveal`)
```tsx
// BEFORE (Caused tag and inline style mismatch):
export function Reveal({ children, ... }) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    // Client rendered: <div style="opacity: 1; transform: none">...</div>
    return <Component className={className} style={{ opacity: 1, transform: "none" }}>{children}</Component>;
  }
  // Server rendered: <div style="opacity: 0; transform: translateY(14px)">...</div>
  return <m.div initial={{ opacity: 0, y: 14 }} ...>{children}</m.div>;
}
```

#### Pattern C: `StoriesRailSection.tsx:150`
```tsx
// BEFORE (Caused style="opacity: 0; transform: translateY(10px)" mismatch):
const shouldReduceMotion = useReducedMotion();
// ...
<m.div
  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }} // Diverged between server and client
  animate={{ opacity: 1, y: 0 }}
/>
```

---

## 3. Targeted Fixes Implemented

### 3.1 `src/components/sections/CinematicHero.tsx`
- **Action:** Removed `useReducedMotion()` JS hook.
- **Replacement:** Leveraged Tailwind CSS native media variants:
  ```tsx
  <ChevronDown
    className="h-4 w-4 text-warm-white/70 transition-colors group-hover:text-primary-gold motion-safe:animate-bounce motion-reduce:animate-none"
    aria-hidden="true"
  />
  ```
- **Benefit:** Both server and client render the exact same class string. The CSS engine handles whether `animate-bounce` runs based on `@media (prefers-reduced-motion)`. Zero hydration discrepancy.

### 3.2 `src/components/ui/MotionPrimitives.tsx`
- **Action:** Removed early `if (shouldReduceMotion) return ...` bypasses in `Reveal`, `StaggerGroup`, `StaggerItem`, `EditorialTextReveal`, and `ImageReveal`.
- **Architectural Alignment:** In `src/components/motion/MotionProvider.tsx`, MECT wraps the application in:
  ```tsx
  <MotionConfig reducedMotion="user">
  ```
  Framer Motion / Motion natively respects `reducedMotion="user"`. When reduced motion is active, Motion disables transforms and animations internally without altering the initial DOM markup or causing SSR tag discrepancies.

### 3.3 `src/components/sections/StoriesRailSection.tsx`
- **Action:** Removed `useReducedMotion()` JS hook.
- **Replacement:** Changed the tab panel motion container to:
  ```tsx
  <m.div
    key={activeCategory}
    initial={false}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
  ```
- **Benefit:** `initial={false}` ensures the initial SSR render matches the initial client state deterministically with no entrance flash or style divergence, while subsequent tab switches animate smoothly.

---

## 4. Preservation of Architectural Principles

- **No `suppressHydrationWarning`:** Not a single instance of `suppressHydrationWarning` was introduced.
- **No `typeof window !== "undefined"` Hacks:** Render tree is 100% isomorphic and deterministic.
- **Full SSR Retained:** No components were converted into dynamic client-only mounts (`ssr: false`).
- **Full 5-Section Editorial Architecture Preserved:**
  1. `#hero` (`CinematicHero`)
  2. `#institutional-intro` (`InstitutionalIntroSection`)
  3. `#development-pillars` (`DevelopmentPillarsSection`)
  4. `#stories` (`StoriesRailSection`)
  5. `#institutional-impact` (`InstitutionalImpactSection`)
- **Accessibility:** Reduced-motion preferences are fully honored via CSS `motion-safe`/`motion-reduce` and `<MotionConfig reducedMotion="user">`.

---

## 5. Verification Results

### 5.1 Static Type Analysis (`npm run typecheck`)
- Command: `npm run typecheck` (`tsc --noEmit`)
- **Result:** Exit Code 0 (0 errors).

### 5.2 Linting (`npm run lint`)
- Command: `npm run lint` (`eslint`)
- **Result:** 0 errors across the codebase. (4 pre-existing warnings in unrelated chart components).

### 5.3 Production Optimization & Build (`npm run build`)
- Command: `npm run build` (`next build --webpack`)
- **Static Pages Generated:** `41/41` static routes generated successfully.
- **Result:** Exit Code 0.

### 5.4 Automated Hydration & Viewport Regression Matrix
- Test Harness: `scripts/homepage-hydration-regression-phase-fix.mjs` (Playwright with Microsoft Edge engine)
- Criteria: Zero console errors, zero console hydration warnings, 5 sections present, 0px horizontal overflow, hero CTA clickable.

| Scenario # | Viewport | Dimensions | Motion Mode | Hydration Mismatches | Status |
|---|---|---|---|---|---|
| 1 | Mobile S | 320x568 | `reduce` | 0 | **PASSED** |
| 2 | Mobile M | 360x640 | `reduce` | 0 | **PASSED** |
| 3 | iPhone 12/13/14 | 390x844 | `reduce` | 0 | **PASSED** |
| 4 | iPhone Pro Max | 430x932 | `reduce` | 0 | **PASSED** |
| 5 | Tablet Portrait | 768x1024 | `reduce` | 0 | **PASSED** |
| 6 | Tablet Landscape | 1024x768 | `reduce` | 0 | **PASSED** |
| 7 | Laptop | 1280x800 | `reduce` | 0 | **PASSED** |
| 8 | Desktop | 1440x900 | `reduce` | 0 | **PASSED** |
| 9 | Full HD | 1920x1080 | `reduce` | 0 | **PASSED** |
| 10 | Mobile S | 320x568 | `no-preference` | 0 | **PASSED** |
| 11 | Mobile M | 360x640 | `no-preference` | 0 | **PASSED** |
| 12 | iPhone 12/13/14 | 390x844 | `no-preference` | 0 | **PASSED** |
| 13 | iPhone Pro Max | 430x932 | `no-preference` | 0 | **PASSED** |
| 14 | Tablet Portrait | 768x1024 | `no-preference` | 0 | **PASSED** |
| 15 | Tablet Landscape | 1024x768 | `no-preference` | 0 | **PASSED** |
| 16 | Laptop | 1280x800 | `no-preference` | 0 | **PASSED** |
| 17 | Desktop | 1440x900 | `no-preference` | 0 | **PASSED** |
| 18 | Full HD | 1920x1080 | `no-preference` | 0 | **PASSED** |

**Summary: 18 / 18 scenarios PASSED with 0 errors and 0 hydration issues.**

---

## 6. Security Advisory & Next.js Maintenance Disclosure

During build execution, Next.js 16.4.3 reported an upstream security advisory recommendation:
- **Reference:** https://registry.npmjs.org/-/npm/v1/security/advisories/bulk
- **Advisory:** Next.js version 16.4.3 contains a known security vulnerability. Next.js recommends upgrading to the latest patched version.
- **Sequencing Note:** As instructed in the architectural roadmap, Next.js security upgrades are handled in a dedicated maintenance track.

---

## 7. Git Preflight & Preservation Confirmation

- **Active Branch:** `feat/phase-21-1-design-system`
- **Preservation Check:** All existing work, Flyway migrations, payment integrations, and design system components have been preserved intact.
- **Git State:** Clean, unstaged modifications only; no automatic commits, pushes, merges, or discards performed.

---

## 8. Completion Sign-Off

The homepage hydration mismatch is completely resolved. The homepage now renders deterministically on both server and client across all devices, viewports, and accessibility settings.
