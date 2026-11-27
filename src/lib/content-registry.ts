/**
 * MAHAVEER EDUCATIONAL & CHARITABLE TRUST (MECT)
 * Master Content Truth Registry — Phase B
 * 
 * Centralized, legally verified source of truth for all institutional facts,
 * registrations, governance records, operational programmes, and fiduciary standards.
 * 
 * Primary Document Reference: MECT Proposal & Institutional Records (71-Page Official Dossier),
 * Registered Trust Deed (Balangir Sub-Registrar, 2013), MCA CSR-1 Letter (ROC-Delhi, 2024),
 * and CBDT Form 10AC Orders (12A & 80G, 2024).
 * 
 * NON-NEGOTIABLE RULE: Proposed projects must NEVER be published as completed works.
 * Beneficiary figures and financial metrics must have documented sources.
 */

export interface StatutoryCredential {
  category: string;
  title: string;
  authority: string;
  registrationNumber: string;
  orderNumberOrDin?: string;
  dateOfIssue: string;
  validityPeriod: string;
  legalBasis: string;
  verificationSource: string;
  isVerified: boolean;
}

export interface ProgrammeRecord {
  id: string;
  name: string;
  focusArea: string;
  geographicLocation: string;
  targetBeneficiaries: string;
  verifiedOutputs: string;
  implementationModel: string;
  status: "active_operational" | "historical" | "proposed_pipeline";
  documentSource: string;
}

export interface TrusteeRecord {
  name: string;
  role: string;
  designation: string;
  serviceTerms: string;
  deedClause: string;
}

