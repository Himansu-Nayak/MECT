# MECT — PHASE 2.7A: READ-ONLY STAGING INFRASTRUCTURE DISCOVERY & ARCHITECTURE SPECIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Origin:** `https://mect.org.in/`  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Current Baseline Commit:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Target Staging Frontend:** `https://staging.mect.org.in`  
**Target Staging Backend API:** `https://staging-api.mect.org.in`  
**Target Staging Database:** `mect_staging_db` (User: `mect_staging_user`)  
**Audit Phase:** Phase 2.7A — Read-Only Staging Infrastructure Discovery  
**Final Phase Verdict:** **STAGING INFRASTRUCTURE READY FOR PROVISIONING**  

---

## 1. Existing Infrastructure Inventory

A thorough audit of project configuration, server inventories (`MECT_PHASE_29_4_2B_VPS_SYSTEM_INVENTORY.md`, `compose.production.yaml`, `docker/nginx/mect.org.in.conf`, and `deploy_vps.ps1`) establishes the existing infrastructure:

### 1.1 VPS Hardware & Compute Capacity
* **Provider & Virtualization:** Hostinger VPS (KVM Virtualization Architecture, Tier 4 Data Center).
* **Public IPv4 Address:** `200.97.161.128` (Reverse DNS / Hostname: `<PROD_HOSTNAME>`).
* **Operating System:** Ubuntu Linux 26.04.1 LTS (Linux Kernel `6.8.0/7.0.0-generic x86_64`).
* **Compute Resources:**
  - **CPU:** 4 dedicated vCPUs (x86_64). Current CPU load averages < 0.05 (> 95% CPU idle).
  - **Memory (RAM):** 15.0 GiB Dedicated RAM. Current production usage is ~2.5 GiB. **~12.5–13.0 GiB RAM is completely free and available.**
  - **Storage:** 193 GB NVMe SSD (`/dev/sda1`). Current usage is ~20 GB (10%). **~173 GB NVMe SSD is free and available.**
  - **Uptime:** High-availability host (> 27 days continuous uptime).

### 1.2 Web Server, Reverse Proxy & SSL Configuration
* **Host Web Server:** Nginx (`systemd nginx.service`) running directly on the Ubuntu host, listening on ports 80 and 443.
* **SSL / TLS Certificate:** Cloudflare Origin CA certificate installed on the host:
  - Certificate: `/etc/ssl/mect/fullchain.pem`
  - Private Key: `/etc/ssl/mect/origin.key`
  - **Certificate Scope:** Covers `mect.org.in` and wildcard `*.mect.org.in` (15-year validity).
  - **Cloudflare Edge:** Strict SSL encryption mode with Cloudflare CDN proxy.

### 1.3 Multi-Tenant Workload Isolation on Host
The Hostinger VPS accommodates multi-tenant workloads with strict network separation:
1. **Third-Party Tenant (`ohotech.com`):**
   - Managed via PM2 process manager on host loopback `127.0.0.1:3000` (frontend) and `127.0.0.1:8080` (backend).
   - System PostgreSQL on standard port `127.0.0.1:5432`.
2. **MECT Production (Docker Compose `compose.production.yaml`):**
   - `mect-frontend`: Container port 3000 &rarr; Host loopback `127.0.0.1:3001`
   - `mect-backend`: Container port 8080 &rarr; Host loopback `127.0.0.1:8081`
   - `mect-postgres`: Container port 5432 &rarr; Host loopback `127.0.0.1:5433` (Database: `mect_db`, User: `mect_user`)
   - Internal bridge network: `mect-network`
   - Data volumes: `mect-pgdata`, `mect-media`, `mect-receipts`

### 1.4 Domain Registrar & DNS Provider
* **Domain Registrar:** Hostinger.
* **DNS Nameservers:** Cloudflare Authoritative Nameservers.
* **Production Routing:** All client traffic for `mect.org.in` and `www.mect.org.in` is routed through Cloudflare to VPS IP `200.97.161.128`. Path routing directs `/api/` to Spring Boot (`8081`) and `/` to Next.js (`3001`).

