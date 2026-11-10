# MECT — Donor & User Portal, OTP Authentication, Smart Donations & Omnichannel Notification Architecture

**Audit & Architecture Date:** 2026-11-10
**Repository Base:** `feat/multi-sector-ngo-repositioning`
**Backend Stack:** Spring Boot `4.1.1` (Java `21`), PostgreSQL `18.6`, Flyway (`V1`–`V6` existing -> `V7`–`V9` new)
**Frontend Stack:** Next.js `16.4.3` (App Router), React `19.3`, TypeScript `5.7`, Tailwind CSS `v4`

---

## 1. Phase 1 Existing Infrastructure Audit

### Reusable Components Confirmed in Existing Repository
1. **Staff RBAC & Security Core:** `AdminUser`, `Role`, `AccountStatus`, `RefreshToken`, `AuditLog`, `AuditLogService`, `JwtTokenProvider`, `JwtAuthenticationFilter`, `RateLimitingFilter`, `SecurityConfig` (`BCryptPasswordEncoder(12)`, stateless JWT).
2. **Institutional Config & Legal Boundaries (`src/lib/config.ts`):** Official Balangir & Bhubaneswar addresses, Trust Deed `40311302194`, PAN `AADTM5474F`, CSR-1 `CSR00081063`, SBI account `33341302498` (`SBIN0001701`), and explicit Section 80G temporal boundary (records verified for FY 2023-24–FY 2025-26 under URN `AADTM5474FF20241`; current FY 2026-27 receipt confirmations must not claim unverified 80G tax-exemption status).
3. **Existing Donations & Programmes UI:** `SbiDonationSection.tsx`, `src/app/donate/page.tsx`, `HOMEPAGE_CONTENT.pillars` (*Education & Learning*, *Women Empowerment & Livelihoods*, *Safe Water & Sanitation*, *Food Security & Nutrition*, *Community Welfare*).
4. **Verified DNS (`mect.org.in`):** Resend DKIM (`resend._domainkey.mect.org.in`) and SPF (`send.mect.org.in`) are already published in DNS.

### Gaps Identified Requiring Full-Stack Implementation
1. **No Public Portal Identity Layer:** `admin_users` strictly represents internal trustees and staff (`ROLE_SUPER_ADMIN`, `ROLE_TRUSTEE`, `ROLE_ADMIN`, `ROLE_FINANCE_OFFICER`, etc.). Public users (`ROLE_GENERAL_USER`, `ROLE_DONOR`) need dedicated, cleanly isolated tables (`portal_users`, `portal_user_roles`, `portal_user_profiles`, `portal_verified_contacts`, `otp_verifications`, `portal_refresh_tokens`) and a dedicated `PORTAL` token namespace so portal credentials can never escalate to `/admin/**`.
2. **No Passwordless Email/Phone OTP Subsystem:** No `OtpService`, `SmsProvider` boundary, or Resend OTP mailer exists yet.
3. **No Financial Donation Ledger or Payment Gateway Integration:** Existing `/donate` only displays SBI bank details and opens an inquiry claim form. No `donations`, `payments`, `payment_events`, `payment_reconciliation_logs`, `donation_programmes`, or dynamic UPI QR gateway client exists yet.
4. **No Automated PDF Receipt Generation:** `pom.xml` lacked a PDF library (`com.github.librepdf:openpdf`) and receipt storage/download endpoints.
5. **No Transactional Outbox / Resend / WhatsApp Cloud Orchestration:** No email outbox worker, webhook signature verification, or explicit optional `communication_consents` ledger exists.

---

## 2. Target System Architecture

```
Next.js App Router Frontend (mect.org.in)
 ├── /portal/login       (Email / Phone OTP passwordless flow)
 ├── /portal/profile     (Profile completion, contact verification, notification & WhatsApp consent)
 ├── /portal/dashboard   (Personalised greeting, verified stats, donation history, PDF receipts)
 ├── /donate             (Unified Smart Checkout: programme, custom amount, anonymous option, Dynamic UPI QR + SBI fallback)
 └── /admin/donors       (Donor directory, donation reconciliation, receipt register, campaign & outbox management)
         │ HTTPS / Bearer JWT (Separate PORTAL vs ADMIN tokenType claims)
         ▼
Spring Boot 4 API (/api/v1)
 ├── PortalAuthController (/portal/auth/*)  ──► OtpAuthService (SHA-256 OTP hash, 60s cooldown, 5 max attempts, anti-enumeration)
 ├── PortalAccountController (/portal/me/*) ──► Profile, Contact Change Verification, Consent & Deletion Request
 ├── DonationController (/public/donations/*, /portal/donations/*, /portal/receipts/*)
 │       │
 │       ▼ (PaymentGatewayProvider SPI: Razorpay Orders & Dynamic UPI QR / Test Sandbox Profile)
 ├── WebhookController (/webhooks/payments/razorpay, /webhooks/resend, /webhooks/whatsapp)
 │       │ [Verified HMAC-SHA256 Signature + Idempotent payment_events]
 │       ▼
 ├── DonationLifecycleOrchestrator (Transactional DB Commit -> Outbox Pattern)
 │       ├── Deterministic Receipt Number + OpenPDF Binary Generation (donation_receipts)
 │       ├── NotificationOutbox Worker (@Scheduled retries, exponential backoff)
 │       │       ├── ResendEmailProvider (https://api.resend.com/emails + PDF attachment)
 │       │       └── MetaWhatsAppCloudProvider (Optional Opt-In Consent + Template Check)
 └── AdminDonorController (/admin/donors/*, /admin/donations/*)
```

---

## 3. Core Architectural Invariants & Provider Safety Boundaries

1. **Zero Secret Leakage:** All provider credentials (`RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMS_PROVIDER`, `TWILIO_*` / `MSG91_*`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_APP_SECRET`) are loaded exclusively via environment variables (`application.yml` defaults empty/disabled). Previously shared keys are never reused or embedded anywhere in code or configuration.
2. **Fail-Closed Payment Verification:** Dynamic UPI QR / gateway checkouts remain `CREATED` / `PENDING` until an authenticated server-side webhook (or verified Razorpay payment fetch signature) confirms capture inside a locked transaction. Client clicks or redirects never mark a donation `SUCCESSFUL`.
3. **Resend vs. SMS Separation:** Resend handles transactional HTML emails & PDF receipts; Phone OTP strictly uses an extensible `SmsProvider` boundary (`TWILIO` | `MSG91` | `NONE`), failing closed with an explicit `PROVIDER_UNCONFIGURED` status when SMS credentials are absent rather than faking SMS delivery.
4. **Honest WhatsApp & Statutory Boundaries:** WhatsApp notifications fire only if explicit, timestamped opt-in consent (`communication_consents`) exists **and** `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` + approved template names are configured; receipts cite factual registered Trust credentials (`40311302194`, PAN `AADTM5474F`) without fabricating current-year 80G tax-exemption eligibility.

