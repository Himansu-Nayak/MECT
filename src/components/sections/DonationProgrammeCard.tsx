"use client";

import React from "react";
import { DonationProgrammeItem } from "@/lib/portal-api";
import { Badge } from "@/components/ui/Badge";
import { Check, ShieldCheck, GraduationCap, Droplet, Scissors, HeartHandshake, Landmark } from "lucide-react";

interface ProgrammeExtraMeta {
  icon: React.ReactNode;
  category: string;
  impactStat: string;
  impactLabel: string;
  suggestedPresets: number[];
  fiduciaryNotice?: string;
}

const PROGRAMME_METADATA: Record<string, ProgrammeExtraMeta> = {
  SCHOLARSHIPS: {
    icon: <GraduationCap className="w-5 h-5 text-terracotta" />,
    category: "Education & Skilling",
    impactStat: "100% Direct",
    impactLabel: "Disbursed straight to accredited colleges for verified students",
    suggestedPresets: [1000, 2500, 5000, 10000],
    fiduciaryNotice: "Restricted directly to undergraduate tuition assistance across Western Odisha.",
  },
  JAL_SEVA: {
    icon: <Droplet className="w-5 h-5 text-terracotta" />,
    category: "Seasonal Relief",
    impactStat: "2,500+ Daily",
    impactLabel: "Pedestrians, transit passengers & hospital visitors served per kiosk",
    suggestedPresets: [500, 1000, 2500, 5000],
    fiduciaryNotice: "Active during 45°C peak heatwaves at Balangir transit junctions.",
  },
  WOMEN_LIVELIHOOD: {
    icon: <Scissors className="w-5 h-5 text-terracotta" />,
    category: "Vocational Independence",
    impactStat: "Certified",
    impactLabel: "Sewing craftsmanship, machine operations & micro-enterprise",
    suggestedPresets: [1000, 2000, 5000, 8000],
    fiduciaryNotice: "Equips rural women and mothers with self-sustaining livelihood skills.",
  },
  GENERAL_CHARITY: {
    icon: <HeartHandshake className="w-5 h-5 text-terracotta" />,
    category: "Community Welfare",
    impactStat: "Immediate Aid",
    impactLabel: "Thermal winter relief, hospital patient meals & distress response",
    suggestedPresets: [500, 1000, 2500, 5000],
    fiduciaryNotice: "Flexible emergency fund for destitute families and rural crises.",
  },
  HANUMAN_MURTI: {
    icon: <Landmark className="w-5 h-5 text-terracotta" />,
    category: "Cultural Monument",
    impactStat: "Ring-Fenced",
    impactLabel: "Statutorily segregated sub-ledger with zero charitable cross-mingling",
    suggestedPresets: [1000, 2500, 5000, 11000],
    fiduciaryNotice: "Maintained in dedicated sub-accounts under MECT Trust Deed provisions.",
  },
};

interface DonationProgrammeCardProps {
  programme: DonationProgrammeItem;
  selected: boolean;
  onSelect: (code: string) => void;
  onPresetSelect?: (amount: number) => void;
}

export function DonationProgrammeCard({
  programme,
  selected,
  onSelect,
  onPresetSelect,
}: DonationProgrammeCardProps) {
  const meta = PROGRAMME_METADATA[programme.code] || {
    icon: <ShieldCheck className="w-5 h-5 text-terracotta" />,
    category: programme.generalFund ? "General Fund" : "Specific Programme",
    impactStat: "Verified",
    impactLabel: "Audited institutional allocation",
    suggestedPresets: [500, 1000, 2500, 5000],
  };

  return (
    <div
      onClick={() => onSelect(programme.code)}
      className={`group relative text-left rounded-xs p-5 sm:p-6 transition-all duration-200 cursor-pointer border ${
        selected
          ? "bg-[#FAF7F2] border-forest ring-2 ring-forest/25 shadow-md"
          : "bg-white border-[#E6E1D8] hover:border-forest/40 hover:bg-[#FAF7F2]/60 hover:shadow-xs"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
              selected
                ? "bg-forest/10 border-forest/30 text-forest"
                : "bg-[#F3EFE8] border-[#E6E1D8] text-forest group-hover:border-forest/30"
            }`}
          >
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-dark">
                {meta.category}
              </span>
              {programme.generalFund ? (
                <Badge variant="outline" size="sm" className="text-[10px] py-0 px-1.5">
                  General Welfare
                </Badge>
              ) : programme.code === "HANUMAN_MURTI" ? (
                <Badge variant="gold" size="sm" className="text-[10px] py-0 px-1.5">
                  Segregated Sub-Ledger
                </Badge>
              ) : (
                <Badge variant="forest" size="sm" className="text-[10px] py-0 px-1.5">
                  Restricted Fund
                </Badge>
              )}
            </div>
            <h3 className="font-serif font-bold text-forest text-base sm:text-lg mt-0.5 leading-snug">
              {programme.name}
            </h3>
          </div>
        </div>

        {/* Radio/Check Indicator */}
        <div
          className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
            selected
              ? "bg-forest border-forest text-white shadow-xs scale-105"
              : "border-[#D4CEBE] bg-white group-hover:border-forest/60"
          }`}
          aria-hidden="true"
        >
          {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
      </div>

      {/* Tagline */}
      {programme.tagline && (
        <p className="text-xs font-medium text-ink-muted mt-2.5 italic">
          &ldquo;{programme.tagline}&rdquo;
        </p>
      )}

      {/* Description */}
      {programme.description && (
        <p className="text-xs text-ink/80 mt-2 leading-relaxed">
          {programme.description}
        </p>
      )}

      {/* Impact Stat Callout */}
      <div className="mt-4 pt-3.5 border-t border-[#E6E1D8] flex items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-mono font-bold text-forest text-sm">
            {meta.impactStat}
          </span>
          <span className="text-ink-muted text-[11px] block sm:inline sm:ml-1.5">
            {meta.impactLabel}
          </span>
        </div>
      </div>

      {/* Quick Amount Suggestion Pills */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mr-1">
          Presets:
        </span>
        {meta.suggestedPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(programme.code);
              onPresetSelect?.(preset);
            }}
            className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-xs bg-[#F3EFE8] border border-[#E6E1D8] text-forest hover:bg-forest hover:text-white hover:border-forest transition-colors"
          >
            ₹{preset.toLocaleString("en-IN")}
          </button>
        ))}
      </div>

      {meta.fiduciaryNotice && (
        <p className="text-[10px] text-ink-muted/80 mt-2.5 font-mono">
          Fiduciary Note: {meta.fiduciaryNotice}
        </p>
      )}
    </div>
  );
}
