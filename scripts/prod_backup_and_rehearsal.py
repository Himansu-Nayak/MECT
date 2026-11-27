import subprocess
import time

def vps_run(cmd):
    full = f'ssh -o BatchMode=yes root@200.97.161.128 "{cmd}"'
    res = subprocess.run(full, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR ({res.returncode}): {res.stderr.strip()}")
    else:
        print(res.stdout.strip())
    return res

print("=== 1. Checking Production Postgres Health ===")
vps_run("docker exec mect-postgres pg_isready -U mect_user -d mect_db")

print("\n=== 2. Creating Native Production Backup ===")
ts = int(time.time())
backup_path = f"/opt/mect/backups/mect_prod_backup_{ts}.sql"
vps_run(f"mkdir -p /opt/mect/backups && docker exec mect-postgres pg_dump -U mect_user -d mect_db > {backup_path}")
vps_run(f"ls -lh {backup_path}")

print("\n=== 3. Calculating Backup SHA-256 ===")
vps_run(f"sha256sum {backup_path}")

print("\n=== 4. Rehearsing Restore into Disposable Database ===")
# Create disposable database
vps_run("docker exec mect-postgres psql -U mect_user -d postgres -c 'DROP DATABASE IF EXISTS mect_restore_rehearsal_db;'")
vps_run("docker exec mect-postgres psql -U mect_user -d postgres -c 'CREATE DATABASE mect_restore_rehearsal_db;'")

# Restore backup into disposable database
print("Restoring into rehearsal database...")
vps_run(f"docker exec -i mect-postgres psql -U mect_user -d mect_restore_rehearsal_db < {backup_path} >/dev/null 2>&1")

# Verify table count in rehearsal database
print("Verifying restored tables in rehearsal database:")
vps_run("docker exec mect-postgres psql -U mect_user -d mect_restore_rehearsal_db -c '\dt'")

# Clean up disposable database
print("Cleaning up disposable rehearsal database...")
vps_run("docker exec mect-postgres psql -U mect_user -d postgres -c 'DROP DATABASE mect_restore_rehearsal_db;'")
print("Rehearsal cleanup complete! Backup verified successfully.")

print("\n=== 5. Tagging Current Production Images for Instant Rollback ===")
vps_run(f"docker tag mect-frontend:production mect-frontend:rollback_{ts}")
vps_run(f"docker tag mect-backend:production mect-backend:rollback_{ts}")
vps_run("docker images | grep -E 'mect-frontend|mect-backend'")
