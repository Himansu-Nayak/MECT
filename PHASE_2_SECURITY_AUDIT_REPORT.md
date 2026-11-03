# MAHAVIR TRUST — Phase 2: Enterprise Backend Security & Platform Audit Report

**Author**: Principal Backend Architect, Application Security Engineer, and Database Security Specialist  
**Target Environment**: Isolated Security Worktree (`.worktrees/security-patch`)  
**Git Branch**: `security/nextjs-patch-upgrade`  
**Date**: November 2, 2026  
**Document Version**: 2.0.0-ENTERPRISE  
**Security Classification**: Institutional Confidential / Internal Audit  

---

## Executive Summary

This audit and security implementation was executed on the **MAHAVIR TRUST** platform repository to transition the platform from an open, prototype backend to a hardened, institutional-grade enterprise architecture.

Prior to Phase 2, the backend exposed public endpoints (`/api/inquiries`, `/api/volunteers`) without rate limiting, duplicate protection, or authentication mechanisms. No institutional administration capability, role-based access control (RBAC), or cryptographic audit logging existed. Furthermore, client inputs lacked sanitization against stored cross-site scripting (XSS), and transaction boundaries did not guard against distributed denial of service or credential brute-forcing.

### Key Milestones Achieved in Phase 2:
1. **Zero-Trust Institutional Authentication & Authorization**: Implemented Spring Security 6 with stateless HMAC-SHA256 JWT tokens, single-use cryptographically hashed refresh tokens (`SHA-256`), BCrypt (strength 12) password hashing, automated 5-attempt account lockouts, and endpoint/method-level role authorization.
2. **Institutional Role Hierarchy**: Enforced 6 distinct institutional roles (`SUPER_ADMIN`, `TRUSTEE`, `ADMIN`, `APPLICATION_REVIEWER`, `FINANCE_OFFICER`, `VOLUNTEER_COORDINATOR`) with least-privilege enforcement.
3. **Database Hardening & Flyway Migration V2**: Authored `V2__auth_and_audit_schema.sql` introducing `admin_users`, `refresh_tokens`, and `audit_logs` with unique constraints, foreign keys, cascade triggers, non-null guarantees, and B-Tree indexes.
4. **Public Surface Hardening**: Implemented IP-based sliding-window rate limiting (30 requests/minute), HTML tag stripping/sanitization to prevent stored XSS, duplicate submission deduplication within a 3-minute sliding window, and strict payload size constraints (5 MB multipart, 1 MB JSON).
5. **Administrative Architecture Blueprint**: Documented functional and security specifications for the 10 core administrative modules, clearly demarcating existing vs. roadmap capabilities without fabricating sensitive institutional data.
6. **Full Automated Verification**: Executed 12 automated backend security tests (100% passing) and validated frontend build and typecheck compatibility (`npx tsc --noEmit` and `npm run build` with zero regressions on Next.js 16.4.3).

---

## 1. Phase 1 — Repository Inspection & Architecture Inventory

A comprehensive inspection of the repository was performed across both the Next.js frontend and the Spring Boot backend.

### 1.1 Backend Component Inventory

