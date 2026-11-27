import subprocess
import time
import json
import sys

def sh(cmd):
    print(f">> Executing: {cmd}")
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR (code {res.returncode}):\n{res.stderr}")
    else:
        print(res.stdout.strip())
    return res

print("==================================================")
print("PHASE 2.8.1 STAGING APPLICATION BUILD & DEPLOYMENT")
print("==================================================")

# 1. Verify Git commit
res_git = subprocess.run("git -C /opt/mect-staging rev-parse HEAD", shell=True, capture_output=True, text=True)
head_sha = res_git.stdout.strip()
print(f"Building from Target Commit SHA: {head_sha}")

# 2. Package Backend JAR
t0 = time.time()
print("\n[STEP 1/3] Packaging Backend JAR...")
res_mvn = subprocess.run("mvn clean package -DskipTests -f /opt/mect-staging/backend/pom.xml", shell=True, capture_output=True, text=True)
if res_mvn.returncode != 0:
    print(f"Maven build failed:\n{res_mvn.stderr}")
    sys.exit(1)
print(f"Backend JAR packaged successfully in {time.time() - t0:.1f}s")

# 3. Build Staging Docker Images
t1 = time.time()
print("\n[STEP 2/3] Building Staging Docker Images with Docker Compose...")
res_build = subprocess.run("docker compose -f /opt/mect-staging/compose.staging.yaml --env-file /opt/mect-staging/.env.staging build mect-backend-staging mect-frontend-staging", shell=True, capture_output=True, text=True)
if res_build.returncode != 0:
    print(f"Docker Compose build failed:\n{res_build.stderr}")
    sys.exit(1)
print(f"Staging images built successfully in {time.time() - t1:.1f}s")

# 4. Safely Update Only Application Containers (Preserve PostgreSQL)
t2 = time.time()
print("\n[STEP 3/3] Recreating Staging Application Containers (--no-deps)...")
res_up = subprocess.run("docker compose -f /opt/mect-staging/compose.staging.yaml --env-file /opt/mect-staging/.env.staging up -d --no-deps mect-backend-staging mect-frontend-staging", shell=True, capture_output=True, text=True)
if res_up.returncode != 0:
    print(f"Docker Compose up failed:\n{res_up.stderr}")
    sys.exit(1)
print(f"Containers recreated in {time.time() - t2:.1f}s")

# 5. Wait for Healthchecks
print("\nWaiting for containers to report healthy...")
for i in range(12):
    time.sleep(5)
    fe_health = subprocess.run("docker inspect --format='{{.State.Health.Status}}' mect-frontend-staging", shell=True, capture_output=True, text=True).stdout.strip()
    be_health = subprocess.run("docker inspect --format='{{.State.Health.Status}}' mect-backend-staging", shell=True, capture_output=True, text=True).stdout.strip()
    print(f"Check {i+1}/12: Frontend={fe_health}, Backend={be_health}")
    if fe_health == "healthy" and be_health == "healthy":
        print("Both containers reported HEALTHY!")
        break

# 6. Capture Image Provenance Details
print("\n=== STAGING IMAGE PROVENANCE ===")
res_imgs = subprocess.run("docker images --format 'json' | grep -E 'mect-frontend:staging|mect-backend:staging'", shell=True, capture_output=True, text=True)
for line in res_imgs.stdout.strip().splitlines():
    if line.strip():
        try:
            d = json.loads(line)
            print(f"Image: {d.get('Repository')}:{d.get('Tag')} | ID: {d.get('ID')} | Created: {d.get('CreatedAt')} | Size: {d.get('Size')}")
        except Exception:
            print(line)

print("\n=== RUNNING CONTAINERS ===")
res_ps = subprocess.run("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}'", shell=True, capture_output=True, text=True)
print(res_ps.stdout.strip())
