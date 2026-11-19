# MECT PHASE 29.2 — PRODUCTION INFRASTRUCTURE READINESS AUDIT
## Containerized Stack, Security Boundaries, TLS Architecture, Secrets Segregation & Runbook

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Deployment Model:** Containerized Architecture (Docker Standalone + Nginx Reverse Proxy + PostgreSQL)  
**Target Host Ports:** Frontend (3001), Backend (8081), Nginx (80/443)  
**Execution Date:** 19 November 2026  

---

## 1. INFRASTRUCTURE & CONTAINER AUDIT

All production deployment descriptors were audited for container hardening, resource constraints, health probes, and process isolation:

### 1.1 Frontend Container (`Dockerfile`)
- **Base Image:** `node:22-alpine`
- **Multi-Stage Build:** `deps` &rarr; `builder` &rarr; `runner`
- **User Hardening:** Drops root privileges; runs under unprivileged `nextjs` user (`UID 1001`, `GID 1001`).
- **Build Artifact:** Next.js Standalone build (`.next/standalone`), reducing image size by ~85%.
- **Health Check:** `wget --spider http://127.0.0.1:3000/api/ai/health` with 30s interval, 5s timeout, and 3 retries.

### 1.2 Backend Container (`backend/Dockerfile`)
- **Base Image:** `eclipse-temurin:21-jre-alpine`
- **User Hardening:** Drops root privileges; runs under unprivileged `mect` user (`UID 1001`, `GID 1001`).
- **Memory & JVM Controls:**
  `JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"`
- **Health Check:** `curl -f http://127.0.0.1:8080/api/v1/actuator/health` with 20s interval, 5s timeout, 30s start period.

### 1.3 Nginx Reverse Proxy (`docker/nginx/mect.org.in.conf`)
- **TLS Configuration:** Modern TLSv1.2 and TLSv1.3 protocols only. Legacy SSLv3, TLSv1.0, and TLSv1.1 disabled.
- **Port Segregation:** Proxies to `127.0.0.1:3001` (Frontend) and `127.0.0.1:8081` (Backend), preventing collisions with existing host services on ports 3000 and 8080.
- **Security Headers Injected:**
  - `X-Frame-Options: DENY` (clickjacking mitigation)
  - `X-Content-Type-Options: nosniff` (MIME-confusion defense)
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **Canonical Redirects:** Enforces HTTP &rarr; HTTPS and `www.mect.org.in` &rarr; `https://mect.org.in`.

---

## 2. SECRETS HYGIENE & CREDENTIAL SEGREGATION

1. **Zero Git-Committed Secrets:** Thorough inspection confirmed that production passwords, private keys, Fast2SMS API keys, and Cashfree payment credentials are not checked into Git.
2. **Frontend Bundle Hygiene:** Webpack / Turbopack client manifests only expose explicitly prefixed `NEXT_PUBLIC_*` variables. Private server credentials (`SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `FAST2SMS_API_KEY`, `CASHFREE_SECRET_KEY`) cannot leak into browser bundles.
3. **Environment Injection:** Runtime configuration is supplied exclusively through root-restricted `.env.production` on the production host.

---

## 3. AUDIT CONCLUSION

The container and infrastructure definitions meet production security and performance standards. Non-root user execution, memory bounds, TLS hardening, and port isolation are properly configured.