### 1.5 Vercel vs VPS Assessment
* **Vercel Inspection:** The repository contains `.vercel` in `.gitignore`, but contains **zero active Vercel configuration files** (`vercel.json` does not exist).
* **Parity Finding:** The production application runs entirely on containerized Linux (Node.js 20/22 runtime + OpenJDK 21). Deploying the staging frontend to Vercel would introduce runtime discrepancies (serverless edge execution vs persistent Node server, divergent environment variables, and cross-origin CORS/cookie complexities).
* **Determination:** An isolated container stack on the existing Hostinger VPS provides **100% environment parity with production** at **₹0 additional cost**.

---

## 2. Recommended Staging Architecture

To ensure strict zero-risk isolation from production, the recommended staging topology provisions an independent Docker Compose project alongside production on the Hostinger VPS:

```
[Internet Client / QA Tester]
            │
            ├──► https://staging.mect.org.in (Cloudflare Proxy -> 200.97.161.128:443)
            └──► https://staging-api.mect.org.in (Cloudflare Proxy -> 200.97.161.128:443)
                            │
              [Host Nginx Reverse Proxy]
              (Cloudflare Origin CA: *.mect.org.in)
                 ├── proxy_pass 127.0.0.1:3002 (Staging Next.js)
                 └── proxy_pass 127.0.0.1:8082 (Staging Spring Boot)
                            │
        ┌───────────────────┴───────────────────┐
        │       ISOLATED STAGING STACK          │
        │  (compose.staging.yaml / /opt/staging)│
        │                                       │
        │  ┌─────────────────────────────────┐  │
        │  │ mect-frontend-staging (:3002)   │  │
        │  │ Next.js 16 (Node.js Container)  │  │
        │  └────────────────┬────────────────┘  │
        │                   │ Internal API      │
        │  ┌────────────────▼────────────────┐  │
        │  │ mect-backend-staging (:8082)    │  │
        │  │ Spring Boot (JDK 21 Container)  │  │
        │  └────────────────┬────────────────┘  │
        │                   │ JDBC              │
        │  ┌────────────────▼────────────────┐  │
        │  │ mect-postgres-staging (:5434)   │  │
        │  │ DB: mect_staging_db             │  │
        │  │ User: mect_staging_user         │  │
        │  │ Volume: mect-staging-pgdata     │  │
        │  └─────────────────────────────────┘  │
        │                                       │
        │   Network: mect-staging-network       │
        └───────────────────────────────────────┘
```

### 2.1 Staging Port & Network Allocation

| Service Component | Container Name | Host Loopback Binding | Internal Port | Isolation Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Staging Frontend** | `mect-frontend-staging` | `127.0.0.1:3002` | `3000` | Loopback only, proxied by Nginx |
| **Staging Backend** | `mect-backend-staging` | `127.0.0.1:8082` | `8080` | Loopback only, proxied by Nginx |
| **Staging Database** | `mect-postgres-staging` | `127.0.0.1:5434` | `5432` | Loopback only, distinct staging volume |
| **Bridge Network** | `mect-staging-network` | N/A (Docker internal) | N/A | Completely segregated from `mect-network` |

---

## 3. Staging Resource Requirements

Detailed resource budgeting demonstrates that the existing Hostinger VPS can host the staging environment with massive headroom:

| Resource Dimension | Staging Allocation | Production Allocation | Available on Host | Sufficiency Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **CPU Cores** | 0.5–1.0 vCPU | 1.0–2.0 vCPU | 4 vCPUs (95% idle) | **> 4x Headroom** |
| **RAM (Frontend)** | 350 MiB | 400 MiB | — | — |
| **RAM (Backend JVM)** | 512 MiB heap (768 MiB total) | 768 MiB heap | — | — |
| **RAM (PostgreSQL)** | 200 MiB | 256 MiB | — | — |
| **Total Staging RAM** | **~1.3 GiB** | **~1.5 GiB** | **~12.5 GiB Free** | **> 9.6x Headroom** |
| **Disk Storage** | ~3.5 GB (Images + DB + Logs) | ~8.0 GB | **~173 GB Free** | **> 49x Headroom** |
| **Network Bandwidth** | Unmetered gigabit | Unmetered gigabit | Cloudflare cached | **Abundant** |

---

## 4. Cost Assessment & External Services

