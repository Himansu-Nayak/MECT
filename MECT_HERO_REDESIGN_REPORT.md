# MECT Hero Redesign Report

**Date:** 2026-11-10
**Files Modified / Created:**
- [HeroPhotoGallery.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/HeroPhotoGallery.tsx) (new)
- [page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/page.tsx)
- [globals.css](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/globals.css)
- [MotionPrimitives.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/MotionPrimitives.tsx)
- [next.config.ts](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/next.config.ts)

---

## 1. Removal of the Previous Right-Side Information Box

- Completely removed the large right-side `bg-forest` container from Section 1 (`src/app/page.tsx`), including its hero-only presentation of Documented Programme Pillars, Child Safeguarding card, Direct Disbursal card, and Jal Seva Relief card.
- Removed unused `import Image from "next/image";` from `src/app/page.tsx`.
- Preserved all statutory disclosures, governance links, Trust Deed reference (`40311302194`), metric cards strip (`13+ Years`, `350+`, `120+`, `10,000+`), navigation, QuickActionDock, and HImChatbot intact.

---

## 2. Preserved & Balanced Editorial Left Column

- Adjusted the 12-column responsive hero grid to `lg:col-span-6` (editorial column) paired with `lg:col-span-6 min-w-0` (`<HeroPhotoGallery />`).
- Refined CTA button spacing so **Explore Our Work** (`/programmes`), **Support Our Mission** (`/donate`), and **Partner With Us** (`/csr-partnerships`) render together cleanly on one horizontal line across `1280px`–`1920px` viewports.
- Kept the exact verified headline, narrative subtext, Trust Deed notice, and **Fiduciary Charter & Governance Code** link (`/governance`).

---

## 3. Two-Track Seamless Moving Photographic Gallery

- Built `HeroPhotoGallery.tsx` showcasing **6 curated authentic Balangir photographs** (`3` images per track, each sequence duplicated `[Group A][Group B]` with `aria-hidden="true"` on Group B clones):
  - **Track 1 (`hero-marquee-ltr`, `48s linear infinite`):** Moves smoothly Left → Right across mobile and desktop (`translate3d(-50%, 0, 0)` → `0%`).
  - **Track 2 (`hero-marquee-rtl`, `54s linear infinite`):** Moves smoothly Right → Left (`translate3d(0%, 0, 0)` → `-50%`) on tablet & desktop (`hidden md:block` so mobile shows a single uncluttered track).
- Applied pure alpha edge feathering (`.hero-gallery-mask`) via CSS `mask-image`, smooth `hover` / `focus-within` pause, an interactive **Pause Gallery / Play Gallery** button (`aria-pressed`), and `loading="eager"` + `decoding="async"` to eliminate off-screen marquee pop-in.
- Enabled `images.formats: ["image/avif", "image/webp"]` in `next.config.ts` and verified `cls=0` across all viewports.

