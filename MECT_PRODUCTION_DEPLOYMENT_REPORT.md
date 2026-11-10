# MECT Production Deployment & Live Verification Report

**Release Date:** 2026-11-10
**Production Domain:** `https://mect.org.in`
**Target Infrastructure:** Hostinger VPS (`srv2000528` / `200.97.161.128`)
**Overall Status:** **DEPLOYED & LIVE VERIFIED**

---

## 1. GitHub Release & Artifact Verification

| Item | Verified Value | Status |
|---|---|---|
| GitHub Repository | `https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git` (redirect: `https://github.com/Himansu-Nayak/MECT.git`) | PASS |
| Release Branch | `feat/multi-sector-ngo-repositioning` | PASS |
| Local & Remote Commit SHA | `ea4ab59db52306492509a8cd56138b32aab31980` (`ea4ab59`) | PASS |
| VPS Deployed Commit SHA (`/opt/mect/frontend`) | `ea4ab59db52306492509a8cd56138b32aab31980` | PASS |
| Secret Scan / Exclusions | `.env*`, personal PDFs/photos, temporary screenshots excluded | PASS |

---

## 2. Pre-Deployment Verification Summary

All local quality gates passed cleanly against commit `ea4ab59`:

| Check | Result | Status |
|---|---|---|
| TypeScript (`npx tsc --noEmit`) | 0 errors | PASS |
| ESLint (`npm run lint`) | 0 errors | PASS |
| Next.js Production Build (`npm run build`) | 32/32 routes compiled cleanly (`30 ○` static, `2 ƒ` dynamic) | PASS |
| Regression Test Suite (`node scratch/test-all-phases-regression.mjs`) | 16 Passed, 0 Failed (16 Suites) | PASS |
| Spring Boot Backend Tests (`mvn test -B`) | 38 run, 0 failures, 0 errors, 0 skipped | PASS |

---

## 3. VPS Infrastructure, Backup & Deployment Actions

### 3.1 PostgreSQL Database Backup & Schema State

| Check | Details | Status |
|---|---|---|
| Database Backup Created | `/opt/mect/backups/mect_db_backup_20261110_170130.dump` (`62K`, custom format `-Fc`, perms `600`, owner `mect:mect`) | PASS |
| Backup Integrity Verification | `pg_restore -l` validated cleanly (PostgreSQL `18.6`, 84 TOC entries) | PASS |
| Flyway Schema History (`mect_db`) | Ranks `1`–`6` (`V1__initial_schema.sql` through `V6__scholarship_applications_schema.sql`) applied (`success = t`), matching local migrations 100% | PASS |
| Live Data Safety | Read-only verification only; zero schema drops, restores, or synthetic writes performed | PASS |

### 3.2 Zero-Downtime Staged Frontend Deployment

| Step | Details | Status |
|---|---|---|
| Staging Clone & SHA Pinning | Cloned `feat/multi-sector-ngo-repositioning` into `/opt/mect/frontend_stage` and verified SHA `ea4ab59db52306492509a8cd56138b32aab31980` | PASS |
| Production Env Preservation | Copied existing `/opt/mect/frontend/.env.local` (`NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1`, `NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1`, `PORT=3001`, `AI_ENGINE_MODE=fallback_only`, `GROQ_MODEL=qwen/qwen3.8-27b`) | PASS |
| Staged Install & Production Build | Executed `npm ci --no-audit --no-fund` and `NODE_ENV=production npm run build` (`32/32` routes built cleanly while live site stayed up) | PASS |
| Atomic Rollback Snapshot & Cutover | Moved previous `/opt/mect/frontend` -> `/opt/mect/frontend-backup-20261110170320`, promoted `frontend_stage` -> `/opt/mect/frontend` (`mect:mect`) | PASS |
| Targeted PM2 Restart | Executed `pm2 restart mect_frontend --update-env` (new PID `343953`, `online`, port `3001`, Next.js `16.4.3`) | PASS |
| Spring Boot Backend (`mect-backend.service`) | Existing JAR `/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar` verified to contain `V6__scholarship_applications_schema.sql` & `ScholarshipPublicController.class`; running on `127.0.0.1:8081` (`UP`) | PASS |

### 3.3 Co-Hosted OHO TECH Isolation Verification

| Resource | Observation | Status |
|---|---|---|
| PM2 Process `oho_tech` (`id: 0`) | Untouched; same PID `200322`, `uptime: 9D`, `online`, `62.0mb` | PASS |
| `https://ohotechn.com` | External HTTPS response HTTP `200` | PASS |
| `https://api.ohotechn.com` | External HTTPS response HTTP `401` (protected API intact) | PASS |
| Database `ohotech_db` / Nginx configs | Untouched throughout deployment | PASS |

---

## 4. Nginx, DNS, TLS & Security Header Validation

