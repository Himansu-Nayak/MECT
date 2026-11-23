// motion: owner = Motion
"use client";

import React, { useState } from "react";
import { Table2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export interface ChartDataRow {
  label: string;
  value: string | number;
  note?: string;
}

export interface ImpactChartCardProps {
  title: string;
  badge: string;
  summary: string;
  sourceLabel: string;
  rows: ChartDataRow[];
  children: React.ReactNode;
}

/**
 * M5.2 — Accessible chart wrapper combining a Bklit visualization,
 * a one-sentence summary, and a toggleable + screen-reader-accessible data table.
 */
export function ImpactChartCard({
  title,
  badge,
  summary,
  sourceLabel,
  rows,
  children,
}: ImpactChartCardProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <Card
      variant="elevated"
      className="p-6 bg-white border-border-warm shadow-xs space-y-4 flex flex-col justify-between"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="forest" size="sm">
            {badge}
          </Badge>
          <button
            type="button"
            onClick={() => setShowTable((prev) => !prev)}
            aria-expanded={showTable}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest hover:text-terracotta-dark px-2 py-1 rounded-xs border border-border-warm bg-cream/60 transition-colors focus-visible:outline-2 focus-visible:outline-terracotta"
          >
            <Table2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showTable ? "Show Chart" : "View Data Table"}</span>
          </button>
        </div>

        <h3 className="font-serif text-lg sm:text-xl font-bold text-forest">
          {title}
        </h3>
        <p className="text-xs text-ink-secondary leading-relaxed font-sans">
          {summary}
        </p>
      </div>

      {showTable ? (
        <div className="overflow-x-auto border border-border-warm rounded-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand-light text-forest font-bold border-b border-border-warm">
              <tr>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Value</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm/60">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2 font-medium text-ink">{row.label}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-forest">
                    {row.value}
                  </td>
                  <td className="px-3 py-2 text-ink-secondary">
                    {row.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full">
          {children}
          {/* Screen-reader-accessible data table always present in DOM */}
          <table className="sr-only">
            <caption>{title}</caption>
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                  <td>{row.note || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] font-mono text-ink-secondary pt-2 border-t border-border-warm">
        Source: {sourceLabel}
      </p>
    </Card>
  );
}

