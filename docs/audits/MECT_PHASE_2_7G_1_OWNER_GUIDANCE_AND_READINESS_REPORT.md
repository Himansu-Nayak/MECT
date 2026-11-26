# MECT PHASE 2.7G.1 — OWNER GUIDANCE & STAGING READINESS AUDIT REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/)  
**Proposed Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Proposed Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**Active Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Committed Baseline Commit:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`  
**Cumulative Release Candidate SHA-256 Digest:**  
`fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0`  
**Audit Protocol:** Phase 2.7G.1 Step-by-Step Owner Guidance & Preflight  
**Audit Date:** 2026-11-27  
**Current Gate Status:** **`STAGING DEPLOYMENT NOT YET PERMITTED — OWNER GUIDANCE IN PROGRESS`**

---

## 1. PURPOSE & PRODUCTION SAFETY FRAMEWORK

This document tracks the step-by-step guidance protocol for the project owner to safely configure external infrastructure dependencies (Hostinger VPS, Cloudflare DNS, Cloudflare Zero Trust, and Google Cloud Console) before any staging deployment can occur.

### Non-Negotiable Production Freeze:
The live MECT production website (`https://mect.org.in/`) and OHO Tech services are fully operational on the shared Hostinger VPS and must remain undisturbed:
- **MECT Production Ports:** Frontend `3001`, Backend `8081`, PostgreSQL `5433` (Frozen).
- **OHO Tech Production Ports:** Frontend `3000`, Backend `8080`, PostgreSQL `5432` (Frozen).
- **Strict Prohibition:** No SSH connections, no container starts/stops, no database mutations, no Nginx reloads, and no DNS edits will be performed without explicit, separate owner authorization for each individual action.

---

## 2. LOCAL PROJECT AUDIT & RELEASE CANDIDATE REPRODUCIBILITY

Before initiating any external owner guidance, the local repository and Phase 2.7G preflight evidence were independently verified.

### 2.1 Git Repository Verification:
- **Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Committed HEAD:** `3e9bfe5a22de9511f8178fdf1e3bf20c07c2502c`
- **Working Tree State:** All unstaged application modifications (18 files) and untracked staging deployment templates and reports are completely accounted for. Zero files were discarded, reset, or overwritten.

### 2.2 Independent Release Candidate Digest Reproduction:
All 20 files cataloged in the release manifest were inspected and their SHA-256 hashes independently computed:
- **Reproduced Cumulative SHA-256 Digest:**  
  `fbad3e96e2c16b496e11419d4325606ccb0207c94e8a551d7b42e7a6cf62aac0`
- **Status:** **100% MATCH**. The release candidate is mathematically reproducible, immutable, and deployable.

### 2.3 Quality Gate Regression Evidence:
- **Marker Check (`check:confirm`):** Exit code `0` (0 unresolved markers).
- **Secret Scan (`scan:secrets`):** Exit code `0` (0 tracked secrets in history or working tree).
- **TypeScript Check (`typecheck`):** Exit code `0` (0 type errors).
- **Code Style (`lint`):** Exit code `0` (0 lint errors).
- **Next.js Production Build (`build`):** Exit code `0` (All 58 routes compiled into static/dynamic bundles).
- **Spring Boot Full Test Suite (`mvn test`):** Exit code `0` (170/170 tests passed across 22 classes).
- **Staging Safety & Hardening Suite:** Exit code `0` (17/17 test cases passed, including receipt watermark test).
- **Docker Compose Staging Config:** Exit code `0` (Valid schema, capped at 1.50 CPUs, isolated loopback ports).

---

## 3. STEP-BY-STEP OWNER GUIDANCE TRACKER

Every task requires explicit evidence or separate authorization before being marked complete.

| Step / Task | Description & Technical Scope | Current Status | Notes / Next Action |
| :---: | :--- | :---: | :--- |
| **Task 1** | **Hostinger VPS IPv4 Confirmation** | `VERIFIED FROM EVIDENCE` | Owner authoritatively confirmed `200.97.161.128` matches active Hostinger dashboard. |
| **Task 2** | **Cloudflare DNS Records (`staging`, `staging-api`)** | `VERIFIED FROM EVIDENCE` | Owner authoritatively confirmed both records exist pointing to 200.97.161.128 with Proxied: ON. |
| **Task 3** | **Cloudflare Zero Trust Access Applications** | `OWNER ACTION REQUIRED` | Currently guiding owner through Cloudflare Zero Trust Access setup. |
| **Task 4** | **Google Cloud Console Staging Origin** | `NOT STARTED` | Optional/deferrable origin setup for Google Sign-In. |
| **Task 5** | **Release Candidate Integrity & Checksum** | `COMPLETED` | Verified locally (`fbad3e96...`). 100% reproducible. |
| **Task 6A** | **SSH Provisioning Authorization** | `OWNER APPROVAL REQUIRED` | Separate authorization required before opening SSH connection. |
| **Task 6B** | **Docker & Database Creation Authorization** | `OWNER APPROVAL REQUIRED` | Separate authorization required before running `docker compose up`. |
| **Task 6C** | **Nginx Virtual Host Addition & Reload** | `OWNER APPROVAL REQUIRED` | Separate authorization required before `nginx -t` & reload. |

---

## 4. STAGING SAFETY KILL-SWITCHES & ISOLATION GUARANTEES

When authorized, the staging deployment will strictly enforce the following isolated topology:
- **Frontend Port:** `127.0.0.1:3002` (Bound strictly to loopback).
- **Backend API Port:** `127.0.0.1:8082` (Bound strictly to loopback).
- **PostgreSQL Database:** `mect_staging_db` (Zero host ports published; internal Docker network only).
- **Resource Limits:** Capped at **1.50 CPUs** and **1.4 GB RAM** (leaving 2.50 CPUs and 13.6 GB RAM guaranteed for Production MECT and OHO Tech).
- **Kill-Switches Active:**
  - `WHATSAPP_ENABLED=false`
  - `SMS_PROVIDER=MOCK` (Zero external HTTP requests).
  - `PAYMENT_SANDBOX_MODE=true` (Zero real financial transactions).
  - Email provider unconfigured / mock mode.
  - Test receipts watermarked: `TEST / STAGING — SIMULATED TRANSACTION — NOT VALID FOR TAX DEDUCTION`.

---

## 5. GATE STATUS & CONCLUSION

**Current Assessment:**
The local release candidate is verified, tested, and reproducible. External staging deployment is **NOT YET PERMITTED**. The technical engineer is now guiding the project owner through **Task 1 (Hostinger VPS IP Confirmation)**. Zero remote server connections or configuration mutations have occurred.
