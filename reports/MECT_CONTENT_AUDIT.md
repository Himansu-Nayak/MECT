# MECT Website Content Audit & Restructuring Report

**Date:** 2026-11-12  
**Branch:** `motion-ui`

## 1. Public Route & Section Classification

| Route / Section | Classification | Action Taken | Rationale |
|---|---|---|---|
| `/` — Section 1 (Photographic Hero) | **KEEP** | Preserved | Primary institutional identity and CTA to `/donate` and `/programmes` |
| `/` — Section 2 (Credibility Vault & Intro) | **KEEP** | Preserved | Grounded trust deed, PAN (`AADTM5474F`), CSR-1 (`CSR00081063`) |
| `/` — Free Education & 5 Development Sectors | **CONSOLIDATE** | Updated CTA to `/donate?programme=EDUCATION_LEARNING` | Eliminated legacy `/#donate-sbi` fragment link |
| `/` — Impact, How MECT Works, Stories Rail | **KEEP** | Preserved | Core storytelling and operational delivery sections |
| `/` — Scholarship Explorer & Eligibility Calculator | **KEEP** | Preserved | Student scholarship suite separate from donor checkout |
| `/` — CSR Registration, Trustee Charter, Volunteer Desk, Inquiry Desk | **KEEP** | Preserved | Institutional governance, volunteer onboarding, and public secretariat desk |
| `/` — Old Section 11 (`SbiDonationSection` + 80G Estimator + Notice Box) | **REMOVE / CONSOLIDATE** | Replaced with compact Unified Donation CTA linking to `/donate` & `/portal/dashboard` | Eliminated duplicate 270-line donation/80G form from homepage; `/donate` is now the single canonical donation journey |
| `/donate` (`UnifiedDonationExperience`) | **PRIMARY** | Redesigned as 5-step unified flow | Consolidates Cashfree primary, intelligent SBI fallback, and UTR verification claim |
| `/portal/dashboard` | **UPGRADE** | Added Claim Guest Donations + SBI UTR tracker + Download Receipts | Complete donor self-service |
| `/statutory-disclosures` | **KEEP** | Preserved | Dedicated compliance & certificate verification page |

## 2. CTA Consolidation Summary
- `Header.tsx`: All desktop and mobile Donate CTAs route to `/donate`; Donor Portal routes to `/portal/login`.
- `Footer.tsx`: All Donate CTAs route to `/donate`.
- `FreeEducationSection.tsx`: Updated from `/#donate-sbi` to `/donate?programme=EDUCATION_LEARNING`.
- `SmileFundraisingSection.tsx`: Updated from `/#donate-sbi` to `/donate` and `/portal/dashboard`.
- `SbiDonationSection.tsx`: Updated from `/donate#receipt-claim` to `/donate?method=SBI_DIRECT`.

