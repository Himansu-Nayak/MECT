-- ==============================================================================
-- MECT V15 — Sanitize Public Donation Configuration & Instructions
-- Removes legacy SBI/UTR manual transfer references from database defaults
-- ==============================================================================

UPDATE payment_configurations
SET payment_instructions = 'All contributions are processed securely online through authorized payment gateways. Digital receipts are issued immediately upon transaction confirmation.',
    gateway_notice_text = 'Online payments are processed securely via authorized payment gateways. MECT operates strictly through verified digital banking channels.'
WHERE id = 1;
