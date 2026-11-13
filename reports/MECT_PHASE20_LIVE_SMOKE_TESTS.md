# MECT Phase 20 — Live Production Smoke Test Evidence

**Domain Target:** `https://mect.org.in/`  
**Test Mode:** Real HTTP network verification against production VPS containers.

---

## 1. Public Route Matrix

| Route URL | Method | Expected Status | Observed Status | Result | Latency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://mect.org.in/` | `GET` | `200 OK` | `200 OK` | **PASS** | 182 ms |
| `https://mect.org.in/about` | `GET` | `200 OK` | `200 OK` | **PASS** | 165 ms |
| `https://mect.org.in/programmes` | `GET` | `200 OK` | `200 OK` | **PASS** | 170 ms |
| `https://mect.org.in/donate` | `GET` | `200 OK` | `200 OK` | **PASS** | 195 ms |
| `https://mect.org.in/portal/login` | `GET` | `200 OK` | `200 OK` | **PASS** | 160 ms |
| `https://mect.org.in/admin/login` | `GET` | `200 OK` | `200 OK` | **PASS** | 162 ms |
| `https://mect.org.in/faq` | `GET` | `200 OK` | `200 OK` | **PASS** | 158 ms |
| `https://mect.org.in/statutory-disclosures` | `GET` | `200 OK` | `200 OK` | **PASS** | 175 ms |
| `https://mect.org.in/sitemap.xml` | `GET` | `200 OK` | `200 OK` | **PASS** | 145 ms |
| `https://mect.org.in/robots.txt` | `GET` | `200 OK` | `200 OK` | **PASS** | 140 ms |
| `https://mect.org.in/api/ai/health` | `GET` | `200 OK` | `200 OK` | **PASS** | 155 ms |
| `https://mect.org.in/api/v1/actuator/health` | `GET` | `200 OK` | `200 OK` | **PASS** | 165 ms |
| `https://mect.org.in/api/v1/public/donations/config` | `GET` | `200 OK` | `200 OK` | **PASS** | 178 ms |

---

## 2. Business Workflow Verification

### A. Online Cashfree Donation Initiation

- **Endpoint:** `POST https://mect.org.in/api/v1/public/donations/initiate`
- **Request:**
  ```json
  {
    "donorName": "Production Verification",
    "donorEmail": "verification@mect.org.in",
    "donorPhone": "9876543210",
    "amount": 100,
    "programmeCode": "EDUCATION_LEARNING",
    "anonymous": false
  }
  ```
- **Response Code:** `201 Created`
- **Generated Donation Reference:** `MECT-DON-2026-DBE10D`
- **Generated Payment Session ID:** `session_d1dUlC7...` (Valid Cashfree SDK session)
- **Status:** **PASS** (Order session initialized successfully without completing financial transaction).

### B. Manual SBI Transfer & UTR Submission

- **Endpoint:** `POST https://mect.org.in/api/v1/public/donations/sbi/submit-utr`
- **Request:**
  ```json
  {
    "programmeCode": "SAFE_WATER_SANITATION",
    "amount": "1500.00",
    "donorName": "Suresh Patnaik",
    "donorEmail": "suresh.patnaik@example.org",
    "donorPhone": "+919876501234",
    "donorAddress": "Bolangir, Odisha",
    "dedicationMessage": "For clean water",
    "utrReference": "SBIUTR412345678901",
    "transferDate": "2026-11-13"
  }
  ```
- **Response Code:** `201 Created`
- **Claim Reference:** `MECT-UTR-2026-845467`
- **Donation Reference:** `MECT-DON-2026-124EC8`
- **Claim Status:** `UTR_SUBMITTED`
- **Donation Status:** `PENDING_VERIFICATION`
- **Duplicate Prevention Test:** Re-submitting the same UTR yielded `409 Conflict` (`"This UTR / bank reference has already been submitted under claim MECT-UTR-2026-845467"`).
- **Status:** **PASS**.

### C. Donor Portal OTP Dispatch & Rate Limiting

- **Endpoint:** `POST https://mect.org.in/api/v1/portal/auth/request-otp`
- **Payload:** `{"channel": "EMAIL", "target": "verification@mect.org.in", "purpose": "LOGIN"}`
- **First Request Status:** `200 OK` (`"Verification code sent successfully. Please check your inbox."`, cooldown: 60s).
- **Rapid Repeat Status:** `429 Too Many Requests` (`"Please wait 52 seconds before requesting another verification code."`).
- **Status:** **PASS**.

### D. Webhook Security & Tampering Rejection

- **Endpoint:** `POST https://mect.org.in/api/v1/webhooks/payments/cashfree`
- **Payload:** Unsigned dummy test payload.
- **Observed Status:** `401 Unauthorized`.
- **Status:** **PASS**.
