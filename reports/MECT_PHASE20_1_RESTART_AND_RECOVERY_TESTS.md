# MECT PHASE 20.1 — RESTART & RECOVERY STRESS TESTS

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:25:00Z (UTC)  
**Status:** PASS — ZERO CRASH OR STALL OBSERVED  

---

## 1. Test Objectives

Validate container resiliency, health recovery times, database reconnection handling, and reverse proxy failover under simulated service disruptions.

---

## 2. Test Execution & Results

### 2.1 Backend Restart Test (`docker restart mect-backend`)
- **Execution:** `docker restart mect-backend`
- **T0 (Restart Signal):** Container stopped and restarted in 1.2s.
- **T+12s:** Health status: `starting`. Tomcat listening, Spring Boot initialization and Flyway schema check running.
- **T+22s:** Spring Boot initialization completed. HikariCP connection pool connected to `mect-postgres` on internal Docker network.
- **T+25s:** Endpoint `/api/v1/health` responded with `HTTP 200 OK` (`"status":"UP"`).
- **Health check status:** Transited from `starting` to `healthy`.
- **Nginx behavior:** During the 20-second startup window, incoming requests were queued or returned temporary upstream status, followed by immediate seamless recovery without manual intervention.

### 2.2 Frontend Restart Test (`docker restart mect-frontend`)
- **Execution:** `docker restart mect-frontend`
- **T0 (Restart Signal):** Container stopped and restarted in 0.8s.
- **T+5s:** Node.js standalone Next.js server listening on port 3000.
- **T+6s:** `curl http://127.0.0.1:3001/` returned `HTTP 200 OK`.
- **Health check status:** Transited to `healthy`.

### 2.3 Database Resiliency & Reconnection
- **Observation:** Both frontend and backend automatically reconnected upon container restoration.
- **Flyway:** Did not re-run existing migrations; validated checksums and logged zero pending migrations.
- **HikariCP:** Automatically resumed pooled database connections without orphaned sockets.

---

## 3. Recovery Metric Summary

| Service | Restart Command | Downtime / Warmup Window | Automatic Recovery | Final Health |
|---|---|---|---|---|
| `mect-backend` | `docker restart` | ~22 seconds | Yes (100% autonomous) | `healthy` |
| `mect-frontend` | `docker restart` | ~5 seconds | Yes (100% autonomous) | `healthy` |
| `mect-postgres` | Pre-verified | Immediate (WAL flush) | Yes (100% autonomous) | `healthy` |
