# MAHAVIR TRUST — Volunteer Section: UX/UI Design Specification

**Document Reference**: `VOLUNTEER_UX_UI_DESIGN_SPECIFICATION.md`  
**Classification**: Design System & Interaction Blueprint  
**Author**: Senior Product Designer & UX/UI Research Specialist  
**Date**: November 2, 2026  
**Status**: APPROVED DESIGN BLUEPRINT  

---

## 1. Design System Foundation & Visual Hierarchy

The redesign of the Volunteer section adheres strictly to the MAHAVIR TRUST institutional design tokens established in Phase 2:

```
Canvas Base:        Warm Ivory    #FDFBF7 (90% light background for long-form reading)
Primary Contrast:   Forest Green  #072617 (Deep, authoritative header & card surfaces)
Secondary Accent:   Forest Light  #0B3B24 / #165B38 (Active states, secondary badges)
Precious Accent:    Warm Gold     #C5A059 (Borders, subtle icons, status badges)
High Contrast Gold: Deep Gold     #7A5E24 (Text on light backgrounds for AAA contrast)
Muted Background:   Ivory Warm    #F4EFE6 (Form containers, secondary card wells)
Neutral Text:       Slate Dark    #1C2421 & #4A5568 (Body copy, captions)
```

### Typographic Rhythm
- **Display Headings**: `font-serif` (Georgia / Cambria) with subtle negative letter spacing (`-0.015em`), evoking classic academic press dignity.
- **Data, Forms & Tables**: `font-sans` (Inter / system-ui), high legibility, generous line height (`leading-relaxed`), clean tabular alignment.

---

## 2. Page Information Architecture & Proposed Section Flow

The redesigned `/volunteer` page consists of **9 logically sequenced editorial sections**:

```
[ Section 1: Hero Banner & Institutional Breadcrumb Strip ]
                          ↓
[ Section 2: Foundational Philosophy & Purpose of Mentorship ]
                          ↓
[ Section 3: Four Pillars: Why Guide Scholars with MAHAVIR TRUST ]
                          ↓
[ Section 4: Comprehensive Role Catalogue Matrix (4 Tracks) ]
                          ↓
[ Section 5: The 4-Stage Vetting, Induction & Matching Pathway ]
                          ↓
[ Section 6: Safeguarding, Child Protection & Ethical Governance ]
                          ↓
[ Section 7: Geographic Scope: Odisha District Hub Priorities ]
                          ↓
[ Section 8: Interactive Volunteer Application Desk & Confirmation ]
                          ↓
[ Section 9: Frequently Asked Questions (FAQ Accordion) & Secretariat CTA ]
```

---

## 3. Detailed Section-by-Section Design Specification

### Section 1: Hero Banner & Institutional Breadcrumbs
- **Purpose**: Establish immediate institutional authority, clarify page mission, and provide hierarchical breadcrumb orientation.
- **Visual Composition**:
  - Deep Forest Green (`#072617`) background with subtle gold radial glow (`rgba(197, 160, 89, 0.08)`).
  - Top breadcrumb pill: `Home / Get Involved / Volunteer & Mentorship Network`.
  - Gold badge: `Institutional Mentorship Network`.
  - Heading (h1): *"Lend Your Academic Excellence and Professional Insight to Odisha’s Deserving Scholars."*
  - Subtitle: *"A structured, safe, and auditable network connecting educators, professionals, and community leaders with first-generation higher education students across 30 districts."*
  - Key trust metrics strip: `100% Non-Commercial | Verified Student Pairing | Flexible 2 hrs/month Commitment`.
- **Accessibility**: Single `<h1>`, breadcrumbs with `aria-label="Breadcrumb"`.
- **Interactions**: Subtle Motion fade-in (`initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}`).

---

### Section 2: Foundational Philosophy & Purpose of Mentorship
- **Purpose**: Address the psychological and social realities of first-generation learners from rural and marginalized backgrounds in Odisha.
- **Content**:
  - Highlights the *Guidance Deficit*: Talented students from Koraput, Mayurbhanj, or Kalahandi often lack exposure to mock interviews, career options beyond conventional government tests, and professional communication norms.
  - Explains the Trust’s approach: Pairing financial fee support with personalized guidance.
