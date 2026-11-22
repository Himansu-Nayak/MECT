# MECT — FINAL MASTER EXECUTION BASELINE
**Document ID:** MECT-DOC-2026-FMEB-01  
**Project:** MAHAVIR EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Website:** https://mect.org.in  
**Timestamp:** 2026-11-22T16:15:00+05:30  
**Target Environment:** Hostinger VPS KVM 4, Ubuntu 26.04 LTS, Docker, Nginx  

---

## 1. Executive Summary & Objective

This baseline audit document establishes the verified, indisputable starting state of the MECT codebase for production release authorization. All claims, metrics, commit references, and configuration states documented herein are derived from direct local command execution and repository forensics.

---

## 2. Git Repository & Working Tree State

| Parameter | Verified Value | Evidence |
| :--- | :--- | :--- |
| **Current Branch** | `fix/audit-loop` | `git branch --show-current` -> `fix/audit-loop` |
| **Latest Commit Hash** | `ca1c8175c038f79a22801d29f1278bd396116d16` | `git log -1` |
| **Commit Message** | `fix(backend): configure SimpleClientHttpRequestFactory and surefire bytebuddy agent to pass all 127 tests` | Author: Himansu-Nayak, Date: Sun Nov 22 15:59:14 2026 +0530 |
| **Working Tree Status** | Clean | `git status -s` -> 0 unstaged/untracked files |
| **Upstream Remote** | `origin/fix/audit-loop` (push restricted by release gate) | Release lock active: No git push permitted prior to Owner authorization |

---

## 3. Toolchain & Runtime Environment Verification

| Tool / Runtime | Location | Verified Version | Verification Output |
| :--- | :--- | :--- | :--- |
| **Java Development Kit** | `C:\Program Files\Java\jdk-21.0.11` | Oracle JDK 21.0.11 (build 21.0.11+9-LTS-328) | Java 21 LTS 64-bit Server VM |
| **Apache Maven** | `C:\Program Files\Maven\apache-maven-3.9.11\bin\mvn.cmd` | Apache Maven 3.9.11 | Maven 3.9.11 (3e54c93a704957b63ee3494413a2b544fd3d825b) |
| **Node.js** | System Path (`node`) | Node.js v20.18.0 | Verified runtime for Next.js 16.4.6 SSR / SSG |
| **Next.js Engine** | `node_modules/next` | 16.4.6 (webpack) | App Router with 57 static routes compiled |
| **Spring Boot Framework** | `backend/pom.xml` | Spring Boot 4.1.1 (Spring Framework 7.0.9) | Verified in test logs |

---

## 4. Scope Boundary & Owner Security Exception Acceptance

### 4.1 Scope Constraints Enforced
- **Zero Push Enforcement:** No `git push` has been or will be executed.
- **Zero Remote SSH Connectivity:** No SSH connections or probing of VPS endpoints initiated.
- **Strict Masking:** Sensitive secrets printed at most with 4-character prefixes (`gsk_...`, `cfsk_...`, `rzp_...`). Statutory bank account numbers masked as `3334****498`.

### 4.2 Historical Groq Key Revocation Status
- **Owner Scope Decision:** The Owner explicitly excluded Groq key revocation from execution scope.
- **Classification:** Formally recorded as an **Owner-Accepted Unresolved Security Exception**.
- **Residual Risk Analysis:** 
  - Provider Type: 3rd-party LLM inference provider (Groq).
  - Scope of Key: Text completion API calls only (`gsk_...`).
  - Access Boundary: The Groq key has **ZERO** access to the PostgreSQL database, donor PII, administrative credentials, or banking infrastructure.
  - Risk Level: **LOW (Owner Accepted)**.

---

## 5. Architecture & Stack Inventory

| Component | Technology | Role | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 16.4.6 (App Router), React 19, Tailwind CSS | Public site, donor workflows, static pages | Build verified (57/57 routes) |
| **Backend** | Java 21, Spring Boot 4.1.1, Spring Security, Hibernate 7.4.5 | Core API, donation lifecycle, audit logs | 127/127 tests passed |
| **Database** | PostgreSQL 16 (H2 in test mode) | Relational persistence | Migrations V1–V17 applied |
| **Database Migrations** | Flyway Community Edition | Schema evolution & versioning | 17/17 migrations verified |
| **Inference Sidecar** | Python FastAPI (`mect-ai-engine`) | Local AI assistance | Sandboxed & isolated |
| **Reverse Proxy** | Nginx | TLS termination, rate limiting, security headers | Hardened config ready |
| **Container Runtime** | Docker & Docker Compose | Multi-container orchestration | `compose.production.yaml` validated |

---

## 6. Baseline Verification Sign-off

The execution baseline is verified and locked as of commit `ca1c817`. All technical pre-conditions for report generation and release gate validation have been met.
