<div align="center">

# 🏛️ Mahaveer Educational & Charitable Trust (MECT)
### *Authoritative Institutional Platform, Statutory Vault & Autonomous Multilingual AI (HIm)*

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-149eca?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6db33f?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-f89820?style=flat-square&logo=openjdk)](https://adoptium.net/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.12-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Qdrant](https://img.shields.io/badge/Vector_DB-Qdrant-dc2626?style=flat-square&logo=qdrant)](https://qdrant.tech/)
[![Flyway](https://img.shields.io/badge/Flyway-V1_through_V18-cc0202?style=flat-square&logo=flyway)](backend/src/main/resources/db/migration/)
[![Automated Tests](https://img.shields.io/badge/Tests-58%2F58_Routes_Compiled-22c55e?style=flat-square)](scratch/)
[![Statutory Status](https://img.shields.io/badge/Statutory_Status-12A_%7C_80G_%7C_CSR--1-d97706?style=flat-square)](src/app/statutory-disclosures/)

[Key Features](#-key-features) · [Architecture](#-system-architecture) · [Quick Start](#-quick-start) · [Environment Variables](#-configuration--environment-variables) · [API Registry](#-routes--api-registry) · [Security](#-security-privacy--governance) · [Production Operations](#-production-deployment--operations)

*Official production software repository and fiduciary disclosure platform of Mahaveer Educational & Charitable Trust (Registered Trust Deed No. 40311302194, Sub-Registrar Balangir, Odisha, India).*

</div>

---

> **Institutional Notice:** All public narrative, programmatic claims, and fiscal figures published across this repository are bound strictly by registered statutory records (Income Tax Section 12A/80G Form 10AC Orders, MCA CSR-1 Registration, NITI Aayog NGO Darpan, and audited financial statements for FY 2021–22 through FY 2023–24).

**Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)** is a registered public charitable trust established in 2013 in Balangir, Odisha. Operating under a strict 100% direct-to-college tuition fee disbursement policy (zero cash to students or families), MECT eliminates economic barriers to higher education while running verified ground programmes in remedial education, women's vocational livelihoods, emergency heatwave relief, and community nutrition. This monorepo hosts MECT's integrated digital ecosystem: Next.js 16 frontend, Spring Boot 4.1.1 enterprise backend, Meta WhatsApp Cloud API notification engine, and an autonomous, self-hosted multilingual AI assistant (**HIm**).

---

## 🌟 Key Features

### 1. Public Institutional Portal & Authentic Visual Identity
- **Option A Heritage Design System:** Grounded in earthy institutional authority tokens: Forest Green (`#072617`, `#0B3B24`), Terracotta (`#C45A3C`), Heritage Gold (`#C5A059`, `#E4C88A`), Ivory Slate (`#FDFBF7`), and Presidential Ink (`#1C2421`).
- **Verified Leadership Profile:** Dedicated institutional profile of Settler Founder & Managing Trustee **Er. Japabandhu Kampa** with high-resolution authentic portraits (`public/images/leadership/er-japabandhu-kampa.webp`) and historical context from the 2013 registered Trust Deed.
- **Authentic Field Documentary Photography:** High-resolution field photography documenting real classrooms, scholarship circles, and community relief efforts in Balangir and Puintala blocks (`public/images/programmes/`).
- **Academic Typography Hierarchy:** Combining `Lora` (scholarly serif headings), `Plus Jakarta Sans` (highly legible interface copy), and `JetBrains Mono` (disambiguated financial UTRs and credentials).
- **Accessibility & Inclusion:** WCAG 2.2 AA compliant with accessible skip-to-content anchors, explicit ARIA live regions, `prefers-reduced-motion` compliance via `useReducedMotion()`, and minimum 44px touch targets.

### 2. Direct-to-College Tuition Grants & Scholarship Portal
- **Zero-Cash Statutory Policy:** 100% of higher education tuition fee grants are transferred directly to verified educational institution bank accounts via RTGS/NEFT—never handed over in cash.
- **Transparent Multi-Step Application:** Online student intake (`/scholarships/apply`) with bona fide college certification, fee invoice scrutiny, and socioeconomic criteria validation.
- **Real-Time Live Application Tracking:** Students can track their application review status (`/scholarships/track`) using their unique registration number and registered mobile.

### 3. Public Statutory Compliance Vault & Annual Reports Library
- **Institutional Compliance Vault:** Dedicated transparency registry (`/statutory-disclosures`) publishing active Form 10AC orders for Income Tax Sections 12A (`AADTM5474FE20231`) and 80G (`AADTM5474FF20241`), MCA CSR-1 Registration (`CSR00081063`), NITI Aayog NGO Darpan (`OR/2024/0466491`), and MoSJE e-Anudaan (`OR/00040466`).
- **Audited Financial Archive:** Publicly downloadable annual financial reports and balance sheets (`/reports`) certified by independent Chartered Accountants for FY 2021–22, 2022–23, and 2023–24.

### 4. Fiduciary Donor Portal & 80G Tax Deductions
- **Dual Payment Integration:** Cashfree Payment Gateway v2023-08-01 session checkouts alongside static State Bank of India Scan & Pay UPI QR codes for zero-fee voluntary contributions.
- **Interactive 80G Tax Estimator:** Live calculator displaying 50% taxable income deduction under Section 80G of the Income Tax Act, 1961.
- **Passwordless Donor Portal:** Secure authentication via 6-digit email/SMS OTP (`/portal/login`), allowing donors to access historical contribution ledgers, track manual bank UTR claims, and download Form 10BE tax receipts.

### 5. Enterprise Meta WhatsApp Cloud API Notification Engine
- **Flyway V18 Outbox Pattern:** High-reliability notification engine maintaining an immutable `notification_outbox` table with atomic transactional status tracking (`PENDING`, `DISPATCHED`, `DELIVERED`, `FAILED`).
- **Template Notifications:** Structured Meta Cloud API v21.0 templates for instant donation receipts, UTR verification updates, admin alerts, and daily reconciliation summaries.
- **Webhook Handshake & Verification:** Cryptographic HMAC-SHA256 signature verification (`X-Hub-Signature-256`) and verification challenge handshake handler.

### 6. Autonomous Multilingual AI Assistant ("HIm")
- **Self-Hosted Local Inference:** Runs an independent FastAPI service (`mect-ai-engine`) powered by `llama-cpp-python` serving GGUF 4-bit quantized weights (`qwen2.5-3b-mect-q4_k_m.gguf`).
- **Dense Vector RAG (Qdrant):** Dense semantic search over official MECT records (`mect_knowledge_v1` collection on port 6333) with automated citation footnotes.
- **Resilient Circuit Breaker & Cloud Fallback:** Next.js proxy route (`/api/ai/chat`) with sliding-window rate limiting (20 req/min/IP), 3.5s connection timeout, 60s failure cooldown, and automatic streaming fallback to Groq Cloud API (`qwen/qwen3.8-27b`).
- **Multilingual Support:** Natively trained to answer citizen questions in English (`en`), Odia (`or`), and Hindi (`hi`).

### 7. Structured Volunteer Platform & Safeguarding
- **4 Approved Mentorship Tracks:** Academic & Entrance Exam Mentorship (GATE/OPSC/NET), Career & Professional Guidance, Project Samarth Study Hub Stewardship, and College Faculty Liaison.
- **Strict Safeguarding Boundaries:** Unsupervised child care and door-to-door cash collection are strictly prohibited by charter to uphold safeguarding standards and non-cash policy.
- **Optimistic Concurrency Control:** Database state transitions (`APPLIED` → `AWAITING_ORIENTATION` → `ORIENTATION_COMPLETED` → `ACTIVE_MENTOR`) protected by PostgreSQL `@Version` column locking (Flyway `V5`).

---

## 🏗️ System Architecture

```mermaid
graph TD
    User["Citizen / Donor / Student Browser"] -->|HTTPS (Port 443)| Nginx["Nginx Reverse Proxy & SSL Termination"]
    
    subgraph Frontend ["Next.js 16 Web Application (Port 3000)"]
        Nginx -->|Public Routes & Static Assets| NextApp["App Router (58 SSG/Static Routes)"]
        NextApp -->|/api/ai/chat| AIGateway["AI Gateway (Circuit Breaker & Rate Limiter)"]
    end
    
    subgraph Backend ["Spring Boot 4.1.1 Application (Port 8080)"]
        Nginx -->|/api/v1/**| SpringAPI["Spring MVC REST Controllers"]
        SpringAPI -->|Stateless JWT & OTP Auth| SpringSecurity["Spring Security 6 (RBAC)"]
        SpringAPI -->|JPA / Hibernate / Flyway V1-V18| Postgres[("PostgreSQL 16 Database")]
        SpringAPI -->|Notification Outbox| OutboxQueue["Outbox Scheduler"]
    end
    
    subgraph AIEngine ["Autonomous AI Engine (Port 8082)"]
        AIGateway -->|Internal Token /v1/chat/completions| FastAPIEngine["FastAPI Engine (uvicorn)"]
        FastAPIEngine -->|Dense Vector Search| QdrantDB[("Qdrant Vector DB (Port 6333)")]
        FastAPIEngine -->|Local GGUF In-Process Stream| LlamaCpp["llama-cpp-python (Qwen 2.5 3B)"]
    end
    
    subgraph ExternalServices ["External Cloud Integrations"]
        OutboxQueue -->|Cloud API v21.0| MetaWhatsApp["Meta WhatsApp Cloud API"]
        SpringAPI -->|PG v2023-08-01| Cashfree["Cashfree Payment Gateway"]
        SpringAPI -->|Transactional OTP / Email| Resend["Resend Email API"]
        AIGateway -.->|Failover / Timeout > 3.5s| GroqCloud["Groq Cloud API (Qwen 3.8 27B)"]
    end
```

### Request Flow
1. **Public Web Traffic:** Nginx serves prerendered Next.js static pages with zero client-side hydration delay.
2. **Administrative & Donor Data:** Authenticated calls hit Spring Boot `/api/v1` via stateless JWTs or passwordless salted OTPs.
3. **AI Chat Sessions:** Client connects to `/api/ai/chat` via Server-Sent Events (SSE). The Next.js gateway checks rate limits and tries the local loopback FastAPI engine (`127.0.0.1:8082`). If local inference capacity saturates or exceeds 3.5s, it trips the circuit breaker and falls back to Groq Cloud seamlessly.
4. **Donation Lifecycle:** Cashfree or SBI UPI payments trigger transactional outbox records in PostgreSQL. The backend background scheduler dispatches signed WhatsApp notification templates and email receipts via Resend.

---

## 📂 Repository Layout

```
MAHAVIR TRUST/
├── src/                          # Next.js 16 App Router frontend application
│   ├── app/                      # Route handlers, layouts, error boundaries & 58 static pages
│   │   ├── (public)/             # Master institutional pages (about, governance, programmes, donate)
│   │   ├── portal/               # Authenticated donor portal (dashboard, donations, receipts, profile)
│   │   ├── admin/                # Fiduciary admin desk (scholarships, donors, whatsapp, audit-logs)
│   │   └── api/ai/               # AI gateway proxy (chat SSE streaming and health diagnostics)
│   ├── components/               # Accessible UI components, charts, and layout sections
│   ├── config/                   # Master institutional configuration & statutory constants
│   ├── context/                  # React contexts (LanguageContext, PortalAuthContext)
│   └── lib/                      # Type-safe API clients, route registry, and content truth registry
├── backend/                      # Java 21 / Spring Boot 4.1.1 enterprise backend
│   ├── pom.xml                   # Maven dependencies (Spring Security, JPA, Flyway, PostgreSQL)
│   └── src/main/
│       ├── java/                 # Controllers, Services, Repositories, DTOs, Entities & Security
│       └── resources/            # application.yml and Flyway migrations (V1 to V18)
├── mect-ai-engine/               # Independent Python 3.12 FastAPI AI inference engine (HIm)
│   ├── app/                      # FastAPI application, streaming endpoints, Qdrant RAG retriever
│   ├── systemd/                  # Linux systemd unit file with cgroup memory & CPU quotas
│   └── requirements.txt          # Python dependencies (llama-cpp-python, qdrant-client, fastembed)
├── ai-training/                  # Multilingual dataset curation & fine-tuning pipeline
│   ├── data/                     # 1,200 curated QA pairs across English, Odia, and Hindi
│   ├── notebooks/                # Google Colab / Unsloth QLoRA fine-tuning scripts for Qwen 2.5
│   └── scripts/                  # Synthetic dataset generator and validation split builders
├── public/                       # Verified photographic assets, emblem icons, and SEO files
│   ├── images/leadership/        # Er. Japabandhu Kampa authentic high-resolution portraits
│   └── images/programmes/        # Authentic documentary field photos of Balangir and Puintala
├── scripts/                      # Automated pre-push validation scripts
│   ├── check-confirm.mjs         # Build guard preventing unverified markers from reaching production
│   └── scan_secrets.mjs          # High-speed regex scanner checking 240+ commits for live secrets
├── compose.production.yaml       # Multi-container Docker Compose orchestration for production VPS
└── README_PROGRESS.md            # Comprehensive 18-step engineering discovery and audit state
```

---

## ⚡ Quick Start

### Prerequisites

| Component | Minimum Version | Recommended Tooling |
| :--- | :--- | :--- |
| **Node.js** | `v20.x` or `v22.x LTS` | `pnpm` or `npm` |
| **Java** | `Java 21 LTS` | Eclipse Temurin / OpenJDK 21 |
| **Maven** | `3.9.x` | Bundled Maven wrapper or system `mvn` |
| **Python** | `3.10+` (3.12 recommended) | `venv` or `conda` |
| **PostgreSQL** | `15+` (16 recommended) | Standalone service or Docker container |
| **Qdrant** | `1.7+` | Local standalone binary or Docker image |

---

### Option A: Minimal Mode (Frontend & Cloud AI Fallback)
Ideal for frontend UI development, content review, and testing without setting up PostgreSQL or local LLM weights:

```bash
# 1. Clone repository
git clone https://github.com/Himansu-Nayak/MECT.git
cd MECT

# 2. Configure environment
cp .env.example .env.local

# 3. Configure Groq API key in .env.local:
# GROQ_API_KEY=gsk_your_groq_key_here
# AI_ENGINE_MODE=cloud_only

# 4. Install dependencies and start development server
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option B: Full Local Stack (Frontend + Backend + AI Engine)

#### Step 1: Start PostgreSQL & Qdrant
Ensure PostgreSQL is running locally with database `mahavir_trust_dev`:
```bash
# Using Docker (optional quick local setup)
docker run --name mect-postgres -e POSTGRES_DB=mahavir_trust_dev -e POSTGRES_USER=mahavir_app -e POSTGRES_PASSWORD=local_secret -p 5432:5432 -d postgres:16-alpine
docker run --name mect-qdrant -p 6333:6333 -d qdrant/qdrant:latest
```

#### Step 2: Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*The backend will automatically start on `http://localhost:8080/api/v1` and apply Flyway migrations `V1` through `V18`.*

#### Step 3: Start Python AI Engine
```bash
cd ../mect-ai-engine
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8082
```

#### Step 4: Start Next.js Frontend
```bash
cd ..
npm install
npm run dev
```

---

## ⚙️ Configuration & Environment Variables

### Frontend Variables (`.env.local`)
| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | Canonical frontend domain for OpenGraph metadata and callbacks |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `http://localhost:8080/api/v1` | Spring Boot REST API base endpoint |
| `AI_ENGINE_MODE` | Yes | `local_with_fallback` | AI routing strategy: `local_only`, `cloud_only`, `local_with_fallback` |
| `LOCAL_AI_CHAT_URL` | Yes | `http://127.0.0.1:8082/v1/chat/completions` | Local Python AI streaming endpoint |
| `LOCAL_AI_HEALTH_URL` | Yes | `http://127.0.0.1:8082/v1/health` | Local Python AI health diagnostic probe |
| `INTERNAL_AI_SECRET` | Yes | None (min 32 chars) | **Secret:** Shared bearer token authenticating proxy to Python engine |
| `GROQ_API_KEY` | Optional | None | **Secret:** Cloud fallback API key for high-throughput streaming |
| `GROQ_MODEL` | Optional | `qwen/qwen3.8-27b` | Model name for Groq Cloud API fallback |

### Backend Variables (`backend/src/main/resources/application.yml`)
| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `SERVER_PORT` | No | `8080` | Spring Boot HTTP listening port |
| `DB_HOST` / `DB_PORT` | Yes | `localhost:5432` | PostgreSQL host and port |
| `DB_NAME` | Yes | `mahavir_trust_dev` | PostgreSQL database name |
| `DB_USERNAME` / `DB_PASSWORD` | Yes | `mahavir_app` | **Secret:** PostgreSQL database credentials |
| `JWT_SECRET` | Yes | None (min 256 bits) | **Secret:** HMAC-SHA256 signing key for admin JWT tokens |
| `JWT_ACCESS_VALIDITY` | No | `900` (15 mins) | JWT access token lifetime in seconds |
| `JWT_REFRESH_VALIDITY` | No | `604800` (7 days) | JWT refresh token lifetime in seconds |
| `OTP_HASH_PEPPER` | Yes | None | **Secret:** Salted pepper for donor OTP hashing |
| `RESEND_API_KEY` | Yes | None | **Secret:** Resend API key for transactional emails & OTPs |
| `CASHFREE_APP_ID` | Yes | None | Cashfree Payment Gateway App ID |
| `CASHFREE_SECRET_KEY` | Yes | None | **Secret:** Cashfree Client Secret Key |
| `CASHFREE_ENV` | Yes | `SANDBOX` | Cashfree environment: `SANDBOX` or `PRODUCTION` |
| `CASHFREE_WEBHOOK_SECRET` | Yes | None | **Secret:** Webhook signature verification secret |
| `WHATSAPP_ENABLED` | Yes | `false` | Master toggle for WhatsApp notification engine |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | None | Meta WhatsApp Business phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | Optional | None | **Secret:** Meta Graph API System User token |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN`| Optional | None | **Secret:** Webhook subscription challenge token |
| `WHATSAPP_APP_SECRET` | Optional | None | **Secret:** Meta App Secret for HMAC signature validation |

### AI Engine Variables (`mect-ai-engine/.env`)
| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `8082` | FastAPI loopback listening port |
| `INTERNAL_AI_SECRET` | Yes | None | **Secret:** Bearer token matching Next.js `INTERNAL_AI_SECRET` |
| `QDRANT_URL` | Yes | `http://127.0.0.1:6333` | Qdrant vector database URL |
| `COLLECTION_NAME` | Yes | `mect_knowledge_v1` | Vector collection name |
| `MODEL_PATH` | Yes | `models/qwen2.5-3b-mect-q4_k_m.gguf` | Primary local fine-tuned model path |
| `FALLBACK_MODEL_PATH` | No | `models/qwen2.5-1.5b-instruct-q4_k_m.gguf` | Lightweight local fallback weights |

---

## 📋 Routes & API Registry

### Selected Public Pages
- `/` — Master Institutional Homepage (Hero, 4 verified pillars, managing trustee desk, CSR, 80G tax benefits).
- `/about` — Trust origin, 12+ years Balangir heritage, founding charter, Clause XVI honorary governance.
- `/governance` — Board of Trustees roster, honorary governance declarations, and fiduciary committees.
- `/statutory-disclosures` — Public compliance vault (PAN, 12A, 80G, MCA CSR-1, NITI Aayog NGO Darpan).
- `/programmes` — Detailed operational documentation of the 4 verified community pillars.
- `/reports` — Certified annual financial statements and audited audit reports (FY 2021–22 through 2023–24).
- `/scholarships/apply` & `/scholarships/track` — Higher education grant application intake and live status tracking.
- `/donate` — Dual-channel donation checkout (Cashfree PG and SBI Scan & Pay QR).
- `/portal/login` & `/portal/dashboard` — Passwordless OTP donor dashboard, transaction history, and 80G tax receipt desk.

### Selected REST Endpoints (`/api/v1`)
- `POST /portal/auth/request-otp` & `POST /portal/auth/verify-otp` — Passwordless donor portal authentication.
- `GET /portal/donations/{id}/receipt` — Download verified Form 10BE / 80G tax certificate.
- `POST /donations/initiate` — Create donation intent and Cashfree checkout session.
- `POST /webhooks/payments/cashfree` — Cashfree payment confirmation webhook (HMAC signature verified).
- `POST /webhooks/whatsapp` — Meta WhatsApp delivery receipt & message webhook (HMAC signature verified).
- `GET /admin/dashboard/stats` — Real-time administrative KPI counters and queues.
- `GET /admin/whatsapp/outbox` & `POST /admin/whatsapp/retry/{id}` — WhatsApp notification outbox inspection and manual retry.

---

## 🔒 Security, Privacy & Governance

1. **Pre-Push Secret Scanning:** Every commit is audited by an automated scanner (`scripts/scan_secrets.mjs`) checking for private keys, AWS tokens, Meta App Secrets, and database credentials before publishing.
2. **Stateless JWT & BCrypt Hardening:** Administrative access requires Bearer JWTs signed with 256-bit secrets. Passwords use BCrypt hashing with cost factor 12.
3. **Cryptographic Webhook Handshakes:** Inbound webhooks from Cashfree, Razorpay, Resend (Svix), and Meta WhatsApp are verified in constant time using cryptographic HMAC signatures; unsigned requests are immediately rejected.
4. **Digital Personal Data Protection (DPDPA 2023):** Beneficiary student identities, donor PAN numbers, and telephone numbers are encrypted or masked. Explicit opt-in consent checkboxes govern all volunteer and scholarship forms.
5. **Vulnerability Disclosure:** If you discover a security vulnerability, please report it privately to `security@mect.org.in` or open a confidential GitHub Security Advisory. Do not submit public issues.

---

## 🚀 Production Deployment & Operations

The application is deployed on a **Hostinger VPS KVM 4** running Ubuntu 24.04 LTS:

### Automated Pre-Deployment Verification
Before deploying to production, run the automated verification suite:
```bash
# 1. Typecheck and linting
npx tsc --noEmit
npm run lint

# 2. Institutional marker check
npm run check:confirm

# 3. Secret scan
node scripts/scan_secrets.mjs

# 4. Production Next.js build
npm run build
```

### VPS Deployment Commands
```bash
# 1. SSH into VPS
ssh root@195.35.45.10

# 2. Create pre-deployment database snapshot
cd /opt/mect
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
docker compose -f compose.production.yaml --env-file .env.production exec -T postgres \
  pg_dump -U "${POSTGRES_USER:-mect_user}" -d "${POSTGRES_DB:-mect_db}" \
  > "/opt/mect/backups/mect_db_pre_deploy_${TIMESTAMP}.sql"

# 3. Pull latest unified release
git fetch origin
git checkout main
git pull origin main

# 4. Rebuild & restart containers
docker compose -f compose.production.yaml --env-file .env.production up -d --build

# 5. Verify Flyway V18 migration & backend startup
docker compose -f compose.production.yaml --env-file .env.production logs --tail=100 backend | grep -E "Flyway|Started BackendApplication"
```

For complete VPS deployment instructions and rollback procedures, see [MECT_PRODUCTION_DEPLOYMENT_AND_BRANCH_CONVERGENCE_REPORT.md](MECT_PRODUCTION_DEPLOYMENT_AND_BRANCH_CONVERGENCE_REPORT.md).

---

## 📜 Contributing & License

- **Contributing:** Fork the repository, create a feature branch (`feat/your-feature`), ensure `npm run lint` and `npm run check:confirm` pass cleanly, and open a PR against `main`.
- **Institutional Governance:** All fiduciary policies reflect Deed Clause XVI honorary governance under the stewardship of Settler Founder & Managing Trustee **Er. Japabandhu Kampa** and the Board of Trustees.
- **Copyright & License:** © 2013–2026 Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST). All rights reserved. Registered public charitable trust under Indian Trusts Act, 1882 (Deed No. 40311302194, Balangir, Odisha).
