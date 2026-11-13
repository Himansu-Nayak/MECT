# MECT PHASE 19 — INITIAL FORENSIC AUDIT & BASELINE VERIFICATION

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** https://mect.org.in/  
**Repository:** `MAHAVIR-TRUST`  
**Working Directory:** `c:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST`  
**Execution Timestamp:** 2026-11-13T11:42:00+05:30  
**Phase Objective:** Independent forensic baseline check prior to production release gate revalidation.

---

## 1. REPOSITORY AND ENVIRONMENT IDENTIFICATION

| Dimension | Verification Evidence |
| :--- | :--- |
| **Working Directory** | `c:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST` (Verified via `Get-Location`) |
| **Git Repository Root** | `c:\Users\himan\OneDrive\Desktop\MAHAVIR TRUST` |
| **Active Git Branch** | `motion-ui` (Verified via `git branch --show-current`) |
| **Current Commit SHA** | `cb5b55486e4d8105a321554e579c972492f6f62d` |
| **Production Baseline Commit** | `155dd0065734766b2f8688ffcb7b964225eea9e9` |
| **Working Tree State** | Contains verified MECT Phase 17/18 modifications and tests; zero unrelated project files |
| **OHO TECH Isolation** | **STRICTLY VERIFIED.** Zero references, zero cross-project modifications, and zero directory overlaps with OHO TECH. |

---

## 2. RUNTIME INFRASTRUCTURE BASELINE

| Component | Port / Socket | Version | Health State | Verification Method |
| :--- | :--- | :--- | :--- | :--- |
| **Spring Boot Backend** | `http://localhost:8080/api/v1` | 4.1.1 (Java 21.0.11) | `status: UP` | `GET /api/v1/actuator/health` |
| **Next.js Production Frontend** | `http://localhost:3000` | 16.4.3 | `HTTP 200` | `GET http://localhost:3000` |
| **PostgreSQL Database** | `127.0.0.1:5432` | 17.8 | Active | `psql -c "\dt"` (29 tables) |
| **Flyway Schema Migrations** | `public.flyway_schema_history` | V1 to V11 | Schema Up-To-Date | `DbValidate: 11 migrations validated` |

---

## 3. GIT WORKING TREE FORENSICS

### 3.1 Modified Tracked Files
- `backend/src/main/java/org/mahavirtrust/backend/config/SecurityConfig.java`: Public path mapping and stateless session controls.
- `backend/src/main/java/org/mahavirtrust/backend/controller/AdminDonorController.java`: Manual claim verification, payment configuration, and receipt PDF downloads.
- `backend/src/main/java/org/mahavirtrust/backend/controller/DonationController.java`: Manual SBI UTR intake and public donation status query.
- `backend/src/main/java/org/mahavirtrust/backend/controller/PortalAccountController.java`: Authenticated donor receipt downloads.
- `backend/src/main/java/org/mahavirtrust/backend/dto/donation/InitiateDonationRequest.java`: DTO fields for multi-channel intake.
- `backend/src/main/java/org/mahavirtrust/backend/entity/Donation.java` & `Role.java`: Data model adjustments for manual claims and institutional roles.
- `backend/src/main/java/org/mahavirtrust/backend/exception/GlobalExceptionHandler.java`: Standardized API error payloads.
- `backend/src/main/java/org/mahavirtrust/backend/repository/DonationRepository.java`: Query methods for claims and reconciliation.
- `backend/src/main/java/org/mahavirtrust/backend/service/donation/DonationLifecycleService.java`: Financial idempotency, claim approval, and 80G PDF receipt generation.
- `backend/src/main/java/org/mahavirtrust/backend/service/portal/PortalAccountService.java`: Profile completion, PAN masking, and retroactive guest donation claiming.
- Frontend components (`src/app/`, `src/components/`): Responsive design refinements, statutory ticker hydration fix, and institutional branding.

### 3.2 Untracked MECT Files
- `backend/src/resources/db/migration/V11__donation_ecosystem_cms_and_rbac.sql`: Complete schema for CMS pages, revisions, media assets, payment configuration, and manual SBI claims.
- `backend/src/main/java/.../CmsAdminController.java` & `PublicCmsController.java`: Headless CMS authoring and delivery endpoints.
- `reports/MECT_PHASE18_INDEPENDENT_ACCEPTANCE_REPORT.md`: Preceding acceptance deliverable.
- Visual and performance audit scratch artifacts.

**Isolation Check:** No uncommitted changes belong to any external client or third party. All work is 100% within the scope of MECT.

