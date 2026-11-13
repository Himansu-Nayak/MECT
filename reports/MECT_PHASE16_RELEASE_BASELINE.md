# MECT Phase 16.1 — Release Baseline & Git Forensics

**Timestamp:** 2026-11-12  
**Repository:** `https://github.com/Himansu-Nayak/MAHAVIR-TRUST.git` (`MECT ONLY`)  
**Isolation Verified:** OHO TECH (`oho_tech` PM2 `id: 0`, `ohotech_db`, `ohotechn.com`) is completely outside deployment scope.

## 1. Git Branch, HEAD & Baseline Comparison

| Item | Observed Value |
| :--- | :--- |
| Current Local Branch | `motion-ui` |
| Local `HEAD` Commit | `cb5b554` (`feat(motion): upgrade Ask HIm(AI) with Motion AnimatePresence, loading dots, citations, and Statutory Disclosures disclaimer [M-M8]`) |
| `origin/main` Commit | `a630ec7` (`Merge pull request #2 from Himansu-Nayak/feat/multi-sector-ngo-repositioning`) |
| Production Baseline Referenced | `155dd00` (`feat(mect): integrate Cashfree PG v2023-08-01, V10 schema, webhook security & admin reconciliation`) |
| Live VPS Frontend Deployed SHA (`/opt/mect/frontend`) | `9c7033e44313395997f57f8b1197c538d46102ba` (`feat/multi-sector-ngo-repositioning`) |
| Live VPS Backend Flyway State (`mect_db`) | `V1`–`V10` applied (`success = t`, rank `10` = `cashfree payment gateway schema`) |

## 2. Phase 15 Verification Evidence Review

Reviewed `reports/MECT_PRODUCTION_VERIFICATION.md` and `reports/MECT_DONATION_ECOSYSTEM_FINAL_REPORT.md`:
- Backend Maven suite: `58/58` tests passed (`0` failures, `0` errors, `0` skipped).
- Frontend `npm run typecheck`: `0` errors.
- Frontend `npm run lint`: `0` errors (`4` pre-existing chart hook warnings).
- Frontend `npm run build`: `40/40` routes compiled cleanly.
- `npm run audit:motion`: `TOTAL FAILURES: 0` (`312.35 KB` gzipped, delta `32.60 KB`).
- `npm run audit:site`: `FORBIDDEN_TEXT: 0`, `NON_200_PAGE: 0`, `BROKEN_INTERNAL_HREF: 0`, `BROKEN_FRAGMENT: 0`, `CANONICAL_MISMATCH: 0`, `MULTIPLE_H1: 0` (14 pre-existing `IMAGE_ALT_ISSUE` findings on `/` hero images).
- Playwright smoke: `0` console/page errors, `0px` mobile overflow (`320px`, `360px`, `390px`), and full 5-step `/donate` progression verified.
- **P0 Status:** Zero unresolved P0 defects blocking staging deployment.

## 3. Uncommitted Workspace Changes (Preserved Intact)

- **Backend modified/new:** `SecurityConfig.java`, `Role.java`, `Donation.java`, `DonationRepository.java`, `InitiateDonationRequest.java`, `ReviewManualSbiClaimRequest.java`, `SubmitManualSbiUtrRequest.java`, `UpdatePaymentConfigurationRequest.java`, `DonationController.java`, `PortalAccountController.java`, `AdminDonorController.java`, `CmsAdminController.java`, `PublicCmsController.java`, `DonationLifecycleService.java`, `PortalAccountService.java`, `PaymentConfigurationService.java`, `CmsAndMediaService`, `GlobalExceptionHandler.java`, `DuplicateResourceException.java`, new entities/repos (`PaymentConfiguration`, `ManualBankTransferClaim`, `ContentPage`, `ContentRevision`, `MediaAsset`), `V11__donation_ecosystem_cms_and_rbac.sql`, `DonationEcosystemIntegrationTests.java`.
- **Frontend modified/new:** `src/app/donate/page.tsx`, `src/components/sections/UnifiedDonationExperience.tsx`, `src/app/portal/dashboard/page.tsx`, `src/app/admin/AdminClientLayout.tsx`, `src/app/admin/page.tsx`, `src/app/admin/donors/page.tsx`, `src/app/admin/settings/`, `src/app/admin/cms/`, `src/app/admin/media/`, `src/app/page.tsx`, `src/app/faq/page.tsx`, `src/components/sections/{FreeEducationSection,SmileFundraisingSection,SbiDonationSection}.tsx`, `src/lib/portal-api.ts`.
- **Untracked local user assets (excluded from release staging bundle):** `src/WhatsApp Image*`, `src/NGO PIC*`, `src/NOG PIC1.jpg`, `src/MECT QRCODE.jpeg`, `src/BPUT EXAMS - RESULTS.pdf`, `MECT Proposal - Jindal_compressed (1).pdf`, `scratch/`.

## 4. Migration V11 & Secret Hygiene Verification

- **Migration File:** `backend/src/main/resources/db/migration/V11__donation_ecosystem_cms_and_rbac.sql`
- **SHA-256 Checksum:** `67E1F6EF91CB76E2A034ED7375FFFFE72188D2943C95FFEB85B104FF855582DB`
- **Tracked `.env` Files in Git:** Only `.env.example`, `backend/.env.example`, `mect-ai-engine/.env.example` (zero live `.env` secrets committed).

