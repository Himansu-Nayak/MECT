"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  PaymentConfigurationDto,
  fetchAdminPaymentConfig,
  updateAdminPaymentConfig,
} from "@/lib/portal-api";
import { AlertCircle, CheckCircle2, Lock, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";

export default function AdminPaymentSettingsPage() {
  const { token, user } = useAdminAuth();
  const [config, setConfig] = useState<PaymentConfigurationDto | null>(null);
  const [presetsCsv, setPresetsCsv] = useState("500, 1000, 1500, 3000, 5000, 10000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isReadOnly = user?.role === "ROLE_AUDITOR" || user?.role === "ROLE_DONATION_VERIFICATION_OFFICER";

  useEffect(() => {
    if (!token) return;
    fetchAdminPaymentConfig(token)
      .then((data) => {
        setConfig(data);
        setPresetsCsv((data.presetAmounts || [500, 1000, 1500, 3000, 5000, 10000]).join(", "));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load settings."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !config || isReadOnly) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    const parsedPresets = presetsCsv
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 1);

    try {
      const updated = await updateAdminPaymentConfig(token, {
        cashfreeEnabled: config.cashfreeEnabled,
        sbiQrEnabled: config.sbiQrEnabled,
        primaryMethod: config.primaryMethod,
        fallbackEnabled: config.fallbackEnabled,
        minAmount: Number(config.minAmount),
        maxAmount: Number(config.maxAmount),
        presetAmounts: parsedPresets.length ? parsedPresets : [500, 1000, 1500, 3000, 5000, 10000],
        generalFundEnabled: config.generalFundEnabled,
        sbiBankName: config.sbiBankName,
        sbiAccountName: config.sbiAccountName,
        sbiAccountNumber: config.sbiAccountNumber,
        sbiIfsc: config.sbiIfsc,
        sbiBranch: config.sbiBranch,
        sbiUpiId: config.sbiUpiId,
        sbiQrImageUrl: config.sbiQrImageUrl,
        paymentInstructions: config.paymentInstructions,
        gatewayNoticeText: config.gatewayNoticeText,
        statutoryStatus: config.statutoryStatus,
        statutoryFinancialYear: config.statutoryFinancialYear,
        statutoryEffectiveDate: config.statutoryEffectiveDate || "",
        statutoryExpiryDate: config.statutoryExpiryDate || "",
        statutoryUrn80g: config.statutoryUrn80g || "",
        statutoryUrn12a: config.statutoryUrn12a || "",
        statutoryClaimApproved: config.statutoryClaimApproved,
        statutoryDisclosureText: config.statutoryDisclosureText,
      });
      setConfig(updated);
      setPresetsCsv(updated.presetAmounts.join(", "));
      setSuccess("Donation payment, limits, and statutory eligibility settings saved and audited.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save payment configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-ink-muted">Loading payment &amp; statutory configuration...</div>;
  }
  if (!config) {
    return <div className="p-8 text-sm text-red-700">{error || "Configuration unavailable."}</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-warm pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-terracotta-dark" />
            <span>Payment, Limits &amp; Statutory Settings</span>
          </h1>
          <p className="text-xs text-ink-sand mt-1">
            Configure live `/donate` channels, preset amounts, SBI QR details, General Fund availability, and FY 80G statutory disclosures. Gateway secret keys are never stored in DB.
          </p>
        </div>
        <Badge variant={config.statutoryClaimApproved ? "forest" : "gold"} size="sm">
          {config.statutoryFinancialYear} · {config.statutoryClaimApproved ? "80G Approved" : "Institutional Receipt"}
        </Badge>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-xs bg-red-50 border border-red-200 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gateway & Amount Rules */}
        <Card padding="lg" className="bg-white border-border-warm space-y-4">
          <h2 className="font-serif font-bold text-forest text-lg">1. Payment Channels &amp; Donation Limits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 border border-border-warm rounded-xs cursor-pointer">
              <input
                type="checkbox"
                checked={config.cashfreeEnabled}
                disabled={isReadOnly}
                onChange={(e) => setConfig({ ...config, cashfreeEnabled: e.target.checked })}
                className="accent-forest"
              />
              <span className="font-semibold text-forest">Cashfree Primary Enabled</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-border-warm rounded-xs cursor-pointer">
              <input
                type="checkbox"
                checked={config.sbiQrEnabled}
                disabled={isReadOnly}
                onChange={(e) => setConfig({ ...config, sbiQrEnabled: e.target.checked })}
                className="accent-forest"
              />
              <span className="font-semibold text-forest">SBI Direct / UTR Enabled</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-border-warm rounded-xs cursor-pointer">
              <input
                type="checkbox"
                checked={config.fallbackEnabled}
                disabled={isReadOnly}
                onChange={(e) => setConfig({ ...config, fallbackEnabled: e.target.checked })}
                className="accent-forest"
              />
              <span className="font-semibold text-forest">Intelligent Fallback Active</span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-border-warm rounded-xs cursor-pointer">
              <input
                type="checkbox"
                checked={config.generalFundEnabled}
                disabled={isReadOnly}
                onChange={(e) => setConfig({ ...config, generalFundEnabled: e.target.checked })}
                className="accent-forest"
              />
              <span className="font-semibold text-forest">General Fund Authorised</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Minimum Amount (INR)</label>
              <Input
                type="number"
                min={1}
                disabled={isReadOnly}
                value={config.minAmount}
                onChange={(e) => setConfig({ ...config, minAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Maximum Amount (INR)</label>
              <Input
                type="number"
                min={1}
                disabled={isReadOnly}
                value={config.maxAmount}
                onChange={(e) => setConfig({ ...config, maxAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Primary Channel</label>
              <select
                disabled={isReadOnly}
                value={config.primaryMethod}
                onChange={(e) => setConfig({ ...config, primaryMethod: e.target.value as "CASHFREE" | "SBI_QR" })}
                className="w-full h-10 px-3 text-sm bg-white border border-border-warm rounded-xs"
              >
                <option value="CASHFREE">CASHFREE (Default)</option>
                <option value="SBI_QR">SBI_QR</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-forest mb-1">Preset Amounts (comma-separated INR)</label>
              <Input
                disabled={isReadOnly}
                value={presetsCsv}
                onChange={(e) => setPresetsCsv(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Official SBI Details */}
        <Card padding="lg" className="bg-white border-border-warm space-y-4">
          <h2 className="font-serif font-bold text-forest text-lg">2. Official SBI Bank &amp; QR Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Bank Name</label>
              <Input disabled={isReadOnly} value={config.sbiBankName} onChange={(e) => setConfig({ ...config, sbiBankName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Account Holder Name</label>
              <Input disabled={isReadOnly} value={config.sbiAccountName} onChange={(e) => setConfig({ ...config, sbiAccountName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Account Number</label>
              <Input disabled={isReadOnly} value={config.sbiAccountNumber} onChange={(e) => setConfig({ ...config, sbiAccountNumber: e.target.value })} className="font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">IFSC Code</label>
              <Input disabled={isReadOnly} value={config.sbiIfsc} onChange={(e) => setConfig({ ...config, sbiIfsc: e.target.value })} className="font-mono uppercase" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Branch</label>
              <Input disabled={isReadOnly} value={config.sbiBranch} onChange={(e) => setConfig({ ...config, sbiBranch: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Official UPI ID</label>
              <Input disabled={isReadOnly} value={config.sbiUpiId} onChange={(e) => setConfig({ ...config, sbiUpiId: e.target.value })} className="font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-forest mb-1">Official QR Image URL (or Media Library `/api/v1/public/cms/media/...`)</label>
              <Input disabled={isReadOnly} value={config.sbiQrImageUrl} onChange={(e) => setConfig({ ...config, sbiQrImageUrl: e.target.value })} className="font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-forest mb-1">Beneficiary Verification Instructions</label>
              <textarea
                rows={2}
                disabled={isReadOnly}
                value={config.paymentInstructions}
                onChange={(e) => setConfig({ ...config, paymentInstructions: e.target.value })}
                className="w-full p-2.5 text-xs bg-white border border-border-warm rounded-xs"
              />
            </div>
          </div>
        </Card>

        {/* Statutory Eligibility */}
        <Card padding="lg" className="bg-white border-border-warm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-forest text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-terracotta-dark" />
              <span>3. Statutory &amp; 80G Eligibility Disclosure</span>
            </h2>
            <label className="flex items-center gap-2 text-xs font-bold text-forest cursor-pointer">
              <input
                type="checkbox"
                checked={config.statutoryClaimApproved}
                disabled={isReadOnly}
                onChange={(e) => setConfig({ ...config, statutoryClaimApproved: e.target.checked })}
                className="accent-forest"
              />
              <span>80G Tax Exemption Verified Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Financial Year</label>
              <Input disabled={isReadOnly} value={config.statutoryFinancialYear} onChange={(e) => setConfig({ ...config, statutoryFinancialYear: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Statutory Status Code</label>
              <Input disabled={isReadOnly} value={config.statutoryStatus} onChange={(e) => setConfig({ ...config, statutoryStatus: e.target.value })} className="font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">80G URN</label>
              <Input disabled={isReadOnly} value={config.statutoryUrn80g || ""} onChange={(e) => setConfig({ ...config, statutoryUrn80g: e.target.value })} className="font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">12A URN</label>
              <Input disabled={isReadOnly} value={config.statutoryUrn12a || ""} onChange={(e) => setConfig({ ...config, statutoryUrn12a: e.target.value })} className="font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Effective Date</label>
              <Input disabled={isReadOnly} value={config.statutoryEffectiveDate || ""} onChange={(e) => setConfig({ ...config, statutoryEffectiveDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-forest mb-1">Expiry Date</label>
              <Input disabled={isReadOnly} value={config.statutoryExpiryDate || ""} onChange={(e) => setConfig({ ...config, statutoryExpiryDate: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-forest mb-1">Public &amp; Receipt Statutory Disclosure Text</label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={config.statutoryDisclosureText}
                onChange={(e) => setConfig({ ...config, statutoryDisclosureText: e.target.value })}
                className="w-full p-2.5 text-xs bg-white border border-border-warm rounded-xs"
              />
            </div>
          </div>
        </Card>

        {!isReadOnly ? (
          <div className="flex items-center justify-between bg-white border border-border-warm rounded-xs p-4">
            <div className="text-xs text-ink-sand flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Last updated by <strong>{config.updatedBy || "SYSTEM"}</strong></span>
            </div>
            <Button type="submit" variant="primary" size="lg" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              <span>{saving ? "Saving..." : "Save Configuration"}</span>
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900">
            Read-only mode for {user?.role?.replace("ROLE_", "")}. Contact Super Admin or Finance Officer to modify settings.
          </div>
        )}
      </form>
    </div>
  );
}

