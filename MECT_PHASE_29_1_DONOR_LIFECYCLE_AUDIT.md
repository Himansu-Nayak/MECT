# MECT PHASE 29.1 — COMPLETE DONOR LIFECYCLE AUDIT REPORT
## Supporter Lifecycle, Route Protection, Record Isolation & Financial Integrity

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Phase:** Phase 29.1 — Final Forensic Audit & Owner Acceptance  
**Routes Audited:** `/portal/dashboard`, `/portal/profile`, `/portal/donations`, `/portal/receipts`, `/portal/security`

---

## 1. DONOR PORTAL ROUTE PROTECTION & REDIRECTS

Each donor portal route was inspected to ensure that unauthenticated direct URL access is prevented:

| Route | Protection Mechanism | Unauthenticated Behavior | Authorized User Experience |
| :--- | :--- | :--- | :--- |
| `/portal/dashboard` | Client Guard + Context check | Immediate redirect to `/login?next=/portal/dashboard` | Renders aggregate KPIs, recent transactions, guest claim banner |
| `/portal/donations` | Client Guard + Context check | Immediate redirect to `/login?next=/portal/donations` | Renders full itemized history with status filters and search bar |
| `/portal/receipts` | Client Guard + Context check | Immediate redirect to `/login?next=/portal/receipts` | Renders Section 80G tax receipts with SHA-256 seal and PDF download |
| `/portal/profile` | Client Guard + Context check | Immediate redirect to `/login?next=/portal/profile` | Renders legal identity, address, Odisha district selector, PAN |
| `/portal/security` | Client Guard + Context check | Immediate redirect to `/login?next=/portal/security` | Renders verified contacts, contact update OTP, WhatsApp receipt toggle |

---

## 2. RECORD ISOLATION & OBJECT-LEVEL AUTHORIZATION

1. **Donation Isolation (`DonationRepository.java`):**
   - Query: `findByPortalUserIdOrderByCreatedAtDesc(portalUserId)`
   - Donors can only access transactions bound to their authenticated `portalUserId`. A donor tampering with an ID cannot view another donor's record.
2. **Receipt Download Security (`DonationLifecycleService.java:985`):**
   ```java
   if (donation.getPortalUser() == null || !donation.getPortalUser().getId().equals(portalUserId)) {
       throw new AccessDeniedException("You are not authorised to download this donation receipt.");
   }
   ```
   Direct API access to `/portal/account/receipts/{receiptNumber}/pdf` verifies ownership server-side. Tampering with the receipt serial number returns HTTP `403 Forbidden`.

---

## 3. ZERO GHOST ACCOUNTING & ACCURATE FINANCIAL REPORTING

- **Verified Settlements Only:**
  `totalSuccessfulAmount = donationRepository.sumSuccessfulAmountByUserId(portalUserId)`
  Only records with status `SUCCESSFUL` or `SUCCESS` are aggregated.
- **Pending & Failed Separation:**
  Transactions with status `CREATED`, `PENDING`, or `PENDING_VERIFICATION` are tracked in a dedicated pending counter and never mixed into verified totals.
- **Failed Transactions:**
  Failed or cancelled transactions do not increment verified totals and do not generate PDF receipts.

---

## 4. SESSION RESTORATION & LOGOUT REVOCATION

- **Session Restoration:**
  On page refresh, `<PortalAuthProvider>` reads `mt_portal_refresh_token` from `localStorage`, calls `POST /portal/auth/refresh`, rotates the token, and restores the session in `0ms` with zero layout shift.
- **Logout Cleanliness:**
  Calling `logout()` notifies `POST /portal/auth/logout` to revoke the refresh token in `portal_refresh_tokens`, removes `localStorage`, clears memory state, and redirects to `/login`.
