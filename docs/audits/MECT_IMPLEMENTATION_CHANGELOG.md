# MECT — MASTER IMPLEMENTATION CHANGELOG

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Developer:** Cognisoftoho Technologies Private Limited ([https://ohotechn.com](https://ohotechn.com))  
**Date:** 2026-11-27  
**Branch:** `feat/complete-website-redefinition-and-deduplication`  

---

## 1. COMPONENT-BY-COMPONENT CHANGE INVENTORY

### Change Set 1: Navigation & Header De-duplication (Phases 1 & 2)
- **`src/lib/config.ts`:**
  - Removed duplicate `Donate` item from `TRUST_CONFIG.navigation`. The prominent `Donate Now` button on the far right remains the sole primary call to action.
  - Streamlined navigation items to: About, Programmes, Impact, Campaigns, Governance, Reports & Disclosures.
- **`src/components/Header.tsx`:**
  - Implemented dynamic directional scroll behavior (`useScroll` + `useMotionValueEvent`): smoothly translates off-screen (`translateY(-100%)`) on downward scroll (>100px) and smoothly translates into view (`translateY(0%)`) on upward scroll or top of page.
  - Resolved right-side utility collision by optimizing spacing and breakpoints between LanguageToggle, SiteSearchTrigger, Donor Account indicator, and Donate CTA.

### Change Set 2: Donation Programme & Payment Flow Fixes (Phases 3, 4, 5, 7, 8)
- **`backend/.../DonationLifecycleService.java`:**
  - Added intelligent `resolveActiveProgramme(code)` alias resolver that seamlessly maps both frontend shortened codes (`GENERAL`, `EDUCATION`, `WATER`, `WOMEN`, `FOOD`) and canonical database codes (`GENERAL_FUND`, `EDUCATION_LEARNING`, `SAFE_WATER_SANITATION`, `WOMEN_EMPOWERMENT`, `FOOD_SECURITY_RELIEF`).
  - Permanently eliminates the "Selected donation programme is unavailable or inactive" error.
- **`backend/.../DonationController.java`:**
  - Made `portalUserId` optional in `submitSbiUtrClaim` and `initiateDonation` so that public donors (unauthenticated/guest) can make contributions and submit remittance claims without encountering HTTP 401 Unauthorized errors.
- **`src/components/donation/DonationJourney.tsx`:**
  - Updated `VERIFIED_DONATION_PROGRAMMES` to canonical database codes.
  - Fixed Cashfree SDK v3 checkout launch flow, with clean fallback and error presentation.
  - Validated UTR submission and remittance claim flow.

### Change Set 3: Website Information, Address & Identity Corrections (Phases 11–17)
- **`src/config/org.ts`:**
  - Updated primary email to `mectbbsr13@gmail.com`.
  - Updated official registered/administrative address to:
    `A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014, India`.
  - Removed Balangir as public office address; updated map URLs.
- **`src/components/Footer.tsx`:**
  - Removed Deed Number from ordinary copyright bar.
  - Replaced personal developer attribution with `Website Developed by Cognisoftoho Technologies Private Limited` linking to `https://ohotechn.com` with `target="_blank" rel="noopener noreferrer"`.
  - Integrated Bhubaneswar Lewis Plaza address and `mectbbsr13@gmail.com`.
  - Cleaned up long raw photography attribution into concise, elegant notice.
- **`src/app/governance/page.tsx`:**
  - Removed the public-facing "BOARD COMPOSITION" / "Board of Trustees" Clause 8(1) card and reclaimed layout space.
- **`src/app/page.tsx` & `src/components/sections/StatutoryGovernanceSection.tsx`:**
  - Removed public-facing Section 08 ("Statutory Transparency: Verifiable Sovereign Registrations"), reclaimed layout space, and renumbered subsequent sections cleanly.

### Change Set 4: Homepage Hero Image Gallery (Phase 18)
- **`src/components/sections/CinematicHero.tsx`:**
  - Replaced single static image with a 6-photo authentic MECT documentary gallery/carousel.
  - Included interactive dot navigation, pause/play, captions, and smooth crossfade transitions.
  - Prioritized authentic education, women empowerment, clean water, and community relief photos.
