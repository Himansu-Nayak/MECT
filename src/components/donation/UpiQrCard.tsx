"use client";

import React, { useState } from "react";
import { MECT_ORG } from "@/config/org";
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UpiQrCard() {
  const [copied, setCopied] = useState(false);
  const upiId = MECT_ORG.bank.upiId;
  const beneficiary = MECT_ORG.bank.accountHolder;
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(beneficiary)}&cu=INR`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border-warm p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-warm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-forest" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
              Official SBI UPI QR &amp; VPA Transfer
            </h3>
            <p className="text-xs text-ink-sand">
              Scan or enter VPA in any UPI app — verified State Bank of India account
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest bg-sand/30 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Payment Gateway Fees</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visual QR Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-sand-light/40 rounded-xl border border-sand/40 text-center space-y-3">
          <div className="w-48 h-48 bg-white p-3 rounded-lg border border-border-warm flex flex-col items-center justify-center relative shadow-xs">
            {/* SVG Visual Representation of UPI QR */}
            <svg
              className="w-40 h-40 text-forest"
              viewBox="0 0 100 100"
              fill="currentColor"
              aria-label="UPI QR Code for Mahaveer Educational & Charitable Trust"
              role="img"
            >
              {/* Corner position markers */}
              <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="11" width="14" height="14" rx="1" fill="currentColor" />
              <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="75" y="11" width="14" height="14" rx="1" fill="currentColor" />
              <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="11" y="75" width="14" height="14" rx="1" fill="currentColor" />

              {/* Timing patterns & alignment */}
              <line x1="33" y1="18" x2="67" y2="18" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="18" y1="33" x2="18" y2="67" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <rect x="71" y="71" width="16" height="16" rx="1" fill="none" stroke="currentColor" strokeWidth="3" />
              <rect x="76" y="76" width="6" height="6" fill="currentColor" />

              {/* Data module pattern */}
              <rect x="36" y="6" width="5" height="5" />
              <rect x="46" y="6" width="5" height="5" />
              <rect x="58" y="6" width="5" height="5" />
              <rect x="36" y="24" width="5" height="5" />
              <rect x="46" y="24" width="5" height="5" />
              <rect x="58" y="24" width="5" height="5" />
              <rect x="6" y="36" width="5" height="5" />
              <rect x="6" y="46" width="5" height="5" />
              <rect x="6" y="58" width="5" height="5" />
              <rect x="24" y="36" width="5" height="5" />
              <rect x="24" y="46" width="5" height="5" />
              <rect x="24" y="58" width="5" height="5" />
              <rect x="36" y="36" width="10" height="10" fill="currentColor" />
              <rect x="54" y="36" width="10" height="10" fill="currentColor" />
              <rect x="36" y="54" width="10" height="10" fill="currentColor" />
              <rect x="54" y="54" width="10" height="10" fill="currentColor" />
              <rect x="48" y="48" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="80" y="36" width="6" height="6" />
              <rect x="80" y="50" width="6" height="6" />
              <rect x="36" y="80" width="6" height="6" />
              <rect x="50" y="80" width="6" height="6" />
            </svg>
            <span className="text-[10px] font-mono font-bold text-terracotta-dark mt-1">SBI UPI</span>
          </div>
          <span className="text-[11px] font-semibold text-ink-sand">
            Scan with any UPI app (PhonePe, Google Pay, Paytm, BHIM)
          </span>
        </div>

        {/* UPI VPA Details & Deep Link */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 bg-sand/20 rounded-lg border border-sand/40 space-y-2">
            <span className="text-[11px] font-bold text-forest uppercase tracking-wider block">
              Official UPI Virtual Payment Address (VPA)
            </span>
            <div className="flex items-center justify-between gap-3 bg-white px-3 py-2.5 rounded-md border border-border-warm">
              <span className="font-mono font-bold text-forest text-sm sm:text-base selection:bg-sand">
                {upiId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-forest text-cream hover:bg-forest-deep transition-colors"
                aria-label="Copy UPI VPA to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
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
            <div className="text-[11px] text-ink-sand pt-1 flex items-center justify-between">
              <span>Beneficiary: <strong className="text-forest">{beneficiary}</strong></span>
              <span className="text-[10px] text-ink-muted">SBI Bolangir</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-forest block">Easy 3-Step Contribution:</span>
            <ol className="text-xs text-ink-sand space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Open your preferred UPI mobile application or click <strong>Open UPI App</strong> below.</li>
              <li>Verify the beneficiary shows <strong>{beneficiary}</strong> before confirming the transfer.</li>
              <li>Copy the 12-digit <strong>UTR / Reference Number</strong> from your transaction history and submit it in the claim form below.</li>
            </ol>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <a href={upiDeepLink} className="inline-block">
              <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>Open UPI App</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
