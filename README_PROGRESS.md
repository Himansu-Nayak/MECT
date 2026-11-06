# README Implementation Progress & State

## Checklist
- [x] 01 DISCOVERY-A: Map the repo: walk every top-level folder (src, public, backend, mect-ai-engine, ai-training, scratch) 3 levels deep. Identify each module's language, framework, manifest, entry point. Fill Module Map.
- [ ] 02 DISCOVERY-B: Frontend deep-dive: list every route under src/app (or pages), layouts, key components, data fetching, AI gateway route handlers, middleware, security headers in next.config.ts, i18n, accessibility features, SEO. Fill Routes registry.
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

## Routes/API Registry
*(To be populated in detail in DISCOVERY-B and DISCOVERY-C)*

| Route / Endpoint | Method | Source File | Auth | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/ai/chat` | `POST` | `src/app/api/ai/chat/route.ts` | Rate-limited / Public | AI Gateway chat proxy with circuit breaker |
| `/api/ai/health` | `GET` | `src/app/api/ai/health/route.ts` | Public | AI Gateway health status & engine probe |
| `/api/v1/auth/login` | `POST` | `backend/.../AuthController.java` | Public | Staff/Admin authentication & JWT issue |
| `/api/v1/health` | `GET` | `backend/.../HealthController.java` | Public | Backend health probe |
| `/api/v1/scholarships/apply` | `POST` | `backend/.../ScholarshipPublicController.java` | Public | Student scholarship application submission |

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
