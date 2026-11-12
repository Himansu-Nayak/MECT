# MECT Audit Remediation Task Checklist

Master task tracker for the 12 Nov 2026 audit remediation on `https://mect.org.in` (branch: `audit-fixes`).

## PHASE 0 — Safety net, task list, crawler
- [x] **A0.1** Create branch `audit-fixes` and `AUDIT_TASKS.md` listing every task ID from the audit remediation prompt as a checkbox.
- [x] **A0.2** Create `content/todo-confirm.md` with the 10 open questions for trustees and the Chartered Accountant.
- [x] **A0.3** Add `{{CONFIRM: ...}}` marker convention and `scripts/check-confirm.ts` failing production builds (`NODE_ENV=production` and `CI=true`) if any marker remains in `app/`, `components/`, or `content/` (except `content/todo-confirm.md`), covering `src/` counterparts cleanly.
- [x] **A0.4** Build `scripts/audit-site.ts` (`npm run audit:site`) that starts the app, crawls from `/` + sitemap + internal links, checks all Page/Anchor/Brand/Meta/A11y criteria, prints a pass/fail table, and saves `reports/baseline-crawl.txt` before fixes.

## PHASE 1 — One template, one brand
- [x] **A1.1** Create single `SiteLayout` (header, top statutory ticker, footer, floating action bar) and use it for every route; remove old MAHAVIR TRUST header/footer/notice-bar components and unused styles.
- [x] **A1.2** Unify navigation (`About`, `Our Work`, `Impact & Accountability`, `Get Involved`, `Resources & Help`, `Donor Portal`, `Donate Now`) and fix footer labels (`Statutory Disclosures` -> `/statutory-disclosures`, `Corporate CSR Partnership` -> `/csr-partnerships`).
- [x] **A1.3** Replace every old-brand string in components, metadata, JSON-LD, and content files with `Mahaveer Educational & Charitable Trust (MECT)` or `MECT`; remove `"guidelines published for trustee review"`; standardise `<title>` to `Page Name | Mahaveer Educational & Charitable Trust (MECT)`.
- [x] **A1.4** Fix metadata for every route (self-referencing canonical, `og:url`, per-page `og:title`/`og:description`/`twitter:*`, default 1200x630 `og:image`, remove `meta keywords`).
- [x] **A1.5** Single-source footer data from `content/org.ts` (name, addresses, helpline, hours, IDs, bank, UPI); remove hardcoded page duplicates.
- [x] **A1.6** Normalise `tel:` links to `tel:+919437123616`.

## PHASE 2 — Legal and tax wording
- [ ] **A2.1** Create `content/compliance.ts` as single source for registration status text and `ELIGIBILITY_FY2026_27` (`unconfirmed | confirmed`, default `unconfirmed`).
- [ ] **A2.2** Show ONE `<TaxStatusNotice />` box at top of `/donate` and in footer when `unconfirmed`, linking to `/statutory-disclosures` and using `{{CONFIRM: 80G notice wording}}`.
- [ ] **A2.3** Remove unconfirmed green ticks and `80G Tax Deductible` / `50% Tax Deduction Eligible` / `All statutory registrations are active` / `Legally Ratified & Permanent` / `Section 80G Approval` badges/CTAs and gate Tax Deduction Estimator behind flag.
- [ ] **A2.4** Remove repeated 80G paragraph from `/` (keep single pointer to `/statutory-disclosures`; full explanation only on `/statutory-disclosures`).
- [ ] **A2.5** Rewrite `/governance` statuses (`content/trustees.ts`, `{{CONFIRM: trustee list}}`, always show chairman, remove pending-gazette/no-public-funds/certificate-issuance lines).
- [ ] **A2.6** Standardise registration date wording everywhere (`Trust Deed executed 27 July 2013; registered 30 July 2013, Balangir Sub-Registrar`) and add `{{CONFIRM: PAN allotment date vs deed date}}`.
- [ ] **A2.7** Replace `Online 80G Donation Gateway` link text with `Donation details`; standardise certificate wording to `donation certificate` without unconfirmed form numbers.
- [ ] **A2.8** Remove unsupported absolutes (`100% Programme Expense Policy`, `Fully Supported` matrix label, unbacked `Independent CA audits annually`, `Dual-authorization controls`, `Operational` committees).
- [ ] **A2.9** Remove Smile Foundation reference and `Notice of Organisational Independence` from `/`.

