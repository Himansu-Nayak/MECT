"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  LayoutDashboard,
  ShieldCheck,
  HandHeart,
  FileText,
  Bell,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  CreditCard,
  Send,
  SlidersHorizontal,
  FileEdit,
  Eye,
  AlertTriangle,
  Info,
} from "lucide-react";

// Mock Demo Data completely isolated in-memory (No database mutations)
interface DemoDonation {
  id: string;
  donorName: string;
  amount: number;
  programme: string;
  programmeName: string;
  method: string;
  status: string;
  receiptNumber: string | null;
  sha256: string | null;
  date: string;
  utr?: string;
}

interface DemoAnnouncement {
  id: string;
  text: string;
  active: boolean;
  displayOrder: number;
  link: string;
}

interface DemoCampaign {
  title: string;
  proposedHeight: string;
  ledgerCode: string;
  status: string;
  target: string;
  allocatedBudget: number;
  contributionsReceived: number;
  contributorsCount: number;
}

interface DemoOutboxItem {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  channel: string;
}

interface DemoState {
  activeStep: number;
  totalSteps: number;
  isAutoPlaying: boolean;
  sampleDonations: DemoDonation[];
  sampleAnnouncements: DemoAnnouncement[];
  sampleCampaign: DemoCampaign;
  sampleOutbox: DemoOutboxItem[];
}

const INITIAL_DEMO_STATE: DemoState = {
  activeStep: 1,
  totalSteps: 6,
  isAutoPlaying: false,
  sampleDonations: [
    {
      id: "DEMO-DON-01",
      donorName: "Priyabrata Mohapatra",
      amount: 5000,
      programme: "HANUMAN_MURTI",
      programmeName: "The Grand Hanuman Murti Project",
      method: "Cashfree Online UPI (Disabled in Production)",
      status: "COMPLETED",
      receiptNumber: "REC-2026-DEMO-001",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      date: "2026-11-17",
    },
    {
      id: "DEMO-DON-02",
      donorName: "Ananya Patnaik",
      amount: 2500,
      programme: "EDUCATION_LEARNING",
      programmeName: "Free Education (Proposed Target: Up to 200)",
      method: "NEFT / RTGS (Manual Claim)",
      status: "PENDING_VERIFICATION",
      receiptNumber: null,
      sha256: null,
      date: "2026-11-17",
      utr: "SBIN520261117009",
    },
    {
      id: "DEMO-DON-03",
      donorName: "Dr. Ashok Das",
      amount: 10000,
      programme: "HANUMAN_MURTI",
      programmeName: "The Grand Hanuman Murti Project",
      method: "Online NetBanking",
      status: "COMPLETED",
      receiptNumber: "REC-2026-DEMO-002",
      sha256: "9834876dcfb05cb167a5c24953eba58c4ac89b1de57f6cf091add1f992c51559",
      date: "2026-11-16",
    },
  ],
  sampleAnnouncements: [
    {
      id: "TICK-01",
      text: "A Divine Vision in Progress — Proposed 80–100-Foot Hanuman Murti Project.",
      active: true,
      displayOrder: 1,
      link: "/campaigns/hanuman-murti",
    },
    {
      id: "TICK-02",
      text: "Join Mahaveer Educational & Charitable Trust in Supporting the Proposed Grand Hanuman Murti Initiative.",
      active: true,
      displayOrder: 2,
      link: "/campaigns/hanuman-murti",
    },
    {
      id: "TICK-03",
      text: "Proposed Target — Up to 200 Students, Subject to Formal Board Sanction and Confirmed Funding.",
      active: true,
      displayOrder: 3,
      link: "/programmes#education",
    },
  ],
  sampleCampaign: {
    title: "The Grand Hanuman Murti Project",
    proposedHeight: "80–100 Feet",
    ledgerCode: "HANUMAN_MURTI",
    status: "PROPOSED_PROJECT",
    target: "Feasibility & Preliminary Architectural Design",
    allocatedBudget: 0,
    contributionsReceived: 15000,
    contributorsCount: 2,
  },
  sampleOutbox: [
    {
      id: "OUT-01",
      recipient: "priyabrata@example.com",
      subject: "Official Donation Receipt: REC-2026-DEMO-001 (Mahaveer Trust)",
      status: "DISPATCHED",
      channel: "EMAIL",
    },
    {
      id: "OUT-02",
      recipient: "+91 98536 XXXXX",
      subject: "Receipt notification for ₹5,000 contribution to Hanuman Murti Project",
      status: "DISPATCHED",
      channel: "WHATSAPP",
    },
  ],
};

