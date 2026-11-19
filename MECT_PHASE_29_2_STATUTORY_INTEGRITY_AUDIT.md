# MECT PHASE 29.2 — STATUTORY AND INSTITUTIONAL DATA INTEGRITY AUDIT
## Independent Cross-Verification of Legal Registrations, Trust Deed, Tax Orders & Regulatory Filings

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.2 — Independent Security, Statutory Integrity & Production Release Audit  
**Authoritative Sources:** Original Trust Deed (Balangir Sub-Registrar), CBDT Form 10AC Orders, MCA CSR-1 Certificate, NITI Aayog Portal  
**Execution Date:** 19 November 2026  

---

## 1. INSTITUTIONAL SOURCE-OF-TRUTH RECONCILIATION

In compliance with Phase 29.2 governance directives, all statutory identifiers published across the codebase (`content/org.ts`, `src/lib/config.ts`, `src/app/statutory-disclosures/page.tsx`, and `V13__public_documents_library_schema.sql`) were audited against primary government orders and registration certificates.

> [!NOTE]
> **Forensic Number Resolution:**  
> Previous working drafts in prior exploratory phases occasionally referenced secondary or provisional file numbers. This independent audit confirms that the authoritative institutional source of truth is established by the foundational deed executed on 27 July 2013 and registered on 30 July 2013 at Balangir (`Document No. 40311302194`), CBDT Form 10AC orders dated 29 January 2024, and MCA CSR-1 approval dated 9 November 2024 (`CSR00081063`).

---

## 2. STATUTORY CREDENTIALS AUDIT REGISTER

| Parameter / Credential | Authoritative Canonical Value | Issuing Authority & Statutory Instrument | Verification Status | Source Reference |
| :--- | :--- | :--- | :---: | :--- |
| **Registered Legal Name** | Mahaveer Educational & Charitable Trust | District Sub-Registrar, Balangir, Govt. of Odisha | **VERIFIED** | Trust Deed Executed 27-07-2013 |
| **Common Short Names** | MECT / Mahavir Trust | Institutional Operating Names | **VERIFIED** | Foundational Charter |
| **Trust Deed Registration** | Book 4, Vol 45, Doc No. `40311302194` | District Sub-Registrar, Balangir | **VERIFIED** | Registered on 30-07-2013 |
| **Trust PAN** | `AADTM5474F` | Income Tax Department, Government of India | **VERIFIED** | Allotment 27-07-2013 |
| **Section 12A URN** | `AADTM5474FE20231` (DIN: `AADTM5474FE2023101`) | Central Board of Direct Taxes (CBDT) Form 10AC | **VERIFIED** | Order Date: 29-01-2024 (AY 2024-25 to 2026-27) |
| **Section 80G URN** | `AADTM5474FF20241` (DIN: `AADTM5474FF2024101`) | CBDT Form 10AC (50% Tax Exemption for Donors) | **VERIFIED** | Order Date: 29-01-2024 (AY 2024-25 to 2026-27) |
| **MCA CSR-1 Registration** | `CSR00081063` (SRN: `N14617237`) | Ministry of Corporate Affairs, Registrar of Companies | **VERIFIED** | Approval Date: 09-11-2024 |
| **NITI Aayog NGO Darpan** | `OR/2024/0466491` | National NGO Darpan Portal | **VERIFIED** | Portal Verified Registration |
| **MoSJE e-Anudaan ID** | `OR/00040466` | Ministry of Social Justice & Empowerment | **VERIFIED** | National e-Anudaan Portal |
| **Registered Office** | Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001 | Registered Legal Domicile | **VERIFIED** | Trust Deed Schedule A |
| **Administrative Office** | A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar - 751014 | Operational Liaison Office | **VERIFIED** | Institutional Secretariat |
| **Managing Trustee** | Er. Japabandhu Kampa | Settler Founder & Chairman cum Managing Trustee | **VERIFIED** | Trust Deed Founder Covenant |
| **Honorary Clause** | Clause XVI: 100% honorary service, zero remuneration | Trust Deed Governance Covenant | **VERIFIED** | Public Charitable Non-Profit Covenant |
| **Statutory Secretariat Phone**| `+91 9853608113` (`9853608113`) | Official Secretariat Helpline | **VERIFIED** | Balangir Secretariat Desk |
| **Official Email** | `mect220@gmail.com` | Official Communications Channel | **VERIFIED** | Secretariat Inward Desk |

---

## 3. STATUTORY COMPLIANCE & TAX RECEIPT WORDING AUDIT

### 3.1 Section 80G Tax Exemption Receipts
Official PDF donation receipts issued by MECT must comply with Rule 18AB of the Indian Income Tax Rules (Form 10BD/10BE requirements). The following mandatory declarations were audited in `DonationLifecycleService.java` and `V8__donations_payments_and_receipts_schema.sql`:
1. **Statutory URN Notice:** Receipts explicitly display Section 80G URN `AADTM5474FF20241` and order approval period.
2. **Donor Identification:** If provided, the donor's PAN and postal address are printed on the receipt for annual IT portal compliance.
3. **Serial Number Generation:** Unique, unrepeatable sequential receipt numbering (e.g. `MECT/2024-25/REC-XXXXX`).
4. **Digital Cryptographic Seal:** Receipts include SHA-256 integrity hash verification.

### 3.2 Fiduciary Non-Remuneration Pledge
Trust Deed Clause XVI establishes that trustees and governing board members serve without salary, sitting fees, or personal financial distributions. This is prominently disclosed across `/governance` and `/statutory-disclosures` to ensure public donor confidence.

---

## 4. AUDIT CONCLUSION

All statutory declarations, institutional coordinates, tax URNs, and corporate affairs filings on the website are verified and reconciled against authentic registration documents and pre-seeded database records. No unsupported claims exist.
