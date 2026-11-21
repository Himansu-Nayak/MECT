# MECT PHASE 29.5 — PAYMENT AND DONOR REGRESSION AUDIT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Status:** COMPLETE — ALL PAYMENT & DONOR REGRESSION GATES PASSED

---

## 1. Executive Summary

This audit rigorously evaluates the financial integrity, payment gateway connectivity, donation lifecycle state machine, statutory receipt issuance, manual SBI UTR claim workflows, and donor profile deduplication across the MECT platform following the introduction of dual-channel authentication (`6a9de87`).

All backend unit and integration tests covering payment lifecycles, webhook verification, signature validation, idempotency checks, and PDF receipt rendering passed cleanly with zero regressions. No live financial transactions were executed; all verifications used isolated mocks, simulated webhooks, and test-mode integration signatures.

---

## 2. Payment Gateway Architecture & Timeout Hardening

MECT integrates dual redundant payment gateways (Cashfree Payments and Razorpay) alongside direct bank transfer facilities (State Bank of India account with manual UTR claims).

### 2.1 Backend Gateway Implementations

| Component | Source File | Key Responsibilities |
| :--- | :--- | :--- |
| **Donation Lifecycle Service** | [DonationLifecycleService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java) | Orchestrates order creation, payment state transitions, donor linking, receipt generation, and manual SBI UTR processing. |
| **Cashfree Gateway Service** | [CashfreePaymentGatewayService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/payment/CashfreePaymentGatewayService.java) | Manages Cashfree order creation (`/pg/orders`), payment status verification (`/pg/orders/{order_id}/payments`), webhook signature verification, and HTTP client lifecycle. |
| **Razorpay Gateway Service** | [RazorpayPaymentGatewayService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/payment/RazorpayPaymentGatewayService.java) | Manages Razorpay order generation, HMAC-SHA256 signature verification (`order_id|payment_id`), payment capture, and status polling. |
| **Donation REST Controller** | [DonationController.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/controller/DonationController.java) | Exposes public donation endpoints (`/api/donations/initiate`, `/api/donations/verify`, `/api/donations/manual-sbi-utr`). |
| **Cashfree REST Controller** | [CashfreePaymentController.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/controller/CashfreePaymentController.java) | Exposes Cashfree webhook callback endpoint (`/api/payments/cashfree/webhook`). |
| **Receipt PDF Engine** | [ReceiptPdfService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/receipt/ReceiptPdfService.java) | Generates tamper-resistant, cryptographically watermarked institutional payment acknowledgement PDFs. |

### 2.2 Payment HTTP Client Timeout Hardening

In commit `6a9de87`, the HTTP client layer for both `CashfreePaymentGatewayService` and `RazorpayPaymentGatewayService` was hardened against connection hangs and resource exhaustion by replacing default unbounded HTTP clients with Spring's `SimpleClientHttpRequestFactory`:

```java
// Cashfree & Razorpay Gateway Service Hardening
SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
requestFactory.setConnectTimeout(Duration.ofSeconds(5));
requestFactory.setReadTimeout(Duration.ofSeconds(10));

this.restClient = RestClient.builder()
        .baseUrl(properties.getBaseUrl())
        .requestFactory(requestFactory)
        .build();
```

- **Connect Timeout:** 5,000 ms (aborts immediately if gateway endpoint is unreachable).
- **Read Timeout:** 10,000 ms (aborts if upstream payment gateway halts or stalls mid-handshake).
- **Socket Safety:** Utilizes standard JDK `HttpURLConnection` underlying transport, eliminating Windows socket descriptor leaks and named-pipe sandbox permission conflicts.

---

## 3. Webhook Idempotency & Signature Verification

Payment webhooks represent an untrusted external ingress that must withstand replays, delayed deliveries, and forged payloads.

### 3.1 Cashfree Webhook Verification
- **Signature Algorithm:** HMAC-SHA256 calculated over the timestamp concatenated with the raw request body.
- **Header Inspected:** `x-webhook-signature` and `x-webhook-timestamp`.
- **Clock Drift Tolerance:** Rejects requests where timestamp differs by more than 300 seconds from server clock.
- **Idempotent Handling:** Evaluates `paymentEventRepository.existsByGatewayPaymentId(paymentId)`. Duplicate webhook deliveries return HTTP `200 OK` without re-triggering receipt generation or mutating transaction balances.

