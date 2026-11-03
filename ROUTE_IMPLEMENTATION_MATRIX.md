# MAHAVIR TRUST — Route Implementation Matrix

**Document Reference**: `ROUTE_IMPLEMENTATION_MATRIX.md`  
**Author**: Principal Product Designer & Senior Frontend Architect  
**Target Environment**: Isolated Security Worktree (`.worktrees/security-patch`)  
**Git Branch**: `security/nextjs-patch-upgrade`  
**Date**: November 2, 2026  
**Implementation Phase**: Phase 2 — UX/UI Transformation  

---

## 1. Master Route Architecture & Implementation Status

```
Status Indicators:
[LIVE]       : Deployed and operational in codebase.
[TRANSFORMED]: Redesigned to meet Phase 2 Institutional Design System specifications.
[QUEUED]     : Fully specified in roadmap; queued for Phase 2.2 / 2.3 execution.
[PROPOSED]   : Long-term platform roadmap for Phase 2.4 / 2.5.
```

| Route Path | Page Title | User Persona & Intent | Key Components & Modules | Status | Priority Tier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`/`** | Institutional Homepage | Prospective scholars, educators, donors discovering the Trust mission and exploring grants. | Prestige Hero, Dual CTAs, Quick Eligibility Calculator, Scheme Explorer, Direct Disbursal Flowchart, Secretariat Desk Quote, Impact Indicators, Intake Forms. | **[TRANSFORMED]** | **Tier 1 (Immediate)** |
| **`/about`** | Heritage & Vision | Prospective partners and public inspecting foundational origin and philosophy. | PageHero, Heritage Narrative, Institutional Values Grid, Phase Roadmap Timeline, Executive Secretariat Message. | [LIVE] -> [QUEUED] | **Tier 2** |
| **`/governance`** | Board of Trustees & Fiduciary Charter | Regulators, trustees, donors inspecting fiduciary code and non-profit ethics. | PageHero, 3-Tier Committee Structure, Anti-Bribery & Zero-Cash Disbursal Policy, Grievance Redressal Desk, Downloadable Charter. | [LIVE] -> [QUEUED] | **Tier 2** |
| **`/scholarships`** | Scholarship Grants & Appraisal | Underprivileged undergraduate students seeking higher education fee support. | PageHero, Scheme Comparison Matrix, Dynamic Eligibility Rules Engine, Documentation Checklist, Application Stepper. | [LIVE] -> [QUEUED] | **Tier 2** |
| **`/programmes`** | Educational Programmes | Educational institutions and students exploring learning hubs and mentorship. | PageHero, Project Samarth Hub Directory, Mentorship Circle Details, Hardship Relief Scope, District Cluster Map. | [LIVE] -> [QUEUED] | **Tier 2** |
| **`/impact`** | Community Impact & Outreach | Philanthropic observers and researchers examining geographic reach in Odisha. | PageHero, 30-District Odisha Heatmap, Gross Enrollment Context, 3 Scholar Journey Archetypes, Auditable Metrics. | [LIVE] -> [QUEUED] | **Tier 2** |
| **`/volunteer`** | Volunteer & Mentorship Network | University professors, engineers, professionals looking to mentor scholars. | PageHero, Mentor Role Descriptions, 4-Step Onboarding Roadmap, Commitment Calculator, Grouped Registration Form. | [LIVE] -> [QUEUED] | **Tier 3** |
| **`/contact`** | Administrative Secretariat Desk | Students, college administrators, and donors initiating correspondence. | PageHero, Context-Adaptive Inquiry Form, Department Cards, District Office Directory, Statutory Status Card. | [LIVE] -> [QUEUED] | **Tier 3** |
| **`/faq`** | Frequently Asked Questions | Students and parents seeking rapid clarification on eligibility and disbursals. | PageHero, Real-Time Keyword Filter, Category Tabs, Expandable Accordions, Inquiry Desk Escalation Card. | [LIVE] -> [QUEUED] | **Tier 3** |
| **`/accessibility`** | Accessibility Statement | Users with assistive technology checking WCAG 2.2 AA conformance. | PageHero, WCAG 2.2 AA Conformance Checklist, Screen Reader Guides, High-Contrast Palette Guide, Feedback Desk. | [LIVE] -> [QUEUED] | **Tier 3** |
| **`/privacy`** | Privacy & Data Protection | Applicants and volunteers inspecting data retention and protection policies. | PageHero, Sticky Section TOC, DPDP Act 2023 Compliance, Student Record Retention, Cookie & Storage Disclosures. | [LIVE] -> [QUEUED] | **Tier 3** |
| **`/terms`** | Institutional Terms of Use | General visitors reading website legal conditions. | PageHero, Sticky Section TOC, Non-Profit Charitable Use Terms, Intellectual Property Notice, Dispute Jurisdiction (Bhubaneswar). | [LIVE] -> [QUEUED] | **Tier 3** |

