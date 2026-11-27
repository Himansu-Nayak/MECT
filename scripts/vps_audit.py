import subprocess
import json

def sh(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("=== GIT IN /opt/mect-staging ===")
print("Branch/Commit:", sh("git -C /opt/mect-staging status -b --short"))
print("HEAD SHA:", sh("git -C /opt/mect-staging rev-parse HEAD"))
print("Last commit:", sh("git -C /opt/mect-staging log -n 1 --oneline"))

print("\n=== RUNNING DOCKER CONTAINERS (STAGING & PROD) ===")
print(sh("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}'"))

print("\n=== STAGING DOCKER VOLUMES ===")
print(sh("docker volume ls | grep mect-staging"))

print("\n=== STAGING DATABASE STATUS ===")
db_check = sh("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT count(*) FROM flyway_schema_history;' -t")
print("Flyway migrations count:", db_check.strip())
last_mig = sh("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT version, description, installed_on, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 1;'")
print("Latest migration:\n", last_mig)
tbl_count = sh("docker exec mect-postgres-staging psql -U mect_staging_user -d mect_staging_db -c 'SELECT count(*) FROM information_schema.tables WHERE table_schema = \'public\';' -t")
print("Total tables in staging DB:", tbl_count.strip())

print("\n=== DOCKER IMAGE CREATION DATES ===")
print(sh("docker images --format 'table {{.Repository}}:{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}' | grep -E 'staging|mect|REPOSITORY'"))

print("\n=== STAGING CONFIGURATION CHECK ===")
print(sh("ls -la /opt/mect-staging/.env"))
