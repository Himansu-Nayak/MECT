# MECT — Cashfree Webhook Audit Report

**Status: NOT IMPLEMENTED / NOT APPLICABLE IN CURRENT CODEBASE**

## 1. Repository Audit Result
A full-repository search across `src/`, `backend/src/`, `pom.xml`, `application.yml`, `V1`–`V9` Flyway migrations, and `.env` configurations confirms:
- Zero references to Cashfree (`cashfree`, `PGVerifyWebhookSignature`, `x-webhook-signature`, `x-webhook-timestamp`).
- No Cashfree controller, SDK dependency, signature validator, order API client, or donation status handler exists in MECT.

## 2. Identification of the User's External Dashboard Screen
- The external dashboard UI described (**"Add Webhook Endpoint"** with **Endpoint URL**, **Webhook version**, **Add Policy**, **Summary**) is the **Cashfree Payment Gateway Merchant Dashboard** (`Payment Gateway > Developers > Webhooks`).
- By contrast:
  - **Resend** uses *Webhooks -> Add Endpoint* (Endpoint URL + Events -> Signing Secret `whsec_...`).
  - **Razorpay** uses *Settings -> Webhooks -> Add New Webhook* (Webhook URL + Secret + Active Events).

## 3. Official Cashfree Webhook Specification (Reference Only — Do Not Configure Yet)
Should MECT ever adopt Cashfree instead of Razorpay in a future dedicated task:
- Headers used by Cashfree: `x-webhook-signature` and `x-webhook-timestamp` (`Base64(HMAC-SHA256(timestamp + rawBody, clientSecret))`).
- Webhook API schema versioning uses date versions (such as `2025-01-01`).
- **Critical Warning:** Do **not** register `/api/v1/webhooks/payments/razorpay` or Razorpay event names inside Cashfree—signature headers and JSON payloads are incompatible and every webhook would fail with `HTTP 401`.