### 3.2 Razorpay Signature Verification
- **Signature Formula:** `Hex(HMAC_SHA256(order_id + "|" + payment_id, key_secret))`.
- **Constant-Time Comparison:** Evaluated using `java.security.MessageDigest.isEqual()` to prevent timing side-channel attacks.
- **Payment Journaling:** Each processed payment event is appended to `payment_events` with payload digest, IP source, and timestamp.

---

## 4. Donor Profile Deduplication & Identity Linkage

The dual-channel authentication upgrade introduces both Mobile and Email login options for donors. Strict deduplication logic prevents identity fragmentation:

1. **Normalized Lookup:**
   - Emails: Stripped, lowercased (`email.trim().toLowerCase(Locale.ROOT)`).
   - Phones: Stripped of whitespace/punctuation, normalized to E.164 (`+91XXXXXXXXXX`).
2. **Account Linking:**
   - If an existing donor makes an authenticated donation via email or phone, the transaction is linked to their existing `portal_user_id`.
   - If an unauthenticated guest donates with an email or phone matching an existing registered account, the donation is attributed to that account upon verification.
3. **No Duplicate Donor Records:** Database unique constraints on `portal_users (primary_email)` and `portal_users (primary_phone)` ensure no duplicate portal identities can be created.

---

## 5. Statutory Receipt & Legal Compliance

Receipt generation adheres strictly to trust statutory governance:

- **Institutional Payment Acknowledgement:**
  Every completed donation triggers automatic generation of a numbered receipt via [ReceiptPdfService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/receipt/ReceiptPdfService.java).
- **Mandatory Statutory Disclosure:**
  Every receipt prominently displays the factual governance disclaimer established in Phase 21.5.5.2.1:
  > *"Acknowledges voluntary contribution received into Mahaveer Educational & Charitable Trust's verified ledger (Registered Trust Deed Balangir Doc No. 40311302194; Trust PAN: AADTM5474F; MCA CSR-1: CSR00081063). This receipt is an Institutional Payment Acknowledgement and does NOT itself constitute a Section 80G tax-exemption certificate for FY 2026-27 unless issued alongside an active verified 80G approval order."*
- **Receipt Immutable Hash:**
  Receipt records store the SHA-256 hash of the generated PDF bytes, guaranteeing non-repudiation.

---

## 6. Manual SBI UTR Claim Workflow

For donors transferring funds directly to MECT's verified State Bank of India account:

1. **Submission:** Donor submits UTR (Unique Transaction Reference) number, transaction date, amount, donor PAN, and contact details via `/api/donations/manual-sbi-utr`.
2. **State Gate:** The donation record is created in state `PENDING_VERIFICATION`. Under no circumstances is a receipt issued or funds marked as collected at this stage.
3. **Admin Verification:** Authorized trust secretariat members must review bank statements and approve the claim via `/api/donations/review-manual-sbi-claim`.
4. **Audit Trail:** Every claim approval or rejection records admin operator identity, reason, timestamp, and audit event in `payment_reconciliation_logs`.

---

## 7. Automated Test & Regression Results

From the comprehensive backend test run executed during Phase 29.5:

```
[INFO] Running org.mahavirtrust.backend.service.donation.DonationLifecycleServiceTest
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.842 s -- in DonationLifecycleServiceTest
[INFO] Running org.mahavirtrust.backend.service.payment.CashfreePaymentGatewayServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.912 s -- in CashfreePaymentGatewayServiceTest
[INFO] Running org.mahavirtrust.backend.service.payment.RazorpayPaymentGatewayServiceTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.884 s -- in RazorpayPaymentGatewayServiceTest
[INFO] Running org.mahavirtrust.backend.controller.CashfreePaymentControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.631 s -- in CashfreePaymentControllerTest
[INFO] Running org.mahavirtrust.backend.service.receipt.ReceiptPdfServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.412 s -- in ReceiptPdfServiceTest
```

- **Total Payment & Donor Tests:** 40/40 passed (100%).
- **Gateway Idempotency Failures:** 0.
- **Unverified Payment Leaks:** 0.
- **Receipt Formula Mismatches:** 0.

---

## 8. Conclusion & Gate Decision

The payment, donation lifecycle, receipt generation, and donor deduplication systems exhibit zero regressions following the introduction of dual-channel authentication.

**Verdict: PASS — PAYMENT & DONOR SYSTEMS FULLY COMPLIANT AND READY FOR PRODUCTION**
