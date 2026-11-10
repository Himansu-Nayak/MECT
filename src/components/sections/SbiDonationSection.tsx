"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TRUST_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Landmark,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface SbiDonationSectionProps {
  /**
   * Drop-in slot for future verified SBI official QR image (e.g. "/images/sbi-verified-qr.png").
   * Kept null until the official beneficiary QR code is supplied and tested.
   */
  verifiedQrSrc?: string | null;
  /**
   * Drop-in slot for future official SBI brand emblem file (e.g. "/images/sbi-logo.png").
   */
  officialSbiLogoSrc?: string | null;
}

export function SbiDonationSection({
  verifiedQrSrc = null,
  officialSbiLogoSrc = null,
}: SbiDonationSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, fieldKey: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  const bankFields = [
    {
      key: "bankName",
      label: "Bank Name",
      value: TRUST_CONFIG.bank.bankName,
      mono: false,
      highlight: true,
    },
    {
      key: "accountName",
      label: "Account Holder Name",
      value: TRUST_CONFIG.bank.accountName,
      mono: false,
      highlight: true,
    },
    {
      key: "accountNumber",
      label: "Account Number",
      value: TRUST_CONFIG.bank.accountNumber,
      mono: true,
      highlight: true,
    },
    {
      key: "ifsc",
      label: "IFSC Code",
      value: TRUST_CONFIG.bank.ifsc,
      mono: true,
      highlight: true,
    },
    {
      key: "branch",
      label: "Branch",
      value: TRUST_CONFIG.bank.branch,
      mono: false,
      highlight: false,
    },
    {
      key: "accountType",
      label: "Account Type",
      value: TRUST_CONFIG.bank.accountType,
      mono: false,
      highlight: false,
    },
  ];

  return (
    <div
      id="donate-sbi"
      className="bg-white text-ink rounded-xs border-2 border-sand shadow-2xl overflow-hidden scroll-mt-20"
    >
      {/* Top Banner — STATE BANK OF INDIA Official Bank Header */}
      <div className="bg-forest text-white p-6 sm:p-8 border-b-2 border-terracotta flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {officialSbiLogoSrc ? (
            <div className="w-14 h-14 rounded-xs bg-white p-2 flex items-center justify-center shrink-0">
              <Image
                src={officialSbiLogoSrc}
                alt="State Bank of India Official Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-xs bg-terracotta border-2 border-sand flex flex-col items-center justify-center shrink-0 shadow-inner"
              aria-label="State Bank of India Institutional Badge"
            >
              <Landmark className="w-5 h-5 text-cream" aria-hidden="true" />
              <span className="text-[11px] font-bold tracking-widest text-white font-sans mt-0.5">
                SBI
              </span>
            </div>
          )}

          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-sand block font-sans">
              Verified Institutional Donation Account
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide uppercase mt-0.5">
              STATE BANK OF INDIA
            </h3>
            <p className="text-xs text-cream/90 font-sans mt-0.5">
              Source: Supplied Cancelled Cheque • {TRUST_CONFIG.bank.branch}
            </p>
          </div>
        </div>

        <Badge variant="gold" size="md" className="self-start sm:self-center shrink-0">
          NEFT / RTGS / IMPS Ready
        </Badge>
      </div>

      {/* Main Content Grid: Left Bank Details Card, Right Procedure & Prepared QR Area */}
      <div className="p-5 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Copyable Bank Details Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border-warm pb-3">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-forest">
              Direct Bank Transfer Credentials
            </h4>
            <span
              className="text-xs font-semibold text-terracotta-dark font-sans"
              aria-live="polite"
            >
              {copiedField ? "Copied to clipboard" : "Tap copy on any field"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {bankFields.map((item) => {
              const isCopied = copiedField === item.key;
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-xs border transition-colors flex items-start justify-between gap-2.5 ${
                    item.highlight
                      ? "bg-cream/65 border-terracotta/45"
                      : "bg-sand-light/60 border-border-warm"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-dark block font-sans">
                      {item.label}
                    </span>
                    <span
                      className={`block mt-1 break-words ${
                        item.mono
                          ? "font-mono text-base sm:text-lg font-bold text-forest tracking-wide tabular-nums"
                          : "font-sans text-xs sm:text-sm font-bold text-forest"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.value, item.key)}
                    className="min-h-[36px] min-w-[36px] p-2 rounded-xs bg-white border border-border-warm text-terracotta-dark hover:bg-terracotta hover:text-white transition-colors shrink-0 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-terracotta"
                    aria-label={`Copy ${item.label}: ${item.value}`}
                    title={`Copy ${item.label}`}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-forest" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* 3-Step Donation Procedure */}
          <div className="p-4 sm:p-5 rounded-xs bg-cream border border-border-warm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest block font-sans">
              Step-by-Step Donation Procedure
            </span>
            <ol className="space-y-2 text-xs text-ink font-sans list-decimal pl-4">
              <li>
                Initiate an electronic transfer (<strong>NEFT / RTGS / IMPS</strong>) using the State Bank of India credentials above (Account No. <span className="font-mono font-bold">{TRUST_CONFIG.bank.accountNumber}</span>, IFSC <span className="font-mono font-bold">{TRUST_CONFIG.bank.ifsc}</span>).
              </li>
              <li>
                Record your bank <strong>UTR / Transaction Reference Number</strong> after payment completion.
              </li>
              <li>
                Submit your remittance details on our{" "}
                <Link href="/donate#receipt-claim" className="text-terracotta-dark font-bold underline hover:text-forest">
                  Donor Receipt Desk
                </Link>{" "}
                or write to <span className="font-semibold">{TRUST_CONFIG.contact.emails.official}</span> for an official acknowledgement receipt.
              </li>
            </ol>
          </div>

          {/* Primary Donate CTA */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Link href="/donate#receipt-claim" className="flex-1 min-w-[200px]">
              <Button variant="primary" size="lg" className="w-full justify-center font-bold shadow-lg text-sm sm:whitespace-nowrap">
                <Heart className="w-4 h-4 mr-2 fill-current shrink-0" aria-hidden="true" />
                <span>Donate &amp; Record UTR</span>
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="secondary" size="lg" className="font-semibold sm:whitespace-nowrap">
                <span>Full Donation Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5 shrink-0" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right 5 Columns: Prepared Donation QR Code Integration Area */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-xs bg-cream/65 border-2 border-dashed border-terracotta/35 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-forest font-sans">
              <QrCode className="w-4 h-4 text-terracotta-dark" aria-hidden="true" />
              <span>UPI / QR Payment Area</span>
            </div>

            {verifiedQrSrc ? (
              <div className="bg-white p-4 rounded-xs border border-border-warm inline-block mx-auto">
                <Image
                  src={verifiedQrSrc}
                  alt="Verified State Bank of India Donation QR Code for MAHAVEER EDUCATIONAL & CHARITABLE TRUST"
                  width={200}
                  height={200}
                  className="w-48 h-48 object-contain mx-auto"
                />
                <p className="text-[11px] font-semibold text-terracotta-dark mt-2">
                  Verify payee displays: {TRUST_CONFIG.bank.accountName}
                </p>
              </div>
            ) : (
              <div className="py-8 px-4 rounded-xs bg-sand-light border border-border-warm space-y-3">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-terracotta mx-auto flex items-center justify-center text-terracotta-dark shadow-xs">
                  <Clock className="w-7 h-7 text-forest" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-xs bg-forest text-cream text-[10px] font-bold uppercase tracking-wider font-sans">
                    Awaiting Official QR Supply
                  </span>
                  <h5 className="font-serif text-base font-bold text-forest">
                    Donation QR Code Pending Verification
                  </h5>
                </div>
                <p className="text-xs text-ink leading-relaxed font-sans max-w-xs mx-auto">
                  A separate verified UPI QR code linked to SBI Account <strong className="font-mono text-forest">{TRUST_CONFIG.bank.accountNumber}</strong> has not yet been supplied. No synthetic or unverified QR code is published.
                </p>
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-forest font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-dark" aria-hidden="true" />
                  <span>Please use NEFT / RTGS / IMPS bank transfer</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xs bg-white border border-border-warm text-[11px] text-ink-secondary font-sans text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                For donor security, direct cash transfers or unverified third-party UPI links are not used. Always confirm the beneficiary reads <strong>MAHAVEER EDUCATIONAL &amp; CHARITABLE TRUST</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
