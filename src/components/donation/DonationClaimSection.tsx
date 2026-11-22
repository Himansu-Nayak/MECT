"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, CheckCircle2, AlertCircle, Loader2, Send, QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { MECT_ORG } from "@/config/org";

interface ProgrammeOption {
  code: string;
  name: string;
  description: string;
}

const PROGRAMME_OPTIONS: ProgrammeOption[] = [
  {
    code: "GENERAL",
    name: "General Charitable Fund",
    description: "Allocated where the community need is greatest across all trust initiatives.",
  },
  {
    code: "EDUCATION",
    name: "Education & Learning Support",
    description: "Remedial classes, learning kits, and school supplies for underprivileged students.",
  },
  {
    code: "WATER",
    name: "Safe Water & Sanitation (Jal Seva)",
    description: "Summer drinking water kiosks, clean water handling, and heatstroke relief.",
  },
  {
    code: "WOMEN",
    name: "Women Empowerment & Livelihoods",
    description: "Tailoring courses, sewing machine toolkits, and financial self-reliance training.",
  },
  {
    code: "FOOD",
    name: "Food Relief & Nutrition (Jan Ahar)",
    description: "Hygienic cooked meals and food packets for hospital attendants and destitute families.",
  },
  {
    code: "HANUMAN_MURTI",
    name: "Shri Hanuman Murti Initiative",
    description: "Proposed 80–100-foot landmark cultural and community project (feasibility stage).",
  },
];

