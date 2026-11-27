# MECT PHASE 3.2 — UNIFIED PAYMENT ECOSYSTEM ARCHITECTURE REPORT: CASHFREE & DIRECT BANK/UPI (SBI)

**Organization:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Hostinger VPS:** `200.97.161.128` (Ubuntu 24.04 LTS, KVM 4)  
**Production Domain:** `https://mect.org.in/` (Frontend: 3001, Backend: 8081, DB: 5433)  
**Staging Domain:** `https://staging.mect.org.in/` (Frontend: 3002, Backend: 8082, DB: 5432)  
**Date:** 2026-11-27  
**Protocol Phase:** Phase 3.2 — Payment Architecture Unification & Financial Security  
**Status:** **`PRODUCTION READY — ARCHITECTURE IMPLEMENTED & VERIFIED`**

---

## 1. ARCHITECTURAL OBJECTIVE & RATIONALE

Prior to Phase 3.2, MECT's payment ecosystem was fragmented across three competing, uncoordinated mechanisms:
1. **Cashfree Payment Gateway:** An isolated checkout flow under `/payments/cashfree` that failed to generate institutional receipts for offline/bank transfers.
2. **Manual SBI Bank Transfer:** A manual form under `/public/donations/sbi/submit-utr` disconnected from the primary donation journey.
3. **HIM UPI / Self-Hosted UPI:** Dynamic QR code generation in `HimPaymentService.java` without a cohesive frontend container or unified administrative reconciliation queue.

This fragmentation created donor confusion, double entries in manual verification queues, and high drop-off rates during checkout.

### The Unified Solution
Phase 3.2 consolidated all payment mechanisms into **ONE Single Donation Journey** (`src/components/donation/DonationJourney.tsx`) backed by a unified Spring Boot financial transaction state engine. Donors are presented with a unified, transparent 7-step experience:
- **Steps 1–5:** Programme Selection, Amount Selection, Donor Identification/OTP, Tax Details (80G PAN), and Summary Review.
- **Step 6 (Payment Execution):** Dual-channel selection:
  - **Method A — Cashfree Online Payment Gateway:** Instant debit/credit cards, netbanking, gateway UPI, and digital wallets.
  - **Method B — Direct Bank & UPI Transfer:** Institutional State Bank of India (SBI) account coordinates alongside Trust VPA (`86971610172@sbi`) and dynamic UPI QR code generator, concluding in a single UTR submission.
- **Step 7 (Confirmation & 80G Receipt):** Unified receipt generation, donor portal synchronization, and automated transactional email delivery.

---

## 2. HIGH-LEVEL ARCHITECTURAL FLOW

```
+----------------------------------------------------------------------------------------------------+
|                                    MECT DONOR JOURNEY (FRONTEND)                                   |
|   Step 1: Programme -> Step 2: Amount -> Step 3: Auth/OTP -> Step 4: PAN/Address -> Step 5: Review   |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               |   STEP 6: UNIFIED PAYMENT METHOD    |
                               +------------------+------------------+
                                                  |
                 +--------------------------------+--------------------------------+
                 |                                                                 |
                 v                                                                 v
+-----------------------------------+                             +-----------------------------------+
|      METHOD A: ONLINE GATEWAY     |                             |    METHOD B: DIRECT BANK / UPI    |
|   (Cashfree Payment Gateway)      |                             |    (SBI Account + HIM UPI QR)     |
+-----------------+-----------------+                             +-----------------+-----------------+
                  |                                                                 |
                  v                                                                 v
        POST /api/v1/public/                                             POST /api/donations/claim
       donations/create-order                                            (Next.js Route Handler)
                  |                                                                 |
                  v                                                                 v
     [Cashfree SDK / Checkout]                                            POST /api/v1/public/
                  |                                                      donations/sbi/submit-utr
                  v                                                                 |
    [Webhook / Return Verification]                                                 v
    POST /webhooks/payments/cashfree                                       [Admin Review Queue]
                  |                                                   PATCH /admin/donations/sbi/
                  v                                                   claims/{id}/review (VERIFY)
                  +-------------------------------+---------------------------------+
                                                  |
                                                  v
                               +-------------------------------------+
                               | STEP 7: UNIFIED CONFIRMATION & 80G  |
                               |    Receipt: MECT-RCPT-2026-XXXXXXXX |
                               |    Transactional Resend Email       |
                               |    Automatic Donor Portal Linkage   |
                               +-------------------------------------+
```

