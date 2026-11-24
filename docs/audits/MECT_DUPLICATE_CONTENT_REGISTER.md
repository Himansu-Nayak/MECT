# MECT — DUPLICATE CONTENT & STRUCTURAL REDUNDANCY REGISTER
**Phase 1 Comprehensive De-duplication Ledger**

- **Project:** Mahaveer Educational & Charitable Trust (MECT)
- **Domain:** `https://mect.org.in/`
- **Canonical Repository:** `https://github.com/Himansu-Nayak/MECT.git`
- **Audit Date:** 2026-11-24T14:17:00+05:30
- **Auditor:** Antigravity Principal Architecture & Content Strategist
- **Base Commit:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`
- **Active Branch:** `feat/complete-website-redefinition-and-deduplication`

---

## 1. Executive Summary & Audit Methodology

A repository-wide audit was conducted across all 47 routes in `src/app`, 50+ components in `src/components`, configuration files in `src/config` and `src/lib`, and data files in `content/`.

Duplication was detected and classified at four distinct levels:
1. **Level A: Exact Duplicate Content** — Verbatim sentences, legal disclaimers, statutory numbers, and contact strings repeated in JSX without single-source references.
2. **Level B: Semantic Duplication** — Distinct components paraphrasing the exact same institutional fact, founder profile, honorary trusteeship clause, or impact metrics with slightly differing phrasing.
3. **Level C: Structural Duplication** — Independent, parallel component implementations performing identical user-facing functions (e.g., three separate marquee implementations, four donation checkout variations, two disbursal flowcharts).
4. **Level D: Configuration Duplication** — Multiple competing files maintaining disconnected or conflicting subsets of organisation truth (`src/config/org.ts`, `content/org.ts`, `src/lib/config.ts`, `src/lib/content-registry.ts`, `src/lib/homepage-content.ts`).

---

## 2. Master Duplicate Content Register

| Finding ID | Classification | Duplicate Subject / Content | Exact File Locations (Found In) | Canonical Source | Recommended Action | Regression Test |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DUP-CFG-01** | Configuration | Organisation Identity & Statutory IDs | `src/config/org.ts`, `content/org.ts`, `src/lib/config.ts`, `src/lib/content-registry.ts` | `src/lib/content-registry.ts` (Phase B typed master registry) + `src/config/org.ts` | Centralise: re-export `content/org.ts` and `src/lib/config.ts` from canonical master registry; eliminate divergent definitions. | `npm run typecheck`, metadata audit |
| **DUP-CFG-02** | Configuration | Board of Trustees & Founder Profile | `content/trustees.ts`, `content/org.ts`, `src/config/org.ts`, `src/lib/content-registry.ts` | `src/lib/content-registry.ts` | Centralise: Single canonical definition of Settler Founder & Managing Trustee **Er. Japabandhu Kampa** (Clauses 8(2), 10, XVI). | Profile rendering across `/about`, `/governance`, `/` |
| **DUP-TXT-01** | Exact | Trust Deed Reference string `"Doc No. 40311302194"` / `"Book 4, Vol 45"` | 19 files across `src/app/`, `src/components/sections/`, `src/config/` | `MECT_CONTENT_REGISTRY.identity.deedDocumentReference` | Centralise: Replace hardcoded strings with typed import from canonical registry. | Grep verification (0 hardcoded literals) |
| **DUP-TXT-02** | Exact | Permanent Account Number `"AADTM5474F"` | 17 files across `src/app/`, `src/components/`, `src/lib/` | `MECT_CONTENT_REGISTRY.statutoryCredentials[1].registrationNumber` | Centralise: Reference canonical PAN attribute across forms, footers, and receipts. | Receipt generation & footer render |
| **DUP-TXT-03** | Exact | MCA CSR-1 Registration `"CSR00081063"` | 18 files across `src/app/`, `src/components/`, `src/lib/` | `MECT_CONTENT_REGISTRY.statutoryCredentials` (CSR-1 entry) | Centralise: Reference canonical CSR record. | `/csr-partnerships` and `/statutory-disclosures` |
| **DUP-TXT-04** | Exact | NITI Aayog NGO Darpan `"OR/2024/0466491"` | 10 files across `src/app/`, `src/components/`, `src/lib/` | `MECT_CONTENT_REGISTRY.statutoryCredentials` (Darpan entry) | Centralise: Enforce verified `OR/2024/0466491` everywhere. | Statutory compliance view |
| **DUP-TXT-05** | Exact | Honorary Trusteeship Clause `"Clause XVI"` disclaimer | 19 files across pages, hero, telemetry, pledge, and footers | `MECT_CONTENT_REGISTRY.identity.honoraryClause` | Centralise: Import single verified statement: *"All trustees serve in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI."* | Governance page audit |
| **DUP-TXT-06** | Exact | Impact metric disclaimers: `"350+ recorded student participation entries..."`, `"120+ cumulative vocational course enrolments..."`, `"10,000+ recorded water and relief..."` | 7 files (`src/app/csr-partnerships/page.tsx`, `src/app/impact/page.tsx`, `src/components/charts/ImpactChartsSection.tsx`, `src/components/sections/ReportsLibrarySection.tsx`, etc.) | `MECT_CONTENT_REGISTRY.verifiedOutputs` & `HOMEPAGE_CONTENT.metrics` | Centralise: Create canonical telemetry constants in `content-registry.ts`. | Impact page & CSR page render |
| **DUP-TXT-07** | Exact | Postal addresses (Balangir Registered Office & Bhubaneswar Administrative Office) | 5 files across `src/app/about`, `src/app/governance`, `src/config/org.ts`, `src/lib/content-registry.ts`, `content/org.ts` | `MECT_CONTENT_REGISTRY.offices` / `MECT_ORG.addresses` | Centralise: Uniform address presentation across contact, about, governance, and footer. | Contact page & Schema.org markup |
| **DUP-STR-01** | Structural | Ticker / Marquee Components (`StatutoryTicker.tsx`, `InstitutionalMarquee.tsx`, `HeroBackgroundMarquee.tsx`) | `src/components/layout/StatutoryTicker.tsx`, `src/components/InstitutionalMarquee.tsx`, `src/components/sections/HeroBackgroundMarquee.tsx` | `src/components/InstitutionalMarquee.tsx` | Merge & Deduplicate: Standardize on a single, high-performance, accessible marquee component that respects `prefers-reduced-motion` and eliminates duplicate animation loops. | Responsive audit at 320px–1920px |
| **DUP-STR-02** | Structural | Donation Experience & Checkout Components | `SmartDonationCheckout.tsx`, `UnifiedDonationExperience.tsx`, `SbiDonationSection.tsx`, `DonationClaimSection.tsx`, `UpiQrCard.tsx`, `DonationProgrammeCard.tsx` | `src/components/donation/UnifiedDonationExperience.tsx` | Merge & Rationalize: Consolidate donation checkout into a clean, unified experience supporting SBI NEFT/RTGS, UPI QR, and online gateway fallback without duplicate form logic. | Donation form validation & submission |
| **DUP-STR-03** | Structural | Statutory Disclosures & Compliance Strips | `StatutoryStrip.tsx`, `TaxStatusNotice.tsx`, Footer Tier 1 Box, `StatutoryGovernanceSection.tsx` | `src/components/compliance/TaxStatusNotice.tsx` | Harmonize: Maintain single reusable statutory disclosure banner component used in Footer and disclosures. | Footer layout verification |
| **DUP-STR-04** | Structural | Disbursal Flowcharts | `DirectDisbursalFlowchart.tsx` vs `CompactHowMectWorks.tsx` | `DirectDisbursalFlowchart.tsx` | Merge: Retain the clean, accessible SVG-based flowchart; eliminate redundant duplicate block. | `/scholarships` and `/about` inspection |
| **DUP-SEM-01** | Semantic | Founder Biography Variations | `content/trustees.ts`, `src/app/about/page.tsx`, `src/app/governance/page.tsx`, `src/components/sections/InstitutionalStorySection.tsx` | `MECT_CONTENT_REGISTRY.governance.managingTrustee` | Standardize: Single canonical narrative honoring Settler Founder & Managing Trustee Er. Japabandhu Kampa across all pages. | Bio check on `/about` and `/governance` |
| **DUP-SEM-02** | Semantic | Charitable Purpose & 5 Pillars Explanations | `src/app/page.tsx`, `src/app/programmes/page.tsx`, `src/app/about/page.tsx`, `src/components/sections/InterconnectedSafetyNetSection.tsx` | `MECT_CONTENT_REGISTRY.programmes` | Harmonize: Homepage provides concise institutional synthesis; `/programmes` provides full operational depth without copying verbatim paragraphs. | Route-to-content ownership check |
| **DUP-SEM-03** | Semantic | Corporate CSR Value Proposition | `src/app/csr-partnerships/page.tsx` vs `src/components/sections/TailoredParticipationPathwaysSection.tsx` | `src/app/csr-partnerships/page.tsx` | Streamline: Tailored pathways on homepage provide short 2-line gateway; deep CSR compliance information resides solely on `/csr-partnerships`. | Homepage and CSR page review |

---

## 3. De-duplication Action Plan & Risk Assessment

1. **Safety Guarantee:** No database records, payment records, or live secrets will be altered.
2. **Re-export Pattern:** Rather than abruptly deleting legacy files like `content/org.ts` or `src/lib/config.ts` which could break downstream imports, they will be refactored to re-export directly from the canonical `src/lib/content-registry.ts` and `src/config/org.ts`.
3. **Automated Verification:** Following each consolidation step, `npm run typecheck`, `npm run lint`, and `npm run build` will verify zero regressions.
