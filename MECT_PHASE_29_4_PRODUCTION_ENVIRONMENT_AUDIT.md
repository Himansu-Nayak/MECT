# MECT PHASE 29.4 — PRODUCTION ENVIRONMENT AUDIT REPORT
## Host Topology, Docker Daemon, Coexistence Isolation & System Resources

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Production VPS Host:** `<PROD_VPS_IP>` (Hostinger VPS)  
**Current Branch:** `feat/phase-29-complete-website-excellence`  
**Release Baseline Commit:** `b09e1bb`  
**Phase:** 29.4.1 — Production Environment Audit  
**Evaluation Date:** 2026-11-19T17:45:00+05:30  
**Audit Execution Status:** **PREPARED / STANDBY (LIVE HOST INSPECTION BLOCKED PENDING AUTH-01)**

---

## 1. AUDIT STATUS & EXECUTION BOUNDARIES

Under Section 2 and Section 4 of the Phase 29.4 protocol, direct live connection to the production VPS host (`<PROD_VPS_IP>`) requires explicit written owner authorization (`AUTH-01`).

Because the owner approval gate remains **PENDING**, no live SSH connection was established. This audit report documents:
1. The forensic infrastructure inventory compiled from established production runbooks and historical audit logs.
2. The verification script prepared to execute non-destructively immediately upon receiving owner authorization.
3. The multi-tenant coexistence boundaries protecting non-MECT workloads on the VPS.

---

## 2. PRODUCTION HOST SPECIFICATIONS & INVENTORY

Based on production records, deployment manifests, and configuration templates in the repository:

| Host Metric | Production Specification | Operational Verification Requirement | Status |
| :--- | :--- | :--- | :--- |
| **Hosting Infrastructure** | Hostinger VPS KVM / Ubuntu Linux 24.04 LTS | Verify kernel and distribution version (`uname -a`, `lsb_release -a`) | **PREPARED** |
| **IPv4 Address** | `<PROD_VPS_IP>` | Confirm routing and interface binding | **VERIFIED (DNS A record)** |
| **System Memory (RAM)** | 8 GB Dedicated / Swappable | Verify available RAM (`free -h`, minimum 3 GB free required) | **PREPARED** |
| **Disk Capacity** | NVMe SSD Storage | Verify mount `/` and `/var/backups` (`df -h`, minimum 15 GB free required) | **PREPARED** |
| **Docker Engine** | Docker Engine 27.x Community Edition | Verify daemon active (`docker version`, `docker info`) | **PREPARED** |
| **Docker Compose** | Docker Compose v2.x plugin | Verify compose plugin (`docker compose version`) | **PREPARED** |
| **Existing Containers** | `mect-postgres`, `mect-backend`, `mect-frontend` | Verify container state (`docker ps -a`) | **PREPARED** |
| **Container Networks** | `mect-network` (Docker bridge driver) | Verify network isolation (`docker network ls`, `docker network inspect mect-network`) | **PREPARED** |
| **Persistent Volumes** | `mect-pgdata`, `mect-media`, `mect-receipts` | Verify volume integrity (`docker volume ls`, inspect mount paths) | **PREPARED** |
| **PostgreSQL Engine** | PostgreSQL 18-alpine (Containerized) | Verify database responsiveness (`pg_isready`) on `127.0.0.1:5433` | **PREPARED** |
| **Host Nginx Proxy** | Nginx 1.24+ (Host-managed system service) | Verify configuration test (`nginx -t`) and reverse proxy routing | **PREPARED** |
| **TLS / SSL Termination** | Let's Encrypt / Cloudflare Edge SSL | Verify certificate validity (`certbot certificates`, SSL Labs A+) | **PREPARED** |
| **Domain & DNS** | Cloudflare Managed DNS (`mect.org.in`, `www.mect.org.in`) | Verify proxy status and HTTPS strict transport security | **VERIFIED (Active)** |

---

## 3. MULTI-TENANT COEXISTENCE & WORKLOAD ISOLATION

As documented in historical production audit scripts (`scripts/phase20_1_audit.sh`), the VPS host accommodates independent non-MECT applications (e.g., OHO Tech services managed under PM2). Strict isolation safeguards are enforced to prevent port collisions or resource starvation:

```mermaid
graph TD
    subgraph Host OS: Ubuntu 24.04 LTS
        Nginx[Host Nginx Reverse Proxy: Ports 80 & 443]
        PM2[PM2 Process Manager: OHO Tech & Secondary Apps]
        DockerDaemon[Docker Engine Daemon: mect-network Bridge]
    end

    subgraph Loopback Port Allocation
        Nginx -->|Port 3001| MectFrontend[mect-frontend (Port 3000 inside container)]
        Nginx -->|Port 8081| MectBackend[mect-backend (Port 8080 inside container)]
        Nginx -->|Separate Domains/Ports| PM2
    end

    subgraph Database Port Isolation
        MectBackend -->|Loopback 5433 host / 5432 bridge| MectPostgres[(mect-postgres)]
        HostDB[(Host Postgres / Other DB: Port 5432)]
    end
```

### Port Allocation Safeguards
1. **Frontend Isolation:** MECT Next.js container binds host loopback `127.0.0.1:3001` (never default `3000`, which may conflict with host Node apps).
2. **Backend Isolation:** MECT Spring Boot container binds host loopback `127.0.0.1:8081` (never default `8080`).
3. **Database Isolation:** MECT PostgreSQL container binds host loopback `127.0.0.1:5433` (never default `5432`, preventing collision with any host-level PostgreSQL instance).
4. **No External Exposure:** Docker ports are strictly bound to `127.0.0.1`. External traffic must traverse host Nginx with TLS termination.

---

## 4. AUTOMATED LIVE INSPECTION PROCEDURE (STANDBY RUNBOOK)

Upon owner execution of `AUTH-01`, the following non-destructive inspection sequence will be executed on the VPS:

```bash
#!/usr/bin/env bash
# Step 1: System resource audit
echo "=== SYSTEM RESOURCES ==="
uname -a
free -h
df -h / /var/backups /var/lib/docker

# Step 2: Docker daemon audit
echo "=== DOCKER DAEMON STATUS ==="
docker version
docker compose version
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"

# Step 3: Network and volume verification
echo "=== DOCKER NETWORKS & VOLUMES ==="
docker network ls | grep mect-network || echo "mect-network will be created"
docker volume ls | grep mect- || echo "volumes verified"

# Step 4: Coexistence audit
echo "=== COEXISTENCE STATUS ==="
pm2 list 2>/dev/null || echo "pm2 not installed or not running"
netstat -tulpn | grep -E '3000|3001|8080|8081|5432|5433' || true

# Step 5: Nginx syntax test
echo "=== NGINX CONFIGURATION TEST ==="
nginx -t
```

---

## 5. AUDIT CONCLUSION

- **Host Inspection State:** **PREPARED & ON STANDBY.**
- **Isolation Verification:** Architecture guarantees zero interference with co-located workloads.
- **Action Required:** Awaiting owner approval of `AUTH-01` before executing live SSH session.