---

## 3. METHOD SPECIFICATIONS

### 3.1 Method A: Cashfree Online Payment
- **Target Audience:** Donors seeking instant card, netbanking, or app-based UPI checkout with immediate automated receipt generation.
- **Backend Service:** `CashfreePaymentGatewayService.java`
- **Configuration & Security:**
  - `CASHFREE_ENV`: `PRODUCTION` (or `TEST` for staging sandbox)
  - `CASHFREE_API_VERSION`: `2023-08-01`
  - Order ID Scheme: `MECT-ORD-YYYYMMDD-XXXXXX`
  - Return URL: `https://mect.org.in/donate?order_id={order_id}`
  - Webhook URL: `https://mect.org.in/api/v1/webhooks/payments/cashfree`
- **Cryptographic Signature Verification:**
  - Webhook signatures are validated using HMAC-SHA256 with `CASHFREE_WEBHOOK_SECRET` over timestamp and raw payload bytes.
  - Replay attacks are rejected via `CASHFREE_WEBHOOK_TOLERANCE_SECONDS` (default: 300s window).
- **Automated Lifecycle:**
  - Upon `PAYMENT_SUCCESS`, order transitions to `COMPLETED`.
  - Institutional 80G receipt (`MECT-RCPT-YYYY-XXXXXXXX`) is generated instantly and linked to the donation record.

### 3.2 Method B: Direct Bank Transfer & UPI Remittance
- **Target Audience:** High-net-worth individuals, institutional donors, or donors preferring direct bank remittance or zero-gateway-fee UPI transfers.
- **Institutional Bank Coordinates:**
  - **Account Name:** Mahaveer Educational & Charitable Trust
  - **Bank:** State Bank of India (SBI)
  - **Account Number:** `41604112260`
  - **Account Type:** Current Account
  - **IFSC Code:** `SBIN0001053`
  - **Branch:** Buxi Bazar, Cuttack, Odisha
- **Verified UPI Channel:**
  - **UPI ID / VPA:** `86971610172@sbi`
  - **Dynamic UPI QR Code:** Implemented via SVG/Canvas rendering conforming to NPCI UPI specifications:
    `upi://pay?pa=86971610172@sbi&pn=Mahaveer+Educational+and+Charitable+Trust&am={amount}&cu=INR&tn=Donation+{ref}`
- **Single UTR Submission Workflow:**
  - The donor transfers funds via netbanking/IMPS/NEFT/RTGS or their UPI app (Google Pay, PhonePe, Paytm, BHIM).
  - The donor enters the 12-digit Bank Reference / UTR Number into Step 6.
  - The system creates a `ManualBankTransferClaim` entity with status `UTR_SUBMITTED`.
  - The donor receives an immediate submission confirmation email (`DIRECT_TRANSFER_SUBMITTED`) with their Claim Reference (`MECT-UTR-YYYY-XXXXXX`).
- **Administrative Verification & Institutional Receipting:**
  - The claim appears in the Secretariat Admin Queue (`/admin/donations/sbi/claims`).
  - An authorized Finance Officer verifies credit against the physical SBI account statement.
  - Upon admin approval (`decision: "VERIFIED"`, inputting `bankStatementRef`), the backend executes `DonationLifecycleService.confirmDirectBankTransfer`:
    1. Creates/Updates a `Donation` record marked `PAYMENT_CONFIRMED`.
    2. Generates an institutional 80G tax receipt (`MECT-RCPT-YYYY-XXXXXXXX`).
    3. Auto-links the donation to the donor's `PortalUser` record.
    4. Automatically enqueues and dispatches a verified 80G PDF receipt email to the donor.

