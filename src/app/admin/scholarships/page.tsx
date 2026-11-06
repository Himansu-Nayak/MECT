"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  getAdminScholarships,
  updateAdminScholarshipStatus,
  ScholarshipApplicationData,
} from "@/lib/api";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Landmark,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const ODISHA_DISTRICTS = [
  "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh",
  "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
  "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj",
  "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_SCRUTINY", label: "Under Scrutiny" },
  { value: "INSTITUTION_VERIFIED", label: "Institution Verified" },
  { value: "COMMITTEE_APPROVED", label: "Committee Approved" },
  { value: "DISBURSED", label: "Disbursed" },
  { value: "ACTION_REQUIRED", label: "Action Required" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminScholarshipsPage() {
  const { token } = useAdminAuth();
  const [scholarships, setScholarships] = useState<ScholarshipApplicationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Inspection Modal
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplicationData | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>("");
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [actionNote, setActionNote] = useState<string>("");
  const [disbursalRef, setDisbursalRef] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchScholarships = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAdminScholarships(token, statusFilter || undefined, districtFilter || undefined);
      setScholarships(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch scholarship records.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, districtFilter]);

  useEffect(() => {
    let isCancelled = false;
    if (!token) return;

    getAdminScholarships(token, statusFilter || undefined, districtFilter || undefined)
      .then((data) => {
        if (!isCancelled) {
          setScholarships(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to fetch scholarship records.");
          }
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token, statusFilter, districtFilter]);

  const openAppDetails = (app: ScholarshipApplicationData) => {
    setSelectedApp(app);
    setTargetStatus(app.status);
    setRejectionReason(app.rejectionReason || "");
    setActionNote(app.actionRequiredNote || "");
    setDisbursalRef(app.disbursalTransactionRef || "");
    setUpdateError(null);
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !token) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updated = await updateAdminScholarshipStatus(token, selectedApp.id, {
        status: targetStatus,
        rejectionReason: targetStatus === "REJECTED" ? rejectionReason : undefined,
        actionRequiredNote: targetStatus === "ACTION_REQUIRED" ? actionNote : undefined,
        disbursalTransactionRef: targetStatus === "DISBURSED" ? disbursalRef : undefined,
        expectedVersion: selectedApp.version,
      });

      // Update state
      setScholarships((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedApp(updated);
      alert(`Application ${updated.applicationNumber} updated successfully to ${updated.status}.`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUpdateError(err.message);
      } else {
        setUpdateError("Failed to update status. Please reload.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredList = scholarships.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.applicationNumber.toLowerCase().includes(q) ||
      s.fullName.toLowerCase().includes(q) ||
      s.institutionName.toLowerCase().includes(q) ||
      s.courseName.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge variant="warning">Submitted</Badge>;
      case "UNDER_SCRUTINY":
        return <Badge variant="neutral">Under Scrutiny</Badge>;
      case "INSTITUTION_VERIFIED":
        return <Badge variant="success">College Verified</Badge>;
      case "COMMITTEE_APPROVED":
        return <Badge variant="success">Committee Approved</Badge>;
      case "DISBURSED":
        return <Badge variant="success">Disbursed</Badge>;
      case "ACTION_REQUIRED":
        return <Badge variant="warning">Action Required</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B3B24]">Scholarship Scrutiny & Approval Workbench</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review student means certificates, verify college institutional demand, and execute direct bursar disbursals.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchScholarships} disabled={isLoading}>
          Refresh Table
        </Button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Ref ID, Roll, College..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">District Filter</label>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">All Odisha Districts</option>
              {ODISHA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table Container */}
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Ref Number</th>
                <th className="p-3.5">Applicant</th>
                <th className="p-3.5">Course & College</th>
                <th className="p-3.5">District</th>
                <th className="p-3.5">Fee Demanded</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Loading scholarship records from database...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No scholarship applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0B3B24]">{app.applicationNumber}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-gray-900">{app.fullName}</div>
                      <div className="text-[11px] text-gray-500">{app.phone}</div>
                    </td>
                    <td className="p-3.5 max-w-[200px]">
                      <div className="font-medium text-gray-900 truncate">{app.courseName}</div>
                      <div className="text-[11px] text-gray-500 truncate">{app.institutionName}</div>
                    </td>
                    <td className="p-3.5 text-gray-700">{app.district}</td>
                    <td className="p-3.5 font-bold text-gray-900">₹{Number(app.tuitionFeeDemanded).toLocaleString("en-IN")}</td>
                    <td className="p-3.5">{getStatusBadge(app.status)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAppDetails(app)}
                        className="px-2.5 py-1.5 rounded-lg border border-emerald-700/30 text-[#0B3B24] hover:bg-emerald-50 font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail & Status Progression Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">
                  Reference: {selectedApp.applicationNumber}
                </span>
                <h2 className="text-xl font-black text-[#0B3B24]">{selectedApp.fullName}</h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Student Particulars</span>
                  <p className="mt-1 font-semibold text-gray-900">
                    Aadhaar: **** **** {selectedApp.aadhaarLastFour} • DOB: {selectedApp.dateOfBirth}
                  </p>
                  <p className="text-gray-600">{selectedApp.gender} • {selectedApp.category}</p>
                  <p className="text-gray-600">{selectedApp.phone} • {selectedApp.email}</p>
                  <p className="text-gray-600 mt-1">{selectedApp.permanentAddress}, {selectedApp.district} ({selectedApp.pinCode})</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">College & Disbursal Demand</span>
                  <p className="mt-1 font-semibold text-gray-900">{selectedApp.courseName} ({selectedApp.currentYearSemester})</p>
                  <p className="text-gray-600">{selectedApp.institutionName} ({selectedApp.institutionDistrict})</p>
                  <p className="text-gray-600">Roll/Reg: {selectedApp.rollOrRegistrationNumber}</p>
                  <p className="text-emerald-700 font-bold mt-1">
                    Tuition Fee Demanded: ₹{Number(selectedApp.tuitionFeeDemanded).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Income & Tehsil Scrutiny</span>
                  <p className="mt-1 font-semibold text-gray-900">
                    Income: ₹{Number(selectedApp.annualFamilyIncome).toLocaleString("en-IN")}/yr
                  </p>
                  <p className="text-gray-600">Certificate No: {selectedApp.tahasildarCertNumber}</p>
                  <p className="text-gray-600">Issue Date: {selectedApp.tahasildarCertIssueDate}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Direct College Institutional Bank</span>
                  <p className="mt-1 font-semibold text-gray-900">{selectedApp.collegeBankName}</p>
                  <p className="text-gray-600">A/C: {selectedApp.collegeBankAccountNumber}</p>
                  <p className="text-gray-600">IFSC: {selectedApp.collegeBankIfsc}</p>
                  <p className="text-gray-600">Account Title: {selectedApp.collegeAccountHolderName}</p>
                </div>
              </div>

              {/* Uploaded Documents Vault */}
              <div>
                <span className="font-bold text-[#0B3B24] uppercase tracking-wider block mb-2">
                  Document Vault Cryptographic Fingerprints ({selectedApp.documents?.length || 0})
                </span>
                <div className="space-y-2">
                  {selectedApp.documents?.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1">
                      <div className="flex items-center justify-between font-semibold text-gray-900">
                        <span className="flex items-center gap-1.5">
                          <FileCheck2 className="w-4 h-4 text-emerald-600" /> {doc.documentType} ({doc.fileName})
                        </span>
                        <span className="text-[10px] text-gray-500">{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="font-mono text-[10px] text-gray-500 break-all bg-white p-1.5 rounded border border-gray-200">
                        SHA-256: {doc.sha256Hash}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Progression Form */}
              <form onSubmit={handleStatusUpdate} className="pt-4 border-t border-gray-200 space-y-4">
                <span className="font-bold text-[#0B3B24] uppercase tracking-wider block">
                  Executive Status Progression
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Target Status
                    </label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="UNDER_SCRUTINY">UNDER_SCRUTINY</option>
                      <option value="INSTITUTION_VERIFIED">INSTITUTION_VERIFIED</option>
                      <option value="COMMITTEE_APPROVED">COMMITTEE_APPROVED</option>
                      <option value="DISBURSED">DISBURSED</option>
                      <option value="ACTION_REQUIRED">ACTION_REQUIRED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  {targetStatus === "DISBURSED" && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        RTGS / NEFT Disbursal Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RTGS-SBI-20261103-99128"
                        required
                        value={disbursalRef}
                        onChange={(e) => setDisbursalRef(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {targetStatus === "ACTION_REQUIRED" && (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Required Action Note for Applicant
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Please re-upload a clear copy of your Tehsil Income Certificate."
                        value={actionNote}
                        onChange={(e) => setActionNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {targetStatus === "REJECTED" && (
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Rejection Finding / Ground
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Annual household income exceeds statutory threshold."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>

                {updateError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {updateError}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setSelectedApp(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={isUpdating}>
                    {isUpdating ? "Saving Transition..." : "Commit Status Transition"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
