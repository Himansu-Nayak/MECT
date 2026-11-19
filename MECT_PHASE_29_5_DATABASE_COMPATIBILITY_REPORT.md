# MECT PHASE 29.5 — DATABASE COMPATIBILITY REPORT
**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Target Release Commit:** `6a9de8787baa32a5e74814d5c2f8d6a5322bf227`  
**Audit Date:** 2026-11-20  
**Status:** 100% COMPATIBLE — ZERO NEW MIGRATIONS REQUIRED

---

## 1. Executive Summary

Commit `6a9de87` implements frontend and backend enhancements for dual-channel authentication and HTTP connection timeout resilience.

A forensic diff analysis against `ce4cf09` and previous baselines confirms:
- **New JPA Entities:** 0
- **New Tables:** 0
- **New Columns:** 0
- **New Indexes:** 0
- **Altered Constraints:** 0
- **New Flyway Migration Scripts:** 0

The underlying PostgreSQL database schema already natively supports multi-channel OTP verification and dual-contact user records via migrations `V7` through `V16`. Therefore, this release requires **ZERO database downtime** and introduces **ZERO migration risk**.

---

## 2. Forensic Schema Inventory & Entity Mapping

The database schema supporting dual-channel OTP was designed in migration `V7__portal_users_and_otp_schema.sql` and refined through `V16__donor_authentication_and_district_schema.sql`.

### A. `otp_verifications` Table
```sql
CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGSERIAL PRIMARY KEY,
    purpose VARCHAR(30) NOT NULL,
    channel VARCHAR(20) NOT NULL,              -- Stores 'EMAIL' or 'PHONE'
    target_value VARCHAR(255) NOT NULL,         -- Stores lowercase email or E.164 phone
    portal_user_id BIGINT REFERENCES portal_users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,             -- Stores 64-char HMAC-SHA256 hex
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resend_available_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    request_ip VARCHAR(60),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_lookup 
ON otp_verifications(channel, target_value, purpose, created_at);
```
- **Capability:** The `channel` column is a generic `VARCHAR(20)` with composite index on `(channel, target_value, purpose, created_at)`.
- **Finding:** No DDL modification is needed to support `channel = 'EMAIL'`.

### B. `portal_users` Table
```sql
CREATE TABLE IF NOT EXISTS portal_users (
    id BIGSERIAL PRIMARY KEY,
    user_uuid VARCHAR(36) NOT NULL UNIQUE,
    primary_email VARCHAR(255) UNIQUE,          -- Stores verified primary email
    primary_phone VARCHAR(30) UNIQUE,           -- Stores verified primary phone
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    deletion_requested BOOLEAN NOT NULL DEFAULT FALSE,
    deletion_requested_at TIMESTAMP WITH TIME ZONE,
    deletion_reason TEXT,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```
- **Capability:** Both `primary_email` and `primary_phone` are nullable `UNIQUE` columns. A user can register with email first (leaving `primary_phone` null) or phone first (leaving `primary_email` null), or have both populated.
- **Finding:** Fully satisfies dual-channel authentication without schema change.

### C. `portal_verified_contacts` Table
```sql
CREATE TABLE IF NOT EXISTS portal_verified_contacts (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
    contact_type VARCHAR(20) NOT NULL,          -- 'EMAIL' or 'PHONE'
    contact_value VARCHAR(255) NOT NULL,        -- The verified address/number
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contact_type, contact_value)
);
```
- **Capability:** Enables linking multiple verified contacts per user and prevents cross-account duplicate contact assignment.

---

## 3. Flyway Migration Version Status

The repository contains 16 verified migrations:

| Migration File | Description | Target Database Status |
| :--- | :--- | :---: |
| `V1__initial_schema.sql` | Baseline public schemas & roles | Applied |
| `V2__auth_and_audit_schema.sql` | Admin authentication & audit logs | Applied |
| `V3__volunteer_consent_and_district.sql` | Volunteer management & districts | Applied |
| `V4__volunteer_consent_integrity.sql` | Consent integrity checks | Applied |
| `V5__volunteer_optimistic_locking.sql` | Volunteer version locking | Applied |
| `V6__scholarship_applications_schema.sql` | Educational scholarship applications | Applied |
| `V7__portal_users_and_otp_schema.sql` | Portal users, OTP, verified contacts | Applied |
| `V8__donations_payments_and_receipts_schema.sql` | Donations, receipts, financial ledger | Applied |
| `V9__notification_outbox_schema.sql` | Transactional outbox pattern | Applied |
| `V10__cashfree_payment_gateway_schema.sql` | Cashfree payment integration tables | Applied |
| `V11__donation_ecosystem_cms_and_rbac.sql` | CMS, RBAC, donor management | Applied |
| `V12__him_payment_gateway_schema.sql` | Enhanced gateway fields | Applied |
| `V13__public_documents_library_schema.sql` | Statutory documents library | Applied |
| `V14__hanuman_murti_and_campaigns_schema.sql` | Public campaigns & Hanuman Murti | Applied |
| `V15__sanitize_public_donation_instructions.sql` | Instruction sanitizer | Applied |
| `V16__donor_authentication_and_district_schema.sql` | Donor districts & authentication | Applied / Preflight ready |

---

## 4. Backward & Forward Compatibility Assessment

1. **Forward Compatibility:** If release `6a9de87` is deployed, existing accounts and new accounts can be accessed interchangeably via Mobile OTP or Email OTP.
2. **Backward Compatibility:** If the application is rolled back to commit `c5aa4e8` or `9810ed6`, all database rows written by `6a9de87` remain valid because no new tables or columns were added.
3. **Data Loss Risk:** **ZERO.** No drop statements, no rename statements, no column alterations, and no data truncations exist in this release.
