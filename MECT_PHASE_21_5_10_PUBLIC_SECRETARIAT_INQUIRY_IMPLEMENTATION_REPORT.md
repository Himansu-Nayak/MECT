# MECT PHASE 21.5.10 — PUBLIC SECRETARIAT INQUIRY & GUIDANCE DESK IMPLEMENTATION REPORT

**Project:** Mahaveer Educational & Charitable Trust (MECT)  
**Repository:** https://github.com/Himansu-Nayak/MECT  
**Active Branch:** `feat/phase-21-1-design-system`  
**Parent Phase:** 21.5 — Five-Section Homepage Editorial Architecture  
**Current Phase:** 21.5.10 — Public Secretariat Inquiry & Guidance Desk  
**Primary Routes:** `/contact`, `/admin/inquiries`  
**Execution Timestamp:** 2026-11-17  
**Status:** COMPLETE & VERIFIED

---

## 1. EXECUTIVE SUMMARY & CORE TRANSFORMATION

Phase 21.5.10 transforms MECT's public contact portal from an unverified "Secretariat Desk & Grievance Redressal" claiming fictional statutory ombudsman adjudication and unrealistic 24–48 hour turnaround SLAs into an authentic, institutionally grounded **Public Secretariat Inquiry & Guidance Desk**.

### Key Architectural Transformations:
1. **Truthful Institutional Governance:** Eliminated fabricated "Three-Tier Grievance Redressal / Ombudsman" tribunal claims and replaced them with an authentic **Institutional Inquiry Handling Framework** reflecting actual Trust operations (Intake & Reference Assignment ➔ Internal Review & Departmental Routing ➔ Direct Trust Follow-Up).
2. **Channel Guidance & Deflection of Generic Forms:** Introduced 4 dedicated institutional desks (Higher Education Scholarships & Grants, Donations & CSR Collaboration, Field Programmes & Community Activity, and Statutory Administration) to guide citizens and partners to the exact contact point before submitting a generic form.
3. **Verified Physical & Communication Details:** Grounded contact details in verified documentation:
   - **Registered Trust Office (Balangir):** Near Sai Mandir, Rugudipara, Balangir - 767001, Odisha (Sub-Registrar Balangir Doc No. 40311302194). Phone: `+91 94371 23616`. Mon–Sat, 10:00–17:30 IST.
   - **Liaison Secretariat (Bhubaneswar):** A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar - 751014, Odisha. Mon–Fri, 10:00–17:00 IST.
   - **Official Emails:** `scholarships@mect.org.in`, `donations@mect.org.in`, `contact@mect.org.in`.
4. **End-to-End Inquiry Lifecycle & Persistence:** Connected the frontend form to the Spring Boot REST API (`POST /public/inquiries`), generating timestamped official tracking reference IDs (`#referenceId`) with duplicate submission protection (180s debounce) and XSS sanitization.
5. **Administrative Inquiries Dashboard & RBAC:** Upgraded `/admin/inquiries` with status transition controls (`PENDING_REVIEW`, `UNDER_REVIEW`, `RESPONDED`, `ARCHIVED`) powered by a secured `PATCH /admin/inquiries/{id}/status` endpoint.
6. **Zero-Tolerance Anti-Fraud Safeguard:** Prominently published statutory fraud warnings affirming that MECT charges zero application or processing fees and engages no middlemen, brokers, or touts.
7. **Complete Quality Verification:** Passed 13/13 backend integration tests, 0 TypeScript errors, 0 ESLint errors, 10/10 Playwright responsive viewports with 0px horizontal overflow, and strict preservation of the homepage's 5-section architecture.

---

## 2. GIT PREFLIGHT & WORKING TREE PRESERVATION

- **Active Branch:** `feat/phase-21-1-design-system`
- **Integrity Rule Adherence:** No destructive Git operations (`git reset --hard`, `git clean -fd`, `git checkout .`, `git restore .`) were executed.
- **Preserved Existing Features:**
  - Cashfree, Razorpay, and HIM payment gateways and webhook ingestion.
  - Donation receipt PDF generation, verification hashing, and email outbox dispatch.
  - Volunteer registration registry and lifecycle transitions.
  - Higher education scholarship application intake and document models.
  - Homepage 5-section editorial architecture (`#hero`, `#institutional-intro`, `#development-pillars`, `#stories`, `#institutional-impact`).

---

## 3. ARCHITECTURE & FUNCTIONAL OVERVIEW

The Public Secretariat Inquiry & Guidance Desk connects public stakeholders with Trust administrators through clear structural components:

