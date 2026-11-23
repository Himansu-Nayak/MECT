# MECT — PHASE 14.5 INITIAL WEBSITE DESIGN & CARD ARCHITECTURE AUDIT

**Project:** MAHAVIR TRUST / Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Canonical Repository:** [https://github.com/Himansu-Nayak/MECT.git](https://github.com/Himansu-Nayak/MECT.git)  
**Current Branch:** `feat/mect-whatsapp-donation-notifications`  
**Current HEAD:** `fdb981ca6f81bdc5439998ce97e1b47830c33bc2`  
**Audit Date:** November 23, 2026  
**Auditor:** Principal DevSecOps Engineer, UI/UX Architect & Frontend Release Manager  

---

## 1. EXECUTIVE SUMMARY & REPOSITORY CONTEXT

This audit establishes the baseline architectural, visual, and component foundation of the MECT website ahead of the Phase 14.5 transformation. The goal is to elevate all cards, photography containers, leadership profiles, and responsive presentation into an institutional, editorial-grade experience without altering the organization's verified identity, brand palette, or functionality.

### Git & Working Tree State
- **Root Directory:** `c:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST`
- **Active Branch:** `feat/mect-whatsapp-donation-notifications`
- **Remote Sync:** Fully synchronized with origin at `fdb981c`.
- **Existing User Assets:**
  - `public/Er. Japabandhu Kampa.jpeg` (54 KB, 560×1006 px, portrait photograph of Settler Founder & Chairman cum Managing Trustee).
  - `src/*.jpeg`, `src/*.jpg` (15 authentic WhatsApp field photographs + high-resolution DSLR photos preserved in `src/`).

---

## 2. FRONTEND DIRECTORY STRUCTURE & COMPONENT ECOSYSTEM

The MECT frontend is built on **Next.js 16.4.6 (App Router)**, **React 19**, **TypeScript 5.8**, and **Tailwind CSS 3.4.17**.

```text
src/
├── app/
│   ├── layout.tsx                     # Root layout, fonts (Cinzel, Inter, JetBrains Mono)
│   ├── page.tsx                       # Homepage (8 sections)
│   ├── about/page.tsx                 # About MECT, Founding Heritage & Governance
│   ├── governance/page.tsx            # Institutional Governance, Deed Clauses, Leadership
│   ├── campaigns/page.tsx             # Campaigns Directory (Hanuman Murti, Free Education)
│   ├── campaigns/hanuman-murti/       # Dedicated cultural landmark campaign route
│   ├── programmes/page.tsx            # Core charitable programmes (Education, Women, Health)
│   ├── donate/page.tsx                # Multi-channel checkout & statutory banking disclosures
│   ├── impact/page.tsx                # Impact telemetry, district distribution, evidence
│   ├── memories-gallery/page.tsx      # Archival photo gallery with Lightbox
│   ├── statutory-disclosures/page.tsx # Compliance vault (12A, 80G, CSR-1, Deed)
│   ├── contact/page.tsx               # Secretariat directory & inquiry submission
│   ├── portal/                        # Authenticated donor portal
│   └── admin/                         # Secretariat admin console (WhatsApp, Donors, Logs)
├── components/
│   ├── ui/
│   │   ├── Card.tsx                   # Core card primitive (variants: default, elevated, outline)
│   │   ├── Badge.tsx                  # Semantic badges (forest, terracotta, gold, neutral)
│   │   ├── Button.tsx                 # Button component with hover/focus states
│   │   ├── Container.tsx              # Responsive max-width container wrapper
│   │   ├── SectionHeader.tsx          # Consistent section title & badge layout
│   │   └── MotionPrimitives.tsx       # Reveal, StaggerGroup, StaggerItem, ImageReveal
│   ├── sections/
│   │   ├── CinematicHero.tsx          # Homepage visual marquee & mission banner
│   │   ├── InstitutionalStorySection.tsx # Documentary field photo & audited ledger
│   │   ├── InterconnectedSafetyNetSection.tsx # 4 pillars of public charity
│   │   ├── AuditedImpactTelemetrySection.tsx # Live metrics and indicators
│   │   ├── DocumentaryFieldExhibitionSection.tsx # 5-photo documentary gallery
│   │   ├── DifferentiatedCampaignsSection.tsx # Education vs. Cultural Landmark
│   │   ├── StatutoryGovernanceSection.tsx # Board oversight, 100% voluntary service
│   │   ├── TailoredParticipationPathwaysSection.tsx # How to engage & contribute
│   │   └── ClosingTrustPledgeSection.tsx # Closing institutional pledge
│   └── Header.tsx / Footer.tsx        # Navigation and legal footer
└── config/ / lib/
    ├── org.ts                         # Institutional source of truth (Trust Deed, leadership)
    ├── homepage-content.ts            # Homepage content registry
    └── about-content.ts               # About page content registry
```

---

## 3. DESIGN SYSTEM & DESIGN TOKENS AUDIT

The project follows the locked **Option A: Heritage Trust Palette**:

### Color Tokens (`tailwind.config.ts` & `globals.css`)
- **Primary Institutional Forest:**
  - `forest`: `#16221D` (deep sanctuary forest green)
  - `forest-dark`: `#0D1512` (rich contrast background)
  - `forest-light`: `#23332B`
- **Secondary Heritage Terracotta:**
  - `terracotta`: `#C45A3C` (earthen temple terracotta)
  - `terracotta-dark`: `#963821`
  - `terracotta-light`: `#D97354`
- **Warm Architectural Sand & Cream:**
  - `cream`: `#FAF7F2` (primary page surface)
  - `sand`: `#E5C499` (parchment gold accent)
  - `sand-light`: `#F4EBD9`
  - `border-warm`: `#E7E0D5` (subtle card border)
  - `border-soft`: `#ECE6DC`
- **Ink Typography:**
  - `ink`: `#1A201C` (high contrast body/heading)
  - `ink-secondary`: `#4A554E`
  - `ink-sand`: `#5C665F`

### Typography Scale
- **Headings (Serif):** `font-serif` (Cinzel / Playfair / Georgia fallback)
- **Body & Controls (Sans):** `font-sans` (Inter / system fallback)
- **Technical & Statutory (Mono):** `font-mono` (JetBrains Mono / monospace fallback)

### Responsive Breakpoints
- `sm`: `640px` (mobile landscape / large mobile)
- `md`: `768px` (tablet portrait)
- `lg`: `1024px` (laptop / tablet landscape)
- `xl`: `1280px` (standard desktop)
- `2xl`: `1536px` (wide desktop display)

---

## 4. CURRENT IMAGE REFERENCES & CARD DEFICIENCIES

### 4.1 Er. Japabandu Kampa Leadership Profile Deficiencies
1. **`src/app/governance/page.tsx`:** The Managing Trustee profile card currently uses an unbranded initials avatar `<div ...>JK</div>` rather than the official portrait photograph (`public/Er. Japabandhu Kampa.jpeg`).
2. **`src/app/about/page.tsx`:** Features multi-tier governance text, but lacks a dedicated, framed leadership card for the Settler Founder & Managing Trustee.
3. **Homepage:** Has the text quote from the Managing Trustee's desk, but lacks a visual leadership card with photograph to anchor institutional trust.

### 4.2 Website Card System Deficiencies
1. **Campaign Cards (`src/app/campaigns/page.tsx` & Homepage):**
   - The Hanuman Murti card uses `HanumanMurtiVisual` (3D / illustration), but the **Free Education for 200 Students** card currently renders a flat green placeholder box (`<div className="h-64 bg-forest/5 ..."><GraduationCap .../></div>`) instead of an authentic classroom photograph (`mect-civic-pledge-classroom.webp`).
2. **Programmes Cards (`src/app/programmes/page.tsx`):**
   - Certain cards still reference illustrative stock images (`illustrative-community-library-reading.webp`, `illustrative-women-self-help-group.webp`). These can be upgraded with authentic MECT field photographs from `src/` (such as classroom pledge, women empowerment seminar, clean water demo).
3. **Card Consistency & Styling:**
   - Card borders vary between `border-border-warm` and `border-border-soft`.
   - Card aspect ratios across grids need standardization (e.g. `aspect-[4/5]` for leadership portraits, `aspect-[16/10]` or `aspect-[4/3]` for initiative cards).
   - Card elevation and hover transitions must maintain subtle institutional restraint (no oversized drop-shadows or jarring layout shifts).

---

## 5. AUDIT CONCLUSION & IMPLEMENTATION ROADMAP

The repository contains all required authentic photographic assets, clean component foundations (`Card.tsx`, `Badge.tsx`, `MotionPrimitives.tsx`), and a mature design system. 

Proceeding to:
1. **Phase 14.5.2:** Generate complete image asset inventory.
2. **Phase 14.5.3:** Integrate Er. Japabandu Kampa's verified photograph.
3. **Phase 14.5.4:** Map and deploy authentic photographs across campaigns, programmes, and leadership.
4. **Phase 14.5.5–14.5.7:** Standardize premium card design language.
