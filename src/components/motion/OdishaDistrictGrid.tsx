// motion: owner = Anime.js
"use client";

import React, { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { canAnimate, withScope } from "@/lib/anime";

interface OdishaDistrictTile {
  name: string;
  tier: "active" | "liaison" | "outreach" | "mandate";
}

const ODISHA_30_DISTRICTS: OdishaDistrictTile[] = [
  // Western Operational Hub (7)
  { name: "Balangir (HQ)", tier: "active" },
  { name: "Subarnapur", tier: "active" },
  { name: "Bargarh", tier: "active" },
  { name: "Sambalpur", tier: "active" },
  { name: "Nuapada", tier: "active" },
  { name: "Kalahandi", tier: "active" },
  { name: "Jharsuguda", tier: "active" },
  // Central & Capital Liaison (7)
  { name: "Khordha (Bhubaneswar)", tier: "liaison" },
  { name: "Cuttack", tier: "liaison" },
  { name: "Puri", tier: "liaison" },
  { name: "Jagatsinghpur", tier: "liaison" },
  { name: "Kendrapara", tier: "liaison" },
  { name: "Jajpur", tier: "liaison" },
  { name: "Nayagarh", tier: "liaison" },
  // Northern & Industrial Belt (7) — includes Angul & Dhenkanal
  { name: "Sundargarh", tier: "outreach" },
  { name: "Keonjhar", tier: "outreach" },
  { name: "Mayurbhanj", tier: "outreach" },
  { name: "Balasore", tier: "outreach" },
  { name: "Bhadrak", tier: "outreach" },
  { name: "Angul", tier: "outreach" },
  { name: "Dhenkanal", tier: "outreach" },
  // Southern & Tribal Welfare Belts (9)
  { name: "Ganjam", tier: "mandate" },
  { name: "Gajapati", tier: "mandate" },
  { name: "Kandhamal", tier: "mandate" },
  { name: "Boudh", tier: "mandate" },
  { name: "Rayagada", tier: "mandate" },
  { name: "Koraput", tier: "mandate" },
  { name: "Nabarangpur", tier: "mandate" },
  { name: "Malkangiri", tier: "mandate" },
  { name: "Deogarh", tier: "mandate" },
];

const TIER_STYLES: Record<OdishaDistrictTile["tier"], string> = {
  active: "bg-forest text-white border-forest-deep font-bold",
  liaison: "bg-sand-light text-forest border-sand font-semibold",
  outreach: "bg-white text-ink border-border-warm",
  mandate: "bg-cream text-ink-sand border-border-warm",
};

/**
 * M5.4 — 30-district Odisha matrix (6×5 grid) animated with Anime.js `stagger`
 * inside `withScope`. Explicitly includes Angul and Dhenkanal.
 */
export function OdishaDistrictGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canAnimate()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        withScope(ref, () => {
          animate(".odisha-tile", {
            opacity: [0.4, 1],
            scale: [0.94, 1],
            duration: 420,
            delay: stagger(18, { grid: [6, 5], from: "first" }),
            ease: "outCubic",
          });
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans">
        <span className="font-bold uppercase tracking-wider text-forest">
          30-District Odisha Coverage Matrix
        </span>
        <div className="flex flex-wrap items-center gap-3 text-ink-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-forest inline-block" />
            Active Ground Centres (7)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-sand-light border border-sand inline-block" />
            Liaison Corridor (7)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-white border border-border-warm inline-block" />
            Outreach &amp; Mandate (16)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
        {ODISHA_30_DISTRICTS.map((district) => (
          <div
            key={district.name}
            className={`odisha-tile px-3 py-2.5 rounded-xs border text-xs text-center font-sans shadow-2xs ${TIER_STYLES[district.tier]}`}
          >
            {district.name}
          </div>
        ))}
      </div>
    </div>
  );
}

