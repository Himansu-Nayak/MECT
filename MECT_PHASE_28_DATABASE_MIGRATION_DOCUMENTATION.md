# MECT PHASE 28 — DATABASE MIGRATION & SCHEMA SPECIFICATION
## Comprehensive Data Architecture, Integrity Constraints, Audit Trails & Rollback Procedures

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 28 — Premium Donor Authentication & Donation Experience Transformation  
**Engine:** PostgreSQL 16 (Production) / Flyway 10+ / H2 In-Memory (Test Isolation)  
**Latest Migration:** `V16__donor_authentication_and_district_schema.sql`

---

## 1. EXECUTIVE SCHEMA OVERVIEW

To support mandatory mobile OTP authentication, comprehensive donor profile tracking, multi-gateway donation lifecycles, and cryptographic Section 80G receipting, MECT utilizes a sequential, version-controlled Flyway schema.

Phase 28 establishes zero-downtime, non-destructive schema evolution. It reuses existing robust entities from migrations `V7`, `V8`, and `V11` while introducing migration `V16` to enforce geographic district indexing and high-throughput donation status queries.

---

## 2. RELEVANT ENTITIES & TABLE DICTIONARY

### 2.1 `portal_users` (Table: `portal_users`, Migration: `V7`)
The primary identity entity representing public supporters, recurring donors, and alumni.

| Column | Type | Nullable | Default | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | NO | Auto | Primary Key. |
| `user_uuid` | `VARCHAR(36)` | NO | None | Unique immutable UUID (RFC 4122) for external API references. |
| `primary_email` | `VARCHAR(255)` | YES | None | Verified canonical email address (`UNIQUE`). |
| `primary_phone` | `VARCHAR(30)` | YES | None | Verified canonical E.164 phone (`UNIQUE`, e.g. `+919853608113`). |
| `status` | `VARCHAR(30)` | NO | `'ACTIVE'` | Account status (`ACTIVE`, `SUSPENDED`, `LOCKED`). |
| `profile_completed` | `BOOLEAN` | NO | `FALSE` | Indicates whether mandatory legal profile attributes are supplied. |
| `deletion_requested`| `BOOLEAN` | NO | `FALSE` | DPDP/GDPR deletion flag. Preserves statutory financial ledgers. |
| `deletion_requested_at` | `TIMESTAMP WITH TIME ZONE` | YES | None | Timestamp of privacy deletion request. |
| `deletion_reason` | `TEXT` | YES | None | Documented reason submitted by donor. |
| `version` | `BIGINT` | NO | `0` | Optimistic locking counter. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NO | `CURRENT_TIMESTAMP` | Account creation timestamp. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | NO | `CURRENT_TIMESTAMP` | Last modification timestamp. |

*Indexes:*
- `idx_portal_users_email` on `primary_email`
- `idx_portal_users_phone` on `primary_phone`
- `idx_portal_users_status` on `status`

---

### 2.2 `portal_user_profiles` (Table: `portal_user_profiles`, Migrations: `V7`, `V16`)
Holds legal donor attributes required for Section 80G statutory receipting and tax authority filing.

| Column | Type | Nullable | Default | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | NO | Auto | Primary Key. |
| `portal_user_id` | `BIGINT` | NO | None | `REFERENCES portal_users(id) ON DELETE CASCADE` (`UNIQUE`). |
| `full_name` | `VARCHAR(150)` | NO | None | Legal full name matching official government identity. |
| `address_line` | `VARCHAR(300)` | NO | None | Full street address for physical receipting records. |
| `city` | `VARCHAR(100)` | NO | None | City or Town. |
| `district` | `VARCHAR(100)` | YES | None | **Added in V16.** Administrative District (e.g. Balangir, Khordha). |
| `state` | `VARCHAR(100)` | NO | None | State / Union Territory (e.g. Odisha). |
| `pin_code` | `VARCHAR(12)` | NO | None | 6-digit Indian Postal Code. |
| `country` | `VARCHAR(80)` | NO | `'India'` | Sovereign country. |
| `date_of_birth` | `DATE` | YES | None | Optional donor DOB. |
| `preferred_language`| `VARCHAR(30)`| NO | `'en'` | Interface preference (`en`, `or`, `hi`). |
| `pan_optional` | `VARCHAR(16)` | YES | None | Formatted Indian PAN (`[A-Z]{5}[0-9]{4}[A-Z]{1}`). |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | NO | `CURRENT_TIMESTAMP` | Last profile sync timestamp. |

*Indexes:*
- `idx_portal_user_profiles_district` on `district` (**V16**)

---

### 2.3 `otp_verifications` (Table: `otp_verifications`, Migration: `V7`)
Cryptographic and rate-limited ledger for mobile SMS and email one-time passwords.

