# MUST CONFIRM account number, IFSC, UPI ID against the bank passbook BEFORE any deployment.

# MECT.ORG.IN — OWNER DECISIONS & FACT RECONCILIATION REGISTRY

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `fix/audit-loop`  
**Last Updated:** 2026-11-20  
**Purpose:** This document tracks all institutional facts, conflicting data points, tax wording adjustments, photo requirements, and translation reviews that require explicit Trust Management / CA verification. Per Hard Constraint 4 and 5, no facts are invented.

---

## 1. Facts to Confirm & Known Conflicts

- [ ] **CRITICAL: Official State Bank of India Account & UPI Credentials:**
  - *Current Baseline in `src/config/org.ts` (aligned with live site mect.org.in):*
    - Bank: **State Bank of India**
    - Account Holder: **MAHAVEER EDUCATIONAL & CHARITABLE TRUST**
    - Account Number: `33341302498`
    - IFSC Code: `SBIN0001701`
    - Branch: **Rajendra College Square, Bolangir**
    - UPI ID (VPA): `86971610172@sbi`
  - *Owner Action:* **MUST physically inspect the official SBI passbook/chequebook** to verify that Account `33341302498`, IFSC `SBIN0001701`, and UPI `86971610172@sbi` match the current operative account before any live release.


- [ ] **NGO Darpan Unique ID:**
  - *Conflict:* `OR/2024/0466491` (used across majority of new pages) vs `OD/2021/0285141` (present on legacy headers/statutory disclosures).
  - *Current Baseline in `org.ts`:* `OR/2024/0466491`.
  - *Owner Action:* Confirm whether the NITI Aayog portal record is `OR/2024/0466491` or `OD/2021/0285141`.

- [ ] **Primary Helpline & Telephone Numbers:**
  - *Conflict & Provenance:*
    - `+91 94371 23616`: Authentic live site helpline present across foundational releases since project inception (commit `287d8a6`, `0daa2bf`, `ea4ab59`).
    - `+91 98536 08113`: Introduced in commit `b294267` (Phase 24) without documentary passbook/telecom verification.
    - Placeholder `+91 671` landline: eradicated.
  - *Current Baseline in `org.ts`:* **`+91 94371 23616`** (official voice helpline). WhatsApp external direct link removed.
  - *Owner Action:* Confirm whether `+91 94371 23616` remains the sole public desk number or whether `+91 98536 08113` should be registered as a secondary mobile contact.

- [ ] **Secretariat Office Hours:**
  - *Conflict:* `Mon–Sat, 10:00–17:30 IST` vs `Mon–Fri, 10:00–17:00 IST`.
  - *Current Baseline in `org.ts`:* `Mon–Sat, 10:00–17:30 IST`.
  - *Owner Action:* Confirm working days and hours for Balangir registered office and Bhubaneswar administrative office.

- [ ] **Bhubaneswar Administrative Office Address:**
  - *Current Address:* `A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014`.
  - *Status:* Retained as stated in modern layout.
  - *Owner Action:* Confirm exact physical suite/room number and whether mail should be received at this address or Balangir.

- [ ] **First Annual Audit vs Historical Reports:**
  - *Conflict:* Impact page legacy copy stated "first annual audit scheduled" while Reports page hosts FY2021-22, FY2022-23, and FY2023-24 financial statements.
  - *Current Baseline:* Removed "first annual audit scheduled" contradiction; aligned with historical reports from 2021 onward.
  - *Owner Action:* Confirm availability and dates of external statutory audit certificates.

- [ ] **Board of Trustees & Leadership Disclosures:**
  - *Conflict:* Governance page legacy layout stated "Trustee Names Pending Gazette Publication" while About page names Er. Japabandhu Kampa as Settler Founder & Managing Trustee.
  - *Current Baseline:* Names Er. Japabandhu Kampa as Founder & Managing Trustee with Clause XVI honorary service notice. Removed "Pending Gazette" placeholder.
  - *Owner Action:* Provide the full list of co-trustees for publication on the governance page if desired.

---

## 2. Chartered Accountant (CA) & Tax Wording Review

Per Hard Constraint 5, all claims of "50% Tax Deduction Eligible", "100% Tax Exemption", "Form 10BE instant generation", and the illustrative Rs 10,000 tax saving calculation have been replaced with the neutral statutory text:

