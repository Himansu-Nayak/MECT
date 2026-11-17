"use client";

import React from "react";

interface HanumanMurtiVisualProps {
  className?: string;
  variant?: "hero" | "card" | "compact";
}

export function HanumanMurtiVisual({
  className = "",
  variant = "hero",
}: HanumanMurtiVisualProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xs bg-gradient-to-b from-[#1C2421] via-[#2A3831] to-[#141A17] border border-sand/30 shadow-elevated flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      role="img"
      aria-label="Conceptual Architectural Visualization of the Proposed 80 to 100-Foot Grand Hanuman Murti Project"
    >
      {/* Decorative Aura / Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-terracotta/10 to-transparent pointer-events-none" />

      {/* Watermark / Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-forest-deep/90 border border-sand/40 text-[10px] font-mono uppercase tracking-wider text-sand shadow-xs backdrop-blur-xs">
          <span>Proposed Height: 80–100 Ft</span>
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-amber-950/80 border border-amber-500/30 text-[9px] font-mono uppercase tracking-wider text-amber-200">
          Conceptual Design
        </span>
      </div>

      {/* Conceptual Monument SVG Illustration */}
      <div className="relative z-10 w-full max-w-[320px] aspect-[4/5] flex items-center justify-center py-4">
        <svg
          viewBox="0 0 320 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_10px_25px_rgba(217,119,6,0.25)]"
        >
          <defs>
            <linearGradient id="auraGlow" x1="160" y1="40" x2="160" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#D97706" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#78350F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="murtiGold" x1="160" y1="60" x2="160" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="pedestalGrad" x1="160" y1="300" x2="160" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#451A03" />
              <stop offset="100%" stopColor="#1C1917" />
            </linearGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Divine Halo / Prabhavali */}
          <circle cx="160" cy="115" r="75" fill="url(#auraGlow)" filter="url(#glowFilter)" />
          <circle cx="160" cy="115" r="62" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="160" cy="115" r="54" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />

          {/* Stepped Architectural Pedestal (Base) */}
          {/* Tier 3: Bottom Plinth */}
          <path d="M40 375 L280 375 L268 355 L52 355 Z" fill="url(#pedestalGrad)" stroke="#E5C499" strokeWidth="0.8" opacity="0.9" />
          {/* Tier 2: Lotus Base Band */}
          <path d="M60 355 L260 355 L250 330 L70 330 Z" fill="#2E1065" stroke="#F59E0B" strokeWidth="0.8" opacity="0.8" />
          <text x="160" y="347" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="serif" letterSpacing="2">
            MAHAVEER TRUST • CHARTER 2013
          </text>
          {/* Tier 1: Upper Terrace */}
          <path d="M80 330 L240 330 L230 305 L90 305 Z" fill="url(#pedestalGrad)" stroke="#E5C499" strokeWidth="0.8" />

          {/* Stylized Monument Silhouette & Form */}
          {/* Gada (Mace) — Held firmly on right side */}
          <g transform="translate(198, 90)">
            <rect x="18" y="20" width="7" height="195" rx="3.5" fill="#B45309" stroke="#FDE68A" strokeWidth="0.75" />
            <circle cx="21.5" cy="20" r="14" fill="url(#murtiGold)" stroke="#FEF3C7" strokeWidth="1" />
            <circle cx="21.5" cy="20" r="7" fill="#FDE68A" opacity="0.7" />
          </g>

          {/* Feet & Legs (Stalwart Stance) */}
          <path d="M125 305 L140 250 L155 250 L150 305 Z" fill="url(#murtiGold)" opacity="0.9" />
          <path d="M165 305 L160 250 L178 250 L190 305 Z" fill="url(#murtiGold)" opacity="0.9" />

          {/* Lower Dhoti & Robes */}
          <path d="M115 195 Q160 240 205 195 L195 260 Q160 275 125 260 Z" fill="#DC2626" opacity="0.85" stroke="#F59E0B" strokeWidth="0.75" />
          <path d="M135 200 Q160 230 185 200 L175 255 Q160 265 145 255 Z" fill="#B91C1C" />

          {/* Torso & Abhaya Mudra Gesture */}
          <path d="M120 120 Q110 160 120 200 L195 200 Q208 160 195 120 Z" fill="url(#murtiGold)" />
          {/* Sacred Yajnopavita / Janeu thread */}
          <path d="M135 120 Q150 160 180 200" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

          {/* Left Arm in Abhaya Mudra (Blessing & Protection) */}
          <path d="M120 130 L95 160 L102 180 L115 155 Z" fill="url(#murtiGold)" />
          <g transform="translate(90, 160)">
            <circle cx="10" cy="10" r="12" fill="url(#murtiGold)" stroke="#FEF3C7" strokeWidth="0.75" />
            {/* Raised Palm */}
            <path d="M5 8 Q10 2 15 8 L15 16 Q10 18 5 16 Z" fill="#FDE68A" />
          </g>

          {/* Crown (Mukuta) & Face */}
          <path d="M140 70 L160 30 L180 70 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
          <circle cx="160" cy="50" r="4" fill="#DC2626" />
          {/* Head & Kundalas (Earrings) */}
          <ellipse cx="160" cy="85" rx="22" ry="24" fill="url(#murtiGold)" />
          {/* Kundalas */}
          <circle cx="134" cy="90" r="4.5" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
          <circle cx="186" cy="90" r="4.5" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />

          {/* Dignified Contemplative Features */}
          <ellipse cx="160" cy="94" rx="14" ry="10" fill="#F59E0B" />
          <path d="M152 82 Q156 80 160 82" stroke="#451A03" strokeWidth="1.2" fill="none" />
          <path d="M168 82 Q164 80 160 82" stroke="#451A03" strokeWidth="1.2" fill="none" />
          <ellipse cx="155" cy="85" rx="2" ry="1.5" fill="#1C1917" />
          <ellipse cx="165" cy="85" rx="2" ry="1.5" fill="#1C1917" />
          {/* Tilak */}
          <path d="M158 72 L162 72 L160 81 Z" fill="#DC2626" />
          <circle cx="160" cy="74" r="1" fill="#FEF3C7" />

          {/* Dimension Indicator Overlay (80-100 FT Height Guide) */}
          <g opacity="0.8">
            <line x1="290" y1="30" x2="290" y2="375" stroke="#E5C499" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="284" y1="30" x2="296" y2="30" stroke="#E5C499" strokeWidth="1.5" />
            <line x1="284" y1="375" x2="296" y2="375" stroke="#E5C499" strokeWidth="1.5" />
            <text x="302" y="205" fill="#E5C499" fontSize="11" fontFamily="monospace" fontWeight="bold" transform="rotate(90, 302, 205)">
              80–100 FT
            </text>
          </g>
        </svg>
      </div>

      {/* Caption & Legal Disclosure */}
      <div className="relative z-10 mt-2 space-y-1">
        <div className="font-serif font-bold text-base sm:text-lg text-sand tracking-wide">
          The Grand Hanuman Murti Project
        </div>
        <div className="text-[11px] font-sans text-cream/80 max-w-sm">
          Proposed 80–100-Foot Monumental Initiative of Faith, Devotion &amp; Community Participation
        </div>
        <div className="text-[10px] font-mono text-sand/70 pt-1">
          Conceptual Visualization — Proposed Project • Mahaveer Educational &amp; Charitable Trust
        </div>
      </div>
    </div>
  );
}
