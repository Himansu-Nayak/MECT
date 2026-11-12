// motion: owner = Motion
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface HeroBackgroundSlide {
  id: string;
  src: string;
  width: number;
  height: number;
  desktopObjectPosition: string;
  mobileObjectPosition: string;
}

export const HERO_BACKGROUND_SLIDES: HeroBackgroundSlide[] = [
  {
    id: "mect-trustees-campus-walk",
    src: "/images/hero/mect-trustees-campus-walk.webp",
    width: 1460,
    height: 725,
    desktopObjectPosition: "46% 18%",
    mobileObjectPosition: "50% 16%",
  },
  {
    id: "illustrative-child-support",
    src: "/images/hero/illustrative-child-support-outreach.webp",
    width: 735,
    height: 581,
    desktopObjectPosition: "50% 56%",
    mobileObjectPosition: "50% 62%",
  },
  {
    id: "illustrative-women-shg",
    src: "/images/hero/illustrative-women-self-help-group.webp",
    width: 1920,
    height: 913,
    desktopObjectPosition: "50% 34%",
    mobileObjectPosition: "50% 48%",
  },
  {
    id: "mect-legal-literacy",
    src: "/images/hero/mect-legal-literacy-session.webp",
    width: 1920,
    height: 1050,
    desktopObjectPosition: "54% 24%",
    mobileObjectPosition: "56% 24%",
  },
  {
    id: "mect-water-hygiene",
    src: "/images/hero/mect-clean-water-hygiene-demo.webp",
    width: 1600,
    height: 920,
    desktopObjectPosition: "52% 34%",
    mobileObjectPosition: "55% 42%",
  },
  {
    id: "illustrative-library-learning",
    src: "/images/hero/illustrative-community-library-reading.webp",
    width: 1920,
    height: 889,
    desktopObjectPosition: "50% 44%",
    mobileObjectPosition: "54% 40%",
  },
  {
    id: "mect-women-seminar",
    src: "/images/hero/mect-women-empowerment-seminar.webp",
    width: 1920,
    height: 1080,
    desktopObjectPosition: "54% 30%",
    mobileObjectPosition: "58% 34%",
  },
];

function DesktopSequence({ isClone = false }: { isClone?: boolean }) {
  return (
    <div
      className={`hero-bg-seq flex h-full shrink-0 items-stretch ${isClone ? "hero-bg-clone" : ""}`}
    >
      {HERO_BACKGROUND_SLIDES.map((slide, idx) => (
        <div
          key={`${isClone ? "clone" : "main"}-${slide.id}`}
          data-slide-index={idx}
          className={`hero-bg-panel hero-bg-panel-feather relative h-full w-[100vw] sm:w-[92vw] md:w-[76vw] lg:w-[68vw] xl:w-[62vw] shrink-0 overflow-hidden ${
            !isClone && idx > 0 ? "hero-bg-secondary-slide" : ""
          } ${!isClone && idx > 1 ? "hero-bg-extra-slide" : ""}`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 92vw, (max-width: 1023px) 76vw, (max-width: 1279px) 68vw, 62vw"
            loading={!isClone && idx === 0 ? "eager" : "lazy"}
            decoding="async"
            priority={!isClone && idx === 0}
            className="object-cover brightness-[1.06] contrast-[1.04]"
            style={{ objectPosition: slide.desktopObjectPosition }}
          />
        </div>
      ))}
    </div>
  );
}

function MobileSequence({ isClone = false }: { isClone?: boolean }) {
  return (
    <div
      className={`hero-mobile-seq flex h-full shrink-0 items-stretch ${
        isClone ? "hero-mobile-clone" : ""
      }`}
    >
      {HERO_BACKGROUND_SLIDES.map((slide, idx) => (
        <div
          key={`m-${isClone ? "clone" : "main"}-${slide.id}`}
          data-mobile-slide={idx}
          className={`hero-mobile-panel relative h-full w-[96vw] max-w-[440px] shrink-0 overflow-hidden border-r-2 border-forest-deep ${
            !isClone && idx > 0 ? "hero-mobile-extra-panel" : ""
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="(max-width: 767px) 96vw, 440px"
            loading={!isClone && idx === 0 ? "eager" : "lazy"}
            decoding="async"
            priority={!isClone && idx === 0}
            className="object-cover"
            style={{ objectPosition: slide.mobileObjectPosition }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Mobile (<768px) full-bleed landscape marquee strip showing complete un-obscured scenes
 * scrolling left-to-right seamlessly above the hero copy & CTAs.
 */
export function HeroMobilePhotoStrip() {
  return (
    <div
      className="md:hidden relative w-full h-[168px] min-[375px]:h-[184px] sm:h-[224px] overflow-hidden bg-forest-deep select-none pointer-events-none"
      aria-hidden="true"
    >
      <div className="hero-mobile-track-ltr">
        <MobileSequence />
        <MobileSequence isClone />
      </div>
      {/* Gentle bottom melt transitioning smoothly into the Deep Forest hero copy block */}
      <div
        className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(29, 41, 36, 0) 0%, rgba(29, 41, 36, 0.72) 68%, #1D2924 100%)",
        }}
      />
    </div>
  );
}

/**
 * Tablet & Desktop (768px+) full-bleed widescreen decorative marquee
 * moving continuously left-to-right behind the MECT homepage hero copy.
 */
export function HeroBackgroundMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const pausedOrReduced = Boolean(shouldReduceMotion) || isPaused;

  const stepSlide = (delta: number) => {
    setIsPaused(true);
    setManualOffset(
      (prev) =>
        (prev + delta + HERO_BACKGROUND_SLIDES.length) %
        HERO_BACKGROUND_SLIDES.length
    );
  };

  return (
    <>
      <div
        className="hero-bg-marquee-wrapper block absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-forest-deep"
        aria-hidden="true"
      >
        <div
          className={`hero-bg-track-ltr transition-opacity duration-500 ${
            pausedOrReduced ? "[animation-play-state:paused]" : ""
          }`}
          style={
            isPaused && !shouldReduceMotion
              ? {
                  animation: "none",
                  transform: `translate3d(-${manualOffset * 14.285}%, 0, 0)`,
                  transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                }
              : undefined
          }
        >
          <DesktopSequence />
          <DesktopSequence isClone />
        </div>
      </div>

      {/* Subtle Hero Background Controls (Pause/Play & Prev/Next) */}
      <div className="absolute bottom-3 right-3 z-30 hidden sm:flex items-center gap-1 rounded-xs bg-forest-deep/80 border border-sand/35 p-1 backdrop-blur-xs print:hidden">
        <button
          type="button"
          onClick={() => stepSlide(-1)}
          aria-label="Previous background photo"
          className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded-xs text-cream hover:text-sand hover:bg-forest transition-colors focus-visible:outline-2 focus-visible:outline-sand"
        >
          <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        {!shouldReduceMotion && (
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-pressed={isPaused}
            aria-label={
              isPaused ? "Resume hero photo motion" : "Pause hero photo motion"
            }
            className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded-xs text-cream hover:text-sand hover:bg-forest transition-colors focus-visible:outline-2 focus-visible:outline-sand"
          >
            {isPaused ? (
              <Play className="w-3 h-3" aria-hidden="true" />
            ) : (
              <Pause className="w-3 h-3" aria-hidden="true" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => stepSlide(1)}
          aria-label="Next background photo"
          className="min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded-xs text-cream hover:text-sand hover:bg-forest transition-colors focus-visible:outline-2 focus-visible:outline-sand"
        >
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
