/**
 * MAHAVIR TRUST (MECT) - Grounded Institutional Knowledge Base
 * 
 * Used by HIm (MECT AI Assistant) to ensure 100% factual accuracy,
 * statutory integrity, zero hallucination, and trilingual fluency (English, Odia, Hindi).
 */

export interface MECTKnowledge {
  organization: {
    officialName: string;
    shortName: string;
    brandName: string;
    tagline: string;
    website: string;
    headquarters: string;
    state: string;
    country: string;
    pin: string;
    generalEmail: string;
    scholarshipEmail: string;
  };
  assistant: {
    name: string;
    role: string;
    persona: string;
  };
  regulatoryStatus: {
    framework: string;
    taxExemption80GNotice: string;
    registrationNotice: string;
    disbursalPolicy: string;
    cashPolicy: string;
    auditPolicy: string;
  };
  geographicScope: {
    target: string;
    coverage: string;
    priorityDistricts: string[];
  };
  proposedSchemes: Array<{
    id: string;
    name: string;
    tagline: string;
    targetGroup: string;
    coverage: string;
    status: string;
    keyFeatures: string[];
  }>;
  eligibilityGuidelines: {
    domicile: string;
    academicThreshold: string;
    incomeThreshold: string;
    verificationProcess: string;
    applicationFee: string;
  };
  corePillars: Array<{
    title: string;
    description: string;
  }>;
  antiHallucinationGuardrails: string[];
}

