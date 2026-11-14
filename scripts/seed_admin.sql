-- Template for administrative user seeding (passwords must be hashed via BCrypt before insertion)
-- DO NOT commit production hashes or raw credentials to this file
INSERT INTO admin_users (username, email, password_hash, full_name, role, status, failed_login_attempts, created_at, updated_at)
VALUES ('Admin', 'admin@mect.org.in', '$2b$12$PLACEHOLDER_BCRYPT_HASH_NOT_FOR_PRODUCTION_USE', 'MECT Administrator', 'ROLE_SUPER_ADMIN', 'ACTIVE', 0, NOW(), NOW())
ON CONFLICT (username) DO UPDATE
SET status = 'ACTIVE',
    failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = NOW();

