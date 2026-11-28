# MECT PHASE 3.5 — UNIFIED PAYMENT ARCHITECTURE REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** `https://mect.org.in/`  
**Architecture:** Unified Dual-Track Donation Journey: Cashfree Online Payment Gateway + Direct Bank & UPI Remittance.  
**Audit Date:** 2026-11-28  
**Compliance Verdict:** PASSED (Zero Artificial Live Charges Policy Strictly Upheld)

---

## 1. Executive Summary

Phase 3.5 formalizes the unified donation architecture for Mahaveer Educational & Charitable Trust, consolidating payment operations into two transparent channels:
1. **Online Payment (Cashfree Gateway):** Cards (Credit/Debit), Net Banking across all scheduled Indian commercial banks, and instant Gateway UPI with automated webhook reconciliation and instant receipt issuance.
2. **Direct Bank / UPI Transfer (SBI Current Account):** Combining State Bank of India RTGS/NEFT/IMPS and Direct UPI VPA / QR code scanning into a unified direct transfer selection with manual UTR submission and finance team verification.

---

## 2. Dual-Track State Machine

```
                              [ Donor Enters Donation Journey ]
                                              │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
                 [ Track A: Cashfree ]                   [ Track B: Direct SBI/UPI ]
                         │                                         │
                 POST /donations/initiate                 POST /donations/sbi/submit-utr
                         │                                         │
                HTTP 201: Cashfree Order                  HTTP 201: UTR Claim Created
                status: PENDING                           status: PENDING_VERIFICATION
                         │                                         │
             Cashfree JS Dropin Modal                     Finance Team Reconciles SBI Bank
                         │                                         │
                 Payment Completed?                                Credit Confirmed?
               ┌─────────┴─────────┐                             ┌─────────┴─────────┐
               ▼                   ▼                             ▼                   ▼
            [ SUCCESS ]        [ FAILED ]                    [ APPROVED ]        [ REJECTED ]
               │                   │                             │                   │
         Cashfree Webhook    User Retries               Admin Approves      Donor Notified
               │                   │                             │                   │
       status: COMPLETED     status: FAILED             status: COMPLETED     status: REJECTED
               │                                                 │
       Receipt Generated                                 Receipt Generated
       Outbox Event Dispatched                           Outbox Event Dispatched
       Email Sent with PDF                               Email Sent with PDF
```

---

## 3. Financial Integrity & Zero Live Charges Policy

1. **Zero Artificial Live Transactions:** In accordance with the Trust Charter, test suites and deployment probes never execute synthetic or artificial transactions on the live Cashfree gateway. Live verification is limited to read-only connectivity probes and verifying order token creation up to the checkout boundary.
2. **Idempotent Webhooks:** Cashfree webhook signatures are verified using HMAC-SHA256 (`x-webhook-signature`). Duplicate webhook deliveries are rejected through unique constraint checks on `payment_transactions.provider_reference`.
3. **Double Verification Safeguard:** In addition to webhooks, the frontend triggers an active backend query (`fetchCashfreeOrderStatus`) upon completion, ensuring immediate feedback even if webhooks face external network latency.
4. **Ring-Fenced Project Ledger:** All contributions specify a designated charitable project (`GENERAL_FUND`, `EDUCATION_LEARNING`, `SAFE_WATER_SANITATION`, `WOMEN_EMPOWERMENT`, `FOOD_SECURITY_RELIEF`, `HANUMAN_MURTI`), ensuring ring-fenced fiduciary compliance under Section 80G and MCA CSR-1 guidelines.

---

## 4. Verification Evidence

- **Live Order Initiation:** `POST https://mect.org.in/api/v1/public/donations/initiate` returned HTTP 201 Created with live session token `session_...`.
- **Live UTR Claim:** `POST https://mect.org.in/api/donations/claim` returned HTTP 200 OK with reference `MECT-UTR-2026-128AC7`, confirmed inserted into production table `manual_bank_transfer_claims`.
