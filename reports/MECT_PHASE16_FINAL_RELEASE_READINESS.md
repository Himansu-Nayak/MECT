# MECT Phase 16.11 & 16.14 — Final Production Release Readiness Report

**Date:** 2026-11-12  
**Branch:** `motion-ui` (local `HEAD` `cb5b554` + Phase 15–16 changes, ready to commit/push upon approval)  
**Target:** Staging verified on `srv2000528` (`127.0.0.1:3002` & `127.0.0.1:8082`); **Production untouched pending explicit release authorization**.

## 1. Acceptance Criteria Status

| # | Criterion | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Repository release baseline established | **PASS** | `reports/MECT_PHASE16_RELEASE_BASELINE.md` |
| 2 | VPS infrastructure audited | **PASS** | `reports/MECT_PHASE16_INFRASTRUCTURE_AUDIT.md` |
| 3 | Production configuration validated | **PASS** | Env keys verified against `application.yml`; 0 secrets printed/committed |
| 4 | Production DB backup verified | **PASS** | `mect_db_phase16_backup_20261112_111844.dump` (`206K`, `TOC_COUNT=250`) |
| 5 | Flyway `V11` migration tested on staging | **PASS** | `mect_staging_db` rank `11` (`success = t`), historical rows preserved |
| 6 | Staging deployment succeeded | **PASS** | `mect-backend-staging.service` (`8082`) `UP`, `mect_frontend_staging` (`3002`) `online` (`13/13` routes `200`) |
| 7 | Cashfree webhook & lifecycle tests | **PARTIAL / PASS** | HMAC invalid (`401`), unknown (`404`), `SUCCESS`+receipt (`200`), duplicate (`200`), `FAILED` (`200`), `USER_DROPPED` (`200`), amount mismatch (`400`) passed. Live outbound Cashfree Sandbox order API requires real Cashfree Sandbox `APP_ID`/`SECRET_KEY`. |
| 8 | SBI manual verification & receipt lifecycle | **PASS** | `UTR_SUBMITTED` (`201`) -> duplicate (`409`) -> `VERIFIED` + `MECT-REC-2026-F3BA12` (`200`), `REJECTED` (`200`) |
| 9 | Admin permissions (RBAC) | **PASS** | `ROLE_AUDITOR` (`403` writes, `200` reads), `ROLE_CONTENT_ADMIN` (`403` payment-config) |
| 10 | CMS publishing & Media persistence | **PASS** | Draft -> Publish -> Public `200`; Media `201` survived backend restart (`200 image/png`) |
| 11 | Local build, lint, tests, motion & Playwright | **PASS** | Backend `58/58` tests; `tsc` `0`, `eslint` `0` errors; `audit:motion` `0` failures; Playwright `0` mobile overflow (`320/360/390px`) |
| 12 | Rollback documentation | **PASS** | `reports/MECT_PHASE16_ROLLBACK_PLAN.md` |

## 2. Production Cutover Sequence (Execute Only After Explicit Authorization)

1. Commit & push `motion-ui` (or merge to release branch) and record exact release SHA.
2. Note on VPS Node.js `v20.20.2`: either upgrade VPS Node to `>=22.6` or convert `scripts/check-confirm.mts` -> `.mjs` (or invoke `npx next build --webpack`) during production frontend build.
3. Ensure `APP_MEDIA_STORAGE_DIR=/opt/mect/media` exists (`chown mect:mect`) and is set in `/opt/mect/backend/.env`.
4. Take fresh `mect_db` `pg_dump -Fc`, backup `/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar`, and snapshot `/opt/mect/frontend`.
5. Deploy backend JAR -> `systemctl restart mect-backend.service` -> verify `V11` + `/api/v1/health`.
6. Deploy frontend -> build -> `pm2 restart mect_frontend --update-env` (never restart `oho_tech`).
7. Run post-deploy smoke checks on `https://mect.org.in/` and `/donate`, keeping live `PAYMENT_PROVIDER` switch gated behind explicit sign-off.

