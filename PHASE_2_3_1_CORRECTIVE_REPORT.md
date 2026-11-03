# MAHAVIR TRUST — PHASE 2.3.1 SECURITY AND DATA-INTEGRITY CORRECTIVE REPORT

**Project:** MAHAVIR TRUST — Educational & Mentorship Platform  
**Worktree:** `C:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST\.worktrees\security-patch`  
**Target Branch:** `security/nextjs-patch-upgrade`  
**Starting Commit:** `030938bdaa533d2fdd6eb4073209c1eff6e1ef09` (Preserved intact)  
**Execution Date:** 2026-11-02  
**Status:** Verification Complete — Corrective Patch Implemented

---

## 1. Executive Summary

Following the independent acceptance review of Phase 2.3 commit `030938b`, critical backend consent enforcement and administrative status validation gaps were identified. Specifically:
1. Consent enforcement was performed only on the client without backend-enforced rejection of unconsented or false-consent requests.
2. The legacy five-argument constructor allowed volunteer submissions to bypass consent.
3. Client-provided `consentVersion` was stored directly without server validation or authority over the consent statement.
4. Administrative status updates accepted arbitrary string values without state machine transition constraints and leaked applicant PII in response payloads.
5. Public pages displayed unverified claims regarding institutional KYC, trustee guarantees, and unapproved formal safeguarding policies.

Phase 2.3.1 delivers a comprehensive corrective patch addressing each defect across backend security, database integrity, institutional content, and automated test coverage.

---

## 2. Actual Changed Files

### Backend Core Implementation
- `backend/src/main/java/org/mahavirtrust/backend/entity/VolunteerStatus.java` (New)
  - Defines the closed enum `VolunteerStatus` (`AWAITING_ORIENTATION`, `UNDER_REVIEW`, `ORIENTATION_COMPLETED`, `ACTIVE_MENTOR`, `INACTIVE`, `REJECTED`).
  - Implements `canTransitionTo(VolunteerStatus target)` defining strict allowed transitions and marking `REJECTED` as terminal.
- `backend/src/main/java/org/mahavirtrust/backend/dto/VolunteerStatusUpdateResponse.java` (New)
  - Safe administrative DTO exposing only `id`, `previousStatus`, `newStatus`, `actor`, `updatedAt`, and `message`.
  - Omits applicant personal identifiable information (PII) like full name, email, phone number, and background notes.
- `backend/src/main/java/org/mahavirtrust/backend/exception/ResourceNotFoundException.java` (New)
  - Custom exception for missing entities resulting in clean HTTP 404 Not Found responses.
- `backend/src/main/java/org/mahavirtrust/backend/exception/GlobalExceptionHandler.java` (Modified)
  - Added dedicated handler for `ResourceNotFoundException` returning standard `ApiErrorResponse` (HTTP 404).
- `backend/src/main/java/org/mahavirtrust/backend/dto/CreateVolunteerRequest.java` (Modified)
  - Annotated `consentDeclared` with `@NotNull(message = "Consent declaration is mandatory")` and `@AssertTrue(message = "Affirmative consent to the voluntary service declaration is required")`.
  - Refactored legacy five-argument constructor to initialize `consentDeclared = false`, ensuring legacy calls are trapped and rejected by Bean Validation.
- `backend/src/main/java/org/mahavirtrust/backend/entity/VolunteerRegistration.java` (Modified)
  - Removed field-level default strings for `consentStatement` and `consentVersion` to ensure unconsented entities default to `null` and do not fabricate evidence of consent.
- `backend/src/main/java/org/mahavirtrust/backend/service/VolunteerRegistrationService.java` (Modified)
  - Established canonical server constants: `SERVER_CONSENT_VERSION = "v1.0-draft-2026"` and `SERVER_CONSENT_STATEMENT = "I declare that all information provided is authentic. I agree to uphold MAHAVIR TRUST draft voluntary service principles and student safeguarding guidelines."`.
  - Added defensive validation throwing `IllegalArgumentException` if `consentDeclared` is `null` or `false`.
  - Discards arbitrary client-supplied `consentVersion` and stores server-selected version.
  - Generates UTC `Instant.now()` on the server clock for `consentTimestamp`.
- `backend/src/main/java/org/mahavirtrust/backend/controller/AdminController.java` (Modified)
  - Injected `AuditLogService`.
  - Replaced arbitrary status mutation with validated transition logic checking `VolunteerStatus.valueOf(...)` and `currentStatus.canTransitionTo(targetStatus)`.
  - Enforced `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'VOLUNTEER_COORDINATOR')")`.
  - Throws `ResourceNotFoundException` on invalid IDs (HTTP 404).
  - Emits immutable audit log with action `"VOLUNTEER_STATUS_UPDATED"`.
  - Returns `VolunteerStatusUpdateResponse` without PII leakage.
