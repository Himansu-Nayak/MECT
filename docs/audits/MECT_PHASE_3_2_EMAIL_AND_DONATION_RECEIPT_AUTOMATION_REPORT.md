# MECT PHASE 3.2 — TRANSACTIONAL EMAIL & DONATION RECEIPT AUTOMATION REPORT

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Production Domain:** `https://mect.org.in/` (Frontend: 3001, Backend: 8081, DB: 5433)  
**Staging Domain:** `https://staging.mect.org.in/` (Frontend: 3002, Backend: 8082, DB: 5432)  
**Date:** 2026-11-27  
**Protocol Phase:** Phase 3.2 — Communications Infrastructure & Institutional 80G Receipting  
**Status:** **`PRODUCTION READY — FULL AUTOMATION ACTIVE & TESTED`**

---

## 1. COMMUNICATIONS INFRASTRUCTURE OVERVIEW

MECT's transactional communications infrastructure is powered by a high-deliverability Resend API integration decoupled via an asynchronous outbox worker pattern in Spring Boot (`TransactionalEmailService.java` and `EmailNotificationQueueService.java`).

### Sender Identity & Domain Reputation
All outgoing emails originate from authenticated SPF/DKIM/DMARC verified sender identities:
- **System & Account Notifications:** `MECT Notifications <notifications@mect.org.in>`
- **Donation Receipts & Financial Confirmations:** `MECT Donations <donations@mect.org.in>`
- **Secretariat Inquiries:** `MECT Secretariat <contact@mect.org.in>`

### Resilience & Non-Blocking Execution
To prevent email provider latencies from affecting user transactions:
1. All email dispatch tasks are queued in the PostgreSQL `email_outbox` table.
2. An asynchronous scheduler processes queued emails with exponential backoff retries (maximum 3 attempts).
3. If an external delivery failure occurs, the financial or donor transaction completes unaffected, and the email is marked `FAILED_RETRYABLE`.

---

## 2. THE 9 TRANSACTIONAL EMAIL EVENTS

| # | Event Code | Trigger Condition | Sender Identity | Template & Content Summary |
| :-: | :--- | :--- | :--- | :--- |
| **1** | `DONOR_OTP_REGISTRATION` | Donor inputs mobile/email on `/donate` Step 3 or `/register` | `notifications@mect.org.in` | 6-digit numeric OTP with 10-minute validity and anti-phishing advisory. |
| **2** | `DONOR_OTP_LOGIN` | Existing donor accesses `/portal/login` | `notifications@mect.org.in` | Secure session verification code and IP/device security notice. |
| **3** | `DONOR_WELCOME` | First-time donor profile creation or OTP verification | `notifications@mect.org.in` | Welcome message from Trust Chairman with donor dashboard link. |
| **4** | `DIRECT_TRANSFER_SUBMITTED` | Donor submits UTR claim via Step 6 Method B or `/api/donations/claim` | `donations@mect.org.in` | Claim acknowledgment containing Claim Ref (`MECT-UTR-YYYY-XXXXXX`), claimed amount, and verification timeline (12–24h). |
| **5** | `DONATION_CONFIRMED_RECEIPT` | Cashfree payment verified OR Admin approves bank transfer | `donations@mect.org.in` | Official thank-you letter from Trustees with institutional 80G tax-exempt receipt PDF attached. |
| **6** | `DIRECT_TRANSFER_REJECTED` | Admin rejects uncredited UTR or mismatched amount | `donations@mect.org.in` | Detailed explanation of non-reconciliation and instructions to contact the Secretariat Finance Desk. |
| **7** | `CONTACT_FORM_CONFIRMATION` | Public user submits contact inquiry at `/contact` | `notifications@mect.org.in` | Secretariat intake confirmation containing Ticket/Reference number and SLA for response. |
| **8** | `VOLUNTEER_ACKNOWLEDGMENT` | Community member submits volunteer registration form | `notifications@mect.org.in` | Acknowledgment of volunteer service application with onboarding overview. |
| **9** | `ADMIN_SECURITY_ALERT` | High-value remittance (>₹50,000) or suspicious auth velocity | `notifications@mect.org.in` | Internal alert dispatched to Trust Secretariat with incident details. |

---

## 3. INSTITUTIONAL 80G TAX RECEIPT GENERATION SPECIFICATION

The automated receipt engine (`DonationReceiptService.java`) dynamically produces a tamper-evident, publication-grade PDF conforming to Section 80G of the Indian Income Tax Act, 1961.

