// motion: owner = Motion
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, FileCheck2 } from "lucide-react";
import { CONSENTED_STORIES } from "@content/stories";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOTION_TRANSITIONS } from "@/lib/motion";

/**
 * Stories Rail (`M3.7`): renders an accessible `carousel-cards` rail when
 * consented stories exist in `content/stories.ts`, or an honest `empty-state`
 * when no consented stories are published yet.
 */
export function StoriesRailSection() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  if (CONSENTED_STORIES.length === 0) {
    return (
      <section
        aria-label="Field Stories and Beneficiary Voices"
        className="py-16 md:py-20 bg-sand-light/60 border-b border-border-warm"
      >
        <Container size="default">
          <div className="max-w-3xl mx-auto rounded-xs border border-border-warm bg-white p-6 sm:p-8 text-center space-y-4 shadow-xs">
            <div className="w-11 h-11 rounded-full bg-sage/70 text-forest mx-auto flex items-center justify-center border border-border-warm">
              <FileCheck2 className="w-5 h-5 text-forest" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <Badge variant="forest" size="sm">
                Consent-Verified Field Archive
              </Badge>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Community Stories &amp; Beneficiary Voices
              </h2>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto font-sans">
                MECT publishes beneficiary stories only with documented consent on file. Verified field narratives from our Balangir and Odisha programmes are currently being compiled into the public archive.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/impact">
                <Button variant="primary" size="sm">
                  <span>View Documented Impact Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" size="sm">
                  <span>Annual Reports &amp; Audits</span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const current = CONSENTED_STORIES[index];

  return (
    <section
      aria-label="Community Stories"
      className="py-16 md:py-20 bg-sand-light/60 border-b border-border-warm"
    >
      <Container size="default" className="space-y-8">
        <SectionHeader
          badge="Consent-Verified Voices"
          title="Stories from the Field"
          subtitle="Documented community experiences shared with explicit beneficiary consent."
          align="center"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            <m.div
              key={current.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={MOTION_TRANSITIONS.fast}
            >
              <Card variant="elevated" className="p-6 sm:p-8 bg-white border-border-warm space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Badge variant="forest" size="sm">
                    {current.programme}
                  </Badge>
                  <span className="text-xs font-mono text-ink-secondary">
                    {current.district} • {current.year}
                  </span>
                </div>
                <blockquote className="font-serif text-base sm:text-lg text-forest leading-relaxed">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-dark">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{current.attribution}</span>
                </div>
              </Card>
            </m.div>
          </AnimatePresence>

          {CONSENTED_STORIES.length > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setIndex(
                    (prev) =>
                      (prev - 1 + CONSENTED_STORIES.length) %
                      CONSENTED_STORIES.length
                  )
                }
                aria-label="Previous story"
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xs border border-border-warm bg-white text-forest hover:bg-sage/50"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-mono text-ink-secondary">
                {index + 1} / {CONSENTED_STORIES.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setIndex((prev) => (prev + 1) % CONSENTED_STORIES.length)
                }
                aria-label="Next story"
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xs border border-border-warm bg-white text-forest hover:bg-sage/50"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

