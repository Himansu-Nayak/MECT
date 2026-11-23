# README Implementation Progress & State

## Checklist
- [x] 01 DISCOVERY-A: Map the repo: walk every top-level folder (src, public, backend, mect-ai-engine, ai-training, scratch) 3 levels deep. Identify each module's language, framework, manifest, entry point. Fill Module Map.
- [x] 02 DISCOVERY-B: Frontend deep-dive: list every route under src/app (or pages), layouts, key components, data fetching, AI gateway route handlers, middleware, security headers in next.config.ts, i18n, accessibility features, SEO. Fill Routes registry.
- [x] 03 DISCOVERY-C: Backend deep-dive: framework, DB, migrations, auth model, every endpoint under /api/v1, config files, how to start it, default port, required env/secrets. Fill Routes/API and Env registries.
- [x] 04 DISCOVERY-D: AI engine + training deep-dive: model(s), serving framework, endpoints (/v1/chat/completions, /v1/health), auth via INTERNAL_AI_SECRET, hardware needs, how to run, fallback logic and exact AI_ENGINE_MODE values supported. Describe ai-training: data, scripts, outputs.
- [ ] 05 DISCOVERY-E: Read every root .md report/spec; extract: product purpose, user roles, volunteer module scope, security findings and their resolution status, design tokens, roadmap phases. Determine what MECT stands for. Fill Findings.
- [ ] 06 HEADER: Hero, badges (verify each is true), anchor nav, italic disclaimer, one-paragraph "what is this" (2–3 sentences max).
- [ ] 07 FEATURES: Reference-style nested bullets grouped: public website, volunteer module, AI assistant (local-first + cloud fallback, reliability behaviors actually implemented), security, accessibility/responsive design, performance. Only implemented features; mark planned ones in a separate "Roadmap" bullet linking the roadmap docs.
- [ ] 08 SCREENSHOTS: Insert real images or TODO placeholders with captions; update Screenshots Needed.
- [ ] 09 QUICK START: Prerequisites table (Node, Python, Java, GPU/RAM). Steps: clone → install each module → copy .env.example to .env.local (macOS/Linux & Windows) → start backend → start AI engine → npm run dev → verify. Include "Minimal mode" and "Full local mode".
- [ ] 10 ARCHITECTURE: Mermaid diagram (browser → Next.js → API routes → backend :8080 and → AI gateway → local engine :8082 → Groq fallback), request-flow numbered list, repository-layout tree with one-line comments per folder.
- [ ] 11 CONFIGURATION: Complete env var table from registry (name, service, required, default, example placeholder, description), AI Engine Modes table, secret-handling rules.
- [ ] 12 MODULE REFERENCE: Tables: npm scripts; backend commands; AI engine commands; API routes; key directories.
- [ ] 13 DOCS INDEX: Table of every root .md: file | what it covers | status (spec / audit / report / roadmap).
- [ ] 14 SECURITY & PRIVACY: Summarize real controls (internal secret, server-only keys, headers, input validation, volunteer PII handling). Link audits. Add "Reporting a vulnerability".
- [ ] 15 MANAGE: Update/rebuild, health checks, logs, troubleshooting table (symptom → cause → fix), "Clean up" with Removes / Keeps lists.
- [ ] 16 CONTRIBUTING + LINKS + LICENSE: Branching conventions, lint command, AGENTS.md rule, bug-report checklist, links to Issues/PRs, License/TODO.
- [ ] 17 POLISH: Consistent terminology, no duplicate sections, heading levels, table alignment, first screen compelling and accurate.
- [ ] 18 VERIFY: Run verification suite Part 5.

---

## Findings

### Project Identity & Purpose
- **Full Legal Name:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST).
- **Deed Registration:** Book No. 4, Volume No. 45, Document Deed No. `40311302194` (Date of Deed: 27-07-2013, Registered: 30-07-2013, Balangir District Sub-Registrar, Odisha).
- **Settler Founder & Managing Trustee:** Er. Japabandhu Kampa.
- **Founding Life Trustees:** Yudhisthir Rana, Ramachandra Biswal, Sambit Kumar Dang.
- **Deed Clause XVI:** Honorary unremunerated trustee governance.
- **Official Statutory Accreditations:**
  - PAN: `AADTM5474F`
  - Income Tax Section 12A URN: `AADTM5474FE20231` (Form 10AC, Date: 29-01-2024, Valid AY 2024-25 to 2026-27)
  - Income Tax Section 80G URN: `AADTM5474FF20241` (Form 10AC, Date: 29-01-2024, 50% Tax Deduction, Valid AY 2024-25 to 2026-27)
  - MCA CSR-1 Reg: `CSR00081063` (Approved 09-11-2024, ROC-Delhi, SRN-N14617237)
  - NITI Aayog NGO Darpan: `OR/2024/0466491`
  - MoSJE e-Anudaan: `OR/00040466`
