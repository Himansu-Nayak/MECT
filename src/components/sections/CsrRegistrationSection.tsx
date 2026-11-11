"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal, GalleryReveal } from "@/components/ui/MotionPrimitives";
import { TRUST_CONFIG } from "@/lib/config";
import {
  FileCheck,
  ShieldCheck,
  Download,
  Eye,
  X,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export function CsrRegistrationSection() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!previewOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewOpen(false);
        setZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [previewOpen]);

  const organisationalCredentials = [
    {
      label: "CSR Registration Number",
      value: TRUST_CONFIG.statutory.mcaCsrNumber,
      sub: `Approved 09-11-2024 (SRN: N14617237)`,
      highlight: true,
    },
    {
      label: "Permanent Account Number (PAN)",
      value: TRUST_CONFIG.statutory.pan,
      sub: `Issued ${TRUST_CONFIG.statutory.panIssueDate}`,
      highlight: false,
    },
    {
      label: "Registered Trust Deed",
      value: "Doc No. 40311302194",
      sub: "Book 4, Vol 45 • Balangir Sub-Registrar (30-07-2013)",
      highlight: false,
    },
    {
      label: "Section 12A Registration URN",
      value: TRUST_CONFIG.statutory.section12AUrn,
      sub: `DIN: ${TRUST_CONFIG.statutory.section12ADin} (AY 2024-25 to 2026-27)`,
      highlight: false,
    },
    {
      label: "NITI Aayog NGO Darpan ID",
      value: TRUST_CONFIG.statutory.ngoDarpanId,
      sub: "Government of India Voluntary Sector Registry",
      highlight: false,
    },
    {
      label: "MoSJE e-Anudaan NGO ID",
      value: TRUST_CONFIG.statutory.mosjeAnudaanId,
      sub: "Ministry of Social Justice & Empowerment Portal",
      highlight: false,
    },
  ];

  return (
    <section
      id="csr-registration"
      className="py-16 sm:py-20 md:py-24 bg-white border-b border-border-warm scroll-mt-20"
      aria-labelledby="csr-registration-heading"
    >
      <Container size="default" className="space-y-10">
        {/* Main Institutional Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="contrast-gold" size="md">
            Schedule VII Eligible Entity • Verified Records
          </Badge>
          <h2
            id="csr-registration-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-forest tracking-tight leading-[1.14]"
          >
            CSR REGISTRATION &amp; ORGANISATIONAL DETAILS
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans max-w-2xl mx-auto">
            Mahaveer Educational &amp; Charitable Trust (MECT) maintains registered statutory credentials under Section 135 of the Companies Act, 2013 for transparent CSR collaboration across Odisha.
          </p>
        </div>

        {/* Two-Column Organisational Credentials & Certificate Preview Panel */}
        <Reveal>
          <div className="bg-cream/40 rounded-xs border-2 border-border-warm shadow-xl p-6 sm:p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Organisational Dossier Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-border-warm pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-forest">
                      {TRUST_CONFIG.legalName} ({TRUST_CONFIG.acronym})
                    </h3>
                    <span className="text-xs text-terracotta-dark font-semibold font-sans">
                      Irrevocable Public Charitable Trust (MECT)
                    </span>
                  </div>
                </div>
                <Badge variant="forest" size="sm">
                  Verified Dossier
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {organisationalCredentials.map((cred) => (
                  <div
                    key={cred.label}
                    className={`p-4 rounded-xs border ${
                      cred.highlight
                        ? "bg-forest text-white border-terracotta shadow-sm"
                        : "bg-white text-ink border-border-warm"
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider block font-sans ${
                        cred.highlight ? "text-sand" : "text-forest"
                      }`}
                    >
                      {cred.label}
                    </span>
                    <span
                      className={`font-mono text-base sm:text-lg font-bold block mt-1 ${
                        cred.highlight ? "text-white" : "text-forest"
                      }`}
                    >
                      {cred.value}
                    </span>
                    <span
                      className={`text-[11px] block mt-0.5 font-sans leading-snug ${
                        cred.highlight ? "text-cream/95" : "text-ink-secondary"
                      }`}
                    >
                      {cred.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* CSR Schedule VII Focus List */}
              <div className="p-4 sm:p-5 rounded-xs bg-sage/55 border border-border-warm space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-forest block font-sans">
                  Schedule VII Collaborative Programme Areas
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                    <span>Education &amp; Remedial Support (Schedule VII ii)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                    <span>Women&apos;s Vocational Skills (Schedule VII iii)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                    <span>Safe Drinking Water — Jal Seva (Schedule VII i)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0" aria-hidden="true" />
                    <span>Destitute Nutrition &amp; Relief (Schedule VII i)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="/csr-partnerships">
                  <Button variant="primary" size="lg" className="font-bold">
                    <Briefcase className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span>CSR Partnerships &amp; Proposals</span>
                  </Button>
                </Link>
                <Link href="/statutory-disclosures">
                  <Button variant="outline" size="lg" className="font-semibold bg-white">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-terracotta-dark" aria-hidden="true" />
                    <span>Statutory Vault</span>
                    <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Verified Registration Certificate Preview & Download */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-6 rounded-xs bg-forest text-white border border-sand/35 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cream font-sans">
                    <FileCheck className="w-4 h-4 text-sand" aria-hidden="true" />
                    <span>Official CSR Registration Letter</span>
                  </div>
                  <span className="text-[10px] font-mono bg-terracotta text-white px-2 py-0.5 rounded-xs border border-sand/40">
                    {TRUST_CONFIG.statutory.mcaCsrNumber}
                  </span>
                </div>

                {/* Clean Bordered Document Thumbnail */}
                <GalleryReveal className="relative bg-white rounded-xs overflow-hidden border border-sand/50 aspect-[3/4] max-h-[340px] w-full mx-auto group">
                  <Image
                    src="/documents/mect-csr1-certificate.png"
                    alt="Official CSR Registration Approval Letter CSR00081063 for Mahaveer Educational & Charitable Trust"
                    fill
                    loading="lazy"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-[1.015]"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </GalleryReveal>

                <p className="text-[11px] text-cream/90 leading-relaxed font-sans">
                  Extracted from official trust records (Ref: SRN-N14617237, Dated 09-11-2024, ROC-DELHI, PAN: {TRUST_CONFIG.statutory.pan}).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setZoomed(false);
                      setPreviewOpen(true);
                    }}
                    className="min-h-[44px] px-3 py-2 rounded-xs bg-forest-deep hover:bg-white/10 text-white border border-white/25 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-sand"
                  >
                    <Eye className="w-4 h-4 text-sand" aria-hidden="true" />
                    <span>Preview Full Letter</span>
                  </button>

                  <a
                    href="/documents/mect-csr1-certificate.png"
                    download="MECT-CSR1-Registration-CSR00081063.png"
                    className="min-h-[44px] px-3 py-2 rounded-xs bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-sand"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>Download Certificate</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Accessible Fullscreen Certificate Preview Modal */}
      {previewOpen && (
        <div
          className="fixed inset-0 z-50 bg-forest-deep/85 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="CSR Registration Certificate Preview"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="bg-white rounded-xs max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border-2 border-terracotta shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-forest text-white px-5 py-3.5 flex items-center justify-between border-b border-sand/30">
              <div>
                <h4 className="font-serif text-base font-bold text-white">
                  CSR Registration Approval Letter ({TRUST_CONFIG.statutory.mcaCsrNumber})
                </h4>
                <span className="text-[11px] text-cream font-sans">
                  Dated 09-11-2024 • SRN-N14617237 • PAN: {TRUST_CONFIG.statutory.pan}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="min-h-[40px] min-w-[40px] p-2 rounded-xs text-white hover:bg-white/10 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-sand"
                aria-label="Close certificate preview"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6 bg-cream flex justify-center">
              <Image
                src="/documents/mect-csr1-certificate.png"
                alt="Official CSR Registration Approval Letter CSR00081063"
                width={785}
                height={1015}
                loading="eager"
                className={`h-auto border border-border-warm shadow-md bg-white transition-all duration-200 ${
                  zoomed ? "w-[785px] max-w-none" : "w-full max-w-[600px]"
                }`}
              />
            </div>
            <div className="p-3.5 bg-white border-t border-border-warm flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="min-h-[40px] px-3 py-1.5 rounded-xs border border-forest/30 text-forest hover:bg-cream text-xs font-semibold inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-terracotta"
              >
                {zoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                    <span>Fit to Window</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                    <span>Actual Size (100%)</span>
                  </>
                )}
              </button>
              <div className="flex items-center gap-2.5">
                <a
                  href="/documents/mect-csr1-certificate.png"
                  download="MECT-CSR1-Registration-CSR00081063.png"
                  className="min-h-[40px] px-4 py-2 rounded-xs bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download Certificate PNG</span>
                </a>
                <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