- `backend/src/main/resources/db/migration/V4__volunteer_consent_integrity.sql` (New)
  - Drops column defaults on `consent_statement` and `consent_version` in `volunteer_registrations`.
  - Updates historical rows where `consent_declared = FALSE` to set `consent_statement = NULL`, `consent_version = NULL`, `consent_timestamp = NULL`, guaranteeing no false evidence of consent.
- `backend/src/main/resources/application.yml` & `backend/src/test/resources/application-test.yml` (Modified)
  - Added `spring.jpa.properties.hibernate.jdbc.time_zone: UTC` to ensure consistent UTC date-time handling across database engines.

### Frontend Content Audit
- `src/app/volunteer/page.tsx` (Modified)
  - Replaced unverified institutional claims with appropriately qualified language:
    - Replaced claims of "Approved Safeguarding Policy" with "Draft Student Welfare & Safeguarding Guidelines (Subject to Trustee Formalisation)".
    - Replaced KYC promises with basic identity verification during prospective orientation.
    - Qualified certificates as "Certificates of Voluntary Contribution (subject to verification)".
    - Labeled tracks and onboarding stages as "Proposed".
    - Labeled district reach as "Proposed Geographic Reach Across All 30 Districts of Odisha" with proposed pilot zones.
    - Updated contact email from unverified `volunteers@mahavirtrust.org` and `governance@mahavirtrust.org` to institutional `{TRUST_CONFIG.contact.generalEmail}` (`contact@mahavirtrust.org`).
    - Synchronized checkbox declaration with server-controlled draft statement.
- `src/app/page.tsx` (Modified)
  - Updated homepage volunteer CTA section title and checkbox label to reference draft student safeguarding guidelines and proposed tracks.

### Automated Test Suites
- `backend/src/test/java/org/mahavirtrust/backend/VolunteerConsentAndStatusSecurityTests.java` (New)
  - Complete, dedicated test suite covering all 13 specified security and status transition scenarios.
- `backend/src/test/java/org/mahavirtrust/backend/MahavirTrustBackendApplicationTests.java` (Modified)
  - Synchronized existing tests with mandatory backend consent rules (asserting rejection on missing consent and verifying server version override).

---

## 3. Security Decisions & Architectural Validation

| Domain | Problem Identified | Security Architecture Solution |
| :--- | :--- | :--- |
| **Consent Enforcement** | Client-only check; backend accepted null/false consent. | Bean Validation (`@NotNull`, `@AssertTrue`) on DTO + defensive check in Service layer throwing `IllegalArgumentException`. Both map to HTTP 400. |
| **Legacy Constructor Bypass** | 5-argument constructor defaulted new registrations without consent. | 5-arg constructor explicitly sets `consentDeclared = false`, immediately tripping validation if submitted. |
| **Statement Versioning** | Untrusted client could forge arbitrary consent versions. | Server overrides client input with `SERVER_CONSENT_VERSION` (`v1.0-draft-2026`) and canonical server statement. |
| **Timestamp Generation** | Client-side timestamps vulnerable to clock skew or manipulation. | Generated on backend using `Instant.now()` in UTC. |
| **Status State Machine** | Arbitrary string overwriting; unconstrained status transitions. | Explicit enum `VolunteerStatus` with `canTransitionTo()` state transition graph. Terminal `REJECTED` state prevents reactivation bypass. |
| **PII Minimization** | Admin patch returned full volunteer entity with contact info. | Response uses `VolunteerStatusUpdateResponse`, strictly containing ID, status delta, actor, timestamp, and message. |
| **Audit Logging** | Status changes had no audit trail. | `AuditLogService.record(...)` records actor, action (`VOLUNTEER_STATUS_UPDATED`), resource type/id, client IP, and transition description. |
| **Access Control** | Endpoints lacked fine-grained role segregation. | Restricted via `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'VOLUNTEER_COORDINATOR')")`. Non-admin roles (e.g. `ROLE_APPLICATION_REVIEWER`) receive 403 Forbidden. |
| **Public Claims** | Unverified promises of KYC, trustee reviews, and approved policies. | All claims qualified as "Proposed" or "Draft (Subject to Trustee Formalisation)". |

---

## 4. Database Integrity & Migration Details

### Migration Analysis:
- `V1__initial_schema.sql`: Initial baseline tables for inquiries and volunteer registrations.
- `V2__auth_and_audit_schema.sql`: Administrative users, refresh tokens, and audit log tables.
- `V3__volunteer_consent_and_district.sql`: Expanded `volunteer_registrations` with consent columns and district tracking. However, it had string `DEFAULT` values for `consent_statement` and `consent_version` that could falsely attribute consent to legacy or unconsented records.
- `V4__volunteer_consent_integrity.sql` (Implemented):
  ```sql
  -- V4__volunteer_consent_integrity.sql
  -- MAHAVIR TRUST - Volunteer Consent Integrity and Default Sanitization
  ALTER TABLE volunteer_registrations ALTER COLUMN consent_statement SET DEFAULT NULL;
  ALTER TABLE volunteer_registrations ALTER COLUMN consent_version SET DEFAULT NULL;

  UPDATE volunteer_registrations
  SET consent_statement = NULL,
      consent_version = NULL,
      consent_timestamp = NULL
  WHERE consent_declared = FALSE;
  ```
