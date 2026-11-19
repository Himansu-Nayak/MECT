# MECT PHASE 29.4.2C — PUBLIC ENDPOINT SECURITY & TELEMETRY REPORT
## Timestamped Endpoint Probes, TLS Validation, Sensitive Information Audit & Edge Behavior

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Evaluation Phase:** Phase 29.4.2C — Evidence Reconciliation & Owner-Assisted Access Readiness  
**Audit Evaluation Date:** 2026-11-20T00:15:00+05:30  
**Measurement UTC Timestamp:** `2026-11-19T18:46:24.984349Z`  
**Security Status:** **SAFE & OPERATIONAL (Zero Credentials or PII Exposed)**  

---

## 1. EXECUTIVE SUMMARY

In accordance with Phase 29.4.2C non-negotiable security directives, safe, unauthenticated read-only HTTP/HTTPS probes were executed against the public-facing production infrastructure of **Mahaveer Educational & Charitable Trust (`mect.org.in`)**.

Zero payment transactions, zero test donations, and zero state mutations were initiated.

**Key Findings:**
1. **High Availability:** All nine public routes responded with expected HTTP status codes (`HTTP 200 OK` or `HTTP 301 Moved Permanently`).
2. **Cryptographic Integrity:** TLS 1.3 / HTTP/2 encryption is active, backed by a valid Let's Encrypt certificate expiring on **January 31, 2027**. HSTS is enforced with a 2-year duration (`max-age=63072000`).
3. **Data Security & Privacy:** Exhaustive JSON payload inspection confirmed that **zero internal secrets, database credentials, Cashfree merchant private keys, or donor PII** are exposed across public endpoints.

---

## 2. TIMESTAMPED PUBLIC ENDPOINT TELEMETRY MATRIX

Probes executed on **2026-11-19T18:46:24Z** (IST: 2026-11-20T00:16:24Z):

| Endpoint Name | Request URL | HTTP Status | Response Time | Content-Type | Relevant Response Fields Captured | Sensitive Data Exposure Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Root Website** | `https://mect.org.in/` | `200 OK` | 1008 ms | `text/html; charset=utf-8` | `x-nextjs-prerender: 1`, `server: cloudflare`, `cf-cache-status: DYNAMIC` | **NONE (Public HTML)** |
| **HTTP Redirect** | `http://mect.org.in/` | `301 Moved` | 274 ms | `text/html` | `Location: https://mect.org.in/`, HSTS enforced | **NONE (Redirect Header)** |
| **Backend Health** | `https://mect.org.in/api/v1/health` | `200 OK` | 801 ms | `application/json` | `status: "UP"`, `application: "mahavir-trust-backend"`, `version: "0.1.0"` | **NONE (System Status Only)** |
| **Actuator Health**| `https://mect.org.in/api/v1/actuator/health` | `200 OK` | 564 ms | `application/json` | `status: "UP"`, `groups: ["liveness", "readiness"]` | **NONE (Actuator Group Summary)** |
| **Programmes** | `https://mect.org.in/api/v1/public/donations/programmes` | `200 OK` | 531 ms | `application/json` | 6 active programmes including ID 7 `HANUMAN_MURTI` | **NONE (Public Programmes)** |
| **Documents** | `https://mect.org.in/api/v1/public/documents` | `200 OK` | 614 ms | `application/json` | 10 statutory records; Trust Deed `40311302194` | **NONE (Public Statutory Records)** |
| **Donation Config**| `https://mect.org.in/api/v1/public/donations/config` | `200 OK` | 597 ms | `application/json` | `minAmount: 1.0`, `presetAmounts: [500..10000]`, statutory disclosures | **AUDITED SAFE (Zero Keys Expose)** |
| **Gateway Status** | `https://mect.org.in/api/v1/public/donations/gateway-status` | `200 OK` | 591 ms | `application/json` | `provider: "CASHFREE"`, `checkoutEnvironment: "production"`, `configured: true` | **AUDITED SAFE (Zero Keys Expose)** |
| **AI Assistant** | `https://mect.org.in/api/ai/health` | `200 OK` | 579 ms | `application/json` | `status: "operational"`, `activeEngine: "groq_cloud_hot_standby"` | **NONE (Operational Health Only)** |

---

## 3. TLS CERTIFICATE & CRYPTOGRAPHIC VALIDATION

A direct cryptographic handshake with `mect.org.in:443` was performed via TLS socket inspection:

