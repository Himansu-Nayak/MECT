# MECT Phase 20 — Production Security Audit

**Target:** `https://mect.org.in/` / VPS `200.97.161.128`  
**Audit Scope:** Container permissions, file permissions, network isolation, RBAC, payment signatures, and secrets.

---

## 1. Container Privilege & User Enforcement

- **Frontend Container (`mect-frontend`):**
  - Runs as user `nextjs` (UID 1001, GID 1001).
  - Root filesystem write restricted; only `.next` prerender cache is owned by `nextjs`.
  - Non-root execution confirmed.
- **Backend Container (`mect-backend`):**
  - Runs as user `mect` (UID 1001, GID 1001).
  - Writable directories limited to `/app/uploads/media` and `/app/receipts`.
  - Non-root execution confirmed.
- **Database Container (`mect-postgres`):**
  - Standard PostgreSQL unprivileged user `postgres` (UID 999).

---

## 2. Secrets & File Permission Hardening

- **Environment File:** `/opt/mect/.env.production`
  - Permissions: `-rw-------` (`600`)
  - Ownership: `root:root` (accessible only by root and Docker daemon)
  - Zero presence in Git or client-side bundles.
- **Database Backups:** `/var/backups/mect/*.dump`
  - Permissions: `-rw-------` (`600`)
  - Directory: `drwx------` (`700`)
- **SSL Keys:** `/etc/ssl/mect/origin.key`
  - Permissions: `600` root-only access.

---

## 3. Network Isolation & Port Security

- **UFW Firewall:**
  - Active. Allows incoming connections only on ports `22`, `80`, `443`.
  - Probed port `5432` from public internet: **FILTERED / BLOCKED**.
  - Probed port `5433` from public internet: **FILTERED / BLOCKED**.
  - Probed port `8080` / `8081` from public internet: **FILTERED / BLOCKED**.
  - Probed port `3000` / `3001` from public internet: **FILTERED / BLOCKED**.
- **Internal Docker Network (`mect-network`):**
  - Backend and Database communicate exclusively over private bridge network.
  - Zero cross-talk with host or OHO TECH containers.

---

## 4. API & Application Security Tests

1. **Unauthenticated Admin Endpoints:**
   - `GET /api/v1/admin/donors` -> **401 Unauthorized** (Requires Bearer token).
   - `GET /api/v1/admin/manual-claims` -> **401 Unauthorized**.
   - `PUT /api/v1/admin/cms/pages/test/draft` -> **401 Unauthorized**.
2. **Invalid Admin Login:**
   - `POST /api/v1/auth/login` with bad credentials -> **401 Unauthorized** (`"Invalid username or password"`).
3. **Webhook Signature Security:**
   - `POST /api/v1/webhooks/payments/cashfree` without valid signature header -> **401 Unauthorized**.
4. **Public CMS Filter:**
   - `GET /api/v1/public/cms/pages/qa-acceptance` -> **404 Not Found** (Archived/unpublished content strictly filtered).
5. **OTP Abuse Prevention:**
   - `POST /api/v1/portal/auth/request-otp` rapid repeat -> **429 Too Many Requests** (`"Please wait 52 seconds..."`).
6. **Actuator Metric Protection:**
   - `/actuator/metrics`, `/actuator/env`, `/actuator/beans` blocked from public proxy. Only health probe `/api/v1/actuator/health` exposed.
