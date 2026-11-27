# MECT PHASE 2.7G.3 — POST-PUSH AUTHENTICATION AUDIT & STAGING DEPLOYMENT SAFETY GATE REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** [https://mect.org.in/](https://mect.org.in/) (Strictly Frozen / Untouched)  
**Proposed Staging Frontend:** [https://staging.mect.org.in](https://staging.mect.org.in)  
**Proposed Staging Backend API:** [https://staging-api.mect.org.in](https://staging-api.mect.org.in)  
**GitHub Repository:** [https://github.com/Himansu-Nayak/MECT](https://github.com/Himansu-Nayak/MECT)  
**Target Feature Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Prior Verified Commit:** `393377dde11910a1d365436e51d924259fe5a5b9`  
**Cumulative Release Candidate SHA-256 Digest:** `767240f392e0d41274ad8be484ff15cd6a091f617c4f06335f08378437d705b1`  
**Audit Protocol:** Phase 2.7G.3 Post-Push Authentication Audit & Deployment Safety Gate  
**Audit Date:** 2026-11-27  
**Staging Gate Verdict:** **`REMEDIED & VERIFIED — PENDING OWNER VPS PROVISIONING AUTHORIZATIONS`**

---

## 1. INFRASTRUCTURE FREEZE & BOUNDARY COMPLIANCE

During this phase, all infrastructure operations remained completely frozen:
- **No VPS Connections:** Zero SSH connections to Hostinger VPS `200.97.161.128`.
- **No Remote Mutations:** Zero remote Docker, database, or Nginx commands executed.
- **No DNS/Network Mutations:** Zero modifications to Cloudflare DNS, Cloudflare Access, or firewall rules.
- **Production Isolation:** Production MECT (ports 3001, 8081, 5433) and OHO Tech (ports 3000, 8080, 5432) remain 100% operational and isolated.
- **Local Scope Only:** Inspection, authentication requirement alignment, mock safeguard verification, and automated quality gate executions were conducted strictly within the local development workspace.

---

## 2. GIT PUSH VERIFICATION

| Verification Item | Verified Value | Match Status |
| :--- | :--- | :---: |
| **Current Branch** | `feat/complete-website-redefinition-and-deduplication` | 🟢 MATCH |
| **Local HEAD SHA** | `393377dde11910a1d365436e51d924259fe5a5b9` | 🟢 MATCH |
| **Remote Tracking Branch** | `origin/feat/complete-website-redefinition-and-deduplication` | 🟢 MATCH |
| **Remote HEAD SHA** | `393377dde11910a1d365436e51d924259fe5a5b9` | 🟢 MATCH |
| **GitHub Presence** | Verified present on `origin` via `git rev-parse` | 🟢 MATCH |
| **Working Tree Status** | Clean (prior to follow-up correction files) | 🟢 MATCH |
| **Files Changed in 393377d** | 6 files (280 insertions(+), 129 deletions(-)) | 🟢 VERIFIED |
| **Release Manifest Outdated?** | YES — previous manifest `fbad3e96...` required update | 🟢 RE-CALCULATED |

---

## 3. DONOR AUTHENTICATION REQUIREMENTS AUDIT & DISCREPANCY ANALYSIS

The table below contrasts the 9 approved baseline donor authentication requirements against the state in commit `393377d` and the finalized remedy:

| # | Requirement | Commit 393377d State | Remediated Status | Implementation Details |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Full Name** | Implemented | 🟢 **COMPLIANT** | Captured on Screen 1 (`IDENTITY`) with 2-char minimum validation. Persisted to donor profile upon verification. |
| **2** | **Location** | Implemented | 🟢 **COMPLIANT** | Captured on Screen 2 (`LOCATION`) with popular regional city chips (Balangir, Bhubaneswar, etc.) and explicit skip option. |
| **3** | **Mobile Number** | Implemented | 🟢 **COMPLIANT** | Captured on Screen 3 (`CONTACT`) with `+91` prefix, 10-digit numeric constraint, and starting digit [6-9] validation. |
| **4** | **Compulsory Mobile OTP** | Implemented | 🟢 **COMPLIANT** | For the mobile journey, requesting OTP is mandatory; direct login bypass is impossible. |
| **5** | **Six-Digit OTP Interface** | Implemented | 🟢 **COMPLIANT** | Captured on Screen 4 (`OTP`) with 6 individual numeric inputs, paste support, auto-advance, and auto-submit upon 6th digit. |
| **6** | **Resend Countdown** | Implemented | 🟢 **COMPLIANT** | 60-second cooldown countdown timer with "Resend Code Now" activation when expired. |
| **7** | **Change Mobile Number** | Implemented | 🟢 **COMPLIANT** | Dedicated "Change" button on Screen 4 allowing instant navigation back to Screen 3 without state loss. |
| **8** | **Google Sign-In Alternative** | **REMOVED** (Discrepancy) | 🟢 **REMEDIED** | **Google Sign-In button and separator restored** on Screen 1 (`IDENTITY`). Both Google Sign-In and OTP channels resolve to the same underlying donor record via `GoogleOidcService` and `OtpAuthService`. |
| **9** | **Preserve Donation Programme & Amount** | Implemented | 🟢 **COMPLIANT** | In `DonationJourney.tsx`, selected programme, frequency, amount, and dedication message are retained throughout authentication. |

### Discrepancy & Remedy Summary:
- **Discrepancy in `393377d`:** Google Sign-In was removed from Screen 1 because the owner had mentioned "not google login" for an immediate test walkthrough. However, the architectural requirement requires Google Sign-In as an alternative sign-in method that resolves to the donor identity.
- **Preserved Feature:** Email OTP (introduced in `393377d`) was retained alongside Mobile OTP on Screen 3. This provides donors with full flexibility:
  1. **Option A:** Enter name and location, then verify via **Mobile Phone Number** (SMS OTP).
  2. **Option B:** Enter name and location, then verify via **Email Address** (Email OTP).
  3. **Option C:** Authenticate directly via **Google Sign-In** on Screen 1.
- All three methods cleanly resolve to authenticated donor profiles with full receipt and history tracking.

---

## 4. EMAIL, SMS, PAYMENT, AND WHATSAPP STAGING SAFEGUARDS AUDIT

The staging runtime and infrastructure safeguards were inspected in code and configuration:

| Service / Subsystem | Configured Staging Parameter | Technical Implementation & Verification Evidence | Safety Verdict |
| :--- | :--- | :--- | :---: |
| **SMS Provider** | `SMS_PROVIDER=MOCK` | `ConfigurableSmsService.java` explicitly recognizes `MOCK`. Outbound carrier HTTP requests to Twilio or MSG91 are bypassed; cryptographic dispatch log is emitted locally. | 🟢 **MOCK ENFORCED** |
| **Email Provider** | `RESEND_API_KEY=MOCK` | `ResendEmailService.java` updated to handle `MOCK`, `CONSOLE`, and `DEV_LOG`. Outbound calls to `https://api.resend.com/emails` are intercepted; local mock dispatch is returned. | 🟢 **MOCK ENFORCED** |
| **Outbound Email Block** | Zero real outbound email | Verified via unit test `test18_resendEmailService_mockApiKey_performsSafeLocalDispatch`: `ProviderDispatchResult.status() == "SENT"` with `mock_email_dispatch_*` ID. | 🟢 **SAFEGUARD VERIFIED** |
| **Deterministic OTP** | `OTP_DETERMINISTIC_TEST_ENABLED=true` | Enforced strictly in `OtpAuthService.isDeterministicTestAllowed`: requires single active profile `"staging"`, isolated staging database (`mect_staging_db`), and allowlisted synthetic targets (`+919438200001`–`05` or `synthetic.*@mect.org.in`). | 🟢 **POSITIVE GATE ENFORCED** |
| **Universal OTP Bypass** | None | Verified in `StagingOtpHardeningAndSafetyTests`: Production profiles (`prod`, `production`), default profiles, non-staging databases, and non-synthetic recipients strictly reject deterministic OTP with fail-closed security alerts. | 🟢 **ZERO BYPASS** |
| **Payment Gateway** | `PAYMENT_SANDBOX_MODE=true` | `CASHFREE_ENV=SANDBOX` configured in `compose.staging.yaml`. Zero real production Razorpay or Cashfree keys exist in staging configuration. Receipts render mandatory test watermark. | 🟢 **SANDBOX ENFORCED** |
| **WhatsApp Integration** | `WHATSAPP_ENABLED=false` | Explicitly disabled in `compose.staging.yaml` and `.env.staging.example`. Meta Cloud API calls are blocked. | 🟢 **DISABLED** |

---

## 5. LOCAL QUALITY GATE REGRESSION EVIDENCE

| Quality Gate | Exact Command Executed | Exit Code | Verified Outcome |
| :--- | :--- | :---: | :--- |
| **Unresolved Marker Audit** | `npm run check:confirm` | `0` | **PASS:** 0 unresolved markers found across codebase |
| **Secret Scan (Git & Working Tree)** | `npm run scan:secrets` | `0` | **PASS:** Zero tracked secrets in git history or tracked working tree |
| **TypeScript Compilation** | `npm run typecheck` (`tsc --noEmit`) | `0` | **PASS:** Zero TypeScript type errors |
| **ESLint Static Analysis** | `npm run lint` (`eslint .`) | `0` | **PASS:** Zero linting errors |
| **Next.js Production Build** | `npm run build` | `0` | **PASS:** 58/58 routes generated (Static, SSG, Dynamic) in 69s |
| **Staging Safety Tests** | `mvn test -Dtest=StagingOtpHardeningAndSafetyTests` | `0` | **PASS:** 18/18 test cases passed (0 failures, 0 errors, 0 skipped) |
| **Full Spring Boot Test Suite** | `mvn test` | `0` | **PASS:** 171/171 test cases passed across all test classes |
| **Docker Compose Config Validation** | `docker compose -f compose.staging.yaml config` | `0` | **PASS:** Valid stack schema, 1.50 CPU total cap, isolated network |

---

## 6. REPRODUCIBLE RELEASE CANDIDATE MANIFEST

The updated release candidate manifest catalogs the 23 source and configuration files defining the isolated staging deployment:

| SHA-256 Checksum | Size | File Path | Scope |
| :--- | :---: | :--- | :--- |
| `4f3de90fe8ca7ef86b14f20dcb853be38048c23ea94e01a1770f2a1861e534b4` | 4,754 B | `compose.staging.yaml` | Isolated staging Docker stack |
| `ebe40b6a14df0cd33f4656f895c7b8879505ccea8a54d2f5a27cb1b1cc724e5c` | 2,199 B | `.env.staging.example` | Staging environment template |
| `177dd9d5cbb19816161fd8fd0b2205cc466e3babc9187865de5812d6b401dbe4` | 5,260 B | `docker/nginx/staging.mect.org.in.conf` | Staging virtual host config |
| `a30d9effcbca3c297916263f38974fdf81e52a8cb785a74358659564428ec010` | 4,576 B | `backend/src/main/resources/application.yml` | Backend configuration |
| `ed8cbdc7ef0e74e6b5c56e67f62847c8147b28fe023908a147d6c52f60b275a7` | 30,245 B | `backend/.../portal/OtpAuthService.java` | Hardened OTP service |
| `f29e59b9d4a510b701fd0ea29d19a229783194a6a985374f3ff924a9eb0b87e3` | 8,148 B | `backend/.../notification/ResendEmailService.java` | Mock-enabled email provider |
| `d6fe09f9048ae4a0b0b616914795bd8feee959f9dd1b3d8d1d80103f50c99f40` | 9,754 B | `backend/.../receipt/ReceiptPdfService.java` | Staging watermark banner |
| `ed903fdd500b7ed9371ae88494864a70fc2c7b327e005c461466d6786f46c4b0` | 22,102 B | `backend/.../notification/EmailTemplateRenderer.java` | Email template renderer |
| `fb704e2cdd2bce2ab7cdc2ae322387017cc9b2d5e3f0c4a9065b88ca9e48b972` | 23,225 B | `backend/.../StagingOtpHardeningAndSafetyTests.java` | 18 unit/integration tests |
| `f6f215126a6cf490ead5bb63e5684904572bc1b9498c68219a3b8867291057c1` | 8,655 B | `src/config/org.ts` | Organizational configuration |
| `dd7fa1061287281ba2ada9d4f306ab61a8c37bce837859c4a578042503f962fb` | 16,741 B | `src/lib/content-registry.ts` | Central content registry |
| `dba0497902590fa7f0f2020986776cd691eec6cdb3166474c2336e9a005e1da8` | 18,621 B | `src/lib/ai/mect-knowledge.ts` | Institutional knowledgebase |
| `a2d4044a23adda899cf63ad580ac8e2b94af578ada9aa10e7318df52445b71e4` | 4,540 B | `src/app/page.tsx` | Deduplicated homepage |
| `123442cf781451c649c8b92920194ebd3a6f1697e2a77ab7f1d12a9b96252ded` | 8,216 B | `src/app/login/page.tsx` | Login route |
| `6eef02faa05d4cb2be1b0305f5da41a42a5a23da3c40ad3fa3422fa51302f0c1` | 8,406 B | `src/app/register/page.tsx` | Register route |
| `31132fa815500327fe7813766a98d7505e4258767eca6ef13862a97cf4838187` | 25,467 B | `src/app/faq/page.tsx` | Comprehensive FAQ |
| `1d7b115937bf83716f47f000a6813bbb2b2d94b0c3e12927f654ab5e369e44da` | 20,564 B | `src/app/portal/security/page.tsx` | Security settings |
| `31be1170389b97b791954f2c2a58b3dfb0f7dfba409b8d404b5f96ba30d9675a` | 28,978 B | `src/app/admin/demo/page.tsx` | Admin review demo |
| `4c1fde80115c1f7f2a4bf9e24ddf6b34fc5e5ccf1b93d34c76518554cb9daf9e` | 34,018 B | `src/components/auth/ProgressiveDonorAuth.tsx` | Multi-channel donor auth |
| `e6952e23537a7afa8ec6e8291892e79ad52781660c9f5f177a8e2b99eb4f39ae` | 49,353 B | `src/components/donation/DonationJourney.tsx` | Donation journey component |
| `ecb1a6ab9733b0bad39e75f70789a1423c3b3e736d763b5e9387c6f365aa41bf` | 10,798 B | `OWNER_DECISIONS.md` | Authoritative decision register |
| `de4d6c4ab7106567e10824fcce88f75fffa427b09b5a06dae49197664aaf98a9` | 7,539 B | `content/todo-confirm.md` | Verification checklist |
| `021827f86fcbbfb3bcb66355f7ac00bcbfccba200f84484083dcccfa25f255c0` | 1,081 B | `.gitignore` | Exclusion rules |

**Updated Cumulative Release Candidate Digest:**
```text
767240f392e0d41274ad8be484ff15cd6a091f617c4f06335f08378437d705b1
```

---

## 7. OUTSTANDING OWNER PREREQUISITES & DEPLOYMENT PERMISSION STATUS

| Item | Prerequisite Scope | Status | Notes |
| :---: | :--- | :---: | :--- |
| **1** | **Hostinger VPS IPv4** | 🟢 `CONFIRMED` | Confirmed by owner as `200.97.161.128`. |
| **2** | **Cloudflare DNS A Records** | 🟢 `CONFIRMED` | Confirmed by owner as active with Orange Cloud proxy enabled. |
| **3** | **Cloudflare Zero Trust Access** | 🟡 `PENDING` | Owner should configure edge Access policies protecting `staging` and `staging-api`. |
| **4** | **Google Cloud Console Origin** | 🟡 `DEFERRED / OPTIONAL` | `https://staging.mect.org.in` can be added to Google OAuth JavaScript origins. |
| **5** | **SSH Setup Authorization** | ⚠️ `PENDING OWNER APPROVAL` | Permission to connect via SSH to `/opt/mect-staging` on `200.97.161.128`. |
| **6** | **Docker Provisioning Authorization** | ⚠️ `PENDING OWNER APPROVAL` | Permission to run `docker compose -f compose.staging.yaml up -d --build`. |
| **7** | **Nginx Virtual Host Authorization** | ⚠️ `PENDING OWNER APPROVAL` | Permission to install `staging.mect.org.in.conf`, test (`nginx -t`), and reload. |

---

## 8. STAGING DEPLOYMENT VERDICT

```text
================================================================================
FINAL VERDICT: REMEDIATED & READY — PENDING OWNER DEPLOYMENT PERMISSION
================================================================================
1. The code discrepancy in 393377d has been corrected: Google Sign-In is restored,
   and Mobile OTP and Email OTP are both fully operational.
2. MOCK Email and SMS safeguards are verified in code and unit tests.
3. All 8 quality gates passed with exit code 0; all 171 backend tests passed.
4. Working tree is clean and ready for follow-up push to feat branch.
5. In accordance with strict safety rules, NO VPS connection or deployment
   will be initiated until the owner grants the 3 required execution permissions.
================================================================================
```
