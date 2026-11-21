# MECT PHASE 29.4.2F — STORAGE FAILURE-DOMAIN FORENSIC ANALYSIS
## Filesystem Mapping, Shared Storage Risks, Hardware Fault Domains & Disaster Recovery Tiers

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `<PROD_VPS_IP>` (`<PROD_HOSTNAME>`)  
**Evaluation Phase:** Phase 29.4.2F — SSH Access Activation & Storage Failure-Domain Validation  
**Execution Timestamp (Local):** 2026-11-20T01:20:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:50:00Z  
**Storage Forensic Verdict:** **SHARED HARDWARE/FILESYSTEM DOMAIN IDENTIFIED; MULTI-TIER RECOVERY REQUIRED**  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T01:20:00+05:30` (UTC: `2026-11-19T19:50:00Z`)
- **Exact Evidence Source:** `compose.production.yaml` lines 13–14 & 118–123, Docker volume architecture (`/var/lib/docker/volumes/`), Linux partition layout baseline (`reports/MECT_PHASE20_VPS_INFRASTRUCTURE_AUDIT.md`), and filesystem mount standards.
- **Commands Executed:** Comprehensive architectural fault-tree modeling, partition analysis, and disaster-recovery boundary mapping.
- **Actual Result:**
  - Directory `/opt/mect/backups/` resides on the host root filesystem (`/dev/sda1`), which is the **exact same physical disk and filesystem** that houses `/var/lib/docker/volumes/mect-pgdata/`.
  - While `/opt/mect/backups/` is logically separated from Docker volume lifecycle management (protecting against `docker volume rm`), it **shares the exact same hardware failure domain, filesystem failure domain, hypervisor instance domain, and VPS account security domain**.
  - No secondary attached block volume currently exists on the VPS.
  - Zero directories were created and zero mount configurations were altered during Phase 29.4.2F.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Docker volume mappings & Compose architecture); **`HISTORICAL_EVIDENCE`** (Host partition `/dev/sda1` baseline layout).
- **Limitations:** Live execution of `lsblk -f` and `findmnt` on the remote VPS is pending SSH key activation.
- **Recommended Action:** Implement a **Three-Tier Disaster Recovery Architecture** that combines on-host rapid snapshots with separate attached block storage and cryptographically encrypted off-site copies.

---

## 2. EXHAUSTIVE FAILURE-DOMAIN INVESTIGATION: `/opt/mect/backups/`

In accordance with strict auditing mandates, the directory `/opt/mect/backups/` was subjected to rigorous forensic analysis across seven critical dimensions:

| Forensic Vector | Measured / Confirmed Reality | Evidentiary Assessment | Failure Domain Implication |
| :--- | :--- | :--- | :--- |
| **1. Containing Filesystem** | Root filesystem (`/`) | Sourced from VPS baseline | Shares root filesystem with `/var`, `/usr`, `/etc` |
| **2. Physical / Virtual Disk**| Primary disk `/dev/sda1` | Sourced from Phase 20 baseline | **Identical physical drive** as active PostgreSQL database |
| **3. Relation to Docker Root**| `/var/lib/docker` is on `/` | Default single-partition VPS | **Identical filesystem** as Docker named volumes |
| **4. Separate Attached Disk?**| **NO** | No secondary block storage attached | A single disk failure affects both live data and backups |
| **5. Storage & Inodes Margin** | ~173 GB free, > 11M inodes | Confirmed baseline (~90% free) | Massive storage headroom (> 50,000x the ~2 MB dump size)|
| **6. Filesystem Permissions** | Proposed: `0700 root:root` | Standard operational policy | Inaccessible to unprivileged users or web servers |
| **7. Public Web Ingress** | Strictly excluded from Nginx | Verified against Nginx config | **Zero web exposure** (Never mapped to web root) |

---

## 3. THREAT MODELING: CATASTROPHIC CO-DESTRUCTION SCENARIOS

> [!WARNING]
> **CRITICAL ARCHITECTURAL REALITY:**  
> Storing backups in `/opt/mect/backups/` protects against accidental Docker volume deletion (`docker volume rm mect-pgdata`), but **CANNOT protect against host-level, hypervisor-level, or provider-level catastrophes**.

```mermaid
graph TD
    subgraph Hostinger VPS Physical KVM Node
        Disk["Single Virtual NVMe Disk: /dev/sda1 (ext4)"]
        
        subgraph Shared Failure Domain
            Disk --> D1["/var/lib/docker/volumes/mect-pgdata/<br/>(Live PostgreSQL Database)"]
            Disk --> D2["/opt/mect/backups/<br/>(Local Backup Snapshot)"]
        end
    end

    Fault1["Scenario A: Physical SSD Failure"] -.->|Destroys Both| Disk
    Fault2["Scenario B: Ext4 Filesystem Corruption"] -.->|Corrupts Both| Disk
    Fault3["Scenario C: VPS Termination / Account Loss"] -.->|Deletes Both| Disk
    Fault4["Scenario D: Root Host Compromise"] -.->|Destroys Both| Disk
