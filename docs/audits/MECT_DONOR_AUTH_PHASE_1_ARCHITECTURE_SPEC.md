# MECT — PREMIUM DONOR AUTHENTICATION, OTP LOGIN & GOOGLE SIGN-IN
## PHASE 1: IDENTITY & AUTHENTICATION ARCHITECTURE SPECIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Current Baseline Commit:** `2d60ea6`  
**Classification:** Enterprise Identity Architecture & Security Specification  
**Status:** APPROVED & AUDITED  
**Execution Environment:** Isolated Local Test Environment (Strict Production Freeze)

---

## 1. ARCHITECTURAL OBJECTIVE

Design and establish **ONE canonical donor identity architecture** for MECT that seamlessly supports:
1. **Method A: Mobile Phone Number + Cryptographic OTP Verification** (E.164, Indian +91 default, 6-digit cell input, auto-focus, countdown timer, rate-limited).
2. **Method B: Google Account Sign-In via OpenID Connect (OIDC)** (Backend ID-token verification, audience/issuer validation, minimum identity scopes: `openid`, `email`, `profile`).
3. **Canonical Identity Resolution:** Both methods resolve deterministically to a single `PortalUser` entity in PostgreSQL, preserving donation records, receipts, and history without duplicate accounts.
4. **Progressive Profile Enrichment:** Collect full name upfront, city/state progressively (with "Skip for now"), and mobile verification before donation remittance.

---

## 2. CANONICAL IDENTITY RESOLUTION TOPOLOGY

```
                                +---------------------------------------------+
                                |      Progressive Donor Auth Experience      |
                                |       (Next.js 16 / TypeScript / React)     |
                                +----------------------+----------------------+
                                                       |
                         +-----------------------------+-----------------------------+
                         |                                                           |
                         v                                                           v
            [METHOD A: MOBILE OTP]                                      [METHOD B: GOOGLE OIDC]
                         |                                                           |
             Mobile Number + +91                                           Google Identity Services
                         |                                                           |
             POST /portal/auth/request-otp                                   Google ID Token (JWT)
                         |                                                           |
             6-Digit OTP Code                                                        |
                         |                                                           |
             POST /portal/auth/verify-otp                                    POST /portal/auth/google
                         |                                                           |
                         +-----------------------------+-----------------------------+
                                                       |
                                                       v
                                     +-----------------------------------+
                                     |    Canonical Identity Service     |
                                     |       (Spring Boot Backend)       |
                                     +-----------------+-----------------+
                                                       |
                         +-----------------------------+-----------------------------+
                         |                                                           |
                         v Match on google_sub or phone                              v No Match
            +-------------------------+                                 +-------------------------+
            | Existing PortalUser     |                                 | Create PortalUser       |
            | - Retain userUuid       |                                 | - Generate userUuid     |
            | - Retain Donation Hist  |                                 | - Assign ROLE_GEN_USER  |
            | - Retain Receipts       |                                 | - Create Profile        |
            | - Link Provider Identity|                                 | - Set Auth Provider     |
            +------------+------------+                                 +------------+------------+
                         |                                                           |
                         +-----------------------------+-----------------------------+
                                                       |
                                                       v
                                     +-----------------------------------+
                                     |   Issue MECT Portal JWT Tokens    |
                                     | - Access Token (15m validity)     |
                                     | - Refresh Token (with DB rotation)|
                                     +-----------------+-----------------+
                                                       |
                                                       v
                                     +-----------------------------------+
                                     | Supporter Session / Donor Portal  |
                                     +-----------------------------------+
```

---

## 3. PROGRESSIVE 4-SCREEN DONOR EXPERIENCE DESIGN

The interaction experience draws directly from the provided four-stage progressive pattern, adapted strictly into MECT's institutional terracotta, neutral cream, and forest design language:

### Screen 1: Donor Identity
- **Heading:** "Welcome to Mahaveer Trust"
- **Subheading:** "Sign in securely to continue your contribution and manage your donations."
- **Inputs:**
  - Full Name (required for new registrations; prefilled or skipped for authenticated donors).
  - Primary Action Button: "Continue with Mobile Number" (triggers transition to Screen 2/3).
  - Alternative Action Button: "Continue with Google" (with official Google emblem).
- **Privacy Reassurance:** Clear institutional badge affirming DPDP compliance and zero third-party marketing.

