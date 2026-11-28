# MECT PHASE 3.5 — BACKEND FAILURE REGISTER & ROOT CAUSE FORENSICS

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Target:** `https://mect.org.in/` (API Port: `8081`)  
**Audit Scope:** Forensic review of all manual API failures, deserialization exceptions, route discrepancies, and security gate alignment.  
**Audit Date:** 2026-11-28  
**Verdict:** ALL CONFIRMED DISCREPANCIES FULLY REMEDIATED & REGRESSION TESTED (172/172 Tests Passing)

---

## 1. Discrepancy & Remediation Ledger

| ID | Component / Endpoint | Failure Signature | Root Cause Forensic | Remediation Implemented | Verification Evidence |
|---|---|---|---|---|---|
| **DISC-01** | `POST /api/v1/public/donations/initiate` | HTTP 400 Bad Request: `Unknown programme code` | UI submitted legacy codes (`GENERAL`, `EDUCATION`) while DB schema held canonical codes (`GENERAL_FUND`, `EDUCATION_LEARNING`). | Implemented resilient `resolveActiveProgramme(code)` alias resolver in `DonationLifecycleService.java` mapping aliases to canonical DB records. | Unit & integration tests pass; live probe created order with HTTP 201 Created. |
| **DISC-02** | `POST /api/v1/public/donations/initiate` | HTTP 400 Bad Request: Jackson deserialization error on boolean primitives | Inbound JSON omitted optional boolean fields (`taxExemptionCertificateRequested`, `anonymous`), triggering null deserialization failure in Java records. | Introduced canonical record constructor defaults in `InitiateDonationRequest.java` and `SubmitManualSbiUtrRequest.java`. | Deserialization verified with both full and minimal JSON payloads. |
| **DISC-03** | `POST /api/donations/claim` | HTTP 401 Unauthorized for voluntary donors | `DonationController.java` strictly required `PortalPrincipal` authentication, blocking voluntary unregistered donors from claiming bank remittances. | Made `portalUserId` optional (`nullable`) in `DonationController.java`; guest claims are allowed and tagged for finance team reconciliation. | Live UTR claim test `MECT-UTR-2026-128AC7` succeeded with HTTP 200 OK. |
| **DISC-04** | `POST /api/donations/claim` | HTTP 400 Bad Request: `Transfer date cannot be in the future` | Client/server timezone disparity between UTC server clock and Indian Standard Time (`Asia/Kolkata`). | Aligned date validation in `DonationLifecycleService.java` to `LocalDate.now(ZoneId.of("Asia/Kolkata"))`. | Same-day Indian remittance claims validated without rejection. |
| **DISC-05** | Public Asset Routing | Staging asset 404 on `/api/v1/public/donations/*` | Staging Nginx vhost lacked upstream location block proxying `/api/v1/` to backend container. | Added `/api/v1/` proxy block in Nginx configuration with `proxy_pass http://127.0.0.1:8082`. | Both staging and production resolve `/api/v1/` and legacy `/api/` cleanly. |
| **DISC-06** | Outdated Contact Email | Email and receipt footers displayed legacy `mect220@gmail.com` | Hardcoded string literals in Java services predated official organizational email standard. | Updated `ReceiptPdfService.java` and `EmailTemplateRenderer.java` to canonical `mectbbsr13@gmail.com`. | Verified in generated receipt PDFs and transactional email templates. |
| **DISC-07** | Office Address Discrepancy | Receipt headers displayed Balangir office instead of registered secretariat | Receipt template retained Deed 2013 Balangir registration header without modern Lewis Plaza secretariat address. | Updated `ReceiptPdfService.java` to display `A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014`. | Audited receipt layout and rendered HTML disclaimers. |
| **DISC-08** | Legacy Test Incompatibility | `DonorAuthenticationAndDonationSecurityPhase28Tests` failed 3 assertions | Tests 1-3 asserted that unauthenticated donation initiation and claims must return 401, contradicting Phase 3.2 guest checkout requirements. | Updated test assertions to expect HTTP 201 Created for guest checkouts and 404 for nonexistent order verification. | 13/13 tests in test class pass 100%. |

---

## 2. Regression Prevention & Verification Sign-Off

All remediated paths are safeguarded by automated regression test suites in `backend/src/test/java/org/mahavirtrust/backend/`:
- `DonationEcosystemIntegrationTests`: Validates alias resolution, guest checkouts, and Cashfree order sessions.
- `DonationPaymentReceiptWorkflowTests`: Validates end-to-end receipt generation, PDF byte arrays, and email outbox event publishing.
- `DonorAuthenticationAndDonationSecurityPhase28Tests`: Validates rate-limiting, phone normalization, OTP lifecycle, and guest donation access.
