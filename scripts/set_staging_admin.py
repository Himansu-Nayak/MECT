import paramiko

def set_staging_admin():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    sql = """
    INSERT INTO admin_users (username, email, password_hash, full_name, role, status, created_at, updated_at)
    VALUES ('superadmin@mect.org.in', 'superadmin@mect.org.in', '$2b$12$RzyFYZoi2LIF1FI7lVdl0O724pF0TAzXVFcju2CG.3hBKGy6aXJWq', 'MECT Staging Admin', 'ROLE_SUPER_ADMIN', 'ACTIVE', NOW(), NOW())
    ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
    UPDATE admin_users SET password_hash = '$2b$12$RzyFYZoi2LIF1FI7lVdl0O724pF0TAzXVFcju2CG.3hBKGy6aXJWq' WHERE username = 'Admin';
    SELECT id, username, email, role, status FROM admin_users;
    """

    cmd = f'docker exec -i mect-postgres-staging psql -U mect_staging_user -d mect_staging_db << \'EOF\'\n{sql}\nEOF'
    stdin, stdout, stderr = client.exec_command(cmd)
    print("STAGING ADMIN SETUP:\n", stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print("STDERR:\n", err)
    client.close()

if __name__ == "__main__":
    set_staging_admin()
