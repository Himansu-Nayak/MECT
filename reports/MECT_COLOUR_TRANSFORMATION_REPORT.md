# MECT Colour Transformation Report

**Audit & Verification Date:** 2026-11-10
**Scope:** Global design tokens (`src/app/globals.css`), theme mapping, shared components, header, navigation, hero, sections, forms, modals, and footer.

---

## 1. Approved Colour System (Verified Active in `src/app/globals.css`)

| Design Token | CSS Variable | Approved HEX | Application & Role | Status |
|---|---|---|---|---|
| Primary Terracotta | `--color-primary` | `#A45E44` | Hero background canvas, primary buttons, brand highlights | VERIFIED |
| Deep Terracotta | `--color-primary-dark` | `#874A35` | Hover states, active controls, borders | VERIFIED |
| Warm Sand | `--color-sand` | `#E5C499` | Highlight buttons, dividers, gallery card frames, marquee borders | VERIFIED |
| Light Sand | `--color-sand-light` | `#F0DEC5` | Secondary warm surfaces and header tint | VERIFIED |
| Forest Charcoal | `--color-forest` | `#283730` | Footer, dark contrast sections, secondary hero CTA fill, dock | VERIFIED |
| Deep Forest | `--color-forest-deep` | `#1D2924` | Gallery card backplates, Pause Gallery control, contrast surfaces | VERIFIED |
| Muted Sage | `--color-sage` | `#D2D6C8` | Subtle navigation/supporting surfaces | VERIFIED |
| Warm Cream | `--color-cream` | `#F3E4D2` | Global body background (`rgb(243, 228, 210)`), light text on dark/terracotta | VERIFIED |
| White | `--color-white` | `#FFFFFF` | Clean content cards, form surfaces, Hero headline/body over `#A45E44` | VERIFIED |
| Primary Text | `--color-text` | `#26332E` | Primary typography on light backgrounds | VERIFIED |
| Secondary Text | `--color-text-secondary` / `--color-text-on-sand` | `#66736C` / `#4B5751` | Supporting typography (with AA-calibrated `#4B5751` on warm cream/sand) | VERIFIED |
| Border | `--color-border` | `#DDD4C7` | Subtle warm hairline dividers and card borders | VERIFIED |

---

## 2. Source Audit Summary

- Verified via `Select-String` scan across all `.tsx`, `.ts`, and `.css` files in `src/` that all colour classes route through the central `@theme inline` + `:root` custom properties and semantic utilities in `src/app/globals.css`.
- Confirmed zero legacy emerald, teal, slate, zinc, `#111D32`, or `#0A192F` navy overrides exist in `src/`.
- Verified the official MECT emblem (`/images/mect-official-emblem.png`, `256×256` PNG) and artwork remain strictly unaltered across `Header.tsx`, `Footer.tsx`, and metadata.
- Confirmed the newly added `HeroPhotoGallery.tsx` integrates exclusively using `--color-forest-deep`, `--color-forest`, `--color-sand`, and `--color-cream` over the `--color-primary` (`#A45E44`) Hero canvas without introducing colour tint overlays or gradients over photographs (only pure CSS alpha `mask-image` edge feathering is used).