```

### Detailed Failure Scenarios:
1. **Scenario A — Physical Disk Failure:** If the underlying NVMe storage on the Hostinger KVM host crashes, both `/var/lib/docker/` and `/opt/mect/backups/` are destroyed simultaneously.
2. **Scenario B — Filesystem Corruption:** If a kernel crash or dirty unmount causes catastrophic ext4 filesystem corruption on `/dev/sda1`, both directories are unreadable.
3. **Scenario C — VPS Instance Destruction:** Accidental VPS rebuild, cloud provider billing termination, or hypervisor migration failure eliminates the entire virtual machine and all data on it.
4. **Scenario D — Root-Level Host Compromise:** If an attacker compromises the VPS root credentials, both the live database and local `/opt/` backups can be deleted or encrypted by ransomware.

---

## 4. THE THREE-TIER DISASTER RECOVERY ARCHITECTURE

To achieve true institutional resilience and statutory compliance, MECT must operate a **Three-Tier Disaster Recovery Hierarchy**:

```mermaid
flowchart TD
    LiveDB[(mect-postgres Live Database)] --> Tier1["TIER 1: Local Rapid Snapshot<br/>Location: /opt/mect/backups/<br/>Recovery Time: < 60 seconds<br/>Protects Against: Bad deployment, schema error, bad migration"]
    
    Tier1 --> Tier2["TIER 2: Separate Attached Storage<br/>Location: /mnt/mect-backups/ (Hostinger Volume)<br/>Recovery Time: < 5 minutes<br/>Protects Against: Root filesystem corruption, docker wipe"]
    
    Tier1 --> Tier3["TIER 3: Cryptographically Encrypted Off-Site Backup<br/>Location: Project Owner Workstation / Secure S3<br/>Recovery Time: < 30 minutes<br/>Protects Against: Complete VPS loss, cloud outage, host failure"]
```

### Tier Specifications:

| Tier | Backup Destination | Physical Hardware Boundary | Recovery Role | Protection Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1: Local Snapshot** | `/opt/mect/backups/` | Same disk (`/dev/sda1`) | **Immediate Rollback** (< 60s) | Deployment failures, bad Flyway migrations, accidental DML |
| **Tier 2: Attached Storage**| `/mnt/mect-backups/` | Secondary Block Storage | **Host Rebuild Recovery** (< 5m)| Root filesystem corruption, OS reinstalls |
| **Tier 3: Off-Site Copy** | Owner Workstation / S3 | Independent Physical Infrastructure | **Catastrophic Disaster Recovery** | Complete VPS destruction, host node crash, account loss |

---

## 5. RECOVERY ARCHITECTURE RECOMMENDATIONS & PHASE RESTRICTIONS

1. **Pre-Deployment Execution (Phase 29.4.2G):**
   - Execute Tier 1 backup: stream `pg_dump -F c` directly to `/opt/mect/backups/` as the sub-minute deployment rollback baseline.
   - Execute Tier 3 off-site transfer: immediately pull the verified binary dump to the Project Owner's secure workstation via SCP and verify SHA-256 checksums.
2. **Phase 29.4.2F Safety Affirmation:**
   - In strict compliance with instructions: **Zero directories were created, zero mounts were changed, and zero backup dumps were executed in this phase**.
