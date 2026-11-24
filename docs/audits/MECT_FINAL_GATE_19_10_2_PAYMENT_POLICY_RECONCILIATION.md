# MECT — FINAL GATE 19.10.2: AUTHORITATIVE PAYMENT POLICY RECONCILIATION REPORT

**Document ID:** `MECT-GATE-19-10-2-PAYMENT-RECONCILIATION`  
**Execution Timestamp:** `2026-11-25T02:23:00+05:30`  
**Production Baseline:** `origin/main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`  
**Head Commit:** `edfc8bc58335e92960c86eccd0a1b1235ad986ae`  
**Approved Production Policy:** `MANUAL_SBI_AND_UPI_ONLY`  
**Overall Status:** **VERIFIED PASS**

---

## 1. Executive Summary & Policy Discrepancy Resolution

A critical policy discrepancy was identified across historical documentation and source code:
- **Frontend Configuration:** `src/config/org.ts` and `src/app/donate/page.tsx` strictly mandate:
  > *"Donations are accepted by bank transfer / UPI. A receipt is issued after the Trust verifies the transfer. Contributions are received directly into the Trust's verified State Bank of India account without third-party processors or commercial intermediaries."*
- **Owner Decisions (DEC-08):** Documents that backend code supports Cashfree, but explicitly notes that Cashfree operates with sandbox credentials in development and requires valid server-side environment variables (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`) to activate.
- **Historical Codebase:** Contains implementations for Razorpay (`RazorpayPaymentGatewayService.java`) and a self-hosted UPI engine (`HimPaymentGatewayService.java`).

### Authoritative Policy Determination
In accordance with Trust directives and the approved user experience on `mect.org.in`, the **active production policy is strictly direct State Bank of India bank transfer and static UPI QR code with manual UTR submission**. All other payment gateways remain dormant/inactive.

---

## 2. Comprehensive Payment Capability Matrix

| Payment Method | Frontend Active | Backend Implemented | Sandbox Tested | Production Authorised | Final Classification | Operational Rationale & Reference |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **SBI Bank Transfer** | **YES** | **YES** | N/A (Offline) | **YES** | `ACTIVE_PRODUCTION_POLICY` | Rendered on `/donate` via `BankingTable.tsx`. Remittance to SBI A/C ending in `****2498` (IFSC `SBIN0001701`). |
| **UPI QR / Manual UTR** | **YES** | **YES** | Mock only | **YES** | `ACTIVE_PRODUCTION_POLICY` | Rendered on `/donate` via `UpiQrCard.tsx` (VPA `86971610172@sbi`) and `DonationClaimSection.tsx` submitting to `/api/donations/claim`. |
| **Cashfree** | **NO** | **YES** | Mock/sandbox | **NO** | `IMPLEMENTED_BUT_INACTIVE` | Fully implemented in `CashfreePaymentGatewayService.java` and Flyway V10 migration. Frontend is unmounted. Requires owner authorization & credentials. |
| **Razorpay** | **NO** | **YES** | Mock/sandbox | **NO** | `DORMANT_LEGACY` | Present in `RazorpayPaymentGatewayService.java`. Unconfigured, no frontend UI, no active production credentials. |
| **Self-Hosted UPI (HIM)** | **NO** | **YES** | Mock only | **NO** | `DORMANT_LEGACY` | Implemented in `HimPaymentGatewayService.java` and Flyway V12. Config `productionEnabled` defaults to false. Dormant. |
| **Payment Webhooks** | N/A | **YES** | Mock only | **NO** | `IMPLEMENTED_BUT_INACTIVE` | Implemented in `CashfreePaymentController` with HMAC verification & idempotency guards. Inactive while gateway is unmounted. |
| **Reconciliation & Receipts** | **YES** | **YES** | Isolated tests | **YES** | `ACTIVE_PRODUCTION_POLICY` | Active for manual UTR review. `DonationLifecycleService` issues receipts following trustee verification. |

---

## 3. Safety Guarantees & Network Isolation

- **Outbound Network Protection:** All payment gateway tests are executed using mocked HTTP clients (`SimpleClientHttpRequestFactory` with mocked responses or in-memory fixtures).
- **Outbound Payment Blocking Status:** **BLOCKED** — zero real payment requests or live gateway API calls are dispatched.
- **Credential Protection:** No live Cashfree or Razorpay API keys exist in the repository or local configuration.
- **Audit Privacy:** Bank account numbers are redacted (displaying masked suffix `****2498`).

---

## 4. Conclusion

The payment policy discrepancy is conclusively reconciled. The operative, canonical donation workflow on `feat/complete-website-redefinition-and-deduplication` is direct SBI transfer and UPI QR with manual UTR submission. All other payment gateway capabilities are documented as dormant/inactive.

**Status:** **VERIFIED PASS**
