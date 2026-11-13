# MECT PHASE 21 — DOCKER PRODUCTION ORCHESTRATION & DEPLOYMENT REPORT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Deployment Directory:** `/opt/mect`  
**Compose File:** `/opt/mect/compose.production.yaml`  
**Audit Timestamp:** 2026-11-13T10:16:00Z (UTC)  
**Auditor:** Docker Infrastructure Engineer & Principal DevOps Lead  
**Status:** PASS — PRODUCTION STACK FULLY ORCHESTRATED & HEALTHY  

---

## 1. Production Docker Services Matrix

| Service Name | Container Name | Image Name | Base Distribution | Port Binding | Non-Root User | Healthcheck Status |
|---|---|---|---|---|---|---|
| `frontend` | `mect-frontend` | `mect-frontend:production` | Node 22 Alpine (83.7 MB standalone) | `127.0.0.1:3001->3000` | `nextjs` (UID: 1001) | `healthy` |
| `backend` | `mect-backend` | `mect-backend:production` | Eclipse Temurin 21 JRE Alpine (136 MB) | `127.0.0.1:8081->8080` | `mect` (UID: 1001) | `healthy` |
| `postgres` | `mect-postgres` | `postgres:18-alpine` | Alpine 15.2.0 (PostgreSQL 18.7) | `127.0.0.1:5433->5432` | `postgres` (UID: 70) | `healthy` |

---

## 2. Docker Compose Production Configuration

Configuration file: `/opt/mect/compose.production.yaml`:
- **Network Isolation:** Private bridge network `mect-network` (`172.x.x.x`). Internal services communicate using DNS service names (`postgres`, `backend`).
- **Loopback Port Restrictions:** Container ports are bound strictly to `127.0.0.1` (`127.0.0.1:3001`, `127.0.0.1:8081`, `127.0.0.1:5433`). External requests can only enter through Nginx on port 80/443.
- **Persistent Named Volumes:**
  - `mect-pgdata` -> `/var/lib/postgresql/data` (66 MiB database cluster and receipt PDFs).
  - `mect-media` -> `/app/uploads/media` (8 KiB CMS upload directory).
  - `mect-receipts` -> `/app/receipts` (8 KiB PDF export staging directory).
- **Restart Policy:** `restart: unless-stopped` on all 3 services ensures automatic container restart on system boot.

---

## 3. Cryptographic Build Artifact Verification

- **Backend Executable JAR Checksum:**
  - Host artifact `/opt/mect/backend/target/mahavir-backend-0.1.0-SNAPSHOT.jar`:
    `SHA-256: 1cf8afc6e284643a7545986b2789f1ea7c4e34b7522390229199eaf6c1a4ac13`
  - Container artifact `/app/mahavir-backend.jar`:
    `SHA-256: 1cf8afc6e284643a7545986b2789f1ea7c4e34b7522390229199eaf6c1a4ac13`
  - Match: **100% Exact Match**.
- **Container Health:**
  - `mect-frontend`: Up 1+ hour (`healthy`, 0 failing streaks).
  - `mect-backend`: Up 1+ hour (`healthy`, 0 failing streaks).
  - `mect-postgres`: Up 2+ hours (`healthy`, 0 failing streaks).
