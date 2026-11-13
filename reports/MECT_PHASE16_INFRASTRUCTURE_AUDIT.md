# MECT Phase 16.2 & 16.3 — VPS Infrastructure & Configuration Audit

**Server:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Mode:** Read-only inspection (no production services restarted or modified; OHO TECH untouched).

## 1. Host & Runtime Inventory

| Component | Observed Value |
| :--- | :--- |
| Operating System | `Ubuntu 26.04.1 LTS` |
| CPU / Memory | `4` vCPUs, `15 GiB` RAM (`~13 GiB` available, `2.2 GiB` used) |
| Disk (`/`, `/opt`) | `193 GB` total, `15 GB` used, `178 GB` available (`8%` used) |
| Java | `OpenJDK 21.0.13.0.3` |
| Node.js | `v20.20.2` |
| PostgreSQL | `18.6` (`Ubuntu 18.6-0ubuntu0.26.04.1`) |
| Firewall (`ufw`) | Active — `22/tcp`, `80/tcp`, `443/tcp` allowed |

## 2. Production Services & Isolation

| Service / Resource | Details | Isolation Status |
| :--- | :--- | :--- |
| MECT Backend (`mect-backend.service`) | `active (running)`, `127.0.0.1:8081`, `/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar`, user `mect` | **READ-ONLY AUDITED** |
| MECT Frontend (`mect_frontend`, PM2 `id: 1`) | `online`, Next.js `16.4.3`, port `3001`, `/opt/mect/frontend` (`SHA: 9c7033e4`) | **READ-ONLY AUDITED** |
| OHO TECH (`oho_tech`, PM2 `id: 0`) | `online`, `uptime: 11D`, PID `200322` | **COMPLETELY UNTOUCHED** |

## 3. Nginx, TLS & Security Headers (`/etc/nginx/sites-enabled/mect.org.in`)

- HTTP (`:80`) -> `301 https://mect.org.in$request_uri`
- `www.mect.org.in` (`:443`) -> `301 https://mect.org.in$request_uri`
- Origin TLS: Cloudflare Origin CA (`/etc/ssl/mect/fullchain.pem`, valid `Nov 2 2026` to `Oct 29 2041 GMT`, TLSv1.2/TLSv1.3)
- Headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- Proxy Routing: `/api/ai/` -> `127.0.0.1:3001`, `/api/` -> `127.0.0.1:8081`, `/` -> `127.0.0.1:3001`

## 4. Database State (`mect_db`, Pre-Backup)

- **Flyway History:** Ranks `1`–`10` applied (`success = t`). `V11` is not yet applied to production.
- **Preserved Production Row Counts:** `donations: 3`, `payments: 3`, `donation_receipts: 2`, `portal_users: 2`.

## 5. Production Configuration Audit (Keys Only — Zero Secret Values Printed)

### Backend (`/opt/mect/backend/.env` validated against `application.yml`)
- **Database:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- **Server / Auth / CORS:** `SERVER_PORT`, `CORS_ALLOWED_ORIGINS`, `JWT_SECRET`, `JWT_ACCESS_VALIDITY`, `JWT_REFRESH_VALIDITY`, `OTP_HASH_PEPPER`, `APP_PUBLIC_BASE_URL`
- **Email (Resend):** `RESEND_API_KEY`, `RESEND_FROM_NOTIFICATIONS`, `RESEND_FROM_DONATIONS`
- **Payments (Cashfree + Provider Gate):** `PAYMENT_PROVIDER`, `PAYMENT_SANDBOX_MODE`, `CASHFREE_ENV`, `CASHFREE_API_VERSION`, `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET`, `CASHFREE_WEBHOOK_TOLERANCE_SECONDS`, `CASHFREE_RETURN_URL`, `CASHFREE_NOTIFY_URL`
- **Note for V11+ Media Upload:** Verify `APP_MEDIA_STORAGE_DIR` (or default `uploads/media` under `/opt/mect/backend`) has persistent writable directory permissions for user `mect` before production cutover.

### Frontend (`/opt/mect/frontend/.env.local`)
- **Keys Present:** `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_URL`, `PORT`, `AI_ENGINE_MODE`, `GROQ_API_KEY`, `GROQ_MODEL`
- **Security Check:** Zero backend secrets (`JWT_SECRET`, `DB_PASSWORD`, `CASHFREE_SECRET_KEY`, `CASHFREE_WEBHOOK_SECRET`, `RESEND_API_KEY`) exist in `.env.local` or frontend `NEXT_PUBLIC_*` variables.

