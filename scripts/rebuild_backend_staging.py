import paramiko

def rebuild_backend_staging():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        ("cd /opt/mect-staging/backend && mvn clean package -DskipTests", "Maven package backend on VPS"),
        ("cd /opt/mect-staging && docker compose --env-file .env.staging -f compose.staging.yaml build --no-cache mect-backend-staging", "Build Docker image mect-backend:staging"),
        ("cd /opt/mect-staging && docker compose --env-file .env.staging -f compose.staging.yaml up -d mect-backend-staging", "Restart mect-backend-staging"),
        ("sleep 15", "Wait for backend initialization"),
        ("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'", "Verify Flyway V21 migration"),
        ("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT id, username, email, role, status FROM admin_users;'", "Verify admin user in staging DB"),
        ("curl -s http://127.0.0.1:8082/api/v1/actuator/health", "Verify actuator health on port 8082")
    ]

    for cmd, desc in commands:
        print(f"\n==========================================", flush=True)
        print(f"STEP: {desc}", flush=True)
        print(f"CMD:  {cmd}", flush=True)
        print(f"==========================================", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out:
            print(f"[STDOUT]\n{out.strip()}", flush=True)
        if err:
            print(f"[STDERR]\n{err.strip()}", flush=True)
        exit_status = stdout.channel.recv_exit_status()
        print(f"EXIT CODE: {exit_status}", flush=True)
        if exit_status != 0:
            print(f"FAILED AT STEP: {desc}", flush=True)
            break

    client.close()

if __name__ == "__main__":
    rebuild_backend_staging()
