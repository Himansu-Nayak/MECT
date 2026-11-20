# Pull Request: Continuous Fix Loop Truth Audit, Structural Hardening & Performance Excellence

**Target Branch:** `main`  
**Source Branch:** `fix/audit-loop`  
**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Deployment Status:** Pre-Deployment Verification Complete (Zero Production Deployment Performed)

---

## 1. Executive Summary

This Pull Request consolidates Loops 1 through 7 of the autonomous fix and truth audit protocol. It resolves critical truth discrepancies, eliminates dead links and anchors, hardens public contact and donation verification workflows, aligns banking credentials to the verified live account, and verifies WCAG 2.2 accessibility and sub-1.5s mobile performance across all core pages.

---

## 2. User-Visible Changes

1. **Unified SBI Banking & UPI Details:**
   - Single-sourced to verified State Bank of India account (`33341302498`, IFSC `SBIN0001701`, Branch `Rajendra College Square, Bolangir`, UPI `86971610172@sbi`).
   - Integrated new `UpiQrCard` component on `/donate` with 1-click copy, deep link (`upi://pay`), and payment instructions.
   - Completely eradicated deprecated account `33091993247` and errant references.
2. **Authentic Field Dispatches & Documentary Integrity:**
   - Restored authentic historical Balangir and Puintala field dispatches under `/stories` (`classroom`, `workshop`, `water-point`).
   - Purged all unverified retrospective stories and pseudo-privacy markers (`[Name withheld for privacy]`).
3. **Statutory Annual Reports Table:**
   - Multi-year reporting table on `/reports` linking to on-page summaries and physical inspection requests.
   - Purged synthetic generated PDFs; FY 2024–25 clearly designated as "Pending" audit completion.
4. **Hardened Public Contact Form:**
   - Real server-side contact route (`POST /api/contact`) with honeypot (`_gotcha`), IP sliding-window rate limiting (5 req/min), character counter (1000 max), and noscript fallback.
   - Reset public helpline telephone to authentic documented number `+91 94371 23616`. Removed unverified WhatsApp external links.
5. **Donation Claim Workflow:**
   - Public claim endpoint (`POST /api/donations/claim`) returns status `UNVERIFIED` and canonical message: *"Claim received. Reference: {ref}. The Trust will check your transfer against its bank records before issuing a receipt."*
   - Proxy-aware rate limiter extracting client IP from `X-Forwarded-For` or `X-Real-IP`.
6. **Canonical Programme Anchors:**
   - Enforced 7 canonical programme IDs on `/programmes`: `#education`, `#women-empowerment`, `#sports-extracurricular`, `#water`, `#food-relief`, `#community-welfare`, `#higher-education`. Verified with authentic non-empty content (1251–1304 chars each).
   - Purged dead anchor references (`#hunger-relief`, `#pillars`).
7. **Error Boundaries & Resilience:**
   - Added `src/app/error.tsx` (client error boundary with retry) and `/500` route with `robots: noindex`.
   - Verified branded `src/app/not-found.tsx` (404) with navigation shortcuts.
8. **Feature-Gated Odia Language Toggle:**
   - Bilingual English/Odia toggle safely gated behind `NEXT_PUBLIC_ENABLE_ODIA="true"` (default off until Trust review). Statutory and tax terms remain strictly English.
9. **Developer Credit Alignment:**
   - Aligned footer credit with About page: *"Website developed by Himansu Nayak"*. Removed unresolving bot-blocked LinkedIn link.
10. **Neutral Statutory Tax Notice:**
    - Standardized tax disclaimer across `/donate`, `/statutory-disclosures`, `/about`, and `/faq`:
      > *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility."*

---

## 3. Operational & System Risks

