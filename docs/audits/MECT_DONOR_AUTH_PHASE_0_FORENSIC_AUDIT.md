# MECT — PREMIUM DONOR AUTHENTICATION, OTP LOGIN & GOOGLE SIGN-IN
## PHASE 0: READ-ONLY FORENSIC AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Website:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Current Baseline Commit:** `2d60ea6`  
**Auditor:** Principal Enterprise Architect, Security Specialist & Full-Stack Lead  
**Audit Date:** November 26, 2026  
**Status:** PHASE 0 FORENSIC AUDIT COMPLETE — ZERO APPLICATION MUTATIONS  
**Operating Boundary:** Read-Only Analysis under Strict Production Freeze  

---

## 1. EXECUTIVE SUMMARY

This forensic audit evaluates the existing donor authentication and identity infrastructure across the Mahaveer Educational & Charitable Trust (MECT) web application and backend. 

### Key Findings
1. **Existing Backend Foundation:** MECT already possesses a robust Spring Data JPA and PostgreSQL foundation for public portal users (`portal_users`, `portal_user_profiles`, `portal_verified_contacts`, `otp_verifications`, `portal_refresh_tokens`, `donor_messaging_preferences`).
2. **Current Authentication Mechanism:** The backend currently supports Email and SMS OTP authentication via `OtpAuthService.java` and `PortalAuthController.java`. OTPs are securely hashed (SHA-256 + pepper) and rate-limited.
3. **Absence of Google Sign-In:** There is currently **zero** Google OAuth 2.0 / OpenID Connect (OIDC) implementation in either the backend or frontend.
4. **Frontend Duplication & Fragmentation:**
   - `/login` (579 lines) implements Phone/Email OTP login.
   - `/register` (788 lines) implements a heavyweight registration form requiring legal name, email, phone, physical address, city, district, state, pin code, and PAN upfront before OTP dispatch.
   - `/portal/login` is merely a redirect wrapper pointing to `/login`.
   - `/donate` (Step 2 of `DonationJourney.tsx`) implements an isolated, ad-hoc inline authentication step with hardcoded mock passcode fallback (`123456`, `dev-test-token`).
5. **No Destructive Operations Required:** The database schema and entities can be cleanly extended with Google OIDC identity mapping (`google_sub`, `google_email`) and progressive profile capture without deleting or breaking existing donor records.

---

## 2. ROUTE & FRONTEND COMPONENT INVENTORY

### 2.1. Route Inventory
| Route Path | Source File | Purpose | Active Navigation Link | Current State / Role |
|---|---|---|---|---|
| `/login` | `src/app/login/page.tsx` (579 lines) | Donor OTP Login (Phone or Email) | Header "Sign In", Footer "Donor Login" | **Active Primary Flow** |
| `/register` | `src/app/register/page.tsx` (788 lines) | Donor Registration Form (Address + OTP) | Header "Register", Footer "Register" | **Heavyweight Duplicate Flow** |
| `/portal/login` | `src/app/portal/login/page.tsx` (30 lines) | Legacy redirect wrapper | None | **Redundant Redirect** (`-> /login`) |
| `/portal/welcome` | `src/app/portal/welcome/page.tsx` (229 lines) | Post-verification welcome & next steps | Linked after `/register` | **Legitimate Post-Auth Screen** |
| `/portal/dashboard` | `src/app/portal/dashboard/page.tsx` | Supporter summary, quick stats | Header account menu | **Legitimate Supporter Feature** |
| `/portal/donations` | `src/app/portal/donations/page.tsx` | Supporter donation ledger | Portal navigation | **Legitimate Supporter Feature** |
| `/portal/receipts` | `src/app/portal/receipts/page.tsx` | 80G receipt downloads | Portal navigation | **Legitimate Supporter Feature** |
| `/portal/profile` | `src/app/portal/profile/page.tsx` | Supporter profile & address editor | Portal navigation | **Legitimate Supporter Feature** |
| `/portal/security` | `src/app/portal/security/page.tsx` | Contact verification & deletion request | Portal navigation | **Legitimate Supporter Feature** |
| `/donate` (Step 2) | `src/components/donation/DonationJourney.tsx` | Inline Step 2 donor verification | Header "Donate Now" | **Fragmented Ad-Hoc Auth Logic** |
| `/admin/login` | `src/app/admin/login/page.tsx` | Admin username/password login | Internal admin portal | **Separate Admin Auth (Untouched)** |

### 2.2. Frontend Context & API Client
- **`src/context/PortalAuthContext.tsx`:** Manages client session, JWT access token in memory, refresh token in `localStorage` (`mt_portal_refresh_token`), and dashboard loading.
- **`src/lib/portal-api.ts`:**
  - `requestPortalOtp({ channel, target, purpose })`
  - `verifyPortalOtp({ channel, target, otpCode, purpose })`
  - `refreshPortalToken(refreshToken)`
  - `logoutPortal(accessToken)`
  - `fetchPortalDashboard(accessToken)`
  - `updatePortalProfile(accessToken, payload)`

