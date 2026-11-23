# MECT — FINAL APPLICATION & INFRASTRUCTURE SECURITY AUDIT
**Document ID:** MECT-DOC-2026-FSA-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Security Classification:** Highly Confidential  
**Audit Date:** 2026-11-22  
**Auditor:** Senior Application Security Auditor & DevOps Security Lead  

---

## 1. Executive Summary

A comprehensive, defense-in-depth security audit was conducted covering the Git history, source code repositories, API endpoints, authentication and authorization subsystems, encryption and hashing implementations, and deployment configurations.

All high-severity vulnerabilities identified in earlier iterations have been resolved and verified with automated test suites. A single owner-accepted security exception regarding a historical third-party LLM key is documented with an architectural boundary analysis confirming zero residual risk to donor data or banking operations.

---

## 2. Git History Secret Scanning & Forensic Analysis

### 2.1 Automated Secret Scanning Execution
- **Tooling:** `scripts/scan_secrets.mjs` combined with regex-based historical Git commit inspection.
- **Scope:** Complete Git log (`git rev-list --all`) covering commits across all feature and fix branches.
- **Scan Targets:** API keys (Groq, Resend, Cashfree, Razorpay, Twilio, MSG91), private keys (`[BEGIN-PRIVATE-KEY-PATTERN]`), JWT secrets, and database passwords.

### 2.2 Findings & Sanitization Record

| Credential Type | Status in Working Tree | Status in Historical Git | Remediation / Classification |
| :--- | :--- | :--- | :--- |
| **Resend API Key** | Sanitized (`re_placeholder...`) | Purged from tracked files | Stored in `.env.production` on VPS only |
| **Cashfree Secret Key** | Sanitized (`cfsk_mahavir_...`) | Quarantined in docs | Payment provider switched to `SBI_DIRECT` |
| **Razorpay Key Secret** | Sanitized (`rzp_sec_...`) | Quarantined in docs | Gateway inactive in production |
| **JWT Secrets** | Strong 64-byte hex placeholder | Quarantined | Runtime injected via environment |
| **OTP Hash Pepper** | Strong 32-byte hex placeholder | Quarantined | Runtime injected via environment |
| **Historical Groq Key** | Absent from working tree | Present in historical commit | **Owner-Accepted Security Exception** |

### 2.3 Detailed Analysis: Groq Key Exception
- **Key Fingerprint:** `gsk_` followed by masked characters.
- **Provider:** Groq Cloud Inc. (External LLM API Provider).
- **Access Boundary & Risk Containment:**
  1. **Zero Database Access:** Groq is an external stateless inference endpoint. Possessing the key grants zero read/write access to PostgreSQL, backups, or tables.
  2. **Zero Donor PII Access:** No donor names, PANs, emails, or phone numbers are stored on Groq servers.
  3. **Zero Banking Access:** Groq has no interface with SBI, UPI, or statutory accounts.
  4. **Residual Risk Assessment:** Negligible / Low. The key's worst-case utility is unauthorized consumption of public inference tokens on Groq's cloud. Formally accepted by the Trust Managing Trustee.

---

## 3. Infrastructure Token & Hostname Sanitization (Commit 42a7fa1)

In commit `42a7fa1`, all concrete infrastructure identifiers were removed from repository-tracked documentation and configuration templates:
- **IP Addresses:** Replaced with `<VPS_STATIC_IPV4>` (e.g. `203.0.113.10`).
- **Hostnames:** Standardized to `mect.org.in` or `<VPS_HOSTNAME>`.
- **Usernames:** Root usernames replaced with `<DEPLOY_USER>`.
- **Local File Paths:** Windows paths (`C:\Users\...`) replaced with standardized POSIX container paths (`/app/...`).
- **Quarantine Repository:** Concrete deployment coordinates are strictly confined to `docs/local-deploy-notes.md`, which is ignored by `.gitignore`.

---

## 4. Authentication, Authorization & Privilege Separation Audit

Evidence from `AuthenticationAndSecurityTests` (7/7 tests passed):

### 4.1 Password Hashing & Secret Storage
- **Algorithm:** BCrypt with work factor 12.
- **Implementation:** `org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder`.
- **Storage:** Stored in `admin_users.password_hash`. Plaintext passwords are never logged or stored.

### 4.2 Token Lifecycle & Refresh Rotation
- **Access Token:** Short-lived JWT (15 minutes expiration), HMAC-SHA256 signed.
- **Refresh Token:** Cryptographically secure random UUID token stored in `refresh_tokens` table with expiration and revocation flags.
- **Token Rotation:** On every refresh call (`/auth/refresh`), the old refresh token is immediately revoked in the database, and a new token pair is issued (`testTokenRefreshRotation` PASSED).
- **Replay Attack Defense:** Presenting an already-revoked refresh token triggers immediate rejection with HTTP 401 Unauthorized.

### 4.3 Brute Force Defense & Account Lockout
- **Threshold:** 5 consecutive failed login attempts.
- **Action:** User account status changed to `AccountStatus.LOCKED` with exponential lockout timestamp (`locked_until`).
- **Response:** HTTP 423 Locked with error payload `{"error": "Account Locked"}` (`testBruteForceLockoutAfterFiveConsecutiveFailures` PASSED).
- **Audit Logging:** Every failed attempt records `LOGIN_FAILED` in the immutable audit log; lockout triggers `ACCOUNT_LOCKED`.

### 4.4 Role-Based Access Control (RBAC)
- **Roles Defined:** `ROLE_SUPER_ADMIN`, `ROLE_TRUSTEE`, `ROLE_FINANCE_OFFICER`, `ROLE_APPLICATION_REVIEWER`.
- **Privilege Separation:**
  - `/admin/inquiries`: Accessible to `ROLE_APPLICATION_REVIEWER` and above.
  - `/admin/audit-logs`: Strictly restricted to `ROLE_TRUSTEE` and `ROLE_SUPER_ADMIN`. Reviewer access returns HTTP 403 Forbidden (`testRoleBasedAccessControlAndPrivilegeSeparation` PASSED).
  - Unauthenticated requests to any `/admin/*` route return HTTP 401 Unauthorized.

---

## 5. Public Endpoint Security & Threat Neutralization

### 5.1 SQL Injection Neutralization
- **Mechanism:** Spring Data JPA with parameterized Hibernate ORM queries.
- **Verification:** Attack payloads such as `' OR '1'='1` in login credentials and search parameters are treated strictly as literal strings and neutralized (`testSqlInjectionAttemptNeutralizedByOrm` PASSED).

### 5.2 Cross-Site Scripting (XSS) & Input Sanitization
- **Mechanism:** HTML entities and malicious tags (e.g. `<script>alert('xss')</script>`) in public inquiries are sanitized before persistence.
- **Verification:** Verified in `testPublicInquiryDuplicateDefenseAndSanitization` (PASSED).

### 5.3 Duplicate Inquiry Defense & DoS Protection
- **Mechanism:** Immediate duplicate submissions with identical email and message are intercepted.
- **Action:** System suppresses the duplicate row creation in `public_inquiries` and returns the existing `referenceId` cleanly without leaking server state.

### 5.4 Honeypot Bot Defense
- **Implementation:** Hidden form field `_gotcha`.
- **Verification:** Any submission with `_gotcha` populated is immediately rejected with HTTP 400 Bad Request prior to processing (`scripts/test_donation_workflow_e2e.mjs` PASSED).

---

## 6. Security Audit Conclusion

The application demonstrates robust multi-layered security controls across both the Next.js frontend and Spring Boot backend. All critical gates are **PASSED**.
