import subprocess

def vps_run(cmd):
    full = f'ssh -o BatchMode=yes root@200.97.161.128 "{cmd}"'
    res = subprocess.run(full, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("=== 1. Git Status of /opt/mect ===")
git_head = vps_run("git -C /opt/mect rev-parse HEAD 2>/dev/null || echo 'NOT A GIT REPO'")
git_branch = vps_run("git -C /opt/mect status -s 2>/dev/null || echo 'NOT A GIT REPO'")
print(f"Git HEAD: {git_head}")
print(f"Git status:\n{git_branch}")

print("\n=== 2. Directory Listing of /opt/mect ===")
opt_mect = vps_run("ls -la /opt/mect/")
print(opt_mect)

print("\n=== 3. Compose File in /opt/mect ===")
compose = vps_run("cat /opt/mect/compose.yaml 2>/dev/null || cat /opt/mect/docker-compose.yml 2>/dev/null")
print(compose[:1500] if compose else "No compose file found")

print("\n=== 4. Environment Variables Keys in /opt/mect/.env ===")
env_keys = vps_run("cat /opt/mect/.env 2>/dev/null | grep -v '^#' | grep '=' | cut -d '=' -f 1")
print(env_keys)

print("\n=== 5. Production Database Tables & Flyway Schema History ===")
db_tables = vps_run("docker exec mect-postgres psql -U mect_user -d mect_db -c '\dt' 2>/dev/null || docker exec mect-postgres psql -U postgres -c '\l' 2>/dev/null")
print(db_tables)

flyway = vps_run("docker exec mect-postgres psql -U mect_user -d mect_db -c 'SELECT installed_rank, version, description, type, script, installed_on, execution_time, success FROM flyway_schema_history ORDER BY installed_rank;' 2>/dev/null")
print(flyway)

print("\n=== 6. Production Database Row Counts ===")
row_counts = vps_run("""docker exec mect-postgres psql -U mect_user -d mect_db -t -c "
SELECT table_name, (xpath('/row/cnt/text()', xml_count))[1]::text::int as count
FROM (
  SELECT table_name, query_to_xml(format('select count(*) as cnt from %I', table_name), false, true, '') as xml_count
  FROM information_schema.tables
  WHERE table_schema = 'public' and table_type = 'BASE TABLE'
) t ORDER BY count DESC;
" 2>/dev/null""")
print(row_counts)

print("\n=== 7. Complete Nginx mect.org.in Configuration ===")
nginx_full = vps_run("cat /etc/nginx/sites-available/mect.org.in")
print(nginx_full)