| Column | Type | Nullable | Default | Constraints & Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | NO | Auto | Primary Key. |
| `purpose` | `VARCHAR(30)` | NO | None | `LOGIN`, `DONATION_AUTH`, `CONTACT_CHANGE`, `DELETION`. |
| `channel` | `VARCHAR(20)` | NO | None | `PHONE`, `EMAIL`. |
| `target_value` | `VARCHAR(255)` | NO | None | E.164 phone or lowercase email. |
| `portal_user_id` | `BIGINT` | YES | None | Optional user FK for authenticated workflows. |
| `otp_hash` | `VARCHAR(255)` | NO | None | BCrypt or SHA-256 salted hash of 6-digit code. |
| `attempts` | `INT` | NO | `0` | Failed verification attempts counter. |
| `max_attempts` | `INT` | NO | `5` | Maximum attempts allowed before permanent invalidation. |
| `expires_at` | `TIMESTAMP WITH TIME ZONE` | NO | None | Expiry cutoff (typically 10 minutes from dispatch). |
| `resend_available_at` | `TIMESTAMP WITH TIME ZONE` | NO | None | Rate-limit cooldown timestamp (60 seconds). |
| `used_at` | `TIMESTAMP WITH TIME ZONE` | YES | None | Verification timestamp. Prevents OTP replay attacks. |
| `request_ip` | `VARCHAR(60)` | YES | None | Client IP address for abuse mitigation. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NO | `CURRENT_TIMESTAMP` | Dispatch request timestamp. |

*Indexes:*
- `idx_otp_lookup` on `(channel, target_value, purpose, created_at)`
- `idx_otp_expires` on `expires_at`

---

### 2.4 `donations` (Table: `donations`, Migration: `V8`)
Core immutable financial transaction record.

| Column | Type | Nullable | Constraints & Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGSERIAL` | NO | Primary Key. |
| `donation_reference` | `VARCHAR(40)` | NO | Unique immutable reference (e.g. `MECT-DON-2026-XXXXXX`). |
| `portal_user_id` | `BIGINT` | YES | FK to `portal_users(id)`. Mandatory for all Phase 28 donations. |
| `programme_id` | `BIGINT` | NO | FK to `donation_programmes(id)`. |
| `amount` | `NUMERIC(12, 2)` | NO | Donation amount in INR (>= ₹100). |
| `currency` | `VARCHAR(10)` | NO | `'INR'`. |
| `status` | `VARCHAR(30)` | NO | `CREATED`, `PENDING`, `SUCCESSFUL`, `FAILED`, `CANCELLED`. |
| `donor_name` | `VARCHAR(150)` | NO | Legal full name for statutory tax filing. |
| `donor_email` | `VARCHAR(255)` | YES | Email for PDF receipt delivery. |
| `donor_phone` | `VARCHAR(30)` | YES | Verified E.164 phone. |
| `donor_pan` | `VARCHAR(20)` | YES | Formatted PAN for 80G eligibility. |
| `donor_address` | `VARCHAR(500)` | YES | Postal address for official records. |
| `payment_method` | `VARCHAR(40)` | NO | `GATEWAY_CHECKOUT`, `SBI_MANUAL`, `UPI_QR`. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NO | Creation timestamp. |

*Indexes:*
- `idx_donations_portal_user_status` on `(portal_user_id, status)` (**V16**)
- `idx_donations_reference` on `donation_reference`
- `idx_donations_status` on `status`

---

## 3. MIGRATION SCRIPT DDL: `V16`

```sql
-- ==============================================================================
-- MECT V16 — Donor Authentication, District Jurisdictions & Profile Integrity
-- Enhances portal_user_profiles with administrative district support
-- ==============================================================================

ALTER TABLE portal_user_profiles ADD COLUMN IF NOT EXISTS district VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_portal_user_profiles_district ON portal_user_profiles(district);
CREATE INDEX IF NOT EXISTS idx_donations_portal_user_status ON donations(portal_user_id, status);
```

---

## 4. ROLLBACK & RECOVERY CONSIDERATIONS

1. **Non-Destructive Nature:**
   - Migration `V16` adds one nullable column (`district`) and two read-performance indexes.
   - It contains zero destructive alterations (`DROP TABLE`, `DROP COLUMN`, or `TRUNCATE`).
2. **Backward Compatibility:**
   - Legacy frontend bundles omitting `district` continue to function without error.
   - Applications can query `portal_user_profiles` regardless of whether `district` is populated.
3. **Emergency Rollback Procedure:**
   ```sql
   -- Only to be executed if explicitly authorized by Lead Architect
   DROP INDEX IF EXISTS idx_donations_portal_user_status;
   DROP INDEX IF EXISTS idx_portal_user_profiles_district;
   ALTER TABLE portal_user_profiles DROP COLUMN IF EXISTS district;
   DELETE FROM flyway_schema_history WHERE version = '16';
   ```

---

## 5. VERIFICATION & TEST STATUS

- **Flyway Verification:** Cleanly applied across all automated test suites.
- **Data Integrity Tests:** `DonorAuthenticationAndDonationSecurityPhase28Tests.test12_profileUpdatePersistsDistrictAndPAN` passed.
- **Index Plan Verification:** `EXPLAIN` queries confirm index scans on `idx_donations_portal_user_status` when loading the donor dashboard.