```
[Public Visitor]
       │
       ├── Direct Desk Guidance ────> [scholarships@mect.org.in / donations@mect.org.in / helpline]
       ├── Physical Office Visit ───> [Balangir HQ / Bhubaneswar Liaison Desk]
       │
       └── Public Inquiry Form (8 Standardized Categories)
                  │
                  ▼
         [Next.js Frontend]
                  │ (POST /public/inquiries)
                  ▼
         [Spring Boot Backend]
                  ├── Input Validation (@NotBlank, @Email, @Size)
                  ├── XSS Sanitization (HTML tag removal)
                  ├── Duplicate Defense (180s identical message debounce)
                  └── Persistence (public_inquiries table, status: PENDING_REVIEW)
                  │
                  ▼
         [Official Reference ID Issued] ───> [Displayed on Screen (#refId)]
                  │
                  ▼
         [Admin Dashboard: /admin/inquiries]
                  ├── RBAC Secured (SUPER_ADMIN, ADMIN, APPLICATION_REVIEWER)
                  └── Status Lifecycle Update (PATCH /admin/inquiries/{id}/status)
```

---

## 4. DIRECT INSTITUTIONAL GUIDANCE & CHANNEL ROUTING

To prevent misrouted communications and administrative delays, the portal guides users to 4 direct functional channels before form submission:

| Functional Desk | Primary Contact | Core Scope | Status / Operational Standard |
| :--- | :--- | :--- | :--- |
| **Student Support Desk** | `scholarships@mect.org.in` | Direct scholarship grants, college fee assistance, eligibility criteria, student documentation. | Application windows announced periodically per Trust schedule. |
| **Donations & CSR Desk** | `donations@mect.org.in` | Statutory 80G receipts, NEFT/RTGS bank transfers, CSR Schedule VII agreements. | MCA CSR Reg: `CSR00081063` (ROC Delhi). Direct SBI details on `/donate`. |
| **Community Initiatives** | Helpline: `+91 94371 23616` | Remedial learning study centers in rural Balangir, tailoring cohorts, summer Jal Seva kiosks. | Operating Hours: Mon–Sat, 10:00–17:30 IST. |
| **Secretariat & Records** | `contact@mect.org.in` | Registered Trust Deed verification, PAN credentials, official inspections, governance inquiries. | Balangir Sub-Registrar Doc No. 40311302194. |

---

## 5. VERIFIED PHYSICAL OFFICES & LIAISON DIRECTORY

Physical offices and liaison points display certified coordinates:

### 1. Balangir Trust Office (Registered Office & Operations Headquarters)
- **Address:** Near Sai Mandir, Rugudipara, Balangir, Odisha - 767001, India
- **Phone:** `+91 94371 23616`
- **Hours:** Monday – Saturday: 10:00 AM – 5:30 PM IST
- **Deed Jurisdiction:** Sub-Registrar Balangir (Doc No. 40311302194)
- **Coverage:** Rural study centers, women's tailoring cohorts, and emergency relief distribution across Balangir district.

### 2. Bhubaneswar Secretariat (Corporate & Liaison Office)
- **Address:** A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar, Odisha - 751014, India
- **Phone:** `+91 94371 23616`
- **Hours:** Monday – Friday: 10:00 AM – 5:00 PM IST
- **Purpose:** Corporate CSR partnerships, higher education institution liaisons, and government department coordination.
- **Protocol:** In-person meetings scheduled by prior appointment.

---

## 6. INQUIRY CATEGORIZATION & STANDARDIZED TAXONOMY

The inquiry form features 8 standardized categories aligned with backend validation:

1. `General Institutional Inquiry`
2. `Education & Learning Programmes`
3. `Scholarship Guidance & Applications`
4. `Donations & Receipts Assistance`
5. `Volunteer & Community Participation`
6. `CSR & Institutional Partnerships`
7. `Governance & Statutory Disclosures`
8. `Feedback & General Concerns`

All category strings fit within the 50-character schema limit (`category VARCHAR(50) NOT NULL`).

---

## 7. FORM VALIDATION, DATA PROTECTION & PRIVACY GUARANTEES

### Form Fields & Client-Side Validation:
- **Full Legal Name (`inquiry-name`):** Required text field (max 150 chars).
- **Email Address (`inquiry-email`):** Required HTML5 email format validation (max 255 chars).
- **Contact Mobile Number (`inquiry-phone`):** Required tel input for direct telephone follow-up (max 30 chars).
- **Category (`inquiry-category`):** Required select menu with the 8 standardized options.
- **Message Content (`inquiry-message`):** Required textarea (max 2000 chars) with live character counter.
- **Privacy Declaration Checkbox (`inquiry-consent`):** Explicit user acknowledgment that inquiry data is collected under data minimization principles solely for institutional correspondence.

### Privacy Safeguards:
- No tracking pixels or advertising telemetry.
- No third-party data sharing or monetization.
- Statutory privacy guarantee badge displayed beneath the submission form.