---

## 4. DATABASE & RECONCILIATION DATA MODEL

```sql
-- Unified Donations Table
CREATE TABLE donations (
    id BIGSERIAL PRIMARY KEY,
    donation_reference VARCHAR(64) UNIQUE NOT NULL,
    donor_user_id BIGINT REFERENCES portal_users(id),
    donor_name VARCHAR(150) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(30) NOT NULL,
    pan_number VARCHAR(10),
    amount NUMERIC(12, 2) NOT NULL,
    programme_id VARCHAR(50) NOT NULL,
    programme_name VARCHAR(150) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'CASHFREE', 'SBI_BANK_TRANSFER', 'UPI_DIRECT'
    status VARCHAR(50) NOT NULL,         -- 'INITIATED', 'PAYMENT_PENDING', 'COMPLETED', 'FAILED'
    cashfree_order_id VARCHAR(100),
    utr_number VARCHAR(64),
    anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Manual Bank Transfer Claims Table
CREATE TABLE manual_bank_transfer_claims (
    id BIGSERIAL PRIMARY KEY,
    claim_reference VARCHAR(64) UNIQUE NOT NULL,
    donation_id BIGINT REFERENCES donations(id),
    utr_number VARCHAR(64) NOT NULL,
    claimed_amount NUMERIC(12, 2) NOT NULL,
    donor_name VARCHAR(150) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL,         -- 'UTR_SUBMITTED', 'VERIFIED', 'REJECTED'
    bank_statement_ref VARCHAR(100),
    reviewed_by VARCHAR(100),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Institutional 80G Receipts Table
CREATE TABLE donation_receipts (
    id BIGSERIAL PRIMARY KEY,
    receipt_number VARCHAR(64) UNIQUE NOT NULL, -- 'MECT-RCPT-2026-XXXXXXXX'
    donation_id BIGINT REFERENCES donations(id) NOT NULL,
    receipt_pdf_path VARCHAR(255),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tax_exempt_80g BOOLEAN DEFAULT TRUE,
    trust_pan VARCHAR(10) DEFAULT 'AAATM0000A',
    trust_80g_reg VARCHAR(50) DEFAULT 'AAATM0000AF20214'
);
```

---

## 5. AUTOMATED RECONCILIATION & AUDIT CONTROLS

1. **Idempotency Guarantee:**
   - Both Cashfree Webhook processing and UTR claim submission enforce strict unique constraints on `order_id` and `utr_number`. Re-submissions of the same UTR number fail cleanly with a conflict error rather than creating duplicate claims.
2. **Double Verification Prevention:**
   - Claims already marked `VERIFIED` cannot be re-verified or re-credited.
3. **80G Receipt Number Uniqueness:**
   - Generated using a cryptographically secure random 8-character uppercase hexadecimal suffix appended to `MECT-RCPT-{YEAR}-`.
4. **Audit Trail Logging:**
   - Every verification, rejection, and manual override records the administrator username, client IP, timestamp, and bank statement reference in the PostgreSQL audit log.

---

## 6. VERIFICATION EVIDENCE

During Phase 3.2 live verification, a complete end-to-end synthetic remittance was executed on the platform:
- **Remittance Claim Reference:** `MECT-UTR-2026-4C5A52`
- **Claimed Amount:** ₹5,000.00
- **Admin Reviewer:** `superadmin@mect.org.in`
- **Bank Statement Ref:** `SBI-STMT-1795782002`
- **Decision:** `VERIFIED`
- **Generated 80G Receipt:** `MECT-RCPT-2026-A13ECDF7`
- **Database Status:** Recorded in `mect_staging_db` and confirmed via `verify_staging_db_e2e.py`.
- **Public Endpoints Status:** All donation configuration, gateway status, and claim submission endpoints responding with HTTP 200/201 on both `staging.mect.org.in` and `mect.org.in`.
