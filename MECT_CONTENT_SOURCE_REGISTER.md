# MECT — Factual Content & Evidence Source Register

**Verification Audit Date:** 2026-11-10
**Primary Sources Reviewed:**
- `MECT Proposal - Jindal_compressed (1).pdf` (71-page document containing scanned Trust Deed pages 10–26, PAN scan page 27, MCA CSR letter page 28, Form 10AC 12A pages 29–30, Form 10AC 80G pages 31–32, NITI Aayog Darpan page 33, MoSJE e-Anudaan page 34, and FY 2021–24 Annual Report drafts pages 35–71).
- `public/documents/mect-csr1-certificate.png` (Official MCA Registrar of Companies approval letter `CSR00081063`, `SRN-N14617237`).
- `public/images/mect-official-emblem.png` (Official MECT emblem).
- `src/lib/config.ts` (Includes supplied SBI cancelled cheque details & official offices).

---

## Classification Key
- **Category A (VERIFIED):** Supported directly by scanned legal deeds, government orders/certificates, or cancelled cheque records in the repository.
- **Category B (APPROVED BUT NOT YET IMPLEMENTED):** Initiative formally prioritised or framed by Trust management for phased rollout, without claiming full live beneficiary completion.
- **Category C (REQUIRES CONFIRMATION):** Legacy annual-report narrative figures or transition statuses requiring ongoing physical register / statutory order verification.
- **Category D (NOT AVAILABLE):** Missing records (authentic consented field photography, official UPI QR graphic, downloadable signed CA audit PDFs, corporate partner contracts).

---

## Master Claim Verification Table

