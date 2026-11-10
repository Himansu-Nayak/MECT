-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V9: NOTIFICATION OUTBOX & DELIVERY LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_key VARCHAR(160) NOT NULL UNIQUE,
    event_type VARCHAR(60) NOT NULL,
    portal_user_id BIGINT REFERENCES portal_users(id) ON DELETE SET NULL,
    donation_id BIGINT REFERENCES donations(id) ON DELETE SET NULL,
    channel VARCHAR(20) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    sender_identity VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    template_code VARCHAR(80) NOT NULL,
    payload_json TEXT NOT NULL,
    attachment_receipt_id BIGINT REFERENCES donation_receipts(id) ON DELETE SET NULL,
    status VARCHAR(35) NOT NULL DEFAULT 'QUEUED',
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    provider_message_id VARCHAR(150),
    last_error VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_outbox_status_retry ON notification_outbox(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_outbox_donation ON notification_outbox(donation_id);
CREATE INDEX IF NOT EXISTS idx_outbox_provider_msg ON notification_outbox(provider_message_id);

CREATE TABLE IF NOT EXISTS notification_delivery_logs (
    id BIGSERIAL PRIMARY KEY,
    outbox_id BIGINT NOT NULL REFERENCES notification_outbox(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL,
    provider VARCHAR(40) NOT NULL,
    provider_message_id VARCHAR(150),
    delivery_status VARCHAR(50) NOT NULL,
    provider_response TEXT,
    webhook_event_id VARCHAR(150),
    logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_logs_outbox ON notification_delivery_logs(outbox_id);

