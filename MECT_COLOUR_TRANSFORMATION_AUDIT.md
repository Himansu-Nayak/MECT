# MECT Complete Website Colour Transformation Audit

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Audit Date:** 2026-11-10  
**Scope:** Full repository audit prior to implementing the **Terracotta + Warm Sand + Forest Charcoal + Muted Sage + Warm Cream** design system.

---

## 1. Framework, Stack & Current Styling Architecture

- **Frontend Stack:** Next.js `^16.4.3` (App Router, `next build --webpack`), React `^19.3.0`, TypeScript `^5.7.0`, Tailwind CSS `^4.0.0` (`@tailwindcss/postcss`), `lucide-react ^1.16.0`, `motion ^12.4.7`.
- **Fonts (`src/app/layout.tsx`):** `Plus_Jakarta_Sans` (`--font-sans`), `Lora` (`--font-serif`), `JetBrains_Mono` (`--font-mono`).
- **Styling Root:** `src/app/globals.css` (`@import "tailwindcss";`) defines CSS custom properties under `:root` and custom `@utility` declarations (`text-navy`, `bg-navy`, `bg-forest`, `text-gold`, `bg-ivory`, `bg-sand`, etc.), while almost all React components bypass those tokens and hardcode arbitrary Tailwind hex classes directly (`bg-[#52796F]`, `text-[#344F46]`, `bg-[#EAF0EC]`, etc.).

---

## 2. Existing Colour System Inventory

### 2.1 Hardcoded Hex Occurrences Found in `src/`
| Legacy Hex | Files Affected | Role in Current Codebase | Target Replacement Role |
|---|---|---|---|
| `#52796F` | 48 files | Primary surfaces, buttons, labels, icons | Primary Terracotta (`#A45E44`) / `--color-primary` |
| `#344F46` | 47 files | Dark surfaces, headings, hover states, footer, heroes | Deep Terracotta (`#874A35`) for interactive hover/accents; Forest Charcoal (`#283730`) / Deep Forest (`#1D2924`) for dark banners, footer, dark headings & PageHero |
| `#EAF0EC` | 46 files | Soft tinted sections, pills, secondary buttons, dark-mode text | Muted Sage (`#D2D6C8`) / Light Sand (`#F0DEC5`) for soft surfaces; Warm Cream (`#F3E4D2`) / White (`#FFFFFF`) for light text on dark backgrounds |
| `#D5A36A` | 43 files | Borders, focus rings, decorative accents, gold buttons | Primary Terracotta (`#A45E44`), Warm Sand (`#E5C499`), or Border (`#DDD4C7`) depending on semantic role & WCAG contrast |
| `#F5F7FA` | 35 files | Page ground, default card surfaces, input fills, navbar | Warm Cream (`#F3E4D2`) / Light Sand (`#F0DEC5`) for alternating backgrounds and navbar; Pure White (`#FFFFFF`) / Light Sand (`#F0DEC5`) for inputs & cards |
| `#E2E9E4` | 35 files | Dividers, card borders, hairlines | Subtle Border (`#DDD4C7`) / `--color-border` |
| `#66736C` | 33 files | Secondary descriptive text | Preserved Secondary Text (`#66736C`) on Pure White (`#FFFFFF`); upgraded to `#26332E` / `#4B5751` on Sand/Cream/Sage for WCAG AA |
| `#26332E` | 33 files | Primary body copy | Preserved Primary Text (`#26332E`) / `--color-text` |
| `#991B1B`, `#7F1D1D` | 2 files | Semantic crimson danger/alert text | Preserved semantic error state contrast |

### 2.2 Stray Non-Brand Tailwind Utility Classes Discovered
- **Admin Console (`src/app/admin/AdminClientLayout.tsx`, `login/page.tsx`, `page.tsx`, `audit-logs`, `inquiries`, `scholarships`, `users`, `volunteers`):**
  - Uses unrelated dark slate (`bg-slate-950`, `bg-slate-900`, `border-slate-800`, `text-slate-300`, `bg-slate-800`, `bg-slate-50`), blue (`bg-blue-500`, `bg-blue-100`, `text-blue-700`, `text-blue-800`), neutral `gray-*`, and `amber-400`/`amber-500` classes.
