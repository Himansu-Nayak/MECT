# MECT Webhook Production Release Report

**Date:** 2026-11-11  
**Domain:** `https://mect.org.in`  
**Git Branch:** `feat/multi-sector-ngo-repositioning`  
**Deployed Commit SHA:** `c0d4a8adbc3317fc0bc20d7ff1905a797a5d156b`

---

## 1. Local Code & Security Verification (`PASS`)

Ran `cd backend && mvn test -B` on the final committed backend code:
- **Tests run:** `47`
- **Failures:** `0`
- **Errors:** `0`
- **Skipped:** `0`
- **Build Result:** `BUILD SUCCESS`

Secret scan of the staged release diff (`git diff --cached`) confirmed zero live API keys, webhook secrets, private keys, or credentials were committed.  
Confirmed `git diff e4ae497 -- src/ public/ package.json next.config.ts` was empty (no frontend source code changes in this release).

### Released Backend Hardening Files
- `backend/src/main/java/org/mahavirtrust/backend/controller/WebhookController.java`
- `backend/src/main/java/org/mahavirtrust/backend/repository/NotificationDeliveryLogRepository.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/notification/NotificationOutboxService.java`
- `backend/src/main/java/org/mahavirtrust/backend/service/notification/ResendEmailService.java`
- `backend/src/test/java/org/mahavirtrust/backend/WebhookSecurityAndDeliveryTests.java`

Plus 9 audit & release markdown reports committed in `c0d4a8a`.

---

## 2. GitHub Release (`PASS`)

- **Commit:** `c0d4a8a` — `feat(mect): harden webhook security and idempotency verification`
- **Remote:** `origin` (`https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git` -> `MECT.git`)
- **Verification:** `git rev-parse HEAD` and `git ls-remote origin refs/heads/feat/multi-sector-ngo-repositioning` both match `c0d4a8adbc3317fc0bc20d7ff1905a797a5d156b`.

---

## 3. VPS Backup & Production Deployment (`PASS`)

Deployed on VPS (`200.97.161.128`, host `srv2000528`):
- **Database Backup Created & Verified:**
  - File: `/opt/mect/backups/mect_db_pre_webhook_20261111_062623.dump` (`192K`, `chmod 600`, `mect:mect`)
  - Validated TOC via `pg_restore -l` (`251` TOC entries)
  - Flyway schema history on `mect_db`: versions `1` through `9` all `success = t`
- **Previous JAR Backup:** `/opt/mect/backups/mahavir-backend-0.1.0-SNAPSHOT.jar.e4ae497_20261111_062724`
- **Git Checkout Sync:** `/opt/mect/frontend` fast-forwarded cleanly to `c0d4a8adbc3317fc0bc20d7ff1905a797a5d156b`
- **Backend Build & Restart:**
  - Built `mvn -B clean package -DskipTests` as `mect`
  - Restarted `mect-backend.service` only (`PID 355851`, Tomcat listening on `127.0.0.1:8081` with context path `/api/v1`)
- **Nginx Config Check:** `nginx -t` passed (`syntax is ok` / `test is successful`)
- **Zero Impact on Co-Hosted Workloads:**
  - `mect_frontend` PM2 (`id: 1`, `PID 348161`) remained `online` untouched
  - `oho_tech` PM2 (`id: 0`, `PID 200322`, `uptime 9D`) remained `online` untouched
  - `https://ohotechn.com` returned `HTTP 200`; `https://api.ohotechn.com/api/v1/auth/login` (`{}`) returned `HTTP 401`

---

## 4. Live Production Verification on `https://mect.org.in` (`PASS` for Deployed Behaviour)

| Check | Result |
|---|---|
| `GET https://mect.org.in/` | `HTTP 200` |
| `GET https://mect.org.in/portal/login` | `HTTP 200` |
| `GET https://mect.org.in/api/v1/public/donations/programmes` | `HTTP 200` |
| `GET https://mect.org.in/api/v1/public/donations/gateway-status` | `HTTP 200` — `{"provider":"RAZORPAY","configured":false,"sandboxMode":false,"dynamicQrSupported":false,...}` |
| `POST https://mect.org.in/api/v1/webhooks/resend` (unsigned) | `HTTP 401` (fail closed) |
| `POST https://mect.org.in/api/v1/webhooks/resend` (spoofed Svix sig) | `HTTP 401` (fail closed) |
| `POST https://mect.org.in/api/v1/webhooks/payments/razorpay` (unsigned) | `HTTP 401` (fail closed) |
| `POST https://mect.org.in/api/v1/webhooks/payments/razorpay` (spoofed signature) | `HTTP 401` (fail closed) |
| `POST https://mect.org.in/api/v1/webhooks/whatsapp` (unsigned) | `HTTP 401` (fail closed) |
| Controlled email dispatch (`POST /api/v1/portal/auth/request-otp` to `delivered@resend.dev`) | `HTTP 200`, `accepted: true`, backend log `Resend email dispatched successfully (messageId=01a1c94b-a7b0-774a-96e1-ff36e14b0f2c)` |

---

## 5. Remaining Manual Provider Dashboard Actions & Blockers

The following provider webhook secrets are **not yet configured** in `/opt/mect/backend/.env` (confirmed by inspecting `/opt/mect/backend/.env` variable names only):

1. **Resend Webhook (`RESEND_WEBHOOK_SECRET`) — Requires Manual Dashboard Action**
   - Attempted API check `GET https://api.resend.com/webhooks` with the live `RESEND_API_KEY`; Resend returned:
     `HTTP 401 — {"statusCode":401,"message":"This API key is restricted to only send emails","name":"restricted_api_key"}`.
   - Because this key only has email-sending permissions, webhook creation must be done in the Resend Dashboard (or with a full-access API key):
     - **Endpoint URL:** `https://mect.org.in/api/v1/webhooks/resend`
     - **Events:** `email.delivered`, `email.delivery_delayed`, `email.bounced`, `email.complained`
     - Copy the generated `whsec_...` signing secret to `/opt/mect/backend/.env` as `RESEND_WEBHOOK_SECRET=whsec_...` and run `systemctl restart mect-backend.service`.
     - Live signed Resend webhook delivery could not yet be tested end-to-end until `RESEND_WEBHOOK_SECRET` is configured.

2. **Razorpay Merchant & Webhook Configuration (`RAZORPAY_*`) — Blocked on Credentials**
   - `/opt/mect/backend/.env` does not contain `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, or `RAZORPAY_WEBHOOK_SECRET`, and `PAYMENT_SANDBOX_MODE` remains `false`.
   - Verified SBI bank transfer remains active while online Razorpay checkout/QR reports `configured: false`.
   - When live Razorpay merchant credentials are ready:
     - Configure Razorpay Webhook URL: `https://mect.org.in/api/v1/webhooks/payments/razorpay`
     - Events: `payment.captured`, `payment.failed`, `order.paid`, `qr_code.credited`, `qr_code.closed`, `refund.processed`
     - Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` to `/opt/mect/backend/.env` and restart `mect-backend.service`.
     - Live signed Razorpay webhook delivery could not yet be tested end-to-end until `RAZORPAY_WEBHOOK_SECRET` is configured.

3. **Meta WhatsApp Webhook**
   - Route `https://mect.org.in/api/v1/webhooks/whatsapp` is deployed and rejects unsigned POST requests (`HTTP 401`), while Meta WhatsApp environment credentials are not configured in `/opt/mect/backend/.env`.

4. **Cashfree — Explicitly Excluded (`NOT IMPLEMENTED`)**
   - Cashfree is not implemented in the backend or frontend and was not added or aliased.
