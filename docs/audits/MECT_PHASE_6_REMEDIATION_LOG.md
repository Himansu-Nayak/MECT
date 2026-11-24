# MECT — PHASE 6 TECHNICAL AUDIT & DEFECT REMEDIATION LOG
**Gate 9 Deliverable: Comprehensive Inventory of Identified Defects, Root Causes & Verified Resolutions**

**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Active Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Production Baseline:** `main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (`99c8b1c`)  
**Audit Date:** 2026-11-25  

---

## 1. Executive Summary

During Phase 6 technical audits, automated verification harnesses and systematic source inspections uncovered defects spanning responsive layout overflow, navigational pathway gaps, content duplication, and feature-flag safety boundaries.

Every defect was remediated under the core protocol: **Inspect -> Reproduce -> Document -> Classify -> Plan -> Implement -> Test -> Regression Test -> Record Evidence**.

---

## 2. Remediated Defects Log

### DEF-01: `/impact` Horizontal Layout Overflow (+607px Scroll Bleed)
- **Severity:** HIGH (Visual & UX Defect on Mobile and Desktop)
- **Discovery Date:** 2026-11-24
- **Affected Route:** `/impact` (`src/app/impact/page.tsx`, `src/components/charts/ImpactChartCard.tsx`)
- **Symptoms:** Initial route audit reported `scrollWidth: 1887px` vs `innerWidth: 1280px` (+607px horizontal scrolling).
- **Root Causes Discovered:**
  1. `<table className="sr-only">` directly on table element in `ImpactChartCard.tsx`. Blink/WebKit table formatting algorithms ignore `width: 1px` when laying out wide headers, expanding the table to 1886.6px.
  2. Topographic decorative SVG paths in `src/app/impact/page.tsx` contained control coordinates up to `1250px` inside a `1200px` viewBox without explicit clipping.
- **Engineering Remediation:**
  1. Wrapped the accessible companion table in `ImpactChartCard.tsx` inside `<div className="sr-only"><table className="w-full">...</table></div>`.
  2. Clamped SVG Bezier coordinates in `src/app/impact/page.tsx` to `1200px` and applied explicit `overflow-hidden`.
  3. Added `overflow-x-hidden` on the page root wrapper.
- **Verification Evidence:** `scripts/diagnose_impact.mjs` retest confirmed:
  `winW: 1280, docW: 1280, scrollW: 1280, overflowingElements: []`. **VERIFIED PASS.**

---

### DEF-02: Scholarship Action Pathway Gap on `/scholarships`
- **Severity:** MEDIUM (Information Architecture & User Pathway)
- **Discovery Date:** 2026-11-24
- **Affected Route:** `/scholarships` (`src/app/scholarships/page.tsx`)
- **Symptoms:** E2E Workflow 5 reported failure because the primary scholarships landing page did not provide visible action links navigating to `/scholarships/apply` and `/scholarships/track`.
- **Root Cause:** CTA strip only contained links to the in-page eligibility calculator and `/contact`, isolating the intake portal routes.
- **Engineering Remediation:**
  - Updated CTA strip in `src/app/scholarships/page.tsx` to include direct primary button to `/scholarships/apply` ("Apply Online") and secondary button to `/scholarships/track` ("Track Application"), alongside the Secretariat inquiry link.
- **Verification Evidence:** Automated E2E Workflow 5 retest reported `PASSED` (`applyActionPresent: true`, `trackActionPresent: true`). **VERIFIED PASS.**

---

### DEF-03: Redundant Statutory Box & Config Import in Contact Route
- **Severity:** LOW (Content Duplication & Technical Cleanliness)
- **Discovery Date:** 2026-11-24
- **Affected Route:** `/contact` (`src/app/contact/page.tsx`)
- **Symptoms:** Page rendered a standalone "Quick Statutory Reference" box that duplicated registration and PAN numbers immediately preceding the universal `<StatutoryStrip />` component. Redundant `TRUST_CONFIG` import was present.
- **Root Cause:** Legacy in-page template remnant not reconciled during earlier phase consolidations.
- **Engineering Remediation:**
  - Removed redundant in-page box.
  - Removed unused `TRUST_CONFIG` import.
  - Wired all Secretariat contact facts directly to canonical `ORG` (`@content/org`) and `MECT_ORG` (`@/config/org`).
- **Verification Evidence:** Re-audited `/contact`: 0 duplicate statutory boxes, clean DOM structure, 0 console errors, 0px overflow across all 10 viewports. **VERIFIED PASS.**

---

### DEF-04: Test Suite Viewport Coverage Gap for Hanuman Murti Project
- **Severity:** LOW (Test Harness Completeness)
- **Discovery Date:** 2026-11-24
- **Affected Component:** `scripts/verify_feature_branch_local.mjs`
- **Symptoms:** Multi-viewport regression script only evaluated 7 routes, omitting the major cultural initiative page `/campaigns/hanuman-murti`.
- **Root Cause:** Script route list had not been updated following the implementation of the dedicated Hanuman Murti project page.
- **Engineering Remediation:**
  - Expanded test route array in `scripts/verify_feature_branch_local.mjs` to include `/campaigns/hanuman-murti`.
  - Expanded test matrix from 70 to 80 evaluations (8 routes × 10 viewports).
- **Verification Evidence:** 80/80 automated viewport evaluations passed with 0px overflow and 0 broken image assets. **VERIFIED PASS.**

---

### DEF-05: Donor Portal Premature Exposure Prevention
- **Severity:** HIGH (Production Security Posture)
- **Discovery Date:** 2026-11-24
- **Affected Routes:** `/portal/*`, `/login`, `/register`
- **Audit Requirement:** Confirm donor portal routes do not expose incomplete session handling or unverified OTP workflows in production default configuration.
- **Engineering Verification:**
  - Gated all donor portal surfaces behind `isDonorPortalEnabled()` (`ENABLE_DONOR_PORTAL="false"`).
  - Verified that un-flagged requests trigger canonical Next.js `notFound()`, returning HTTP 404 with zero internal state disclosure.
- **Verification Evidence:** Gate 2 route audit and E2E Workflow 7 confirmed clean HTTP 404 responses. **VERIFIED PASS.**

---

### DEF-06: WhatsApp Notification Subsystem Production Safety
- **Severity:** HIGH (External Integration & Production Stability)
- **Discovery Date:** 2026-11-24
- **Affected Subsystem:** Enterprise WhatsApp Cloud API Outbox Engine (`backend`)
- **Audit Requirement:** Guarantee that WhatsApp notifications cannot trigger unauthorized external network calls or mutate production state.
- **Engineering Verification:**
  - Maintained `WHATSAPP_ENABLED=false` across all application profiles.
  - Verified transactional outbox worker skips external dispatch and records audit entries when flag is disabled.
- **Verification Evidence:** Gate 5 API/Database audit and Flyway V18 schema verification confirmed complete safety isolation. **VERIFIED PASS.**

---

## 3. Remediation Summary Table

| Defect ID | Component / Area | Root Cause | Remediation Applied | Automated Retest | Status |
|-----------|------------------|------------|---------------------|------------------|--------|
| **DEF-01** | `/impact` | Direct `sr-only` on `<table>` + SVG coordinate bleed | Wrapped in `div.sr-only`, clamped SVG to 1200px | `scripts/diagnose_impact.mjs` | **RESOLVED** |
| **DEF-02** | `/scholarships` | Missing CTA links to intake sub-routes | Added direct links to `/scholarships/apply` and `/scholarships/track` | `scripts/audit_e2e_workflows.mjs` | **RESOLVED** |
| **DEF-03** | `/contact` | Redundant in-page statutory box & unused import | Removed duplicate box, unified with canonical `ORG` | `verify_feature_branch_local.mjs` | **RESOLVED** |
| **DEF-04** | Test Harness | Missing `/campaigns/hanuman-murti` in viewport suite | Added route to test harness (expanded to 80 evaluations) | `verify_feature_branch_local.mjs` | **RESOLVED** |
| **DEF-05** | `/portal/*` | Potential unauthenticated portal access | Gated behind `ENABLE_DONOR_PORTAL=false` returning 404 | `scripts/audit_all_routes.mjs` | **RESOLVED** |
| **DEF-06** | WhatsApp Engine | Risk of untracked external Cloud API calls | Enforced `WHATSAPP_ENABLED=false` with outbox audit | Backend inspection & schema audit | **RESOLVED** |

---

## 4. Gate 9 Acceptance Verdict

**GATE 9 ACCEPTANCE STATUS: PASSED**
- All 6 identified defects documented with exact root causes, code fixes, and reproduction scripts.
- 100% of remediations retested and confirmed passing with zero regressions introduced.
