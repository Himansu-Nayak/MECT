# MECT PHASE 3.5 — EMAIL & RECEIPT AUTOMATION REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** `https://mect.org.in/`  
**Components Audited:** 10-Event Transactional Outbox, Resend API Integration, ISO A4 Receipt PDF Generator (`ReceiptPdfService.java`), Canonical Email & Address Representation.  
**Audit Date:** 2026-11-28  
**Automation Verdict:** CERTIFIED & OPERATIONAL

---

## 1. Executive Summary

Phase 3.5 audits and certifies the transactional email automation and ISO A4 donation receipt generation pipeline. Every transactional event—from donor onboarding and mobile OTP dispatch to contribution settlement, UTR claim acknowledgment, and final 80G tax receipt delivery—is managed through a resilient, persistent transactional outbox pattern.

---

## 2. 10-Event Transactional Email Matrix

| Event Code | Trigger Condition | Recipient | Attachments | Outbox Event Type |
|---|---|---|---|---|
| **EVT-01** | Donor Phone / Email OTP Request | Donor | None | `PORTAL_OTP_DISPATCHED` |
| **EVT-02** | New Donor Account Registration | Donor | Welcome Kit | `DONOR_REGISTERED` |
| **EVT-03** | Donor Portal Login via OTP | Donor | Security Alert | `DONOR_LOGIN_ALERT` |
| **EVT-04** | Cashfree Online Order Created | Donor | None (Pending) | `DONATION_INITIATED` |
| **EVT-05** | Cashfree Payment Settled | Donor | Signed 80G PDF Receipt | `DONATION_COMPLETED` |
| **EVT-06** | Cashfree Payment Settled | Trust Finance Desk | Reconciliation Notice | `ADMIN_PAYMENT_ALERT` |
| **EVT-07** | Manual SBI / UPI UTR Claim Submitted | Donor | Acknowledgment PDF | `UTR_CLAIM_SUBMITTED` |
| **EVT-08** | Manual UTR Remittance Approved | Donor | Stamped 80G PDF Receipt | `UTR_CLAIM_APPROVED` |
| **EVT-09** | Manual UTR Remittance Rejected | Donor | Rectification Notice | `UTR_CLAIM_REJECTED` |
| **EVT-10** | Public General Inquiry Submitted | Donor & Secretariat | Inquiry Summary | `PUBLIC_INQUIRY_RECEIVED` |

---

## 3. Statutory Receipt PDF Generation (`ReceiptPdfService.java`)

All donation receipts adhere strictly to statutory Income Tax Section 80G requirements:
1. **Document Geometry:** ISO 216 standard A4 page layout (`595 x 842 points`) with balanced institutional margins.
2. **Statutory Trust Header:**
   - Name: `MAHAVEER EDUCATIONAL & CHARITABLE TRUST`
   - Legal Status: `Registered Public Charitable Trust (Indian Trusts Act, 1882)`
   - Registration Number: `Reg. No. 40311302194`
   - 12A URN: `AADTM5474FE20231` (AY 2024–25 to AY 2026–27)
   - 80G URN: `AADTM5474FF20241` (50% Tax Deduction Eligible)
   - MCA CSR-1: `CSR00081063`
   - NITI Aayog NGO Darpan: `OR/2024/0466491`
   - Registered Secretariat: `A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014, India`
   - Primary Email: `mectbbsr13@gmail.com`
3. **Receipt Coordinate Elements:**
   - Serial Number: Sequenced reference (e.g. `MECT/80G/2026-27/00023`)
   - Donor Credentials: Full legal name, PAN (if provided), verified phone, email, address
   - Contribution Details: Amount in numbers (`₹1,000.00`) and Indian currency words (`One Thousand Rupees Only`)
   - Purpose / Head: Explicit designation to approved charitable project
   - Authentication Elements: Cryptographic SHA-256 verification QR code, digital authorized signatory stamp