---

## 8. CENTRAL REGISTRY PERSISTENCE & REFERENCE ID ASSIGNMENT

Submissions are persisted to the PostgreSQL `public_inquiries` table:

```sql
CREATE TABLE IF NOT EXISTS public_inquiries (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Upon successful submission, the API returns:
```json
{
  "status": "SUCCESS",
  "referenceId": 104,
  "message": "Your inquiry has been successfully received by the MAHAVIR TRUST Secretariat.",
  "timestamp": "2026-11-17T06:00:00Z"
}
```

The frontend displays a prominent success card highlighting the official reference number (`#referenceId`) along with a transparent outline of "What Happens Next".

---

## 9. DUPLICATE SUBMISSION DEFENSE & RATE-LIMITING ARCHITECTURE

To protect the Secretariat registry against accidental duplicate submissions or spam:
- `PublicInquiryService` queries the latest submission by the normalized lowercase email (`cleanEmail`).
- If an identical message is received from the same email within **180 seconds (3 minutes)**, the service returns the existing reference ID without creating a duplicate database record:
  ```java
  if (match && normalizedSeconds < 180) {
      log.warn("Duplicate inquiry submission detected for email: {}. Returning existing ref.", cleanEmail);
      return new SubmissionResponse("SUCCESS", latest.getId(), "Your inquiry has already been received and logged under reference #" + latest.getId() + ".", latest.getCreatedAt());
  }
  ```
- Verified by automated backend test `testDuplicateSubmissionDefense`.

---

## 10. XSS SANITIZATION & SECURITY POSTURE

- All inbound messages, names, and phone numbers are stripped of malicious script elements:
  ```java
  private String sanitizeInput(String input) {
      if (input == null) return null;
      return input.replaceAll("(?i)<script.*?>.*?</script>", "")
                  .replaceAll("<[^>]*>", "");
  }
  ```
- Submitting `<script>document.cookie='hacked';</script><b>Inquiry regarding</b> study centers.` cleanly sanitizes both `<script>` and `<b>` tags in the stored message.
- Verified by automated backend test `testXssSanitization`.

---

## 11. ADMINISTRATIVE OVERSIGHT & ROLE-BASED ACCESS CONTROL

### API Endpoints:
1. `GET /api/v1/admin/inquiries`
   - **Protection:** `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER')")`
   - Unauthenticated calls return `401 Unauthorized`.
   - Unauthorized roles (e.g. `ROLE_VOLUNTEER_COORDINATOR`) return `403 Forbidden`.
   - Returns full list of inquiries including `id`, `fullName`, `email`, `phone`, `category`, `message`, `status`, `createdAt`.
2. `PATCH /api/v1/admin/inquiries/{id}/status`
   - **Protection:** `@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER')")`
   - Allows updating the lifecycle status (`PENDING_REVIEW`, `UNDER_REVIEW`, `RESPONDED`, `ARCHIVED`).
   - Audit logging tracks which administrative user performed the update.

### Frontend Dashboard (`/admin/inquiries`):
- Filterable search bar by sender name, email, category, or message text.
- Formatted received timestamp (Indian Standard Time).
- Visual status badges with color coding (Forest for `PENDING_REVIEW`, Warning Sand for `UNDER_REVIEW`, Green Sage for `RESPONDED`, Neutral for `ARCHIVED`).
- Interactive dropdown selector allowing immediate status transitions.

---

## 12. AUTHENTIC INQUIRY HANDLING FRAMEWORK VS MISLEADING CLAIMS

| Dimension | Previous Misleading Representation | Rectified Authentic Architecture (Phase 21.5.10) |
| :--- | :--- | :--- |
| **Desk Name** | "Secretariat Desk & Grievance Redressal" | **"Public Secretariat Inquiry & Guidance Desk"** |
| **Ombudsman Claims** | Fictional "Tier 2: Fiduciary Ombudsman Committee" | Replaced with internal **Secretariat & Functional Routing** |
| **Arbitrary SLAs** | Promised rigid "48h ack; written resolution in 7 working days" | Replaced with realistic institutional intake and review standards |
| **Handling Framework** | Fabricated 3-tier appellate court architecture | **3 Transparent Operational Stages:** Central Intake ➔ Functional Review ➔ Direct Follow-Up |
| **Direct Desks** | Generic email links without context | 4 specialized functional desks with specific email, telephone, and schedule details |

---

## 13. ANTI-FRAUD & DIRECT ACCESS SAFEGUARDS

The portal features an anti-fraud warning banner:
> **Zero-Tolerance Notice: No Intermediaries or Processing Fees**  
> Mahaveer Educational & Charitable Trust (MECT) charges **zero fees** at any stage of inquiry, scholarship application, or volunteer registration. We never employ third-party touts or commission brokers. If any individual or entity solicits money claiming to expedite your scholarship or request, report it immediately to `contact@mect.org.in` or our helpline `+91 94371 23616`.

