import paramiko
import sys

def deploy_staging():
    print("Connecting to VPS 200.97.161.128...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        # 1. Inspect current staging git status
        ("cd /opt/mect-staging && git status -s && git log -n 1 --oneline", "Check git status in /opt/mect-staging"),

        # 2. Pull latest commit c2de835
        ("cd /opt/mect-staging && git fetch origin && git checkout feat/complete-website-redefinition-and-deduplication && git pull origin feat/complete-website-redefinition-and-deduplication", "Pull latest commit c2de835"),

        # 3. Copy updated staging Nginx config to host
        ("cp /opt/mect-staging/docker/nginx/staging.mect.org.in.conf /etc/nginx/sites-available/staging.mect.org.in && ln -sf /etc/nginx/sites-available/staging.mect.org.in /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx", "Update and reload staging Nginx"),

        # 4. Rebuild and restart staging containers
        ("cd /opt/mect-staging && docker compose -f compose.staging.yaml build --no-cache mect-backend-staging mect-frontend-staging && docker compose -f compose.staging.yaml up -d mect-backend-staging mect-frontend-staging", "Build and restart staging containers"),

        # 5. Check container statuses
        ("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", "Check all Docker container statuses"),

        # 6. Check Flyway schema history in mect_staging_db
        ("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'", "Check Flyway migration in staging DB"),

        # 7. Check admin user in mect_staging_db
        ("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT id, username, email, role, status FROM admin_users;'", "Check admin user seeded in staging DB"),

        # 8. Probe staging endpoints locally on VPS
        ("curl -sI http://127.0.0.1:3002/api/health", "Probe local staging frontend health"),
        ("curl -s http://127.0.0.1:8082/api/v1/actuator/health", "Probe local staging backend health"),
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
        if exit_status != 0 and "nginx -t" in cmd:
            print("CRITICAL ERROR: Nginx test failed! Aborting.")
            break

    client.close()

if __name__ == "__main__":
    deploy_staging()