| Category | Component / File | Purpose & Scope |
| :--- | :--- | :--- |
| **Controllers** | `PublicInquiryController.java`<br>`VolunteerRegistrationController.java`<br>`AuthController.java`<br>`AdminController.java` | Handles `/api/inquiries`, `/api/volunteers`, `/api/auth/*` (login, refresh, logout, me), and `/api/admin/*` (user management, audit logs, inquiries, volunteers). |
| **Services** | `PublicInquiryService.java`<br>`VolunteerRegistrationService.java`<br>`AuthService.java`<br>`AdminUserService.java`<br>`AuditLogService.java` | Core business logic, deduplication, HTML sanitization, JWT issuance, token rotation, brute-force tracking, and persistent audit logging. |
| **Repositories** | `PublicInquiryRepository.java`<br>`VolunteerRegistrationRepository.java`<br>`AdminUserRepository.java`<br>`RefreshTokenRepository.java`<br>`AuditLogRepository.java` | Spring Data JPA interfaces interfacing PostgreSQL via prepared queries with index support. |
| **Entities** | `PublicInquiry.java`<br>`VolunteerRegistration.java`<br>`AdminUser.java`<br>`RefreshToken.java`<br>`AuditLog.java`<br>`Role.java` (Enum)<br>`AccountStatus.java` (Enum) | Relational mapping entities with timestamp triggers, status flags, and strict database mappings. |
| **DTOs** | `PublicInquiryRequest.java`<br>`VolunteerRegistrationRequest.java`<br>`LoginRequest.java`<br>`TokenRefreshRequest.java`<br>`AuthResponse.java`<br>`CreateUserRequest.java`<br>`UserSummaryResponse.java` | Strongly typed boundary objects with Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Pattern`, `@Size`). |
| **Security Configuration** | `SecurityConfig.java`<br>`JwtAuthenticationFilter.java`<br>`RateLimitingFilter.java`<br>`JwtTokenProvider.java`<br>`CustomUserDetailsService.java` | Stateless Spring Security filter chain, CORS configuration, BCrypt 12 bean, rate-limiting filter, 401/403 entry points, and HMAC-SHA256 JWT parser. |
| **Database Migrations** | `V1__initial_schema.sql`<br>`V2__auth_and_audit_schema.sql` | Flyway migrations provisioning public forms, administrative users, refresh token rotation stores, and immutable audit logs. |
| **Environment Configuration** | `application.yml`<br>`application-test.yml` | Spring profile configurations defining datasource, Flyway settings, JWT secrets, token lifespans, multipart limits, and Actuator endpoints. |
| **Automated Tests** | `MahavirTrustBackendApplicationTests.java`<br>`AuthenticationAndSecurityTests.java` | Suite of 12 integration and unit tests covering persistence, validation, JWT auth, RBAC, lockout, and rate limiting. |

---

## 2. Phase 2 — Authentication, Authorization & Security Architecture

### 2.1 Role-Based Access Control (RBAC) Matrix

The system establishes an institutional role model with least-privilege enforcement across all administrative endpoints:

```
+-------------------------------------------------------------------------------------------------------+
| Endpoint / Resource           | SUPER_ADMIN | TRUSTEE | ADMIN | REVIEWER | FINANCE | VOLUNTEER_COORD |
+-------------------------------------------------------------------------------------------------------+
| POST /api/admin/users         |     YES     |   NO    |  NO   |    NO    |   NO    |       NO        |
| GET  /api/admin/users         |     YES     |   NO    |  YES  |    NO    |   NO    |       NO        |
| GET  /api/admin/audit-logs    |     YES     |   YES   |  YES  |    NO    |   NO    |       NO        |
| GET  /api/admin/inquiries     |     YES     |   YES   |  YES  |   YES    |   NO    |       NO        |
| GET  /api/admin/volunteers    |     YES     |   YES   |  YES  |    NO    |   NO    |      YES        |
| POST /api/auth/logout         |     YES     |   YES   |  YES  |   YES    |   YES   |      YES        |
| GET  /api/auth/me             |     YES     |   YES   |  YES  |   YES    |   YES   |      YES        |
+-------------------------------------------------------------------------------------------------------+
```

### 2.2 Cryptographic Key & Token Architecture

1. **Password Hashing**: Passwords are saved strictly through `BCryptPasswordEncoder(12)`. No plain passwords or reversible encodings are stored.
2. **Access Tokens**: Short-lived (15 minutes) HMAC-SHA256 JWT tokens containing username, user ID, institutional role, subject, issued-at timestamp, and expiry timestamp.
3. **Refresh Tokens**: Long-lived (7 days) cryptographically random UUID tokens. To prevent offline token leakage and database compromise exposure:
   - Only the **SHA-256 hash** of the refresh token is stored in the `refresh_tokens` database table.
   - Upon refresh, the incoming token is hashed and matched.
   - **Strict Token Rotation**: Every refresh event revokes the prior token and issues a new refresh token and access token. Re-use attempts invalidate all sessions for that account.
4. **Brute-Force & Lockout Defense**:
   - Accounts track `failed_login_attempts`.
   - On the **5th consecutive failed attempt**, the account status is transitioned to `LOCKED` with an explicit security alert logged to `audit_logs`.
   - Subsequent login attempts receive `423 Locked`.
   - Successful login resets `failed_login_attempts` to 0 and updates `last_login_at`.
5. **Audit Logging**:
   - All privileged events (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `ACCOUNT_LOCKED`, `TOKEN_REFRESH`, `LOGOUT`, `USER_CREATED`, `ACCESS_DENIED`) are logged in the append-only `audit_logs` table with username, action, resource, IP address, and status.

---

## 3. Phase 3 — Database Security & Schema Migration Audit

### 3.1 Migration Evolution

Flyway migration `V2__auth_and_audit_schema.sql` was authored to establish institutional security foundations without altering existing `public_inquiries` or `volunteer_registrations` tables.

```sql
-- V2__auth_and_audit_schema.sql Summary:
-- 1. admin_users table with unique username/email, role enum, status enum, lockout counter
-- 2. refresh_tokens table with token_hash unique index, foreign key cascade, expiry index
-- 3. audit_logs table with indexes on timestamp, username, action
```

### 3.2 Database Integrity Audit Findings

| Category | Assessment & Implementation | Security Impact |
| :--- | :--- | :--- |
| **Primary Keys** | `BIGSERIAL` / `BIGINT GENERATED ALWAYS AS IDENTITY` on all tables. | Prevents key exhaustion and provides deterministic ordering. |
| **Unique Constraints** | `admin_users(username)`, `admin_users(email)`, `refresh_tokens(token_hash)`. | Eliminates duplicate identities and token collisions. |
| **Foreign Keys** | `refresh_tokens(user_id) REFERENCES admin_users(id) ON DELETE CASCADE`. | Enforces strict referential integrity. |
| **B-Tree Indexes** | `idx_admin_users_username`, `idx_admin_users_email`, `idx_refresh_tokens_hash`, `idx_refresh_tokens_expires_at`, `idx_audit_logs_timestamp`, `idx_audit_logs_username`. | Prevents full table scans during authentication and audit querying. |
| **Transaction Boundaries** | Spring `@Transactional(readOnly = true)` for read paths; explicit isolation on mutations. `noRollbackFor` configured on auth failures so lockout counters increment reliably. | Guards against race conditions and lock exhaustion. |
| **Sensitive Data** | Zero plaintext passwords, zero plaintext refresh tokens, zero payment secrets. | Minimal attack surface in the event of database snapshot leakage. |
| **Backup & Restoration** | Production deployment must configure automated WAL-G / pgBackRest continuous archiving with point-in-time recovery (PITR) and daily encrypted snapshots. | Protects against data corruption and disaster scenarios. |

---

## 4. Phase 4 — Public Application Security & Perimeter Hardening

### 4.1 Threat Mitigation Table

| Threat Vector | Vulnerability Found in Prototype | Hardened Defense Implemented |
| :--- | :--- | :--- |
| **Denial of Service (DoS)** | Unbounded request rates allowed resource exhaustion. | Added `RateLimitingFilter` enforcing a 30 requests/minute sliding-window quota per client IP (`X-Forwarded-For` aware). Returns `429 Too Many Requests`. |
| **Stored Cross-Site Scripting (XSS)** | Public inquiry/volunteer inputs accepted raw HTML/script tags. | Implemented HTML sanitization (`stripHtml`) in services to strip HTML and script tags before persistence. |
| **Duplicate / Spam Submissions** | Users could repeatedly submit forms, spamming database records. | Added duplicate detection window (180 seconds) checking email and recent timestamp. Re-submitting returns the existing reference ID without creating duplicate rows. |
| **Payload Bombing** | Unbounded request body sizes could consume memory buffers. | Restricted Spring multipart uploads to **5 MB maximum file size / 10 MB maximum request size**, and max HTTP request body to 1 MB. |
| **Information Disclosure** | Default error handlers could leak stack traces and SQL syntax. | Standardized `GlobalExceptionHandler` intercepting all exceptions and returning structured JSON without internal diagnostic leakage. |

---

## 5. Phase 5 — Administrative Architecture Specifications

The following section audits and defines the architecture requirements for the 10 core administrative modules, clearly distinguishing **Implemented Functionality** from **Proposed / Roadmap Architecture**.

```
Status Legend:
[IMPLEMENTED] : Operational, verified by code, schema, and automated tests.
[PROPOSED]    : Architecture designed, entity model and API contracts specified for Phase 3.
```

### 5.1 Module Audit & Specifications

#### 1. Trustee Dashboard
- **Status**: `[PROPOSED]`
- **Requirements**: Read-only institutional overview for Board of Trustees (`TRUSTEE` role). Aggregates active beneficiaries, distributed aid totals, ongoing education initiatives, and executive compliance indicators.
- **Security Rule**: Board members have high read permissions across aggregated data, but zero direct write/mutation permissions on application records or financial journals.

#### 2. Application Management
- **Status**: `[PROPOSED]`
- **Requirements**: Central repository of all incoming trust beneficiaries (educational, healthcare, disaster relief). State machine: `SUBMITTED -> UNDER_REVIEW -> DOCUMENT_VERIFICATION -> APPROVED -> REJECTED -> DISBURSED`.
- **Security Rule**: Role-restricted access (`APPLICATION_REVIEWER`, `ADMIN`). Every state change requires an audit trail entry with reviewer notes.

#### 3. Scholarship Review Workflow
- **Status**: `[PROPOSED]`
- **Requirements**: Two-tier evaluation pipeline for meritorious student scholarships. Tier 1: Academic criteria score verification; Tier 2: Socio-economic need verification.
- **Security Rule**: Reviewers cannot approve scholarships above authorized financial thresholds without `ADMIN` or `TRUSTEE` countersignature.

#### 4. Applicant Document Verification
- **Status**: `[PROPOSED]`
- **Requirements**: Secure storage, hashing, and visual inspection of applicant documentation (income certificates, transcripts, identity cards).
- **Security Rule**: Strict MIME-type validation (PDF, JPEG, PNG only, magic number verification), SHA-256 integrity checksums, encrypted at rest in private object storage (S3/GCS with pre-signed ephemeral URLs). Zero direct public web access to uploaded documents.

#### 5. Volunteer Management
- **Status**: `[IMPLEMENTED - CORE API]` & `[PROPOSED - ADMIN WORKFLOW]`
- **Implemented**: Public registration endpoint (`/api/volunteers`) with deduplication, validation, rate limiting, and database persistence; secured admin listing endpoint (`/api/admin/volunteers`) restricted to `VOLUNTEER_COORDINATOR`, `ADMIN`, `SUPER_ADMIN`.
- **Proposed**: Volunteer status lifecycle (`REGISTERED -> ORIENTED -> ACTIVE -> ALUMNI`), background verification tracking, event assignment calendar.

#### 6. Financial Transparency Dashboard
- **Status**: `[PROPOSED]`
- **Requirements**: Real-time fund allocation reporting, institutional expense breakdown, programmatic impact ratios, and annual FCRA/80G compliance audit reports.
- **Security Rule**: Managed strictly by `FINANCE_OFFICER` and `TRUSTEE`. Financial balances cannot be manually edited; they must be derived from double-entry ledger transactions.

#### 7. Inquiry Management
- **Status**: `[IMPLEMENTED - CORE API]` & `[PROPOSED - WORKFLOW]`
- **Implemented**: Public inquiry intake (`/api/inquiries`) with rate limiting, sanitization, duplicate protection; secured admin listing (`/api/admin/inquiries`) accessible to `APPLICATION_REVIEWER`, `ADMIN`, `TRUSTEE`, `SUPER_ADMIN`.
- **Proposed**: Inquiry assignment to trust staff, response email dispatching, status tracking (`NEW -> IN_PROGRESS -> RESOLVED -> CLOSED`).

#### 8. Institutional Notice Management
- **Status**: `[PROPOSED]`
- **Requirements**: Publication pipeline for official Trust press releases, annual reports, tender notifications, and urgent community announcements.
- **Security Rule**: Publication to public frontend requires dual authorization (`ADMIN` creation + `TRUSTEE` approval).

#### 9. Audit Logs
- **Status**: `[IMPLEMENTED]`
- **Implemented**: Persistent, append-only `audit_logs` table and `AuditLogService`. Automatically records all authentication successes, authentication failures, lockouts, token rotations, logouts, user creations, and unauthorized access attempts. Accessible via `/api/admin/audit-logs` restricted to `SUPER_ADMIN`, `TRUSTEE`, `ADMIN`.

#### 10. User and Role Management
- **Status**: `[IMPLEMENTED]`
- **Implemented**: User creation (`/api/admin/users`) with role assignments, status management (`ACTIVE`, `SUSPENDED`, `LOCKED`, `DEACTIVATED`), unique email/username constraints, BCrypt(12) credential creation, and listing of administrative staff. Restricted exclusively to `SUPER_ADMIN`.

---

## 6. Phase 6 — Automated Testing & Verification Results

### 6.1 Backend Test Execution (`mvn clean test`)

Executed in `backend/` within the isolated security worktree.

```
-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running org.mahavirtrust.backend.AuthenticationAndSecurityTests
- testPublicEndpointSubmissionAndSanitization             : SUCCESS
- testDuplicateSubmissionProtection                       : SUCCESS
- testSuccessfulAuthenticationFlowAndJwtIssuance          : SUCCESS
- testInvalidCredentialsRejection                         : SUCCESS
- testBruteForceLockoutAfterFiveConsecutiveFailures        : SUCCESS
- testTokenRefreshRotationAndRevocation                   : SUCCESS
- testRoleBasedAccessControlAndPrivilegeSeparation        : SUCCESS
Tests run: 7, Failures: 0, Errors: 0, Skipped: 0 (28.21 s)

