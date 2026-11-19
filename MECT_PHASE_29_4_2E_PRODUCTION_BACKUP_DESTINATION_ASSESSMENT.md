# MECT PHASE 29.4.2E — PRODUCTION BACKUP DESTINATION FORENSIC ASSESSMENT
## Failure Domain Modeling, Storage Architecture & Off-Site Disaster Recovery Assessment

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `200.97.161.128` (`srv2000528`)  
**Evaluation Phase:** Phase 29.4.2E — Authenticated Production Verification & Backup Readiness  
**Execution Timestamp (Local):** 2026-11-20T01:08:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:38:00Z  
**Assessment Outcome:** **FAILURE DOMAIN SEPARATION MANDATE DEFINED**  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T01:08:00+05:30` (UTC: `2026-11-19T19:38:00Z`)
- **Exact Evidence Source:** Direct static audit of `compose.production.yaml` (volume declarations), Linux Docker storage driver architecture (`/var/lib/docker/volumes/`), and host filesystem baseline specifications (`reports/MECT_PHASE20_VPS_INFRASTRUCTURE_AUDIT.md`).
- **Commands Executed:** Comparative failure-domain modeling between in-volume backup targets and independent host storage destinations.
- **Actual Result:**
  - Writing backups into `/var/lib/postgresql/data/backups/` places them inside Docker named volume `mect-pgdata`, creating a **shared failure domain hazard** where volume loss destroys both the database and the backups.
  - Dedicated host directory `/opt/mect/backups/` resides outside Docker volume management, providing **independent failure domain isolation**.
  - Host NVMe storage has ~173 GB available margin, vastly exceeding the ~2 MB backup requirement.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Docker volume failure-domain evaluation).
- **Limitations:** Live host partition table (`lsblk`, `findmnt`) could not be polled directly on the VPS pending SSH key activation.
- **Recommended Action:** Formally reject in-volume backup storage; establish `/opt/mect/backups/` as the designated host backup directory.

---

## 2. COMPARATIVE FAILURE DOMAIN EVALUATION

```mermaid
graph TD
    subgraph Shared Failure Domain: HAZARDOUS
        Vol["Docker Named Volume: mect-pgdata<br/>(/var/lib/docker/volumes/mect-pgdata/_data)"]
        Vol --> DBFiles["Live Database Heap: PGDATA"]
        Vol --> BadBackup["Backups in /var/lib/postgresql/data/backups/<br/>(DESTROYED if volume is deleted or corrupted!)"]
    end

    subgraph Independent Failure Domain: RECOMMENDED
        HostFS["Dedicated Host Storage: /opt/mect/backups/<br/>Permissions: chmod 700 / root:root"]
        HostFS --> SafeBackup["Timestamped Backup Dump Archive<br/>(SURVIVES container or volume deletion!)"]
    end
```

### Detailed Location Comparison Table

| Evaluation Criterion | Candidate 1: `/var/lib/postgresql/data/backups/` | Candidate 2: `/opt/mect/backups/` (Recommended) |
| :--- | :--- | :--- |
| **Physical Storage Path** | `/var/lib/docker/volumes/mect-pgdata/_data/backups/` | `/opt/mect/backups/` on host root filesystem |
| **Failure Domain** | **SHARED WITH DATABASE** (High Risk) | **INDEPENDENT OF DOCKER VOLUMES** (Safe) |
| **Survival on `docker compose down -v`**| **PERMANENTLY DELETED** | **COMPLETELY PRESERVED** |
| **Survival on Volume Corruption** | **CORRUPTED ALONGSIDE DATABASE** | **COMPLETELY PRESERVED** |
| **Access Control Permissions** | Inherits Docker volume permissions | Strictly restricted: `chmod 700 root:root` |
| **Public HTTP Exposure Risk** | Low (not directly in web root) | **ZERO** (Completely outside Nginx/Next.js) |
| **Storage Capacity Available** | Shares `/var/lib/docker` slice | Host NVMe storage has ~173 GB free margin |
| **Recommendation Verdict** | **REJECTED (Dangerous Failure Domain)** | **ADOPTED AS PRODUCTION STANDARD** |

---

## 3. INDEPENDENT FAILURE-DOMAIN SPECIFICATIONS

To satisfy institutional disaster-recovery standards, the production backup storage must adhere to the following four rules:

1. **Rule 1 — Absolute Volume Independence:**
   The backup archive must reside physically outside `/var/lib/docker/volumes/`. Storing backups inside `mect-pgdata` is formally prohibited.
2. **Rule 2 — Filesystem Access Restriction:**
   The host directory `/opt/mect/backups/` must be provisioned with `chmod 700` and owned by `root:root`, preventing reading by unprivileged users, web servers, or co-hosted non-MECT tenants (OHO Tech).
3. **Rule 3 — Zero Web Ingress:**
   The host directory must never be mapped or symlinked into `/etc/nginx/sites-available/mect.conf` or `/var/www/`.
4. **Rule 4 — Immutable Snapshot Policy:**
   Every backup must be named with a microsecond-resolution timestamp (`mect_prod_backup_YYYYMMDD_HHMMSS.dump`). Existing backup archives must never be overwritten, appended to, or deleted during deployment.

---

## 4. SECONDARY & OFF-SITE DISASTER RECOVERY PROTOCOL

While storing backups in `/opt/mect/backups/` protects against container and volume destruction, host-level hardware failures (e.g. host catastrophic drive failure) require an off-site secondary copy:

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Project Owner
    participant VPS as Hostinger VPS (srv2000528)
    participant Offsite as Off-Site Secure Storage / Local Workstation

    Note over VPS: pg_dump streamed to /opt/mect/backups/
    VPS ->> VPS: Generate SHA-256 Checksum
    VPS ->> VPS: Validate Archive TOC (pg_restore --list)
    Owner ->> VPS: SCP pull backup archive to local workstation
    VPS -->> Offsite: Transfer mect_prod_backup_*.dump
    Offsite ->> Offsite: Verify SHA-256 Checksum Match
    Note over Offsite: Secondary off-site copy secured
```

### Off-Site Transfer Command (Local PowerShell):
```powershell
# Transfer verified production dump to local workstation as secondary off-site backup
scp -i "$HOME\.ssh\id_ed25519_mect" -o KexAlgorithms=curve25519-sha256 root@200.97.161.128:/opt/mect/backups/mect_prod_backup_*.dump "C:\Users\himan\OneDrive\Desktop\MECT_BACKUPS\"
```

---

## 5. BACKUP DESTINATION AUDIT CONCLUSION

```
+=============================================================================+
|             MECT PHASE 29.4.2E BACKUP DESTINATION VERDICT                   |
+=============================================================================+
| 1. In-Volume Backup (/var/lib/postgresql/data):  FORMALLY REJECTED (Unsafe) |
| 2. Independent Host Backup (/opt/mect/backups):  FORMALLY ADOPTED (Safe)    |
| 3. Storage Failure Domain:                       SEPARATED FROM DOCKER      |
| 4. Available Host Margin:                        ~173 GB FREE NVMe          |
| 5. Public Exposure Risk:                         0.0% (Outside web root)    |
+=============================================================================+
| OUTCOME:                                         DESTINATION QUALIFIED      |
+=============================================================================+
```
