-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V8: DONATIONS, DYNAMIC QR PAYMENTS & RECEIPTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS donation_programmes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    tagline VARCHAR(220) NOT NULL,
    description TEXT NOT NULL,
    is_general_fund BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'EDUCATION_LEARNING', 'Education & Learning (Shiksha Setu)', 'Remedial coaching & accredited college fee support', 'Supports after-school remedial learning and direct institutional fee remittance for underprivileged students in Odisha.', FALSE, TRUE, 1
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'EDUCATION_LEARNING');

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'WOMEN_EMPOWERMENT', 'Women Empowerment & Livelihoods (Swavalamban)', 'Vocational tailoring & micro-enterprise toolkits', 'Equips rural women with certified vocational sewing training, fabrication toolkits, and community livelihood support.', FALSE, TRUE, 2
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'WOMEN_EMPOWERMENT');

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'SAFE_WATER_SANITATION', 'Safe Water & Sanitation (Jal Seva)', 'Clean drinking water access & community hygiene', 'Provides safe drinking water distribution during extreme Odisha heatwaves and campus hygiene programmes.', FALSE, TRUE, 3
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'SAFE_WATER_SANITATION');

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'FOOD_SECURITY_RELIEF', 'Food Security & Nutrition (Jan Ahar)', 'Nutritious community meals & relief packs', 'Provides hygienic daily meal support for hospital patient attendants and vulnerable rural families.', FALSE, TRUE, 4
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'FOOD_SECURITY_RELIEF');

INSERT INTO donation_programmes (code, name, tagline, description, is_general_fund, is_active, display_order)
SELECT 'COMMUNITY_WELFARE', 'Community Welfare & Relief (Samaj Kalyan)', 'Urgent distress assistance & rural outreach', 'Supports seasonal relief drives, civic awareness workshops, and community welfare initiatives across Balangir.', FALSE, TRUE, 5
WHERE NOT EXISTS (SELECT 1 FROM donation_programmes WHERE code = 'COMMUNITY_WELFARE');

CREATE TABLE IF NOT EXISTS donations (
    id BIGSERIAL PRIMARY KEY,
    donation_reference VARCHAR(40) NOT NULL UNIQUE,
    portal_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
    programme_id BIGINT NOT NULL REFERENCES donation_programmes(id),
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    frequency VARCHAR(20) NOT NULL DEFAULT 'ONE_TIME',
    donor_name VARCHAR(160) NOT NULL,
    donor_email VARCHAR(255),
    donor_phone VARCHAR(30),
    donor_address TEXT,
    donor_pan VARCHAR(16),
    dedication_message VARCHAR(300),
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED',
    payment_method VARCHAR(30) NOT NULL DEFAULT 'UPI_QR',
    confirmed_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(portal_user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    provider VARCHAR(30) NOT NULL,
    provider_order_id VARCHAR(100),
    provider_qr_id VARCHAR(100),
    provider_payment_id VARCHAR(100),
    upi_uri TEXT,
    qr_image_url TEXT,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED',
    expires_at TIMESTAMP WITH TIME ZONE,
    verified_signature_present BOOLEAN NOT NULL DEFAULT FALSE,
    failure_reason VARCHAR(500),
    refunded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_donation ON payments(donation_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_qr ON payments(provider_qr_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment ON payments(provider_payment_id);

CREATE TABLE IF NOT EXISTS payment_events (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    provider VARCHAR(30) NOT NULL,
    provider_event_id VARCHAR(150) NOT NULL UNIQUE,
    event_type VARCHAR(80) NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    payload_sha256 VARCHAR(64) NOT NULL,
    raw_payload TEXT NOT NULL,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'PROCESSED',
    error_message VARCHAR(500),
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS payment_reconciliation_logs (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    payment_id BIGINT NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    source VARCHAR(40) NOT NULL,
    actor VARCHAR(120) NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reconcile_donation ON payment_reconciliation_logs(donation_id);

CREATE TABLE IF NOT EXISTS donation_receipts (
    id BIGSERIAL PRIMARY KEY,
    donation_id BIGINT NOT NULL UNIQUE REFERENCES donations(id) ON DELETE CASCADE,
    receipt_number VARCHAR(40) NOT NULL UNIQUE,
    donor_display_name VARCHAR(160) NOT NULL,
    programme_name VARCHAR(160) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    receipt_type VARCHAR(50) NOT NULL DEFAULT 'INSTITUTIONAL_PAYMENT_RECEIPT',
    statutory_note TEXT NOT NULL,
    template_version VARCHAR(30) NOT NULL DEFAULT 'v1.0',
    pdf_bytes BYTEA NOT NULL,
    pdf_sha256 VARCHAR(64) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_receipts_number ON donation_receipts(receipt_number);

