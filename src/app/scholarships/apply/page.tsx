"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  GraduationCap,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Lock,
  Copy,
  Check,
  Building2,
  User,
  BookOpen,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  submitScholarshipApplication,
  CreateScholarshipPayload,
  DocumentUploadDto,
  ScholarshipApplicationData,
} from "@/lib/api";

const ODISHA_DISTRICTS = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
];

const SCHEMES = [
  { code: "GEN-MERIT-UG", name: "Mahavir Protsahan Undergraduate Scholarship (Degree/Arts/Commerce/Science)" },
  { code: "ENG-AID-DIP", name: "Engineering & Technical Education Grant (B.Tech / Diploma / Polytechnic)" },
  { code: "MED-GRANT-UG", name: "Medical & Healthcare Degree Grant (MBBS / BDS / B.Pharm / Nursing)" },
  { code: "STEM-FELLOW-PG", name: "Mahavir Pratibha STEM & Merit Fellowship" },
  { code: "VOC-DIPLOMA", name: "Vocational & Industrial Training Grant (ITI / Specialized Trades)" },
];

const REQUIRED_DOC_TYPES = [
  { key: "INCOME_CERTIFICATE", label: "Tahasildar Income Certificate", required: true },
  { key: "COLLEGE_FEE_DEMAND", label: "Official College Fee Demand Notice / Structure", required: true },
  { key: "PREVIOUS_MARKSHEET", label: "Last Qualifying Examination Marksheet (+2 / Class 10 / Semester)", required: true },
  { key: "INSTITUTION_ID_OR_BONAFIDE", label: "College Bonafide Certificate or Valid Student ID", required: true },
  { key: "CASTE_OR_CATEGORY_CERT", label: "Category / Caste Certificate (if SC/ST/SEBC/OBC/EWS)", required: false },
];

interface LocalFileItem {
  documentType: string;
  file: File;
  sha256Hash: string;
  isHashing: boolean;
}