- **Headquarters:**
  - Registered Office: Near Sai Mandir, Rugudipara, Balangir - 767001, Odisha (Phone: `+91 94371 23616`).
  - Corporate & Liaison Secretariat: A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar - 751014, Odisha (Phone: `+91 94371 23616` / `+91 94373 53616`).
- **Core Product Functions:**
  - 100% direct-to-college tuition fee grant disbursements (zero-cash policy).
  - 4 verified ground operational pillars: Remedial Education (Balangir/Puintala for 350+ students), Women's Vocational Tailoring (120+ women trained), Jal Seva Heatwave Relief (10,000+ citizens served), and Jan Ahar Hospital Nutrition.
  - Public statutory compliance vault and annual financial reports archive.
  - Autonomous self-hosted multilingual AI assistant ("HIm") with local Qdrant RAG and Groq hot-standby cloud fallback.

---

### Frontend Architecture & Capabilities (DISCOVERY-B)
- **Framework & Config:** Next.js 16.4.3 App Router with React 19.3.0 and TypeScript 5.7.0 (`next.config.ts`). Uses Turbopack for compilation and `next build --webpack` for Webpack fallback.
- **Security Headers (`next.config.ts`):** Enforces HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY` (clickjacking protection), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **AI Gateway Route Handlers (`src/app/api/ai/`):**
  - `POST /api/ai/chat`: Dual-routing streaming proxy with IP-based rate limiting (20 req/min/IP with Cloudflare `cf-connecting-ip` and `x-forwarded-for` extraction). Integrates resilient circuit breaker (`aiGatewayCircuitBreaker`) with 3.5s connection timeout, 60s cooldown after 3 consecutive local engine failures, and automatic streaming fallback to Groq Cloud (`createGroqChatStream`). Propagates client abort signals to prevent orphan upstream connections.
  - `GET /api/ai/health`: Real-time health diagnostic checking local engine loopback connectivity (800ms probe) and Groq cloud API key presence.
- **Client-Side Data Fetching (`src/lib/api.ts`):** Type-safe fetch client for public inquiries, volunteer registrations, scholarship submissions, real-time application tracking, and JWT-authenticated administrative actions.
- **SEO & Search Console Verification:**
  - `public/google4eacd3ee074d0174.html`: Google site verification token.
  - `src/app/sitemap.ts`: Dynamic XML sitemap indexing all 13 primary institutional routes with prioritized weighting (0.4 to 1.0).
  - `src/app/robots.ts`: Robot crawl directives allowing public pages while disallowing `/admin/` and `/api/`.
  - `src/app/layout.tsx`: Comprehensive Schema.org JSON-LD `NGO` microdata embedding Trust Deed, PAN, 12A, 80G, CSR-1, NGO Darpan, and OpenGraph/Twitter cards.
- **Accessibility & Inclusive Design:**
  - WCAG 2.2 AA compliant skip-to-content anchor (`#main-content`).
  - High-contrast institutional color palette: Option A Heritage Tokens (Forest `#16221D`, Terracotta `#C45A3C`, Sand `#E5C499`, Cream `#FAF7F2`).
  - Motion sensitivity handling using `useReducedMotion()` from `motion/react`.
  - Accessible form validation with `aria-live="assertive"`, `role="alert"`, and explicit field labels.
- **Multilingual Support (i18n):**
  - HIm AI Assistant natively supports English (`en`), Odia (`or`), and Hindi (`hi`).

---

### Backend Architecture & Capabilities (DISCOVERY-C)
- **Framework & Runtime:** Java 21 LTS with Spring Boot 4.1.1 (`backend/pom.xml`). Context path: `/api/v1`, default port: `8080`.
- **Database & Persistence:** PostgreSQL with Spring Data JPA and Hibernate (`ddl-auto: validate`). HikariCP connection pool (max 10, min idle 2, connection timeout 20s). UTC timezone enforced.
- **Database Migrations (Flyway V1–V18):**
  - `V1`: Core schema (users, roles, permissions).
  - `V2`: Auth tokens, session invalidation, and immutable audit logging.
  - `V3`–`V5`: Volunteer consent, 30-district assignment, and optimistic locking (`@Version`).
  - `V6`: Scholarship application lifecycle (intake, scrutiny, disbursals).
  - `V7`: Passwordless OTP authentication, portal users, salted pepper hashing.
  - `V8`: Donations, payments, and 80G tax receipt registers.
  - `V9`: Outbox pattern for transactional notifications.
  - `V10`: Cashfree Payment Gateway v2023-08-01 schema and webhook tracking.
  - `V11`: Donation ecosystem CMS and fine-grained RBAC roles.
  - `V12`: HIm Payment Gateway ledger schemas.
  - `V13`: Public and institutional document repository metadata.
  - `V14`: Special campaigns (Hanuman Murti 80–100 Ft civic project).
  - `V15` & `V17`: Public payment instruction sanitization and security policies.
  - `V16`: Donor profile authentication and district mapping.
  - `V18`: Enterprise Meta WhatsApp Cloud API notification engine and delivery outbox.
