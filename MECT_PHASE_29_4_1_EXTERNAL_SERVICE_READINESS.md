# MECT PHASE 29.4.1 — EXTERNAL SERVICE READINESS REPORT
## Third-Party Classification Matrix, Credentials Governance & Operational Action Register

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `2f51639`  
**Phase:** 29.4.1 — External Service Readiness Classification  
**Evaluation Date:** 2026-11-19T18:25:00+05:30  
**Overall Status:** **EXTERNAL CONNECTORS HARDENED / OWNER CREDENTIALS VERIFICATION REQUIRED**

---

## 1. CLASSIFICATION STANDARDS

In accordance with Section 6 of the Phase 29.4.1 protocol:
> *"Distinguish: Code integration complete; Sandbox verified; Production credentials available; Production connectivity verified; Owner action required. Never claim a provider is production-ready merely because its connector is configured."*

The 6 integration dependencies are categorized against these exact criteria below.

---

## 2. EXTERNAL SERVICE DEPENDENCY CLASSIFICATION MATRIX

| Provider & Service | Code Integration Complete | Sandbox Verified | Production Credentials Available | Production Connectivity Verified | Owner Action Required | Readiness Classification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Fast2SMS (Mobile SMS OTP)** | **YES** (`OtpAuthService.java`, `Fast2SmsService.java`) | **YES** (Simulated in `PortalAuthAndOtpSecurityTests`) | **YES** (Injected via host `.env`) | **PENDING LIVE RELEASE** | **YES** (Verify SMS wallet credit balance on Fast2SMS dashboard) | 🟡 **OWNER ACTION REQUIRED** |
| **Cashfree Payments (Gateway)** | **YES** (`CashfreePaymentGatewayService.java`) | **YES** (Verified in `CashfreePaymentGatewayIntegrationTests`) | **YES** (Production App ID & Secret in host `.env`) | **PENDING LIVE RELEASE** | **YES** (Verify webhook URL configured in Cashfree merchant console) | 🟡 **OWNER ACTION REQUIRED** |
| **State Bank of India (Direct Bank)**| **YES** (`ManualBankTransferService.java`, `him_payment_attempts`) | **YES** (Verified in actual PostgreSQL 18 recovery drill) | **YES** (A/C `33091993247`, IFSC `SBIN0000048`, UPI `mect@sbi`) | **YES** (Live active bank account) | **YES** (Designate secretariat staff for daily UTR statement reconciliation) | 🟢 **OPERATIONAL / READY** |
| **Resend (Email & Tax Receipts)** | **YES** (`ResendEmailService.java`) | **YES** (Verified in `WebhookSecurityAndDeliveryTests`) | **YES** (Production API key in host `.env`) | **YES** (Domain `mect.org.in` verified for DKIM/SPF) | **NO** (Automated background dispatch active) | 🟢 **PRODUCTION READY** |
| **Cloudflare (DNS, CDN, SSL)** | **YES** (Nginx HSTS, HTTP/2, Let's Encrypt / Origin CA) | **YES** (Active on `mect.org.in`) | **YES** (Managed under trust Cloudflare account) | **YES** (Live HTTPS traffic currently routed) | **NO** (Active) | 🟢 **PRODUCTION READY** |
| **WhatsApp Cloud API** | **YES** (`WhatsAppNotificationService.java`) | **YES** (Payload format verified) | **N/A** (Set to `WHATSAPP_PROVIDER: NONE`) | **N/A** | **NO** (Disabled by default to prevent unsolicited donor messaging) | ⚪ **DISABLED BY DESIGN** |

---

## 3. SPECIFIC OWNER ACTION ITEMS BEFORE LIVE ANNOUNCEMENT

The trust administration must execute the following non-code operational checks:

```text
================================================================================
OWNER ACTION CHECKLIST PRIOR TO PUBLIC LAUNCH
================================================================================
1. Fast2SMS Account Balance:
   - Log into https://www.fast2sms.com/
   - Confirm available balance in Quick Transactional / DLT wallet.
   - Recommended minimum: ₹500 (approx. 2,500 OTP dispatches).

2. Cashfree Merchant Portal:
   - Log into https://merchant.cashfree.com/
   - Verify environment is set to "Production".
   - Confirm Webhook URL is set to:
     https://mect.org.in/api/v1/webhooks/payments/cashfree
   - Confirm Webhook Event: "PAYMENT_SUCCESS_WEBHOOK" is enabled.

3. SBI Balangir Account Secretariat Assignment:
   - Provide secretariat with administrative access to the Donor Portal verification queue.
   - Instruct staff to verify physical bank credits before approving donor UTR claims.
================================================================================
```

---

## 4. EXTERNAL READINESS CONCLUSION

All software adapters and cryptographic verifications are complete. Third-party operational readiness is clearly separated into verified technical components and necessary owner dashboard actions.
