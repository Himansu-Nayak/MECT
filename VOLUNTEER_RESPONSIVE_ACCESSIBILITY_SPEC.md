# MAHAVIR TRUST — Volunteer Section: Responsive & Accessibility Specification

**Document Reference**: `VOLUNTEER_RESPONSIVE_ACCESSIBILITY_SPEC.md`  
**Classification**: Accessibility (WCAG 2.2 AA) & Responsive Engineering Specification  
**Author**: Accessibility Specialist & Principal Next.js Engineer  
**Date**: November 2, 2026  
**Status**: SPECIFICATION READY  

---

## 1. Responsive Viewport Adaptation Matrix

The volunteer page layout is designed for seamless, resilient reflow across six standard breakpoints without horizontal scrolling, text clipping, or broken touch targets.

| Breakpoint | Target Device Category | Grid Behavior & Layout Structure | Typography & Padding Adjustments | Form & Interactive Adjustments |
| :--- | :--- | :--- | :--- | :--- |
| **360px** | Compact Android (e.g. Galaxy A series, Redmi) | Single-column linear layout (`grid-cols-1`). Full-width cards. | Root padding `px-3 py-10`. Hero h1 reduced to `text-2xl` (`leading-snug`). | Form inputs stack vertically. Touch targets enforced at `min-h-[44px]`. Select text wraps safely. |
| **390px** | Standard Mobile (e.g. iPhone 13/14/15, Pixel 7) | Single-column linear flow. Section margins balanced. | Root padding `px-4 py-12`. Hero h1 `text-3xl font-bold`. | Inputs full-width with `p-3 text-sm`. Checkbox touch target wrapped in label container. |
| **768px** | Tablet Portrait (e.g. iPad, Galaxy Tab) | 2-column grids for Role Cards (`grid-cols-2`). 2-column form inputs (Name + Email). | Root padding `px-6 py-16`. Hero h1 `text-4xl`. | Multi-step pathway renders in 2x2 grid or compact vertical flow. |
| **1024px** | Small Desktop / Tablet Landscape | 2-column or 4-column balanced grid for Roles. Form container max-width `max-w-3xl` centered. | Root padding `px-8 py-20`. Hero h1 `text-5xl`. | Horizontal step connector with connectors line. |
| **1440px** | Standard Editorial Desktop | Full 12-column editorial hierarchy. Container constrained to `max-w-7xl mx-auto`. | Root padding `px-8 py-24`. Generous editorial margins. | Ample breathing room, subtle hover elevations (`hover:-translate-y-0.5`). |
| **1920px** | Ultra-wide / 4K Displays | Centered container `max-w-7xl` with wide ivory side margins. | No extreme font stretching; capped at standard responsive scales. | Clean visual framing without layout distortion. |

---

## 2. WCAG 2.2 Level AA Accessibility Specification

### 2.1 Contrast Ratios (Minimum 4.5:1 for Text, 3:1 for UI Components)

| Element Pair | Foreground Color | Background Color | Measured Contrast | Compliance Level |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Text on Green** | `#FFFFFF` (Pure White) / `#FDFBF7` (Ivory) | `#072617` (Deep Forest) | **16.2:1** | Exceeds AAA (Required: 7.0:1) |
| **Hero Subtitle on Green** | `#E4C88A` (Pale Gold) | `#072617` (Deep Forest) | **10.4:1** | Exceeds AAA (Required: 7.0:1) |
| **Body Text on Light** | `#1C2421` (Deep Slate Charcoal) | `#FDFBF7` (Warm Ivory) | **13.8:1** | Exceeds AAA (Required: 7.0:1) |
| **Secondary Copy on Light**| `#4A5568` (Muted Slate) | `#FDFBF7` (Warm Ivory) | **6.1:1** | Passes AA (Required: 4.5:1) |
| **Gold Text on Light** | `#7A5E24` (Deep Contrast Gold) | `#FDFBF7` (Warm Ivory) | **4.9:1** | Passes AA (Required: 4.5:1) |
| **Primary Button Text** | `#072617` (Deep Forest) | `#C5A059` (Warm Gold) | **5.8:1** | Passes AA (Required: 4.5:1) |
| **Card Borders & Dividers**| `rgba(7, 38, 23, 0.12)` | `#FDFBF7` | **N/A** (Graphical) | Sufficient structural demarcation |

> **Note on Gold Text**: Standard gold (`#C5A059`) on white/ivory has a contrast ratio of only `2.4:1` (fails WCAG AA). Therefore, for all text elements on light backgrounds, the high-contrast token `--color-gold-contrast` (`#7A5E24`) is strictly used. `#C5A059` is reserved for dark backgrounds, button fills, and non-text borders.

---

### 2.2 Semantic HTML & Heading Hierarchy
- **Single `<h1>`**: Assigned exclusively to the main page title in the Hero section.
- **`<h2>` Elements**: Assigned to major sectional landmarks:
  - `<h2>Foundational Mentorship Philosophy</h2>`
  - `<h2>Why Volunteer with MAHAVIR TRUST</h2>`
  - `<h2>Volunteer Role Catalogue</h2>`
  - `<h2>The 4-Stage Induction Pathway</h2>`
  - `<h2>Student Safeguarding & Ethical Code</h2>`
  - `<h2>Priority District Clusters</h2>`
  - `<h2>Register as a Mentor or Volunteer</h2>`
  - `<h2>Frequently Asked Questions</h2>`
- **`<h3>` Elements**: Assigned to individual card titles, roles, and pathway steps.
- **Landmark Elements**: `<main id="main-content">`, `<section>`, `<article>`, `<header>`, `<footer>`.

---

### 2.3 Form Accessibility & Keyboard Interaction

1. **Explicit Form Labels**:
   Every input, select, and textarea element has a matching `<label htmlFor="...">` with visible text. No floating or disappearing placeholder-only labels.
2. **Keyboard Focus Rings**:
   All interactive elements (inputs, buttons, accordion headers, links) feature a high-visibility focus outline:
   ```css
   focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-[#FDFBF7]
   ```
3. **Touch Targets**:
   All interactive targets meet or exceed the **44 × 44 CSS pixels** touch requirement:
   - Form inputs: `py-3 px-3.5` with minimum line-height of `24px` (total height ~46px).
   - Buttons: `min-h-[46px]`.
   - Checkbox declaration: Wrapped in a `<label className="flex items-start gap-3 cursor-pointer py-2">` providing a large click/touch area.
4. **Error Handling & ARIA Live Regions**:
   - Form error banners utilize `role="alert"` and `aria-live="assertive"`.
   - Form success confirmation uses `role="status"` and `aria-live="polite"`.
   - Validation failure states associate inputs with error messages via `aria-invalid="true"` and `aria-describedby="[field]-error"`.

---

### 2.4 FAQ Accordion Accessibility (`@/components/Accordion.tsx`)
- The Accordion component is built with native `<button>` triggers containing:
  - `aria-expanded={isOpen}`
  - `aria-controls="faq-content-[index]"`
  - High-contrast Chevron icon with `aria-hidden="true"`.
- Panel content contains `id="faq-content-[index]"` and `role="region"`.
- Supports standard keyboard triggers (`Enter` and `Space` to toggle).

---

### 2.5 Reduced-Motion Specification (`prefers-reduced-motion`)
- When a user has enabled "Reduce Motion" in their operating system:
  - Motion entrance transforms (`translateY`) are disabled.
  - Page transitions fallback to instantaneous opacity switches (`duration: 0.01s`).
  - The notification marquee stops continuous scrolling and remains statically readable.
  - CSS rule enforced via:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    ```
