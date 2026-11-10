import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/MotionPrimitives";
import { HOMEPAGE_CONTENT } from "@/lib/homepage-content";
import {
  HeartHandshake,
  BookOpen,
  Users,
  Landmark,
  Heart,
  Info,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const STEP_ICONS = [BookOpen, Users, Landmark];

export function SmileFundraisingSection() {
  const data = HOMEPAGE_CONTENT.smileFundraising;

  return (
    <section
      id="fundraising"
      className="py-16 sm:py-20 md:py-24 bg-sand-light border-b border-border-warm scroll-mt-20"
      aria-labelledby="fundraising-heading"
    >
      <Container size="default" className="space-y-10">
        <Reveal>
          <div className="bg-white rounded-xs border-2 border-border-warm shadow-lg p-6 sm:p-10 md:p-12 space-y-8">
            {/* Header Block */}
            <div className="max-w-3xl space-y-4">
              <Badge variant="forest" size="md">
                {data.badge}
              </Badge>
              <h2
                id="fundraising-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-forest tracking-tight leading-[1.14]"
              >
                {data.heading}
              </h2>
              <p className="text-sm sm:text-base text-ink leading-relaxed font-sans max-w-2xl">
                {data.contextNote}
              </p>
            </div>

            {/* 3-Column Contribution & Impact Flow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.utilizationPoints.map((point, idx) => {
                const Icon = STEP_ICONS[idx] || BookOpen;
                return (
                  <div
                    key={point.title}
                    className="p-5 sm:p-6 rounded-xs bg-cream/55 border border-border-warm border-t-2 border-t-terracotta space-y-3 hover:border-terracotta transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xs bg-terracotta text-white flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-forest">
                        {point.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-sand leading-relaxed font-sans">
                        {point.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Beneficiary & Donation Instructions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 p-6 rounded-xs bg-forest text-cream border border-sand/30 space-y-4">
                <div className="flex items-center gap-2 text-sand text-xs font-bold uppercase tracking-wider font-sans">
                  <HeartHandshake className="w-4 h-4 text-sand" aria-hidden="true" />
                  <span>Purpose &amp; Intended Beneficiaries</span>
                </div>
                <p className="text-xs sm:text-sm text-cream leading-relaxed font-sans">
                  <strong className="text-white">Purpose:</strong> {data.purpose}
                </p>
                <p className="text-xs sm:text-sm text-cream leading-relaxed font-sans">
                  <strong className="text-white">Intended Beneficiaries:</strong> {data.beneficiaries}
                </p>
              </div>

              <div className="lg:col-span-5 p-6 rounded-xs bg-cream border border-border-warm flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest block font-sans">
                    How to Contribute
                  </span>
                  <ul className="space-y-2 text-xs text-ink font-sans">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Remit via NEFT, RTGS, or IMPS to the Trust&apos;s State Bank of India account.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-terracotta-dark shrink-0 mt-0.5" aria-hidden="true" />
                      <span>Save your bank UTR / transaction reference number for institutional receipts.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/#donate-sbi" className="flex-1 min-w-[160px]">
                    <Button variant="primary" size="lg" className="w-full justify-center font-bold shadow-md">
                      <Heart className="w-4 h-4 mr-2 fill-current" aria-hidden="true" />
                      <span>DONATE NOW</span>
                    </Button>
                  </Link>
                  <Link href="/donate">
                    <Button variant="outline" size="lg" className="font-semibold bg-white">
                      <span>Receipt Desk</span>
                      <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Explicit Organisational Independence Disclosure */}
            <div className="p-4 rounded-xs bg-cream/65 border border-border-warm flex items-start gap-3 text-xs text-ink-sand font-sans">
              <Info className="w-4 h-4 text-forest shrink-0 mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                {data.authorisationDisclaimer}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
