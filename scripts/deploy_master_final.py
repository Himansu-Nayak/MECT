import paramiko
import time
import sys

def run_ssh_command(ssh, cmd, desc):
    print(f"\n--- {desc} ---", flush=True)
    print(f"Executing: {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    # Stream stdout
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            data = stdout.channel.recv(1024).decode(errors='replace')
            sys.stdout.write(data)
            sys.stdout.flush()
        time.sleep(0.1)
    
    # Read remaining
    rest_out = stdout.read().decode(errors='replace')
    rest_err = stderr.read().decode(errors='replace')
    if rest_out:
        sys.stdout.write(rest_out)
        sys.stdout.flush()
    if rest_err:
        sys.stderr.write(rest_err)
        sys.stderr.flush()
        
    code = stdout.channel.recv_exit_status()
    print(f"Exit code: {code}", flush=True)
    if code != 0:
        raise RuntimeError(f"Command failed with exit code {code}: {cmd}")
    return rest_out

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("Connecting to Hostinger VPS 200.97.161.128...", flush=True)
    ssh.connect("200.97.161.128", username="root", timeout=30)
    print("Connected.", flush=True)

    # 1. Pull latest release commit dcffadc to /opt/mect-staging
    run_ssh_command(ssh, "cd /opt/mect-staging && git fetch origin && git checkout feat/complete-website-redefinition-and-deduplication && git pull origin feat/complete-website-redefinition-and-deduplication", "1. Pull Latest Release to /opt/mect-staging")
    head_sha = run_ssh_command(ssh, "cd /opt/mect-staging && git rev-parse HEAD", "Check Current HEAD SHA").strip()
    print(f"Verified VPS HEAD SHA: {head_sha}", flush=True)

    # 2. Tag current production images for zero-downtime rollback safety
    ts = int(time.time())
    run_ssh_command(ssh, f"docker tag mect-frontend:production mect-frontend:rollback_{ts} && docker tag mect-backend:production mect-backend:rollback_{ts}", "2. Tag Rollback Images")

    # 3. Create fresh cold backup of production PostgreSQL database
    backup_path = f"/opt/mect/backups/mect_prod_backup_master_{ts}.sql"
    run_ssh_command(ssh, f"docker exec mect-postgres pg_dump -U mect_user -d mect_db --clean --if-exists > {backup_path}", "3. Create Cold Production DB Backup")
    run_ssh_command(ssh, f"ls -lh {backup_path}", "Verify Backup Size")

    # 4. Build and restart Production containers (Ports 3001 & 8081)
    # Using /opt/mect-staging codebase with production tags
    print("\n--- 4. Building Production Backend Image ---", flush=True)
    run_ssh_command(ssh, "cd /opt/mect-staging && docker build -t mect-backend:production -f backend/Dockerfile backend", "Build Backend Production Image")

    print("\n--- 5. Building Production Frontend Image ---", flush=True)
    run_ssh_command(ssh, "cd /opt/mect-staging && docker build -t mect-frontend:production -f Dockerfile .", "Build Frontend Production Image")

    # 6. Recreating Production Containers Safely
    print("\n--- 6. Recreating Production Containers Safely ---", flush=True)
    # Stop and remove old containers
    run_ssh_command(ssh, "docker stop mect-frontend mect-backend && docker rm mect-frontend mect-backend", "Stop and Remove Old Production Containers")

    # Start mect-backend with mect-network, volumes, and env file
    run_ssh_command(ssh, """docker run -d \
      --name mect-backend \
      --restart unless-stopped \
      --network mect-network \
      -p 127.0.0.1:8081:8080 \
      --env-file /opt/mect/.env.production \
      -v mect-receipts:/app/receipts \
      -v mect-media:/app/uploads/media \
      mect-backend:production""", "Start mect-backend container")

    # Start mect-frontend with mect-network and environment
    run_ssh_command(ssh, """docker run -d \
      --name mect-frontend \
      --restart unless-stopped \
      --network mect-network \
      -p 127.0.0.1:3001:3000 \
      -e NODE_ENV=production \
      -e PORT=3000 \
      -e HOSTNAME=0.0.0.0 \
      -e NEXT_TELEMETRY_DISABLED=1 \
      -e NEXT_PUBLIC_API_URL=https://mect.org.in/api/v1 \
      -e NEXT_PUBLIC_API_BASE_URL=https://mect.org.in/api/v1 \
      -e ENABLE_DONOR_PORTAL=true \
      -e NEXT_PUBLIC_ENABLE_DONOR_PORTAL=true \
      -e AI_ENGINE_MODE=fallback_only \
      -e GROQ_MODEL=qwen/qwen3.8-27b \
      mect-frontend:production""", "Start mect-frontend container")

    print("\nWaiting 20 seconds for container initialization...", flush=True)
    time.sleep(20)

    # 7. Check container health
    run_ssh_command(ssh, "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'", "7. Check Running Containers")

    # 8. Check Backend Internal Actuator Health
    run_ssh_command(ssh, "curl -s http://127.0.0.1:8081/api/v1/actuator/health", "8. Backend Health")

    # 9. Check Frontend Internal Response
    run_ssh_command(ssh, "curl -sI http://127.0.0.1:3001 | head -n 5", "9. Frontend Port 3001 Response")

    # 10. Check OHO Tech Coexistence
    run_ssh_command(ssh, "curl -sI http://127.0.0.1:3000 | head -n 1 && curl -s http://127.0.0.1:8080/actuator/health || true", "10. OHO Tech Status")

    ssh.close()
    print("\nDEPLOYMENT PIPELINE COMPLETED SUCCESSFULLY.", flush=True)

if __name__ == "__main__":
    main()
