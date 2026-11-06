# README Implementation Progress & State

## Checklist
- [x] 1. Discovery: purpose, stack, folder map, scripts, env vars → Findings
- [ ] 2. Header: logo, badges, nav links, disclaimer
- [ ] 3. Features section
- [ ] 4. Quick Start (install, env, run frontend, run backend, run AI engine)
- [ ] 5. Architecture: module table + a Mermaid diagram of how src, backend, mect-ai-engine and ai-training connect
- [ ] 6. Configuration: env var table (name, required?, purpose, example)
- [ ] 7. Modules/Docs index: table linking each major .md in the repo
- [ ] 8. Security & privacy summary (link to the audit reports)
- [ ] 9. Manage section: build, lint, test, deploy, cleanup
- [ ] 10. Contributing + Project Links + License (check for a LICENSE file; if missing, add a TODO)
- [ ] 11. Polish pass: consistent tone, no duplicate sections, badges render, all relative links resolve, all anchors valid
- [ ] 12. Final verification

---

## Findings

### Project Identity & Purpose
- **Full Legal Name:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST).
- **First Two Lines:**
  > **Mahaveer Educational & Charitable Trust (MECT)** is an irrevocable registered public charitable trust (Est. 2013, Odisha, India) dedicated to higher education grant access, rural skilling, and civic welfare.
  > The platform provides direct-to-college scholarship disbursements, verified statutory disclosures (12A, 80G, CSR-1), transparent governance, and a self-hosted multilingual AI assistant (**HIm**).
- **Core Activities:** Direct non-cash higher education tuition grants to accredited colleges, rural remedial education (Balangir/Puintala), certified women's vocational tailoring, summer heatwave drinking water kiosks (Jal Seva), hospital nutrition relief (Jan Ahar), 80G tax deduction donor portal, and corporate Schedule VII CSR collaboration.

### Verified Technology Stack
- **Frontend (`src/`):** Next.js 16.4.3 (App Router, Turbopack, Standalone/SSR), React 19.3.0, TypeScript 5.7.0, Tailwind CSS v4, Lucide React 1.16.0, Motion 12.4.7.
- **Backend (`backend/`):** Spring Boot 4.1.1 (Java 21), Spring Web, Spring Security, Spring Data JPA, PostgreSQL (with Flyway database migrations), JJWT 0.12.6, Spring Boot Actuator, H2 (for test scope). Servlet context-path: `/api/v1`. Default port: `8080`.
- **AI Engine (`mect-ai-engine/`):** Python 3.12+, FastAPI 0.115+, Uvicorn 0.34+, Pydantic v2, llama-cpp-python 0.3.7+ (Qwen2.5-3B-Instruct GGUF Q4_K_M), Qdrant 1.13+ vector store (port 6333), FastEmbed 0.4+, Psutil, SlowAPI. Default port: `8082`. Hot-standby cloud fallback: Groq API (`qwen/qwen3.8-27b`).
- **AI Training & Ingestion (`ai-training/`):** QLoRA scripts and Colab notebooks for Qwen2.5 fine-tuning on multilingual trust datasets (English, Odia, Hindi).

### Folder Map
```text
MAHAVIR-TRUST/
├── src/                          # Next.js 16 frontend application
│   ├── app/                      # App router pages, layouts, and API routes
│   │   ├── api/ai/               # AI gateway proxy endpoints (chat, health)
│   │   ├── about/                # Institutional heritage & team
│   │   ├── admin/                # Administrative management portal
│   │   ├── contact/              # Dual-office directory & grievance desk
│   │   ├── csr-partnerships/     # Corporate CSR & Schedule VII gateway
│   │   ├── donate/               # 80G tax exemption & donor remittance portal
│   │   ├── governance/           # Trust deed & board of trustees portal
│   │   ├── impact/               # Ground metrics & verified beneficiary case studies
│   │   ├── programmes/           # 4 core operational pillars deep-dive
│   │   ├── reports/              # Certified annual reports & financial archive
│   │   ├── scholarships/         # Higher education student grant desk & tracking
│   │   ├── statutory-disclosures/# Public compliance vault (12A, 80G, CSR-1, NGO Darpan)
│   │   └── volunteer/            # 6-track volunteer & mentor onboarding
│   ├── components/               # UI components, layout (Header, Footer, QuickActionDock)
│   └── lib/                      # Config (TRUST_CONFIG), API client, content matrices
├── backend/                      # Spring Boot 4 (Java 21) REST backend service
│   ├── src/main/java/            # Controllers (Auth, Admin, Scholarships, Public)
│   ├── src/main/resources/       # application.yml & db/migration Flyway scripts
│   └── pom.xml                   # Maven dependencies & build configuration
├── mect-ai-engine/               # Self-hosted Python AI assistant (HIm)
│   ├── app/                      # FastAPI core, RAG pipeline, llama.cpp engine
│   ├── knowledge_docs/           # Authoritative charters in EN, OR, HI
│   ├── systemd/                  # Systemd service unit with cgroup v2 limits
│   ├── deploy_ai_engine.sh       # Production VPS deployment automation script
│   ├── ingest_knowledge.mjs      # Multilingual semantic chunking & hash generator
│   ├── ingest_qdrant.py          # Vector embedding & Qdrant ingestion script
│   └── requirements.txt          # Python dependency specifications
├── ai-training/                  # Dataset generator & Qwen2.5 fine-tuning notebooks
├── public/                       # Static verification assets
└── scratch/                      # Automated regression test suites (Phases 1-14)
```

