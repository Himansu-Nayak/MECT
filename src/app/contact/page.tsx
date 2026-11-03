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
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TRUST_CONFIG } from "@/lib/config";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Building2,
  Scale,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { submitInquiry } from "@/lib/api";

const INQUIRY_CATEGORIES: SelectOption[] = [
  { value: "Scholarship Guidance", label: "Scholarship Guidance & Application Inquiries" },
  { value: "Institutional Liaison", label: "College / Institutional Liaison & Study Hubs" },
  { value: "Donor Consultation", label: "Endowment Consultation & CSR Collaboration" },
  { value: "Governance & Audit", label: "Statutory Governance, RTI & Fiduciary Audit Query" },
  { value: "Grievance Redressal", label: "Formal Grievance / Ombudsman Redressal" },
];

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Scholarship Guidance",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await submitInquiry({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        message: formData.message,
      });

      setReferenceId(response.referenceId || null);
      setFormSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected network error occurred while connecting to the secretariat.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Direct Secretariat Desk"
        title="Secretariat Desk & Grievance Redressal"
        description="Official communications gateway for students, educational institutions, donors, and regulatory stakeholders across Odisha."
        breadcrumbs={[{ label: "Contact Us & Grievance Desk" }]}
        actions={
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#inquiry-form">
              <Button variant="primary" className="!bg-[#C5A059] !text-[#0B3B24] hover:!bg-[#E4C88A]">
                Dispatch Message
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <a href="#secretariat-directory">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Directory & SLAs
              </Button>
            </a>
            <a href="#grievance-charter">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Grievance Protocol
              </Button>
            </a>
          </div>
        }
      />

      {/* 2. Institutional Directory & Service Level Agreements */}
      <section id="secretariat-directory" className="py-16 md:py-24 bg-[#FDFBF7] scroll-mt-20 border-b border-[#0B3B24]/10">
        <Container size="default">
          <SectionHeader
            badge="Institutional Directory"
            title="Secretariat Communications & Response Standards"
            subtitle="MAHAVIR TRUST maintains auditable response commitments across all physical and digital channels."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Office 1 */}
            <Card variant="elevated" className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24]">
                  <Building2 className="w-6 h-6 text-[#0B3B24]" />
                </div>
                <div>
                  <Badge variant="forest" className="mb-2">Physical Headquarters</Badge>
                  <h3 className="font-serif text-xl font-bold text-[#0B3B24]">
                    Secretariat Headquarters
                  </h3>
                </div>
                <div className="text-xs text-[#4A5568] space-y-2 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>
                      {TRUST_CONFIG.contact.addressLine1}, {TRUST_CONFIG.contact.city},{" "}
                      {TRUST_CONFIG.contact.state} - {TRUST_CONFIG.contact.pin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#9E7D3B] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{TRUST_CONFIG.contact.verificationStatus}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-[#0B3B24]/10">
                    <Clock className="w-4 h-4 text-[#0B3B24] shrink-0 mt-0.5" />
                    <span>Mon – Sat: 10:00 AM – 5:30 PM IST (Public visitors by prior appointment)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0B3B24]/10 text-[11px] text-[#4A5568] bg-[#F7F4EE] p-3 rounded-xs">
                <span className="font-semibold text-[#0B3B24]">Receipt SLA:</span> In-person document receipts registered & stamped on the same working day.
              </div>
            </Card>

            {/* Office 2 */}
            <Card variant="elevated" className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24]">
                  <Mail className="w-6 h-6 text-[#0B3B24]" />
                </div>
                <div>
                  <Badge variant="gold" className="mb-2">Electronic Communications</Badge>
                  <h3 className="font-serif text-xl font-bold text-[#0B3B24]">
                    Digital Desks & Helplines
                  </h3>
                </div>
                <div className="text-xs text-[#4A5568] space-y-3 leading-relaxed">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#0B3B24]">
                      General Secretariat
                    </div>
                    <a
                      href={`mailto:${TRUST_CONFIG.contact.generalEmail}`}
                      className="underline text-[#0B3B24] font-medium hover:text-[#C5A059]"
                    >
                      {TRUST_CONFIG.contact.generalEmail}
                    </a>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-[#0B3B24]">
                      Scholarships & Aid Desk
                    </div>
                    <a
                      href={`mailto:${TRUST_CONFIG.contact.scholarshipEmail}`}
                      className="underline text-[#0B3B24] font-medium hover:text-[#C5A059]"
                    >
                      {TRUST_CONFIG.contact.scholarshipEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Phone className="w-4 h-4 text-[#0B3B24] shrink-0" />
                    <span>+91 671 234 5678 (Helpdesk Mon-Fri)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0B3B24]/10 text-[11px] text-[#4A5568] bg-[#F7F4EE] p-3 rounded-xs">
                <span className="font-semibold text-[#0B3B24]">Turnaround SLA:</span> Email & portal inquiries answered within 24 to 48 business hours.
              </div>
            </Card>

            {/* Office 3 */}
            <Card variant="elevated" className="p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xs bg-[#0B3B24]/10 flex items-center justify-center text-[#0B3B24]">
                  <Scale className="w-6 h-6 text-[#0B3B24]" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-2 !border-[#0B3B24] !text-[#0B3B24]">
                    Statutory Grievance
                  </Badge>
                  <h3 className="font-serif text-xl font-bold text-[#0B3B24]">
                    Ombudsman & Compliance
                  </h3>
                </div>
                <div className="text-xs text-[#4A5568] space-y-2 leading-relaxed">
                  <p>
                    Formal grievances, audit inquiries, and RTI disclosures are directly supervised by our Independent Fiduciary Committee.
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0B3B24] block">
                      Grievance Officer Email
                    </span>
                    <a
                      href="mailto:grievance@mahavirtrust.org"
                      className="underline text-[#0B3B24] font-medium hover:text-[#C5A059]"
                    >
                      grievance@mahavirtrust.org
                    </a>
                  </div>
                  <p className="text-[11px] text-[#4A5568] pt-1">
                    Please use tag <code className="bg-[#0B3B24]/5 px-1.5 py-0.5 rounded text-[#0B3B24] font-mono">[AUDIT_QUERY]</code> or <code className="bg-[#0B3B24]/5 px-1.5 py-0.5 rounded text-[#0B3B24] font-mono">[GRIEVANCE]</code> in subject line.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#0B3B24]/10 text-[11px] text-[#4A5568] bg-[#F7F4EE] p-3 rounded-xs">
                <span className="font-semibold text-[#0B3B24]">Grievance SLA:</span> Acknowledgment within 48h; formal written resolution within 7 working days.
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 3. Official Inquiry Desk Form */}
      <section id="inquiry-form" className="py-16 md:py-24 bg-[#F7F4EE] scroll-mt-20">
        <Container size="narrow">
          <SectionHeader
            badge="Official Correspondence"
            title="Dispatch Official Message to Secretariat"
            subtitle="All communications are logged in the central trust registry and assigned an auditable reference number."
          />

          <Card variant="elevated" className="p-8 sm:p-12 bg-[#FDFBF7]">
            {formSubmitted ? (
              <div className="p-8 bg-[#0B3B24] text-white rounded-xs space-y-5 text-center animate-in fade-in">
                <CheckCircle2 className="w-14 h-14 text-[#E4C88A] mx-auto" />
                <h3 className="font-serif text-2xl font-bold">
                  Communication Logged with Secretariat
                </h3>
                {referenceId && (
                  <div className="inline-block py-1.5 px-4 bg-black/25 border border-[#E4C88A]/30 rounded-xs">
                    <span className="text-xs uppercase tracking-wider text-[#E4C88A] font-mono font-semibold">
                      Official Reference ID: #{referenceId}
                    </span>
                  </div>
                )}
                <p className="text-sm text-white/85 leading-relaxed max-w-xl mx-auto">
                  Thank you for contacting MAHAVIR TRUST. Your inquiry has been securely stored in the secretariat registry and dispatched to the designated coordinator. A formal response will be issued within our published SLA window.
                </p>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="!border-[#E4C88A] !text-[#E4C88A] hover:!bg-[#E4C88A]/15 text-xs"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        category: "Scholarship Guidance",
                        message: "",
                      });
                    }}
                  >
                    Send Another Communication
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">Transmission Error</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="contact-name"
                    name="name"
                    label="Full Legal Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sangram Mohanty / Ananya Dash"
                  />

                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. yourname@domain.org"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    label="Contact Mobile Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    helperText="10-digit mobile number for SMS dispatch notice"
                  />

                  <Select
                    id="contact-category"
                    name="category"
                    label="Inquiry Purpose / Subject Category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={INQUIRY_CATEGORIES}
                  />
                </div>

                <Textarea
                  id="contact-message"
                  name="message"
                  label="Message Content & Context"
                  required
                  rows={5}
                  showCount
                  maxLength={2000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please state the specific details of your inquiry, scholarship application reference, or institutional proposal..."
                  helperText="Include relevant student application numbers or institutional credentials if applicable."
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full justify-center py-3.5 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Transmitting to Secretariat Registry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        <span>Dispatch Official Communication</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[11px] text-[#4A5568] text-center pt-2 leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0B3B24] inline mr-1 -mt-0.5" />
                  <strong>Statutory Guarantee:</strong> MAHAVIR TRUST never shares, sells, or monetizes inquiry data. All submissions are processed strictly for educational administration and statutory fiduciary compliance.
                </p>
              </form>
            )}
          </Card>
        </Container>
      </section>

      {/* 4. Statutory Grievance Redressal Protocol & Ombudsman Oversight */}
      <section id="grievance-charter" className="py-16 md:py-24 bg-[#0B3B24] text-white scroll-mt-20">
        <Container size="default">
          <SectionHeader
            badge="Fiduciary Safeguards"
            title="Three-Tier Grievance Redressal Architecture"
            subtitle="In strict accordance with the Indian Trusts Act, 1882 and Section 12AB transparency norms, every beneficiary and citizen has an inviolable right to fair redressal."
            theme="dark"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1 */}
            <Card variant="dark" className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold">Tier 1: Secretariat</Badge>
                <span className="text-[11px] font-mono text-[#E4C88A]">48–72 Hours</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Secretariat Operations Desk
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                First-line resolution for application queries, portal documentation difficulties, and disbursal timeline status. Addressed directly by program coordinators.
              </p>
              <div className="text-[11px] text-[#E4C88A] pt-2 border-t border-white/10">
                Action: Handled via electronic desk with logged ticket tracking.
              </div>
            </Card>

            {/* Tier 2 */}
            <Card variant="dark" className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold">Tier 2: Ombudsman</Badge>
                <span className="text-[11px] font-mono text-[#E4C88A]">Up to 7 Days</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Fiduciary Ombudsman Committee
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Appellate review for disputed eligibility determinations, verification disagreements, or unaddressed Tier 1 tickets. Supervised by an independent senior trustee.
              </p>
              <div className="text-[11px] text-[#E4C88A] pt-2 border-t border-white/10">
                Action: Formal case re-examination with written findings dispatch.
              </div>
            </Card>

            {/* Tier 3 */}
            <Card variant="dark" className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="gold">Tier 3: Board</Badge>
                <span className="text-[11px] font-mono text-[#E4C88A]">Quarterly Docket</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Board of Trustees Statutory Review
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Final internal authority for institutional policy appeals, whistleblower reports, or statutory audit grievances. Placed directly on the formal quarterly Board docket.
              </p>
              <div className="text-[11px] text-[#E4C88A] pt-2 border-t border-white/10">
                Action: Minute-recorded Board resolution with statutory audit filing.
              </div>
            </Card>
          </div>

          {/* Anti-Fraud Notice */}
          <div className="mt-12 p-6 sm:p-8 rounded-xs bg-[#082617] border border-[#C5A059]/30 text-white/90 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-12 h-12 rounded-xs bg-[#C5A059]/20 flex items-center justify-center text-[#E4C88A] shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-serif text-lg font-bold text-[#E4C88A]">
                Critical Statutory Notice: Zero-Tolerance Policy for Intermediaries & Fees
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                MAHAVIR TRUST charges <strong>zero fees</strong> at any stage of application, verification, or grievance submission. We never employ third-party touts or commission agents. If any individual or entity solicits money claiming to expedite your scholarship or fellowship, report the incident immediately with proof to <code className="text-[#E4C88A] font-mono">grievance@mahavirtrust.org</code>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
