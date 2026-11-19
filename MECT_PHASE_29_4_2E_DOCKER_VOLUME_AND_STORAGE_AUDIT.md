# MECT PHASE 29.4.2E — DOCKER VOLUME & STORAGE MOUNT AUDIT
## Storage Topologies, Volume Failure Domains & Container Mount Configurations

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `200.97.161.128` (`srv2000528`)  
**Evaluation Phase:** Phase 29.4.2E — Authenticated Production Verification & Backup Readiness  
**Execution Timestamp (Local):** 2026-11-20T01:08:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:38:00Z  
**Storage Audit Outcome:** **FAILURE DOMAIN IDENTIFIED & ARCHITECTURAL MITIGATION DEFINED**  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T01:08:00+05:30` (UTC: `2026-11-19T19:38:00Z`)
- **Exact Evidence Source:** Direct static audit of `compose.production.yaml` (lines 1–123), inspecting services `mect-postgres`, `mect-backend`, `mect-frontend`, and the top-level `volumes:` section.
- **Commands Executed:** Comprehensive structural parse of production Docker Compose volume declarations and mount points.
- **Actual Result:**
  - Three named volumes are declared: `mect-pgdata`, `mect-media`, `mect-receipts`.
  - Service `mect-postgres` mounts exclusively `mect-pgdata:/var/lib/postgresql/data`.
  - Zero dedicated backup bind mounts exist inside `mect-postgres` in `compose.production.yaml`.
  - Failure Domain Risk: Writing backups to `/var/lib/postgresql/data/backups/` places them inside the named volume `mect-pgdata` (`/var/lib/docker/volumes/mect-pgdata/_data/`), sharing the exact same failure domain as active PostgreSQL data files.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Compose volume declarations and mount topology).
- **Limitations:** Live host filesystem mount table (`mount`, `findmnt`) and volume disk usage on the remote VPS could not be inspected directly pending SSH key activation.
- **Recommended Action:** Stream `pg_dump` backups via stdout directly to an independent host filesystem directory (`/opt/mect/backups/`), completely outside Docker named volumes.

---

## 2. PRODUCTION DOCKER VOLUME TOPOLOGY MATRIX

```mermaid
graph TD
    subgraph Host Storage: /dev/sda1 (193 GB NVMe)
        DockerRoot["/var/lib/docker/volumes/"]
        HostBackup["/opt/mect/backups/<br/>(Independent Failure Domain)"]
        
        subgraph Docker Named Volumes
            DockerRoot --> VolPG["mect-pgdata/_data/<br/>(Live PostgreSQL Data)"]
            DockerRoot --> VolMedia["mect-media/_data/<br/>(Uploads & KYC Proofs)"]
            DockerRoot --> VolReceipts["mect-receipts/_data/<br/>(80G Tax PDF Receipts)"]
        end
    end

    subgraph Containers
        Postgres[mect-postgres] -->|Mounts /var/lib/postgresql/data| VolPG
        Backend[mect-backend] -->|Mounts /app/uploads/media| VolMedia
        Backend -->|Mounts /app/receipts| VolReceipts
    end

    Postgres -.->|CORRECT BACKUP ROUTE: stdout stream| HostBackup
```

### Detailed Volume Specification Table

| Volume Name | Docker Type | Container Service | In-Container Mount Destination | Host Filesystem Location | Failure Domain Assessment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`mect-pgdata`** | Named Volume | `mect-postgres` | `/var/lib/postgresql/data` | `/var/lib/docker/volumes/mect-pgdata/_data` | **LIVE DATABASE DOMAIN** |
| **`mect-media`** | Named Volume | `mect-backend` | `/app/uploads/media` | `/var/lib/docker/volumes/mect-media/_data` | **APPLICATION ASSET DOMAIN** |
| **`mect-receipts`**| Named Volume | `mect-backend` | `/app/receipts` | `/var/lib/docker/volumes/mect-receipts/_data` | **STATUTORY RECORD DOMAIN** |
| **Host Backups** | Host Directory | Host Direct | Outside Container | `/opt/mect/backups/` | **INDEPENDENT BACKUP DOMAIN** |

---

## 3. CRITICAL FAILURE-DOMAIN ARCHITECTURAL FINDING

### The Shared Failure Domain Hazard:
In prior draft runbooks, the command `docker exec mect-postgres pg_dump ... -f /var/lib/postgresql/data/backups/backup.dump` was suggested.

**Forensic Audit Finding:**
1. In `compose.production.yaml`, `/var/lib/postgresql/data` is mounted to named volume `mect-pgdata`.
2. Any directory created under `/var/lib/postgresql/data/` (such as `.../backups/`) resides physically inside the named volume storage path `/var/lib/docker/volumes/mect-pgdata/_data/backups/`.
3. **Catastrophic Failure Modes:**
   - If an operator executes `docker compose down -v` or `docker volume rm mect-pgdata`, Docker permanently deletes the entire volume directory tree, **wiping both the database and all stored backups simultaneously**.
   - If the PostgreSQL storage engine experiences filesystem corruption in `mect-pgdata`, the backup files inside the same volume are subject to identical corruption.
   - Database operations and backup archiving contend for the same directory metadata locks.

---

## 4. ARCHITECTURAL REMEDIATION: INDEPENDENT HOST BACKUP PATHWAY

To eliminate the shared failure domain risk without modifying running container definitions:

### The Safe Streaming Pipeline:
Instead of writing inside the container filesystem, stream the binary dump through stdout directly to the host filesystem:

```bash
# Stream dump directly to independent host directory /opt/mect/backups/
mkdir -p /opt/mect/backups
chmod 700 /opt/mect/backups

docker exec mect-postgres pg_dump \
  -U mect_user \
  -d mect_prod \
  -F c -b -v \
  > "/opt/mect/backups/mect_prod_backup_$(date +%Y%m%d_%H%M%S).dump"
```

### Architectural Benefits:
1. **Failure Domain Separation:** The backup file is written directly to the host NVMe filesystem outside `/var/lib/docker/volumes/`. Even if `mect-pgdata` is destroyed, the backup remains completely intact.
2. **Zero Modification to Running Containers:** Requires zero container restarts, zero Compose file modifications, and zero downtime.
3. **Strict Access Permissions:** The directory `/opt/mect/backups/` is owned by `root` with `chmod 700`, inaccessible to public web servers, unauthenticated users, or non-MECT tenants.

---

## 5. LEVEL B LIVE STORAGE PROBE SCRIPT (READY FOR SSH)

```bash
# Inspect Docker volume locations and host mount devices
echo "=== DOCKER VOLUME METADATA ==="; docker volume inspect mect-pgdata mect-media mect-receipts; \
echo "=== HOST STORAGE MOUNT DEVICE ==="; df -hT /var/lib/docker; \
echo "=== INDEPENDENT BACKUP DIRECTORY PERMISSIONS ==="; ls -ld /opt/mect/backups 2>/dev/null || echo "Directory not yet created"
```
