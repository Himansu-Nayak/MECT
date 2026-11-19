# MECT PHASE 28 — SECURITY & PAYMENT REGRESSION REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-28-premium-donor-auth-experience`  
**Execution Date:** 19 November 2026  
**Status:** ALL 126 TESTS PASSED (Zero Failures, Zero Errors)

---

## 1. Executive Summary

Phase 28 involved extensive architectural enhancements touching authentication filters, payment controllers, database schemas, and external webhook integrations. To guarantee that no regressions were introduced to existing Cashfree, Razorpay, or SBI transfer pipelines, the entire Spring Boot test suite was executed and validated.

Every test class—covering authentication, volunteer workflows, CMS revisions, scholarship applications, payment webhooks, reconciliation logs, cryptographic signatures, and financial integrity—passed completely.

---

## 2. Test Execution Summary

- **Total Test Classes Executed:** 9
- **Total Individual Tests:** 126
- **Passed:** 126 (100%)
- **Failed:** 0 (0%)
- **Errors:** 0 (0%)
- **Skipped:** 0 (0%)
- **Total Build Time:** 2 minutes 02 seconds

### 2.1 Test Class Breakdown

| Test Class | Tests Run | Failures | Status | Highlights |
|---|---|---|---|---|
| `AuthenticationAndSecurityTests` | 18 | 0 | **PASSED** | Password hashing, JWT tampering, account lockout, rate limiting |
| `CashfreePaymentGatewayIntegrationTests` | 12 | 0 | **PASSED** | Order creation, webhook signatures, idempotency, retry recovery |
| `DonationEcosystemIntegrationTests` | 9 | 0 | **PASSED** | Public config limits, RBAC review boundaries, verified UTR receipts |
| `DonationFinancialIntegrityPhase21_5_9_1Tests` | 13 | 0 | **PASSED** | Duplicate UTR rejection, SHA-256 receipt hashing, refund ledger |
| `DonationPaymentReceiptWorkflowTests` | 2 | 0 | **PASSED** | Anonymous receipt redaction, email retry outbox, admin CSV export |
| `DonorAuthenticationAndDonationSecurityPhase28Tests` | 13 | 0 | **PASSED** | **Phase 28 Suite:** 401 unauthenticated guards, mobile OTP, district schema |
| `ScholarshipApplicationTests` | 17 | 0 | **PASSED** | Merit scholar application, income verification, optimistic locking |
| `VolunteerFunctionalIntegrityPhase21_5_8_1Tests` | 11 | 0 | **PASSED** | Volunteer onboarding, coordinator status updates, deduplication |
| `WebhookSecurityAndDeliveryTests` | 31 | 0 | **PASSED** | Svix timestamp skew, HMAC-SHA256 tampering, idempotent event replay |

---

## 3. Dedicated Phase 28 Security Tests

The test suite `DonorAuthenticationAndDonationSecurityPhase28Tests.java` specifically validates the Phase 28 security invariants:

1. **`test01_mobileOtpRequestGeneratesAuditLogAndEnforcesCooldown`**
   - Validates that requesting OTP records an immutable audit log entry and enforces a 60-second cooldown on subsequent requests.
2. **`test02_mobileOtpVerificationWithInvalidCodeFailsAndIncrementsAttempts`**
   - Validates that incorrect codes increment the attempt counter and return HTTP 400 Bad Request.
3. **`test03_mobileOtpVerificationSuccessIssuesJwtAndCreatesUser`**
   - Validates that valid 6-digit OTP issues HMAC-SHA256 JWT access and refresh tokens, creates the `PortalUser`, and assigns `ROLE_GENERAL_USER`.
4. **`test04_mobileOtpReplayAttackIsPrevented`**
   - Validates that once an OTP is consumed, a second attempt with the identical code is rejected with HTTP 400.
5. **`test05_unauthenticatedDonationInitiationReturns401Unauthorized`**
   - **Crucial Security Guard:** Validates that attempting to POST `/public/donations/initiate` without an `Authorization: Bearer <token>` header returns HTTP 401 with `AUTHENTICATION_REQUIRED`.
6. **`test06_authenticatedDonationInitiationSucceedsAndAttachesUser`**
   - Validates that an authenticated donor successfully initiates a contribution and the resulting `Donation` entity is bound to their `PortalUser`.
7. **`test07_unauthenticatedSbiUtrSubmissionReturns401Unauthorized`**
   - Validates that unauthenticated visitors cannot submit manual SBI UTR claims (HTTP 401).
8. **`test08_authenticatedSbiUtrSubmissionSucceedsAndAttachesUser`**
   - Validates that an authenticated donor successfully records an SBI UTR claim with normalized uppercase UTR and binds to `ManualBankTransferClaim`.
9. **`test09_userCannotClaimOtherUsersDonations`**
   - Validates that a donor cannot claim or view donations belonging to a different portal user.
10. **`test10_successfulDonationAutomaticallyPromotesUserToRoleDonor`**
    - Validates that settling a contribution automatically promotes the user from `ROLE_GENERAL_USER` to `ROLE_DONOR`.
11. **`test11_dashboardAccuratelyCalculatesTotalsExcludingFailedAndPending`**
    - Validates that the dashboard calculation `sumSuccessfulAmountByUserId` strictly includes only `SUCCESSFUL` donations and excludes `FAILED`, `PENDING`, or `CANCELLED`.
12. **`test12_portalProfilePersistsDistrictSuccessfully`**
    - Validates that updating `/portal/me/profile` with `district: "Balangir"` persists to the database and serializes in dashboard responses.
13. **`test13_tamperedJwtTokenReturns401Unauthorized`**
    - Validates that tampered or forged JWT tokens are rejected by Spring Security filters.

---

## 4. Frontend Compilation & Quality Assurance

- **Typecheck:** `tsc --noEmit` passed with 0 errors across all 46 Next.js pages and components.
- **Lint:** ESLint passed with 0 errors.
- **Production Build:** `npm run build` compiled all routes cleanly in 30.4s, generating optimized static and dynamic bundles.
- **Playwright Visual Verification:** Screenshots captured across desktop and mobile viewports with zero layout shifts or visual clipping.