- **Visual Layout**: 2-column editorial spread. Left: Context narrative with a highlighted quote by an eminent educator. Right: High-contrast comparison box highlighting *"What We Provide"* vs *"What Volunteers Bring"*.
- **Mobile**: Stacks vertically with 100% width on screens under 768px.

---

### Section 3: Four Pillars — Why Volunteer with MAHAVIR TRUST
- **Purpose**: Differentiate MAHAVIR TRUST from unstructured volunteer drives by showcasing institutional integrity.
- **Pillars Grid (4 Cards)**:
  1. **Strictly Non-Commercial & Purely Charitable**: Zero fees collected from students; zero compensation demanded from volunteers.
  2. **Respect for Volunteer Time**: Predictable, scheduled sessions (typically 2 hours monthly) with pre-screened questions.
  3. **Verified Scholar Pairing**: Students are pre-vetted through the Trust’s Scrutiny Committee before mentorship begins.
  4. **Documented Academic Impact**: Periodic progress tracking ensuring both mentor and mentee see measurable growth.
- **Visual Layout**: 4-column card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`), Ivory Warm background, gold top borders.

---

### Section 4: Comprehensive Role Catalogue (The 4 Tracks)
- **Purpose**: Enable prospective volunteers to self-select the track best aligned with their skillset and availability.
- **The 4 Approved Tracks**:
  - **Track A: Academic & Entrance Exam Mentor**
    - *Focus*: Coursework clarification, GATE / OPSC / NET / IIT-JAM guidance, STEM / Humanities / Commerce subject depth.
    - *Prerequisite*: Post-Graduate degree, faculty experience, or competitive exam qualifier.
    - *Commitment*: 2 to 4 hours per month (Remote via Video/Phone).
    - *Target Disciplines*: B.Tech, B.Sc, B.Com, B.A, Diploma Engineering.
  - **Track B: Career & Industry Mentor**
    - *Focus*: Resume writing, interview preparation, soft skills, corporate transitions, IT & manufacturing career roadmaps.
    - *Prerequisite*: Minimum 3 years professional working experience in industry or government.
    - *Commitment*: 2 hours per month (Remote via Video/Phone).
    - *Target Beneficiaries*: Final-year undergraduate and technical diploma scholars.
  - **Track C: Project Samarth Community Hub Steward**
    - *Focus*: On-ground management of district study centers, reference library curation, digital terminal supervision, study discipline.
    - *Prerequisite*: Local district resident, graduate degree, reliable character reference.
    - *Commitment*: 4 to 8 hours per week (In-Person at District Learning Hubs).
    - *Target Locations*: Mayurbhanj, Koraput, Sundargarh, Balasore clusters.
  - **Track D: College & Faculty Liaison**
    - *Focus*: Coordinating bona fide student verification, fee structure validation with college bursars, identifying drop-out risks.
    - *Prerequisite*: Serving or retired faculty member / administrative staff at a recognized Odisha college.
    - *Commitment*: 1 to 2 hours per semester (Institutional).
- **Visual Layout**: 2x2 grid of rich cards with structured metadata tags (Commitment, Mode, Eligibility, Primary Focus), role badges, and *"Apply for this Role"* anchor buttons jumping to the form with pre-selected role.

---

### Section 5: The 4-Stage Vetting, Induction & Matching Pathway
- **Purpose**: Reassure candidates that MAHAVIR TRUST operates with rigorous governance and structured onboarding.
- **Process Steps**:
  1. **Stage 1: Profile Submission & Expression of Interest**: Complete online registration with academic/professional credentials.
  2. **Stage 2: Secretariat Review & Credential Verification**: Review by the Volunteer Coordinator and validation of qualifications.
  3. **Stage 3: Orientation & Safeguarding Induction**: 45-minute virtual induction on child protection, ethical boundaries, and Trust mission.
  4. **Stage 4: Scholar Allocation & Monitored Mentorship**: Formal assignment of 1–2 scholars based on discipline match, with bi-annual feedback check-ins.
- **Visual Layout**: Horizontal step connector on desktop with gold numeric badges (`01`, `02`, `03`, `04`); transforms into a vertical connected timeline on mobile (`< 768px`).

---

### Section 6: Safeguarding, Student Welfare & Code of Conduct
- **Purpose**: Institutional duty-of-care disclaimer safeguarding both scholars and mentors.
- **Key Disclosures**:
  - *Zero Tolerance for Exploitation*: Strict prohibition against soliciting financial favors, commercial tuition, or inappropriate personal communication.
  - *Official Communication Channels*: Interactions conducted via recorded trust links, institutional emails, or scheduled phone hours.
  - *Mandatory Background Check*: Trust reserves the right to verify professional antecedents.
  - *Confidentiality of Student Data*: Mentors pledge to protect student family economic records.
- **Visual Layout**: Deep amber/gold accented institutional notice card with shield iconography (`ShieldAlert` / `ShieldCheck`), prominent warning badge, and reference to Trust Bylaws.

---

### Section 7: Geographic Scope & District Priority Hubs
- **Purpose**: Highlight geographic areas of highest mentorship need, especially in Odisha's aspirational and tribal districts.
- **Content**:
  - Highlights *Zone 1 (Priority Rural)*: Koraput, Rayagada, Malkangiri, Nabarangpur, Mayurbhanj, Kalahandi.
  - Highlights *Zone 2 (Industrial & Urban)*: Khordha (Bhubaneswar), Cuttack, Sundargarh (Rourkela), Sambalpur.
  - Remote mentors from across India and the global Odia diaspora are warmly welcomed for virtual sessions.
- **Visual Layout**: 4 regional zone badges with district tags, establishing that geographic distance is no barrier for digital mentorship.

---

### Section 8: Interactive Volunteer Application Desk & Confirmation
- **Purpose**: Frictionless, accessible, high-integrity registration experience.
- **Visual Layout**:
  - Centered high-legibility card (`bg-[#FFFFFF]`, subtle border `border-[#072617]/15`, elevated shadow).
  - Form layout with 2-column responsive grid for inputs.
  - Clear label typography (`font-semibold text-xs text-[#072617]`).
  - Native select controls styled with institutional gold focus rings (`focus:ring-2 focus:ring-[#C5A059]`).
  - Multi-attribute packaging into existing `backgroundNotes` field.
  - Submit button with spinner loading state (`Loader2`) and lock icon.
  - **Inline Confirmation View**: Replaces form with a forest-green success banner displaying:
    - Official Green Checkmark
    - Reference ID Pill (`#REF-XXXX`)
    - SLA Notice: *"Our Volunteer Coordinator reviews submissions within 5 business days."*
    - Button: *"Register Another Volunteer"* or *"Explore Our Programmes"*.

---

### Section 9: Frequently Asked Questions (Accordion) & Secretariat Desk
- **Purpose**: Preemptively answer common concerns and provide a direct contact fallback.
- **FAQ Items**:
  1. *Can I mentor students if I live outside Odisha or abroad?* (Yes, virtual mentorship is conducted online via video/teleconference).
  2. *What is the typical time commitment expected from an academic mentor?* (2 to 4 hours per month).
  3. *Do volunteers receive a stipend or certificate of service?* (Strictly voluntary/unpaid; official certificate of appreciation issued upon completion of one academic year).
  4. *How are scholars selected and paired with mentors?* (Matching is based on subject discipline, language preference, and academic stage).
  5. *What if a student asks for financial assistance directly?* (Strictly prohibited; all financial grants are handled directly between the Trust and the college).
  6. *Can college students apply to be mentors?* (Final-year post-graduate scholars may mentor undergraduates; otherwise students can assist as Study Hub Stewards).
- **Component**: Reuses `@/components/Accordion` with accessible keyboard controls.
- **Secretariat Support Callout**: Direct phone and email links (`volunteers@mahavirtrust.org`) for institutional partnerships.

---

## 4. Mobile & Touch Screen Adaptations

| Element / Section | Desktop Behavior (≥ 1024px) | Mobile Behavior (< 768px) |
| :--- | :--- | :--- |
| **Hero Metrics Strip** | Inline horizontal row with vertical divider bars | Wrapped flex row or compact 2x2 grid |
| **Role Catalogue Cards** | 2-column or 4-column balanced grid | 1-column vertically stacked cards with full touch targets |
| **Onboarding Pathway** | Horizontal step diagram with connector lines | Vertical connected timeline with line running down the left |
| **Application Form** | 2-column field inputs (Name + Email, Phone + District) | Single-column linear form with 48px touch targets |
| **FAQ Accordions** | Full-width interactive panels | Full-width touch panels with expand/collapse indicators |
