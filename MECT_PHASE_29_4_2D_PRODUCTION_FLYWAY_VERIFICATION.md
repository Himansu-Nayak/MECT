# MECT PHASE 29.4.2D — PRODUCTION POSTGRESQL & FLYWAY VERIFICATION
## Migration Schema State, Flyway History Auditing & Database Version Governance

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `<PROD_VPS_IP>` (`<PROD_HOSTNAME>`)  
**Evaluation Phase:** Phase 29.4.2D — Owner-Assisted VPS Preflight & Database Safety Gate  
**Execution Timestamp (Local):** 2026-11-20T00:48:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:18:00Z  
**Verification Status:** **RECONCILED (Local Migration Baseline + Inferred Remote State)**  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T00:48:00+05:30` (UTC: `2026-11-19T19:18:00Z`)
- **Exact Evidence Source:** Inspection of local Flyway scripts in `backend/src/main/resources/db/migration/`, live responses from public endpoints (`/api/v1/public/donations/programmes`, `/api/v1/public/documents`, `/api/v1/public/donations/config`), and Phase 29.4.1 local rehearsal database verification.
- **Command Used:**
  - `Get-ChildItem -Path "backend\src\main\resources\db\migration" -Filter "*.sql"`
  - Probed `/api/v1/public/donations/programmes` (ID 7 `HANUMAN_MURTI` confirmed).
  - Probed `/api/v1/public/documents` (10 statutory documents confirmed).
  - Probed `/api/v1/public/donations/config` (Sanitized instructions confirmed).
- **Actual Result:**
  - 16 Flyway migration scripts exist locally (`V1` through `V16`).
  - Production database is serving records matching `V14` schema and sanitized text matching `V15`.
  - Direct execution of `SELECT * FROM flyway_schema_history` on the production VPS PostgreSQL container was blocked by the SSH key gate.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Local scripts V1..V16 on disk); **`INFERRED`** (Production database contains V14/V15 data); **`NOT_VERIFIED`** (Exact rows in remote `flyway_schema_history` table pending SSH).
- **Limitations:** Cannot prove absence of failed Flyway rows without direct `psql` query on production database.
- **Recommended Action:** Execute the prepared read-only SQL query via SSH to inspect `flyway_schema_history`.

---

## 2. FLYWAY MIGRATION SCRIPT INVENTORY (LOCAL WORKSPACE)

Direct inspection of `backend/src/main/resources/db/migration/` confirms the complete 16-script migration sequence:

| Migration Version & Script Name | Size | Primary DDL / DML Scope | Local Verification |
| :--- | :--- | :--- | :--- |
| `V1__initial_schema.sql` | 1,388 B | Initial users, roles, and baseline tables | **`VERIFIED_DIRECTLY`** |
| `V2__auth_and_audit_schema.sql` | 2,169 B | Audit logging, password hashes, login history | **`VERIFIED_DIRECTLY`** |
| `V3__volunteer_consent_and_district.sql` | 1,154 B | Volunteer registration and district metadata | **`VERIFIED_DIRECTLY`** |
| `V4__volunteer_consent_integrity.sql` | 524 B | Foreign key constraints on volunteer consent | **`VERIFIED_DIRECTLY`** |
| `V5__volunteer_optimistic_locking.sql` | 314 B | Optimistic locking `version` column | **`VERIFIED_DIRECTLY`** |
| `V6__scholarship_applications_schema.sql` | 3,119 B | Educational scholarship application tables | **`VERIFIED_DIRECTLY`** |
| `V7__portal_users_and_otp_schema.sql` | 4,977 B | Portal users, mobile OTP tables, sessions | **`VERIFIED_DIRECTLY`** |
| `V8__donations_payments_and_receipts_schema.sql`| 7,243 B | Donations, payment ledger, 80G tax receipts | **`VERIFIED_DIRECTLY`** |
| `V9__notification_outbox_schema.sql` | 2,060 B | Transactional SMS/email outbox queue | **`VERIFIED_DIRECTLY`** |
| `V10__cashfree_payment_gateway_schema.sql` | 1,341 B | Cashfree order IDs and transaction references | **`VERIFIED_DIRECTLY`** |
| `V11__donation_ecosystem_cms_and_rbac.sql` | 5,905 B | Content management, programmes, roles | **`VERIFIED_DIRECTLY`** |
| `V12__him_payment_gateway_schema.sql` | 3,057 B | HIM gateway integration and idempotency | **`VERIFIED_DIRECTLY`** |
| `V13__public_documents_library_schema.sql` | 13,367 B| 10 statutory document records and metadata | **`VERIFIED_DIRECTLY`** |
| `V14__hanuman_murti_and_campaigns_schema.sql` | 2,611 B | Hanuman Murti campaign ID 7 and ledger rules | **`VERIFIED_DIRECTLY`** |
| `V15__sanitize_public_donation_instructions.sql` | 707 B | Sanitizes public donation instructions | **`VERIFIED_DIRECTLY`** |
| `V16__donor_authentication_and_district_schema.sql`| 592 B | Adds `district` to portal users and 2 indexes | **`VERIFIED_DIRECTLY`** |

---

## 3. EVIDENCE OF PRODUCTION DATABASE SCHEMA STATE

Although direct terminal access to PostgreSQL on the VPS is currently blocked, active public endpoint probes provide compelling behavioral evidence of the production schema:

1. **Presence of `HANUMAN_MURTI` (Programme ID 7):**
   - Probe: `GET https://mect.org.in/api/v1/public/donations/programmes`
   - Result: Returns object with `id: 7`, `code: "HANUMAN_MURTI"`.
   - Evidence: Table `programmes` contains rows inserted by `V14__hanuman_murti_and_campaigns_schema.sql`.
2. **Presence of 10 Statutory Documents:**
   - Probe: `GET https://mect.org.in/api/v1/public/documents`
   - Result: Returns 10 records matching `V13__public_documents_library_schema.sql`.
3. **Sanitized Payment Instructions:**
   - Probe: `GET https://mect.org.in/api/v1/public/donations/config`
   - Result: Contains exact text: *"All contributions are processed securely online through authorized payment gateways..."*. Matches `V15`.

**Forensic Distinction:** While behavioral evidence confirms the database contains the required data, querying `flyway_schema_history` directly is still required to confirm whether Flyway recorded `success = true` or if any migrations were executed manually.

---

## 4. PREPARED READ-ONLY SQL INSPECTION QUERIES (FOR LEVEL B)

Upon SSH activation, execute the following safe read-only SQL queries to inspect the production database:

```bash
# Query 1: Verify PostgreSQL Engine Version
docker exec mect-postgres psql -U mect_user -d mect_prod -c "SELECT version();"

# Query 2: Inspect Flyway Schema Migration History
docker exec mect-postgres psql -U mect_user -d mect_prod -c "
SELECT installed_rank, version, description, type, script, checksum, installed_on, execution_time, success
FROM flyway_schema_history
ORDER BY installed_rank DESC;
"

# Query 3: Check Table Count & Aggregate Metadata (NO PERSONAL DATA)
docker exec mect-postgres psql -U mect_user -d mect_prod -c "
SELECT schemaname, count(*) as table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY schemaname;
"
```
