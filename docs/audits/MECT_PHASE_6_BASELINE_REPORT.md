# MECT — PHASE 6: REPOSITORY AND ENVIRONMENT BASELINE REPORT
**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT.git`  
**Active Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Production Baseline Commit on `main`:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (`99c8b1c`)  
**Current HEAD Commit:** `9cced21`  
**Report Date:** 25 November 2026

---

## 1. Repository Identity & Working Branch
- **Remote Origin:** `https://github.com/Himansu-Nayak/MECT.git`
- **Active Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Branch Tracking:** Synchronized with remote `origin/feat/complete-website-redefinition-and-deduplication`
- **Production Baseline on `main`:** `99c8b1c` (untouched)

---

## 2. Working Tree & Commit History
- **HEAD Commit:** `9cced21` — `fix(audit): Gate 0 Phase 5.1 closeout, contact reconciliation, and expanded 8-route 80-eval suite`
- **Recent Commit Progression:**
  - `9cced21`: Gate 0 closeout & contact configuration reconciliation
  - `cc2523a`: Phase 5 report & test artifacts
  - `c35666f`: Route 6 `/contact` deduplication and canonical wiring
  - `07cdbb5`: Route 5 `/donate` static wiring and tax disclosure
  - `39717ee`: Route 4 `/campaigns` deduplication & statutory wiring
  - `302761c`: Route 3 `/programmes` deduplication & statutory strip
  - `2860680`: Route 2 `/governance` deduplication & credentials
  - `f473c5f`: Route 1 `/about` deduplication & JSON-LD
  - `93e0d83`: Phase 4 evidence corrections & deed book wording
  - `d8bb1ac`: Phase 4 homepage deduplication & visual acceptance
- **Working Tree State:** Clean code files. Only local test PNG screenshots and audit JSON files generated during local headless acceptance runs.

---

## 3. Technology Stack & Environment
- **Frontend Framework:** Next.js 16.4.6 (App Router, Turbopack/Webpack hybrid, React 19 / TypeScript)
- **CSS / Styling:** Tailwind CSS v4 with custom brand tokens (Option A: Forest Deep `#0B3B24`, Temple Gold `#C5A059`, Warm Ivory `#FDFBF7`, Terracotta `#A3482A`)
- **Backend Architecture:** Java 21, Spring Boot 3.3.x, Maven, Flyway (V18), PostgreSQL, Docker Compose
- **Testing Architecture:**
  - TypeScript compiler (`tsc --noEmit`)
  - ESLint (`eslint .`)
  - Playwright Chromium Headless (`playwright` v1.56+)
  - Custom test suites:
    - `scripts/audit_links_and_ctas.mjs`: Link & CTA destination audit (8 routes, 585 links)
    - `scripts/verify_feature_branch_local.mjs`: Responsive layout & visual acceptance (8 routes × 10 viewports = 80 evaluations)
- **Local Ports & Isolation:**
  - Next.js Standalone: `http://127.0.0.1:3005`
  - Zero live production services accessed; all tests use synthetic test inputs and mocks.

---

## 4. Known Issues & Baseline Metrics
- **TypeScript:** 0 errors
- **ESLint:** 0 errors (5 pre-existing warnings in utility chart and portal components)
- **Production Build:** 58/58 routes prerendered cleanly (`npm run build`)
- **Broken Links:** 0 broken links across 585 inventoried anchors
- **Layout Overflow:** 0px across all 10 device viewports on all 8 tested core routes
- **Safety Constraints:** `WHATSAPP_ENABLED=false` strictly preserved. Zero modifications to live production databases, DNS, Nginx, or real payment gateways.
