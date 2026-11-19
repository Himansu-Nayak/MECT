# MECT PHASE 28 — BASELINE AUDIT & DONATION ARCHITECTURE MAPPING (PHASE 28.0)

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Registered Trust Deed:** Doc No. 40311302194 (Sub-Registrar Balangir, 2013)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**GitHub Repository:** [https://github.com/Himansu-Nayak/MECT](https://github.com/Himansu-Nayak/MECT)  
**Baseline Git Commit:** `85bfe1a` (Phase 27.1 — Final Excellence Audit)  
**Working Branch:** `feat/phase-28-premium-donor-auth-experience`  
**Execution Phase:** Phase 28.0 — Baseline Audit and Architecture Mapping  
**Deployment Policy:** **STRICT PRODUCTION DEPLOYMENT FREEZE ENFORCED**  

---

## 1. Executive Summary & Audit Mandate

Phase 28 establishes an institutional-grade, authenticated donation ecosystem for MECT. The fundamental objective is to eliminate unauthenticated guest donations while preserving open public exploration of charitable programmes. Every donor must authenticate via verified mobile OTP before initiating or completing a financial transaction.

This document records the architectural baseline of the existing donation, authentication, and payment infrastructure across both the Spring Boot backend (`mahavir-backend 0.1.0-SNAPSHOT`) and the Next.js frontend (`mect@0.1.0`).

---

## 2. Existing Architecture Mapping

### 2.1 Backend Architecture (Spring Boot & PostgreSQL / Flyway)

The backend provides a mature, enterprise-grade architecture with existing support for portal users, OTP generation, role-based access control, multiple payment gateways, and receipt generation:

| Layer / Service | File Path | Current Status & Audit Observations |
|---|---|---|
| **Security Configuration** | `backend/src/main/java/org/mahavirtrust/backend/config/SecurityConfig.java` | Configures stateless JWT authentication, rate limiting filter, CORS, CSP, and route matching. Currently permits `/public/**` and `/portal/auth/**`. |
| **Donation Controller** | `backend/src/main/java/org/mahavirtrust/backend/controller/DonationController.java` | Mapped to `/public/donations`. Currently allows unauthenticated callers to execute `POST /initiate`, `POST /verify-checkout`, and `POST /sbi/submit-utr` with `portalUserId = null`. |
| **Donation Lifecycle Service** | `backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java` | Handles gateway resolution (Cashfree / Razorpay / SBI direct), donation reference generation, order creation, payment events, receipt PDF generation, and manual SBI UTR claims. |
| **Portal Auth Controller** | `backend/src/main/java/org/mahavirtrust/backend/controller/PortalAuthController.java` | Mapped to `/portal/auth`. Implements `POST /request-otp`, `POST /verify-otp`, `POST /refresh`, `POST /logout`, and `GET /me`. |
| **OTP Auth Service** | `backend/src/main/java/org/mahavirtrust/backend/service/portal/OtpAuthService.java` | Implements 6-digit cryptographic OTP generation via `SecureRandom`, SHA-256 peppered hashing, resend cooldown (60s), expiry (600s), rate-limiting (max 5 requests/15m), and auto-registration of new users with `ROLE_GENERAL_USER`. |
| **SMS Notification Service** | `backend/src/main/java/org/mahavirtrust/backend/service/notification/ConfigurableSmsService.java` | Supports `TWILIO` and `MSG91` external SMS gateways. Currently returns `unconfigured` when `SMS_PROVIDER=NONE`. |
| **Portal Account Service** | `backend/src/main/java/org/mahavirtrust/backend/service/portal/PortalAccountService.java` | Computes donor dashboard figures from verified database records (`sumSuccessfulAmountByUserId`, `countSuccessfulByUserId`), lists donation history, and handles profile updates. |
| **Flyway Migrations** | `backend/src/main/resources/db/migration/` | Active migrations up to `V15`. `V7` defines `portal_users`, `portal_user_profiles`, `otp_verifications`, and `portal_refresh_tokens`. `V8` defines `donations`, `payments`, `payment_events`, `donation_receipts`. `V10` adds Cashfree schema. `V14` seeds `HANUMAN_MURTI`. |

### 2.2 Frontend Architecture (Next.js 16 & React 19)

| Component / Page | File Path | Current Status & Audit Observations |
|---|---|---|
| **Donation Page** | `src/app/donate/page.tsx` | Wraps `UnifiedDonationExperience` inside `PortalAuthProvider` and provides statutory disclaimers and tax policy notes. |
| **Unified Donation Experience** | `src/components/sections/UnifiedDonationExperience.tsx` | 5-step stepper (Programme, Amount, Donor Info, Review, Payment). Previously supported guest checkout without authentication. Prefilled account details only if user happened to be logged in. |
| **Portal Auth Context** | `src/context/PortalAuthContext.tsx` | React context managing session, token, dashboard, `isAuthenticated`, `setSessionFromOtp`, `refreshDashboard`, and `logout`. |
| **Portal API Client** | `src/lib/portal-api.ts` | Fully typed client for OTP dispatch, verification, portal dashboard retrieval, profile updates, Cashfree payment initiation, verification, and manual SBI claim submission. |
| **Donor Dashboard** | `src/app/portal/dashboard/page.tsx` | Displays donor welcome, summary cards, filterable donation history, and receipt PDF downloads. |
| **Portal Login** | `src/app/portal/login/page.tsx` | Dedicated OTP login page supporting email and mobile OTP. |

---

## 3. Gap Analysis: What Must Change for Phase 28

1. **Mandatory Server-Side Authentication Enforcement:**
   - `POST /public/donations/initiate`, `POST /public/donations/verify-checkout`, and `POST /public/donations/sbi/submit-utr` must be guarded. If caller lacks an authenticated portal JWT session (`portalUserId == null`), backend must return `401 Unauthorized` with a clear message: `"Donor authentication required: You must verify your mobile number via OTP before initiating or completing a donation."`
   - Public endpoints `GET /public/donations/config`, `GET /public/donations/programmes`, `GET /public/donations/gateway-status`, and `GET /public/donations/{ref}/status` remain open for transparent exploration.

2. **Mobile OTP as the Primary Authentication Channel:**
   - In the donation sequence, the authentication step must center on Mobile OTP (`channel: "PHONE"`).
   - Phone normalization must support standard 10-digit Indian numbers (`9853608113` -> `+919853608113`) as well as international E.164 formats.
   - For local development and test environments, `ConfigurableSmsService` should support `DEV_LOG` / `CONSOLE` provider so that automated testing can verify end-to-end flows without incurring live telephony fees.

3. **Donor Registration Profile & District Support:**
   - `portal_user_profiles` table in `V7` lacks a dedicated `district` column. In India/Odisha civic administration, district (e.g. Balangir, Subarnapur, Bargarh) is an essential geographical jurisdiction.
   - We will introduce `V16__donor_authentication_and_district_schema.sql` adding `district VARCHAR(100)` to `portal_user_profiles`.
   - Update `PortalUserProfile.java`, `UpdatePortalProfileRequest.java`, and profile endpoints accordingly.

4. **Modernization of Donation Programme Cards:**
   - Existing cards on `/donate` use simple border boxes.
   - Cards must be transformed into premium Documentary Editorial components: high-resolution photography, Alabaster/Carbon palette, Terracotta accents, Lora typography, verified impact statistics, suggested contribution buttons, and clear CTAs.

5. **Integrated 6-Step Authenticated Donation Journey:**
   - Re-architect `/donate` into a guided 6-step journey:
     - **Step 1: Explore Programmes** (Modernized cards)
     - **Step 2: Select Contribution** (Preset amounts, custom amount, frequency)
     - **Step 3: Donor Authentication** (Mobile OTP modal/view: mobile input, 6-digit OTP boxes, timer, auto-login for existing / auto-register for new donors; auto-advances if already logged in)
     - **Step 4: Donor Profile & Tax Info** (Name, verified phone, email, address, state, district, PIN, optional PAN with format check for 80G tax receipt)
     - **Step 5: Review & Statutory Disclosures** (Summary, 80G tax note, trust registration, statutory declarations & consent)
     - **Step 6: Secure Payment & Receipt** (Cashfree modal / Razorpay / SBI direct NEFT/RTGS/UPI fallback, instant receipt download & permanent access in `/portal/dashboard`)

---

## 4. Phased Master Implementation Plan

- **Phase 28.0 — Baseline Audit and Architecture Mapping** (Completed in this document)
- **Phase 28.1 — Donor Authentication Architecture and OTP Provider Integration**
- **Phase 28.2 — Secure Backend Authentication and Donor Profile**
- **Phase 28.3 — Premium Donation Card Design Transformation**
- **Phase 28.4 — Authenticated Donation Journey**
- **Phase 28.5 — Donor Dashboard and Donation History**
- **Phase 28.6 — Payment Gateway and Manual Transfer Regression**
- **Phase 28.7 — Administrative Donor Management**
- **Phase 28.8 — Accessibility, Performance and Security Audit**
- **Phase 28.9 — Full Visual Regression and Final Acceptance**

---

*Baseline audit certified on 19 November 2026 for Mahaveer Educational & Charitable Trust.*
