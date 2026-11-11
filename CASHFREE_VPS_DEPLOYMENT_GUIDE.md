# Cashfree Payment Gateway — VPS Deployment & Verification Plan (MECT)

> **AUTHORIZED EXECUTION GATE:** Do **not** deploy, restart live services, run `pg_dump`/migrations on the VPS, switch `PAYMENT_PROVIDER=CASHFREE`, or trigger a real charge without explicit user authorization.

## 1. Confirmed Hostinger VPS & Reverse Proxy Topology
- **Server:** `200.97.161.128` (`srv2000528`) behind Cloudflare
- **Frontend Checkout App:** `/opt/mect/frontend` managed by PM2 (`mect_frontend`, `id: 1`)
- **Backend API Service:** `mect-backend.service` listening on `127.0.0.1:8081` (context-path `/api/v1`)
- **PostgreSQL Database:** `mect_db` (currently Flyway `V1`–`V9`)
- **Co-hosted Isolation:** Do **not** touch `oho_tech` (PM2 `id: 0`) or `/etc/nginx` site configs for `ohotechn.com`.

## 2. Registered Cashfree Production Webhook (Already Updated on Dashboard)
- **Endpoint URL:** `https://mect.org.in/api/v1/webhooks/payments/cashfree`
- **Webhook API Version:** `2023-08-01`
- **Events Enabled:** `PAYMENT_SUCCESS_WEBHOOK`, `PAYMENT_FAILED_WEBHOOK`, `PAYMENT_USER_DROPPED_WEBHOOK`
- **Retry Policy:** Default (`3` retries)

## 3. Exact VPS Deployment Plan (Run Only After Explicit Authorization)

### Step A — Pre-Deploy Production Database & Artifact Backup
```bash
# On VPS (as authorized operator / mect user):
mkdir -p /opt/mect/backups
pg_dump -Fc -U mect -d mect_db -f /opt/mect/backups/mect_db_pre_cashfree_$(date +%Y%m%d_%H%M%S).dump
chmod 600 /opt/mect/backups/mect_db_pre_cashfree_*.dump
pg_restore -l /opt/mect/backups/mect_db_pre_cashfree_*.dump | head -n 20
cp /opt/mect/backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar /opt/mect/backups/mahavir-backend.jar.pre_cashfree_$(date +%Y%m%d_%H%M%S)
```

### Step B — Pull Verified MECT Release & Configure `/opt/mect/backend/.env`
Ensure `/opt/mect/backend/.env` has strict permissions (`chmod 600 /opt/mect/backend/.env`), **preserves the active payment provider during infrastructure deployment** (`PAYMENT_PROVIDER=RAZORPAY`), and configures the existing Cashfree Production credentials securely on the backend:
```dotenv
# Stage 1 (Infrastructure Deploy): keep existing active provider unchanged!
PAYMENT_PROVIDER=RAZORPAY
PAYMENT_SANDBOX_MODE=false

# Cashfree Production Credentials (existing key pair; NEVER switch PAYMENT_PROVIDER=CASHFREE without explicit approval)
CASHFREE_ENV=PRODUCTION
CASHFREE_API_VERSION=2023-08-01
CASHFREE_APP_ID=<existing_cashfree_production_app_id>
CASHFREE_SECRET_KEY=<existing_cashfree_production_secret_key>
# Optional dedicated webhook secret; omit or leave blank to fall back cleanly to CASHFREE_SECRET_KEY:
CASHFREE_WEBHOOK_SECRET=
CASHFREE_WEBHOOK_TOLERANCE_SECONDS=300
CASHFREE_RETURN_URL=https://mect.org.in/donate?order_id={order_id}
CASHFREE_NOTIFY_URL=https://mect.org.in/api/v1/webhooks/payments/cashfree
```
> Once verified in `/opt/mect/backend/.env`, delete local plaintext workspace exports (`APIKey (2).csv` and `api keys.png`).
> Ensure `nginx` keeps `/api/v1/` proxying directly to `127.0.0.1:8081` with `proxy_pass_request_headers on` (preserving `x-webhook-signature` and `x-webhook-timestamp`) and does not apply a `default-src 'self'` CSP header to `https://mect.org.in/donate` HTML so `https://sdk.cashfree.com/js/v3/cashfree.js` can load.

### Step C — Build & Restart MECT Services Only (Zero Impact on `oho_tech`)
```bash
# Sync repository on /opt/mect/frontend (clean release commit)
cd /opt/mect/frontend && git pull --ff-only origin feat/multi-sector-ngo-repositioning

# Build & restart backend (runs Flyway V10__cashfree_payment_gateway_schema.sql safely on startup)
cd /opt/mect/frontend/backend && mvn -B clean package -DskipTests
sudo systemctl restart mect-backend.service
sudo systemctl status mect-backend.service --no-pager

# Build & restart frontend
cd /opt/mect/frontend && npm ci && npm run build
pm2 restart mect_frontend
```

### Step D — Mandatory Post-Deploy Verification Checks (Before Live Donor Traffic)
1. **Flyway V10 Verification:** Confirm `SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;` shows `10 | cashfree payment gateway schema | t`.
2. **Gateway Readiness Check (Infrastructure Deploy Stage):**
   ```bash
   curl -sS https://mect.org.in/api/v1/public/donations/gateway-status
   # Expect active provider preserved (RAZORPAY/fallback) until explicitly switched to CASHFREE
   ```
3. **Unsigned Webhook Security Check (Must transition from 500 -> 401):**
   ```bash
   curl -i -sS -X POST https://mect.org.in/api/v1/webhooks/payments/cashfree -H "Content-Type: application/json" -d '{}'
   # Expect: HTTP 401 {"error":"invalid_cashfree_webhook_signature"}
   ```
4. **Authorized Production Activation & Single Controlled Transaction (Only After Explicit Owner Approval):**
   Set `PAYMENT_PROVIDER=CASHFREE` in `/opt/mect/backend/.env`, run `sudo systemctl restart mect-backend.service`, verify `GET https://mect.org.in/api/v1/public/donations/gateway-status` returns `{"provider":"CASHFREE","configured":true,"sandboxMode":false,"checkoutMode":"CASHFREE_SDK_V3","checkoutEnvironment":"production"}`, then complete one authorized test transaction and verify:
   - Signed Cashfree webhook (`PAYMENT_SUCCESS_WEBHOOK`) logged HTTP `200` in backend logs & `payment_events` (`signature_verified = t`, `processing_status = PROCESSED`).
   - Exactly `1` `SUCCESSFUL` row in `donations` & `payments` (with `cf_order_id`, `provider_payment_id`, `bank_reference`, `verified_at`).
   - Exactly `1` receipt in `donation_receipts` (`MECT-RCPT-...`) and queued email in `notification_outbox`.
   - Entry visible in `/admin/donors` -> Donations tab with PDF download & Verify action working.
   - `https://ohotechn.com/` untouched (`HTTP 200`).

## 4. Instant Safe Rollback Procedure
```bash
# 1. Disable Cashfree immediately in /opt/mect/backend/.env and revert to RAZORPAY / SBI fallback:
sed -i 's/^PAYMENT_PROVIDER=.*/PAYMENT_PROVIDER=RAZORPAY/' /opt/mect/backend/.env
sudo systemctl restart mect-backend.service

# 2. If full JAR rollback needed:
# cp /opt/mect/backups/mahavir-backend.jar.pre_cashfree_<ts> /opt/mect/backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar
# sudo systemctl restart mect-backend.service
```
(PostgreSQL `V10` changes are strictly additive; existing historical records remain intact.)
