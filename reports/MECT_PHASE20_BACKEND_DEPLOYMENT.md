# MECT Phase 20 — Backend Docker Deployment Report

**Application:** Spring Boot 4.1.1 / Java 21 / PostgreSQL 18  
**Container Name:** `mect-backend`  
**Image Tag:** `mect-backend:production`  
**Host Binding:** `127.0.0.1:8081:8080`  
**Deployment Path:** `/opt/mect/backend`  
**JAR Artifact:** `mahavir-backend-0.1.0-SNAPSHOT.jar` (67,320,401 bytes)  
**JAR SHA-256:** `1CF8AFC6E284643A7545986B2789F1EA7C4E34B7522390229199EAF6C1A4AC13`

---

## 1. Container Build & Architecture

- **Base Image:** `eclipse-temurin:21-jre-alpine`
- **Runtime User:** Non-root user `mect` (UID 1001, GID 1001).
- **JVM Options Configured:**
  `-Xms256m -Xmx512m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom`
- **Context Path:** `/api/v1`
- **Internal Port:** `8080`
- **Host Port Binding:** `127.0.0.1:8081` (strictly loopback, proxied via host Nginx).
- **Image Size:** 136 MB compressed (417 MB uncompressed).

---

## 2. Protected Configuration Keys (Keys Only — Zero Raw Secrets)

Environment keys loaded securely from `/opt/mect/.env.production` (permissions `600`):

- `SERVER_PORT`: `8080`
- `DB_HOST`: `mect-postgres`
- `DB_PORT`: `5432`
- `DB_NAME`: `mect_db`
- `DB_USERNAME`: `mect_user`
- `DB_PASSWORD`: `[SECURE_SET]`
- `CORS_ALLOWED_ORIGINS`: `https://mect.org.in,https://www.mect.org.in`
- `JWT_SECRET`: `[SECURE_SET]`
- `JWT_ACCESS_VALIDITY`: `900`
- `JWT_REFRESH_VALIDITY`: `604800`
- `OTP_HASH_PEPPER`: `[SECURE_SET]`
- `RESEND_API_KEY`: `[SECURE_SET]`
- `RESEND_FROM_NOTIFICATIONS`: `MECT Notifications <notifications@mect.org.in>`
- `RESEND_FROM_DONATIONS`: `MECT Donations <donations@mect.org.in>`
- `APP_PUBLIC_BASE_URL`: `https://mect.org.in`
- `PAYMENT_PROVIDER`: `CASHFREE`
- `PAYMENT_SANDBOX_MODE`: `false`
- `CASHFREE_ENV`: `PRODUCTION`
- `CASHFREE_API_VERSION`: `2023-08-01`
- `CASHFREE_APP_ID`: `[SECURE_SET]`
- `CASHFREE_SECRET_KEY`: `[SECURE_SET]`
- `CASHFREE_WEBHOOK_SECRET`: `[SECURE_SET]`
- `CASHFREE_WEBHOOK_TOLERANCE_SECONDS`: `300`

---

## 3. Health & Readiness Verification

- **Actuator Health Endpoint:** `http://127.0.0.1:8081/api/v1/actuator/health`
- **Response Status:** `HTTP 200`
- **Payload:** `{"groups":["liveness","readiness"],"status":"UP"}`
- **Public Restriction:** Endpoint blocked/restricted by Nginx to prevent public metric scraping.
- **Graceful Shutdown:** Configured via signal trapping (`exec java`).
- **Memory Consumption:** `459.7 MiB` (bounded strictly below 512 MiB ceiling).
- **Restart Recovery:** Verified in 27 seconds with automatic health recovery.