| Public Claim / Entity | Source Document | Classification | Public Website Handling |
| :--- | :--- | :---: | :--- |
| Legal name: Mahaveer Educational & Charitable Trust (MECT), irrevocable public charitable trust | Scanned Trust Deed (`MECT Proposal...pdf`, pp. 10–26) | **A** | Published sitewide. Removed legacy conflicting `"MAHAVIR TRUST"` UI labels. |
| Trust Deed Registration: `Book No. 4, Vol 45, Doc No. 40311302194`, executed `27-07-2013`, registered `30-07-2013`, District Sub-Registrar, Balangir | Scanned Trust Deed (`MECT Proposal...pdf`, pp. 10, 23, 25–26) | **A** | Published across Hero, Governance, Statutory Vault, Footer, and Schema.org. |
| Settler Founder & Life Chairman cum Managing Trustee: `Er. Japabandhu Kampa` | Trust Deed Clause 8(2), p. 14 & p. 26 | **A** | Published cleanly. Excluded the three other 2013 signatories per P1–P3 governance instruction (`verify-live-browser.mjs` compliance). |
| Deed Clause 8 (3–9 Trustees), Clause 12 (quorum: >= 2 or 1/3rd), Sec 9 Clause XVI (honorary/non-remunerative), Sec 9 Clause VII & Clause 16 (lawful investment & annual audit), Clauses 23–25 (irrevocable / dissolution transfer) | Scanned Trust Deed pp. 14–24 | **A** | Corrected legacy misnumbering in `src/app/governance/page.tsx` (`max 11 trustees` fixed to `9`; `Clause XVII/XVIII` updated to `Section 9(VII)/Clause 16` & `Clauses 23–25`). |
| Income Tax PAN: `AADTM5474F` (Allotted `27/07/2013`) | PAN Scan (`MECT Proposal...pdf`, p. 27) | **A** | Published in Statutory Disclosures, CSR Section, Donate, and JSON-LD. |
| Section 12A Historical Provisional Order (`Form 10AC`): URN `AADTM5474FE20231`, DIN `AADTM5474FE2023101`, dated `29-01-2024`, AY `2024-25` to AY `2026-27` | Form 10AC Scan (`MECT Proposal...pdf`, pp. 29–30) | **A** | Published with exact assessment-year range. |
| Section 80G Historical Provisional Order (`Form 10AC`): URN `AADTM5474FF20241`, DIN `AADTM5474FF2024101`, dated `29-01-2024`, AY `2024-25` to AY `2026-27` (FY `2023-24` to FY `2025-26`) | Form 10AC Scan (`MECT Proposal...pdf`, pp. 31–32) | **A** | Published with historical window clearly separated from Tax Year `2026-27`. |
| Regular Tax Exemption Renewal Status for Tax Year `2026-27` (AY `2027-28`) under Income-tax Act, 2025 (`Section 354`, `Form 105`/`107`, `Section 536`) | Absent in reviewed archive | **C** | Explicitly disclosed verbatim across homepage calculator, `/donate`, `/about`, and `mect-knowledge.ts`: *"Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed."* |
| CSR Registration `CSR00081063` (Approved `09-11-2024`, `SRN-N14617237`, ROC-DELHI) | `public/documents/mect-csr1-certificate.png` & PDF p. 28 | **A** | Displayed with downloadable official letter & interactive 100% zoom preview. Clarified registration does not guarantee CSR funding. |
| NITI Aayog NGO Darpan ID `OR/2024/0466491` & MoSJE e-Anudaan `OR/00040466` | Certificate Scans (`MECT Proposal...pdf`, pp. 33–34) | **A** | Published across Marquee, Governance, Statutory Vault, Footer. |
| Verified Domestic SBI Bank Account: `State Bank of India`, `Rajendra College Square, Bolangir, Odisha`, A/c `33341302498`, IFSC `SBIN0001701`, `SB Account`, Name `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | Supplied Cancelled Cheque (`src/lib/config.ts`) | **A** | Published in `SbiDonationSection`, Footer, and synced to AI knowledge (`src/lib/ai/mect-knowledge.ts` updated away from old Union Bank info). |
| Official UPI QR Code Image | Not supplied | **D** | `verifiedQrSrc` kept `null`; dedicated pending-verification container shown; zero synthetic QR codes generated. |
| `Free Education for 200 Students` (`EDUCATION TODAY. A BETTER TOMORROW.`) | Priority mandate in management brief & `homepage-content.ts` | **B** | Presented as **Approved Priority Initiative — Targeted Cohort Capacity: 200 Students (Phased Intake)**; explicitly states it does not claim 200 students are already enrolled. |
| Fundraising Appeal (`SUPPORT EDUCATION. TRANSFORM LIVES.`) | Trust programme documentation & `homepage-content.ts` | **A/B** | Published with explicit non-affiliation notice distinguishing MECT from Smile Foundation unless bilaterally authorised. |
| Remedial Coaching (`350+`), Women's Tailoring (`120+`), Jal Seva (`10,000+`), Jan Ahar (DHH Balangir) | Trust logs & Annual Activity Report drafts (PDF pp. 40–68; `config.ts`) | **C** | Grounded strictly to Balangir/Puintala trust registers; exaggerated claims (`tens of thousands`) narrowed; animated fake counters prohibited. |
| Jindal Steel & Power Proposal (`MECT/BBSR/2024-25/112` Digital Health Assistants) | PDF pp. 1–9 (`10/03/2025`) | **B / D (Partnership Unconfirmed)** | Proposal letter only — NOT published as an active project or approved Jindal corporate partnership. |
| Third-party copy-paste artifacts inside historical PDF drafts (`Bethel Blessing Missions`, `Vijayawada`, `Sanderao`, `India's largest animal welfare organization`, `Signode`) | PDF pp. 48, 57, 64, 70–71 | **D (Excluded)** | Audited and strictly excluded from all public web copy. |
| Signed CA Balance Sheets / Form 10B PDFs & Consented Field Photographs (`pic-1`..`pic-9`, PDF collages) | Absent (`PHASE_P3_COMPLETION_REPORT.md` & PDF inspection) | **D** | Excluded all unconsented minor photos and watermarked third-party images (`@the_viewmaker`); `/reports` framed accurately as Annual Activity Summaries with physical Secretariat audit inspection. |