- **Public Flows (`src/app/scholarships/apply/page.tsx`, `scholarships/track/page.tsx`, `src/components/EligibilityCalculator.tsx`, `src/components/ui/Badge.tsx`, `src/app/page.tsx`):**
  - Contains residual `text-gray-*`, `border-gray-*`, `bg-gray-*`, and `bg-amber-*`/`text-amber-*` notice styling instead of centralized warm cream/sand/terracotta tokens.

---

## 3. Shared Components & Routes Affected

- **Design System Core:** `src/app/globals.css`, `src/app/layout.tsx`
- **UI Primitives (`src/components/ui/`):** `Badge.tsx`, `Button.tsx`, `Card.tsx`, `Input.tsx`, `Select.tsx`, `Textarea.tsx`, `StateFeedback.tsx`, `SectionHeader.tsx`, `Container.tsx`
- **Global Navigation & Persistent Chrome:** `Header.tsx`, `StatutoryTicker.tsx`, `Footer.tsx`, `PageHero.tsx`, `InstitutionalMarquee.tsx`, `QuickActionDock.tsx`, `HImChatbot.tsx`, `DeveloperCreditCard.tsx`, `Accordion.tsx`
- **Interactive Modules & Homepage Sections:** `FreeEducationSection.tsx`, `SmileFundraisingSection.tsx`, `SbiDonationSection.tsx`, `CsrRegistrationSection.tsx`, `SchemeExplorer.tsx`, `EligibilityCalculator.tsx`, `DirectDisbursalFlowchart.tsx`
- **Public Application Routes:** `/`, `/about`, `/governance`, `/statutory-disclosures`, `/programmes`, `/impact`, `/reports`, `/csr-partnerships`, `/donate`, `/scholarships`, `/scholarships/apply`, `/scholarships/track`, `/volunteer`, `/contact`, `/faq`, `/privacy`, `/terms`, `/accessibility`
- **Administrative Console Routes:** `/admin/login`, `/admin`, `/admin/scholarships`, `/admin/volunteers`, `/admin/inquiries`, `/admin/audit-logs`, `/admin/users`

---

## 4. Existing Inconsistencies & Visual Polish Issues

1. **Fragmented Colour Application:** `:root` variables in `globals.css` are duplicated by unused `@utility` classes (`*-navy`, `*-ivory`, `*-gold`) while individual JSX files embed raw hex strings (`bg-[#52796F]`, etc.).
2. **Admin Theme Disjoint:** `/admin/login` (`bg-slate-950`) and `/admin/*` dashboards (`bg-slate-50`, `bg-blue-500`) visually disconnect from the public institutional design language.
3. **Grey & Amber Leftovers:** `gray-50..900` and `amber-50..900` utility classes appear alongside the custom token palette in scholarship application/tracking flows and KPI tiles.
4. **Navbar vs Hero Hierarchy:** In `Header.tsx`, the Muted Sage / Warm Cream direction needs crisp dark Forest Charcoal (`#283730`) links and restrained Terracotta (`#A45E44`) active states, rather than washed cool-grey (`#F5F7FA`).

---

## 5. Accessibility & WCAG 2.2 AA Contrast Analysis (Measured)

Exact mathematical contrast ratios calculated for the official **Terracotta + Warm Sand + Forest Charcoal + Muted Sage + Warm Cream** palette:

| Surface / Background | Text / Foreground | Measured Ratio | WCAG Status | Rule / Technical Adjustment Applied |
|---|---|---|---|---|
| Primary Terracotta `#A45E44` | Pure White `#FFFFFF` | `4.93:1` | **AA Pass (All sizes)** | Mandatory foreground for body copy, buttons, and small labels over `#A45E44`. |
| Primary Terracotta `#A45E44` | Warm Cream `#F3E4D2` | `3.95:1` | **AA Large only** | Use `#F3E4D2` over `#A45E44` ONLY for large display headings (`>= 24px`), large decorative icons, or subtle badges backed by `#283730`/`#874A35`; use `#FFFFFF` for normal text. |
| Deep Terracotta `#874A35` | Pure White `#FFFFFF` / Warm Cream `#F3E4D2` | `6.86:1` / `5.50:1` | **AA Pass (All sizes)** | Safe for dark terracotta hover buttons, highlights, and compact labels. |
| Warm Sand `#E5C499` | Primary Text `#26332E` / Forest `#283730` | `7.95:1` / `7.55:1` | **AA / AAA Pass** | Primary readable text over `#E5C499`. |
| Warm Sand `#E5C499` | Secondary Text `#66736C` | `3.00:1` | **FAIL (Normal text)** | **Technical Adjustment:** Never render small `#66736C` text directly over `#E5C499`. Use Primary Text (`#26332E`) or `#4A5650` (`4.66:1` AA) / dark card surfaces (`#FFFFFF`) instead. |
| Light Sand `#F0DEC5` & Warm Cream `#F3E4D2` | Secondary Text `#66736C` | `3.77:1` / `3.98:1` | **FAIL (Normal text)** | **Technical Adjustment:** Restrict `#66736C` strictly to Pure White (`#FFFFFF`, `4.96:1` AA) cards/panels; use `#4B5751` (`>= 5.1:1` AA) or `#26332E` / `#283730` on Sand/Cream backgrounds. |
| Muted Sage `#D2D6C8` | Primary Text `#26332E` / Forest `#283730` | `8.90:1` / `8.45:1` | **AAA Pass** | Ideal for header/navigation links and chips with `#283730` ink; use `#874A35` (`4.64:1` AA) for terracotta active labels on Muted Sage. |
| Forest Charcoal `#283730` & Deep Forest `#1D2924` | Warm Cream `#F3E4D2` / Pure White `#FFFFFF` | `10.03:1`–`15.05:1` | **AAA Pass** | Footer, dark banners, `PageHero`, SBI header, and dark cards. |
| Pure White `#FFFFFF` | Secondary Text `#66736C` & Terracotta `#A45E44` | `4.96:1` & `4.93:1` | **AA Pass (All sizes)** | Cards, tables, inputs, and form helper text pass AA cleanly on `#FFFFFF`. |

---

## 6. Potential Regressions & Protection Plan

1. **Test Suite Coupling (`scratch/`):** Several scripts (`test-phase-p2-navigation.mjs`, `test-phase-p3-homepage.mjs`, `test-phase10-volunteer.mjs`, `test-phase11-contact.mjs`, `test-phase14-qa.mjs`, `test-phase2-homepage.mjs`) currently inspect rendered or source strings for `#52796F` / `#344F46` / `#D5A36A`. These test assertions will be updated alongside implementation to verify the new Terracotta–Sand–Forest Charcoal tokens and zero legacy blue/slate/navy regressions.
2. **Official MECT Emblem & Safeguarding:** The circular emblem (`/images/mect-official-emblem.png`) retains crisp contrast via a white inner mat (`bg-white`) with warm Terracotta (`#A45E44`) or Warm Sand (`#E5C499`) border; logo artwork will not be recoloured or altered, and `pic-1..9` remain excluded publicly.
3. **Reduced Motion & Layout Stability:** `MotionPrimitives.tsx` transform/opacity constraints and `@media (prefers-reduced-motion: reduce)` in `globals.css` must remain intact.
4. **Functional Integrity:** Zero changes to API routes, database schemas, static documentary facts, trust deed clauses, Form 10AC/107 disclosures, SBI credentials, or statutory IDs.

