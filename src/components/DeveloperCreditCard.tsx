import React from "react";
import { ExternalLink, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ABOUT_CONTENT } from "@/lib/about-content";

export function DeveloperCreditCard() {
  const { eyebrow, name, role, statement, skills, profileUrl, disclaimer } =
    ABOUT_CONTENT.developerCredit;

  return (
    <section
      aria-label="Website Developer & Technical Architecture Acknowledgement"
      className="py-12 bg-[#FDFBF7] border-b border-[#0B3B24]/10"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-xs border border-[#C5A059]/40 bg-white p-6 sm:p-8 shadow-xs hover:border-[#C5A059] transition-colors">
          {/* Top Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#0B3B24]/10">
            <Badge
              variant="contrast-gold"
              size="sm"
              icon={<Code2 className="w-3.5 h-3.5 text-[#7A5E24]" aria-hidden="true" />}
            >
              {eyebrow}
            </Badge>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A5E24] font-sans">
              Platform Engineering Acknowledgement
            </span>
          </div>

          {/* Main Profile Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Monogram Initials Avatar */}
            <div
              className="w-14 h-14 rounded-xs bg-[#072617] border-2 border-[#C5A059] flex items-center justify-center shrink-0 shadow-xs"
              aria-hidden="true"
            >
              <span className="font-serif text-xl font-bold text-[#E4C88A] tracking-wider">
                HN
              </span>
            </div>

            {/* Title & Role */}
            <div className="flex-1 space-y-1">
              <h3 className="font-serif text-2xl font-bold text-[#0B3B24] tracking-tight">
                {name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-[#7A5E24] font-sans">
                {role}
              </p>
            </div>

            {/* LinkedIn Action Button */}
            <div className="shrink-0 mt-2 sm:mt-0">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xs bg-[#072617] text-[#EDE6D8] hover:bg-[#0B3B24] hover:text-white border border-[#C5A059]/40 hover:border-[#C5A059] text-xs font-semibold font-sans transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059]"
                aria-label={`View LinkedIn profile of ${name} (opens in new tab)`}
              >
                {/* Official LinkedIn SVG Icon */}
                <svg
                  className="w-3.5 h-3.5 fill-current text-[#C5A059]"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-[#C5A059]" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Contribution Statement */}
          <p className="mt-4 text-xs sm:text-sm text-[#4A5568] leading-relaxed font-sans">
            {statement}
          </p>

          {/* Technology Badges */}
          <div className="mt-5 pt-4 border-t border-[#0B3B24]/10 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#0B3B24] mr-1 font-sans">
              Core Stack:
            </span>
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium text-[#072617] bg-[#F4EFE6] border border-[#0B3B24]/10 px-2.5 py-0.5 rounded-xs font-mono"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Statutory Independence Disclaimer */}
          <div className="mt-4 pt-3 border-t border-dashed border-[#0B3B24]/10">
            <p className="text-[10px] text-[#4A5568] italic font-sans">
              {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
