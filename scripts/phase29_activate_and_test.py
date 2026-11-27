import subprocess
import time
import os
import json
import urllib.request
import ssl

def sh(cmd):
    print(f">> Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"FAILED (code {res.returncode}):\n{res.stderr.strip()}")
    else:
        print(res.stdout.strip())
    return res

print("==================================================================")
print("MECT PHASE 2.9 - NGINX ACTIVATION, REBUILD & LIVE VERIFICATION")
print("==================================================================")

# Step 1: Sync /opt/mect-staging to latest git commit
print("\n[STEP 1] Syncing /opt/mect-staging to latest commit...")
sh("git -C /opt/mect-staging fetch origin && git -C /opt/mect-staging merge --ff-only origin/feat/complete-website-redefinition-and-deduplication")
head_sha = sh("git -C /opt/mect-staging rev-parse HEAD").stdout.strip()
print(f"Synced Git HEAD on VPS: {head_sha}")

# Step 2: Backup Nginx configuration
print("\n[STEP 2] Creating timestamped Nginx configuration backups...")
ts = int(time.time())
sh(f"cp -r /etc/nginx/sites-available /etc/nginx/sites-available.backup-{ts}")
sh(f"cp -r /etc/nginx/sites-enabled /etc/nginx/sites-enabled.backup-{ts}")

# Step 3: Copy staging virtual host configuration
print("\n[STEP 3] Installing staging Nginx configuration to /etc/nginx/sites-available/...")
sh("cp /opt/mect-staging/docker/nginx/staging.mect.org.in.conf /etc/nginx/sites-available/staging.mect.org.in.conf")

# Step 4: Validate Nginx syntax before linking
print("\n[STEP 4] Preflight Nginx syntax validation...")
res_t1 = sh("nginx -t")
if res_t1.returncode != 0:
    print("FATAL: Nginx syntax check failed before linking! Aborting.")
    exit(1)

# Step 5: Enable staging virtual host in sites-enabled
print("\n[STEP 5] Symlinking staging.mect.org.in.conf to /etc/nginx/sites-enabled/...")
sh("ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/staging.mect.org.in.conf")

# Step 6: Validate Nginx syntax with staging enabled
print("\n[STEP 6] Post-link Nginx syntax validation...")
res_t2 = sh("nginx -t")
if res_t2.returncode != 0:
    print("FATAL: Nginx syntax check failed after linking! Rolling back symlink.")
    sh("rm -f /etc/nginx/sites-enabled/staging.mect.org.in.conf")
    exit(1)

# Step 7: Graceful Nginx reload
print("\n[STEP 7] Executing graceful Nginx reload (systemctl reload nginx)...")
res_reload = sh("systemctl reload nginx")
if res_reload.returncode != 0:
    print("FATAL: Nginx reload failed! Rolling back.")
    sh("rm -f /etc/nginx/sites-enabled/staging.mect.org.in.conf && systemctl reload nginx")
    exit(1)
print("Nginx gracefully reloaded successfully!")

# Step 8: Immediate Production Isolation Regression Probe
print("\n[STEP 8] Immediate Production Isolation & Regression Check...")
prod_web = sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3001").stdout.strip()
prod_api = sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/api/v1/actuator/health").stdout.strip()
oho_web = sh("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000").stdout.strip()
print(f"Production MECT Web (3001): {prod_web} | API (8081): {prod_api}")
print(f"OHO Tech Web (3000): {oho_web}")
if prod_web != "200" or prod_api != "200" or oho_web != "200":
    print("CRITICAL ALERT: Production service impacted! Stopping further actions.")
    exit(1)
print("Production services 100% UNTOUCHED and OPERATIONAL!")

# Step 9: Rebuild Frontend with Same-Origin API URL (https://staging.mect.org.in/api/v1)
print("\n[STEP 9] Rebuilding Frontend Image with same-origin API URL...")
t_fe = time.time()
res_fe = sh("docker compose -f /opt/mect-staging/compose.staging.yaml --env-file /opt/mect-staging/.env.staging build mect-frontend-staging")
if res_fe.returncode != 0:
    print("Frontend build failed!")
    exit(1)
print(f"Frontend image rebuilt in {time.time() - t_fe:.1f}s")

print("Recreating mect-frontend-staging container...")
sh("docker compose -f /opt/mect-staging/compose.staging.yaml --env-file /opt/mect-staging/.env.staging up -d --no-deps mect-frontend-staging")

# Wait for frontend health
print("Waiting for frontend container to become healthy...")
for i in range(12):
    time.sleep(5)
    fe_status = sh("docker inspect --format='{{.State.Health.Status}}' mect-frontend-staging").stdout.strip()
    print(f"Check {i+1}/12: Frontend={fe_status}")
    if fe_status == "healthy":
        print("Frontend container is HEALTHY!")
        break

# Step 10: Ingress Verification
print("\n[STEP 10] Ingress Tests...")
# Local loopback SNI probe (allowed by allow 127.0.0.1)
loopback_fe = sh("curl -s -k -I https://127.0.0.1/ -H 'Host: staging.mect.org.in' | head -n 5").stdout.strip()
print(f"Local Loopback SNI staging.mect.org.in:\n{loopback_fe}")

loopback_api = sh("curl -s -k https://127.0.0.1/api/v1/actuator/health -H 'Host: staging.mect.org.in'").stdout.strip()
print(f"Local Loopback same-origin /api/ health:\n{loopback_api}")

# Test direct IP rejection (simulating non-Cloudflare external IP, if we test with an unallowed IP or curl from outside)
print("\nAll activation steps completed!")
