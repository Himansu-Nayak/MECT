# MECT Homepage Hero — Visual & Architectural Audit (Final)

**Date:** 2026-11-11  
**Target Route:** `/` ([src/app/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/page.tsx))

---

## 1. Before-and-After Findings Across Enhancement Cycles

1. **Cycle 1 -> Full-Width Behind-Text Canvas:** Replaced the original side-column/below-text card gallery (`HeroPhotoGallery.tsx`) with a full-width `HeroBackgroundMarquee` behind hero typography.
2. **Cycle 2 -> Widescreen Continuity & Mobile Un-Split Framing:** Visual screenshot review showed narrow panels (`380px–640px`) looked like a boxed collage on desktop and showed a vertical dividing seam down the center on `320px–390px` mobile. Replaced with widescreen horizontal panels (`w-screen sm:w-[92vw] md:w-[84vw] lg:w-[76vw] xl:w-[72vw]`) and soft gradient crossfades.
3. **Cycle 3 -> Art-Directed Cropping, Contrast & Tonal Polish (Current Final):**
   - Cropped upper-third visual distractions (standing bystander torsos & window glare on `self-help-group.jpg`, ceiling fluorescent tubes on `rammohun-library.jpg`, corrugated tin awning on `clean-water-hygiene-demo.jpg`) directly from high-resolution masters into widescreen `~16:9`–`2.1:1` frames without upscaling.
   - Balanced shadow lift (`gamma: 1.05–1.06`) and neutral saturation (`0.92–0.96`) with subtle sharpening (`sigma: 0.65`) across all 5 slides so indoor/outdoor color temperatures harmonize under MECT's scrim.
   - Widened feathered overlap (`margin-right: -8vw`, `10%–90%` horizontal alpha feather mask) to eliminate dark fade troughs between slides.
   - Balanced focal Forest Charcoal scrim (`rgba(29,41,36, 0.80 -> 0.62 -> 0.30 -> 0.24)`) + Terracotta warmth glow (`rgba(164,94,68, 0.20)`) so white/sand copy stays crisp while the right expanse opens up clearly.
   - Refined mobile metrics grid right clearance (`pr-12 sm:pr-0`) so floating quick-action/chat buttons on `390px` viewports do not cover metric labels above the fold.
