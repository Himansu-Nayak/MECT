# MECT PHASE 20.1 — NGINX, SSL & NETWORK AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Domain:** `https://mect.org.in/`  
**Execution Timestamp:** 2026-11-13T09:25:00Z (UTC)  
**Status:** PASS — HARDENED SSL & PROXY ARCHITECTURE  

---

## 1. Nginx Configuration & Routing Topology

Active Host Configuration: `/etc/nginx/sites-available/mect.org.in`

```nginx
upstream mect_frontend {
    server 127.0.0.1:3001;
    keepalive 32;
}

upstream mect_backend {
    server 127.0.0.1:8081;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name mect.org.in www.mect.org.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mect.org.in www.mect.org.in;

    ssl_certificate /etc/ssl/certs/mect_origin.crt;
    ssl_certificate_key /etc/ssl/private/mect_origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location /api/ {
        proxy_pass http://mect_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }

    location / {
        proxy_pass http://mect_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

---

## 2. SSL/TLS Certificate Audit

- **Issuer:** Cloudflare Origin CA
- **Subject:** `mect.org.in`, `*.mect.org.in`
- **Validity:**
  - Issued: 2026-10-31 GMT
  - Expires: 2041-10-29 GMT (15-Year Origin CA Certificate)
- **Protocol:** HTTP/2 over TLS 1.3
- **Edge Encryption Mode:** Full (Strict) on Cloudflare Dashboard.

---

## 3. Network Isolation Verification

- **External Host Interfaces:**
  - Port 80 (HTTP) -> Redirects 301 to HTTPS.
  - Port 443 (HTTPS) -> Terminates SSL via Nginx.
  - Port 22 (SSH) -> Restriced ed25519 authentication.
- **Docker Internal Network (`mect-network`):**
  - Containers communicate on a private bridge network (`172.x.x.x`).
  - Container ports are strictly bound to `127.0.0.1` loopback on the host (`127.0.0.1:3001`, `127.0.0.1:8081`, `127.0.0.1:5433`).
  - None of the container ports are exposed to `0.0.0.0` or external public interfaces.