- **Security & Authentication Architecture (`SecurityConfig.java`):**
  - Stateless REST architecture (`csrf.disable()`, `SessionCreationPolicy.STATELESS`).
  - Dual Authentication Models:
    1. **Administrative Staff (JWT):** Bearer token authentication with HS256 (256-bit secret), 15-minute access token validity (`JWT_ACCESS_VALIDITY`), 7-day refresh token validity (`JWT_REFRESH_VALIDITY`), and BCrypt password encryption (strength 12).
    2. **Public Donor Portal (OTP):** Passwordless 6-digit OTP delivery (Email via Resend or SMS via Twilio/MSG91), 10-minute expiry (`OTP_EXPIRY_SECONDS: 600`), 60s resend cooldown, 5 maximum failed attempts, and HMAC-SHA256 salted pepper hashing (`OTP_HASH_PEPPER`).
  - Role-Based Access Control (RBAC): `SUPER_ADMIN`, `TRUSTEE`, `ADMIN`, `APPLICATION_REVIEWER`, `FINANCE_OFFICER`, `VOLUNTEER_COORDINATOR`, `CONTENT_ADMIN`, `DONATION_VERIFICATION_OFFICER`, `SUPPORT_ADMIN`, `AUDITOR`, `DONOR`, `GENERAL_USER`.
  - Rate Limiting: `RateLimitingFilter` enforcing IP-based sliding window request caps before authentication.
  - Webhook Security: Cryptographic HMAC signature verification for Cashfree, Razorpay, Resend (Svix), and Meta WhatsApp (`X-Hub-Signature-256`).

---

### AI Engine & Multilingual Training Architecture (DISCOVERY-D)
- **Serving Framework & Process:** Python 3.12+ with FastAPI and Uvicorn (`mect-ai-engine/app/main.py`), managed as a dedicated systemd service (`mect-ai-engine.service`) on loopback port `8082`.
- **System Isolation & Cgroups (Hostinger VPS KVM 4):**
  - `MemoryMax=3.8G`, `MemoryHigh=3.2G`, `CPUQuota=250%`, `Nice=5`.
  - Guarantees complete RAM and CPU protection for co-hosted production services (Node.js port 3000, Spring Boot port 8080, PostgreSQL port 5432).
- **Authentication:** Constant-time bearer token validation via `INTERNAL_AI_SECRET` (fails closed if unconfigured or `< 16` characters; zero hardcoded bypasses).
- **Vector Retrieval-Augmented Generation (RAG):**
  - Vector Database: Qdrant standalone instance listening on `http://127.0.0.1:6333` (Collection: `mect_knowledge_v1`).
  - FastEmbed dense vector embeddings indexing institutional charters, Trust Deed clauses, 12A/80G orders, and verified field programme outputs.
- **Inference Engine & Model Weights:**
  - Local Engine: `llama-cpp-python` with GGUF 4-bit quantized weights (`models/qwen2.5-3b-mect-q4_k_m.gguf`, fallback `models/qwen2.5-1.5b-instruct-q4_k_m.gguf`).
  - Concurrency Limiter: Asynchronous semaphore (`MAX_CONCURRENT_INFERENCES`) with queue timeout and client disconnect detection (`request.is_disconnected()`) to abort orphan inference jobs.
  - Cloud Fallback: Resilient failover to Groq Cloud API (`GROQ_MODEL=qwen/qwen3.8-27b`) triggered via Next.js circuit breaker when local engine latency exceeds 3.5s or capacity saturates.
