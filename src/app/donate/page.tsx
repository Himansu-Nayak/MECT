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
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TRUST_CONFIG } from "@/lib/config";
import { submitInquiry } from "@/lib/api";
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Landmark,
  Calculator,
  Download,
  AlertCircle,
  Building2,
  Send,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Scissors,
  Droplets,
  Utensils,
  Copy,
  Check,
} from "lucide-react";

export default function DonatePage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 80G Tax Calculator State
  const [donationAmount, setDonationAmount] = useState<number>(10000);
  const [taxBracket, setTaxBracket] = useState<number>(0.3); // 30% default

  // Donor Receipt Claim State
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);
  const [receiptRefId, setReceiptRefId] = useState<number | null>(null);
  const [receiptIsSubmitting, setReceiptIsSubmitting] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  const [donorData, setDonorData] = useState({
    fullName: "",
    pan: "",
    email: "",
    phone: "",
    address: "",
    district: "Balangir",
    state: "Odisha",
    pin: "767001",
    amount: "10000",
    utrNumber: "",
    programme: "Higher Education Tuition Grants",
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptIsSubmitting(true);
    setReceiptError(null);

    // Validate PAN format (Basic 10-char regex)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(donorData.pan.trim().toUpperCase())) {
      setReceiptError("Please enter a valid 10-character Permanent Account Number (PAN) required for your Section 80G tax exemption certificate.");
      setReceiptIsSubmitting(false);
      return;
    }

    try {
      const response = await submitInquiry({
        fullName: donorData.fullName.trim(),
        email: donorData.email.trim(),
        phone: donorData.phone.trim(),
        category: "Donation 80G Tax Receipt Request",
        message: `[Section 80G Tax Exemption Receipt Claim]\nDonor Name: ${donorData.fullName.trim()}\nPAN: ${donorData.pan.trim().toUpperCase()}\nDonated Amount: ₹${donorData.amount}\nUTR / Bank Ref: ${donorData.utrNumber.trim()}\nProgramme: ${donorData.programme}\nPostal Address: ${donorData.address.trim()}, ${donorData.district}, ${donorData.state} - ${donorData.pin}\n\nNotice: Please issue official stamped Form 10BE donation certificate.`,
      });
      setReceiptRefId(response.referenceId || null);
      setReceiptSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setReceiptError(err.message);
      } else {
        setReceiptError("Unable to register donor receipt claim. Please try again or email your UTR to contact@mect.org.in.");
      }
    } finally {
      setReceiptIsSubmitting(false);
    }
  };

  const eligibleDeduction = donationAmount * 0.5;
  const estimatedTaxSaved = eligibleDeduction * taxBracket;

  const getImpactDescription = (amount: number) => {
    if (amount < 3000) {
      return "Sponsors 1 month of remedial rural coaching and textbook sets for 2 secondary school students in Balangir.";
    } else if (amount < 8000) {
      return "Provides a certified rural woman artisan with a professional sewing machine and fabrication toolkit.";
    } else if (amount < 20000) {
      return "Funds full 1-semester accredited degree college tuition fees for an underprivileged undergraduate scholar.";
    } else {
      return "Operates a full summer Jal Seva clean drinking water kiosk serving 1,000+ heatwave commuters and hospital visitors.";
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. Page Hero */}
      <PageHero
        badge="Section 80G Certified • 50% Tax Deduction"
        title="Transform Lives in Odisha Through 80G Tax-Deductible Philanthropy"
        description="Every contribution to Mahaveer Educational & Charitable Trust directly funds college tuition grants, rural women's tailoring livelihood labs, safe drinking water kiosks, and hospital food relief under an audited zero-cash policy."
        breadcrumbs={[{ label: "Donate (80G Tax Benefit)" }]}
        actions={
          <>
            <Link href="#bank-details">
              <Button variant="gold" size="sm">
                <span>Direct Bank RTGS/NEFT</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="#calculator">
              <Button variant="dark-outline" size="sm">
                <Calculator className="w-3.5 h-3.5 mr-1 text-[#E4C88A]" />
                <span>80G Tax Calculator</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Top Statutory Reassurance Ribbon */}
      <section className="py-6 bg-[#0A192F] text-white border-b border-[#C5A059]/30">
        <Container size="default">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span><strong>80G Order URN:</strong> {TRUST_CONFIG.statutory.section80GUrn}</span>
              <span className="text-white/40">•</span>
              <span><strong>DIN:</strong> {TRUST_CONFIG.statutory.section80GDin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#C5A059]" />
              <span><strong>Trust PAN:</strong> {TRUST_CONFIG.statutory.pan}</span>
              <span className="text-white/40">•</span>
              <span className="text-[#86EFAC] font-semibold">Valid AY 2024-25 to AY 2026-27</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Interactive Section 80G Tax Deduction Calculator */}
      <section id="calculator" className="py-20 md:py-28 bg-[#FDFBF7]">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Interactive Tax Estimator"
            title="Section 80G Tax Deduction Calculator"
            subtitle="Calculate your eligible income tax deduction under Section 80G of the Indian Income Tax Act, 1961."
            align="center"
          />

          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xs border-2 border-[#C5A059]/40 shadow-xl space-y-8">
            {/* Quick Donation Selector Buttons */}
            <div>
              <span className="text-xs uppercase font-bold text-[#7A5E24] tracking-wider block mb-3 font-sans">
                Select or Enter Contribution Amount (₹ INR):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[2500, 5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={`py-3 px-4 rounded-xs text-sm font-bold border transition-all ${
                      donationAmount === amt
                        ? "bg-[#0A192F] text-[#E4C88A] border-[#C5A059] shadow-sm"
                        : "bg-[#F4EFE6] text-[#0A192F] border-[#0A192F]/10 hover:border-[#C5A059]"
                    }`}
                  >
                    ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount & Tax Slab Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-[#0A192F] block mb-1 font-sans">
                  Custom Donation Amount (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#7A5E24]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xs border border-[#0A192F]/20 text-base font-bold text-[#0A192F] focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0A192F] block mb-1 font-sans">
                  Your Applicable Income Tax Slab:
                </label>
                <select
                  value={taxBracket}
                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#0A192F]/20 text-sm font-semibold text-[#0A192F] focus:border-[#C5A059] focus:outline-none bg-white"
                >
                  <option value={0.3}>30% Slab (Highest Income Bracket)</option>
                  <option value={0.2}>20% Slab (Middle Income Bracket)</option>
                  <option value={0.1}>10% Slab (Lower Income Bracket)</option>
                  <option value={0.05}>5% Slab (Entry Income Bracket)</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-6 rounded-xs bg-[#0A192F] text-white border border-[#C5A059]/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/5 rounded-xs border border-white/10 space-y-1">
                  <span className="text-[11px] text-white/60 font-sans block">Your Contribution</span>
                  <span className="text-2xl font-serif font-bold text-white">
                    ₹{donationAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-xs border border-white/10 space-y-1">
                  <span className="text-[11px] text-[#C5A059] font-sans block">80G Eligible Deduction (50%)</span>
                  <span className="text-2xl font-serif font-bold text-[#E4C88A]">
                    ₹{eligibleDeduction.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-[#15803D]/20 rounded-xs border border-[#15803D]/40 space-y-1">
                  <span className="text-[11px] text-[#86EFAC] font-sans block">Estimated Tax Saved</span>
                  <span className="text-2xl font-serif font-bold text-[#86EFAC]">
                    ₹{Math.round(estimatedTaxSaved).toLocaleString("en-IN")}*
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-start gap-3 text-xs text-white/80 font-sans">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong>Tangible Ground Impact:</strong> {getImpactDescription(donationAmount)}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Direct Bank Remittance (RTGS / NEFT / IMPS) */}
      <section id="bank-details" className="py-20 bg-[#F4EFE6] border-y border-[#0A192F]/10">
        <Container size="default" className="space-y-12">
          <SectionHeader
            badge="Direct Domestic Giving"
            title="Official Bank Account Details for 80G Donations"
            subtitle="Remit contributions directly via NEFT, RTGS, IMPS, or Net Banking straight into MECT's verified institutional account."
            align="center"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-[#C5A059]/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#0A192F]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-[#0A192F] text-[#E4C88A] flex items-center justify-center border border-[#C5A059]/40">
                  <Landmark className="w-5 h-5 text-[#E4C88A]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0A192F]">
                    {TRUST_CONFIG.bank.bankName}
                  </h3>
                  <p className="text-xs text-[#7A5E24] font-medium font-sans">
                    {TRUST_CONFIG.bank.branch}
                  </p>
                </div>
              </div>
              <Badge variant="forest" size="sm">
                Active Account
              </Badge>
            </div>

            <div className="space-y-3.5 font-sans text-xs">
              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10">
                <div>
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold block">Beneficiary Name</span>
                  <span className="text-sm font-bold text-[#0A192F] block mt-0.5">{TRUST_CONFIG.bank.accountName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(TRUST_CONFIG.bank.accountName, "name")}
                  className="p-1.5 text-[#0A192F] hover:bg-[#0A192F]/10 rounded-xs transition-colors"
                  title="Copy Name"
                >
                  {copiedField === "name" ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10">
                <div>
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold block">Account Number</span>
                  <span className="text-base font-mono font-bold text-[#7A5E24] block mt-0.5">{TRUST_CONFIG.bank.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(TRUST_CONFIG.bank.accountNumber, "acc")}
                  className="p-1.5 text-[#0A192F] hover:bg-[#0A192F]/10 rounded-xs transition-colors"
                  title="Copy Account Number"
                >
                  {copiedField === "acc" ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10">
                <div>
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold block">IFSC Code (RTGS / NEFT)</span>
                  <span className="text-base font-mono font-bold text-[#0A192F] block mt-0.5">{TRUST_CONFIG.bank.ifsc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(TRUST_CONFIG.bank.ifsc, "ifsc")}
                  className="p-1.5 text-[#0A192F] hover:bg-[#0A192F]/10 rounded-xs transition-colors"
                  title="Copy IFSC Code"
                >
                  {copiedField === "ifsc" ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FDFBF7] rounded-xs border border-[#0A192F]/10">
                <div>
                  <span className="text-[10px] text-[#4A5568] uppercase font-bold block">MICR Code</span>
                  <span className="text-sm font-mono text-[#0A192F] block mt-0.5">{TRUST_CONFIG.bank.micr}</span>
                </div>
                <span className="text-[10px] text-[#15803D] font-bold">Domestic Transfer</span>
              </div>
            </div>

            <div className="p-4 bg-[#0A192F] text-white rounded-xs space-y-2 text-xs font-sans">
              <span className="text-[11px] font-bold text-[#E4C88A] uppercase tracking-wider block">
                Next Step: Claim Your 80G Tax Receipt Below
              </span>
              <p className="text-white/80 leading-relaxed">
                After completing your bank transfer, please fill out the confirmation form below with your transaction UTR number and PAN so we can issue your official stamped receipt and file Form 10BD with the Income Tax Department.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Donor 80G Receipt Claim & KYC Capture Form */}
      <section id="receipt-claim" className="py-20 md:py-28 bg-[#FDFBF7] scroll-mt-16">
        <Container size="default">
          <SectionHeader
            badge="Tax Compliance & Receipt Desk"
            title="Confirm Donation & Request 80G Tax Exemption Certificate"
            subtitle="Submit your bank transaction reference and Permanent Account Number (PAN) for statutory Form 10BE certificate issuance."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-[#C5A059]/40 shadow-xl">
            {receiptSubmitted ? (
              <div className="p-8 bg-[#0A192F] text-white rounded-xs space-y-4 text-center animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-[#E4C88A] mx-auto" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-bold">
                  80G Receipt Request Successfully Logged
                </h3>
                {receiptRefId && (
                  <p className="text-sm font-mono text-[#E4C88A] bg-black/25 py-1.5 px-4 rounded inline-block">
                    Secretariat Acknowledgment Ref: #{receiptRefId}
                  </p>
                )}
                <div className="p-4 bg-white/5 rounded-xs border border-white/10 text-xs text-white/85 text-left space-y-1.5 font-sans">
                  <div><strong>Donor Name:</strong> {donorData.fullName}</div>
                  <div><strong>Permanent Account Number (PAN):</strong> {donorData.pan.toUpperCase()}</div>
                  <div><strong>Confirmed Amount:</strong> ₹{Number(donorData.amount).toLocaleString("en-IN")}</div>
                  <div><strong>Bank UTR Reference:</strong> {donorData.utrNumber}</div>
                  <div><strong>80G Registration URN:</strong> {TRUST_CONFIG.statutory.section80GUrn}</div>
                </div>
                <p className="text-xs text-white/80 leading-relaxed max-w-md mx-auto font-sans">
                  Our Accounts Secretariat will verify the bank credit and email your stamped 80G receipt within 1-2 business days. Your donation will also be included in our annual Form 10BD filing for auto-population in your ITR.
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    setReceiptSubmitted(false);
                    setDonorData({
                      fullName: "",
                      pan: "",
                      email: "",
                      phone: "",
                      address: "",
                      district: "Balangir",
                      state: "Odisha",
                      pin: "767001",
                      amount: "10000",
                      utrNumber: "",
                      programme: "Higher Education Tuition Grants",
                    });
                  }}
                  className="mt-2 font-bold"
                >
                  Submit Another Donation Confirmation
                </Button>
              </div>
            ) : (
              <form onSubmit={handleReceiptSubmit} className="space-y-4">
                {receiptError && (
                  <div
                    className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{receiptError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="donor-name"
                    label="Donor Full Name (As per PAN) *"
                    required
                    value={donorData.fullName}
                    onChange={(e) => setDonorData({ ...donorData, fullName: e.target.value })}
                    placeholder="e.g. Subhashree Mohanty"
                  />
                  <Input
                    id="donor-pan"
                    label="Permanent Account Number (PAN) *"
                    required
                    value={donorData.pan}
                    onChange={(e) => setDonorData({ ...donorData, pan: e.target.value.toUpperCase() })}
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="donor-email"
                    type="email"
                    label="Email Address (For Tax Receipt) *"
                    required
                    value={donorData.email}
                    onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                    placeholder="subhashree@example.com"
                  />
                  <Input
                    id="donor-phone"
                    type="tel"
                    label="Phone / Mobile Number *"
                    required
                    value={donorData.phone}
                    onChange={(e) => setDonorData({ ...donorData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    id="donor-amount"
                    type="number"
                    label="Remitted Donation Amount (₹) *"
                    required
                    value={donorData.amount}
                    onChange={(e) => setDonorData({ ...donorData, amount: e.target.value })}
                    placeholder="10000"
                  />
                  <Input
                    id="donor-utr"
                    label="Bank Transaction UTR / Ref Number *"
                    required
                    value={donorData.utrNumber}
                    onChange={(e) => setDonorData({ ...donorData, utrNumber: e.target.value })}
                    placeholder="e.g. UBINR520261105..."
                  />
                </div>

                <Select
                  id="donor-prog"
                  label="Designated Programme Track *"
                  value={donorData.programme}
                  onChange={(e) => setDonorData({ ...donorData, programme: e.target.value })}
                  options={[
                    { value: "Higher Education Tuition Grants", label: "Higher Education Tuition Grants (Odisha)" },
                    { value: "Remedial Rural Education (Balangir)", label: "Remedial Rural Education (Balangir)" },
                    { value: "Women Vocational Tailoring & Livelihood", label: "Women's Vocational Tailoring & Livelihood" },
                    { value: "Safe Drinking Water - Jal Seva", label: "Safe Drinking Water - Jal Seva" },
                    { value: "Hospital Food Relief - Jan Ahar", label: "Hospital Food Relief - Jan Ahar" },
                    { value: "General Charitable Corpus Fund", label: "General Charitable Corpus Fund" },
                  ]}
                />

                <Textarea
                  id="donor-address"
                  label="Complete Postal Address with PIN (Mandatory for Form 10BD/10BE Filing) *"
                  required
                  rows={2}
                  value={donorData.address}
                  onChange={(e) => setDonorData({ ...donorData, address: e.target.value })}
                  placeholder="Plot/Flat No, Street, Landmark, City, State - PIN..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={receiptIsSubmitting}
                  className="w-full justify-center shadow-md font-bold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  <span>Transmit 80G Receipt Confirmation</span>
                </Button>

                <p className="text-[11px] text-[#4A5568] text-center italic font-sans">
                  Regulated under CBDT Form 10AC Section 80G Order URN: {TRUST_CONFIG.statutory.section80GUrn}.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
