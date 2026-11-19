# MECT PHASE 29.2 — BANKING AND PAYMENT FIDUCIARY AUDIT
## Dual Payment Gateway Architecture, Webhook Authenticity, Pessimistic Locking & Financial Ledger Integrity

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Banking Partner:** State Bank of India (Balangir Main Branch, IFSC: `SBIN0000048`, A/C: `33091993247`)  
**Payment Gateway:** Cashfree Payments India Pvt Ltd (Cards, UPI, NetBanking)  
**Execution Date:** 19 November 2026  

---

## 1. PAYMENT FLOW ARCHITECTURE

MECT supports two distinct, auditable contribution channels:
1. **Automated Gateway (Cashfree):** Real-time online checkout supporting UPI, Credit/Debit Cards, and NetBanking. Order initiation requires an authenticated donor session (`portalUserId`). Webhook notifications update the financial ledger.
2. **Direct Institutional Banking (SBI Manual Transfer):** Direct NEFT/RTGS/UPI transfers to the trust's canonical SBI checking account. Donors submit their transaction Unique Transaction Reference (UTR) for manual verification against official bank statements.

---

## 2. 15-POINT FIDUCIARY VERIFICATION MATRIX

| # | Fiduciary Attribute | Implementation Reference | Verification Finding & Evidence | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | **Payment Initiation Auth** | `DonationController.java:56` | Rejects unauthenticated calls with HTTP 401 Unauthorized (`portalUserId == null`). | **PASS** |
| **02** | **Payment Signature Validation** | `CashfreePaymentService.java` | Verifies cryptographic HMAC-SHA256 signatures on gateway responses. | **PASS** |
| **03** | **Webhook Authenticity** | `WebhookController.java:46` | Verifies `x-webhook-signature` using Cashfree shared secret and timestamp header. Invalid signatures rejected with HTTP 401. | **PASS** |
| **04** | **Idempotency** | `DonationLifecycleService.java:477` | Unique `providerEventId` checked against `paymentEventRepository.existsByProviderEventId()`. Replays return `IGNORED_DUPLICATE`. | **PASS** |
| **05** | **Duplicate Payment Protection** | `DonationLifecycleService.java:1116` | Checks `manualClaimRepository.findByUtrNormalized()`. Re-submitting an existing UTR throws `DuplicateResourceException`. | **PASS** |
| **06** | **Concurrent Settlement Locking** | `DonationLifecycleService.java:482` | Uses pessimistic write locking `findByProviderOrderIdForUpdate()` on payment entities to serialize concurrent settlement attempts. | **PASS** |
| **07** | **Refund Handling** | `DonationLifecycleService.java:493` | `REFUND_STATUS_WEBHOOK` parsed via `processRefundEventInternal`. Updates payment state and records refund event. | **PASS** |
| **08** | **Failed Payment Handling** | `DonationLifecycleService.java:1347` | Failed and expired checkout attempts update payment status to `FAILED`. No receipt is generated. | **PASS** |
| **09** | **Pending Transaction Handling** | `DonationLifecycleService.java:1342` | Status remains `PENDING_VERIFICATION` or `PENDING`. Completely isolated from aggregate donor contribution summaries. | **PASS** |
| **10** | **Manual UTR Review Queue** | `DonationLifecycleService.java:1079` | UTR submissions save as `PENDING_VERIFICATION` with claim status `UTR_SUBMITTED`. **Never automatically marked successful.** | **PASS** |
| **11** | **Authorized Verification Roles** | `SecurityConfig.java:82` | Only authorized roles (`FINANCE_OFFICER`, `DONATION_VERIFICATION_OFFICER`, `TRUSTEE`, `SUPER_ADMIN`) can execute review actions. | **PASS** |
| **12** | **Receipt Eligibility** | `DonationLifecycleService.java:726` | Receipts generated strictly upon `SUCCESSFUL` settlement. Unsettled payments cannot generate receipts. | **PASS** |
| **13** | **Receipt Access Ownership** | `DonationLifecycleService.java:985` | Validates `donation.getPortalUser().getId().equals(portalUserId)`. Access by another user throws HTTP 403 Forbidden. | **PASS** |
| **14** | **Financial Ledger Accuracy** | `PortalAccountService.java:312` | Total contribution metrics compute `sumSuccessfulAmountByUserId`, filtering strictly on `SUCCESSFUL` records. | **PASS** |
| **15** | **Audit Trail Completeness** | `DonationLifecycleService.java:1301` | `recordReconciliation()` logs state transitions with actor identity, timestamps, previous status, and notes. | **PASS** |

---

## 3. FIDUCIARY GUARANTEES CONFIRMED

1. **Zero Ghost Revenue:** The donor dashboard, admin metrics, and public counters tally only genuinely settled and verified transactions (`SUCCESSFUL`). Failed, cancelled, and unverified UTR claims contribute zero rupees to reported impact totals.
2. **Double-Spend Prevention:** The database enforces uniqueness on UTRs across all manual claims (`utr_normalized`), ensuring a single NEFT/RTGS transaction reference cannot be claimed more than once.
3. **Receipt Authenticity:** Every receipt is stamped with a unique serial number (`MECT-RCPT-YYYY-XXXXX`), donor tax details (PAN if provided), and a SHA-256 digital seal.

---

## 4. AUDIT CONCLUSION

The banking and payment handling architecture provides complete fiduciary integrity, tamper-proof webhook verification, concurrency safety, and strict separation between pending claims and verified revenue.
