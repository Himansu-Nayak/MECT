# MECT — OWNER DECISIONS & FACT RECONCILIATION REGISTRY
**Formal Governance, Statutory Disclosures & Banking Reconciliation Record**

- **Organisation:** Mahaveer Educational & Charitable Trust (MECT)
- **Production Domain:** `https://mect.org.in/`
- **Active Feature Branch:** `feat/complete-website-redefinition-and-deduplication`
- **Base Commit:** `99c8b1c4cb400be82c02b724c1bfc87a2b9da439` (`99c8b1c`)
- **Audit Date:** 2026-11-24T14:18:00+05:30
- **Auditor:** Antigravity Principal Architecture & Compliance Engine
- **Non-Negotiable Rule:** No legal, banking, or operational facts may be invented or altered without Trust Deed or CA verification.

---

## 1. Statutory Governance & Identity Decisions

### DEC-01: Settler Founder & Chairman cum Managing Trustee
- **Documentary Evidence:** Trust Deed No. 40311302194 (Balangir Sub-Registrar, executed 27-07-2013, registered 30-07-2013), Clauses 8(2), 10, and XVI.
- **Authoritative Full Name:** **Er. Japabandhu Kampa**
- **Authoritative Designation:** Settler Founder & Chairman cum Managing Trustee
- **Honorary Service Standard:** Strict compliance with Deed Clause XVI:
  > *"All trustees serve in an honorary capacity without salary, fee, or personal remuneration under registered Trust Deed Clause XVI."*
- **Resolution:** All files (`src/config/org.ts`, `content/org.ts`, `src/lib/content-registry.ts`, `content/trustees.ts`) are aligned with this name and honorary declaration.

### DEC-02: Permanent Account Number (PAN)
- **Documentary Evidence:** Income Tax Department PAN Card & MCA CSR-1 Letter.
- **Authoritative Value:** `AADTM5474F`
- **Resolution:** Verified across all 17 references; confirmed as canonical.

### DEC-03: Income Tax 12A & 80G Disclosures
- **Documentary Evidence:** Form 10AC Orders dated 29-01-2024 issued by Income Tax Centralized Processing Centre.
- **Section 12A URN:** `AADTM5474FE20231` (DIN: `AADTM5474FE2023101`)
- **Section 80G URN:** `AADTM5474FF20241` (DIN: `AADTM5474FF2024101`)
- **Validity:** Assessment Years AY 2024-25 through AY 2026-27.
- **Statutory Disclosure Rule:** In accordance with directive from Trust Management, all promotional phrases ("100% Tax Exemption", "Instant 10BE Receipt") have been replaced with neutral statutory wording:
  > *"Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility."*

### DEC-04: Ministry of Corporate Affairs (MCA) CSR-1 Registration
- **Documentary Evidence:** MCA CSR-1 Approval Letter from ROC-Delhi (SRN: `N14617237`).
- **CSR-1 Registration Number:** `CSR00081063`
- **Approval Date:** 09-11-2024
- **Resolution:** Approved for corporate CSR grants under Section 135 of the Companies Act, 2013.

### DEC-05: NITI Aayog NGO Darpan Unique ID
- **Discrepancy:** Legacy pages referenced `OD/2021/0285141`; newer official institutional dossier (Page 87) references `OR/2024/0466491`.
- **Approved Active Baseline:** `OR/2024/0466491`
- **Owner Action:** Re-verify exact certificate printout on the NGO Darpan portal; maintain `OR/2024/0466491` as canonical across all pages.

### DEC-06: Ministry of Social Justice & Empowerment (MoSJE) e-Anudaan
- **Authoritative Value:** `OR/00040466`
- **Resolution:** Preserved in canonical registry.

---

## 2. Banking, Remittance & Payment Gateway Policy

### DEC-07: Operative Bank Account vs Historical Union Bank Record
- **Discrepancy Identified:**
  - `src/lib/content-registry.ts` (historical draft) listed: Union Bank of India, A/C `381002010014021`, IFSC `UBIN0538108`.
  - `src/config/org.ts`, live site `mect.org.in`, and database listed: **State Bank of India**, A/C `33341302498`, IFSC `SBIN0001701`, Branch Rajendra College Square, Bolangir.
- **Approved Operative Baseline:** **State Bank of India (SBI)**:
  - Account Name: `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
  - Account Number: `33341302498`
  - IFSC: `SBIN0001701`
  - Branch: `Rajendra College Square, Bolangir`
  - Primary UPI VPA: `86971610172@sbi` (Fallback / Secretariat: `9853608113@sbi`)
- **Owner Action:** The Managing Trustee / Treasurer must physically inspect the active SBI passbook before issuing high-volume donation campaigns.

### DEC-08: Approved Payment Infrastructure & Gateway Stance
- **Finding:** Backend code supports both Cashfree (`CashfreePaymentController`) and manual SBI transfer (`DonationController.submitUtr`).
- **Statutory Safeguard:** Online donation checkout operates with test/sandbox credentials in development; Cashfree gateway is live in production only when valid server-side environment variables (`CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`) are loaded.
- **Voluntary Amount:** Minimum voluntary contribution is configured at ₹1 across checkout and backend validation (accommodating small community contributions).

---

## 3. Communication Coordinates & Secretariat Desks

### DEC-09: Official Helpline Numbers
- **Primary Live Helpline:** `+91 94371 23616` (present across foundational releases since 2013)
- **Secondary / Secretariat Desk:** `+91 98536 08113`
- **Resolution:** Both numbers maintained as legitimate contact desks; primary public helpline is `+91 94371 23616`.

### DEC-10: Official Email Desk
- **Authoritative Primary Email:** `mect220@gmail.com`
- **Resolution:** Single canonical contact address configured across all contact forms, failure advisories, and transactional emails.

### DEC-11: Physical Addresses
- **Registered Office:** `Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001`
- **Administrative / Liaison Office:** `A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014`
- **Resolution:** Formally standardized across all components and Schema.org metadata.

---

## 4. Operational Telemetry & Impact Definitions

### DEC-12: Impact Metric Definitions
To prevent misleading claims, all public telemetry figures carry statutory definitions:
1. **Students Supported:** Defined as *"350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported."*
2. **Women's Skilling:** Defined as *"120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women."*
3. **Public Water & Relief:** Defined as *"10,000+ recorded water and relief service instances, not 10,000 unique citizens."*
4. **Institutional Longevity:** *"13+ Years of Civic Service (Registered Trust Deed, 2013, Balangir)"*.

---

## 5. Security & Privacy Decisions

### DEC-13: WhatsApp Notifications
- **Status:** Dormant (`WHATSAPP_ENABLED=false`).
- **Owner Requirement:** Under no circumstances should live WhatsApp notifications be dispatched without explicit donor opt-in consent and separate Trust authorization.

### DEC-14: Groq API Key Rotation
- **Status:** Scrubbed from working tree; historical commit cleanup documented in `docs/HISTORY_CLEANUP.md`.
