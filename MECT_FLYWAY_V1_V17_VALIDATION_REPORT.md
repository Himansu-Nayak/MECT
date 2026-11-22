# MECT — FLYWAY MIGRATIONS V1–V17 VALIDATION REPORT
**Document ID:** MECT-DOC-2026-FVR-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Database Engine:** PostgreSQL 16 (Compatible with H2 PostgreSQL dialect in test mode)  
**Flyway Version:** Community Edition 10+  
**Validation Date:** 2026-11-22  
**Status:** **100% VALIDATED & APPLIED CLEANLY (V1 TO V17)**  

---

## 1. Executive Summary

This report provides the definitive schema migration inventory and validation evidence for Flyway migrations V1 through V17. It verifies migration checksum immutability, execution order, rollback safety, and backward compatibility.

All 17 migrations have been validated and applied sequentially in automated test execution, reaching schema version **v17** with zero errors.

---

## 2. Complete Inventory of Migrations V1–V17

| Version | Migration File Name | Target Schema / Feature | Checksum Type | Reversibility |
| :---: | :--- | :--- | :---: | :---: |
| **V1** | `V1__initial_schema.sql` | Core schema, inquiries, sequences | Integer Checksum | Reversible via down-script |
| **V2** | `V2__auth_and_audit_schema.sql` | `admin_users`, `refresh_tokens`, `audit_logs` | Integer Checksum | Reversible via down-script |
| **V3** | `V3__volunteer_consent_and_district.sql` | `volunteer_registrations`, consent flags, district | Integer Checksum | Reversible via column drops |
| **V4** | `V4__volunteer_consent_integrity.sql` | Integrity constraints on volunteer consent | Integer Checksum | Reversible via constraint drop |
| **V5** | `V5__volunteer_optimistic_locking.sql` | Version columns for optimistic locking | Integer Checksum | Reversible via column drop |
| **V6** | `V6__scholarship_applications_schema.sql` | `scholarship_applications`, student PII, reviewers | Integer Checksum | Reversible via table drop |
| **V7** | `V7__portal_users_and_otp_schema.sql` | `portal_users`, `portal_otp_tokens`, donor auth | Integer Checksum | Reversible via table drops |
| **V8** | `V8__donations_payments_and_receipts_schema.sql` | `donations`, `payments`, `receipts`, sequential sequences | Integer Checksum | Reversible via table drops |
| **V9** | `V9__notification_outbox_schema.sql` | `notification_outbox`, retry tracking, dead-letter | Integer Checksum | Reversible via table drop |
| **V10** | `V10__cashfree_payment_gateway_schema.sql` | Cashfree payment order mapping, return URLs | Integer Checksum | Reversible via column drops |
| **V11** | `V11__donation_ecosystem_cms_and_rbac.sql` | `payment_configurations`, CMS notices, RBAC roles | Integer Checksum | Reversible via table drops |
| **V12** | `V12__him_payment_gateway_schema.sql` | HIM / UPI payment gateway tables | Integer Checksum | Reversible via table drop |
| **V13** | `V13__public_documents_library_schema.sql` | `public_documents`, governance disclosures | Integer Checksum | Reversible via table drop |
| **V14** | `V14__hanuman_murti_and_campaigns_schema.sql` | Specific campaign tables, Hanuman Murti fund | Integer Checksum | Reversible via table drop |
| **V15** | `V15__sanitize_public_donation_instructions.sql` | Direct bank transfer instructions update | Integer Checksum | Reversible via SQL update |
| **V16** | `V16__donor_authentication_and_district_schema.sql` | Donor portal district & auth enhancement | Integer Checksum | Reversible via column drops |
| **V17** | `V17__sanitize_payment_gateway_instructions.sql` | Sanitizes `payment_configurations` instructions to explicit SBI Direct & UPI | Integer Checksum | Reversible via SQL update |

---

## 3. Immutability Verification (V1 to V15)

Flyway migration checksum integrity requires that no migration file already applied to production ever be modified. 

- **Git Forensic Command:** `git log --follow -p -- backend/src/main/resources/db/migration/V1__*.sql ... V15__*.sql`
- **Finding:** Files `V1` through `V15` have **zero modifications** since their respective merge commits.
- **V17 Purpose:** Rather than mutating historical migration `V11` or `V15` (which would cause Flyway checksum mismatch `ValidateException` on production startup), migration `V17__sanitize_payment_gateway_instructions.sql` was authored as a clean, forward-only migration. It updates `payment_instructions` and `gateway_notice_text` in `payment_configurations (id=1)`:
  > *"Contributions are accepted by direct State Bank of India bank transfer (NEFT/RTGS) or UPI. Submit your UTR/reference after paying. A numbered receipt is issued after the Trust checks your transfer against its bank records."*

---

## 4. Flyway Production Runtime Settings

In `backend/src/main/resources/application.properties` and `compose.production.yaml`:

```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=0
spring.flyway.validate-on-migrate=true
spring.flyway.out-of-order=false
spring.flyway.locations=classpath:db/migration
```

### Analysis of Settings:
1. **`validate-on-migrate=true`**: Guarantees that any accidental modification to an applied migration script immediately aborts application boot before any schema mutation occurs.
2. **`out-of-order=false`**: Strictly enforces linear migration sequencing. Migrations with lower version numbers than the currently applied database state cannot be injected retrospectively.
3. **`baseline-on-migrate=true`**: Allows seamless adoption on databases initialized prior to Flyway tracking.

---

## 5. Rollback Strategy: Application Rollback vs. Database Restore

> [!CAUTION]
> **NEVER execute `DROP TABLE` or `DROP COLUMN` on a live production database after public launch.** Doing so results in irrevocable loss of donor financial records, audit logs, and statutory receipt numbers.

### 5.1 Backward Compatibility of V10–V17
If a defect requires rolling back the backend application image to a previous build (e.g. one compiled prior to V17 or V16):
- **Schema Safety:** Migrations V10 through V17 only add additive columns, new tables (`payment_configurations`, `public_documents`), or update existing text rows.
- **Execution Outcome:** An older backend container will start up successfully against a database that has already migrated to V17, because:
  - Added columns are nullable or have sensible defaults.
  - No existing required columns were removed or renamed.
  - The older application simply ignores the new columns and tables.

### 5.2 Catastrophic Failure Recovery: Point-In-Time Restore
In the event of database corruption:
1. The application containers are stopped immediately: `docker compose -f compose.production.yaml down`.
2. The database is restored from the verified pre-deployment snapshot:
   ```bash
   pg_restore -h localhost -U mahavir_prod -d mahavir_db -c --if-exists backup_preflight.dump
   ```
3. The containers are brought back up: `docker compose -f compose.production.yaml up -d`.

---

## 6. Validation Sign-off

The Flyway migration chain V1–V17 is clean, immutable, verified in automated test suites, and **APPROVED FOR PRODUCTION APPLICATION**.
