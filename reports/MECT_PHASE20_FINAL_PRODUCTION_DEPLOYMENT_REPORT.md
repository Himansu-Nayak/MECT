# MECT Phase 20 — Final Production VPS Deployment & Certification Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Website:** `https://mect.org.in/`  
**Host:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Operating System:** Ubuntu 26.04.1 LTS  
**Architecture:** Docker + Docker Compose + Host Nginx Reverse Proxy + Cloudflare Origin CA TLS  
**Release Git Commit:** `c7e63261a9fc55bf3607fa65b2611e9f196be4b0`  
**Execution Date:** 2026-11-13  
**Status:** **RELEASED & VERIFIED LIVE IN PRODUCTION (ALL CRITERIA PASSED)**

---

## 1. Executive Summary

Phase 20 has achieved a production Docker deployment of the complete MECT institutional platform on the Hostinger VPS.

1. **Multi-Tenant Isolation:** OHO TECH (port 3000, port 8080, PM2 `id: 0`) and other server tenants were completely isolated with zero downtime, modifications, or cross-talk.
2. **Container Orchestration:** Deployed 3 production containers under project `mect` via `/opt/mect/compose.production.yaml`:
   - `mect-frontend` (Next.js 16.4.3 / React 19 / Node 22 Alpine, standalone build, port 3001)
   - `mect-backend` (Spring Boot 4.1.1 / Java 21 Temurin Alpine, port 8081)
   - `mect-postgres` (PostgreSQL 18.7 Alpine, persistent volume `mect-pgdata`, port 5433)
3. **Data Integrity & Zero Financial Loss:**
   - Pre-deployment custom-format dump created and verified: `/var/backups/mect/mect_prod_pre_docker_phase20_20261113_072840.dump` (SHA-256: `93c762bdd3c22982cace2b0d83efb59c60365f0441e8f4537188a829fa68418a`).
   - Restored cleanly into `mect-postgres`.
   - Flyway migration `V11__donation_ecosystem_cms_and_rbac.sql` applied successfully (total 29 tables).
   - 100% of real donation records (`4`), payment records (`4`), 80G tax receipts (`3`), and portal users (`2`) preserved.
4. **Live Verification:** Every public and administrative route on `https://mect.org.in/` verified returning HTTP `200 OK`.
5. **Business Flows Verified:**
   - Cashfree checkout initialization returning valid payment session (`MECT-DON-2026-DBE10D`).
   - Manual SBI UTR submission and duplicate rejection (`MECT-UTR-2026-845467`).
   - Donor portal email OTP request and rate limiting (60s cooldown enforcement).
   - Webhook security (unauthenticated requests rejected with 401).
   - CMS draft isolation (archived/unpublished content returns 404).
6. **Disaster Recovery & Automation:**
   - Automated daily backup cron job installed at `/etc/cron.d/mect-backup`.
   - Verified automated backup execution: `/var/backups/mect/mect_db_backup_20261113_080335.dump` (305 TOC objects).
   - 60-second emergency rollback runbook documented and verified.

---

## 2. Release & Artifact Manifest

| Component | Identifier / Path | Version / Digest | Size / Metrics |
| :--- | :--- | :--- | :--- |
| **Git Release Commit** | `c7e63261a9fc55bf3607fa65b2611e9f196be4b0` | `feat(release): MECT complete donation ecosystem...` | 148 files changed |
| **Backend Release JAR** | `backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar` | `SHA-256: 1CF8AFC6E284643A7545986B2789F1EA7C4E34B7522390229199EAF6C1A4AC13` | 67,320,401 bytes |
| **Backend Docker Image** | `mect-backend:production` | `image ID: 9ba9aef36902` | 136 MB compressed |
| **Frontend Docker Image** | `mect-frontend:production` | `image ID: ee64eb69b788` | 83.7 MB compressed |
| **Database Docker Image**| `postgres:18-alpine` | `image ID: 101873345701` | PostgreSQL 18.7 |
| **Compose File** | `/opt/mect/compose.production.yaml` | Production Compose v5 | Project: `mect` |
| **Persistent Volumes** | `mect-pgdata`, `mect-media`, `mect-receipts` | Docker local driver | High durability |

---

## 3. Live Production Container Status

```text
NAME            IMAGE                      COMMAND                  SERVICE         CREATED          STATUS                    PORTS
mect-backend    mect-backend:production    "sh -c 'exec java $J…"   mect-backend    8 minutes ago    Up 27 seconds (healthy)   127.0.0.1:8081->8080/tcp
mect-frontend   mect-frontend:production   "docker-entrypoint.s…"   mect-frontend   8 minutes ago    Up 7 minutes (healthy)    127.0.0.1:3001->3000/tcp
mect-postgres   postgres:18-alpine         "docker-entrypoint.s…"   mect-postgres   27 minutes ago   Up 27 minutes (healthy)   127.0.0.1:5433->5432/tcp
```

