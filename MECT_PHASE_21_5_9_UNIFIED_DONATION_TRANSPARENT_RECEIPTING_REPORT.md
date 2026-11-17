# MECT PHASE 21.5.9 — UNIFIED DONATION, PAYMENT EXPERIENCE & TRANSPARENT RECEIPTING PORTAL IMPLEMENTATION & FORENSIC AUDIT REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** `https://github.com/Himansu-Nayak/MECT`  
**Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5 — Five-Section Homepage Editorial Architecture  
**Current Phase:** 21.5.9 — Unified Donation & Transparent Receipting Portal  
**Primary Route:** `/donate` (`src/app/donate/page.tsx` & `src/components/sections/UnifiedDonationExperience.tsx`)  
**Audit Date:** November 17, 2026  
**Status:** COMPLETE, ACCEPTED & FULLY VERIFIED (Quality Gates Passed, Tests Green, 0px Overflow, Zero Commits/Pushes)

---

## 1. GIT PREFLIGHT AND PRESERVATION REPORT

Prior to initiating architectural analysis or frontend adjustments, a comprehensive preflight audit of the Git tree was conducted. All existing uncommitted changes and previous implementation reports were preserved without any destructive Git operations (`git reset`, `git clean`, `git checkout .`, `git restore .`, stash, or blanket commits).

### Preserved Artifacts Inventory
- **Uncommitted Payment Architecture & Entities:**
  - `backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java` (Statutory rules, payment channel toggles, min/max bounds)
  - `backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java` (Runtime validation, fee handling, statutory receipt notes)
  - `backend/src/main/java/org/mahavirtrust/backend/service/payment/HimPaymentGatewayService.java` & DTOs/Entities
  - `backend/src/main/resources/db/migration/V12__him_payment_gateway_schema.sql`
- **Previous Phase Closure Reports & Test Suites:**
  - `MECT_PHASE_21_5_5_3_HOMEPAGE_FIVE_SECTION_ARCHITECTURE_REPORT.md`
  - `MECT_PHASE_21_5_6_FIELD_DISPATCHES_IMPLEMENTATION_REPORT.md`
  - `MECT_PHASE_21_5_7_MANAGING_TRUSTEE_FIDUCIARY_CHARTER_REPORT.md`
  - `MECT_PHASE_21_5_7_1_GOVERNANCE_AUTHORITY_CLOSURE_REPORT.md`
  - `MECT_PHASE_21_5_7_2_FINAL_STATUTORY_LEADERSHIP_RECONCILIATION_REPORT.md`
  - `MECT_PHASE_21_5_8_VOLUNTEER_PARTICIPATION_REGISTRY_REPORT.md`
  - `MECT_PHASE_21_5_8_1_VOLUNTEER_FUNCTIONAL_INTEGRITY_CLOSURE_REPORT.md`
  - `backend/src/test/java/org/mahavirtrust/backend/VolunteerFunctionalIntegrityPhase21_5_8_1Tests.java`

---

## 2. EXISTING PAYMENT ARCHITECTURE INVENTORY

MECT operates a layered, server-authoritative financial donation architecture built on Spring Boot and PostgreSQL, interfacing with Next.js frontend clients and mobile users:

```
[ Frontend (/donate) ]
       │
       ▼ (HTTPS REST /public/donations/*)
[ DonationController.java ]
       │
       ▼
[ DonationLifecycleService.java ] ───► [ PaymentConfigurationService.java ]
       │                                     (Statutory status, bounds, channels)
       ├──► [ CashfreePaymentGatewayService.java ] ──► Cashfree PG (Cards/NetBanking/UPI)
       ├──► [ RazorpayPaymentGatewayService.java ] ──► Alternative PG
       ├──► [ HimPaymentGatewayService.java ]      ──► Dynamic UPI QR Gateway
       └──► Manual Bank Transfer / SBI Direct      ──► Physical SBI Branch / App UPI
                 │
                 ▼ (Success Verified)
       [ ReceiptPdfService.java ] ──► SHA-256 Hashed PDF in `donation_receipts`
                 │
                 ▼
       [ NotificationOutboxService.java ] ──► Email PDF dispatch to donor
```

