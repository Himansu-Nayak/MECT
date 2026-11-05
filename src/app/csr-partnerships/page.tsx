"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { TRUST_CONFIG } from "@/lib/config";
import { submitInquiry } from "@/lib/api";
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  GraduationCap,
  Scissors,
  Droplets,
  Utensils,
  Receipt,
  Landmark,
  Building2,
  Send,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function CSRPartnershipsPage() {
  const [csrSubmitted, setCsrSubmitted] = useState(false);
  const [csrReferenceId, setCsrReferenceId] = useState<number | null>(null);
  const [csrIsSubmitting, setCsrIsSubmitting] = useState(false);
  const [csrError, setCsrError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    designation: "",
    email: "",
    phone: "",
    csrBudget: "₹10 Lakhs – ₹25 Lakhs",
    focusArea: "Remedial Rural Education (Schedule VII-ii)",
    targetDistrict: "Balangir",
    message: "",
  });

  const handleCSRSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCsrIsSubmitting(true);
    setCsrError(null);

    try {
      const response = await submitInquiry({
        fullName: `${formData.contactName.trim()} (${formData.designation.trim()}, ${formData.companyName.trim()})`,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        category: "Corporate CSR & Philanthropy",
        message: `[CSR Partnership Proposal]\nCompany: ${formData.companyName}\nDesignation: ${formData.designation}\nBudget Range: ${formData.csrBudget}\nFocus Sector: ${formData.focusArea}\nTarget District: ${formData.targetDistrict}\n\nProject Scope & Remarks:\n${formData.message.trim() || "Interested in turnkey CSR collaboration in Odisha."}`,
      });
      setCsrReferenceId(response.referenceId || null);
      setCsrSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setCsrError(err.message);
      } else {
        setCsrError("Unable to transmit CSR inquiry. Please check your connection or contact our Secretariat directly.");
      }
    } finally {
      setCsrIsSubmitting(false);
    }
  };

  const csrTracks = [
    {
      sector: "Schedule VII (ii)",
      title: "Remedial Rural Education & Digital Learning Labs",
      partnerValue: "Prevents Secondary Dropouts • 350+ Students per Cluster",
      description:
        "Sponsor after-school remedial coaching centres, supply STEM textbook libraries, and deploy computer learning labs in rural Balangir and Western Odisha blocks.",
      deliverables: [
        "Branded rural coaching centres equipped with desks and teaching aids",
        "Free student study kits (textbooks, notebooks, geometry sets)",
        "Monthly attendance and academic performance tracking reports",
        "Independent CA Utilization Certificate (UC) and photographic audit",
      ],
      icon: GraduationCap,
    },
    {
      sector: "Schedule VII (iii)",
      title: "Women's Vocational Tailoring & Livelihood Centers",
      partnerValue: "Empowers 120+ Rural Women • Sustainable Micro-Enterprises",
      description:
        "Fund 6-month intensive tailoring, garment design, and craft workshops. Equip certified women graduates with sewing machine toolkits for home-based micro-enterprises.",
      deliverables: [
        "Fully equipped stitching centers with pedal and electric sewing machines",
        "Master trainer honorariums and certified syllabus execution",
        "Distribution of branded toolkits and fabric bundles to certified graduates",
        "Livelihood impact assessment documenting household income growth",
      ],
      icon: Scissors,
    },
    {
      sector: "Schedule VII (i)",
      title: "Safe Drinking Water Purification (Jal Seva)",
      partnerValue: "10,000+ Citizens Served • Eradicates Summer Heat Exhaustion",
      description:
        "Establish permanent community RO/UV drinking water kiosks in rural transit hubs and hospital zones, complemented by annual summer heatwave hydration stations.",
      deliverables: [
        "Solar-backed water purification units with daily quality testing",
        "Hygienic stainless steel and earthen storage distribution kiosks",
        "Provision of electrolyte packets and community sanitation workshops",
        "Third-party water laboratory purity certification reports",
      ],
      icon: Droplets,
    },
    {
      sector: "Schedule VII (i)",
      title: "Jan Ahar Hospital Food Relief & Destitute Nutrition",
      partnerValue: "Direct Hospital Patient Relief • Compassionate Civic Care",
      description:
        "Subsidize and scale daily hot meal distribution for impoverished attendants caring for admitted patients at Balangir District Hospital and destitute daily wage earners.",
      deliverables: [
        "Hygienic community kitchen operations compliant with food safety norms",
        "Daily cooked thali distribution (rice, dal, fresh vegetable curry)",
        "Zero-cash transparent procurement ledgers audited by Chartered Accountants",
        "Quarterly donor impact logs with beneficiary testimonials",
      ],
      icon: Utensils,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Ministry of Corporate Affairs Approved • Reg: CSR00081063"
        title="Turnkey Corporate Social Responsibility (CSR) Partnerships"
        description="Mahaveer Educational & Charitable Trust (MECT) provides accredited corporate partners with fully compliant, auditable, and high-impact CSR project execution aligned with Schedule VII of the Companies Act, 2013."
        breadcrumbs={[{ label: "CSR Partnerships" }]}
        actions={
          <>
            <Link href="#inquiry">
              <Button variant="gold" size="sm">
                <span>Submit CSR Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/statutory-disclosures">
              <Button variant="dark-outline" size="sm">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" />
                <span>Verify CSR-1 Certificate</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Statutory CSR Credentials Strip */}
      <section className="py-8 bg-[#F4EFE6] border-b border-[#0A192F]/10">
        <Container size="default">
          <div className="p-6 bg-white rounded-xs border-2 border-[#C5A059]/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    MCA CSR-1 Registered
                  </Badge>
                  <span className="text-xs font-mono font-bold text-[#0A192F]">
                    Registration No: {TRUST_CONFIG.statutory.mcaCsrNumber}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#1C2421] font-semibold mt-1 font-serif">
                  Approved by Ministry of Corporate Affairs (ROC-Delhi, SRN-N14617237)
                </p>
                <p className="text-xs text-[#4A5568] mt-1 leading-relaxed font-sans max-w-3xl">
                  MECT satisfies all conditions under Section 135 of the Companies Act, 2013 and Companies (CSR Policy) Amendment Rules. Section 12A URN: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.section12AUrn}</strong> • Section 80G URN: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.section80GUrn}</strong> (50% Tax Deduction) • PAN: <strong className="text-[#0A192F]">{TRUST_CONFIG.statutory.pan}</strong>.
                </p>
              </div>
            </div>
            <Link href="/statutory-disclosures" className="shrink-0">
              <Button variant="secondary" size="sm">
                <span>View Compliance Vault</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. Four Turnkey CSR Project Tracks */}
      <section className="py-20 md:py-28 bg-[#FDFBF7]" aria-label="CSR Focus Sectors">
        <Container size="default" className="space-y-14">
          <SectionHeader
            badge="Schedule VII Aligned"
            title="Turnkey CSR Project Portfolios in Odisha"
            subtitle="Choose from our four high-impact project tracks designed for measurable corporate compliance and deep grassroots impact."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {csrTracks.map((track, idx) => {
              const Icon = track.icon;
              return (
                <Card
                  key={idx}
                  variant="elevated"
                  className="p-8 bg-white border-[#0A192F]/15 shadow-sm hover:border-[#C5A059] transition-all space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#0A192F]/10">
                      <span className="text-xs font-bold text-[#7A5E24] bg-[#7A5E24]/10 px-2.5 py-0.5 rounded-xs font-mono">
                        {track.sector}
                      </span>
                      <span className="text-[11px] font-semibold text-[#15803D]">
                        ✓ {track.partnerValue}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center shrink-0 border border-[#C5A059]/40">
                        <Icon className="w-5 h-5 text-[#E4C88A]" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#0A192F]">
                          {track.title}
                        </h3>
                        <p className="text-xs text-[#4A5568] mt-2 leading-relaxed font-sans">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    {/* Key Deliverables */}
                    <div className="p-4 bg-[#F4EFE6] rounded-xs border border-[#0A192F]/10 space-y-2 font-sans">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A192F] block">
                        Corporate Deliverables &amp; Auditing
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#4A5568]">
                        {track.deliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="#inquiry">
                      <Button variant="secondary" size="sm" className="w-full justify-center text-xs">
                        <span>Partner on this Project</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Corporate Governance & Fiduciary Assurance */}
      <section className="py-20 bg-[#0A192F] text-[#EDE6D8] border-y border-[#C5A059]/30">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Fiduciary Integrity"
            title="The MECT Corporate Governance Guarantee"
            subtitle="Built to satisfy corporate CSR committees, board oversight panels, and statutory auditors."
            align="center"
            theme="dark"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-3 font-sans">
              <FileCheck className="w-8 h-8 text-[#E4C88A]" />
              <h4 className="font-serif text-lg font-bold text-white">
                Independent CA Utilization Certificates
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                Every rupee disbursed is reconciled with bills, vouchers, and vendor invoices. Donors receive certified Form 10B and project Utilization Certificates (UC) signed by independent Chartered Accountants.
              </p>
            </div>

            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-3 font-sans">
              <ShieldCheck className="w-8 h-8 text-[#E4C88A]" />
              <h4 className="font-serif text-lg font-bold text-white">
                Milestone-Based Tranche Disbursal
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                Project capital is released in tranches linked to verified field milestones (e.g. classroom setup, machine delivery, graduation exams), ensuring complete programmatic alignment.
              </p>
            </div>

            <div className="p-7 rounded-xs bg-white/5 border border-white/10 space-y-3 font-sans">
              <Landmark className="w-8 h-8 text-[#E4C88A]" />
              <h4 className="font-serif text-lg font-bold text-white">
                Co-Branded Impact Recognition
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                Centres, water kiosks, and learning kits carry co-branded corporate signage in compliance with CSR norms, accompanied by high-resolution photographic and video audit assets.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Interactive Corporate Inquiry Form */}
      <section id="inquiry" className="py-20 md:py-28 bg-[#F4EFE6] scroll-mt-16">
        <Container size="default">
          <SectionHeader
            badge="Corporate Collaboration Desk"
            title="Initiate a Corporate CSR Partnership"
            subtitle="Our CSR Project Directorate will review your requirements and provide tailored project profiles, budget breakdowns, and field timelines."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-[#C5A059]/40 shadow-xl">
            {csrSubmitted ? (
              <div className="p-8 bg-[#0A192F] text-white rounded-xs space-y-4 text-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#E4C88A] mx-auto" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-bold">
                  CSR Inquiry Registered Successfully
                </h3>
                {csrReferenceId && (
                  <p className="text-sm font-mono text-[#E4C88A] bg-black/25 py-1.5 px-4 rounded inline-block">
                    CSR Registry Reference: #{csrReferenceId}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-md mx-auto font-sans">
                  Thank you for considering Mahaveer Educational &amp; Charitable Trust for your corporate CSR mandate. Our CSR Directorate will contact your office within 1 business day with project documentation.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setCsrSubmitted(false);
                    setFormData({
                      companyName: "",
                      contactName: "",
                      designation: "",
                      email: "",
                      phone: "",
                      csrBudget: "₹10 Lakhs – ₹25 Lakhs",
                      focusArea: "Remedial Rural Education (Schedule VII-ii)",
                      targetDistrict: "Balangir",
                      message: "",
                    });
                  }}
                  className="mt-2 font-bold"
                >
                  Submit Another CSR Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCSRSubmit} className="space-y-4">
                {csrError && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{csrError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="csr-company"
                    label="Company / Enterprise Legal Name *"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Jindal Steel / Tata Power"
                  />
                  <Input
                    id="csr-contact"
                    label="Contact Executive Full Name *"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Rajesh Mohanty"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="csr-designation"
                    label="Executive Designation *"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Head of CSR / VP HR"
                  />
                  <Input
                    id="csr-email"
                    type="email"
                    label="Official Corporate Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rajesh@enterprise.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <Input
                    id="csr-phone"
                    type="tel"
                    label="Phone / Mobile *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                  <Select
                    id="csr-budget"
                    label="Annual CSR Allocation *"
                    value={formData.csrBudget}
                    onChange={(e) => setFormData({ ...formData, csrBudget: e.target.value })}
                    options={[
                      { value: "Under ₹10 Lakhs", label: "Under ₹10 Lakhs" },
                      { value: "₹10 Lakhs – ₹25 Lakhs", label: "₹10 Lakhs – ₹25 Lakhs" },
                      { value: "₹25 Lakhs – ₹50 Lakhs", label: "₹25 Lakhs – ₹50 Lakhs" },
                      { value: "₹50 Lakhs – ₹1 Crore", label: "₹50 Lakhs – ₹1 Crore" },
                      { value: "Above ₹1 Crore", label: "Above ₹1 Crore" },
                    ]}
                  />
                  <Select
                    id="csr-district"
                    label="Target District *"
                    value={formData.targetDistrict}
                    onChange={(e) => setFormData({ ...formData, targetDistrict: e.target.value })}
                    options={[
                      { value: "Balangir", label: "Balangir" },
                      { value: "Khordha (Bhubaneswar)", label: "Khordha (Bhubaneswar)" },
                      { value: "Cuttack", label: "Cuttack" },
                      { value: "Sambalpur", label: "Sambalpur" },
                      { value: "Kalahandi", label: "Kalahandi" },
                      { value: "All Odisha Districts", label: "Statewide Mandate" },
                    ]}
                  />
                </div>

                <Select
                  id="csr-focus"
                  label="Focus CSR Sector (Schedule VII) *"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                  options={[
                    { value: "Remedial Rural Education (Schedule VII-ii)", label: "Remedial Rural Education (Schedule VII-ii)" },
                    { value: "Women Vocational Tailoring & Skilling (Schedule VII-iii)", label: "Women Vocational Tailoring & Skilling (Schedule VII-iii)" },
                    { value: "Safe Drinking Water Purification - Jal Seva (Schedule VII-i)", label: "Safe Drinking Water Purification - Jal Seva (Schedule VII-i)" },
                    { value: "Hospital Nutrition Food Relief - Jan Ahar (Schedule VII-i)", label: "Hospital Nutrition Food Relief - Jan Ahar (Schedule VII-i)" },
                  ]}
                />

                <Textarea
                  id="csr-message"
                  label="Project Scope / Remarks / Proposed Timeline"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your CSR committee focus, target beneficiaries, or execution timeline..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={csrIsSubmitting}
                  className="w-full justify-center shadow-md font-bold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  <span>Transmit CSR Inquiry to Secretariat</span>
                </Button>

                <p className="text-[11px] text-[#4A5568] text-center italic font-sans">
                  Protected under Indian corporate privacy norms. Regulated under MCA CSR-1 Reg: {TRUST_CONFIG.statutory.mcaCsrNumber}.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
