# MECT — Brand Identity & Design System Specification

**Status:** Locked Production Specification
**Palette Lock:** Sage Green Institutional Identity (Zero Navy `#111D32`/`#0A192F`, Zero Legacy Forest Green `#0B3B24`/`#072617`)

---

## 1. Colour Token Architecture (`src/app/globals.css`)

| Token Role | Hex Value | Usage Rules |
| :--- | :--- | :--- |
| **Primary Sage Green** | `#52796F` | Hero canvas, primary buttons (`Button variant="primary"`), dark stat sections, iconography containers. |
| **Deep Sage Green** | `#344F46` | Primary light-surface H2/H3/H4 headings (`#F5F7FA`/`#FFFFFF`/`#EAF0EC` >= 8.5:1 contrast), dark subpage `PageHero`, `StatutoryTicker`, `Footer`, dark contrast cards, button hover states. |
| **Soft Sage Green** | `#EAF0EC` | Alternating light-tinted sections, callout banners, icon wells, soft badges. |
| **Porcelain White** | `#F5F7FA` | Main viewport ground background and alternating light sections. |
| **Pure White** | `#FFFFFF` | Elevated cards, form surfaces, editorial overview sections, CSR certificate paper backdrop. |
| **Soft Champagne Accent** | `#D5A36A` | Restraint accent only: emblem medallion borders, pill dividers, dark-surface rule lines, primary gold CTA fills (strictly paired with dark `#26332E` text). |
| **Primary Text** | `#26332E` | All primary light-surface prose copy and high-contrast labels. |
| **Secondary Text** | `#66736C` | Supporting descriptions, captions, timestamps. |
| **Subtle Border** | `#E2E9E4` | Card borders, section hairlines, table separators. |

---

## 2. Self-Hosted Google Typography (`next/font/google` in `src/app/layout.tsx`)

| Family Role | Font Family | Weights Loaded | CSS Variable | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Editorial Serif** | `Lora` | `500`, `600`, `700` | `--font-serif` | `h1`–`h6`, editorial headlines, hero display titles, wordmark (`Mahaveer Educational & Charitable Trust`), `tabular-nums` stat figures. |
| **UI & Body Sans** | `Plus Jakarta Sans` | `400`, `500`, `600`, `700`, `800` | `--font-sans` | Navigation, paragraphs (`line-height: 1.65`, `max-w-xl`/`max-w-2xl`), buttons, form controls, statutory lists. |
| **Technical Monospace** | `JetBrains Mono` | `400`, `500`, `600`, `700` | `--font-mono` | Bank account numbers (`33341302498`), IFSC (`SBIN0001701`), Deed No., PAN, 12A/80G URNs, CSR numbers, all with `font-variant-numeric: tabular-nums`. |

---

## 3. Shared Component Standards (`src/components/ui/`)
- **`Button.tsx`:** `sm` (`min-h-[36px]`), `md` (`min-h-[44px]`), `lg` (`min-h-[48px]`), `font-semibold tracking-tight`, visible `#D5A36A` 2px focus ring.
- **`Card.tsx`:** Clean crisp `rounded-xs` geometry (`default`, `elevated`, `accent`, `dark`, `stat`) with `#E2E9E4` border transitions.
- **`SectionHeader.tsx`:** Unified `text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15]` titles on `#344F46` (light) or `#FFFFFF` (dark).
- **`PageHero.tsx`:** Clean dark `#344F46` banner with structured Schema.org breadcrumbs and crisp `h1`, deliberately free of Hero eyebrow pills or `Est. 2013` marketing clutter.
- **`Header.tsx` & `Footer.tsx`:** Displays the circular framed official MECT emblem (`object-cover scale-[1.06]`) paired once with `Mahaveer Educational & Charitable Trust` (`1280px`+ single-row fit verified with `0px` horizontal overflow).

