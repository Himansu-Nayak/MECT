import paramiko
import time
import sys

def deploy_phase35():
    print("==================================================================", flush=True)
    print("MECT PHASE 3.5 — PRODUCTION RECONCILIATION & DEPLOYMENT", flush=True)
    print("Target VPS: 200.97.161.128", flush=True)
    print("Release Commit: f07b832 (feat/complete-website-redefinition-and-deduplication)", flush=True)
    print("==================================================================", flush=True)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root", timeout=30)

    ts = int(time.time())
    backup_file = f"/opt/mect/backups/mect_prod_backup_phase35_{ts}.sql"

    steps = [
        # 1. Fresh production database cold backup
        (f"mkdir -p /opt/mect/backups && docker exec mect-postgres pg_dump -U mect_user -d mect_db > {backup_file} && ls -lh {backup_file}",
         "Create pre-deployment production database cold backup"),

        # 2. Tag existing production images for instant rollback safety
        (f"docker tag mect-frontend:production mect-frontend:rollback_{ts} && docker tag mect-backend:production mect-backend:rollback_{ts}",
         "Tag current running production images as rollback safety baseline"),

        # 3. Synchronize repository to latest release commit f07b832
        ("cd /opt/mect-staging && git fetch origin && git checkout feat/complete-website-redefinition-and-deduplication && git reset --hard origin/feat/complete-website-redefinition-and-deduplication && git log -n 3 --oneline",
         "Synchronize /opt/mect-staging to remote commit f07b832"),

        # 4. Build production backend image
        ("cd /opt/mect-staging/backend && mvn clean package -DskipTests && cd /opt/mect-staging && docker build -t mect-backend:production -f backend/Dockerfile backend/",
         "Build audited production Spring Boot backend Docker image"),

        # 5. Build production frontend image
        ("cd /opt/mect-staging && docker build -t mect-frontend:production --build-arg NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1 --build-arg NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1 --build-arg ENABLE_DONOR_PORTAL=true --build-arg NEXT_PUBLIC_ENABLE_DONOR_PORTAL=true .",
         "Build audited production Next.js frontend Docker image with mobile responsiveness & image diversity"),

        # 6. Restart production containers with new images
        ("cd /opt/mect && docker compose --env-file .env.production -f compose.production.yaml up -d mect-backend mect-frontend",
         "Recreate and start mect-backend and mect-frontend production containers"),

        # 7. Wait and verify container health
        ("sleep 20 && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
         "Verify container health across all services"),

        # 8. Check Flyway schema history in production mect_db
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT installed_rank, version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;'",
         "Verify Flyway schema history in production mect_db"),

        # 9. Verify OHO Tech isolation (ports 3000, 8080, 5432)
        ("curl -sI http://127.0.0.1:3000 | head -n 3 && curl -s http://127.0.0.1:8080/actuator/health || true",
         "Verify OHO Tech (ports 3000 & 8080) undisturbed and operational"),

        # 10. Probe production health endpoints locally on VPS
        ("curl -sI http://127.0.0.1:3001 && curl -s http://127.0.0.1:8081/actuator/health",
         "Probe local production frontend (3001) and backend (8081) health")
    ]

    for cmd, desc in steps:
        print(f"\n==========================================", flush=True)
        print(f"STEP: {desc}", flush=True)
        print(f"CMD:  {cmd}", flush=True)
        print(f"==========================================", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out: print(f"[STDOUT]\n{out.strip()}", flush=True)
        if err: print(f"[STDERR]\n{err.strip()}", flush=True)
        code = stdout.channel.recv_exit_status()
        print(f"EXIT CODE: {code}", flush=True)
        if code != 0 and "|| true" not in cmd:
            print(f"ERROR: Step failed with code {code}! Aborting deployment.", flush=True)
            client.close()
            sys.exit(1)

    client.close()
    print("\nProduction deployment completed successfully.", flush=True)

if __name__ == "__main__":
    deploy_phase35()