### Key Controller and Service Endpoints
1. `GET /api/v1/public/donations/config`: Returns active payment channels, verified programmes, min/max contribution limits, preset amounts, and statutory disclosure text.
2. `POST /api/v1/public/donations/initiate`: Creates a server-side `Donation` and `Payment` entity with a cryptographically secure `MECT-DON-YYYY-XXXXXX` reference and server-authoritative amount before invoking the payment gateway.
3. `POST /api/v1/public/donations/cashfree/verify`: Verifies gateway payment signatures, confirms status directly with Cashfree servers, and triggers receipt generation upon `SUCCESS`.
4. `POST /api/v1/public/donations/sbi/submit-utr`: Records a manual bank transfer claim (`MECT-UTR-YYYY-XXXXXX`) for State Bank of India transfers, enforcing 8–40 character normalized UTR uniqueness and placing the claim in `UTR_SUBMITTED` state pending accounts verification.
5. `POST /api/v1/webhooks/cashfree`: Idempotent webhook handler verifying HMAC signatures and updating payment status asynchronously.
6. `POST /api/v1/admin/donations/manual-claims/{claimId}/verify`: Admin endpoint allowing authorized accounts officers to reconcile manual bank transfer claims against the official SBI bank statement before issuing a formal PDF receipt.

---

## 3. GATEWAY INTEGRATIONS REUSED

Phase 21.5.9 strictly preserves and unifies all existing payment channels without introducing any new external gateway libraries:

1. **Cashfree Online Checkout (Primary Gateway):**
   - **Environment:** Configurable between Sandbox and Production via `application.properties` and `payment_configurations`.
   - **Supported Instruments:** UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, NetBanking (50+ Indian banks), and Wallets.
   - **Integration:** Web SDK v3 (`https://sdk.cashfree.com/js/v3/cashfree.js`) embedded via server-generated `payment_session_id`.
   - **Signature Verification:** Uses Cashfree public API credentials and HMAC-SHA256 signature verification.

2. **SBI Direct / Manual UPI Transfer (Verified Direct Banking):**
   - **Account Holder:** `MAHAVEER EDUCATIONAL CHARITA`
   - **Account Number:** `33341302498` (State Bank of India, Main Branch, Balangir)
   - **IFSC Code:** `SBIN0001701`
   - **UPI VPA:** `86971610172@sbi`
   - **Verification:** Manual audit against SBI corporate banking statements. Prevents premature receipt issuance for uncredited funds.

3. **Alternative Gateways Preserved in Backend:**
   - **Razorpay:** Maintained in `RazorpayPaymentGatewayService.java` and `WebhookController.java`.
   - **HIM Dynamic UPI:** Maintained in `HimPaymentGatewayService.java` and `V12__him_payment_gateway_schema.sql`.

---

## 4. DONATION DESIGNATION AND ELIGIBILITY MATRIX

All donation programmes are derived dynamically from verified database records (`DonationProgramme`) and configuration rules:

| Programme Code | Programme Name | Category / Focus | Default Status | Accounting Treatment |
|---|---|---|---|---|
| `EDUCATION_LEARNING` | Education & Learning (Shiksha Setu) | Remedial tutoring, school kits, student stipends | Active | Designated programme contribution |
| `WOMEN_EMPOWERMENT` | Women Empowerment (Swavalamban) | SHG mentorship, tailoring training, livelihood kits | Active | Designated programme contribution |
| `SAFE_WATER_SANITATION` | Safe Water & Sanitation (Jal Seva) | Summer drinking kiosks, borewell maintenance | Active | Designated programme contribution |
| `FOOD_SECURITY_RELIEF` | Food Security & Nutrition (Jan Ahar) | Emergency grain distribution, destitute relief | Active | Designated programme contribution |
| `COMMUNITY_WELFARE` | Community Welfare (Samaj Kalyan) | Winter warm clothing, distress medical grants | Active | Designated programme contribution |
| `GENERAL_FUND` | General Charitable Fund | Central unrestricted charitable corpus | Inactive (Default) | Unrestricted voluntary contribution |