| Check | Verified Evidence | Status |
|---|---|---|
| Nginx Syntax Check | `nginx -t` succeeded with zero errors | PASS |
| DNS A / AAAA (`mect.org.in`, `www.mect.org.in`) | Cloudflare edge IPs (`104.21.44.48`, `172.67.195.21`, IPv6 `2606:4700:3030::6815:2c30`, `2606:4700:3037::ac43:c315`) via `barbara.ns.cloudflare.com` | PASS |
| Email / Resend DNS (`MX`, DKIM, SPF) | `mect.org.in` MX `receive-apne1.forge.rmta.net`; `resend._domainkey.mect.org.in` TXT DKIM present; `send.mect.org.in` CNAME `send.forge.rmta.net` with SPF TXT present | PASS |
| DMARC TXT (`_dmarc.mect.org.in`) | No TXT record found in public DNS (optional hardening item outside code release) | NOT CONFIGURED |
| HTTP -> HTTPS Redirect | `http://mect.org.in/` -> `301` -> `https://mect.org.in/` | PASS |
| `www` -> Canonical Redirect | `https://www.mect.org.in/` -> `301` -> `https://mect.org.in/` | PASS |
| Edge TLS Certificate | `CN=mect.org.in`, Issuer Let's Encrypt `YE1`, valid `Nov 2 2026` to `Jan 31 2027` GMT | PASS |
| Security Headers | `strict-transport-security`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin` present | PASS |

---

## 5. Live Production QA (`https://mect.org.in`)

Verified after cutover via headless Chromium/Edge (`scratch/verify-live-prod.mjs`) and HTTP checks:

| Check Area | Details | Status |
|---|---|---|
| Homepage Responsive Matrix | `360px`, `768px`, `1366px`, `1440px`: HTTP `200`, `scrollWidth === innerWidth`, `0` broken images, warm palette applied (`bodyBg=rgb(243, 228, 210)`) | PASS |
| All 19 Routes (`1366px` & `360px`) | `/`, `/about`, `/governance`, `/statutory-disclosures`, `/programmes`, `/csr-partnerships`, `/donate`, `/impact`, `/reports`, `/contact`, `/scholarships`, `/scholarships/apply`, `/scholarships/track`, `/volunteer`, `/faq`, `/privacy`, `/terms`, `/accessibility`, `/admin/login`: all HTTP `200`, zero overflow, zero broken images | PASS |
| Semantic `<h1>` Check | `18/18` public routes report `h1=1`; `/admin/login` uses card heading (`h1=0`, HTTP `200`) | PASS |
| Runtime Console / Page / HTTP Errors | `0` console errors, `0` uncaught page errors, `0` HTTP `>=400` asset failures | PASS |
| Forms & Interactive Controls | Verified DOM rendering on `/donate`, `/volunteer`, `/scholarships/apply`, `/scholarships/track`, `/contact`, `/statutory-disclosures` | PASS |
| Admin Authentication Guard | Unauthenticated `/admin` redirected cleanly to `/admin/login`; `GET /api/v1/admin/dashboard/stats` returned HTTP `401` | PASS |
| Public Static & Verification Assets | `/robots.txt` (`200`), `/sitemap.xml` (`200`), `/google4eacd3ee074d0174.html` (`200`), `/documents/mect-csr1-certificate.png` (`200`, `image/png`) | PASS |
| Backend & DB Live Roundtrip | `/api/v1/health` -> `200 UP`; `/api/v1/public/scholarships/track/MECT-TEST-000` -> clean `404` JSON from PostgreSQL query | PASS |
| AI Health Endpoint | `/api/ai/health` -> `200 operational` (`routingMode: fallback_only`, `activeEngine: groq_cloud_hot_standby`, `keyConfigured: true`) | PASS |
| Live Mutating Transactions (POST forms / donations) | Deliberately NOT submitted to preserve live production database integrity | NOT TESTED (INTENTIONAL) |

---

## 6. Post-Deployment System Health & Rollback Instructions

- **Active Services:** `nginx` (`active`), `postgresql` (`active`), `mect-backend` (`active`), PM2 `mect_frontend` (`online`, PID `343953`), PM2 `oho_tech` (`online`, PID `200322`).
- **VPS Resource Utilization:** CPU load `0.30, 0.22, 0.12`, RAM `2.1Gi / 15Gi` (`13Gi` available), Disk `/` `13G / 193G` (`7%` used).
- **Frontend Rollback Snapshot:** `/opt/mect/frontend-backup-20261110170320`
  *(If rollback is ever needed: swap `/opt/mect/frontend` back to `/opt/mect/frontend-backup-20261110170320` and run `pm2 restart mect_frontend --update-env`.)*
- **Database Rollback Dump:** `/opt/mect/backups/mect_db_backup_20261110_170130.dump`

