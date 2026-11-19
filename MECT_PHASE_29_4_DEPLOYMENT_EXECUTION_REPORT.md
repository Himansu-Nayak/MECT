# MECT PHASE 29.4 — DEPLOYMENT EXECUTION REPORT
## Zero-Downtime Deployment Sequence, Container Lifecycle & Transition Runbook

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `200.97.161.128`  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `b09e1bb`  
**Phase:** 29.4.5 — Controlled Application Release  
**Evaluation Date:** 2026-11-19T17:45:00+05:30  
**Deployment Execution Status:** **PREPARED / STANDBY (HOST EXECUTION BLOCKED PENDING OWNER APPROVAL)**

---

## 1. ARCHITECTURAL PRESERVATION & DEPLOYMENT PRINCIPLES

In accordance with Section 8 of the Phase 29.4 protocol:
1. **Zero Infrastructure Replacement:** Deploy strictly within the existing, proven container topology (`mect-postgres`, `mect-backend`, `mect-frontend`) without disturbing host-level services (Nginx, PM2, system daemons).
2. **Deterministic Artifact Identity:** Only deploy container images built directly from commit `b09e1bb`.
3. **Sequential Health-Gated Transitions:** Services are brought up sequentially. The frontend is never switched over until the backend passes its actuator health probe.
4. **Preservation of Previous Images:** Previous working images are retained locally as `mect-frontend:previous` and `mect-backend:previous` to permit instantaneous rollbacks.

---

## 2. PRODUCTION DEPLOYMENT STEP-BY-STEP SEQUENCE

Upon owner authorization (`AUTH-04`, `AUTH-05`, `AUTH-06`, `AUTH-07`), the following automated sequence will execute on the VPS:

```mermaid
sequenceDiagram
    autonumber
    participant Host as VPS Host (200.97.161.128)
    participant Git as GitHub Repo (b09e1bb)
    participant Docker as Docker Daemon
    participant PG as mect-postgres
    participant Backend as mect-backend
    participant Frontend as mect-frontend
    participant Nginx as Host Nginx Proxy

    Host->>Git: git fetch origin && git checkout feat/phase-29-complete-website-excellence
    Host->>Git: git reset --hard b09e1bb
    Host->>Docker: Tag existing running images as :previous for fast rollback
    Host->>Docker: docker compose -f compose.production.yaml build
    Host->>PG: Verify mect-postgres healthcheck (pg_isready)
    Host->>Backend: docker compose -f compose.production.yaml up -d --no-deps mect-backend
    loop Backend Health Probe
        Backend-->>Host: Actuator healthcheck: http://127.0.0.1:8080/api/v1/actuator/health
    end
    Host->>Frontend: docker compose -f compose.production.yaml up -d --no-deps mect-frontend
    loop Frontend Health Probe
        Frontend-->>Host: Healthcheck: http://127.0.0.1:3000/api/ai/health
    end
    Host->>Nginx: nginx -t && systemctl reload nginx
    Host->>Frontend: Execute smoke tests via https://mect.org.in
```

### Scripted Execution Commands
```bash
#!/usr/bin/env bash
set -euo pipefail

cd /opt/mect # or production repository root

# 1. Synchronize exact release commit
git fetch origin feat/phase-29-complete-website-excellence
git checkout feat/phase-29-complete-website-excellence
git reset --hard b09e1bb
test "$(git rev-parse --short HEAD)" = "b09e1bb" || (echo "Commit mismatch!" && exit 1)

# 2. Backup existing container images for instant rollback
docker tag mect-frontend:production mect-frontend:previous || true
docker tag mect-backend:production mect-backend:previous || true

# 3. Build new container images
docker compose -f compose.production.yaml build

# 4. Gracefully restart backend and await healthcheck
docker compose -f compose.production.yaml up -d --no-deps mect-backend
echo "Waiting for mect-backend health..."
until [ "$(docker inspect -f {{.State.Health.Status}} mect-backend)" = "healthy" ]; do
    sleep 2
done

# 5. Gracefully restart frontend and await healthcheck
docker compose -f compose.production.yaml up -d --no-deps mect-frontend
echo "Waiting for mect-frontend health..."
until [ "$(docker inspect -f {{.State.Health.Status}} mect-frontend)" = "healthy" ]; do
    sleep 2
done

# 6. Test and reload Nginx
nginx -t
systemctl reload nginx
```

---

## 3. CONTAINER RUNTIME PARAMETERS & PORTS

| Service | Container Name | Base Image | Host Loopback Port | Internal Port | Memory Limit | Health Check |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Database** | `mect-postgres` | `postgres:18-alpine` | `127.0.0.1:5433` | `5432` | 2048 MB | `pg_isready` (every 10s) |
| **Backend API** | `mect-backend` | `eclipse-temurin:21` | `127.0.0.1:8081` | `8080` | 512 MB Heap (`-Xmx512m`) | `/api/v1/actuator/health` (every 20s) |
| **Frontend Web** | `mect-frontend` | `node:22-alpine` | `127.0.0.1:3001` | `3000` | 1024 MB | `/api/ai/health` (every 30s) |

---

## 4. DEPLOYMENT VERIFICATION GATES

| Verification Step | Target Endpoint / Metric | Success Criterion | Status |
| :--- | :--- | :--- | :--- |
| **Backend Actuator** | `http://127.0.0.1:8081/api/v1/actuator/health` | HTTP 200, `{"status":"UP"}` | **STANDBY** |
| **Frontend Health** | `http://127.0.0.1:3001/api/ai/health` | HTTP 200, `{"status":"ok"}` | **STANDBY** |
| **Database Connectivity** | `mect-postgres` query via backend pool | HikariPool-1 connection established | **STANDBY** |
| **Host Nginx Routing** | `https://mect.org.in/api/v1/health` | HTTP 200 via SSL proxy | **STANDBY** |
| **TLS Certificate** | `https://mect.org.in/` | Valid Let's Encrypt / Cloudflare Edge cert | **VERIFIED (Active)** |

---

## 5. DEPLOYMENT REPORT CONCLUSION

- **Release Artifacts:** Built and cryptographically anchored.
- **Compose Manifest:** Corrected and verified.
- **Rollback Snapshot Strategy:** Retains `:previous` tags for sub-10-second container reversion.
- **Execution State:** **HALTED AT OWNER GATE (AUTH-04 through AUTH-07).**
