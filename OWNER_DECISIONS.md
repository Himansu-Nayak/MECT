# MUST CONFIRM account number, IFSC, UPI ID against the bank passbook BEFORE any deployment.

# MECT.ORG.IN — OWNER DECISIONS & FACT RECONCILIATION REGISTRY

**Organisation:** Mahaveer Educational & Charitable Trust (MECT)  
**Branch:** `fix/audit-loop`  
**Last Updated:** 2026-11-20  
**Purpose:** This document tracks all institutional facts, conflicting data points, tax wording adjustments, photo requirements, and translation reviews that require explicit Trust Management / CA verification. Per Hard Constraints, no facts are invented.

---

## BLOCKING OWNER DECISIONS (Must Be Confirmed Before Production Release)

The following items are prioritized in strict order of operational, security and statutory importance:

### 1. Compromised Groq API Key Revocation (BLOCKING SECURITY ITEM)
- **Status:** A Groq API key (`gsk_...`) was committed to git history in historical commit `e995fbb` (Nov 14, 2026) in `scripts/run_mect_ai_tests.mjs`. Although scrubbed from the working tree in commit `305c80a`, it persists in historical commit objects.
- **Owner Action:** **REVOKE the Groq API key that appeared in commit e995fbb and create a new one in the Groq console. Assume it is compromised. Store the new key only in the server environment and git-ignored `.env.local`.** See `docs/HISTORY_CLEANUP.md` for git history cleanup instructions.

### 2. Bank Details vs Physical Passbook (CRITICAL)
- **Current Baseline in `src/config/org.ts` (aligned with live site `mect.org.in`):**
  - Bank: **State Bank of India**
  - Account Holder: **MAHAVEER EDUCATIONAL & CHARITABLE TRUST**
  - Account Number: `33341302498`
  - IFSC Code: `SBIN0001701`
  - Branch: **Rajendra College Square, Bolangir**
  - UPI ID (VPA): `86971610172@sbi`
- **Owner Action:** **MUST physically inspect the official SBI passbook/chequebook** to verify that Account `33341302498`, IFSC `SBIN0001701`, and UPI `86971610172@sbi` match the current operative account before any live release.

### 2. Helpline Phone Number (`+91 94382 95223`)
- **Status:** **OWNER-APPROVED / DOCUMENTARY VERIFICATION PENDING**
- **Owner Identification:** The owner has formally identified `+91 94382 95223` as the authorized MECT organizational helpline.
- **Configuration Policy:** Retained in canonical organization configuration (`src/config/org.ts`) as a pending verification value. It is NOT independently document-verified until supporting telecom/SIM documentary proof is furnished.
- **Historical Audit Evidence:**
  - `+91 94371 23616`: Authentic live site helpline present across foundational releases since project inception (commits `287d8a6`, `0daa2bf`, `ea4ab59`). Preserved as historical audit baseline.
  - `+91 98536 08113`: Introduced in commit `b294267` (Phase 24) without accompanying passbook or telecom documentary verification.
- **Owner Action:** Await supporting physical documentation (e.g. telecom bill, official SIM registration receipt, or Trust letterhead endorsement) before marking documentary verification checklist complete. Checklist status remains open `[ ]`.

### 3. Ownership of Secondary Number (`+91 98536 08113`)
- **Status:** Introduced in commit `b294267` (Phase 24) without accompanying passbook or telecom documentary verification. External WhatsApp direct links to this number have been removed from public pages.
- **Owner Action:** Clarify who owns `+91 98536 08113` (e.g. personal mobile of a specific Trustee, field coordinator, or technical volunteer) and whether it should be registered as a secondary contact desk or omitted from public web pages.

### 4. NGO Darpan Unique ID
- **Conflict:** `OR/2024/0466491` (used across majority of new pages) vs `OD/2021/0285141` (present on legacy headers/statutory disclosures).
- **Current Baseline in `src/config/org.ts`:** `OR/2024/0466491`.
- **Owner Action:** Confirm the exact unique registration number appearing on the NITI Aayog NGO Darpan portal certificate.

### 5. Official Secretariat Email Address Confirmation
- **Status:** The fallback contact address across fail-closed 503 advisories and intake forms is `mect220@gmail.com` (sourced exclusively from `MECT_ORG.contact.generalEmail` in `src/config/org.ts`). It was first introduced into the codebase in commit `b294267` (Nov 18, 2026, Phase 24). The live website previously obfuscated contact emails behind script protection.
- **Owner Action:** **Confirm the official Secretariat email address.** Decide whether the Trust uses `mect220@gmail.com`, `contact@mect.org.in`, or `trust@mect.org.in` as the primary public email desk. `src/config/org.ts` is the single source of truth for this value.

### 6. Secretariat Office Hours
- **Conflict:** `Mon–Sat, 10:00–17:30 IST` vs `Mon–Fri, 10:00–17:00 IST`.
- **Current Baseline in `src/config/org.ts`:** `Mon–Sat, 10:00–17:30 IST`.
- **Owner Action:** Confirm working days and hours for the Balangir registered office and Bhubaneswar administrative office.