| Cost Category | Requirement | Unit Cost | Total Monthly Cost to Trust |
| :--- | :--- | :--- | :--- |
| **Compute / VPS** | Co-located on existing Hostinger VPS (utilizing 1.3 GiB of 12.5 GiB free RAM) | Included in existing plan | **₹0.00** |
| **Domain & Subdomains** | `staging.mect.org.in` and `staging-api.mect.org.in` | Included in existing domain | **₹0.00** |
| **SSL / TLS Encryption** | Wildcard Cloudflare Origin CA certificate (`*.mect.org.in`) | Free included feature | **₹0.00** |
| **Database Licensing** | PostgreSQL 18 Alpine (Open Source) | Free / Open Source | **₹0.00** |
| **Cellular SMS Service** | Mocked Console Delivery (`SMS_PROVIDER=NONE`) | Free / Local simulation | **₹0.00** |
| **Transactional Email** | Resend API free tier or staging mock sink | Free tier | **₹0.00** |
| **WhatsApp Business API** | Strict Disabled State (`WHATSAPP_ENABLED=false`) | Disabled / Zero spend | **₹0.00** |
| **Payment Gateway** | Cashfree Sandbox environment or mock UTR mode | Free sandbox | **₹0.00** |
| **Total Incremental Cost** | — | — | **₹0.00 / month** |

---

## 5. DNS Preparation & Required Records

To direct staging traffic to the Hostinger VPS, the Trust administrator must add two `A` records in the Cloudflare DNS management console:

```
┌─────────────────────────┬──────┬─────────────────┬────────┬─────────────────────────┐
│ Name                    │ Type │ Target IPv4     │ TTL    │ Proxy Status            │
├─────────────────────────┼──────┼─────────────────┼────────┼─────────────────────────┤
│ staging.mect.org.in     │ A    │ 200.97.161.128  │ Auto   │ Proxied (Orange Cloud)  │
│ staging-api.mect.org.in │ A    │ 200.97.161.128  │ Auto   │ Proxied (Orange Cloud)  │
└─────────────────────────┴──────┴─────────────────┴────────┴─────────────────────────┘
```

*Note: Since Cloudflare proxy is enabled, traffic will be encrypted with Cloudflare Universal Edge SSL and forward to the VPS via the Cloudflare Origin CA certificate.*

---

## 6. SSL / TLS Architecture & Requirements

* **Edge SSL:** Cloudflare automatically terminates public HTTPS at its global edge using its Universal Managed Certificate.
* **Origin SSL:** Host Nginx utilizes the existing Cloudflare Origin CA certificate located at `/etc/ssl/mect/fullchain.pem` and `/etc/ssl/mect/origin.key`.
* **Wildcard Coverage:** The Origin CA certificate covers both `mect.org.in` and `*.mect.org.in`. Therefore, both `staging.mect.org.in` and `staging-api.mect.org.in` require **zero new SSL certificate generation**.
* **Host Nginx Virtual Host:** A dedicated configuration file `/etc/nginx/sites-available/staging.mect.org.in.conf` will configure the virtual host bindings for ports 3002 and 8082.

---

## 7. Database Architecture & Segregation

The staging database architecture guarantees complete isolation from production records:
1. **Container Isolation:** Staging database runs inside `mect-postgres-staging` container on loopback port `5434`. It cannot communicate with `mect-postgres` (port `5433`).
2. **Database & Role Name:** Database is named `mect_staging_db`, owned by user `mect_staging_user`.
3. **Storage Volume:** Mapped to an independent named volume `mect-staging-pgdata`.
4. **Data Sanitization & Seeding:**
   - **Zero Production Data Import:** Production donor records, real mobile numbers, and personal identifiers will **NEVER** be imported into staging.
   - **Flyway Migrations:** Migrations `V1` through `V20` will run on a clean database on startup.
   - **Test Seed Data:** Seeded exclusively with synthetic test personas (e.g. `+91 94382 00001`, `synthetic.donor@mect.org.in`).

---

## 8. Security Isolation & Sandbox Boundaries

