# MECT Official Design Token Reference

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Architecture:** Single-source CSS custom properties (`:root`) in [src/app/globals.css](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/app/globals.css) exposed to Tailwind CSS v4 via `@theme inline` and `@utility` rules.  
**Last Updated:** 2026-11-10

---

## 1. Central `:root` Custom Properties & Semantic Utilities

| Official Role | CSS Variable | Tailwind v4 Token Class(es) | HEX Value | Intended Usage |
|---|---|---|---|---|
| Primary Terracotta | `--color-primary` | `bg-terracotta`, `text-terracotta`, `border-terracotta` | `#A45E44` | Hero surfaces, primary CTAs, programme accent rules, icon badges |
| Deep Terracotta | `--color-primary-dark` | `bg-terracotta-dark`, `hover:bg-terracotta-dark`, `text-terracotta-dark` | `#874A35` | Hover states, small text/eyebrow accents on Sand/Cream/Sage (`>= 4.64:1` AA) |
| Warm Sand | `--color-sand` | `bg-sand`, `text-sand`, `border-sand` | `#E5C499` | Highlight CTAs on dark/terracotta surfaces, ticker/badge fills, dark icons |
| Light Sand | `--color-sand-light` | `bg-sand-light` | `#F0DEC5` | Alternating programme/eligibility bands, callout callout tints |
| Forest Charcoal | `--color-forest` | `bg-forest`, `text-forest`, `border-forest` | `#283730` | Footer, `PageHero`, headings, navigation ink, dark cards |
| Deep Forest | `--color-forest-deep` | `bg-forest-deep`, `text-forest-deep` | `#1D2924` | Top `StatutoryTicker`, nested dark card surfaces, admin login ground |
| Muted Sage | `--color-sage` | `bg-sage`, `text-sage` | `#D2D6C8` | Marquee accreditation strip, subtle chips, hover nav backgrounds |
| Warm Cream | `--color-cream` | `bg-cream`, `text-cream` | `#F3E4D2` | Global body background, main navbar, alternating sections, light copy on dark forest |
| Pure White | `--color-white` | `bg-white`, `text-white` | `#FFFFFF` | Elevated cards, forms, white text over `#A45E44` Terracotta (`4.93:1` AA) |
| Primary Text | `--color-text` | `text-ink` | `#26332E` | Primary body copy across light surfaces (`7.95:1`–`13.16:1`) |
| Secondary Text | `--color-text-secondary` | `text-ink-secondary` | `#66736C` | Secondary descriptions strictly over Pure White (`#FFFFFF`, `4.96:1` AA) |
| Secondary Text (Sand/Cream) | `--color-text-on-sand` | `text-ink-sand` | `#4B5751` | Documented WCAG 2.2 AA calibration for secondary copy over Cream/Sand/Sage (`4.56:1`–`6.05:1` AA) |
| Border | `--color-border` | `border-border-warm`, `border-warm` | `#DDD4C7` | Card hairlines, dividers, form borders, nav separators |
| Semantic Error | `--color-crimson` / `--color-crimson-dark` | `text-crimson` | `#991B1B` / `#7F1D1D` | Validation errors and inline alerts |

---

## 2. Documented WCAG Contrast Rules & Pairings

1. **Over Primary Terracotta (`#A45E44`):**
   - Body copy, small links, buttons, and small labels MUST use `#FFFFFF` (`4.93:1` AA Pass).
   - Warm Cream (`#F3E4D2`) measures `3.95:1` over `#A45E44` and is restricted strictly to large headings/icons or dark-backed badges.
2. **Over Warm Sand (`#E5C499`), Light Sand (`#F0DEC5`), Warm Cream (`#F3E4D2`), & Muted Sage (`#D2D6C8`):**
   - Primary body & headings use Forest Charcoal (`#283730`) or Primary Text (`#26332E`) (`7.55:1`–`10.55:1` AAA).
   - Secondary descriptive paragraphs use `--color-text-on-sand` (`#4B5751`, `4.56:1` on Warm Sand; `5.74:1` on Light Sand; `6.05:1` on Warm Cream; `5.10:1` on Muted Sage), while `--color-text-secondary` (`#66736C`) is used on `#FFFFFF` surfaces (`4.96:1`).
   - Terracotta text links and small labels use Deep Terracotta (`#874A35`, `4.64:1`–`5.50:1` AA).
3. **Over Forest Charcoal (`#283730`) & Deep Forest (`#1D2924`):**
   - White (`#FFFFFF`: `12.50:1`–`15.05:1`), Warm Cream (`#F3E4D2`: `10.03:1`–`12.07:1`), Warm Sand (`#E5C499`: `7.55:1`–`9.10:1`), and Muted Sage (`#D2D6C8`: `8.45:1`–`10.17:1`) all achieve WCAG AAA.
4. **Focus Indicators:**
   - Light surfaces: `2px solid #A45E44` (`outline-terracotta`)
   - Dark surfaces: `2px solid #E5C499` (`outline-sand`)

---

## 3. Shared Component Token Consumers

- **Layout & Navigation:** [`Header.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Header.tsx), [`StatutoryTicker.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/layout/StatutoryTicker.tsx), [`Footer.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Footer.tsx), [`PageHero.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/PageHero.tsx), [`InstitutionalMarquee.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/InstitutionalMarquee.tsx), [`QuickActionDock.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/QuickActionDock.tsx)
- **UI Primitives (`src/components/ui/`):** [`Badge.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Badge.tsx), [`Button.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Button.tsx), [`Card.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Card.tsx), [`Input.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Input.tsx), [`Select.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Select.tsx), [`Textarea.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/Textarea.tsx), [`StateFeedback.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/StateFeedback.tsx), [`SectionHeader.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ui/SectionHeader.tsx)
- **Feature Sections & Tools:** [`FreeEducationSection.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/FreeEducationSection.tsx), [`SmileFundraisingSection.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/SmileFundraisingSection.tsx), [`CsrRegistrationSection.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/CsrRegistrationSection.tsx), [`SbiDonationSection.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/sections/SbiDonationSection.tsx), [`SchemeExplorer.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/SchemeExplorer.tsx), [`EligibilityCalculator.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/EligibilityCalculator.tsx), [`DirectDisbursalFlowchart.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/DirectDisbursalFlowchart.tsx), [`Accordion.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/Accordion.tsx), [`DeveloperCreditCard.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/DeveloperCreditCard.tsx), [`HImChatbot.tsx`](file:///c:/Users/himan/OneDrive/Desktop/MAHAVIR%20TRUST/src/components/ai/HImChatbot.tsx)