Running org.mahavirtrust.backend.MahavirTrustBackendApplicationTests
- contextLoads                                            : SUCCESS
- shouldSubmitPublicInquirySuccessfully                   : SUCCESS
- shouldRejectInvalidPublicInquiry                        : SUCCESS
- shouldRegisterVolunteerSuccessfully                     : SUCCESS
- shouldRejectInvalidVolunteerRegistration                : SUCCESS
Tests run: 5, Failures: 0, Errors: 0, Skipped: 0 (0.299 s)

Results:
Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 48.557 s
```

### 6.2 Frontend Typecheck Execution (`npx tsc --noEmit`)

Executed in root of security worktree.

```
> npx tsc --noEmit
Exit Code: 0
Stdout: (empty - 0 errors)
Stderr: (empty)
```

### 6.3 Frontend Production Build Execution (`npm run build`)

Executed on Next.js 16.4.3 in root of security worktree.

```
> next build --webpack
▲ Next.js 16.4.3 (webpack)
- Environments: .env.local
✓ Running next.config.ts took 194ms
✓ Compiled successfully in 5.2s
  Running TypeScript ...
  Finished TypeScript in 3.0s ...
  Collecting page data using 7 workers ...
✓ Generating static pages using 7 workers (14/14) in 4.7s
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ○ /accessibility
├ ○ /contact
├ ○ /faq
├ ○ /governance
├ ○ /impact
├ ○ /privacy
├ ○ /programmes
├ ○ /scholarships
├ ○ /terms
└ ○ /volunteer
○  (Static)  prerendered as static content

