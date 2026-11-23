# Phase 2 report
Status: PASS
Tasks: A2.1, A2.2, A2.3, A2.4, A2.5, A2.6, A2.7, A2.8, A2.9 / None blocked
Commits on `audit-fixes`:
- `e5ebadc` — `feat(compliance): add single-source compliance config and FY 2026-27 flag [AUDIT-A2.1]`
- `13c6729` — `feat(compliance): add single TaxStatusNotice on donate and footer [AUDIT-A2.2]`
- `6d8e65f` — `fix(compliance): remove unconfirmed 80G claims and gate tax estimator [AUDIT-A2.3]`
- `9e14ed8` — `fix(compliance): keep single statutory pointer on home page [AUDIT-A2.4]`
- `d9e6bd2` — `fix(governance): drive trustee roster from content/trustees.ts and fix statuses [AUDIT-A2.5]`
- `cb85568` — `fix(compliance): standardize trust deed date wording and PAN confirm marker [AUDIT-A2.6]`
- `969cf5d` — `fix(compliance): standardize donation certificate wording and link text [AUDIT-A2.7]`
- `565f8ac` — `fix(compliance): remove unsupported audit, policy, and compatibility absolutes [AUDIT-A2.8]`
- `e095ff6` — `fix(content): remove Smile Foundation reference and independence notice from home [AUDIT-A2.9]`

Files changed:
- `content/compliance.ts` (single-source `ELIGIBILITY_FY2026_27 = "unconfirmed"`, `COMPLIANCE` notice text, and `showTaxEstimator` flag)
- `content/trustees.ts` (structured trustee roster with Chairman `Er. Japabandhu Kampa` and `{{CONFIRM: trustee list}}` placeholder)
- `src/components/compliance/TaxStatusNotice.tsx` (single notice component rendered when `unconfirmed`)
- `src/components/Footer.tsx` (renders `<TaxStatusNotice variant="dark" />` when `unconfirmed`)
- `src/app/donate/page.tsx` (top `<TaxStatusNotice variant="light" />`, tax estimator gated behind `COMPLIANCE.showTaxEstimator`, unified `"donation certificate"` wording)
- `src/app/page.tsx` & `src/lib/homepage-content.ts` (tax estimator gated behind `COMPLIANCE.showTaxEstimator`, repeated 80G paragraph replaced with short `/statutory-disclosures` pointer, removed `SmileFundraisingSection` and `"Notice of Organisational Independence"`)
- `src/components/sections/SmileFundraisingSection.tsx` (removed Smile Foundation reference and independence disclaimer)
- `src/app/governance/page.tsx` (trustee list driven by `content/trustees.ts`, standardized deed date wording, removed `"Dual-Authorization Controls"`, `"Operational"`, and unbacked annual audit claims)
- `src/app/statutory-disclosures/page.tsx` (removed `"Legally Ratified & Permanent"` and `"All statutory registrations are active"`, standardized deed date, added `{{CONFIRM: PAN allotment date vs deed date}}`, replaced `"Online 80G Donation Gateway"` with `"Donation details"`, unified `"donation certificate"` wording)
- `src/components/sections/CsrRegistrationSection.tsx` & `src/lib/about-content.ts` & `src/app/layout.tsx` (standardized Trust Deed execution/registration date wording and PAN `{{CONFIRM}}` marker)
- `src/app/reports/page.tsx` (removed `"100% Programme Expense Policy"`, `"Donate with 80G Tax Exemption"`, and unbacked `"Independent CA Audits"` absolute; added `{{CONFIRM: audited accounts and Form 10B}}`)
- `src/app/accessibility/page.tsx` (replaced `"Fully Supported"` matrix labels with `"Semantic HTML Targeted"` / `"Responsive Layout up to 200%"`)
- `src/app/csr-partnerships/page.tsx`, `src/app/programmes/page.tsx`, `src/app/scholarships/page.tsx`, `src/lib/ai/mect-knowledge.ts` (softened unbacked CA audit/80G/gazetted claims)
- `AUDIT_TASKS.md` (marked `A2.1`–`A2.9` complete)
- `reports/phase-2-crawl.txt` & `reports/phase-2.md`

