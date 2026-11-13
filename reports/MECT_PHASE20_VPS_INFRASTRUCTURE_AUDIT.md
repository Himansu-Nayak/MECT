# MECT Phase 20 — VPS Infrastructure & Preflight Audit

**Execution Date:** 2026-11-13  
**Server Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Deployment Target:** Production MECT (`https://mect.org.in/`)  
**Isolation Status:** OHO TECH and other VPS applications completely isolated and untouched.

---

## 1. Operating System & Host Environment

| Telemetry Property | Verified Value | Evidence / Command Output |
| :--- | :--- | :--- |
| **Hostname** | `srv2000528` | `hostname` -> `srv2000528` |
| **IP Address** | `200.97.161.128` | SSH Target IPv4 |
| **Operating System** | `Ubuntu 26.04.1 LTS` | `PRETTY_NAME="Ubuntu 26.04.1 LTS"` |
| **Kernel** | `Linux 7.0.0-38-generic #38-Ubuntu` | `x86_64 GNU/Linux` |
| **CPU Architecture** | 4 vCPUs | `lscpu \| grep 'CPU(s):' -> 4` |
| **Total Memory** | 15 GiB RAM | `Mem: 15Gi, Used: 2.5Gi, Free: ~1Gi, Buff/Cache: 12Gi, Available: 13Gi` |
| **Disk Storage** | 193 GB Total (`/dev/sda1`) | `193G total, 20G used (10%), 174G available` |
| **Docker Engine** | `29.8.1`, build `4a63305` | `/usr/bin/docker` |
| **Docker Compose** | `v5.5.1` | `/usr/bin/docker compose` |
| **System Uptime** | 27 days, 20+ hours | `uptime` verified |

---

## 2. Multi-Tenant Service Isolation Verification

Strict VPS isolation protocol was verified prior to executing any container operations.

| Service / Resource | Process / Port Details | Pre-Cutover State | Post-Cutover State | Isolation Impact |
| :--- | :--- | :--- | :--- | :--- |
| **OHO TECH Web App** | PM2 `id: 0`, PID `416801`, Port `3000` | `online (uptime: 74m+)` | `online (uptime: 80m+)` | **ZERO IMPACT (100% Isolated)** |
| **OHO TECH Backend** | Java PID `416856`, Port `8080` | `LISTEN 127.0.0.1:8080` | `LISTEN 127.0.0.1:8080` | **ZERO IMPACT (100% Isolated)** |
| **System PostgreSQL** | Port `5432` (`mect_db`, ohotech DBs) | `LISTEN 127.0.0.1:5432` | `LISTEN 127.0.0.1:5432` | **UNMODIFIED & PRESERVED** |
| **Host Nginx** | Ports `80`, `443` (`nginx: master`) | Active | Active (Reloaded) | Routes preserved |
| **Legacy MECT Backend** | `mect-backend.service`, Port `8081` | Running (systemd) | Gracefully Stopped & Disabled | Relinquished port 8081 to Docker |
| **Legacy MECT Frontend** | PM2 `mect_frontend` (`id: 1`), Port `3001`| Running (PM2) | Gracefully Stopped | Relinquished port 3001 to Docker |

---

## 3. Host Firewall & Public Network Exposure

- **UFW Status:** Active (`Status: active, Logging: on (low)`)
- **Default Policies:** Deny incoming, Allow outgoing, Deny routed
- **Public Open Ports:**
  - `22/tcp` (SSH) — ALLOW IN (Anywhere)
  - `80/tcp` (HTTP) — ALLOW IN (Anywhere)
  - `443/tcp` (HTTPS) — ALLOW IN (Anywhere)
- **Private / Loopback Bindings:**
  - `127.0.0.1:5432` (Host PostgreSQL) — Not accessible externally
  - `127.0.0.1:5433` (Docker PostgreSQL loopback) — Not accessible externally
  - `127.0.0.1:8081` (Docker Backend loopback) — Proxied through Nginx
  - `127.0.0.1:3001` (Docker Frontend loopback) — Proxied through Nginx
  - `127.0.0.1:8080` / `127.0.0.1:3000` (OHO TECH loopbacks) — Proxied through OHO Nginx

---

## 4. Preflight Audit Summary & Clearance

1. VPS hardware and OS fully meet and exceed production container orchestration requirements.
2. Docker Engine 29.8.1 and Compose v5.5.1 were pre-installed and functional.
3. Dedicated deployment path `/opt/mect` isolated from `/home/ohotech` and other server tenants.
4. Clearance granted for Docker deployment.