---

## 14. PRESERVATION OF 5-SECTION HOMEPAGE ARCHITECTURE

The 5-section homepage architecture was tested and verified:
1. `#hero` (`<section aria-label="Institutional Introduction">`) — PRESENT
2. `#institutional-intro` (`<section>`) — PRESENT
3. `#development-pillars` (`<section>`) — PRESENT
4. `#stories` (`<section>`) — PRESENT
5. `#institutional-impact` (`<section>`) — PRESENT

- **Homepage Horizontal Overflow:** 0px
- **Homepage Console Errors:** 0

---

## 15. BACKEND INTEGRATION TEST RESULTS

**Test Suite:** `org.mahavirtrust.backend.PublicInquiryPhase21_5_10Tests`  
**Execution Command:** `mvn test -Dtest=PublicInquiryPhase21_5_10Tests`  
**Outcome:** 13/13 Passed (100%), 0 Failures, 0 Errors, 0 Skipped.

| Test # | Test Case Description | Result |
| :---: | :--- | :---: |
| 1 | Valid inquiry submission persists to database with `PENDING_REVIEW` and returns reference ID | **PASS** |
| 2 | Duplicate submission defense: identical submission within 180s returns existing reference ID | **PASS** |
| 3 | Rejection of blank full name (`400 Bad Request`) | **PASS** |
| 4 | Rejection of invalid email format (`400 Bad Request`) | **PASS** |
| 5 | Rejection of blank phone number (`400 Bad Request`) | **PASS** |
| 6 | Rejection of blank category (`400 Bad Request`) | **PASS** |
| 7 | Rejection of blank message content (`400 Bad Request`) | **PASS** |
| 8 | Rejection of message exceeding 5000 characters (`400 Bad Request`) | **PASS** |
| 9 | XSS sanitization: HTML and `<script>` tags removed from stored message | **PASS** |
| 10 | Unauthenticated `GET /admin/inquiries` returns `401 Unauthorized` | **PASS** |
| 11 | Unauthorized role (e.g. `ROLE_VOLUNTEER_COORDINATOR`) returns `403 Forbidden` | **PASS** |
| 12 | Authorized admin (`ROLE_ADMIN`) retrieves all inquiries | **PASS** |
| 13 | Authorized admin updates inquiry status via `PATCH /admin/inquiries/{id}/status` | **PASS** |

---

## 16. PLAYWRIGHT RESPONSIVE QA MATRIX

**Test Suite:** `scripts/secretariat-inquiry-qa-phase21-5-10.mjs`  
**Browser Engine:** Microsoft Edge (Chromium Headless)  
**Total Viewports Tested:** 10  
**Results Summary:** 10 Passed, 0 Failed.

| Viewport Device | Resolution | Horizontal Overflow | Console Errors | Content Checks | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| iPhone SE 1st Gen | 320 x 640 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Android Small | 360 x 740 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| iPhone 12 / 13 / 14 | 390 x 844 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| iPhone 14 Pro Max | 430 x 932 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| iPad Portrait | 768 x 1024 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Desktop Small | 1024 x 768 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Laptop Display | 1280 x 800 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Standard Desktop | 1440 x 900 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Full HD Desktop | 1920 x 1080 | **0px** | **0** | Verified (All 17 checks) | **PASS** |
| Mobile Landscape | 844 x 390 | **0px** | **0** | Verified (All 17 checks) | **PASS** |

### Interactive Form Submission Test (1280px):
- **Form Submission Execution:** PASS
- **Reference ID `#104` Display:** PASS
- **"What Happens Next" Steps Display:** PASS
- **Form Reset ("Submit Another Communication"):** PASS

---

## 17. LOCAL SERVICE STATUS & VERIFICATION SUMMARY

Both the frontend and backend services are active locally:
- **Next.js Frontend:** Running on `http://localhost:3000` (serving `/contact`, `/`, `/admin/inquiries`).
- **Spring Boot Backend:** Running on `http://localhost:8080/api/v1` (Tomcat active, connected to PostgreSQL, `/actuator/health` reporting status `UP`).

---

## 18. CONCLUSION & SIGN-OFF

Phase 21.5.10 successfully delivers the **Public Secretariat Inquiry & Guidance Desk**, rectifying all previous governance discrepancies and fictional ombudsman redressal promises. The interface provides authentic institutional channels, structured departmental routing, robust validation and duplicate defense, auditable reference tracking, and an administrative review workflow.

Execution adheres to all strict rules: no commits, no pushes, no destructive Git actions, and strict preservation of the 5-section homepage architecture.
