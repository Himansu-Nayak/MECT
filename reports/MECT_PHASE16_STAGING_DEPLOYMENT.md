# MECT Phase 16.5–16.7 — Staging Deployment Report

**Target Server:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Scope:** Isolated MECT Staging Environment (`MECT ONLY`; production `mect-backend`, `mect_frontend`, `mect_db`, and `oho_tech` completely untouched)

## 1. Staging Topology

| Component | Location / Binding | Status |
| :--- | :--- | :--- |
| PostgreSQL Staging DB | `mect_staging_db` (restored from `mect_db_phase16_backup_20261112_111844.dump`, PII anonymized) | **ACTIVE** |
| Flyway Migration V11 | `11 \| donation ecosystem cms and rbac \| 1171883131 \| t` (preserved `donations=3, payments=3, receipts=2, portal_users=2`) | **APPLIED** |
| Backend Staging Service | `mect-backend-staging.service` on `127.0.0.1:8082` (`/opt/mect/staging/backend/mahavir-backend-0.1.0-SNAPSHOT.jar`) | **UP (`200`)** |
| Frontend Staging App | PM2 `mect_frontend_staging` (`id: 2`) on `127.0.0.1:3002` (`/opt/mect/staging/frontend`) | **ONLINE (`200`)** |
| Staging Media Storage | `/opt/mect/staging/media` | **PERSISTENT** |

## 2. Defects Caught & Fixed via Staging Loop (Phase 16.13)

1. **VPS Node.js `v20.20.2` vs `.mts` pre-build script:** `npm run build` invokes `node scripts/check-confirm.mts`, which throws `ERR_UNKNOWN_FILE_EXTENSION` on Node `v20.20.2` (requires Node `>=22.6` or `npx next build --webpack` / `.mjs` conversion). Built staging frontend cleanly with `NODE_ENV=production npx next build --webpack` (`39/39` routes compiled).
2. **`GlobalExceptionHandler` missing 400/405 handlers:** Malformed JSON (`HttpMessageNotReadableException`) and wrong HTTP method (`HttpRequestMethodNotSupportedException`) previously fell through to `500 Internal Server Error`. Added explicit `400 Bad Request` and `405 Method Not Allowed` handlers in `GlobalExceptionHandler.java`, re-ran `mvn -f backend/pom.xml test package -B` (`58/58` tests passed), and redeployed JAR to staging.

## 3. Staging Route & Health Verification

- Backend `/api/v1/health`: `200 UP`
- Backend `/api/v1/public/donations/config`: `200` (SBI `33341302498`, IFSC `SBIN0001701`, UPI `86971610172@sbi`)
- Frontend `127.0.0.1:3002` routes returning `200`: `/`, `/about`, `/programmes`, `/donate`, `/portal/login`, `/portal/dashboard`, `/admin/login`, `/admin`, `/admin/settings`, `/admin/cms`, `/admin/media`, `/faq`, `/statutory-disclosures`.
- Media persistence verified: uploaded `staging-dot.png` (`201`, `assetKey=media-c5ea474712da`), served `200 image/png` before and after `systemctl restart mect-backend-staging.service`.
- CMS Draft -> Publish -> Public Read verified (`PUT /admin/cms/pages/staging-smoke/draft` `200`, `POST .../publish` `200`, `GET /public/cms/pages/staging-smoke` `200`).

