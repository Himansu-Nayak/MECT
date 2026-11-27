import subprocess
import os
import hashlib

def sh(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("=== BACKUP DIRECTORY ===")
os.makedirs("/opt/mect-staging/backups", exist_ok=True)
prev_backup = "/opt/mect-staging/backups/mect_staging_backup_1795762316.sql"
if os.path.exists(prev_backup):
    with open(prev_backup, "rb") as f:
        prev_sha = hashlib.sha256(f.read()).hexdigest()
    print(f"Previous Backup: {prev_backup} (Size: {os.path.getsize(prev_backup)} bytes)")
    print(f"Previous SHA-256: {prev_sha}")

print("\n=== CREATING PRE-PHASE 2.8.1 FRESH STAGING BACKUP ===")
new_backup = "/opt/mect-staging/backups/mect_staging_pre_phase281.sql"
dump_res = sh(f"docker exec mect-postgres-staging pg_dump -U mect_staging_user mect_staging_db > {new_backup}")
if os.path.exists(new_backup):
    with open(new_backup, "rb") as f:
        new_sha = hashlib.sha256(f.read()).hexdigest()
    print(f"New Backup: {new_backup} (Size: {os.path.getsize(new_backup)} bytes)")
    print(f"New SHA-256: {new_sha}")

print("\n=== VOLUMES INTEGRITY CHECK ===")
vols = [v for v in sh("docker volume ls").splitlines() if "mect-staging" in v]
print("\n".join(vols))

print("\n=== PRODUCTION MECT & OHO TECH HEALTH ===")
print("MECT Prod Frontend (3001):", sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001"))
print("MECT Prod Backend (8081):", sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/api/v1/actuator/health"))
print("OHO Tech Frontend (3000):", sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000"))
