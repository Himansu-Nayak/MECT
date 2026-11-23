# MECT PHASE 24 — ADVANCED MOTION SYSTEM SPECIFICATION
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Execution Date:** 18 November 2026  
**Status:** COMPLETE & VERIFIED  
**Working Branch:** `feat/phase-24-digital-reinvention`

---

## 1. Institutional Motion Philosophy

Motion on the MECT website is not decorative entertainment; it is an editorial instrument that clarifies information hierarchy, guides visual attention, and establishes calm institutional authority.

### The Three Golden Rules of MECT Motion:
1. **Dignified Restraint:** No whimsical bouncing, spinning icons, or distracting parallax effects. Every transition feels weighty, architectural, and deliberate.
2. **Zero Layout Shift (CLS = 0):** Animations never alter the physical dimensions of DOM containers. All movement occurs via GPU-accelerated compositing properties (`transform: translate3d()` and `opacity`).
3. **Uncompromising Accessibility:** Full respect for `prefers-reduced-motion`. Users with vestibular sensitivities receive instantaneous opacity dissolves without spatial movement.

---

## 2. Motion Primitives Architecture (`src/components/ui/MotionPrimitives.tsx`)

| Component | Role & Usage | Spring / Easing Token | Duration |
| :--- | :--- | :--- | :--- |
| `<HeroEntrance />` | Staggered entrance for hero typography, eyebrow badges, and action buttons | Cubic bezier `[0.16, 1, 0.3, 1]` | `400ms` with `80ms` child stagger |
| `<Reveal />` | Scroll-triggered section reveals (`direction="up"`, `"fade"`) | Cubic bezier `[0.16, 1, 0.3, 1]` | `450ms` (standard) / `600ms` (slow) |
| `<StaggerGroup />` & `<StaggerItem />` | Coordinated reveals for credential badges, impact metrics, and photo grids | Cubic bezier `[0.16, 1, 0.3, 1]` | `60ms` stagger delay between siblings |
| `<CountUpStat />` | Animated numeric telemetry counter triggered on viewport intersection | Ease-out numeric interpolation | `1200ms` with format localization |

---

## 3. Micro-Interactions & State Physics

- **Button Hover States:** Smooth `translate-x-1` on right-pointing arrow icons; subtle `scale-[1.02]` on documentary image cards.
- **Card Focus & Hover:** Elevation transitions via `border-color` (`border-border-warm` to `border-terracotta/40`) and soft ambient box-shadow (`shadow-xs` to `shadow-md`) over `200ms`.
- **Navigation Drawer / Dropdown:** Seamless height and opacity interpolation using Motion's `<AnimatePresence />` with exit transitions matching entrance curves.

---

## 4. Verification Check

Audited with Chrome DevTools Performance panel:
- Frame rate: 60 FPS continuous without stutter.
- Layout Shifts: Cumulative Layout Shift = `0.000` during full-page scroll.
- Reduced Motion Mode: Confirmed that setting `prefers-reduced-motion: reduce` completely bypasses spatial transforms across all components.