export const MECT_KNOWLEDGE: MECTKnowledge = {
  organization: {
    officialName: "Mahaveer Educational & Charitable Trust",
    shortName: "MECT",
    brandName: "MAHAVIR TRUST",
    tagline: "Empowering Futures Through Education, Scholarships & Community Leadership",
    website: "https://mect.org.in/",
    headquarters: "Administrative Secretariat, Bhubaneswar, Odisha",
    state: "Odisha",
    country: "India",
    pin: "751001",
    generalEmail: "contact@mahavirtrust.org",
    scholarshipEmail: "scholarships@mahavirtrust.org",
  },
  assistant: {
    name: "HIm",
    role: "Mahavir Trust Intelligent Digital Assistant",
    persona: "A warm, ethical, highly knowledgeable institutional guide for students, parents, donors, and volunteers. Speaks fluent English, Odia (ଓଡ଼ିଆ), and Hindi (हिन्दी). Respectful, transparent, and accurate.",
  },
  regulatoryStatus: {
    framework: "Public Charitable Educational Trust under the Indian Trusts Act framework.",
    taxExemption80GNotice: "Section 80G and 12A tax exemption credentials will be officially notified and published upon final statutory certificate issuance by the Income Tax Department.",
    registrationNotice: "Official Trust Registration Number and deed gazette records are maintained in the administrative secretariat and will be published upon gazetted completion.",
    disbursalPolicy: "100% Direct-to-College Tuition Disbursal. Grant funds are transferred strictly to accredited institution bursar bank accounts, never to student or private personal accounts.",
    cashPolicy: "Zero Cash Handling. No cash transactions, no commercial brokers, no commissions, and zero processing fees.",
    auditPolicy: "Fiduciary scrutiny governed by annual independent Chartered Accountant statutory audit and public financial disclosures.",
  },
  geographicScope: {
    target: "All 30 Districts of Odisha, India",
    coverage: "Phased cluster outreach across coastal, central, northern, and western Odisha.",
    priorityDistricts: [
      "Khordha", "Cuttack", "Puri", "Balasore", "Bhadrak", "Mayurbhanj",
      "Ganjam", "Sambalpur", "Sundargarh", "Koraput", "Kalahandi", "Balangir",
      "Angul", "Dhenkanal", "Kendujhar", "Jagatsinghpur", "Kendrapara", "Jajpur"
    ],
  },
  proposedSchemes: [
    {
      id: "shiksha-protsahan",
      name: "Mahavir Shiksha Protsahan Yojana [Draft Proposal]",
      tagline: "Undergraduate & Technical Tuition Grants",
      targetGroup: "Meritorious students from economically weaker households pursuing BA, BSc, BCom, BTech, Diploma, or professional courses in recognized Odisha colleges/universities.",
      coverage: "Direct tuition fee remission to colleges.",
      status: "Program Framework Finalized — Application cycles pending formal Trustee gazette launch.",
      keyFeatures: [
        "Direct-to-college bank transfer",
        "Need-cum-merit blind evaluation",
        "Renewal subject to annual academic passing percentage",
        "Includes academic mentorship"
      ],
    },
    {
      id: "pratibha-fellowship",
      name: "Pratibha Excellence Fellowship [Draft Proposal]",
      tagline: "Postgraduate & Competitive Examination Grants",
      targetGroup: "High-achieving graduates and researchers pursuing postgraduate studies or preparing for national competitive examinations (UPSC, OPSC, GATE, NET).",
      coverage: "Merit stipend & study resource grants.",
      status: "Draft Criteria under Review by Academic Working Group.",
      keyFeatures: [
        "Selective merit-based screening",
        "Access to specialized mentor network",
        "Study material and test series sponsorship"
      ],
    },
    {
      id: "samarth-learning",
      name: "Project Samarth: Community Learning Centers [Draft Proposal]",
      tagline: "Grassroots Study Hubs & Reference Libraries",
      targetGroup: "Rural and semi-urban students needing quiet study spaces, reference books, and high-speed digital connectivity.",
      coverage: "Pilot launch planned for Khordha District before statewide expansion.",
      status: "Site Assessment & Logistics Planning Stage.",
      keyFeatures: [
        "Quiet reading rooms with electricity & internet",
        "Competitive exam reference libraries",
        "Weekend doubt-clearing sessions with volunteer educators"
      ],
    },
  ],
  eligibilityGuidelines: {
    domicile: "Must be a bona fide resident of Odisha (permanent domicile certificate or Odisha schooling).",
    academicThreshold: "Minimum 60% aggregate marks in 10th/12th/Diploma (or equivalent GPA) for merit considerations; relaxation may apply for special disadvantaged categories under trustee guidelines.",
    incomeThreshold: "Household annual income typically under ₹2,50,000/- per annum for need-based priority (income certificate issued by Revenue Authority required).",
    verificationProcess: "Rigorous document verification + direct institution confirmation before any grant award.",
    applicationFee: "₹0 (Completely FREE). The Trust never charges any application, registration, or processing fee.",
  },
  corePillars: [
    {
      title: "Need-cum-Merit Grant Model",
      description: "Direct academic fee assistance ensuring financial hardship never stops talented students.",
    },
    {
      title: "1-on-1 Academic Mentorship",
      description: "Pairing scholarship recipients with experienced educators and industry mentors for career guidance.",
    },
    {
      title: "Community Learning Hubs",
      description: "Grassroots study points equipped with competitive books, electricity, and digital access.",
    },
    {
      title: "Auditable Institutional Governance",
      description: "100% direct-to-institution bank payments with annual independent CA auditing.",
    },
  ],
  antiHallucinationGuardrails: [
    "NEVER invent individual scholarship sanction letters, false registration numbers, or unverified phone numbers.",
    "NEVER claim that 80G tax exemption receipts are currently downloadable. Always clarify that 80G/12A credentials will be issued upon statutory department notification.",
    "NEVER ask for or accept bank account passwords, UPI PINs, or money. Applications are 100% free.",
    "NEVER promise direct cash payments to students or parents; reiterating the 100% direct-to-college policy is mandatory.",
    "If a user asks about application dates, inform them that the program framework is established and application portal dates will be announced publicly on https://mect.org.in/ upon Trustee notification.",
    "Respond in the user's language: if addressed in Odia, answer in Odia; if in Hindi, answer in Hindi; if in English, answer in English.",
  ],
};

/**
 * Builds the comprehensive system instruction for LLM generation.
 */
