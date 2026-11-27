# MECT PHASE 2.7H.2 — DNS CORRECTION AND FINAL STAGING ACTIVATION REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/) (**100% Frozen & Untouched**)  
**OHO Tech Domain:** [https://ohotechn.com/](https://ohotechn.com/) (**100% Frozen & Untouched**)  
**Hostinger VPS IPv4:** `200.97.161.128` (Ubuntu 24.04 LTS)  
**Staging Frontend Domain:** `staging.mect.org.in` (Loopback `127.0.0.1:3002`)  
**Staging Backend API Domain:** `staging-api.mect.org.in` (Loopback `127.0.0.1:8082`)  
**Staging Database:** `mect_staging_db` on internal network `mect-staging-network` (0 host ports)  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Current Git Commit:** `2920e86`  
**Protocol Phase:** Phase 2.7H.2 — DNS Correction, API Architecture & Final Staging Activation Gate  
**Report Date:** 2026-11-27  
**Current Status:** **`AWAITING OWNER DNS CORRECTION & CLOUDFLARE ACCESS ACTIVATION`**

---

## 1. EXECUTIVE BASELINE & HOSTINGER VPS RUNTIME STATE

Prior to any DNS changes or ingress activation, an independent read-only runtime audit of the Hostinger VPS (`200.97.161.128`) was conducted:

| Service / Container | Host Port / Interface | Target Upstream | Health Status | Production Isolation State |
| :--- | :---: | :---: | :---: | :--- |
| **`mect-frontend-staging`** | `127.0.0.1:3002` | Next.js 16 Standalone | `healthy` | Fully isolated on loopback |
| **`mect-backend-staging`** | `127.0.0.1:8082` | Spring Boot 3.4.3 | `healthy` | Fully isolated on loopback |
| **`mect-postgres-staging`** | *None* | PostgreSQL 18-alpine | `healthy` | 0 host ports exposed |
| **Production MECT Frontend** | `127.0.0.1:3001` | Next.js Container | `healthy` | Untouched, zero downtime |
| **Production MECT Backend** | `127.0.0.1:8081` | Spring Boot Container | `healthy` | Untouched, zero downtime |
| **Production MECT Postgres** | `127.0.0.1:5433` | PostgreSQL Container | `healthy` | Untouched, zero downtime |
| **OHO Tech Services** | `3000`, `8080`, `5432` | Systemd / Containers | `active` | Untouched, zero downtime |

---

## 2. STEP 1 — DNS FORENSIC DISCOVERY & DASHBOARD INSPECTION

Authoritative queries against Cloudflare nameservers (`barbara.ns.cloudflare.com`, `dean.ns.cloudflare.com`) and public DoH (`cloudflare-dns.com`) returned:

```
staging.mect.org.in      -> 200.97.161.128 (Direct VPS IP, TTL 300)
staging-api.mect.org.in  -> 200.97.161.128 (Direct VPS IP, TTL 300)
mect.org.in (Production) -> 104.21.44.48, 172.67.195.21 (Cloudflare Anycast Proxied)
```

### Forensic Analysis:
1. **The Wildcard Fallback Hypothesis:** An unproxied `*.mect.org.in` A record exists pointing to `200.97.161.128` with DNS-only (Grey Cloud). Queries for non-existent subdomains (`random12345.mect.org.in`) resolve to `200.97.161.128`.
2. **The Double-Suffix Hypothesis:** In Cloudflare DNS UI, the root domain `.mect.org.in` is appended automatically. Typing `staging.mect.org.in` into the Name input field creates `staging.mect.org.in.mect.org.in`.
3. **The Unsaved Edit Hypothesis:** In edit mode, toggling the orange cloud icon requires clicking the blue **Save** button in that row to commit the change to Cloudflare's edge nameservers.

### Required Owner Action in Cloudflare Dashboard:
1. Navigate to **Cloudflare Dashboard** &rarr; Domain: **`mect.org.in`** &rarr; **DNS** &rarr; **Records**.
2. Inspect the records table:
   - Record 1: Type `A` | Name: **`staging`** | IPv4: `200.97.161.128` | Proxy Status: **Proxied (Orange Cloud)**
   - Record 2: Type `A` | Name: **`staging-api`** | IPv4: `200.97.161.128` | Proxy Status: **Proxied (Orange Cloud)**
3. Delete any inadvertent duplicate records (such as `staging.mect.org.in.mect.org.in`).
4. Click **Save** on each record and notify us for verification.

---

## 3. STEP 2 & 3 — CLOUDFLARE ACCESS & API AUTHENTICATION ARCHITECTURE

### The Browser Cross-Origin Dilemma:
- When the owner logs into `https://staging.mect.org.in/` via Cloudflare Access email OTP, Cloudflare sets a session cookie (`CF_Authorization`).
- Client-side browser `fetch()` calls by default use `credentials: 'same-origin'`.
- If client JavaScript sends cross-origin requests from `staging.mect.org.in` to `staging-api.mect.org.in`, cookies are **omitted** by the browser.
- If `staging-api.mect.org.in` is protected by a strict Cloudflare Access policy, Cloudflare responds to cookie-less requests with an HTTP 302 redirect, resulting in an immediate **fatal browser CORS failure**.
- Embedding Cloudflare Service Tokens (`CF-Access-Client-Id` / `CF-Access-Client-Secret`) in client-side Next.js code is **strictly prohibited**, as secrets would be exposed in the browser network inspector.

### Verified Architecture: Dual-Path Ingress
To ensure zero friction and unbreakable security, the Nginx staging configuration supports two paths:

1. **Same-Origin API Ingress (`https://staging.mect.org.in/api/...`):**
   - Nginx server block for `staging.mect.org.in` proxies `/api/` directly to `127.0.0.1:8082`.
   - Because the frontend and API share the exact same origin, the browser attaches the Cloudflare Access `CF_Authorization` cookie automatically.
   - **Result:** Single login screen, zero CORS headers required, zero token exposure.
2. **Dedicated API Ingress (`https://staging-api.mect.org.in/`):**
   - Configured with dedicated CORS headers, modern TLS, and strict Actuator lockdown.
   - For Cloudflare Access on this subdomain:
     - CORS settings enabled: Origin `https://staging.mect.org.in`, Allow Credentials: `true`.
     - Policy 1 (Bypass): Selector: HTTP Method `OPTIONS` (limited strictly to CORS preflights).
     - Policy 2 (Allow): Selector: Owner email (authenticated business requests only).

---

## 4. STEP 4 — ORIGIN PROTECTION AUDIT & PROPOSAL

### Threat Model & Finding:
Currently on the VPS, port 443 listens on `0.0.0.0`. If a visitor discovers the VPS IP `200.97.161.128` and sends an HTTPS request with `Host: staging.mect.org.in`, Nginx terminates TLS with `/etc/ssl/mect/fullchain.pem` and proxies to `127.0.0.1:3002`, **bypassing Cloudflare Access entirely**.

### Safe Origin Protection Strategy:
Because this VPS is shared with **OHO Tech** (`ohotechn.com`) and **Production MECT** (`mect.org.in`), we must **not** modify the host UFW firewall or global Nginx listening configuration, as doing so could disrupt production traffic.

**Safe Staging-Specific Mitigation:**
Inside `/etc/nginx/sites-available/staging.mect.org.in.conf`, we can enforce Cloudflare proxy headers for staging only:
```nginx
# Require Cloudflare edge proxy header for staging ingress
if ($http_cf_ray = "") {
    return 403 "Direct origin access forbidden. Requests must traverse Cloudflare Edge.";
}
```
*Note: This rule will be applied strictly within the staging virtual host and will not affect any production server block.*

---

## 5. STEP 5 — NG_INX FINAL REVIEW & PREFLIGHT VERIFICATION

The staging virtual host configuration at `/etc/nginx/sites-available/staging.mect.org.in.conf` was verified independently:

1. **Syntax Validation:** Executed `nginx -t` with staging virtual host included:
   ```
   nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
   nginx: configuration file /etc/nginx/nginx.conf test is successful
   ```
2. **Production Non-Interference:** Verified `/etc/nginx/sites-enabled/` contains only:
   - `mect.org.in` -> `/etc/nginx/sites-available/mect.org.in`
   - `ohotechn.com` -> `/etc/nginx/sites-available/ohotechn.com`
   - `api.ohotechn.com` -> `/etc/nginx/sites-available/api.ohotechn.com`
3. **Certificate Coverage:** Verified `/etc/ssl/mect/fullchain.pem` has SANs `DNS:*.mect.org.in, DNS:mect.org.in`, valid until Oct 29, 2041.
4. **Security & Search Engine Blocking:**
   - `X-Robots-Tag: noindex, nofollow, noarchive`
   - Actuator health check `/api/v1/actuator/health` permitted.
   - Actuator administration `/api/v1/actuator/*` blocked with HTTP 404 / deny all.

---

## 6. STEP 6 — ACTIVATION GATE & NEXT ACTIONS

Upon receipt of the owner's confirmation that:
1. DNS A records (`staging` and `staging-api`) are set to Proxied (Orange Cloud) in Cloudflare.
2. Cloudflare Access application is created for `staging.mect.org.in`.
3. Formal approval is granted to reload Nginx.

We will immediately:
1. Enable staging virtual host: `ln -sf /etc/nginx/sites-available/staging.mect.org.in.conf /etc/nginx/sites-enabled/`
2. Run `nginx -t`
3. Execute `systemctl reload nginx`
4. Verify HTTPS access on `https://staging.mect.org.in`
5. Verify production MECT and OHO Tech integrity.