## PHASE 3 — Programmes and anchors
- [ ] **A3.1** Rebuild `/programmes` as five-pillar page with IDs `education`, `women-empowerment`, `water`, `hunger-relief`, `pillars`, `free-education-200` and consistent cards/metrics/CTAs.
- [ ] **A3.2** Move the 3 higher-education schemes into a clearly labelled `Planned initiatives` section (`Planned - not yet open` badge) and remove `Zero processing fee • 100% direct-to-college disbursals`.
- [ ] **A3.3** Build `Free Education for 200 Students` section stating 200 is a target (not current enrolment), funding scope, and donate CTA.
- [ ] **A3.4** Fix all `/programmes#...` links and point `View Scheme Guidelines` links to `/scholarships`.
- [ ] **A3.5** Rebuild `/impact` using `content/impact.ts`, Balangir/Puintala map block, annual report links, `{{CONFIRM: consented stories}}`, and complete 30-district Odisha breakdown.
- [ ] **A3.6** Remove `Active Institutional Liaison` and `Framework Active` labels unless backed by `{{CONFIRM}}`.

## PHASE 4 — Contact, FAQ, Volunteer, Scholarships
- [ ] **A4.1** Update `/contact` with both offices, single helpline/emails/hours, remove placeholder address & `+91 671 234 5678`, support `?subject=` pre-fill, and unify response-time standard from `content/org.ts`.
- [ ] **A4.2** Rewrite all 24 `/faq` answers, add donor FAQ section, server-render accordion answers cleanly, and add `FAQPage` JSON-LD.
- [ ] **A4.3** Merge home & `/volunteer` forms into one shared component + API route, update tracks & full 30-district + `Outside Odisha` list, fix `[Proposed]` breadcrumb, add safeguarding `{{CONFIRM}}` and consent checkbox, include Balangir in priority districts.
- [ ] **A4.4** Add `Applications not yet open` banner on `/scholarships` (from `content/schemes.ts`), standardise names, fix `#eligibility`/footer anchors, add downloadable PDF checklist + draft zero-cash declaration, soften digital state DB validation claim.
- [ ] **A4.5** Align home scheme explorer streams with `content/schemes.ts`.

## PHASE 5 — Forms, privacy and data protection
- [ ] **A5.1** Gate `/scholarships/apply` behind `intakeOpen` (`Expression of interest` mode when false; consent, DOB under-18 guardian routing, 14-day signed server draft save/resume, validation, `noindex` when true).
- [ ] **A5.2** Add reusable `<ConsentNotice />` to all forms and store consent text version & timestamp on submission.
- [ ] **A5.3** Rewrite `/privacy` on MECT template covering all collected fields, DPDP Act 2023, retention, children's data, rights, `{{CONFIRM: grievance officer name}}`, and `last updated` date.
- [ ] **A5.4** Update `/terms` with `Last updated`, donations/refund clause, illustrative tools disclaimer, and `{{CONFIRM: jurisdiction}}`.
- [ ] **A5.5** Harden form APIs (validation, length limits, rate limiting, honeypot, CSRF, zero PII in logs) with automated tests.
- [ ] **A5.6** Add `<noscript>` fallback text, server-rendered heading, and `noindex` on `/scholarships/track` and `/portal/login`.

