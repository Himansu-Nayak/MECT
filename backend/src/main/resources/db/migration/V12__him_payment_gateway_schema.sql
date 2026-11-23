-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V12: HIM SECURE UPI PAYMENT GATEWAY SCHEMA
-- Rollback-safe additive schema compatible with PostgreSQL and H2.
-- ============================================================================

-- 1. Add HIM provider settings to payment_configurations
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_upi_id VARCHAR(120) NOT NULL DEFAULT '86971610172@sbi';
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_merchant_name VARCHAR(160) NOT NULL DEFAULT 'MAHAVEER EDUCATIONAL & CHARITABLE TRUST';
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_instructions TEXT NOT NULL DEFAULT 'Pay using HIM Secure UPI. Scan the dynamic QR or transfer to verified VPA in any UPI app, then submit the 12-digit UTR for verification.';
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_verification_mode VARCHAR(40) NOT NULL DEFAULT 'MANUAL_VERIFICATION';
ALTER TABLE payment_configurations ADD COLUMN IF NOT EXISTS him_webhook_secret VARCHAR(120) DEFAULT '';

-- 2. HIM Payment Attempts table
CREATE TABLE IF NOT EXISTS him_payment_attempts (
    id BIGSERIAL PRIMARY KEY,
    attempt_reference VARCHAR(50) NOT NULL UNIQUE,
    donation_id BIGINT NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    upi_uri TEXT,
    qr_svg TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'INITIATED',
    donor_utr VARCHAR(80),
    donor_utr_normalized VARCHAR(80),
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(100),
    bank_statement_ref VARCHAR(120),
    verification_notes TEXT,
    rejection_reason VARCHAR(500),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_him_attempts_donation ON him_payment_attempts(donation_id);
CREATE INDEX IF NOT EXISTS idx_him_attempts_status ON him_payment_attempts(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_him_attempts_utr_norm ON him_payment_attempts(donor_utr_normalized);

-- 3. HIM Webhook Events table (Deduplicated, HMAC-SHA256 verified)
CREATE TABLE IF NOT EXISTS him_webhook_events (
    id BIGSERIAL PRIMARY KEY,
    delivery_id VARCHAR(120) NOT NULL UNIQUE,
    event_type VARCHAR(60) NOT NULL,
    payload_sha256 VARCHAR(64) NOT NULL,
    raw_payload TEXT NOT NULL,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    processing_status VARCHAR(40) NOT NULL DEFAULT 'RECEIVED',
    error_message VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_him_webhook_delivery ON him_webhook_events(delivery_id);
