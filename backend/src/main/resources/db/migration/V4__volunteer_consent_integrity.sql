-- V4__volunteer_consent_integrity.sql
-- MAHAVIR TRUST - Consent Defaults Integrity & Data Sanitation
-- Ensures legacy rows without affirmative consent do not display false evidence of consent.

ALTER TABLE volunteer_registrations ALTER COLUMN consent_statement SET DEFAULT NULL;
ALTER TABLE volunteer_registrations ALTER COLUMN consent_version SET DEFAULT NULL;

UPDATE volunteer_registrations 
SET consent_statement = NULL, consent_version = NULL 
WHERE consent_declared = FALSE AND consent_timestamp IS NULL;
