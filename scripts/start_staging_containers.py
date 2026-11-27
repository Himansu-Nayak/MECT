import paramiko

def start_staging():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        "cd /opt/mect-staging && cp .env.staging .env && docker compose --env-file .env.staging -f compose.staging.yaml up -d",
        "sleep 10",
        "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
        "curl -s http://127.0.0.1:8082/api/v1/actuator/health",
        "curl -sI http://127.0.0.1:3002/api/ai/health",
        "docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'",
        "docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT id, username, email, role, status FROM admin_users;'"
    ]

    for cmd in commands:
        print(f"\n--- {cmd} ---", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out:
            print(f"[OUT]\n{out.strip()}", flush=True)
        if err:
            print(f"[ERR]\n{err.strip()}", flush=True)

    client.close()

if __name__ == "__main__":
    start_staging()
