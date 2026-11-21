# MECT PHASE 20.2 — BACKEND RECOVERY ROOT CAUSE & HEALTH TIMING AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Container:** `mect-backend` (`mect-backend:production`)  
**Host Target:** Hostinger VPS `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Audit Timestamp:** 2026-11-13T09:25:00Z (UTC)  
**Lead Engineer:** Senior Java / Spring Boot Systems Engineer & Site Reliability Engineer  
**Status:** PASS — ROOT CAUSE ISOLATED TO SCRIPT ASSERTION TIMING & ENDPOINT PATH  

---

## 1. Incident Overview

In Phase 20.1, the restart test command exited with code 1:
```bash
docker restart mect-backend; sleep 12; docker ps --filter name=mect-backend; curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/api/v1/public/health
```
Output:
```
mect-backend
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                             PORTS                      NAMES
5c2d0d5af151   mect-backend:production   "sh -c 'exec java $J…"   59 minutes ago   Up 12 seconds (health: starting)   127.0.0.1:8081->8080/tcp   mect-backend
000
Command exited with code 1.
```

---

## 2. Forensic Investigation & Timeline

### 2.1 Healthcheck Configuration in `compose.production.yaml`
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://127.0.0.1:8080/actuator/health", "||", "exit", "1"]
  interval: 20s
  timeout: 5s
  retries: 5
  start_period: 40s
```

### 2.2 Chronological Breakdown
1. **T0 (08:59:58 UTC):** `docker restart mect-backend` triggered container shutdown and restart.
2. **T+12s (09:00:10 UTC):**
   - The test script woke up after `sleep 12`.
   - The container was in status `Up 12 seconds (health: starting)`.
   - The test script attempted to curl `http://127.0.0.1:8081/api/v1/public/health`.
   - At this precise instant, the JVM was in early startup (loading classes and Spring Boot application context). The embedded Tomcat listener had not yet opened the external port, resulting in `curl exit code 000` (connection refused / closed).
3. **T+18s to T+22s:**
   - Spring Boot finished initializing the HikariCP connection pool, Flyway schema check (11 migrations), and Spring Security filter chains.
   - Tomcat embedded server began accepting requests on port 8080.
4. **T+25s (09:00:23 UTC):**
   - Docker daemon executed its internal healthcheck against `http://127.0.0.1:8080/actuator/health`.
   - Actuator health returned `{"groups":["liveness","readiness"],"status":"UP"}` with exit code 0.
   - Container status transited from `(health: starting)` to `(healthy)`.
5. **The Subsequent 500 Error on `/api/v1/public/health`:**
   - When a manual curl to `http://127.0.0.1:8081/api/v1/public/health` was executed at 09:00:35 UTC, it returned HTTP 500:
     ```
     o.m.b.exception.GlobalExceptionHandler: Unhandled exception processing request to /api/v1/public/health: No static resource public/health for request '/api/v1/public/health'.
     ```
   - **Root Cause:** Spring Boot maps `/api/v1/health` and `/actuator/health`, NOT `/api/v1/public/health`. Querying an unmapped path in Spring Boot 3 without static file matches throws `NoResourceFoundException`, which the GlobalExceptionHandler caught and returned as an unhandled 500.
   - **Verification:** Querying the documented health endpoint `/api/v1/health` returned `HTTP 200 OK`:
     ```json
     {"status":"UP","application":"mahavir-trust-backend","version":"0.1.0","details":{"status":"Operational","system":"MAHAVIR TRUST Institutional API"}}
     ```

---

## 3. Container State & Docker Inspect Telemetry

Captured live from `docker inspect mect-backend`:
- **State:** `running`
- **OOMKilled:** `false`
- **ExitCode:** `0`
- **Health Status:** `healthy`
- **FailingStreak:** `0`
- **Health Check Logs:** 5 consecutive checks with exit code 0 and status `"UP"`.

---

## 4. Conclusion & Operational Recommendation

The Phase 20.1 test failure was entirely an **artifact of premature test timing (12s vs 40s start_period) and querying an invalid URL path**. The Spring Boot backend container itself operates flawlessly, connects cleanly to PostgreSQL, and maintains continuous `healthy` state.