### Screen 2: Location / City
- **Heading:** "Where Are You Contributing From?"
- **Subheading:** "Helping the Trust map regional educational and social impact across Odisha and India."
- **Inputs:**
  - City input (with quick suggestion chips: Balangir, Bhubaneswar, Cuttack, Sambalpur, Rourkela, Other).
  - State & Country (defaults to Odisha, India).
  - Secondary Action: "Skip for now" (allows proceeding without blocking).
  - Primary Action: "Continue".

### Screen 3: Mobile Number
- **Heading:** "Verify Your Mobile Number"
- **Subheading:** "We will send a one-time verification passcode to this number."
- **Inputs:**
  - International country code selector (defaults to India `+91`, editable).
  - 10-digit mobile number input with clear formatting and instant E.164 normalization.
  - Terms & Privacy notice with clickable links and policy version tracking.
  - Unchecked communication consent controls for WhatsApp updates (never pre-ticked or forced).
  - Action: "Get OTP" with loading state and error feedback.

### Screen 4: OTP Verification
- **Heading:** "Enter the OTP You Received"
- **Subheading:** "Passcode sent to +91 ******3210 (Masked display)".
- **Inputs:**
  - 6-digit individual numeric cell input with automatic focus progression, backspace handling, and paste support.
  - Resend countdown timer (e.g., `00:58`) with temporary disablement of the resend control.
  - Actions: "Verify & Continue", "Resend Code", and "Change Number" (returns to Screen 3).

---

## 4. BACKEND INTEGRATION & SECURITY SPECIFICATION

### 4.1. Mobile OTP Authentication (`OtpAuthService.java`)
- **Random Generation:** Cryptographically secure `java.security.SecureRandom` generates a 6-digit numeric string.
- **Hashing:** OTP stored in PostgreSQL as `SHA-256(pepper + purpose + target + otp)`. The plaintext OTP is **never** logged, never returned in API payloads, and never persisted.
- **Expiry:** Configured to 300 seconds (5 minutes).
- **Attempt Lockout:** Maximum 5 failed verification attempts before the challenge is permanently invalidated.
- **Throttling:** 60-second resend cooldown; maximum 5 OTP requests per 15-minute sliding window per recipient/IP.

### 4.2. Google OpenID Connect (OIDC) Verification (`GoogleOidcService.java`)
- **Endpoint:** `POST /portal/auth/google` accepting payload `{ "idToken": "eyJhbGci..." }`.
- **Validation Checklist:**
  1. Signature verification against Google public certs (`https://www.googleapis.com/oauth2/v3/certs`).
  2. Issuer verification: `https://accounts.google.com` or `accounts.google.com`.
  3. Audience check: Matches configured `app.google.client-id`.
  4. Expiry verification: `exp > now()`.
  5. Email verification: `email_verified == true`.
- **Security Scopes:** Restricted to `openid`, `email`, and `profile`. No Gmail access or broad permissions requested.

### 4.3. Database Schema Extension (`V20__google_oidc_and_donor_identity_linking.sql`)
```sql
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(100);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_email VARCHAR(255);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) DEFAULT 'OTP';

CREATE UNIQUE INDEX IF NOT EXISTS idx_portal_users_google_sub ON portal_users(google_sub);
CREATE INDEX IF NOT EXISTS idx_portal_users_google_email ON portal_users(google_email);
```

---

## 5. DONATION JOURNEY INTEGRATION SPECIFICATION

In `DonationJourney.tsx`, Step 2 ("Donor Verification") will seamlessly integrate the new progressive donor authentication:
1. **Unauthenticated Donors:** Presented with the streamlined 4-screen flow inline or via high-converting progressive modal, preserving selected programme (`GENERAL`, `EDUCATION`, etc.) and amount (`₹1,000`, etc.).
2. **Authenticated Donors:** Instantly recognized, displaying a verified badge ("Signed in as Sri Ramesh Kumar (+91 ******3210)") and advancing directly to details/review.
3. **Session Interruption Recovery:** If a donor navigates back or refreshes, the selected programme and donation amount are preserved in React state and URL query parameters without storing authentication tokens in URLs.

---

## 6. DUPLICATE ELIMINATION PLAN

| Redundant / Fragmented Item | Canonical Replacement | Action Planned |
|---|---|---|
| `src/app/register/page.tsx` (788 lines) | `src/app/login/page.tsx` (Progressive Auth) | Replaced with forward-compatible wrapper / redirect to canonical progressive login |
| `src/app/portal/login/page.tsx` (30 lines) | `src/app/login/page.tsx` | Permanent 308 redirect |
| `DonationJourney.tsx` Step 2 Mock Passcode | Canonical `requestPortalOtp` & `verifyPortalOtp` | Replaced with real canonical auth integration |
