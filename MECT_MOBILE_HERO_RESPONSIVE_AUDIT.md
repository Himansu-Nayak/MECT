# MECT Mobile Homepage Hero — Responsive Root-Cause Audit

**Date:** 2026-11-11  
**Reference Viewport Audited:** `387 x 866` (`scratch/mobile-qa/before-387x866.png` captured from `https://mect.org.in/`)  
**Scope:** Mobile header, statutory bar, full-subject hero photography showcase (`7` slides including `mect-trustees-campus-walk.webp` and `illustrative-child-support-outreach.webp`), hero typography, CTA layout, legal disclosure, floating controls, and statistics strip (`320px–768px`), with regression verification up to `1920px`.

---

## 1. Root Causes Identified in Before Screenshot (`before-387x866.png`)

1. **Image Crop & Marquee Split Defect (`HeroBackgroundMarquee.tsx` + `globals.css`):**
   - Desktop widescreen panels (`1.74:1`–`2.16:1`) were stretched behind text across a `~695px`-tall vertical mobile container (`~0.55:1`), causing aggressive horizontal cropping of human subjects ("showing half" / slicing people cleanly out of frame) and placing an overlapping crossfade blur diagonally behind the hero headline.
2. **Mobile Statutory Bar Access (`StatutoryTicker.tsx`):**
   - The scrolling ticker clipped edge characters (`"ble Trust..."`, `"NITI A..."`) with no tap-through affordance on `< lg` screens to read the complete statutory identifiers without squinting at a fast marquee.
3. **Hero Heading Wrapping & Line Balance (`src/app/page.tsx`):**
   - `care.` wrapped alone onto line 3 at `387px` (`Stronger communities begin / with opportunity, dignity and / care.`), creating an awkward isolated orphan word.
4. **Asymmetric Mobile CTA Wrapping (`src/app/page.tsx`):**
   - `Explore Our Work` and `Support Our Mission` sat side-by-side while `Partner With Us` wrapped onto row 2 aligned half-width to the left, creating unbalanced negative space.
5. **Floating Controls Obscuring Statistics (`QuickActionDock.tsx` + `HImChatbot.tsx`):**
   - At `y = 0` on mobile (`< xl`), stacked bottom-right FABs climbed up over the lower-right statistics (`10,000+ CITIZENS REACHED` / `Jal Seva drinking water...`).
6. **Statistics Clipped & Cramped (`src/app/page.tsx`):**
   - Placing tall behind-the-text photography stretched vertical height and pushed bottom metrics onto the lower edge near floating FABs.

---

## 2. Image-by-Image Diagnostic Matrix (`HERO_BACKGROUND_SLIDES`)

| # | Local Asset Filename | Classification | Final Dimensions & Aspect Ratio | Subject Position & Main Visual Subject | CSS Sizing & `object-fit` / `object-position` | Before vs. After Mobile Crop / Obscure / Duplicate Status |
|---|---|---|---|---|---|---|
| 1 | `mect-trustees-campus-walk.webp` | **Actual MECT Photograph** (User-Supplied MECT Photo) | `1460 x 725` (`2.01:1`) | Upper/center band; trustees and community participants walking together outdoors | Desktop: `md:w-[76vw] lg:w-[68vw] xl:w-[62vw] h-full object-cover` (`46% 18%`). Mobile strip: `w-[96vw] max-w-[440px] h-[195–245px] (~1.77:1) object-cover` (`50% 16%`) | Before: not in earlier 5-slide set. After: renders un-obscured above text in `HeroMobilePhotoStrip` with upper head protection (`50% 16%`); cloned purely for seamless CSS loop (`hidden` under `prefers-reduced-motion`). |
| 2 | `illustrative-child-support-outreach.webp` | **User-Supplied Documentary Reference** *(External Attribution / Licence Unverified)* | `735 x 581` (`1.27:1`) | Lower-center foreground; monochrome street child seated with meal bowl | Desktop: `object-cover` (`50% 56%`). Mobile strip: `object-cover` (`50% 62%`) | Native `735 x 581` preserved with zero upscaling. Mild top/bottom trim in `1.77:1` strip keeps child centered and unobscured above headline. |
| 3 | `illustrative-women-self-help-group.webp` | **Illustrative Stock Photography** (Ganesh Dhamodkar, CC BY 4.0) | `1920 x 913` (`2.10:1`) | Center-middle seated circle of rural women SHG members | Desktop: `object-cover` (`50% 34%`). Mobile strip: `object-cover` (`50% 48%`) | Before (`before-387x866.png`): vertical `~0.55:1` background slice cut scene to purple saree back & split seam behind `h1`. After: clean landscape strip frames full seated empowerment group unobscured. |
| 4 | `mect-legal-literacy-session.webp` | **Actual MECT Photograph** (Balangir Archive) | `1920 x 1050` (`1.83:1`) | Upper-center podium speaker addressing sitting community participants | Desktop: `object-cover` (`54% 24%`). Mobile strip: `object-cover` (`56% 24%`) | Before: overlapped by left/right blur seam and dark headline overlay. After: speaker, podium, and audience rendered cleanly un-obscured in horizontal strip. |
| 5 | `mect-clean-water-hygiene-demo.webp` | **Actual MECT Photograph** (Balangir Archive) | `1600 x 920` (`1.74:1`) | Center-middle courtyard water-access & handwashing demonstration | Desktop: `object-cover` (`52% 34%`). Mobile strip: `object-cover` (`55% 42%`) | Before: squeezed behind copy/CTAs causing excessive side cropping. After: full demonstration courtyard visible cleanly in landscape strip. |
| 6 | `illustrative-community-library-reading.webp` | **Illustrative Stock Photography** (Sumitsurai, CC BY-SA 4.0) | `1920 x 889` (`2.16:1`) | Mid-frame wooden library reading tables and bookshelves | Desktop: `object-cover` (`50% 44%`). Mobile strip: `object-cover` (`54% 40%`) | Before: ultra-wide `2.16:1` cropped by ~4x inside tall mobile container. After: matches landscape strip ratio cleanly with readable library hall framing. |
| 7 | `mect-women-empowerment-seminar.webp` | **Actual MECT Photograph** (Balangir Archive) | `1920 x 1080` (`1.78:1`) | Upper-center speaker at podium beneath Odia empowerment banner | Desktop: `object-cover` (`54% 30%`). Mobile strip: `object-cover` (`58% 34%`) | Before: right-hand podium speaker clipped in `88vw` mobile track. After: visible in crisp full frame (`after-mobile-320.png` through `430.png`) above badge & headline. |

