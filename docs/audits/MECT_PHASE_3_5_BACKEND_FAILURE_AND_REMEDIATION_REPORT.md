# MECT PHASE 3.5 — BACKEND FAILURE & REMEDIATION REPORT

**Organisation:** Mahaveer Educational & Charitable Trust (MECT / MAHAVIR TRUST)  
**Production Host:** Hostinger KVM 4 VPS (`200.97.161.128`)  
**Backend Container:** `mect-backend:production` (Port: `8081`)  
**Database:** PostgreSQL 18-Alpine (`mect_db` on internal 5432, exposed on 5433)  
**Audit Date:** 2026-11-28  
**Release Status:** GREEN / VERIFIED

---

## 1. Architectural Scope

This report documents the architectural corrections applied across the Java Spring Boot 4 backend (`backend/`) and its integration interfaces with the Next.js 16 frontend (`src/`).

### System Component Overview:
- **Donation Controller (`DonationController.java`):** Dual-mapped REST endpoints (`/public/donations/*` and `/api/v1/public/donations/*`) providing backward-compatible and modern API access.
- **Donation Lifecycle Service (`DonationLifecycleService.java`):** Transactional state machine coordinating donation initialization, order session token generation, manual UTR remittance claims, and ledger updates.
- **Receipt PDF Generator (`ReceiptPdfService.java`):** PDFBox-based rendering engine producing statutory ISO A4 80G contribution receipts with QR verification hashes.
- **Outbox Email Service (`TransactionalOutboxService.java`):** Reliable asynchronous email dispatch framework using Resend API with guaranteed delivery and retry policies.

---

## 2. Technical Remediation Breakdown

### 2.1 Resilient Programme Code Resolution
The donation form UI offers options such as General Fund, Education, Water, Women's Empowerment, and Food Relief. Historical versions submitted abbreviations such as `GENERAL` or `EDUCATION`. To ensure zero checkout friction:
```java
public ProgrammeEntity resolveActiveProgramme(String requestedCode) {
    if (requestedCode == null || requestedCode.isBlank()) {
        return programmeRepository.findByCodeAndActiveTrue("GENERAL_FUND")
                .orElseThrow(() -> new BusinessException("Default programme not found"));
    }
    String normalized = requestedCode.trim().toUpperCase();
    String canonical = switch (normalized) {
        case "GENERAL", "GENERAL_FUND", "CORE" -> "GENERAL_FUND";
        case "EDUCATION", "EDUCATION_LEARNING", "SCHOLARSHIP" -> "EDUCATION_LEARNING";
        case "WATER", "SAFE_WATER_SANITATION", "JAL_SEVA" -> "SAFE_WATER_SANITATION";
        case "WOMEN", "WOMEN_EMPOWERMENT", "SWAVALAMBAN" -> "WOMEN_EMPOWERMENT";
        case "FOOD", "FOOD_SECURITY_RELIEF", "JAN_AHAR" -> "FOOD_SECURITY_RELIEF";
        case "HANUMAN", "HANUMAN_MURTI" -> "HANUMAN_MURTI";
        default -> normalized;
    };
    return programmeRepository.findByCodeAndActiveTrue(canonical)
            .orElseThrow(() -> new BusinessException("Unknown or inactive programme code: " + requestedCode));
}
```

### 2.2 Optional Guest Authentication
Under Clause XVI of the foundational trust deed, voluntary public donations must not be hindered by unnecessary account creation walls. While registered donor accounts are supported via phone/email OTP, voluntary donors can complete online and manual contributions without prior authentication. The backend extracts `portalUserId` if an authenticated session exists; otherwise, it assigns `null` and records the contribution with guest provenance.

### 2.3 Timezone-Aware Remittance Validation
Manual bank and UPI transfers are often claimed within hours of payment. UTC-based servers in cloud hosting previously rejected claims submitted by Indian donors during morning hours due to the +5:30 IST offset. The validator now compares transfer dates strictly against Indian Standard Time:
```java
LocalDate todayIst = LocalDate.now(ZoneId.of("Asia/Kolkata"));
if (request.transferDate().isAfter(todayIst)) {
    throw new ValidationException("Transfer date cannot be in the future.");
}
```

### 2.4 Official Institutional Coordinates
All rendered templates, footers, receipts, and email wrappers were updated to canonical coordinates:
- **Registered Secretariat:** `A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014, India`
- **Primary Email:** `mectbbsr13@gmail.com`
- **Official Bank:** State Bank of India, SME Branch Balangir, Current A/C `33804825925`, IFSC `SBIN0061327`

---

## 3. Verification Sign-Off

All remediations were validated through unit tests, integration tests with MockMvc and embedded H2 database, and verified against the live Hostinger production instance.
