import paramiko
import time

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        # 1. Pull latest git commit on VPS
        ("cd /opt/mect-staging && git fetch origin feat/complete-website-redefinition-and-deduplication && git reset --hard origin/feat/complete-website-redefinition-and-deduplication && git log -1 --oneline",
         "Git sync to latest commit on VPS"),

        # 2. Check and ensure BACKEND_API_URL in /opt/mect/.env.production
        ("grep BACKEND_API_URL /opt/mect/.env.production || echo 'BACKEND_API_URL not present in .env.production'",
         "Inspect BACKEND_API_URL in /opt/mect/.env.production"),

        # 3. If BACKEND_API_URL exists in .env.production, ensure it points to http://mect-backend:8080
        ("sed -i 's|^BACKEND_API_URL=.*|BACKEND_API_URL=http://mect-backend:8080|' /opt/mect/.env.production || true",
         "Ensure BACKEND_API_URL points to internal docker service name mect-backend:8080"),

        # 4. Rebuild production frontend Docker image with the route fix
        ("cd /opt/mect-staging && docker build -t mect-frontend:production "
         "--build-arg NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1 "
         "--build-arg NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1 "
         "--build-arg ENABLE_DONOR_PORTAL=true "
         "--build-arg NEXT_PUBLIC_ENABLE_DONOR_PORTAL=true .",
         "Rebuild production Next.js frontend image with updated internal routing"),

        # 5. Restart mect-frontend container
        ("cd /opt/mect && docker compose --env-file .env.production -f compose.production.yaml up -d --force-recreate mect-frontend",
         "Recreate and restart mect-frontend with new image"),

        # 6. Verify health
        ("sleep 15 && docker ps --filter 'name=mect-frontend' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
         "Verify mect-frontend container status"),

        # 7. Test internal contact route from inside mect-frontend to mect-backend
        ("docker exec mect-frontend wget -qO- --header='Content-Type: application/json' --post-data='{\"name\":\"Production Probe\",\"email\":\"probe@mect.org.in\",\"phone\":\"+919876543210\",\"subject\":\"GENERAL_INQUIRY\",\"message\":\"Container loopback verification test.\"}' http://127.0.0.1:3000/api/contact || true",
         "Test POST /api/contact internally on port 3000")
    ]

    for cmd, desc in commands:
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

    client.close()

if __name__ == "__main__":
    run()
