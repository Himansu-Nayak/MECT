"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal, ImageReveal } from "@/components/ui/MotionPrimitives";
import {
  Camera,
  ArrowRight,
  ShieldCheck,
  MapPin,
  X,
  Calendar,
  Maximize2,
  FileCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ExhibitionItem {
  id: string;
  archiveId: string;
  title: string;
  location: string;
  period: string;
  category: string;
  caption: string;
  src: string;
  aspect: string;
}

/**
 * MECT Phase 27 — Section 06: Documentary Field Exhibition & Museum Lightbox
 *
 * Upgraded with:
 * - Keyboard-controlled lightbox modal (ArrowLeft, ArrowRight, Escape)
 * - Previous/Next slide triggers and sequence counter (e.g., 2 / 5)
 * - ImageReveal zoom-settling for all thumbnails
 * - Sharp high-resolution WebP delivery and Child Safeguarding verification
 */
export function DocumentaryFieldExhibitionSection() {
  const exhibitionRecords: ExhibitionItem[] = [
    {
      id: "ex-01",
      archiveId: "MECT-FL-2024-01",
      title: "Faculty & Trustee Review at Puīntalā Rural Campus",
      location: "Puīntalā Block, Balangir",
      period: "October 2024",
      category: "Higher Education",
      caption:
        "Trustees and rural education coordinators reviewing community facilities and educational remedial registers at the Puīntalā campus site.",
      src: "/images/hero/mect-trustees-campus-walk.webp",
      aspect: "aspect-[16/10]",
    },
    {
      id: "ex-02",
      archiveId: "MECT-FL-2023-02",
      title: "Women's Self-Help Group Livelihood Collective",
      location: "Rugudipara, Balangir",
      period: "August 2023",
      category: "Livelihoods",
      caption:
        "Self-help group members and vocational tailoring trainees collaborating on garment drafting and collective community orders.",
      src: "/images/hero/illustrative-women-self-help-group.webp",
      aspect: "aspect-[16/10]",
    },
    {
      id: "ex-03",
      archiveId: "MECT-FL-2023-03",
      title: "Community Emergency Relief & Calamity Support",
      location: "Western Odisha Hamlets",
      period: "Seasonal Relief",
      category: "Humanitarian Relief",
      caption:
        "Community coordinators distributing emergency dry rations, winter blankets, and essential relief kits across rural settlements.",
      src: "/images/programmes/field_photo_9.webp",
      aspect: "aspect-[16/10]",
    },
    {
      id: "ex-04",
      archiveId: "MECT-FL-2023-04",
      title: "Rural Scholastic Enablement & Learning Support",
      location: "Rural Village Centre, Balangir",
      period: "November 2023",
      category: "Youth Mentorship",
      caption:
        "High school students participating in an after-school remedial learning session focused on mathematics and science syllabus reinforcement.",
      src: "/images/hero/illustrative-child-support-outreach.webp",
      aspect: "aspect-[16/10]",
    },
    {
      id: "ex-05",
      archiveId: "MECT-FL-2023-05",
      title: "Village Legal Literacy & Welfare Scheme Orientation",
      location: "Deogaon Block, Balangir",
      period: "December 2023",
      category: "Community Welfare",
      caption:
        "MECT resource legal volunteers advising rural families on statutory entitlements, pension schemes, and educational fee scholarships.",
      src: "/images/hero/mect-legal-literacy-session.webp",
      aspect: "aspect-[16/10]",
    },
  ];

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const activeItem = activeModalIndex !== null ? exhibitionRecords[activeModalIndex] : null;

  const handleNext = useCallback(() => {
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % exhibitionRecords.length);
    }
  }, [activeModalIndex, exhibitionRecords.length]);

  const handlePrev = useCallback(() => {
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + exhibitionRecords.length) % exhibitionRecords.length);
    }
  }, [activeModalIndex, exhibitionRecords.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalIndex(null);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalIndex, handleNext, handlePrev]);

  return (
    <section
      id="field-exhibition"
      aria-labelledby="exhibition-title"
      className="py-16 sm:py-20 md:py-24 bg-white border-b border-[#E7E0D5] scroll-mt-16 relative overflow-hidden"
    >
      <Container size="default" className="space-y-12 sm:space-y-14 max-w-[1520px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E7E0D5] pb-8">
          <Reveal direction="up" className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xs bg-terracotta/10 text-terracotta-dark text-[11px] font-mono uppercase tracking-[0.14em]">
              <Camera className="w-3.5 h-3.5 text-terracotta-dark" aria-hidden="true" />
              <span>Section 06 • Real Stories, Real People</span>
            </div>
            <h2
              id="exhibition-title"
              className="font-serif text-[clamp(1.9rem,3.2vw,3rem)] font-bold text-ink tracking-tight leading-[1.14]"
            >
              Documentary Field Exhibition: Authentic Chronicles from Western Odisha
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans max-w-xl">
              Photographic field documentation of MECT&apos;s educational remedial coaching, women&apos;s vocational cohorts, clean water relief, and community welfare assemblies.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.1} className="shrink-0">
            <Link href="/memories-gallery">
              <Button variant="primary" size="md" className="font-bold group bg-terracotta hover:bg-terracotta-dark text-white">
                <Camera className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>View Full Photo Archive</span>
                <ArrowRight
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* Asymmetrical Exhibition Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Main Large Feature: Puīntalā Faculty Centre (Col 1-7) */}
          <div className="md:col-span-7 flex flex-col">
            <button
              type="button"
              onClick={() => setActiveModalIndex(0)}
              className="group relative flex-1 min-h-[340px] sm:min-h-[420px] rounded-[2px] overflow-hidden border border-[#E7E0D5] bg-[#0F1714] shadow-xs text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta block w-full"
            >
              <Image
                src={exhibitionRecords[0].src}
                alt={exhibitionRecords[0].title}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent pointer-events-none"
              />
              <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-[10px] font-mono uppercase tracking-wider bg-[#0D1512]/90 text-[#E5C499] border border-white/15 backdrop-blur-xs font-semibold">
                  {exhibitionRecords[0].category}
                </span>
                <span className="font-mono text-[10px] text-white/80 bg-black/60 px-2 py-1 rounded-[2px]">
                  {exhibitionRecords[0].archiveId}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 space-y-1.5 text-white">
                <div className="flex items-center gap-2 text-xs text-[#E5C499] font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#C4924A] shrink-0" aria-hidden="true" />
                  <span>{exhibitionRecords[0].location}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-[11px] text-cream/80">{exhibitionRecords[0].period}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#E5C499] transition-colors">
                  {exhibitionRecords[0].title}
                </h3>
                <p className="text-xs text-cream/90 font-sans line-clamp-2 max-w-xl">
                  {exhibitionRecords[0].caption}
                </p>
              </div>
            </button>
          </div>

          {/* Secondary 2-Card Stack (Col 8-12) */}
          <div className="md:col-span-5 grid grid-cols-1 gap-6">
            {exhibitionRecords.slice(1, 3).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModalIndex(idx + 1)}
                className="group relative h-[200px] sm:h-[220px] rounded-[2px] overflow-hidden border border-[#E7E0D5] bg-[#0F1714] shadow-xs text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta block w-full"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 35vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent pointer-events-none"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9.5px] font-mono uppercase tracking-wider bg-[#0D1512]/90 text-[#E5C499] border border-white/15">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <div className="text-[11px] text-[#E5C499] font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C4924A]" />
                    <span>{item.location}</span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#E5C499] truncate">
                    {item.title}
                  </h4>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom 2-Column Wide Split (Col 1-12) */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {exhibitionRecords.slice(3, 5).map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveModalIndex(idx + 3)}
                className="group relative h-[210px] sm:h-[230px] rounded-[2px] overflow-hidden border border-[#E7E0D5] bg-[#0F1714] shadow-xs text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta block w-full"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0D1512]/95 via-[#0D1512]/50 to-transparent pointer-events-none"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] text-[9.5px] font-mono uppercase tracking-wider bg-[#0D1512]/90 text-[#E5C499] border border-white/15">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <div className="text-[11px] text-[#E5C499] font-sans flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C4924A]" />
                    <span>{item.location} • {item.period}</span>
                  </div>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#E5C499] truncate">
                    {item.title}
                  </h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Child Safeguarding & Privacy Guarantee Notice */}
        <Reveal direction="up" delay={0.12}>
          <div className="p-4 sm:p-5 rounded-[2px] bg-[#FAF7F2] border border-[#E7E0D5] flex items-start gap-3.5 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1 text-xs text-ink-secondary leading-relaxed font-sans">
              <span className="font-bold text-ink font-mono uppercase tracking-wider text-[11px] block">
                Ethical Photography &amp; Child Safeguarding Charter (DOC-POL-SAFEGUARDING-2024)
              </span>
              <p>
                All photographic materials are documented during genuine community service activities with verified parental consent. In accordance with Trust safeguarding guidelines, student roll numbers, home addresses, and sensitive identification records are strictly protected.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* Accessible Interactive Museum Lightbox Modal */}
      {activeItem && activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 bg-[#0D1512]/96 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveModalIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#16221D] border border-white/20 rounded-[2px] overflow-hidden shadow-2xl flex flex-col text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Masthead */}
            <div className="p-4 border-b border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#C4924A] font-bold">
                  {activeItem.archiveId}
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs font-sans text-cream/80">{activeItem.category}</span>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-xs font-mono text-cream/60 hidden sm:inline">
                  {activeModalIndex + 1} of {exhibitionRecords.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/50 uppercase hidden sm:inline">
                  [← / → Navigate | Esc Close]
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalIndex(null)}
                  className="p-1.5 text-cream/70 hover:text-white rounded-[2px] hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C4924A]"
                  aria-label="Close photo preview"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal Image Viewport with Previous/Next Arrows */}
            <div className="relative w-full aspect-[16/10] bg-black">
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />

              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 transition-transform active:scale-95"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center border border-white/20 transition-transform active:scale-95"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Caption Details */}
            <div className="p-5 sm:p-6 space-y-2 bg-[#0F1714]">
              <div className="flex items-center gap-2 text-xs text-[#E5C499] font-mono">
                <MapPin className="w-3.5 h-3.5 text-[#C4924A]" />
                <span>{activeItem.location}</span>
                <span className="text-white/40">•</span>
                <span>{activeItem.period}</span>
              </div>
              <h3 id="lightbox-title" className="font-serif text-lg sm:text-xl font-bold text-white">
                {activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-cream/90 font-sans leading-relaxed">
                {activeItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
