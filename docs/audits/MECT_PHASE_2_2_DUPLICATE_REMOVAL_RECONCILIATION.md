# MECT — PHASE 2.2: DUPLICATE REMOVAL & CONSOLIDATION RECONCILIATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Origin:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Audit Phase:** Phase 2.2 — Duplicate Removal & Forensic Code Reconciliation  
**Status:** Executed & Reconciled  

---

## 1. Executive Summary

Phase 2.2 reconciles all structural, component, route, and content deduplications executed during Phase 2.0. Every change was performed with strict change-control rules:
* Zero regression of active user journeys.
* Zero loss of statutory compliance data.
* Full alignment with the single source of truth (`src/config/org.ts`).
* Preservation of backwards compatibility for existing automated tests and scripts.

---

## 2. Superseded Component Deletion Matrix

Three dead/superseded components that accumulated during rapid iterative phases were verified to have zero active production imports and were safely deleted:

| Component Path | Lines Deleted | Superseded By | Verification Method | Deletion Status |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/donation/DonationClaimSection.tsx` | 537 | `DonationJourney.tsx` (Step 6: Payment Remittance & UTR Claim) | Grep search confirmed 0 imports in `src/app/**` or `src/components/**`. Fully subsumed in unified 7-step journey. | **Deleted** |
| `src/components/donation/UpiQrCard.tsx` | 159 | `DonationJourney.tsx` (Step 6: Integrated SBI QR & Copy Actions) | Grep search confirmed 0 imports across the codebase. Replaced by responsive QR card in `DonationJourney`. | **Deleted** |
| `src/components/sections/DonationProgrammeCard.tsx` | 194 | `DonationJourney.tsx` (Step 1: Programme Selector Cards) | Grep search confirmed 0 imports. Used deprecated legacy programme schemas. | **Deleted** |
| **Total Lines Purged** | **890** | — | — | **Fully Reconciled** |

---

## 3. Global Telephone & Helpline Consolidation Matrix

Prior to Phase 2.0, the codebase exhibited divergent telephone numbers across legacy files:
* Legacy Number 1: `+91 94371 23616` (old Balangir contact)
* Legacy Number 2: `9853608113` / `+91 98536 08113` (old admin contact)
* Canonical Number: `+91 94382 95223` (official organizational mobile/WhatsApp helpline)

All occurrences across frontend code, backend services, documentation, and email templates have been unified to `+91 94382 95223`:

| File Path | Previous Divergent Value | Canonical Updated Value | Change Details |
| :--- | :--- | :--- | :--- |
| `src/config/org.ts` | `+91 94371 23616` | `+91 94382 95223` | Master SSOT updated (`primaryPhone`, `displayPhone`, `e164Phone`, `whatsappNumber`). |
| `src/lib/content-registry.ts` | `+91 94371 23616` | `+91 94382 95223` | Institutional registry updated across registered and liaison offices; fallback UPI updated. |
| `src/lib/ai/mect-knowledge.ts` | `+91 94371 23616` | `+91 94382 95223` | AI assistant context updated for helpline and WhatsApp queries. |
| `src/app/login/page.tsx` | `+91 94371 23616` | `+91 94382 95223` | Donor login support helpline text and `tel:` href updated. |
| `src/app/register/page.tsx` | `+91 94371 23616` | `+91 94382 95223` | Donor registration support helpline text and `tel:` href updated. |
| `src/app/faq/page.tsx` | `+91 94371 23616` | `+91 94382 95223` | FAQ helpdesk text and WhatsApp consultation link updated. |
| `src/app/admin/demo/page.tsx` | `+91 94371 XXXXX` | `+91 94382 XXXXX` | Admin demonstration placeholder updated. |
| `src/app/portal/security/page.tsx`| `+919437123616` | `+919438295223` | Security settings placeholder updated. |
| `src/app/page.tsx` | `+91 94371 23616` | `+91 94382 95223` | Top-of-file structural comment updated. |
| `content/todo-confirm.md` | `+91 94371 23616` | `+91 94382 95223` | Helpline checklist reference updated. |
| `ReceiptPdfService.java` | `+91 9853608113` | `+91 94382 95223` | Automated donation 80G PDF receipt contact line updated. |
| `EmailTemplateRenderer.java` | `+91 9853608113` | `+91 94382 95223` | HTML and text transactional email notification templates updated. |

**Verification Check:**
`git grep -n -E "(9437123616|94371 23616|9853608113|98536 08113)" src/ backend/src/main/ content/` returns **0 occurrences**.

---

## 4. Email Notification Template Deduplication

During audit of `backend/src/main/java/org/mahavirtrust/backend/service/notification/EmailTemplateRenderer.java`:
* **Issue Identified:** In both `buildHtmlEmail()` and `buildPlainTextEmail()`, the footer rendered two consecutive lines referencing telephone assistance:
  ```
  Line 1: For donation queries or assistance, contact: +91 9853608113 / mect220@gmail.com
  Line 2: Telephone Helpline: +91 9853608113 (Mon-Sat 10:00 - 17:30 IST)
  ```
* **Remediation:** Consolidated into a single canonical notification notice:
  ```
  Helpline: +91 94382 95223 | Email: mect220@gmail.com (Mon-Sat 10:00 - 17:30 IST)
  ```
* **Outcome:** Clean, professional transactional emails without repetitive footer notices.

---

## 5. URL Link & Route Reconciliation

* **Broken / Redundant Link Fixed:**
  In `src/app/login/page.tsx` and `src/app/register/page.tsx`, the terms footer referenced `/privacy-policy` which was an unmounted path. Replaced with the canonical `/privacy` route.
* **Portal Login Route Handled:**
  `/portal/login` was retained as an intentional zero-flicker client-side redirect (`useRouter().replace('/login')`) ensuring that legacy bookmarks and internal links safely transition to the unified progressive donor auth journey.

---

## 6. Documented Retained Components (Exception Justifications)

The following components were forensically reviewed and intentionally retained:

| Component | Status | Justification |
| :--- | :--- | :--- |
| `DeveloperCreditCard.tsx` | Retained (Unmounted) | Referenced by `scratch/test-phase-p2-navigation.mjs` test suite. Safe to keep until test cleanup. |
| `InstitutionalMarquee.tsx` | Retained (Unmounted) | Replaced in production by `StatutoryTicker.tsx` and `StatutoryStrip.tsx`, but preserved for backwards reference. |
| `HanumanMurtiVisual.tsx` | Retained (Active) | Essential 29-line modular wrapper around `HanumanMurti3DExperience.tsx` imported across 3 public pages. |

---

## 7. Quality Gates & Regression Verification

Post-deduplication, the following verification gates were executed:
1. `npm run typecheck` — **PASSED** (0 TypeScript errors)
2. `npm run lint` — **PASSED** (0 ESLint errors, 0 warnings)
3. Code cleanliness — Verified zero broken imports following component removals.
