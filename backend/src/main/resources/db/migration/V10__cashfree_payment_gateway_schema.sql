-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V10: CASHFREE PAYMENT GATEWAY & CONCURRENCY SAFETY
-- Supports unified Razorpay + Cashfree PG orders, sessions, verification metadata,
-- optimistic locking, and idempotent provider order indexing (H2 & PostgreSQL safe).
-- ============================================================================

ALTER TABLE payments ADD COLUMN IF NOT EXISTS cf_order_id VARCHAR(120);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_session_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_raw_status VARCHAR(60);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_group VARCHAR(60);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS bank_reference VARCHAR(120);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE donations ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_provider_order ON payments(provider, provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_status_expires ON payments(provider, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_donations_status_created_at ON donations(status, created_at);