| TLS Certificate Property | Measured Production Value | Forensic Evaluation |
| :--- | :--- | :--- |
| **Common Name (CN)** | `mect.org.in` | Valid match for production domain |
| **Certificate Authority (CA)** | `Let's Encrypt` (Issuer CN: `YE1`, Org: Let's Encrypt, Country: US) | Trusted global Certificate Authority |
| **Certificate Validity Start** | `Nov 02 09:29:03 2026 GMT` | Active & in-force |
| **Certificate Expiration Date**| `Jan 31 09:29:02 2027 GMT` | **> 72 days remaining before renewal** |
| **X.509 Certificate Version** | Version 3 | Standard modern PKI |
| **Strict-Transport-Security** | `max-age=63072000; includeSubDomains; preload` | **Maximum HSTS compliance (2 Years)** |
| **Anycast Edge IP Addresses** | `104.21.44.48`, `172.67.195.21` | Cloudflare Global CDN / WAF |

---

## 4. CASHFREE PAYMENT CONFIGURATION SECURITY AUDIT

Because payment gateway configurations can inadvertently leak API client IDs, webhook tokens, or secret keys if serialized improperly by backend frameworks, the responses of `/api/v1/public/donations/config` and `/gateway-status` were subjected to strict forensic scrutiny.

### 4.1 Captured JSON Payload Verification

```json
{
  "provider": "CASHFREE",
  "configured": true,
  "sandboxMode": false,
  "dynamicQrSupported": false,
  "checkoutMode": "CASHFREE_SDK_V3",
  "checkoutEnvironment": "production",
  "reason": "Cashfree Payment Gateway active (production)"
}
```

### 4.2 Security Assertions & Findings

| Inspected Parameter | Exists in Public Response? | Security Risk Assessment |
| :--- | :--- | :--- |
| **`CASHFREE_APP_ID`** | **NO** (Strictly excluded) | **SAFE** |
| **`CASHFREE_SECRET_KEY`** | **NO** (Strictly excluded) | **SAFE** |
| **`FAST2SMS_API_KEY`** | **NO** (Strictly excluded) | **SAFE** |
| **`GROQ_API_KEY`** | **NO** (Strictly excluded) | **SAFE** |
| **Database Passwords / URLs** | **NO** (Strictly excluded) | **SAFE** |
| **Merchant Bank Account Credentials**| **NO** (Only public statutory SBI account details) | **SAFE** |
| **Donor Identifiers / PII** | **NO** (Endpoints return purely generic static configurations) | **SAFE** |

**Conclusion:** The public donation endpoints serialize only white-listed UI presentation fields (`minAmount`, `presetAmounts`, statutory URNs, and gateway display strings). Zero private merchant credentials or donor information are exposed.

---

## 5. EDGE CONFIGURATION ANOMALY: DUPLICATE HTTP SECURITY HEADERS

The raw HTTP headers returned by `https://mect.org.in/` revealed duplicate occurrences of standard browser security headers:

```http
X-Frame-Options: DENY
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Referrer-Policy: strict-origin-when-cross-origin
x-nextjs-prerender: 1
x-nextjs-prerender: 1
```

### 5.1 Root Cause Analysis
1. **Next.js Application Layer:** The Next.js 16.4.6 runtime (`src/middleware.ts` or `next.config.ts`) injects standard security headers onto all SSR and static responses.
2. **Reverse Proxy Layer (Nginx or Cloudflare):** The host Nginx configuration (`/etc/nginx/sites-available/mect.conf`) or a Cloudflare Transform Rule also injects `add_header X-Frame-Options "DENY" always;`.
3. **Behavioral Impact:** Because the values are identical, all modern browsers (Chrome, Firefox, Safari, Edge) treat them as idempotent. However, duplicate headers add minor byte overhead and indicate uncoordinated configuration management between the application and reverse proxy.
4. **Remediation Recommendation:** During the owner-assisted SSH maintenance phase, inspect the host Nginx configuration to ensure headers are either managed exclusively by Next.js or exclusively by Nginx/Cloudflare.

---

## 6. PUBLIC ENDPOINT AUDIT CONCLUSION

```
+=============================================================================+
|             MECT PHASE 29.4.2C PUBLIC SECURITY AUDIT VERDICT                |
+=============================================================================+
| 1. Public Service Availability:       100% (All 9 endpoints HTTP 200/301)   |
| 2. TLS Certificate Validity:          VALID (Let's Encrypt, Exp: Jan 2027)  |
| 3. HSTS Transport Security:           ENFORCED (2-Year Preload Policy)      |
| 4. Sensitive Secrets Exposure:        ZERO LEAKAGE (No keys/PII in APIs)    |
| 5. Payment Gateway State:             PRODUCTION MODE (Cashfree SDK V3)     |
+=============================================================================+
| FINAL VERDICT:                        PUBLIC EDGE SECURITY VERIFIED SAFE    |
+=============================================================================+
```
