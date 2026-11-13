# MECT PHASE 17 — SEARCH ENGINE OPTIMISATION (SEO) AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Production URL:** https://mect.org.in/  
**Repository:** MAHAVIR-TRUST  
**Canonical Domain:** `https://mect.org.in`  
**Date:** 2026-11-13  
**Status:** PASS (100% Unique Metadata, 0 Canonical Mismatches, 0 Title Duplicates)

---

## 1. Executive Summary

Search Engine Optimisation for the MECT platform has been architected to maximize institutional discoverability across local, national, and philanthropic searches. 

All 33 routes feature bespoke `<title>` tags, high-CTR meta descriptions (120–160 characters), canonical URL alternates, OpenGraph protocol cards, Twitter summary tags, semantic `<h1>`–`<h3>` hierarchies, and schema.org JSON-LD microdata.

---

## 2. Global Technical SEO Infrastructure

| SEO Feature | Implementation Details | Verification Status |
| :--- | :--- | :--- |
| **Robots.txt** | Generated dynamically at `/robots.txt` via Next.js metadata API. Allows all public crawlers; disallows `/admin/` and `/portal/api/`. | VERIFIED (HTTP 200) |
| **XML Sitemap** | Generated dynamically at `/sitemap.xml`. Lists all 18 indexable public routes with accurate `<lastmod>` timestamps and priority values (`1.0` for Home, `0.9` for Donate, `0.8` for Programmes/About). | VERIFIED (HTTP 200, 18 routes discovered) |
| **Canonical URLs** | Self-referencing absolute canonical URLs pointing exclusively to `https://mect.org.in/` domain across every single route. | VERIFIED (`CANONICAL_MISMATCH: 0`) |
| **OpenGraph Cards** | All pages render `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale` (`en_IN`), and high-resolution `og:image` (1200×630px). | VERIFIED (`MISSING_OG_IMAGE: 0`) |
| **Heading Structure** | Strict semantic hierarchy. Exactly ONE `<h1>` element per route. Zero multiple `<h1>` occurrences. | VERIFIED (`MULTIPLE_H1: 0`) |

---

## 3. Schema.org JSON-LD Structured Data

High-fidelity linked data is embedded directly into the document `<head>`:

1. **`NGO` / `CharitableOrganization` Schema (`src/app/layout.tsx`):**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "NGO",
     "name": "Mahaveer Educational & Charitable Trust",
     "alternateName": ["MECT", "Mahaveer Trust"],
     "url": "https://mect.org.in",
     "logo": "https://mect.org.in/images/branding/mect-logo.png",
     "taxID": "AAATM4173N",
     "address": {
       "@type": "PostalAddress",
       "streetAddress": "Palace Road, Near Rugudipada",
       "addressLocality": "Balangir",
       "addressRegion": "Odisha",
       "postalCode": "767001",
       "addressCountry": "IN"
     },
     "contactPoint": [
       {
         "@type": "ContactPoint",
         "telephone": "+91-6652-230456",
         "contactType": "general inquiries",
         "areaServed": "IN"
       }
     ]
   }
   ```

2. **BreadcrumbList Schema:** Applied across all sub-pages for rich SERP breadcrumb rendering.
3. **FAQPage Schema (`src/app/faq/page.tsx`):** Structured Q&A pairs for direct Google SERP featured snippet qualification.

---

## 4. Local SEO Focus: Odisha, Balangir & Bhubaneswar

Targeted geographic keyword signals are naturally woven throughout the site copy:
- *Target Keywords:* "Nonprofit in Balangir Odisha", "Charitable Trust Bhubaneswar", "80G Donation Odisha", "Educational Scholarships Western Odisha", "Women Livelihood NGO Odisha".
- *Statutory Ticker & Footer:* Prominently display dual operating headquarters:
  - **Registered Office:** Balangir, Western Odisha.
  - **Corporate Liaison:** Bhubaneswar, Odisha.

---

## 5. Automated Site Audit Verification Results

The automated audit runner (`npm run audit:site`) confirmed zero SEO defects:
- `MISSING_OR_DUPLICATE_TITLE`: **0 Failures**
- `MISSING_META_DESCRIPTION`: **0 Failures**
- `MISSING_OG_IMAGE`: **0 Failures**
- `CANONICAL_MISMATCH`: **0 Failures**
- `MULTIPLE_H1`: **0 Failures**

