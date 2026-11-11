import React from "react";
import Image from "next/image";

interface HeroBackgroundSlide {
  id: string;
  src: string;
  objectPosition: string;
}

const HERO_BACKGROUND_SLIDES: HeroBackgroundSlide[] = [
  {
    id: "illustrative-women-shg",
    src: "/images/hero/illustrative-women-self-help-group.webp",
    objectPosition: "50% 34%",
  },
  {
    id: "mect-legal-literacy",
    src: "/images/hero/mect-legal-literacy-session.webp",
    objectPosition: "52% 24%",
  },
  {
    id: "illustrative-library-learning",
    src: "/images/hero/illustrative-community-library-reading.webp",
    objectPosition: "50% 44%",
  },
  {
    id: "mect-women-seminar",
    src: "/images/hero/mect-women-empowerment-seminar.webp",
    objectPosition: "52% 30%",
  },
  {
    id: "mect-water-hygiene",
    src: "/images/hero/mect-clean-water-hygiene-demo.webp",
    objectPosition: "50% 34%",
  },
];

function BackgroundSequence({ isClone = false }: { isClone?: boolean }) {
  return (
    <div
      className={`hero-bg-seq flex h-full shrink-0 items-stretch ${isClone ? "hero-bg-clone" : ""}`}
    >
      {HERO_BACKGROUND_SLIDES.map((slide, idx) => (
        <div
          key={`${isClone ? "clone" : "main"}-${slide.id}`}
          data-slide-index={idx}
          className={`hero-bg-panel hero-bg-panel-feather relative h-full w-screen sm:w-[92vw] md:w-[84vw] lg:w-[76vw] xl:w-[72vw] shrink-0 overflow-hidden ${
            !isClone && idx > 0 ? "hero-bg-secondary-slide" : ""
          } ${!isClone && idx > 1 ? "hero-bg-extra-slide" : ""}`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 767px) 92vw, (max-width: 1023px) 84vw, (max-width: 1279px) 76vw, 72vw"
            loading="eager"
            decoding="async"
            priority={!isClone && idx < 2}
            className="object-cover brightness-[0.96] contrast-[1.03]"
            style={{ objectPosition: slide.objectPosition }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Full-bleed widescreen decorative background marquee moving seamlessly
 * left-to-right behind the MECT homepage hero copy.
 */
export function HeroBackgroundMarquee({ isPaused = false }: { isPaused?: boolean }) {
  return (
    <div
      className={`hero-bg-marquee-wrapper absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-forest-deep ${
        isPaused ? "hero-bg-paused" : ""
      }`}
      aria-hidden="true"
    >
      <div className="hero-bg-track-ltr">
        <BackgroundSequence />
        <BackgroundSequence isClone />
      </div>
    </div>
  );
}