> *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility."*

Locations updated and logged for CA verification:

- [ ] `/statutory-disclosures`: Removed tax saving percentage claims; retained factual historical URN/DIN table for Section 12A (`AADTM5474FE20231`) and Section 80G (`AADTM5474FF20241`) for AY 2024-25 to AY 2026-27.
- [ ] `/donate`: Removed "50% Tax Deduction Eligible" green check badge, illustrative calculation table, and "Donate with 80G Tax Exemption" button copy. Replaced with neutral statutory note.
- [ ] `/about`: Standardized tax notice in legal disclaimer banner.
- [ ] `/reports`: Replaced tax deduction claims in financial disclosure summaries.
- [ ] `/faq`: Replaced tax advice and tax deduction FAQs with neutral disclaimer instructing donors to consult their tax advisors.
- [ ] Homepage & Global Footers: Removed 80G exemption promotional tags and badges.

---

## 3. Photographs & Field Media Inventory

Per Hard Constraint 4 and P1-5, no stock photos have been added. Full public media audit is registered in `audit/PHOTO_INVENTORY.md`. The following illustrative/placeholder assets require authentic field photography replacements from Trust field operations:

- [ ] **Needs real field photo from Balangir Library / Community Learning Centre:** currently using `/images/hero/illustrative-community-library-reading.webp` in `FreeEducationSection.tsx` and `/programmes`.
- [ ] **Needs real field photo from Balangir Child Outreach:** currently using `/images/hero/illustrative-child-support-outreach.webp`.
- [ ] **Needs real field photo from Women SHG Cluster:** currently using `/images/hero/illustrative-women-self-help-group.webp` in `/programmes`.
- [ ] **Needs real field photo from Shri Hanuman Murti proposed site:** currently in architectural 3D feasibility modeling stage.
- [ ] **High-Resolution Field Archive Batch:** Request high-resolution camera originals from Balangir and Rayagada field units for future exhibition expansion.

---

## 4. Odia Language Translation Review

Per P1-9, Odia language toggle (`locales/or.json`) provides community access for navigation, homepage, programmes, donate, and contact.

- [ ] **Review `locales/or.json`:** Machine-drafted strings require review by an Odia native speaker for dialectal appropriateness in Western Odisha (Kosali / Sambalpuri / Standard Odia).
- [ ] **Legal & Statutory Text:** Preserved in English across all language toggles to prevent legal misinterpretation.

---

## 5. Annual Reports & Statutory Filings (FY 2021–25)

- [ ] **FY 2021–22 Annual Activity Report & Financial Statement:** Upload the real signed PDF for each year when available. (On-page summary available; signed audit copy available for physical inspection on request).
- [ ] **FY 2022–23 Annual Activity Report & Financial Statement:** Upload the real signed PDF for each year when available. (On-page summary available; signed audit copy available for physical inspection on request).
- [ ] **FY 2023–24 Annual Activity Report & Financial Statement:** Upload the real signed PDF for each year when available. (On-page summary available; signed audit copy available for physical inspection on request).
- [ ] **FY 2024–25 Annual Activity Report & Financial Accounts:** Marked **"Pending"** across Activity Report, Audited Statement, and Form 10B. Financial accounts are currently undergoing annual reconciliation and statutory preparation by the Chartered Accountant. Download slot in `/public/reports/` is reserved and will be activated upon audit sign-off.

---

## 6. Needs a documentary source before publishing

Per Loop 6 audit directive, all unverified dispatches, day-specific dates, and privacy markers have been completely removed from public pages:

- [ ] **Arogya Diagnostic Camp at Rayagada:** Removed from `/stories`. Requires primary health camp docket, certified medical coordinator details, and government health department permissions before publishing.
- [ ] **Higher Education Scholarship Distribution FY 2024–25:** Removed from `/stories`. Scholarship grants are currently proposed with zero funded places; cannot publish retrospective distribution stories without audited bank disbursal vouchers and sanction letters.
- [ ] **Emergency Heatwave Relief 2024 (Day-Specific Accounts):** Removed invented daily counts. Restored documented seasonal Jal Seva dispatch covering documented April–June period with verified service instance caveats ("service instances, not unique-person census").