### 7. Bhubaneswar Administrative Office Address
- **Current Address in `src/config/org.ts`:** `A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014`.
- **Owner Action:** Confirm exact physical room/suite number and whether official postal correspondence should be directed to Bhubaneswar or Balangir registered office (`At/Po: Puintala, Dist: Balangir, Odisha - 767002`).

### 8. Chartered Accountant (CA) Review of Statutory Tax Wording
- **Status:** All promotional claims of "50% Tax Deduction Eligible", "100% Tax Exemption", "Form 10BE instant generation", and the illustrative ₹10,000 tax saving table have been removed and replaced with neutral statutory wording:
  > *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility."*
- **Owner Action:** Have the Trust's Chartered Accountant review Section 12A (`AADTM5474FE20231`) and Section 80G (`AADTM5474FF20241`) validity periods (AY 2024-25 to AY 2026-27) and confirm appropriate receipt disclosure notes.

### 9. Real Field Photography Replacements
- **Status:** Public media audit registered in `audit/PHOTO_INVENTORY.md`. Zero stock photos added. The following illustrative assets require authentic camera originals from Trust field operations:
  - Balangir Community Library / Learning Centre (`FreeEducationSection.tsx`)
  - Balangir Child Outreach
  - Women SHG Vocational Skilling Cluster (`/programmes`)
  - Shri Hanuman Murti proposed site (currently 3D architectural feasibility visualization)
- **Owner Action:** Provide high-resolution camera originals from Balangir and Rayagada field units.

### 10. Real Signed Annual Report PDFs (FY 2021–22, FY 2022–23, FY 2023–24)
- **Status:** All synthetic/generated PDFs have been purged from `public/reports/`. The multi-year reports table provides on-page activity summaries and directs donors to request physical inspection copies of signed balance sheets.
- **Owner Action:** Supply scanned, official CA-signed copies of the annual audited statements for FY21-22, FY22-23, and FY23-24 to upload as real download files.

### 11. FY 2024–25 Annual Accounts Status
- **Status:** Marked **"Pending"** across Annual Reports table. Accounts are currently undergoing annual reconciliation and statutory audit preparation.
- **Owner Action:** Confirm expected audit completion date with the CA and approve publication when signed.

### 12. Newsletter & Updates Block (Owner Decision)
- **Status:** Not built. Awaiting Trust Management determination.
- **Owner Action:** **Does the Trust want an email signup / updates block?**
  - If YES: Define privacy notice, list manager (e.g. self-hosted vs managed), and Secretariat dispatch frequency.
  - If NO: Retain current structure where donors and citizens engage via direct contact form, telephone, and public statutory disclosures.

### 13. Odia Language Translation Review
- **Status:** Gated behind `NEXT_PUBLIC_ENABLE_ODIA="true"` (currently default off). Community translation draft provided in `locales/or.json` with strict guardrails ensuring all statutory, legal, and tax terms remain in English.
- **Owner Action:** Review Odia strings with a native Odia speaker for dialectal appropriateness in Western Odisha (Kosali / Sambalpuri / Standard Odia) before enabling publicly.

### 14. Secretariat Email Notifications & Intake Monitoring
- **Status:** PARTIAL. The backend features an HTTP-based Resend email provider (`ResendEmailService`), but no external SMTP/Resend API key is configured in production. Outbound emails cannot be dispatched without valid credentials. Inbound intake submissions (bank transfer claims and public inquiries) are safely recorded in the database and surfaced directly on the Secretariat executive overview dashboard (`pendingInquiries` and `pendingClaims` counters).
- **Owner Action:** Provide official Resend API credentials (`RESEND_API_KEY`) or dedicated SMTP server parameters if outbound email notifications are required, or rely on daily admin desk review (`/admin/donors` and `/admin/inquiries`) to monitor incoming claims and inquiries.

### 15. Privacy Policy & Intake Retention Review
- **Status:** Privacy page (`/privacy`) has been updated to describe the exact intake data points (name, email, phone, amount, UTR, message), purpose, retention, access controls, and deletion procedure without making unverified statutory legal compliance claims.
- **Owner Action:** Submit the privacy policy text to the Trust's legal counsel or Chartered Accountant for formal review and alignment with the Trust's operational guidelines.

### 16. Founder / Trustee LinkedIn Profile URLs
- **Status:** Developer and Trustee personal LinkedIn links remain removed from public pages to prevent broken, unverified, or bot-blocked external links.
- **Owner Action:** Provide your verified official LinkedIn profile URL(s) if you want them shown in the site footer, About page, or governance roster.

---

## Supplementary Reference: Needs a Documentary Source Before Publishing

Per Truth Audit directives, all unverified dispatches and day-specific claims have been removed from public pages:
- **Arogya Diagnostic Camp at Rayagada:** Requires primary camp docket, certified medical coordinator details, and district permissions before publishing.
- **Higher Education Scholarship Distribution FY 2024–25:** Grants are in proposed stage with zero funded places; cannot publish retrospective distribution stories without audited bank disbursal vouchers and sanction letters.
- **Emergency Heatwave Relief 2024:** Daily headcounts removed. Documented seasonal Jal Seva dispatch restored with verified service instance caveats ("service instances, not unique-person census").