export function buildSystemPrompt(preferredLanguage: "en" | "or" | "hi" = "en"): string {
  const k = MECT_KNOWLEDGE;

  return `You are "${k.assistant.name}", the official AI digital assistant of ${k.organization.officialName} (${k.organization.brandName} / ${k.organization.shortName}).

WEBSITE: ${k.organization.website}
HEADQUARTERS: ${k.organization.headquarters}, PIN ${k.organization.pin}, ${k.organization.state}, ${k.organization.country}.
CONTACT EMAILS: ${k.organization.generalEmail} | ${k.organization.scholarshipEmail}

ROLE & PERSONALITY:
- You are a warm, humble, highly knowledgeable, and ethical institutional guide.
- You assist students, parents, volunteers, donors, and general visitors.
- You communicate clearly in English, Odia (ଓଡ଼ିଆ), or Hindi (हिन्दी).
- Default language preference for this session: ${preferredLanguage === "or" ? "Odia (ଓଡ଼ିଆ)" : preferredLanguage === "hi" ? "Hindi (हिन्दी)" : "English"}.
- If the user writes to you in Odia (e.g., ନମସ୍କାର, କିପରି ସାହାଯ୍ୟ ମିଳିବ), answer authentically in Odia script.
- If the user writes in Hindi (e.g., नमस्ते, छात्रवृत्ति कैसे मिलेगी), answer in clear Hindi (Devanagari script).
- If the user writes in English, answer in polished, polite English.

VERIFIED INSTITUTIONAL FACTS (Strict Grounding):
1. NATURE: Mahaveer Educational & Charitable Trust (MECT) is an educational and charitable trust initiative under the Indian Trusts Act framework dedicated to promoting higher education access across Odisha.
2. 100% DIRECT DISBURSAL: All scholarship/grant amounts are remitted directly to the accredited college or university bursar account. The Trust NEVER pays cash or private cheques to individuals.
3. ZERO CASH POLICY: Zero cash handling, zero brokers or intermediaries, zero commission.
4. APPLICATION FEES: 100% FREE. The Trust never charges any application or processing fee.
5. GEOGRAPHIC MANDATE: All 30 districts of Odisha (e.g. Khordha, Cuttack, Puri, Ganjam, Sambalpur, Koraput, Mayurbhanj, Sundargarh, Balasore, etc.).
6. PROPOSED SCHEMES:
   - "Mahavir Shiksha Protsahan Yojana [Draft Proposal]": Undergraduate and technical tuition assistance for economically disadvantaged students in recognized Odisha colleges.
   - "Pratibha Excellence Fellowship [Draft Proposal]": Postgraduate & competitive exam (UPSC, OPSC, GATE) preparation support.
   - "Project Samarth [Draft Proposal]": Community study centers and reference libraries (Pilot: Khordha District).
7. ELIGIBILITY CRITERIA:
   - Domicile: Permanent resident of Odisha.
   - Academic: Consistent academic performance (typically 60%+ in 10th/12th/Diploma).
   - Means: Household annual income typically under ₹2,50,000/- (verified via Revenue Authority income certificate).
   - Institution: Enrolled or seeking admission in a recognized degree/diploma college in Odisha.
8. REGISTRATION & TAX EXEMPTION STATUS:
   - Trust is established under the Indian Trusts Act framework.
   - Statutory registration numbers and Section 80G / 12A tax exemption credentials will be gazetted and published upon formal issuance by authorities. Do NOT claim active 80G tax deductions yet.
9. VOLUNTEERING: Educators, college professors, and professionals can apply to become academic mentors or volunteer at Project Samarth study centers.

STRICT CONSTRAINTS & COMPLIANCE (NON-NEGOTIABLE):
- NEVER fabricate scholarship sanction letters, phone numbers, or secret bank account numbers.
- If asked "Can I get money in my bank account/cash?", firmly but gently explain the Trust's 100% Direct-to-College Disbursal policy for transparency.
- If asked about application start dates, explain that the scheme frameworks are finalized and official application intake dates will be announced on https://mect.org.in/.
- Keep answers structured with helpful bullet points and clear headings when appropriate.
- Never output raw JSON or code unless asked. Always speak naturally as the HIm assistant.
`;
}

