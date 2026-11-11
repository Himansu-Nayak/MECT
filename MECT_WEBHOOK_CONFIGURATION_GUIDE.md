# MECT — Step-by-Step Provider Dashboard Webhook Configuration Guide

> **Important Pre-Check:** The external dashboard screen you saw (**"Add Webhook Endpoint" -> Endpoint URL -> Webhook version -> Add Policy -> Summary**) is **Cashfree Payments**. MECT does **not** use Cashfree—do **not** configure that Cashfree screen for MECT unless you later commission a Cashfree integration. Below are the exact verified instructions for the providers actually implemented in MECT.

---

## 1. Resend Webhook Setup (Optional Email Delivery & Bounce Tracking)
*Note: Sending OTP emails, welcome emails, and PDF receipt emails **already works without this webhook**. Configure this only if you want Resend delivery/bounce/complaint tracking inside `/admin/donors` -> Notification Outbox.*

1. Log in to **Resend Dashboard** -> **Webhooks** -> **Add Endpoint**.
2. **Endpoint URL:** `https://mect.org.in/api/v1/webhooks/resend`
3. **Webhook Version:** *(Resend does not ask for a Cashfree-style API version dropdown; it dispatches standard Svix JSON events.)*
4. **Subscribe ONLY to these Events:**
   - `email.delivered`
   - `email.delivery_delayed`
   - `email.bounced`
   - `email.complained`
   *(Optional: `email.sent`. Do **not** subscribe to `email.opened` or `email.clicked` unless click/open tracking is enabled.)*
5. Copy the generated **Signing Secret** (`whsec_...`) and configure it on the VPS in `/opt/mect/backend/.env`:
   - `RESEND_WEBHOOK_SECRET=whsec_<your_secret>`
6. Restart backend: `systemctl restart mect-backend.service`. *(Recommended: also deploy the local Phase 11 webhook hardening update so `±300s` Svix replay validation and `svix-id` dedup are active live.)*

---

## 2. Razorpay Webhook Setup (Essential When Live Online / Dynamic UPI QR Checkout Is Enabled)
*Note: Required only once `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are added to `/opt/mect/backend/.env` (`https://mect.org.in/donate` currently shows Razorpay unconfigured while SBI manual bank transfer works).*

1. Log in to **Razorpay Dashboard** -> **Account & Settings** -> **Webhooks** -> **+ Add New Webhook**.
2. **Webhook URL:** `https://mect.org.in/api/v1/webhooks/payments/razorpay`
3. **Secret:** Generate a strong secret string (save identically in `/opt/mect/backend/.env` as `RAZORPAY_WEBHOOK_SECRET=...`).
4. **Alert Email:** MECT admin email (`contact@mect.org.in`).
5. **Active Events to Subscribe:**
   - `payment.captured` *(required for order checkout confirmation)*
   - `payment.failed` *(marks failed attempts cleanly)*
   - `order.paid` *(order completion safety backup)*
   - `qr_code.credited` *(required for instant Dynamic UPI QR payment confirmation)*
   - `qr_code.closed` *(marks expired QR payments cleanly)*
   - `refund.processed` *(records completed refunds cleanly)*
6. Configure on VPS `/opt/mect/backend/.env`:
   - `RAZORPAY_KEY_ID=rzp_live_...`
   - `RAZORPAY_KEY_SECRET=...`
   - `RAZORPAY_WEBHOOK_SECRET=...`
   - `PAYMENT_SANDBOX_MODE=false`

---

## 3. Meta WhatsApp Cloud Webhook Setup (Optional Future Channel — Blocked Pending Approvals)
*Configure only after Meta Business Verification, WABA setup, and template approvals:*
- **Callback URL:** `https://mect.org.in/api/v1/webhooks/whatsapp`
- **Verify Token:** value matching `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in `/opt/mect/backend/.env`
- **Webhook Fields:** `messages` (specifically message `statuses`)
- **Backend Env Keys:** `WHATSAPP_PROVIDER=META_CLOUD`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_TEMPLATE_WELCOME`, `WHATSAPP_TEMPLATE_DONATION`.

---

## 4. Cashfree Dashboard Screen ("Add Webhook Endpoint")
- **Action:** **Do not configure** this screen for MECT unless MECT replaces/adds Cashfree in code first. If you saw this screen inside a Cashfree account, ignore it for the current Razorpay + Resend architecture.