| Risk Area | Risk Description | Mitigation Implemented |
| :--- | :--- | :--- |
| **Database Bank Credentials Mismatch** | A stale database record in `payment_configurations` could override page credentials at runtime when backend is online. | Added runtime guard in `UnifiedDonationExperience.tsx` that checks DB values against `src/config/org.ts` and falls back to `org.ts` with a `console.warn` log if they differ. Added pre-deploy SQL audit query in `docs/DEPLOYMENT_CHECKLIST.md`. |
| **In-Memory Rate Limiting Reset** | In-memory IP rate limit maps reset when the Next.js process restarts. | Acceptable for current single-instance deployment; reverse proxy (Nginx) also provides connection limiters. |
| **Secretariat Notification** | Public inquiries are saved to database (`public_inquiries`) and visible in Admin Portal, but no automated email alert is sent to staff. | Documented in deployment and owner runbooks. Secretariat desk must check Admin Portal daily. |
| **Reverse Proxy Header Spoofing** | If the host reverse proxy does not sanitize `X-Forwarded-For`, clients could bypass IP rate limiting. | Documented required Nginx header directives (`$proxy_add_x_forwarded_for`, `$remote_addr`) in `DEPLOYMENT_CHECKLIST.md` and `.env.example`. |

---

## 4. What Needs Owner Confirmation Before Merging

Refer to [OWNER_DECISIONS.md](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/OWNER_DECISIONS.md) for full context. The top items requiring explicit Trust management sign-off are:

1. **Bank Details vs Physical Passbook:** Physical inspection of SBI passbook to confirm A/C `33341302498`, IFSC `SBIN0001701`, UPI `86971610172@sbi`.
2. **Primary Helpline:** Confirmation of `+91 94371 23616` as sole public phone desk.
3. **Secondary Phone:** Confirmation of ownership and status of `+91 98536 08113`.
4. **NGO Darpan Unique ID:** Confirm `OR/2024/0466491` vs `OD/2021/0285141`.
5. **Secretariat Working Hours:** Confirm `Mon–Sat, 10:00–17:30 IST`.
6. **Bhubaneswar Office Address:** Confirm exact room/suite number.
7. **CA Tax Review:** Chartered Accountant confirmation of neutral Section 12A / 80G statutory notices.
8. **Field Photography:** Replacement of illustrative images with camera originals.
9. **Signed Annual Report PDFs:** Upload official signed balance sheets when available.
10. **FY 2024–25 Accounts:** Approve publication when CA reconciliation concludes.
11. **Newsletter Block Decision:** Owner decision on whether Trust desires email updates block.
12. **Odia Translation Review:** Native Odia review of `locales/or.json` before activating toggle.

---

## 5. Verification & Test Evidence

- **Lint & Typecheck:** `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.
- **Production Build:** `npm run build` succeeds cleanly.
- **Rendered Verification Suite (`npm run verify`):**
  - 25 sitemap routes visited (HTTP 200).
  - 419 internal anchors checked (0 broken).
  - 7 official programme IDs verified with authentic content.
  - JavaScript-disabled `/donate` form verified.
  - Donation claim API tested (status `UNVERIFIED`, canonical message, 6th burst 429, distinct IP independence).
  - Branded 404 verified with `noindex` and navigation shortcuts.
  - Axe-core 4.14 accessibility: 0 serious or critical violations across all 9 audited routes.
- **Multi-Run Mobile Performance Suite (`npm run verify:perf`):**
  - 3-run median Performance >= 90 across all 6 core pages.
  - 3-run median LCP <= 1.4s (< 2.5s gate).
  - 3-run median CLS <= 0.011 (< 0.1 gate).

---

## 6. Step-by-Step Rollback Runbook

If any regression occurs upon staging or production deployment:

1. **Revert Frontend & Backend Containers:**
   ```bash
   cd <APP_DIR>
   git checkout <PREVIOUS_RELEASE_COMMIT_SHA>
   docker compose -f compose.production.yaml up -d --build --remove-orphans
   ```
2. **Restore Database from Pre-Deploy Binary Dump (if migrations failed):**
   ```bash
   docker exec -i mect-postgres pg_restore -U ${DB_USERNAME:-mect_user} -d ${DB_NAME:-mect_db} --clean --if-exists < <BACKUP_DIR>/mect_db_pre_deploy_<TIMESTAMP>.dump
   ```
3. **Verify Restored Endpoints:**
   ```bash
   curl -fsS http://127.0.0.1:3001/api/ai/health
   curl -fsS http://127.0.0.1:8081/api/v1/actuator/health
   curl -I https://mect.org.in/
   ```