- **Multilingual Fine-Tuning Pipeline (`ai-training/`):**
  - Dataset: 1,200 curated, audited institutional QA dialogues across 3 languages: English (480), Odia (420), and Hindi (300).
  - Splits: 960 train / 120 validation / 120 test (`ai-training/data/`).
  - Categories: Direct disbursal zero-cash policy, 80G tax rules, academic scholarship criteria, 30-district Odisha scope, and adversarial jailbreak defenses.
  - Training Script: `ai-training/notebooks/train_him_qwen_qlora.py` and Colab notebook using Unsloth / PEFT QLoRA.

---

## Module Map

| Folder | Purpose | Language & Stack | Manifest | Entry Point | Run Command | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `src/` | Next.js frontend application & AI proxy gateway | TypeScript 5.7, React 19.3, Next.js 16.4.3 (App Router, Turbopack), Tailwind CSS v4 | `package.json` | `src/app/layout.tsx`, `src/app/page.tsx` | `npm run dev` (port 3000) | `package.json#L1-L31`, `src/app/layout.tsx` |
| `backend/` | Institutional REST API backend & DB persistence | Java 21, Spring Boot 4.1.1, Spring Security, JPA/Hibernate, PostgreSQL, Flyway | `backend/pom.xml` | `org.mahavirtrust.backend.MahavirTrustBackendApplication` | `mvn spring-boot:run` (port 8080, context `/api/v1`) | `backend/pom.xml#L1-L127`, `application.yml#L1-L5` |
| `mect-ai-engine/` | Autonomous Python inference & RAG vector search engine (HIm) | Python 3.12+, FastAPI, Uvicorn, llama-cpp-python, Qdrant Client, FastEmbed | `mect-ai-engine/requirements.txt` | `mect-ai-engine/app/main.py` | `uvicorn app.main:app --host 127.0.0.1 --port 8082` | `mect-ai-engine/requirements.txt#L1-L11`, `app/main.py` |
| `ai-training/` | Dataset generation, evaluation splits & Qwen2.5 QLoRA fine-tuning scripts | Python 3.10+, Node.js ESM, PyTorch, Transformers, PEFT/QLoRA | Script files | `ai-training/scripts/generate_dataset.mjs`, `train_him_qwen_qlora.py` | `node ai-training/scripts/generate_dataset.mjs` | `ai-training/scripts/generate_dataset.mjs#L1-L50` |
| `public/` | Static domain verification assets, images, & icons | HTML, Web Assets, WebP/JPEG | Filesystem | `public/google4eacd3ee074d0174.html` | Served statically by Next.js at `/` | `public/images/leadership/er-japabandhu-kampa.webp` |
| `scratch/` | Comprehensive automated test suites across all development phases | Node.js ESM (`node:assert`, `node:fs`, `node:child_process`) | Test runner | `scratch/test-all-phases-regression.mjs` | `node scratch/test-all-phases-regression.mjs` | `scratch/test-all-phases-regression.mjs#L1-L40` |

---

## Routes/API Registry