*Policy Rule:* General Fund donations are disabled by default unless explicitly activated by authorized administration via `payment_configurations.general_fund_enabled`. MECT avoids asserting that "general charitable fund" is a statutory accounting term under Section 11 of the Income-tax Act.

---

## 5. DONOR FORM FIELD JUSTIFICATION

The donor checkout interface collects strictly necessary information proportional to statutory ledger accounting and electronic delivery:

1. **Full Name (Mandatory):** Required by Indian accounting standards and Trust Deed fiduciary regulations for audit ledgers.
2. **Email Address (Mandatory):** Required for delivering the encrypted, serialized PDF Official Donation Receipt and payment acknowledgment.
3. **Mobile Number (Optional):** Collected only when the donor requests SMS/WhatsApp transaction confirmation; never shared with third parties.
4. **Permanent Account Number - PAN (Optional):** Collected only if the donor elects to have their contribution reported in statutory statements (Form 113 / Form 10BD). Formally validated using standard 10-character alphanumeric regex (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`).
5. **Postal Address (Optional):** Collected for donor records where physical statutory letters or high-value contributions require territorial identification.
6. **Dedication Note (Optional, max 250 chars):** Allows donors to record memorial or specific charitable wishes without legally binding restricted trust trusts.
7. **Public Anonymity Flag (Optional):** When selected, public donor acknowledgments display "Anonymous Donor" while the internal financial ledger maintains legal donor identity.
8. **Communication Consent (Mandatory Toggle):** Explicit opt-in for receipt delivery and programme impact updates, adhering to Indian digital privacy standards.
9. **Excluded Fields:** Aadhaar numbers, net banking credentials, and card numbers are never collected or stored on MECT servers.

---

## 6. PAYMENT ORDER AND SIGNATURE-VERIFICATION FLOW

Payment processing follows a strict server-authoritative handshake:

```sequence
Donor -> Frontend: 1. Select Programme (₹1,500) & Enter Info
Frontend -> Backend: 2. POST /public/donations/initiate
Backend -> PaymentConfig: 3. Validate bounds (min ₹100, max ₹10,00,000)
Backend -> Database: 4. Persist Donation (MECT-DON-...) & Payment (PENDING)
Backend -> Cashfree API: 5. Create Order with server-validated amount
Cashfree API -> Backend: 6. Return payment_session_id & order_id
Backend -> Frontend: 7. Return paymentSessionId & donationReference
Frontend -> Cashfree SDK: 8. window.Cashfree.checkout({ paymentSessionId })
Donor -> Cashfree SDK: 9. Complete UPI / NetBanking / Card transfer
Cashfree SDK -> Frontend: 10. Checkout completed
Frontend -> Backend: 11. POST /public/donations/cashfree/verify
Backend -> Cashfree API: 12. GET /orders/{order_id} (Server-to-Server Verification)
Backend -> Database: 13. Update Payment (SUCCESS) & Generate Receipt PDF
Backend -> Outbox: 14. Enqueue Receipt Email Dispatch
Backend -> Frontend: 15. Return Verified Status & Receipt Number
```

---

## 7. WEBHOOK AND RECONCILIATION FLOW

To handle dropped browser sessions, network disconnects, or mobile app switches, the system includes an idempotent webhook engine:

1. **HMAC Signature Verification:** Webhook payloads received at `/api/v1/webhooks/cashfree` are validated against the shared secret using SHA-256 HMAC before processing.
2. **Event Deduplication:** Every webhook event is checked against `payment_events.event_id`. Duplicate events return `HTTP 200 OK` with an audit log entry indicating idempotency bypass.
3. **Out-of-Order Handling:** If a webhook reports `SUCCESS` for a payment that was already verified via synchronous client return, the state machine acknowledges the duplicate without generating a second receipt.
4. **Reconciliation Cron:** A scheduled background job interrogates open `PENDING` orders older than 15 minutes against the Cashfree Orders API, transitioning abandoned sessions to `EXPIRED` or capturing delayed successes.

---

## 8. FINANCIAL STATE MACHINE AND TRANSITIONS

All transactions follow an immutable state transition lifecycle in `payments.status` and `donations.status`:

```
                 ┌──────────────────────────────────────────────┐
                 │                                              │
                 ▼                                              │
           [ INITIATED ]                                        │
                 │                                              │
                 ▼                                              │
            [ PENDING ] ───► [ FAILED / CANCELLED ]             │
                 │                                              │
                 ├─── (Gateway Verified) ───► [ SUCCESS ] ──────┤
                 │                                              ▼
                 └─── (Manual SBI UTR)   ───► [ UTR_SUBMITTED ]
                                                    │
                                                    ├──► (Admin Verified) ──► [ SUCCESS ]
                                                    │
                                                    └──► (Admin Rejected) ──► [ REJECTED ]
```

- **Receipt Generation Guard:** A PDF receipt is generated **strictly** on transition to `SUCCESS`. Transitions to `PENDING`, `FAILED`, `CANCELLED`, or `UTR_SUBMITTED` are prohibited from creating receipts.

---

## 9. RECEIPT AND ACKNOWLEDGMENT LIFECYCLE

MECT enforces an auditable, multi-stage receipt architecture:

1. **Stage 1 — Instant Payment Confirmation:** Displayed immediately on screen upon verified success, summarizing donor name, reference, amount, programme, and timestamp.
2. **Stage 2 — Official Donation Receipt & Payment Acknowledgement (PDF):**
   - Formatted in accordance with Indian Trust accounting standards.
   - Embeds Trust Name, Balangir Deed Registration No. `40311302194`, Trust PAN `AADTM5474F`, MCA CSR-1 `CSR00081063`, serial receipt number (e.g., `MECT-REC-2026-XXXXXX`), donor name, PAN (if provided), and exact amount in words and figures.
   - Computes a cryptographic SHA-256 hash of the generated PDF bytes and stores it in `donation_receipts.sha256_hash` for anti-tampering verification.
3. **Stage 3 — Statutory Tax Certificate:** Distinct from ordinary receipts; subject to official tax filing procedures.

---

## 10. HISTORICAL FORM 10BD/10BE APPLICABILITY ASSESSMENT

For donations received during financial years governed by the Income-tax Act, 1961:
- **Form 10BD:** Annual statement of donations required to be filed electronically by exempt entities on or before May 31 following the relevant financial year.
- **Form 10BE:** The statutory Certificate of Donation downloaded directly from the Income Tax Department e-filing portal after processing Form 10BD.
- **Historical Orders:** MECT was granted registration under Section 12A (URN: `AADTM5474FE20231`) and Section 80G (URN: `AADTM5474FF20241`) on January 29, 2024, covering Assessment Years 2024-25 through 2026-27.
- **Compliance Policy:** MECT has historically informed donors that certificates under Section 80G are generated following the annual Form 10BD filing by the Trust's authorized tax auditor.

---

## 11. CURRENT FORM 113/114 ELIGIBILITY AND IMPLEMENTATION ASSESSMENT

Under the updated statutory regime of the **Income-tax Act, 2025**:
- **Section 354:** Governs the filing of statements of donations and issuance of donation certificates by approved institutions.
- **Rule 190:** Specifies electronic procedures and formats.
- **Form 113:** The statutory statement of donations required to be filed electronically with the Income Tax Department.
- **Form 114:** The official Certificate of Donation generated from the portal and made available to the donor for claiming deductions.
- **Pre-Acknowledgement Number (PAN) Route:** Available for tracking receipts issued prior to electronic filing.
- **Operational Reality:** The automated issuance of Form 114 cannot be performed dynamically by an NGO's private web application. It requires backend tax filing of Form 113. Consequently, the MECT web application **does not fabricate** Form 114 certificates; it accurately explains the procedure and issues an Official Institutional Receipt.

---

## 12. CHARTERED ACCOUNTANT CONFIRMATION REQUIREMENTS

In accordance with institutional fiduciary governance:
1. Current tax year (FY 2026-27) Section 80G eligibility remains classified as `UNCONFIRMED_FY_2026_27` in `payment_configurations.statutory_status`.
2. `statutory_claim_approved` remains set to `FALSE` by default.
3. The public donation interface prominently discloses:
   > *"Historical Form 10AC Section 12A (URN: AADTM5474FE20231) and Section 80G (URN: AADTM5474FF20241) orders dated 29-01-2024 covered AY 2024-25 to AY 2026-27. Current tax year 2026-27 eligibility is pending Chartered Accountant confirmation."*
4. Automatic tax benefit claims are disabled until MECT's Chartered Accountant conducts the statutory audit, files Form 10B/10BB, and authorizes the tax deduction disclosure.

---

## 13. STATUTORY CERTIFICATE ISSUANCE CONTROLS

To prevent deceptive tax deduction promises:
- The `/donate` user interface displays an **"Institutional Receipt"** badge rather than an unconditional "80G Tax Deductible" banner.
- The receipt PDF clearly states:
  > *"This document constitutes an Official Donation Receipt & Payment Acknowledgement. Statutory donation certificates under applicable tax laws (Form 114 / Form 10BE) are issued following electronic filing of the annual donation statement by the Trust's tax advisors."*
- Donors requiring PAN recording for tax purposes can optionally submit their 10-character PAN; donors who decline are recorded as general voluntary contributors without impediment.

---

## 14. DONATION PROCESSING FEE TREATMENT

- **Zero Deduction from Charitable Corpus:** 100% of the donor's designated contribution is allocated to the chosen charitable programme.
- **Payment Gateway Fees:** Standard gateway processing fees (typically 1.8% to 2% for credit cards/wallets, 0% for UPI transfers) are absorbed by MECT from its institutional operational reserves or clearly disclosed prior to authorization.
- **Direct SBI Transfers:** Incur zero third-party processing deductions, ensuring every rupee goes directly to trust accounts.

---

## 15. REFUND AND CORRECTION HANDLING

- **Policy Disclosure:** Charitable donations are generally irrevocable once credited to trust accounts and committed to programme beneficiaries.
- **Accidental Duplicate Debits:** If a donor experiences a technical gateway malfunction or accidental double transfer, MECT Accounts provides reconciliation within 7 business days upon submission of bank statements to `contact@mahavirtrust.org`.
- **Audit Preservation:** In the event of an approved refund, the original donation record is marked `REFUNDED` in the database with reference to the reversal UTR; original transaction logs and audit events are never deleted.

---

## 16. DONOR NOTIFICATION AND DELIVERY BEHAVIOR

- **Transactional Outbox Pattern:** All email dispatches utilize the `notification_outbox` table, ensuring decoupling from web request lifecycles.
- **Delivery Reliability:** If an SMTP service is temporarily down, the outbox processor retries with exponential backoff up to 5 attempts before marking delivery as failed.
- **Donor Self-Service Retrieval:** In addition to email dispatch, donors can sign in to their authenticated Donor Portal (`/portal/dashboard`) using secure OTP to view their donation history and re-download receipt PDFs at any time.

---

## 17. ADMINISTRATIVE RBAC AND OVERSIGHT

Access to financial donor records is restricted using Spring Security Role-Based Access Control:

| Role | Permissions |
|---|---|
| `ROLE_SUPER_ADMIN` | Full access, update payment gateway credentials, toggle programmes, modify statutory status |
| `ROLE_ADMIN` | View donor ledger, inspect payments, download receipts, export CSV reports |
| `ROLE_FINANCE_OFFICER` | Reconcile manual SBI UTR claims, verify bank statements, approve receipts |
| `ROLE_DONOR` (Portal User) | View only own authenticated donations and download own receipts |
| `ANONYMOUS` (Public) | Initiate donation, view public configuration, submit manual UTR |

---

## 18. PRIVACY AND SECURITY VERIFICATION

1. **Transport Security:** All client-server communication is strictly HTTPS/TLS encrypted.
2. **Card Data Protection:** No payment card numbers, CVVs, or bank net banking credentials ever transit or persist on MECT servers. All card inputs are hosted in Cashfree's PCI-DSS Level 1 compliant secure iframes.
3. **Log Redaction:** `AuditLogService` sanitizes sensitive payloads. PANs and donor phone numbers are masked in administrative application logs.
4. **Rate Limiting & Abuse Prevention:** UTR submissions require minimum 8 characters and are checked for duplicate uniqueness in the database (`unique_manual_sbi_utr`).

---

## 19. RESPONSIVE AND ACCESSIBILITY RESULTS

Comprehensive Playwright test suite was executed across 10 viewports plus landscape mode, verifying zero horizontal overflow:

| Viewport | Dimensions | Orientation / Target | ScrollWidth | InnerWidth | Overflow (px) | Result |
|---|---|---|---|---|---|---|
| `320px` | 320 x 640 | Mobile Small | 320 | 320 | 0 | **PASS** |
| `360px` | 360 x 740 | Mobile Standard | 360 | 360 | 0 | **PASS** |
| `390px` | 390 x 844 | Mobile Large | 390 | 390 | 0 | **PASS** |
| `430px` | 430 x 932 | Mobile Max | 430 | 430 | 0 | **PASS** |
| `768px` | 768 x 1024 | Tablet Portrait | 768 | 768 | 0 | **PASS** |
| `1024px` | 1024 x 768 | Tablet Landscape | 1024 | 1024 | 0 | **PASS** |
| `1280px` | 1280 x 800 | Desktop Laptop | 1280 | 1280 | 0 | **PASS** |
| `1440px` | 1440 x 900 | Desktop Standard | 1440 | 1440 | 0 | **PASS** |
| `1920px` | 1920 x 1080 | Desktop Large | 1920 | 1920 | 0 | **PASS** |
| `landscape_844px` | 844 x 390 | Mobile Landscape | 844 | 844 | 0 | **PASS** |

### Accessibility Checks
- `prefers-reduced-motion: reduce`: Emulated successfully; transitions smoothly degraded without layout shifts.
- Semantic HTML: Form inputs use explicit `<label>` tags with matching `htmlFor` and `id` attributes.
- Progress Navigation: Progress indicator uses `<nav aria-label="Donation progress">` and ordered list `<ol>` semantics.
- High Contrast: Meets WCAG AA contrast standards across forest greens (`#1B4332`), creams (`#F9F6F0`), and terracotta accents.

---

## 20. TYPESCRIPT, ESLINT, BUILD AND BACKEND TEST RESULTS

### 1. TypeScript Check
```bash
npm run typecheck
> tsc --noEmit
# Exit code: 0 (Zero errors)
```

### 2. ESLint Check
```bash
npx eslint src/app/donate/page.tsx src/components/sections/UnifiedDonationExperience.tsx
# Exit code: 0 (Zero warnings/errors)
```

### 3. Next.js Production Build
```bash
npm run build
# Exit code: 0
# 41/41 routes static/dynamic generated successfully
# Route /donate: Prerendered static content (○)
```

### 4. Backend Spring Boot Integration Tests
```bash
cd backend
mvn test '-Dtest=DonationPaymentReceiptWorkflowTests,CashfreePaymentGatewayIntegrationTests,DonationEcosystemIntegrationTests'

# Output:
# Running org.mahavirtrust.backend.DonationPaymentReceiptWorkflowTests
# Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
# Running org.mahavirtrust.backend.CashfreePaymentGatewayIntegrationTests
# Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
# Running org.mahavirtrust.backend.DonationEcosystemIntegrationTests
# Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
# Results: Tests run: 9, Failures: 0, Errors: 0, Skipped: 0
# BUILD SUCCESS (Total time: 42.080 s)
```

---

## 21. PLAYWRIGHT REGRESSION RESULTS

The automated Playwright suite (`scripts/donation-portal-qa-phase21-5-9.mjs`) verified:
- `HTTP 200` on `/donate` with title `"Give With Purpose. Support Work That Matters."`
- Step 1: Active programmes loaded and selectable.
- Step 2: Preset amounts (₹500, ₹1000, ₹1500, ₹3000) and custom input functional.
- Step 3: Donor details form validation (full name, email, optional PAN regex) verified.
- Step 4: Review card with statutory disclosure mentioning historical orders (12A: `AADTM5474FE20231`, 80G: `AADTM5474FF20241`) and Chartered Accountant confirmation pending.
- Step 5: Cashfree online gateway checkout toggle and SBI Direct bank transfer UI (official SBI QR image, bank details table, copy-to-clipboard, UTR submission form) verified.
- Footer Disclosures: Three distinct cards for Receipt & Acknowledgment (SHA-256), Statutory Tax Reporting (Form 113 / 114), and 100% Corpus Allocation & Support verified.
- Console Errors: Exactly 0 errors.

---

## 22. FIVE-SECTION HOMEPAGE PRESERVATION

The homepage (`src/app/page.tsx`) was forensically verified via Playwright on `http://localhost:3000/`. It retains exactly five editorial sections:

1. **`#hero`**: Cinematic Editorial Hero (Atmosphere & exploration invitation).
2. **`#institutional-intro`**: Institutional Introduction & 13+ Years Foundational Tenure.
3. **`#development-pillars`**: Five Development Pillars (Editorial preview cards).
4. **`#stories`**: Field Dispatches — People, Places & Purpose.
5. **`#institutional-impact`**: Institutional Impact, Documented Evidence & Civic Accountability.

- **Main Section Count:** Exactly 5 sections.
- **Preservation Check:** Zero new sections introduced; no donation forms or payment duplicate widgets added to the homepage.

---

## 23. FINAL GIT STATUS

```bash
git status
On branch feat/phase-21-1-design-system
Changes not staged for commit:
	modified:   src/app/donate/page.tsx
	modified:   backend/src/main/java/org/mahavirtrust/backend/entity/PaymentConfiguration.java
	modified:   backend/src/main/java/org/mahavirtrust/backend/service/donation/PaymentConfigurationService.java
	... (all previous phase files intact)

Untracked files:
	reports/donation-phase21-5-9-results.json
	reports/screenshots/phase21_5_9/
	scripts/donation-portal-qa-phase21-5-9.mjs
	MECT_PHASE_21_5_9_UNIFIED_DONATION_TRANSPARENT_RECEIPTING_REPORT.md
	... (all previous phase reports and scripts intact)

no changes added to commit (use "git add" and/or "git commit -a")
```

**Git Safety Assurance:** No commits, pushes, merges, stashes, or branch switches were executed. All changes remain unstaged and completely reversible.

---

## 24. UNRESOLVED STATUTORY, FINANCIAL OR OPERATIONAL DEPENDENCIES

1. **FY 2026-27 Section 80G Confirmation:** Awaiting formal engagement and written certification from MECT's Chartered Accountant regarding assessment year renewal. Until confirmed, statutory tax deductions remain disabled and clearly qualified on the donation portal.
2. **Cashfree Production Credentials:** Production deployment requires updating `app.payment.cashfree.app-id` and `secret-key` in the secure production environment vault. Sandbox testing is verified and passing.
3. **Form 113 Statutory Filing:** For upcoming fiscal year reporting under Income-tax Act, 2025, MECT's tax advisors will handle electronic filing of Form 113 on the ITD portal; Form 114 will be issued to donors subsequent to that submission.

---

### Phase 21.5.9 Sign-off
**Status:** FULLY CLOSED & VERIFIED.  
**Strict Phase Boundary:** Phase 21.5.9 is concluded. Phase 21.5.10 has NOT been started. Execution has stopped in compliance with project instructions.
