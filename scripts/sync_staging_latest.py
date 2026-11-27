import paramiko

def sync_staging():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root")

    commands = [
        ("cd /opt/mect-staging && git pull origin feat/complete-website-redefinition-and-deduplication", "Pull latest commit on staging"),
        ("cd /opt/mect-staging/backend && mvn clean package -DskipTests", "Maven package backend"),
        ("cd /opt/mect-staging && docker compose --env-file .env.staging -f compose.staging.yaml build --no-cache mect-backend-staging mect-frontend-staging && docker compose --env-file .env.staging -f compose.staging.yaml up -d", "Rebuild and restart staging containers"),
        ("sleep 15", "Wait for container startup"),
        ("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", "Verify container health")
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
        code = stdout.channel.recv_exit_status()
        print(f"EXIT CODE: {code}", flush=True)
        if code != 0:
            print("FAILED! Aborting.")
            break

    client.close()

if __name__ == "__main__":
    sync_staging()
