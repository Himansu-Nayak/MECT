-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V7: PUBLIC PORTAL USERS, OTP & CONSENT LEDGER
-- ============================================================================

CREATE TABLE IF NOT EXISTS portal_users (
    id BIGSERIAL PRIMARY KEY,
    user_uuid VARCHAR(36) NOT NULL UNIQUE,
    primary_email VARCHAR(255) UNIQUE,
    primary_phone VARCHAR(30) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    deletion_requested BOOLEAN NOT NULL DEFAULT FALSE,
    deletion_requested_at TIMESTAMP WITH TIME ZONE,
    deletion_reason TEXT,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portal_users_email ON portal_users(primary_email);
CREATE INDEX IF NOT EXISTS idx_portal_users_phone ON portal_users(primary_phone);
CREATE INDEX IF NOT EXISTS idx_portal_users_status ON portal_users(status);

CREATE TABLE IF NOT EXISTS portal_user_roles (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
    role_name VARCHAR(40) NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (portal_user_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_portal_roles_user ON portal_user_roles(portal_user_id);

CREATE TABLE IF NOT EXISTS portal_user_profiles (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL UNIQUE REFERENCES portal_users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    address_line VARCHAR(300) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(12) NOT NULL,
    country VARCHAR(80) NOT NULL DEFAULT 'India',
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    preferred_language VARCHAR(30) NOT NULL DEFAULT 'en',
    pan_optional VARCHAR(16),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portal_verified_contacts (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
    contact_type VARCHAR(20) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (contact_type, contact_value)
);

CREATE INDEX IF NOT EXISTS idx_verified_contacts_user ON portal_verified_contacts(portal_user_id);

CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGSERIAL PRIMARY KEY,
    purpose VARCHAR(30) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    target_value VARCHAR(255) NOT NULL,
    portal_user_id BIGINT REFERENCES portal_users(id) ON DELETE CASCADE,
    otp_hash VARCHAR(255) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 5,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resend_available_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    request_ip VARCHAR(60),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otp_lookup ON otp_verifications(channel, target_value, purpose, created_at);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

CREATE TABLE IF NOT EXISTS portal_refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_portal_tokens_user ON portal_refresh_tokens(portal_user_id);

CREATE TABLE IF NOT EXISTS notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL UNIQUE REFERENCES portal_users(id) ON DELETE CASCADE,
    email_receipts_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_updates_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS communication_consents (
    id BIGSERIAL PRIMARY KEY,
    portal_user_id BIGINT NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL,
    phone_number VARCHAR(30),
    consent_status VARCHAR(20) NOT NULL,
    consent_version VARCHAR(30) NOT NULL,
    consent_source VARCHAR(60) NOT NULL,
    consent_text TEXT NOT NULL,
    consented_at TIMESTAMP WITH TIME ZONE,
    opt_out_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (portal_user_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_consents_user_channel ON communication_consents(portal_user_id, channel);