---

## 3. BACKEND API & CONTROLLER INVENTORY

### 3.1. Public Portal Endpoints (`PortalAuthController.java` & `PortalAccountController.java`)
| Method | Endpoint | Authorization | Service Handler | Functionality |
|---|---|---|---|---|
| `POST` | `/portal/auth/request-otp` | `permitAll()` | `OtpAuthService.requestOtp` | Sends 6-digit OTP via Email (Resend) or SMS |
| `POST` | `/portal/auth/verify-otp` | `permitAll()` | `OtpAuthService.verifyOtpAndLogin` | Validates OTP hash, locates/creates `PortalUser`, returns JWT & Refresh token |
| `POST` | `/portal/auth/refresh` | `permitAll()` | `OtpAuthService.refreshPortalToken` | Rotates refresh token and returns new JWT access token |
| `POST` | `/portal/auth/logout` | `authenticated()` | `OtpAuthService.logoutPortalUser` | Revokes stored refresh token in `portal_refresh_tokens` |
| `GET` | `/portal/auth/me` | `authenticated()` | `PortalAccountService.getDashboardAndAccount` | Returns full supporter account & donation stats |
| `GET` | `/portal/me/dashboard` | `ROLE_GENERAL_USER`, `ROLE_DONOR` | `PortalAccountService.getDashboardAndAccount` | Returns portal dashboard payload |
| `PUT` | `/portal/me/profile` | `ROLE_GENERAL_USER`, `ROLE_DONOR` | `PortalAccountService.completeOrUpdateProfile` | Updates name, address, city, district, state, pin, PAN |
| `POST` | `/portal/me/contacts/verify-change` | `ROLE_GENERAL_USER`, `ROLE_DONOR` | `OtpAuthService.verifyContactChange` | Verifies new email or mobile number |
| `PUT` | `/portal/me/preferences` | `ROLE_GENERAL_USER`, `ROLE_DONOR` | `PortalAccountService.updatePreferencesAndConsent`| Updates WhatsApp, SMS, and email preferences |
| `POST` | `/portal/me/deletion-request` | `ROLE_GENERAL_USER`, `ROLE_DONOR` | `PortalAccountService.requestDeletionOrCorrection`| Records GDPR/DPDP deletion or correction request |

### 3.2. Administrative Auth (Completely Segregated)
- **`AuthController.java` (`/auth/login`, `/auth/refresh`, `/auth/logout`):** Handles `AdminUser` username/password credentials. Completely segregated from portal donor auth by Spring Security RBAC.

---

## 4. DATABASE SCHEMA & ENTITY INVENTORY

The existing schema is governed by Flyway migrations (`V7__portal_users_and_otp_schema.sql`, `V8`, `V16`, `V18`):

### 4.1. Core Tables
1. **`portal_users`:**
   - `id` (BIGSERIAL PK)
   - `user_uuid` (VARCHAR(36) UNIQUE)
   - `primary_email` (VARCHAR(255) UNIQUE)
   - `primary_phone` (VARCHAR(30) UNIQUE)
   - `status` (VARCHAR(30), default 'ACTIVE')
   - `profile_completed` (BOOLEAN, default FALSE)
   - `deletion_requested` (BOOLEAN)
   - `version` (BIGINT optimistic lock)
   - `created_at`, `updated_at`
2. **`portal_user_roles`:**
   - `portal_user_id` (FK to `portal_users`)
   - `role_name` (`ROLE_GENERAL_USER`, `ROLE_DONOR`)
3. **`portal_user_profiles`:**
   - `portal_user_id` (FK UNIQUE to `portal_users`)
   - `full_name`, `address_line`, `city`, `district`, `state`, `pin_code`, `country`
   - `pan_optional`, `date_of_birth`, `avatar_url`, `preferred_language`
4. **`portal_verified_contacts`:**
   - `portal_user_id` (FK to `portal_users`)
   - `contact_type` (`EMAIL`, `PHONE`)
   - `contact_value` (VARCHAR(255))
   - `is_primary` (BOOLEAN)
   - `verified_at` (TIMESTAMP)
   - UNIQUE constraint on `(contact_type, contact_value)`
5. **`otp_verifications`:**
   - `id`, `purpose` (`LOGIN`, `CONTACT_CHANGE`)
   - `channel` (`EMAIL`, `PHONE`)
   - `target_value` (Normalized email or E.164 phone)
   - `portal_user_id` (FK nullable)
   - `otp_hash` (VARCHAR(255) — SHA-256 with pepper)
   - `attempts` (INT, default 0), `max_attempts` (INT, default 5)
   - `expires_at`, `resend_available_at`, `used_at`, `request_ip`
