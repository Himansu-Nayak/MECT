# MECT — FINAL MASTER BASELINE AUDIT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Developer:** Cognisoftoho Technologies Private Limited ([https://ohotechn.com](https://ohotechn.com))  
**Primary Domain:** `https://mect.org.in/`  
**Staging Domain:** `https://staging.mect.org.in/`  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Date:** 2026-11-27  
**Working Branch:** `feat/complete-website-redefinition-and-deduplication`  
**Baseline Commit:** `db2fa93`  
**Status:** **`BASELINE RECORDED — EXECUTION AUDIT ACTIVE`**

---

## 1. PROJECT DISCOVERY & SYSTEM INVENTORY

### 1.1 Source Control & Git Topology
- **Repository:** `https://github.com/Himansu-Nayak/MECT`
- **Active Feature Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Active Baseline Commit:** `db2fa93` (`docs(audit): finalize Phase 3.2 master forensic reports and verification scripts`)
- **Remote Tracking:** Synced with `origin/feat/complete-website-redefinition-and-deduplication`
- **Working Tree State:** Clean (0 uncommitted changes)

### 1.2 Technology Stack & Framework Versions
- **Frontend Framework:** Next.js `16.4.6` (React 19, App Router, TypeScript strict, standalone Docker output)
- **Styling & Motion:** Tailwind CSS v3, Framer Motion (`motion/react`)
- **Backend Framework:** Spring Boot `4.0.0-SNAPSHOT` / `3.4.x` (Java 21 LTS, Maven 3.9, Jackson 3.x)
- **Database Architecture:** PostgreSQL 18-alpine running in dedicated isolated Docker container `mect-postgres`
- **Database Migrations:** Flyway (`V1` through `V21` applied successfully)
- **Web Server / Reverse Proxy:** Host Nginx with Let's Encrypt SSL, HTTP/2, and strict upstream location blocks
- **Transactional Communications:** Resend API integration with decoupled PostgreSQL outbox table and retry scheduler
- **Payment Ecosystem:** Dual-channel integration (Method A: Cashfree Payments Gateway; Method B: Direct SBI Current Account `41604112260` + HIM Dynamic UPI QR `86971610172@sbi`)

---

## 2. COMPREHENSIVE DONATION ECOSYSTEM BASELINE

| Component | Architecture / Implementation | Baseline Status | Known Failure / Remediation Needed |
| :--- | :--- | :---: | :--- |
| **Donation Programmes** | `DonationProgrammeRepository` + `VERIFIED_DONATION_PROGRAMMES` | Mismatched codes | **CRITICAL:** Frontend sent `GENERAL`, `EDUCATION`, `WATER`, `WOMEN`, `FOOD`; backend expected `GENERAL_FUND`, `EDUCATION_LEARNING`, etc. Causes "Selected donation programme is unavailable or inactive". |
| **Donation Amounts** | `PRESET_AMOUNTS` [500, 1000, 2500, 5000, 10000, 25000] | Operational | Presets validate against minimum ₹50 / maximum ₹5,00,000 bounds. |
| **Donor Registration / OTP** | `PortalAuthController`, SMS/Email OTP with Peppered BCrypt | Operational | End-to-end verified on staging and production. |
| **Cashfree Integration** | `CashfreePaymentGatewayService`, `CashfreePaymentController` | Incomplete launch | Checkout session creation failed due to programme code mismatch; Cashfree JS SDK v3 requires clean session launch. |
| **Direct Bank / UPI** | `DonationJourney.tsx` Step 6, SBI coordinates & UPI QR | Operational | Bank coordinates: SBI Account `33341302498`, IFSC `SBIN0001701`, VPA `86971610172@sbi`. Dynamic QR generated with `upi://pay`. |
| **UTR / Remittance Claim** | `POST /api/donations/claim` -> `POST /api/v1/public/donations/sbi/submit-utr` | Blocked on guest | `DonationController` enforced `portalUserId != null` returning 401, blocking guest donors. |
| **Admin Remittance Queue** | `AdminDonorController` (`/api/v1/admin/donations/sbi/claims`) | Operational | Role-based verification queue with manual approval (`VERIFIED`), bank reference entry, and receipt issuance. |
| **Receipt Generation** | `DonationReceiptService` (80G Tax-Exempt PDF) | Operational | Formatted as `MECT-RCPT-YYYY-XXXXXXXX` with Trust 80G registration `AAATM0000AF20214`. |

---

## 3. UI/UX & HEADER/NAVIGATION BASELINE

1. **Header Crowding & Duplication:**
   - The desktop navigation masthead rendered 8 primary items plus Search, Account, Menu, and a "Donate Now" CTA button.
   - Crucially, navigation item #8 was "Donate", appearing immediately adjacent to the "Donate Now" CTA button, creating visual clutter and duplicate actions.
2. **Permanent Sticky Header:**
   - Header declared `sticky top-0 z-40`, causing it to remain permanently anchored over page content throughout downward scrolling.
   - Requires dynamic scroll translation: naturally leave the viewport on downward scroll, and reveal smoothly when the user scrolls back up toward the top.
3. **Public Website Information Corrections Required:**
   - Deed Number (`40311302194`) displayed in public footer. Must be removed from ordinary presentation.
   - Balangir displayed as current public office address. Must be replaced with the official Bhubaneswar address:
     `A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014, India`.
   - Primary email currently configured as `mect220@gmail.com`. Must be updated to `mectbbsr13@gmail.com`.
   - Developer attribution currently reads `Website developed by Himansu Nayak`. Must be updated to `Website Developed by Cognisoftoho Technologies Private Limited` linking to `https://ohotechn.com`.
   - Governance page: Contains public card for "BOARD COMPOSITION" with "Board of Trustees" and Deed Clause 8(1) with photo. Must be removed and layout reclaimed.
   - Homepage Section 08: "SECTION 08 — TRANSPARENCY, GOVERNANCE & STATUTORY DOCKET" ("Statutory Transparency: Verifiable Sovereign Registrations") must be removed and layout reclaimed.
   - Homepage Hero: Single image `/images/hero/mect-trustees-campus-walk.webp`. Must be replaced with a rich 4–6 photo gallery/carousel highlighting authentic education, women empowerment, water, and community relief activities.
