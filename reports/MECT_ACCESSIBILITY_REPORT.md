# MECT Accessibility Report

**Audit Date:** 2026-11-10
**Standard:** WCAG 2.2 Level AA & Semantic HTML Verification

---

## 1. Key Accessibility Verifications Performed

| Check Category | Implementation & Test Observation | Status |
|---|---|---|
| WCAG 2.2 SC 2.2.2 (Pause, Stop, Hide) | Added keyboard-accessible **Pause Gallery / Play Gallery** toggle button (`aria-pressed={isPaused}`, `min-h-[36px]`) pausing both CSS tracks (`animationPlayState: paused`), plus hover and `focus-within` pause rules. Verified interactively in Playwright. | PASS |
| `prefers-reduced-motion: reduce` | Emulated `reducedMotion: "reduce"` at `1440px`. Animations stop (`animationName: none`), duplicated clone sequences are hidden (`display: none`), and all 6 unique photos render in a calm symmetrical 3×2 grid with `0` overflow. | PASS |
| Reduced Motion SSR Hydration Fix | Caught and fixed an SSR hydration mismatch in `HeroEntrance` (`MotionPrimitives.tsx`) where SSR `initial={{ opacity: 0 }}` left hero content at `opacity: 0` when switching to reduced-motion static rendering; `HeroEntrance` now renders immediately at `opacity: 1`. | PASS |
| Screen Reader & `alt` Semantics | Primary gallery images include accurate descriptive `alt` text; marquee duplicate clones are marked `aria-hidden="true"` with `alt=""` so screen readers do not repeat duplicate photo descriptions. | PASS |
| Colour Contrast | Preserved the approved Terracotta (`#A45E44`), Warm Cream (`#F3E4D2`), Forest Charcoal (`#283730`), Deep Forest (`#1D2924`), and Primary Text (`#26332E`) token palette; high-contrast `Pause Gallery` button (`bg-forest-deep text-cream border-sand/55`). | PASS |
| Focus & Keyboard Navigation | Explicit `2px` focus-visible outlines preserved globally in `src/app/globals.css`; verified interactive button focusability without keyboard traps. | PASS |
| Browser Errors | `0` console errors, `0` uncaught `pageerror`, `0` HTTP `>=400` responses during automated checks. | PASS |
