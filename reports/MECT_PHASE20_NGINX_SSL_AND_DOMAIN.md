# MECT Phase 20 — Nginx, SSL & Domain Routing Verification

**Primary Domain:** `https://mect.org.in/`  
**Secondary Domain:** `https://www.mect.org.in/`  
**Virtual Host Config:** `/etc/nginx/sites-available/mect.org.in`  
**Symlink Target:** `/etc/nginx/sites-enabled/mect.org.in`

---

## 1. Upstream Reverse Proxy Routing

Nginx routes traffic seamlessly to the MECT Docker containers on the host loopback:

| Request Path | Upstream Target | Target Description | Timeout Settings |
| :--- | :--- | :--- | :--- |
| `/api/ai/` | `http://127.0.0.1:3001` | Next.js AI Gateway API (`mect-frontend`) | read: 120s, connect: 60s |
| `/api/` | `http://127.0.0.1:8081` | Spring Boot REST API (`mect-backend`) | read: 90s, connect: 90s |
| `/api/v1/actuator/health` | `http://127.0.0.1:8081` | Spring Boot Actuator Health Probe | direct proxy |
| `/` | `http://127.0.0.1:3001` | Next.js Standalone Frontend (`mect-frontend`) | HTTP 1.1 + WebSocket upgrade |
| Fallback (`@holding`) | `/var/www/mect/index.html`| Static holding page on 502/503/504 | 503 response |

---

## 2. Canonical Domain & HTTPS Redirects

All redirect paths were verified using manual HTTP client requests:

| Input URL | Expected Code | Target Location | Observed Code | Result |
| :--- | :--- | :--- | :--- | :--- |
| `http://mect.org.in/` | `301 Moved Permanently` | `https://mect.org.in/` | `301` | **PASS** |
| `http://www.mect.org.in/` | `301 Moved Permanently` | `https://www.mect.org.in/` | `301` | **PASS** |
| `https://www.mect.org.in/` | `301 Moved Permanently` | `https://mect.org.in/` | `301` | **PASS** |

---

## 3. SSL / TLS Certificate Audit

- **Certificate Path:** `/etc/ssl/mect/fullchain.pem`
- **Private Key Path:** `/etc/ssl/mect/origin.key`
- **Issuer:** `CloudFlare Origin SSL Certificate Authority`
- **Subject:** `OU=CloudFlare Origin CA, CN=CloudFlare Origin Certificate`
- **Validity:** `Nov 2 10:30:00 2026 GMT` to `Oct 29 10:30:00 2041 GMT` (15 years)
- **Protocols Supported:** `TLSv1.2`, `TLSv1.3`
- **Session Cache:** `shared:MECT_SSL:10m`, timeout 1 day

---

## 4. Security Headers

Verified live on `https://mect.org.in/`:

```http
HTTP Status: 200
content-type: text/html; charset=utf-8
referrer-policy: strict-origin-when-cross-origin
server: cloudflare
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-content-type-options: nosniff
x-frame-options: DENY
```

