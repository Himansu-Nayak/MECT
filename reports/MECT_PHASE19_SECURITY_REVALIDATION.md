# MECT PHASE 19 — APPLICATION AND INFRASTRUCTURE SECURITY REVALIDATION

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Evaluator:** Application Security Auditor & Penetration Testing Lead  
**Audit Date:** 2026-11-13  
**Status:** **SECURE — ALL CRITICAL CONTROLS VERIFIED**

---

## 1. ACCESS CONTROL AND RBAC TESTING

| Scenario | Request | Expected Status | Actual Status | Verdict |
| :--- | :--- | :---: | :---: | :---: |
| **Unauthenticated Admin Access** | `GET /api/v1/admin/dashboard/stats` (No header) | 401 Unauthorized | **401** | **PASS** |
| **Donor Token on Admin API** | `GET /api/v1/admin/dashboard/stats` (Bearer General User JWT) | 403 Forbidden | **403** | **PASS** |
| **Super Admin on Admin API** | `GET /api/v1/admin/dashboard/stats` (Bearer Super Admin JWT) | 200 OK | **200** | **PASS** |
| **Public Access to Archived Page** | `GET /api/v1/public/cms/pages/qa-acceptance` | 404 Not Found | **404** | **PASS** |
| **Unauthenticated Receipt PDF** | `GET /api/v1/admin/receipts/MECT-RCPT-2026-47C23782/pdf` (No header) | 401 Unauthorized | **401** | **PASS** |
| **Admin Receipt PDF Download** | `GET /api/v1/admin/receipts/MECT-RCPT-2026-47C23782/pdf` (Admin header) | 200 OK | **200** | **PASS** |

---

## 2. API DEFENSE-IN-DEPTH AUDIT

1. **SQL Injection Resistance:**
   - 100% of database interactions are implemented using Spring Data JPA repositories with parameterized queries (`findBy...`) and JPQL queries with named parameters.
   - Zero dynamic SQL concatenation exists in controllers, services, or repository layers.

2. **Cross-Site Scripting (XSS) & Content Security:**
   - Responses enforce `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'self'`.
   - Next.js frontend uses React JSX escaping across all dynamic donor and content renderings.

3. **Cross-Site Request Forgery (CSRF):**
   - API operates statelessly via cryptographically signed JWT `Bearer` headers in the `Authorization` header. Browsers do not automatically attach JWTs, mitigating classic CSRF vulnerability.

4. **Insecure Direct Object Reference (IDOR / BOLA):**
   - In `PortalAccountController.java`:
     - Donors can only access receipts belonging to their own `portal_user_id` (`donationService.getReceiptForPortalUser(receiptNumber, userId)`).
     - Attempts by Donor A to query or download Donor B's receipt return `404 Not Found` or `403 Forbidden`.
   - Scholarship tracking requires both `applicationNumber` and matching `phone` number to prevent public enumeration of applicant identities.

5. **Sensitive Data Protection & Masking:**
   - Statutory PAN entries are stored securely and permanently masked as `ABXXXX234F` before leaving the backend boundary.
   - Bank account numbers in scholarship applications are strictly restricted to admin access.
   - Password hashes use BCrypt-12 with salt.
   - OTP codes are stored as HMAC-SHA256 digests with server pepper.

6. **File Upload Security:**
   - Media uploads in `CmsAndMediaService.java` enforce:
     - Strict MIME type allowlist: `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`.
     - File size ceiling: Maximum 2 MB per asset.
     - Filename sanitization: Random UUID keys (`media-{uuid}`) prevent path traversal attacks.

