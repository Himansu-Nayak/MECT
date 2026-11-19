# MECT PHASE 28 — DONOR AUTHENTICATION & ACCESS CONTROL REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Branch:** `feat/phase-28-premium-donor-auth-experience`  
**Execution Date:** 19 November 2026  
**Status:** COMPLETE & PRODUCTION-READY (Strict Deployment Freeze Observed)

---

## 1. Executive Summary

In compliance with Phase 28 requirements, all unauthenticated contribution initiation has been eliminated. While browsing MECT charitable programmes remains open and accessible to the public, initiating a contribution session, launching a gateway checkout, or filing a manual State Bank of India UTR claim strictly requires donor authentication. 

Attempting to invoke donation initiation endpoints without a valid donor JWT token returns HTTP 401 Unauthorized with structured diagnostic payloads. Upon successful authentication, donor accounts are automatically bound to their contributions, ensuring complete accounting transparency, automated Section 80G tax receipt attribution, and immediate digital receipting in the donor dashboard.

---

## 2. Server-Side Access Control Enforcement

In `DonationController.java`, server-side checks verify the caller's authenticated identity (`portalUserId`) on all write and payment endpoints:

```java
@PostMapping("/initiate")
public ResponseEntity<?> initiateDonation(
        @AuthenticationPrincipal Long portalUserId,
        @Valid @RequestBody InitiateDonationRequest request,
        HttpServletRequest httpRequest
) {
    if (portalUserId == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "status", "AUTHENTICATION_REQUIRED",
                        "message", "Donor authentication is required to initiate a contribution. Please verify your mobile number via OTP."
                ));
    }
    // Proceed with validated authenticated contribution session...
}
```

### 2.1 Endpoint Permission Matrix

| Endpoint | Method | Authentication Required | Purpose |
|---|---|---|---|
| `/public/donations/config` | `GET` | **No** (Public) | Read gateway settings, bank account details, and statutory URNs |
| `/public/donations/programmes` | `GET` | **No** (Public) | Explore approved charitable programmes |
| `/public/donations/gateway-status` | `GET` | **No** (Public) | Check payment gateway health and active channels |
| `/public/donations/{ref}/status` | `GET` | **No** (Public) | Public status check via cryptographic reference |
| `/public/donations/initiate` | `POST` | **Yes (HTTP 401 if unauthenticated)** | Initiates Cashfree or Razorpay payment session |
| `/public/donations/verify-checkout` | `POST` | **Yes (HTTP 401 if unauthenticated)** | Verifies gateway payment session result |
| `/public/donations/sbi/submit-utr` | `POST` | **Yes (HTTP 401 if unauthenticated)** | Submits manual SBI bank transfer UTR claim |
| `/portal/me/donations/claim` | `POST` | **Yes (HTTP 401 if unauthenticated)** | Links historical guest donations matching verified contacts |
| `/portal/me/profile` | `PUT` | **Yes (HTTP 401 if unauthenticated)** | Updates donor legal name, district, address, and PAN |

---

## 3. Database Schema Migration (V16)

A dedicated Flyway migration `V16__donor_authentication_and_district_schema.sql` was authored, validated against PostgreSQL and H2 databases, and committed:

```sql
-- Flyway Migration V16: Donor Authentication & District Schema Enhancement
ALTER TABLE portal_user_profiles
    ADD COLUMN IF NOT EXISTS district VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_portal_user_profiles_district
    ON portal_user_profiles(district);

CREATE INDEX IF NOT EXISTS idx_donations_portal_user_confirmed
    ON donations(portal_user_id, status, confirmed_at);
```

### 3.1 Entity Model Synchronisation
- `PortalUserProfile.java`: Added `district` field with getter and setter.
- `UpdatePortalProfileRequest.java`: Extended record constructor to accept `district` with backwards-compatible fallbacks.
- `PortalAccountService.java`: Persists `district` and serializes it in the dashboard profile response.
- `portal-api.ts`: Extended `PortalUserProfileData` and `UpdatePortalProfilePayload` with `district?: string`.

---

## 4. Role Lifecycle & Privilege Escalation

MECT implements a strict role-based access control (RBAC) hierarchy:
1. **Unregistered User:** Public visitor. Can browse programmes and read public reports.
2. **`ROLE_GENERAL_USER`:** Granted automatically upon verifying mobile number via OTP. Can view portal profile and enter donor details.
3. **`ROLE_DONOR`:** Elevated automatically by `DonationLifecycleService` upon the **first successful confirmed contribution** (either Cashfree settlement or verified SBI UTR credit). Unlocks full tax certificate downloads and annual contribution statement generation.
4. **Administrative Boundaries:** Internal administrative roles (`ROLE_DONATION_VERIFICATION_OFFICER`, `ROLE_FINANCE_OFFICER`, `ROLE_AUDITOR`) are strictly separated and managed by `admin_users` table; portal donors can never access administrative review queues.

---

## 5. Security & Functional Verification

All 13 test scenarios in `DonorAuthenticationAndDonationSecurityPhase28Tests.java` passed:
- `test05_unauthenticatedDonationInitiationReturns401Unauthorized`: PASSED
- `test06_authenticatedDonationInitiationSucceedsAndAttachesUser`: PASSED
- `test07_unauthenticatedSbiUtrSubmissionReturns401Unauthorized`: PASSED
- `test08_authenticatedSbiUtrSubmissionSucceedsAndAttachesUser`: PASSED
- `test09_userCannotClaimOtherUsersDonations`: PASSED
- `test10_successfulDonationAutomaticallyPromotesUserToRoleDonor`: PASSED
- `test11_dashboardAccuratelyCalculatesTotalsExcludingFailedAndPending`: PASSED
- `test12_portalProfilePersistsDistrictSuccessfully`: PASSED
- `test13_tamperedJwtTokenReturns401Unauthorized`: PASSED
