# MECT.ORG.IN — OWNER DECISIONS & FACT RECONCILIATION REGISTRY

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `fix/audit-loop`  
**Last Updated:** 2026-11-20  
**Purpose:** This document tracks all institutional facts, conflicting data points, tax wording adjustments, photo requirements, and translation reviews that require explicit Trust Management / CA verification. Per Hard Constraint 4 and 5, no facts are invented.

---

## 1. Facts to Confirm & Known Conflicts

Where the codebase or existing site had conflicting information, the value present on the majority of modern pages was selected for `src/config/org.ts` as the baseline. The conflicts are logged below for official confirmation:

- [ ] **NGO Darpan Unique ID:**
  - *Conflict:* `OR/2024/0466491` (used across majority of new pages) vs `OD/2021/0285141` (present on legacy headers/statutory disclosures).
  - *Current Baseline in `org.ts`:* `OR/2024/0466491`.
  - *Owner Action:* Confirm whether the NITI Aayog portal record is `OR/2024/0466491` or `OD/2021/0285141`.

- [ ] **Primary Helpline & Telephone Numbers:**
  - *Conflict:* `+91 98536 08113` (majority of current pages) vs `+91 94371 23616` (legacy scholarship forms) vs `+91 671 234 5678` (placeholder Cuttack landline).
  - *Current Baseline in `org.ts`:* `+91 98536 08113` (mobile/WhatsApp). Legacy placeholder `+91 671` removed.
  - *Owner Action:* Confirm official primary public helpline phone number.

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

Per Hard Constraint 4 and P1-5, no stock photos have been added. The following placeholders/Wikimedia hero images require authentic field photography replacements:

- [ ] **Homepage Hero Banner:** Currently uses verified regional photography. Needs high-resolution photo of MECT community activities in Balangir.
- [ ] **Education & Learning Section:** Needs authentic photos of MECT remedial classes / tribal students receiving learning materials.
- [ ] **Women Empowerment Section:** Needs authentic photos of the Swavalamban tailoring / vocational training centre in Rugudipara.
- [ ] **Safe Water (Jal Seva) Section:** Needs authentic photos of Jal Seva summer drinking water booths.
- [ ] **Food Relief (Jan Ahar) Section:** Needs authentic photos of community meal distribution at Balangir hospital / rural settlements.
- [ ] **Shri Hanuman Murti (Cultural Landmark):** Currently labeled "Proposed / Feasibility Stage". Needs architectural sketch or site location photo when available.

---

## 4. Odia Language Translation Review

Per P1-9, Odia language toggle (`locales/or.json`) provides community access for navigation, homepage, programmes, donate, and contact.

- [ ] **Review `locales/or.json`:** Machine-drafted strings require review by an Odia native speaker for dialectal appropriateness in Western Odisha (Kosali / Sambalpuri / Standard Odia).
- [ ] **Legal & Statutory Text:** Preserved in English across all language toggles to prevent legal misinterpretation.

---

## 5. Annual Reports & Statutory Filings (FY 2024-25)

- [ ] **FY 2021-22 Financial Statement:** Available in repository.
- [ ] **FY 2022-23 Financial Statement:** Available in repository.
- [ ] **FY 2023-24 Financial Statement:** Available in repository.
- [ ] **FY 2024-25 Financial Statement:** Marked **"Pending Statutory Audit"**; to be uploaded once completed by the statutory auditor.
