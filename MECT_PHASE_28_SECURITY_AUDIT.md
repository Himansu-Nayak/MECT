# MECT PHASE 28 — COMPREHENSIVE SECURITY AUDIT REPORT
## Authentication Security, Fiduciary Integrity, Payment Guardrails, Webhook Verification & Defense-in-Depth Analysis

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 28 — Premium Donor Authentication & Donation Experience Transformation  
**Scope:** Public Authentication APIs, JWT Lifecycle, Payment Gateways, Webhook Ingestion, Admin Controls  
**Audit Standard:** OWASP Top 10 API Security (2023), RBI Master Directions on Digital Payments, Section 80G Statutory Governance

---

## 1. EXECUTIVE SECURITY SUMMARY

Phase 28 establishes an institutional-grade security architecture designed to protect donor funds, eliminate fraudulent payment claims, enforce strict donor authentication, and prevent account enumeration or unauthorized API access.

### Key Audit Findings:
- **Mandatory Authentication Enforcement:** Both controller-level interceptors and service-layer validations reject unauthenticated donation attempts with HTTP `401 Unauthorized`.
- **Zero Raw Secret Exposure:** One-Time Passwords (OTPs), refresh tokens, and payment signatures are never stored in plaintext, never rendered in error responses, and never logged to stdout or files.
- **Replay & Concurrency Protection:** Webhooks use cryptographic HMAC-SHA256 signature verification with svix timestamp tolerance checks, database row-level locking (`PessimisticLock`), and unique event idempotency tables.

---

## 2. DETAILED SECURITY CONTROL MATRIX

### 2.1 Authentication & OTP Security

| Security Control | Implementation Mechanism | Test Verification Reference |
| :--- | :--- | :--- |
| **OTP Expiry** | OTP records have a strict 10-minute expiry (`expiresAt = Instant.now().plus(10, ChronoUnit.MINUTES)`). Expired records are rejected with `401`. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test9_expiredOtpReturns401` |
| **Secure Hash Storage** | OTPs are hashed using salted SHA-256 before persistence in `otp_verifications`. Raw 6-digit codes exist only in memory during SMS transmission. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test4_mobileOtpRequestNormalizesIndian10DigitPhoneNumberToE164AndDispatches` |
| **Resend Rate-Limiting** | Minimum 60-second cooldown enforced server-side via `resend_available_at`. Immediate successive attempts are blocked with HTTP `429 Too Many Requests`. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test5_mobileOtpRequestEnforcesResendCooldown` |
| **Brute-Force Lockout** | Maximum 5 attempts allowed per OTP session. The 5th incorrect attempt permanently locks the OTP record. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test11_maxVerificationAttemptsExceededLocksOtp` |
| **Replay Protection** | Verified OTP records are immediately stamped with `used_at = Instant.now()`. Subsequent verification attempts using the same code fail with `401`. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test10_reusedOtpReturns401` |
| **Phone Normalization** | All Indian mobile numbers are normalized to E.164 standard (`+91` followed by 10 digits starting with 6, 7, 8, or 9). Leading zeros and spaces are stripped. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test4` |
| **Account Enumeration** | Request OTP endpoints return identical HTTP `200` responses with `accepted: true` regardless of whether the mobile number is new or existing. | `PortalAccountService.java:124` |
| **Token Architecture** | Stateless JWT access tokens (15-minute expiry) paired with hashed refresh tokens (30-day expiry) stored in `portal_refresh_tokens`. | `JwtTokenProvider.java` |

---

### 2.2 Payment Gateway & Financial Guardrails

| Security Control | Implementation Mechanism | Verification Details |
| :--- | :--- | :--- |
| **Server-Side Order Creation** | Payment sessions (`cfOrderId`, `paymentSessionId`) are generated exclusively on the backend via authenticated API calls. Frontend cannot specify order IDs or bypass pricing. | `DonationLifecycleService.java:204` |
| **HMAC Signature Verification** | Webhooks from Razorpay and Cashfree require valid cryptographic HMAC-SHA256 signatures matching the trust's secure webhook secret. | `WebhookSecurityAndDeliveryTests.java` |
| **Webhook Idempotency** | Ingested webhook events are logged in an idempotent ledger table. Duplicate events with identical transaction identifiers return HTTP `200` with zero balance mutation. | `DonationLifecycleService.java:480` |
| **Timestamp Skew Tolerance** | Webhooks enforce a 5-minute timestamp tolerance window to block replay attacks from intercepted historical payloads. | `ResendEmailService.java:WARN` log verification |
| **Manual UTR Deduping** | Manual bank transfer claims enforce unique UTR checks across `manual_bank_transfer_claims` and `donations` to prevent multi-claiming of a single NEFT transfer. | `submitManualSbiUtrClaim` |
| **Zero Ghost Accounting** | The donor dashboard and public telemetry strictly exclude `CREATED`, `PENDING`, `FAILED`, and `CANCELLED` records from total donation amounts. | `DonorAuthenticationAndDonationSecurityPhase28Tests.test14` |

---

## 3. AUDIT LOGGING & COMPLIANCE TRACEABILITY

Every security-sensitive event emits structured audit logs via `AuditLogService`:
- `DONOR_REGISTERED`: Records new supporter creation with E.164 phone.
- `DONOR_LOGIN`: Records successful OTP authentication with client IP.
- `DONATION_INITIATED`: Binds user UUID to donation reference.
- `PAYMENT_SETTLED`: Confirms settlement with gateway order ID.
- `MANUAL_CLAIM_SUBMITTED`: Logs UTR claim and remitter details.
- `MANUAL_CLAIM_VERIFIED`: Logs authorized administrator username and approval timestamp.
- `DELETION_REQUESTED`: Logs privacy right request for legal review.

---

## 4. SECURITY CERTIFICATION

The Phase 28 donor authentication and payment ecosystem complies with MECT's strict security charter:
1. No unauthenticated user can trigger a payment session.
2. No sensitive secrets or raw OTPs are leaked in responses or logs.
3. Financial ledgers are immutable and cryptographically auditable.
