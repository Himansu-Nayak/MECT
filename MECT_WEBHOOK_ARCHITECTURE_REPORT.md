# MECT — Webhook Architecture & Production Routing Report

**Audit Date:** 2026-11-11

## 1. Repository & Production Topology Findings (Verified from MECT Codebase & VPS Nginx)
- **Backend Framework:** Spring Boot `4.1.1` (Java `21`), `server.servlet.context-path: /api/v1`, running on `127.0.0.1:8081`.
- **Reverse Proxy (`/etc/nginx/sites-available/mect.org.in`):**
  - `/api/ai/` -> Next.js frontend `127.0.0.1:3001`
  - `/api/` -> Spring Boot backend `127.0.0.1:8081`
  - `/` -> Next.js frontend `127.0.0.1:3001`
- **Security Filter Chain ([`SecurityConfig`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/config/SecurityConfig.java)):**
  - `.requestMatchers("/webhooks/**").permitAll()` (stateless CSRF disabled; cryptographic signature verification enforced per controller/service method).
  - [`RateLimitingFilter`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/security/RateLimitingFilter.java) restricts `/public/` and `/portal/auth/` (`30 req/min/IP`) and intentionally does **not** throttle `/webhooks/**` so legitimate bursts of provider webhook deliveries are never dropped.
- **Unified Controller ([`WebhookController`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/backend/src/main/java/org/mahavirtrust/backend/controller/WebhookController.java)):** `@RequestMapping("/webhooks")` exposes:
  1. `POST /api/v1/webhooks/payments/razorpay` -> `https://mect.org.in/api/v1/webhooks/payments/razorpay`
  2. `POST /api/v1/webhooks/resend` -> `https://mect.org.in/api/v1/webhooks/resend`
  3. `GET` + `POST /api/v1/webhooks/whatsapp` -> `https://mect.org.in/api/v1/webhooks/whatsapp`

## 2. Live Production Edge Reachability Verified
- `POST https://mect.org.in/api/v1/webhooks/resend` (unsigned) -> `HTTP 401`
- `POST https://mect.org.in/api/v1/webhooks/payments/razorpay` (unsigned) -> `HTTP 401`
- `POST https://mect.org.in/api/v1/webhooks/whatsapp` (unsigned) -> `HTTP 401`
Confirms Cloudflare + Nginx cleanly forward `/api/v1/webhooks/*` to Spring Boot on port `8081`, and all three fail closed without valid signatures.

## 3. Screenshot Provider Identification
The external dashboard screen titled **"Add Webhook Endpoint"** containing **Endpoint URL**, **Webhook version**, **Add Policy**, and **Summary** belongs to **Cashfree Payments** (`Payment Gateway > Developers > Webhooks`). Cashfree is **NOT IMPLEMENTED** anywhere in the MECT repository.

