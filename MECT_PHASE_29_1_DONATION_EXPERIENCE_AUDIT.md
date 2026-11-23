# MECT PHASE 29.1 — COMPLETE DONATION EXPERIENCE AUDIT REPORT
## 6-Step Guided Flow, Programme Cards, Parameter Continuity & Gateway Integrations

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Component Audited:** `src/components/sections/UnifiedDonationExperience.tsx`, `src/app/donate/page.tsx`

---

## 1. 6-STEP DONATION JOURNEY EVALUATION

The complete donation flow was audited across each progressive step:

| Step | Scope & Name | Publicly Accessible | Authentication State | Functional Verification |
| :---: | :--- | :---: | :---: | :--- |
| **01** | **Explore Programmes** | **YES** | Unauthenticated | Displays all active charitable programmes with funding objectives, suggested amounts, and Documentary Editorial card styling. |
| **02** | **Select Amount** | **YES** | Unauthenticated | Supports preset amounts (₹500, ₹1,000, ₹2,500, ₹5,000, ₹10,000) and custom amount entry (min ₹100, max ₹50,00,000). |
| **03** | **Donor Authentication** | **NO** | Mandatory Check | Enforces mobile OTP verification. Unauthenticated callers cannot advance to Step 4 without completing 6-digit OTP verification. |
| **04** | **Donor Information** | **NO** | Authenticated | Pre-fills authenticated profile (Legal Name, Email, Phone, Address, District, PIN, optional PAN) from server state. |
| **05** | **Review & Disclosure** | **NO** | Authenticated | Displays itemized allocation, Section 80G statutory disclosure, PAN declaration, and terms consent. |
| **06** | **Payment & Receipting**| **NO** | Authenticated | Completes transaction via Cashfree or SBI Direct NEFT and renders instant cryptographic PDF receipt download. |

---

## 2. PARAMETER CONTINUITY & SEAMLESS RETURN

When a supporter selects a programme on Step 1 (e.g. `HANUMAN_MURTI`) and an amount on Step 2 (e.g. `5000`), navigating to `/login` or `/register` encodes these parameters into the URL:

```
/login?next=%2Fdonate%3Fprogramme%3DHANUMAN_MURTI%26amount%3D5000
```

Upon successful OTP confirmation on `/login` or `/register`:
1. The router redirects to `/donate?programme=HANUMAN_MURTI&amount=5000`.
2. `UnifiedDonationExperience.tsx` parses `searchParams`, restores the selected programme (`HANUMAN_MURTI`), sets `amount = 5000`, and detects `portalToken != null`.
3. The wizard **automatically advances to Step 4 (Donor Profile)**, eliminating redundant clicks and friction.

---

## 3. PAYMENT GATEWAY STABILITY & STATUTORY RINGFENCING

1. **Cashfree Gateway:**
   - Seamless checkout session creation via `POST /public/donations/initiate`.
   - Webhook and redirect return callbacks verified via `POST /public/donations/verify-checkout`.
2. **State Bank of India (SBI) Manual NEFT Transfer:**
   - Official Account: `33091993247`, IFSC: `SBIN0000048`, Balangir Main Branch, UPI: `mect@sbi`.
   - Remitters enter their 12-digit UTR (`SBIN...`) and date of transfer.
   - Generates a pending verification record (`PENDING_VERIFICATION`) with zero ghost revenue until administrator review.
3. **Hanuman Murti Cultural Sub-Ledger:**
   - Dedicated ringfenced accounting ensures monument contributions cannot cross-mingle with secular welfare funds.
