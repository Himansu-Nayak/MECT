# MECT — Complete Website Visual, Motion, QR & Technical Audit

**Date:** 2026-11-11  
**Branch:** `feat/multi-sector-ngo-repositioning`  
**Target Domain:** `https://mect.org.in`  
**Scope Inspected:** Homepage (`/`), `/about`, `/programmes` (including Free Education & Women's Empowerment pillars), `/csr-partnerships`, `/governance`, `/impact`, `/donate` (including `SmartDonationCheckout` and `SbiDonationSection`), `/contact`, plus shared layout & UI primitives (`Header`, `Footer`, `PageHero`, `Button`, `Card`, `MotionPrimitives`, `HeroBackgroundMarquee`, `globals.css`).

---

## Executive Summary

The core MECT institutional identity (Forest Green `#283730` / `#1D2924`, Terracotta `#A45E44`, Warm Cream `#F3E4D2`, Champagne Sand `#E5C499`, Lora + Plus Jakarta Sans + JetBrains Mono), mobile hero `HeroMobilePhotoStrip`, and SBI QR poster (`public/images/mect-sbi-upi-qr.png`, `86971610172@sbi`) form a solid foundation. However, a route-by-route source audit identified **7 concrete defects** across trust governance copy, motion differentiation, dead animation utility classes, prop dropping in `PageHero`, eager loading of below-fold images, and SBI QR micro-interactions.

---

## Findings by Severity

### Critical

1. **Unverified Beneficiary Claim on Static SBI UPI QR (`SbiDonationSection.tsx`)**
   - **Location:** `src/components/sections/SbiDonationSection.tsx` (status badge `"Verified UPI QR"`, prop JSDoc / UI labels) and receipt expectations.
   - **Defect:** Labeling the static SBI QR `"Verified UPI QR"` implies third-party beneficiary verification and/or automatic settlement tracking, whereas code inspection cannot prove that a scanned QR resolves to the Trust's legal bank account and static UPI transfers do not auto-settle via Razorpay webhooks.
   - **Required Fix:** Reword the status badge to `"Static SBI Scan & Pay"`, clarify explicitly that donors must verify payee `MAHAVEER EDUCATIONAL CHARITA` inside their UPI app and submit their UPI Ref / UTR on `/donate#receipt-claim`, and **halt GitHub push / VPS release until the Trust owner scans `mect-sbi-upi-qr.png` in a banking app and confirms beneficiary accuracy.**

---

### High

2. **Monolithic / Under-Applied Motion System (`MotionPrimitives.tsx`, `page.tsx`, `Header.tsx`, Subpages)**
   - **Location:** `src/components/ui/MotionPrimitives.tsx`, `src/components/Header.tsx`, `src/app/page.tsx`, and routes `/about`, `/programmes`, `/impact`, `/governance`, `/contact`, `/donate`.
   - **Defect:**
     - `MotionPrimitives.tsx` defines only a single uniform `Reveal` (`y: 14`, `duration: 0.44`) without standardized motion tokens (`fast`, `standard`, `slow`, `staggerDelay`, `hoverTransition`), directional variety (`left`/`right`/`up`/`fade`), or count-up statistics (`CountUpStat`).
     - Desktop navigation (`Header.tsx`) lacks an animated active-link indicator (`layoutId`), while the mobile drawer (`#mobile-navigation-drawer`) pops open abruptly with no entrance transition or staggered link sequence.
     - Impact metrics (`13+`, `350+`, `120+`, `10,000+` on `/`) render passively without viewport-triggered count-up animation.
     - Five Development Sectors (`#programs`), How MECT Works, Managing Trustee banner, CTA micro-interactions, SBI QR copy feedback, and Footer all lack differentiated motion behaviours; subpages (`/about`, `/programmes`, `/impact`, `/governance`, `/contact`, `/donate`) have zero scroll reveals.
   - **Required Fix:** Architect an explicit token-driven motion library in `MotionPrimitives.tsx` using installed `motion` (`v12.4.7`), honoring `useReducedMotion()`, with distinct purposeful choreography per component type while keeping QR matrices completely static (`0` transform/scale/blur on `<img>`).

3. **Non-Hero Large Images Forced Eager (`HeroBackgroundMarquee.tsx`, `CsrRegistrationSection.tsx`, `Footer.tsx`)**
   - **Location:** `HeroBackgroundMarquee.tsx` (all `14` main + clone slide `<img>` tags), `CsrRegistrationSection.tsx` (`mect-csr1-certificate.png`), `Footer.tsx` (`mect-official-emblem.png`).
   - **Defect:** Loading off-screen marquee slides (`idx 2..5`) and deep below-the-fold assets (`mect-csr1-certificate.png`, footer logo) with `loading="eager"` competes with above-the-fold hero photography and typography on initial connection.
   - **Required Fix:** Keep only initial visible hero slides (`idx 0, 1, 6` and initial loop boundary frames) `eager` while setting trailing panels, CSR certificate thumbnail, and footer emblem to `loading="lazy"`.

---

### Medium

4. **Silently Dropped `badge` Prop in Shared Subpage Hero (`PageHero.tsx`)**
   - **Location:** `src/components/PageHero.tsx` (lines 11–35) vs callers such as `src/app/about/page.tsx` (line 118).
   - **Defect:** `PageHeroProps` declares `badge?: string | React.ReactNode` and `badgeVariant`, yet `PageHero` destructuring omits both parameters, dropping the eyebrow badge from `/about` and other pages that pass it.
   - **Required Fix:** Render `<Badge variant={badgeVariant} size="md">` above `<h1>` whenever `badge` is provided, paired with a subtle `HeroEntrance` wrapper.

5. **Static QR Feedback & Footer SBI Consistency (`SbiDonationSection.tsx`, `Footer.tsx`)**
   - **Location:** `src/components/sections/SbiDonationSection.tsx`, `src/components/Footer.tsx` (Column 5 SBI card).
   - **Defect:** Copying `86971610172@sbi` updates only a small icon inside the square button with no clear inline animated toast/pill (`UPI ID copied`), and the Footer's SBI transfer box omits the official UPI ID `86971610172@sbi` while retaining a `verified` shortcut ambiguity.
   - **Required Fix:** Add clear accessible animated confirmation feedback on UPI/field copy without moving the QR image itself, keep the QR image sharp and stationary, and surface `UPI ID: 86971610172@sbi` cleanly in Footer Col 5 alongside Account No. & IFSC.

---

### Low

6. **No-Op `animate-in fade-in` Utility Classes (`Header.tsx`, `page.tsx`, subpage forms)**
   - **Location:** `src/components/Header.tsx:222`, `src/app/page.tsx:844,1289`, `src/app/contact/page.tsx`, `src/app/csr-partnerships/page.tsx`, `src/app/donate/page.tsx`, `src/app/volunteer/page.tsx`.
   - **Defect:** `tailwindcss-animate` is not installed in `package.json`, making Tailwind `animate-in fade-in slide-in-from-top-1` classes inert no-ops.
   - **Required Fix:** Replace desktop dropdown flyout (`Header.tsx`) and homepage/form confirmation cards with real `motion/react` or CSS `@keyframes` transitions respected under `prefers-reduced-motion`.

7. **Minor Vertical Rhythm & Subpage Spacing Harmonisation (`page.tsx`)**
   - **Location:** `src/app/page.tsx:390` (`md:py-22` vs `md:py-24` / `md:py-28`).
   - **Defect:** Slight inconsistent vertical padding between adjacent homepage sections (`md:py-22` on About Intro vs `md:py-24`/`md:py-28` on neighboring sections).
   - **Required Fix:** Standardize homepage section rhythm (`py-16 sm:py-20 md:py-24` or `md:py-28`) across editorial sections cleanly.

