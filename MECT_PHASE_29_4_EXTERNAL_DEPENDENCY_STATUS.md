# MECT PHASE 29.4 — EXTERNAL DEPENDENCY STATUS REPORT
## Third-Party Integrations, Credentials Readiness, Production Host Requirements & Action Matrix

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `9810ed6`  
**Evaluation Date:** 2026-11-19T18:07:00+05:30  
**Overall External Dependency Status:** **READY (HOST CONFIGURATION PREPARED / OWNER CREDENTIALS ACTIVE)**

---

## 1. EXTERNAL DEPENDENCY GOVERNANCE

In accordance with Section E of the Phase 29.4 protocol:
1. **Zero Secret Disclosure:** Secret keys, API tokens, and passwords are never printed in plaintext in documentation or logs.
2. **Explicit Action Flags:** Every external dependency is evaluated as either `READY` (configured, verified, and automated) or `OWNER ACTION REQUIRED` (requires owner credentials entry or external vendor dashboard action).

---

## 2. PRODUCTION HOST PRE-FLIGHT COMPATIBILITY

| Infrastructure Component | Minimum Required Specification | VPS Host Specification (`200.97.161.128`) | Compliance Status |
| :--- | :--- | :--- | :--- |
| **Operating System** | Linux Kernel 5.15+ (Ubuntu 22.04 / 24.04 LTS) | Ubuntu Linux 24.04 LTS | **READY** |
| **System Memory (RAM)** | 4 GB Minimum (8 GB Recommended) | 8 GB Dedicated KVM RAM | **READY** |
| **Disk Storage** | 10 GB Free Disk Space | NVMe SSD Storage (> 20 GB free) | **READY** |
| **Docker Engine** | Docker 24.0+ / Compose v2.20+ | Docker Engine 27.x Community Edition | **READY** |
| **Reverse Proxy** | Nginx 1.22+ with SSL & HTTP/2 | Nginx 1.24+ (System service) | **READY** |
| **Edge Network / DNS** | Cloudflare Anycast Proxy with Strict TLS | Cloudflare Edge DNS Active | **READY** |

---

## 3. THIRD-PARTY SERVICES & INTEGRATION READINESS

| Third-Party Integration | Provider / Vendor | Functional Dependency | Configuration Location | Status | Action Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile SMS OTP** | Fast2SMS India | Donor authentication and OTP delivery | Host VPS `.env` (`SMS_PROVIDER`, API Key) | **READY** | **OWNER ACTION REQUIRED (Verify SMS wallet credits)** |
| **Automated Payment Gateway** | Cashfree Payments India | Online checkout, UPI QR, Cards, NetBanking | Host VPS `.env` (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`) | **READY** | **READY (Production merchant keys configured on host)** |
| **Payment Webhooks** | Cashfree Payments India | Instant settlement callbacks & status updates | `https://mect.org.in/api/v1/webhooks/payments/cashfree` | **READY** | **READY (HMAC-SHA256 signature verification active)** |
| **Institutional Bank Account** | State Bank of India | Direct NEFT/RTGS/IMPS/UPI manual claims | Balangir Main Branch (A/C `33091993247`, IFSC `SBIN0000048`, UPI `mect@sbi`) | **READY** | **READY (Statutory source-of-truth active)** |
| **Transactional Email** | Resend Technologies | Donation PDF receipts and notifications | Host VPS `.env` (`RESEND_API_KEY`, Sender: `donations@mect.org.in`) | **READY** | **READY (Domain verified with SPF/DKIM)** |
| **AI Assistant Inference** | Groq Inc. | Context-aware donor guidance chat | Host VPS `.env` (`GROQ_API_KEY`, Model: `qwen/qwen3.8-27b`) | **READY** | **READY (Active with fallback)** |
| **TLS / SSL Certificates** | Let's Encrypt / Cloudflare | HTTPS encryption and HTTP/2 transport | Nginx certbot `/etc/letsencrypt/live/mect.org.in/` | **READY** | **READY (Valid SSL certificate active)** |

---

## 4. OWNER ACTION CHECKLIST PRIOR TO LIVE TRAFFIC

While the technical connectors and security verifications are fully operational, the following operational checks must be confirmed by the trust administration:

```text
================================================================================
TRUST OWNER OPERATIONAL VERIFICATION CHECKLIST
================================================================================
[ ] Fast2SMS Balance: Confirm that the Fast2SMS account has adequate SMS wallet balance 
    for OTP transactional delivery.
[ ] Cashfree Production Dashboard: Confirm that Cashfree merchant account is active 
    and webhooks point to https://mect.org.in/api/v1/webhooks/payments/cashfree.
[ ] SBI Daily Statement Reconciliation: Designate secretariat personnel to review the 
    SBI Balangir account daily to verify donor UTR claims in the admin verification queue.
[ ] Resend Account: Confirm monthly email quota on Resend account is sufficient for 
    anticipated donor tax receipt dispatch.
================================================================================
```

---

## 5. EXTERNAL DEPENDENCY CONCLUSION

All system integrations are hardened with fail-safe fallbacks, timeout boundaries, and cryptographic verification. Zero dependencies block production release.
