# MECT PHASE 19.1 — FULL BACKEND REGRESSION TEST REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** QA Automation Lead & Senior Backend Engineer  
**Test Framework:** JUnit 5 / Spring Boot Test / MockMvc  
**Execution Timestamp:** 2026-11-13T12:14:10+05:30  
**Command:** `mvn test -B -f backend/pom.xml`  
**Status:** **100% PASS — 58 TESTS PASSED, 0 FAILURES, 0 ERRORS**

---

## 1. SUITE-BY-SUITE TEST BREAKDOWN

| Test Class | Category / Subsystem Tested | Tests Run | Passed | Failed | Errors | Skipped | Time |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `AuthenticationAndSecurityTests` | Admin login, JWT tokens, account lockout, BCrypt hashing, brute-force defense | 7 | 7 | 0 | 0 | 0 | 12.8s |
| `CashfreePaymentGatewayIntegrationTests` | Cashfree order creation, webhook verification, signature checking | 3 | 3 | 0 | 0 | 0 | 1.8s |
| `DonationEcosystemIntegrationTests` | Public config, manual SBI UTR claim, duplicate UTR blocking, 80G receipt, portal claim, CMS draft/publish/unpublish | 4 | 4 | 0 | 0 | 0 | 4.9s |
| `DonationPaymentReceiptWorkflowTests` | Financial idempotency, receipt numbering, tax year sequencing, PDF generation | 2 | 2 | 0 | 0 | 0 | 1.4s |
| `ScholarshipApplicationSecurityAndLockingTests` | Scholarship apply, validation, Aadhaar last-4 masking, optimistic locking conflict handling | 24 | 24 | 0 | 0 | 0 | 7.6s |
| `VolunteerConsentAndStatusSecurityTests` | Volunteer registration, affirmative voluntary consent declaration, coordinator status workflow | 16 | 16 | 0 | 0 | 0 | 2.2s |
| `WebhookSecurityAndDeliveryTests` | Cashfree, Razorpay, and Resend Svix webhook signature tampering rejection | 2 | 2 | 0 | 0 | 0 | 0.3s |
| **TOTAL** | **Comprehensive Backend Regression** | **58** | **58** | **0** | **0** | **0** | **42.9s** |

---

## 2. KEY ARCHITECTURAL SAFEGUARDS CONFIRMED

1. **Financial Idempotency & Locking:**
   - Multiple simultaneous webhook callbacks or duplicate user submissions never create double donations or receipts.
   - Handled with transaction isolation (`@Transactional`) and database unique constraints.
2. **UTR Deduplication:**
   - `manual_bank_transfer_claims_utr_normalized_key` blocks duplicate submissions of identical bank transfer references at the database engine level.
3. **Statutory Receipt Issuance:**
   - Sequential receipt numbers generated per fiscal year. Receipts are never issued for pending, failed, or cancelled transactions.
4. **Optimistic Locking:**
   - `ScholarshipApplication` entity `@Version` column prevents race conditions or lost updates during concurrent administrative reviews.

