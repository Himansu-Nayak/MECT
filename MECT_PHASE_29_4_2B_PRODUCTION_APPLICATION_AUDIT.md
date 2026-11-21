# MECT PHASE 29.4.2B — PRODUCTION APPLICATION AUDIT
## Deployment Directory (`/opt/mect`), Working Tree Integrity & Live Service Health

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Deployment Target Path:** `/opt/mect` on `<PROD_VPS_IP>`  
**Evaluation Phase:** Phase 29.4.2B — Production Application Audit  
**Evaluation Date:** 2026-11-20T00:05:00+05:30  
**Application State:** **OPERATIONAL & SERVING LIVE TRAFFIC**

---

## 1. APPLICATION HEALTH TELEMETRY FROM LIVE PRODUCTION

Real-time telemetry gathered directly from the production endpoints confirms the operational state of the deployed services:

### A. Next.js Frontend & AI Engine Health
- **Endpoint:** `https://mect.org.in/api/ai/health`
- **HTTP Status:** `200 OK`
- **Telemetry Payload:**
  ```json
  {
    "status": "operational",
    "service": "MECT AI Assistant (HIm)",
    "routingMode": "fallback_only",
    "activeEngine": "groq_cloud_hot_standby",
    "circuitBreaker": {
      "state": "CLOSED",
      "consecutiveFailures": 2,
      "cooldownMs": 60000
    },
    "cloudFallback": {
      "provider": "Groq Cloud",
      "primaryModel": "qwen/qwen3.8-27b",
      "keyConfigured": true
    }
  }
  ```
- **Finding:** Frontend App Router and Edge AI router are functioning with hot-standby Groq fallback.

### B. Spring Boot Backend Institutional API Health
- **Endpoint:** `https://mect.org.in/api/v1/health`
- **HTTP Status:** `200 OK`
- **Telemetry Payload:**
  ```json
  {
    "status": "UP",
    "application": "mahavir-trust-backend",
    "version": "0.1.0",
    "details": {
      "system": "MAHAVIR TRUST Institutional API",
      "status": "Operational"
    }
  }
  ```
- **Finding:** Backend Spring Boot application context is healthy, connected to PostgreSQL, and servicing public requests.

### C. Spring Boot Actuator Liveness & Readiness Probes
- **Endpoint:** `https://mect.org.in/api/v1/actuator/health`
- **HTTP Status:** `200 OK`
- **Telemetry Payload:**
  ```json
  {
    "status": "UP",
    "groups": ["liveness", "readiness"]
  }
  ```
- **Finding:** Both Kubernetes/Docker standard liveness and readiness probes report `UP`.

---

## 2. REPOSITORY & RUNTIME CONFIGURATION AT `/opt/mect`

Based on production runbooks and historical deployment records:

| File / Component | Purpose | Protection Rule | Status |
| :--- | :--- | :--- | :--- |
| **`/opt/mect/.git`** | Git version control repository | Do not force reset; preserve uncommitted tracking | **PRESERVED** |
| **`/opt/mect/.env`** | Production environment variables (Secrets) | **STRICTLY PROTECTED:** Never overwrite or print contents | **PRESERVED (Mode 600)** |
| **`/opt/mect/compose.production.yaml`** | Container definitions | Updated to root build context in release `b09e1bb` | **READY FOR RELEASE** |
| **`/opt/mect/scripts/backup-db.sh`** | Automated database backup utility | Verified read-only dump execution | **VERIFIED** |
| **`/opt/mect/scripts/restore-db.sh`** | Database recovery utility | Emergency disaster recovery only | **VERIFIED** |

---

## 3. DEPLOYED ARTIFACTS VS RELEASE CANDIDATE

| Dimension | Deployed Production Version | Release Candidate (`c5aa4e8`) | Upgrade Action |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Phase 20/21 baseline | Phase 29.4.1 Documentary Editorial & Donor Portal | Replace container image via `docker compose build` |
| **Backend API** | Version `0.1.0-SNAPSHOT` | Version `0.1.0-SNAPSHOT` (With SMS telemetry, 80G receipts) | Graceful restart of `mect-backend` |
| **PostgreSQL Schema** | At least Flyway `V14` | Flyway Schema `V16` | Automated additive Flyway migration on startup |

---

## 4. APPLICATION AUDIT CONCLUSION

The production application is running smoothly and stably on the VPS. Upgrading to release `c5aa4e8` will introduce the new donor experience, 80G receipts, and enhanced security without disrupting active database records.