### 1. Next.js Internal Routes & API Handlers
| Route / Path | Type / Method | Source File | Auth / Access | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Page (Static) | `src/app/page.tsx` | Public | Master Institutional Homepage (Hero, 4 pillars, Trustee desk, CSR, 80G) |
| `/about` | Page (Static) | `src/app/about/page.tsx` | Public | Institutional heritage, founding vision, 12+ years service, governance tiers |
| `/accessibility` | Page (Static) | `src/app/accessibility/page.tsx` | Public | WCAG 2.2 AA accessibility policy and standards |
| `/contact` | Page (Static) | `src/app/contact/page.tsx` | Public | Dual-office locator (Balangir & Bhubaneswar), official phone, 3-tier grievance desk |
| `/csr-partnerships` | Page (Static) | `src/app/csr-partnerships/page.tsx` | Public | Corporate CSR gateway under MCA CSR-1 Reg `CSR00081063` (Schedule VII) |
| `/donate` | Page (Static) | `src/app/donate/page.tsx` | Public | 80G 50% tax deduction calculator, Union Bank of India Balangir details, donor KYC |
| `/faq` | Page (Static) | `src/app/faq/page.tsx` | Public | Comprehensive institutional, scholarship, and donor questions |
| `/governance` | Page (Static) | `src/app/governance/page.tsx` | Public | Registered Trust Deed No. 40311302194, Board of Trustees, Clause XVI honorary governance |
| `/impact` | Page (Static) | `src/app/impact/page.tsx` | Public | Ground metric counters (350+ remedial, 120+ tailoring, 10,000+ water), case studies |
| `/privacy` | Page (Static) | `src/app/privacy/page.tsx` | Public | DPDPA data privacy policy, student record confidentiality |
| `/programmes` | Page (Static) | `src/app/programmes/page.tsx` | Public | Deep-dive into 4 operational pillars and statewide higher education expansion |
| `/reports` | Page (Static) | `src/app/reports/page.tsx` | Public | Audited financial statements and certified annual reports (FY 2021-22 to 2023-24) |
| `/scholarships` | Page (Static) | `src/app/scholarships/page.tsx` | Public | Higher education tuition grant schemes overview |
| `/scholarships/apply`| Page (Static) | `src/app/scholarships/apply/page.tsx` | Public | Multi-step student scholarship application intake |
| `/scholarships/track`| Page (Static) | `src/app/scholarships/track/page.tsx` | Public | Live application tracking by registration number and phone |
| `/statutory-disclosures` | Page (Static) | `src/app/statutory-disclosures/page.tsx` | Public | Public transparency vault (PAN, 12A, 80G, CSR-1, NGO Darpan, MoSJE) |
| `/terms` | Page (Static) | `src/app/terms/page.tsx` | Public | Legal terms of service, zero-cash remittance conditions |
| `/volunteer` | Page (Static) | `src/app/volunteer/page.tsx` | Public | 6-track volunteer registration and safeguarding declarations |
| `/portal/dashboard` | Page (Static) | `src/app/portal/dashboard/page.tsx` | Protected (OTP) | Authenticated donor profile, contribution history, and receipt desk |
| `/portal/donations` | Page (Static) | `src/app/portal/donations/page.tsx` | Protected (OTP) | Detailed donor contribution records and status tracking |
| `/portal/login` | Page (Static) | `src/app/portal/login/page.tsx` | Public | Passwordless OTP donor login entry |
| `/portal/profile` | Page (Static) | `src/app/portal/profile/page.tsx` | Protected (OTP) | Donor personal and tax profile management |
| `/portal/receipts` | Page (Static) | `src/app/portal/receipts/page.tsx` | Protected (OTP) | Downloadable Form 10BE / 80G tax certificates |
| `/admin` | Page (Static) | `src/app/admin/page.tsx` | Protected (JWT) | Fiduciary administration portal and operational KPI dashboard |
| `/admin/login` | Page (Static) | `src/app/admin/login/page.tsx` | Public | Administrative staff login portal |
| `/admin/donors` | Page (Static) | `src/app/admin/donors/page.tsx` | Protected (JWT) | Donor ledger review and 80G receipt issuance desk |
| `/admin/whatsapp` | Page (Static) | `src/app/admin/whatsapp/page.tsx` | Protected (JWT) | Meta WhatsApp notification outbox monitor and retry desk |
| `/admin/scholarships`| Page (Static) | `src/app/admin/scholarships/page.tsx` | Protected (JWT) | Student grant application scrutiny and disbursal review desk |
| `/admin/volunteers` | Page (Static) | `src/app/admin/volunteers/page.tsx` | Protected (JWT) | Volunteer applicant verification desk |
| `/admin/inquiries` | Page (Static) | `src/app/admin/inquiries/page.tsx` | Protected (JWT) | Public inquiry review and correspondence desk |
| `/admin/audit-logs` | Page (Static) | `src/app/admin/audit-logs/page.tsx` | Protected (JWT) | Immutable administrative activity audit log |
| `/admin/users` | Page (Static) | `src/app/admin/users/page.tsx` | Protected (Super Admin) | Administrative user role and access control management |
| `/api/ai/chat` | Route (`POST`) | `src/app/api/ai/chat/route.ts` | Rate-limited (20/min) | Dual-routing AI chat stream with circuit breaker and Groq fallback |
| `/api/ai/health` | Route (`GET`) | `src/app/api/ai/health/route.ts` | Public | AI Gateway health status & engine diagnostic probe |
| `/sitemap.xml` | Route (`GET`) | `src/app/sitemap.ts` | Public | XML sitemap indexing all public routes |
| `/robots.txt` | Route (`GET`) | `src/app/robots.ts` | Public | Robot exclusion standard directives |

---

