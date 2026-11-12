// motion: owner = Motion
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
}

export const MECT_FIELD_GALLERY: readonly GalleryPhoto[] = [
  {
    id: "civic-pledge",
    src: "/images/hero/mect-civic-pledge-classroom.jpg",
    alt: "Students participating in a classroom civic pledge session with MECT facilitators in Odisha",
    caption: "Remedial classroom civic pledge and student mentoring session.",
    location: "Balangir, Odisha",
  },
  {
    id: "clean-water",
    src: "/images/hero/mect-clean-water-hygiene-demo.webp",
    alt: "Clean drinking water and community hygiene awareness demonstration in Odisha",
    caption: "Jal Seva clean drinking water and hygiene awareness outreach.",
    location: "Balangir & Puintala, Odisha",
  },
  {
    id: "faculty-puintala",
    src: "/images/hero/mect-faculty-puintala-campus.jpg",
    alt: "MECT faculty and community volunteers at Puintala campus, Balangir",
    caption: "Faculty and volunteer coordinators at the Puintala outreach block.",
    location: "Puintala, Balangir",
  },
  {
    id: "legal-literacy",
    src: "/images/hero/mect-legal-literacy-session.webp",
    alt: "Community legal literacy and rights awareness workshop organized by MECT",
    caption: "Community legal literacy and welfare rights awareness session.",
    location: "Balangir, Odisha",
  },
  {
    id: "public-health",
    src: "/images/hero/mect-public-health-awareness.jpg",
    alt: "Public health and nutrition awareness session with local community members",
    caption: "Public health, seasonal hydration, and nutrition guidance camp.",
    location: "Odisha Field Unit",
  },
  {
    id: "women-seminar",
    src: "/images/hero/mect-women-empowerment-seminar.webp",
    alt: "Rural women vocational training and livelihood self-reliance seminar",
    caption: "Women's vocational tailoring and self-reliance livelihood seminar.",
    location: "Balangir, Odisha",
  },
] as const;

export interface LightboxGridProps {
  photos?: readonly GalleryPhoto[];
}

export function LightboxGrid({ photos = MECT_FIELD_GALLERY }: LightboxGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const selectedPhoto = photos.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedPhoto) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPhoto]);

  const handleClose = () => {
    setSelectedId(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {photos.map((photo) => (
          <m.button
            key={photo.id}
            type="button"
            layoutId={shouldReduceMotion ? undefined : `gallery-card-${photo.id}`}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setSelectedId(photo.id);
            }}
            className="group text-left rounded-xs border border-border-warm bg-white overflow-hidden shadow-xs hover:border-sand transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-deep">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-2 right-2 rounded-xs bg-forest-deep/80 p-1.5 text-cream opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4" />
              </span>
            </div>
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-dark font-sans block">
                {photo.location}
              </span>
              <p className="text-xs font-medium text-forest font-sans leading-relaxed">
                {photo.caption}
              </p>
            </div>
          </m.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-forest-deep/85 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          >
            <m.div
              layoutId={shouldReduceMotion ? undefined : `gallery-card-${selectedPhoto.id}`}
              transition={MOTION_TRANSITIONS.base}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-xs border border-sand/40 bg-white overflow-hidden shadow-2xl"
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                aria-label="Close photo preview"
                className="absolute top-3 right-3 z-10 rounded-xs bg-forest-deep/85 text-cream p-2 hover:bg-terracotta transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
              <div className="relative bg-forest-deep aspect-[16/10] w-full">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              </div>
              <div className="p-4 sm:p-5 bg-white space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-dark font-sans block">
                  {selectedPhoto.location}
                </span>
                <p className="text-sm font-semibold text-forest font-serif">
                  {selectedPhoto.caption}
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

