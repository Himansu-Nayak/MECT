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
  Building2,
  GraduationCap,
  HeartHandshake,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Users,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { submitInquiry } from "@/lib/api";
import { MECT_ORG } from "@/config/org";
import { ORG } from "@content/org";

const INQUIRY_CATEGORIES: SelectOption[] = [
  { value: "General", label: "General" },
  { value: "Grievance", label: "Grievance" },
  { value: "RTI", label: "RTI" },
  { value: "CSR", label: "CSR" },
  { value: "Scholarship", label: "Scholarship" },
  { value: "Volunteer", label: "Volunteer" },
];

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consentDeclared, setConsentDeclared] = useState(true);
  const [gotcha, setGotcha] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentDeclared) {
      setErrorMessage("Please confirm the data privacy and accuracy acknowledgment before submitting.");
      return;
    }
    if (formData.message.trim().length > 1000) {
      setErrorMessage("Message must not exceed 1000 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          category: formData.category,
          message: formData.message.trim(),
          _gotcha: gotcha,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setReferenceId(data.referenceId || null);
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
    <div className="flex flex-col w-full pb-floating-clearance">
      {/* 1. Page Hero */}
      <PageHero
        title="Public Secretariat Inquiry & Guidance Desk"
        description="Official communications and administrative guidance desk for students, educational institutions, donors, CSR partners, and community stakeholders across Odisha."
        breadcrumbs={[{ label: "Public Secretariat Inquiry" }]}
        actions={
          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#inquiry-form">
              <Button variant="primary" className="!bg-sand !text-forest-deep hover:!bg-cream">
                Submit Official Inquiry
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <a href="#direct-desks">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Direct Contact Desks
              </Button>
            </a>
            <a href="#secretariat-directory">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Secretariat Offices
              </Button>
            </a>
            <a href="#handling-framework">
              <Button variant="outline" className="!border-white/30 !text-white hover:!bg-white/10">
                Inquiry Handling Process
              </Button>
            </a>
          </div>
        }
      />

      {/* 2. Direct Institutional Guidance & Channel Routing */}
      <section id="direct-desks" className="py-16 md:py-20 bg-cream scroll-mt-20 border-b border-border-warm">
        <Container size="default">
          <SectionHeader
            badge="Direct Institutional Channels"
            title="Reach the Appropriate Functional Desk"
            subtitle="To ensure your communication reaches the responsible trustee or programme team without delay, please consult these specialized institutional desks."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Channel 1: Scholarships & Student Support */}
            <Card variant="elevated" className="p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-terracotta">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xs bg-sand-light flex items-center justify-center text-terracotta-dark">
                  <GraduationCap className="w-5 h-5 text-terracotta-dark" />
                </div>
                <div>
                  <Badge variant="terracotta" className="mb-1.5">Scholarships &amp; Grants</Badge>
                  <h3 className="font-serif text-lg font-bold text-terracotta-dark">
                    Student Support Desk
                  </h3>
                </div>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Direct grant disbursal inquiries, college fee assistance documentation, and eligibility criteria for degree and vocational students across Odisha.
                </p>
                <div className="pt-2 border-t border-border-warm text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                    Direct Email
                  </span>
                  <a
                    href="mailto:mect220@gmail.com"
                    className="text-terracotta-dark font-medium underline hover:text-forest break-all block"
                  >
                    mect220@gmail.com
                  </a>
                </div>
              </div>
              <div className="pt-3 border-t border-border-warm text-[11px] text-ink bg-sand-light p-2.5 rounded-xs">
                <span className="font-semibold text-forest">Application Cycle:</span> Announced periodically per Trust schedule.
              </div>
            </Card>

            {/* Channel 2: Donations & CSR Collaboration */}
            <Card variant="elevated" className="p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-terracotta">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xs bg-sand-light flex items-center justify-center text-terracotta-dark">
                  <HeartHandshake className="w-5 h-5 text-terracotta-dark" />
                </div>
                <div>
                  <Badge variant="gold" className="mb-1.5">Philanthropy &amp; CSR</Badge>
                  <h3 className="font-serif text-lg font-bold text-terracotta-dark">
                    Donations &amp; CSR Desk
                  </h3>
                </div>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Statutory donation receipts, NEFT/RTGS bank transfer confirmations, CSR Schedule VII partnership agreements, and corporate philanthropic inquiries.
                </p>
                <div className="pt-2 border-t border-border-warm text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                    Direct Email
                  </span>
                  <a
                    href="mailto:mect220@gmail.com"
                    className="text-terracotta-dark font-medium underline hover:text-forest break-all block"
                  >
                    mect220@gmail.com
                  </a>
                </div>
              </div>
              <div className="pt-3 border-t border-border-warm text-[11px] text-ink bg-sand-light p-2.5 rounded-xs">
                <span className="font-semibold text-forest">MCA CSR Reg:</span> {ORG.ids.csr1} (ROC Delhi)
              </div>
            </Card>

            {/* Channel 3: Field Programmes & Community Activity */}
            <Card variant="elevated" className="p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-terracotta">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xs bg-sand-light flex items-center justify-center text-terracotta-dark">
                  <Users className="w-5 h-5 text-terracotta-dark" />
                </div>
                <div>
                  <Badge variant="forest" className="mb-1.5">Field Operations</Badge>
                  <h3 className="font-serif text-lg font-bold text-terracotta-dark">
                    Community Initiatives
                  </h3>
                </div>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Remedial learning study centers in rural Balangir, women&apos;s vocational tailoring cohorts, seasonal Jal Seva kiosks, and volunteer participation.
                </p>
                <div className="pt-2 border-t border-border-warm text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                    Contact Line
                  </span>
                  <a
                    href={ORG.helpline.href}
                    className="text-terracotta-dark font-medium underline hover:text-forest block"
                  >
                    {ORG.helpline.display}
                  </a>
                </div>
              </div>
              <div className="pt-3 border-t border-border-warm text-[11px] text-ink bg-sand-light p-2.5 rounded-xs">
                <span className="font-semibold text-forest">Office Hours:</span> Mon–Sat, 10:00–17:30 IST
              </div>
            </Card>

            {/* Channel 4: Statutory Administration */}
            <Card variant="elevated" className="p-6 space-y-4 flex flex-col justify-between border-t-4 border-t-terracotta">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xs bg-sand-light flex items-center justify-center text-terracotta-dark">
                  <FileCheck2 className="w-5 h-5 text-terracotta-dark" />
                </div>
                <div>
                  <Badge variant="neutral" className="mb-1.5">Statutory Governance</Badge>
                  <h3 className="font-serif text-lg font-bold text-terracotta-dark">
                    Secretariat &amp; Records
                  </h3>
                </div>
                <p className="text-xs text-ink-sand leading-relaxed">
                  Registered Trust Deed verification, PAN records, public inspection disclosures, and official institutional correspondence.
                </p>
                <div className="pt-2 border-t border-border-warm text-xs space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-forest block">
                    General Email
                  </span>
                  <a
                    href={`mailto:${ORG.emails.general}`}
                    className="text-terracotta-dark font-medium underline hover:text-forest break-all block"
                  >
                    {ORG.emails.general}
                  </a>
                </div>
              </div>
              <div className="pt-3 border-t border-border-warm text-[11px] text-ink bg-sand-light p-2.5 rounded-xs">
                <span className="font-semibold text-forest">Institutional Status:</span> Registered Public Charitable Trust (Govt. of Odisha)
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 3. Institutional Administration & Regional Representation */}
      <section id="secretariat-directory" className="py-16 md:py-20 bg-white scroll-mt-20 border-b border-border-warm">
        <Container size="default">
          <SectionHeader
            badge="Institutional Administration"
            title="Institutional Headquarters & Secretariat"
            subtitle="Mahaveer Educational & Charitable Trust (MECT) operates its primary office and administrative secretariat in Bhubaneswar, Odisha."
          />

          <div className="max-w-3xl mx-auto">
            {/* Primary Office: Bhubaneswar Headquarters */}
            <Card variant="elevated" className="p-8 sm:p-10 space-y-6 border-t-4 border-t-terracotta">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xs bg-cream flex items-center justify-center text-terracotta-dark">
                    <Building2 className="w-6 h-6 text-terracotta-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-terracotta-dark">
                      MECT Headquarters &amp; Secretariat
                    </h3>
                    <span className="text-xs text-ink-sand block mt-0.5">
                      Official Public Charitable Trust Headquarters &amp; State Coordination
                    </span>
                  </div>
                </div>
                <Badge variant="forest">Official Office</Badge>
              </div>

              <div className="text-xs sm:text-sm text-ink-sand space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <span className="font-semibold text-forest shrink-0">Official Address:</span>
                  <span className="text-forest font-medium">
                    A1, 3rd Floor, Plot No. 387, Lewis Plaza, Lewis Road, BJB Nagar, Bhubaneswar, Odisha – 751014, India
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-forest shrink-0">Primary Email:</span>
                  <a
                    href="mailto:mectbbsr13@gmail.com"
                    className="text-terracotta-dark font-mono font-semibold underline hover:text-forest"
                  >
                    mectbbsr13@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-forest shrink-0">Working Hours:</span>
                  <span>Monday – Saturday, 10:00 – 17:30 IST</span>
                </div>
                <div className="pt-2">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Plot+No.+387,+Lewis+Plaza,+Lewis+Road,+BJB+Nagar,+Bhubaneswar,+Odisha+751014"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cream border border-border-warm rounded-xs text-xs font-semibold text-terracotta-dark hover:bg-sand/40 transition-colors shadow-xs"
                  >
                    <span>View Location on Google Maps (Lewis Plaza, Bhubaneswar)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-border-warm text-xs text-ink bg-cream/70 p-4 rounded-xs space-y-1.5">
                <div>
                  <strong className="text-forest">Field Operations &amp; Outreach:</strong> Education study centers, women&apos;s vocational cohorts, safe water kiosks, and rural welfare initiatives across Odisha.
                </div>
                <div>
                  <strong className="text-forest">Public Appointments:</strong> Institutional, academic, and CSR partner meetings may be scheduled through the Secretariat Inquiry Desk below.
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 4. Public Secretariat Inquiry Form */}
      <section id="inquiry-form" className="py-16 md:py-24 bg-cream scroll-mt-20">
        <Container size="narrow">
          <SectionHeader
            badge="Official Inquiry Desk"
            title="Submit Secretariat Communication"
            subtitle="All communications are recorded in the central Trust registry and assigned an official tracking reference ID."
          />

          <Card variant="elevated" className="p-8 sm:p-12 bg-white">
            <noscript>
              <div className="p-4 mb-6 bg-sand-light border border-border-warm rounded-xs text-xs text-ink space-y-2">
                <p className="font-semibold text-forest">JavaScript is disabled in your browser.</p>
                <p>
                  You can reach the Secretariat directly by email at{" "}
                  <a href={`mailto:${ORG.emails.general}`} className="underline font-semibold text-terracotta-dark">
                    {ORG.emails.general}
                  </a>{" "}
                  or call our official registered line{" "}
                  <a href={ORG.helpline.href} className="underline font-semibold text-terracotta-dark">
                    {ORG.helpline.display}
                  </a>{" "}
                  ({ORG.helpline.hours}, {MECT_ORG.contact.workingDays}).
                </p>
              </div>
            </noscript>

            {formSubmitted ? (
              <div className="p-8 bg-forest text-white rounded-xs space-y-5 text-center animate-in fade-in">
                <CheckCircle2 className="w-14 h-14 text-sand mx-auto" />
                <h3 className="font-serif text-2xl font-bold">
                  Inquiry Logged in Secretariat Registry
                </h3>
                {referenceId && (
                  <div className="inline-block py-2 px-5 bg-black/25 border border-sand/40 rounded-xs">
                    <span className="text-sm uppercase tracking-wider text-cream font-mono font-bold">
                      Official Reference ID: #{referenceId}
                    </span>
                  </div>
                )}
                <p className="text-sm text-white/90 leading-relaxed max-w-xl mx-auto">
                  Thank you for contacting Mahaveer Educational &amp; Charitable Trust (MECT). Your message has been entered into the central Trust registry and routed to the responsible administrative coordinator. An official response will be issued via email or telephone following review.
                </p>

                <div className="pt-4 border-t border-white/20 text-xs text-left max-w-md mx-auto space-y-2">
                  <span className="font-bold text-sand block uppercase tracking-wider text-[11px]">
                    What Happens Next:
                  </span>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-sand">1.</span>
                    <span>Reference #{referenceId} is registered in the institutional intake log.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-sand">2.</span>
                    <span>Secretariat reviews content and directs to scholarship, donation, or programme coordinators.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-sand">3.</span>
                    <span>Direct written or telephone response dispatched using official Trust contacts only.</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="!border-sand !text-white hover:!bg-white/15 text-xs"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        category: "General",
                        message: "",
                      });
                      setGotcha("");
                    }}
                  >
                    Submit Another Communication
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div style={{ display: "none" }} aria-hidden="true">
                  <label htmlFor="inquiry-gotcha">Do not fill this field</label>
                  <input
                    id="inquiry-gotcha"
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    value={gotcha}
                    onChange={(e) => setGotcha(e.target.value)}
                  />
                </div>
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xs text-xs flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">Submission Notice</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="inquiry-name"
                    name="name"
                    label="Full Legal Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />

                  <Input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    label="Contact Mobile Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98XXXXXXXX"
                    helperText="10-digit mobile number for official contact"
                  />

                  <Select
                    id="inquiry-category"
                    name="category"
                    label="Inquiry Purpose / Subject Category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={INQUIRY_CATEGORIES}
                  />
                </div>

                <Textarea
                  id="inquiry-message"
                  name="message"
                  label="Message Content & Context"
                  required
                  rows={5}
                  showCount
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please state the specific details of your inquiry, scholarship application reference, or institutional proposal..."
                  helperText="Maximum 1000 characters. Include relevant student application numbers or institutional credentials if applicable."
                />

                <div className="pt-2 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="inquiry-consent"
                    checked={consentDeclared}
                    onChange={(e) => setConsentDeclared(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border-warm text-terracotta focus:ring-terracotta"
                  />
                  <label htmlFor="inquiry-consent" className="text-xs text-ink-sand leading-relaxed cursor-pointer">
                    I confirm that the details provided are accurate and understand that communications are processed under the Trust&apos;s data minimization and privacy standards strictly for institutional correspondence.
                  </label>
                </div>

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

                <p className="text-[11px] text-ink-sand text-center pt-2 leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta-dark inline mr-1 -mt-0.5" />
                  <strong>Statutory Privacy Guarantee:</strong> Mahaveer Educational &amp; Charitable Trust (MECT) never shares, sells, or monetizes inquiry data. All submissions are processed strictly for educational administration and statutory compliance and public accountability.
                </p>
              </form>
            )}
          </Card>
        </Container>
      </section>

      {/* 5. Institutional Inquiry Handling Framework */}
      <section id="handling-framework" className="py-16 md:py-20 bg-white border-t border-border-warm scroll-mt-20">
        <Container size="default">
          <SectionHeader
            badge="Institutional Governance"
            title="How Inquiries Are Handled"
            subtitle="Mahaveer Educational & Charitable Trust follows a structured, transparent process to ensure all community and institutional inquiries receive prompt and traceable attention."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card variant="elevated" className="p-8 space-y-4 border-t-4 border-t-terracotta">
              <div className="flex items-center justify-between">
                <Badge variant="terracotta">Stage 1</Badge>
                <span className="text-[11px] font-mono text-ink-sand">Central Intake</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-terracotta-dark">
                Registry Intake &amp; Reference
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                All electronic communications and physical dispatches are catalogued in the central Trust intake registry with a timestamped reference ID to prevent lost correspondence.
              </p>
              <div className="text-[11px] text-forest pt-2 border-t border-border-warm font-medium">
                Standard: Auditable tracking assigned to each transmission.
              </div>
            </Card>

            {/* Step 2 */}
            <Card variant="elevated" className="p-8 space-y-4 border-t-4 border-t-terracotta">
              <div className="flex items-center justify-between">
                <Badge variant="gold">Stage 2</Badge>
                <span className="text-[11px] font-mono text-ink-sand">Internal Review</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-terracotta-dark">
                Secretariat &amp; Functional Routing
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                Inquiries are reviewed by the Secretariat and routed to the designated desk: Scholarship Committee, Donation Accounts, Balangir Field Team, or Governance Administration.
              </p>
              <div className="text-[11px] text-forest pt-2 border-t border-border-warm font-medium">
                Standard: Directly examined by responsible programme coordinators.
              </div>
            </Card>

            {/* Step 3 */}
            <Card variant="elevated" className="p-8 space-y-4 border-t-4 border-t-terracotta">
              <div className="flex items-center justify-between">
                <Badge variant="forest">Stage 3</Badge>
                <span className="text-[11px] font-mono text-ink-sand">Direct Dispatch</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-terracotta-dark">
                Direct Trust Follow-Up
              </h3>
              <p className="text-xs text-ink-sand leading-relaxed">
                Responses are communicated directly through verified Trust email (<code>{ORG.emails.general}</code>) or registered office telephone lines (<code>{ORG.helpline.display}</code>). No third parties or touts are engaged.
              </p>
              <div className="text-[11px] text-forest pt-2 border-t border-border-warm font-medium">
                Standard: Authentic institutional channels without middlemen.
              </div>
            </Card>
          </div>

          {/* Anti-Fraud Notice */}
          <div className="mt-12 p-6 sm:p-8 rounded-xs bg-forest border border-sand/45 text-white flex flex-col md:flex-row items-start md:items-center gap-6 shadow-md">
            <div className="w-12 h-12 rounded-xs bg-terracotta border border-sand/45 flex items-center justify-center text-sand shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-serif text-lg font-bold text-white">
                Zero-Tolerance Notice: No Intermediaries or Processing Fees
              </h4>
              <p className="text-xs text-white/90 leading-relaxed">
                Mahaveer Educational &amp; Charitable Trust (MECT) charges <strong>zero fees</strong> at any stage of inquiry, scholarship application, or volunteer registration. We never employ third-party touts or commission brokers. If any individual or entity solicits money claiming to expedite your scholarship or request, report it immediately to <code className="text-cream font-mono underline">{ORG.emails.general}</code> or our helpline <code className="text-cream font-mono underline">{ORG.helpline.display}</code>.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