function DonationClaimSectionContent() {
  const searchParams = useSearchParams();
  const paramProgramme = searchParams.get("programme")?.toUpperCase();
  const matchedInitial = PROGRAMME_OPTIONS.find(
    (opt) =>
      opt.code === paramProgramme ||
      opt.code.replace(/_/g, "") === paramProgramme?.replace(/_/g, "")
  )?.code || "GENERAL";

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedProgramme, setSelectedProgramme] = useState<string>(matchedInitial);

  useEffect(() => {
    if (paramProgramme) {
      const match = PROGRAMME_OPTIONS.find(
        (opt) =>
          opt.code === paramProgramme ||
          opt.code.replace(/_/g, "") === paramProgramme.replace(/_/g, "")
      );
      if (match) {
        setSelectedProgramme(match.code);
      }
    }
  }, [paramProgramme]);
  const [amount, setAmount] = useState<string>("1000");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [donorPhone, setDonorPhone] = useState<string>("");
  const [donorPan, setDonorPan] = useState<string>("");
  const [utrReference, setUtrReference] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");
  const [whatsappConsent, setWhatsappConsent] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    claimReference: string;
    message: string;
  } | null>(null);

  const copyToClipboard = (key: string, value: string) => {
    try {
      navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!donorName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!donorEmail.trim()) {
      setErrorMessage("Please enter a valid email address for receipt delivery.");
      return;
    }

    if (!donorPhone.trim() || donorPhone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!amount || Number(amount) < 1) {
      setErrorMessage("Please enter a valid contribution amount (minimum ₹1).");
      return;
    }

    if (!utrReference.trim() || utrReference.trim().length < 8) {
      setErrorMessage("Please enter your 8–40 character UTR / transaction reference number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/donations/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim(),
          donorPan: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
          amount: Number(amount),
          utrReference: utrReference.trim().toUpperCase(),
          programmeCode: selectedProgramme,
          transferDate,
          notes: notes.trim(),
          whatsappConsent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit transfer claim.");
      }

      setSuccessData({
        claimReference: data.claimReference,
        message: data.message,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Interactive Copy Buttons for Bank Credentials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-sand/20 rounded-lg border border-sand/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forest tracking-wider block">
              Account Number
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-forest block mt-0.5">
              {MECT_ORG.bank.accountNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("acc", MECT_ORG.bank.accountNumber)}
            className="p-2 rounded-md bg-forest text-cream hover:bg-forest-deep transition-colors text-xs flex items-center gap-1 font-semibold"
            title="Copy Account Number"
            aria-label="Copy Account Number"
          >
            {copiedKey === "acc" ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-sand/20 rounded-lg border border-sand/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forest tracking-wider block">
              IFSC Code
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-forest block mt-0.5">
              {MECT_ORG.bank.ifsc}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("ifsc", MECT_ORG.bank.ifsc)}
            className="p-2 rounded-md bg-forest text-cream hover:bg-forest-deep transition-colors text-xs flex items-center gap-1 font-semibold"
            title="Copy IFSC Code"
            aria-label="Copy IFSC Code"
          >
            {copiedKey === "ifsc" ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 bg-sand/20 rounded-lg border border-sand/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-forest tracking-wider block">
              UPI VPA
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-forest block mt-0.5">
              {MECT_ORG.bank.upiId}
            </span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("upi", MECT_ORG.bank.upiId)}
            className="p-2 rounded-md bg-forest text-cream hover:bg-forest-deep transition-colors text-xs flex items-center gap-1 font-semibold"
            title="Copy UPI ID"
            aria-label="Copy UPI ID"
          >
            {copiedKey === "upi" ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Programme Selection Buttons */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-forest">
          1. Choose Programme to Support:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROGRAMME_OPTIONS.map((prog) => {
            const isSelected = selectedProgramme === prog.code;
            return (
              <button
                key={prog.code}
                type="button"
                onClick={() => setSelectedProgramme(prog.code)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-sand/30 border-forest text-forest shadow-xs font-semibold ring-1 ring-forest"
                    : "bg-white border-sand/30 text-ink hover:border-sand hover:bg-sand/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-bold block">{prog.name}</span>
                  {isSelected && <Badge variant="forest" size="sm">Selected</Badge>}
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed font-normal">
                  {prog.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* "I Have Donated" Form */}
      <div id="claim-form" className="p-6 sm:p-8 bg-white rounded-xl border border-sand/40 shadow-xs space-y-6 scroll-mt-24">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest text-cream flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
              I Have Donated — Submit Transfer Details
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            After completing your bank transfer or UPI payment, submit your reference details below so our accounts desk can verify the credit and issue your official receipt.
          </p>
        </div>

        {successData ? (
          <div className="p-6 bg-sand/20 rounded-xl border border-forest/30 space-y-4">
            <div className="flex items-center gap-2 text-forest font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-forest" />
              <span>Claim Received</span>
            </div>
            <p className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
              {successData.message ||
                `Claim received. Reference: ${successData.claimReference}. The Trust will check your transfer against its bank records before issuing a receipt.`}
            </p>
            <div className="p-3 bg-white rounded-md border border-sand/40 flex items-center justify-between">
              <span className="text-xs text-ink-muted">Claim Reference:</span>
              <span className="font-mono font-bold text-forest text-sm">
                {successData.claimReference}
              </span>
            </div>
            <div className="text-[11px] text-ink-sand bg-cream/80 p-2.5 rounded-xs border border-border-warm flex items-center justify-between">
              <span>Status: <strong className="text-amber-800">UNVERIFIED</strong></span>
              <span className="text-[10px] text-ink-muted">Awaiting SBI bank record reconciliation</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuccessData(null);
                setUtrReference("");
              }}
            >
              Submit Another Record
            </Button>
          </div>
        ) : (
          <form id="donation-claim-form" action="/api/donations/claim" method="POST" onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="donorName" className="block text-xs font-bold text-forest mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input
                  id="donorName"
                  name="donorName"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="donorEmail" className="block text-xs font-bold text-forest mb-1">
                  Email Address (For Receipt Delivery) <span className="text-red-600">*</span>
                </label>
                <Input
                  id="donorEmail"
                  name="donorEmail"
                  required
                  type="email"
                  placeholder="e.g. donor@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="donorPhone" className="block text-xs font-bold text-forest mb-1">
                  Mobile Number <span className="text-red-600">*</span>
                </label>
                <Input
                  id="donorPhone"
                  name="donorPhone"
                  required
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-xs font-bold text-forest mb-1">
                  Amount Donated (INR) <span className="text-red-600">*</span>
                </label>
                <Input
                  id="amount"
                  name="amount"
                  required
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="donorPan" className="block text-xs font-bold text-forest mb-1">
                  PAN <span className="text-ink-muted font-normal">(Optional)</span>
                </label>
                <Input
                  id="donorPan"
                  name="donorPan"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="utrReference" className="block text-xs font-bold text-forest mb-1">
                  UTR / Transaction ID <span className="text-red-600">*</span>
                </label>
                <Input
                  id="utrReference"
                  name="utrReference"
                  required
                  placeholder="e.g. 412345678901 or SBIN12345678"
                  value={utrReference}
                  onChange={(e) => setUtrReference(e.target.value)}
                />
                <span className="text-[11px] text-ink-muted mt-1 block">
                  Found on your UPI app confirmation screen or bank SMS/statement.
                </span>
              </div>

              <div>
                <label htmlFor="transferDate" className="block text-xs font-bold text-forest mb-1">
                  Transfer Date <span className="text-red-600">*</span>
                </label>
                <Input
                  id="transferDate"
                  name="transferDate"
                  required
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-bold text-forest mb-1">
                Optional Notes / Dedication
              </label>
              <Input
                id="notes"
                name="notes"
                placeholder="e.g. In memory of late grandparents / Balangir education support"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200/70 flex items-start gap-3">
              <input
                id="whatsappConsent"
                name="whatsappConsent"
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest cursor-pointer"
              />
              <label htmlFor="whatsappConsent" className="text-xs text-ink cursor-pointer select-none leading-relaxed">
                <span className="font-semibold text-forest">Receive receipt & verification updates via WhatsApp.</span>{" "}
                <span className="text-ink-muted">
                  The Trust will send your verification status and official numbered receipt to {donorPhone || "your mobile number"} once matched against bank statements.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={isSubmitting}
                className="w-full sm:w-auto font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Submit Donation Details</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function DonationClaimSection() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-ink-muted">
          Loading contribution options...
        </div>
      }
    >
      <DonationClaimSectionContent />
    </React.Suspense>
  );
}
