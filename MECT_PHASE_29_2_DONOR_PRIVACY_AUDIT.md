# MECT PHASE 29.2 — DONOR PRIVACY AND DATA PROTECTION AUDIT
## DPDP Act Alignment, Data Minimisation, PII Masking, Consent Records & Statutory Retention

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Regulatory Framework:** Digital Personal Data Protection (DPDP) Act 2023, IT Act 2000 (SPDI Rules), Income Tax Act 1961 (Section 139 / Form 10BD)  
**Execution Date:** 19 November 2026  

---

## 1. DONOR INFORMATION LIFECYCLE & INVENTORY

The MECT digital platform processes donor and supporter data solely for charitable administration, statutory tax certificate issuance (Section 80G Form 10BD), and transaction receipts. The following personal data elements were audited:

| Data Element | Storage Location | Sensitivity | Retention & Privacy Safeguard | Verification Status |
| :--- | :--- | :---: | :--- | :---: |
| **Full Legal Name** | `portal_user_profiles.full_name`, `donations.donor_name` | PII | Required on official 80G tax receipts. Access limited to owner and Secretariat. | **PASS** |
| **Mobile Number** | `portal_users.primary_phone`, `portal_verified_contacts` | Sensitive PII | E.164 format. Used for mobile OTP and transactional updates. | **PASS** |
| **Email Address** | `portal_users.primary_email`, `portal_verified_contacts` | Sensitive PII | Normalized lower-case. Used for PDF receipt delivery. | **PASS** |
| **Postal Address** | `portal_user_profiles.address_line`, `donations.donor_address` | PII | Required under Income Tax Rule 18AB for Form 10BD annual filings. | **PASS** |
| **District & State** | `portal_user_profiles.district`, `donations.donor_district` | Demographic | Selected from 30 canonical Odisha districts or Others. | **PASS** |
| **Postal PIN Code** | `portal_user_profiles.pin_code`, `donations.donor_pin_code` | PII | 6-digit numeric validation. | **PASS** |
| **Permanent Account Number (PAN)** | `portal_user_profiles.pan_optional`, `donations.donor_pan` | Highly Sensitive Financial PII | **Optional for donors.** Masked in UI (`AAXXXX5474F` via `maskPan`). Required only if donor claims 80G tax rebate. | **PASS** |
| **Donation History** | `donations`, `payments` | Financial Ledger | Tied strictly to `portal_user_id`. Never publicly accessible. | **PASS** |
| **Payment References (UTR, Order IDs)** | `payments.bank_reference`, `manual_bank_transfer_claims` | Financial Audit | Stored for banking reconciliation with State Bank of India. | **PASS** |
| **Tax Receipts (PDFs)** | `donation_receipts` | Legal Instrument | SHA-256 seal. Accessible only by verified donor owner (`403 Forbidden` guard). | **PASS** |
| **Authentication Sessions** | `portal_refresh_tokens`, `donor_otps` | Security Credential | Refresh tokens stored as SHA-256 hashes. OTPs stored as keyed HMAC-SHA256 hashes. | **PASS** |

---

## 2. PRIVACY PRINCIPLES VERIFICATION

### 2.1 Data Minimisation & Proportionality
- **Observation:** Donor registration does not mandate PAN; donors wishing to make general contributions without claiming Indian Income Tax 80G deduction may omit PAN entirely.
- **District Mapping:** Uses standardized Odisha district dropdown (30 districts) to prevent unnecessary collection of extraneous location telemetry or GPS coordinates.
- **No Third-Party Trackers:** Website does not embed third-party advertising SDKs, tracking pixels, or cross-site fingerprinting scripts.

### 2.2 Informed Consent & Purpose Limitation
- **Statutory Terms & Privacy Acknowledgment:** The registration flow (`/register`) and donation checkout (`/donate`) mandate explicit checkbox acknowledgement of MECT terms and privacy policies.
- **WhatsApp Channel Consent:** WhatsApp notifications require explicit opt-in. The consent is recorded in `communication_consents` table capturing:
  - Exact consent wording (`WHATSAPP_CONSENT_TEXT`)
  - Consent version (`wa-v1.0`)
  - Consent timestamp (`consented_at`)
  - Opt-out timestamp (`opt_out_at` upon withdrawal)
  - Source tracking (`PROFILE_COMPLETION`, `PREFERENCES_PORTAL`, or `DELETION_REQUEST_OPTOUT`)

### 2.3 PII Masking & Data Redaction
- **PAN Masking:** `PortalAccountService.maskPan()` redacts characters 3 through 6 (e.g. `ABCDE1234F` becomes `ABXXXX34F`), ensuring full PAN values are not casually displayed on screen or exposed in unprivileged responses.
- **Safe Log Auditing:** `OtpAuthService.java` redacts targets in audit logs by computing a truncated SHA-256 hash (`HmacCryptoUtil.sha256Hex(target).substring(0, 12)`). Raw mobile numbers and OTPs are never written to application logs.

### 2.4 Account Deletion vs Statutory Retention
- **DPDP Act & Tax Mandates:** Section 139 and Form 10BD of the Indian Income Tax Act 1961 require registered charitable trusts to maintain complete books of account and donor contribution records for a minimum statutory period (7 to 8 years).
- **Implementation in `requestDeletionOrCorrection()`:**
  1. Sets `deletion_requested = true` and logs the donor's stated reason.
  2. Immediately revokes optional marketing and updates (`email_updates_enabled = false`).
  3. Immediately revokes WhatsApp messaging consent (`recordWhatsAppConsent(..., false)`).
  4. Preserves underlying financial accounting ledgers and verified 80G tax receipts to satisfy statutory audit mandates without violating personal privacy rights.

---

## 3. AUDIT CONCLUSION

The donor privacy and data governance framework satisfies the principles of data minimisation, explicit consent, PII redaction, and lawful statutory retention under Indian legal frameworks. No unauthorized data leakage pathways were identified.
