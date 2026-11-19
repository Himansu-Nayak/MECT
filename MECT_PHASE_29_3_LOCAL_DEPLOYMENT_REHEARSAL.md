# MECT PHASE 29.3 — LOCAL PRODUCTION DEPLOYMENT REHEARSAL
## Isolated Multi-Container Stack Rehearsal, Health Probes, Port Isolation & Secret Injection

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.3 — Final Independent Release Gate, Disaster Recovery & Deployment Rehearsal  
**Deployment Descriptor:** `compose.production.yaml`  
**Execution Date:** 19 November 2026  

---

## 1. CONTAINER ARCHITECTURE & STACK TOPOLOGY

The production container orchestration was audited and rehearsed using `compose.production.yaml` with an isolated bridge network (`mect-network`):

```
+-----------------------------------------------------------------------------------+
| Host Reverse Proxy (Nginx Virtual Host: mect.org.in.conf)                         |
|   - HTTPS 443 -> 127.0.0.1:3001 (Next.js Frontend Container)                      |
|   - /api/v1/* -> 127.0.0.1:8081 (Spring Boot Backend Container)                   |
+-----------------------------------------------------------------------------------+
           |                                                      |
           v                                                      v
+-----------------------------+               +-------------------------------------+
| mect-frontend               |               | mect-backend                        |
| - Node 22 Alpine (nextjs)   |               | - Eclipse Temurin 21 JRE (mect)     |
| - Port: 127.0.0.1:3001:3000 |               | - Port: 127.0.0.1:8081:8080         |
| - Health: /api/ai/health    |               | - Health: /api/v1/actuator/health   |
+-----------------------------+               +-------------------------------------+
                                                                 |
                                                                 v
                                              +-------------------------------------+
                                              | mect-postgres                       |
                                              | - PostgreSQL 18 Alpine              |
                                              | - Port: 127.0.0.1:5433:5432         |
                                              | - Health: pg_isready                |
                                              +-------------------------------------+
```

---

## 2. REHEARSAL PARAMETERS & SECURITY SAFEGUARDS

| Component / Probe | Implementation in `compose.production.yaml` | Safeguard Verified | Rehearsal Outcome |
| :--- | :--- | :--- | :---: |
| **Port Segregation** | Postgres: `5433`, Backend: `8081`, Frontend: `3001` | Non-conflicting ports; bound strictly to `127.0.0.1` loopback. Preserves any host services on ports 3000 and 8080. | **PASS** |
| **Dependency Ordering** | `depends_on: { service_healthy }` | Prevents backend startup before Postgres is ready; prevents frontend startup before backend is healthy. | **PASS** |
| **Container Hardening** | `USER nextjs (1001)` & `USER mect (1001)` | Neither application container runs with root privileges. | **PASS** |
| **Health Check Probes** | `pg_isready`, `curl .../actuator/health`, `wget .../api/ai/health` | Automated failure detection with retries and start-period grace windows. | **PASS** |
| **Persistent Storage** | `mect-pgdata`, `mect-media`, `mect-receipts` | Named docker volumes isolate database data, uploaded media, and PDF receipts across container restarts. | **PASS** |
| **Zero Git Secrets** | Environment variable interpolation (`${...}`) | All database passwords, JWT secrets, OTP peppers, and payment keys injected at runtime. | **PASS** |
| **Graceful Shutdown** | `restart: unless-stopped` with standard SIGTERM handling | Containers cleanly disconnect JDBC pools and drain active HTTP requests before exiting. | **PASS** |

---

## 3. AUDIT CONCLUSION

The deployment orchestration defined in `compose.production.yaml` and `docker/nginx/mect.org.in.conf` provides a safe, hardened, loopback-isolated release stack ready for production deployment upon owner sign-off.
