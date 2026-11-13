"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TRUST_CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal, MOTION_DURATION, MOTION_EASING } from "@/components/ui/MotionPrimitives";
import { CopyButton } from "@/components/motion/CopyButton";
import { SlideTextButton } from "@/components/motion/SlideTextButton";
import {
  Landmark,
  QrCode,
  ShieldCheck,
  Heart,
  ArrowRight,
  Clock,
  CheckCircle2,
  Download,
} from "lucide-react";

interface SbiDonationSectionProps {
  /**
   * Verified SBI official Scan & Pay QR image asset.
   * Defaults cleanly to TRUST_CONFIG.bank.verifiedQrSrc.
   */
  verifiedQrSrc?: string | null;
  /**
   * Drop-in slot for future official SBI brand emblem file (e.g. "/images/sbi-logo.png").
   */
  officialSbiLogoSrc?: string | null;
}

export function SbiDonationSection({
  verifiedQrSrc = TRUST_CONFIG.bank.verifiedQrSrc,
  officialSbiLogoSrc = null,
}: SbiDonationSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

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
    <Reveal direction="fade" tone="standard">
      <div
        id="donate-sbi"
        className="bg-white text-ink rounded-xs border-2 border-sand shadow-2xl overflow-hidden scroll-mt-32"
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
              Source: Supplied Cancelled Cheque &amp; SBI Scan &amp; Pay QR • {TRUST_CONFIG.bank.branch}
            </p>
          </div>
        </div>

        <Badge variant="gold" size="md" className="self-start sm:self-center shrink-0">
          UPI QR • NEFT / RTGS / IMPS
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
                  <CopyButton
                    value={item.value}
                    label={`${item.label}: ${item.value}`}
                    onCopied={() => {
                      setCopiedField(item.key);
                      setTimeout(() => setCopiedField(null), 2200);
                    }}
                  />
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
                Scan the official <strong>SBI Scan &amp; Pay UPI QR</strong> (UPI ID:{" "}
                <span className="font-mono font-bold text-forest">{TRUST_CONFIG.bank.upiId}</span>) via BHIM, YONO SBI, GPay, Paytm or WhatsApp Pay — or initiate an electronic transfer (<strong>NEFT / RTGS / IMPS</strong>) to Account No.{" "}
                <span className="font-mono font-bold">{TRUST_CONFIG.bank.accountNumber}</span>, IFSC{" "}
                <span className="font-mono font-bold">{TRUST_CONFIG.bank.ifsc}</span>.
              </li>
              <li>
                Record your bank <strong>UTR / UPI Transaction Reference Number</strong> after payment completion.
              </li>
              <li>
                Submit your remittance details on our{" "}
                <Link href="/donate?method=SBI_DIRECT" className="text-terracotta-dark font-bold underline hover:text-forest">
                  Unified Donation &amp; UTR Desk
                </Link>{" "}
                or write to <span className="font-semibold">{TRUST_CONFIG.contact.emails.official}</span> for an official acknowledgement receipt.
              </li>
            </ol>
          </div>

          {/* Primary Donate CTA */}
          <div className="pt-1 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <Link href="/donate?method=SBI_DIRECT" className="w-full sm:flex-1 sm:min-w-[200px]">
              <Button variant="primary" size="lg" className="w-full justify-center font-bold shadow-lg text-sm sm:whitespace-nowrap">
                <Heart className="w-4 h-4 mr-2 fill-current shrink-0" aria-hidden="true" />
                <span>Donate &amp; Record UTR</span>
              </Button>
            </Link>
            <Link href="/donate" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center font-semibold sm:whitespace-nowrap">
                <SlideTextButton>
                  <span>Full Donation Portal</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </SlideTextButton>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right 5 Columns: Official SBI Scan & Pay Static UPI QR Card */}
        <div className="lg:col-span-5">
          <div className="p-5 sm:p-6 rounded-xs bg-cream/65 border border-terracotta/35 text-center space-y-4">
            <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-forest font-sans">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <QrCode className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                <span>SBI Scan &amp; Pay</span>
              </div>
              <span className="px-2 py-0.5 rounded-xs bg-forest text-cream text-[10px] font-bold tracking-wider whitespace-nowrap shrink-0">
                Static UPI QR
              </span>
            </div>

            {verifiedQrSrc ? (
              <div className="space-y-3">
                {/* Stationary, crisp un-animated QR card */}
                <div className="bg-white p-2.5 sm:p-3 rounded-xs border border-border-warm shadow-md w-full max-w-[260px] sm:max-w-[280px] mx-auto">
                  <Image
                    src={verifiedQrSrc}
                    alt="Official State Bank of India BHIM UPI Scan and Pay QR Code for MAHAVEER EDUCATIONAL & CHARITABLE TRUST (UPI ID: 86971610172@sbi)"
                    width={952}
                    height={1323}
                    sizes="(max-width: 640px) 260px, 280px"
                    className="w-full h-auto object-contain rounded-xs mx-auto"
                    loading="eager"
                  />
                </div>

                {/* Copyable Official UPI ID + Save QR for Mobile Apps */}
                <div className="p-3 rounded-xs bg-white border border-terracotta/40 space-y-2 text-left max-w-[300px] mx-auto">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta-dark block font-sans">
                        Official SBI UPI ID
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-forest break-all">
                        {TRUST_CONFIG.bank.upiId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <CopyButton
                        value={TRUST_CONFIG.bank.upiId}
                        label={`Official SBI UPI ID: ${TRUST_CONFIG.bank.upiId}`}
                        className="bg-cream"
                        onCopied={() => {
                          setCopiedField("upiId");
                          setTimeout(() => setCopiedField(null), 2200);
                        }}
                      />
                      <a
                        href={verifiedQrSrc}
                        download="MECT-SBI-UPI-QR.png"
                        className="min-h-[36px] min-w-[36px] p-2 rounded-xs bg-cream border border-border-warm text-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-terracotta"
                        aria-label="Download official MECT SBI UPI QR code image"
                        title="Download QR image for UPI app upload"
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                  <div className="min-h-[18px]" aria-live="polite">
                    <AnimatePresence>
                      {copiedField === "upiId" && (
                        <motion.span
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : MOTION_DURATION.fast, ease: MOTION_EASING.institutional }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-sage text-forest text-[11px] font-semibold font-sans"
                        >
                          <CheckCircle2 className="w-3 h-3 text-terracotta-dark shrink-0" aria-hidden="true" />
                          <span>Copied {TRUST_CONFIG.bank.upiId}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
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
                Static UPI payments are not auto-verified. Before sending funds, confirm your UPI app displays beneficiary <strong>MAHAVEER EDUCATIONAL CHARITA</strong> ({TRUST_CONFIG.bank.upiId}), then submit your UPI Reference / UTR on the Receipt Desk.
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Reveal>
  );
}
