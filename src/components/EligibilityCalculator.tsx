"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
} from "lucide-react";

const ODISHA_DISTRICTS = [
  "Khordha (Bhubaneswar)",
  "Cuttack",
  "Ganjam (Berhampur)",
  "Sambalpur",
  "Balasore",
  "Puri",
  "Mayurbhanj (Baripada)",
  "Sundargarh (Rourkela)",
  "Bhadrak",
  "Jajpur",
  "Kalahandi",
  "Koraput",
  "Bolangir",
  "Dhenkanal",
  "Angul",
  "Other Odisha District (All 30 Mandated)",
];

export function EligibilityCalculator() {
  const [district, setDistrict] = useState("Khordha (Bhubaneswar)");
  const [stream, setStream] = useState("undergraduate");
  const [scoreBracket, setScoreBracket] = useState("first-class");
  const [incomeBracket, setIncomeBracket] = useState("below-150k");

  // Determine preliminary matching
  const isScoreEligible = scoreBracket !== "below-60";
  const isMeansEligible =
    incomeBracket === "below-150k" || incomeBracket === "150k-250k";

  return (
    <section
      id="eligibility-calculator"
      className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0B3B24]/10 scroll-mt-16"
      aria-label="Interactive Scholar Eligibility Calculator"
    >
      <Container size="default" className="space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold">Interactive Scheme Explorer</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B24] tracking-tight">
            Check Preliminary Scheme Criteria
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
            Select your academic stream, previous examination performance, and home district in Odisha to discover proposed grant and mentorship initiatives matching your profile.
          </p>
        </div>

        {/* Advisory Callout */}
        <div className="max-w-4xl mx-auto bg-amber-50/80 border border-amber-200/80 p-4 rounded-xs text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed font-sans">
            <strong>Preliminary Discovery Notice:</strong> This interactive calculator is an exploratory self-assessment tool. Indicative scheme matching does not constitute an official grant sanction, eligibility confirmation, or binding financial commitment. Formal awards are contingent upon verified income certificates, accredited college enrollment, and independent Scrutiny Committee approval under the Trust Deed.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Criteria Controls */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xs border border-[#0B3B24]/15 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B3B24]/10">
              <span className="font-serif font-bold text-lg text-[#0B3B24]">
                Self-Reported Criteria
              </span>
              <span className="text-[11px] text-[#C5A059] font-semibold uppercase tracking-wider">
                Step 1 of 2
              </span>
            </div>

            <Select
              id="calc-district"
              label="Home District (Odisha)"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={ODISHA_DISTRICTS.map((d) => ({ value: d, label: d }))}
            />

            <Select
              id="calc-stream"
              label="Current / Intended Academic Stream"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              options={[
                {
                  value: "undergraduate",
                  label: "General Undergraduate (B.A, B.Sc, B.Com)",
                },
                {
                  value: "engineering-technical",
                  label: "Technical & Professional (B.Tech, B.E, B.Arch)",
                },
                {
                  value: "medical-allied",
                  label: "Medical & Allied Health (MBBS, BDS, B.Pharm, B.Sc Nursing)",
                },
                {
                  value: "diploma-polytechnic",
                  label: "Diploma & Polytechnic Vocational Courses",
                },
              ]}
            />

            <Select
              id="calc-score"
              label="Qualifying Examination Aggregate (+2 / 10th / Diploma)"
              value={scoreBracket}
              onChange={(e) => setScoreBracket(e.target.value)}
              options={[
                {
                  value: "above-80",
                  label: "Distinction Aggregate (80% and above)",
                },
                {
                  value: "first-class",
                  label: "First Division Aggregate (60% to 79.9%)",
                },
                {
                  value: "below-60",
                  label: "Second Division / Pass (< 60% aggregate)",
                },
              ]}
            />

            <Select
              id="calc-income"
              label="Annual Household Gross Family Income"
              value={incomeBracket}
              onChange={(e) => setIncomeBracket(e.target.value)}
              options={[
                {
                  value: "below-150k",
                  label: "Priority Need Bracket (Below ₹1,50,000 / year)",
                },
                {
                  value: "150k-250k",
                  label: "General Need Bracket (₹1,50,000 to ₹2,50,000 / year)",
                },
                {
                  value: "above-250k",
                  label: "Upper Bracket (> ₹2,50,000 / year)",
                },
              ]}
            />

            <div className="pt-2 text-[11px] text-[#4A5568] border-t border-[#0B3B24]/10 space-y-1 font-sans">
              <p className="flex items-center gap-1.5 font-medium text-[#0B3B24]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                Zero Processing Charges
              </p>
              <p>Applications are appraised free of cost with zero agent commissions.</p>
            </div>
          </div>

          {/* Right Column: Matched Proposed Initiatives */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-serif font-bold text-xl text-[#0B3B24]">
                Matched Proposed Schemes
              </h3>
              <span className="text-xs text-[#4A5568] font-medium font-sans">
                Location: {district.split(" ")[0]}
              </span>
            </div>

            {/* Scheme 1: Shiksha Protsahan */}
            {isScoreEligible && isMeansEligible ? (
              <div className="bg-white p-5 rounded-xs border-2 border-[#C5A059] shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                        Flagship Proposed Scheme
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#0B3B24]">
                        Mahavir Shiksha Protsahan Yojana
                      </h4>
                    </div>
                  </div>
                  <Badge variant="gold-dark" size="sm">
                    Proposed Grant
                  </Badge>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                  Proposed higher education tuition fee grants remitted directly to accredited colleges in Odisha. Designed for students from households with verified annual income under ₹2,50,000.
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#0B3B24]/10">
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ Preliminary Academic & Income Criteria Satisfied
                  </span>
                  <Link href="/scholarships">
                    <span className="text-[#0B3B24] hover:underline font-semibold flex items-center gap-1">
                      Review Scheme Rules <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Scheme 2: Pratibha Excellence Fellowship */}
            {stream === "engineering-technical" || stream === "medical-allied" ? (
              <div className="bg-white p-5 rounded-xs border border-[#0B3B24]/20 shadow-xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#C5A059]/20 text-[#072617] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A5E24] tracking-wider block">
                      Competitive Entrance & Technical Track
                    </span>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#0B3B24]">
                      Pratibha Excellence Fellowship (Proposed)
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                  Proposed national entrance exam registration fee support and STEM reference text allocations for merit-ranked scholars.
                </p>
                <div className="pt-1 flex items-center justify-between text-xs border-t border-[#0B3B24]/10">
                  <span className="text-[11px] text-emerald-700 font-bold">
                    ✓ Technical & STEM Stream Matched
                  </span>
                  <Link href="/scholarships">
                    <span className="text-[#0B3B24] hover:underline font-semibold flex items-center gap-1">
                      View Syllabus & Norms <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Scheme 3: Community Learning Hubs & Mentorship */}
            <div className="bg-white p-5 rounded-xs border border-[#0B3B24]/15 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0B3B24] tracking-wider block">
                    Community Infrastructure & Guidance
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#0B3B24]">
                    Project Samarth & Mentorship Circle
                  </h4>
                </div>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed font-sans">
                Open to enrolled students across Odisha. Connect with university mentors and access community reference libraries in pilot cluster districts.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-[#0B3B24]/10">
                <span className="text-[11px] text-emerald-700 font-bold">
                  ✓ Universal Access Across Mandated Districts
                </span>
                <Link href="/programmes">
                  <span className="text-[#0B3B24] hover:underline font-semibold flex items-center gap-1">
                    Hub Locations <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Fallback note if below minimum criteria */}
            {!isScoreEligible && (
              <div className="bg-amber-50 p-4 rounded-xs border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Appraisal Guidance:</span>
                While proposed tuition fee grants specify a minimum 60% qualifying score, you are invited to enroll in our <strong>Academic Mentorship Circle</strong> and access <strong>Project Samarth Study Hubs</strong>.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
