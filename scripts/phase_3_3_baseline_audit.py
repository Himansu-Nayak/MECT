import paramiko
import json
import time

def run_baseline_audit():
    print("==================================================================", flush=True)
    print("MECT PHASE 3.3 — PRODUCTION BASELINE FORENSIC AUDIT", flush=True)
    print("Target VPS: 200.97.161.128", flush=True)
    print("==================================================================", flush=True)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("200.97.161.128", username="root", timeout=30)

    commands = [
        # 1. VPS Git repositories HEAD
        ("echo '=== VPS REPOSITORY HEADS ===' && cd /opt/mect-staging && git log -1 --format='Staging Repo: %H (%cd) - %s' && cd /opt/mect && git log -1 --format='Prod Repo (if git): %H (%cd) - %s' || true",
         "Git Repository Commit SHAs on VPS"),

        # 2. Docker Containers & Image IDs
        ("docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'",
         "Running Docker Containers"),

        ("docker inspect --format='{{.Config.Image}} {{.Id}}' mect-frontend mect-backend mect-postgres mect-frontend-staging mect-backend-staging mect-postgres-staging",
         "Container Image IDs and Configs"),

        # 3. Docker Compose files
        ("ls -la /opt/mect && ls -la /opt/mect-staging",
         "Deployment Directories File Listing"),

        # 4. Check Environment Files (sanitized - show keys only)
        ("echo '=== PROD ENV KEYS ===' && grep -E '^[A-Z_]+=' /opt/mect/.env.production | cut -d'=' -f1 && echo '=== STAGING ENV KEYS ===' && grep -E '^[A-Z_]+=' /opt/mect-staging/.env.staging | cut -d'=' -f1 || true",
         "Environment Variable Keys"),

        # 5. Check Cashfree and Payment Configuration (sanitized)
        ("grep -E 'CASHFREE|PAYMENT|UPI|SBI' /opt/mect/.env.production | sed 's/=.*/=[REDACTED]/'",
         "Production Payment Config Keys"),
        ("grep -E 'CASHFREE|PAYMENT|UPI|SBI' /opt/mect-staging/.env.staging | sed 's/=.*/=[REDACTED]/' || true",
         "Staging Payment Config Keys"),

        # 6. Check Nginx Configs
        ("cat /etc/nginx/sites-available/mect.org.in",
         "Production Nginx Configuration"),
        ("cat /etc/nginx/sites-available/staging.mect.org.in || true",
         "Staging Nginx Configuration"),

        # 7. PostgreSQL Health and Flyway Migrations in Production mect_db
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success FROM flyway_schema_history ORDER BY installed_rank ASC;'",
         "Production Flyway Schema History"),

        # 8. PostgreSQL Health and Flyway Migrations in Staging mect_staging_db
        ("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success FROM flyway_schema_history ORDER BY installed_rank ASC;' || true",
         "Staging Flyway Schema History"),

        # 9. Check Tables in Production mect_db
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c '\\dt'",
         "Production Database Tables"),

        # 10. Check Admin Users in Production
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT id, email, username, role, is_active, created_at FROM admin_users;' || docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT id, email, full_name, role FROM admin_users;' || true",
         "Production Admin Users"),

        # 11. Check Donations & Claims in Production
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT count(*) as donation_count FROM donations;' && docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT count(*) as claim_count FROM manual_bank_transfer_claims;'",
         "Production Donations and Claims Counts"),

        # 12. Check Notification Outbox in Production
        ("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT count(*) as outbox_count FROM notification_outbox;' || true",
         "Production Notification Outbox Count"),

        # 13. Check Existing Backups
        ("ls -lh /opt/mect/backups || true",
         "Existing Database Backup Files"),

        # 14. OHO Tech Status
        ("curl -sI http://127.0.0.1:3000 | head -n 3 && curl -s http://127.0.0.1:8080/actuator/health",
         "OHO Tech Health Status")
    ]

    report = {}
    for cmd, desc in commands:
        print(f"\n--- {desc} ---", flush=True)
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        report[desc] = {
            "cmd": cmd,
            "stdout": out,
            "stderr": err,
            "exit_code": stdout.channel.recv_exit_status()
        }
        if out: print(out.strip()[:1000], flush=True)
        if err: print("[STDERR] " + err.strip()[:500], flush=True)

    client.close()

    with open("docs/audits/production_baseline_raw.json", "w") as f:
        json.dump(report, f, indent=2)

    print("\nBaseline audit completed. Data saved to docs/audits/production_baseline_raw.json", flush=True)

if __name__ == "__main__":
    run_baseline_audit()
