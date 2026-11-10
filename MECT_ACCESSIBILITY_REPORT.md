# MECT WCAG 2.2 AA Accessibility Verification Report

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Target Server:** `http://localhost:3000` (Playwright live DOM audit via `audit-contrast-and-sections.mjs` & `verify-all-routes-complete.mjs`)  
**Audit Date:** 2026-11-10

---

## 1. Automated Live DOM Contrast Audit

Every rendered visible text element (`h1`, `h2`, `h3`, `h4`, `p`, `a`, `button`, `span`, `label`, `li`) was inspected against its effective RGBA blended background on all **19 application routes** at both desktop (`1366px` / `1440px`) and mobile (`360px`):

- **Threshold Applied:** `>= 4.5:1` for normal text; `>= 3.0:1` for large text (`>= 24px` or `>= 18.67px` bold).
- **Final Outcome After Remediation:** **`lowContrast=0` across all 19 routes (desktop & mobile)**.

---

## 2. Accessibility Issues Identified & Fixed During Verification Loops

1. **`Accordion.tsx` Body Copy Over Light Sand / Warm Cream (`/scholarships` & `/faq`):**
   - *Measured Before Fix:* `#66736C` on `#F0DEC5` (`3.77:1`) and over `#F3E4D2` (`3.98:1`) failed `< 4.5:1` for normal text (`lowContrast=1` on `/scholarships`, `lowContrast=6` on `/faq`).
   - *Fix Applied:* Switched accordion answer copy in [`Accordion.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Accordion.tsx) to `--color-text-on-sand` (`text-ink-sand` / `#4B5751`, achieving `5.74:1`–`6.05:1` AA on Sand/Cream and `7.55:1` on White).
2. **`/volunteer` Hero Breadcrumb & Induction Pathway Numbers:**
   - *Measured Before Fix:* `text-cream` (`#F3E4D2`) breadcrumb link over `bg-terracotta` (`#A45E44`) measured `3.95:1`; `text-sand` (`#E5C499`) step numbers (`01`–`04`) over `bg-cream` (`#F3E4D2`) measured `1.26:1` (`lowContrast=6`).
   - *Fix Applied:* Updated [`volunteer/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/volunteer/page.tsx) breadcrumb text to `text-white` (`4.93:1` AA) and pathway numbers (`01`–`04`) to `text-terracotta-dark` (`#874A35`, `5.50:1` AA).
3. **`contact/page.tsx` Hover Link Contrast on White Cards:**
   - *Finding:* Direct email/link hovers had `hover:text-sand` (`#E5C499`) on `#FFFFFF`.
   - *Fix Applied:* Updated hover links in [`contact/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/contact/page.tsx) to `hover:text-forest` (`#283730`, `12.5:1` AAA).
4. **Accessibility Statement Self-Documentation Sync (`src/app/accessibility/page.tsx`):**
   - Updated [`accessibility/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/accessibility/page.tsx) prose to reflect the exact Terracotta (`#A45E44`), Forest Charcoal (`#283730`), and Warm Cream (`#F3E4D2`) palette metrics cleanly.

---

## 3. Keyboard Navigation, Semantics & Motion Support Verified

- **Keyboard Focus & Skip Link:** Pressing `Tab` on initial homepage load immediately focuses the `.skip-to-content` link (`"Skip to main content"`), verified via Playwright. Visible `:focus-visible` rings use `#A45E44` on light backgrounds and `#E5C499` on dark surfaces.
- **Heading Semantics:** Verified `<h1>` landmarks on all public routes; proper ARIA labels (`aria-expanded`, `aria-modal`, `role="dialog"`, `role="alert"`, `role="status"`) verified across header disclosures, mobile menu drawer, modal certificate viewer, HIm chatbot, and FAQ accordions.
- **Reduced Motion Compliance:** `MotionPrimitives.tsx` uses `useReducedMotion()` (`motion/react`), and `globals.css` disables marquee animation and transitions under `@media (prefers-reduced-motion: reduce)`.

---

- **Touch Target & Label Fixes Implemented:**
  - Associated `htmlFor` + `id` attributes on custom contribution `<input>` and marginal tax bracket `<select>` controls in both [`src/app/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/page.tsx) and [`src/app/donate/page.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/donate/page.tsx).
  - Removed redundant conflicting `aria-label` on [`Footer.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Footer.tsx) brand link (`label-content-name-mismatch`).
  - Expanded header nav chevrons in [`Header.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Header.tsx) (`min-w-[24px] min-h-[24px]`) and footer bottom links (`min-h-[24px] py-1`), and eliminated nested `<Button>` inside `<Link>` in the Trustee Spotlight card (`View Fiduciary Charter`).
- **Google Lighthouse Audits (`chrome-devtools-mcp` on `http://localhost:3000/`):**
  - **Desktop:** Accessibility **100**, Best Practices **100**, SEO **100**, Agentic Browsing **100** (`57 passed, 0 failed`).
  - **Mobile:** Accessibility **100**, Best Practices **100**, SEO **100**, Agentic Browsing **100** (`57 passed, 0 failed`).
- **Manual Screen-Reader Narration:** Live screen-reader listening test via NVDA / VoiceOver remains outside automated CLI tooling in this pass.

