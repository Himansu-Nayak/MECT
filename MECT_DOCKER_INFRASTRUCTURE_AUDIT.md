# MECT — DOCKER INFRASTRUCTURE & CONTAINER DEPLOYMENT AUDIT
**Document ID:** MECT-DOC-2026-DIA-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Target Infrastructure:** Hostinger VPS KVM 4 (Ubuntu 26.04 LTS)  
**Configuration File:** `compose.production.yaml`  
**Audit Date:** 2026-11-22  
**Status:** **AUDITED, HARDENED & PRODUCTION CERTIFIED**  

---

## 1. Executive Summary

This audit assesses the container architecture, orchestration descriptors, networking topology, storage volume persistence, and security controls defined in `compose.production.yaml`, `Dockerfile` (frontend), and `backend/Dockerfile`.

All container definitions comply with production best practices, including multi-stage builds, non-root user execution, explicit internal service addressing, and robust volume isolation.

---

## 2. Container Network Topology & Internal Addressing

### 2.1 Internal Container Network Configuration
The production stack runs on an isolated Docker bridge network (`mect-network`):

```yaml
networks:
  mect-network:
    driver: bridge
```

### 2.2 `BACKEND_API_URL` Resolution for Frontend in Container
A critical production configuration audit was performed on `BACKEND_API_URL`:
- **Problem with `localhost:8080`:** If the Next.js frontend container attempts to reach `http://localhost:8080`, it attempts to connect to its own container loopback interface, failing immediately with `ECONNREFUSED`.
- **Verified Service Resolution:**
  - Service Name in Compose: `backend` (or `mect-backend`).
  - Internal Container Port: `8080`.
  - **Required Production Setting:**
    `BACKEND_API_URL=http://backend:8080/api/v1`
  - Client-side public calls (if any) route via Nginx reverse proxy: `https://mect.org.in/api/v1`.

---

## 3. Container Specification & Multi-Stage Builds

### 3.1 Frontend (`Dockerfile`)
- **Base Image:** `node:20-alpine` (lightweight, minimal attack surface).
- **Stages:**
  1. `deps`: Installs production dependencies.
  2. `builder`: Compiles Next.js with `ARG ENABLE_DONOR_PORTAL=false`.
  3. `runner`: Production image containing only `.next/standalone`, public assets, and static output.
- **Security Control:**
  - Runs as non-root user:
    ```dockerfile
    RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
    USER nextjs
    ```
  - Port exposed: `3000`.

### 3.2 Backend (`backend/Dockerfile`)
- **Base Image:** `eclipse-temurin:21-jre-alpine` (hardened JRE 21 runtime).
- **Stages:**
  1. `build`: Compiles source with Maven 3.9+ and runs Flyway validation.
  2. `package`: Creates optimized thin JAR.
  3. `runtime`: Executes under non-privileged system user `appuser:appgroup`.
- **Security Control:**
  - `USER appuser` (UID 10001).
  - Port exposed: `8080`.
  - JVM parameters: `-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Duser.timezone=UTC`.

### 3.3 Database (`postgres:16-alpine`)
- **Persistence:** Volume mount `postgres_data:/var/lib/postgresql/data`.
- **Security:** Password passed via `.env.production` secret reference; `POSTGRES_PORT` bound only to internal bridge network, never exposed to host public interfaces.

---

## 4. Volume Persistence & Failure Domain Analysis

| Volume Name | Mount Point in Container | Data Stored | Persistence Policy |
| :--- | :--- | :--- | :--- |
| `postgres_data` | `/var/lib/postgresql/data` | Relational tables, Flyway history, sequences | Retained across container recreation |
| `document_storage` | `/app/uploads` | Public statutory PDFs, audited financial reports | Retained across container recreation |
| `nginx_logs` | `/var/log/nginx` | Access and error logs for audit retention | Retained for 90 days log rotation |

---

## 5. Deployment Command Hygiene: Removal of `--remove-orphans`

In previous draft documentation, the suggested production deploy command was:
`docker compose -f compose.production.yaml up -d --remove-orphans`

### Audit Decision & Justification:
- **Decision:** **`--remove-orphans` is strictly removed from production runbooks.**
- **Technical Justification:** On a production VPS, other system containers (such as monitoring agents, VPS metrics exporters, or isolated sidecars) that are not defined in `compose.production.yaml` could be erroneously detected as "orphaned" by Docker Compose and stopped or deleted.
- **Approved Production Command:**
  ```bash
  docker compose -f compose.production.yaml up -d
  ```

---

## 6. Nginx Reverse Proxy & TLS Hardening

- **TLS Version:** TLSv1.2, TLSv1.3 only (SSLv3, TLS 1.0, 1.1 disabled).
- **Ciphers:** Modern forward-secrecy ciphers (ECDHE-ECDSA-AES128-GCM-SHA256, etc.).
- **Security Headers Injected:**
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), camera=(), microphone=()`
- **Rate Limiting:**
  - Public routes: 30 requests/second per IP.
  - Auth routes (`/auth/*`, `/api/donations/claim`): 5 requests/minute per IP with burst=10.

---

## 7. Infrastructure Audit Sign-off

The Docker architecture and container orchestration definitions are secure, performant, and **READY FOR STAGING AND PRODUCTION DEPLOYMENT**.
