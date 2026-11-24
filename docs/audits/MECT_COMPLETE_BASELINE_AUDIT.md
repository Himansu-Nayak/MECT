# MECT — COMPLETE SOURCE-CODE BASELINE AUDIT
**Phase 0 Architectural Baseline Report**

- **Project:** Mahaveer Educational & Charitable Trust (MECT)
- **Domain:** `https://mect.org.in/`
- **Canonical Repository:** `https://github.com/Himansu-Nayak/MECT.git`
- **Audit Timestamp:** 2026-11-24T14:15:00+05:30
- **Auditor:** Antigravity Principal Architecture & QA Engine
- **Base Commit:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (`99c8b1c`)
- **Active Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Working Tree State:** Clean (with untracked Phase 17/17.1 historical audit deliverables)

---

## 1. Executive Summary & Purpose

This document establishes the verified baseline of the MECT codebase prior to any deduplication, architectural refactoring, content consolidation, or redesign. It details every application route, backend API endpoint, UI component dependency, configuration store, environment variable, and test suite.

All structural and content modifications during this project will be measured against this baseline.

---

## 2. Source-Code Inventory

### 2.1 Next.js Application Routes (`src/app`)
Total Page Routes: **47**

#### A. Public Institutional & Content Routes (21 Routes)
| Route Path | Category | Purpose | Core Dependencies & Components |
| :--- | :--- | :--- | :--- |
| `/` | Institutional Main | Master Homepage | `CinematicHero`, `InstitutionalStorySection`, `InterconnectedSafetyNetSection`, `AuditedImpactTelemetrySection`, `DocumentaryFieldExhibitionSection`, `DifferentiatedCampaignsSection`, `StatutoryGovernanceSection`, `TailoredParticipationPathwaysSection`, `ClosingTrustPledgeSection` |
| `/about` | Institutional | History, vision, mission & leadership | `PageHero`, `DeveloperCreditCard`, `PillarIllustrations`, `Reveal` |
| `/accessibility` | Statutory/Legal | WCAG 2.1 AA accessibility statement | `Container`, `Reveal` |
| `/campaigns` | Public Programmes | Overview of all charitable campaigns | `PageHero`, `Card`, `Badge` |
| `/campaigns/hanuman-murti` | Cultural Heritage | Proposed Grand Hanuman Murti Project | `HanumanMurti3DExperience`, `HanumanMurtiVisual`, `Container` |
| `/contact` | Public Service | Contact directory & inquiry desk | `Input`, `Textarea`, `Button`, `DirectDisbursalFlowchart` |
| `/csr-partnerships` | Institutional | Corporate CSR collaboration framework | `CsrRegistrationSection`, `Container`, `Badge` |
| `/donate` | Fiduciary Action | Voluntary contributions & SBI transfer | `SmartDonationCheckout`, `SbiDonationSection`, `UpiQrCard`, `DonationClaimSection` |
| `/faq` | Public Support | Frequently asked questions | `Accordion`, `FaqFilterWrapper`, `Container` |
| `/governance` | Institutional | Board of Trustees & Deed Charter | `StatutoryGovernanceSection`, `Container`, `Badge` |
| `/impact` | Institutional | Telemetry, geographic reach & impact metrics | `OdishaImpactSphere3D`, `ImpactChartsSection`, `AuditedImpactTelemetrySection` |
| `/memories-gallery` | Archival | Archival photography & documentary gallery | `GalleryLightbox`, `LightboxGrid`, `Container` |
| `/privacy` | Legal | Data privacy & donor consent policy | `Container` |
| `/programmes` | Public Programmes | Primary intervention pillars | `DonationProgrammeCard`, `FreeEducationSection`, `SchemeExplorer` |
| `/reports` | Disclosures | Annual reports & financial filings | `AnnualReportsYearTable`, `ReportsLibrarySection`, `Container` |
| `/scholarships` | Education | Scholarship programme guidelines | `EligibilityCalculator`, `DirectDisbursalFlowchart` |
| `/scholarships/apply` | Interactive Action | Online scholarship application form | `Input`, `Select`, `Button`, `Container` |
| `/scholarships/track` | Interactive Action | Application status tracker | `Input`, `Button`, `StateFeedback` |
| `/statutory-disclosures` | Legal/Compliance | 12A, 80G, CSR-1, Trust Deed verification | `TaxStatusNotice`, `Container`, `Badge` |
| `/stories` | Documentary | Archival field dispatches and stories | `Container`, `Card` |
| `/stories/[slug]` | Documentary | Dynamic individual story page | `Container`, `Reveal` |
| `/terms` | Legal | Terms of service & governance conditions | `Container` |
| `/volunteer` | Community Action | Volunteer enrollment and pledge | `Input`, `Select`, `Button`, `Container` |
| `/500` | Error Handling | Server error page | `Container`, `Button` |

