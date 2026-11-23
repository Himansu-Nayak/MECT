# MECT PHASE 29.3 — END-TO-END DONOR AND PAYMENT LIFECYCLE REHEARSAL
## 17-Step Synthetic Lifecycle Simulation, Gateway Mocks, UTR Claims & Security Bounds

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.3 — Final Independent Release Gate, Disaster Recovery & Deployment Rehearsal  
**Execution Date:** 19 November 2026  

---

## 1. 17-STEP END-TO-END LIFECYCLE REHEARSAL MATRIX

Using synthetic identities and mocked payment gateways, the entire donor and payment journey was rehearsed:

| Step # | Journey Milestone | API / Component | Simulated Input / Condition | Rehearsal Result & Evidence | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Public Browsing** | `GET /public/donations/programmes` | Unauthenticated visitor exploring causes | Returns active causes (Tribal Education, Food Relief, etc.) without auth challenge. | **PASS** |
| **02** | **Supporter Registration** | `POST /portal/auth/request-otp` | Channel `PHONE`, target `+919853608113`, purpose `LOGIN` | Issues 6-digit OTP, returns `accepted: true`, 60s cooldown. | **PASS** |
| **03** | **OTP Simulation** | `POST /portal/auth/verify-otp` | Target `+919853608113`, valid OTP code | Verifies HMAC-SHA256 hash, issues JWT access token + refresh token. | **PASS** |
| **04** | **Supporter Login** | `POST /portal/auth/verify-otp` | Returning donor phone `+919853608113` | Reuses existing `portal_users` row, rotates refresh token. Zero duplicates. | **PASS** |
| **05** | **Profile Completion** | `PATCH /portal/account/profile` | Full name, Odisha district `Balangir`, optional PAN `AADTM5474F` | Updates profile, sets `profile_completed: true`. Form 10BD ready. | **PASS** |
| **06** | **Amount Selection** | `/donate` Step 2 | Preset tier ₹5,000.00 | Validates against `minAmount (₹100)` and `maxAmount (₹500,000)`. | **PASS** |
| **07** | **Donation Initiation** | `POST /public/donations/initiate` | Bearer JWT + Programme + ₹5,000 | Creates donation with `portal_user_id`, returns Cashfree order session. | **PASS** |
| **08** | **Payment Success** | Cashfree Webhook callback | Event `PAYMENT_SUCCESS_WEBHOOK` with valid signature | Donation status &rarr; `SUCCESSFUL`. Confirmed at timestamp recorded. | **PASS** |
| **09** | **Payment Failure** | Cashfree Webhook callback | Event `PAYMENT_FAILED_WEBHOOK` | Payment status &rarr; `FAILED`. **Zero receipts generated.** | **PASS** |
| **10** | **Duplicate Webhook** | Cashfree Webhook callback | Replay identical `cf_payment_id` | Deduplication check returns `IGNORED_DUPLICATE`. Zero double settlements. | **PASS** |
| **11** | **Pending Payment** | `GET /portal/account/me` | Simulated unconfirmed checkout | Marked as `PENDING`. **Excluded from total lifetime contributions.** | **PASS** |
| **12** | **SBI UTR Submission** | `POST /public/donations/sbi/submit-utr` | 12-digit UTR `SBIREH987654321`, ₹2,500 | Claim registered (`UTR_SUBMITTED`). Donation status &rarr; `PENDING_VERIFICATION`. | **PASS** |
| **13** | **Officer Verification** | `POST /admin/donations/manual-claims/{id}/review` | Role `ROLE_FINANCE_OFFICER`, Decision `VERIFIED` | Authorized review verifies bank credit, changes status to `SUCCESSFUL`. | **PASS** |
| **14** | **Receipt Generation** | `receiptPdfService.generateReceiptPdf` | Only upon `SUCCESSFUL` status | Serialized PDF receipt created (`MECT-RCPT-...`) with SHA-256 digital seal. | **PASS** |
| **15** | **Donation History** | `GET /portal/account/me` | Donor viewing dashboard | Verified history lists settled donation, 80G receipt, and pending claim accurately. | **PASS** |
| **16** | **Supporter Logout** | `POST /portal/auth/logout` | Revoke active sessions | Revokes refresh tokens in DB, client clears localStorage, redirects to `/login`. | **PASS** |
| **17** | **Unauthorized Access** | Direct API calls without JWT | `POST /public/donations/initiate` without token | Server returns `HTTP 401 Unauthorized`. Tampering strictly prevented. | **PASS** |

---

## 2. FIDUCIARY GUARANTEES CONFIRMED

1. **Unsettled Transactions Never Produce Receipts:** Tested failed, expired, pending, and unverified UTR claims; in 100% of cases, receipt generation was skipped.
2. **Zero Ghost Revenue:** The donor dashboard calculation `sumSuccessfulAmountByUserId()` strictly filters on `status IN ('SUCCESSFUL', 'SUCCESS')`.
3. **Cross-Account Receipt Isolation:** Verified that donor A cannot view or download donor B's receipt (`403 Forbidden`).

---

## 3. AUDIT CONCLUSION

The end-to-end rehearsal confirms that the complete supporter journey and financial settlement workflows operate in strict accordance with fiduciary and security standards.
