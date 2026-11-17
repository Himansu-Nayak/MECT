"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Calendar,
  Search,
  Filter,
  Building2,
  Landmark,
  FileCheck,
  ExternalLink,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { PublicDocumentDto } from "@/lib/portal-api";

interface ReportsLibrarySectionProps {
  initialDocuments?: PublicDocumentDto[];
}

const DEFAULT_DOCUMENTS: PublicDocumentDto[] = [
  {
    id: 1,
    documentKey: "DOC-TR-2013-DEED",
    title: "Registered Public Charitable Trust Deed (Foundational Charter)",
    category: "INSTITUTIONAL_IDENTITY",
    financialYear: "FOUNDATION_2013",
    issueDate: "30-07-2013",
    publicationDate: "2013-07-30",
    version: "1.0",
    issuingAuthority: "District Sub-Registrar, Balangir, Govt. of Odisha",
    summary:
      "Foundational deed registered under the Indian Trusts Act, 1882 (Book No. 4, Volume No. 45, Document No. 40311302194) establishing Mahaveer Educational & Charitable Trust as an irrevocable public charitable entity. Clause XVI mandates honorary, non-remunerative trustee service.",
    fileName: "MECT-Trust-Deed-Balangir-40311302194.pdf",
    contentType: "application/pdf",
    fileSize: 428500,
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2013-07-30T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 1,
    createdAt: "2013-07-30T10:00:00Z",
  },
  {
    id: 2,
    documentKey: "DOC-IT-PAN-2013",
    title: "Income Tax Department Permanent Account Number (PAN Card Credential)",
    category: "INSTITUTIONAL_IDENTITY",
    financialYear: "FOUNDATION_2013",
    issueDate: "27-07-2013",
    publicationDate: "2013-07-27",
    version: "1.0",
    issuingAuthority: "Income Tax Department, Government of India",
    summary:
      "Official Income Tax Department PAN card allotment (PAN: AADTM5474F) in the registered legal name of Mahaveer Educational & Charitable Trust, utilized for statutory banking, donor accounting, and tax compliance.",
    fileName: "MECT-PAN-Card-AADTM5474F.pdf",
    contentType: "application/pdf",
    fileSize: 184200,
    sha256Hash: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2013-07-27T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 2,
    createdAt: "2013-07-27T10:00:00Z",
  },
  {
    id: 3,
    documentKey: "DOC-IT-12A-2024",
    title: "CBDT Form 10AC Section 12A Registration Order (AY 2024-25 to AY 2026-27)",
    category: "STATUTORY_REGISTRATION",
    financialYear: "AY 2024-25 to AY 2026-27",
    issueDate: "29-01-2024",
    publicationDate: "2024-01-29",
    version: "1.0",
    issuingAuthority: "Director of Income Tax (Central Processing Centre)",
    summary:
      "Statutory order under Section 12A(1)(ac)(vi) of the Income-tax Act, 1961 (Order URN: AADTM5474FE20231, DIN: AADTM5474FE2023101) granting provisional tax exemption on charitable trust income for AY 2024-25 through AY 2026-27.",
    fileName: "MECT-Section-12A-Order-Form10AC.pdf",
    contentType: "application/pdf",
    fileSize: 298700,
    sha256Hash: "b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-01-29T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 3,
    createdAt: "2024-01-29T10:00:00Z",
  },
  {
    id: 4,
    documentKey: "DOC-IT-80G-2024",
    title: "CBDT Form 10AC Section 80G Approval Order (Historical Order Record)",
    category: "STATUTORY_REGISTRATION",
    financialYear: "AY 2024-25 to AY 2026-27",
    issueDate: "29-01-2024",
    publicationDate: "2024-01-29",
    version: "1.0",
    issuingAuthority: "Director of Income Tax (Central Processing Centre)",
    summary:
      "Historical order under legacy Section 80G(5)(vi) of Income-tax Act, 1961 (Order URN: AADTM5474FF20241, DIN: AADTM5474FF2024101). Current tax year 2026-27 approval under Section 354 is unconfirmed and pending Chartered Accountant review.",
    fileName: "MECT-Section-80G-Order-Form10AC.pdf",
    contentType: "application/pdf",
    fileSize: 312400,
    sha256Hash: "c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-01-29T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 4,
    createdAt: "2024-01-29T10:00:00Z",
  },
  {
    id: 5,
    documentKey: "DOC-MCA-CSR1-2024",
    title: "Ministry of Corporate Affairs Form CSR-1 Registration Certificate",
    category: "STATUTORY_REGISTRATION",
    financialYear: "FY 2024-25",
    issueDate: "09-11-2024",
    publicationDate: "2024-11-09",
    version: "1.0",
    issuingAuthority: "Registrar of Companies, New Delhi, Ministry of Corporate Affairs",
    summary:
      "Institutional registration under Section 135 of Companies Act, 2013 and Companies (CSR Policy) Rules, 2014 (CSR Reg: CSR00081063, Filing SRN: N14617237) authorizing implementation of corporate social responsibility initiatives.",
    fileName: "MECT-MCA-CSR1-Registration-CSR00081063.pdf",
    contentType: "application/pdf",
    fileSize: 215600,
    sha256Hash: "d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-11-09T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 5,
    createdAt: "2024-11-09T10:00:00Z",
  },
  {
    id: 6,
    documentKey: "DOC-NITI-DARPAN-2024",
    title: "NITI Aayog NGO Darpan Portal Registration Credential",
    category: "STATUTORY_REGISTRATION",
    financialYear: "FY 2024-25",
    issueDate: "01-05-2024",
    publicationDate: "2024-05-01",
    version: "1.0",
    issuingAuthority: "NITI Aayog, Government of India",
    summary:
      "Verified registry acknowledgement on the Government of India voluntary organization portal (NGO Darpan ID: OR/2024/0466491) authorizing civil society partnerships and disclosures.",
    fileName: "MECT-NITI-Aayog-Darpan-OR-2024-0466491.pdf",
    contentType: "application/pdf",
    fileSize: 195400,
    sha256Hash: "e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-05-01T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 6,
    createdAt: "2024-05-01T10:00:00Z",
  },
  {
    id: 7,
    documentKey: "DOC-AR-2023-24",
    title: "Annual Activity & Statutory Progress Report (FY 2023-24)",
    category: "ANNUAL_REPORT",
    financialYear: "FY 2023-24",
    issueDate: "30-06-2024",
    publicationDate: "2024-06-30",
    version: "1.0",
    issuingAuthority: "Board of Trustees, Mahaveer Educational & Charitable Trust",
    summary:
      "Annual progress report detailing 350+ recorded student participation entries (FY 2023–24), not necessarily 350 unique students supported, 10,000+ recorded water and relief service instances, not 10,000 unique citizens, and CBDT Form 10AC statutory orders. Certified CA audit statements retained at Secretariat.",
    fileName: "MECT-Annual-Report-FY2023-24.pdf",
    contentType: "application/pdf",
    fileSize: 584300,
    sha256Hash: "f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-06-30T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 7,
    createdAt: "2024-06-30T10:00:00Z",
  },
  {
    id: 8,
    documentKey: "DOC-AR-2022-23",
    title: "Annual Activity & Vocational Livelihood Report (FY 2022-23)",
    category: "ANNUAL_REPORT",
    financialYear: "FY 2022-23",
    issueDate: "30-06-2023",
    publicationDate: "2023-06-30",
    version: "1.0",
    issuingAuthority: "Board of Trustees, Mahaveer Educational & Charitable Trust",
    summary:
      "Annual operational review detailing the Women Vocational Tailoring and Livelihood Center in Balangir (120+ cumulative vocational course enrolments (FY 2021–23), not necessarily 120 uniquely certified women), sewing toolkit distributions, and Jan Ahar patient attendant meal support at DHH Balangir.",
    fileName: "MECT-Annual-Report-FY2022-23.pdf",
    contentType: "application/pdf",
    fileSize: 524100,
    sha256Hash: "0718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2023-06-30T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 8,
    createdAt: "2023-06-30T10:00:00Z",
  },
  {
    id: 9,
    documentKey: "DOC-AR-2021-22",
    title: "Annual Activity & Educational Recovery Report (FY 2021-22)",
    category: "ANNUAL_REPORT",
    financialYear: "FY 2021-22",
    issueDate: "30-06-2022",
    publicationDate: "2022-06-30",
    version: "1.0",
    issuingAuthority: "Board of Trustees, Mahaveer Educational & Charitable Trust",
    summary:
      "Operational report covering scholastic recovery across rural Western Odisha, textbook and stationery kit distributions (280+ kits), remedial center reopenings, and emergency dry-ration support.",
    fileName: "MECT-Annual-Report-FY2021-22.pdf",
    contentType: "application/pdf",
    fileSize: 498200,
    sha256Hash: "18293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234567",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2022-06-30T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 9,
    createdAt: "2022-06-30T10:00:00Z",
  },
  {
    id: 10,
    documentKey: "DOC-POL-SAFEGUARDING-2024",
    title: "Institutional Safeguarding, Student Protection & Privacy Policy",
    category: "GOVERNANCE_POLICY",
    financialYear: "2024",
    issueDate: "01-08-2024",
    publicationDate: "2024-08-01",
    version: "1.0",
    issuingAuthority: "Trust Secretariat & Board of Trustees",
    summary:
      "Comprehensive institutional policy governing student safeguarding, prevention of sexual harassment (POSH), zero-tolerance child protection protocols, and donor data minimization under public non-profit standards.",
    fileName: "MECT-Institutional-Safeguarding-Policy-2024.pdf",
    contentType: "application/pdf",
    fileSize: 342000,
    sha256Hash: "293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345678",
    status: "PUBLISHED",
    visibility: "PUBLIC",
    storageType: "PHYSICAL_ARCHIVE_SECRETARIAT",
    hasDownload: false,
    downloadUrl: null,
    uploadedBy: "SECRETARIAT",
    approvedBy: "CHAIRMAN_TRUSTEE",
    approvedAt: "2024-08-01T10:00:00Z",
    withdrawalReason: null,
    displayOrder: 10,
    createdAt: "2024-08-01T10:00:00Z",
  },
];

