# MECT PHASE 29.2 — DATABASE AND MIGRATION SAFETY AUDIT
## Flyway Evolution (V1..V16), Entity Constraints, Referential Integrity & Safe Evolution Strategy

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Target Engine:** PostgreSQL 15+ (Production) / In-Memory H2 (Test Compatibility)  
**Migration Directory:** `backend/src/main/resources/db/migration/`  
**Execution Date:** 19 November 2026  

---

## 1. MIGRATION PIPELINE & VERSIONING INTEGRITY

All 16 Flyway migrations were inspected for ordering, idempotency, nullability safety, and backward compatibility:

| Version | Migration Filename | Scope & Key Constraints Added | Safety & Backward Compatibility |
| :---: | :--- | :--- | :---: |
| **V1** | `V1__initial_schema.sql` | Foundational administrative schema, users, roles | Baseline |
| **V2** | `V2__auth_and_audit_schema.sql` | `audit_logs` table, IP tracking, admin action logs | Additive |
| **V3** | `V3__volunteer_consent_and_district.sql` | Volunteer enrollment with district classification | Additive |
| **V4** | `V4__volunteer_consent_integrity.sql` | Volunteer legal consent checks | Additive |
| **V5** | `V5__volunteer_optimistic_locking.sql` | Optimistic locking on volunteer records (`version`) | Additive |
| **V6** | `V6__scholarship_applications_schema.sql` | Student scholarship workflow and document tracking | Additive |
| **V7** | `V7__portal_users_and_otp_schema.sql` | `portal_users`, `portal_user_profiles`, `donor_otps`, `portal_verified_contacts` | Additive |
| **V8** | `V8__donations_payments_and_receipts_schema.sql` | Core financial ledger: `donations`, `payments`, `donation_receipts`, `manual_bank_transfer_claims` | Additive |
| **V9** | `V9__notification_outbox_schema.sql` | Asynchronous notification queue for emails and SMS | Additive |
| **V10** | `V10__cashfree_payment_gateway_schema.sql` | Cashfree order IDs and transaction references | Additive |
| **V11** | `V11__donation_ecosystem_cms_and_rbac.sql` | Extended RBAC roles and dynamic causes CMS | Additive |
| **V12** | `V12__him_payment_gateway_schema.sql` | Fallback gateway configuration tables | Additive |
| **V13** | `V13__public_documents_library_schema.sql` | Public statutory disclosures and verified document library | Additive |
| **V14** | `V14__hanuman_murti_and_campaigns_schema.sql` | Sri Hanuman Murti monument project tables | Additive |
| **V15** | `V15__sanitize_public_donation_instructions.sql` | Idempotent cleanup of legacy public instruction strings | Safe Data Update |
| **V16** | `V16__donor_authentication_and_district_schema.sql` | `district` column on profiles; composite index on `(portal_user_id, status)` | Non-Breaking Additive |

---

## 2. REFERENTIAL INTEGRITY & CONSTRAINT VERIFICATION

### 2.1 Duplicate Account Prevention
- In `portal_verified_contacts`, a composite unique constraint `UNIQUE (contact_type, contact_value)` guarantees that no mobile number or email address can be claimed by multiple portal accounts simultaneously.
- In `portal_users`, `primary_email` and `primary_phone` are constrained as `UNIQUE`.

### 2.2 Financial Ledger Isolation & Foreign Keys
- `donations.portal_user_id` references `portal_users(id)` with nullability allowed for historical legacy records, while modern checkouts enforce non-null values at the application boundary.
- `payments.donation_id` references `donations(id)` with foreign key integrity.
- `donation_receipts.donation_id` references `donations(id)` with a unique constraint, guaranteeing a 1:1 mapping between a successful transaction and its official tax receipt.
- `manual_bank_transfer_claims.utr_normalized` is unique, strictly barring replay or duplicate claims of bank UTR numbers.

### 2.3 Index Optimization for High-Concurrency Queries
- `idx_donations_portal_user_status` on `(portal_user_id, status)` optimizes dashboard calculations (`sumSuccessfulAmountByUserId`).
- `idx_otp_lookup` on `(channel, target_value, purpose, created_at)` enables rapid, index-backed OTP validation within milliseconds.
- `idx_portal_user_profiles_district` optimizes regional aggregation for administrative reporting.

---

## 3. AUDIT CONCLUSION

All 16 Flyway migrations adhere to additive, forward-only schema principles. Table locks, transaction boundaries, foreign key cascades, and unique constraints are correctly implemented.
