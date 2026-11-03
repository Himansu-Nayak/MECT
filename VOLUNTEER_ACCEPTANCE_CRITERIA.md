# MAHAVIR TRUST — Volunteer Section: Acceptance Criteria

**Document Reference**: `VOLUNTEER_ACCEPTANCE_CRITERIA.md`  
**Classification**: Quality Assurance & Acceptance Test Suite  
**Author**: QA and Automation Engineer & Accessibility Specialist  
**Date**: November 2, 2026  
**Status**: APPROVED ACCEPTANCE GATE  

---

## 1. Overview & Verification Protocol

Before the Volunteer section redesign can be accepted as complete and production-ready, it must pass 100% of the following auditable criteria across six validation dimensions:
1. **Functional Integrity**
2. **Visual & Design System Compliance**
3. **Responsive Reflow & Multi-Device Usability**
4. **Accessibility (WCAG 2.2 Level AA)**
5. **Technical & Build Reliability**
6. **Data Integrity & Fiduciary Compliance**

---

## 2. Functional Acceptance Criteria

- [ ] **AC-FUNC-01 (Mandatory Fields)**: Form submission is blocked if Full Name, Email, Phone, District, Role of Interest, Availability, or the Declaration Checkbox is missing.
- [ ] **AC-FUNC-02 (Email Validation)**: Form enforces valid RFC-compliant email structure (`user@domain.tld`) before triggering submission.
- [ ] **AC-FUNC-03 (Phone Validation)**: Form validates phone number against standard Indian contact formats (10 digits with optional `+91`).
- [ ] **AC-FUNC-04 (District Dropdown)**: Dropdown includes all 30 official districts of Odisha (Khordha, Cuttack, Mayurbhanj, Koraput, etc.) plus an option for *"Outside Odisha / NRI"*.
- [ ] **AC-FUNC-05 (Role Pre-Selection)**: Clicking *"Apply for this Role"* on any of the 4 role cards smoothly scrolls the page to the application form and automatically selects the corresponding role in the dropdown.
- [ ] **AC-FUNC-06 (Submission In-Flight State)**: While the API request is active, the submit button is disabled and displays a spinner (`Loader2`) with text *"Logging Volunteer Registration..."* to prevent multiple concurrent clicks.
- [ ] **AC-FUNC-07 (Successful Submission)**: On HTTP 201 response from `POST /public/volunteers`, the form is swapped with the official Success Confirmation Card displaying:
  - Official confirmation heading
  - Unique Reference ID (`#REF-XXXX`)
  - Secretariat review timeframe notice (5 business days)
  - Button to register another volunteer or return to programmes.
