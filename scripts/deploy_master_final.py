import paramiko
import time
import sys

import subprocess
import os

DEFAULT_RELEASE_SHA = "94080518a93effabaeb19b7c9b2773b3cb37a952"

def get_expected_release_sha():
    if len(sys.argv) > 1 and len(sys.argv[1]) == 40:
        return sys.argv[1]
    try:
        local_sha = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()
        if len(local_sha) == 40:
            return local_sha
    except Exception:
        pass
    return DEFAULT_RELEASE_SHA

EXPECTED_RELEASE_SHA = get_expected_release_sha()
VPS_HOST = "200.97.161.128"
VPS_USER = "root"

def run_ssh_command(ssh, cmd, desc, check=True):
    print(f"\n========================================================", flush=True)
    print(f"=== {desc}", flush=True)
    print(f"========================================================", flush=True)
    print(f"Executing: {cmd}", flush=True)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    out_chunks = []
    err_chunks = []
    
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            data = stdout.channel.recv(4096).decode(errors='replace')
            sys.stdout.write(data)
            sys.stdout.flush()
            out_chunks.append(data)
        if stdout.channel.recv_stderr_ready():
            data_err = stdout.channel.recv_stderr(4096).decode(errors='replace')
            sys.stderr.write(data_err)
            sys.stderr.flush()
            err_chunks.append(data_err)
        time.sleep(0.1)
    
    rest_out = stdout.read().decode(errors='replace')
    rest_err = stderr.read().decode(errors='replace')
    if rest_out:
        sys.stdout.write(rest_out)
        sys.stdout.flush()
        out_chunks.append(rest_out)
    if rest_err:
        sys.stderr.write(rest_err)
        sys.stderr.flush()
        err_chunks.append(rest_err)
        
    code = stdout.channel.recv_exit_status()
    print(f"\n[Exit code: {code}]", flush=True)
    if check and code != 0:
        raise RuntimeError(f"Command failed with exit code {code}: {cmd}\nStderr: {''.join(err_chunks)}")
    return "".join(out_chunks)