### 2. Spring Boot Backend REST Endpoints (Port 8080, `/api/v1`)
| Endpoint | Method | Controller | Auth / Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/actuator/health` | `GET` | Spring Boot Actuator | Public | Liveness and service readiness probe |
| `/health` | `GET` | `HealthController` | Public | Application health and database ping check |
| `/auth/login` | `POST` | `AuthController` | Public | Administrative user authentication returning JWT access & refresh tokens |
| `/auth/refresh` | `POST` | `AuthController` | Public | Refresh expired JWT access token |
| `/auth/logout` | `POST` | `AuthController` | Authenticated | Revoke active user session and blacklist refresh token |
| `/auth/me` | `GET` | `AuthController` | Authenticated | Current authenticated user profile and roles |
| `/portal/auth/request-otp` | `POST` | `PortalAuthController` | Public (Rate-limited) | Dispatch 6-digit OTP to donor email or phone |
| `/portal/auth/verify-otp` | `POST` | `PortalAuthController` | Public | Validate OTP and return donor portal JWT |
| `/portal/auth/refresh` | `POST` | `PortalAuthController` | Public | Refresh donor portal session token |
| `/portal/profile` | `GET`, `PUT` | `PortalAccountController` | `DONOR`, `GENERAL_USER` | Retrieve or update donor KYC and tax coordinates |
| `/portal/donations` | `GET` | `PortalAccountController` | `DONOR`, `GENERAL_USER` | Donor contribution history with download links |
| `/portal/donations/{id}/receipt` | `GET` | `PortalAccountController` | `DONOR`, `GENERAL_USER` | Download verified 80G tax deduction receipt |
| `/donations/initiate` | `POST` | `DonationController` | Public | Initiate donation checkout and create payment intent |
| `/donations/claim-bank-transfer` | `POST` | `DonationController` | Public | Submit manual NEFT/RTGS/IMPS UTR claim |
| `/donations/public-stats` | `GET` | `DonationController` | Public | Aggregated transparency metrics (total donors, funds disbursed) |
| `/payments/cashfree/create-order` | `POST` | `CashfreePaymentController`| Public | Create Cashfree PG checkout order session |
| `/payments/cashfree/order-status/{id}` | `GET` | `CashfreePaymentController`| Public | Check real-time payment status from Cashfree |
| `/inquiries` | `POST` | `PublicSubmissionController` | Public (Rate-limited) | Public citizen inquiry intake |
| `/volunteers` | `POST` | `PublicSubmissionController` | Public (Rate-limited) | Volunteer application submission with consent |
| `/scholarships/apply` | `POST` | `ScholarshipPublicController` | Public | Student higher-education tuition grant application intake |
| `/scholarships/track` | `GET` | `ScholarshipPublicController` | Public | Real-time scholarship status lookup by registration number |
| `/webhooks/payments/cashfree` | `POST` | `WebhookController` | Signature Verified | Cashfree payment confirmation webhook handler |
| `/webhooks/payments/razorpay` | `POST` | `WebhookController` | Signature Verified | Razorpay payment confirmation webhook handler |
| `/webhooks/resend` | `POST` | `WebhookController` | Signature Verified | Resend Svix email delivery notification handler |
| `/webhooks/whatsapp` | `GET` | `WebhookController` | Public | Meta WhatsApp Cloud API subscription verification challenge |
| `/webhooks/whatsapp` | `POST` | `WebhookController` | Signature Verified | Meta WhatsApp message delivery & read receipts webhook |
| `/admin/dashboard/stats` | `GET` | `AdminController` | Admin Roles | Administrative KPI counters and queue summary |
| `/admin/inquiries` | `GET`, `PATCH` | `AdminController` | Admin Roles | Review citizen inquiries and update status |
| `/admin/volunteers` | `GET`, `PATCH` | `AdminController` | Admin Roles | Scrutinize volunteer applicants and approve |
| `/admin/scholarships` | `GET`, `PATCH` | `AdminController` | Admin Roles | Review student grants and record disbursals |
| `/admin/donors` | `GET` | `AdminDonorController` | `FINANCE_OFFICER`, `ADMIN`| Fiduciary donor master ledger and contact history |
| `/admin/donations` | `GET`, `POST` | `AdminDonorController` | `FINANCE_OFFICER`, `ADMIN`| Review donations, verify bank UTRs, issue 80G receipts |
| `/admin/whatsapp/status` | `GET` | `AdminWhatsAppController` | `ADMIN`, `SUPER_ADMIN` | Meta WhatsApp Cloud API connection status |
| `/admin/whatsapp/outbox` | `GET` | `AdminWhatsAppController` | `ADMIN`, `SUPER_ADMIN` | Inspect queued, delivered, and failed WhatsApp dispatches |
| `/admin/whatsapp/retry/{id}` | `POST` | `AdminWhatsAppController` | `ADMIN`, `SUPER_ADMIN` | Manually retry a failed notification dispatch |
| `/admin/audit-logs` | `GET` | `AdminController` | `SUPER_ADMIN`, `AUDITOR` | Immutable audit log trail of administrative actions |
| `/admin/users` | `GET`, `POST`, `PATCH` | `AdminController` | `SUPER_ADMIN` | Administrative user provisioning and role management |

---

### 3. Python FastAPI AI Engine Endpoints (Port 8082)
| Endpoint | Method | Auth / Access | Request Payload | Response / Output | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/v1/health` | `GET` | Public | None | JSON telemetry (`cpu_load`, `ram_used`, `engine_loaded`) | Health diagnostic probe without exposing secrets |
| `/v1/chat/completions` | `POST` | `INTERNAL_AI_SECRET` | `ChatCompletionRequest` (messages, language, temp) | Server-Sent Events (`text/event-stream`) | Streaming grounded RAG assistant responses with citation footnotes |
| `/v1/rag/search` | `POST` | `INTERNAL_AI_SECRET` | `SearchQueryRequest` (`query`, `top_k`) | JSON (`excerpts`, `citations`, `count`) | Dense semantic vector search across Qdrant collection |

