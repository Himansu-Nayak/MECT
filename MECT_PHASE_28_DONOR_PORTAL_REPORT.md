# MECT PHASE 28 — DONOR PORTAL & DASHBOARD REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-28-premium-donor-auth-experience`  
**Execution Date:** 19 November 2026  
**Status:** COMPLETE & PRODUCTION-READY

---

## 1. Executive Summary

The MECT Donor Portal (`/portal/dashboard` and `/portal/profile`) serves as the permanent institutional record for every authenticated supporter. Phase 28 ensures that:
1. Total verified contributions accurately reflect only settled, confirmed donations (`SUCCESSFUL` status). Unsettled, failed, or pending payments are strictly excluded from financial totals.
2. Official donation receipts are available for immediate cryptographic PDF download.
3. Manual SBI UTR submissions are tracked transparently through their multi-stage verification lifecycle (`UTR_SUBMITTED` -> `UNDER_REVIEW` -> `VERIFIED`).
4. Donor profiles seamlessly persist the new `district` field alongside city, state, postal code, and optional PAN.

---

## 2. Dashboard Architecture & Verified Calculations

### 2.1 Financial Integrity in KPI Overview
In `PortalAccountService.java`, the method `getDashboardAndAccount(Long portalUserId)` computes:
```java
BigDecimal totalSuccessfulAmount = donationRepository.sumSuccessfulAmountByUserId(portalUserId);
long successfulCount = donationRepository.countByUserIdAndStatus(portalUserId, "SUCCESSFUL");
long pendingCount = donationRepository.countByUserIdAndStatusIn(portalUserId, List.of("PENDING", "CREATED", "PENDING_VERIFICATION"));
long failedCount = donationRepository.countByUserIdAndStatusIn(portalUserId, List.of("FAILED", "EXPIRED", "CANCELLED"));
```
- **Strict Exclusion:** Failed transactions, expired checkout sessions, and unverified UTR claims never inflate the donor's cumulative contribution amount.
- **Audit Consistency:** The calculated total in the donor portal exactly matches the verified ledger exported by the internal MECT Finance Officer.

### 2.2 SBI Direct Transfer Verification Tracker
Donors who contribute via direct State Bank of India transfer can view their claims in real time:
- **Claim Reference:** Serialized tracking code (e.g. `MECT-CLAIM-2026-XXXX`).
- **Normalized UTR:** 12-character sanitized alphanumeric transaction reference.
- **Status Badges:** Gold badge for `UTR_SUBMITTED` and `UNDER_REVIEW`; Forest badge for `VERIFIED`.
- **Auditor Notes:** Displays verification notes entered by the MECT Donation Verification Officer upon matching the credit with the SBI daily statement.

---

## 3. Supporter Profile Modernization (`/portal/profile`)

The supporter profile editor has been enhanced to persist the donor's jurisdiction according to Flyway migration `V16`:
- **Full Legal Name:** Displayed on official tax receipts.
- **Verified Contacts:** Locked badges showing verified phone and email.
- **Address Details:**
  - Street Address / Locality
  - City / Town
  - **District:** Integrated as a distinct field in the profile editor, allowing Western Odisha donors (Balangir, Bargarh, Sambalpur, Sonepur, Kalahandi, Nuapada, etc.) to record their administrative district.
  - State (default Odisha)
  - PIN Code (6-digit validation)
  - Country (India)
- **Optional Section 80G Tax Information:**
  - PAN field with 10-character validation.
  - When provided, PAN is stored securely for electronic Form 113 filing with the Income Tax Department.
- **Consent & Notification Preferences:**
  - Email receipt toggle
  - WhatsApp notification opt-in with phone binding
  - Data privacy deletion request mechanism

---

## 4. Verification & Testing

The portal enhancements were tested against both unit and integration suites:
- Profile district update verified via `PUT /portal/me/profile`.
- Accurate dashboard KPI calculations verified via `GET /portal/me/dashboard`.
- Multi-viewport rendering validated across mobile (390px) and desktop (1440px).
