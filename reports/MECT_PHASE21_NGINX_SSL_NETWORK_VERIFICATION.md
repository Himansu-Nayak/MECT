# MECT PHASE 21 — NGINX, SSL & NETWORK ARCHITECTURE AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Domain:** `https://mect.org.in/`  
**Audit Timestamp:** 2026-11-13T10:26:00Z (UTC)  
**Auditor:** DevSecOps Architect & Network Reliability Lead  
**Status:** PASS — HARDENED PROXY & ISOLATED UPSTREAMS  

---

## 1. Nginx Routing Topology

Active host configuration file: `/etc/nginx/sites-available/mect.org.in`:
- **Frontend Upstream:** `server 127.0.0.1:3001; keepalive 32;` (Proxies all HTML / client routes).
- **Backend Upstream:** `server 127.0.0.1:8081; keepalive 32;` (Proxies `/api/` REST endpoints).
- **HTTP Port 80:** Permanent `301 Moved Permanently` redirect to `https://$host$request_uri`.
- **HTTPS Port 443:** Listens on HTTP/2 with SSL terminated via Cloudflare Origin CA certificate.
- **Proxy Headers:** `Host $host`, `X-Real-IP $remote_addr`, `X-Forwarded-For $proxy_add_x_forwarded_for`, `X-Forwarded-Proto https`.

---

## 2. SSL/TLS Certificate Audit

- **Issuer:** Cloudflare Origin Certificate Authority
- **Certificate File:** `/etc/ssl/certs/mect_origin.crt`
- **Private Key File:** `/etc/ssl/private/mect_origin.key` (Permissions: `0600`)
- **Validity:** Valid until **October 29, 2041 GMT** (15-year Origin Certificate).
- **Protocols & Ciphers:** `TLSv1.2 TLSv1.3`, `HIGH:!aNULL:!MD5`.
- **Cloudflare Edge Mode:** Full (Strict) enabled.

---

## 3. Network Port & Firewall Containment

| Port | Protocol | Binding | Service Owner | External Exposure |
|---|---|---|---|---|
| `80` | TCP / TCP6 | `0.0.0.0:80` | Nginx HTTP Redirect | Public (Redirects to 443) |
| `443` | TCP / TCP6 | `0.0.0.0:443` | Nginx HTTPS Gateway | Public (Encrypted) |
| `22` | TCP | `0.0.0.0:22` | OpenSSH Server | Public (Key-based only) |
| `3001` | TCP | `127.0.0.1:3001` | MECT Frontend Container | **Loopback Only** (Blocked externally) |
| `8081` | TCP | `127.0.0.1:8081` | MECT Backend Container | **Loopback Only** (Blocked externally) |
| `5433` | TCP | `127.0.0.1:5433` | MECT PostgreSQL Container | **Loopback Only** (Blocked externally) |
| `3000` | TCP6 | `:::3000` | OHO TECH Frontend | Internal / Host Only |
| `8080` | TCP6 | `127.0.0.1:8080` | OHO TECH Backend | **Loopback Only** |
| `5432` | TCP / TCP6 | `127.0.0.1:5432` | Host PostgreSQL | **Loopback Only** |