export default function ScholarshipApplyPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<ScholarshipApplicationData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaarLastFour: "",
    dateOfBirth: "",
    gender: "",
    category: "",
    district: "",
    pinCode: "",
    permanentAddress: "",
    schemeCode: "GEN-MERIT-UG",
    institutionName: "",
    institutionDistrict: "",
    courseName: "",
    currentYearSemester: "",
    rollOrRegistrationNumber: "",
    annualFamilyIncome: "",
    tahasildarCertNumber: "",
    tahasildarCertIssueDate: "",
    collegeBankName: "",
    collegeBankAccountNumber: "",
    collegeBankIfsc: "",
    collegeAccountHolderName: "",
    tuitionFeeDemanded: "",
    swornDeclaration: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<LocalFileItem[]>([]);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error
    if (stepErrors[name]) {
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Client-side SHA-256 calculation
  const handleFileUpload = async (documentType: string, file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a compressed PDF or image.");
      return;
    }

    const newItem: LocalFileItem = {
      documentType,
      file,
      sha256Hash: "Computing SHA-256 cryptographic hash...",
      isHashing: true,
    };

    setUploadedFiles((prev) => [...prev.filter((f) => f.documentType !== documentType), newItem]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha256Hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      setUploadedFiles((prev) =>
        prev.map((item) =>
          item.documentType === documentType ? { ...item, sha256Hash: sha256Hex, isHashing: false } : item
        )
      );
    } catch {
      setUploadedFiles((prev) =>
        prev.map((item) =>
          item.documentType === documentType
            ? { ...item, sha256Hash: "Hash calculation fallback", isHashing: false }
            : item
        )
      );
    }
  };

  const removeFile = (docType: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.documentType !== docType));
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name as in educational certificates is required";
      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = "Valid email is required";
      if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = "10-digit Indian mobile number is required";
      if (!formData.aadhaarLastFour.trim() || !/^\d{4}$/.test(formData.aadhaarLastFour))
        errs.aadhaarLastFour = "Exactly last 4 digits of Aadhaar";
      if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
      if (!formData.gender) errs.gender = "Gender is required";
      if (!formData.category) errs.category = "Category is required";
      if (!formData.district) errs.district = "Home district in Odisha is required";
      if (!formData.pinCode.trim() || !/^[1-9]\d{5}$/.test(formData.pinCode)) errs.pinCode = "Valid 6-digit PIN code is required";
      if (!formData.permanentAddress.trim()) errs.permanentAddress = "Permanent home address is required";
    }

    if (step === 2) {
      if (!formData.schemeCode) errs.schemeCode = "Please select a scholarship scheme";
      if (!formData.institutionName.trim()) errs.institutionName = "Full college/institution name is required";
      if (!formData.institutionDistrict) errs.institutionDistrict = "College district is required";
      if (!formData.courseName.trim()) errs.courseName = "Course/Degree name is required";
      if (!formData.currentYearSemester.trim()) errs.currentYearSemester = "Current academic year or semester is required";
      if (!formData.rollOrRegistrationNumber.trim())
        errs.rollOrRegistrationNumber = "College roll or university registration number is required";
    }

    if (step === 3) {
      const income = parseFloat(formData.annualFamilyIncome);
      if (isNaN(income) || income < 0) errs.annualFamilyIncome = "Valid annual income is required";
      else if (income > 2500000) errs.annualFamilyIncome = "Income exceeds institutional maximum limit of ₹25,00,000";
      if (!formData.tahasildarCertNumber.trim()) errs.tahasildarCertNumber = "Income certificate number is required";
      if (!formData.tahasildarCertIssueDate) errs.tahasildarCertIssueDate = "Certificate issue date is required";
    }

    if (step === 4) {
      if (!formData.collegeBankName.trim()) errs.collegeBankName = "College institutional bank name is required";
      if (!formData.collegeBankAccountNumber.trim())
        errs.collegeBankAccountNumber = "College institutional bank account number is required";
      if (!formData.collegeBankIfsc.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.collegeBankIfsc.toUpperCase()))
        errs.collegeBankIfsc = "Valid 11-character IFSC code is required";
      if (!formData.collegeAccountHolderName.trim())
        errs.collegeAccountHolderName = "Official account title (e.g. Principal / Comptroller / Registrar) is required";
      const fee = parseFloat(formData.tuitionFeeDemanded);
      if (isNaN(fee) || fee <= 0) errs.tuitionFeeDemanded = "Tuition fee demanded must be greater than zero";
    }

    if (step === 5) {
      // Must have uploaded at least 1 document (income cert or fee structure)
      const hasIncome = uploadedFiles.some((f) => f.documentType === "INCOME_CERTIFICATE");
      const hasFee = uploadedFiles.some((f) => f.documentType === "COLLEGE_FEE_DEMAND");
      if (!hasIncome || !hasFee) {
        errs.documents = "Both Tahasildar Income Certificate and College Fee Structure are mandatory.";
      }
    }

    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!formData.swornDeclaration) {
      setStepErrors({ swornDeclaration: "You must solemnly affirm the statutory institutional declaration." });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const docDtos: DocumentUploadDto[] = uploadedFiles.map((f) => ({
      documentType: f.documentType,
      fileName: f.file.name,
      fileSizeBytes: f.file.size,
      mimeType: f.file.type || "application/octet-stream",
      sha256Hash: f.sha256Hash,
    }));

    const payload: CreateScholarshipPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      aadhaarLastFour: formData.aadhaarLastFour,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      category: formData.category,
      district: formData.district,
      pinCode: formData.pinCode,
      permanentAddress: formData.permanentAddress,
      schemeCode: formData.schemeCode,
      institutionName: formData.institutionName,
      institutionDistrict: formData.institutionDistrict,
      courseName: formData.courseName,
      currentYearSemester: formData.currentYearSemester,
      rollOrRegistrationNumber: formData.rollOrRegistrationNumber,
      annualFamilyIncome: parseFloat(formData.annualFamilyIncome),
      tahasildarCertNumber: formData.tahasildarCertNumber,
      tahasildarCertIssueDate: formData.tahasildarCertIssueDate,
      collegeBankName: formData.collegeBankName,
      collegeBankAccountNumber: formData.collegeBankAccountNumber,
      collegeBankIfsc: formData.collegeBankIfsc.toUpperCase(),
      collegeAccountHolderName: formData.collegeAccountHolderName,
      tuitionFeeDemanded: parseFloat(formData.tuitionFeeDemanded),
      swornDeclaration: formData.swornDeclaration,
      documents: docDtos,
    };

    try {
      const response = await submitScholarshipApplication(payload);
      setSubmittedApplication(response);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred while transmitting application.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefId = () => {
    if (submittedApplication?.applicationNumber) {
      navigator.clipboard.writeText(submittedApplication.applicationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // SUCCESS VIEW
  if (submittedApplication) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] py-16 px-4">
        <Container size="prose">
          <Card className="p-8 md:p-12 text-center border-2 border-[#059669]/30 bg-white shadow-2xl rounded-2xl">
            <div className="w-20 h-20 bg-[#059669]/10 text-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <Badge variant="success" className="mb-4">
              APPLICATION LOGGED & VAULT SECURED
            </Badge>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B3B24] tracking-tight mb-4">
              Scholarship Application Transmitted
            </h1>

            <p className="text-gray-600 max-w-xl mx-auto mb-8 text-base">
              Your application has been logged into the MAHAVIR TRUST secretariat records. All submitted certificates
              have been secured with tamper-evident SHA-256 cryptographic fingerprints.
            </p>

            {/* Reference Box */}
            <div className="bg-[#F8FAFC] border-2 border-dashed border-[#0B3B24]/20 rounded-xl p-6 max-w-lg mx-auto mb-8">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">
                Official Application Reference Number
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl font-mono font-black text-[#0B3B24] tracking-wider">
                  {submittedApplication.applicationNumber}
                </span>
                <button
                  onClick={copyRefId}
                  className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                  title="Copy Reference ID"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Quote this identifier in all correspondence with the Board of Trustees.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/scholarships/track?ref=${submittedApplication.applicationNumber}`} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full">
                  Track Application Status <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/scholarships" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Return to Scholarships
                </Button>
              </Link>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  // MULTI-STEP WIZARD VIEW
  const steps = [
    { number: 1, label: "Personal", icon: User },
    { number: 2, label: "Course & College", icon: BookOpen },
    { number: 3, label: "Means & Income", icon: DollarSign },
    { number: 4, label: "College Bank", icon: Landmark },
    { number: 5, label: "Document Vault", icon: FileText },
    { number: 6, label: "Affirm & Submit", icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6">
      <Container size="default">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B3B24]/10 text-[#0B3B24] text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" /> Direct College Disbursal Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B24] tracking-tight">
            Institutional Higher Education Scholarship Application
          </h1>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Merit-cum-Means financial assistance for underprivileged students across all 30 districts of Odisha.
            Disbursements are remitted directly to accredited college bursars via electronic RTGS/NEFT.
          </p>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = currentStep === s.number;
              const isDone = currentStep > s.number;

              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => s.number < currentStep && setCurrentStep(s.number)}
                  disabled={s.number > currentStep}
                  className={`flex flex-col items-center p-2.5 rounded-xl transition-all border text-center ${
                    isActive
                      ? "bg-[#0B3B24] text-white border-[#0B3B24] shadow-md ring-2 ring-[#0B3B24]/20"
                      : isDone
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer"
                      : "bg-white text-gray-400 border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                      isActive ? "bg-white text-[#0B3B24]" : isDone ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <span className="text-[11px] font-semibold leading-tight line-clamp-1">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Card Form Container */}
        <Card className="max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-2xl border border-gray-200">
          {/* STEP 1: Personal & Demographics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-700" /> Step 1: Personal & Demographic Profile
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Enter student details matching your official Aadhaar and Board examination certificates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name (As per Certificates)"
                  name="fullName"
                  placeholder="e.g. Priyabrata Nayak"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={stepErrors.fullName}
                  required
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  error={stepErrors.dateOfBirth}
                  required
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  error={stepErrors.gender}
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Transgender / Other", label: "Transgender / Other" },
                  ]}
                  required
                />
                <Select
                  label="Social Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  error={stepErrors.category}
                  options={[
                    { value: "", label: "Select Social Category" },
                    { value: "General / EWS", label: "General / Economically Weaker Section (EWS)" },
                    { value: "SEBC", label: "Socially and Educationally Backward Classes (SEBC)" },
                    { value: "OBC", label: "Other Backward Classes (OBC)" },
                    { value: "SC", label: "Scheduled Caste (SC)" },
                    { value: "ST", label: "Scheduled Tribe (ST)" },
                  ]}
                  required
                />
                <Input
                  label="Primary Mobile Number"
                  name="phone"
                  placeholder="10-digit Indian mobile number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={stepErrors.phone}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={stepErrors.email}
                  required
                />
                <Input
                  label="Aadhaar Last 4 Digits"
                  name="aadhaarLastFour"
                  placeholder="XXXX (Only last 4 digits)"
                  maxLength={4}
                  value={formData.aadhaarLastFour}
                  onChange={handleInputChange}
                  error={stepErrors.aadhaarLastFour}
                  required
                />
                <Select
                  label="Native District (Odisha)"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  error={stepErrors.district}
                  options={[
                    { value: "", label: "Select Native District (Odisha)" },
                    ...ODISHA_DISTRICTS.map((d) => ({ value: d, label: d })),
                  ]}
                  required
                />
                <Input
                  label="Postal PIN Code"
                  name="pinCode"
                  placeholder="6-digit PIN code"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  error={stepErrors.pinCode}
                  required
                />
              </div>

              <Textarea
                label="Permanent Residential Address"
                name="permanentAddress"
                rows={3}
                placeholder="Village / Street, Post Office, Police Station, District"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                error={stepErrors.permanentAddress}
                required
              />
            </div>
          )}

          {/* STEP 2: Course & Institution Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-700" /> Step 2: Course & College Institutional Enrolment
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Specify your enrolled college and academic programme. Disbursals are verified with these details.
                </p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Scholarship Scheme"
                  name="schemeCode"
                  value={formData.schemeCode}
                  onChange={handleInputChange}
                  error={stepErrors.schemeCode}
                  options={SCHEMES.map((s) => ({ value: s.code, label: s.name }))}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="College / Institution Name"
                    name="institutionName"
                    placeholder="Full recognized college name"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    error={stepErrors.institutionName}
                    required
                  />
                  <Select
                    label="College District"
                    name="institutionDistrict"
                    value={formData.institutionDistrict}
                    onChange={handleInputChange}
                    error={stepErrors.institutionDistrict}
                    options={[
                      { value: "", label: "Select College District" },
                      ...ODISHA_DISTRICTS.map((d) => ({ value: d, label: d })),
                    ]}
                    required
                  />
                  <Input
                    label="Course / Degree Name"
                    name="courseName"
                    placeholder="e.g. B.Tech Electrical, B.Sc Chemistry, Diploma Mechanical"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    error={stepErrors.courseName}
                    required
                  />
                  <Input
                    label="Current Year / Semester"
                    name="currentYearSemester"
                    placeholder="e.g. 2nd Year / 3rd Semester"
                    value={formData.currentYearSemester}
                    onChange={handleInputChange}
                    error={stepErrors.currentYearSemester}
                    required
                  />
                  <Input
                    label="College Roll / Univ Reg Number"
                    name="rollOrRegistrationNumber"
                    placeholder="Roll No or BPUT/CHSE/University Registration"
                    value={formData.rollOrRegistrationNumber}
                    onChange={handleInputChange}
                    error={stepErrors.rollOrRegistrationNumber}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Means & Income */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-700" /> Step 3: Socio-Economic Need & Means Appraisal
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Grants are targeted towards low-income households. Details must align with your Revenue Certificate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Total Annual Household Income (₹)"
                  name="annualFamilyIncome"
                  type="number"
                  placeholder="e.g. 120000"
                  value={formData.annualFamilyIncome}
                  onChange={handleInputChange}
                  error={stepErrors.annualFamilyIncome}
                  helperText="Maximum income threshold under Trust guidelines is ₹2,50,000/yr"
                  required
                />
                <Input
                  label="Tahasildar Certificate Reference Number"
                  name="tahasildarCertNumber"
                  placeholder="e.g. INC-OD-2026-98721"
                  value={formData.tahasildarCertNumber}
                  onChange={handleInputChange}
                  error={stepErrors.tahasildarCertNumber}
                  required
                />
                <Input
                  label="Certificate Issue Date"
                  name="tahasildarCertIssueDate"
                  type="date"
                  value={formData.tahasildarCertIssueDate}
                  onChange={handleInputChange}
                  error={stepErrors.tahasildarCertIssueDate}
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Statutory Integrity Advisory:</span> The Trust secretariat verifies
                  income certificate references via Odisha e-District portal or local Tehsil scrutiny. Submission of
                  forged or tampered revenue certificates results in permanent disqualification.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: College Institutional Bank Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-700" /> Step 4: Direct College Institutional Bank Details
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Zero-Cash-Handout Principle:</strong> All sanctioned tuition grants are disbursed strictly
                  into the institutional bank account of the college bursar/registrar. Personal student accounts are not permitted.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="College Bank Name"
                  name="collegeBankName"
                  placeholder="e.g. State Bank of India, Canara Bank"
                  value={formData.collegeBankName}
                  onChange={handleInputChange}
                  error={stepErrors.collegeBankName}
                  required
                />
                <Input
                  label="College Bank IFSC Code"
                  name="collegeBankIfsc"
                  placeholder="e.g. SBIN0001023"
                  maxLength={11}
                  value={formData.collegeBankIfsc}
                  onChange={handleInputChange}
                  error={stepErrors.collegeBankIfsc}
                  required
                />
                <Input
                  label="College Bank Account Number"
                  name="collegeBankAccountNumber"
                  placeholder="Institutional account number"
                  value={formData.collegeBankAccountNumber}
                  onChange={handleInputChange}
                  error={stepErrors.collegeBankAccountNumber}
                  required
                />
                <Input
                  label="Account Holder Official Title"
                  name="collegeAccountHolderName"
                  placeholder="e.g. Principal / Comptroller / Registrar"
                  value={formData.collegeAccountHolderName}
                  onChange={handleInputChange}
                  error={stepErrors.collegeAccountHolderName}
                  required
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Annual Tuition Fee Demanded by College (₹)"
                    name="tuitionFeeDemanded"
                    type="number"
                    placeholder="e.g. 45000"
                    value={formData.tuitionFeeDemanded}
                    onChange={handleInputChange}
                    error={stepErrors.tuitionFeeDemanded}
                    helperText="Specify the exact tuition fee demanded in the official fee demand notice"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Document Upload Vault with SHA-256 Hashing */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700" /> Step 5: Document Vault & Cryptographic Verification
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Upload clear PDF/JPEG copies (max 5MB each). Each document is fingerprinted in your browser with a
                  SHA-256 cryptographic hash to ensure audit integrity.
                </p>
              </div>

              {stepErrors.documents && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {stepErrors.documents}
                </div>
              )}

              <div className="space-y-4">
                {REQUIRED_DOC_TYPES.map((docDef) => {
                  const uploaded = uploadedFiles.find((f) => f.documentType === docDef.key);

                  return (
                    <div
                      key={docDef.key}
                      className={`p-4 rounded-xl border transition-all ${
                        uploaded ? "bg-emerald-50/50 border-emerald-300" : "bg-gray-50/50 border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{docDef.label}</span>
                            {docDef.required && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                Mandatory
                              </span>
                            )}
                          </div>
                          {uploaded ? (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {uploaded.file.name} (
                                {(uploaded.file.size / 1024).toFixed(1)} KB)
                              </div>
                              <div className="text-[11px] font-mono text-gray-500 break-all bg-white px-2 py-1 rounded border border-gray-200">
                                SHA-256: {uploaded.sha256Hash}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG under 5MB</p>
                          )}
                        </div>

                        <div>
                          {uploaded ? (
                            <button
                              type="button"
                              onClick={() => removeFile(docDef.key)}
                              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50"
                            >
                              Replace File
                            </button>
                          ) : (
                            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#0B3B24]/30 hover:border-[#0B3B24] text-xs font-bold text-[#0B3B24] cursor-pointer shadow-sm hover:bg-emerald-50/50 transition-all">
                              <Upload className="w-4 h-4" /> Choose File
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(docDef.key, e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Review, Sworn Declaration & Submission */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold text-[#0B3B24] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" /> Step 6: Review & Sworn Statutory Declaration
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Confirm all entered data before final submission to the MAHAVIR TRUST scholarship board.
                </p>
              </div>

              {/* Review Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Applicant</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.fullName}</span>
                  <span className="block text-gray-600">{formData.phone} • {formData.email}</span>
                  <span className="block text-gray-600">{formData.district}, Odisha (PIN: {formData.pinCode})</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Course & Enrolment</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.courseName}</span>
                  <span className="block text-gray-600">{formData.institutionName} ({formData.institutionDistrict})</span>
                  <span className="block text-gray-600">Roll/Reg: {formData.rollOrRegistrationNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">Household Income</span>
                  <span className="text-sm font-semibold text-gray-900">₹{Number(formData.annualFamilyIncome).toLocaleString("en-IN")}/yr</span>
                  <span className="block text-gray-600">Cert: {formData.tahasildarCertNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 uppercase tracking-wider block">College Bank (Disbursal)</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.collegeBankName}</span>
                  <span className="block text-gray-600">A/C: {formData.collegeBankAccountNumber} (IFSC: {formData.collegeBankIfsc})</span>
                  <span className="block text-emerald-700 font-bold">Tuition Demanded: ₹{Number(formData.tuitionFeeDemanded).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Uploaded Documents Fingerprint Table */}
              <div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Cryptographically Fingerprinted Documents ({uploadedFiles.length})
                </span>
                <div className="space-y-1.5">
                  {uploadedFiles.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-gray-900">{doc.documentType}</span>
                        <span className="text-gray-500">({doc.file.name})</span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500 hidden sm:inline">{doc.sha256Hash.substring(0, 16)}...</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sworn Declaration Checkbox */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border-2 border-emerald-300">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="swornDeclaration"
                    checked={formData.swornDeclaration}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-gray-800 leading-relaxed">
                    <strong>Statutory Institutional Declaration:</strong> I solemnly affirm that all particulars, income
                    statements, and uploaded certificates are authentic and truthful. I recognize that all sanctioned
                    scholarship amounts will be transferred directly and exclusively into the institutional bank account
                    of my college/university, and that any falsification will lead to immediate cancellation and recovery.
                  </span>
                </label>
                {stepErrors.swornDeclaration && (
                  <p className="text-xs text-red-600 font-semibold mt-2">{stepErrors.swornDeclaration}</p>
                )}
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="secondary" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <Button type="button" variant="primary" onClick={handleNext}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Transmitting Application...</>
                ) : (
                  <>
                    Submit Scholarship Application <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </Container>
    </main>
  );
}