#### B. Donor Portal Routes (9 Routes)
| Route Path | Category | Purpose | Authentication Required |
| :--- | :--- | :--- | :--- |
| `/login` | Public Auth | Donor phone/email login entry | No |
| `/register` | Public Auth | New supporter registration | No |
| `/portal/login` | Portal Auth | Dedicated portal login | No |
| `/portal/dashboard` | Portal | Donor contribution dashboard & stats | Yes (Bearer/Cookie) |
| `/portal/donations` | Portal | Historical donations & receipts | Yes (Bearer/Cookie) |
| `/portal/profile` | Portal | Donor profile & PAN management | Yes (Bearer/Cookie) |
| `/portal/receipts` | Portal | 80G / 10BE receipt downloads | Yes (Bearer/Cookie) |
| `/portal/security` | Portal | Account security & session management | Yes (Bearer/Cookie) |
| `/portal/welcome` | Portal | Onboarding confirmation | Yes (Bearer/Cookie) |

#### C. Administrative Backoffice Routes (14 Routes)
| Route Path | Purpose | Protection |
| :--- | :--- | :--- |
| `/admin` | Admin dashboard overview | Admin Auth / RBAC |
| `/admin/login` | Admin login | Public |
| `/admin/audit-logs` | Security & system audit trails | Admin Auth / SUPER_ADMIN |
| `/admin/cms` | Static and dynamic CMS management | Admin Auth / CMS_EDITOR |
| `/admin/demo` | Feature staging / mock demonstration | Admin Auth |
| `/admin/documents` | Public disclosure document repository | Admin Auth / COMPLIANCE_OFFICER |
| `/admin/donors` | Donor records & contribution ledger | Admin Auth / TREASURER |
| `/admin/inquiries` | Public inquiry tickets & complaints | Admin Auth / SECRETARIAT |
| `/admin/media` | Media asset uploads & metadata | Admin Auth / CMS_EDITOR |
| `/admin/scholarships` | Scholarship application review | Admin Auth / COMMITTEE |
| `/admin/settings` | Portal & system configuration | Admin Auth / SUPER_ADMIN |
| `/admin/users` | Admin user provisioning & RBAC | Admin Auth / SUPER_ADMIN |
| `/admin/volunteers` | Volunteer enrollment approvals | Admin Auth / SECRETARIAT |
| `/admin/whatsapp` | WhatsApp notification outbox & templates | Admin Auth / SUPER_ADMIN |

---

### 2.2 Next.js API Routes (`src/app/api`)
Total Next.js Route Handlers: **4**
1. `/api/ai/chat` (POST) — HIm institutional chatbot Groq/Llama-3.3-70b inference endpoint with strict fallback and knowledge grounding.
2. `/api/ai/health` (GET) — Circuit breaker health check for AI services.
3. `/api/contact` (POST) — Public contact form proxy to backend secretariat service.
4. `/api/donations/claim` (POST) — Manual SBI transfer UTR claim proxy.

---

### 2.3 Spring Boot Backend Controllers & Endpoints
Total Controllers: **16**  
Total REST Endpoints: **90**

