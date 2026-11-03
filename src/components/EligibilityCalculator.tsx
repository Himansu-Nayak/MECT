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
  "Other Odisha District (All 30 Covered)",
];

export function EligibilityCalculator() {
  const [district, setDistrict] = useState("Khordha (Bhubaneswar)");
  const [stream, setStream] = useState("undergraduate");
  const [scoreBracket, setScoreBracket] = useState("first-class");
  const [incomeBracket, setIncomeBracket] = useState("below-150k");

  // Determine eligibility matches
  const isScoreEligible = scoreBracket !== "below-60";
  const isMeansEligible =
    incomeBracket === "below-150k" || incomeBracket === "150k-250k";

  return (
    <section
      id="eligibility-calculator"
      className="py-20 md:py-28 bg-[#F4EFE6] border-b border-[#0B3B24]/10"
      aria-label="Interactive Scholar Eligibility Calculator"
    >
      <Container size="default" className="space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="gold">Interactive Scholar Discovery</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B3B24] tracking-tight">
            Check Your Eligibility & Match Schemes
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed font-sans">
            Select your academic stream, previous exam performance, and district in Odisha to discover qualifying tuition grants, STEM fellowships, and study hub benefits.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Criteria Controls */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xs border border-[#0B3B24]/15 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#0B3B24]/10">
              <span className="font-serif font-bold text-lg text-[#0B3B24]">
                Scholar Profile Criteria
              </span>
              <Badge variant="gold" size="sm">
                Odisha Domicile
              </Badge>
            </div>

            {/* 1. Domicile District */}
            <Select
              id="calc-district"
              label="1. Home District (Odisha)"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={ODISHA_DISTRICTS.map((dist) => ({
                value: dist,
                label: dist,
              }))}
            />

            {/* 2. Academic Level & Stream */}
            <Select
              id="calc-stream"
              label="2. Academic Stream / Degree"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              options={[
                {
                  value: "undergraduate",
                  label: "Undergraduate Degree (B.Sc / B.Com / B.A)",
                },
                {
                  value: "engineering",
                  label: "Engineering & Technology (B.Tech / Diploma)",
                },
                {
                  value: "stem-fellowship",
                  label: "Competitive Exam & STEM Fellowship (GATE/State Exams)",
                },
                {
                  value: "higher-secondary",
                  label: "+2 Higher Secondary (Science / Commerce / Arts)",
                },
              ]}
            />

            {/* 3. Previous Academic Score */}
            <Select
              id="calc-score"
              label="3. Qualifying Exam Performance"
              value={scoreBracket}
              onChange={(e) => setScoreBracket(e.target.value)}
              options={[
                {
                  value: "distinction",
                  label: "85% and above (High Distinction)",
                },
                {
                  value: "first-class",
                  label: "70% to 84% Aggregate (First Division)",
                },
                {
                  value: "qualifying",
                  label: "60% to 69% Aggregate (Qualifying Merit)",
                },
                {
                  value: "below-60",
                  label: "Below 60% Aggregate",
                },
              ]}
            />

            {/* 4. Annual Household Income */}
            <Select
              id="calc-income"
              label="4. Annual Household Income Bracket"
              value={incomeBracket}
              onChange={(e) => setIncomeBracket(e.target.value)}
              options={[
                {
                  value: "below-150k",
                  label: "Below ₹1,50,000 / year (Priority Need Tier 1)",
                },
                {
                  value: "150k-250k",
                  label: "₹1,50,000 to ₹2,50,000 / year (Need Tier 2)",
                },
                {
                  value: "250k-400k",
                  label: "₹2,50,000 to ₹4,00,000 / year (Special Assistance)",
                },
                {
                  value: "above-400k",
                  label: "Above ₹4,00,000 / year (Mentorship & Study Hubs Only)",
                },
              ]}
            />

            {/* Fiduciary disclaimer */}
            <div className="p-3 bg-[#F4EFE6] rounded-xs border border-[#0B3B24]/10 text-[11px] text-[#4A5568] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0B3B24] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Calculations are provisional estimates based on draft trustee appraisal norms. Formal income certificate verification is mandatory.
              </span>
            </div>
          </div>

          {/* Right Column: Matched Trust Schemes & Entitlements */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[#0B3B24]">
                Matched Institutional Initiatives
              </span>
              <span className="text-xs text-[#7A5E24] font-semibold">
                District Context: {district.split(" ")[0]}
              </span>
            </div>

            {/* Scheme 1: Higher Education Tuition Grant */}
            {isScoreEligible && isMeansEligible ? (
              <div className="bg-white p-6 rounded-xs border-2 border-[#C5A059] shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#C5A059] text-[#072617] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-bl-xs">
                  Primary Recommendation
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xs bg-[#0B3B24] text-[#E4C88A] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A5E24] tracking-wider block">
                      Undergraduate Need-cum-Merit Grant
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B3B24]">
                      Mahavir Shiksha Protsahan Yojana
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#4A5568] leading-relaxed">
                  You meet the provisional qualifying merit score and family means criteria for direct college tuition fee support across accredited degree institutions in Odisha.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="bg-[#FDFBF7] p-2 rounded-xs border border-[#0B3B24]/10">
                    <span className="text-[10px] text-[#4A5568] block">Fee Disbursal</span>
                    <span className="font-bold text-[#0B3B24]">100% Direct to College</span>
                  </div>
                  <div className="bg-[#FDFBF7] p-2 rounded-xs border border-[#0B3B24]/10">
                    <span className="text-[10px] text-[#4A5568] block">Study Materials</span>
                    <span className="font-bold text-[#0B3B24]">Annual Textbook Grant</span>
                  </div>
                  <div className="bg-[#FDFBF7] p-2 rounded-xs border border-[#0B3B24]/10">
                    <span className="text-[10px] text-[#4A5568] block">Appraisal Norm</span>
                    <span className="font-bold text-[#0B3B24]">Blind Committee Review</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#0B3B24]/10">
                  <span className="text-[11px] text-[#0B3B24] font-medium">
                    Status: <span className="text-emerald-700 font-bold">Eligible to Apply</span>
                  </span>
                  <Link href="#contact-desk">
                    <Button variant="primary" size="sm">
                      <span>Request Secretariat Guidance</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Scheme 2: STEM & Entrance Exam Fellowship */}
            {(stream === "engineering" || stream === "stem-fellowship") && isScoreEligible ? (
              <div className="bg-white p-5 rounded-xs border border-[#0B3B24]/15 shadow-xs space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xs bg-[#C5A059]/20 text-[#7A5E24] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7A5E24] tracking-wider block">
                      Competitive Entrance & Technical Grant
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B3B24]">
                      Pratibha Excellence Fellowship
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-[#4A5568] leading-relaxed">
                  Eligible for national examination registration fee subsidies, STEM reference text allocations, and technical mentor advisories.
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

            {/* Scheme 3: Universal Community Learning Hubs & Mentorship */}
            <div className="bg-white p-5 rounded-xs border border-[#0B3B24]/15 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xs bg-[#0B3B24]/10 text-[#0B3B24] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#0B3B24] tracking-wider block">
                    Community Infrastructure & Mentorship
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#0B3B24]">
                    Project Samarth & Mentorship Circle
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[#4A5568] leading-relaxed">
                Open to all enrolled students across Odisha. Gain access to community reference study halls, competitive exam text archives, and 1-to-1 career guidance sessions.
              </p>
              <div className="pt-1 flex items-center justify-between text-xs border-t border-[#0B3B24]/10">
                <span className="text-[11px] text-emerald-700 font-bold">
                  ✓ Universal Access Across All 30 Districts
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
                While tuition fee grants require a minimum 60% qualifying score, you are warmly invited to enroll in our <strong>Academic Mentorship Circle</strong> and utilize <strong>Project Samarth Study Hubs</strong> to strengthen your academic preparations.
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
