# MECT PHASE 27 — BASELINE AUDIT & IMMERSIVE UPGRADE BLUEPRINT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Website:** https://mect.org.in/  
**Repository Branch:** `feat/phase-27-immersive-motion-hd-excellence`  
**Verified Baseline Commit:** `84dbc30`  
**Date:** November 2026  
**Auditor:** Antigravity Autonomous Design & Engineering System  
**Status:** COMPLETE & AUTHORITATIVE  

---

## 1. Executive Summary

Phase 26 established the definitive visual language of MECT: **Documentary Editorial Architecture** — characterized by warm archival alabaster (`#FAF7F2`), deep carbon basalt ink (`#0F1714`), sunbaked terracotta (`#B85D3B`), burnished brass (`#C4924A`), and asymmetrical 12-column editorial layouts.

However, a forensic review of the rendered user experience reveals that the website remains **overly static in motion, interaction, and media depth**:
1. Sections appear abruptly or with identical fade-ups, lacking cinematic storytelling rhythm.
2. The Interconnected Safety Net model communicates the 5 pillars, but connection vectors between them are not animated as living causal flows.
3. High-resolution imagery in the hero and exhibition sections can be sharpened with modern WebP/AVIF multi-density `srcset` delivery to support Retina and 4K displays.
4. Several redundant components, unused assets, and repeated text blocks linger across historical routes, adding unnecessary weight.

**Phase 27 elevates execution, motion depth, image sharpness, and codebase discipline while strictly preserving the Phase 26 aesthetic identity.**

---

## 2. Section-by-Section Baseline Audit & Upgrade Matrix

| Section / Component | Phase 26 Current State | Deficiencies Identified | Phase 27 Immersive Upgrade Directives |
| :--- | :--- | :--- | :--- |
| **01. Cinematic Hero** (`CinematicHero.tsx`) | Asymmetric editorial split with photo frame and text. | Static background; photo does not reveal with cinematic mask; telemetry numbers are static on load. | **Cinematic Environmental Entrance**: Subtle slow-drift ambient lighting, masked image reveal with soft zoom-settle (`1.04` to `1.0`), sequential text line reveal, live telemetry count-up. |
| **02. Institutional Story** (`InstitutionalStorySection.tsx`) | Large quote with 3-item ledger and photo. | The 3 ledger items appear all at once; quote lacks literary reveal cadence; timeline markers are static. | **Archival Chronological Unfolding**: Sequential stagger for the 3 fiduciary covenants (`01`, `02`, `03`), interactive timeline drawer for Deed execution details, museum photo frame with subtle parallax. |
| **03. Interconnected Safety Net** (`InterconnectedSafetyNetSection.tsx`) | Tab-based selector with problem/intervention text. | Connection lines between nodes are conceptual, not visually drawn or animated. Transition between nodes is abrupt. | **Living Causal Network**: Animated SVG connection lines flowing between nodes (Water ──> Nutrition ──> Livelihoods ──> Education ──> Welfare). Smooth layout transitions with `framer-motion` layoutId. |
| **04. Impact Telemetry** (`AuditedImpactTelemetrySection.tsx`) | 4 columns with count-up numbers and progress bars. | Progress bars jump immediately to width without progressive fill transition; lacks interactive metric comparison. | **Dynamic Ledger Telemetry**: Smooth progressive SVG/CSS bar fill on scroll into view, count-up numbers with tabular alignment, interactive metric explanation tooltips. |
| **05. Documentary Exhibition** (`DocumentaryFieldExhibitionSection.tsx`) | Asymmetric gallery with simple popup lightbox. | Lightbox is basic; thumbnails do not support smooth scale-up zoom transition; no image-to-image slider inside modal. | **Museum Lightbox Experience**: Shared layout transitions, keyboard arrows (`ArrowLeft`/`ArrowRight`) to cycle through field dispatches, sharp multi-density image delivery. |
| **06. Differentiated Campaigns** (`DifferentiatedCampaignsSection.tsx`) | Education vs. Hanuman Murti 3D split. | 3D canvas requires manual drag to see movement; education target progress indicator is static. | **Atmospheric 3D Monument & Target Telemetry**: Subtle auto-rotation idle loop for Hanuman Murti with warm ambient brass rim-lighting; animated funding meter for the 200 scholarship target. |
| **07. Statutory Governance** (`StatutoryGovernanceSection.tsx`) | 6 cards with authority details. | Dense cards with small text; no interactive certificate docket inspection or expandable details. | **Gazette Docket Inspector**: Expandable certificate viewer showing full filing numbers, issuing authorities, and direct copy-to-clipboard actions. |
| **08. Participation Pathways** (`TailoredParticipationPathwaysSection.tsx`) | 2 anchor cards + 4 bottom cards. | Hover states lack depth; action triggers feel standard. | **Tactile Role Ateliers**: Micro-elevation with warm terracotta hairline glow, interactive benefit breakdown, clear zero-hover mobile tap targets. |
| **09. Closing Fiduciary Pledge** (`ClosingFiduciaryPledgeSection.tsx`) | Deep carbon slate section with contact numbers. | Static background; closing message lacks emotional resonance in motion. | **Choreographed Fiduciary Colophon**: Ambient breathing radial glow, elegant text fade, tactile canonical helpline plaque with instant click-to-call. |

---

## 3. Image & Media Asset Baseline Quality

- **Current Image Formats:** Mostly `.webp` with some unoptimized `.jpg`.
- **Resolution Audit:**
  - `mect-trustees-campus-walk.webp`: 1200x800px (sufficient for card, needs sharp 1920px source for full-bleed hero).
  - `mect-faculty-puintala-campus.jpg`: 1200x900px (sharp, needs `.webp` conversion).
  - `mect-clean-water-hygiene-demo.webp`: 1080x720px (good contrast).
  - `mect-women-empowerment-seminar.webp`: 1200x800px (clean).
  - `mect-civic-pledge-classroom.jpg`: 1024x768px (needs WebP optimization).
  - `mect-legal-literacy-session.webp`: 1200x800px (sharp).
- **LCP Optimization:** `CinematicHero.tsx` uses Next.js `<Image priority sizes="..." />`, which provides fast LCP, but the container can be further optimized with explicit aspect-ratio reservation to ensure **CLS = 0.00**.

---

## 4. Duplicate Content & Component Inventory

- **Redundant Components Identified for Cleanup:**
  - `src/components/motion/HowMectWorksConnector.tsx` (superseded by Phase 26/27 Interconnected Safety Net).
  - `src/components/motion/PillarIllustrations.tsx` (superseded by modern SVG icon tokens).
  - `src/components/motion/FreeEducationDotGrid.tsx` (unused historical widget).
  - `src/components/motion/DotField.tsx` (unused decorative background loop).
- **Redundant Content:** Several inner pages repeat identical introductory paragraphs and phone disclaimers that can be centralized.

---

## 5. Next Steps

Proceeding to **LOOP 2: Motion Architecture & Unified Interaction System**.