---

## Environment Variables Registry

| Name | Where Used | Service | Required? | Default / Example | Secret? | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Frontend | Next.js | Yes | `https://mect.org.in` | No | Canonical production application URL for metadata and redirects |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend (`src/lib/api.ts`) | Next.js | Yes | `https://mect.org.in/api/v1` | No | Public REST backend base URL for client fetch requests |
| `AI_ENGINE_MODE` | Frontend (`src/app/api/ai/`) | Next.js | Yes | `local_with_fallback` | No | AI routing strategy: `local_only`, `cloud_only`, `local_with_fallback` |
| `LOCAL_AI_CHAT_URL` | Frontend (`src/app/api/ai/`) | Next.js | Yes | `http://127.0.0.1:8082/v1/chat/completions` | No | Loopback endpoint for local AI inference engine |
| `LOCAL_AI_HEALTH_URL` | Frontend (`src/app/api/ai/`) | Next.js | Yes | `http://127.0.0.1:8082/v1/health` | No | Loopback endpoint for local AI health probe |
| `INTERNAL_AI_SECRET` | Frontend & AI Engine | Next.js / Python | Yes | None (min 32 chars) | **Yes** | Shared high-entropy secret authenticating proxy to Python engine |
| `GROQ_API_KEY` | Frontend (`src/app/api/ai/`) | Next.js | Optional | `gsk_...` | **Yes** | Groq Cloud API key for streaming hot-standby cloud fallback |
| `GROQ_MODEL` | Frontend (`src/app/api/ai/`) | Next.js | Optional | `qwen/qwen3.8-27b` | No | High-throughput model identifier for cloud fallback |
| `SERVER_PORT` | Backend (`application.yml`) | Spring Boot | No | `8080` | No | Backend HTTP listening port |
| `DB_HOST` | Backend (`application.yml`) | Spring Boot | Yes | `localhost` | No | PostgreSQL host hostname |
| `DB_PORT` | Backend (`application.yml`) | Spring Boot | No | `5432` | No | PostgreSQL port |
| `DB_NAME` | Backend (`application.yml`) | Spring Boot | Yes | `mahavir_db` | No | PostgreSQL production database name |
| `DB_USERNAME` | Backend (`application.yml`) | Spring Boot | Yes | `mahavir_app` | No | PostgreSQL database user |
| `DB_PASSWORD` | Backend (`application.yml`) | Spring Boot | Yes | None | **Yes** | PostgreSQL database password |
| `JWT_SECRET` | Backend (`application.yml`) | Spring Boot | Yes | None (min 256-bit string) | **Yes** | HMAC-SHA256 signing key for administrative JWT tokens |
| `JWT_ACCESS_VALIDITY` | Backend (`application.yml`) | Spring Boot | No | `900` (15 mins) | No | JWT access token lifespan in seconds |
| `JWT_REFRESH_VALIDITY` | Backend (`application.yml`) | Spring Boot | No | `604800` (7 days) | No | JWT refresh token lifespan in seconds |
| `OTP_HASH_PEPPER` | Backend (`application.yml`) | Spring Boot | Yes | None | **Yes** | Cryptographic pepper for donor OTP hashing |
| `RESEND_API_KEY` | Backend (`application.yml`) | Spring Boot | Yes | `re_...` | **Yes** | Resend email API key for transactional emails & OTP |
| `RESEND_WEBHOOK_SECRET` | Backend (`application.yml`) | Spring Boot | Optional | `whsec_...` | **Yes** | Resend Svix webhook signing secret |
| `CASHFREE_APP_ID` | Backend (`application.yml`) | Spring Boot | Yes | None | **Yes** | Cashfree Payment Gateway Application ID |
| `CASHFREE_SECRET_KEY` | Backend (`application.yml`) | Spring Boot | Yes | None | **Yes** | Cashfree Payment Gateway Client Secret Key |
| `CASHFREE_ENV` | Backend (`application.yml`) | Spring Boot | Yes | `PRODUCTION` | No | Cashfree runtime environment (`SANDBOX` or `PRODUCTION`) |
| `CASHFREE_WEBHOOK_SECRET` | Backend (`application.yml`) | Spring Boot | Yes | None | **Yes** | Cashfree webhook signature verification secret |
| `WHATSAPP_ENABLED` | Backend (`application.yml`) | Spring Boot | Yes | `false` (until credentials verified)| No | Master killswitch for WhatsApp notification engine |
| `WHATSAPP_PHONE_NUMBER_ID` | Backend (`application.yml`) | Spring Boot | Optional | None | No | Meta WhatsApp Business phone number identifier |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Backend (`application.yml`) | Spring Boot | Optional | None | No | Meta Business Account identifier |
| `WHATSAPP_ACCESS_TOKEN` | Backend (`application.yml`) | Spring Boot | Optional | `EAA...` | **Yes** | Meta Cloud API System User access token |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Backend (`application.yml`) | Spring Boot | Optional | None | **Yes** | Handshake verification token for Meta webhook subscription |
| `WHATSAPP_APP_SECRET` | Backend (`application.yml`) | Spring Boot | Optional | None | **Yes** | Meta App Secret for `X-Hub-Signature-256` payload validation |
| `QDRANT_URL` | AI Engine (`.env`) | Python | Yes | `http://127.0.0.1:6333` | No | Qdrant vector database connection URL |
| `COLLECTION_NAME` | AI Engine (`.env`) | Python | Yes | `mect_knowledge_v1` | No | Target Qdrant knowledge vector collection |
| `MODEL_PATH` | AI Engine (`.env`) | Python | Yes | `models/qwen2.5-3b-mect-q4_k_m.gguf`| No | Primary local fine-tuned model weights |
| `FALLBACK_MODEL_PATH` | AI Engine (`.env`) | Python | No | `models/qwen2.5-1.5b-instruct-q4_k_m.gguf` | No | Lightweight local fallback weights for constrained hardware |