Build Exit Code: 0
```

---

## 7. Remaining Risks & Production Deployment Recommendations

### 7.1 Remaining Risks

1. **Distributed Rate Limiting**: The current `RateLimitingFilter` stores IP quotas in an in-memory concurrent map. In a multi-instance containerized deployment (e.g., Kubernetes or Cloud Run), rate limits must be backed by Redis or Hazelcast.
2. **Reverse Proxy Real-IP Verification**: When operating behind AWS ALB, Cloudflare, or NGINX, ensure `X-Forwarded-For` header spoofing is prevented by validating the trusted proxy IP range.
3. **MFA for Privileged Operations**: `SUPER_ADMIN`, `TRUSTEE`, and `FINANCE_OFFICER` roles should require Time-Based One-Time Password (TOTP) two-factor authentication prior to executing disbursement approvals or user modifications.

### 7.2 Production Deployment Recommendations

1. **Environment Variables**:
   - `JWT_SECRET`: Must be provisioned as a 256-bit high-entropy secret from AWS Secrets Manager or HashiCorp Vault. Never commit to source code.
   - `SPRING_DATASOURCE_PASSWORD`: Inject via container runtime secrets.
2. **Flyway Migration Strategy**: Run Flyway migrations as part of a pre-deployment Kubernetes Job before spinning up new application pods.
3. **Database Network Isolation**: Ensure PostgreSQL is deployed in a private VPC subnet with access restricted exclusively to the Spring Boot application security group.
4. **Audit Log Archival**: Enable pg_cron or AWS Lambda tasks to stream `audit_logs` records to write-once-read-many (WORM) storage (such as AWS S3 Object Lock) for legal compliance.

---

## 8. Summary of Worktree State

- **Branch**: `security/nextjs-patch-upgrade`
- **Isolation Status**: Main branch (`c:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST`) remains 100% clean and untouched.
- **Verification**: All backend and frontend tests passed cleanly without waivers or disabled assertions.