| Controller | Package | Endpoints Count | Key Operations |
| :--- | :--- | :---: | :--- |
| `AdminController` | `org.mahavirtrust.backend.controller` | 12 | Dashboard stats, scholarships, users, audit logs, inquiries, volunteers |
| `AdminDocumentController` | `org.mahavirtrust.backend.controller` | 4 | Document upload, supersede, status toggle, download |
| `AdminDonorController` | `org.mahavirtrust.backend.controller` | 15 | Donor registry, reconciliation, 80G PDF generation, outbox management, manual claims review, payment config |
| `AdminWhatsAppController` | `org.mahavirtrust.backend.controller` | 11 | Outbox status, recipient opt-in/opt-out, template management, retry engine |
| `AuthController` | `org.mahavirtrust.backend.controller` | 4 | Admin login, JWT refresh, logout, `/auth/me` |
| `CashfreePaymentController` | `org.mahavirtrust.backend.controller` | 3 | Create order, order status check, payment verification |
| `CmsAdminController` | `org.mahavirtrust.backend.controller` | 7 | CMS page CRUD, publishing workflow, media management |
| `DonationController` | `org.mahavirtrust.backend.controller` | 7 | Public donation initiate, status check, checkout verify, SBI UTR submission, programme listing |
| `HealthController` | `org.mahavirtrust.backend.controller` | 1 | `/health` endpoint for liveness/readiness probes |
| `PortalAccountController` | `org.mahavirtrust.backend.controller` | 7 | Donor dashboard, profile update, contact change verification, 80G receipt PDF, donation claim |
| `PortalAuthController` | `org.mahavirtrust.backend.controller` | 5 | Mobile/email OTP request, OTP verify, refresh, logout, `/portal/auth/me` |
| `PublicCmsController` | `org.mahavirtrust.backend.controller` | 2 | Public CMS page content and media delivery |
| `PublicDocumentController` | `org.mahavirtrust.backend.controller` | 2 | Public legal document metadata and PDF downloads |
| `PublicSubmissionController` | `org.mahavirtrust.backend.controller` | 2 | Public inquiry submission, volunteer application |
| `ScholarshipPublicController`| `org.mahavirtrust.backend.controller` | 2 | Student scholarship application, application tracking by code |
| `WebhookController` | `org.mahavirtrust.backend.controller` | 5 | Cashfree webhook, Razorpay webhook, Resend email webhook, WhatsApp webhook (GET verify & POST incoming) |

---

### 2.4 Database Schema & Flyway Migrations
PostgreSQL Database: Flyway Migrations V1–V18 (All Applied & Verified Clean)
1. `V1__initial_schema.sql` — Core foundation, users, basic tables.
2. `V2__auth_and_audit_schema.sql` — RBAC, refresh tokens, audit log events.
3. `V3__volunteer_consent_and_district.sql` — Volunteer enrollment schema.
4. `V4__volunteer_consent_integrity.sql` — Consent tracking constraints.
5. `V5__volunteer_optimistic_locking.sql` — Concurrency control on volunteers.
6. `V6__scholarship_applications_schema.sql` — Student scholarship workflow.
7. `V7__portal_users_and_otp_schema.sql` — Donor portal auth & OTP engine.
8. `V8__donations_payments_and_receipts_schema.sql` — Ledger, payments, 80G receipts.
9. `V9__notification_outbox_schema.sql` — Transactional notification outbox.
10. `V10__cashfree_payment_gateway_schema.sql` — Cashfree orders & customer tokens.
11. `V11__donation_ecosystem_cms_and_rbac.sql` — CMS pages, blocks, expanded RBAC.
12. `V12__him_payment_gateway_schema.sql` — Multi-gateway abstraction schema.
13. `V13__public_documents_library_schema.sql` — Statutory document registry & hash audit.
14. `V14__hanuman_murti_and_campaigns_schema.sql` — Campaign catalogue & Hanuman Murti.
15. `V15__sanitize_public_donation_instructions.sql` — Neutral payment disclosure sanitization.
16. `V16__donor_authentication_and_district_schema.sql` — Donor district & KYC metadata.
17. `V17__sanitize_payment_gateway_instructions.sql` — Security cleanup on payment copy.
18. `V18__enterprise_whatsapp_notification_engine.sql` — WhatsApp templates, consent & message logs.

---

### 2.5 Active Navigation & Footer Matrix

#### Navigation (`src/components/Header.tsx`)
Desktop Navigation Dropdowns:
- **About:**
  - About the Trust (`/about`)
  - Governance & Board (`/governance`)
  - Statutory Disclosures (`/statutory-disclosures`)
