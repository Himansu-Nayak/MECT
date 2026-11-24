# MECT — FINAL GATE 19.10.3: DONOR PORTAL ROUTE METADATA & FEATURE GATING CONSISTENCY REPORT

**Document ID:** `MECT-GATE-19-10-3-PORTAL-CONSISTENCY`  
**Execution Timestamp:** `2026-11-25T02:24:00+05:30`  
**Production Baseline:** `origin/main` at `99c8b1c4cb400be82c02b724c1bfc87a2b9da439`  
**Head Commit:** `edfc8bc58335e92960c86eccd0a1b1235ad986ae`  
**Feature Flag Status:** `ENABLE_DONOR_PORTAL=false` (Default Safe Configuration)  
**Overall Status:** **VERIFIED PASS**

---

## 1. Executive Summary & Verification Mandate

Gate 19.10.3 conducts an exhaustive inspection of route metadata, navigation links, sitemap entries, and backend security boundaries relating to the Donor Portal.

The default configuration of the repository must maintain the Donor Portal in a safe, dormant state (`ENABLE_DONOR_PORTAL=false`) until explicitly authorized for production release.

---

## 2. Seven-Point Verification Assessment

### 2.1 Intended Safe 404 Response While Disabled
- **Verification Method:** Source code inspection of route entrypoints and live HTTP probing.
- **Implementation:**
  - `src/app/portal/layout.tsx`:
    ```typescript
    if (!isDonorPortalEnabled()) {
      notFound();
    }
    ```
  - `src/app/login/page.tsx` & `src/app/register/page.tsx`:
    ```typescript
    if (!isDonorPortalEnabled()) {
      notFound();
    }
    ```
- **Result:** **VERIFIED PASS** — Routes `/login`, `/register`, and all `/portal/*` subroutes cleanly serve Next.js's standard HTTP 404 page.

---

### 2.2 Header and Footer Link Isolation
- **Verification Method:** Inspecting DOM conditionals in `src/components/Header.tsx` and `src/components/Footer.tsx`.
- **Implementation:**
  - In `Header.tsx`, both desktop navigation and mobile drawer account links are conditioned on `{isDonorPortalEnabled() && (...)}`.
  - In `Footer.tsx`, supporter account links ("Donor Sign In", "Create Supporter Account", "Donor Portal & Receipts") are wrapped in `{isDonorPortalEnabled() && (...)}`.
- **Result:** **VERIFIED PASS** — Zero dead links or disabled portal routes are exposed in navigation when the portal is disabled.

---

### 2.3 Homepage CTA Isolation
- **Verification Method:** Code inspection of `src/app/page.tsx` and all included section components (`CinematicHero.tsx`, `AuditedImpactTelemetrySection.tsx`, `TailoredParticipationPathwaysSection.tsx`).
- **Implementation:** All call-to-action buttons strictly target `/donate`, `/programmes`, `/scholarships/apply`, `/volunteer`, and `/contact`.
- **Result:** **VERIFIED PASS** — Zero portal actions or links exist on the homepage.

---

### 2.4 Sitemap Exclusion
- **Verification Method:** Inspection of `src/app/sitemap.ts`.
- **Implementation:** The sitemap generator registers 22 canonical public routes and 3 SSG stories. Neither `/login`, `/register`, nor any `/portal/*` path is present in the `entries` array.
- **Result:** **VERIFIED PASS** — Disabled portal routes are completely excluded from public search engine indexes.

---

### 2.5 Route Metadata Registry Reconciliation
- **Discrepancy Identified:** In `src/lib/routes.ts`, `LOGIN` and `REGISTER` had stale metadata properties (`inFooter: true, inSitemap: true, status: "live"`), creating a contradiction with runtime behavior.
- **Remediation Executed:** Corrected `LOGIN`, `REGISTER`, and `PORTAL_DASHBOARD` in `src/lib/routes.ts` to:
  ```typescript
  inNav: false,
  inFooter: false,
  inSitemap: false,
  priority: 0.0,
  status: "planned",
  ```
- **Result:** **VERIFIED PASS** — Stale route-registry metadata is reconciled without breaking underlying components.

---

### 2.6 Environment Variable Default Safety
- **Verification Method:** Inspection of `src/config/portal.ts`.
- **Implementation:**
  ```typescript
  export function isDonorPortalEnabled(): boolean {
    const v1 = (process.env.NEXT_PUBLIC_ENABLE_DONOR_PORTAL || "").trim().toLowerCase();
    const v2 = (process.env.ENABLE_DONOR_PORTAL || "").trim().toLowerCase();
    return v1 === "true" || v2 === "true";
  }
  ```
- **Result:** **VERIFIED PASS** — If the environment variables are absent, empty, or set to any value other than `"true"`, the portal remains strictly disabled. Accidental activation is impossible.

---

### 2.7 Independent Backend API Protection
- **Verification Method:** Inspection of Spring Boot `SecurityConfig.java`.
- **Implementation:** Protected portal endpoints (`/api/portal/**`, `/api/donor/**`) require JWT Bearer authentication with `ROLE_DONOR` or `ROLE_USER`.
- **Result:** **VERIFIED PASS** — Even if a client sends direct HTTP requests to backend APIs, unauthorized requests are rejected with HTTP 401/403 independent of frontend UI state.

---

## 3. Conclusion

The Donor Portal route metadata and runtime behavior are fully aligned. The default dormant state is robustly enforced across the frontend, route registry, sitemap, and backend security perimeter.

**Status:** **VERIFIED PASS**
