# MECT — Motion & Animation Engineering Guidelines

**Library Stack:** `motion` (`^12.4.7`, `motion/react`) — already installed in `package.json`; zero extra animation runtimes added.

---

## 1. Phase 8 Reference Pattern Adoption Matrix

| External Reference | License | Patterns Adopted | Rationale & Boundary |
| :--- | :--- | :--- | :--- |
| **`motion.dev` / `motion/react`** | MIT | `motion.div`, `whileInView` (`viewport={{ once: true, amount: 0.12 }}`), `useReducedMotion()` | Native React GPU-composited transitions (`transform` + `opacity` only) respecting OS accessibility preferences. |
| **`ibelick/motion-primitives`** (`motion-primitives`) | MIT | Minimal composable `Reveal`, `HeroEntrance`, `StaggerGroup`, `StaggerItem` wrappers | Implemented cleanly in `src/components/ui/MotionPrimitives.tsx` tailored to MECT's institutional typography without pulling external template suites. |
| **`nextlevelbuilder/ui-ux-pro-max-skill`** | MIT | Contrast discipline, measured editorial rhythm, restrained hover states | Guided optical text hierarchy (`Lora` + `Plus Jakarta Sans` + `JetBrains Mono`), WCAG AA token contrast checks, zero decorative bloat. |
| **`TweenLabs/TweenLabs` & `dietrichgebert/ponytail`** | MIT | Reviewed as timeline/tween motion references | Explicitly deferred: GSAP/heavy tween timelines are unnecessary for clean nonprofit institutional prose and would add bundle weight without user benefit. |

---

## 2. Standard Easing, Timing & Accessibility Guardrails (`src/components/ui/MotionPrimitives.tsx`)
- **Easing Curve:** `[0.22, 1, 0.36, 1]` (deliberate, smooth deceleration with zero overshoot or bounce).
- **Duration:** `0.40s`–`0.46s` (`Reveal`, `HeroEntrance`, `StaggerItem`); stagger offset `0.06s`.
- **Properties Animated:** Exclusively `opacity` and vertical translation (`y: 12px`–`14px`), preventing cumulative layout shift (CLS) and main-thread layout thrashing.
- **Reduced Motion (`prefers-reduced-motion: reduce`):**
  - Handled in React via `useReducedMotion()` (renders plain static `<div>` containers inside `MotionPrimitives.tsx`) and in `src/app/globals.css` (pauses `.animate-marquee` and flattens transitions to `0.01ms`).
- **Continuous Motion Restraint:** Only the `StatutoryTicker` and `InstitutionalMarquee` animate horizontally, pausing automatically on `:hover` and `:focus-within`. No unrequested animated stat counters, cursor followers, or parallax effects are used.

