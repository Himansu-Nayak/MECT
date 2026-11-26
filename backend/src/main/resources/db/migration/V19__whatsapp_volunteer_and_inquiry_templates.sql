-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V19: WHATSAPP VOLUNTEER & INQUIRY NOTIFICATION TEMPLATES
-- ============================================================================

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_volunteer_enquiry_received', 'mect_volunteer_enquiry_received', 'en', 'UTILITY', 'APPROVED',
       '["volunteer_name","role_interest","reference_id"]',
       'Namaste {{1}}, thank you for expressing interest in voluntary service with Mahavir Trust for {{2}}. Your registration reference is #{{3}}. Our coordinator will review and contact you shortly.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_volunteer_enquiry_received');

INSERT INTO whatsapp_template_configs (template_key, template_name, language_code, category, status, parameter_mappings, sample_body)
SELECT 'mect_enquiry_received', 'mect_enquiry_received', 'en', 'UTILITY', 'APPROVED',
       '["contact_name","category","inquiry_id"]',
       'Namaste {{1}}, your inquiry regarding {{2}} has been received by Mahavir Trust Secretariat (Ref: #{{3}}). We will review and respond shortly.'
WHERE NOT EXISTS (SELECT 1 FROM whatsapp_template_configs WHERE template_key = 'mect_enquiry_received');