Before / After Consistency Table:
| Area | Before | After |
| :--- | :--- | :--- |
| FY 2026-27 80G Status | Mixed claims (`Section 80G Approval`, `Donate with 80G Tax Exemption`, visible Tax Estimators) | Controlled by `ELIGIBILITY_FY2026_27 = "unconfirmed"`; `<TaxStatusNotice />` on `/donate` & footer; estimators hidden |
| Home `/` 80G Notice | Long Section 133/80G/Form 113/114 paragraph repeated on Home | Short pointer to `/statutory-disclosures`; full tax explanation kept on `/statutory-disclosures` |
| Registration Date | Mixed (`30th July 2013 (Deed executed 27-07-2013)`, `established on 27th July 2013`) | Standardized `"Trust Deed executed 27 July 2013; registered 30 July 2013, Balangir Sub-Registrar"` + `{{CONFIRM: PAN allotment date vs deed date}}` |
| Certificate Naming & CTA | `"Form 10BE"`, `"Form 113/114"`, `"Online 80G Donation Gateway"` | `"donation certificate"` across donate/disclosures/home; CTA text `"Donation details"` |
| Governance & Trustees | Hardcoded board, `"Operational"` office status, `"Dual-Authorization Controls"` | Driven by `content/trustees.ts` (`Er. Japabandhu Kampa` + `{{CONFIRM: trustee list}}`), `"Documented Trustee Oversight"` |
| Unsupported Absolutes | `"100% Programme Expense Policy"`, `"Fully Supported"`, `"Independent CA Audits"` | Replaced with `"Direct Programme Allocation Focus"`, `"Semantic HTML Targeted"`, `"Statutory Audit Process"` + `{{CONFIRM}}` |
| Smile Foundation Ref | `SmileFundraisingSection` + `"Notice of Organisational Independence"` on `/` | Removed from `/` and component/content |

Commands:
- `git grep -n -i -E "80G Tax Deductible|50% Tax Deduction Eligible|statutory registrations are active|Legally Ratified & Permanent|Section 80G Approval|Pending Gazette|gazetted|certificate issuance|No public funds or online donations|Online 80G Donation Gateway|Form 10BE|100% Programme Expense Policy|Fully Supported|Dual-authorization controls|Smile Foundation|Notice of Organisational Independence" src content` → PASS (0 Phase 2 forbidden-phrase hits; only historical order title `"Form 10AC Section 80G Approval Order"` on `/statutory-disclosures`)
- `npm run lint` (`eslint .`) → PASS (exit 0)
- `npm run typecheck` (`tsc --noEmit`) → PASS (exit 0)
- `npm run build` (`node scripts/check-confirm.ts && next build --webpack`) → PASS (exit 0; 7 tracked `{{CONFIRM: ...}}` warnings in non-CI mode; 37/37 routes built)
- `npm run audit:site -- --out=reports/phase-2-crawl.txt` → exited 1 only on out-of-scope Phase 4 (`FORBIDDEN_TEXT`: 2 on `/faq`) and Phase 8 (`IMAGE_ALT_ISSUE`: 28 on `/`); **0 failures on `NON_200_PAGE`, `BROKEN_INTERNAL_HREF`, `BROKEN_FRAGMENT`, `CANONICAL_MISMATCH`, `MISSING_OR_DUPLICATE_TITLE`, `MISSING_META_DESCRIPTION`, `MISSING_OG_IMAGE`, `TEL_WITH_SPACES`, `MULTIPLE_H1`**.

Crawler (`reports/phase-2-crawl.txt`): 19 HTML pages, 18 sitemap routes, 2 assets, 177 fragment checks — **30** total failures (down from 90 baseline; 0 Phase 1/Phase 2 regressions).

Open CONFIRM items (added in Phase 2, tracked in `content/todo-confirm.md` and `scripts/check-confirm.ts`):
- `{{CONFIRM: 80G notice wording}}` (`content/compliance.ts`) — CA + Managing Trustee (#1)
- `{{CONFIRM: PAN allotment date vs deed date}}` (`content/compliance.ts`, `/statutory-disclosures`, `CsrRegistrationSection.tsx`, `about-content.ts`) — CA (#1)
- `{{CONFIRM: trustee list}}` (`content/trustees.ts`) — Board of Trustees (#3)
- `{{CONFIRM: audited accounts and Form 10B}}` (`/reports`) — CA (#7)

Risks and notes:
- `/faq` still contains legacy 80G wording (`"Section 80G tax deduction receipts"`, `"pre-launch endowments"`, and `"+91 671 234 5678"`): full rewrite of all 24 `/faq` answers is scheduled in **Phase 4 (`A4.2`)**.
- `SmileFundraisingSection` was removed from `/` per `A2.9`; component file remains in `src/components/sections/SmileFundraisingSection.tsx` with Smile Foundation references stripped.

Next: Phase 3

