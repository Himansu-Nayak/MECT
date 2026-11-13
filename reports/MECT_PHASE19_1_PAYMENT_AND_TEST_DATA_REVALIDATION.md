# MECT PHASE 19.1 — PAYMENT CONFIGURATION & TEST-DATA REVALIDATION REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Payment Systems Engineer & Financial Compliance Auditor  
**Audit Date:** 2026-11-13  
**Status:** **FINANCIAL INTEGRITY REVALIDATED — ZERO RECONCILIATION RISKS**

---

## 1. PAYMENT CONFIGURATION REVALIDATION

```sql
SELECT primary_method, min_amount, max_amount, general_fund_enabled, 
       sbi_bank_name, sbi_account_name, sbi_account_number, sbi_ifsc, sbi_upi_id, updated_by
FROM payment_configurations;
```

### 1.1 Verified Configuration Settings
- **Primary Method:** `CASHFREE`
- **Minimum Donation:** `₹50.00`
- **Maximum Donation:** `₹500,000.00`
- **General Fund Enabled:** `true`
- **Bank Name:** `State Bank of India`
- **Beneficiary Account Name:** `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
- **Beneficiary Account Number:** `33341302498`
- **IFSC Code:** `SBIN0001701`
- **UPI ID:** `86971610172@sbi`
- **QR Asset:** `/images/mect-sbi-upi-qr.png` (present on disk)
- **Updated By:** `admin` (authenticated institutional admin)

**Security Check:** All gateway secrets (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `RESEND_API_KEY`) remain in secure server environment variables and are never stored in or returned from database queries.

---

## 2. TEST-DATA DISPOSITION & ISOLATION

| Internal ID | Table | Record Identifier | Nature of Record | Current Status | Production Risk |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **35** | `donations` | `MECT-DON-2026-DFBD9C` | Phase 18 Acceptance Donation (₹2,500.00) | Retained in dev DB | **Zero (Non-production DB)** |
| **1** | `manual_bank_transfer_claims` | `MECT-UTR-2026-01B963` | SBI UTR Claim (`SBI202611139871`) | Retained in dev DB | **Zero (Non-production DB)** |
| **1** | `donation_receipts` | `MECT-RCPT-2026-47C23782` | Institutional 80G Receipt PDF | Retained in dev DB | **Zero (Non-production DB)** |
| **1** | `content_pages` | `qa-acceptance` | Acceptance Test CMS Page | **Status: ARCHIVED (404)** | **Zero (Public access blocked)** |
| **2** | `scholarship_applications` | `MT-SCH-2026-7UNB` | Acceptance Test Scholarship | Retained in dev DB | **Zero (Non-production DB)** |

**Rule 8 Compliance:** Under the rule requiring explicit written sign-off before destructive deletion of records that have generated receipts, these records remain preserved in the isolated local development database. They do not pollute or affect the live production database.