- **Integrity Guarantee:**
  - Existing registrations remain readable.
  - Legacy rows where `consent_declared = FALSE` have their consent statement, version, and timestamp cleaned to `NULL`, preventing any false legal claim of affirmative consent.
  - Compatible with PostgreSQL and H2.
  - No existing legitimate data is destroyed.

---

## 5. Automated Test Results

### 13 Mandatory Test Scenarios (All Passed)

| # | Test Scenario | Method in `VolunteerConsentAndStatusSecurityTests` | Result |
| :-: | :--- | :--- | :-: |
| **1** | Missing consent (`null` / omitted) | `testMissingConsentReturnsBadRequest()` | **PASSED** (HTTP 400) |
| **2** | False consent (`consentDeclared: false`) | `testFalseConsentReturnsBadRequest()` | **PASSED** (HTTP 400) |
| **3** | True consent (`consentDeclared: true`) | `testTrueConsentReturnsCreatedAndPersists()` | **PASSED** (HTTP 201) |
| **4** | Arbitrary client consent version | `testArbitraryClientConsentVersionOverriddenByServer()` | **PASSED** (Server overrides) |
| **5** | Correct server-selected version & statement | `testCorrectServerSelectedVersionAndStatementPersisted()` | **PASSED** (`v1.0-draft-2026`) |
| **6** | Correct server-generated UTC timestamp | `testCorrectServerGeneratedUtcTimestamp()` | **PASSED** (UTC `Instant.now()`) |
| **7** | Legacy API request behavior | `testLegacyApiRequestBehaviorIsRejected()` | **PASSED** (HTTP 400) |
| **8** | Invalid volunteer status | `testInvalidVolunteerStatusRejected()` | **PASSED** (HTTP 400) |
| **9** | Valid volunteer status transition | `testValidVolunteerStatusTransitionSucceedsWithoutPii()` | **PASSED** (HTTP 200, No PII) |
| **10** | Invalid transition | `testInvalidVolunteerStatusTransitionRejected()` | **PASSED** (HTTP 400) |
| **11** | Unauthorized administrative access | `testUnauthorizedAdministrativeAccessRejected()` | **PASSED** (401 & 403) |
| **12** | Missing application ID | `testMissingApplicationIdReturnsNotFound()` | **PASSED** (HTTP 404) |
| **13** | Audit event creation | `testAuditEventCreationOnStatusTransition()` | **PASSED** (Audit recorded) |

### Complete Backend Test Suite
```
[INFO] Running org.mahavirtrust.backend.AuthenticationAndSecurityTests
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0 -- in org.mahavirtrust.backend.AuthenticationAndSecurityTests
[INFO] Running org.mahavirtrust.backend.MahavirTrustBackendApplicationTests
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0 -- in org.mahavirtrust.backend.MahavirTrustBackendApplicationTests
[INFO] Running org.mahavirtrust.backend.VolunteerConsentAndStatusSecurityTests
[INFO] Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 -- in org.mahavirtrust.backend.VolunteerConsentAndStatusSecurityTests
[INFO] 
[INFO] Results:
[INFO] Tests run: 27, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Frontend Verification
1. **TypeScript Typecheck (`npx tsc --noEmit`):**
   - Zero compilation errors.
2. **Next.js Production Build (`npm run build`):**
   - Compiled in 10.0s.
   - All 14 routes statically generated (`/`, `/about`, `/accessibility`, `/contact`, `/faq`, `/governance`, `/impact`, `/privacy`, `/programmes`, `/scholarships`, `/terms`, `/volunteer`, `/_not-found`).

---

## 6. Residual Risks & Operational Governance Recommendations

1. **Formal Safeguarding Policy Adoption:** The current implementation uses draft guidelines (`v1.0-draft-2026`). The Board of Trustees must formally adopt an institutional safeguarding policy, at which point the version identifier should be transitioned to a ratified version (e.g., `v1.0-ratified-2026`).
2. **Dedicated Email Inboxes:** The volunteer and governance inquiries currently route to the verified secretariat contact email (`contact@mahavirtrust.org`). Once official DNS MX records and accounts for `volunteers@mahavirtrust.org` and `governance@mahavirtrust.org` are established by the system administrator, these aliases can be configured.
3. **Physical Hub Site Verification:** Study hub operations remain proposed initiatives until physical lease agreements, trustee approvals, and on-site infrastructure are formally commissioned.

---

## 7. Git Safety & Corrective Commit Record

- **Working Branch:** `security/nextjs-patch-upgrade`
- **Preceding Commit:** `030938bdaa533d2fdd6eb4073209c1eff6e1ef09` (Preserved intact)
- **Corrective Commit SHA:** `04cbfb8723e89dbf0eb01e6f5a75d3ce9fc189d3`
- **Main Branch:** Untouched.
- **Remote Push:** Suppressed per safety requirements.
