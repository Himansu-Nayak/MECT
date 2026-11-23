-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V18: ENTERPRISE WHATSAPP DONATION NOTIFICATION ENGINE
-- ============================================================================

-- 1. Extend donations table with explicit WhatsApp opt-in consent flag
ALTER TABLE donations ADD COLUMN IF NOT EXISTS whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Authorized Administrator WhatsApp Numbers for Real-Time Alerts
CREATE TABLE IF NOT EXISTS whatsapp_recipients (
    id BIGSERIAL PRIMARY KEY,
    phone_number VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_donation BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_claim BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_refund BOOLEAN NOT NULL DEFAULT TRUE,
    notify_daily_summary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_recip_active ON whatsapp_recipients(active);

-- 3. Approved Meta WhatsApp Message Template Configurations
CREATE TABLE IF NOT EXISTS whatsapp_template_configs (
    id BIGSERIAL PRIMARY KEY,
    template_key VARCHAR(80) NOT NULL UNIQUE,
    template_name VARCHAR(120) NOT NULL,
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    category VARCHAR(50) NOT NULL DEFAULT 'UTILITY',
    status VARCHAR(30) NOT NULL DEFAULT 'APPROVED',
    parameter_mappings TEXT,
    sample_body TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed standard approved template configurations
INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_donation_admin_alert', 'mect_donation_admin_alert', 'en', 'UTILITY', 'APPROVED',
       '["donor_name","amount","payment_mode","reference_number","campaign_name"]',
       'MECT Alert: A new donation of INR {{2}} has been received from {{1}} via {{3}} (Ref: {{4}}) for {{5}}.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_donation_admin_alert');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_donation_receipt', 'mect_donation_receipt', 'en', 'UTILITY', 'APPROVED',
       '["donor_name","amount","receipt_number","transaction_date","receipt_url"]',
       'Dear {{1}}, thank you for your generous donation of INR {{2}} to Mahavir Trust. Your official numbered receipt {{3}} dated {{4}} is available at {{5}}.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_donation_receipt');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_donation_pending', 'mect_donation_pending', 'en', 'UTILITY', 'APPROVED',
       '["donor_name","amount","reference_number","date"]',
       'Namaste {{1}}, your direct bank transfer / UPI contribution claim of INR {{2}} (Ref: {{3}}) submitted on {{4}} is received. The Trust will verify it against bank statements shortly.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_donation_pending');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_donation_verified', 'mect_donation_verified', 'en', 'UTILITY', 'APPROVED',
       '["donor_name","amount","reference_number","receipt_number"]',
       'Namaste {{1}}, your contribution claim of INR {{2}} (Ref: {{3}}) has been verified by Mahavir Trust. Numbered receipt: {{4}}.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_donation_verified');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_donation_rejected', 'mect_donation_rejected', 'en', 'UTILITY', 'APPROVED',
       '["donor_name","amount","reference_number","reason"]',
       'Dear {{1}}, your contribution claim of INR {{2}} (Ref: {{3}}) could not be verified against Trust bank records. Note: {{4}}.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_donation_rejected');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_daily_donation_summary', 'mect_daily_donation_summary', 'en', 'UTILITY', 'APPROVED',
       '["date","total_count","total_amount","direct_count","direct_amount","verified_claims_count"]',
       'MECT Daily Summary ({{1}}): Total donations: {{2}} (INR {{3}}). Direct gateway: {{4}} (INR {{5}}). Verified claims: {{6}}.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_daily_donation_summary');

-- 4. Donor Messaging Consent and Preferences (Guest and Registered Donors)
CREATE TABLE IF NOT EXISTS donor_messaging_preferences (
    id BIGSERIAL PRIMARY KEY,
    donor_phone VARCHAR(30) NOT NULL UNIQUE,
    donor_email VARCHAR(255),
    portal_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
    whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE,
    sms_consent BOOLEAN NOT NULL DEFAULT FALSE,
    consent_timestamp TIMESTAMP WITH TIME ZONE,
    consent_ip VARCHAR(60),
    consent_source VARCHAR(100) DEFAULT 'DONATION_CHECKOUT',
    policy_version VARCHAR(20) DEFAULT 'v1.0',
    opt_out_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donor_msg_pref_phone ON donor_messaging_preferences(donor_phone);
CREATE INDEX IF NOT EXISTS idx_donor_msg_pref_user ON donor_messaging_preferences(portal_user_id);

-- 5. WhatsApp Message Lifecycle Logs (Detailed Dispatch & Meta Status Tracking)
CREATE TABLE IF NOT EXISTS whatsapp_message_logs (
    id BIGSERIAL PRIMARY KEY,
    outbox_id BIGINT REFERENCES notification_outbox(id) ON DELETE SET NULL,
    wamid VARCHAR(150),
    recipient_phone VARCHAR(30) NOT NULL,
    recipient_type VARCHAR(30) NOT NULL DEFAULT 'DONOR',
    template_name VARCHAR(120),
    event_type VARCHAR(60) NOT NULL,
    donation_id BIGINT REFERENCES donations(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'QUEUED',
    error_code VARCHAR(50),
    error_message VARCHAR(500),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    raw_payload TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wa_logs_wamid ON whatsapp_message_logs(wamid);
CREATE INDEX IF NOT EXISTS idx_wa_logs_outbox ON whatsapp_message_logs(outbox_id);
CREATE INDEX IF NOT EXISTS idx_wa_logs_donation ON whatsapp_message_logs(donation_id);
CREATE INDEX IF NOT EXISTS idx_wa_logs_status ON whatsapp_message_logs(status);

-- 6. WhatsApp Inbound Webhook Event Audit and Idempotency
CREATE TABLE IF NOT EXISTS whatsapp_webhook_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(150) NOT NULL UNIQUE,
    event_type VARCHAR(60) NOT NULL,
    wamid VARCHAR(150),
    status VARCHAR(50),
    recipient_phone VARCHAR(30),
    payload_json TEXT NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wa_webhook_event_id ON whatsapp_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_wa_webhook_wamid ON whatsapp_webhook_events(wamid);
