# MECT PHASE 29.4.2D — FINAL PRODUCTION DATABASE SAFETY GATE
## Level A/B/C Governance Gate, Preflight Decision & Production Backup Proposal

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Target VPS Host:** `200.97.161.128` (`srv2000528`)  
**Release Target Baseline:** Commit `c5aa4e8`  
**Current Audit Commit:** Commit `df7f03d`  
**Release Branch:** `feat/phase-29-complete-website-excellence`  
**Evaluation Phase:** Phase 29.4.2D — Owner-Assisted VPS Preflight & Database Safety Gate  
**Execution Timestamp (Local):** 2026-11-20T00:48:00+05:30  
**Execution Timestamp (UTC):** 2026-11-19T19:18:00Z  

---

## 1. MANDATORY METADATA HEADER

- **Execution Timestamp:** `2026-11-20T00:48:00+05:30` (UTC: `2026-11-19T19:18:00Z`)
- **Exact Evidence Source:** Synthesis of Phase 29.4.2D Deliverables 1 through 8, static inspection of migration DDL (`V15`/`V16`), local disaster recovery drill evidence, and boundary enforcement rules.
- **Command Used:** Governance gate evaluation across Level A (Local), Level B (Remote Read-Only), and Level C (Production Backup).
- **Actual Result:**
  - Level A (Local preparation) is **COMPLETE**.
  - Level B (Authenticated remote read-only inspection) is **BLOCKED** pending owner SSH key creation.
  - Level C (Production backup operation) is **PREPARED** and awaiting separate owner approval.
- **Verification Classification:** **`VERIFIED_DIRECTLY`** (Local preparation, DDL safety, and backup proposal).
- **Limitations:** Live execution on the production database requires authenticated SSH access.
- **Recommended Action:** Project Owner authorizes Git push, adds SSH key in Hostinger hPanel, and approves the Level C backup proposal.

---

## 2. FORMAL FINAL DECISION

In strict accordance with Phase 29.4.2D instructions:

```
+=============================================================================+
|                      MECT PHASE 29.4.2D FINAL DECISION                      |
+=============================================================================+
|                                                                             |
|            >>> CONDITIONAL GO — OWNER ACTION REQUIRED <<<                   |
|                                                                             |
| 1. LEVEL A (Local Preparation): COMPLETE.                                   |
|    Codebase, test suite (127/127), Next.js build (51 routes), Compose       |
|    manifest, and Flyway DDL (V15/V16) are verified safe and release-ready.  |
| 2. LEVEL B (Remote VPS Read-Only Inspection): BLOCKED.                      |
|    Authenticated SSH access requires the Project Owner to generate an       |
|    ED25519 key on Windows and register it in Hostinger hPanel.              |
| 3. LEVEL C (Production Database Backup): PROPOSED.                          |
|    Detailed backup proposal is submitted below for explicit owner approval. |
|                                                                             |
| >>> ABSOLUTE RULE: PRODUCTION DEPLOYMENT & MIGRATIONS REMAIN ON HOLD <<<   |
| Deployment requires a separate, subsequent authorization.                   |
|                                                                             |
+=============================================================================+
```

---

## 3. THREE-LEVEL AUTHORIZATION BOUNDARY STATUS

```mermaid
flowchart TD
    subgraph Level A: Local Preparation
        A1[Local Git State: Clean] --> A2[V15/V16 Source DDL: Safe]
        A2 --> A3[Compose & Dockerfiles: Verified]
        A3 --> A4[STATUS: COMPLETE (Green)]
    end

    subgraph Level B: Remote Read-Only Inspection
        B1[Host ED25519 in known_hosts] --> B2{Key on Workstation?}
        B2 -- Absent --> B3[STATUS: BLOCKED (Amber)]
        B3 --> B4[Action: Owner adds key via hPanel]
    end

    subgraph Level C: Production Backup Operation
        C1[Formulate Backup Proposal] --> C2[Define Checksum & Storage Specs]
        C2 --> C3[STATUS: AWAITING OWNER APPROVAL (Blue)]
        C3 --> C4[Action: Owner signs off on backup command]
    end
```

| Authorization Level | Scope & Boundary | Current Status | Required Unblocking Action |
| :--- | :--- | :--- | :--- |
| **LEVEL A — Local Preparation** | Inspect Git, client config, DDL safety, build manifests | **PASSED / COMPLETE** | None. Fully verified locally. |
| **LEVEL B — Read-Only Inspection** | Inspect live host memory, disk, Docker, Flyway history | **BLOCKED** | Owner generates SSH key and adds to Hostinger hPanel. |
| **LEVEL C — Production Backup** | Execute `pg_dump` snapshot into `/var/lib/postgresql/data/` | **AWAITING APPROVAL** | Owner approves the proposed backup command below. |

---

## 4. FORMAL PRODUCTION BACKUP PROPOSAL (LEVEL C GATE)

