"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PublicDocumentDto,
  fetchAdminDocuments,
  uploadAdminDocument,
  updateAdminDocumentStatus,
} from "@/lib/portal-api";
import {
  FileText,
  Upload,
  AlertCircle,
  CheckCircle2,
  Filter,
  Download,
  Building2,
  Clock,
  ShieldCheck,
  Plus,
} from "lucide-react";

export default function AdminDocumentsPage() {
  const { token, user } = useAdminAuth();
  const [documents, setDocuments] = useState<PublicDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Upload modal/form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docKey, setDocKey] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ANNUAL_REPORT");
  const [financialYear, setFinancialYear] = useState("FY 2024-25");
  const [issuingAuthority, setIssuingAuthority] = useState("Board of Trustees");
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [initialStatus, setInitialStatus] = useState("DRAFT");

  const isReadOnly = user?.role === "ROLE_AUDITOR";

  const loadDocuments = async () => {
    if (!token) return;
    try {
      setError(null);
      const data = await fetchAdminDocuments(token);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const data = await fetchAdminDocuments(token);
        if (active) {
          setDocuments(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load document records.");
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isReadOnly) return;
    try {
      setUploading(true);
      setError(null);
      setSuccessMsg(null);
      await uploadAdminDocument(token, file, {
        documentKey: docKey.trim() || undefined,
        title: title.trim(),
        category,
        financialYear,
        issuingAuthority: issuingAuthority.trim(),
        summary: summary.trim(),
        visibility,
        status: initialStatus,
      });
      setSuccessMsg("Document uploaded and recorded successfully.");
      setShowUploadForm(false);
      // Reset form
      setFile(null);
      setDocKey("");
      setTitle("");
      setSummary("");
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleStatusChange = async (id: number, targetStatus: string) => {
    if (!token || isReadOnly) return;
    let reason: string | undefined = undefined;
    if (targetStatus === "WITHDRAWN") {
      const input = window.prompt("Enter reason for document withdrawal:");
      if (!input || !input.trim()) return;
      reason = input.trim();
    }
    try {
      setError(null);
      setSuccessMsg(null);
      await updateAdminDocumentStatus(token, id, targetStatus, reason);
      setSuccessMsg(`Document status updated to ${targetStatus}.`);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const filteredDocs = documents.filter((d) => {
    if (statusFilter === "ALL") return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-warm gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest flex items-center gap-2">
            <FileText className="w-6 h-6 text-terracotta-dark" />
            <span>Institutional Public Records &amp; Documents Registry</span>
          </h1>
          <p className="text-xs text-ink-sand mt-1 font-sans">
            Manage public statutory records, annual reports, and regulatory orders. Lifecycle: DRAFT → UNDER_REVIEW → APPROVED → PUBLISHED → WITHDRAWN.
          </p>
        </div>

        {!isReadOnly && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>{showUploadForm ? "Close Upload Form" : "Upload Document"}</span>
          </Button>
        )}
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-900 rounded-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Form Modal/Drawer */}
      {showUploadForm && !isReadOnly && (
        <Card variant="elevated" className="p-6 bg-cream border border-border-warm rounded-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-forest flex items-center gap-2">
            <Upload className="w-5 h-5 text-terracotta-dark" />
            <span>Upload New Institutional Document Record</span>
          </h3>

          <form onSubmit={handleUpload} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Activity Report FY 2024-25"
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Document Key (Optional - Unique identifier)
                </label>
                <input
                  type="text"
                  value={docKey}
                  onChange={(e) => setDocKey(e.target.value)}
                  placeholder="e.g. DOC-AR-2024-25"
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="ANNUAL_REPORT">Annual Report</option>
                  <option value="STATUTORY_REGISTRATION">Statutory Registration</option>
                  <option value="INSTITUTIONAL_IDENTITY">Institutional Identity &amp; Deed</option>
                  <option value="GOVERNANCE_POLICY">Governance Policy</option>
                  <option value="FINANCIAL_ACCOUNTABILITY">Financial Accountability</option>
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Financial Year / Reporting Period *
                </label>
                <input
                  type="text"
                  required
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value)}
                  placeholder="e.g. FY 2024-25"
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Issuing Authority *
                </label>
                <input
                  type="text"
                  required
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  placeholder="e.g. Board of Trustees, MECT"
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">
                  Initial Status
                </label>
                <select
                  value={initialStatus}
                  onChange={(e) => setInitialStatus(e.target.value)}
                  className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="DRAFT">DRAFT (Internal)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Pending Review)</option>
                  <option value="APPROVED">APPROVED (Approved for Publication)</option>
                  <option value="PUBLISHED">PUBLISHED (Live Public)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Document Summary &amp; Scope *
              </label>
              <textarea
                required
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Comprehensive description of document scope, audited milestones, and official record status..."
                className="w-full p-2 bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Attach Official PDF Document (Optional - Max 10 MB)
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full p-1.5 bg-white border border-border-warm rounded-xs text-ink text-xs file:mr-3 file:py-1 file:px-3 file:rounded-xs file:border-0 file:text-xs file:font-semibold file:bg-forest file:text-white hover:file:bg-forest-deep"
              />
              <span className="text-[11px] text-ink-sand mt-0.5 block">
                If no PDF is attached, the record is designated as a physical certified copy on file at Secretariat.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setShowUploadForm(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : "Save Document Record"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 p-3 bg-cream border border-border-warm rounded-xs text-xs font-sans">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest" />
          <span className="font-semibold text-ink">Filter Status:</span>
          {["ALL", "PUBLISHED", "DRAFT", "UNDER_REVIEW", "APPROVED", "WITHDRAWN"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xs transition-colors ${
                statusFilter === st
                  ? "bg-forest text-white font-bold"
                  : "bg-white text-ink border border-border-warm hover:bg-sand-light"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <span className="text-ink-sand">
          Total Records: <strong>{filteredDocs.length}</strong>
        </span>
      </div>

      {/* Document Records List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-ink-sand">Loading document library...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-8 text-center text-xs text-ink-sand bg-white border border-border-warm rounded-xs">
          No document records found matching selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => {
            const isPublished = doc.status === "PUBLISHED";
            const isWithdrawn = doc.status === "WITHDRAWN";
            return (
              <Card
                key={doc.id}
                variant="elevated"
                className="p-5 bg-white border-border-warm shadow-xs space-y-3 font-sans text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border-warm gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-forest bg-sand-light px-2 py-0.5 rounded-xs border border-border-warm">
                      {doc.documentKey}
                    </span>
                    <Badge variant="forest" size="sm">
                      {doc.category}
                    </Badge>
                    <span className="font-medium text-ink-sand">
                      {doc.financialYear}
                    </span>
                    <span className="font-mono text-[11px] text-ink-sand">
                      v{doc.version}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : isWithdrawn
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <span className="text-[11px] text-ink-sand">
                      {doc.visibility}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-base font-bold text-forest">
                    {doc.title}
                  </h4>
                  <p className="text-ink-sand leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-ink-sand pt-1 border-t border-border-warm/60">
                  <div>
                    Issuing Authority: <strong className="text-ink">{doc.issuingAuthority}</strong>
                  </div>
                  <div>
                    Storage: <strong className="text-ink">{doc.storageType}</strong>
                    {doc.fileSize > 0 && ` (${Math.round(doc.fileSize / 1024)} KB)`}
                  </div>
                  <div>
                    SHA-256: <code className="text-[10px] text-forest">{doc.sha256Hash ? doc.sha256Hash.substring(0, 16) + "..." : "Physical Archive"}</code>
                  </div>
                </div>

                {doc.withdrawalReason && (
                  <div className="p-2 bg-red-50 text-red-800 rounded-xs text-[11px] border border-red-200">
                    Withdrawal Reason: {doc.withdrawalReason}
                  </div>
                )}

                {/* Actions */}
                {!isReadOnly && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border-warm">
                    <span className="text-[11px] text-ink-sand">
                      Uploaded by: {doc.uploadedBy} • {doc.publicationDate}
                    </span>

                    <div className="flex items-center gap-2">
                      {doc.hasDownload && (
                        <a
                          href={`/api/v1/admin/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1">
                            <Download className="w-3 h-3" />
                            <span>Download Binary</span>
                          </Button>
                        </a>
                      )}

                      {doc.status === "DRAFT" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-[11px]"
                          onClick={() => handleStatusChange(doc.id, "UNDER_REVIEW")}
                        >
                          Submit for Review
                        </Button>
                      )}

                      {doc.status === "UNDER_REVIEW" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7 text-[11px]"
                          onClick={() => handleStatusChange(doc.id, "APPROVED")}
                        >
                          Approve
                        </Button>
                      )}

                      {doc.status === "APPROVED" && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-7 text-[11px]"
                          onClick={() => handleStatusChange(doc.id, "PUBLISHED")}
                        >
                          Publish Live
                        </Button>
                      )}

                      {doc.status === "PUBLISHED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] text-red-700 border-red-300 hover:bg-red-50"
                          onClick={() => handleStatusChange(doc.id, "WITHDRAWN")}
                        >
                          Withdraw Record
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
