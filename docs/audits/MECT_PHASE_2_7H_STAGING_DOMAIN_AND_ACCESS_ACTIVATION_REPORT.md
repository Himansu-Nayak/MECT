# MECT PHASE 2.7H — STAGING DOMAIN ACTIVATION & CLOUDFLARE ACCESS REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/) (**100% Frozen & Untouched**)  
**OHO Tech Domain:** [https://ohotechn.com/](https://ohotechn.com/) (**100% Frozen & Untouched**)  
**Proposed Staging Frontend:** `https://staging.mect.org.in`  
**Proposed Staging Backend API:** `https://staging-api.mect.org.in`  
**Hostinger VPS IPv4:** `200.97.161.128`  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Deployed Commit SHA:** `50992b96da0900edcde7ad8464be9b8b2ae22b47`  
**Cumulative Release Candidate SHA-256 Digest:** `767240f392e0d41274ad8be484ff15cd6a091f617c4f06335f08378437d705b1`  
**Protocol Phase:** Phase 2.7H — Staging Domain Activation & Cloudflare Access  
**Report Date:** 2026-11-27  
**Staging Ingress Status:** **`READ-ONLY VERIFICATION COMPLETE — PENDING CLOUDFLARE ACCESS & NGINX APPROVAL`**

---

## 1. PHASE 1 — READ-ONLY STAGING & VPS INVENTORY AUDIT

A complete read-only audit of the Hostinger VPS (`200.97.161.128`) was conducted. Zero infrastructure mutations were executed during this verification.

### A. Staging Container Health
All three isolated staging Docker containers are running and healthy:

```
NAMES                   STATUS                       PORTS
mect-frontend-staging   Up About an hour (healthy)   127.0.0.1:3002->3000/tcp
mect-backend-staging    Up About an hour (healthy)   127.0.0.1:8082->8080/tcp
mect-postgres-staging   Up About an hour (healthy)   5432/tcp (Internal Docker network only)
```

### B. Local Port Probes
- **Staging Frontend (`127.0.0.1:3002`):** `HTTP/1.1 200 OK`
- **Staging Backend Health (`127.0.0.1:8082/api/v1/actuator/health`):** `HTTP/1.1 200 OK` (`{"groups":["liveness","readiness"],"status":"UP"}`)
- **MECT Production Frontend (`127.0.0.1:3001`):** `HTTP/1.1 200 OK`
- **MECT Production Backend Health (`127.0.0.1:8081/api/v1/actuator/health`):** `HTTP/1.1 200 OK` (`{"groups":["liveness","readiness"],"status":"UP"}`)
- **OHO Tech Frontend (`127.0.0.1:3000`):** `HTTP/1.1 200 OK`
- **OHO Tech Backend Health (`127.0.0.1:8080/actuator/health`):** `HTTP/1.1 401 Unauthorized` (Expected secured endpoint)

### C. PostgreSQL Network Isolation
- `docker port mect-postgres-staging` returned empty output, confirming zero published host ports.
- Port `5432` is bound strictly on `127.0.0.1` and `::1` by OHO Tech native PostgreSQL (`pid 416758`).
- Port `5433` is bound strictly on `127.0.0.1` by MECT Production PostgreSQL container (`docker-proxy pid 1801444`).
- Zero port collision or cross-database exposure exists.

### D. Production Nginx Configuration Invariance
- Active enabled sites in `/etc/nginx/sites-enabled/`:
  - `mect.org.in -> /etc/nginx/sites-available/mect.org.in`
  - `ohotechn.com -> /etc/nginx/sites-available/ohotechn.com`
  - `api.ohotechn.com -> /etc/nginx/sites-available/api.ohotechn.com`
- Production virtual hosts remain completely untouched and unmodified.

---

## 2. LEGACY STAGING SYSTEMD SERVICE DOCUMENTATION & ROLLBACK

During Phase 2.7G.4 preflight discovery, a stale legacy prototype service was detected holding port 8082:

- **Service File:** `/etc/systemd/system/mect-backend-staging.service`
- **Installed Content:**
  ```ini
  [Unit]
  Description=MECT Spring Boot Staging Backend
  After=network.target postgresql.service
  Wants=postgresql.service

  [Service]
  Type=simple
  User=mect
  Group=mect
  WorkingDirectory=/opt/mect/staging/backend
  EnvironmentFile=/opt/mect/staging/backend/.env
  ExecStart=/usr/bin/java -Xms128m -Xmx384m -jar /opt/mect/staging/backend/mahavir-backend-0.1.0-SNAPSHOT.jar --server.address=127.0.0.1
  Restart=always
  RestartSec=10
  StandardOutput=journal
  StandardError=journal
  SyslogIdentifier=mect-backend-staging
  SuccessExitStatus=143

  [Install]
  WantedBy=multi-user.target
  ```
- **Prior Action Taken:** Stopped and disabled via `systemctl stop mect-backend-staging && systemctl disable mect-backend-staging`.
- **Current State:** `inactive (dead)`, `disabled`.
- **Rollback Procedure (if ever required):**
  1. Stop container `mect-backend-staging`: `docker stop mect-backend-staging`
  2. Enable and start legacy unit: `systemctl enable mect-backend-staging.service && systemctl start mect-backend-staging.service`
  3. Verify status: `systemctl status mect-backend-staging.service`

---

## 3. PHASE 2 — CLOUDFLARE DNS DISCOVERY & STATUS

A DNS resolution query was executed against `staging.mect.org.in` and `staging-api.mect.org.in`:

| Subdomain | Record Type | Current Resolved IP | Proxy Status | Required Action |
| :--- | :---: | :---: | :---: | :--- |
| **`staging.mect.org.in`** | `A` | `200.97.161.128` | **DNS Only (Grey Cloud)** | Toggle to **Proxied (Orange Cloud)** |
| **`staging-api.mect.org.in`** | `A` | `200.97.161.128` | **DNS Only (Grey Cloud)** | Toggle to **Proxied (Orange Cloud)** |
| *Reference (Production)* | `A` | `104.21.44.48`, `172.67.195.21` | **Proxied (Orange Cloud)** | *Baseline reference* |

### Key Discovery:
The DNS `A` records already exist and correctly point to your VPS IPv4 `200.97.161.128`. However, they are currently set to **DNS Only (Grey Cloud)**. For Cloudflare Zero Trust Access, DDoS protection, and SSL termination to function, both records must be switched to **Proxied (Orange Cloud)** in your Cloudflare dashboard.

---

## 4. PHASE 4 — TLS & ORIGIN CERTIFICATE VERIFICATION

The origin SSL certificate on the Hostinger VPS at `/etc/ssl/mect/fullchain.pem` and `/etc/ssl/mect/origin.key` was inspected via OpenSSL:

```
issuer=C=US, O=CloudFlare, Inc., OU=CloudFlare Origin SSL Certificate Authority, L=San Francisco, ST=California
subject=O=CloudFlare, Inc., OU=CloudFlare Origin CA, CN=CloudFlare Origin Certificate
notBefore=Nov  2 10:30:00 2026 GMT
notAfter=Oct 29 10:30:00 2041 GMT
X509v3 Subject Alternative Name: 
    DNS:*.mect.org.in, DNS:mect.org.in
```

### Verification Findings:
1. **Certificate Authority:** Genuine Cloudflare Origin CA certificate.
2. **Hostname Coverage:** The wildcard SAN `*.mect.org.in` **explicitly covers** both `staging.mect.org.in` and `staging-api.mect.org.in`.
3. **Validity:** Valid until **October 29, 2041** (15-year validity).
4. **Cloudflare Full (Strict) Compatibility:** Because this certificate covers both staging domains and is trusted by Cloudflare edge, Cloudflare's **Full (strict)** SSL/TLS encryption mode is 100% supported without installing any third-party or Let's Encrypt certificates.

---

## 5. PHASE 3 — CLOUDFLARE ZERO TRUST ACCESS ARCHITECTURE & CORS DESIGN

To protect the staging environment while allowing seamless donor journey testing:

### A. Two Protected Self-Hosted Applications
1. **Application 1: MECT Staging Frontend**
   - **Application Name:** `MECT Staging Frontend`
   - **Application Domain:** `staging.mect.org.in`
   - **Policy:** Allow specific authorized tester email addresses via One-Time PIN (OTP).
   - **Session Duration:** 24 hours.
2. **Application 2: MECT Staging Backend API**
   - **Application Name:** `MECT Staging Backend API`
   - **Application Domain:** `staging-api.mect.org.in`
   - **Policy:** Allow identical authorized tester email addresses.

### B. Narrow CORS & Preflight Authorization Design
- In Cloudflare Zero Trust, when protecting a backend API that receives AJAX/fetch calls from a separate subdomain frontend:
  1. **Domain-Level Cookie Sharing:** In Cloudflare Zero Trust settings, ensure the session cookie domain is set to `mect.org.in`. When an authorized tester authenticates to `staging.mect.org.in`, the `CF_Authorization` cookie is automatically included with API fetch requests to `staging-api.mect.org.in` when using `credentials: 'include'`.
  2. **CORS Configuration in Cloudflare Access:**
     - Allowed Origins: `https://staging.mect.org.in`
     - Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS, PATCH`
     - Allowed Headers: `Content-Type, Authorization, X-Requested-With, Accept, Origin, Cf-Access-Jwt-Assertion`
     - Allow Credentials: `true`
  3. **Strict Preflight Scoping:**
     - Standard browsers emit an unauthenticated `OPTIONS` preflight before cross-origin POST requests. Cloudflare Access has an explicit setting: **"Enable CORS settings"** which safely handles valid preflight requests from the allowed origin `https://staging.mect.org.in` without exposing any unauthenticated application endpoints.

---

## 6. PHASE 5 — PROPOSED NGINX STAGING CONFIGURATION (FOR REVIEW)

The proposed virtual host configuration will be placed in a dedicated file `/etc/nginx/sites-available/staging.mect.org.in.conf`, completely separate from production `/etc/nginx/sites-available/mect.org.in`:

```nginx
# ==============================================================================
# MECT Staging Environment — Isolated Virtual Host
# Domains: staging.mect.org.in, staging-api.mect.org.in
# Upstream Frontend: 127.0.0.1:3002
# Upstream Backend : 127.0.0.1:8082
# TLS: Cloudflare Origin CA (*.mect.org.in)
# ==============================================================================

# HTTP -> HTTPS Redirect for both staging domains
server {
    listen 80;
    listen [::]:80;
    server_name staging.mect.org.in staging-api.mect.org.in;

    location / {
        return 301 https://$host$request_uri;
    }
}

# ------------------------------------------------------------------------------
# 1. Staging Frontend: staging.mect.org.in -> 127.0.0.1:3002
# ------------------------------------------------------------------------------
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name staging.mect.org.in;

    # Cloudflare Origin CA Certificate
    ssl_certificate /etc/ssl/mect/fullchain.pem;
    ssl_certificate_key /etc/ssl/mect/origin.key;

    # Modern TLS Parameters
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:MECT_STAGING_SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    access_log /var/log/nginx/mect-staging-frontend.access.log;
    error_log /var/log/nginx/mect-staging-frontend.error.log;

    # Next.js Frontend Upstream (Port 3002)
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# ------------------------------------------------------------------------------
# 2. Staging Backend API: staging-api.mect.org.in -> 127.0.0.1:8082
# ------------------------------------------------------------------------------
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name staging-api.mect.org.in;

    # Cloudflare Origin CA Certificate
    ssl_certificate /etc/ssl/mect/fullchain.pem;
    ssl_certificate_key /etc/ssl/mect/origin.key;

    # Modern TLS Parameters
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:MECT_STAGING_API_SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CORS Headers for Staging Frontend
    add_header 'Access-Control-Allow-Origin' 'https://staging.mect.org.in' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,X-Forwarded-For' always;

    access_log /var/log/nginx/mect-staging-api.access.log;
    error_log /var/log/nginx/mect-staging-api.error.log;

    # Strict Actuator Lockdown: allow local/management inspection only
    location /api/v1/actuator/health {
        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1/actuator/ {
        # Deny public access to administrative actuator metrics
        return 403 '{"status":403,"error":"Forbidden","message":"Actuator endpoints are restricted."}';
    }

    # API Proxy Upstream (Port 8082)
    location / {
        # Handle CORS Preflight cleanly
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://staging.mect.org.in' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization,X-Forwarded-For' always;
            add_header 'Access-Control-Max-Age' 86400;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        proxy_pass http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
        proxy_connect_timeout 90;
    }
}
```

---

## 7. OWNER APPROVALS REQUIRED BEFORE INSTALLATION & RELOAD

To ensure strict zero-risk execution, the following owner actions and approvals are requested:

1. **Cloudflare DNS Proxy:** Confirm switching `staging.mect.org.in` and `staging-api.mect.org.in` from "DNS only" to "Proxied" in Cloudflare DNS.
2. **Authorized Tester Emails:** Provide the list of tester email addresses that should be permitted access in Cloudflare Zero Trust.
3. **Nginx Configuration Approval:** Explicit approval to install `/etc/nginx/sites-available/staging.mect.org.in.conf`, enable it, test with `nginx -t`, and reload Nginx.
