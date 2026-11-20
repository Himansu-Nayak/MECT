import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, FileText, Clock, CheckCircle2, ShieldCheck, Landmark } from "lucide-react";

interface YearReportEntry {
  fy: string;
  period: string;
  activityReportStatus: "Available" | "Pending" | "Not yet published";
  auditedStatementStatus: "Available" | "Pending" | "Not yet published";
  form10BStatus: "Available" | "Pending" | "Not yet published";
  downloadUrl?: string;
  fileSize?: string;
  notes: string;
}

const YEAR_TABLE_DATA: YearReportEntry[] = [
  {
    fy: "FY 2024–25",
    period: "01 Apr 2024 – 31 Mar 2025",
    activityReportStatus: "Pending",
    auditedStatementStatus: "Pending",
    form10BStatus: "Pending",
    notes: "Ledgers undergoing statutory compilation for CA audit and Form 10B filing. Slot active upon sign-off.",
  },
  {
    fy: "FY 2023–24",
    period: "01 Apr 2023 – 31 Mar 2024",
    activityReportStatus: "Available",
    auditedStatementStatus: "Available",
    form10BStatus: "Available",
    downloadUrl: "/reports/MECT-Annual-Report-FY2023-24.pdf",
    fileSize: "85 KB",
    notes: "Includes 350+ student entries, 10,000+ water service instances, CBDT 12A/80G orders, and CA audit on record.",
  },
  {
    fy: "FY 2022–23",
    period: "01 Apr 2022 – 31 Mar 2023",
    activityReportStatus: "Available",
    auditedStatementStatus: "Available",
    form10BStatus: "Available",
    downloadUrl: "/reports/MECT-Annual-Report-FY2022-23.pdf",
    fileSize: "83 KB",
    notes: "Includes 120+ vocational tailoring enrolments, sewing toolkits, Jan Ahar meal relief at Balangir Hospital.",
  },
  {
    fy: "FY 2021–22",
    period: "01 Apr 2021 – 31 Mar 2022",
    activityReportStatus: "Available",
    auditedStatementStatus: "Available",
    form10BStatus: "Available",
    downloadUrl: "/reports/MECT-Annual-Report-FY2021-22.pdf",
    fileSize: "82 KB",
    notes: "Focus on post-lockdown scholastic recovery, 280+ student kit distributions, and emergency dry-ration support.",
  },
];

export function AnnualReportsYearTable() {
  const getStatusBadge = (status: "Available" | "Pending" | "Not yet published") => {
    switch (status) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded-xs border border-forest/20">
            <CheckCircle2 className="w-3 h-3 text-forest shrink-0" />
            <span>Available</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-dark bg-terracotta/10 px-2 py-0.5 rounded-xs border border-terracotta/25">
            <Clock className="w-3 h-3 text-terracotta-dark shrink-0" />
            <span>Pending</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-sand bg-sand-light px-2 py-0.5 rounded-xs border border-border-warm">
            <span>Not yet published</span>
          </span>
        );
    }
  };

  return (
    <section id="annual-reports-table" className="py-16 bg-sand-light/50 border-b border-border-warm scroll-mt-24">
      <Container size="default" className="space-y-8">
        <div className="max-w-3xl">
          <Badge variant="contrast-gold" size="sm" className="mb-2">
            Multi-Year Compliance Ledger
          </Badge>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Annual Reports &amp; Statutory Audit Status (FY 2021–22 to Present)
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1 font-sans">
            Comprehensive year-by-year record of annual activity reports, Chartered Accountant audited statements, Form 10B statutory filing status, and official PDF download slots.
          </p>
        </div>

        {/* Responsive Table */}
        <div className="bg-white border border-border-warm rounded-xs shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-forest text-white border-b border-border-warm">
                  <th className="py-3.5 px-4 font-semibold font-serif text-sm">Financial Year</th>
                  <th className="py-3.5 px-4 font-semibold">Activity Report</th>
                  <th className="py-3.5 px-4 font-semibold">Audited Statement</th>
                  <th className="py-3.5 px-4 font-semibold">Form 10B Status</th>
                  <th className="py-3.5 px-4 font-semibold">Official Download Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {YEAR_TABLE_DATA.map((row) => (
                  <tr key={row.fy} className="hover:bg-cream/40 transition-colors">
                    <td className="py-4 px-4 font-medium">
                      <div className="font-serif font-bold text-sm text-forest">{row.fy}</div>
                      <div className="text-[11px] text-ink-sand font-mono mt-0.5">{row.period}</div>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(row.activityReportStatus)}</td>
                    <td className="py-4 px-4">{getStatusBadge(row.auditedStatementStatus)}</td>
                    <td className="py-4 px-4">{getStatusBadge(row.form10BStatus)}</td>
                    <td className="py-4 px-4">
                      {row.downloadUrl ? (
                        <a
                          href={row.downloadUrl}
                          download
                          className="inline-flex items-center"
                        >
                          <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
                            <Download className="w-3.5 h-3.5" />
                            <span>Download {row.fy} PDF ({row.fileSize})</span>
                          </Button>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xs bg-sand-light text-ink-sand border border-border-warm cursor-not-allowed opacity-80 font-sans"
                            title="Audit compilation currently in progress"
                          >
                            <Clock className="w-3.5 h-3.5 text-terracotta-dark" />
                            <span>Pending Audit</span>
                          </button>
                          <Link
                            href="/contact?subject=FY2024-25%20Report%20Inquiry"
                            className="text-[11px] text-forest underline hover:text-terracotta-dark font-sans hidden sm:inline"
                          >
                            Inquire with Secretariat
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Notes */}
          <div className="p-4 bg-cream/60 border-t border-border-warm text-[11px] text-ink-sand font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
              <span>
                <strong>FY 2024–25 Status:</strong> Marked <em>Pending</em> pending finalization of annual accounts and Form 10B certification by the Chartered Accountant.
              </span>
            </div>
            <Link
              href="/statutory-disclosures"
              className="text-forest hover:text-terracotta-dark font-semibold underline shrink-0 inline-flex items-center gap-1"
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Inspect 12A/80G Registration Orders</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
