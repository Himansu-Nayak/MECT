# MECT PHASE 29.1 — DEFECT REGISTER & REMEDIATION LOG
## Forensic Identification, Classification, Root-Cause Analysis & Verification Status

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Defect-Correction Loop:** AUDIT &rarr; IDENTIFY &rarr; CLASSIFY &rarr; IMPLEMENT &rarr; TEST &rarr; VISUAL INSPECT &rarr; FIX &rarr; RETEST &rarr; DOCUMENT

---

## 1. DEFECT SUMMARY TABLE

| Defect ID | Affected Route / Component | Severity | Root Cause | Remediation Applied | Status |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **DEF-01** | `/portal/*` sub-routes, `PortalAuthContext.tsx` | **HIGH** | Legacy client route guards redirected unauthenticated visitors to `/portal/login`, adding an extra redirect hop. | Updated `dashboard`, `profile`, `welcome`, and context logout to route directly to `/login?next=...`. | **RESOLVED** |
| **DEF-02** | `/login`, `/register` phone input validation | **MEDIUM** | String validation checked `cleaned.length === 10` without stripping leading `+91` or `91` prefixes when pasted by users. | Added country prefix normalizer stripping `+91`/`91` before executing digit length and regex tests. | **RESOLVED** |
| **DEF-03** | `UnifiedDonationExperience.tsx` Step 3 | **MEDIUM** | Step 3 provided only inline OTP verification without clear pathways to dedicated login or registration gateways. | Added explicit quick links to `/login` and `/register` with preserved programme and amount parameters. | **RESOLVED** |
| **DEF-04** | `UnifiedDonationExperience.tsx` state return | **MEDIUM** | Returning from login with `searchParams` restored the amount but left the wizard on Step 1, requiring duplicate clicks. | Added automatic detection of preselected cause and amount for authenticated donors, advancing to Step 4. | **RESOLVED** |
| **DEF-05** | `UnifiedDonationExperience.tsx` ESLint hook | **LOW** | Missing `portalToken` in `useEffect` dependency array triggered `react-hooks/exhaustive-deps` warning. | Added `portalToken` to dependency array to ensure reactive initialization. | **RESOLVED** |

---

## 2. DETAILED DEFECT REMEDIATION RECORDS

### 2.1 DEF-01: Legacy Portal Login Redirect Hops
- **Severity:** High
- **Component:** `src/app/portal/dashboard/page.tsx`, `src/app/portal/profile/page.tsx`, `src/app/portal/welcome/page.tsx`, `src/context/PortalAuthContext.tsx`, `src/lib/config.ts`
- **Root Cause:** When dedicated `/login` was introduced, several portal sub-routes still contained legacy references to `/portal/login`. While `/portal/login` redirected to `/login`, this caused a brief white flash and delayed client hydration.
- **Resolution:** Replaced all client router redirect targets with `/login?next=...`.
- **Verification:** Tested unauthenticated navigation directly to `/portal/dashboard`; immediate clean transition to `/login?next=/portal/dashboard` confirmed.

### 2.2 DEF-02: Phone Input Country Code Parsing
- **Severity:** Medium
- **Component:** `src/app/login/page.tsx`, `src/app/register/page.tsx`
- **Root Cause:** Standard mobile copy-paste on mobile devices frequently includes country codes (`+91 9853608113` or `919853608113`), resulting in 12-digit strings failing the 10-digit check.
- **Resolution:** Implemented `cleaned.slice(2)` when `cleaned.length === 12 && cleaned.startsWith("91")`.
- **Verification:** Verified both 10-digit typing (`9853608113`) and 12-digit pasting (`+919853608113`); both pass validation cleanly.

### 2.3 DEF-03: Quick Navigation to Dedicated Auth on Checkout
- **Severity:** Medium
- **Component:** `src/components/sections/UnifiedDonationExperience.tsx`
- **Root Cause:** Donors preferring to register a complete account with address and PAN had no direct pathway to `/register` from Step 3 without abandoning their cart.
- **Resolution:** Rendered dedicated links to `/login` and `/register` encoding the active `selectedCode` and `amount` into the `next` parameter.
- **Verification:** Playwright screenshot `donate-step3-auth.png` validates the presence of dedicated quick links.

### 2.4 DEF-04: Frictionless Returning Donor Step Advancement
- **Severity:** Medium
- **Component:** `src/components/sections/UnifiedDonationExperience.tsx`
- **Root Cause:** Supporters completing authentication on `/login` were redirected back to `/donate`, but had to click "Continue to Amount" and "Continue to Donor Verification" again despite already being authenticated.
- **Resolution:** In `init()`, if `portalToken` is present and `paramProg` or `paramAmount` exists, `setStep(4)` is invoked immediately.
- **Verification:** Verified in browser that returning donors land directly on Step 4 with their pre-filled profile.

---

## 3. OPEN DEFECT STATUS

- **Critical Open Defects:** 0
- **High Open Defects:** 0
- **Medium Open Defects:** 0
- **Low Open Defects:** 0
- **Blockers Requiring Owner Access:** 0