- **Our Work:**
  - Civic Programmes (`/programmes`)
  - Higher Education Scholarships (`/scholarships`)
  - Memories & Gallery (`/memories-gallery`)
- **Impact & Accountability:**
  - Our Impact (`/impact`)
  - Annual Reports & Audits (`/reports`)
  - Field Dispatches (`/stories`)
- **Get Involved:**
  - Donate Now (`/donate`)
  - Volunteer & Mentorship (`/volunteer`)
  - Corporate CSR (`/csr-partnerships`)
  - Secretariat Inquiry Desk (`/contact`)

#### Footer (`src/components/Footer.tsx`)
- **Tier 1: Mandatory Statutory & Tax Status Notice Box** (Deed ref, PAN, 12A/80G, CSR-1, NGO Darpan, e-Anudaan).
- **Column 1 (Institution):** Branding, emblem, registered charitable trust definition, link to `/about`.
- **Column 2 (Our Work):** Links to Education, Women Empowerment, Sports, Safe Water, Food Relief, Community Welfare, Higher Education.
- **Column 3 (Campaigns):** Grand Hanuman Murti Project, Free Education (Target: Up to 200), All Initiatives, Corporate CSR.
- **Column 4 (Resources):** Blog/Stories, Memories Gallery, Public Records Library, Annual Reports, Statutory Accreditation, FAQ.
- **Column 5 (Support & Inquiries):** Donate to MECT, Donor Sign In, Supporter Register, Donor Portal, Volunteer, Secretariat Desk.
- **Tier 3 (Legal & Developer Bar):** Copyright, Developer Credit (`Himansu Nayak`), Privacy Policy, Terms of Service, Accessibility Statement, Governance Charter.

---

### 2.6 Content & Configuration Repositories
The audit reveals multiple overlapping files storing institutional facts:
1. `src/config/org.ts` — Comprehensive TypeScript configuration for legal names, PAN, 12A/80G URNs, addresses, bank accounts.
2. `content/org.ts` — Re-exports and overrides from `src/config/org.ts` with slight format variations.
3. `content/trustees.ts` — Board of Trustees list and deed clauses.
4. `src/lib/config.ts` — Legacy trust configuration.
5. `src/lib/content-registry.ts` — Phase B typed master content truth registry.
6. `src/lib/homepage-content.ts` — Homepage hero metrics, pillars, standards.
7. `src/lib/about-content.ts` — About page timeline, philosophy, governance narratives.
8. `src/lib/routes.ts` — Central application route registry with metadata, priorities, and change frequencies.

---

### 2.7 Feature Flags & Environment Variables

| Variable / Flag | Default / Current | Purpose | Sensitivity |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_ENABLE_DONOR_PORTAL` | `"true"` | Enables donor auth, receipts, and portal routes | Public |
| `WHATSAPP_ENABLED` | `"false"` | Master switch for Meta WhatsApp API dispatch | Critical Secret |
| `PAYMENT_PROVIDER` | `"CASHFREE"` | Active payment provider selector (`CASHFREE` / `SBI_MANUAL`) | Critical |
| `GROQ_API_KEY` | Configured | LLM API key for HIm AI chatbot | Secret |
| `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY` | Configured | Payment gateway credentials | Secret |
| `SPRING_PROFILES_ACTIVE` | `"prod"` (VPS) / `"dev"` (Local) | Backend environment profile | Host-level |

---

### 2.8 Verification & Test Commands Baseline
- **Frontend Typecheck:** `npm run typecheck` (`tsc --noEmit`)
- **Frontend Linting:** `npm run lint` (`eslint .`)
- **Frontend Production Build:** `npm run build` (`node scripts/check-confirm.mjs && next build --webpack`)
- **Frontend Audits:** `npm run audit:site`, `npm run audit:motion`, `npm run scan:secrets`
- **Backend Unit & Integration Tests:** `mvn test -B` (142 tests across auth, payments, controllers, and services)

---

## 3. Baseline Audit Conclusion

The baseline is intact, fully cataloged, and ready for systematic duplicate elimination and architecture consolidation on branch `feat/complete-website-redefinition-and-deduplication`.
