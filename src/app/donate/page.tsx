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
import { COMPLIANCE } from "@content/compliance";
import { submitInquiry } from "@/lib/api";
import { SbiDonationSection } from "@/components/sections/SbiDonationSection";
import { SmartDonationCheckout } from "@/components/sections/SmartDonationCheckout";
import { TaxStatusNotice } from "@/components/compliance/TaxStatusNotice";
import {
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Calculator,
  AlertCircle,
  Send,
  ArrowRight,
} from "lucide-react";

export default function DonatePage() {
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
    programme: "Free Education for 200 Students",
  });

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
    <div className="flex flex-col w-full pb-floating-clearance">
      {/* 1. Page Hero */}
      <PageHero
        badge="State Bank of India • Direct Institutional Remittance"
        title="SUPPORT OUR MISSION — DONATE NOW"
        description="Every contribution to Mahaveer Educational & Charitable Trust directly supports Free Education for 200 Students, college tuition relief, rural women's vocational training, safe drinking water, and community nutrition in Odisha."
        breadcrumbs={[{ label: "Donate" }]}
        actions={
          <>
            <Link href="#bank-details">
              <Button variant="gold" size="sm">
                <span>SBI QR &amp; Bank Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="#receipt-claim">
              <Button variant="dark-outline" size="sm">
                <Receipt className="w-3.5 h-3.5 mr-1 text-cream" />
                <span>Submit UTR &amp; Claim Receipt</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* 2. Top Statutory & Tax Status Notice */}
      <section className="py-5 bg-cream-dark/60 border-b border-border-warm">
        <Container size="default">
          <TaxStatusNotice variant="light" />
        </Container>
      </section>

      {/* 2B. Payment Method Clarity & 3-Step Direct Giving Pathway */}
      <section className="py-8 bg-white border-b border-border-warm" aria-label="Donation Methods and Receipt Steps">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xs bg-cream/65 border-l-4 border-l-forest border-y border-r border-border-warm space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-xs bg-forest text-cream text-[10px] font-bold uppercase tracking-wider">
                Step 1 • Active Now
              </span>
              <h2 className="font-serif text-sm font-bold text-forest pt-1">
                Direct SBI Remittance or Static UPI QR
              </h2>
              <p className="text-ink-sand leading-relaxed">
                Transfer via SBI Account <strong className="font-mono text-forest">33341302498</strong> (IFSC <strong className="font-mono text-forest">SBIN0001701</strong>) or scan MECT&apos;s SBI QR (<strong className="font-mono text-forest">86971610172@sbi</strong>).
              </p>
            </div>
            <div className="p-4 rounded-xs bg-cream/65 border-l-4 border-l-terracotta border-y border-r border-border-warm space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-xs bg-terracotta text-white text-[10px] font-bold uppercase tracking-wider">
                Step 2 • Receipt Desk
              </span>
              <h2 className="font-serif text-sm font-bold text-forest pt-1">
                Submit Bank UTR / UPI Reference
              </h2>
              <p className="text-ink-sand leading-relaxed">
                Static UPI and NEFT transfers are not auto-verified. Submit your UTR in the <Link href="#receipt-claim" className="underline text-terracotta-dark font-semibold">Receipt Desk form</Link> below to receive your official institutional receipt.
              </p>
            </div>
            <div className="p-4 rounded-xs bg-sand-light/65 border-l-4 border-l-sand border-y border-r border-border-warm space-y-1">
              <span className="inline-block px-2 py-0.5 rounded-xs bg-sand text-forest-deep text-[10px] font-bold uppercase tracking-wider">
                Gateway Notice • Pending
              </span>
              <h2 className="font-serif text-sm font-bold text-forest pt-1">
                Automated Razorpay Gateway Pending
              </h2>
              <p className="text-ink-sand leading-relaxed">
                Online automated Razorpay dynamic QR settlement is pending credential activation. Please use active direct SBI channels above.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Active Direct Bank Remittance & Static SBI Scan & Pay QR — STATE BANK OF INDIA */}
      <section id="bank-details" className="py-16 md:py-20 bg-white border-b border-border-warm scroll-mt-32">
        <Container size="default" className="space-y-10">
          <SectionHeader
            badge="Active Domestic Giving"
            title="SUPPORT OUR MISSION — DONATE NOW"
            subtitle="Remit contributions directly via SBI Static UPI QR (86971610172@sbi), NEFT, RTGS, or IMPS into MECT's verified State Bank of India account."
            align="center"
          />

          <div className="max-w-5xl mx-auto">
            <SbiDonationSection />
          </div>
        </Container>
      </section>

      {/* 4. Donor Receipt Claim & KYC Capture Form */}
      <section id="receipt-claim" className="py-16 md:py-24 bg-cream border-b border-border-warm scroll-mt-32">
        <Container size="default">
          <SectionHeader
            badge="Manual Verification & Receipt Desk"
            title="Confirm Donation &amp; Request Official Receipt"
            subtitle="Because direct bank transfers and static UPI payments are reconciled manually, please submit your UTR / UPI reference and PAN for institutional receipt issuance."
            align="center"
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xs border-2 border-sand/40 shadow-xl">
            {receiptSubmitted ? (
              <div className="p-8 bg-terracotta text-white rounded-xs space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-cream mx-auto" aria-hidden="true" />
                <h3 className="font-serif text-2xl font-bold">
                  Donation Receipt Request Logged
                </h3>
                {receiptRefId && (
                  <p className="text-sm font-mono text-cream bg-black/25 py-1.5 px-4 rounded inline-block">
                    Secretariat Acknowledgment Ref: #{receiptRefId}
                  </p>
                )}
                <div className="p-4 bg-white/5 rounded-xs border border-white/10 text-xs text-white/85 text-left space-y-1.5 font-sans">
                  <div><strong>Donor Name:</strong> {donorData.fullName}</div>
                  <div><strong>Permanent Account Number (PAN):</strong> {donorData.pan.toUpperCase()}</div>
                  <div><strong>Confirmed Amount:</strong> ₹{Number(donorData.amount).toLocaleString("en-IN")}</div>
                  <div><strong>Bank UTR / UPI Reference:</strong> {donorData.utrNumber}</div>
                  <div><strong>Historical 80G URN:</strong> {TRUST_CONFIG.statutory.section80GUrn}</div>
                </div>
                <p className="text-xs text-white/90 leading-relaxed max-w-md mx-auto font-sans">
                  Our Accounts Secretariat will manually verify the bank credit / UPI reference against SBI statements and email your official donation acknowledgment receipt within 1–2 business days (Tax Year 2026-27 Form 10BE tax exemption remains subject to confirmed Section 354 / Form 107 approval).
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
                      programme: "Free Education for 200 Students",
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
                    label="Email Address (For Receipt) *"
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
                    label="Bank UTR / UPI Transaction Ref *"
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
                    { value: "Free Education for 200 Students", label: "Free Education for 200 Students" },
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
                  label="Complete Postal Address with PIN (For Official Receipt Records) *"
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
                  <span>Transmit Donation Confirmation</span>
                </Button>

                <p className="text-[11px] text-ink-sand text-center italic font-sans">
                  Bank Account: {TRUST_CONFIG.bank.bankName} ({TRUST_CONFIG.bank.accountNumber}, IFSC: {TRUST_CONFIG.bank.ifsc}) • UPI ID: {TRUST_CONFIG.bank.upiId} • Historical 80G Order URN: {TRUST_CONFIG.statutory.section80GUrn}.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>

      {/* 5. Interactive Section 133 / 80G Tax Deduction Calculator (gated behind COMPLIANCE.showTaxEstimator) */}
      {COMPLIANCE.showTaxEstimator && (
        <section id="calculator" className="py-16 md:py-24 bg-white border-b border-border-warm scroll-mt-32">
        <Container size="default" className="space-y-10">
          <SectionHeader
            badge="Interactive Tax Estimator (Illustrative Model)"
            title="Section 133 / Section 80G Tax Deduction Estimator"
            subtitle="Illustrative calculation for donors opting for the Old Tax Regime. Current approval for Tax Year 2026-27 has not yet been established from the documentary records reviewed."
            align="center"
          />

          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xs border-2 border-sand/40 shadow-xl space-y-8">
            {/* Quick Donation Selector Buttons */}
            <div>
              <span className="text-xs uppercase font-bold text-forest tracking-wider block mb-3 font-sans">
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
                        ? "bg-forest text-white border-sand shadow-sm"
                        : "bg-sand-light text-forest border-border-warm hover:border-sand"
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
                <label htmlFor="donate-custom-amount" className="text-xs font-bold text-terracotta-dark block mb-1 font-sans">
                  Custom Donation Amount (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-forest">
                    ₹
                  </span>
                  <input
                    id="donate-custom-amount"
                    type="number"
                    min="500"
                    step="500"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xs border border-terracotta/20 text-base font-bold text-terracotta-dark focus:border-sand focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="donate-tax-slab" className="text-xs font-bold text-terracotta-dark block mb-1 font-sans">
                  Your Applicable Income Tax Slab:
                </label>
                <select
                  id="donate-tax-slab"
                  value={taxBracket}
                  onChange={(e) => setTaxBracket(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xs border border-terracotta/20 text-sm font-semibold text-terracotta-dark focus:border-sand focus:outline-none bg-white"
                >
                  <option value={0.3}>30% Slab (Highest Income Bracket)</option>
                  <option value={0.2}>20% Slab (Middle Income Bracket)</option>
                  <option value={0.1}>10% Slab (Lower Income Bracket)</option>
                  <option value={0.05}>5% Slab (Entry Income Bracket)</option>
                </select>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="p-6 rounded-xs bg-forest text-white border border-sand/45 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/5 rounded-xs border border-white/15 space-y-1">
                  <span className="text-[11px] text-white/85 font-sans block">Your Contribution</span>
                  <span className="text-2xl font-serif font-bold text-white">
                    ₹{donationAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-xs border border-white/15 space-y-1">
                  <span className="text-[11px] text-cream font-sans block">Illustrative 50% Deduction</span>
                  <span className="text-2xl font-serif font-bold text-cream">
                    ₹{eligibleDeduction.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-4 bg-terracotta rounded-xs border border-sand/55 space-y-1">
                  <span className="text-[11px] text-white font-sans block">Estimated Tax Saved</span>
                  <span className="text-2xl font-serif font-bold text-white">
                    ₹{Math.round(estimatedTaxSaved).toLocaleString("en-IN")}*
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-start gap-3 text-xs text-white/90 font-sans">
                <CheckCircle2 className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                <div>
                  <strong>Tangible Ground Impact:</strong> {getImpactDescription(donationAmount)}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
      )}

      {/* 6. Pending Dynamic Payment Gateway (Automated Razorpay Integration) */}
      <section id="smart-donate" className="py-16 md:py-20 bg-cream scroll-mt-32">
        <Container size="default">
          <SmartDonationCheckout />
        </Container>
      </section>
    </div>
  );
}
