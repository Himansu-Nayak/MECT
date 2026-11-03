# MAHAVIR TRUST — Volunteer Section: Security, Privacy & Performance Audit

**Document Reference**: `VOLUNTEER_SECURITY_AND_PRIVACY_AUDIT.md`  
**Classification**: Threat Modeling & Non-Functional Quality Assessment  
**Author**: Application Security Engineer & Performance Engineer  
**Date**: November 2, 2026  
**Status**: VERIFIED AUDIT REPORT  

---

## 1. Executive Security & Privacy Overview

The volunteer registration flow operates at the public perimeter of the MAHAVIR TRUST platform. As an educational and public charitable trust handling interactions between adult mentors and young undergraduate scholars, security, data minimization, and student safeguarding are paramount.

This audit evaluates the system against standard security criteria (OWASP Top 10, CWE/SANS Top 25, India Digital Personal Data Protection Act - DPDPA 2023 principles).

---

## 2. Threat Modeling & Vulnerability Findings

### Findings Classification Table

| Finding ID | Threat / Vector | Description | Severity | Current Mitigation / Assessment | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **Public API Flood / Denial of Service** | Malicious bot army spamming `POST /public/volunteers` to exhaust DB connections or table storage. | **Medium** | Mitigated by `RateLimitingFilter.java` (30 req/min per IP) and Spring Boot thread pool limits. | Maintain in-memory rate limiting; consider cloud-level WAF/Cloudflare for production edge. |
| **SEC-02** | **Duplicate Submission Spam** | User rapidly clicking submit or script submitting identical inquiries repeatedly. | **Low** | Mitigated by `VolunteerRegistrationService` checking `email + roleInterest` within 180s. Returns existing `referenceId` idempotently. | Verified effective. Frontend adds button disablement while `isSubmitting = true`. |
| **SEC-03** | **Stored Cross-Site Scripting (XSS)** | Malicious payload in `fullName` or `backgroundNotes` executed when admin views volunteer list. | **High** | Sanitized in `VolunteerRegistrationService.sanitizeInput()` by regex stripping `<script>` and HTML tags. React auto-escapes rendered text. | Keep server-side sanitization; ensure admin portal renders text as plain strings, never `dangerouslySetInnerHTML`. |
| **SEC-04** | **Unauthorized Volunteer Data Access** | Unauthenticated user accessing volunteer personal contact information (emails, phones). | **High** | Protected: `GET /admin/volunteers` requires valid JWT token with roles `SUPER_ADMIN`, `ADMIN`, or `VOLUNTEER_COORDINATOR`. Public API exposes no read endpoints. | Verified secure. No public search or listing of volunteers exists. |
| **SEC-05** | **Privilege Escalation** | Regular user attempting to access administrative endpoints or register as coordinator. | **High** | Protected: `SecurityConfig.java` enforces `@EnableMethodSecurity`. Admin users are created only by `SUPER_ADMIN` with bcrypt(12) hashed passwords. | Verified secure. Public registration only creates `VolunteerRegistration` records, never `AdminUser` accounts. |
| **SEC-06** | **Document Upload Malware / Infiltration** | Prospective volunteers uploading malicious PDF/executable files disguised as resumes. | **High** | Currently **No file upload** is supported on the public volunteer endpoint. All background information is captured as plain text. | **Strong Architectural Decision**: Avoid public document uploads at registration. Request resumes via secure email after initial screening. |
| **SEC-07** | **CSRF on Public Form** | Cross-Site Request Forgery executing submissions on behalf of unsuspecting users. | **Low** | `csrf().disable()` in `SecurityConfig`. Since the public endpoint does not use browser session cookies or HTTP-Basic auth, CSRF is inherently non-exploitable. | Safe and standard for stateless REST APIs. |
| **SEC-08** | **CORS Misconfiguration** | Unauthorized third-party websites reading or posting to the backend API. | **Medium** | `SecurityConfig.corsConfigurationSource()` restricts origins via `app.cors.allowed-origins` (default `http://localhost:3000`). | Verify production domain (`https://mahavirtrust.org`) is strictly configured in production environment variables. |

---

## 3. Privacy & Data Protection Audit (DPDPA 2023 Compliance)

### 3.1 Data Minimization Principles
The volunteer registration system strictly adheres to **data minimization**:
- **What is collected**: Full name, email, phone number, district, role of interest, qualification summary, and brief motivation notes.
- **What is deliberately NOT collected**:
  - No Government ID numbers (Aadhaar, PAN, Voter ID).
  - No Financial or Bank Account numbers.
  - No Caste, Religion, or Sensitive Personal Data.
  - No Password or Credential creation.
  - No unvetted file or document uploads.

### 3.2 Purpose Limitation & Notice
- The form includes a prominent statutory notice:
  > *"Information provided is utilized solely by the MAHAVIR TRUST Secretariat for volunteer orientation, screening, and academic scholar allocation. Details are never shared with commercial entities or third-party marketers."*
- A mandatory declaration checkbox (`declarationConsent`) requires the volunteer to affirm that their details are authentic and that they agree to the Trust's Student Protection and Ethical Conduct policies.

### 3.3 Data Retention & Erasure
- Volunteer records remain in `AWAITING_ORIENTATION` status until verified.
- Volunteers who do not complete orientation or request removal may have their records marked as `INACTIVE` or deleted upon formal request to `privacy@mahavirtrust.org`.

---

## 4. Performance & Core Web Vitals Audit

### 4.1 Bundle & Rendering Efficiency
- **Server vs Client Components**: The `/volunteer` route is a `"use client"` page due to interactive state management (form handling, tab filtering, accordions).
- **Bundle Footprint**: Reuses existing installed libraries (`lucide-react`, `motion`). Zero new npm dependencies introduced.
- **Client JS Execution**: Initial route bundle estimated at **~210 kB**, well within the Next.js standard budget (< 250 kB).

### 4.2 Core Web Vitals Targets

| Metric | Target | Optimization Strategy |
| :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | `< 1.2s` | Editorial hero is text and SVG based; no large hero raster images to block rendering. |
| **First Input Delay (FID) / INP** | `< 50ms` | Form inputs use native HTML `<input>` and `<select>` controls without heavy virtual DOM wrappers. |
| **Cumulative Layout Shift (CLS)** | `0.00` | Fixed aspect ratio badge containers, defined accordion heights, no banner popups. |

### 4.3 Animation Performance (Motion)
- Animations are restricted to **GPU-accelerated properties**: `opacity` and `transform` (`y: 10 -> 0`).
- No layout-thrashing properties (`height`, `width`, `margin`) are animated.
- All animations respect `@media (prefers-reduced-motion: reduce)` via CSS fallbacks and Motion's built-in reduction hooks.
