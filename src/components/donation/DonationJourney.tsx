"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Lock,
  Building2,
  QrCode,
  CreditCard,
  Heart,
  ChevronRight,
  Info,
  Check,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { MECT_ORG } from "@/config/org";
import { ORG } from "@content/org";
import { usePortalAuth } from "@/context/PortalAuthContext";
import { requestPortalOtp, verifyPortalOtp, PortalAuthResponse } from "@/lib/portal-api";
import { ProgressiveDonorAuth } from "@/components/auth/ProgressiveDonorAuth";

export interface DonationProgramme {
  code: string;
  name: string;
  description: string;
  badge: string;
  iconName: string;
}

export const VERIFIED_DONATION_PROGRAMMES: DonationProgramme[] = [
  {
    code: "GENERAL",
    name: "General Charitable Fund",
    description: "Allocated where the community need is greatest across all trust initiatives in Odisha.",
    badge: "Core Mission",
    iconName: "Heart"
  },
  {
    code: "EDUCATION",
    name: "Education & Learning Support",
    description: "Remedial coaching, learning kits, school uniforms, and higher education tuition grants.",
    badge: "Youth Literacy",
    iconName: "GraduationCap"
  },
  {
    code: "WATER",
    name: "Safe Water & Sanitation (Jal Seva)",
    description: "Summer community drinking water kiosks, clean water handling, and heatstroke relief.",
    badge: "Public Health",
    iconName: "Droplets"
  },
  {
    code: "WOMEN",
    name: "Women Empowerment & Livelihoods",
    description: "Tailoring courses, sewing machine toolkits, and financial self-reliance training for rural women.",
    badge: "Livelihoods",
    iconName: "Scissors"
  },
  {
    code: "FOOD",
    name: "Food Relief & Nutrition (Jan Ahar)",
    description: "Hygienic cooked meals and food provisions for hospital attendants, daily-wage families, and destitute elders.",
    badge: "Nutrition",
    iconName: "Utensils"
  },
  {
    code: "HANUMAN_MURTI",
    name: "Shri Hanuman Murti Cultural Initiative",
    description: "Proposed 80–100-foot monumental landmark of selfless service (Seva) and regional cultural heritage.",
    badge: "Cultural Project",
    iconName: "Sparkles"
  }
];

export const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const emptySubscribe = () => () => {};

type JourneyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function DonationJourney() {
  const searchParams = useSearchParams();
  const { isAuthenticated, session } = usePortalAuth();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [currentStep, setCurrentStep] = useState<JourneyStep>(1);

  // Step 1: Selected Programme
  const paramProg = searchParams.get("programme")?.toUpperCase();
  const initialProg = paramProg
    ? VERIFIED_DONATION_PROGRAMMES.find(
        (p) => p.code === paramProg || p.code.replace(/_/g, "") === paramProg.replace(/_/g, "")
      )?.code || "GENERAL"
    : "GENERAL";
  const [selectedProgrammeCode, setSelectedProgrammeCode] = useState<string>(initialProg);

  // Step 3: Donor Information
  const [donorName, setDonorName] = useState<string>(session?.fullName || "");
  const [donorEmail, setDonorEmail] = useState<string>(session?.primaryEmail || "");
  const [donorPhone, setDonorPhone] = useState<string>(session?.primaryPhone || "");
  const [donorAddress, setDonorAddress] = useState<string>("");
  const [donorPan, setDonorPan] = useState<string>("");
  const [communicationConsent, setCommunicationConsent] = useState<boolean>(true);
  const [whatsappConsent, setWhatsappConsent] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // Step 4: Amount
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [amountError, setAmountError] = useState<string | null>(null);

  // Step 6: Payment Method & Gateway State
  const [gatewayConfig] = useState<{
    himActive: boolean;
    cashfreeActive: boolean;
    sbiManualActive: boolean;
  }>({
    himActive: false,
    cashfreeActive: false,
    sbiManualActive: true
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"HIM" | "CASHFREE" | "SBI_MANUAL" | null>(null);
  const [utrReference, setUtrReference] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentSubmitting, setPaymentSubmitting] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Step 7: Confirmation State
  const [confirmationData, setConfirmationData] = useState<{
    reference: string;
    status: "PENDING_VERIFICATION" | "SUCCESS" | "FAILED";
    message: string;
    amount: number;
    programmeName: string;
    donorName: string;
    donorEmail: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeProgramme =
    VERIFIED_DONATION_PROGRAMMES.find((p) => p.code === selectedProgrammeCode) ||
    VERIFIED_DONATION_PROGRAMMES[0];

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Clipboard utility
  const copyToClipboard = (key: string, value: string) => {
    try {
      navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {}
  };

  // Step Handlers
  const handleProgrammeContinue = () => {
    setCurrentStep(2); // Go to Amount selection
  };

  const handleAmountContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setAmountError(null);
    const amt = effectiveAmount;
    if (isNaN(amt) || amt < 1) {
      setAmountError("Please specify a voluntary donation of at least ₹1.");
      return;
    }
    if (amt > 10000000) {
      setAmountError("For single contributions exceeding ₹1,00,00,000, please contact our secretariat directly.");
      return;
    }
    setCurrentStep(3); // Continue to Account Verification
  };

  const handleDetailsContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setDetailsError(null);

    if (!donorName.trim()) {
      setDetailsError("Donor full name is required for statutory receipt records.");
      return;
    }
    if (!donorEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.trim())) {
      setDetailsError("Please enter a valid email address for official receipt delivery.");
      return;
    }
    if (!donorPhone.trim() || donorPhone.replace(/\D/g, "").length < 10) {
      setDetailsError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (donorPan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(donorPan.trim().toUpperCase())) {
      setDetailsError("Please enter a valid 10-character Indian Permanent Account Number (PAN) or leave blank.");
      return;
    }

    setCurrentStep(5); // Continue to Review
  };

  const handleReviewContinue = () => {
    // Select default active method
    if (gatewayConfig.himActive) {
      setSelectedPaymentMethod("HIM");
    } else if (gatewayConfig.cashfreeActive) {
      setSelectedPaymentMethod("CASHFREE");
    } else {
      setSelectedPaymentMethod("SBI_MANUAL");
    }
    setCurrentStep(6); // Continue to Payment
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (selectedPaymentMethod === "SBI_MANUAL") {
      if (!utrReference.trim() || utrReference.trim().length < 8) {
        setPaymentError("Please enter your 8–40 character transaction UTR reference number.");
        return;
      }
    }

    setPaymentSubmitting(true);
    try {
      const response = await fetch("/api/donations/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim(),
          donorPan: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
          amount: effectiveAmount,
          utrReference: utrReference.trim().toUpperCase() || "GATEWAY-INITIATED",
          programmeCode: activeProgramme.code,
          transferDate,
          notes: donorAddress.trim(),
          whatsappConsent
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to submit contribution claim.");
      }

      setConfirmationData({
        reference: data.claimReference || `MECT-DON-${Date.now().toString().slice(-6)}`,
        status: "PENDING_VERIFICATION",
        message: data.message || "Your contribution record has been received and queued for ledger reconciliation.",
        amount: effectiveAmount,
        programmeName: activeProgramme.name,
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim()
      });

      setCurrentStep(7); // Show Confirmation
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "Network error. Please try again.");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const stepTitles = [
    "Programme",
    "Amount",
    "Account",
    "Donor Details",
    "Review",
    "Payment",
    "Confirmation"
  ];

  if (!mounted) {
    return (
      <div className="p-12 text-center text-forest">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-terracotta mb-4" />
        <p className="text-sm font-semibold">Initializing secure institutional donation portal...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* 1. Systematic Step Indicator */}
      <nav aria-label="Donation Step Progress" className="bg-white rounded-xl border border-sand/40 p-3 sm:p-4 shadow-xs">
        <ol className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
          {stepTitles.map((title, idx) => {
            const stepNum = (idx + 1) as JourneyStep;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <li key={title} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-forest text-sand"
                      : isCurrent
                      ? "bg-terracotta text-white ring-2 ring-terracotta/30"
                      : "bg-sand/30 text-ink-muted"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
                </div>
                <span
                  className={`hidden md:block text-[10px] sm:text-xs font-sans mt-1.5 truncate max-w-[85px] ${
                    isCurrent ? "font-bold text-forest" : "text-ink-muted"
                  }`}
                >
                  {title}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* STEP 1: PROGRAMME SELECTION */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold block mb-1">
              Step 1 of 6 • Purpose of Contribution
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Select Charitable Programme
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Every voluntary donation directly finances verified grassroots initiatives in Western Odisha.
            </p>
          </div>

          <fieldset className="space-y-3">
            <legend className="sr-only">Available Donation Programmes</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFIED_DONATION_PROGRAMMES.map((prog) => {
                const isSelected = selectedProgrammeCode === prog.code;
                return (
                  <label
                    key={prog.code}
                    htmlFor={`prog-${prog.code}`}
                    className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-forest bg-forest/5 shadow-xs"
                        : "border-sand/40 bg-white hover:border-sand/70 hover:bg-sand/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant={isSelected ? "forest" : "neutral"} size="sm" className="mb-2">
                          {prog.badge}
                        </Badge>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-forest leading-snug">
                          {prog.name}
                        </h3>
                      </div>
                      <input
                        type="radio"
                        id={`prog-${prog.code}`}
                        name="donationProgramme"
                        value={prog.code}
                        checked={isSelected}
                        onChange={() => setSelectedProgrammeCode(prog.code)}
                        className="w-4 h-4 text-forest focus:ring-forest mt-1 shrink-0"
                      />
                    </div>
                    <p className="text-xs text-ink-muted leading-relaxed">
                      {prog.description}
                    </p>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="pt-4 flex items-center justify-between border-t border-sand/30">
            <span className="text-xs text-ink-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Tax exemption under Section 80G catalogued</span>
            </span>
            <Button
              variant="primary"
              size="lg"
              onClick={handleProgrammeContinue}
              className="gap-2 font-bold px-6"
            >
              <span>Continue to Amount</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: DONATION AMOUNT */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold">
                Step 2 of 6 • Contribution Amount
              </span>
              <Badge variant="forest" size="sm">
                Purpose: {activeProgramme.name}
              </Badge>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              Select Donation Amount
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Every voluntary rupee is dedicated strictly to {activeProgramme.name}.
            </p>
          </div>

          {amountError && (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{amountError}</span>
            </div>
          )}

          <form onSubmit={handleAmountContinue} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-forest uppercase tracking-wider block">
                Standard Donation Presets (INR)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`p-3.5 rounded-xl border-2 text-center transition-all font-mono text-base sm:text-lg font-bold ${
                        isSelected
                          ? "border-forest bg-forest text-sand shadow-xs"
                          : "border-sand/40 bg-white text-forest hover:border-sand/70 hover:bg-sand/10"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-sand/30">
              <label htmlFor="custom-amount" className="text-xs font-bold text-forest uppercase tracking-wider block">
                Or Specify Custom Amount (INR)
              </label>
              <div className="relative max-w-sm">
                <span className="absolute left-4 top-3 text-forest font-bold text-lg">₹</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="1"
                  max="10000000"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="pl-9 text-lg font-mono font-bold text-forest"
                />
              </div>
              <p className="text-[11px] text-ink-muted">
                Minimum contribution is ₹1. Tax deduction certificate generated under Section 80G.
              </p>
            </div>

            <div className="p-4 bg-sand/20 rounded-xl border border-sand/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-forest">Total Contribution Summary:</span>
              <span className="font-mono text-lg font-bold text-forest">
                ₹{effectiveAmount ? effectiveAmount.toLocaleString("en-IN") : 0}
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-sand/30">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(1)}
                className="gap-1.5 text-xs text-ink-muted"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Programmes</span>
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="gap-2 font-bold px-6"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 3: DONOR AUTHENTICATION */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold">
                Step 3 of 6 • Donor Authentication
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm">
                  {activeProgramme.name}
                </Badge>
                <Badge variant="neutral" size="sm">
                  ₹{effectiveAmount.toLocaleString("en-IN")}
                </Badge>
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              Verify Your Donor Account
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Institutional governance requires identity verification to issue computer-signed statutory receipts and link donations to your donor ledger.
            </p>
          </div>

          {isAuthenticated && session ? (
            <div className="p-6 bg-emerald-50/70 border border-emerald-200/80 rounded-sm space-y-4 max-w-lg mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Signed in as {session.fullName || session.primaryPhone || session.primaryEmail}
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Your voluntary contribution of ₹{effectiveAmount.toLocaleString("en-IN")} will be automatically linked to your donor ledger and official 80G tax profile.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setCurrentStep(2)}
                  className="gap-1.5 text-xs text-ink-muted"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Amount</span>
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (session.fullName && !donorName) setDonorName(session.fullName);
                    if (session.primaryPhone && !donorPhone) setDonorPhone(session.primaryPhone);
                    if (session.primaryEmail && !donorEmail) setDonorEmail(session.primaryEmail);
                    setCurrentStep(4);
                  }}
                  className="gap-2 font-bold px-6 shadow-sm"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-4">
              <ProgressiveDonorAuth
                initialIntent="DONATE"
                compact={true}
                redirectOnSuccess={false}
                headingOverride="Donor Verification"
                subheadingOverride="Verify your mobile number or Google account to link your contribution to official receipt records."
                onSuccess={(auth) => {
                  if (auth.fullName) setDonorName(auth.fullName);
                  if (auth.primaryPhone) setDonorPhone(auth.primaryPhone);
                  if (auth.primaryEmail) setDonorEmail(auth.primaryEmail);
                  setCurrentStep(4);
                }}
              />

              <div className="pt-3 text-center border-t border-sand/30 flex items-center justify-start text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-ink-muted hover:text-forest flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modify Amount</span>
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 4: DONOR INFORMATION */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold">
                Step 4 of 6 • Donor Identification
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm">
                  Purpose: {activeProgramme.name}
                </Badge>
                <Badge variant="neutral" size="sm">
                  Amount: ₹{effectiveAmount.toLocaleString("en-IN")}
                </Badge>
              </div>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              Donor Details for Official Receipt
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              These details are required under Indian Trust and Income Tax Department reporting regulations.
            </p>
          </div>

          {detailsError && (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{detailsError}</span>
            </div>
          )}

          <form onSubmit={handleDetailsContinue} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="donor-name" className="text-xs font-bold text-forest">
                  Full Name <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="donor-name"
                    type="text"
                    placeholder="e.g. Ramesh Kumar Patel"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    className="pl-9"
                  />
                  <User className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="donor-email" className="text-xs font-bold text-forest">
                  Email Address (Receipt Delivery) <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                    className="pl-9"
                  />
                  <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="donor-phone" className="text-xs font-bold text-forest">
                  Mobile Number <span className="text-terracotta">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="donor-phone"
                    type="tel"
                    placeholder="e.g. 9437100000"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    required
                    className="pl-9"
                  />
                  <Phone className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="donor-pan" className="text-xs font-bold text-forest flex items-center justify-between">
                  <span>PAN (Permanent Account Number)</span>
                  <span className="text-[10px] text-ink-muted font-normal">Required for 80G tax exemption</span>
                </label>
                <div className="relative">
                  <Input
                    id="donor-pan"
                    type="text"
                    placeholder="e.g. ABCDE1234F (Optional)"
                    value={donorPan}
                    maxLength={10}
                    onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                    className="font-mono tracking-wider pl-9 uppercase"
                  />
                  <FileText className="w-4 h-4 text-ink-muted absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="donor-address" className="text-xs font-bold text-forest">
                Residential Address / City (Optional)
              </label>
              <Input
                id="donor-address"
                type="text"
                placeholder="e.g. Balangir, Odisha"
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
              />
            </div>

            <div className="pt-3 border-t border-sand/30 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ink leading-relaxed">
                <input
                  type="checkbox"
                  checked={communicationConsent}
                  onChange={(e) => setCommunicationConsent(e.target.checked)}
                  className="rounded-xs border-sand text-forest focus:ring-forest mt-0.5"
                />
                <span>
                  I consent to receiving official computer-signed receipts and institutional annual reporting updates from {ORG.shortName}.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ink leading-relaxed">
                <input
                  type="checkbox"
                  checked={whatsappConsent}
                  onChange={(e) => setWhatsappConsent(e.target.checked)}
                  className="rounded-xs border-sand text-forest focus:ring-forest mt-0.5"
                />
                <span className="text-ink-muted">
                  (Optional) Receive receipt confirmation and milestone dispatches on WhatsApp.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-sand/30">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep(3)}
                className="gap-1.5 text-xs text-ink-muted"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Verification</span>
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="gap-2 font-bold px-6"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 5: REVIEW BEFORE PAYMENT */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold block mb-1">
              Step 5 of 6 • Summary &amp; Verification
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Review Contribution Summary
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Please inspect your voluntary contribution coordinates before proceeding to payment remittance.
            </p>
          </div>

          <div className="p-5 bg-sand/15 rounded-xl border border-sand/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <span className="text-xs uppercase font-bold text-forest tracking-wider">
                Contribution Total
              </span>
              <span className="font-mono text-2xl font-bold text-forest">
                ₹{effectiveAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-ink-muted">Allocated Programme:</dt>
                <dd className="font-bold text-forest mt-0.5">{activeProgramme.name}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Donor Name:</dt>
                <dd className="font-bold text-forest mt-0.5">{donorName}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Receipt Email:</dt>
                <dd className="font-bold text-forest mt-0.5">{donorEmail}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Mobile Number:</dt>
                <dd className="font-bold text-forest mt-0.5">{donorPhone}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">PAN Identification:</dt>
                <dd className="font-mono font-bold text-forest mt-0.5">
                  {donorPan ? donorPan : "Not Provided (General Receipt)"}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Statutory Tax Treatment:</dt>
                <dd className="font-bold text-forest mt-0.5">Section 80G Deductible (URN: {ORG.ids.urn80G})</dd>
              </div>
            </dl>
          </div>

          <div className="p-4 bg-forest/5 rounded-lg border border-forest/20 text-xs text-forest space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Institutional Transparency Guarantee</span>
            </div>
            <p className="text-ink-muted leading-relaxed">
              Contributions are received directly by Mahaveer Educational &amp; Charitable Trust under registered Deed No. {ORG.trustDeed.deedNumber}. An official computer-signed receipt will be dispatched to your email upon ledger reconciliation.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-sand/30">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setCurrentStep(4)}
              className="gap-1.5 text-xs text-ink-muted"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Details</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleReviewContinue}
              className="gap-2 font-bold px-6"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6: PAYMENT METHODS (STRICT VISIBILITY POLICY) */}
      {currentStep === 6 && (
        <Card className="p-6 sm:p-8 bg-white border-sand/40 shadow-xs space-y-6">
          <div className="border-b border-sand/30 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-bold">
                Step 6 of 6 • Payment Execution
              </span>
              <span className="font-mono font-bold text-forest text-sm">
                ₹{effectiveAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              Select Active Payment Channel
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
              Only authorized and verified active payment remittance methods are displayed per Trust policy.
            </p>
          </div>

          {paymentError && (
            <div className="p-4 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{paymentError}</span>
            </div>
          )}

          {/* ACTIVE METHOD SELECTION */}
          <div className="space-y-4">
            {/* If neither HIM nor Cashfree is active, display professional institutional remittance */}
            {!gatewayConfig.himActive && !gatewayConfig.cashfreeActive && (
              <div className="p-5 bg-sand/20 rounded-xl border border-sand/40 space-y-4">
                <div className="flex items-center gap-2 text-forest">
                  <Building2 className="w-5 h-5 text-forest" />
                  <h3 className="font-serif font-bold text-base sm:text-lg">
                    Approved Institutional Direct Bank &amp; UPI Remittance
                  </h3>
                </div>
                <p className="text-xs text-ink leading-relaxed">
                  Per the Trust&apos;s current governance policy, contributions are received directly into our primary <strong>State Bank of India</strong> operating account without commercial gateway deductions.
                </p>

                {/* Bank Coordinates Table */}
                <div className="bg-white rounded-lg border border-sand/30 p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">Bank Name:</span>
                      <span className="font-bold text-forest">{MECT_ORG.bank.bankName}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">Account Name:</span>
                      <span className="font-bold text-forest">{MECT_ORG.bank.accountHolder}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-forest text-sm">{MECT_ORG.bank.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("acc", MECT_ORG.bank.accountNumber)}
                          className="text-[10px] text-terracotta font-semibold hover:underline flex items-center gap-1"
                        >
                          {copiedKey === "acc" ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "acc" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">IFSC Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-forest text-sm">{MECT_ORG.bank.ifsc}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("ifsc", MECT_ORG.bank.ifsc)}
                          className="text-[10px] text-terracotta font-semibold hover:underline flex items-center gap-1"
                        >
                          {copiedKey === "ifsc" ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "ifsc" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">Branch:</span>
                      <span className="text-ink">{MECT_ORG.bank.branch}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted block text-[10px] uppercase font-bold">UPI ID (VPA):</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-forest text-sm">{MECT_ORG.bank.upiId}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("upi", MECT_ORG.bank.upiId)}
                          className="text-[10px] text-terracotta font-semibold hover:underline flex items-center gap-1"
                        >
                          {copiedKey === "upi" ? <Check className="w-3 h-3 text-forest" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "upi" ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sand/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <span className="text-ink-muted">Transfer using any UPI app (GPay, PhonePe, Paytm, BHIM):</span>
                    <a
                      href={`upi://pay?pa=${MECT_ORG.bank.upiId}&pn=${encodeURIComponent(MECT_ORG.bank.accountHolder)}&am=${effectiveAmount}&cu=INR`}
                      className="px-4 py-1.5 rounded-md bg-forest text-sand font-semibold hover:bg-forest-deep transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Open UPI App (₹{effectiveAmount})</span>
                    </a>
                  </div>
                </div>

                {/* Form to Record the Completed Transfer UTR */}
                <form onSubmit={handlePaymentSubmit} className="pt-3 border-t border-sand/30 space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="utr-reference" className="text-xs font-bold text-forest flex items-center justify-between">
                      <span>Enter Transfer UTR / Transaction Reference Number <span className="text-terracotta">*</span></span>
                      <span className="text-[10px] text-ink-muted font-normal">8 to 40 characters</span>
                    </label>
                    <Input
                      id="utr-reference"
                      type="text"
                      placeholder="e.g. 432109876543 or SBI202611250001"
                      value={utrReference}
                      onChange={(e) => setUtrReference(e.target.value.toUpperCase())}
                      required
                      className="font-mono tracking-wider uppercase text-sm font-bold"
                    />
                    <p className="text-[11px] text-ink-muted">
                      Located in your banking receipt or UPI app transaction confirmation.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setCurrentStep(5)}
                      className="gap-1.5 text-xs text-ink-muted"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Review</span>
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={paymentSubmitting}
                      className="gap-2 font-bold px-6"
                    >
                      {paymentSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      <span>Submit Remittance Claim</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* STEP 7: CONFIRMATION & RECEIPT LIFECYCLE */}
      {currentStep === 7 && confirmationData && (
        <Card className="p-6 sm:p-10 bg-white border-forest/30 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-forest text-sand flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-forest font-bold block">
              Contribution Recorded Successfully
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              Thank You for Your Generosity
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Your voluntary contribution has been registered in the institutional ledger. Our accounts team will reconcile the transaction against the official State Bank of India ledger.
            </p>
          </div>

          <div className="p-5 bg-sand/20 rounded-xl border border-sand/40 max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-sand/30">
              <span className="text-xs text-ink-muted font-bold">Transaction Reference:</span>
              <span className="font-mono font-bold text-forest text-sm">{confirmationData.reference}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-sand/30">
              <span className="text-xs text-ink-muted font-bold">Allocated Programme:</span>
              <span className="text-xs font-bold text-forest">{confirmationData.programmeName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-sand/30">
              <span className="text-xs text-ink-muted font-bold">Contribution Amount:</span>
              <span className="font-mono font-bold text-forest text-base">₹{confirmationData.amount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-muted font-bold">Statutory Status:</span>
              <Badge variant="forest" size="sm">Pending Bank Reconciliation</Badge>
            </div>
          </div>

          <div className="p-4 bg-sand/15 rounded-lg border border-sand/30 max-w-md mx-auto text-xs text-ink-muted text-left space-y-1">
            <div className="font-bold text-forest flex items-center gap-1.5">
              <Info className="w-4 h-4 text-forest" />
              <span>Next Steps for Statutory Receipt:</span>
            </div>
            <p className="leading-relaxed">
              Upon physical ledger reconciliation, a computer-signed 80G tax exemption receipt will be delivered to <strong>{confirmationData.donorEmail}</strong>.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setCurrentStep(1);
                setUtrReference("");
                setConfirmationData(null);
              }}
              className="w-full sm:w-auto"
            >
              Make Another Donation
            </Button>
            <a
              href="/statutory-disclosures"
              className="text-xs font-bold text-forest underline hover:text-terracotta transition-colors"
            >
              View Statutory Disclosures Vault
            </a>
          </div>
        </Card>
      )}
    </div>
  );
}
