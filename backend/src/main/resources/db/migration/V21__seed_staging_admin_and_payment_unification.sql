-- V21__seed_staging_admin_and_payment_unification.sql
-- MAHAVIR TRUST - Staging Admin Account Seeding & Payment Ecosystem Unification

-- 1. Ensure Super Admin account exists if table is empty (e.g. fresh staging environments)
INSERT INTO admin_users (username, email, password_hash, full_name, role, status, created_at, updated_at)
SELECT 'Admin', 'admin@mect.org.in', '$2b$12$SRzQWbragzf8WJkfQjkreeoWjGwKaMpvBDWlHCpP02qP7BJN9TGAm', 'MECT Super Administrator', 'ROLE_SUPER_ADMIN', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'Admin' OR email = 'admin@mect.org.in');
