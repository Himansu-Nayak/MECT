"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  CmsPageSummary,
  fetchAdminCmsPage,
  fetchAdminCmsPages,
  publishAdminCmsPage,
  saveAdminCmsDraft,
} from "@/lib/portal-api";
import { AlertCircle, CheckCircle2, Eye, FileEdit, History, Plus, Save, Send } from "lucide-react";

const RECOMMENDED_SLUGS = [
  { slug: "home", title: "Home Page Institutional Copy" },
  { slug: "about", title: "About MECT & Trustees" },
  { slug: "programmes", title: "Charitable Programmes" },
  { slug: "donate", title: "Donation Portal Copy" },
  { slug: "statutory-disclosures", title: "Statutory & 80G Disclosures" },
];

export default function AdminCmsPage() {
  const { token, user } = useAdminAuth();
  const [pages, setPages] = useState<CmsPageSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [title, setTitle] = useState("Home Page Institutional Copy");
  const [draftJson, setDraftJson] = useState('{\n  "heroHeadline": "Building Self-Reliance in Western Odisha",\n  "announcement": ""\n}');
  const [changeSummary, setChangeSummary] = useState("");
  const [activeDetail, setActiveDetail] = useState<CmsPageSummary | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isReadOnly = user?.role === "ROLE_AUDITOR";

  const loadList = async (slugToLoad?: string) => {
    if (!token) return;
    try {
      const list = await fetchAdminCmsPages(token);
      setPages(list);
      const target = slugToLoad || selectedSlug;
      if (list.some((p) => p.slug === target)) {
        const detail = await fetchAdminCmsPage(token, target);
        setActiveDetail(detail);
        setTitle(detail.title);
        setDraftJson(detail.draftJson || detail.sectionJson || "{}");
      } else {
        setActiveDetail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CMS pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const list = await fetchAdminCmsPages(token);
        if (!active) return;
        setPages(list);
        if (list.some((p) => p.slug === selectedSlug)) {
          const detail = await fetchAdminCmsPage(token, selectedSlug);
          if (!active) return;
          setActiveDetail(detail);
          setTitle(detail.title);
          setDraftJson(detail.draftJson || detail.sectionJson || "{}");
        } else {
          setActiveDetail(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load CMS pages.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const selectSlug = async (slug: string, defaultTitle?: string) => {
    setSelectedSlug(slug);
    setError(null);
    setSuccess(null);
    if (!token) return;
    const exists = pages.some((p) => p.slug === slug);
    if (exists) {
      try {
        const detail = await fetchAdminCmsPage(token, slug);
        setActiveDetail(detail);
        setTitle(detail.title);
        setDraftJson(detail.draftJson || detail.sectionJson || "{}");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load page.");
      }
    } else {
      setActiveDetail(null);
      setTitle(defaultTitle || slug);
      setDraftJson('{\n  "headline": "",\n  "summary": ""\n}');
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isReadOnly) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await saveAdminCmsDraft(token, selectedSlug, {
        title,
        draftJson,
        changeSummary: changeSummary || "Updated via Admin CMS",
      });
      setActiveDetail(updated);
      setChangeSummary("");
      setSuccess(`Draft saved for "${selectedSlug}" (not live until published).`);
      await loadList(selectedSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!token || isReadOnly) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const published = await publishAdminCmsPage(token, selectedSlug);
      setActiveDetail(published);
      setSuccess(`Published "${selectedSlug}" live with immutable revision audit.`);
      await loadList(selectedSlug);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish page.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-ink-muted">Loading CMS workspace...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest flex items-center gap-2">
            <FileEdit className="w-6 h-6 text-terracotta-dark" />
            <span>CMS Pages &amp; Revision Control</span>
          </h1>
          <p className="text-xs text-ink-sand mt-1">
            Edit structured page content in Draft mode, preview JSON sections, and Publish live with full revision history.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
          <Eye className="w-4 h-4 mr-1.5" />
          <span>{previewMode ? "Edit Mode" : "Preview Draft"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-xs bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Page List */}
        <Card padding="md" className="lg:col-span-4 bg-white border-border-warm space-y-3 h-fit">
          <div className="text-xs font-bold uppercase tracking-wider text-forest">Managed Pages</div>
          <div className="space-y-1.5">
            {RECOMMENDED_SLUGS.map((item) => {
              const existing = pages.find((p) => p.slug === item.slug);
              const active = selectedSlug === item.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => selectSlug(item.slug, item.title)}
                  className={`w-full text-left px-3 py-2.5 rounded-xs border text-xs flex items-center justify-between gap-2 ${
                    active ? "bg-forest text-white border-forest font-bold" : "bg-cream/40 text-forest border-border-warm hover:border-forest/40"
                  }`}
                >
                  <span className="truncate">/{item.slug}</span>
                  <Badge variant={existing?.status === "PUBLISHED" ? "forest" : "gold"} size="sm">
                    {existing?.status || "NEW"}
                  </Badge>
                </button>
              );
            })}
            {pages
              .filter((p) => !RECOMMENDED_SLUGS.some((r) => r.slug === p.slug))
              .map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => selectSlug(p.slug)}
                  className={`w-full text-left px-3 py-2.5 rounded-xs border text-xs flex items-center justify-between gap-2 ${
                    selectedSlug === p.slug ? "bg-forest text-white border-forest font-bold" : "bg-cream/40 text-forest border-border-warm"
                  }`}
                >
                  <span className="truncate">/{p.slug}</span>
                  <Badge variant={p.status === "PUBLISHED" ? "forest" : "gold"} size="sm">{p.status}</Badge>
                </button>
              ))}
          </div>
          <div className="pt-2 border-t border-border-warm">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                const custom = prompt("Enter new page slug (lowercase, e.g. impact-2026):");
                if (custom && custom.trim()) selectSlug(custom.trim().toLowerCase(), custom.trim());
              }}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>New Custom Slug</span>
            </Button>
          </div>
        </Card>

        {/* Editor & Revisions */}
        <div className="lg:col-span-8 space-y-5">
          <Card padding="lg" className="bg-white border-border-warm space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-serif font-bold text-forest text-lg">/{selectedSlug}</div>
              <Badge variant={activeDetail?.status === "PUBLISHED" ? "forest" : "gold"} size="sm">
                {activeDetail?.status || "UNSAVED DRAFT"}
              </Badge>
            </div>

            {previewMode ? (
              <div className="bg-cream/60 border border-border-warm rounded-xs p-4 space-y-2">
                <div className="text-xs font-bold uppercase text-ink-sand">Draft Preview ({title})</div>
                <pre className="text-xs font-mono text-forest whitespace-pre-wrap overflow-x-auto">{draftJson}</pre>
              </div>
            ) : (
              <form onSubmit={handleSaveDraft} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">Page Title</label>
                  <Input disabled={isReadOnly} value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">Structured Section JSON</label>
                  <textarea
                    rows={10}
                    disabled={isReadOnly}
                    value={draftJson}
                    onChange={(e) => setDraftJson(e.target.value)}
                    className="w-full p-3 text-xs font-mono bg-cream/30 border border-border-warm rounded-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">Revision Change Summary</label>
                  <Input
                    disabled={isReadOnly}
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="Briefly describe what changed in this draft"
                  />
                </div>
                {!isReadOnly && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button type="submit" variant="outline" disabled={saving}>
                      <Save className="w-4 h-4 mr-1.5" />
                      <span>{saving ? "Saving..." : "Save Draft"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={saving || !activeDetail}
                      onClick={handlePublish}
                    >
                      <Send className="w-4 h-4 mr-1.5" />
                      <span>Publish Live</span>
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Card>

          {activeDetail?.revisions && activeDetail.revisions.length > 0 && (
            <Card padding="md" className="bg-white border-border-warm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-1.5">
                <History className="w-4 h-4 text-terracotta-dark" />
                <span>Revision History ({activeDetail.revisions.length})</span>
              </div>
              <div className="space-y-2 text-xs">
                {activeDetail.revisions.slice(0, 8).map((rev) => (
                  <div key={rev.revisionNumber} className="flex items-center justify-between gap-2 p-2.5 bg-cream/40 border border-border-warm rounded-xs">
                    <div>
                      <span className="font-mono font-bold text-forest">Rev #{rev.revisionNumber}</span>{" "}
                      <span className="text-ink">— {rev.changeSummary || "Saved"}</span>
                      <div className="text-[11px] text-ink-sand">
                        By {rev.editedBy} · {new Date(rev.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setDraftJson(rev.snapshotJson)}
                      className="text-[11px]"
                    >
                      Restore to Editor
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

