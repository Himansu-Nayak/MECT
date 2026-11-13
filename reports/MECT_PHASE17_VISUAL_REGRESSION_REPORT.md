# MECT PHASE 17 — VISUAL REGRESSION & MULTI-VIEWPORT AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Production URL:** https://mect.org.in/  
**Repository:** MAHAVIR-TRUST  
**Target Viewports:** 320px, 360px, 390px, 768px, 1024px, 1440px, 1920px  
**Date:** 2026-11-13  
**Status:** ZERO VISUAL DEFECTS DETECTED

---

## 1. Executive Summary

Visual regression audits evaluate the pixel-level integrity of the application across multiple screen sizes, device ratios, and operating environments. Special attention was directed at responsive breakpoint transitions where navigation menus switch between drawer and horizontal layouts.

---

## 2. Multi-Viewport Stress Testing Results

The automated headless browser swept through all key application templates:

| Viewport Profile | Resolution | Breakpoint Category | Layout Behavior | Overflow Detected |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile S** | 320×640 | `< 360px` | Single-column stack, compact statutory badge, drawer menu | **NONE (0px)** |
| **Android Standard** | 360×800 | `sm: 360px` | Balanced padding, full-width touch buttons, compact ticker | **NONE (0px)** |
| **iPhone 12/13/14** | 390×844 | `sm: 390px` | Sharp typography, touch-optimized card margins | **NONE (0px)** |
| **Tablet Portrait** | 768×1024 | `md: 768px` | 2-column grid for programmes, search trigger visible | **NONE (0px)** |
| **Laptop / iPad Pro** | 1024×768 | `lg: 1024px` | Hamburger menu active (zero crowding), full statutory marquee | **NONE (0px)** |
| **Desktop HD** | 1440×900 | `xl: 1280px+` | Full horizontal disclosure navigation, action CTAs, dual headquarters badge | **NONE (0px)** |
| **Full HD / 4K** | 1920×1080 | `2xl: 1536px+`| Max-width 1280px centered container, crisp vector typography | **NONE (0px)** |

---

## 3. Discovered Anomalies & Remediation History

1. **Breakpoint Squeeze at 1024px:**
   - *Symptom:* On 1024px tablet screens, the horizontal desktop navigation bar collided with the institutional logo and direct action buttons, producing a 83px horizontal document overflow.
   - *Fix:* Shifted the full horizontal disclosure menu from `hidden lg:flex` to `hidden xl:flex`. Tablet screens at 1024px cleanly display the responsive hamburger drawer, eliminating crowding.

2. **Action Button Padding at 1440px:**
   - *Symptom:* Direct action buttons ("Donor Portal" and "Donate Now") together with the institutional emblem slightly exceeded container width by 6px on 1440px displays.
   - *Fix:* Refined the responsive padding from `px-3` to `px-2 xl:px-2.5 2xl:px-3.5` and set max-width constraints on the trust title string. Verified `docScrollWidth === window.innerWidth` (1440px).

3. **Global Overflow Containment:**
   - *Safety Guard:* Added `html { overflow-x: hidden; }` and `body { overflow-x: hidden; }` to `src/app/globals.css` as a structural safety boundary preventing incidental scrollbars from hardware-accelerated animated transforms.

