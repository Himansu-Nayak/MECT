import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/Accordion";
import { TRUST_CONFIG } from "@/lib/config";
import {
  CheckCircle2,
  ChevronRight,
  FileCheck,
  ArrowRight,
  GraduationCap,
  Landmark,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Scholarship Grants, Schemes & Appraisal Norms — MAHAVIR TRUST",
  description:
    "Explore higher education tuition grants, STEM fellowships, scheme comparison matrices, required document checklists, and application roadmaps for Odisha students.",
};

export default function ScholarshipsPage() {
  const schemeComparison = [
    {
      feature: "Target Audience",
      protsahan: "Underprivileged undergraduate scholars across Odisha (B.Sc, B.Com, B.A, Diploma)",
      pratibha: "Merit-ranked candidates preparing for national entrance exams & STEM degrees",
      samarth: "All enrolled college students in pilot district study clusters lacking quiet study facilities",
    },
    {
      feature: "Academic Threshold",
      protsahan: "Minimum 60% aggregate in Class 10 and +2 Higher Secondary exams",
      pratibha: "Top quartile percentile in state/national entrance tests or 75%+ in STEM subjects",
      samarth: "Enrolled in an accredited degree/diploma college in Odisha",
    },
    {
      feature: "Household Means Limit",
      protsahan: "Annual family income below ₹2,50,000 (Tahsildar verified)",
      pratibha: "Annual family income below ₹3,50,000 (Preference to BPL / EWS categories)",
      samarth: "Universal access for students from under-resourced localities",
    },
    {
      feature: "Benefit Coverage",
      protsahan: "100% Approved Tuition Fees + Annual Textbook Resource Grant",
      pratibha: "Exam registration fee subsidy + Specialized technical texts + Mentorship",
      samarth: "Access to solar-powered study desks, high-speed internet & reference libraries",
    },
    {
      feature: "Disbursement Mode",
      protsahan: "100% Direct RTGS/NEFT to College Bursar (Zero cash handouts)",
      pratibha: "Direct college/testing authority remittance or verified book procurement",
      samarth: "Physical facility and infrastructure deployment",
    },
    {
      feature: "Renewal Terms",
      protsahan: "Annual verification of semester progression and minimum 60% pass rate",
      pratibha: "Quarterly progress review with designated academic mentor",
      samarth: "Continuous community access with valid college ID card",
    },
  ];

  const appraisalSteps = [
    {
      step: 1,
      title: "1. Inquiry & Submission",
      description:
        "Candidate or guardian registers via the Secretariat desk, providing marksheets, college admission slip, and Tahsildar income certificate.",
      detail: "Zero registration or processing fees charged.",
    },
    {
      step: 2,
      title: "2. College Verification",
      description:
        "Secretariat officers contact the college accounts desk to confirm bonafide enrollment, annual course fee schedules, and official institutional bank details.",
      detail: "Direct bursar liaison without middlemen.",
    },
    {
      step: 3,
      title: "3. Committee Scrutiny",
      description:
        "Independent Academic Scrutiny Panel assesses dossiers against standardized merit-cum-means rubrics, establishing an auditable sanction list.",
      detail: "Blind assessment by academic volunteers.",
    },
    {
      step: 4,
      title: "4. Direct Bank Disbursal",
      description:
        "100% of the approved grant is remitted directly to the college bursar via bank RTGS. The official receipt is confirmed and mentor paired with scholar.",
      detail: "Fiduciary zero-cash policy strictly enforced.",
    },
  ];

  const documentChecklist = [
    {
      category: "Academic Records",
      icon: GraduationCap,
      items: [
        "Class 10 / High School Certificate & Detailed Marksheet",
        "+2 Higher Secondary Examination Marksheet (CHSE / CBSE / ICSE)",
        "Current College Bonafide Certificate & Official Admission Letter",
        "Official Semester Fee Demand Notice issued by the College Bursar",
      ],
    },
    {
      category: "Income & Residency Proofs",
      icon: FileCheck,
      items: [
        "Income Certificate issued by Revenue Authority (Tahsildar / Sub-Collector) within last 12 months",
        "Odisha Resident / Domicile Certificate issued by Competent Authority",
        "Valid Aadhaar Card copy (Self-attested for identity and address verification)",
        "Ration Card / BPL Card (Where applicable, for priority means consideration)",
      ],
    },
    {
      category: "Institutional Banking Details",
      icon: Landmark,
      items: [
        "Official College / University Bank Account Passbook copy or Cancelled Cheque",
        "College Bank Account IFSC Code, Branch Name, and Account Holder Name (Strictly in name of Institution)",
        "Zero-Cash Declaration Form signed by candidate and guardian",
      ],
    },
  ];

  const faqItems = [
    {
      question: "Can students already receiving government scholarships (like e-Medhabruti) apply?",
      answer:
        "Yes. MAHAVIR TRUST grants are designed to complement, not duplicate, existing public subsidies. If state or central assistance covers only a fraction of college expenses, our committee reviews the remaining documented tuition and textbook shortfall under our supplementary grant norms.",
    },
    {
      question: "How is the scholarship fee disbursed?",
      answer:
        "Under our strict fiduciary charter, 100% of approved tuition fee assistance is remitted directly via bank RTGS/NEFT to the accredited college or university account where the scholar is enrolled. No cash is ever transferred to students, family members, or third-party intermediaries.",
    },
    {
      question: "Are there any application or registration fees charged by MAHAVIR TRUST?",
      answer:
        "None whatsoever. All scholarship application processing, verification, and mentorship support provided by MAHAVIR TRUST are 100% free of cost. The Trust strictly forbids any agent, college liaison, or staff member from demanding money.",
    },
    {
      question: "What happens if a student transfers to a different college or degree program?",
      answer:
        "The student must submit an official transfer notice and updated bonafide enrollment certificate from the new accredited institution to the Secretariat Desk. The Scrutiny Committee re-verifies the college fee structure to redirect future disbursements.",
    },
    {
      question: "What are the renewal criteria for subsequent academic years?",
      answer:
        "Recipients must maintain satisfactory academic attendance (minimum 75%) and clear all semester examinations without backlogs, maintaining an aggregate GPA equivalent to at least 60%. An annual renewal verification form is submitted before the start of each academic year.",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Academic Enablement"
        title="Higher Education Scholarship Grants & Appraisal Norms"
        description="Transparent, auditable tuition grants providing direct college fee assistance and academic mentorship so that deserving students in Odisha can complete their professional degrees with dignity."
        breadcrumbs={[{ label: "Scholarships" }]}
        actions={
          <>
            <Link href="#comparison">
              <Button variant="gold" size="sm">
                <span>Compare Schemes</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="#checklist">
              <Button variant="dark-outline" size="sm">
                <span>Document Checklist</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Scheme Comparison Matrix */}
      <section id="comparison" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Programmatic Matrix"
            badgeVariant="forest"
            title="Scholarship Scheme Comparison"
            subtitle="Compare the eligibility thresholds, financial grant scopes, and renewal conditions across our proposed educational initiatives."
            align="center"
          />

          {/* Desktop Responsive Table */}
          <div className="overflow-x-auto bg-white rounded-xs border border-[#0B3B24]/15 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#072617] text-[#EDE6D8] border-b border-[#C5A059]/30">
                  <th scope="col" className="p-4 sm:p-5 font-serif font-bold text-sm w-1/4">
                    Feature / Evaluation Criterion
                  </th>
                  <th scope="col" className="p-4 sm:p-5 font-serif font-bold text-sm w-1/4 text-[#E4C88A]">
                    Shiksha Protsahan Yojana (Tuition Grants)
                  </th>
                  <th scope="col" className="p-4 sm:p-5 font-serif font-bold text-sm w-1/4 text-[#E4C88A]">
                    Pratibha Fellowship (STEM & Entrance)
                  </th>
                  <th scope="col" className="p-4 sm:p-5 font-serif font-bold text-sm w-1/4 text-[#E4C88A]">
                    Project Samarth (Study Hubs)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3B24]/10 text-[#1C2421]">
                {schemeComparison.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={idx % 2 === 0 ? "bg-[#FDFBF7]" : "bg-white"}
                  >
                    <td className="p-4 sm:p-5 font-bold text-[#0B3B24] align-top bg-[#F4EFE6]/50">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 align-top leading-relaxed text-[#4A5568]">
                      {row.protsahan}
                    </td>
                    <td className="p-4 sm:p-5 align-top leading-relaxed text-[#4A5568]">
                      {row.pratibha}
                    </td>
                    <td className="p-4 sm:p-5 align-top leading-relaxed text-[#4A5568]">
                      {row.samarth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#4A5568] text-center italic">
            Note: All eligibility thresholds represent draft proposals pending final gazetted formalization by the Trustee Board ahead of the inaugural academic cycle.
          </p>
        </Container>
      </section>

      {/* 3. Four-Step Application & Appraisal Workflow */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#0B3B24]/10">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Standardized Journey"
            badgeVariant="gold"
            title="Scholar Appraisal & Disbursal Journey"
            subtitle="A 4-step transparent evaluation pipeline ensuring objective appraisal and zero intermediary delay."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {appraisalSteps.map((step) => (
              <Card
                key={step.step}
                variant="elevated"
                padding="md"
                className="space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#0B3B24] text-[#E4C88A] font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                      {step.step}
                    </span>
                    <Badge variant="neutral" className="text-[10px]">
                      Phase {step.step}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0B3B24]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#0B3B24]/8 text-[11px] font-medium text-[#0B3B24]/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{step.detail}</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Required Document Checklist */}
      <section id="checklist" className="py-20 md:py-28 bg-[#FDFBF7] border-b border-[#0B3B24]/10">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Application Preparedness"
            badgeVariant="forest"
            title="Mandatory Documentation Checklist"
            subtitle="Applicants are advised to gather certified documentation before submitting their dossiers to ensure rapid processing."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {documentChecklist.map((group) => {
              const Icon = group.icon;
              return (
                <Card
                  key={group.category}
                  variant="elevated"
                  padding="lg"
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-[#0B3B24]/10">
                    <div className="w-10 h-10 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0B3B24]">
                      {group.category}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {group.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4A5568]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>

          {/* Document Verification Notice */}
          <Card
            variant="accent"
            padding="md"
            className="flex flex-col md:flex-row items-center justify-between gap-5 text-xs"
          >
            <div className="space-y-1">
              <span className="font-bold text-[#0B3B24] uppercase tracking-wider block">
                Verification Safeguard
              </span>
              <p className="text-[#4A5568] leading-relaxed">
                All submitted revenue certificates are validated against digital state land and revenue authority databases. Submission of forged documentation results in immediate disqualification and regulatory reporting.
              </p>
            </div>
            <Link href="/contact" className="shrink-0">
              <Button variant="primary" size="sm">
                <span>Ask Secretariat Coordinator</span>
              </Button>
            </Link>
          </Card>
        </Container>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="py-20 bg-[#F4EFE6] border-b border-[#0B3B24]/10">
        <Container size="narrow" className="space-y-12">
          <SectionHeader
            badge="Student Guidance"
            badgeVariant="gold"
            title="Scholarship Frequently Asked Questions"
            subtitle="Clear answers regarding eligibility rules, multi-scholarship coordination, and renewals."
            align="center"
          />

          <Accordion items={faqItems} />

          <div className="text-center pt-4">
            <Link href="/contact">
              <Button variant="outline" size="md">
                <span>Still Have Questions? Connect With Us</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 6. Call to Action Strip */}
      <section className="py-16 bg-[#072617] text-[#EDE6D8]">
        <Container
          size="default"
          className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
        >
          <div className="space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Ready to Discover Your Eligible Grants?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Use our interactive Scholar Eligibility Calculator or register your inquiry with our Secretariat Desk today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/#eligibility-calculator">
              <Button variant="gold" size="md">
                <span>Use Eligibility Calculator</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="dark-outline" size="md">
                <span>Inquiry Desk</span>
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
