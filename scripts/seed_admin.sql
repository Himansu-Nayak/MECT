INSERT INTO admin_users (username, email, password_hash, full_name, role, status, failed_login_attempts, created_at, updated_at)
VALUES ('Admin', 'admin@mect.org.in', '$2b$12$SRzQWbragzf8WJkfQjkreeoWjGwKaMpvBDWlHCpP02qP7BJN9TGAm', 'MECT Administrator', 'ROLE_SUPER_ADMIN', 'ACTIVE', 0, NOW(), NOW())
ON CONFLICT (username) DO UPDATE
SET password_hash = '$2b$12$SRzQWbragzf8WJkfQjkreeoWjGwKaMpvBDWlHCpP02qP7BJN9TGAm',
    status = 'ACTIVE',
    failed_login_attempts = 0,
    locked_until = NULL,
    updated_at = NOW();

