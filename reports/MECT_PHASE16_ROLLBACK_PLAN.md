# MECT Phase 16.12 — Production Rollback Plan

**Policy:** Never blindly reverse Flyway migrations or delete successful/pending payment records. All database changes in `V11` are additive and forward-compatible.

## 1. Pre-Cutover Backup Reference

- **Verified Production Backup:** `/opt/mect/backups/mect_db_phase16_backup_20261112_111844.dump` (`206K`, `chmod 600`, `pg_restore -l` `TOC_COUNT=250`).
- Take one fresh `pg_dump -Fc` + JAR copy + `/opt/mect/frontend` tarball immediately before any authorized production cutover.

## 2. Component Rollback Procedures

1. **Frontend Rollback:**
   - Stop `mect_frontend` via PM2 (`pm2 stop mect_frontend`), swap `/opt/mect/frontend` back to the pre-cutover `/opt/mect/frontend-backup-<TS>` snapshot, and `pm2 restart mect_frontend --update-env`.
2. **Backend Rollback:**
   - Stop `mect-backend.service` (`systemctl stop mect-backend.service`), restore `/opt/mect/backend/mahavir-backend-0.1.0-SNAPSHOT.jar` from `/opt/mect/backups/mahavir-backend.jar.pre_phase16_<TS>`, restore `/opt/mect/backend/.env` backup if altered, and `systemctl start mect-backend.service`.
3. **Database Policy (`V11`):**
   - `V11` only adds new tables (`payment_configuration`, `manual_bank_transfer_claims`, `content_pages`, `content_revisions`, `media_assets`), one nullable/defaulted column (`donations.communication_consent`), and one inactive programme (`GENERAL_FUND`). Earlier `V10` backend code remains schema-compatible without dropping `V11` tables.
   - Only perform `pg_restore` into a clean DB if catastrophic data corruption occurs, preserving any post-cutover webhook/UTR rows first.
4. **Payment & Webhook Continuity:**
   - Keep `CASHFREE_WEBHOOK_SECRET` unchanged on `/api/v1/webhooks/payments/cashfree` so in-flight Cashfree retries continue settling; run manual reconciliation for any `PAYMENT_INITIATED` records after rollback.
5. **Co-Hosted Isolation:**
   - Never restart PM2 `all` or touch `oho_tech` (`id: 0`) or `ohotech_db` during rollback.

