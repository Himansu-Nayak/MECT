# MECT PHASE 20.2 — LIVE ROUTE VERIFICATION & ACCESS CONTROL AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Production URL:** `https://mect.org.in/`  
**Audit Timestamp:** 2026-11-13T09:40:00Z (UTC)  
**Lead Auditor:** Production QA & Application Security Lead  
**Status:** PASS — 100% ROUTE AVAILABILITY & STRICT ACCESS CONTROL  

---

## 1. Deep Route Inspection Methodology

In compliance with Phase 20.2 requirements, a simple `HTTP 200` status code was not treated as sufficient proof of functional verification. For each route, the test harness validated:
1. HTTP Response Code.
2. Response `Content-Type` header (`text/html; charset=utf-8`).
3. Latency in milliseconds.
4. Extracted `<title>` tag from the server-rendered HTML.
5. DOM content matching expected institutional keywords and UI components.
6. Absence of server error traces or unhandled hydration crashes.

---

## 2. 21 Production Routes Verification Matrix

| Route Path | HTTP Status | Content-Type | Latency (ms) | Server-Rendered `<title>` Content | Expected Content Verified |
|---|---|---|---|---|---|
| `/` | **200 OK** | `text/html; charset=utf-8` | 2,044 ms | Home \| Mahaveer Educational & Charitable Trust (MECT) | **YES** (Hero, Mission, Stats) |
| `/about` | **200 OK** | `text/html; charset=utf-8` | 536 ms | About Us & Institutional Heritage \| MECT | **YES** (Board of Trustees, History) |
| `/programmes` | **200 OK** | `text/html; charset=utf-8` | 468 ms | Our Work & Community Development Programmes \| MECT | **YES** (5 Flagship Programmes) |
| `/donate` | **200 OK** | `text/html; charset=utf-8` | 379 ms | Donate — Direct State Bank of India & Gateway \| MECT | **YES** (SBI QR, Frequency, Programmes) |
| `/contact` | **200 OK** | `text/html; charset=utf-8` | 420 ms | Contact Secretariat & Desk \| MECT | **YES** (Balangir Office, Form) |
| `/governance` | **200 OK** | `text/html; charset=utf-8` | 454 ms | Fiduciary Governance, Board of Trustees & Ethics \| MECT | **YES** (Trust Deed, Fiduciary Policy) |
| `/statutory-disclosures` | **200 OK** | `text/html; charset=utf-8` | 441 ms | Statutory Disclosures, 12A/80G & Legal Status \| MECT | **YES** (12A, 80G, CSR URNs) |
| `/reports` | **200 OK** | `text/html; charset=utf-8` | 374 ms | Annual Reports & Financial Disclosures \| MECT | **YES** (Audit archives, Annual returns) |
| `/impact` | **200 OK** | `text/html; charset=utf-8` | 432 ms | Community Impact & Programme Outcomes \| MECT | **YES** (Outreach statistics, Stories) |
| `/csr-partnerships` | **200 OK** | `text/html; charset=utf-8` | 387 ms | CSR Partnerships & Schedule VII Alignment \| MECT | **YES** (Schedule VII, Corporate CSR) |
| `/faq` | **200 OK** | `text/html; charset=utf-8` | 430 ms | Frequently Asked Questions \| MECT | **YES** (Tax exemption, Receipts, UTR) |
| `/privacy` | **200 OK** | `text/html; charset=utf-8` | 371 ms | Privacy Policy \| Mahaveer Educational & Charitable Trust | **YES** (DPDP compliant data policy) |
| `/terms` | **200 OK** | `text/html; charset=utf-8` | 437 ms | Terms of Engagement \| Mahaveer Educational & Charitable Trust | **YES** (Terms of engagement & conduct) |
| `/accessibility` | **200 OK** | `text/html; charset=utf-8` | 413 ms | Accessibility Statement \| MECT | **YES** (WCAG 2.1 AA standards) |
| `/volunteer` | **200 OK** | `text/html; charset=utf-8` | 416 ms | Volunteer Onboarding & Mentorship Application \| MECT | **YES** (Volunteer application flow) |
| `/scholarships` | **200 OK** | `text/html; charset=utf-8` | 427 ms | Scholarship Grants, Schemes & Academic Awards \| MECT | **YES** (Shiksha Setu schemes) |
| `/scholarships/apply` | **200 OK** | `text/html; charset=utf-8` | 361 ms | Scholarship Online Intake & Application Form \| MECT | **YES** (Multi-step application form) |
| `/scholarships/track` | **200 OK** | `text/html; charset=utf-8` | 335 ms | Track Scholarship Status \| MECT | **YES** (Application status lookup) |
| `/portal/login` | **200 OK** | `text/html; charset=utf-8` | 337 ms | Donor & Supporter Portal Login \| MECT | **YES** (OTP / Email login interface) |
| `/portal/welcome` | **200 OK** | `text/html; charset=utf-8` | 360 ms | Welcome to Donor Portal \| MECT | **YES** (New donor onboarding flow) |
| `/admin/login` | **200 OK** | `text/html; charset=utf-8` | 455 ms | Administrative Secretariat \| MECT | **YES** (Staff authentication login) |

**Summary Result:** 21 out of 21 verified routes returned `200 OK` with valid HTML structure, complete SEO titles, and valid content.

---

## 3. Sensitive Route Access Control & Guards

| Target Path | Target Resource | Access Control Mechanism | Unauthenticated Result | Verified Behavior |
|---|---|---|---|---|
| `/api/v1/admin/donations` | Admin Donations Ledger API | Spring Security JWT Bearer Filter | **401 Unauthorized** | Requests without valid JWT are immediately rejected. |
| `/api/v1/portal/donations` | Donor Portal API | Spring Security JWT Bearer Filter | **401 Unauthorized** | Requests without valid JWT are immediately rejected. |
| `/admin` | Admin Secretariat Portal | Next.js Client Route Guard + SEO Robots | **200 (Login Guard Shell)** | Renders `<meta name="robots" content="noindex, nofollow"/>` and forces authentication before disclosing administrative data. |
| `/portal/dashboard` | Donor Dashboard | Next.js Client Route Guard + SEO Robots | **200 (Login Guard Shell)** | Renders `<meta name="robots" content="noindex, nofollow"/>` and redirects unauthenticated users to `/portal/login`. |
