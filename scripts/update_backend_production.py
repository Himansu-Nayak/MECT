import paramiko

def update_backend():
    print("==================================================================", flush=True)
    print("UPDATING MECT BACKEND ON PRODUCTION VPS (200.97.161.128)", flush=True)
    print("==================================================================", flush=True)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root", timeout=30)

    commands = [
        ("cd /opt/mect-staging && git fetch origin feat/complete-website-redefinition-and-deduplication && git reset --hard origin/feat/complete-website-redefinition-and-deduplication && git log -1 --oneline",
         "Git sync on VPS"),
        ("cd /opt/mect-staging/backend && mvn clean package -DskipTests",
         "Compile backend JAR"),
        ("cd /opt/mect-staging && docker build -t mect-backend:production -f backend/Dockerfile backend/",
         "Build mect-backend Docker image"),
        ("cd /opt/mect && docker compose --env-file .env.production -f compose.production.yaml up -d --force-recreate mect-backend",
         "Restart mect-backend container"),
        ("sleep 15 && docker ps --filter 'name=mect-backend' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
         "Verify mect-backend status"),
        ("curl -sI http://127.0.0.1:8081/api/v1/actuator/health",
         "Probe local backend health")
    ]

    for cmd, desc in commands:
        print(f"\nSTEP: {desc}", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out: print(out.strip()[:600], flush=True)
        if err: print("[STDERR] " + err.strip()[:300], flush=True)
        code = stdout.channel.recv_exit_status()
        print(f"EXIT CODE: {code}", flush=True)
        if code != 0 and ("mvn" in cmd or "docker build" in cmd):
            print("ERROR in build. Halting.", flush=True)
            break

    client.close()
    print("\nBackend update completed.", flush=True)

if __name__ == "__main__":
    update_backend()