- [ ] **AC-FUNC-08 (Error State Handling)**: If the backend returns HTTP 400 (Validation Failure) or HTTP 429 (Rate Limit Exceeded), a clear, accessible error banner is displayed at the top of the form with `role="alert"`.
- [ ] **AC-FUNC-09 (Metadata Preservation)**: Extended fields (District, Qualification, Availability, Engagement Mode) are serialized cleanly into `backgroundNotes` without exceeding the 2000-character database limit.
- [ ] **AC-FUNC-10 (Homepage Non-Regression)**: The existing inline volunteer form on the homepage (`src/app/page.tsx` #participate) continues to function seamlessly without errors.

---

## 3. Visual & Design System Compliance

- [ ] **AC-VIS-01 (Palette Consistency)**: Uses only the verified institutional palette: Deep Forest Green (`#072617`), Light Forest (`#0B3B24`), Warm Gold (`#C5A059`), Contrast Gold (`#7A5E24`), Warm Ivory (`#FDFBF7`), and Sand Ivory (`#F4EFE6`). No unauthorized purple, neon, or generic colors.
- [ ] **AC-VIS-02 (Typography)**: Headings (`h1`, `h2`, `h3`) utilize `font-serif` (Georgia / Cambria); form inputs, data labels, and body copy utilize `font-sans` (Inter / system-ui).
- [ ] **AC-VIS-03 (Editorial Layout)**: Replaces the basic 2-column layout with the complete 9-section institutional narrative flow.
- [ ] **AC-VIS-04 (Motion Transitions)**: Subtle, GPU-accelerated Motion animations (`opacity: 0 -> 1`, `translateY: 10px -> 0px`) on sectional entrance. No aggressive or jarring movements.
- [ ] **AC-VIS-05 (Institutional Breadcrumbs)**: Prominently displays breadcrumbs matching the header design (`Home / Get Involved / Volunteer & Mentorship Network`).

---

## 4. Responsive Reflow & Touch Usability

- [ ] **AC-RESP-01 (360px Mobile)**: Clean vertical stacking on small Android screens; zero horizontal scrollbar; text reflows naturally without clipping.
- [ ] **AC-RESP-02 (390px Mobile)**: Form inputs fill container width; padding is balanced at `px-4`; touch targets are at least `44px` tall.
- [ ] **AC-RESP-03 (768px Tablet)**: 2-column grid for Role Cards; form layout uses 2-column field rows where appropriate.
- [ ] **AC-RESP-04 (1024px & 1440px Desktop)**: Full 4-role catalogue grid; horizontal 4-step onboarding connector; centered form desk constrained to `max-w-4xl`.
- [ ] **AC-RESP-05 (Touch Targets)**: Every interactive element (buttons, dropdowns, inputs, checkboxes, accordion triggers) provides a minimum touch area of `44 × 44 CSS pixels`.

---

## 5. Accessibility (WCAG 2.2 Level AA)

- [ ] **AC-A11Y-01 (Contrast Ratio)**: Body copy contrast against background is `≥ 4.5:1`. High-contrast text on dark surfaces is `≥ 7.0:1`. Gold text on light backgrounds strictly uses `--color-gold-contrast` (`#7A5E24`, `4.9:1`).
- [ ] **AC-A11Y-02 (Keyboard Navigability)**: Full tab sequence traverses through all navigation links, role action triggers, form inputs, declaration checkbox, submit button, and FAQ accordion items in logical order.
- [ ] **AC-A11Y-03 (Focus Rings)**: Visible, high-contrast gold outline (`focus:ring-2 focus:ring-[#C5A059]`) on all focused elements.
- [ ] **AC-A11Y-04 (Screen Reader Semantics)**: Single `<h1>` tag; hierarchical `<h2>` and `<h3>` tags; all form inputs possess explicit `<label htmlFor="...">` attributes; decorative icons include `aria-hidden="true"`.
- [ ] **AC-A11Y-05 (Accordion ARIA)**: FAQ items implement `aria-expanded` and `aria-controls` linked to panel `id`.
- [ ] **AC-A11Y-06 (Reduced Motion)**: Full compliance with `prefers-reduced-motion` media queries; transitions drop to instantaneous switches.

---

## 6. Technical & Build Reliability

- [ ] **AC-TECH-01 (TypeScript Check)**: `npx tsc --noEmit` completes with exit code `0` and zero diagnostic errors.
- [ ] **AC-TECH-02 (Production Build)**: `npm run build` completes successfully with exit code `0`; `/volunteer` route prerenders without SSR errors.
- [ ] **AC-TECH-03 (Bundle Size)**: Route bundle size remains under `225 kB`.
- [ ] **AC-TECH-04 (Backend Tests)**: Java Spring Boot test suite passes cleanly (`MahavirTrustBackendApplicationTests` exit code 0).
- [ ] **AC-TECH-05 (Zero Dependency Creep)**: Zero new packages installed in `package.json` or `pom.xml`.

---

## 7. Data Integrity & Fiduciary Disclosures

- [ ] **AC-DATA-01 (No Invented Personnel)**: No fictitious names or portraits of individual trustees or volunteer coordinators are published.
- [ ] **AC-DATA-02 (Statutory Fiduciary Clarity)**: Explicitly discloses that MAHAVIR TRUST operates under the Indian Trusts Act, 1882, and that volunteer participation is strictly honorary/unpaid.
- [ ] **AC-DATA-03 (Safeguarding & Student Welfare)**: Includes clear disclaimers prohibiting private commercial tuition, direct financial requests, or unmonitored communication outside Trust guidelines.