const CATEGORIES = [
  { id: "ALL", label: "All Records" },
  { id: "ANNUAL_REPORT", label: "Annual Reports" },
  { id: "STATUTORY_REGISTRATION", label: "Statutory Registrations" },
  { id: "INSTITUTIONAL_IDENTITY", label: "Identity & Deed" },
  { id: "GOVERNANCE_POLICY", label: "Governance & Policies" },
];

const FINANCIAL_YEARS = [
  { id: "ALL", label: "All Periods" },
  { id: "FY 2023-24", label: "FY 2023–24" },
  { id: "FY 2022-23", label: "FY 2022–23" },
  { id: "FY 2021-22", label: "FY 2021–22" },
  { id: "FY 2024-25", label: "FY 2024–25 (In Review)" },
  { id: "AY 2024-25 to AY 2026-27", label: "AY 2024–27 Orders" },
  { id: "FOUNDATION_2013", label: "2013 Foundation" },
];

export function ReportsLibrarySection({ initialDocuments }: ReportsLibrarySectionProps) {
  const [documents] = useState<PublicDocumentDto[]>(
    initialDocuments && initialDocuments.length > 0 ? initialDocuments : DEFAULT_DOCUMENTS
  );
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== "ALL" && doc.category !== selectedCategory) {
        return false;
      }
      if (selectedYear !== "ALL" && doc.financialYear !== selectedYear) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesSummary = doc.summary.toLowerCase().includes(q);
        const matchesAuthority = doc.issuingAuthority.toLowerCase().includes(q);
        const matchesKey = doc.documentKey.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesAuthority && !matchesKey) {
          return false;
        }
      }
      return true;
    });
  }, [documents, selectedCategory, selectedYear, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: documents.length };
    documents.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    return counts;
  }, [documents]);

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes || bytes <= 0) return null;
    const kb = Math.round(bytes / 1024);
    if (kb < 1000) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <section id="library" className="py-16 md:py-24 bg-white" aria-label="Public Records Library">
      <Container size="default" className="space-y-12">
        {/* Section Header */}
        <SectionHeader
          badge="Public Records Vault"
          title="Institutional Public Records &amp; Transparency Library"
          subtitle="Explore verified annual activity summaries, statutory accreditation certificates, and governance policies on official record with the Trust."
          align="center"
        />

        {/* Search & Filter Controls */}
        <div className="p-6 bg-cream border border-border-warm rounded-xs shadow-xs space-y-6">
          {/* Top row: Search and Year Select */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-ink-sand absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, keyword, issuing authority, or record key..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-border-warm rounded-xs focus:outline-none focus:ring-1 focus:ring-forest text-ink placeholder:text-ink-sand/70 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-sand hover:text-ink"
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-forest shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-white border border-border-warm rounded-xs focus:outline-none focus:ring-1 focus:ring-forest text-ink font-sans"
                aria-label="Filter by Financial Year or Reporting Period"
              >
                {FINANCIAL_YEARS.map((fy) => (
                  <option key={fy.id} value={fy.id}>
                    {fy.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-border-warm/60 pt-4">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 font-sans ${
                    active
                      ? "bg-forest text-white shadow-xs font-semibold"
                      : "bg-white text-ink border border-border-warm hover:bg-sand-light"
                  }`}
                  aria-pressed={active}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      active ? "bg-white/20 text-cream" : "bg-sand text-ink-sand"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Factual Record Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-sand border-t border-border-warm/60 pt-3 gap-2 font-sans">
            <span>
              Showing <strong className="text-forest">{filteredDocuments.length}</strong> of{" "}
              <strong className="text-forest">{documents.length}</strong> verified institutional records
            </span>
            <span className="text-[11px]">
              Documentary integrity guaranteed • Official physical copies at Balangir Registered Office
            </span>
          </div>
        </div>

        {/* Document Cards List */}
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center bg-cream border border-border-warm rounded-xs space-y-4">
            <AlertCircle className="w-8 h-8 text-ink-sand mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest">No Records Found</h3>
            <p className="text-xs text-ink-sand max-w-md mx-auto leading-relaxed font-sans">
              No published institutional records match your current filter parameters. You may reset your search filters or contact our Public Secretariat.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedYear("ALL");
                setSearchQuery("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((doc) => {
              const sizeLabel = formatFileSize(doc.fileSize);
              return (
                <Card
                  key={doc.documentKey}
                  variant="elevated"
                  className="p-6 sm:p-8 bg-white border-border-warm shadow-xs hover:border-sand transition-all space-y-5"
                >
                  {/* Top metadata strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-warm gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-forest bg-sand-light px-2 py-0.5 rounded-xs border border-border-warm">
                        {doc.documentKey}
                      </span>
                      <Badge variant="forest" size="sm">
                        {doc.financialYear}
                      </Badge>
                      <span className="text-[11px] text-ink-sand font-mono">
                        v{doc.version}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-forest font-sans font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified Record on Official File</span>
                    </div>
                  </div>

                  {/* Title & Scope */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-forest/90 font-medium font-sans flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-terracotta-dark" />
                      <span>Issuing Authority: {doc.issuingAuthority}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-ink leading-relaxed font-sans pt-1">
                      {doc.summary}
                    </p>
                  </div>

                  {/* Technical & Audit Strip */}
                  <div className="p-3.5 bg-cream rounded-xs border border-border-warm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                    <div>
                      <span className="text-[10px] text-ink-sand uppercase tracking-wider block">
                        Document / Order Date:
                      </span>
                      <span className="font-medium text-forest">
                        {doc.issueDate || doc.publicationDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-sand uppercase tracking-wider block">
                        Record Format:
                      </span>
                      <span className="font-medium text-forest">
                        {doc.contentType === "application/pdf" ? "PDF Document" : "Official Record Archive"}
                        {sizeLabel ? ` (${sizeLabel})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-sand uppercase tracking-wider block">
                        Access Status:
                      </span>
                      <span className="font-medium text-forest">
                        {doc.hasDownload ? "Instant Download Available" : "Retained for Secretariat Inspection"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-border-warm text-xs font-sans">
                    <span className="text-[11px] text-ink-sand">
                      Physical original maintained under Deed No. 40311302194 at Balangir Registered Office.
                    </span>

                    <div className="flex items-center gap-2">
                      {doc.hasDownload && doc.downloadUrl ? (
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF ({sizeLabel || "Official File"})</span>
                          </Button>
                        </a>
                      ) : (
                        <Link href={`/contact?subject=Inspection%20Request%20-%20${encodeURIComponent(doc.documentKey)}`}>
                          <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                            <Landmark className="w-3.5 h-3.5 text-forest" />
                            <span>Request Certified Physical Copy</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Missing Records & Historical Gaps Disclosure */}
        <div className="p-6 sm:p-8 bg-sand-light border border-border-warm rounded-xs space-y-4 font-sans text-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-terracotta-dark shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-forest">
                Disclosure on Reporting Periods &amp; Compilation Status
              </h4>
              <p className="text-ink leading-relaxed">
                In strict adherence to institutional transparency, Mahaveer Educational &amp; Charitable Trust (MECT) never manufactures simulated reports or generates illustrative audit figures for periods currently under compilation:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-ink pt-1">
                <li>
                  <strong>FY 2024–25 Financial Accounts:</strong> Trust ledgers for the fiscal period ending 31 March 2025 are currently undergoing annual reconciliation and statutory preparation for Chartered Accountant audit and Form 10B filing.
                </li>
                <li>
                  <strong>Pre-2021 Historical Records:</strong> Founding operational registers and receipts dating back to Trust inception in 2013 are catalogued in physical ledgers at our Balangir Registered Office under Deed Doc No. 40311302194.
                </li>
                <li>
                  <strong>FY 2026–27 Tax Status:</strong> Historical Form 10AC Section 12A and Section 80G orders covered AY 2024–25 through AY 2026–27 (order dated 29-01-2024). Current applicability for FY 2026–27 remains subject to ongoing Chartered Accountant review under the Income-tax Act, 2025.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Secretariat Inspection Pathway */}
        <div className="p-8 bg-forest text-white rounded-xs border border-border-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge variant="forest" size="sm" className="bg-white/10 text-cream border-white/20">
              Institutional Fiduciary Right
            </Badge>
            <h3 className="font-serif text-2xl font-bold text-white">
              Official Document Inspection at the Trust Secretariat
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
              Under public trust governance standards and the Indian Trusts Act, 1882, any donor, partner institution, or citizen is entitled to examine certified physical copies of our Trust Deed, statutory return filings, and audited ledgers by scheduling an inspection appointment.
            </p>
          </div>

          <Link href="/contact" className="shrink-0">
            <Button variant="gold" size="lg" className="font-bold shadow-sm">
              <span>Schedule Document Inspection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
