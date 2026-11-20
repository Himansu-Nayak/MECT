"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { usePortalAuth } from "@/context/PortalAuthContext";
import {
  requestPortalOtp,
  updatePortalProfile,
  verifyPortalOtp,
} from "@/lib/portal-api";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Heart,
  Landmark,
  Loader2,
  Lock,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

const ODISHA_DISTRICTS = [
  "Balangir",
  "Bargarh",
  "Sambalpur",
  "Sonepur (Subarnapur)",
  "Kalahandi",
  "Nuapada",
  "Jharsuguda",
  "Deogarh",
  "Sundargarh",
  "Boudh",
  "Angul",
  "Cuttack",
  "Khordha (Bhubaneswar)",
  "Puri",
  "Ganjam",
  "Koraput",
  "Rayagada",
  "Nabarangpur",
  "Malkangiri",
  "Kandhamal",
  "Nayagarh",
  "Kendrapara",
  "Jagatsinghpur",
  "Jajpur",
  "Bhadrak",
  "Balasore",
  "Mayurbhanj",
  "Keonjhar",
  "Dhenkanal",
  "Gajapati",
  "Other / Outside Odisha",
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const phoneParam = searchParams.get("phone");
  const emailParam = searchParams.get("email");
  const channelParam = searchParams.get("channel");
  const { isAuthenticated, isLoading, setSessionFromOtp } = usePortalAuth();

  // Registration Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(phoneParam?.replace(/\D/g, "").slice(-10) || "");
  const [email, setEmail] = useState(emailParam?.trim() || "");
  const [verificationChannel, setVerificationChannel] = useState<"PHONE" | "EMAIL">(
    channelParam?.toUpperCase() === "EMAIL" ? "EMAIL" : "PHONE"
  );
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Balangir");
  const [district, setDistrict] = useState("Balangir");
  const [stateName, setStateName] = useState("Odisha");
  const [pinCode, setPinCode] = useState("767001");
  const [country] = useState("India");
  const [donorPan, setDonorPan] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // OTP Verification States
  const [step, setStep] = useState<"DETAILS" | "OTP">("DETAILS");
  const [otpCode, setOtpCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/portal/dashboard";
      router.replace(safeNext);
    }
  }, [isLoading, isAuthenticated, nextParam, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const normalizePhone = (raw: string): string => {
    const cleaned = raw.replace(/\D/g, "");
    if (cleaned.length === 10) return `+91${cleaned}`;
    if (cleaned.length === 12 && cleaned.startsWith("91")) return `+${cleaned}`;
    return cleaned.length === 10 ? `+91${cleaned}` : raw.trim();
  };

  const validateDetails = (): boolean => {
    setErrorMsg(null);
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMsg("Please enter your legal full name (at least 3 characters).");
      return false;
    }

    let cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length === 12 && cleanedPhone.startsWith("91")) {
      cleanedPhone = cleanedPhone.slice(2);
    }
    if (cleanedPhone.length !== 10 || !/^[6-9]/.test(cleanedPhone)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return false;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg("Please enter a valid email address for official receipt delivery.");
      return false;
    }

    if (!addressLine.trim() || addressLine.trim().length < 5) {
      setErrorMsg("Please enter your street address or locality (at least 5 characters).");
      return false;
    }

    if (!city.trim()) {
      setErrorMsg("Please enter your city/town.");
      return false;
    }

    if (!district.trim()) {
      setErrorMsg("Please select your district.");
      return false;
    }

    if (!pinCode.trim() || !/^\d{6}$/.test(pinCode.trim())) {
      setErrorMsg("Please enter a valid 6-digit postal PIN code.");
      return false;
    }

    if (donorPan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(donorPan.trim().toUpperCase())) {
      setErrorMsg("Optional PAN must be exactly 10 characters (e.g. ABCDE1234F).");
      return false;
    }

    if (!termsAccepted) {
      setErrorMsg("You must consent to MECT's Terms of Service and Privacy Policy to create an account.");
      return false;
    }

    return true;
  };

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateDetails()) return;

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email.trim().toLowerCase();
    const target = verificationChannel === "EMAIL" ? normalizedEmail : normalizedPhone;

    setRequesting(true);
    setErrorMsg(null);
    try {
      const res = await requestPortalOtp({
        channel: verificationChannel,
        target,
        purpose: "LOGIN",
      });
      setStep("OTP");
      setCooldown(res.cooldownSeconds || 60);
      setStatusMsg(
        verificationChannel === "EMAIL"
          ? `Verification code sent to ${normalizedEmail}. Please check your inbox (and spam folder).`
          : `Verification code sent via SMS to ${normalizedPhone}. Enter the 6-digit code below.`
      );
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send verification code. Please try again.";
      setErrorMsg(msg);
      if (
        verificationChannel === "PHONE" &&
        (msg.toLowerCase().includes("sms") ||
          msg.toLowerCase().includes("unavailable") ||
          msg.toLowerCase().includes("email otp"))
      ) {
        setVerificationChannel("EMAIL");
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleVerifyAndRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    const cleanedOtp = otpCode.trim().replace(/\D/g, "");
    if (cleanedOtp.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    const target = verificationChannel === "EMAIL" ? email.trim().toLowerCase() : normalizePhone(phone);
    setVerifying(true);
    try {
      // 1. Verify OTP and authenticate session
      const auth = await verifyPortalOtp({
        channel: verificationChannel,
        target,
        otpCode: cleanedOtp,
        purpose: "LOGIN",
      });

      // 2. Persist complete supporter profile to backend
      await updatePortalProfile(auth.accessToken, {
        fullName: fullName.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        district: district.trim(),
        state: stateName.trim(),
        pinCode: pinCode.trim(),
        country: country || "India",
        panOptional: donorPan.trim() ? donorPan.trim().toUpperCase() : undefined,
      });

      // 3. Establish active session in context
      await setSessionFromOtp(auth);

      // 4. Redirect to destination or dashboard
      const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/portal/dashboard";
      router.push(safeNext);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to verify code or create profile. Please retry.");
    } finally {
      setVerifying(false);
    }
  };

  const loginHref = nextParam
    ? `/login?next=${encodeURIComponent(nextParam)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&channel=${verificationChannel.toLowerCase()}`
    : `/login?phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&channel=${verificationChannel.toLowerCase()}`;

  return (
    <div className="bg-[#FAF7F2] min-h-[calc(100vh-80px)] py-10 md:py-16">
      <Container className="max-w-5xl">
        <div className="bg-white border border-[#E6E1D8] rounded-xs shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* =========================================================================
              LEFT COLUMN: INSTITUTIONAL MISSION & STATUTORY CREDENTIALS
              ========================================================================= */}
          <div className="lg:col-span-5 bg-forest text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-terracotta bg-white shrink-0 shadow-sm">
                  <Image
                    src="/images/mect-official-emblem.png"
                    alt="Mahaveer Educational & Charitable Trust Emblem"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover scale-[1.06]"
                    priority
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-terracotta-light block">
                    Institutional Register
                  </span>
                  <h2 className="font-serif font-bold text-lg text-white leading-tight">
                    Mahaveer Trust
                  </h2>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-sand block">
                  Join Our Documented Mission
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  Create Your Supporter Account
                </p>
                <p className="text-xs text-cream/80 leading-relaxed font-sans">
                  Registering a supporter account enables automatic linking of your contributions, instant donation payment receipt PDF generation, personal contribution ledgers, and direct updates from our ground interventions across Western Odisha.
                </p>
              </div>

              {/* Verified Trust Pillars */}
              <div className="pt-4 border-t border-white/15 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                  <span className="text-cream/90 leading-relaxed">
                    <strong>Statutory Order:</strong> Historical Section 80G Order URN <span className="font-mono text-sand">AADTM5474FF20241</span>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                  <span className="text-cream/90 leading-relaxed">
                    <strong>Zero Intermediaries:</strong> 100% of voluntary contributions disburse straight to accredited institutions and audited field relief.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-sand shrink-0 mt-0.5" />
                  <span className="text-cream/90 leading-relaxed">
                    <strong>Cryptographic Receipts:</strong> Every receipt bears a verifiable SHA-256 digital signature.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 relative z-10 text-[11px] text-cream/70 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-sand shrink-0" />
              <span>Trust Deed Reg: No. 41042300063 / 2023, Balangir, Odisha.</span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: REGISTRATION FORM
              ========================================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div className="space-y-6 max-w-lg mx-auto w-full">
              
              <div>
                <Badge variant="forest" size="sm" className="mb-2">
                  New Supporter Registration
                </Badge>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Create Your Account
                </h1>
                <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                  Provide your official details for statutory tax accounting and verified donor records.
                </p>
              </div>

              {/* Status / Feedback Notifications */}
              {statusMsg && (
                <div className="p-3.5 rounded-xs bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{statusMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div role="alert" className="p-3.5 rounded-xs bg-red-50 border border-red-200 text-xs text-red-950 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Registration Form Details */}
              {step === "DETAILS" && (
                <form onSubmit={handleRequestOtp} className="space-y-4 pt-1">
                  
                  {/* Full Name & Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="reg-name" className="block text-xs font-bold text-forest mb-1">
                        Full Legal Name <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="reg-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar Patel"
                        required
                        autoFocus
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-mobile" className="block text-xs font-bold text-forest mb-1">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <div className="h-10 px-2.5 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs font-mono font-bold text-xs text-forest flex items-center shrink-0">
                          +91
                        </div>
                        <Input
                          id="reg-mobile"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="9853608113"
                          className="font-mono text-sm font-bold flex-1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Optional PAN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="reg-email" className="block text-xs font-bold text-forest mb-1">
                        Email Address <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh.patel@example.org"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-pan" className="block text-xs font-bold text-forest mb-1">
                        PAN <span className="text-ink-muted font-normal">(Optional for tax reporting)</span>
                      </label>
                      <Input
                        id="reg-pan"
                        value={donorPan}
                        onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        className="font-mono uppercase text-sm"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="reg-address" className="block text-xs font-bold text-forest mb-1">
                      Street Address / Locality <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="reg-address"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="House No., Street Name, Landmark / Village"
                      required
                    />
                  </div>

                  {/* City, District, State, PIN */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label htmlFor="reg-city" className="block text-[11px] font-bold text-forest mb-1">
                        City / Town <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="reg-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Balangir"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-district" className="block text-[11px] font-bold text-forest mb-1">
                        District <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="reg-district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-10 px-2 text-xs bg-white border border-[#D4CEBE] rounded-xs text-forest focus:outline-none focus:ring-2 focus:ring-forest"
                        required
                      >
                        {ODISHA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reg-state" className="block text-[11px] font-bold text-forest mb-1">
                        State <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="reg-state"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Odisha"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-pincode" className="block text-[11px] font-bold text-forest mb-1">
                        PIN Code <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id="reg-pincode"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        placeholder="767001"
                        className="font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Terms Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-xs text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-0.5 accent-forest"
                        required
                      />
                      <span className="leading-relaxed">
                        I confirm that the details provided are accurate for official tax reporting and I accept MECT&apos;s{" "}
                        <Link href="/terms" className="underline font-semibold text-terracotta-dark hover:text-forest">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline font-semibold text-terracotta-dark hover:text-forest">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Verification Channel Preference */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Verification Method
                    </label>
                    <div className="grid grid-cols-2 p-1 bg-[#FAF7F2] border border-[#E6E1D8] rounded-xs text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationChannel("PHONE");
                          setErrorMsg(null);
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xs transition-colors ${
                          verificationChannel === "PHONE"
                            ? "bg-white text-forest shadow-xs font-bold border border-[#E6E1D8]"
                            : "text-ink-muted hover:text-forest"
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Mobile OTP</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationChannel("EMAIL");
                          setErrorMsg(null);
                        }}
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xs transition-colors ${
                          verificationChannel === "EMAIL"
                            ? "bg-white text-forest shadow-xs font-bold border border-[#E6E1D8]"
                            : "text-ink-muted hover:text-forest"
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email OTP</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-ink-muted mt-1.5">
                      {verificationChannel === "PHONE"
                        ? "We will dispatch an SMS verification code to +91 " + (phone || "your mobile number") + "."
                        : "We will dispatch an email verification code to " + (email || "your email address") + "."}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={
                      requesting ||
                      !termsAccepted ||
                      (verificationChannel === "PHONE" ? phone.length < 10 : !email.trim())
                    }
                    className="w-full shadow-sm mt-2"
                  >
                    {requesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Sending Verification Code...</span>
                      </>
                    ) : (
                      <>
                        {verificationChannel === "PHONE" ? (
                          <Phone className="w-4 h-4 mr-2" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        <span>
                          Verify {verificationChannel === "PHONE" ? "Mobile" : "Email"} &amp; Create Account
                        </span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* STEP 2: OTP Verification */}
              {step === "OTP" && (
                <form onSubmit={handleVerifyAndRegister} className="space-y-4 pt-1">
                  <div className="p-3.5 rounded-xs bg-[#FAF7F2] border border-[#E6E1D8] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-forest">
                        Verifying {verificationChannel === "EMAIL" ? "Email Address" : "Mobile Number"}:
                      </span>
                      <span className="font-mono font-bold text-forest">
                        {verificationChannel === "EMAIL" ? email.trim().toLowerCase() : `+91 ${phone}`}
                      </span>
                    </div>
                    <div className="text-ink-muted">
                      Supporter Name: <strong>{fullName}</strong> ({verificationChannel === "EMAIL" ? `+91 ${phone}` : email})
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("DETAILS");
                        setOtpCode("");
                        setErrorMsg(null);
                      }}
                      className="text-xs text-terracotta-dark hover:text-forest font-semibold underline flex items-center gap-1 pt-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Edit Registration Details</span>
                    </button>
                  </div>

                  <div>
                    <label htmlFor="reg-otp-code" className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <Input
                      id="reg-otp-code"
                      ref={otpInputRef}
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOtpCode(val);
                        if (val.length === 6) {
                          setTimeout(() => {
                            const btn = document.getElementById("register-verify-button");
                            btn?.click();
                          }, 100);
                        }
                      }}
                      placeholder="• • • • • •"
                      className="font-mono text-center text-2xl tracking-[0.5em] font-bold h-13"
                      autoFocus
                      required
                    />
                    <p className="text-[11px] text-ink-muted mt-1.5">
                      {verificationChannel === "EMAIL"
                        ? "Check your email inbox or spam folder for the one-time code from MECT."
                        : "Check your SMS messages for the one-time verification password."}
                    </p>
                  </div>

                  <Button
                    id="register-verify-button"
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={verifying || otpCode.length !== 6}
                    className="w-full shadow-sm"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2 stroke-[3]" />
                        <span>Verify &amp; Activate Account</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-ink-muted">Didn&apos;t receive the code?</span>
                    {cooldown > 0 ? (
                      <span className="font-mono text-ink-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-terracotta" />
                        <span>Resend in {cooldown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={requesting}
                        className="text-terracotta-dark font-bold hover:text-forest underline"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Navigation Switch to Login */}
              <div className="pt-6 border-t border-[#E6E1D8] text-center text-xs space-y-2">
                <p className="text-ink-muted">
                  Already have a supporter account?{" "}
                  <Link
                    href={loginHref}
                    className="text-terracotta-dark font-bold hover:text-forest underline ml-1"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

            </div>

            {/* Helpline Assistance */}
            <div className="mt-8 pt-4 border-t border-[#E6E1D8] text-center text-[11px] text-ink-muted">
              Need assistance? Call MECT Secretariat at{" "}
              <a href="tel:+919437123616" className="font-semibold text-terracotta-dark underline hover:text-forest">
                +91 94371 23616
              </a>{" "}
              or email{" "}
              <a href="mailto:mect220@gmail.com" className="font-semibold text-terracotta-dark underline hover:text-forest">
                mect220@gmail.com
              </a>.
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF7F2]">
          <Loader2 className="w-8 h-8 animate-spin text-forest" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