## PHASE 6 — Donate page
- [ ] **A6.1** Rename dynamic/smart donation block to `Record your intended donation`, remove server-verified / Dynamic UPI QR claims, clarify SBI NEFT/RTGS/IMPS + static UPI QR + UTR receipt submission flow (note: reconciles/replaces prior Cashfree wording per non-negotiable rule #3).
- [ ] **A6.2** Reorder `/donate`: compliance notice at top, bank/UPI details next, receipt desk below.
- [ ] **A6.3** Add anti-fraud notice against personal accounts, phone, or WhatsApp solicitations.
- [ ] **A6.4** Add receipt turnaround from `content/org.ts` (`{{CONFIRM: receipt turnaround}}`), donor FAQ, and FCRA line.
- [ ] **A6.5** Source unit cost/impact lines from `content/unitCosts.ts` (or remove/`{{CONFIRM}}`).
- [ ] **A6.6** Upgrade receipt form (consent notice, PAN format, UTR, amount validation, reference number confirmation).
- [ ] **A6.7** Render footer bank details from one shared component and display UPI beneficiary name `MAHAVEER EDUCATIONAL CHARITA`.

## PHASE 7 — Documents, reports, CSR
- [ ] **A7.1** Create `public/documents/` and `content/documents.ts` registry with real download links or pre-filled contact `Available on request`.
- [ ] **A7.2** Update `/statutory-disclosures` with document cards, validity period, last verified date, renewal note, and `Verify us` portal links.
- [ ] **A7.3** Update `/reports` (`Annual Reports and Financial Disclosures`, `Key activities`, FY 2021-22..FY 2023-24 + FY 2024-25/FY 2025-26 placeholders, `content/finance.ts` summary, remove `100% Programme Expense Policy`).
- [ ] **A7.4** Update home annual reports link (`Annual reports and financials` -> `/reports#archive`).
- [ ] **A7.5** Update `/csr-partnerships` (neutral selects, `?project=` pre-selection, current vs planned deliverables, cluster wording fix, generated CSR brochure PDF, utilisation certificate slot, phase-2 notice, CSR-1 letter PDF + PNG).

## PHASE 8 — Home page, content, images, accessibility, performance
- [ ] **A8.1** Restructure `/` sections and move explorer, volunteer form, inquiry form, and tax estimator to dedicated pages.
- [ ] **A8.2** Standardise all Home, Impact, Reports, and CSR statistics and labels from `content/todo-confirm.md`.
- [ ] **A8.3** Optimise Hero carousel (1 priority slide + lazy rest, remove 4x duplication <= 7 imgs, <= 1920px sizes, pause button WCAG 2.2.2, `prefers-reduced-motion`, meaningful alt & `Illustrative image` caption + CC BY-SA attribution).
- [ ] **A8.4** Add `aria-hidden="true"` and `inert` to duplicated marquee/ticker nodes + pause control.
- [ ] **A8.5** Update `/about` timeline, committees (`{{CONFIRM}}`), trustees, understated footer developer credit (`Website by Himansu Nayak`, `{{CONFIRM: LinkedIn URL}}`).
- [ ] **A8.6** Rewrite `/accessibility` honestly, run axe/Lighthouse/keyboard checks, record `reports/a11y.md`, remove GIGW/CSS/hex jargon.
- [ ] **A8.7** Add site-wide Organization/NGO JSON-LD + `/donate` action schema.
- [ ] **A8.8** Generate `sitemap.xml` dynamically from routes (exclude apply/track/portal, real dates, drop priority/changefreq) and harden `robots.txt` + admin auth.
- [ ] **A8.9** Build custom `not-found.tsx` (MECT header, search/links, back home, HTTP 404) and `error.tsx`.
- [ ] **A8.10** Add Odia (`/or/...`) scaffold for Home, Donate, Volunteer with language switcher, `hreflang`, and `{{CONFIRM: Odia translation}}`.
- [ ] **A8.11** Add News/Updates (`content/news.ts`) and Gallery pages with captions and empty states.
- [ ] **A8.12** Configure strict security headers (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors) in `next.config.ts` and verify forms/images.

## PHASE 9 — Regression, documentation, deploy prep
- [ ] **A9.1** Re-run `npm run audit:site` (zero failures), save `reports/final-crawl.txt`, compare against `reports/baseline-crawl.txt`.
- [ ] **A9.2** Add Playwright smoke tests for pillars, donate copy, receipt validation, volunteer submit, 404, and mobile nav.
- [ ] **A9.3** Write `reports/final-report.md` with per-item status (`DONE`, `PARTIAL`, `BLOCKED`, `NEEDS-CONFIRMATION`), evidence, and remaining `{{CONFIRM}}` items grouped by owner.
- [ ] **A9.4** Update `README.md` and create `CONTRIBUTING.md`.
- [ ] **A9.5** Write VPS deployment runbook to `DEPLOY.md` (do NOT deploy without explicit approval).
