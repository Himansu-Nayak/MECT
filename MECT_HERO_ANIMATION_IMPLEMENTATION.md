# MECT Hero Left-to-Right Animation Implementation

## 1. Architecture
- **Backdrop Component:** [`HeroBackgroundMarquee`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/HeroBackgroundMarquee.tsx)
- **CSS Rules:** [src/app/globals.css](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/globals.css)
- **Hero Consumer:** [src/app/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/page.tsx) (Section 1)

## 2. Seamless Loop & Feathered Overlap
- **Keyframes (`hero-bg-marquee-ltr`):** Translates `.hero-bg-track-ltr` monotonically from `translate3d(-50%, 0, 0)` to `translate3d(0%, 0, 0)` across two identical 5-slide sequences (`48s linear infinite` on `768px+`, `54s linear infinite` on `<768px`).
- **Seamless Transitions:** `.hero-bg-panel-feather` applies `margin-right: -8vw` with a `linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)` mask so outgoing and incoming frames crossfade smoothly without hard collage seams or dark fade troughs.
- **GPU Compositing:** Transform-only animation with `will-change: transform` and zero JavaScript animation timers.

## 3. Accessibility & Reduced Motion
- **Decorative Semantics:** Wrapper carries `aria-hidden="true"` and `pointer-events-none`; every background `<Image>` has `alt=""`.
- **Pause/Play Control:** Keyboard-accessible `Pause Backdrop` / `Play Backdrop` button (`aria-pressed`) toggles `.hero-bg-paused`.
- **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` clears feather masks/negative margins (`margin-right: 0 !important`), stops animations, hides duplicate sequences/extra slides, and renders a static full-bleed backdrop (`1` column `<768px`, `2` columns `>=768px`).
