# MECT PHASE 29.2 — DEFECT REGISTER AND REMEDIATION LOG
## Comprehensive Vulnerability & Functional Defect Register

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Defect Loop:** AUDIT &rarr; IDENTIFY &rarr; CLASSIFY &rarr; FIX &rarr; TEST &rarr; VERIFY &rarr; DOCUMENT  
**Execution Date:** 19 November 2026  

---

## 1. DEFECT CLASSIFICATION MATRIX

| Defect ID | Affected Component | Severity | Root Cause | Remediation Applied | Re-Test Verification | Status |
| :---: | :--- | :---: | :--- | :--- | :--- | :---: |
| **DEF-01** | `/portal/*` route guards & context | **HIGH** | Client route guards redirected unauthenticated visitors to `/portal/login`, adding an extra redirect hop and page flash. | Updated `dashboard`, `profile`, `welcome`, `config.ts`, and context logout to route directly to `/login?next=...`. | Tested unauthenticated navigation directly to `/portal/dashboard`; immediate clean transition to `/login?next=...` confirmed. | **RESOLVED** |
| **DEF-02** | `/login` & `/register` phone validation | **MEDIUM** | String validation checked `cleaned.length === 10` without stripping leading `+91` or `91` prefixes when pasted by users. | Added country prefix normalizer stripping `+91`/`91` before executing digit length and regex tests. | Verified both 10-digit typing (`9853608113`) and 12-digit pasting (`+919853608113`); both pass validation cleanly. | **RESOLVED** |
| **DEF-03** | `UnifiedDonationExperience.tsx` Step 3 | **MEDIUM** | Step 3 provided only inline OTP verification without clear pathways to dedicated login or registration gateways. | Added explicit quick links to `/login` and `/register` with preserved programme and amount parameters. | Verified presence of dedicated quick links in `donate-step3-auth.png`. | **RESOLVED** |
| **DEF-04** | `UnifiedDonationExperience.tsx` state return | **MEDIUM** | Returning from login with `searchParams` restored the amount but left the wizard on Step 1, requiring duplicate clicks. | Added automatic detection of preselected cause and amount for authenticated donors, advancing to Step 4. | Returning donors land directly on Step 4 with their pre-filled profile. | **RESOLVED** |
| **DEF-05** | `UnifiedDonationExperience.tsx` ESLint hook | **LOW** | Missing `portalToken` in `useEffect` dependency array triggered `react-hooks/exhaustive-deps` warning. | Added `portalToken` to dependency array to ensure reactive initialization. | ESLint runs with 0 errors. | **RESOLVED** |

---

## 2. DEFECT REMEDIATION VERIFICATION

1. **DEF-01 Verification:** Verified that direct unauthenticated visits to `/portal/dashboard`, `/portal/donations`, `/portal/receipts`, `/portal/profile`, and `/portal/security` trigger an immediate single-hop navigation to `/login?next=/portal/...`. No intermediate `/portal/login` page is rendered.
2. **DEF-02 Verification:** Tested phone number input permutations:
   - `9853608113` &rarr; Accepted.
   - `+919853608113` &rarr; Stripped to `9853608113` and Accepted.
   - `919853608113` &rarr; Stripped to `9853608113` and Accepted.
   - `98536 08113` &rarr; Normalized and Accepted.
   - Invalid numbers (e.g. `1234567890`, short strings) &rarr; Rejected with user-friendly error message.
3. **DEF-03 Verification:** Validated that Step 3 renders high-contrast links directing donors to `/login` or `/register` with query parameters intact.
4. **DEF-04 Verification:** Confirmed returning donors bypass redundant step clicks and proceed straight to Step 4 (Donor Profile).
5. **DEF-05 Verification:** Verified static analysis passes with 0 warnings or errors.

---

## 3. OPEN DEFECT STATUS SUMMARY

- **Critical Open Defects:** 0
- **High Open Defects:** 0
- **Medium Open Defects:** 0
- **Low Open Defects:** 0
- **Total Open Defects:** 0
- **Release Blockers:** 0 (Technical / Security) — Awaiting explicit owner deployment authorization.
