-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V20: GOOGLE OIDC & DONOR IDENTITY LINKING
-- ============================================================================

ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_sub VARCHAR(100);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS google_email VARCHAR(255);
ALTER TABLE portal_users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(30) DEFAULT 'OTP';

CREATE UNIQUE INDEX IF NOT EXISTS idx_portal_users_google_sub ON portal_users(google_sub);
CREATE INDEX IF NOT EXISTS idx_portal_users_google_email ON portal_users(google_email);
