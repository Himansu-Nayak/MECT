# MECT — MASTER TEST EVIDENCE REGISTER

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Date:** 2026-11-28  
**Release Commit:** `905ffa1`  
**Target VPS:** Hostinger KVM 4 (`200.97.161.128`)  
**Production URL:** `https://mect.org.in/`  
**Status:** **`100% PRODUCTION VERIFIED (ALL 8 GATES PASS)`**

---

## 1. QUALITY ASSURANCE GATES & TEST SUITES

| Gate | Category | Test Harness / Tool | Target Scope | Pass Criteria | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **G1** | Backend Unit & Integration | JUnit 5, MockMvc, Spring Test | 172 Test Cases | 0 Failures, 0 Errors, 0 Skipped | **PASS (172/172)** |
| **G2** | Frontend TypeScript Check | `npx tsc --noEmit` | Whole Next.js Project | 0 Type Errors | **PASS (0 Errors)** |
| **G3** | Frontend Confirm Gate | `node scripts/check-confirm.mjs` | Markdown & Source files | 0 Unresolved markers | **PASS (0 Markers)** |
| **G4** | Next.js Production Build | `next build --webpack` | Standalone Docker output | All 58 pages compile clean | **PASS (58/58 Pages)** |
| **G5** | Live Production Suite | `scripts/verify_production_live.py` | 13 Production Endpoints | 13/13 Passed (100% Green) | **PASS (13/13)** |
| **G6** | Live HTML Structure & Content | `scripts/verify_live_html_content.py` | Home, Contact, About, Governance | 100% Matches Required Spec | **PASS (100%)** |
| **G7** | Live Donation & UTR Ingestion | `scripts/verify_production_donation_and_claim.py` | Cashfree + Direct Remittance | 201 Session + DB Row Recorded | **PASS (100%)** |
| **G8** | Production Co-existence Isolation | `curl 127.0.0.1:3000 & 8080` | OHO Tech isolated services | Undisturbed, HTTP 200 / Secure | **PASS (100%)** |

---

## 2. PRODUCTION EVIDENCE LOGS

### Gate G5: Live Production 13-Point Verification Log
```text
==================================================================
MECT PHASE 3.2 — LIVE PRODUCTION ACCEPTANCE AUDIT
Target: https://mect.org.in
==================================================================
[PASS] GET  https://mect.org.in/ -> 200 in 782ms
[PASS] GET  https://mect.org.in/donate -> 200 in 562ms
[PASS] GET  https://mect.org.in/contact -> 200 in 742ms
[PASS] GET  https://mect.org.in/governance -> 200 in 790ms
[PASS] GET  https://mect.org.in/programmes -> 200 in 571ms
[PASS] GET  https://mect.org.in/api/ai/health -> 200 in 786ms
[PASS] GET  https://mect.org.in/api/v1/health -> 200 in 438ms
[PASS] GET  https://mect.org.in/api/v1/actuator/health -> 200 in 478ms
[PASS] GET  https://mect.org.in/api/v1/public/donations/config -> 200 in 480ms
[PASS] GET  https://mect.org.in/api/v1/public/donations/programmes -> 200 in 667ms
[PASS] GET  https://mect.org.in/api/v1/public/donations/gateway-status -> 200 in 442ms
[PASS] GET  https://mect.org.in/api/v1/public/documents -> 200 in 418ms
[PASS] POST https://mect.org.in/api/contact -> 201 in 492ms

=== LIVE PRODUCTION AUDIT SUMMARY ===
Total: 13 | Passed: 13 | Failed: 0
```

### Gate G6: Live HTML Content & Identity Structure Log
```text
==================================================================
AUDITING LIVE HTML PAGES ON HTTPS://MECT.ORG.IN
==================================================================
Fetched Homepage: 205881 bytes
PASS: Developer Attribution -> Cognisoftoho Technologies Private Limited (https://ohotechn.com)
PASS: Official Address -> Lewis Plaza, Bhubaneswar – 751014
PASS: Primary Email -> mectbbsr13@gmail.com
PASS: Trust Deed Number excluded from public homepage
PASS: Section 08 'Statutory Transparency' removed from homepage
PASS: Hero Carousel present on homepage

Fetched Contact Page: 116354 bytes
PASS: Contact Page -> Lewis Plaza, mectbbsr13@gmail.com; Balangir office removed

Fetched Governance Page: 192334 bytes
PASS: Governance Page -> Board Composition Clause 8(1) card removed

Fetched About Page: 186839 bytes
PASS: About Page -> Cognisoftoho Technologies Private Limited present

==================================================================
ALL LIVE HTML CONTENT & STRUCTURAL AUDITS PASSED WITH 100% SUCCESS!
==================================================================
```

### Gate G7: Live Donation & UTR Remittance Verification Log
```text
==================================================================
VERIFYING LIVE DONATION & REMITTANCE RESOLUTION ON HTTPS://MECT.ORG.IN
==================================================================
[Test 1] POST /api/v1/public/donations/initiate with GENERAL_FUND...
Status: 201
Response: {'donationReference': 'MECT-DON-2026-2043CF', 'paymentSessionId': 'session_j0XsK...', 'checkoutMode': 'CASHFREE_SDK_V3'}

[Test 2] POST /api/v1/public/donations/initiate with alias 'GENERAL'...
Status: 201
Response: {'donationReference': 'MECT-DON-2026-16AEA5', 'paymentSessionId': 'session_SYgvw...', 'checkoutMode': 'CASHFREE_SDK_V3'}

[Test 3] POST /api/donations/claim (Direct SBI/UPI remittance claim)...
Status: 200
Response: {'success': True, 'claimReference': 'MECT-UTR-2026-6D0EF9', 'status': 'UTR_SUBMITTED'}
Recorded in database table 'manual_bank_transfer_claims'.
==================================================================
ALL LIVE DONATION & REMITTANCE VERIFICATIONS PASSED SUCCESSFULLY!
==================================================================
```
