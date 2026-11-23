-- ==============================================================================
-- MECT V16 — Donor Authentication, District Jurisdictions & Profile Integrity
-- Enhances portal_user_profiles with administrative district support
-- ==============================================================================

ALTER TABLE portal_user_profiles ADD COLUMN IF NOT EXISTS district VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_portal_user_profiles_district ON portal_user_profiles(district);
CREATE INDEX IF NOT EXISTS idx_donations_portal_user_status ON donations(portal_user_id, status);
