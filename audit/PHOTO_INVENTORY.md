# MECT.ORG.IN — Public Media & Photography Asset Inventory

**Repository:** `Himansu-Nayak/MECT`  
**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `fix/audit-loop`  
**Protocol:** P1-5 Photo Inventory & Asset Truth  
**Last Verified:** 2026-11-20  

---

## 1. Public Media & Photographic Evidence Master Register

Every image rendered across public pages is catalogued below with physical dimensions, compressed file size, usage locations, and evidence classification.

| Asset File Path | Dimensions | File Size | Classification | Source / Documentary Context | Primary Code Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/images/mect-official-emblem.png` | 256×256 | 151.4 KB | Official Emblem / Seal | MECT Registered Trust Deed (Doc No. 40311302194) | `content/org.ts`, `src/components/Header.tsx`, `/about`, `/login`, `/register` |
| `/images/og-default.png` | 1200×630 | 248.0 KB | Social Card (OG) | Brand Asset | `content/org.ts`, `/campaigns`, `/memories-gallery` |
| `/images/og-disclosures.png` | 1200×630 | 249.5 KB | Social Card (OG) | Brand Asset | `/statutory-disclosures`, `/governance`, `/reports`, `/csr-partnerships` |
| `/images/og-donate.png` | 1200×630 | 249.2 KB | Social Card (OG) | Brand Asset | `/donate` |
| `/images/og-programmes.png` | 1200×630 | 249.1 KB | Social Card (OG) | Brand Asset | `/programmes`, `/impact`, `/scholarships`, `/stories` |
| `/images/hero/mect-trustees-campus-walk.webp` | 1460×725 | 307.6 KB | Documentary Field Photo | MECT Trustees and community elders conducting field review at Puīntalā campus site, Balangir | `src/components/sections/CinematicHero.tsx`, `/programmes` |
| `/images/hero/mect-faculty-puintala-campus.webp` | 1280×853 | 77.7 KB | Documentary Field Photo | MECT faculty members and coordinators at the Puīntalā outreach block | `src/components/sections/InstitutionalStorySection.tsx`, `DocumentaryFieldExhibitionSection.tsx`, `/programmes` |
| `/images/hero/mect-civic-pledge-classroom.webp` | 1600×1200 | 172.6 KB | Documentary Field Photo | High school students participating in remedial study circle and civic pledge in Balangir | `content/stories.ts`, `DocumentaryFieldExhibitionSection.tsx`, `/programmes` |
| `/images/hero/mect-women-empowerment-seminar.webp` | 1920×1080 | 257.1 KB | Documentary Field Photo | Swavalamban vocational training and practical tailoring instruction seminar in Balangir | `content/stories.ts`, `DocumentaryFieldExhibitionSection.tsx`, `/programmes` |
| `/images/hero/mect-clean-water-hygiene-demo.webp` | 1600×920 | 263.5 KB | Documentary Field Photo | Jal Seva summer drinking water demonstration and hydration kiosk operation in Balangir | `content/stories.ts`, `DocumentaryFieldExhibitionSection.tsx`, `/programmes` |
| `/images/hero/mect-legal-literacy-session.webp` | 1920×1050 | 103.9 KB | Documentary Field Photo | Community welfare and rural legal entitlement awareness camp in Western Odisha | `DocumentaryFieldExhibitionSection.tsx`, `LightboxGrid.tsx`, `/programmes` |
| `/images/hero/mect-public-health-awareness.webp` | 2048×1365 | 150.8 KB | Documentary Field Photo | Hospital patient attendants meal drive and rural health screening in Rayagada / Balangir | `content/stories.ts`, `LightboxGrid.tsx`, `/programmes` |
| `/images/hero/illustrative-community-library-reading.webp` | 1920×889 | 311.8 KB | Illustrative Placeholder (Stock/Wikimedia) | Illustrative asset representing community library reading and study facilities | `FreeEducationSection.tsx`, `/programmes` |
| `/images/hero/illustrative-women-self-help-group.webp` | 1920×913 | 276.8 KB | Illustrative Placeholder (Stock/Wikimedia) | Illustrative asset representing rural women self-help and micro-enterprise group | `/programmes` |
| `/images/hero/illustrative-child-support-outreach.webp` | 735×581 | 72.4 KB | Illustrative Placeholder (Stock/Wikimedia) | Illustrative asset representing child welfare and school retention outreach | Archived in media repository |

---

## 2. Hardened Responsive Image Containers

Per P1-5 requirements, all hero, card, and gallery photo containers enforce:
1. Strict aspect ratio classes (`aspect-[4/3]`, `aspect-[16/10]`, `aspect-[16/11]`).
2. CSS `object-fit: cover` and `object-position: center`.
3. Strict overflow clipping (`overflow-hidden rounded-[2px]` or `rounded-xl`).
4. Replacing any asset with an authentic photo of different dimensions or proportions will NOT stretch, distort, or trigger Cumulative Layout Shift (CLS).
