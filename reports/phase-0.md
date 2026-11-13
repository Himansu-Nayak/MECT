# Phase 0 report
Status: PASS
Tasks: A0.1, A0.2, A0.3, A0.4 / None blocked
Files changed:
- `AUDIT_TASKS.md` (A0.1–A9.5 full task checklist on branch `audit-fixes`)
- `content/todo-confirm.md` (10 trustee & CA open questions plus tracked build-time marker notes)
- `scripts/check-confirm.ts` (build-time `{{CONFIRM: ...}}` guard for `app/`, `components/`, `content/`, `src/app/`, `src/components/`, `src/content/`, excluding `content/todo-confirm.md`)
- `scripts/audit-site.ts` (Next.js production server crawler verifying status, hrefs, `#fragment` IDs, forbidden strings, canonicals, titles, meta description, `og:image`, `img[alt]`, `tel:` whitespace, and `<h1>` count)
- `package.json` (added `typecheck`, `check:confirm`, `audit:site`, and pre-build `check-confirm` hook inside `build`)
- `reports/baseline-crawl.txt` (pre-fix baseline crawl output)
- `reports/phase-0.md` (this report)
Commands:
- `git checkout -b audit-fixes` → PASS (created branch `audit-fixes` from `feat/multi-sector-ngo-repositioning`)
- `npm run lint` → PASS (exit 0)
- `npm run typecheck` (`tsc --noEmit`) → PASS (exit 0)
- `npm run build` (`node scripts/check-confirm.ts && next build --webpack`) → PASS (exit 0; `[check-confirm] PASS: 0 unresolved {{CONFIRM: ...}} markers found.`, 37/37 routes built)
- Simulated `check-confirm` smoke test (`content/_test-confirm.md` with `{{CONFIRM: temporary smoke marker}}`, deleted after test):
  - `NODE_ENV=development` (no `CI`) → exit 0 with `WARN`
  - `NODE_ENV=production` + `CI=true` → exit 1 with `FAIL (production + CI)` (build guard verified)
- `npm run audit:site -- --out=reports/baseline-crawl.txt` → ran cleanly and exited 1 as expected on unfixed baseline (saved to `reports/baseline-crawl.txt`)
Crawler: Baseline captured (19 HTML pages, 18 sitemap routes, 2 assets, 178 fragment checks): 90 total failures across 6 categories (`FORBIDDEN_TEXT`: 2, `CANONICAL_MISMATCH`: 1, `MISSING_OR_DUPLICATE_TITLE`: 2, `MISSING_OG_IMAGE`: 19, `IMAGE_ALT_ISSUE`: 28, `TEL_WITH_SPACES`: 38); 0 failures on `NON_200_PAGE`, `BROKEN_INTERNAL_HREF`, `BROKEN_FRAGMENT`, `MISSING_META_DESCRIPTION`, and `MULTIPLE_H1`.
Evidence:
- Baseline crawl highlights from `reports/baseline-crawl.txt`:
  - Line 100: `[FORBIDDEN_TEXT] (/faq) Forbidden text "671 234 5678" matched: "...p Direct Secretariat Helpline: +91 671 234 5678 (Mon–Fri, 10:00 AM – 5:00 PM IST) ..."`
  - Line 101: `[FORBIDDEN_TEXT] (/faq) Forbidden text "pre-launch" matched: "... Questions Zero commission policy, pre-launch endowments, 80G tax deductions, an..."`
  - Line 114: `[CANONICAL_MISMATCH] (/portal/login) Canonical "https://mect.org.in" != expected "https://mect.org.in/portal/login"`
  - Lines 117–118: `[MISSING_OR_DUPLICATE_TITLE] (/) Duplicate <title> "Mahaveer Educational & Charitable Trust (MECT) — Registered Public Charitable Trust • Odisha" shared across: /, /portal/login`
  - Lines 30–57: 28 hero carousel `<img>` tags on `/` with empty `alt=""` and no decorative flag (`aria-hidden` / `role="presentation"`).
  - Lines 58–116: 38 `tel:` anchors with spaces (`"tel:+91 94371 23616"`) and 19 pages missing `og:image`.
Open CONFIRM items: All 10 numbered items in `content/todo-confirm.md` remain open pending input from:
- Chartered Accountant (CA): #1 (12A/80G/Income-tax Act 2025 status for FY 2026-27 & public wording), #5 (FCRA status), #7 (Audited accounts & Form 10B for FY 2024-25 & FY 2025-26)
- Trustees / Programme Team: #2 (annual vs cumulative & events vs unique people for statistics), #3 (full trustee list, roles, photos), #4 (scholarship approval & first intake date), #6 (approved child-safeguarding policy), #8 (Bhubaneswar liaison phone/email & DPDP Grievance Officer name), #9 (preferred scheme spelling)
- Trustees / Legal Advisor: #10 (jurisdiction clause: Balangir vs Bhubaneswar/Cuttack)
Risks and notes:
- Pre-existing uncommitted modifications and untracked working files (`src/app/donate/page.tsx`, `src/app/page.tsx`, `src/app/statutory-disclosures/page.tsx`, `src/components/*`, `MECT_*.md`, `scratch/*`, `src/*.jpg/*.jpeg`) were already present on `feat/multi-sector-ngo-repositioning` before creating `audit-fixes`; they remain unstaged/untouched in the working tree so Phase 0 commits stay isolated to `A0.1`–`A0.4`.
- `scripts/check-confirm.ts` skips dot-prefixed entries (`entry.name.startsWith(".")`) like `.git` or `.next`; non-dot files in `app/`, `components/`, `content/`, `src/app/`, `src/components/`, and `src/content/` (except `content/todo-confirm.md`) are scanned strictly.
- Payment conflict noted for Phase 6 (`A6.1`): existing repository contains Cashfree integration commits from earlier work while Audit Rule #3 mandates domestic SBI NEFT/RTGS/IMPS and static SBI UPI QR only with no gateway wording on `/donate`; Phase 0 left application code untouched per loop rules.
Next: Phase 1

