# MECT PHASE 24 — HOMEPAGE EXPERIENCE BLUEPRINT
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Execution Date:** 18 November 2026  
**Status:** ARCHITECTURAL SPECIFICATION  
**Working Branch:** `feat/phase-24-digital-reinvention`

---

## 1. Architectural Philosophy: The Editorial Narrative Arc

The reinvented MECT homepage is designed as an unbroken editorial narrative rather than a collection of disparate marketing blocks. Every section fulfills a specific stage in the visitor's psychological journey:

```
[ 1. Orientation & Gravitas ] ---> Who MECT is, where it works, and its high purpose.
             |
             v
[ 2. Fiduciary Roots & Integrity ] -> 13+ year track record, registered deed, 100% honorary trustees.
             |
             v
[ 3. The Interconnected Safety Net ] -> The systemic reality: how 5 programs work together as 1 net.
             |
             v
[ 4. Priority Initiatives & 3D ] ---> Prospective targets + Hanuman Murti 3D + Audited Telemetry.
             |
             v
[ 5. Documentary Field Exhibition ] -> Photographic evidence of real work across rural Balangir.
             |
             v
[ 6. Action Pathways ] -------------> Clean, non-coercive routes for donors, students, volunteers, CSR.
             |
             v
[ 7. Closing Fiduciary Pledge ] ----> Institutional guarantee, canonical phone (9853608113) & email.
```

---

## 2. Detailed Section Blueprints

### SECTION 01: Cinematic Institutional Hero
- **Component:** `src/components/sections/CinematicHero.tsx`
- **Background:** Rich `bg-forest-deep` (`#1D2924`) with subtle terracotta and gold radial ambient glow.
- **Header Elements:**
  - Eyebrow badge: `Mahaveer Educational & Charitable Trust • Estd. 2013` with `ShieldCheck` icon.
  - Headline: `Creating Opportunities.` in crisp white Lora Serif, paired with `Strengthening Communities.` in warm italic sand.
  - Subtitle: Clear, non-generic mission statement highlighting grassroots work across Western Odisha.
  - Primary CTA Group: "Explore Our Work" (gold button with smooth scroll) and "Support Our Mission" (refined dark-outline button).
  - Quiet Fiduciary Disclosure: Direct link to `Fiduciary Charter & Governance Code` referencing registered Deed No. 40311302194.
- **Photographic Feature:**
  - High-resolution documentary photograph from Balangir legal literacy session.
  - Micro-location badge: `Community Session • Balangir, Odisha` with JetBrains Mono `Documented Archive` label.

### SECTION 02: Institutional Identity & Fiduciary Roots
- **Component:** `src/components/sections/InstitutionalIdentityTrustSection.tsx`
- **Background:** Warm `bg-cream` (`#FDFBF7`) with hairline divider.
- **Narrative Column:**
  - Eyebrow: `Institutional Profile` with `Landmark` icon.
  - Headline: `Grassroots Commitment, Fiduciary Integrity`.
  - Body: Detailed exposition of MECT's founding in 2013 in Balangir, its irrevocable public charitable trust deed, and the core distinction of **Clause XVI: 100% honorary trusteeship** (zero salary or sitting fee).
  - Primary Actions: "Discover Our Story" (`/about`) and "Trustees & Governance" (`/governance`).
- **Imagery Column:**
  - Real field photo: `MECT trustees and facilitators reviewing community learning operations in Balangir` (`/images/hero/mect-trustees-campus-walk.webp`).
- **Statutory Trust Strip:**
  - Four verifiable credentials:
    1. Registered Public Trust: Deed 2013 • Balangir No. 40311302194
    2. Sections 12A & 80G: Income-tax Act • URN: AADTM5474FE20231
    3. MCA CSR-1 Registration: Reg: CSR00081063 • Schedule VII
    4. NITI Aayog NGO Darpan: Enrolment: OR/2024/0466491
  - Direct link to Statutory Disclosures Archive.

### SECTION 03: The Interconnected 5-Area Safety Net
- **Component:** `src/components/sections/InterconnectedSafetyNetSection.tsx`
- **Design Overhaul:** Eliminates disconnected, repetitive card grids.
- **Conceptual Structure:**
  - Presents the 5 areas as an integrated socio-economic architecture:
    1. **Foundation of Health & Survival:** Safe Water (Jal Seva) + Food Security (Jan Ahar).
    2. **Household Economic Resiliency:** Women's Vocational Livelihoods (Tailoring & micro-enterprises).
    3. **Generational Mobility:** Remedial Education & Higher Education Scholarships.
    4. **Community Protection:** Civic Welfare & Grassroots Legal Awareness.
  - Interactive diagram or structural flow demonstrating how each pillar prevents family collapse:
    - Safe water stops waterborne illness and caretaking dropouts.
    - Food security at hospitals protects emergency family budgets.
    - Mother's tailoring income directly funds girls' education.
    - Remedial hubs enable first-generation students to clear Class 10/12 exams.
    - Welfare relief protects families from predatory 120% APR debt traps.

### SECTION 04: Priority Initiatives & Documented Telemetry
- **Component:** `src/components/sections/UnifiedInitiativesAndImpactSection.tsx`
- **Dual Prospective Initiatives:**
  - **Proposed 200-Student Higher Education Target:** Need-cum-merit grants paid directly to accredited colleges. Explicitly labeled *Proposed Target*.
  - **Proposed 80–100 ft Grand Hanuman Murti Cultural Project:**
    - Interactive 3D WebGL orbital experience with realistic dimensional indicators and conceptual labeling.
    - Dual-Fund Segregation disclosure: 100% separate accounting under sub-ledger `HANUMAN_MURTI`.
- **Audited Operational Telemetry:**
  - 350+ Student Participation Entries (FY 2023–24 Activity Record).
  - 120+ Vocational Course Enrolments (FY 2021–23 Multi-Cohort Cycles).
  - 10,000+ Water & Relief Service Instances (Multi-Year Field Service Log).
  - 13+ Years Statutory Trust Tenure (Continuous operations since 2013).

### SECTION 05: Documentary Exhibition & Field Archives
- **Component:** `src/components/sections/CompactMemoriesSection.tsx`
- **Narrative Focus:** Authentic field photography preview with high-resolution imagery.
- **Safeguarding & Governance:**
  - Child and vulnerable person safeguarding charter notice.
  - Full accessible modal lightbox for high-resolution inspection.
  - Direct CTA to complete `/memories-gallery` archival index.

### SECTION 06: Pathways to Participate
- **Component:** `src/components/sections/CompactGetInvolvedSection.tsx`
- **Four Distinct Audiences:**
  1. Individual Donors (Direct donation with automated 80G receipting).
  2. Institutional & Corporate Donors (CSR-1 Schedule VII partnership desk).
  3. Volunteers & Academic Mentors (Field fellowship & digital tutoring).
  4. Students & Grassroots Inquirers (Free application advisory desk).

### SECTION 07: Final Fiduciary Invitation & Canonical Contact
- **Component:** `src/components/sections/CompactFinalCtaSection.tsx`
- **Direct Accessibility:**
  - Immediate access to official telephone: `9853608113` (`tel:+919853608113`).
  - Immediate access to official email: `mect220@gmail.com` (`mailto:mect220@gmail.com`).
  - Office address: Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001.
  - Closing fiduciary pledge affirming zero leakages and honorary service.
