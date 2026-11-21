# MECT RELEASE READINESS SPECIFICATION & GATE MATRIX

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Production Domain:** `https://mect.org.in/`  
**Target VPS:** `<VPS_HOST>` / `<PROD_HOSTNAME>` (`<PROD_VPS_IP>`)  
**Release Branch:** `fix/audit-loop`  
**Classification:** Confidential — Fiduciary Production Gate Document  
**Last Revised:** 2026-11-21 (Loop 9)

---

## 1. Release Readiness Gate Matrix

| Gate | Status | Evidence (File or Command) | Blocks Release? |
| :--- | :---: | :--- | :---: |
| **Bank details vs physical passbook** | **OWNER** | `src/config/org.ts`, physical passbook inspection required per Gate 1 | **YES** |
| **Helpline phone number (+91 94371 23616)** | **OWNER** | `OWNER_DECISIONS.md` Item 2; telecom contract / SIM verification | **YES** |
| **Darpan ID (OR/2024/0466491)** | **OWNER** | `OWNER_DECISIONS.md` Item 4; NITI Aayog portal certificate | **YES** |
| **Chartered Accountant tax review** | **OWNER** | `OWNER_DECISIONS.md` Item 8; CA signoff on 12A & 80G validity notes | **YES** |
| **Groq API key revoked (commit e995fbb)** | **OWNER** | `OWNER_DECISIONS.md` Item 1; Groq console revocation confirmation | **YES** |
| **Java compile & backend test suite** | **PASS** | `mvn -q -DskipTests compile` (0 errors), `mvn test` (127/127 passed) | **NO** |
| **End-to-end backend test with Postgres** | **NOT VERIFIED** | Local Docker daemon unavailable; mandatory staging test in `DEPLOYMENT_CHECKLIST.md` Step 5 | **YES** |
| **Notification path (Resend / SMTP)** | **OWNER** | `OWNER_DECISIONS.md` Item 14; database intake queue verified | **NO** |
| **Rendered tax crawl (0 class b phrases)** | **PASS** | `scripts/verify_rendered_tax.mjs` (110 class a neutral, 0 class b promotional) | **NO** |
| **SHA-256 receipt claim honesty** | **PASS** | Removed unprinted crypto claims; replaced with "numbered receipt" (commit `143d42a`) | **NO** |
| **Rendered verification suite (crawl & links)** | **PASS** | `npm run verify` (`scripts/verify_rendered.mjs`, 0 broken links/anchors) | **NO** |
| **Performance medians (LCP & CLS)** | **PASS** | `npm run verify:perf` (`scripts/verify_perf.mjs`, 3-run Lighthouse medians) | **NO** |
| **Accessibility compliance (Axe Core)** | **PASS** | `scripts/verify_rendered.mjs` (0 critical or serious Axe violations) | **NO** |
| **Secret scan (commits & working tree)** | **PASS** | `npm run scan:secrets` (`scripts/scan_secrets.mjs`, 0 tracked secrets) | **NO** |
| **Privacy review (intake data policy)** | **OWNER** | `src/app/privacy/page.tsx`, `OWNER_DECISIONS.md` Item 15; legal signoff | **YES** |
| **Real field photography replacements** | **OWNER** | `audit/PHOTO_INVENTORY.md`, `OWNER_DECISIONS.md` Item 9 | **NO** |
| **Real signed annual report PDFs** | **OWNER** | `OWNER_DECISIONS.md` Item 10; on-page table summary deployed | **NO** |

---

## 2. What Must Happen Before Production, in Order

To achieve a production deployment without compromising financial accuracy, data integrity, or co-hosted infrastructure, the following sequential steps must be executed:

1. **Owner Security Action:** Log in to [Groq Console](https://console.groq.com/keys) and immediately **REVOKE** the API key that appeared in historical commit `e995fbb`. Generate a new production key and store it exclusively in the VPS environment (`.env.production`).
2. **Owner Statutory Verification:** Physically inspect the official State Bank of India passbook or chequebook to confirm that Account Number `33341302498`, IFSC `SBIN0001701`, and UPI ID `86971610172@sbi` match the current operative Trust account.
3. **Owner Institutional Determinations:** Confirm Helpline phone number (`+91 94371 23616`), NGO Darpan ID (`OR/2024/0466491`), and official Secretariat email address (`mect220@gmail.com` or custom domain).
4. **Chartered Accountant Signoff:** Submit statutory tax disclosure notes (12A URN: `AADTM5474FE20231`, 80G URN: `AADTM5474FF20241`) and privacy policy data retention terms to the Trust's CA for formal concurrence.
5. **Release Branch Synchronization:** Push release candidate branch `fix/audit-loop` to GitHub repository (`Himansu-Nayak/MECT` or `Himansu-Nayak/MAHAVIR-TRUST`) and open a Pull Request into `main`.
6. **Pre-Deployment Safety Gate Checks:** Run automated release audit locally:
   ```bash
   npm run check:confirm
   npm run typecheck
   npm run scan:secrets
   cd backend && mvn -q test
   ```
7. **VPS Staging Gate (Mandatory per `DEPLOYMENT_CHECKLIST.md` Step 5):**
   - SSH to production server: `ssh <DEPLOY_USER>@<VPS_HOST>`
   - Create pre-deployment binary database dump:
     ```bash
     docker exec mect-postgres pg_dump -U mect_user -d mect_db -Fc > /opt/mect/backups/mect_db_pre_deploy_$(date +%Y%m%d_%H%M%S).dump
     ```
   - Deploy frontend candidate to staging container on loopback port `3002`:
     ```bash
     docker build -t mect-frontend:staging .
     docker run -d --name mect-frontend-staging --network mect-network -p 127.0.0.1:3002:3000 --env-file .env mect-frontend:staging
     ```
   - Submit real end-to-end test claim and inquiry to `http://127.0.0.1:3002/api/donations/claim` and `/api/contact`.
   - Query PostgreSQL: confirm matching rows exist in `manual_bank_transfer_claims` and `public_inquiries` with identical generated reference numbers.
   - Clean up staging container: `docker stop mect-frontend-staging && docker rm mect-frontend-staging`.
8. **Production Stack Replacement:**
   - Build and start production containers via Compose (strictly targeting declared services without `--remove-orphans`):
     ```bash
     docker compose -f compose.production.yaml build
     docker compose -f compose.production.yaml up -d
     ```
9. **Live HTTPS Smoke Verification:**
   - Verify loopback endpoints: `http://127.0.0.1:3001/api/ai/health` and `http://127.0.0.1:8081/api/v1/actuator/health`.
   - Verify public edge routes: `https://mect.org.in/`, `https://mect.org.in/donate`, `https://mect.org.in/programmes`.