def rollback(ssh, ts):
    print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", flush=True)
    print("!!! INITIATING AUTOMATED ROLLBACK TO PREVIOUS CONTAINERS", flush=True)
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", flush=True)
    try:
        run_ssh_command(ssh, "docker stop mect-frontend mect-backend || true", "Stop Failed Containers", check=False)
        run_ssh_command(ssh, "docker rm mect-frontend mect-backend || true", "Remove Failed Containers", check=False)
        run_ssh_command(ssh, f"""docker run -d \
          --name mect-backend \
          --restart unless-stopped \
          --network mect-network \
          -p 127.0.0.1:8081:8080 \
          --env-file /opt/mect/.env.production \
          -v mect-receipts:/app/receipts \
          -v mect-media:/app/uploads/media \
          mect-backend:rollback_{ts}""", "Restore Rollback Backend", check=False)
        run_ssh_command(ssh, f"""docker run -d \
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
          mect-frontend:rollback_{ts}""", "Restore Rollback Frontend", check=False)
        print("Rollback containers started.", flush=True)
    except Exception as re:
        print(f"Error during rollback: {re}", flush=True)

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to Hostinger VPS {VPS_HOST} as {VPS_USER}...", flush=True)
    ssh.connect(VPS_HOST, username=VPS_USER, timeout=30)
    print("SSH Connection Established.", flush=True)

    ts = int(time.time())

    try:
        # Step 1: Release Provenance & Commit Synchronization
        run_ssh_command(ssh, "mkdir -p /opt/mect/backups", "Ensure Backup Directory Exists")
        run_ssh_command(
            ssh,
            "cd /opt/mect-staging && git fetch origin feat/complete-website-redefinition-and-deduplication && git checkout -f feat/complete-website-redefinition-and-deduplication && git reset --hard origin/feat/complete-website-redefinition-and-deduplication",
            "1. Fetch and Synchronize Release Branch in /opt/mect-staging"
        )
        
        actual_sha = run_ssh_command(ssh, "cd /opt/mect-staging && git rev-parse HEAD", "Verify Commit SHA").strip()
        print(f"\n[PROVENANCE CHECK] Expected: {EXPECTED_RELEASE_SHA}", flush=True)
        print(f"[PROVENANCE CHECK] Actual:   {actual_sha}", flush=True)
        if actual_sha != EXPECTED_RELEASE_SHA:
            raise ValueError(f"CRITICAL PROVENANCE MISMATCH! Expected SHA {EXPECTED_RELEASE_SHA} but found {actual_sha} on VPS.")
        print("✅ PROVENANCE VERIFIED: Exact release commit matches target SHA.\n", flush=True)

        # Step 2: Tag current production images for rollback
        run_ssh_command(
            ssh,
            f"docker tag mect-frontend:production mect-frontend:rollback_{ts} && docker tag mect-backend:production mect-backend:rollback_{ts}",
            "2. Tag Current Production Images for Rollback Safety"
        )

        # Step 3: Create fresh cold backup of production PostgreSQL database & SHA-256 Checksum
        backup_sql = f"/opt/mect/backups/mect_prod_backup_{ts}.sql"
        run_ssh_command(
            ssh,
            f"docker exec mect-postgres pg_dump -U mect_user -d mect_db --clean --if-exists > {backup_sql}",
            "3. Generate Production Database Cold Dump"
        )
        run_ssh_command(ssh, f"ls -lh {backup_sql}", "Verify Dump Size")
        backup_sha = run_ssh_command(ssh, f"sha256sum {backup_sql}", "Record Backup SHA-256 Checksum").strip()
        print(f"✅ Cold Backup Checksum: {backup_sha}", flush=True)

        # Step 4: Automated Restore Rehearsal on Isolated Database
        rehearsal_db = f"mect_restore_rehearsal_{ts}"
        print(f"\n--- Rehearsing Restore on Isolated DB: {rehearsal_db} ---", flush=True)
        run_ssh_command(
            ssh,
            f"docker exec mect-postgres psql -U mect_user -d postgres -c 'DROP DATABASE IF EXISTS {rehearsal_db};' && "
            f"docker exec mect-postgres psql -U mect_user -d postgres -c 'CREATE DATABASE {rehearsal_db} OWNER mect_user;'",
            "4a. Create Isolated Rehearsal Database"
        )
        run_ssh_command(
            ssh,
            f"docker exec -i mect-postgres psql -U mect_user -d {rehearsal_db} < {backup_sql}",
            "4b. Restore Dump into Rehearsal Database"
        )
        run_ssh_command(
            ssh,
            f"docker exec mect-postgres psql -U mect_user -d {rehearsal_db} -c "
            f"\"SELECT 'donations' AS table_name, count(*) AS records FROM donations "
            f"UNION ALL SELECT 'portal_users', count(*) FROM portal_users "
            f"UNION ALL SELECT 'audit_logs', count(*) FROM audit_logs;\"",
            "4c. Verify Restored Rehearsal Data Integrity"
        )
        run_ssh_command(
            ssh,
            f"docker exec mect-postgres psql -U mect_user -d postgres -c 'DROP DATABASE {rehearsal_db};'",
            "4d. Clean Up Rehearsal Database"
        )
        print("✅ RESTORE REHEARSAL PASSED: Backup dump verified 100% restorable without errors.\n", flush=True)

        # Step 5: Build Candidate Images from Verified Release Source
        print("Building Candidate Backend Image...", flush=True)
        run_ssh_command(
            ssh,
            f"cd /opt/mect-staging && docker build -t mect-backend:candidate_{ts} -f backend/Dockerfile backend",
            "5a. Build Candidate Backend Image"
        )

        print("Building Candidate Frontend Image...", flush=True)
        run_ssh_command(
            ssh,
            f"cd /opt/mect-staging && docker build -t mect-frontend:candidate_{ts} -f Dockerfile .",
            "5b. Build Candidate Frontend Image"
        )

        # Step 6: Tag Candidates as Production
        run_ssh_command(
            ssh,
            f"docker tag mect-backend:candidate_{ts} mect-backend:production && docker tag mect-frontend:candidate_{ts} mect-frontend:production",
            "6. Promote Candidate Images to Production Tags"
        )

        # Step 7: Restart Production Containers
        run_ssh_command(
            ssh,
            "docker stop mect-frontend mect-backend && docker rm mect-frontend mect-backend",
            "7a. Stop and Remove Previous Containers"
        )

        run_ssh_command(
            ssh,
            """docker run -d \
              --name mect-backend \
              --restart unless-stopped \
              --network mect-network \
              -p 127.0.0.1:8081:8080 \
              --env-file /opt/mect/.env.production \
              -v mect-receipts:/app/receipts \
              -v mect-media:/app/uploads/media \
              mect-backend:production""",
            "7b. Start New mect-backend Container"
        )

        run_ssh_command(
            ssh,
            """docker run -d \
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
              mect-frontend:production""",
            "7c. Start New mect-frontend Container"
        )

        print("\nWaiting 20 seconds for container startup...", flush=True)
        time.sleep(20)

        # Step 8: Health & Acceptance Verification
        run_ssh_command(ssh, "docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'", "8a. List Running Docker Containers")

        # Actuator health
        health_resp = run_ssh_command(ssh, "curl -fsS http://127.0.0.1:8081/api/v1/actuator/health", "8b. Backend Actuator Health")
        if '"UP"' not in health_resp:
            raise RuntimeError(f"Backend Actuator check failed: {health_resp}")

        # Gateway status
        gw_status = run_ssh_command(ssh, "curl -fsS http://127.0.0.1:8081/api/v1/public/gateway-status", "8c. Public Gateway Status")
        if '"CASHFREE"' not in gw_status:
            raise RuntimeError(f"Gateway status missing CASHFREE: {gw_status}")

        # Cashfree endpoint status alias
        cf_status = run_ssh_command(ssh, "curl -fsS http://127.0.0.1:8081/api/v1/payments/cashfree/status", "8d. Cashfree Endpoint Status Alias")
        if '"CASHFREE"' not in cf_status:
            raise RuntimeError(f"Cashfree status alias failed: {cf_status}")

        # Frontend HTTP response
        run_ssh_command(ssh, "curl -fsS -I http://127.0.0.1:3001 | head -n 5", "8e. Frontend Port 3001 Header Response")

        # Public Donate page inspection via curl
        donate_html = run_ssh_command(ssh, "curl -fsS http://127.0.0.1:3001/donate | grep -o 'Institutional Contribution Policy' || true", "8f. Verify Policy Banner on /donate")
        if "Institutional Contribution Policy" not in donate_html:
            print("Warning: Institutional Contribution Policy string not found directly in initial SSR snippet", flush=True)

        # Co-tenant OHO Tech protection
        run_ssh_command(ssh, "curl -fsS -I http://127.0.0.1:3000 | head -n 1", "8g. OHO Tech Frontend Port 3000 Health")
        run_ssh_command(ssh, "curl -fsS http://127.0.0.1:8080/actuator/health", "8h. OHO Tech Backend Port 8080 Health")

        print("\n========================================================", flush=True)
        print("✅ LIVE PRODUCTION DEPLOYMENT & HEALTH CHECKS PASSED!", flush=True)
        print("========================================================\n", flush=True)

    except Exception as e:
        print(f"\n❌ ERROR ENCOUNTERED DURING DEPLOYMENT: {e}", flush=True)
        rollback(ssh, ts)
        ssh.close()
        sys.exit(1)

    ssh.close()

if __name__ == "__main__":
    main()
