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
**Current Phase Status:** **`STEP 1 (DNS GUIDANCE) ISSUED — AWAITING OWNER CONFIRMATION`**

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
3. **Current DNS Preflight Baseline:**
   - `staging.mect.org.in` resolves to `200.97.161.128` with TTL 300 (DNS only / Grey Cloud).
   - `staging-api.mect.org.in` resolves to `200.97.161.128` with TTL 300 (DNS only / Grey Cloud).
   - Both records exist in Cloudflare, but are unproxied.

---

## 2. STEP 1 — CLOUDFLARE DNS ACTIVATION (IN PROGRESS)

Owner action required in Cloudflare Dashboard:
- Locate `staging` and `staging-api` A records pointing to `200.97.161.128`.
- Change Proxy Status from **DNS Only (Grey Cloud)** to **Proxied (Orange Cloud)**.
- Do NOT touch `@`, `www`, `api`, or any production records.
- Wait for owner confirmation before probing and proceeding to Step 2.
