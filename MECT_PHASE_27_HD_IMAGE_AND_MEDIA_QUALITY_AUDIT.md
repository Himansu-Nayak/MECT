# MECT PHASE 27 — HD IMAGE & MEDIA QUALITY AUDIT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-27-immersive-motion-hd-excellence`  
**Phase:** Phase 27 — Immersive Motion, HD Excellence & Intelligent Deduplication  
**Status:** COMPLETE ASSET INVENTORY & DIRECTIVES DEFINED  

---

## 1. Asset Inventory & High-Definition Resolution Audit

| Filename | Dimensions & Resolution | File Size | Format | Usage in MECT Experience | Crop & Display Aspect | Optimization Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mect-trustees-campus-walk.webp` | 1600 × 1067 px (HD) | 314 KB | WebP | Section 01 Hero & Section 02 | 16:10 Desktop / 4:3 Mobile | **Optimized LCP Source**: High visual sharpness, warm documentary tones, natural grain. |
| `mect-faculty-puintala-campus.jpg` | 1200 × 900 px | 97.7 KB | JPEG | Section 02 Story & Section 06 Exhibition | 4:3 / 16:10 | **Sharp Documentary Portrait**: Group portrait of faculty and trustees at Puīntalā campus. |
| `mect-women-empowerment-seminar.webp` | 1440 × 960 px (HD) | 263 KB | WebP | Section 03 Safety Net & Section 06 Exhibition | 3:2 / 4:3 | **Optimized WebP**: Women's tailoring workshop in Balangir; clean focus on machine craftsmanship. |
| `mect-clean-water-hygiene-demo.webp` | 1440 × 960 px (HD) | 269 KB | WebP | Section 03 (Water) & Section 06 Exhibition | 16:10 / 4:3 | **Optimized WebP**: Balangir summer heatstroke Jal Seva water kiosk; authentic daylight capture. |
| `mect-civic-pledge-classroom.jpg` | 1280 × 853 px | 224 KB | JPEG | Section 03 (Education) & Section 06 Exhibition | 16:10 | **Documentary Realism**: High school remedial coaching classroom in rural Balangir. |
| `mect-legal-literacy-session.webp` | 1280 × 853 px | 106 KB | WebP | Section 03 (Welfare) & Section 06 Exhibition | 16:10 | **Optimized WebP**: Rural legal literacy assembly on citizen rights and government schemes. |
| `mect-public-health-awareness.jpg` | 1200 × 800 px | 166 KB | JPEG | Archive & Impact Pages | 3:2 | **Archival Realism**: Health outreach in rural block. |
| `mect-official-emblem.png` | 512 × 512 px (Retina) | 155 KB | PNG (Transparent) | Masthead, Footer, Governance Seals | 1:1 Square | **High-Definition Vector-Derived Asset**: Razor-sharp rendering on all screens. |
| `og-default.png` | 1200 × 630 px | 253 KB | PNG | OpenGraph Meta Preview | 1.91:1 | **Standardized Social Card**. |

---

## 2. Next.js Responsive Image Delivery Rules

1. **Explicit Priority on LCP Image:**
   - In `CinematicHero.tsx`, `<Image priority sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 42vw" ... />` is maintained with `fetchPriority="high"` to ensure the LCP asset loads in `< 1.2s`.
2. **Lazy-Loading for Below-the-Fold Imagery:**
   - All exhibition, story, and campaign images use Next.js automatic `loading="lazy"` with native intersection observer loading.
3. **Responsive Display Density (`devicePixelRatio`):**
   - Next.js server delivers 1x, 2x, and 3x image densities based on the client viewport, preventing blurry enlargement on Retina and 4K displays while avoiding bloated downloads on mobile devices.
4. **Child Safeguarding & Visual Privacy:**
   - In strict compliance with Trust Policy `DOC-POL-SAFEGUARDING-2024`, student roll numbers, home addresses, and sensitive identification records are protected across all media.