---

## 2. Planned Extensions & Platform Additions

| Planned Route | Module Description | Target Persona | Backend API Requirements | Implementation Phase |
| :--- | :--- | :--- | :--- | :--- |
| **`/reports`** | Institutional Financial & Audit Reports | Donors, Chartered Accountants, Regulators | Public audited balance sheet PDFs, Annual Activity Reports, Form 10B/10BB. | Phase 2.3 |
| **`/gallery`** | Academic Campus & Scholar Gallery | Public, Students, Media | High-resolution curated event imagery, student mentorship sessions, library hub openings. | Phase 2.3 |
| **`/notices`** | Official Gazette & Public Announcements | Students, College Bursars, Media | Public notification feed, application window deadlines, scrutiny committee circulars. | Phase 2.3 |
| **`/publications`** | Research & Institutional Monographs | Educational researchers, policy makers | Whitepapers on rural education retention in Odisha, scholar demographic monographs. | Phase 2.3 |
| **`/portal/login`** | Student & Applicant Authentication Desk | Enrolled scholars and prospective applicants | `POST /api/v1/auth/login`, JWT access token, refresh token handling. | Phase 2.4 |
| **`/portal/apply`** | Multi-Step Scholarship Application Engine | Verified student applicants | `POST /api/v1/scholarships/apply`, multi-part document upload (`/api/v1/documents/upload`). | Phase 2.4 |
| **`/portal/status`** | Real-Time Application Tracking Dashboard | Submitted applicants | `GET /api/v1/scholarships/tracking/{refNumber}`, live status timeline. | Phase 2.4 |
| **`/admin/*`** | Institutional Administrative Platform | Trustees, Reviewers, Administrators | Spring Security RBAC endpoints: `/api/v1/admin/users`, `/api/v1/admin/audit-logs`, `/api/v1/admin/inquiries`. | Phase 2.5 |

---

## 3. SEO, Metadata & Schema Markup Matrix

| Route | Primary SEO Title | Canonical Slug | Target OpenGraph Image | JSON-LD Schema Type |
| :--- | :--- | :--- | :--- | :--- |
| `/` | MAHAVIR TRUST — Education, Scholarships & Community Leadership (Odisha) | `/` | `/og-home.jpg` | `EducationalOrganization`, `NGO`, `WebSite` |
| `/about` | Heritage & Mission Charter — MAHAVIR TRUST | `/about` | `/og-about.jpg` | `AboutPage`, `Organization` |
| `/governance` | Institutional Governance & Fiduciary Charter — MAHAVIR TRUST | `/governance` | `/og-governance.jpg` | `GovernmentPermit` / `Organization` |
| `/scholarships` | Higher Education Scholarships & Grants — MAHAVIR TRUST | `/scholarships` | `/og-scholarships.jpg` | `GovernmentService` / `FinancialProduct` |
| `/programmes` | Educational Programmes & Study Hubs — MAHAVIR TRUST | `/programmes` | `/og-programmes.jpg` | `EducationalOccupationalProgram` |
| `/impact` | Community Impact Across 30 Odisha Districts — MAHAVIR TRUST | `/impact` | `/og-impact.jpg` | `Dataset`, `SocialMediaPosting` |
| `/volunteer` | Academic & Career Mentorship Network — MAHAVIR TRUST | `/volunteer` | `/og-volunteer.jpg` | `VolunteerAction` |
| `/contact` | Contact Secretariat Desk — MAHAVIR TRUST | `/contact` | `/og-contact.jpg` | `ContactPage`, `Place` |
| `/faq` | Frequently Asked Questions & Guidelines — MAHAVIR TRUST | `/faq` | `/og-faq.jpg` | `FAQPage` |

---

## 4. Verification & Testing Protocol

Every route in the matrix must adhere to four immutable criteria prior to sign-off:
1. **0 TypeScript Errors**: Verified via `npx tsc --noEmit`.
2. **0 Build Warnings**: Verified via `npm run build` (Static Page Prerendering).
3. **Responsive Stability**: Manually and visually validated across 360px, 390px, 768px, 1024px, 1440px, and 1920px viewports.
4. **Backend Contract Integrity**: Form submissions must correctly post to Spring Boot `/api/v1/public/*` endpoints, handle rate-limiting (429), duplicate rejection, and return verified reference identifiers without console errors.
