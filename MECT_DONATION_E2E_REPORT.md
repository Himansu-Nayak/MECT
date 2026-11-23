# MECT — END-TO-END DONATION & WORKFLOW VERIFICATION REPORT
**Document ID:** MECT-DOC-2026-DE2E-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Test Suite:** `scripts/test_donation_workflow_e2e.mjs`  
**Execution Environment:** Next.js 16.4.6 Node.js Runtime  
**Execution Status:** **13/13 TESTS PASSED (100% SUCCESS RATE)**  

---

## 1. Executive Summary

This report documents the verification of the complete public donation experience, statutory disclosure presentation, campaign route redirection, API fail-closed resilience, and donor portal toggle behavior.

All 13 automated end-to-end regression tests passed with zero errors.

---

## 2. Test Execution Matrix (`test_donation_workflow_e2e.mjs`)

| # | Test Case Description | Route / Target | Invariant Tested | Status |
| :---: | :--- | :--- | :--- | :---: |
| **1** | POST `/api/donations/claim` returns HTTP 503 when backend unreachable | `/api/donations/claim` | Fail-Closed: Never generates synthetic claims when backend is down | **PASS** |
| **2** | POST `/api/donations/claim` returns HTTP 400 on missing required field | `/api/donations/claim` | Validation: Mandatory donor name, email, UTR, and amount | **PASS** |
| **3** | POST `/api/contact` returns HTTP 503 when backend unreachable | `/api/contact` | Fail-Closed: Never generates synthetic inquiry reference when backend down | **PASS** |
| **4** | POST `/api/contact` rejects bot submissions via honeypot field | `/api/contact` | Bot Defense: Form field `_gotcha` immediately rejected with HTTP 400 | **PASS** |
| **5** | Permanent redirect `/campaign` -> `/campaigns` | `/campaign` | SEO & Routing: HTTP 308 Permanent Redirect | **PASS** |
| **6** | Permanent redirect `/campaign/hanuman-murti` -> `/campaigns/hanuman-murti` | `/campaign/hanuman-murti` | SEO & Routing: HTTP 308 Permanent Redirect | **PASS** |
| **7** | Permanent redirect `/campaigns/murti` -> `/campaigns/hanuman-murti` | `/campaigns/murti` | SEO & Routing: HTTP 308 Permanent Redirect | **PASS** |
| **8** | Permanent redirect `/murti` -> `/campaigns/hanuman-murti` | `/murti` | SEO & Routing: HTTP 308 Permanent Redirect | **PASS** |
| **9** | Permanent redirect `/hanuman-murti` -> `/campaigns/hanuman-murti` | `/hanuman-murti` | SEO & Routing: HTTP 308 Permanent Redirect | **PASS** |
| **10** | Permanent redirect `/donate/claim` -> `/donate` | `/donate/claim` | Canonicalization: Consolidates claim UI to `/donate` | **PASS** |
| **11** | Permanent redirect `/donate/sbi` -> `/donate` | `/donate/sbi` | Canonicalization: Consolidates direct transfer to `/donate` | **PASS** |
| **12** | Permanent redirect `/donate/upi` -> `/donate` | `/donate/upi` | Canonicalization: Consolidates UPI QR flow to `/donate` | **PASS** |
| **13** | GET `/donate` returns HTTP 200 and static bank credentials | `/donate` | Statutory Transparency: Verified SBI Account, IFSC `SBIN0001701`, Branch | **PASS** |

---

## 3. Donor Portal Feature Flag Verification (`ENABLE_DONOR_PORTAL`)

The donor portal is governed by the `ENABLE_DONOR_PORTAL` build-time and server-side flag (Default: `false`).

### 3.1 Behavior with `ENABLE_DONOR_PORTAL=false` (Production Default)
- **UI Visibility:**
  - Header navigation hides "Login" and "Donor Portal" links.
  - Footer navigation removes all portal links.
  - Homepage CTA points directly to `/donate` (Direct Bank Transfer) rather than `/portal`.
- **Route Guards (Middleware / Route Interceptors):**
  - Direct navigation to `/login`, `/register`, `/portal`, `/portal/dashboard`, `/portal/donations`, or `/portal/receipts` returns **HTTP 404 Not Found**.
- **SEO & Sitemap:**
  - `sitemap.xml` dynamically excludes all `/portal/*`, `/login`, and `/register` routes.
- **Rendered Crawl Verification:**
  - Confirmed 0 broken links and 0 portal references visible to anonymous public visitors.

### 3.2 Behavior with `ENABLE_DONOR_PORTAL=true`
- Passes Docker build argument `ARG ENABLE_DONOR_PORTAL=true`.
- Renders full donor dashboard with OTP authentication, donation history, and receipt downloads.
- Replaced all legacy labels ("Tax Receipts") with verified statutory label: **"Receipts"**.

---

## 4. Fail-Closed Resilience Verification

When simulated backend database connection loss occurs:
1. Both `/api/donations/claim` and `/api/contact` catch network timeouts / connection refused errors.
2. The user receives clear, institutional plain-language guidance:
   > *"We could not save your submission. Nothing has been recorded in our records. Please keep your UTR safe and retry in a few moments, or reach out to the Trust secretariat directly."*
3. The response headers include `Cache-Control: no-store`.
4. Zero synthetic reference IDs are generated or displayed.

---

## 5. Verification Sign-off

The end-to-end donation and public user workflows are resilient, adhere strictly to Trust statutory standards, and are **VERIFIED 100% OPERATIONAL**.
