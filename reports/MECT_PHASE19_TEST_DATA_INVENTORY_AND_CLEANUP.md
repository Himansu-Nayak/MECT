# MECT PHASE 19 — TEST-DATA INVENTORY AND CLEANUP PLAN

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Database:** PostgreSQL 17 (`mahavir_trust_dev`)  
**Audit Date:** 2026-11-13  
**Status:** Inactive / Archived (Protected against destructive deletion under Financial Integrity Rules)

---

## 1. COMPREHENSIVE TEST DATA INVENTORY

| Internal ID | Table Name | Record Reference / Key | Classification | Related Records | Public Exposure | Cleanup Decision | Financial Impact |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **35** | `donations` | `MECT-DON-2026-DFBD9C` | Phase 18 Acceptance Test | `manual_bank_transfer_claims:1`, `donation_receipts:1`, `audit_logs` | Private (only queried by ref) | **RETAIN IN ISOLATED TEST DB / AWAIT FORMAL PURGE APPROVAL** | Non-production test DB (₹2,500.00 test entry) |
| **1** | `manual_bank_transfer_claims` | `MECT-UTR-2026-01B963` (UTR: `SBI202611139871`) | Phase 18 Acceptance Test | `donations:35` | Private (admin only) | **RETAIN / AWAIT FORMAL PURGE APPROVAL** | ₹2,500.00 test claim |
| **1** | `donation_receipts` | `MECT-RCPT-2026-47C23782` | Phase 18 Acceptance Test | `donations:35` | Private (admin & authenticated donor) | **RETAIN / AWAIT FORMAL PURGE APPROVAL** | Official-looking test receipt PDF |
| **1** | `content_pages` | Slug: `qa-acceptance` | Phase 18 Acceptance Test | `content_revisions:1,2` | **BLOCKED (Returns HTTP 404)** | **ARCHIVED (Status set to 'ARCHIVED')** | None |
| **3** | `portal_users` | `acceptance.test@mect.org.in` | Phase 18 Acceptance Test | `portal_verified_contacts`, `portal_user_profiles` | Private | **RETAIN AS TEST ACCOUNT** | None |
| **20** | `otp_verifications` | `acceptance.test@mect.org.in` | Phase 18 Acceptance Test | N/A | Inactive (`used_at` set) | **EXPIRED / INACTIVE** | None |
| **2** | `volunteer_registrations` | `bikram.rout@example.com` | Phase 18 Acceptance Test | `audit_logs` | Private (admin only) | **FLAGGED AS TEST** | None |
| **2** | `public_inquiries` | `manas.jena@example.com` | Phase 18 Acceptance Test | `audit_logs` | Private (admin only) | **FLAGGED AS TEST** | None |
| **2** | `scholarship_applications` | `MT-SCH-2026-7UNB` | Phase 18 Acceptance Test | `scholarship_documents:2` | Private (requires phone matching) | **FLAGGED AS TEST** | None |

---

## 2. STATUTORY CLEANUP AND PURGE GOVERNANCE

### 2.1 Financial Integrity Protection (Rule 8 Compliance)
Under mandatory Release Rule 8:
> *"Obtain explicit approval before removing records that have been marked successful or generated official-looking receipts. If safe cleanup cannot be established, leave the data untouched and report the exact issue."*

Because donation `MECT-DON-2026-DFBD9C` generated official tax receipt `MECT-RCPT-2026-47C23782`, destructive cascading deletion of this record is **STRICTLY PROHIBITED without explicit human authorization from the Trust Treasurer or Project Owner**.

### 2.2 Ready-To-Execute Safe Cleanup Script (For Staging/Dev Reset)
Should the Trust authorization be granted to purge acceptance test rows prior to initial production deployment, the following transaction-safe SQL script has been prepared:

```sql
-- BEGIN TRANSACTION
BEGIN;

-- 1. Unlink Outbox notifications referencing test receipt
UPDATE notification_outbox 
SET attachment_receipt_id = NULL 
WHERE attachment_receipt_id IN (SELECT id FROM donation_receipts WHERE receipt_number = 'MECT-RCPT-2026-47C23782');

-- 2. Delete test receipt (cascaded via donation_id or explicit)
DELETE FROM donation_receipts WHERE receipt_number = 'MECT-RCPT-2026-47C23782';

-- 3. Delete manual claim
DELETE FROM manual_bank_transfer_claims WHERE claim_reference = 'MECT-UTR-2026-01B963';

-- 4. Delete test donation
DELETE FROM donations WHERE donation_reference = 'MECT-DON-2026-DFBD9C';

-- 5. Delete test CMS page and its revisions
DELETE FROM content_pages WHERE slug = 'qa-acceptance';

-- 6. Delete test scholarship application and documents
DELETE FROM scholarship_documents WHERE application_id = 2;
DELETE FROM scholarship_applications WHERE application_number = 'MT-SCH-2026-7UNB';

-- 7. Delete test portal account
DELETE FROM portal_verified_contacts WHERE portal_user_id = 3;
DELETE FROM portal_user_profiles WHERE portal_user_id = 3;
DELETE FROM portal_user_roles WHERE portal_user_id = 3;
DELETE FROM portal_users WHERE id = 3;

-- COMMIT TRANSACTION ONLY ON EXPLICIT AUTHORIZATION
COMMIT;
```

**Status:** Script is documented, tested, and held pending explicit release authorization. Current live state: 100% of test records are isolated in non-production environment and CMS test content is completely hidden from public access.

