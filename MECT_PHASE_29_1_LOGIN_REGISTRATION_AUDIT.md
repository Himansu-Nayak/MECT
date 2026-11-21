# MECT PHASE 29.1 — STANDALONE LOGIN & REGISTRATION AUDIT REPORT
## Verification of Independent `/login` and `/register` Gateways, OTP Lifecycle & Identity Architecture

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Routes Audited:** `/login`, `/register`, `/portal/login`

---

## 1. INDEPENDENT LOGIN GATEWAY AUDIT (`/login`)

The standalone login page ([`src/app/login/page.tsx`](file:///<WORKSPACE_DIR>/src/app/login/page.tsx)) was independently evaluated against all specified requirements:

| Requirement | Implementation Detail | Audit Finding |
| :--- | :--- | :---: |
| **MECT Institutional Identity** | Displays official trust emblem, registered deed summary (`41042300063 / 2023`), Section 12A/80G URNs, PAN `AADTM5474F`, and 100% honorary trusteeship pledge. | **PASS** |
| **Mobile Number Input** | Dedicated input with +91 country prefix. Accepts 10-digit standard Indian numbers or pasted `+91`/`91` prefixes. | **PASS** |
| **OTP Request Dispatch** | Calls `POST /portal/auth/request-otp` with channel `PHONE`, normalized target, and purpose `LOGIN`. | **PASS** |
| **6-Digit OTP Verification** | Enlarged, accessible 6-digit numeric input with auto-advance and keyboard navigation. | **PASS** |
| **Resend Cooldown Enforcement** | 60-second countdown timer dynamically rendered. Second immediate request returns HTTP 429. | **PASS** |
| **Change Mobile Number** | One-click "Change mobile number" button transitions smoothly back to phone input state. | **PASS** |
| **Error Handling & Feedback** | Renders high-contrast, accessible error banners for invalid codes, expired OTPs, and rate limits. | **PASS** |
| **Existing Donor Account Preservation** | Authenticates existing supporters via `findByPrimaryPhone` and returns active JWT session without duplicating rows. | **PASS** |
| **Destination Redirection** | Preserves `?next=...` query parameters and redirects returning donors to `/portal/dashboard` or their selected donation. | **PASS** |
| **Responsive Dual-Column Layout** | Left brand column gracefully hidden on small screens; right input atrium full-width on mobile. | **PASS** |

---

## 2. INDEPENDENT REGISTRATION GATEWAY AUDIT (`/register`)

The standalone registration page ([`src/app/register/page.tsx`](file:///<WORKSPACE_DIR>/src/app/register/page.tsx)) was independently evaluated:

| Requirement | Implementation Detail | Audit Finding |
| :--- | :--- | :---: |
| **Legal Full Name** | Validates legal full name (minimum 3 characters) required for Section 80G accounting. | **PASS** |
| **Mobile Verification** | Indian mobile number validated (+91) with SMS OTP verification prior to account activation. | **PASS** |
| **Email Address** | Email field with standard RFC 5322 regex validation for electronic PDF receipt dispatch. | **PASS** |
| **Postal Address** | Street address, city/town, state (`Odisha` default), and 6-digit postal PIN code. | **PASS** |
| **Odisha District Selector** | Dedicated selector containing all 30 administrative districts of Odisha plus "Other / Outside Odisha". | **PASS** |
| **Optional 80G PAN** | Formatted PAN field (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) with real-time format validation. Explicitly non-mandatory. | **PASS** |
| **Statutory Terms Consent** | Mandatory consent checkbox acknowledging MECT Terms of Service and Privacy Policy. | **PASS** |
| **Automatic Profile Sync** | Upon OTP verification, calls `updatePortalProfile` to persist all registered attributes. | **PASS** |
| **Zero Account Duplication** | If a registered number is submitted, it logs into the existing account and updates missing profile attributes. | **PASS** |

---

## 3. BACKEND AUTHENTICATION ARCHITECTURE AUDIT

- **Service Layer (`OtpAuthService.java`):**
  - Salted SHA-256 OTP hashing prevents plaintext credential storage.
  - Expiry set to 10 minutes (`expiresAt = Instant.now().plusSeconds(600)`).
  - Attempt lockout triggered on 5th incorrect attempt (`maxAttempts = 5`).
  - Single-use replay protection stamps `used_at = Instant.now()`.
- **JWT Token Lifecycle:**
  - Access Token: 15-minute expiration, signed with HMAC-SHA256.
  - Refresh Token: 30-day expiration, stored hashed in `portal_refresh_tokens`.
  - Logout cleanly revokes active refresh tokens.
