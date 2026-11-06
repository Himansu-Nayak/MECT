# README Implementation Progress & State

## Checklist
- [x] 01 DISCOVERY-A: Map the repo: walk every top-level folder (src, public, backend, mect-ai-engine, ai-training, scratch) 3 levels deep. Identify each module's language, framework, manifest, entry point. Fill Module Map.
- [x] 02 DISCOVERY-B: Frontend deep-dive: list every route under src/app (or pages), layouts, key components, data fetching, AI gateway route handlers, middleware, security headers in next.config.ts, i18n, accessibility features, SEO. Fill Routes registry.
- [ ] 03 DISCOVERY-C: Backend deep-dive: framework, DB, migrations, auth model, every endpoint under /api/v1, config files, how to start it, default port, required env/secrets. Fill Routes/API and Env registries.
- [ ] 04 DISCOVERY-D: AI engine + training deep-dive: model(s), serving framework, endpoints (/v1/chat/completions, /v1/health), auth via INTERNAL_AI_SECRET, hardware needs, how to run, fallback logic and exact AI_ENGINE_MODE values supported. Describe ai-training: data, scripts, outputs.
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

## Module Map

| Folder | Purpose | Language & Stack | Manifest | Entry Point | Run Command | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `src/` | Next.js frontend application & AI proxy gateway | TypeScript 5.7, React 19.3, Next.js 16.4.3 (App Router, Turbopack), Tailwind CSS v4 | `package.json` | `src/app/layout.tsx`, `src/app/page.tsx` | `npm run dev` (port 3000) | `package.json#L1-L31`, `src/app/layout.tsx` |
| `backend/` | Institutional REST API backend & DB persistence | Java 21, Spring Boot 4.1.1, Spring Security, JPA/Hibernate, PostgreSQL, Flyway | `backend/pom.xml` | `org.mahavirtrust.backend.MahavirTrustBackendApplication` | `mvn spring-boot:run` (port 8080, context `/api/v1`) | `backend/pom.xml#L1-L127`, `application.yml#L1-L5` |
| `mect-ai-engine/` | Autonomous Python inference & RAG vector search engine (HIm) | Python 3.12+, FastAPI, Uvicorn, llama-cpp-python, Qdrant Client, FastEmbed | `mect-ai-engine/requirements.txt` | `mect-ai-engine/app/main.py` | `uvicorn app.main:app --host 127.0.0.1 --port 8082` | `mect-ai-engine/requirements.txt#L1-L11`, `app/main.py` |
| `ai-training/` | Dataset generation, evaluation splits & Qwen2.5 QLoRA fine-tuning scripts | Python 3.10+, Node.js ESM, PyTorch, Transformers, PEFT/QLoRA | Script files | `ai-training/scripts/generate_dataset.mjs`, `train_him_qwen_qlora.py` | `node ai-training/scripts/generate_dataset.mjs` | `ai-training/scripts/generate_dataset.mjs#L1-L50` |
| `public/` | Static domain verification assets & icons | HTML, Web Assets | Filesystem | `public/google4eacd3ee074d0174.html` | Served statically by Next.js at `/` | `public/google4eacd3ee074d0174.html` |
| `scratch/` | Comprehensive automated test suites across all development phases | Node.js ESM (`node:assert`, `node:fs`, `node:child_process`) | Test runner | `scratch/test-all-phases-regression.mjs` | `node scratch/test-all-phases-regression.mjs` | `scratch/test-all-phases-regression.mjs#L1-L40` |

---

## Env Var Registry
*(To be populated in detail in DISCOVERY-C and DISCOVERY-D)*

