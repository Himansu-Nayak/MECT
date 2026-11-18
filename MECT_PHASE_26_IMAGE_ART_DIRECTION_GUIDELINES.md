# MECT PHASE 26 — IMAGE ART DIRECTION & ASSET GUIDELINES

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-26-radical-visual-reinvention`  
**Phase:** Phase 26 — Radical Visual Reinvention  
**Status:** PRODUCTION ASSET DIRECTIVE  

---

## 1. Principles of Authentic Documentary Photography

MECT is a grassroots public charitable trust serving real communities in Balangir and Western Odisha. Its visual presentation must reflect **documentary honesty, respect, and human dignity**.

### 1.1 Core Tenets
1. **Dignity Over Pity:**
   - Never use staged, tragic, or dehumanizing imagery of poverty or illness to elicit emotional pity.
   - Present students, women artisans, teachers, and elders as active, capable agents of their own futures.
2. **Authentic Field Evidence:**
   - Prioritize actual MECT field photography from Balangir, Puīntalā, and Kalahandi over commercial stock photos.
   - When contextual or illustrative assets are required, ensure they are calibrated in tone, color grading, and framing to match the local Western Odisha landscape.
3. **Child Safeguarding & Protection Compliance:**
   - Adhere strictly to the Trust's Child Safeguarding Policy (`DOC-POL-SAFEGUARDING-2024`).
   - Obscure sensitive personal identifying details (e.g., student examination roll numbers, medical records, or exact residential addresses) in visual assets.
   - Ensure parental or guardian consent was obtained for any child featured in educational activities.

---

## 2. Asset Catalog & Quality Assessment

| Asset Filename | Subject & Location | Aspect Ratio | Color Grading / Tone | Placement in Phase 26 Redesign |
| :--- | :--- | :--- | :--- | :--- |
| `mect-trustees-campus-walk.webp` | Trustees and community elders walking at the rural campus site in Balangir. | 16:9 / 3:2 | Natural warm afternoon light, subtle earthy grain. | Section 01 Hero & Section 02 Institutional Story. |
| `mect-faculty-puintala-campus.jpg` | Faculty members gathered outside the Puīntalā rural education centre. | 4:3 / 16:10 | Warm documentary contrast, dignified group portrait. | Section 02 Institutional Heritage & About Page. |
| `mect-clean-water-hygiene-demo.webp` | Summer relief drinking water station and hygiene orientation in Balangir. | 16:9 / 4:5 | High clarity, natural sunlit documentary realism. | Section 03 Interconnected Safety Net (Clean Water Pillar). |
| `mect-women-empowerment-seminar.webp` | Women's self-help tailoring workshop and vocational skill cohort. | 16:9 / 3:2 | Warm interior lighting, focus on active craftsmanship and sewing machines. | Section 03 Interconnected Safety Net (Livelihoods) & Section 06 Exhibition. |
| `mect-civic-pledge-classroom.jpg` | Rural students taking community pledge in a classroom setting. | 16:9 / 16:10 | Golden morning classroom light, focused attention. | Section 03 (Education Pillar) & Section 06 Exhibition. |
| `mect-legal-literacy-session.webp` | Legal awareness camp and community rights counselling in rural block. | 16:9 / 4:5 | Natural village assembly atmosphere, participatory engagement. | Section 03 (Social Welfare) & Section 06 Exhibition. |
| `mect-public-health-awareness.jpg` | Community health outreach and preventive wellness counselling. | 16:9 / 3:2 | Clear daylight documentary capture. | Section 03 (Health & Nutrition) & Section 06 Exhibition. |
| `mect-official-emblem.png` | Official Trust Seal and emblem featuring the motto of service. | 1:1 | High-resolution crisp vector rendering on transparent background. | Masthead, Hero Badge, Governance Certificates, and Footer Colophon. |

---

## 3. Framing, Cropping & Responsive Image Rules

1. **Aspect Ratio Standardization:**
   - **Hero Editorial Split:** `16:10` or full-height `3:4` vertical portrait on desktop; full-width `16:9` on mobile.
   - **Exhibition Photo-Essay:** Asymmetrical pairing of `16:9` cinematic landscapes with `4:5` detailed portraits.
   - **Card Modules:** Strict `16:10` ratio to ensure zero layout shifts during lazy loading.
2. **Metadata & Captioning Protocol:**
   - Every documentary photo displayed on the website must be accompanied by an editorial caption and metadata tag:
     - Example: `[FIELD RECORD 2023–24] Community water and heatstroke relief station, Rugudipara, Balangir. Monitored under MECT Field Protocol.`
3. **Responsive Image Optimization:**
   - Always specify explicit `width`, `height`, and `sizes` attributes in Next.js `<Image />` components.
   - Target modern formats: `.webp` or `.avif` with fallback.
