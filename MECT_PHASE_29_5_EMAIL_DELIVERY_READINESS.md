# MECT PHASE 29.5 — EMAIL DELIVERY READINESS
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Overall Status:** CODE IMPLEMENTATION READY / OPERATIONAL GATE: AWAITING PRODUCTION RESEND_API_KEY CONFIGURATION

---

## 1. Provider & Integration Overview

MECT utilizes [Resend](https://resend.com) as the primary institutional email provider for transactional notifications, cryptographic donor receipts, and OTP verification codes.

The backend implementation resides in:
- [ResendEmailService.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java)
- [EmailTemplateRenderer.java](file:///<WORKSPACE_DIR>/backend/src/main/java/org/mahavirtrust/backend/service/notification/EmailTemplateRenderer.java)

---

## 2. Environment Configuration

The following environment variables configure the production email pipeline (variable names only; secret values are omitted):

| Environment Variable Name | Default / Production Value Pattern | Purpose | Required in Production |
| :--- | :--- | :--- | :---: |
| `RESEND_API_KEY` | `re_************************` | Production bearer token for Resend HTTP REST API | **YES (MANDATORY)** |
| `RESEND_BASE_URL` | `https://api.resend.com` | Base URL for Resend API endpoints | No (Default is valid) |
| `RESEND_FROM_NOTIFICATIONS` | `MECT Notifications <notifications@mect.org.in>` | From header for OTP and account security emails | **YES** |
| `RESEND_FROM_DONATIONS` | `MECT Donations <donations@mect.org.in>` | From header for 80G tax receipt PDF emails | **YES** |
| `RESEND_WEBHOOK_SECRET` | `whsec_************************` | Svix HMAC secret for inbound delivery webhooks | Recommended |
| `APP_PUBLIC_BASE_URL` | `https://mect.org.in` | Canonical public origin for email links and assets | **YES** |

---

## 3. DNS Domain Verification & Authentication Architecture

To ensure high inbox placement and prevent spoofing or phishing, the `mect.org.in` domain requires verified DNS records:

```
+-------------------------------------------------------------------------------+
|                       DNS TRUST & DELIVERABILITY ARCHITECTURE                 |
+-------------------------------------------------------------------------------+
| 1. SPF (Sender Policy Framework)                                              |
|    Host:  @ (or mect.org.in)                                                  |
|    Type:  TXT                                                                 |
|    Value: "v=spf1 include:resend.com ~all"                                    |
|                                                                               |
| 2. DKIM (DomainKeys Identified Mail)                                          |
|    Host:  resend._domainkey.mect.org.in                                       |
|    Type:  TXT (or CNAME as assigned by Resend dashboard)                      |
|    Value: Public key cryptographic signature verification                      |
|                                                                               |
| 3. DMARC (Domain-based Message Authentication, Reporting, and Conformance)    |
|    Host:  _dmarc.mect.org.in                                                  |
|    Type:  TXT                                                                 |
|    Value: "v=DMARC1; p=none; rua=mailto:notifications@mect.org.in; sp=none;"   |
|                                                                               |
| 4. Custom Return-Path / Mail-From (MX)                                        |
|    Host:  notifications.mect.org.in                                          |
|    Type:  MX                                                                  |
|    Value: feedback-smtp.resend.com (Priority 10)                              |
+-------------------------------------------------------------------------------+
```

---

## 4. Timeout, Retry & Error Handling Behavior

1. **Client Factory:** `ResendEmailService` uses `SimpleClientHttpRequestFactory` configured with:
   - **Connection Timeout:** 5 seconds
   - **Read Timeout:** 10 seconds
   This avoids blocking threads during upstream network latency or transient provider outages.
2. **Graceful Degradation:**
   - If `RESEND_API_KEY` is not present or blank, `isConfigured()` returns `false`.
   - `OtpAuthService` intercepts this and throws `ProviderUnconfiguredException("RESEND", "Email service is temporarily unavailable. Please try again shortly.")`.
   - The user is notified cleanly without exposing stack traces or internal infrastructure details.
3. **Delivery Failures:**
   - If Resend returns non-200 responses (e.g. 403 Forbidden, 422 Unprocessable, 429 Rate Limited), the service logs a sanitized error code and throws `ProviderDispatchException`.
   - Failed email dispatches are also captured in the asynchronous notification outbox (`notification_outbox` table) for transparent administrative auditing and automated retry.

---

## 5. Email Template & Content Audit

Inspection of `EmailTemplateRenderer.java` (`renderOtpEmail`):
- **Branding:** Official Mahaveer Trust emblem, heritage palette (`#1E3A2F` Forest, `#C05621` Terracotta, `#FAF7F2` Background).
- **Security Notice:** Explicitly warns the user: *"Never share this code with anyone. MECT trustees, staff, or representatives will never ask you for this verification code."*
- **Clear Expiry:** Accurately states: *"This code will expire in 10 minutes."*
- **Zero Leakage:** No OTP codes are embedded in links, query parameters, tracking beacons, or redirects.
- **Fiduciary Credentials:** Bottom footer contains Trust PAN (`AADTM5474F`), Section 12A URN, Section 80G URN, and official secretariat contact info (`mect220@gmail.com`).

---

## 6. Operational Readiness Status

| Verification Category | Status | Operational Note |
| :--- | :---: | :--- |
| **Code Implementation** | **READY** | Full client, template rendering, and test mock verification complete. |
| **Unit & Mock Tests** | **PASS** | 100% test pass in `PortalAuthAndOtpSecurityTests` and full test suite. |
| **Production Credentials** | **PENDING OWNER** | Requires `RESEND_API_KEY` populated in production `.env` / environment on VPS. |
| **DNS Record Verification** | **PENDING OWNER** | Owner must confirm Resend domain verification for `notifications@mect.org.in`. |

**Verdict:** CODE READY — OPERATIONAL READINESS CONDITIONAL ON LIVE ENVIRONMENT VARIABLE PROVISIONING.
