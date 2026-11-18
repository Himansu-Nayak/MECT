# MECT — INFORMATION ARCHITECTURE & DUPLICATE CLEANUP REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository Branch:** `feat/brand-storytelling-transformation`  
**Classification:** Information Architecture, Route Classification & Duplicate Purge Audit  
**Effective Date:** 2026-11-18  

---

## 1. Information Architecture Overhaul Summary

To eliminate visitor confusion, redundant pages, and cognitive clutter, the complete MECT digital surface was audited and restructured:

1. **Homepage Streamlined:** Reduced from an overwhelming 9 sections to **7 high-impact, narrative-driven sections**.
2. **Obsolete Components Purged:** Permanently removed **9 legacy section components** totaling **112.5 KB** of unused code from `src/components/sections/`.
3. **Consolidated Narrative Routes:** Merged `/stories` (Field Dispatches) into `/memories-gallery#field-dispatches` with 308 permanent redirect safeguards in `next.config.ts`.
4. **All Canonical Routes Indexed:** Updated `src/app/sitemap.ts` to include `/memories-gallery` and `/campaigns/hanuman-murti`.
5. **Protected Administrative & Functional Systems:** 100% preservation of donor login, payment webhooks, admin panels, and statutory downloads.

---

## 2. Complete Public Route Classification & Inventory

| Route | Classification | Post-Transformation Action | Canonical Purpose |
|---|---|---|---|
| `/` | Essential | **Streamlined to 7 Sections** | Master Institutional Homepage (Discover → Understand → Differentiate → Believe → Trust → Connect → Act) |
| `/about` | Essential | **Enriched with Operating Sequence** | Institutional history, leadership, founding trustees, and 4-step execution sequence |
| `/governance` | Essential Standalone | **Preserved** | 2013 Trust Deed, managing trustee, and honorary fiduciary code |
| `/statutory-disclosures` | Statutory Standalone | **Preserved** | 12A, 80G, CSR-1, NGO Darpan, MoSJE filings and official certificates |
| `/programmes` | Essential Standalone | **Preserved & Structured** | 5 core pillars + Higher Education Target (up to 200 students) |
| `/scholarships` | Essential Standalone | **Preserved** | Higher education scholarship scheme directory |
| `/scholarships/apply` | Protected Functional | **Preserved** | Multi-stage scholarship application intake portal |
| `/scholarships/track` | Protected Functional | **Preserved** | Application tracking & verification status engine |
| `/impact` | Essential Standalone | **Enriched with 3D Reach Sphere** | Verified metrics, telemetry definitions, methodology, and interactive 3D Odisha map |
| `/reports` | Statutory Standalone | **Preserved** | Audited financial statements, activity summaries, downloadable PDFs |
| `/memories-gallery` | **Consolidated Canonical** | **Unified Exhibition & Dispatches** | Archival photo exhibition with lightbox modal + integrated written field dispatches (`#field-dispatches`) |
| `/stories` | **Duplicate Route** | **Permanent 308 Redirect** | Redirects to `/memories-gallery#field-dispatches` with query/anchor preservation |
| `/campaigns` | Essential Directory | **Preserved** | Strategic campaigns hub |
| `/campaigns/hanuman-murti` | Priority Campaign | **Enriched with 3D Preview** | The Grand Hanuman Murti Project with interactive WebGL orbit inspection |
| `/donate` | Protected Financial | **Preserved & Hardened** | Cashfree online checkout, custom amounts, dedicated project ledgers |
| `/volunteer` | Essential Standalone | **Preserved** | Volunteer fellowship registration & child safeguarding charter |
| `/csr-partnerships` | Corporate Standalone | **Preserved** | Schedule VII corporate partnership proposals & MCA CSR-1 credentials |
| `/contact` | Essential Standalone | **Preserved** | Registered Balangir office, Bhubaneswar liaison desk, direct telephone |
| `/faq` | Essential Standalone | **Preserved** | Searchable institutional, tax, scholarship, and donation FAQ |
| `/accessibility` | Accessibility Compliance | **Preserved** | WCAG 2.2 AA accessibility commitment & keyboard navigation features |
| `/privacy` | Legal / Statutory | **Preserved** | Privacy policy & DPDP Act compliance |
| `/terms` | Legal / Statutory | **Preserved** | Terms of service and regulatory terms |

---

## 3. Permanently Purged Legacy Section Components (112.5 KB Deleted)

The following 9 dead components had zero external imports across the entire codebase and were cleanly deleted:

```
[DELETED] src/components/sections/CompactAboutSection.tsx          (112 B)
[DELETED] src/components/sections/CompactTrustStrip.tsx             (2.8 KB)
[DELETED] src/components/sections/DevelopmentPillarsSection.tsx     (23.3 KB)
[DELETED] src/components/sections/HanumanMurtiSpotlightSection.tsx   (7.1 KB)
[DELETED] src/components/sections/HowMectWorksSection.tsx           (24.8 KB)
[DELETED] src/components/sections/InstitutionalImpactSection.tsx    (22.3 KB)
[DELETED] src/components/sections/InstitutionalIntroSection.tsx     (12.8 KB)
[DELETED] src/components/sections/SmileFundraisingSection.tsx        (6.0 KB)
[DELETED] src/components/sections/StoriesRailSection.tsx            (13.3 KB)
-----------------------------------------------------------------------------
TOTAL PURGED: 9 files / 112,504 bytes
```

---

## 4. Redirect Configuration in `next.config.ts`

```typescript
async redirects() {
  return [
    {
      source: "/stories",
      destination: "/memories-gallery#field-dispatches",
      permanent: true,
    },
    {
      source: "/gallery",
      destination: "/memories-gallery",
      permanent: true,
    },
    {
      source: "/memories",
      destination: "/memories-gallery",
      permanent: true,
    },
  ];
}
```