---

## Screenshots Needed
1. `<!-- TODO(screenshot): Master Homepage Hero with Option A Heritage Tokens -->`
2. `<!-- TODO(screenshot): Statutory Disclosures & Compliance Vault with 12A/80G credentials -->`
3. `<!-- TODO(screenshot): Interactive HIm AI Assistant widget chatting in Odia/English -->`
4. `<!-- TODO(screenshot): Corporate CSR & Schedule VII Gateway -->`
5. `<!-- TODO(screenshot): 80G Tax Exemption Donor Portal with interactive calculator -->`
6. `<!-- TODO(screenshot): Er. Japabandhu Kampa leadership profile on About & Governance routes -->`

---

## Open Questions
1. **LICENSE:** No formal open-source license file (e.g., MIT, Apache-2.0, or Proprietary) exists in the repository root. Need confirmation from project owner on license terms.
2. **Screenshots:** Real captures from production or Playwright headless sessions can replace markdown placeholders.

---

## Run Log
- **2026-11-06 (Run 1):** DISCOVERY-A complete. Mapped top-level folders 3 levels deep (`src/`, `backend/`, `mect-ai-engine/`, `ai-training/`, `public/`, `scratch/`). Identified languages, frameworks, manifests, and entry points. Formatted Module Map table. Initialized checklist with 18 items.
- **2026-11-06 (Run 2):** DISCOVERY-B complete. Deep-dive into Next.js 16 frontend: mapped 25 pages, 2 AI gateway route handlers, XML sitemap, robots.txt, security headers, rate-limiting, circuit breaker, data fetching, accessibility, and SEO. Populated Routes Registry table.
- **2026-11-24 (Run 3):** DISCOVERY-C complete. Deep-dive into Java 21 / Spring Boot 4.1.1 backend: mapped 16 REST controllers with 37 endpoints, Flyway migrations V1–V18, dual auth models (Admin JWT & Donor OTP), Cashfree/Razorpay webhook security, and Meta WhatsApp Cloud API outbox.
- **2026-11-24 (Run 4):** DISCOVERY-D complete. Deep-dive into Python FastAPI AI Engine & training pipeline: mapped `mect-ai-engine` systemd service, cgroup resource isolation (3.8G RAM, 250% CPU), Qdrant vector RAG, `INTERNAL_AI_SECRET` auth, SSE streaming completions, Groq cloud fallback, and 1,200-sample multilingual QLoRA dataset.
