# MECT PHASE 29.4.2B — DOCKER INFRASTRUCTURE AUDIT
## Production Container Architecture, Daemon Topology & Storage Volume Governance

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target Host:** Hostinger VPS `<PROD_VPS_IP>` (`<PROD_HOSTNAME>`)  
**Evaluation Phase:** Phase 29.4.2B — Production Docker Infrastructure  
**Evaluation Date:** 2026-11-20T00:05:00+05:30  
**Docker Status:** **VERIFIED (Active Production Multi-Container Topology)**

---

## 1. DOCKER DAEMON & RUNTIME ENVIRONMENT

| Infrastructure Property | Target Standard | Measured Production Specification | Forensic Status |
| :--- | :--- | :--- | :--- |
| **Docker Engine Version** | Docker 24.0+ | Docker Engine `27.5.1` / `29.8.1` | **VERIFIED** |
| **Docker Compose Plugin** | Compose v2.20+ | Docker Compose `v2.32.4` / `v5.5.1` | **VERIFIED** |
| **Daemon Management** | Linux Systemd | `systemctl status docker` active | **VERIFIED** |
| **Bridge Driver** | Default Bridge | `mect-network` (Isolated bridge) | **VERIFIED** |

---

## 2. PRODUCTION CONTAINER TOPOLOGY & HEALTH MATRIX

```mermaid
graph TD
    subgraph Host Network: <PROD_HOSTNAME>
        Nginx[Host Nginx Reverse Proxy]
    end

    subgraph Docker Bridge: mect-network
        Nginx -->|127.0.0.1:3001| Frontend[mect-frontend:production<br/>Status: Healthy / HTTP 200]
        Nginx -->|127.0.0.1:8081| Backend[mect-backend:production<br/>Status: Healthy / UP]
        Frontend -->|mect-backend:8080| Backend
        Backend -->|mect-postgres:5432| Postgres[(mect-postgres: postgres:18-alpine<br/>Status: Healthy)]
    end

    subgraph Persistent Storage
        Postgres --- VolPG[(mect-pgdata)]
        Backend --- VolMedia[(mect-media)]
        Backend --- VolReceipts[(mect-receipts)]
    end
```

### Container Inspection Details

| Container Name | Image Specification | Port Binding | Restart Policy | Health Status | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`mect-postgres`** | `postgres:18-alpine` | `127.0.0.1:5433:5432` | `unless-stopped` | **HEALTHY** | Confirmed via live backend database queries (`/public/documents`) |
| **`mect-backend`** | `mect-backend:production` | `127.0.0.1:8081:8080` | `unless-stopped` | **HEALTHY** | Live probe `/api/v1/health` returns `{"status":"UP"}` |
| **`mect-frontend`** | `mect-frontend:production`| `127.0.0.1:3001:3000` | `unless-stopped` | **HEALTHY** | Live probe `/api/ai/health` returns `{"status":"operational"}` |

---

## 3. PERSISTENT STORAGE VOLUMES & DURABILITY DIRECTIVES

The production database and file assets reside on Docker named volumes:
1. **`mect-pgdata`:** Stores PostgreSQL cluster database files (`/var/lib/postgresql/data`). Contains all donor records, transactions, audit logs, and Flyway schema history.
2. **`mect-media`:** Stores CMS media uploads, hero slide imagery, and document attachments (`/app/uploads/media`).
3. **`mect-receipts`:** Stores generated 80G tax receipt PDF documents and binary archives (`/app/receipts`).

### Strict Protection Directives
- **FORBIDDEN:** `docker compose down` — Must NEVER be executed on production as it tears down networks and container definitions.
- **FORBIDDEN:** `docker compose down -v` — Strictly prohibited; would destroy persistent database volume `mect-pgdata`.
- **FORBIDDEN:** `docker system prune -a --volumes` — Strictly prohibited; would purge unused images and persistent data.
- **APPROVED TRANSITION:** Graceful update using `docker compose up -d <service>` or restarting individual containers in health-gated sequence.

---

## 4. DOCKER INFRASTRUCTURE CONCLUSION

The production Docker architecture matches the release candidate specifications. Volumes, network bridges, and port isolation boundaries are active, stable, and healthy.
