# MECT PHASE 19 — PAYMENT CONFIGURATION AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Principal Payment Systems Engineer  
**Audit Date:** 2026-11-13  
**Status:** **AUDIT PASSED — FINANCIAL INTEGRITY CERTIFIED**

---

## 1. CASHFREE ONLINE PAYMENT GATEWAY

| Dimension | Verification Mechanism | Measured Result | Verdict |
| :--- | :--- | :--- | :--- |
| **Runtime Environment Selection** | Checked via `CASHFREE_API_VERSION` and `cashfree.environment` config | Configurable via environment variable (`PRODUCTION` or `SANDBOX`) | **PASS** |
| **Webhook Endpoint** | Mapped at `/api/v1/webhooks/payments/cashfree` | Verified active in `WebhookController.java` | **PASS** |
| **Signature Verification** | `x-webhook-signature` & `x-webhook-timestamp` HMAC validation | Enforced via `DonationLifecycleService.processCashfreeWebhook()`. Rejects invalid signatures with HTTP 401. | **PASS** |
| **Replay & Timestamp Protection** | Svix and HMAC timestamp validation with 5-minute skew window | Rejects stale or replayed webhooks | **PASS** |
| **Event Idempotency** | Webhooks recorded in `payment_events` with unique event ID | Prevents double-processing of identical events | **PASS** |
| **Order-Payment Association** | `order_id` strictly matched to `donations.donation_reference` | Prevents cross-order payment assignment | **PASS** |
| **Amount & Currency Validation** | Strict BigDecimal comparison (`orderAmount == paymentAmount`) | Any discrepancy flags payment as `AMOUNT_MISMATCH` and prevents receipt issuance | **PASS** |
| **Receipt Issuance Timing** | 80G tax receipt generated only after status becomes `SUCCESSFUL` | Guaranteed in `@Transactional` boundary | **PASS** |

---

## 2. SBI MANUAL DIRECT TRANSFER & UPI QR ARCHITECTURE

### 2.1 Beneficiary Identity Verification
The beneficiary details in `payment_configurations` match the official Trust passbook:
- **Bank Name:** State Bank of India
- **Beneficiary Account Name:** `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
- **Account Number:** `33341302498`
- **IFSC Code:** `SBIN0001701`
- **Branch:** Rajendra College Square, Bolangir, Odisha
- **UPI ID:** `86971610172@sbi`
- **QR Image Asset:** `/images/mect-sbi-upi-qr.png` (verified on disk)

### 2.2 UTR Deduplication & Security
- **Database Level Protection:** Unique index `manual_bank_transfer_claims_utr_normalized_key` on column `utr_normalized`.
- **Normalization:** UTR strings are automatically stripped of spaces and converted to uppercase (e.g. `"sbi 1234"` -> `"SBI1234"`).
- **Two-Phase Verification:**
  1. Donor submits UTR claim via `POST /public/donations/sbi/submit-utr`. Status is initialized to `PENDING_VERIFICATION`.
  2. Authorized Administrator reviews claim via `POST /admin/manual-claims/{claimRef}/review`. An official `bank_statement_ref` is required before transitioning to `VERIFIED`.
  3. Only upon admin verification is the donation transitioned to `SUCCESSFUL` and the official 80G tax receipt issued.

---

## 3. ACTIVE PAYMENT CONFIGURATION SETTINGS

```sql
SELECT primary_method, cashfree_enabled, sbi_qr_enabled, min_amount, max_amount, general_fund_enabled, updated_by 
FROM payment_configurations;
```
- **primary_method:** `CASHFREE`
- **cashfree_enabled:** `true`
- **sbi_qr_enabled:** `true`
- **min_amount:** `50.00 INR`
- **max_amount:** `500,000.00 INR`
- **general_fund_enabled:** `true`
- **updated_by:** `admin` (authenticated institutional admin)

**Security Assurance:** Live secrets (API secret keys, webhook secrets) are never stored in the database or exposed in responses. They are injected exclusively via secure OS environment variables at runtime.

