# MECT PHASE 29.3 — FINANCIAL AND BANKING VERIFICATION AUDIT
## Fiduciary Reconciliation, Banking Coordinates, Merchant Config & Manual Settlement Protocol

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Domain:** https://mect.org.in/  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Phase:** Phase 29.3 — Final Independent Release Gate, Disaster Recovery & Deployment Rehearsal  
**Execution Date:** 19 November 2026  

---

## 1. OFFICIAL BANKING COORDINATES INVENTORY

The trust's official banking details are published for transparent donor verification:

| Parameter | Institutional Coordinate | Authoritative Verification Source |
| :--- | :--- | :--- |
| **Beneficiary Name** | `MAHAVEER EDUCATIONAL & CHARITABLE TRUST` | State Bank of India Checking Account Mandate |
| **Bank Name** | State Bank of India (SBI) | Scheduled Public Sector Commercial Bank |
| **Branch** | Balangir Main Branch (Branch Code: `000048`) | SBI Odisha Circle |
| **Account Number** | `33091993247` | Institutional Current/Trust Account |
| **IFSC Code** | `SBIN0000048` | National Electronic Funds Transfer (NEFT/RTGS) |
| **Official UPI VPA** | `mect@sbi` | SBI Merchant Bharat Interface for Money |
| **Account Purpose** | Public Charitable Donations & Programme Allocations | 100% Remitted to Social Objectives |

---

## 2. PAYMENT CONFIGURATION & SETTLEMENT ARCHITECTURE

### 2.1 Automated Online Gateway (Cashfree)
- **Merchant Mode:** Configurable via `app.cashfree.env` (`TEST` in development; `PRODUCTION` in live deployment).
- **Credentials:** Injected exclusively at host runtime via `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`. Zero hardcoded secrets in Git.
- **Webhook Signature:** Webhook events must provide a valid `x-webhook-signature` computed over `timestamp + rawPayload` using the merchant secret key. Invalid signatures yield HTTP 401.
- **Concurrency & Idempotency:** Each webhook event is deduplicated via `payment_events.provider_event_id`. Payment records use `PESSIMISTIC_WRITE` locks during settlement.

### 2.2 Direct Institutional Banking (SBI Manual Transfer)
- **Workflow:**
  1. Donor makes direct bank transfer via NEFT, RTGS, IMPS, or UPI (`mect@sbi`).
  2. Donor submits 12-digit UTR reference on `/donate` Step 6 (`POST /public/donations/sbi/submit-utr`).
  3. System records donation with status **`PENDING_VERIFICATION`** and manual claim with status **`UTR_SUBMITTED`**.
  4. **Strict Guarantee:** The system **never** marks an unverified UTR as successful automatically.
  5. Authorized Finance Officer (`ROLE_FINANCE_OFFICER` or `ROLE_DONATION_VERIFICATION_OFFICER`) logs into the administrative portal, inspects the physical/net-banking SBI bank statement, and approves the claim.
  6. Upon approval, status transitions to `SUCCESSFUL`, issuing the official serialized PDF tax receipt.

---

## 3. AUDIT CONCLUSION

All public banking coordinates are verified. The financial settlement architecture prevents double-crediting, isolates unverified claims, and strictly enforces dual authorization before tax receipt generation.
