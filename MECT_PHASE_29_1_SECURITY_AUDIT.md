# MECT PHASE 29.1 — COMPREHENSIVE CYBERSECURITY AUDIT REPORT
## Defense-in-Depth Analysis, Server-Side Enforcement, Webhook Signatures & OWASP API Top 10 Verification

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Standard:** OWASP Top 10 API Security (2023), Section 80G Statutory Governance

---

## 1. SERVER-SIDE AUTHENTICATION ENFORCEMENT

Forensic inspection of `DonationController.java` confirms that every sensitive donation operation enforces server-side authentication:

```java
// POST /public/donations/initiate
Long portalUserId = (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p)
        ? p.getId()
        : null;
if (portalUserId == null) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "status", 401,
            "error", "Unauthorized",
            "message", "Donor authentication required: You must verify your mobile number via OTP before initiating a donation."
    ));
}
```

Equivalent guards exist on `/verify-checkout` and `/sbi/submit-utr`. A frontend bypass attempt immediately yields HTTP `401 Unauthorized`.

---

## 2. WEBHOOK SECURITY & PAYMENT REPLAY PROTECTION

1. **HMAC-SHA256 Signature Verification:**
   - Cashfree webhooks verify `x-webhook-signature` using the merchant secret.
   - Razorpay webhooks verify `X-Razorpay-Signature` using `HmacCryptoUtil.calculateHmacSha256`.
   - Tampered signatures return HTTP `400 Bad Request` and emit security audit alerts.
2. **Webhook Idempotency:**
   - Ingested events are recorded in an idempotency table. Successive callbacks with identical transaction IDs are acknowledged with HTTP `200` without duplicate ledger mutations.
3. **Pessimistic Concurrency Locking:**
   - `paymentRepository.findByProviderOrderIdForUpdate(orderId)` applies row-level pessimistic write locks (`SELECT ... FOR UPDATE`), preventing race conditions during concurrent webhook callbacks.

---

## 3. OWASP API TOP 10 (2023) VERIFICATION MATRIX

| Threat Category | Risk Assessment | Mitigation Implemented in MECT | Audit Finding |
| :--- | :--- | :--- | :---: |
| **API1: Broken Object Level Auth** | Critical | Controller and service layers verify that `portalUserId` matches the resource owner on every receipt download and donation query. | **PASS** |
| **API2: Broken Authentication** | Critical | Salted SHA-256 OTP hashing, 10-minute expiry, 60s cooldown, 5-attempt brute-force lockout, single-use invalidation. | **PASS** |
| **API3: Broken Object Property Level Auth** | High | DTOs strictly control writable fields (`UpdatePortalProfileRequest`). Internal fields (`isDonor`, `roles`) cannot be set by clients. | **PASS** |
| **API4: Unrestricted Resource Consumption** | High | Rate-limiting on OTP dispatch (max 5 requests per 15 min per target/IP). Database query paging on donation history. | **PASS** |
| **API5: Broken Function Level Auth** | Critical | Admin endpoints require `ROLE_ADMIN` in Spring Security filter chain. Portal endpoints require `ROLE_GENERAL_USER`. | **PASS** |
| **API6: Unrestricted Access to Sensitive Business Flows**| High | Donation initiation strictly bound to verified mobile identities, preventing bot checkout flooding. | **PASS** |
| **API7: Server Side Request Forgery (SSRF)** | Medium | No user-controlled outbound URL fetching. Webhook endpoints ingest push notifications only. | **PASS** |
| **API8: Security Misconfiguration** | High | Zero default passwords. In-memory H2 used strictly for tests. Production configuration isolated in secure environment variables. | **PASS** |
| **API9: Improper Inventory Management** | Medium | All 51 Next.js routes and all Spring Boot endpoints actively versioned under `/api/v1` and documented in OpenAPI schema. | **PASS** |
| **API10: Unsafe Consumption of APIs** | Medium | Third-party payment gateway responses validated strictly with null-safety checks and exception handling. | **PASS** |
