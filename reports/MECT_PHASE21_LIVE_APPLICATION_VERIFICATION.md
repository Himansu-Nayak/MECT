# MECT PHASE 21 — LIVE APPLICATION ROUTE & API VERIFICATION REPORT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Host Target:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Audit Timestamp:** 2026-11-13T10:18:00Z (UTC)  
**Auditor:** Senior QA Architect & Site Reliability Engineer  
**Status:** PASS — 100% ROUTE AVAILABILITY & FUNCTIONAL INTEGRITY  

---

## 1. Deep Verification Methodology

Every route was tested for:
1. HTTP Response Code (`200 OK`).
2. Response `Content-Type` header (`text/html; charset=utf-8`).
3. Server-rendered `<title>` tag.
4. Rendered DOM content and keywords.
5. Latency.

---

## 2. 21 Production Routes Test Results

| # | Route | HTTP Status | Content-Type | Latency | Extracted Server `<title>` | Content Verified |
|---|---|---|---|---|---|---|
| 1 | `/` | **200 OK** | `text/html; charset=utf-8` | 2,496 ms | Home \| Mahaveer Educational & Charitable Trust (MECT) | **YES** |
| 2 | `/about` | **200 OK** | `text/html; charset=utf-8` | 1,396 ms | About Us & Institutional Heritage \| MECT | **YES** |
| 3 | `/programmes` | **200 OK** | `text/html; charset=utf-8` | 627 ms | Our Work & Community Development Programmes \| MECT | **YES** |
| 4 | `/donate` | **200 OK** | `text/html; charset=utf-8` | 364 ms | Donate — Direct State Bank of India & Gateway \| MECT | **YES** |
| 5 | `/contact` | **200 OK** | `text/html; charset=utf-8` | 414 ms | Contact Secretariat & Desk \| MECT | **YES** |
| 6 | `/governance` | **200 OK** | `text/html; charset=utf-8` | 1,046 ms | Fiduciary Governance, Board of Trustees & Ethics \| MECT | **YES** |
| 7 | `/statutory-disclosures` | **200 OK** | `text/html; charset=utf-8` | 903 ms | Statutory Disclosures, 12A/80G & Legal Status \| MECT | **YES** |
| 8 | `/reports` | **200 OK** | `text/html; charset=utf-8` | 686 ms | Annual Reports & Financial Disclosures \| MECT | **YES** |
| 9 | `/impact` | **200 OK** | `text/html; charset=utf-8` | 480 ms | Community Impact & Programme Outcomes \| MECT | **YES** |
| 10 | `/csr-partnerships` | **200 OK** | `text/html; charset=utf-8` | 420 ms | CSR Partnerships & Schedule VII Alignment \| MECT | **YES** |
| 11 | `/faq` | **200 OK** | `text/html; charset=utf-8` | 432 ms | Frequently Asked Questions \| MECT | **YES** |
| 12 | `/privacy` | **200 OK** | `text/html; charset=utf-8` | 516 ms | Privacy Policy \| Mahaveer Educational & Charitable Trust | **YES** |
| 13 | `/terms` | **200 OK** | `text/html; charset=utf-8` | 494 ms | Terms of Engagement \| Mahaveer Educational & Charitable Trust | **YES** |
| 14 | `/accessibility` | **200 OK** | `text/html; charset=utf-8` | 436 ms | Accessibility Statement \| MECT | **YES** |
| 15 | `/volunteer` | **200 OK** | `text/html; charset=utf-8` | 540 ms | Volunteer Onboarding & Mentorship Application \| MECT | **YES** |
| 16 | `/scholarships` | **200 OK** | `text/html; charset=utf-8` | 440 ms | Scholarship Grants, Schemes & Academic Awards \| MECT | **YES** |
| 17 | `/scholarships/apply` | **200 OK** | `text/html; charset=utf-8` | 2,929 ms | Scholarship Online Intake & Application Form \| MECT | **YES** |
| 18 | `/scholarships/track` | **200 OK** | `text/html; charset=utf-8` | 3,845 ms | Track Scholarship Status \| MECT | **YES** |
| 19 | `/portal/login` | **200 OK** | `text/html; charset=utf-8` | 1,612 ms | Donor & Supporter Portal Login \| MECT | **YES** |
| 20 | `/portal/welcome` | **200 OK** | `text/html; charset=utf-8` | 1,536 ms | Welcome to Donor Portal \| MECT | **YES** |
| 21 | `/admin/login` | **200 OK** | `text/html; charset=utf-8` | 1,218 ms | Administrative Secretariat \| MECT | **YES** |

---

## 3. Core Health & API Endpoints

- `GET https://mect.org.in/api/v1/health` -> **`HTTP 200 OK`**
  ```json
  {"status":"UP","application":"mahavir-trust-backend","version":"0.1.0","details":{"status":"Operational","system":"MAHAVIR TRUST Institutional API"}}
  ```
- `GET https://mect.org.in/api/v1/public/donations/programmes` -> **`HTTP 200 OK`** (5 active programmes returned).
- `GET https://mect.org.in/api/v1/admin/donations` -> **`HTTP 401 Unauthorized`** (Protected API).
- `GET https://mect.org.in/api/v1/portal/donations` -> **`HTTP 401 Unauthorized`** (Protected API).
