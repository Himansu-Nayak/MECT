-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V11: PAYMENT CONFIG, MANUAL SBI CLAIMS, CMS & RBAC
-- Rollback-safe additive schema compatible with PostgreSQL and H2 (MODE=PostgreSQL).
-- ============================================================================

ALTER TABLE donations ADD COLUMN IF NOT EXISTS communication_consent BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'GENERAL_FUND', 'General Charitable Fund', 'Unrestricted trust corpus allocation', 'Supports verified MECT charitable programmes across education, women empowerment, safe water, and community relief as authorised by the Board of Trustees.', TRUE, FALSE, 6
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'GENERAL_FUND');

CREATE TABLE IF NOT EXISTS payment_configurations (
    id BIGINT PRIMARY KEY,
    cashfree_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sbi_qr_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    primary_method VARCHAR(30) NOT NULL DEFAULT 'CASHFREE',
    fallback_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    min_amount NUMERIC(12,2) NOT NULL DEFAULT 1.00,
    max_amount NUMERIC(12,2) NOT NULL DEFAULT 10000000.00,
    suggested_amounts VARCHAR(200) NOT NULL DEFAULT '500,1000,1500,3000,5000,10000',
    general_fund_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    sbi_bank_name VARCHAR(120) NOT NULL DEFAULT 'State Bank of India',
    sbi_account_name VARCHAR(160) NOT NULL DEFAULT 'MAHAVEER EDUCATIONAL & CHARITABLE TRUST',
    sbi_account_number VARCHAR(60) NOT NULL DEFAULT '33341302498',
    sbi_ifsc VARCHAR(30) NOT NULL DEFAULT 'SBIN0001701',
    sbi_branch VARCHAR(160) NOT NULL DEFAULT 'Rajendra College Square, Bolangir, Odisha',
    sbi_upi_id VARCHAR(120) NOT NULL DEFAULT '86971610172@sbi',
    sbi_qr_image_url VARCHAR(500) NOT NULL DEFAULT '/images/mect-sbi-upi-qr.png',
    payment_instructions TEXT NOT NULL DEFAULT 'Verify beneficiary name MAHAVEER EDUCATIONAL CHARITA in your UPI app before confirming transfer, then submit your 12-digit UTR/reference for verification.',
    gateway_notice_text VARCHAR(500) NOT NULL DEFAULT 'Online payments are processed via Cashfree. Direct SBI UPI/bank transfers are verified manually by MECT Accounts before final receipt issuance.',
    statutory_status VARCHAR(40) NOT NULL DEFAULT 'UNCONFIRMED_FY_2026_27',
    statutory_financial_year VARCHAR(30) NOT NULL DEFAULT 'FY 2026-27',
    statutory_effective_date VARCHAR(30) DEFAULT '2024-01-29',
    statutory_expiry_date VARCHAR(30) DEFAULT '2026-03-31',
    statutory_urn_80g VARCHAR(80) DEFAULT 'AADTM5474FF20241',
    statutory_urn_12a VARCHAR(80) DEFAULT 'AADTM5474FE20231',
    statutory_claim_approved BOOLEAN NOT NULL DEFAULT FALSE,
    statutory_disclosure_text TEXT NOT NULL DEFAULT 'Historical Form 10AC Section 12A (URN: AADTM5474FE20231) and Section 80G (URN: AADTM5474FF20241) orders dated 29-01-2024 covered AY 2024-25 to AY 2026-27. Current tax year 2026-27 eligibility is pending Chartered Accountant confirmation.',
    updated_by VARCHAR(100) NOT NULL DEFAULT 'SYSTEM',
    version BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payment_configurations (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM payment_configurations WHERE id = 1);

CREATE TABLE IF NOT EXISTS manual_bank_transfer_claims (
    id BIGSERIAL PRIMARY KEY,
    claim_reference VARCHAR(40) NOT NULL UNIQUE,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    utr_number VARCHAR(80) NOT NULL,
    utr_normalized VARCHAR(80) NOT NULL UNIQUE,
    claimed_amount NUMERIC(12,2) NOT NULL,
    transfer_date DATE NOT NULL,
    remitter_name VARCHAR(160),
    proof_reference VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'UTR_SUBMITTED',
    verification_notes TEXT,
    bank_statement_ref VARCHAR(120),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_manual_claims_donation ON manual_bank_transfer_claims(donation_id);
CREATE INDEX IF NOT EXISTS idx_manual_claims_status ON manual_bank_transfer_claims(status);

CREATE TABLE IF NOT EXISTS content_pages (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(80) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    section_json TEXT NOT NULL,
    draft_json TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
    published_by VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_revisions (
    id BIGSERIAL PRIMARY KEY,
    content_page_id BIGINT NOT NULL REFERENCES content_pages(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    snapshot_json TEXT NOT NULL,
    edited_by VARCHAR(100) NOT NULL,
    change_summary VARCHAR(300),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_revisions_page ON content_revisions(content_page_id);

CREATE TABLE IF NOT EXISTS media_assets (
    id BIGSERIAL PRIMARY KEY,
    asset_key VARCHAR(120) NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(80) NOT NULL,
    file_size BIGINT NOT NULL,
    alt_text VARCHAR(300) NOT NULL,
    focal_point VARCHAR(40) NOT NULL DEFAULT 'center',
    public_url VARCHAR(500) NOT NULL,
    data_base64 TEXT,
    uploaded_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

