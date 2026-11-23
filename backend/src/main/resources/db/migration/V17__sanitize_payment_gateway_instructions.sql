-- ==============================================================================
-- MECT V17 — Sanitize Public Payment Gateway Instructions to SBI Direct Only
-- Updates payment_instructions and gateway_notice_text in payment_configurations (id=1)
-- ==============================================================================

UPDATE payment_configurations
SET payment_instructions = 'Contributions are accepted by direct State Bank of India bank transfer (NEFT/RTGS) or UPI. Submit your UTR/reference after paying. A numbered receipt is issued after the Trust checks your transfer against its bank records.',
    gateway_notice_text = 'Contributions are accepted by direct State Bank of India bank transfer (NEFT/RTGS) or UPI. Submit your UTR/reference after paying. A numbered receipt is issued after the Trust checks your transfer against its bank records.'
WHERE id = 1;
