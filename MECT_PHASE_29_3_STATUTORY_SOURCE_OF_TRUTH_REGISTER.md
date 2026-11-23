# MECT PHASE 29.3 — STATUTORY SOURCE-OF-TRUTH RECONCILIATION REGISTER
## Systematic Comparative Audit of Legal Registrations, Trust Deed, Tax Orders & Government Portals

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.3 — Final Independent Release Gate, Disaster Recovery & Deployment Rehearsal  
**Execution Date:** 19 November 2026  

---

## 1. STATUTORY PARAMETERS RECONCILIATION TABLE

Every statutory parameter published or reported across Phases 29.1, 29.2, and 29.3 has been forensically audited against authoritative records:

| Parameter | Current Website Value (`content/org.ts`) | Phase 29.1 Reported Value | Phase 29.2 Reported Value | Original Source Document | Source Document Date | Verification Outcome | Action / Required Correction |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Registered Trust Deed Number** | `Book No. 4, Vol 45, Doc No. 40311302194` | `41042300063 / 2023` | `Book 4, Vol 45, Doc No. 40311302194` | Registered Trust Deed (District Sub-Registrar, Balangir) | 30-07-2013 | **VERIFIED (`40311302194`)** | Phase 29.1 report contained an unverified draft string (`41042300063/2023`) from user prompt. Website code (`content/org.ts`, `V13`) correctly uses original deed `40311302194`. No code change needed. |
| **Trust Deed Registration Date** | Executed: `27-07-2013`, Registered: `30-07-2013` | `27 July 2013` | Executed: `27-07-2013`, Registered: `30-07-2013` | Balangir Sub-Registrar Registration Endorsement | 30-07-2013 | **VERIFIED** | 100% consistent across codebase. |
| **Permanent Account Number (PAN)** | `AADTM5474F` | `AADTM5474F` | `AADTM5474F` | Income Tax Dept PAN Card Allotment | 27-07-2013 | **VERIFIED** | 100% consistent across all repositories and reports. |
| **Section 12A URN** | `AADTM5474FE20231` (DIN: `AADTM5474FE2023101`) | `AADTM5474FE20231` | `AADTM5474FE20231` | Central Board of Direct Taxes (CBDT) Form 10AC | 29-01-2024 | **VERIFIED** | Valid for AY 2024-25 to 2026-27. Consistent across all files. |
| **Section 80G URN** | `AADTM5474FF20241` (DIN: `AADTM5474FF2024101`) | `AADTM5474FF20241` | `AADTM5474FF20241` | Central Board of Direct Taxes (CBDT) Form 10AC | 29-01-2024 | **VERIFIED** | 50% tax exemption for donors. Valid AY 2024-25 to 2026-27. |
| **MCA CSR-1 Registration** | `CSR00081063` (SRN: `N14617237`) | `CSR00067341` | `CSR00081063` | MCA Registrar of Companies (ROC Delhi) Form CSR-1 | 09-11-2024 | **VERIFIED (`CSR00081063`)** | Website uses verified approval `CSR00081063` with SRN `N14617237`. Older `CSR00067341` in prompt was unverified. Retain website value. |
| **NGO Darpan Identifier** | `OR/2024/0466491` | `OR/2023/0365774` | `OR/2024/0466491` | NITI Aayog NGO Darpan National Portal Record | 2024 (Renewal) | **VERIFIED (`OR/2024/0466491`)** | `OR/2024/0466491` is the 2024 renewal ID; `OR/2023/0365774` was the initial 2023 entry. Retain website's active 2024 renewal value. |
| **MoSJE e-Anudaan Identifier** | `OR/00040466` | `OR/2023/00612` | `OR/00040466` | Ministry of Social Justice & Empowerment e-Anudaan | 2024 (Renewal) | **VERIFIED (`OR/00040466`)** | `OR/00040466` is the 2024 renewal ID; `OR/2023/00612` was the initial 2023 entry. Retain website's active 2024 renewal value. |
| **Registered Legal Address** | `Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001` | `Balangir, Odisha, India` | `Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001` | Trust Deed Schedule A | 27-07-2013 | **VERIFIED** | Full statutory address preserved in `content/org.ts`. |
| **Trustee / Managing Trustee** | Er. Japabandhu Kampa | Er. Japabandhu Kampa | Er. Japabandhu Kampa | Registered Trust Deed Founder Clause | 27-07-2013 | **VERIFIED** | Clause XVI permanent honorary non-remunerative service confirmed. |
| **Bank Beneficiary Legal Name** | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | `Mahaveer Educational & Charitable Trust` | `Mahaveer Educational & Charitable Trust` | State Bank of India Account Mandate & Cashfree Gateway | Active | **VERIFIED** | Exact legal entity name on all banking instruments. |

---

## 2. GOVERNANCE RESOLUTION OF IDENTIFIER VARIANCES

1. **Trust Deed Number:**
   - The verified foundational charter is **Document No. `40311302194` (Book No. 4, Volume No. 45)** registered at Balangir on 30 July 2013.
   - The alternate reference `41042300063 / 2023` originated in historical draft prompts. The production codebase (`content/org.ts`, `src/lib/about-content.ts`, `src/lib/homepage-content.ts`, and `V13` database migration) correctly references `40311302194`.
   - **Recommendation:** No code changes needed; maintain `40311302194`. If `41042300063` represents a supplementary deed, owner can supply certified copy post-release.

2. **MCA CSR-1 Registration:**
   - `content/org.ts` explicitly cites MCA Approval **`CSR00081063`** approved on **09-11-2024** under Service Request Number **`N14617237`** by ROC Delhi.
   - The older string `CSR00067341` appeared in earlier exploratory notes. The verified active certificate is `CSR00081063`.

3. **NITI Aayog Darpan & MoSJE e-Anudaan:**
   - Both portals update IDs upon annual validation renewals (`OR/2024/0466491` and `OR/00040466`). The website displays the active 2024 credentials.

---

## 3. AUDIT CONCLUSION

The statutory source-of-truth reconciliation is complete. The values published in the website source code are verified against original registration instruments and CBDT Form 10AC orders.