6. **`portal_refresh_tokens`:**
   - `portal_user_id` (FK to `portal_users`)
   - `token_hash` (VARCHAR(255) UNIQUE)
   - `expires_at`, `revoked`
7. **`donor_messaging_preferences`:**
   - `donor_phone` (VARCHAR(30) UNIQUE)
   - `portal_user_id` (FK nullable)
   - `whatsapp_consent` (BOOLEAN), `sms_consent` (BOOLEAN)
   - `opt_out_timestamp`, `consent_source`

---

## 5. DUPLICATE IMPLEMENTATION & GAP ANALYSIS

### 5.1. Duplicate Implementations Identified
1. **`/login` vs `/register`:**
   - Both pages require phone/email verification and duplicate OTP entry logic.
   - `/register` prematurely demands a full address (street, city, district, state, pin code) and PAN upfront, creating significant friction.
   - `/login` allows seamless OTP entry but lacks Google sign-in and progressive city/profile collection.
2. **`/portal/login`:**
   - A 30-line component that only performs a client-side redirect to `/login`. Can be handled via Next.js config or lightweight canonical alias.
3. **Step 2 in `/donate` (`DonationJourney.tsx`):**
   - Implements a third copy of OTP dispatch and verification.
   - Contains fallback mock tokens (`123456`, `dev-test-token`, `usr-guest-test-01`) instead of invoking the canonical authentication flow.

### 5.2. Functional & Security Gaps
1. **Missing Google Sign-In:** Neither Google button, OAuth callback, nor Google ID token verification exists.
2. **Missing Progressive Journey:** Existing forms are monolithic instead of progressive (Identity -> Location -> Mobile -> OTP).
3. **Missing International Phone Selector:** Current inputs assume raw 10-digit Indian numbers without an explicit international prefix UI (+91 default).
4. **Missing OTP Input UX:** Existing OTP input is a plain text box instead of a 6-digit individual cell component with automatic focus progression, backspace navigation, and paste support.
5. **Account Linking Architecture:** Need an explicit, secure account linking mechanism to associate a Google account with an existing phone-verified donor account without creating duplicate records or overwriting donation history.

---

## 6. PROPOSED CONSOLIDATION ARCHITECTURE

### 6.1. Logical Architecture
```
                                +--------------------------------------------+
                                |  Progressive Donor Auth UI (MECT Design)   |
                                |  (Desktop 2-Column / Mobile Single Column) |
                                +---------------------+----------------------+
                                                      |
                         +----------------------------+----------------------------+
                         |                                                         |
                         v [Method A: Mobile OTP]                                  v [Method B: Google OIDC]
        +-----------------------------------+                     +-----------------------------------+
        | Screen 1: Donor Identity          |                     | Google Identity Services Button   |
        | Screen 2: Location / City         |                     | Popup / Redirect OIDC Flow        |
        | Screen 3: Mobile Phone Number     |                     +-----------------+-----------------+
        | Screen 4: 6-Digit OTP Cells       |                                       |
        +----------------+------------------+                                       | Google ID Token
                         |                                                          v
                         | Mobile + OTP Code                      +-----------------------------------+
                         v                                        | POST /portal/auth/google          |
        +-----------------------------------+                     +-----------------+-----------------+
        | POST /portal/auth/verify-otp      |                                       |
        +----------------+------------------+                                       |
                         |                                                          |
                         +----------------------------+-----------------------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |    Canonical Donor Identity Svc   |
                                    |     (OtpAuthService + Oidc)       |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    | Canonical PortalUser Record       |
                                    | (Preserves donations & history)   |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    | JWT Access + Secure Refresh Token |
                                    +-----------------------------------+
```

### 6.2. Route Consolidation Strategy
- **Canonical Route:** `/login` will host the new 4-screen progressive donor authentication experience.
- **`/register`:** Will render the progressive experience with registration intent (or redirect seamlessly to `/login?mode=register` while preserving query parameters `next`, `amount`, `programme`).
- **`/portal/login`:** Permanent 308 redirect to `/login`.
- **Donation Journey Step 2:** Replaces ad-hoc passcode mock with the canonical donor authentication component, preserving donation context (`programmeCode`, `amount`, `currency`).

---

## 7. PHASE 0 CONCLUSION & SIGN-OFF

The repository has been thoroughly analyzed. The backend architecture is sound and ready for extension with Google OIDC and progressive identity resolution. The frontend duplication can be consolidated into a single, cohesive, accessible experience matching the progressive interaction reference.

Zero files were modified during Phase 0.
Ready for Phase 1: Identity & Authentication Architecture Design.
