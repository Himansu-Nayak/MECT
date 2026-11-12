# MECT Open Confirmations Checklist (`content/todo-confirm.md`)

All items below require documentary verification from the Trustees and/or Chartered Accountant of **Mahaveer Educational & Charitable Trust (MECT)** before final production wording is published. Any UI/content placeholder waiting on these answers must use `{{CONFIRM: ...}}` so automated production CI builds (`NODE_ENV=production` + `CI=true`) block release until resolved.

## Confirmation Matrix

1. **Current 12A / 80G / Income-tax Act, 2025 registration status for FY 2026-27 and final public wording**
   - **Owner:** Chartered Accountant (CA) + Managing Trustee
   - **Blocking markers / areas:** `80G notice wording`, `PAN allotment date vs deed date`, `donation certificate form naming scheme`
   - **Details needed:**
     - Confirm whether 12A (`AADTM5474FE20231`, order dated 29-01-2024) and 80G (`AADTM5474FF20241`, order dated 29-01-2024, covering AY 2024-25 to AY 2026-27) have been renewed or transitioned under the Income-tax Act, 2025 for FY 2026-27 (AY 2027-28 onwards).
     - Provide approved public disclosure sentence for `/donate`, `/statutory-disclosures`, and footer.
     - Confirm exact certificate nomenclature (Form 10BE / 80G receipt vs general donation certificate) and PAN allotment date vs Trust Deed execution date (27-07-2013).
   - **Status:** `[ ] Open — CA confirmation required`

2. **Real programme statistics with scope qualifiers ("annual or cumulative" and "events or unique people")**
   - **Owner:** Trustees / Programme Coordinator
   - **Blocking markers / areas:** Home, `/impact`, `/programmes`, `/reports`, `/csr-partnerships`
   - **Details needed:** Confirm exact scope and time period for each metric currently displayed:
     - `350+` students coached (specify annual vs cumulative, unique students vs seats/batches, and reporting period).
     - `120+` women skilled (specify annual vs cumulative, unique beneficiaries, and training cycles).
     - `10,000+` citizens reached / hydration events (specify annual vs cumulative, events vs unique individuals).
     - `13+` years of service (confirm counting baseline from Trust Deed execution 27-07-2013 / registration 30-07-2013).
   - **Status:** `[ ] Open — Trustee verification required`

3. **Full trustee list with roles and photos**
   - **Owner:** Managing Trustee (`Er. Japabandhu Kampa`) / Board of Trustees
   - **Blocking markers / areas:** `trustee list`, `/governance`, `/about`
   - **Details needed:** Complete roster of current trustees per Trust Deed / latest supplementary deed, exact designations, brief verified bios, and consented photographs (or explicit instruction to omit photos).
   - **Status:** `[ ] Open — Trustee verification required`

4. **Whether scholarship schemes are board-approved and the first official intake date**
   - **Owner:** Trustees
   - **Blocking markers / areas:** `/scholarships`, `/scholarships/apply`, `/programmes`, Home explorer
   - **Details needed:** Confirm formal approval status of *Mahaveer Shiksha Protsahan Yojana*, *Pratibha Excellence Fellowship*, and *Project Samarth*, whether applications are open, exact eligible streams, and confirmed first intake window dates.
   - **Status:** `[ ] Open — Trustee verification required`

5. **FCRA status (Foreign Contribution Regulation Act, 2010)**
   - **Owner:** Chartered Accountant (CA) + Trustees
   - **Blocking markers / areas:** `/donate`, `/statutory-disclosures`, `/faq`, `/csr-partnerships`
   - **Details needed:** Confirm whether MECT holds FCRA registration/prior permission or does not accept foreign contributions / holds Indian-rupee domestic donations only. Provide approved public wording.
   - **Status:** `[ ] Open — CA confirmation required`

6. **Approved child-safeguarding policy**
   - **Owner:** Trustees + Legal Advisor
   - **Blocking markers / areas:** `safeguarding policy`, `/volunteer`, `/scholarships/apply`, `/privacy`
   - **Details needed:** Provide board-adopted Child Safeguarding & Protection Policy document (PDF/text), adoption date, review cycle, and designated safeguarding lead before activating mentorship volunteer tracks or under-18 intake workflows.
   - **Status:** `[ ] Open — Trustee / Legal confirmation required`

7. **Audited accounts and Form 10B for FY 2024-25 and FY 2025-26**
   - **Owner:** Chartered Accountant (CA)
   - **Blocking markers / areas:** `/reports`, `/statutory-disclosures`, `/csr-partnerships`
   - **Details needed:** Provide signed Balance Sheet, Income & Expenditure Account, Receipt & Payment Account, and Form 10B/10BB audit reports for FY 2024-25 and FY 2025-26 (plus verify archival PDFs for FY 2021-22 through FY 2023-24 for `public/documents/`).
   - **Status:** `[ ] Open — CA confirmation required`

8. **Bhubaneswar liaison phone/email and one named Grievance Officer**
   - **Owner:** Trustees
   - **Blocking markers / areas:** `grievance officer name`, `/contact`, `/privacy`, `/accessibility`
   - **Details needed:** Confirm dedicated phone number (if any, or confirm Balangir helpline `+91 94371 23616` covers both) and official email for the Bhubaneswar liaison office (`A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014`), plus full name and designation of the DPDP Act, 2023 Grievance Officer.
   - **Status:** `[ ] Open — Trustee confirmation required`

9. **Preferred spelling of scheme names**
   - **Owner:** Trustees
   - **Blocking markers / areas:** Site-wide (`Mahaveer Shiksha Protsahan Yojana`, `Pratibha Excellence Fellowship`, `Project Samarth`)
   - **Details needed:** Confirm whether `Mahaveer Shiksha Protsahan Yojana` is the final canonical spelling across all statutory and public materials.
   - **Status:** `[ ] Open — Default canonical spelling applied unless Trustees instruct otherwise`

10. **Jurisdiction clause (Balangir vs Bhubaneswar/Cuttack)**
    - **Owner:** Trustees + Legal Advisor
    - **Blocking markers / areas:** `jurisdiction`, `/terms`
    - **Details needed:** Confirm competent court jurisdiction for disputes in `/terms` (Courts at Balangir vs Bhubaneswar / High Court of Orissa at Cuttack).
    - **Status:** `[ ] Open — Legal / Trustee confirmation required`

---

## Additional Build-Time Confirmation Notes (Tracked Across Phases)
- **Receipt turnaround SLA** (`receipt turnaround` — Phase 6 / `/donate` & `/faq`): exact working-day SLA for UTR verification and donation certificate issuance (Developer/Trustees).
- **Unit cost / impact breakdowns** (`content/unitCosts.ts` — Phase 6 / `/donate`): audited or trustee-approved unit cost figures before showing rupee-to-outcome claims.
- **Consented beneficiary stories & media** (`consented stories` — Phase 3 / `/impact`): written consent on file before publishing named beneficiary stories or photos.
- **Odia (`/or`) translation review** (`Odia translation` — Phase 8): fluent Odia reviewer sign-off before removing `{{CONFIRM}}` markers on `/or/...` routes.
- **Developer LinkedIn URL** (`LinkedIn URL` — Phase 8 / `/about`): confirm exact verified profile URL with Himansu Nayak.
- **Payment wording policy conflict noted in Phase 6 (`A6.1`)**: Existing repository includes Cashfree payment gateway integration code; Master Audit Rule #3 specifies domestic SBI NEFT/RTGS/IMPS + static SBI UPI QR only with no gateway wording on `/donate`. Confirmation / architectural decision for Cashfree code retention vs removal is tracked for Phase 6.
