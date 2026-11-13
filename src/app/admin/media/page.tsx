"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  MediaAssetDto,
  deleteAdminMedia,
  fetchAdminMedia,
  uploadAdminMedia,
} from "@/lib/portal-api";
import { AlertCircle, Check, Copy, Image as ImageIcon, Trash2, Upload } from "lucide-react";

export default function AdminMediaLibraryPage() {
  const { token, user } = useAdminAuth();
  const [assets, setAssets] = useState<MediaAssetDto[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [focalPoint, setFocalPoint] = useState("center");
  const [uploading, setUploading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isReadOnly = user?.role === "ROLE_AUDITOR";

  const loadAssets = async () => {
    if (!token) return;
    try {
      setAssets(await fetchAdminMedia(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media library.");
    }
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const data = await fetchAdminMedia(token);
        if (active) setAssets(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load media library.");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !file || isReadOnly) return;
    setUploading(true);
    setError(null);
    try {
      await uploadAdminMedia(token, file, altText || file.name, focalPoint);
      setFile(null);
      setAltText("");
      await loadAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (assetKey: string) => {
    if (!token || isReadOnly) return;
    try {
      await deleteAdminMedia(token, assetKey);
      await loadAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete media.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border-warm pb-4">
        <h1 className="text-2xl font-serif font-bold text-forest flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-terracotta-dark" />
          <span>Media Library &amp; SBI QR Assets</span>
        </h1>
        <p className="text-xs text-ink-sand mt-1">
          Upload PNG, JPEG, WEBP, or SVG assets (max 2 MB) with alt text and focal-point metadata. Copy the public URL into Payment Settings or CMS Pages.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xs bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isReadOnly && (
        <Card padding="lg" className="bg-white border-border-warm">
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Image File (≤ 2 MB)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-xs w-full"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Alt Text (Accessibility)</label>
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Official SBI QR / Programme Photo" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Focal Point</label>
              <select
                value={focalPoint}
                onChange={(e) => setFocalPoint(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-white border border-border-warm rounded-xs"
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
            <Button type="submit" variant="primary" disabled={uploading || !file}>
              <Upload className="w-4 h-4 mr-1.5" />
              <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <Card key={asset.assetKey} padding="md" className="bg-white border-border-warm space-y-3">
            <div className="h-40 bg-cream border border-border-warm rounded-xs flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.publicUrl} alt={asset.altText} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-forest truncate">{asset.fileName}</div>
              <div className="text-ink-sand truncate">{asset.altText}</div>
              <div className="font-mono text-[11px] text-ink-sand">
                {Math.round(asset.fileSize / 1024)} KB · {asset.focalPoint}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-warm">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(asset.publicUrl);
                  setCopiedKey(asset.assetKey);
                  setTimeout(() => setCopiedKey(null), 2000);
                }}
                className="text-[11px]"
              >
                {copiedKey === asset.assetKey ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                <span>{copiedKey === asset.assetKey ? "Copied" : "Copy URL"}</span>
              </Button>
              {!isReadOnly && (
                <Button type="button" size="sm" variant="outline" onClick={() => handleDelete(asset.assetKey)} className="text-red-700 border-red-200">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

