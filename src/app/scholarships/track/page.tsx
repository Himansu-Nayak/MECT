"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Landmark,
  XCircle,
  Printer,
} from "lucide-react";
import { trackScholarshipApplication, ScholarshipTrackData, TrackingStage } from "@/lib/api";

function ScholarshipTrackContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [applicationNumber, setApplicationNumber] = useState<string>(initialRef);
  const [phone, setPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trackResult, setTrackResult] = useState<ScholarshipTrackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef) {
      performTracking(initialRef);
    }
  }, [initialRef]);

  const performTracking = async (ref: string, phoneNum?: string) => {
    if (!ref.trim()) {
      setError("Please enter your Application Reference Number.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await trackScholarshipApplication(ref.trim(), phoneNum);
      setTrackResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to locate application. Please verify the reference identifier.");
      }
      setTrackResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTracking(applicationNumber, phone);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="warning">Application Intake Complete</Badge>;
      case "UNDER_SCRUTINY":
        return <Badge variant="neutral">Under Document Scrutiny</Badge>;
      case "INSTITUTION_VERIFIED":
        return <Badge variant="success">College Verified</Badge>;
      case "COMMITTEE_APPROVED":
        return <Badge variant="success">Sanction Approved by Board</Badge>;
      case "DISBURSED":
        return <Badge variant="success">Disbursed to College Bursar</Badge>;
      case "ACTION_REQUIRED":
        return <Badge variant="warning">Action Required from Applicant</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Application Not Approved</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0B3B24] text-xs font-bold uppercase tracking-wider mb-3">
          <Clock className="w-3.5 h-3.5" /> Public Application Tracking Console
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
          Track Scholarship Disbursal Status
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          Check real-time status of your higher education financial aid application across scrutiny, institution
          verification, and bank transfer stages.
        </p>
      </div>

      {/* Lookup Card */}
      <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <Input
            label="Application Reference Number"
            placeholder="e.g. MT-SCH-2026-UB87"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value.toUpperCase())}
            required
            helperText="Formed as MT-SCH-2026-XXXX issued upon submission"
          />

          <Input
            label="Registered Mobile Number (Optional Verification)"
            placeholder="10-digit mobile number"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Querying Secretariat Vault..." : "Track Application Progress"}
            <Search className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </Card>

      {/* Result Display */}
      {trackResult && (
        <Card className="max-w-3xl mx-auto p-6 sm:p-10 bg-white shadow-2xl rounded-2xl border-2 border-emerald-500/20 space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block">
                Reference ID: {trackResult.applicationNumber}
              </span>
              <h2 className="text-2xl font-black text-[#0B3B24] mt-1">{trackResult.maskedName}</h2>
              <p className="text-xs text-gray-600 mt-1">
                {trackResult.courseName} • {trackResult.institutionName}
              </p>
            </div>
            <div className="sm:text-right">
              {getStatusBadge(trackResult.status)}
              <span className="block text-[11px] text-gray-500 mt-2">
                Submitted on: {new Date(trackResult.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Status Message Alert */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200 text-sm text-gray-700 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-[#0B3B24] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0B3B24] block">Official Status Update:</span>
              <p className="text-xs text-gray-600 mt-0.5">{trackResult.statusMessage}</p>
            </div>
          </div>

          {/* Action Required Box */}
          {trackResult.status === "ACTION_REQUIRED" && trackResult.actionRequiredNote && (
            <div className="p-5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-sm">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                <AlertCircle className="w-4 h-4" /> Action Required from Applicant
              </span>
              <p className="text-xs leading-relaxed">{trackResult.actionRequiredNote}</p>
            </div>
          )}

          {/* Rejection Box */}
          {trackResult.status === "REJECTED" && trackResult.rejectionReason && (
            <div className="p-5 rounded-xl bg-red-50 border-2 border-red-300 text-red-900 text-sm">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-red-800">
                <XCircle className="w-4 h-4" /> Board Scrutiny Finding
              </span>
              <p className="text-xs leading-relaxed">{trackResult.rejectionReason}</p>
            </div>
          )}

          {/* Disbursal Details */}
          {trackResult.status === "DISBURSED" && (
            <div className="p-5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-sm">
              <span className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Direct Remittance Confirmed
              </span>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Tuition grant funds were electronically remitted directly into the official bank account of{" "}
                <strong>{trackResult.institutionName}</strong>.
              </p>
            </div>
          )}

          {/* Timeline Stages Stepper */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0B3B24] uppercase tracking-wider">
              Verification & Disbursal Progression
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {trackResult.stages.map((st: TrackingStage, idx: number) => {
                const isComplete = st.state === "COMPLETED";
                const isCurrent = st.state === "CURRENT";
                const isRejected = st.state === "REJECTED";
                const isAction = st.state === "ACTION_NEEDED";

                return (
                  <div key={idx} className="relative">
                    {/* Circle icon */}
                    <div
                      className={`absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isComplete
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-[#0B3B24] text-white ring-4 ring-emerald-100"
                          : isRejected
                          ? "bg-red-600 text-white"
                          : isAction
                          ? "bg-amber-500 text-white animate-pulse"
                          : "bg-gray-100 text-gray-400 border border-gray-300"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isRejected ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isCurrent
                              ? "text-[#0B3B24]"
                              : isComplete
                              ? "text-emerald-800"
                              : isRejected
                              ? "text-red-700"
                              : "text-gray-600"
                          }`}
                        >
                          {st.label}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-white border text-gray-600">
                          {st.state}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{st.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Print & Support Actions */}
          <div className="pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="text-gray-500">
              Need assistance? Email secretariat at{" "}
              <a href="mailto:scholarships@mahavirtrust.org" className="text-[#0B3B24] font-semibold underline">
                scholarships@mahavirtrust.org
              </a>
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" /> Print Status Slip
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function ScholarshipTrackPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-16 px-4">
      <Container size="default">
        <Suspense
          fallback={
            <div className="text-center py-20 text-gray-500 text-sm">
              Loading scholarship tracking console...
            </div>
          }
        >
          <ScholarshipTrackContent />
        </Suspense>
      </Container>
    </main>
  );
}