| Name | Where Used | Service | Required? | Default | Secret? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | `src/lib/api.ts` | Frontend | Yes | `http://localhost:8080/api/v1` | No |
| `AI_ENGINE_MODE` | `src/app/api/ai/chat/route.ts` | Frontend | Yes | `local_with_fallback` | No |
| `LOCAL_AI_CHAT_URL` | `src/app/api/ai/chat/route.ts` | Frontend | Yes | `http://127.0.0.1:8082/v1/chat/completions` | No |
| `LOCAL_AI_HEALTH_URL` | `src/app/api/ai/health/route.ts` | Frontend | Yes | `http://127.0.0.1:8082/v1/health` | No |
| `INTERNAL_AI_SECRET` | `src/app/api/ai/`, `mect-ai-engine/` | Frontend & AI Engine | Yes | None (min 32 chars) | **Yes** |
| `GROQ_API_KEY` | `src/app/api/ai/chat/route.ts` | Frontend / Cloud Fallback | Optional (Required if fallback enabled) | None | **Yes** |
| `GROQ_MODEL` | `src/app/api/ai/chat/route.ts` | Frontend / Cloud Fallback | Optional | `qwen/qwen3.8-27b` | No |
| `SERVER_PORT` | `backend/src/main/resources/application.yml` | Backend | No | `8080` | No |
| `DB_HOST`, `DB_PORT`, `DB_NAME` | `backend/src/main/resources/application.yml` | Backend | Yes | `localhost:5432/mahavir_trust_dev` | No |
| `DB_USERNAME`, `DB_PASSWORD` | `backend/src/main/resources/application.yml` | Backend | Yes | None | **Yes** |
| `JWT_SECRET` | `backend/src/main/resources/application.yml` | Backend | Yes | None | **Yes** |

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
  - High-contrast institutional color palette: Presidential Navy (`#0A192F`) on Ivory Slate (`#FDFBF7`) / White with 15.6:1 contrast ratio.
  - Motion sensitivity handling using `useReducedMotion()` from `motion/react`.
  - Accessible form validation with `aria-live="assertive"`, `role="alert"`, and explicit field labels.
- **Multilingual Support (i18n):**
  - HIm AI Assistant natively supports English (`en`), Odia (`or`), and Hindi (`hi`).

---

## Routes/API Registry

### Next.js Internal Routes & API Handlers
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
| `/admin` | Page (Static) | `src/app/admin/page.tsx` | Protected (JWT) | Fiduciary administration portal and operational KPI dashboard |
| `/admin/login` | Page (Static) | `src/app/admin/login/page.tsx` | Public | Administrative staff login portal |
| `/admin/scholarships`| Page (Static) | `src/app/admin/scholarships/page.tsx` | Protected (JWT) | Student grant application scrutiny and disbursal review desk |
| `/admin/volunteers` | Page (Static) | `src/app/admin/volunteers/page.tsx` | Protected (JWT) | Volunteer applicant verification desk |
| `/admin/inquiries` | Page (Static) | `src/app/admin/inquiries/page.tsx` | Protected (JWT) | Public inquiry review and correspondence desk |
| `/admin/audit-logs` | Page (Static) | `src/app/admin/audit-logs/page.tsx` | Protected (JWT) | Immutable administrative activity audit log |
| `/admin/users` | Page (Static) | `src/app/admin/users/page.tsx` | Protected (Super Admin) | Administrative user role and access control management |
| `/api/ai/chat` | Route (`POST`) | `src/app/api/ai/chat/route.ts` | Rate-limited (20/min) | Dual-routing AI chat stream with circuit breaker and Groq fallback |
| `/api/ai/health` | Route (`GET`) | `src/app/api/ai/health/route.ts` | Public | AI Gateway health status & engine diagnostic probe |
| `/sitemap.xml` | Route (`GET`) | `src/app/sitemap.ts` | Public | XML sitemap indexing 13 primary public routes |
| `/robots.txt` | Route (`GET`) | `src/app/robots.ts` | Public | Robot exclusion standard directives |

---

## Screenshots Needed
1. `<!-- TODO(screenshot): Master Homepage Hero with Presidential Navy & Gold theme -->`
2. `<!-- TODO(screenshot): Statutory Disclosures & Compliance Vault with 12A/80G credentials -->`
3. `<!-- TODO(screenshot): Interactive HIm AI Assistant widget chatting in Odia/English -->`
4. `<!-- TODO(screenshot): Corporate CSR & Schedule VII Gateway -->`
5. `<!-- TODO(screenshot): 80G Tax Exemption Donor Portal with interactive calculator -->`

---

## Open Questions
1. **LICENSE:** No formal open-source license file (e.g., MIT, Apache-2.0, or Proprietary) exists in the repository root. Need confirmation from project owner on license terms.
2. **Screenshots:** No UI image files exist in `public/`. Placeholders will be inserted until captures are provided.

---

## Run Log
- **2026-11-06 (Run 1):** DISCOVERY-A complete. Mapped top-level folders 3 levels deep (`src/`, `backend/`, `mect-ai-engine/`, `ai-training/`, `public/`, `scratch/`). Identified languages, frameworks, manifests, and entry points. Formatted Module Map table. Initialized checklist with 18 items.
- **2026-11-06 (Run 2):** DISCOVERY-B complete. Deep-dive into Next.js 16 frontend: mapped 25 pages, 2 AI gateway route handlers, XML sitemap, robots.txt, security headers, rate-limiting, circuit breaker, data fetching, accessibility, and SEO. Populated Routes Registry table.
