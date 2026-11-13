# MECT SBI Donation QR Integration & Verification Report

**Date:** 2026-11-11  
**Source Asset Preserved:** `src/MECT QRCODE.jpeg` (`1080 x 1511`)  
**Published Static Asset:** `public/images/mect-sbi-upi-qr.png` (`952 x 1323`, lossless PNG, `332,325` bytes — outer white printer margins trimmed; QR matrix pixel-preserved without regeneration, distortion, rotation, blur, or scaling animation)  
**Configured UPI ID:** `86971610172@sbi`  
**Display Name on Poster:** `MAHAVEER EDUCATIONAL CHARITA`

---

## 1. Automated Technical & Visual Checks (`node scratch/verify-complete-release.mjs`)

| Check Item | Mobile (`390 x 844`) | Desktop (`1440 x 900`) | Status |
|---|---|---|---|
| Same verified asset shared by Homepage (`/#donate-sbi`) & `/donate#bank-details` | `/images/mect-sbi-upi-qr.png` via `TRUST_CONFIG.bank.verifiedQrSrc` | Same | **PASS** |
| Complete QR poster visible, sharp, native `952:1323` framing | `qrLoaded: true` | `qrLoaded: true` | **PASS** |
| QR `<img>` strictly stationary (`transform: none`, `filter: none`) | `qrStationary: true` | `qrStationary: true` | **PASS** |
| Official UPI ID (`86971610172@sbi`) visible & readable | `hasUpi: true` | `hasUpi: true` | **PASS** |
| Copy UPI ID action + accessible live confirmation feedback (`Copied 86971610172@sbi`) + white checkmark hover contrast | `copyToastVisible: true` | `copyToastVisible: true` | **PASS** |
| Download QR Image control (`download="MECT-SBI-UPI-QR.png"`) | `hasDownload: true` | `hasDownload: true` | **PASS** |
| Honest label & non-auto-verification disclosure (`Static UPI QR`, `Static UPI payments are not auto-verified...`) | `hasHonestLabel: true` | `hasHonestLabel: true` | **PASS** |
| Payment steps instruct donor to submit UPI Ref / UTR on `/donate#receipt-claim` | Verified | Verified | **PASS** |

---

## 2. MANDATORY OWNER BENEFICIARY VERIFICATION CHECKPOINT (PENDING HUMAN SIGN-OFF)

> [!IMPORTANT]
> **DO NOT PUBLISH OR DEPLOY UNTIL OWNER CONFIRMATION IS RECEIVED.**  
> Technical rendering and Playwright checks cannot prove that a static QR code resolves to Mahaveer Educational & Charitable Trust's official bank account (`State Bank of India`, A/C `33341302498`, IFSC `SBIN0001701`).

**Required Owner Action Before Release:**
1. Open an official Indian UPI banking app (YONO SBI, BHIM, Google Pay, Paytm, or PhonePe).
2. Scan `public/images/mect-sbi-upi-qr.png` (or check rendered screenshot `scratch/complete-qa/qr-desktop-1440.png` / `qr-mobile-390.png`).
3. Independently verify inside the banking app that the resolved UPI ID (`86971610172@sbi`) and registered beneficiary banking account match MECT's official Trust account records (`State Bank of India` — Balangir).
4. Reply confirming beneficiary accuracy to authorize GitHub push and VPS production deployment.