---

## 3. Targeted Component & CSS Architecture Implemented

- **Mobile Un-Obscured Landscape Showcase (`HeroMobilePhotoStrip` in `HeroBackgroundMarquee.tsx` + `src/app/globals.css`):**
  - **Mobile (`md:hidden`):** Placed cleanly at the top of the hero section (`src/app/page.tsx`) in a true horizontal aspect window (`w-[96vw] max-w-[440px]`, `h-[195px] min-[375px]:h-[210px] sm:h-[245px]`, `~1.77:1` ratio) with explicit `object-cover` and per-image `mobileObjectPosition` values so full heads, faces, and group subjects render completely uncropped while gliding smoothly **left-to-right** via `.hero-mobile-track-ltr` (`30s` seamless loop) into a soft bottom `#1D2924` melt gradient above the hero typography.
  - **Reduced-Motion & Motion Control (`src/app/globals.css`):** Under `@media (prefers-reduced-motion: reduce)`, `.hero-mobile-clone` and `.hero-mobile-extra-panel` are declared **after** `.hero-mobile-seq { display: contents !important; }` so secondary/cloned panels properly collapse to `display: none` (`{ anim: 'none', cloneDisplay: 'none', extraDisplay: 'none' }`) rather than inheriting `display: contents`. Note: a visible floating `[Pause Backdrop]` button is intentionally omitted per prior user request (`"why this is not required"`), while OS-level `prefers-reduced-motion: reduce` halts all marquee motion deterministically.
  - **Tablet & Desktop (`hidden md:block`):** Renders `HeroBackgroundMarquee` with all 7 slides behind the hero typography via `.hero-bg-track-ltr` (`32s` continuous left-to-right marquee), preserving the desktop visual composition unchanged.
- **Mobile Statutory Bar & Header (`src/components/layout/StatutoryTicker.tsx`, `src/components/Header.tsx`):**
  - Added an accessible `<Link href="/statutory-disclosures">View</Link>` control inside the `< lg` ticker bar and refined header trust-name max-widths (`max-w-[140px] min-[375px]:max-w-[180px] sm:max-w-[240px]`) so `Donate` and the mobile menu toggle never clip down to `320px`.
- **Hero Typography, Asymmetric-Fixed CTAs & Grounded Statistics (`src/app/page.tsx`):**
  - Balanced heading scale (`text-[clamp(1.5rem,6.2vw,2.05rem)] [text-wrap:balance]`), eliminating isolated trailing single-word lines.
  - Responsive symmetric mobile CTA grid (`grid-cols-1 min-[375px]:grid-cols-2`), keeping CTAs cleanly balanced across `320px–639px` and inline flex row on `sm:`+.
  - Solid `#1D2924` mobile metrics integration below hero text (`md:bg-transparent` transparent overlay preserved on desktop).
- **Scroll-Activated Mobile Floating Controls (`src/components/QuickActionDock.tsx`, `src/components/ai/HImChatbot.tsx`):**
  - On `< xl`, FAB triggers stay hidden on initial load at `y = 0` (`HImChatbot` reveals at `scrollY > 180` / when open; `QuickActionDock` reveals at `scrollY > 320`) and align side-by-side (`right-3.5` and `right-16 sm:right-20`, respecting `env(safe-area-inset-bottom)`), leaving 100% of hero copy, CTAs, disclosures, and top statistics unobstructed while preserving `xl:` desktop rails unchanged.
