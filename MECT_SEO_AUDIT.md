# MECT SEO & Discoverability Audit Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Canonical Domain:** `https://mect.org.in`  
**Audit Date:** 2026-11-10  

---

## 1. Executive Summary

All public routes were audited against Next.js App Router Metadata API standards (`title`, `alternates.canonical`, single semantic `<h1>`, `robots.txt`, and `sitemap.xml`). Route-level metadata and canonical links were completed across static informational routes, legal disclosures, and interactive client-rendered routes (`donate` and `csr-partnerships` via dedicated `layout.tsx` metadata wrappers).

---

## 2. Completed Metadata & Indexability Implementation

### 2.1 Route-Level Metadata Additions & Deduplication
- Created [donate/layout.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/donate/layout.tsx) setting `canonical: "/donate"` and clean route metadata for the client-rendered donation experience.
- Created [csr-partnerships/layout.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/csr-partnerships/layout.tsx) setting `canonical: "/csr-partnerships"` and route metadata for CSR partnership inquiries.
- Added clean deduplicated `<title>` and `alternates: { canonical }` exports to:
  - [governance/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/governance/page.tsx)
  - [programmes/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/programmes/page.tsx)
  - [impact/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/impact/page.tsx)
  - [reports/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/reports/page.tsx)
  - [statutory-disclosures/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/statutory-disclosures/page.tsx)
  - [scholarships/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/scholarships/page.tsx)
  - [faq/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/faq/page.tsx)
  - [privacy/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/privacy/page.tsx)
  - [terms/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/terms/page.tsx)
  - [accessibility/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/accessibility/page.tsx)

### 2.2 Sitemap, Robots & Structured Data
- **[sitemap.ts](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/sitemap.ts):** Updated `buildDate` to `2026-11-10T12:00:00.000Z`; compiles statically as `/sitemap.xml`.
- **[robots.ts](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/robots.ts):** Explicitly disallows administrative and API paths (`/admin/`, `/admin`, `/api/`), while exposing public discovery routes and referencing the sitemap.
- **Structured Data (Schema.org):** Preserved institutional `Organization` / NGO JSON-LD structured data in [layout.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/layout.tsx) and [about/page.tsx](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/about/page.tsx).

---

## 3. Verified Live SEO & Canonical Audit (`http://localhost:3000`)

The following values were directly observed from the live production server (`npm run start`) serving the compiled Next.js build (`32/32` routes):

| Route | Observed `<title>` | Observed Canonical URL | `<h1>` Count |
|---|---|---|---|
| `/` | `Mahaveer Educational & Charitable Trust (MECT) — Registered Public Charitable Trust • Odisha` | `https://mect.org.in` | `1` |
| `/about` | Verified unique institutional title | `https://mect.org.in/about` | `1` |
| `/governance` | Verified unique institutional title | `https://mect.org.in/governance` | `1` |
| `/statutory-disclosures` | Verified unique institutional title | `https://mect.org.in/statutory-disclosures` | `1` |
| `/programmes` | Verified unique institutional title | `https://mect.org.in/programmes` | `1` |
| `/csr-partnerships` | Verified unique institutional title | `https://mect.org.in/csr-partnerships` | `1` |
| `/donate` | Verified unique institutional title | `https://mect.org.in/donate` | `1` |
| `/impact` | Verified unique institutional title | `https://mect.org.in/impact` | `1` |
| `/reports` | Verified unique institutional title | `https://mect.org.in/reports` | `1` |
| `/contact` | Verified unique institutional title | `https://mect.org.in/contact` | `1` |
| `/faq` | Verified unique institutional title | `https://mect.org.in/faq` | `1` |
| `/scholarships` | Verified unique institutional title | `https://mect.org.in/scholarships` | `1` |
| `/volunteer` | Verified unique institutional title | `https://mect.org.in/volunteer` | `1` |

- **Build Compilation:** `/robots.txt` and `/sitemap.xml` built as static (`○`) routes in `next build --webpack` (`32/32` routes compiled cleanly).

---

## 4. Pending / Out-of-Scope Items

1. **Google Lighthouse SEO Score Verification:** Not executed in this local pass; recommended once DNS is pointed to production `https://mect.org.in`.
2. **Search Console & Bing Webmaster Submission:** Submit `https://mect.org.in/sitemap.xml` post-deployment.
3. **Structured Data Rich Results Test:** Validate `https://mect.org.in` via Google Rich Results Test after public launch.

