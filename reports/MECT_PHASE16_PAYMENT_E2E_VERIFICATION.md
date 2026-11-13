# MECT Phase 16.8 — Staging Payment E2E Verification

**Target:** `http://127.0.0.1:8082/api/v1` (`mect-backend-staging.service`, `PAYMENT_PROVIDER=CASHFREE`, `CASHFREE_ENV=SANDBOX`)  
**Note:** Live Cashfree Sandbox outbound order-creation API calls were not executed because staging used synthetic placeholder `CASHFREE_APP_ID=STAGING_SANDBOX_APP`. All Cashfree webhook signature, idempotency, state-transition, amount-mismatch, and receipt-issuance paths were verified end-to-end against real PostgreSQL (`mect_staging_db`) using HMAC-SHA256 signed payloads.

## 1. Cashfree Webhook & Lifecycle Verification

| Scenario | Observed Result | Status |
| :--- | :--- | :--- |
| Invalid `x-webhook-signature` | HTTP `401 Unauthorized` | **PASS** |
| Valid HMAC for unknown `order_id` (`STAG_NONEXISTENT_ORD`) | HTTP `404 Not Found` (`Matching payment order not found`) | **PASS** |
| `PAYMENT_SUCCESS_WEBHOOK` (`CF_STAG_ORD_...S`, ₹1,000.00) | HTTP `200` (`{"processed": true, "status": "SUCCESS"}`), donation `MECT-DON-STAG-1794485319S` -> `SUCCESSFUL`, receipt `MECT-REC-2026-84CFEE` issued | **PASS** |
| Duplicate `PAYMENT_SUCCESS_WEBHOOK` replay | HTTP `200` (`{"duplicate": true, "processed": false}`), no duplicate receipt | **PASS** |
| `PAYMENT_FAILED_WEBHOOK` | HTTP `200` (`{"processed": true, "status": "FAILED"}`), donation status `FAILED` | **PASS** |
| `PAYMENT_USER_DROPPED_WEBHOOK` | HTTP `200` (`{"processed": true, "status": "USER_DROPPED"}`), donation status `USER_DROPPED` | **PASS** |
| Amount mismatch (`₹999.0` webhook vs `₹1,000.00` order) | HTTP `400 Bad Request` (`Webhook payment amount mismatch`) | **PASS** |

## 2. SBI Direct Transfer & Manual UTR Verification

| Scenario | Observed Result | Status |
| :--- | :--- | :--- |
| Submit test UTR (`POST /public/donations/sbi/submit-utr`, ₹1,500) | HTTP `201` (`claimReference=MECT-UTR-2026-2652E5`, `status=UTR_SUBMITTED`), no premature receipt | **PASS** |
| Duplicate UTR submission (`409 Conflict`) | HTTP `409 Conflict` | **PASS** |
| DVO Verify & Approve (`ROLE_DONATION_VERIFICATION_OFFICER`) | HTTP `200` (`status=VERIFIED`, receipt `MECT-REC-2026-F3BA12` issued) | **PASS** |
| DVO Reject second claim | HTTP `200` (`status=REJECTED`), no receipt issued | **PASS** |

## 3. Admin Payment Config Reflection

- `ROLE_SUPER_ADMIN` updated `minAmount` to `250` via `PUT /admin/payment-config` (`200`) -> `GET /public/donations/config` immediately reflected `minAmount: 250.0` (restored to `100` afterwards).

