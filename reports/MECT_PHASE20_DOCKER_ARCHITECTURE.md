# MECT Phase 20 — Docker Architecture & Topology

**Application:** Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** `https://mect.org.in/`  
**Configuration File:** `/opt/mect/compose.production.yaml`  
**Project Name:** `mect`  
**Network:** `mect-network` (bridge)

---

## 1. Network & Container Topology

```text
                                 INTERNET
                                    |
                          HTTPS (Port 443) / Cloudflare
                                    |
                             HOST NGINX PROXY
                       (/etc/nginx/sites-available/mect.org.in)
                                    |
          +-------------------------+-------------------------+
          | proxy_pass http://127.0.0.1:3001                  | proxy_pass http://127.0.0.1:8081
          v                                                   v
   +-----------------------------+             +-----------------------------+
   |   CONTAINER: mect-frontend  |             |    CONTAINER: mect-backend  |
   |   Image: mect-frontend:prod |             |    Image: mect-backend:prod |
   |   Internal Port: 3000       |             |    Internal Port: 8080      |
   |   Host Port: 127.0.0.1:3001 |             |    Host Port: 127.0.0.1:8081|
   |   User: nextjs (uid 1001)   |             |    User: mect (uid 1001)    |
   +-----------------------------+             +-----------------------------+
                  |                                           |
                  |                                           | jdbc:postgresql://mect-postgres:5432/mect_db
                  |                                           v
                  |                           +-------------------------------+
                  +-------------------------->|    CONTAINER: mect-postgres   |
                   Internal Docker Network    |    Image: postgres:18-alpine  |
                       (mect-network)         |    Internal Port: 5432        |
                                              |    Host Port: 127.0.0.1:5433  |
                                              |    Volume: mect-pgdata        |
                                              +-------------------------------+
```

---

## 2. Container Inventory & Specifications

| Container Name | Base Image | Runtime User | Internal Port | Host Port Binding | Restart Policy | Healthcheck Test |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mect-postgres` | `postgres:18-alpine` | `postgres` (999) | `5432` | `127.0.0.1:5433:5432` | `unless-stopped` | `pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB` |
| `mect-backend` | `eclipse-temurin:21-jre-alpine` | `mect` (1001) | `8080` | `127.0.0.1:8081:8080` | `unless-stopped` | `curl -f http://127.0.0.1:8080/api/v1/actuator/health` |
| `mect-frontend` | `node:22-alpine` | `nextjs` (1001) | `3000` | `127.0.0.1:3001:3000` | `unless-stopped` | `wget --spider http://127.0.0.1:3000/api/ai/health` |

---

## 3. Persistent Volumes

| Volume Name | Driver | Container Mount Point | Contents / Persistence Scope |
| :--- | :--- | :--- | :--- |
| `mect-pgdata` | `local` | `/var/lib/postgresql/data` | PostgreSQL 18.7 clusters, tables, indexes, WAL logs |
| `mect-media` | `local` | `/app/uploads/media` | Uploaded images, documents, static CMS assets |
| `mect-receipts` | `local` | `/app/receipts` | Generated 80G tax receipts and PDF donation certificates |

---

## 4. Resource Allocation & Overhead

Live verification via `docker stats --no-stream`:

```text
CONTAINER ID   NAME            CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O         PIDS
d788733511e3   mect-frontend   0.00%     51.63MiB / 15.61GiB   0.32%     15.3kB / 270kB   0B / 2.74MB       11
5c2d0d5af151   mect-backend    0.34%     459.7MiB / 15.61GiB   2.88%     186kB / 154kB    0B / 238kB        44
2bba4f5532af   mect-postgres   0.06%     46.49MiB / 15.61GiB   0.29%     105kB / 146kB    8.19kB / 83.1MB   12
```

- Total memory consumed across all 3 MECT services: **~558 MiB** (3.5% of host memory).
- Idle CPU usage: **< 0.5%**.
- High headroom available for sudden donation traffic surges and heavy reporting queries.