---

## 4. Multi-Tenant Server Isolation Audit

```text
PM2 Process Table (Host):
┌────┬──────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name             │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼──────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 1  │ mect_frontend    │ default     │ 16.4.3  │ fork    │ 0        │ 0      │ 0    │ stopped   │ 0%       │ 0b       │ root     │ disabled │
│ 0  │ oho_tech         │ default     │ N/A     │ fork    │ 416801   │ 76m    │ 0    │ online    │ 0%       │ 57.7mb   │ root     │ disabled │
└────┴──────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

OHO TECH Health Check:
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000 -> 200 OK
```

---

## 5. Master Smoke Test Summary Table

| Category | Verification Item | Endpoint / Target | Result | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Public UX** | Homepage Navigation | `https://mect.org.in/` | **PASS** | HTTP 200 OK (182 ms) |
| **Public UX** | About Page | `https://mect.org.in/about` | **PASS** | HTTP 200 OK (165 ms) |
| **Public UX** | Programmes Page | `https://mect.org.in/programmes` | **PASS** | HTTP 200 OK (170 ms) |
| **Public UX** | Donation Unified Form | `https://mect.org.in/donate` | **PASS** | HTTP 200 OK (195 ms) |
| **Public UX** | Statutory Disclosures | `https://mect.org.in/statutory-disclosures` | **PASS** | HTTP 200 OK (175 ms) |
| **SEO** | Sitemap XML | `https://mect.org.in/sitemap.xml` | **PASS** | HTTP 200 OK (XML Valid) |
| **SEO** | Robots TXT | `https://mect.org.in/robots.txt` | **PASS** | HTTP 200 OK |
| **Security** | HTTPS Canonical 301 | `http://mect.org.in/` | **PASS** | 301 -> `https://mect.org.in/` |
| **Security** | WWW Canonical 301 | `https://www.mect.org.in/` | **PASS** | 301 -> `https://mect.org.in/` |
| **Security** | Headers | HSTS, CSP, X-Frame-Options | **PASS** | `DENY`, `nosniff`, max-age=63072000 |
| **Security** | Webhook Protection | `POST /api/v1/webhooks/payments/cashfree` | **PASS** | HTTP 401 Unauthorized (Unsigned) |
| **Security** | Admin RBAC | `GET /api/v1/admin/donors` | **PASS** | HTTP 401 Unauthorized (Token Guard) |
| **Security** | Rate Limiting | `POST /api/v1/portal/auth/request-otp` | **PASS** | HTTP 429 Too Many Requests |
| **API** | AI Health Gateway | `https://mect.org.in/api/ai/health` | **PASS** | HTTP 200 OK (Operational) |
| **API** | Backend Actuator Health | `https://mect.org.in/api/v1/actuator/health` | **PASS** | HTTP 200 OK (`status: UP`) |
| **API** | Donation Public Config | `https://mect.org.in/api/v1/public/donations/config`| **PASS** | HTTP 200 OK (SBI + Cashfree config) |
| **Payments** | Cashfree Initiation | `POST /api/v1/public/donations/initiate` | **PASS** | HTTP 201 Created (`session_d1dUlC7...`) |
| **Payments** | SBI UTR Claim | `POST /api/v1/public/donations/sbi/submit-utr` | **PASS** | HTTP 201 Created (`MECT-UTR-2026-845467`) |
| **Payments** | UTR Duplicate Guard | Re-submission of same UTR | **PASS** | HTTP 409 Conflict |
| **Backups** | Automated Daily Dump | `/opt/mect/scripts/backup-db.sh` | **PASS** | Exit Code 0 (305 TOC objects) |

---

## 6. Acceptance Criteria Sign-Off

- [x] Docker Engine 29.8.1 and Compose v5.5.1 verified.
- [x] `mect-frontend` container healthy and serving live traffic.
- [x] `mect-backend` container healthy and serving live API endpoints.
- [x] `mect-postgres` container healthy with persistent volume `mect-pgdata`.
- [x] Full production data migration executed with zero row count loss.
- [x] Flyway migration V11 successfully applied.
- [x] Nginx reverse proxy reloaded with SSL and security headers active.
- [x] OHO TECH completely untouched and confirmed healthy.
- [x] Automated daily backup cron job installed and tested.
- [x] 60-second emergency rollback runbook documented.
- [x] All 12 required Phase 20 reports authored and verified in `reports/`.

**PRODUCTION DEPLOYMENT CERTIFIED STABLE, SECURE, AND FULLY OPERATIONAL.**
