"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

interface HeroGalleryItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  cardWidthClass: string;
  objectPosition: string;
}

const TRACK_ONE_PHOTOS: HeroGalleryItem[] = [
  {
    id: "faculty-puintala",
    src: "/images/hero/mect-faculty-puintala-campus.jpg",
    alt: "Academic leadership and faculty members gathered at Mahaveer campus in Puintala, Balangir",
    width: 1280,
    height: 853,
    cardWidthClass: "w-[250px] sm:w-[285px] lg:w-[295px]",
    objectPosition: "50% 22%",
  },
  {
    id: "women-empowerment",
    src: "/images/hero/mect-women-empowerment-seminar.jpg",
    alt: "Community awareness seminar under Sakshama Nari - Sashakta Bharat initiative in Balangir",
    width: 2048,
    height: 1152,
    cardWidthClass: "w-[285px] sm:w-[320px] lg:w-[335px]",
    objectPosition: "50% 30%",
  },
  {
    id: "water-hygiene",
    src: "/images/hero/mect-clean-water-hygiene-demo.jpg",
    alt: "Practical clean water access and campus handwashing hygiene awareness demonstration in Balangir",
    width: 1600,
    height: 1200,
    cardWidthClass: "w-[235px] sm:w-[260px] lg:w-[265px]",
    objectPosition: "50% 42%",
  },
];

const TRACK_TWO_PHOTOS: HeroGalleryItem[] = [
  {
    id: "legal-literacy",
    src: "/images/hero/mect-legal-literacy-session.jpg",
    alt: "Resource speaker addressing participants during a community legal awareness session in Balangir",
    width: 2048,
    height: 1365,
    cardWidthClass: "w-[270px] lg:w-[285px]",
    objectPosition: "50% 24%",
  },
  {
    id: "public-health",
    src: "/images/hero/mect-public-health-awareness.jpg",
    alt: "Public health and youth drug-abuse prevention awareness programme held with district officials",
    width: 2048,
    height: 1365,
    cardWidthClass: "w-[285px] lg:w-[300px]",
    objectPosition: "50% 20%",
  },
  {
    id: "civic-pledge",
    src: "/images/hero/mect-civic-pledge-classroom.jpg",
    alt: "Teachers and senior secondary learners participating together in an institutional civic responsibility pledge",
    width: 1600,
    height: 1200,
    cardWidthClass: "w-[245px] lg:w-[255px]",
    objectPosition: "50% 28%",
  },
];

function GallerySequence({
  items,
  isClone = false,
  priorityFirst = false,
}: {
  items: HeroGalleryItem[];
  isClone?: boolean;
  priorityFirst?: boolean;
}) {
  return (
    <div
      className={`hero-gallery-seq flex shrink-0 items-stretch ${isClone ? "hero-gallery-clone" : ""}`}
      aria-hidden={isClone ? true : undefined}
    >
      {items.map((item, idx) => (
        <div
          key={`${isClone ? "clone" : "main"}-${item.id}`}
          className={`hero-gallery-card shrink-0 pr-3.5 sm:pr-4 ${item.cardWidthClass}`}
        >
          <div className="relative h-[165px] sm:h-[188px] lg:h-[196px] w-full overflow-hidden rounded-xs border border-sand/50 bg-forest-deep shadow-lg">
            <Image
              src={item.src}
              alt={isClone ? "" : item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 767px) 285px, 335px"
              loading="eager"
              decoding="async"
              priority={!isClone && priorityFirst && idx === 0}
              className="h-full w-full object-cover"
              style={{ objectPosition: item.objectPosition }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Editorial Two-Track Moving Photographic Gallery for the MECT Hero.
 * Track 1 drifts subtly left-to-right (visible across mobile & desktop);
 * Track 2 drifts slowly right-to-left (tablet & desktop) with WCAG pause control
 * and full prefers-reduced-motion static grid fallback.
 */
export function HeroPhotoGallery() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className={`hero-gallery-wrapper w-full min-w-0 select-none ${isPaused ? "hero-gallery-paused" : ""}`}
      role="region"
      aria-label="Authentic MECT educational and community initiatives photography gallery"
    >
      <div className="hero-gallery-mask space-y-3.5 sm:space-y-4 overflow-hidden py-1">
        {/* Track 1: Left-to-Right calm movement (Mobile + Desktop) */}
        <div className="overflow-hidden">
          <div className="hero-gallery-track-ltr">
            <GallerySequence items={TRACK_ONE_PHOTOS} priorityFirst />
            <GallerySequence items={TRACK_ONE_PHOTOS} isClone />
          </div>
        </div>

        {/* Track 2: Right-to-Left opposing movement (Reduced tracks on mobile) */}
        <div className="hidden md:block overflow-hidden">
          <div className="hero-gallery-track-rtl">
            <GallerySequence items={TRACK_TWO_PHOTOS} />
            <GallerySequence items={TRACK_TWO_PHOTOS} isClone />
          </div>
        </div>
      </div>

      {/* Restrained caption + WCAG 2.2 SC 2.2.2 Pause/Play control */}
      <div className="mt-3 flex items-center justify-between gap-3 px-0.5">
        <p className="text-[11px] font-sans tracking-wide text-cream/95">
          Authentic institutional &amp; community initiatives • Balangir, Odisha
        </p>
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-pressed={isPaused}
          className="inline-flex items-center gap-1.5 rounded-xs border border-sand/55 bg-forest-deep px-3 py-1.5 text-[11px] font-semibold font-sans text-cream hover:bg-forest hover:border-sand transition-colors shrink-0 min-h-[36px]"
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-sand" aria-hidden="true" />
              <span>Play Gallery</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-sand" aria-hidden="true" />
              <span>Pause Gallery</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

