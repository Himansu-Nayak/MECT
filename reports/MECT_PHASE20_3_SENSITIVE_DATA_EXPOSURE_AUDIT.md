# MECT PHASE 20.3 — SENSITIVE DATA EXPOSURE AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T09:35:00Z (UTC)  
**Lead Auditor:** Application Security Auditor  
**Status:** PASS — ZERO CREDENTIAL OR PII LEAKAGE DETECTED  

---

## 1. Scope & Audit Vectors

A deep inspection of public HTTP responses, HTML markup, JavaScript bundles, source maps, and API payloads was conducted to confirm the absence of:
1. Database credentials (`POSTGRES_PASSWORD`, connection strings).
2. Gateway secrets (`CASHFREE_CLIENT_SECRET`, `RAZORPAY_KEY_SECRET`).
3. JWT signing keys (`JWT_SECRET`).
4. Sensitive donor Personally Identifiable Information (PAN numbers, residential addresses, personal phone numbers).
5. Internal configuration files (`.env`, `.git/config`, `compose.production.yaml`).
6. Next.js JavaScript source maps (`.js.map`).

---

## 2. Forensic Scan Results

### 2.1 Hidden & Sensitive Files Accessibility
Direct HTTP requests to standard sensitive paths:

```
curl -s -o /dev/null -w "%{http_code}" https://mect.org.in/.env                  -> 404 Not Found
curl -s -o /dev/null -w "%{http_code}" https://mect.org.in/.env.production       -> 404 Not Found
curl -s -o /dev/null -w "%{http_code}" https://mect.org.in/.git/config           -> 404 Not Found
curl -s -o /dev/null -w "%{http_code}" https://mect.org.in/compose.production.yaml -> 404 Not Found
```
**Finding:** All configuration files are blocked by Nginx reverse proxy routing. Only `/` (frontend standalone) and `/api/` (backend) are routed; hidden files return 404.

### 2.2 JavaScript Source Map Exposure
- Inspected Next.js production chunks (e.g. `/_next/static/chunks/webpack-cc89c2a0e35102cf.js.map`).
- **Result:** `HTTP 404 Not Found`. Production Next.js build excludes source maps from client distribution, preventing reverse engineering of application logic.

### 2.3 Public API Endpoints Data Exposure
1. **Endpoint `/api/v1/public/donations/programmes`:**
   - Returns: ID, programme code, programme name, tagline, description, and display order.
   - Leak scan: Zero database columns, foreign keys, or administrative user details returned.
2. **Endpoint `/api/v1/health`:**
   - Returns: `{"status":"UP","application":"mahavir-trust-backend","version":"0.1.0"}`.
   - Leak scan: JDBC URLs, database IP addresses, and heap metrics are excluded when unauthenticated (`management.endpoint.health.show-details: when_authorized`).

### 2.4 Server-Rendered HTML & DOM Inspection
- Scanned homepage, about page, and donate page markup for environment variable patterns (`JWT_SECRET`, `CASHFREE_CLIENT_SECRET`, `POSTGRES_PASSWORD`, `MectSecure`).
- **Result:** Zero occurrences. Environment variables are injected strictly into the Node.js/Java runtime and are never passed to the browser bundle.

### 2.5 Donor PII Privacy & 80G Disclosures
- On public donation flows and public transparency pages, individual donor PANs, private email addresses, and phone numbers are excluded from all public responses.
- Anonymized donors are displayed as `"Anonymous Donor"` in public donor recognition listings.