| Control Vector | Staging Configuration | Production Baseline | Isolation Defense |
| :--- | :--- | :--- | :--- |
| **JWT Secret** | `JWT_SECRET_STAGING_KEY_MIN_256_BITS_RANDOMLY_GENERATED` | Independent Production Secret | Separate key spaces; tokens cannot be cross-used |
| **OTP Pepper** | `OTP_PEPPER_STAGING_RANDOM_HASH_STRING` | Independent Production Pepper | OTP hashes cannot be cross-verified |
| **Google OIDC** | Staging OAuth Client ID / Authorized Redirect URI | Production Google Client ID | Google rejects cross-environment token redirection |
| **WhatsApp Integration** | `WHATSAPP_ENABLED=false` | Disabled / Production | Zero outbound WhatsApp API calls |
| **SMS Gateway** | `SMS_PROVIDER=NONE` | Production SMS Provider | OTPs printed to server logs; zero real SMS sent |
| **Payment Gateway** | `PAYMENT_SANDBOX_MODE=true` (`CASHFREE_ENV=SANDBOX`) | Cashfree Production | Zero live bank transactions or real money transfers |
| **Firewall / Ports** | Ports `3002`, `8082`, `5434` bound strictly to `127.0.0.1` | Ports `3001`, `8081`, `5433` on loopback | Direct external internet access to containers is impossible |

---

## 9. Deployment Architecture & File System Structure

On the Hostinger VPS, staging will reside in its own directory tree:

```
/opt/
├── mect/                       # PRODUCTION ENVIRONMENT (Untouched)
│   ├── compose.production.yaml
│   ├── .env.production
│   └── backups/
│
└── mect-staging/               # STAGING ENVIRONMENT (Isolated)
    ├── compose.staging.yaml
    ├── .env.staging
    ├── backend/
    ├── frontend/
    └── backups/
```

### Nginx Virtual Host Template (`staging.mect.org.in.conf`)
```nginx
# Staging Frontend Host
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name staging.mect.org.in;

    ssl_certificate /etc/ssl/mect/fullchain.pem;
    ssl_certificate_key /etc/ssl/mect/origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Staging Backend API Host
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name staging-api.mect.org.in;

    ssl_certificate /etc/ssl/mect/fullchain.pem;
    ssl_certificate_key /etc/ssl/mect/origin.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
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

## 10. Risks, Mitigations & Blockers

| Potential Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Port Collision** | Low | Explicitly reserved ports `3002`, `8082`, and `5434`. Production uses `3001`, `8081`, and `5433`. OHO Tech uses `3000`, `8080`, and `5432`. Zero overlap. |
| **Resource Contention** | Negligible | VPS has 12.5 GiB of unused RAM and 173 GB of free SSD. Staging requires ~1.3 GiB RAM and ~3.5 GB disk. |
| **Database Accidental Overwrite** | Critical | Enforced independent container `mect-postgres-staging` and volume `mect-staging-pgdata`. Production DB `mect_db` is completely unmapped in staging compose. |
| **DNS Propagation Delay** | Low | Cloudflare DNS changes propagate globally within 60 seconds. |

---

## 11. Exact Owner Actions Required Prior to Staging Provisioning

Before Phase 2.7B (provisioning and deployment) can commence, the Trust Management must complete three actions:

1. **Cloudflare DNS Records:**
   - In Cloudflare DNS for `mect.org.in`, add:
     - `staging` &rarr; `A` &rarr; `200.97.161.128` (Proxied)
     - `staging-api` &rarr; `A` &rarr; `200.97.161.128` (Proxied)
2. **Google Cloud Console OAuth Setting:**
   - Add `https://staging.mect.org.in` to Authorized JavaScript origins.
   - Add `https://staging.mect.org.in/login` to Authorized redirect URIs.
3. **Owner Staging Authorization:**
   - Issue explicit written approval to proceed with Phase 2.7B staging provisioning.

---

## 12. Final Discovery Verdict

**FINAL VERDICT:** **STAGING INFRASTRUCTURE READY FOR PROVISIONING**

* The existing Hostinger VPS possesses massive unused capacity (> 12.5 GiB RAM and > 173 GB SSD available), eliminating the need for expensive secondary VPS instances.
* Complete architectural and security isolation is guaranteed via containerization, independent networks, and dedicated database volumes.
* Net incremental hosting cost is **₹0.00 / month**.
* Ready to proceed to provisioning immediately upon owner completion of the Cloudflare DNS records.

---
**STRICT STOP CONDITION OBSERVED:** Read-only discovery complete. Zero servers provisioned, zero SSH connections initiated, zero DNS changes made, and zero code commits executed. Awaiting owner instructions.
