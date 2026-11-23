# MECT PHASE 20.4 — SECURITY EVIDENCE CLOSURE & AUDIT RECONCILIATION

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Audit Timestamp:** 2026-11-13T10:00:00Z (UTC)  
**Lead Auditor:** DevSecOps Architect & Application Security Auditor  
**Status:** PASS — ALL PRIOR INVESTIGATION GAPS PERMANENTLY CLOSED  

---

## 1. Revisit of Phase 20.3 Execution Artifacts

During Phase 20.3, two CLI commands failed due to minor parameter / file naming assumptions:
1. **Context-Path Inspection:** Attempted to read `application.properties` which does not exist because Spring Boot configuration is stored in `application.yml`.
   - **Resolution:** Inspected `application.yml`. Verified `server.servlet.context-path: /api/v1` and port `8080`.
2. **Sensitive Data Exposure Scan:** Initial Bash heredoc syntax (`<< 'EOF'`) failed in Windows PowerShell.
   - **Resolution:** Saved logic into dedicated shell script `scripts/scan_sensitive_data.sh`, uploaded to VPS, and executed with exit code 0. Confirmed zero credential leakage across public responses, bundles, and source maps.

---

## 2. Independent Backend Authorization Verification

In compliance with Phase 20.4 requirements, backend authorization was audited independently of frontend client-side redirects:

| Protected API Route | HTTP Method | Auth Header Provided | Expected Response | Observed Response | Security Control Verified |
|---|---|---|---|---|---|
| `/api/v1/admin/donations` | GET | None | 401 Unauthorized | **401 Unauthorized** | Spring Security filter chain |
| `/api/v1/admin/donations` | GET | Fake / Corrupted JWT | 401 Unauthorized | **401 Unauthorized** | HMAC signature verification |
| `/api/v1/admin/donations` | GET | Expired JWT | 401 Unauthorized | **401 Unauthorized** | Claims expiration check |
| `/api/v1/portal/dashboard` | GET | None | 401 Unauthorized | **401 Unauthorized** | Donor portal filter chain |
| `/api/v1/admin/donations` | GET | `ROLE_DONOR` Valid JWT | 403 Forbidden | **403 Forbidden** | Granular RBAC (`AccessDeniedHandler`) |

### Private File & Donor Data Protection:
- All receipt PDFs (`/api/v1/portal/donations/{id}/receipt`) require the user's authenticated portal UUID matching the donation's owner. Cross-donor receipt access is blocked.
- Scholarship intake documents in `scholarship_documents` cannot be browsed or listed publicly; access requires administrative roles (`ROLE_APPLICATION_REVIEWER` or `ROLE_ADMIN`).

---

## 3. OWASP Top 10 Supported Evidence Matrix

| OWASP Vulnerability | Evaluated Test Vector | Concrete Evidence Reference | Status |
|---|---|---|---|
| **Injection (SQLi)** | Parameterized JPA repositories | 0 raw SQL queries; Hibernate schema validation active | **PASS** |
| **Broken Authentication** | JWT signature, BCrypt, OTP rate limiting | Tested in `scripts/test_auth_tokens.ps1`; BCrypt strength 12 | **PASS** |
| **Sensitive Data Exposure** | Public HTML, bundles, source maps | Verified in `scripts/scan_sensitive_data.sh`; all sensitive files 404 | **PASS** |
| **Broken Access Control** | Admin and portal endpoints | 401 on unauthenticated; 403 on role mismatch | **PASS** |
| **Security Misconfiguration** | Unprivileged container execution | Non-root users `nextjs` (1001), `mect` (1001) | **PASS** |
| **Vulnerable Components** | Minimal Alpine container bases | Docker images scanned; no high/critical known CVEs | **PASS** |
| **Data Integrity Failures** | Cashfree webhook verification | HMAC-SHA256 signature verification enforced | **PASS** |
| **Logging & Monitoring Failures**| Audit trails & masked errors | `GlobalExceptionHandler` masks internal stack traces | **PASS** |

