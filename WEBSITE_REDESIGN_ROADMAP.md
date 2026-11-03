# MAHAVIR TRUST — Website Redesign & Platform Evolution Roadmap

**Document Reference**: `WEBSITE_REDESIGN_ROADMAP.md`  
**Author**: Principal Product Designer, Senior Frontend Architect & UX Researcher  
**Target Environment**: Isolated Security Worktree (`.worktrees/security-patch`)  
**Git Branch**: `security/nextjs-patch-upgrade`  
**Date**: November 2, 2026  
**Status**: Architecture Blueprint & Phased Execution Plan  

---

## 1. Vision & Strategic Objectives

The objective of the MAHAVIR TRUST platform transformation is to elevate the digital presence from a preliminary prototype into a prestigious, institution-grade philanthropic education portal. 

The architecture bridges two authoritative paradigms:
1. **Academic Rigour & Institutional Hierarchy** (inspired by premier educational institutions such as [RCM](https://rcm.ac.in/)): authoritative editorial typography, transparent governance matrices, distinct programme classifications, and an accessible inquiry desk.
2. **Empathy, Storytelling & Transparency** (inspired by leading philanthropic foundations such as [Smile Foundation India](https://www.smilefoundationindia.org/)): clear cause communication, student enablement storytelling, zero-cash direct disbursal policies, and verifiable fiduciary accountability.

---

## 2. Phased Transformation Roadmap

```
+---------------------------------------------------------------------------------------------------------+
| PHASE 2.1: Foundations & Prestige Homepage                                                 [IN PROGRESS]|
| - Institutional Design System Specification (Tokens, Primitives, Typography, Spacing, WCAG 2.2 AA)       |
| - Header & Navigation Redesign (Mega-menu, Accessible Drawer, Notification Ticker)                      |
| - Footer & Statutory Compliance Restructuring                                                           |
| - Complete Homepage Transformation (Prestige Hero, Eligibility Calculator, Scheme Explorer, Flowchart)  |
| - Verification: Unit/Integration Tests, Responsive Audit (360px - 1920px), Static Page Compilation       |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 2.2: Core Institutional & Programme Pages                                               [UPCOMING]|
| - About Us (`/about`): Interactive Heritage Timeline & Vision Values Matrix                             |
| - Governance (`/governance`): Fiduciary Charter, Trustee Committee Architecture, Whistleblower Policy    |
| - Scholarships (`/scholarships`): Scheme Comparison Matrix, Eligibility Rules Engine, Document Checklist |
| - Programmes (`/programmes`): Cluster Hubs (Project Samarth), Academic Mentorship, Hardship Relief       |
| - Impact (`/impact`): 30-District Odisha Heatmap, Student Journey Archetypes, Gross Enrollment Analytics |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 2.3: Interactive Public Engagement & Discovery                                          [UPCOMING]|
| - Volunteer Network (`/volunteer`): Mentor Commitment Calculator, Onboarding Stepper, Grouped Form      |
| - Contact Secretariat (`/contact`): Context-Adaptive Inquiry Desk, District Directory, Map Integration   |
| - FAQ Knowledgebase (`/faq`): Instant Client-Side Search, Category Filter Tabs, Feedback Loop           |
| - Statutory & Policy Pages (`/privacy`, `/terms`, `/accessibility`): Sticky Section TOC, DPDP Compliance |
| - New Public Pages Planning: Reports (`/reports`), News & Notices (`/notices`), Publications (`/docs`)   |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 2.4: Student Portal Experience Architecture                                             [ROADMAP] |
| - Student Identity Registration & Authentication (JWT + Refresh Token integration)                     |
| - Multi-Step Scholarship Application Engine (Academic, Family Means, College Details)                  |
| - Secure Encrypted Document Upload Desk (Marksheets, Income Certificates, College Admission Slips)      |
| - Real-Time Application Tracking Dashboard (`SUBMITTED -> SCRUTINY -> VERIFIED -> DISBURSED`)          |
| - Student Notification & Mentor Interaction Hub                                                         |
+---------------------------------------------------------------------------------------------------------+
                                                     |
                                                     v
+---------------------------------------------------------------------------------------------------------+
| PHASE 2.5: Institutional Administrative Platform                                              [ROADMAP] |
| - Administrative Console (`/admin/*`) wired to Phase 2 Spring Security RBAC Backend                     |
| - Trustee Governance Dashboard (`TRUSTEE` role): Read-only financial aggregates and compliance reports  |
| - Application Reviewer Workspace (`APPLICATION_REVIEWER` role): Scrutiny docket, document verification  |
| - Volunteer Coordination Console (`VOLUNTEER_COORDINATOR` role): Mentor vetting and scholar allocation  |
| - Financial Officer Workspace (`FINANCE_OFFICER` role): Direct college bank transfer ledger generation  |
| - Master Security & Audit Hub (`SUPER_ADMIN` role): User provisioning, security logs, lockout clearance  |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Student Experience Architecture Specification

### 3.1 Student User Journey Map

```
[1. Discover] ---------> [2. Check Eligibility] ----> [3. Register & Auth] ---> [4. Multi-Step Form]
Browse Schemes & Criteria    Interactive Quick Filter     JWT Student Account         Personal, Academic, Means
        |                                                                                      |
        v                                                                                      v
[8. Mentorship] <------- [7. Direct Disbursal] <----- [6. Scrutiny Updates] <-- [5. Document Vault]
1-on-1 Academic Guide      Direct Bank Transfer to       Real-Time Tracking & SMS     Upload PDF/JPG Proofs
                           Affiliated College Bursar      Status Alerts (Under Review) (Client & Server Checked)
```

### 3.2 Student Portal Modules

1. **Self-Service Eligibility Checker**:
   - Lightweight, zero-barrier client-side tool allowing candidates to input:
     - Home District (Odisha 30 districts)
     - Current Level (Higher Secondary +2, Undergraduate B.Sc/B.Com/B.A, Technical/Engineering, Postgraduate)
     - Previous Qualifying Exam Percentage
     - Annual Family Income Bracket
   - Instantly filters matching trust schemes (e.g., *Mahavir Shiksha Protsahan Yojana* vs. *Pratibha Fellowship*).

2. **Multi-Step Scholarship Application Engine**:
   - **Step 1: Student Demographics & Address Proof** (Full Name, Date of Birth, Gender, Domicile District, Category, Guardian Information).
   - **Step 2: Academic Record & College Enrollment** (School/College Name, Board/University Roll Number, Marks/GPA achieved, Target Course of Study).
   - **Step 3: Socio-Economic Need & Means Appraisal** (Family Occupation, Annual Income, Supporting Proof issuing authority).
   - **Step 4: College Institutional Disbursement Information** (College Principal / Accounts Office Bank IFSC, Account Number, Official Fee Demand Notice).
   - **Step 5: Document Upload Vault**:
     - Drag-and-drop file uploader with client-side preview.
     - Strict validation: PDF/JPG/PNG only, maximum 2 MB per document, magic number MIME verification.
     - Automatic SHA-256 integrity hash generation before transfer.
   - **Step 6: Summary & Sworn Declaration** (Declaration of honesty, zero duplicate government grant declaration, submission confirmation with generated `AppRef-2026-XXXX`).

3. **Application Tracking & Status Lifecycle**:
   - Status Timeline:
     - `SUBMITTED`: Logged in trust queue.
     - `UNDER_SCRUTINY`: Application Reviewer examining marksheets and revenue certificates.
     - `COLLEGE_VERIFICATION`: Secretariat confirming enrollment with the college administration.
     - `COMMITTEE_APPROVED`: Trustee board signed grant approval.
     - `DISBURSED`: NEFT/RTGS transaction executed directly to the college bursar account with UTR reference number published to student.
     - `REJECTED / ACTION_REQUIRED`: Clear reason provided with a 14-day window to upload missing or unreadable documents.

---

## 4. Administrative Experience Architecture Specification

The Administrative Portal (`/admin/*`) interfaces directly with the Spring Boot backend hardened in Phase 2, adhering strictly to the established **Role-Based Access Control (RBAC)** boundaries.

### 4.1 RBAC Functional Matrix

| Administrative Role | Primary Responsibility | Authorized Portal Modules |
| :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Institutional Chief System Administrator | User Management, Security Audit Logs, Global System Configuration, Account Unlock, Role Delegation. |
| **`TRUSTEE`** | Member of Board of Trustees | Executive Dashboard, Financial Summary, Statutory Compliance Reports, Approved Beneficiary Registry (Read-Only). |
| **`ADMIN`** | Operations Director & Office Secretariat | Application Docket Overview, Staff Task Allocation, Institutional Notices, Inquiries Management, Volunteer Review. |
| **`APPLICATION_REVIEWER`** | Academic Scrutiny Officer | Candidate Dossier Inspection, Document Verification, Scoring Matrix Entry, Approval/Rejection Recommendation. |
| **`FINANCE_OFFICER`** | Trust Bursar & Chartered Accountant | Fund Allocation Ledger, Bank Disbursement Batch File Generation, College Payment Receipts, Statutory 80G/12A Filing Data. |
| **`VOLUNTEER_COORDINATOR`** | Community & Outreach Lead | Volunteer Vetting, Mentor-to-Scholar Matching, Project Samarth Hub Coordination, Volunteer Attendance/Log. |

### 4.2 Administrative Console Views

1. **Trustee Executive Dashboard**:
   - High-level KPIs: Total Grants Disbursed to Date, Active Scholars by District, Gender Diversity Ratio, Fund Utilization Index, Statutory Audit Status.
   - Zero editable inputs on financial ledgers; strictly tamper-proof data visualizations.
2. **Reviewer Scrutiny Docket**:
   - Split-screen document verification: Candidate application data on left, verified document PDF viewer with zoom/rotate on right.
   - Objective scoring rubric: Academic merit points (40%), Economic hardship points (40%), First-generation college graduate weight (20%).
3. **Financial Transparency Ledger**:
   - Automated double-entry batch generator for bank NEFT uploads.
   - College ledger reconciliation: Matches college fee receipts with Trust disbursement bank UTRs.
4. **Audit & Compliance Console**:
   - Real-time stream of all user actions, logins, permission denials, and document exports from `audit_logs` table.

---

## 5. Non-Functional Performance & Accessibility Targets

- **Performance**:
  - Google Lighthouse Score target: **95+ across Performance, Accessibility, Best Practices, and SEO**.
  - Largest Contentful Paint (LCP) < 2.0s; First Input Delay (FID) / INP < 100ms; Cumulative Layout Shift (CLS) < 0.05.
- **Accessibility**:
  - Full **WCAG 2.2 Level AA** conformance.
  - 100% keyboard navigable (Skip to content, visible focus rings with `outline: 2px solid #C5A059`, logical TabIndex ordering).
  - Explicit contrast: All body text passes **4.5:1** ratio; headings and large text pass **3.0:1** ratio.
  - Respects `@media (prefers-reduced-motion: reduce)` by disabling all automated marquees and smoothing transitions.
- **Security & Integrity**:
  - Strict input sanitization against stored/reflected XSS.
  - Rate limiting (30 req/min/IP) on all intake forms.
  - Zero exposure of API keys, database credentials, or real trustee identities until formal Gazette publication.
