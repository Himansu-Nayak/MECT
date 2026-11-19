# MECT PHASE 29.3 — EXTERNAL DEPENDENCY REGISTER AND READINESS MATRIX
## Third-Party Gateway Specifications, API Credentials, Webhooks, Fallbacks & Owner Action Items

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.3 — Final Independent Release Gate, Disaster Recovery & Deployment Rehearsal  
**Execution Date:** 19 November 2026  

---

## 1. EXTERNAL SERVICES READINESS MATRIX

The MECT production platform interacts with the following external service providers:

| Provider / Service | Functional Role | Sandbox Available | Configuration Location | Failure Fallback Behaviour | Owner Action Required |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Fast2SMS / SMS Gateway** | Mobile OTP delivery for donor login & registration | Yes (Dev) | `FAST2SMS_API_KEY` in `.env.production` | User prompted to try Email OTP if SMS delivery fails. | Verify SMS credits and approved DLT template ID before launch. |
| **Cashfree Payments** | Automated online donation checkout (UPI, Cards, NetBanking) | Yes (`TEST`) | `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY` in `.env.production` | Manual SBI bank transfer offered as alternate channel. | Switch `CASHFREE_ENV` from `TEST` to `PRODUCTION` upon release approval. |
| **State Bank of India (SBI)** | Institutional checking account for direct NEFT/RTGS/UPI transfers | N/A (Live Bank) | `SBI_ACCOUNT_NUMBER`, `SBI_IFSC_CODE` in `.env.production` | Claims queued as `UTR_SUBMITTED` for manual finance review. | Confirm online net-banking portal access for Secretariat finance officers. |
| **Resend (Email Gateway)** | Official PDF tax receipt delivery & security notifications | Yes | `RESEND_API_KEY`, `RESEND_FROM_NOTIFICATIONS` in `.env.production` | Outbox pattern queues failed emails for asynchronous retry. | Verify domain DNS records (SPF, DKIM, DMARC) for `mect.org.in` in Resend. |
| **Meta Cloud WhatsApp API** | Transactional donation alerts & receipt PDF delivery | Yes | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Fall back to SMS and Email receipt delivery. | Optional: Confirm Meta Business Manager verification if WhatsApp enabled. |
| **Cloudflare DNS & CDN** | DNS routing, DDoS protection, CDN caching, and TLS termination | Yes | Cloudflare Dashboard for `mect.org.in` | Origin direct fallback (restricted to Cloudflare IP ranges). | Ensure SSL/TLS mode is set to "Full (Strict)" with Origin CA certificate. |
| **Linux Production VPS** | Docker host running frontend, backend, and PostgreSQL containers | Yes (Local) | Host IP `200.97.161.128` (Port 443 Nginx reverse proxy) | Automated container healthchecks with `restart: unless-stopped`. | Execute pre-deployment database backup prior to container restart. |

---

## 2. WEBHOOK & CALLBACK SPECIFICATIONS

1. **Cashfree Payment Webhook:**
   - URL: `https://mect.org.in/api/v1/webhooks/payments/cashfree`
   - Allowed Methods: `POST`
   - Authentication: HMAC-SHA256 signature verification via `x-webhook-signature` and `x-webhook-timestamp`.
   - Idempotency: Handled via `provider_event_id` in database.

2. **Resend Email Webhook:**
   - URL: `https://mect.org.in/api/v1/webhooks/resend`
   - Allowed Methods: `POST`
   - Authentication: Svix cryptographic signature validation (`svix-signature`).

3. **WhatsApp Webhook:**
   - URL: `https://mect.org.in/api/v1/webhooks/whatsapp`
   - Verification: `GET` challenge response via `hub.challenge` and `app.whatsapp.verify-token`.

---

## 3. AUDIT CONCLUSION

All external dependencies have defined fallback mechanisms, asynchronous outbox recovery, and cryptographically verified webhook interfaces. No provider credentials are baked into images or stored in repository source code.
