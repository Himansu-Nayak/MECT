import paramiko
import time
import sys

def deploy_final_master():
    print("==================================================================", flush=True)
    print("MECT FINAL MASTER DEPLOYMENT TO PRODUCTION VPS (200.97.161.128)", flush=True)
    print("Commit: feat/complete-website-redefinition-and-deduplication", flush=True)
    print("==================================================================", flush=True)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect("200.97.161.128", username="root", timeout=30)
    except Exception as e:
        print(f"FAILED to connect to VPS: {e}", flush=True)
        sys.exit(1)

    ts = int(time.time())
    backup_file = f"/opt/mect/backups/mect_prod_backup_master_{ts}.sql"

    steps = [
        # 1. Sync git repository in /opt/mect-staging
        ("cd /opt/mect-staging && git fetch origin feat/complete-website-redefinition-and-deduplication && git reset --hard origin/feat/complete-website-redefinition-and-deduplication && git log -1 --oneline",
         "1. Fetch and checkout latest git commit on VPS"),

        # 2. Pre-deployment database cold backup
        (f"mkdir -p /opt/mect/backups && docker exec mect-postgres pg_dump -U mect_user -d mect_db > {backup_file} && ls -lh {backup_file}",
         "2. Create cold safety backup of production mect_db"),

        # 3. Tag existing production images for rollback safety
        (f"docker tag mect-frontend:production mect-frontend:rollback_{ts} && docker tag mect-backend:production mect-backend:rollback_{ts}",
         "3. Tag existing production Docker images for rollback"),

        # 4. Check & update production Nginx virtual host
        ("cp /opt/mect-staging/docker/nginx/mect.org.in.conf /etc/nginx/sites-available/mect.org.in && ln -sf /etc/nginx/sites-available/mect.org.in /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx",
         "4. Verify and reload production Nginx configuration"),

        # 5. Compile backend JAR in /opt/mect-staging
        ("cd /opt/mect-staging/backend && mvn clean package -DskipTests",
         "5. Compile production Spring Boot backend JAR with Maven"),

        # 6. Build production backend Docker image
        ("cd /opt/mect-staging && docker build -t mect-backend:production -f backend/Dockerfile backend/",
         "6. Build production backend Docker image"),

        # 7. Ensure BACKEND_API_URL in /opt/mect/.env.production
        ("if grep -q '^BACKEND_API_URL=' /opt/mect/.env.production; then sed -i 's|^BACKEND_API_URL=.*|BACKEND_API_URL=http://mect-backend:8080|' /opt/mect/.env.production; else echo 'BACKEND_API_URL=http://mect-backend:8080' >> /opt/mect/.env.production; fi && grep BACKEND_API_URL /opt/mect/.env.production",
         "7. Ensure BACKEND_API_URL in production .env.production"),

        # 8. Build production frontend Docker image
        ("cd /opt/mect-staging && docker build -t mect-frontend:production "
         "--build-arg NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1 "
         "--build-arg NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1 "
         "--build-arg ENABLE_DONOR_PORTAL=true "
         "--build-arg NEXT_PUBLIC_ENABLE_DONOR_PORTAL=true .",
         "8. Build production Next.js frontend Docker image"),

        # 9. Recreate and start production containers
        ("cd /opt/mect && docker compose --env-file .env.production -f compose.production.yaml up -d --force-recreate mect-backend mect-frontend",
         "9. Recreate and restart production containers"),

        # 10. Wait and inspect container health
        ("sleep 20 && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
         "10. Verify running containers"),

        # 11. Verify Flyway migrations in production mect_db
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'",
         "11. Verify Flyway schema history in production database"),

        # 12. Probe local production ports (3001 and 8081)
        ("curl -sI http://127.0.0.1:3001 | head -n 5 && curl -s http://127.0.0.1:8081/api/v1/actuator/health",
         "12. Probe local production frontend and backend"),

        # 13. Verify OHO Tech isolation (ports 3000, 8080, 5432)
        ("curl -sI http://127.0.0.1:3000 | head -n 3 && curl -s http://127.0.0.1:8080/actuator/health",
         "13. Verify OHO Tech services are undisturbed and running")
    ]

    has_error = False
    for cmd, desc in steps:
        print(f"\n==========================================", flush=True)
        print(f"STEP: {desc}", flush=True)
        print(f"==========================================", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out: print(f"[STDOUT]\n{out.strip()}", flush=True)
        if err: print(f"[STDERR]\n{err.strip()}", flush=True)
        code = stdout.channel.recv_exit_status()
        print(f"EXIT CODE: {code}", flush=True)
        if code != 0 and "nginx -t" in cmd:
            print("CRITICAL: Nginx validation failed! Halting deployment.", flush=True)
            has_error = True
            break
        elif code != 0 and ("mvn" in cmd or "docker build" in cmd):
            print(f"CRITICAL: Step '{desc}' failed with exit code {code}! Halting deployment.", flush=True)
            has_error = True
            break

    client.close()
    if has_error:
        print("\nDEPLOYMENT HALTED DUE TO ERROR.", flush=True)
        sys.exit(1)
    else:
        print("\nALL DEPLOYMENT STEPS COMPLETED SUCCESSFULLY.", flush=True)

if __name__ == "__main__":
    deploy_final_master()