export default function AdminAutomatedDemoPage() {
  const [state, setState] = useState<DemoState>(INITIAL_DEMO_STATE);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const resetDemo = () => {
    setState({ ...INITIAL_DEMO_STATE });
    setVerificationFeedback(null);
  };

  const handleNextStep = () => {
    setState((prev) => ({
      ...prev,
      activeStep: prev.activeStep < prev.totalSteps ? prev.activeStep + 1 : 1,
    }));
  };

  const handlePrevStep = () => {
    setState((prev) => ({
      ...prev,
      activeStep: prev.activeStep > 1 ? prev.activeStep - 1 : prev.totalSteps,
    }));
  };

  const toggleAutoPlay = () => {
    setState((prev) => ({
      ...prev,
      isAutoPlaying: !prev.isAutoPlaying,
    }));
  };

  // Simulate UTR verification action
  const simulateVerifyUtr = (donationId: string) => {
    setState((prev) => {
      const updated = prev.sampleDonations.map((d) => {
        if (d.id === donationId) {
          return {
            ...d,
            status: "COMPLETED",
            receiptNumber: "REC-2026-DEMO-003",
            sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
          };
        }
        return d;
      });
      return {
        ...prev,
        sampleDonations: updated,
      };
    });
    setVerificationFeedback("Sample bank claim verified! Serialized PDF receipt REC-2026-DEMO-003 generated as numbered receipt (Simulated).");
  };

  // Simulate Ticker toggle
  const simulateToggleTicker = (id: string) => {
    setState((prev) => ({
      ...prev,
      sampleAnnouncements: prev.sampleAnnouncements.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      ),
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Prominent Isolation & Security Banner */}
      <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-xs p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xs bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-700">
            <AlertTriangle className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-950 uppercase tracking-wider text-xs font-mono">
                Safe Demonstration Environment
              </span>
              <Badge variant="gold" size="sm">
                100% In-Memory Simulation
              </Badge>
              <Badge variant="outline" size="sm">
                Zero Production Mutations
              </Badge>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              This guided demonstration illustrates administrative workflows using synthetic data. Real donors, bank accounts, and production records remain completely isolated and inaccessible.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="outline" size="sm" onClick={resetDemo} className="border-amber-400 text-amber-900 hover:bg-amber-100">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Reset Demo</span>
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={toggleAutoPlay} className="bg-forest text-white">
            {state.isAutoPlaying ? <Pause className="w-3.5 h-3.5 mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
            <span>{state.isAutoPlaying ? "Pause Walkthrough" : "Guided Tour"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Walkthrough Stepper Progress Strip */}
      <Card padding="md" className="bg-white border-border-warm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-warm pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta-dark font-bold">
              Automated Walkthrough • Step {state.activeStep} of {state.totalSteps}
            </span>
            <h2 className="font-serif text-xl font-bold text-forest mt-0.5">
              {state.activeStep === 1 && "1. Institutional Administrative Dashboard"}
              {state.activeStep === 2 && "2. Donation Verification & UTR Queue Workflow"}
              {state.activeStep === 3 && "3. The Grand Hanuman Murti Campaign Management"}
              {state.activeStep === 4 && "4. Announcement Ticker & Header Content Controls"}
              {state.activeStep === 5 && "5. Public Records & Statutory Documents Lifecycle"}
              {state.activeStep === 6 && "6. Transactional Notification Outbox & Audit Logs"}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handlePrevStep}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleNextStep}>
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
          {[
            { step: 1, label: "Dashboard" },
            { step: 2, label: "Donations & UTR" },
            { step: 3, label: "Murti Campaign" },
            { step: 4, label: "Ticker Controls" },
            { step: 5, label: "Documents" },
            { step: 6, label: "Outbox & Audit" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setState((prev) => ({ ...prev, activeStep: item.step }))}
              className={`p-2 rounded-xs border text-left transition-colors ${
                state.activeStep === item.step
                  ? "bg-forest text-white border-forest font-bold"
                  : "bg-cream/40 border-border-warm text-ink hover:bg-sand/30"
              }`}
            >
              <div className="text-[10px] opacity-75">Step {item.step}</div>
              <div className="truncate font-medium">{item.label}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* 3. STEP CONTENT WORKFLOW SCREENS */}
      {/* STEP 1: Dashboard Overview */}
      {state.activeStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card padding="md" className="bg-white border-border-warm space-y-1">
              <span className="text-xs text-ink-muted">Simulated Total Donations</span>
              <div className="font-mono text-2xl font-bold text-forest">₹17,500</div>
              <span className="text-[11px] text-emerald-700">3 Sample Contributions</span>
            </Card>
            <Card padding="md" className="bg-white border-border-warm space-y-1">
              <span className="text-xs text-ink-muted">Pending UTR Claims</span>
              <div className="font-mono text-2xl font-bold text-terracotta-dark">
                {state.sampleDonations.filter((d) => d.status === "PENDING_VERIFICATION").length}
              </div>
              <span className="text-[11px] text-amber-800">Requires Statement Verification</span>
            </Card>
            <Card padding="md" className="bg-white border-border-warm space-y-1">
              <span className="text-xs text-ink-muted">Proposed Education Target</span>
              <div className="font-mono text-2xl font-bold text-forest">Up to 200</div>
              <span className="text-[11px] text-ink-muted">Subject to Sanction &amp; Funding</span>
            </Card>
            <Card padding="md" className="bg-white border-border-warm space-y-1">
              <span className="text-xs text-ink-muted">Proposed Murti Campaign</span>
              <div className="font-mono text-2xl font-bold text-forest">80–100 Ft</div>
              <span className="text-[11px] text-sand font-bold">Planning Phase</span>
            </Card>
          </div>

          <Card padding="lg" className="bg-white border-border-warm space-y-4">
            <h3 className="font-serif font-bold text-forest text-lg">
              Administrative Control Architecture
            </h3>
            <p className="text-xs sm:text-sm text-ink-sand leading-relaxed">
              MECT&apos;s administration enforces strict Role-Based Access Control (RBAC):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 bg-cream/40 border border-border-warm rounded-xs space-y-1">
                <span className="font-bold text-forest block">Super Admin &amp; Trustee</span>
                <p className="text-ink-muted leading-relaxed">Full system governance, campaign authorization, policy settings, and statutory filing.</p>
              </div>
              <div className="p-3 bg-cream/40 border border-border-warm rounded-xs space-y-1">
                <span className="font-bold text-forest block">Finance &amp; Verification Officer</span>
                <p className="text-ink-muted leading-relaxed">Bank statement reconciliation, manual UTR approval, duplicate detection, and receipt auditing.</p>
              </div>
              <div className="p-3 bg-cream/40 border border-border-warm rounded-xs space-y-1">
                <span className="font-bold text-forest block">Auditor (Read-Only)</span>
                <p className="text-ink-muted leading-relaxed">Read-only oversight of receipts, numbered ledger records, outbox deliveries, and tamper-proof audit trails.</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 2: Donations & UTR Queue */}
      {state.activeStep === 2 && (
        <Card padding="lg" className="bg-white border-border-warm space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif font-bold text-forest text-lg">
                Simulated Donation &amp; UTR Verification Queue
              </h3>
              <p className="text-xs text-ink-muted">
                Demonstrates how bank transfer claims are reviewed against official statements before issuing PDF receipts.
              </p>
            </div>
            <span className="text-xs font-mono text-ink-muted">Queue Items: {state.sampleDonations.length}</span>
          </div>

          {verificationFeedback && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded-xs text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{verificationFeedback}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border-warm text-ink-muted uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Donation ID</th>
                  <th className="py-2.5 px-3">Donor Name</th>
                  <th className="py-2.5 px-3">Programme</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Channel / UTR</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-warm">
                {state.sampleDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-forest">{d.id}</td>
                    <td className="py-3 px-3 font-medium text-ink">{d.donorName}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-terracotta-dark">{d.programmeName}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-forest">₹{d.amount.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-mono text-ink-muted">
                      {d.utr ? <span className="text-amber-800">UTR: {d.utr}</span> : d.method}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={d.status === "COMPLETED" ? "forest" : "gold"} size="sm">
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {d.status === "PENDING_VERIFICATION" ? (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => simulateVerifyUtr(d.id)}
                          className="text-[11px] py-1 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          <span>Verify UTR</span>
                        </Button>
                      ) : (
                        <span className="font-mono text-[10px] text-ink-muted">{d.receiptNumber}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* STEP 3: Hanuman Murti Campaign Controls */}
      {state.activeStep === 3 && (
        <Card padding="lg" className="bg-white border-border-warm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif font-bold text-forest text-lg">
                The Grand Hanuman Murti Campaign Management
              </h3>
              <p className="text-xs text-ink-muted">
                Administrators can monitor segregated campaign funds, milestone publications, and public disclosures.
              </p>
            </div>
            <Badge variant="gold">Proposed Monument (80–100 Ft)</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-cream/30 border border-border-warm rounded-xs space-y-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase">Ledger Code</span>
              <div className="font-mono font-bold text-forest text-base">{state.sampleCampaign.ledgerCode}</div>
              <p className="text-[11px] text-ink-muted">Strictly segregated project ledger.</p>
            </div>
            <div className="p-4 bg-cream/30 border border-border-warm rounded-xs space-y-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase">Campaign Contributions</span>
              <div className="font-mono font-bold text-forest text-base">₹{state.sampleCampaign.contributionsReceived.toLocaleString("en-IN")}</div>
              <p className="text-[11px] text-ink-muted">{state.sampleCampaign.contributorsCount} Verified Contributors</p>
            </div>
            <div className="p-4 bg-cream/30 border border-border-warm rounded-xs space-y-1">
              <span className="text-[10px] font-mono text-ink-muted uppercase">Current Phase</span>
              <div className="font-bold text-forest text-base">Feasibility Appraisal</div>
              <p className="text-[11px] text-ink-muted">Soil mechanics &amp; structural study.</p>
            </div>
          </div>

          <div className="p-4 bg-forest/5 border border-forest/20 rounded-xs space-y-2 text-xs">
            <span className="font-bold text-forest uppercase tracking-wider text-[11px] block">
              Campaign Operation Safeguards
            </span>
            <ul className="space-y-1.5 text-ink-sand">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>Zero commingling: Contributions are credited solely to HANUMAN_MURTI sub-accounts.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>Truthful public communication: Marked explicitly as &ldquo;Proposed Project&rdquo; on all public views.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                <span>Automatic serialized receipts: Generates instant official PDF receipts upon verified settlement.</span>
              </li>
            </ul>
          </div>
        </Card>
      )}

      {/* STEP 4: Ticker & Announcement Controls */}
      {state.activeStep === 4 && (
        <Card padding="lg" className="bg-white border-border-warm space-y-5">
          <div>
            <h3 className="font-serif font-bold text-forest text-lg">
              Announcement Ticker Management (Live Preview &amp; Toggles)
            </h3>
            <p className="text-xs text-ink-muted">
              Configure and preview the topmost continuous announcement strip displayed across all public routes.
            </p>
          </div>

          <div className="space-y-3">
            {state.sampleAnnouncements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xs border border-border-warm bg-cream/30 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-bold text-forest shrink-0">{item.id}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-ink truncate">{item.text}</div>
                    <div className="text-[10px] text-terracotta-dark font-mono mt-0.5">Link: {item.link}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={item.active ? "forest" : "outline"} size="sm">
                    {item.active ? "PUBLISHED" : "PAUSED"}
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => simulateToggleTicker(item.id)}
                    className="text-[11px] py-1 px-2.5"
                  >
                    {item.active ? "Pause" : "Enable"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sand/30 border border-sand rounded-xs p-3.5 text-xs text-forest space-y-1">
            <strong>Ticker Compliance Policy:</strong> No personal phone numbers, no bank account details, and no physical office addresses are permitted in public announcements per Part 4.6 guidelines.
          </div>
        </Card>
      )}

      {/* STEP 5: Public Documents & Statutory Disclosures */}
      {state.activeStep === 5 && (
        <Card padding="lg" className="bg-white border-border-warm space-y-5">
          <div>
            <h3 className="font-serif font-bold text-forest text-lg">
              Public Documents &amp; Statutory Records Lifecycle
            </h3>
            <p className="text-xs text-ink-muted">
              Documents advance through a strict multi-stage governance lifecycle before publication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-3 bg-cream/50 border border-border-warm rounded-xs">
              <span className="font-bold text-forest block">1. DRAFT</span>
              <p className="text-[10px] text-ink-muted mt-1">Uploaded by Secretariat</p>
            </div>
            <div className="p-3 bg-cream/50 border border-border-warm rounded-xs">
              <span className="font-bold text-forest block">2. UNDER_REVIEW</span>
              <p className="text-[10px] text-ink-muted mt-1">Compliance &amp; Legal check</p>
            </div>
            <div className="p-3 bg-cream/50 border border-border-warm rounded-xs">
              <span className="font-bold text-forest block">3. APPROVED</span>
              <p className="text-[10px] text-ink-muted mt-1">Trustee authorization</p>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs">
              <span className="font-bold text-emerald-900 block">4. PUBLISHED</span>
              <p className="text-[10px] text-emerald-700 mt-1">Live on /reports#library</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xs">
              <span className="font-bold text-amber-900 block">5. SUPERSEDED</span>
              <p className="text-[10px] text-amber-800 mt-1">Preserved with audit link</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-border-warm rounded-xs space-y-2 text-xs">
            <span className="font-bold text-forest uppercase tracking-wider text-[11px] block">
              Cryptographic Integrity Controls
            </span>
            <p className="text-ink-sand leading-relaxed">
              Every published public document is validated for MIME type (<code className="font-mono bg-cream px-1">application/pdf</code>), capped at 10MB, and stamped with an immutable SHA-256 hash to prevent unauthorized document alteration.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 6: Outbox & Audit Logs */}
      {state.activeStep === 6 && (
        <Card padding="lg" className="bg-white border-border-warm space-y-5">
          <div>
            <h3 className="font-serif font-bold text-forest text-lg">
              Notification Outbox &amp; System Audit Logs
            </h3>
            <p className="text-xs text-ink-muted">
              Transactional receipts and system administrative events are preserved in immutable outbox logs.
            </p>
          </div>

          <div className="space-y-3">
            {state.sampleOutbox.map((out) => (
              <div
                key={out.id}
                className="p-3 rounded-xs border border-border-warm bg-cream/30 flex items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-forest">{out.id} &bull; {out.channel}</div>
                  <div className="text-ink-sand font-sans text-xs">{out.subject}</div>
                  <div className="text-[10px] text-ink-muted">Recipient: {out.recipient}</div>
                </div>
                <Badge variant="forest" size="sm">
                  {out.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border-warm flex items-center justify-between">
            <span className="text-xs text-ink-muted">Completed the full administrative walkthrough.</span>
            <Button type="button" variant="primary" size="sm" onClick={resetDemo}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              <span>Restart Demonstration</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