export const MECT_CONTENT_REGISTRY = {
  // 1. Official Institutional Identity
  identity: {
    officialRegisteredName: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
    publicDisplayName: "Mahaveer Educational & Charitable Trust",
    abbreviation: "MECT",
    legalForm: "Irrevocable Public Charitable Trust",
    governingAct: "Registered Public Trust Deed (Applicability of Indian Trusts Act, 1882 subject to legal confirmation)",
    foundingYear: "2013",
    deedExecutionDate: "27th July 2013",
    deedRegistrationDate: "30th July 2013",
    registrationPlace: "District Sub-Registrar, Balangir, Government of Odisha",
    deedDocumentReference: "Book No. 4, Volume No. 45, Document Deed No. 40311302194",
    tagline: "Empowering Futures Through Education, Rural Skilling & Fiduciary Philanthropy",
    motto: "Knowledge, Compassion & Self-Reliance Across Odisha",
  },

  // 2. Approved Brand Color System (Option A — Original Heritage Palette)
  brandPalette: {
    primaryForest: "#0B3B24",
    deepForest: "#072617",
    warmIvory: "#FDFBF7",
    templeGold: "#C5A059",
    champagneGold: "#E4C88A",
    contrastGold: "#7A5E24",
    charcoalBody: "#1C2421",
    slateMuted: "#4A5568",
  },

  // 3. Verified Statutory Registrations & Legal Credentials
  statutoryCredentials: [
    {
      category: "Foundational Constitution",
      title: "Registered Public Charitable Trust Deed",
      authority: "District Sub-Registrar, Balangir, Govt. of Odisha",
      registrationNumber: "Book No. 4, Volume No. 45, Document Deed No. 40311302194",
      dateOfIssue: "30-07-2013 (Executed 27-07-2013)",
      validityPeriod: "Permanent / In Perpetuity",
      legalBasis: "Registered Trust Deed under Indian Registration Act (Public Trust governance subject to applicable statutory trust norms)",
      verificationSource: "Scanned Deed Endorsement, Page 45 & 49 of Institutional Dossier",
      isVerified: true,
    },
    {
      category: "Direct Taxation • Permanent Account Number",
      title: "Permanent Account Number (PAN)",
      authority: "Income Tax Department, Government of India",
      registrationNumber: "AADTM5474F",
      dateOfIssue: "27-07-2013",
      validityPeriod: "Permanent",
      legalBasis: "Income Tax Act, 1961",
      verificationSource: "CBDT PAN Card & MCA CSR-1 Approval Letter",
      isVerified: true,
    },
    {
      category: "Corporate Social Responsibility (CSR)",
      title: "MCA Form CSR-1 Registration Approval",
      authority: "Office of the Registrar of Companies (ROC-Delhi), Ministry of Corporate Affairs",
      registrationNumber: "CSR00081063",
      orderNumberOrDin: "SRN: N14617237",
      dateOfIssue: "09-11-2024",
      validityPeriod: "Active",
      legalBasis: "Section 135 of the Companies Act, 2013 & Companies (CSR Policy) Rules",
      verificationSource: "Digitally signed MCA Approval Letter (Stream 58 / Page 58 of Dossier)",
      isVerified: true,
    },
    {
      category: "Tax Exemption • Trust Income",
      title: "Section 12A Registration Approval",
      authority: "Income Tax Department (Central Processing Centre)",
      registrationNumber: "AADTM5474FE20231",
      orderNumberOrDin: "DIN: AADTM5474FE2023101",
      dateOfIssue: "29-01-2024",
      validityPeriod: "AY 2024-25 to AY 2026-27",
      legalBasis: "Section 12A(1)(ac)(vi) of the Income Tax Act, 1961 (Form 10AC)",
      verificationSource: "CBDT Order Form 10AC",
      isVerified: true,
    },
    {
      category: "Tax Deduction • Donor 80G Benefit",
      title: "Section 80G Tax Exemption Approval",
      authority: "Income Tax Department (Central Processing Centre)",
      registrationNumber: "AADTM5474FF20241",
      orderNumberOrDin: "DIN: AADTM5474FF2024101",
      dateOfIssue: "29-01-2024",
      validityPeriod: "AY 2024-25 to AY 2026-27 (Historical Form 10AC order; current deduction status under Income-tax Act, 2025 subject to CA confirmation)",
      legalBasis: "Section 80G(5)(iv) of the Income Tax Act, 1961 (Form 10AC)",
      verificationSource: "CBDT Order Form 10AC",
      isVerified: true,
    },
    {
      category: "Voluntary Agency Portal",
      title: "NITI Aayog NGO Darpan Registration",
      authority: "NITI Aayog, Government of India",
      registrationNumber: "OR/2024/0466491",
      dateOfIssue: "2024",
      validityPeriod: "Active National Listing",
      legalBasis: "NITI Aayog National NGO Database",
      verificationSource: "NGO Darpan Certificate & Institutional Dossier Page 87",
      isVerified: true,
    },
    {
      category: "Social Welfare Portal",
      title: "MoSJE e-Anudaan Portal Listing",
      authority: "Ministry of Social Justice & Empowerment, Govt. of India",
      registrationNumber: "OR/00040466",
      dateOfIssue: "2024",
      validityPeriod: "Active",
      legalBasis: "Central Social Welfare Registry",
      verificationSource: "Ministry of Social Justice & Empowerment Portal Database",
      isVerified: true,
    },
  ] as StatutoryCredential[],

  // 4. Governance & Trustee Leadership (Clause XVI: Honorary Service)
  governance: {
    managingTrustee: {
      name: "Er. Japabandhu Kampa",
      role: "Settler Founder & Managing Trustee",
      profile: "Pioneered MECT in 2013 to provide structured educational grants and rural livelihood enablement across Odisha.",
      serviceTerms: "Honorary, non-salaried fiduciary service pursuant to Deed Clause XVI.",
    },
    foundingLifeTrustees: [
      { name: "Yudhisthir Rana", designation: "Founding Life Trustee", deedClause: "Deed Clause II" },
      { name: "Ramachandra Biswal", designation: "Founding Life Trustee", deedClause: "Deed Clause II" },
      { name: "Sambit Kumar Dang", designation: "Founding Life Trustee", deedClause: "Deed Clause II" },
    ],
    fiduciaryCode: {
      remunerationPolicy: "100% Honorary Service. Zero salary, sitting fee, commission, or commercial compensation is drawn by any Trustee from Trust endowments.",
      fundUtilization: "100% of public and CSR contributions are remitted directly to verified programmes and accredited educational institutions.",
    },
  },

  // 5. Categorized Programmes: Current Active vs. Historical vs. Proposed
  programmes: {
    // A. CURRENT OPERATIONAL PROGRAMMES (Grassroots Ongoing)
    activeOperational: [
      {
        id: "remedial-education",
        name: "Remedial Rural Education (Shiksha Setu)",
        focusArea: "High School Dropout Prevention & Academic Tutoring",
        geographicLocation: "Balangir & Puintala Blocks, Western Odisha",
        targetBeneficiaries: "Class 6–10 students from low-income agricultural families",
        verifiedOutputs: "350+ recorded student participation entries across village remedial coaching hubs (FY 2023–24 activity register; represents recurring study-session entries, not 350 unique students).",
        implementationModel: "Community learning centers staffed by local academic mentors; free study stationery and textbook banks.",
        status: "active_operational",
        documentSource: "Section 2.1 of MECT Charter & 2021-2024 Annual Activity Summaries",
      },
      {
        id: "women-tailoring",
        name: "Women's Vocational Tailoring School (Swavalamban)",
        focusArea: "Livelihood Skilling & Women Empowerment",
        geographicLocation: "Rugudipara & Chandrasekhar Nagar, Balangir",
        targetBeneficiaries: "Rural women, single mothers, and adolescent school dropouts",
        verifiedOutputs: "120+ cumulative vocational course enrolments across certified tailoring cohorts (FY 2021–23 cycles; course registrations, not necessarily 120 uniquely certified women).",
        implementationModel: "Dedicated workshop equipped with sewing machines; self-reliance training and micro-enterprise tooling.",
        status: "active_operational",
        documentSource: "Section 2.2 of MECT Charter & Vocational Center Audit Records",
      },
      {
        id: "jal-seva",
        name: "Jal Seva Heatwave Potable Drinking Water Relief",
        focusArea: "Emergency Civic Relief & Public Hydration",
        geographicLocation: "Bus terminals, railway stations, and district hospital perimeters across Balangir",
        targetBeneficiaries: "Commuters, daily wage laborers, rickshaw pullers, and patient attendants",
        verifiedOutputs: "10,000+ recorded water and relief service instances logged across summer relief cycles (servings delivered, not 10,000 unique citizens).",
        implementationModel: "Free, hygienic earthen pot water kiosks operated by volunteer teams from March to June.",
        status: "active_operational",
        documentSource: "Section 2.3 of MECT Charter & Ground Relief Logbooks",
      },
      {
        id: "jan-ahar",
        name: "Jan Ahar Hospital Patient Attendant Food Relief",
        focusArea: "Hunger Eradication & Destitute Nutrition",
        geographicLocation: "District Headquarters Hospital (DHH) Balangir",
        targetBeneficiaries: "Destitute patient attendants and daily wage earners facing medical hardship",
        verifiedOutputs: "Documented seasonal relief drives and hospital corridor meal distribution instances for destitute patient attendants.",
        implementationModel: "Hygienic community kitchen distribution points outside hospital wards.",
        status: "active_operational",
        documentSource: "Section 2.4 of MECT Charter",
      },
    ] as ProgrammeRecord[],

    // B. HISTORICAL CITIZEN RELIEF DRIVES (Completed 2013–2024)
    historicalActivities: [
      {
        id: "covid-relief",
        name: "COVID-19 Pandemic Emergency Ration Relief",
        focusArea: "Disaster Emergency Assistance",
        geographicLocation: "Western Odisha rural settlements",
        targetBeneficiaries: "Migrant returnees and daily-wage families during national lockdowns",
        verifiedOutputs: "Dry ration kits, sanitization packs, and emergency sustenance supplied during 2020-2021 lockdown phases.",
        implementationModel: "Door-to-door distribution in coordination with local administration.",
        status: "historical",
        documentSource: "MECT COVID Relief Field Summary (Dossier Archive)",
      },
      {
        id: "cyclone-relief",
        name: "Monsoon & Cyclone Emergency Sustenance",
        focusArea: "Natural Calamity Rehabilitation",
        geographicLocation: "Coastal & Western Odisha affected belts",
        targetBeneficiaries: "Households facing displacement or crop inundation",
        verifiedOutputs: "Tarpaulin distribution, potable water packets, and dry food relief during severe monsoon inundations.",
        implementationModel: "Volunteer mobile response squads.",
        status: "historical",
        documentSource: "Historical Relief Record Archive",
      },
    ] as ProgrammeRecord[],

    // C. PROPOSED PIPELINE INITIATIVES (Explicitly Flagged — Not Yet Executed)
    proposedPipeline: [
      {
        id: "project-samarth",
        name: "Project Samarth: Community Digital Learning Centers",
        focusArea: "Rural Digital Literacy & Competitive Exam Hubs",
        geographicLocation: "Proposed for Balangir and Khordha districts",
        targetBeneficiaries: "High school and college graduates seeking digital access and quiet study halls",
        verifiedOutputs: "Planned: solar-powered study hubs, digital e-libraries, and competitive examination reference materials.",
        implementationModel: "Partnership with CSR sponsors under Schedule VII (Item ii).",
        status: "proposed_pipeline",
        documentSource: "MECT Proposal to CSR Partners (Pages 12-28 of Dossier)",
      },
      {
        id: "higher-ed-scholarship-fund",
        name: "Endowed Higher Education Tuition Grant Fund",
        focusArea: "Professional Degree Merit-cum-Means Scholarships",
        geographicLocation: "Statewide across accredited universities in Odisha",
        targetBeneficiaries: "Underprivileged students pursuing Engineering, Medical, Polytechnic, or Degree courses",
        verifiedOutputs: "Planned: Institutional fee subsidies remitted 100% directly to colleges (payable to Principal/Bursar).",
        implementationModel: "Strict zero-cash, direct-to-college institutional fee remission.",
        status: "proposed_pipeline",
        documentSource: "MECT Scholarship Governance Framework (Section 3 of Charter)",
      },
      {
        id: "mobile-health-unit",
        name: "Rural Mobile Health & Eye Screening Van",
        focusArea: "Preventative Healthcare in Tribal Pockets",
        geographicLocation: "Remote tribal habitations in Western Odisha",
        targetBeneficiaries: "Elderly villagers, children, and pregnant mothers lacking healthcare access",
        verifiedOutputs: "Proposed: Diagnostic vehicle equipped with basic vitals check, cataract screening, and free medication.",
        implementationModel: "CSR capital expenditure collaboration.",
        status: "proposed_pipeline",
        documentSource: "Healthcare Outreach Proposal (Dossier Section 11)",
      },
    ] as ProgrammeRecord[],
  },

  // 6. Strict Fiduciary Standards
  fiduciaryStandards: {
    directCollegeDisbursal: "All tuition grants are remitted exclusively to the institutional bank account of the accredited college or university. Zero cash is handled.",
    zeroCashPolicy: "No cash, bearer cheques, or private transfers to students or guardians are permitted under any circumstances.",
    zeroCommissionStandard: "MECT operates with zero middlemen, brokers, or educational agents.",
    freeApplicationPolicy: "All applications, eligibility evaluations, and counselling services are 100% free of charge (₹0).",
  },

  // 7. Official Banking Coordinates for Statutory Domestic Donations
  banking: {
    accountName: "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
    bankName: "State Bank of India",
    branch: "Rajendra College Square, Bolangir, Odisha",
    accountNumber: "33341302498",
    ifsc: "SBIN0001701",
    accountType: "Current Account",
    upiId: "86971610172@sbi",
    fallbackUpiId: "9438295223@sbi",
    taxExemptionNotice: "Tax treatment of contributions is subject to applicable law and confirmation of the Trust's current statutory eligibility (URN: AADTM5474FF20241).",
  },

  // 8. Official Communication Desks
  offices: {
    registeredOffice: {
      label: "Registered Office (Balangir)",
      address: "Near Sai Mandir, Rugudipara, Balangir - 767001, Odisha, India",
      phone: "+91 94382 95223",
      secondaryPhone: "+91 94382 95223",
    },
    liaisonOffice: {
      label: "Corporate Liaison Secretariat (Bhubaneswar)",
      address: "A1, 3rd Floor, Lewis Plaza, BJB Nagar, Bhubaneswar - 751014, Odisha, India",
      phone: "+91 94382 95223",
      secondaryPhone: "+91 94382 95223",
    },
    emails: {
      primary: "mectbbsr13@gmail.com",
      general: "mectbbsr13@gmail.com",
      scholarships: "mectbbsr13@gmail.com",
    },
    website: "https://mect.org.in",
  },
};

