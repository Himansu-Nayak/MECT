import subprocess
import json

def vps_run(cmd):
    full = f'ssh -o BatchMode=yes root@200.97.161.128 "{cmd}"'
    res = subprocess.run(full, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

print("=== 1. VPS Running Docker Containers ===")
ps = vps_run("docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'")
print(ps)

print("\n=== 2. Inspecting Production MECT Deployment Directory & Compose ===")
prod_dirs = vps_run("ls -la /opt/ /root/ /home/ 2>/dev/null | grep -E 'mect|oho'")
print(prod_dirs)

print("\n=== 3. Inspecting Production Containers Inspect ===")
prod_inspect = vps_run("docker inspect mect-frontend mect-backend mect-postgres 2>/dev/null | grep -E '\"Image\":|\"Config\":|WORKING_DIR|GIT_COMMIT|PROJECT_DIR'")
print(prod_inspect)

print("\n=== 4. Production MECT DB Status (Port 5433) ===")
# Let's find out how production postgres is running
pg_prod = vps_run("docker ps --filter 'name=postgres' --format '{{.Names}}\t{{.Ports}}\t{{.Mounts}}'")
print(pg_prod)

print("\n=== 5. Production Nginx Site Configuration ===")
nginx_sites = vps_run("ls -la /etc/nginx/sites-enabled/")
print(nginx_sites)
mect_nginx = vps_run("cat /etc/nginx/sites-enabled/mect.org.in 2>/dev/null || cat /etc/nginx/sites-available/mect.org.in 2>/dev/null")
print(mect_nginx[:1000] if mect_nginx else "mect.org.in nginx config not found")
