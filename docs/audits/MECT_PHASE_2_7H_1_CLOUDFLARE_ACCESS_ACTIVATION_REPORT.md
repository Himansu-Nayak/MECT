# MECT PHASE 2.7H.1 — CLOUDFLARE DNS & ACCESS ACTIVATION REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/) (**100% Frozen & Untouched**)  
**OHO Tech Domain:** [https://ohotechn.com/](https://ohotechn.com/) (**100% Frozen & Untouched**)  
**Staging Frontend Domain:** `staging.mect.org.in`  
**Staging Backend API Domain:** `staging-api.mect.org.in`  
**Hostinger VPS IPv4:** `200.97.161.128`  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Deployed Commit SHA:** `50992b96da0900edcde7ad8464be9b8b2ae22b47`  
**Protocol Phase:** Phase 2.7H.1 — Cloudflare DNS and Access Activation  
**Report Date:** 2026-11-27  
**Current Phase Status:** **`DNS SUBDOMAIN NAME DISCREPANCY IDENTIFIED & GUIDED FOR CORRECTION`**

---

## 1. PRE-ACTIVATION INGRESS & INFRASTRUCTURE STATUS

1. **VPS Staging Containers:**
   - Frontend container (`mect-frontend-staging`): Active on loopback `127.0.0.1:3002`.
   - Backend container (`mect-backend-staging`): Active on loopback `127.0.0.1:8082`.
   - Database container (`mect-postgres-staging`): Internal to `mect-staging-network` with **0 published host ports**.
2. **Production Isolation:**
   - Production MECT (`127.0.0.1:3001`, `127.0.0.1:8081`, `127.0.0.1:5433`) is 100% operational.
   - OHO Tech (`127.0.0.1:3000`, `127.0.0.1:8080`, `127.0.0.1:5432`) is 100% operational.
   - Zero production DNS, Docker, database, or Nginx changes have been executed.

---

## 2. STEP 1 — DNS VERIFICATION & ROOT CAUSE DISCOVERY

During authoritative DNS verification against Cloudflare nameserver `barbara.ns.cloudflare.com`, the following resolution behavior was detected:

| Queried FQDN | Resolved IP | Record Type | Analysis & Root Cause |
| :--- | :---: | :---: | :--- |
| `staging.mect.org.in.mect.org.in` | `200.97.161.128` | `A` | **DISCREPANCY:** In Cloudflare DNS, entering `staging.mect.org.in` in the Name field resulted in appending the root domain twice (`.mect.org.in.mect.org.in`). |
| `staging-api.mect.org.in.mect.org.in` | `200.97.161.128` | `A` | **DISCREPANCY:** Same double suffix occurred (`staging-api.mect.org.in.mect.org.in`). |
| `staging.mect.org.in` | `200.97.161.128` | `A` (Wildcard) | Because no explicit `staging` record exists, requests fell back to the unproxied wildcard record `*.mect.org.in`. |

### Required Correction in Cloudflare DNS:
- In Cloudflare DNS records, the Name field only accepts the subdomain prefix:
  - Change Name from `staging.mect.org.in` → **`staging`**
  - Change Name from `staging-api.mect.org.in` → **`staging-api`**
  - Ensure Proxy Status is **Proxied (Orange Cloud)**.
