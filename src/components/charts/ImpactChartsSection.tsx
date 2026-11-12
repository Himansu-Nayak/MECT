// motion: owner = Motion
"use client";

import React from "react";
import Link from "next/link";
import { FileSpreadsheet, ArrowRight } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { Grid } from "@/components/charts/grid";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { PieCenter } from "@/components/charts/pie-center";
import { ImpactChartCard } from "@/components/charts/ImpactChartCard";
import { FREE_EDUCATION_200 } from "@content/funding";

const COACHING_AND_SKILLING_DATA = [
  { name: "Students Coached", count: 350 },
  { name: "200-Seat Target", count: FREE_EDUCATION_200.targetCount },
  { name: "Women Skilled", count: 120 },
];

const COHORT_PIE_DATA = [
  {
    label: "Outlined Target Seats",
    value:
      FREE_EDUCATION_200.targetCount - FREE_EDUCATION_200.confirmedFundedPlaces,
    color: "#E8DDD0",
  },
  ...(FREE_EDUCATION_200.confirmedFundedPlaces > 0
    ? [
        {
          label: "Confirmed Funded Seats",
          value: FREE_EDUCATION_200.confirmedFundedPlaces,
          color: "#A45E44",
        },
      ]
    : []),
];

/**
 * M5.3 — Bklit data visualizations for confirmed MECT impact figures,
 * plus an honest empty-state fallback for multi-year time series.
 */
export function ImpactChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Bklit BarChart: Confirmed Coaching & Skilling Reach */}
      <ImpactChartCard
        title="Education & Vocational Reach"
        badge="Confirmed Activity Records"
        summary="Reported beneficiary counts across Balangir remedial coaching (350+ students), the 200-student free education target cohort, and women's tailoring (120+ artisans)."
        sourceLabel="MECT Balangir Centre Registers"
        rows={[
          {
            label: "Students Coached",
            value: "350+",
            note: "Free remedial tuition & books",
          },
          {
            label: "200-Student Target",
            value: FREE_EDUCATION_200.targetCount,
            note: "Free Education cohort capacity",
          },
          {
            label: "Women Skilled",
            value: "120+",
            note: "Certified 6-month tailoring courses",
          },
        ]}
      >
        <div className="w-full pt-2">
          <BarChart
            data={COACHING_AND_SKILLING_DATA}
            xDataKey="name"
            aspectRatio="16 / 10"
            margin={{ top: 18, right: 16, bottom: 32, left: 38 }}
          >
            <Grid horizontal />
            <Bar dataKey="count" fill="#1D2924" lineCap="round" />
            <BarXAxis />
            <BarYAxis />
          </BarChart>
        </div>
      </ImpactChartCard>

      {/* 2. Bklit PieChart: Free Education 200-Seat Gauge */}
      <ImpactChartCard
        title="Free Education 200-Seat Cohort"
        badge="Cohort Allocation Gauge"
        summary="Tracks confirmed funded places against the 200-student Free Education target; zero confirmed seats are shown until audited allotment records are published."
        sourceLabel="content/funding.ts (Secretariat Allotment)"
        rows={[
          {
            label: "Confirmed Funded Seats",
            value: FREE_EDUCATION_200.confirmedFundedPlaces,
            note: "Pending audited allotment records",
          },
          {
            label: "Outlined Target Seats",
            value:
              FREE_EDUCATION_200.targetCount -
              FREE_EDUCATION_200.confirmedFundedPlaces,
            note: "Target cohort capacity",
          },
        ]}
      >
        <div className="flex items-center justify-center py-2">
          <PieChart data={COHORT_PIE_DATA} size={200} innerRadius={64} padAngle={0.02}>
            {COHORT_PIE_DATA.map((slice, idx) => (
              <PieSlice key={slice.label} index={idx} color={slice.color} />
            ))}
            <PieCenter defaultLabel="Confirmed Funded">
              {({ label }) => (
                <div className="text-center">
                  <span className="font-serif text-lg font-bold text-forest block tabular-nums">
                    {FREE_EDUCATION_200.confirmedFundedPlaces} /{" "}
                    {FREE_EDUCATION_200.targetCount}
                  </span>
                  <span className="text-[11px] text-ink-secondary block">
                    {label}
                  </span>
                </div>
              )}
            </PieCenter>
          </PieChart>
        </div>
      </ImpactChartCard>

      {/* 3. Honest Empty-State Fallback: Multi-Year Time Series */}
      <ImpactChartCard
        title="Multi-Year Trend Series"
        badge="Awaiting Audited Series"
        summary="Year-by-year beneficiary and expenditure trends will appear here once audited annual returns and Form 10B schedules are confirmed."
        sourceLabel="Pending Audited Annual Returns"
        rows={[
          {
            label: "Jal Seva Drinking Water",
            value: "10,000+ citizens",
            note: "Cumulative summer relief figure",
          },
          {
            label: "Annual Breakdown (FY 2023–26)",
            value: "Pending",
            note: "No invented yearly splits",
          },
        ]}
      >
        <div className="rounded-xs border border-dashed border-border-warm bg-cream/60 p-6 text-center space-y-3 my-2">
          <div className="w-10 h-10 rounded-full bg-sage/60 text-forest mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-xs font-semibold text-forest">
            Year-by-Year Series Not Yet Published
          </p>
          <p className="text-[11px] text-ink-secondary leading-relaxed">
            In line with MECT&apos;s strict factual accuracy policy, no synthetic multi-year sparkline is plotted until audited annual figures are filed.
          </p>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1 text-xs font-bold text-terracotta-dark hover:text-forest"
          >
            <span>Inspect Annual Reports</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </ImpactChartCard>
    </div>
  );
}