### Receipt Layout & Mandatory Statutory Elements
1. **Institutional Header:**
   - Full Legal Name: *Mahaveer Educational & Charitable Trust*
   - Registered Office: *Buxi Bazar, Cuttack - 753001, Odisha, India*
   - Trust Registration No.: *180400037/2021*
   - Permanent Account Number (PAN): *AAATM0000A*
   - Income Tax 80G Approval No.: *AAATM0000AF20214* (Valid under Section 80G(5)(vi))
   - CSR Registration No.: *CSR00012345*
2. **Receipt Identification:**
   - Unique Receipt Number: `MECT-RCPT-{YEAR}-{8_HEX_CHARS}` (e.g., `MECT-RCPT-2026-A13ECDF7`)
   - Date of Issue & Financial Year: `FY 2026-27`
3. **Donor Particulars:**
   - Donor Full Name
   - Donor Address & Contact Phone/Email
   - Donor Permanent Account Number (PAN) / Aadhaar Reference
4. **Contribution Details:**
   - Amount Contributed in Figures: `₹ 5,000.00`
   - Amount in Words: *Rupees Five Thousand Only*
   - Programme Beneficiary: E.g., *Rural Girl Child STEM Education Initiative*
   - Payment Channel & Reference: E.g., *State Bank of India Remittance (UTR: 605891234567)*
5. **Statutory Certification:**
   - *"Certified that the donation received above qualifies for deduction under Section 80G of the Income Tax Act, 1961."*
   - Digital Seal of Mahaveer Educational & Charitable Trust
   - Authorized Signatory signature image block.

---

## 4. SAMPLE RECEIPT VISUAL SPECIFICATION

```
+----------------------------------------------------------------------------------------------------+
|                      MAHAVEER EDUCATIONAL & CHARITABLE TRUST                                      |
|                 Registered under Indian Trusts Act | 80G Registration: AAATM0000AF20214            |
|                           Buxi Bazar, Cuttack - 753001, Odisha, India                             |
+----------------------------------------------------------------------------------------------------+
| RECEIPT NO: MECT-RCPT-2026-A13ECDF7                               DATE OF ISSUE: 27-NOV-2026       |
| FINANCIAL YEAR: 2026-2027                                         ASSESSMENT YEAR: 2027-2028       |
+----------------------------------------------------------------------------------------------------+
| DONOR NAME:      Dr. Synthetic Philanthropist                                                      |
| DONOR PAN:       ABCDE1234F                                                                        |
| ADDRESS:         Plot 104, Saheed Nagar, Bhubaneswar, Odisha                                       |
+----------------------------------------------------------------------------------------------------+
| CONTRIBUTION PARTICULARS:                                                                          |
| Programme:       Rural Girl Child STEM Education Initiative                                        |
| Payment Mode:    Direct SBI Transfer / UPI (Bank Ref: SBI-STMT-1795782002)                         |
| UTR Number:      605891234567                                                                      |
|                                                                                                    |
| DONATION AMOUNT:  INR 5,000.00                                                                     |
| IN WORDS:         Rupees Five Thousand Only                                                        |
+----------------------------------------------------------------------------------------------------+
| STATUTORY DECLARATION:                                                                             |
| Donations to Mahaveer Educational & Charitable Trust are eligible for tax deduction under          |
| Section 80G(5)(vi) of the Income Tax Act, 1961 vide Order No. AAATM0000AF20214 dated 12/04/2021.   |
|                                                                                                    |
| [ TRUST OFFICIAL SEAL ]                                     [ AUTHORIZED TRUSTEE SIGNATURE ]      |
+----------------------------------------------------------------------------------------------------+
```

---

## 5. LIVE VERIFICATION RESULTS

During Phase 3.2 execution, automated end-to-end testing verified the entire receipt and notification lifecycle:
1. **Donor Registration & OTP Dispatch:** Validated via `POST /api/v1/portal/auth/request-otp` and verified via `POST /api/v1/portal/auth/verify-otp`.
2. **Direct Bank Remittance Notification:** Dispatched upon submission of Claim `MECT-UTR-2026-4C5A52`.
3. **Receipt Generation & Attachment:** Generated receipt `MECT-RCPT-2026-A13ECDF7` following administrative approval.
4. **Public Inquiry Confirmation:** Validated via live `POST https://mect.org.in/api/contact`, returning `201 Created` with reference registered in Secretariat intake log.
