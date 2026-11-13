# MECT PHASE 20.3 — AUTHENTICATION & AUTHORIZATION SECURITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:30:00Z (UTC)  
**Lead Auditor:** Principal Application Security Engineer & DevSecOps Lead  
**Status:** PASS — MULTI-LAYER DEFENSE IN DEPTH VERIFIED  

---

## 1. Investigation of Phase 20.2 Access Control Checks

In Phase 20.2, exploratory tests for frontend client auth guards initially produced parse errors when passing PowerShell inline strings with unescaped `$var` tokens. In Phase 20.3, a dedicated test script (`scripts/test_auth_tokens.ps1`) was executed directly to independently verify both backend and frontend layers.

### Important Architectural Clarification:
- **Client-Side Metadata is NOT a Security Boundary:** The `<meta name="robots" content="noindex, nofollow"/>` tag in `/admin` and `/portal/dashboard` serves solely for search engine crawlers. It is NOT relied upon as an authentication or authorization barrier.
- **Defense-in-Depth Architecture:**
  1. **Layer 1 (Backend API Authorization):** Spring Security strictly enforces `@EnableMethodSecurity`, `SecurityConfig`, and JWT validation. No private data is ever sent across the wire without a cryptographically valid, unexpired Bearer token.
  2. **Layer 2 (Frontend Route Guard):** Next.js client layouts (`AdminClientLayout`, `PortalAuthProvider`) inspect localStorage session tokens on client hydration and execute an immediate router redirect to `/admin/login` or `/portal/login` if unauthenticated.
  3. **Layer 3 (Zero-Leakage SSR Markup):** Server-side rendered HTML contains only the loading skeleton / layout shell. Zero private donor records, administrative metrics, or user profiles are rendered into the initial HTML response.

---

## 2. Unauthenticated Access Matrix & Penetration Test Results

| Target Endpoint / Route | Protocol / Layer | Access Attempt Condition | Response Status | Response Content / Behavior | Security Finding |
|---|---|---|---|---|---|
| `/api/v1/admin/donations` | HTTP/REST (Backend) | No Authorization Header | **401 Unauthorized** | `{"status":401,"error":"Unauthorized","message":"Authentication required..."}` | **PASS** — Enforced by `SecurityConfig` |
| `/api/v1/admin/donations` | HTTP/REST (Backend) | Invalid Signature JWT | **401 Unauthorized** | `{"status":401,"error":"Unauthorized","message":"Authentication required..."}` | **PASS** — HMAC signature verification rejected forged token |
| `/api/v1/admin/donations` | HTTP/REST (Backend) | Expired JWT (issued 2020) | **401 Unauthorized** | `{"status":401,"error":"Unauthorized","message":"Authentication required..."}` | **PASS** — Expired token rejected |
| `/api/v1/portal/dashboard` | HTTP/REST (Backend) | No Authorization Header | **401 Unauthorized** | `{"status":401,"error":"Unauthorized","message":"Authentication required..."}` | **PASS** — Protected donor API rejected unauthenticated visitor |
| `/admin` | Web / HTML (Frontend) | Unauthenticated Browser | **200 OK (Clean Shell)** | Renders loading skeleton; client immediately redirects to `/admin/login` | **PASS** — Zero protected data in SSR HTML |
| `/portal/dashboard` | Web / HTML (Frontend) | Unauthenticated Browser | **200 OK (Clean Shell)** | Renders client shell; client immediately redirects to `/portal/login?next=/portal/dashboard` | **PASS** — Zero donor data in SSR HTML |

---

## 3. Role-Based Access Control (RBAC) Verification

The Spring Boot backend enforces granular roles via `SecurityConfig.java`:

```java
// Donor Portal Scope
.requestMatchers("/portal/**").hasAnyRole("GENERAL_USER", "DONOR")

// Administrative Scope
.requestMatchers("/admin/**").hasAnyRole(
    "SUPER_ADMIN", "TRUSTEE", "ADMIN", "APPLICATION_REVIEWER", "FINANCE_OFFICER",
    "VOLUNTEER_COORDINATOR", "CONTENT_ADMIN", "DONATION_VERIFICATION_OFFICER",
    "SUPPORT_ADMIN", "AUDITOR"
)
```

### Privilege Escalation Prevention:
- If a user authenticated with `ROLE_DONOR` attempts to call administrative endpoints under `/api/v1/admin/*`, Spring Security intercepts the request at the `SecurityFilterChain` level and returns **`HTTP 403 Forbidden`** via `AccessDeniedHandler`:
  ```json
  {"status":403,"error":"Forbidden","message":"You do not possess the required institutional role for this resource","path":"/api/v1/admin/..."}
  ```
- Donor tokens cannot invoke administrative verification, UTR approval, or content editing actions.

---

## 4. Password Hashing & Token Lifetime

- **Password Storage:** BCrypt with work factor **12** (`new BCryptPasswordEncoder(12)`). Enforces slow cryptographic hashing resistant to GPU-accelerated dictionary attacks.
- **Access Token Lifetime:** **900 seconds (15 minutes)** (`app.jwt.access-token-validity-seconds: 900`). Short-lived access limits exposure window.
- **Refresh Token Lifetime:** **604,800 seconds (7 days)** (`app.jwt.refresh-token-validity-seconds: 604800`). Rotated upon usage, stored with user UUID linkage.

