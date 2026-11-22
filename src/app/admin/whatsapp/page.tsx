"use client";

import React, { useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  WhatsAppStatusDto,
  WhatsAppRecipientDto,
  WhatsAppTemplateConfigDto,
  WhatsAppMessageLogDto,
  fetchAdminWhatsAppStatus,
  fetchAdminWhatsAppRecipients,
  createAdminWhatsAppRecipient,
  updateAdminWhatsAppRecipient,
  deleteAdminWhatsAppRecipient,
  toggleAdminWhatsAppRecipient,
  fetchAdminWhatsAppTemplates,
  fetchAdminWhatsAppLogs,
  sendAdminWhatsAppTest,
  retryAdminWhatsAppOutbox,
} from "@/lib/portal-api";
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Check,
  X,
  ShieldAlert,
  Server,
  Layers,
  Phone,
  FileText,
  Activity,
  Sliders,
  Users,
} from "lucide-react";

export default function AdminWhatsAppNotificationCenterPage() {
  const { token, user } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<"recipients" | "templates" | "logs" | "test">("recipients");
  const [status, setStatus] = useState<WhatsAppStatusDto | null>(null);
  const [recipients, setRecipients] = useState<WhatsAppRecipientDto[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplateConfigDto[]>([]);
  const [logs, setLogs] = useState<WhatsAppMessageLogDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New recipient form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipName, setNewRecipName] = useState("");
  const [newRecipPhone, setNewRecipPhone] = useState("");
  const [newRecipRole, setNewRecipRole] = useState("ADMIN");
  const [newNotifyDonation, setNewNotifyDonation] = useState(true);
  const [newNotifyClaim, setNewNotifyClaim] = useState(true);
  const [newNotifyRefund, setNewNotifyRefund] = useState(true);
  const [newNotifyDaily, setNewNotifyDaily] = useState(false);
  const [savingRecip, setSavingRecip] = useState(false);

  // Test dispatch form state
  const [testPhone, setTestPhone] = useState("");
  const [testTemplate, setTestTemplate] = useState("mect_donation_admin_alert");
  const [testParamsCsv, setTestParamsCsv] = useState("Test Donor, 5000, UPI_DIRECT, TEST-REF-99, Education Support");
  const [testingDispatch, setTestingDispatch] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const isReadOnly = user?.role === "ROLE_AUDITOR";

  const loadData = async (showLoadingState = true) => {
    if (!token) return;
    if (showLoadingState) setLoading(true);
    setError(null);
    try {
      const [statusData, recipData, tplData, logData] = await Promise.all([
        fetchAdminWhatsAppStatus(token),
        fetchAdminWhatsAppRecipients(token),
        fetchAdminWhatsAppTemplates(token),
        fetchAdminWhatsAppLogs(token),
      ]);
      setStatus(statusData);
      setRecipients(recipData);
      setTemplates(tplData);
      setLogs(logData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load WhatsApp data.");
    } finally {
      if (showLoadingState) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const handleCreateRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isReadOnly) return;
    setSavingRecip(true);
    setError(null);
    setSuccess(null);
    try {
      await createAdminWhatsAppRecipient(token, {
        name: newRecipName.trim(),
        phoneNumber: newRecipPhone.trim(),
        role: newRecipRole,
        active: true,
        notifyOnDonation: newNotifyDonation,
        notifyOnClaim: newNotifyClaim,
        notifyOnRefund: newNotifyRefund,
        notifyDailySummary: newNotifyDaily,
      });
      setShowAddModal(false);
      setNewRecipName("");
      setNewRecipPhone("");
      setSuccess("New administrator recipient saved successfully.");
      loadData(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save recipient.");
    } finally {
      setSavingRecip(false);
    }
  };

  const handleToggleRecipient = async (id: number) => {
    if (!token || isReadOnly) return;
    try {
      await toggleAdminWhatsAppRecipient(token, id);
      loadData(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to toggle status.");
    }
  };

  const handleDeleteRecipient = async (id: number, name: string) => {
    if (!token || isReadOnly) return;
    if (!confirm(`Are you sure you want to remove ${name} from receiving automated WhatsApp alerts?`)) return;
    try {
      await deleteAdminWhatsAppRecipient(token, id);
      setSuccess("Recipient removed.");
      loadData(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete recipient.");
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isReadOnly) return;
    setTestingDispatch(true);
    setTestResult(null);
    setError(null);
    setSuccess(null);
    try {
      const params = testParamsCsv.split(",").map((p) => p.trim());
      const res = await sendAdminWhatsAppTest(token, {
        phone: testPhone.trim(),
        template: testTemplate,
        params,
      });
      setTestResult(res);
      if (res.status === "SENT") {
        setSuccess(`Test message dispatched successfully! Message ID: ${res.providerMessageId || "OK"}`);
      } else {
        setError(`Dispatch result: ${res.status}. Note: ${res.errorMessage || "See response details"}`);
      }
      loadData(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Test message dispatch failed.");
    } finally {
      setTestingDispatch(false);
    }
  };

  const handleRetryOutbox = async (outboxId?: number) => {
    if (!token || !outboxId || isReadOnly) return;
    try {
      const res = await retryAdminWhatsAppOutbox(token, outboxId);
      setSuccess(`Retry triggered for outbox #${outboxId}. Result status: ${res.status}`);
      loadData(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Retry attempt failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-sand/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-serif font-bold text-forest">
              WhatsApp Notification Center
            </h1>
          </div>
          <p className="text-xs text-ink-muted mt-1">
            Meta WhatsApp Business Cloud API integration for instant trustee alerts, donor receipts & delivery auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!isReadOnly && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Recipient
            </Button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Connection & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-sand/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-muted font-medium">Meta Cloud Gateway</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                status?.configured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {status?.configured ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> Configured
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" /> Setup Needed
                </>
              )}
            </span>
          </div>
          <p className="text-sm font-bold text-forest">
            {status?.provider || "META_CLOUD"}
          </p>
          <p className="text-[11px] text-ink-muted mt-1 font-mono truncate">
            ID: {status?.phoneNumberId || "Not Set"}
          </p>
        </Card>

        <Card className="p-4 bg-white border-sand/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-muted font-medium">Authorized Admins</span>
            <Users className="w-4 h-4 text-forest" />
          </div>
          <p className="text-2xl font-bold text-forest">
            {status?.activeRecipients ?? 0}
            <span className="text-xs font-normal text-ink-muted ml-1.5">
              / {status?.totalRecipients ?? 0} total
            </span>
          </p>
          <p className="text-[11px] text-ink-muted mt-1">
            Trustees & reviewers receiving live alerts
          </p>
        </Card>

        <Card className="p-4 bg-white border-sand/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-muted font-medium">Approved Templates</span>
            <Layers className="w-4 h-4 text-forest" />
          </div>
          <p className="text-2xl font-bold text-forest">
            {status?.approvedTemplatesCount ?? 6}
            <span className="text-xs font-normal text-ink-muted ml-1.5">
              / {status?.templatesCount ?? 6} active
            </span>
          </p>
          <p className="text-[11px] text-ink-muted mt-1">
            Meta utility categories approved
          </p>
        </Card>

        <Card className="p-4 bg-white border-sand/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-muted font-medium">Delivery Metrics</span>
            <Activity className="w-4 h-4 text-forest" />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div>
              <span className="text-xs font-bold text-emerald-700 block">
                {status?.metrics?.delivered ?? 0}
              </span>
              <span className="text-[10px] text-ink-muted">Delivered</span>
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 block">
                {status?.metrics?.read ?? 0}
              </span>
              <span className="text-[10px] text-ink-muted">Read</span>
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 block">
                {status?.metrics?.queued ?? 0}
              </span>
              <span className="text-[10px] text-ink-muted">Queued</span>
            </div>
            <div>
              <span className="text-xs font-bold text-red-700 block">
                {status?.metrics?.failed ?? 0}
              </span>
              <span className="text-[10px] text-ink-muted">Failed</span>
            </div>
          </div>
          <p className="text-[11px] text-ink-muted mt-2">
            Total dispatches: {status?.metrics?.total ?? 0}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-sand/40 flex items-center gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("recipients")}
          className={`pb-2.5 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === "recipients"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Admin Recipients ({recipients.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-2.5 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === "templates"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Meta Templates ({templates.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === "logs"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Delivery Logs ({logs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("test")}
          className={`pb-2.5 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === "test"
              ? "border-forest text-forest font-bold"
              : "border-transparent text-ink-muted hover:text-ink"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Test Dispatch</span>
        </button>
      </div>

      {/* Tab 1: Admin Recipients */}
      {activeTab === "recipients" && (
        <Card className="bg-white border-sand/40 overflow-hidden">
          <div className="p-4 border-b border-sand/30 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-forest">
                Authorized Secretariat & Trustee WhatsApp Numbers
              </h2>
              <p className="text-[11px] text-ink-muted">
                Each verified phone number receives instantaneous notification upon donation settlement or UTR claim submission.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/15 text-forest uppercase text-[10px] tracking-wider border-b border-sand/30">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">WhatsApp Number</th>
                  <th className="py-3 px-4">Notification Subscriptions</th>
                  <th className="py-3 px-4">Status</th>
                  {!isReadOnly && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {recipients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-ink-muted">
                      No administrator WhatsApp recipients configured yet. Click &quot;Add Recipient&quot; to register your first admin number.
                    </td>
                  </tr>
                ) : (
                  recipients.map((recip) => (
                    <tr key={recip.id} className="hover:bg-sand/5">
                      <td className="py-3 px-4 font-semibold text-forest">
                        {recip.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-sand/30 text-ink font-mono text-[10px]">
                          {recip.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-ink">
                        +{recip.phoneNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {recip.notifyOnDonation && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-200">
                              Donations
                            </span>
                          )}
                          {recip.notifyOnClaim && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-medium border border-blue-200">
                              UTR Claims
                            </span>
                          )}
                          {recip.notifyOnRefund && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 text-[10px] font-medium border border-purple-200">
                              Refunds
                            </span>
                          )}
                          {recip.notifyDailySummary && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-medium border border-amber-200">
                              Daily Summary
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            recip.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {recip.active ? "Active" : "Disabled"}
                        </span>
                      </td>
                      {!isReadOnly && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleRecipient(recip.id)}
                              className={`p-1.5 rounded transition ${
                                recip.active
                                  ? "text-amber-700 hover:bg-amber-50"
                                  : "text-emerald-700 hover:bg-emerald-50"
                              }`}
                              title={recip.active ? "Pause alerts" : "Enable alerts"}
                            >
                              <Sliders className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecipient(recip.id, recip.name)}
                              className="p-1.5 rounded text-red-600 hover:bg-red-50 transition"
                              title="Delete recipient"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 2: Meta Templates */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="p-4 bg-white border-sand/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-forest block">
                    {tpl.templateName}
                  </span>
                  <span className="text-[10px] text-ink-muted font-sans">
                    Key: {tpl.templateKey} • Lang: {tpl.languageCode}
                  </span>
                </div>
                <Badge
                  variant={tpl.status === "APPROVED" ? "forest" : "neutral"}
                  size="sm"
                >
                  {tpl.status}
                </Badge>
              </div>

              <div className="p-3 bg-sand/15 rounded-md text-xs font-sans text-ink leading-relaxed border border-sand/30">
                {tpl.sampleBody || "No body preview available."}
              </div>

              {tpl.parameterMappings && (
                <div className="text-[11px] text-ink-muted">
                  <span className="font-bold text-forest">Parameters: </span>
                  <span className="font-mono text-[10px]">
                    {tpl.parameterMappings}
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Delivery Logs */}
      {activeTab === "logs" && (
        <Card className="bg-white border-sand/40 overflow-hidden">
          <div className="p-4 border-b border-sand/30 flex items-center justify-between">
            <h2 className="text-sm font-bold text-forest">
              Recent WhatsApp Outbound Dispatches & Meta Delivery Receipts
            </h2>
            <span className="text-xs text-ink-muted">
              Showing top {logs.length} events
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/15 text-forest uppercase text-[10px] tracking-wider border-b border-sand/30">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Event Trigger</th>
                  <th className="py-3 px-4">Template</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 font-mono">Meta WAMID</th>
                  {!isReadOnly && <th className="py-3 px-4 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-ink-muted">
                      No message logs recorded yet. Outgoing dispatches will appear here in real time.
                    </td>
                  </tr>
                ) : (
                  logs.map((item) => (
                    <tr key={item.id} className="hover:bg-sand/5">
                      <td className="py-3 px-4 text-ink-muted whitespace-nowrap text-[11px]">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-ink">
                        +{item.recipientPhone}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.recipientType === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.recipientType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-medium text-ink">
                        {item.eventType}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-forest">
                        {item.templateName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === "READ"
                              ? "bg-blue-100 text-blue-800"
                              : item.status === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "SENT"
                              ? "bg-teal-100 text-teal-800"
                              : item.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-ink-muted truncate max-w-[140px]">
                        {item.wamid || "—"}
                      </td>
                      {!isReadOnly && (
                        <td className="py-3 px-4 text-right">
                          {item.outboxId && (item.status === "FAILED" || item.status === "QUEUED") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetryOutbox(item.outboxId)}
                              className="text-[10px] py-0.5 px-2"
                            >
                              Retry
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 4: Interactive Test Dispatch */}
      {activeTab === "test" && (
        <Card className="p-6 bg-white border-sand/40 max-w-2xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-forest">
              Live Meta Cloud API Test Dispatcher
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Send an authenticated utility template message to a test recipient to verify Meta Graph API credentials, template binding, and receipt rendering.
            </p>
          </div>

          <form onSubmit={handleSendTest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Recipient WhatsApp Number <span className="text-red-600">*</span>
              </label>
              <Input
                placeholder="e.g. 919876543210 (with country code)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                required
              />
              <span className="text-[11px] text-ink-muted mt-1 block">
                Standard Indian numbers can be entered as 10 digits or with 91 country code prefix.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Template Configuration <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full text-xs p-2 rounded-md border border-sand/40 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value)}
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.templateName}>
                    {t.templateName} ({t.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest mb-1">
                Positional Parameters (Comma-Separated)
              </label>
              <Input
                placeholder="Param 1, Param 2, Param 3..."
                value={testParamsCsv}
                onChange={(e) => setTestParamsCsv(e.target.value)}
              />
              <span className="text-[11px] text-ink-muted mt-1 block">
                Values will be bound to {"{{1}}, {{2}}, {{3}}"} in order.
              </span>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              disabled={testingDispatch || isReadOnly}
              className="w-full sm:w-auto font-bold"
            >
              {testingDispatch ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending via Meta API...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Dispatch Test WhatsApp Message
                </>
              )}
            </Button>
          </form>

          {testResult && (
            <div className="mt-4 p-4 rounded-lg bg-sand/15 border border-sand/40 space-y-2">
              <span className="text-xs font-bold text-forest block">
                Meta Graph API Raw Response:
              </span>
              <pre className="text-[11px] font-mono bg-white p-3 rounded border border-sand/30 overflow-x-auto text-ink max-h-48">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}

      {/* Add Recipient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-sand/30">
              <h3 className="text-base font-bold text-forest">
                Add Authorized Admin Recipient
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-ink-muted hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecipient} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="e.g. Sri Ramesh Nayak (Trustee)"
                  value={newRecipName}
                  onChange={(e) => setNewRecipName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  WhatsApp Mobile Number <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="e.g. 9876543210 or 919876543210"
                  value={newRecipPhone}
                  onChange={(e) => setNewRecipPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest mb-1">
                  Institutional Role
                </label>
                <select
                  className="w-full text-xs p-2 rounded-md border border-sand/40 bg-white text-ink"
                  value={newRecipRole}
                  onChange={(e) => setNewRecipRole(e.target.value)}
                >
                  <option value="TRUSTEE">TRUSTEE</option>
                  <option value="TREASURER">TREASURER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="FINANCE_OFFICER">FINANCE_OFFICER</option>
                  <option value="AUDITOR">AUDITOR</option>
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <span className="block text-xs font-bold text-forest">
                  Real-Time Notification Subscriptions:
                </span>
                <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotifyDonation}
                    onChange={(e) => setNewNotifyDonation(e.target.checked)}
                    className="rounded border-gray-300 text-forest"
                  />
                  <span>Direct Gateway & Verified Donations</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotifyClaim}
                    onChange={(e) => setNewNotifyClaim(e.target.checked)}
                    className="rounded border-gray-300 text-forest"
                  />
                  <span>Manual SBI Transfer / UPI Claim Submissions</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotifyRefund}
                    onChange={(e) => setNewNotifyRefund(e.target.checked)}
                    className="rounded border-gray-300 text-forest"
                  />
                  <span>Payment Refunds</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newNotifyDaily}
                    onChange={(e) => setNewNotifyDaily(e.target.checked)}
                    className="rounded border-gray-300 text-forest"
                  />
                  <span>Daily Donation Aggregate Summary</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand/30">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  disabled={savingRecip}
                  className="font-bold"
                >
                  {savingRecip ? "Saving..." : "Save Recipient"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