### Verified Run Commands
- **Frontend (`package.json`):**
  - `npm run dev`: Starts local Next.js development server (default port 3000)
  - `npm run build`: Generates optimized production build (`next build --webpack` / Turbopack)
  - `npm run start`: Launches production server
  - `npm run lint`: Executes ESLint code quality checks
- **Backend (`backend/pom.xml`):**
  - `mvn clean install`: Builds backend application and executes tests
  - `mvn spring-boot:run`: Launches Spring Boot API on port 8080
  - `mvn test`: Executes backend test suite with in-memory H2
- **AI Engine (`mect-ai-engine/`):**
  - `pip install -r requirements.txt`: Installs Python dependencies
  - `node ingest_knowledge.mjs`: Chunks knowledge base documents with SHA-256 provenance
  - `python ingest_qdrant.py`: Embeds and indexes knowledge chunks into Qdrant
  - `uvicorn app.main:app --host 127.0.0.1 --port 8082`: Starts FastAPI engine

### Verified Environment Variables
- **Frontend (`.env.example`):**
  - `NEXT_PUBLIC_API_BASE_URL`: Spring Boot backend endpoint (`http://localhost:8080/api/v1`)
  - `AI_ENGINE_MODE`: AI routing strategy (`local_with_fallback`, `local_only`, `fallback_only`)
  - `LOCAL_AI_CHAT_URL`: AI engine completions URL (`http://127.0.0.1:8082/v1/chat/completions`)
  - `LOCAL_AI_HEALTH_URL`: AI engine health URL (`http://127.0.0.1:8082/v1/health`)
  - `INTERNAL_AI_SECRET`: Shared authentication token (minimum 32 characters)
  - `GROQ_API_KEY`: Groq hot-standby cloud API key
  - `GROQ_MODEL`: Cloud fallback model (`qwen/qwen3.8-27b`)
- **Backend (`backend/.env.example`):**
  - `SERVER_PORT`: HTTP listener port (default `8080`)
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL configuration
  - `CORS_ALLOWED_ORIGINS`: Allowed browser origins (`http://localhost:3000,http://127.0.0.1:3000`)
  - `JWT_SECRET`, `JWT_ACCESS_VALIDITY`, `JWT_REFRESH_VALIDITY`: Token encryption configuration
- **AI Engine (`mect-ai-engine/.env.example`):**
  - `ENVIRONMENT`: Runtime mode (`production`, `development`)
  - `HOST`, `PORT`: Server bind host (`127.0.0.1`) and port (`8082`)
  - `CPU_THREADS`, `CONTEXT_WINDOW`: Inference resource tuning (3 threads, 2048 context)
  - `INTERNAL_AI_SECRET`: Shared secret required for header validation
  - `QDRANT_URL`, `COLLECTION_NAME`: Vector database URL (`http://127.0.0.1:6333`) and collection (`mect_knowledge_v1`)
  - `MODEL_PATH`, `FALLBACK_MODEL_PATH`: GGUF weights paths
  - `GROQ_API_KEY`, `GROQ_MODEL`: Fallback API credentials

---

## Open Questions & Placeholders
1. **LICENSE:** No formal LICENSE file exists in the repository root. Will include `<!-- TODO: confirm license type -->` in Item 10.
2. **Screenshots:** No UI image files exist in `public/` (only Google site verification HTML). Will insert `<!-- TODO: screenshot -->` placeholders with descriptive italic captions in Item 2/3/5 as requested.