Under Level C rules, **no production backup operation may be executed without explicit Project Owner authorization of the exact command, destination, and retention parameters**.

The proposed operation is specified below for owner review:

### 4.1 Exact Database & Scope
- **Container Name:** `mect-postgres`
- **Database Name:** `mect_prod`
- **Database User:** `mect_user`
- **Backup Type:** Complete binary custom database archive (`pg_dump -F c -b -v`).
- **Data Included:** All database schemas, tables, sequences, constraints, indexes, statutory records, donor profiles, and Flyway history.
- **Estimated Backup Size:** ~150 KB to 2 MB.
- **Estimated Duration:** < 3 seconds.

### 4.2 Exact Execution Command (To Be Run on VPS Terminal)
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p /var/lib/postgresql/data/backups

docker exec mect-postgres pg_dump \
  -U mect_user \
  -d mect_prod \
  -F c -b -v \
  -f "/var/lib/postgresql/data/backups/pre_deploy_${TIMESTAMP}.dump"
```

### 4.3 Target Directory & Storage Margin
- **Target Host Directory:** `/var/lib/postgresql/data/backups/`
- **Required Free Space:** < 5 MB.
- **Available Host Margin:** ~173 GB free NVMe storage (> 90% unallocated).
- **Safety Policy:** Never overwrites any existing backup file (uses unique timestamp suffix).

### 4.4 Verification & Checksum Commands
```bash
# Generate SHA-256 Checksum
sha256sum "/var/lib/postgresql/data/backups/pre_deploy_${TIMESTAMP}.dump" \
  > "/var/lib/postgresql/data/backups/pre_deploy_${TIMESTAMP}.dump.sha256"

# Verify Table of Contents catalog without restoring
docker exec mect-postgres pg_restore \
  --list "/var/lib/postgresql/data/backups/pre_deploy_${TIMESTAMP}.dump" | head -n 25

# Verify non-zero file size and permissions
ls -lh "/var/lib/postgresql/data/backups/pre_deploy_${TIMESTAMP}.dump"
```

### 4.5 Data Protection & Retention Rules
1. **Never Restore Into Live Database:** Restore rehearsals must occur in isolated local/staging test containers only.
2. **Never Expose via HTTP:** The backup directory is strictly excluded from Nginx and Next.js web roots.
3. **Retention Policy:** The pre-deployment snapshot is preserved indefinitely on host NVMe storage as the definitive rollback baseline for Release `c5aa4e8`.

---

## 5. SEQUENTIAL OWNER ACTION PATHWAY

To move from **`CONDITIONAL GO`** to execution:

```
Step 1: Push release branch to GitHub
        PowerShell: git push -u origin feat/phase-29-complete-website-excellence

Step 2: Generate and configure ED25519 SSH key
        PowerShell: ssh-keygen -t ed25519 -C "mect-owner@mect.org.in" -f "$HOME\.ssh\id_ed25519_mect"
        Paste public key into Hostinger hPanel -> VPS (srv2000528) -> SSH Keys

Step 3: Confirm Fast2SMS wallet balance
        Log into fast2sms.com -> Verify > 500 SMS credits available

Step 4: Explicitly approve Level C Backup Operation
        Authorize the pre-deployment pg_dump command specified in Section 4.2
```

---

## 6. PHASE 29.4.2D DELIVERABLES REGISTER

All nine Phase 29.4.2D audit and preflight deliverables are documented in the workspace:

1. [MECT_PHASE_29_4_2D_SSH_AUTHENTICATION_REPORT.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_SSH_AUTHENTICATION_REPORT.md)
2. [MECT_PHASE_29_4_2D_VPS_SYSTEM_INVENTORY.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_VPS_SYSTEM_INVENTORY.md)
3. [MECT_PHASE_29_4_2D_DOCKER_AND_APPLICATION_AUDIT.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_DOCKER_AND_APPLICATION_AUDIT.md)
4. [MECT_PHASE_29_4_2D_PRODUCTION_FLYWAY_VERIFICATION.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_PRODUCTION_FLYWAY_VERIFICATION.md)
5. [MECT_PHASE_29_4_2D_V15_V16_MIGRATION_SAFETY_REVIEW.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_V15_V16_MIGRATION_SAFETY_REVIEW.md)
6. [MECT_PHASE_29_4_2D_PRODUCTION_BACKUP_INVENTORY.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_PRODUCTION_BACKUP_INVENTORY.md)
7. [MECT_PHASE_29_4_2D_EXTERNAL_DEPENDENCY_READINESS.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_EXTERNAL_DEPENDENCY_READINESS.md)
8. [MECT_PHASE_29_4_2D_PRODUCTION_RISK_REGISTER.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_PRODUCTION_RISK_REGISTER.md)
9. [MECT_PHASE_29_4_2D_FINAL_DATABASE_SAFETY_GATE.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/MECT_PHASE_29_4_2D_FINAL_DATABASE_SAFETY_GATE.md)
