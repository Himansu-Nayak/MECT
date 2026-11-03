-- V3__volunteer_consent_and_district.sql
-- MAHAVIR TRUST - Volunteer Consent, District and Availability Schema Expansion
-- Note: Enhances volunteer_registrations with explicit consent auditing and geographic targeting while maintaining backward compatibility.

ALTER TABLE volunteer_registrations ADD COLUMN district VARCHAR(100);
ALTER TABLE volunteer_registrations ADD COLUMN consent_declared BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE volunteer_registrations ADD COLUMN consent_statement VARCHAR(255) DEFAULT 'I agree to the MAHAVIR TRUST volunteer code of conduct, student safeguarding policy, and ethical mentorship guidelines.';
ALTER TABLE volunteer_registrations ADD COLUMN consent_version VARCHAR(50) DEFAULT 'v1.0-2026';
ALTER TABLE volunteer_registrations ADD COLUMN consent_timestamp TIMESTAMP WITH TIME ZONE;
ALTER TABLE volunteer_registrations ADD COLUMN availability VARCHAR(50);
ALTER TABLE volunteer_registrations ADD COLUMN qualification VARCHAR(100);
ALTER TABLE volunteer_registrations ADD COLUMN engagement_mode VARCHAR(30);

CREATE INDEX IF NOT EXISTS idx_volunteers_district ON volunteer_registrations(district);
