"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ShieldCheck,
  MapPin,
  Calendar,
  FileCheck2,
  FolderOpen,
  Info,
} from "lucide-react";
import {
  GALLERY_CATEGORIES,
  getPublishedGalleryItems,
  MECT_GALLERY_COLLECTION,
  type GalleryCategory,
  type GalleryItem,
} from "@content/gallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOTION_TRANSITIONS } from "@/lib/motion";

export interface GalleryLightboxProps {
  initialCategory?: GalleryCategory | "All";
  showCategoryFilters?: boolean;
}

export function GalleryLightbox({
  initialCategory = "All",
  showCategoryFilters = true,
}: GalleryLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "All">(initialCategory);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const triggerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const modalCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const displayedItems = getPublishedGalleryItems(selectedCategory);

  const activeItem: GalleryItem | null =
    selectedItemIndex !== null && displayedItems[selectedItemIndex]
      ? displayedItems[selectedItemIndex]
      : null;

  // Handler to close lightbox and restore focus
  const handleClose = useCallback(() => {
    if (activeItem) {
      const triggeringEl = triggerElementsRef.current.get(activeItem.id);
      setSelectedItemIndex(null);
      setTimeout(() => {
        triggeringEl?.focus();
      }, 50);
    } else {
      setSelectedItemIndex(null);
    }
  }, [activeItem]);

  const handlePrev = useCallback(() => {
    if (selectedItemIndex === null || displayedItems.length === 0) return;
    setSelectedItemIndex((prev) => (prev! > 0 ? prev! - 1 : displayedItems.length - 1));
  }, [selectedItemIndex, displayedItems.length]);

  const handleNext = useCallback(() => {
    if (selectedItemIndex === null || displayedItems.length === 0) return;
    setSelectedItemIndex((prev) => (prev! < displayedItems.length - 1 ? prev! + 1 : 0));
  }, [selectedItemIndex, displayedItems.length]);

  // Keyboard navigation & accessibility event listeners
  useEffect(() => {
    if (selectedItemIndex === null) return;

    // Focus close button on open
    modalCloseButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Tab" && modalRef.current) {
        // Focus trap
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemIndex, handleClose, handlePrev, handleNext]);

  // Calculate counts per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: getPublishedGalleryItems("All").length };
    for (const cat of GALLERY_CATEGORIES) {
      counts[cat] = getPublishedGalleryItems(cat).length;
    }
    return counts;
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Category Filter Navigation */}
      {showCategoryFilters && (
        <nav
          aria-label="Gallery category filters"
          className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-xs border border-border-warm shadow-2xs"
        >
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            aria-pressed={selectedCategory === "All"}
            className={`px-3 py-1.5 text-xs font-semibold rounded-2xs transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-terracotta ${
              selectedCategory === "All"
                ? "bg-forest text-cream shadow-xs"
                : "text-forest/80 hover:text-forest hover:bg-sand-light"
            }`}
          >
            <span>All Records</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                selectedCategory === "All"
                  ? "bg-sand text-forest font-bold"
                  : "bg-sand/30 text-forest/70"
              }`}
            >
              {categoryCounts["All"]}
            </span>
          </button>

          {GALLERY_CATEGORIES.map((category) => {
            const count = categoryCounts[category] ?? 0;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-xs font-semibold rounded-2xs transition-all flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-terracotta ${
                  isSelected
                    ? "bg-forest text-cream shadow-xs"
                    : "text-forest/80 hover:text-forest hover:bg-sand-light"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? "bg-sand text-forest font-bold"
                      : "bg-sand/30 text-forest/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* 2. Photo Grid / Empty State */}
      {displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, index) => (
            <m.button
              key={item.id}
              type="button"
              ref={(el) => {
                if (el) triggerElementsRef.current.set(item.id, el);
                else triggerElementsRef.current.delete(item.id);
              }}
              onClick={() => setSelectedItemIndex(index)}
              className="group text-left rounded-xs border border-border-warm bg-white overflow-hidden shadow-xs hover:border-terracotta/40 hover:shadow-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-terracotta flex flex-col h-full"
            >
              {/* Image Container with Zoom Trigger */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest-deep shrink-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="forest" size="sm" className="bg-forest-deep/90 text-cream border-sand/30 text-[10px]">
                    {item.category}
                  </Badge>
                </div>
                <div
                  aria-hidden="true"
                  className="absolute bottom-2.5 right-2.5 rounded-2xs bg-forest-deep/85 p-1.5 text-cream opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-sans"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-sand" />
                  <span>Enlarge</span>
                </div>
              </div>

              {/* Information Content */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-terracotta-dark font-semibold">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{item.location}</span>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-forest group-hover:text-terracotta-dark transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-ink-secondary font-sans leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-warm flex items-center justify-between text-[10px] text-ink-muted font-sans">
                  <span className="inline-flex items-center gap-1 text-forest/75 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-forest shrink-0" aria-hidden="true" />
                    <span>Verified Archival Record</span>
                  </span>
                  <span className="font-mono">{item.rights.accessionNumber}</span>
                </div>
              </div>
            </m.button>
          ))}
        </div>
      ) : (
        /* Honest, Respectful Empty State */
        <div className="rounded-xs border border-dashed border-border-warm bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-sand-light text-forest mx-auto flex items-center justify-center border border-sand">
            <FolderOpen className="w-6 h-6 text-forest/75" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-forest">
              No Public Photographs in &ldquo;{selectedCategory}&rdquo; Currently
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
              In strict compliance with MECT&apos;s Child Safeguarding Charter and donor privacy standards,
              only field images with countersigned written consent and verified archival clearance are
              published. Operational logs and physical field registers for this programme are maintained
              at the Secretariat.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("All")}
            >
              <span>View All Verified Archival Records ({categoryCounts["All"]})</span>
            </Button>
          </div>
        </div>
      )}

      {/* 3. Accessible Lightbox Dialog */}
      <AnimatePresence>
        {activeItem && selectedItemIndex !== null && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`lightbox-title-${activeItem.id}`}
            aria-describedby={`lightbox-desc-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-forest-deep/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <m.div
              ref={modalRef}
              initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0 }}
              transition={MOTION_TRANSITIONS.base}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-xs border border-sand/50 bg-white overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
            >
              {/* Modal Top Control Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-forest text-cream border-b border-sand/30 shrink-0">
                <div className="flex items-center gap-2">
                  <Badge variant="gold-dark" size="sm" className="text-[10px]">
                    {activeItem.category}
                  </Badge>
                  <span className="text-xs font-mono text-sand">
                    {activeItem.rights.accessionNumber} ({selectedItemIndex + 1} of {displayedItems.length})
                  </span>
                </div>
                <button
                  ref={modalCloseButtonRef}
                  type="button"
                  onClick={handleClose}
                  aria-label="Close photo preview"
                  className="rounded-xs p-1.5 text-cream/90 hover:text-white hover:bg-forest-deep transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Main Image Display with Navigation Arrows */}
              <div className="relative bg-forest-deep aspect-[16/10] sm:aspect-[16/9] w-full shrink-0 flex items-center justify-center overflow-hidden">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-contain"
                />

                {/* Left/Right Navigation Buttons */}
                {displayedItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous photograph"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xs bg-forest-deep/80 text-cream hover:bg-terracotta hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand shadow-md"
                    >
                      <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next photograph"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xs bg-forest-deep/80 text-cream hover:bg-terracotta hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sand shadow-md"
                    >
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {/* Metadata & Documentary Caption Section */}
              <div className="p-4 sm:p-6 bg-white space-y-4 overflow-y-auto">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted font-sans">
                    <span className="inline-flex items-center gap-1 font-mono text-terracotta-dark font-semibold">
                      <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {activeItem.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-forest" aria-hidden="true" />
                      {activeItem.period}
                    </span>
                  </div>

                  <h2
                    id={`lightbox-title-${activeItem.id}`}
                    className="text-lg sm:text-xl font-bold font-serif text-forest leading-snug"
                  >
                    {activeItem.title}
                  </h2>
                </div>

                <p
                  id={`lightbox-desc-${activeItem.id}`}
                  className="text-xs sm:text-sm text-ink leading-relaxed font-sans"
                >
                  {activeItem.caption}
                </p>

                {/* Statutory Verification Box */}
                <div className="rounded-2xs border border-border-warm bg-sand-light/60 p-3 sm:p-4 text-[11px] sm:text-xs text-ink-secondary space-y-2 font-sans">
                  <div className="flex items-center justify-between flex-wrap gap-2 font-semibold text-forest">
                    <div className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-forest shrink-0" aria-hidden="true" />
                      <span>Child Safeguarding &amp; Media Consent Clearance</span>
                    </div>
                    <span className="text-[10px] font-mono bg-forest/10 px-2 py-0.5 rounded-2xs text-forest">
                      Ref: {activeItem.safeguarding.safeguardingClearanceId}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-ink-muted">Source Archive:</span>{" "}
                      <span className="font-medium text-ink">{activeItem.rights.sourceArchive}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted">Rights Holder:</span>{" "}
                      <span className="font-medium text-ink">{activeItem.rights.rightsHolder}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted">Verified By:</span>{" "}
                      <span className="font-medium text-ink">{activeItem.rights.verifiedBy}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted">Verification Date:</span>{" "}
                      <span className="font-mono text-ink">{activeItem.rights.verificationDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
