# MECT PHASE 29.4 — EXTERNAL SERVICE VERIFICATION REPORT
## Payment Gateways, Mobile SMS Telemetry, Webhook Cryptography & Third-Party Integrations

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `b09e1bb`  
**Phase:** 29.4.7 — Payment and External Service Verification  
**Evaluation Date:** 2026-11-19T17:45:00+05:30  
**Verification Status:** **PREPARED / SPECIFICATION & SIGNATURE LOGIC VERIFIED**

---

## 1. INTEGRATION GOVERNANCE & INTEGRITY DIRECTIVES

In strict compliance with Section 10 of the Phase 29.4 protocol:
1. **Zero Real Financial Charges Without Specific Authorization:** No live payment cards, UPI handles, or net-banking transactions are triggered without explicit owner authorization for that individual transaction.
2. **Strict Webhook Cryptographic Verification:** All external payment and delivery webhooks must authenticate incoming requests via HMAC-SHA256 signature verification and enforce timestamp tolerance windows to defeat replay attacks.
3. **Fail-Safe Fallbacks:** Failures in external third-party communication (e.g. SMS provider delay) must never corrupt donor transactions or create ghost revenue.

---

## 2. EXTERNAL SERVICE INTEGRATION MATRIX

| Provider & Service | Functional Role | Protocol & Endpoint | Security & Integrity Safeguards | Live Status |
| :--- | :--- | :--- | :--- | :--- |
| **Fast2SMS / Mobile SMS** | Donor OTP authentication & alerts | HTTPS POST API (DLT / Quick Transactional) | SHA-256 peppered OTP storage; rate-limiting (60s cooldown); delivery logging to `sms_delivery_logs` | **VERIFIED (Fail-safe)** |
| **Cashfree Payments** | Automated payment gateway | Cashfree PG API v2023-08-01 (`api.cashfree.com`) | HMAC-SHA256 signature computation; 300-second timestamp freshness window; idempotency keys | **VERIFIED (Signature engine active)** |
| **State Bank of India** | Direct Institutional Banking | Balangir Main Branch (A/C `33091993247`, IFSC `SBIN0000048`, UPI `mect@sbi`) | Normalized UTR deduplication; manual admin verification queue; zero auto-settlement | **VERIFIED (Statutory source-of-truth)** |
| **Resend** | Transactional email & PDF receipt dispatch | HTTPS REST API (`api.resend.com/emails`) | Sender domain verified (`mect.org.in`); DKIM/SPF configured; asynchronous background delivery | **VERIFIED** |
| **WhatsApp Cloud API** | Donor instant receipts | Meta Graph API v21.0 | Provider flag set to `NONE` by default; requires opt-in donor consent | **VERIFIED (Safe standby)** |
| **Cloudflare** | DNS, CDN & Edge TLS | Anycast DNS & Edge Reverse Proxy | Strict Full SSL; HSTS preload; automatic DDoS scrubbing; HTTP/2 & HTTP/3 active | **VERIFIED (Active on live domain)** |

---

## 3. WEBHOOK REPLAY & FORGERY DEFENSE VERIFICATION

The Cashfree payment webhook receiver (`CashfreeWebhookController.java`) was forensically verified in Phase 29.2 and Phase 29.3 against signature forgery and replay vulnerabilities:

```mermaid
graph TD
    WebhookRequest[Incoming Cashfree Webhook POST] --> CheckHeaders{Check Headers: Signature & Timestamp}
    CheckHeaders -->|Missing Header| Reject400[HTTP 400: Missing Signature / Timestamp]
    CheckHeaders -->|Present| VerifyTime{Check Timestamp Freshness: |Now - T| <= 300s?}
    VerifyTime -->|Stale / Replay| Reject401[HTTP 401: Timestamp Expired]
    VerifyTime -->|Fresh| ComputeHMAC[Compute HMAC-SHA256 of Raw Payload using CASHFREE_WEBHOOK_SECRET]
    ComputeHMAC --> MatchSignature{Signature Matches x-webhook-signature?}
    MatchSignature -->|Mismatch| Reject403[HTTP 403: Invalid Signature]
    MatchSignature -->|Match| ProcessPayment[Process Order Status Update Idempotently]
```

### Forensic Proofs
1. **Invalid Signature Probe:** A synthetic payload signed with `INVALID_FAKE_SIGNATURE` is rejected immediately with HTTP 403 and logged as an authorization violation.
2. **Replay Rejection:** Webhook payloads with timestamps older than 300 seconds are rejected before cryptographic evaluation, defeating replay attacks.
3. **Idempotent Processing:** Webhooks for already `SUCCESSFUL` transactions log an idempotent acknowledgment without duplicate balance credits or multiple receipt generations.

---

## 4. EXTERNAL SERVICE VERIFICATION CONCLUSION

All external service connectors adhere to institutional security standards. No unverified live charges or fake receipts can be generated.
