# MECT — Image Asset & Safeguarding Register

**Audit Date:** 2026-11-10
**Governing Policy:** Child Safeguarding, Copyright Licensing & Documentary Truth (`PHASE_P3_COMPLETION_REPORT.md` + `MECT_CONTENT_SOURCE_REGISTER.md`)

---

## 1. Authorised Active Production Assets (`public/`)

| Public File Path | Dimensions / Size | Verification & Provenance | Where Rendered & Alt Text Standard |
| :--- | :--- | :--- | :--- |
| `/images/mect-official-emblem.png` (`src/app/icon.png`) | `256 × 256` PNG (`151.4 KB`) | **Category A (Verified)** — Official Trust emblem preserved strictly untouched. Styled cleanly with `object-cover scale-[1.06]` inside a 2px champagne medallion border. | `Header.tsx`, `Footer.tsx`, `src/app/page.tsx` Hero Card, Favicon, JSON-LD `logo` (`alt="Mahaveer Educational & Charitable Trust Official Emblem"`). |
| `/documents/mect-csr1-certificate.png` | `785 × 1015` PNG (`118.2 KB`) | **Category A (Verified)** — Official MCA Registrar of Companies letter (`CSR00081063`, `09-11-2024`, `SRN-N14617237`, `ROC-DELHI`, matches PDF p. 28). | `CsrRegistrationSection.tsx` thumbnail, downloadable PNG (`MECT-CSR1-Registration-CSR00081063.png`), and accessible lightbox modal with 100% actual-size zoom toggle. |

---

## 2. Disqualified, Withdrawn & Unused Assets (Not Served on Public Routes)

| File / Asset Group | Dimensions | Finding / Exclusion Reason |
| :--- | :--- | :--- |
| `src/NOG PIC1.jpg` (`pic-1`) | `1000 × 562` | Identifiable schoolchildren in uniform; lacks documented MECT provenance and written parent/guardian website release. Withdrawn under child safeguarding standards. |
| `src/NGO PIC 2.jpg` (`pic-2`) | `735 × 581` | Candid B&W photo of 5 street children; previously misattributed to women's tailoring; lacks guardian consent/licence. Withdrawn. |
| `src/NGO PIC3.jpg`, `src/NGO PIC 4.jpg`, `src/NGO PIC5.jpg`, `src/NGO PIC 9.jpg` | `235×166` to `1200×1125` | Campaign graphics / studio child portraits (`pic-3`, `pic-4`, `pic-5`, `pic-9`); low-res/graphic montages with minor subjects and zero licensing proof. Excluded. |
| `src/NGO PIC 6.jpg`, `src/NGO PIC 7.jpg` | `736×736`, `736×1307` | Editorial child-at-gate graphic (`pic-6`, previously misattributed to *Jal Seva*) and street tea vendor portrait (`pic-7`, previously misattributed to trustee visit). Disqualified. |
| `src/NGO PIC 8.jpg` (`pic-8`) | `1200 × 2132` | Train coach passenger photograph carrying visible third-party `@the_viewmaker` watermark, previously misattributed to *Jan Ahar*. Strictly excluded for copyright safety. |
| PDF-embedded collages (`MECT Proposal...pdf` pp. 37–70) | Varying compressed thumbnails | Unconsented minors, `"SHOT ON OPPO"` watermarked snaps, third-party `"AISECT"` campaign banners, `"Bethel Blessing"` context, and stock cover image (p. 49). Excluded. |
| `public/images/audit/*.png` | Viewport QA captures | Automated Playwright QA inspection screenshots generated during visual review; excluded from production `<Image>` components. |

---

## 3. Pending Asset Replacements
1. **Official SBI UPI QR Code:** Ready-made `verifiedQrSrc` prop in `SbiDonationSection.tsx` awaits the bank-issued QR PNG linked to Account `33341302498`.
2. **Consented High-Resolution (`>= 2048px`) Trust Photography:** Future Hero and programme photographs must include signed photographer licences and signed guardian releases where children appear, or depict non-identifiable / adult consented subjects with verifiable MECT activity records.
3. **High-Resolution Vector/2K Emblem Master:** `mect-official-emblem.png` (`256×256`) renders sharply at `40–44px` UI medallion scale; a `1024px+` or SVG master is recommended if full-bleed Hero watermark usage is desired later.

