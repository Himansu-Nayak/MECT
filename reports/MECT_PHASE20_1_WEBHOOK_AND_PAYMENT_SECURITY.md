# MECT PHASE 20.1 — WEBHOOK & PAYMENT GATEWAY SECURITY AUDIT

**Project:** MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)  
**Host:** Hostinger VPS `srv2000528` (`200.97.161.128`)  
**Gateway Integration:** Cashfree PG + SBI Direct UTR Verification Engine  
**Execution Timestamp:** 2026-11-13T09:20:00Z (UTC)  
**Status:** PASS — REJECTION OF FORGED PAYMENTS & TAMPERED SIGNATURES  

---

## 1. Webhook Signature Verification Architecture

Cashfree Payment Gateway webhooks sent to `/api/v1/public/donations/cashfree-webhook` are verified using HMAC-SHA256:
$$\text{Signature} = \text{HMAC-SHA256}(\text{raw\_payload} + \text{timestamp}, \text{client\_secret})$$

- Signature Header: `x-webhook-signature`
- Timestamp Header: `x-webhook-timestamp`
- Replay Attack Mitigation: Webhook timestamps older than 300 seconds are rejected.

---

## 2. Attack Simulation & Forensic Verification

### Test 1 — Forged Signature Attack
- **Attack Payload:**
  ```json
  {"data":{"order":{"order_id":"MECT-DON-TEST","order_amount":100.00},"payment":{"payment_status":"SUCCESS"}}}
  ```
- **Injected Headers:**
  - `x-webhook-signature: INVALID_FAKE_SIGNATURE`
  - `x-webhook-timestamp: 1731484800000`
- **Result:** Request was intercepted and immediately rejected.
- **Database Impact:** 0 records modified. Status of orders never updated.

### Test 2 — Duplicate UTR Injection Attack
- **Attack Payload:** Submitting the exact same SBI UTR number (`SBIUTR412345678901`) with a different donor name or amount.
- **Endpoint:** `/api/v1/public/donations/sbi/submit-utr`
- **Result:** Server rejected request with `HTTP 409 Conflict`.
- **Database Constraint:** Enforced at database engine level via `UNIQUE CONSTRAINT (utr_normalized)`. Prevents any duplicate credit or double claim.

---

## 3. Secret & Credential Containment Audit

- **Environment File:** `/opt/mect/.env.production`
  - File Permissions: `0600` (Read/Write root only)
  - Not checked into git repository (verified via `git status` and `.gitignore`).
- **Secret Distribution:** Environment variables injected into containers strictly at runtime via Docker Compose secrets/env blocks.
- **Log Sanitation:** Sensitive API credentials (`CASHFREE_CLIENT_SECRET`, `JWT_SECRET`, `POSTGRES_PASSWORD`) are omitted from all application and container logs.
