# PHASE M6 REPORT — Donate, Receipt Desk & Forms

- **Phase:** `PHASE M6`
- **Branch:** `motion-ui`
- **Date:** 2026-11-12
- **Gate:** **PASS**

---

## Completed Tasks

- **M6.1** Added `donationIntentPresets` (`[1000, 2500, 5000, 10000, 25000]`) to `content/org.ts` and created `src/components/motion/AmountPad.tsx` (`// motion: owner = Motion`, `layoutId` active preset highlight, pledge/remittance record only), mounted in `src/app/donate/page.tsx`.
- **M6.2** Created `src/components/motion/CopyButton.tsx` (`// motion: owner = Motion`, 150ms `AnimatePresence` icon swap + `aria-live="polite"` `"Copied"` status) and wired it into `src/components/sections/SbiDonationSection.tsx` (bank credential & UPI ID copy buttons) and `src/app/scholarships/apply/page.tsx` (application reference copy button).
- **M6.3** Created `src/components/motion/SaveStatus.tsx` and `src/components/motion/InlineAlert.tsx` (`// motion: owner = Motion`) and wired `useToast().promiseToast`, `SaveStatus`, `InlineAlert`, per-field validation, and focus-first-error into the `/donate` Receipt Desk form.
- **M6.4** Added `scholarshipIntake.intakeOpen: false` to `content/org.ts` and gated Step 5 document `file-upload` controls in `src/app/scholarships/apply/page.tsx` behind `ORG.scholarshipIntake.intakeOpen === true`.
- **M6.5** `slot-picker` skipped (no document-inspection booking backend exists in `src/app/api/`).
- **M6.6** Created `src/components/motion/SlideTextButton.tsx` (secondary actions on `/`, `/donate`, and `SbiDonationSection`) and `src/components/motion/AttractButton.tsx` (single hero CTA on `/`, disabled on coarse-pointer touch devices and `useReducedMotion()`).

## Verification

- `npm run lint`: **PASS** (exit `0`, 0 errors, 4 pre-existing upstream warnings in `src/components/charts/`)
- `npm run typecheck`: **PASS** (exit `0`)
- `npm run build`: **PASS** (exit `0`, 37/37 routes built)
- `npm run audit:motion -- --shots=reports/shots/m6`: **PASS** (exit `0`, `TOTAL FAILURES: 0` across 18 routes)
  - `REDUCED_MOTION`: **PASS** (0) | `NO_JS_CONTENT`: **PASS** (0) | `FORBIDDEN_PROPS`: **PASS** (0) | `SINGLE_OWNER`: **PASS** (0) | `BUNDLE_BUDGET`: **PASS** (0)
- **Home (`/`) First-Load JS:** `319.78 KB` gzipped (baseline `279.75 KB`, delta `40.02 KB`, within `<= 60.00 KB` budget)
- **Screenshots:** `reports/shots/m6-home-desktop.png`, `reports/shots/m6-home-mobile.png`
