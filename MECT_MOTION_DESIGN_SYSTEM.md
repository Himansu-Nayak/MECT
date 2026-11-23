# MECT Motion Design System

**Date:** 2026-11-11  
**Motion Engine:** `motion/react` (`motion` `^12.4.7` already installed) + GPU-only CSS `@keyframes`  
**Core Source:** `src/components/ui/MotionPrimitives.tsx`, `src/app/globals.css`, `src/components/Header.tsx`

---

## 1. Reusable Institutional Motion Tokens (`src/components/ui/MotionPrimitives.tsx`)

| Token Group | Name | Value | Intended Use |
|---|---|---|---|
| **Easing** | `MOTION_EASING.institutional` | `[0.22, 1, 0.36, 1]` | Primary decelerating curve for section reveals, nav indicator, card entrances |
| **Easing** | `MOTION_EASING.gentle` | `[0.25, 0.1, 0.25, 1]` | Subtle editorial opacity fades & image gallery settles |
| **Duration** | `MOTION_DURATION.fast` | `0.18s` | Active nav underline, dropdown flyout, mobile drawer slide, Copy UPI pill |
| **Duration** | `MOTION_DURATION.standard` | `0.44s` | Standard viewport reveals (`amount: 0.04`) and directional column entries |
| **Duration** | `MOTION_DURATION.slow` | `0.64s` | Editorial Managing Trustee charter quote, Footer settle, Gallery settle |
| **Duration** | `MOTION_DURATION.countUp` | `900ms` | One-time `requestAnimationFrame` cubic-out numeric count-up (`CountUpStat`) |
| **Stagger** | `MOTION_STAGGER.nav` | `0.03s` | Sequential link stagger inside `#mobile-navigation-drawer` |
| **Stagger** | `MOTION_STAGGER.cards` | `0.065s` | Programme pillars (`#programs`) and `/impact` metrics grid |
| **Stagger** | `MOTION_STAGGER.steps` | `0.085s` | Sequential 4-step operational workflow (`How MECT Works`) and Smile utilization steps |

---

## 2. Differentiated Component Choreography (By Purpose)

| Component / Section | Primitive / Mechanism | Motion Behaviour | Reduced-Motion (`prefers-reduced-motion: reduce`) |
|---|---|---|---|
| **Hero Section (Desktop 768px+)** | `HeroBackgroundMarquee` + `HeroEntrance` | Continuous CSS LTR marquee (`hero-bg-marquee-ltr`, `32s`) behind stationary foreground copy (`0ms` LCP) | Frozen static grid (`animation: none`), secondary clones hidden |
| **Hero Section (Mobile <768px)** | `HeroMobilePhotoStrip` + `HeroEntrance` | Un-obscured landscape marquee strip (`hero-mobile-track-ltr`, `30s`) above stationary headline | Frozen lead photograph (`animation: none; clone/extra panels: display: none`) |
| **Navigation (`Header.tsx`)** | `layoutId="mect-nav-active-indicator"`, `AnimatePresence` | Active nav underline slides (`fast`), dropdown fades+drops `6px`, mobile drawer slides+staggers (`0.03s`), menu icon rotates cleanly | Instant swaps (`duration: 0`, no `layoutId` spring or `stagger` offset) |
| **Statistics (`page.tsx`, `FreeEducationSection`, `/impact`)** | `CountUpStat` | One-time viewport cubic ease-out count-up (`13+`, `350+`, `120+`, `10,000+`, `200`) with `tabular-nums` (`CLS = 0`) | Renders exact final static numeral immediately without counting |
| **Editorial Splits (`page.tsx` Intro, `FreeEducationSection`, `/about`)** | `Reveal direction="left"` & `direction="right"` | Asymmetric converging column entrances (`x: -14` left, `x: +14` right) | Static immediate `opacity: 1, transform: none` |
| **Programme & Process Grids (`#programs`, `How MECT Works`, `Smile`)** | `StaggerGroup` + `StaggerItem` | Directional staggered cascade (`up` on pillar cards, `left` on numbered workflow steps) + restrained hover border/elevation | Static grid with zero hidden delay |
| **Certificate / Image Gallery (`CsrRegistrationSection`)** | `GalleryReveal` | Subtle single-run `scale: 1.02 -> 1` opacity settle + desktop `group-hover:scale-[1.015]` inspection only | Static crisp frame (`opacity: 1`) |
| **Trust Banner & Footer (`Section 9`, `Footer.tsx`)** | `Reveal direction="fade" tone="slow"` | Restrained pure opacity fade without vertical bounce (`amount: 0.04`) | Immediate visible footer & legal disclosures |
| **CTA Buttons & Links (`Button.tsx`, `globals.css`)** | CSS `.group:hover svg.lucide-arrow-right` | Subtle `+2px` directional arrow nudge (`180ms`) & background/shadow transition | Transforms neutralized cleanly under reduced motion |
| **SBI Donation QR (`SbiDonationSection.tsx`)** | Outer `Reveal direction="fade"` + `AnimatePresence` copy badge | **QR `<img>` kept strictly stationary, sharp & untransformed.** Only inline copy confirmation badge (`Copied 86971610172@sbi`) animates smoothly | Immediate static copy confirmation pill |

