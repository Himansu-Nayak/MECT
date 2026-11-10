"use client";

import React, { Suspense, useEffect, useState } from "react";
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
  requestPortalDeletion,
  updatePortalPreferences,
  updatePortalProfile,
  verifyPortalContactChange,
} from "@/lib/portal-api";
import {
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  ShieldCheck,
  Bell,
  MessageSquare,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";

function PortalProfileInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "1";
  const { isAuthenticated, isLoading, token, dashboard, refreshDashboard, logout } = usePortalAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/login?next=/portal/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !dashboard || !token) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
        Loading your MECT Supporter Profile...
      </div>
    );
  }

  const formKey = `${dashboard.account.userUuid}-${dashboard.account.profile?.updatedAt || "new"}-${dashboard.account.preferences?.whatsappConsentUpdatedAt || "pref"}`;

  return (
    <PortalProfileEditor
      key={formKey}
      isWelcome={isWelcome}
      token={token}
      dashboard={dashboard}
      refreshDashboard={refreshDashboard}
      logout={logout}
    />
  );
}

function PortalProfileEditor({
  isWelcome,
  token,
  dashboard,
  refreshDashboard,
  logout,
}: {
  isWelcome: boolean;
  token: string;
  dashboard: NonNullable<ReturnType<typeof usePortalAuth>["dashboard"]>;
  refreshDashboard: () => Promise<void>;
  logout: () => Promise<void>;
}) {
  const router = useRouter();
  const p = dashboard.account.profile;
  const prefs = dashboard.account.preferences;
  const wasIncomplete = !dashboard.account.profileCompleted;

  // Profile fields initialized cleanly from server state without useEffect setState
  const [fullName, setFullName] = useState(p?.fullName || "");
  const [addressLine, setAddressLine] = useState(p?.addressLine || "");
  const [city, setCity] = useState(p?.city || "");
  const [stateName, setStateName] = useState(p?.state || "");
  const [pinCode, setPinCode] = useState(p?.pinCode || "");
  const [country, setCountry] = useState(p?.country || "India");
  const [dateOfBirth, setDateOfBirth] = useState(p?.dateOfBirth || "");
  const [preferredLanguage, setPreferredLanguage] = useState(p?.preferredLanguage || "en");
  const [panOptional, setPanOptional] = useState("");

  // Progressive disclosure toggles
  const [showOptionalDetails, setShowOptionalDetails] = useState(
    Boolean(p?.dateOfBirth || p?.panProvided)
  );
  const [showContactChange, setShowContactChange] = useState(false);
  const [showDeletionPanel, setShowDeletionPanel] = useState(false);

  // Preferences & WhatsApp Consent
  const [emailReceiptsEnabled, setEmailReceiptsEnabled] = useState(prefs?.emailReceiptsEnabled ?? true);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(prefs?.emailUpdatesEnabled ?? false);
  const [whatsappOptIn, setWhatsappOptIn] = useState(prefs?.whatsappOptIn ?? false);
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState(
    prefs?.whatsappPhoneNumber || dashboard.account.primaryPhone || ""
  );

  // Contact verification change
  const [changeChannel, setChangeChannel] = useState<"EMAIL" | "PHONE">("EMAIL");
  const [changeTarget, setChangeTarget] = useState("");
  const [changeOtp, setChangeOtp] = useState("");
  const [changeStep, setChangeStep] = useState<"IDLE" | "OTP_SENT">("IDLE");

  // Deletion request
  const [deletionReason, setDeletionReason] = useState("");

  // Feedback
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingDelete, setSavingDelete] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    setSavingProfile(true);
    try {
      await updatePortalProfile(token, {
        fullName: fullName.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pinCode: pinCode.trim(),
        country: country.trim() || "India",
        dateOfBirth: dateOfBirth || null,
        preferredLanguage,
        panOptional: panOptional.trim() || undefined,
      });
      setPanOptional("");
      await refreshDashboard();

      if (wasIncomplete) {
        router.push("/portal/welcome?completed=1");
        return;
      }

      setStatusMsg(
        `Thank you, ${fullName.trim().split(" ")[0]} — your supporter profile has been saved.`
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not update your profile right now.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);

    if (whatsappOptIn && !whatsappPhoneNumber.trim()) {
      setErrorMsg("Please enter a valid WhatsApp mobile number with country code.");
      return;
    }

    setSavingPrefs(true);
    try {
      await updatePortalPreferences(token, {
        emailReceiptsEnabled,
        emailUpdatesEnabled,
        whatsappOptIn,
        whatsappPhoneNumber: whatsappPhoneNumber.trim() || undefined,
        consentVersion: "v1.0",
      });
      await refreshDashboard();
      setStatusMsg(
        whatsappOptIn
          ? "Communication preferences saved. Your optional WhatsApp consent has been recorded."
          : "Communication preferences saved. WhatsApp messages remain opted out."
      );
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save notification preferences.");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleRequestContactChangeOtp = async () => {
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    if (!changeTarget.trim()) {
      setErrorMsg("Please enter the new email address or phone number you would like to verify.");
      return;
    }
    setSavingContact(true);
    try {
      await requestPortalOtp(
        {
          channel: changeChannel,
          target: changeTarget.trim(),
          purpose: "CONTACT_CHANGE",
        },
        token
      );
      setChangeStep("OTP_SENT");
      setStatusMsg("Verification code sent successfully to your new contact.");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "We couldn't send your verification code right now. Please try again."
      );
    } finally {
      setSavingContact(false);
    }
  };

  const handleVerifyContactChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    setSavingContact(true);
    try {
      await verifyPortalContactChange(token, {
        channel: changeChannel,
        target: changeTarget.trim(),
        otpCode: changeOtp.trim(),
        purpose: "CONTACT_CHANGE",
      });
      setChangeTarget("");
      setChangeOtp("");
      setChangeStep("IDLE");
      setShowContactChange(false);
      await refreshDashboard();
      setStatusMsg("New verified contact saved and attached to your account.");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "That verification code could not be confirmed.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeletionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setErrorMsg(null);
    setStatusMsg(null);
    setSavingDelete(true);
    try {
      const res = await requestPortalDeletion(
        token,
        deletionReason.trim() || "User requested portal profile deletion"
      );
      await refreshDashboard();
      setStatusMsg(res.message);
      setDeletionReason("");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Could not record deletion request.");
    } finally {
      setSavingDelete(false);
    }
  };

  const { account } = dashboard;
  const firstName = account.profile?.fullName?.split(" ")[0] || "Supporter";

  return (
    <div className="bg-cream min-h-screen py-10 md:py-14">
      <Container className="max-w-5xl space-y-6">
        {/* Institutional Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-xs border border-border-warm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-terracotta bg-white shrink-0">
              <Image
                src="/images/mect-official-emblem.png"
                alt="Mahaveer Educational & Charitable Trust Official Emblem"
                width={44}
                height={44}
                className="w-full h-full object-cover scale-[1.06]"
              />
            </div>
            <div className="space-y-0.5">
              <Link
                href="/portal/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-dark hover:text-forest"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back to My Dashboard</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-forest">
                {wasIncomplete ? "Complete Your MECT Profile" : "Profile & Preferences"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={account.isDonor ? "terracotta" : "forest"} size="sm">
              {account.isDonor ? "Verified Donor" : "Community Member"}
            </Badge>
            <Button type="button" variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>

        {(isWelcome || wasIncomplete) && (
          <Card padding="md" className="bg-sand-light border border-terracotta/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-ink space-y-1">
              <p className="font-bold text-forest text-sm">
                You&apos;re verified! Add your details below, {firstName}.
              </p>
              <p className="text-ink-sand leading-relaxed">
                Complete the required name and mailing address fields so your MECT supporter account is ready. Optional tax and extra contact fields stay tucked away unless you choose to add them.
              </p>
            </div>
          </Card>
        )}

        {statusMsg && (
          <div
            role="status"
            className="p-3.5 rounded-xs bg-sage/45 border border-forest/30 flex items-start gap-2.5 text-xs text-forest font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="p-3.5 rounded-xs bg-terracotta/10 border border-terracotta/40 flex items-start gap-2.5 text-xs text-terracotta-dark font-semibold"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Primary Profile Form: Organised cleanly into 1. Personal Details & 2. Mailing Address */}
          <Card padding="lg" className="lg:col-span-7 bg-white border border-border-warm space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-warm pb-2.5">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-terracotta" aria-hidden="true" />
                    <h2 className="text-base font-serif font-bold text-forest">
                      1. Personal Details
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-sand">Required fields marked *</span>
                </div>

                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />

                {/* Verified Contacts Display Read-only */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xs bg-cream/70 border border-border-warm text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-sand flex items-center gap-1">
                      <Mail className="w-3 h-3 text-terracotta" aria-hidden="true" />
                      Verified Email
                    </span>
                    <p className="font-medium text-forest truncate">
                      {account.primaryEmail || "Not linked yet"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xs bg-cream/70 border border-border-warm text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-sand flex items-center gap-1">
                      <Phone className="w-3 h-3 text-forest" aria-hidden="true" />
                      Verified Phone
                    </span>
                    <p className="font-medium text-forest truncate">
                      {account.primaryPhone || "Optional — not linked"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                    <span>Preferred Language (Optional)</span>
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="h-11 px-3 text-sm bg-white border border-border-warm rounded-xs text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="or">Odia (ଓଡ଼ିଆ)</option>
                  </select>
                </div>
              </div>

              {/* Section 2: Mailing Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border-warm pb-2.5">
                  <MapPin className="w-4 h-4 text-terracotta" aria-hidden="true" />
                  <h2 className="text-base font-serif font-bold text-forest">
                    2. Address Details
                  </h2>
                </div>

                <Input
                  label="Street / House / Locality Address"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="House no., street name, locality"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City / Town"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Balangir"
                    required
                  />
                  <Input
                    label="State"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Odisha"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="PIN / Postal Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 767001"
                    required
                  />
                  <Input
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Progressive Disclosure for Optional Tax & DOB */}
              <div className="border border-border-warm rounded-xs bg-cream/40">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails((prev) => !prev)}
                  className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-forest hover:bg-sand-light/40 transition-colors"
                  aria-expanded={showOptionalDetails}
                >
                  <span>Optional Details (Date of Birth &amp; Optional PAN)</span>
                  {showOptionalDetails ? (
                    <ChevronUp className="w-4 h-4 text-terracotta" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-terracotta" aria-hidden="true" />
                  )}
                </button>
                {showOptionalDetails && (
                  <div className="p-4 pt-2 border-t border-border-warm space-y-4">
                    <Input
                      label="Date of Birth (Optional)"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    <div className="space-y-1.5">
                      <Input
                        label={
                          account.profile?.panProvided
                            ? `Update Optional PAN (Currently stored: ${account.profile.panMasked})`
                            : "PAN Number (Optional)"
                        }
                        value={panOptional}
                        onChange={(e) => setPanOptional(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F (optional)"
                        maxLength={10}
                      />
                      <p className="text-[11px] text-ink-sand leading-relaxed">
                        You do not need to enter PAN unless you prefer it on donation accounting records. Stored masked on your account.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={savingProfile}
                className="w-full min-h-[46px] py-3 bg-terracotta hover:bg-terracotta-dark text-white font-bold text-sm"
              >
                {savingProfile
                  ? "Saving Profile..."
                  : wasIncomplete
                    ? "Save & Continue to Welcome"
                    : "Save Profile Changes"}
              </Button>
            </form>
          </Card>

          {/* Right Column: Preferences, Contact Management & Privacy Controls */}
          <div className="lg:col-span-5 space-y-6">
            {/* Section 3: Communication Preferences */}
            <Card padding="lg" className="bg-white border border-border-warm space-y-4">
              <div className="flex items-center gap-2 border-b border-border-warm pb-3">
                <Bell className="w-4 h-4 text-terracotta" aria-hidden="true" />
                <h2 className="text-base font-serif font-bold text-forest">
                  3. Communication Preferences
                </h2>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
                <label className="flex items-start gap-2.5 p-3 bg-cream/60 rounded-xs border border-border-warm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailReceiptsEnabled}
                    onChange={(e) => setEmailReceiptsEnabled(e.target.checked)}
                    className="mt-0.5 accent-forest"
                  />
                  <span>
                    <strong className="text-forest block">Email Payment Acknowledgements</strong>
                    <span className="text-ink-sand leading-relaxed">
                      Receive confirmation emails and official PDF receipts whenever you make a donation.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 bg-cream/60 rounded-xs border border-border-warm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailUpdatesEnabled}
                    onChange={(e) => setEmailUpdatesEnabled(e.target.checked)}
                    className="mt-0.5 accent-forest"
                  />
                  <span>
                    <strong className="text-forest block">Programme &amp; Impact Updates (Optional)</strong>
                    <span className="text-ink-sand leading-relaxed">
                      Periodic verified summaries of MECT education and welfare initiatives.
                    </span>
                  </span>
                </label>

                <div className="p-3 bg-sand-light/60 rounded-xs border border-border-warm space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={(e) => setWhatsappOptIn(e.target.checked)}
                      className="mt-0.5 accent-terracotta"
                    />
                    <span>
                      <strong className="text-forest inline-flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-terracotta" aria-hidden="true" />
                        <span>Optional WhatsApp Updates</span>
                      </strong>
                      <span className="text-ink-sand block mt-0.5 leading-relaxed">
                        Receive occasional confirmation alerts from MECT on WhatsApp. Unchecked by default and revocable anytime.
                      </span>
                    </span>
                  </label>

                  {whatsappOptIn && (
                    <Input
                      label="WhatsApp Mobile Number"
                      value={whatsappPhoneNumber}
                      onChange={(e) => setWhatsappPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  )}

                  {account.preferences?.whatsappConsentUpdatedAt && (
                    <p className="text-[11px] text-ink-sand">
                      Last preference update:{" "}
                      {new Date(account.preferences.whatsappConsentUpdatedAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={savingPrefs}
                  className="w-full min-h-[44px] bg-forest hover:bg-forest-deep text-white font-bold"
                >
                  {savingPrefs ? "Saving Preferences..." : "Save Communication Preferences"}
                </Button>
              </form>
            </Card>

            {/* Progressive Disclosure: Add or Update Verified Contact */}
            <Card padding="md" className="bg-white border border-border-warm">
              <button
                type="button"
                onClick={() => setShowContactChange((prev) => !prev)}
                aria-expanded={showContactChange}
                className="w-full flex items-center justify-between text-xs font-bold text-forest"
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest" aria-hidden="true" />
                  <span>Add or Verify Another Email / Phone</span>
                </span>
                {showContactChange ? (
                  <ChevronUp className="w-4 h-4 text-terracotta" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-terracotta" aria-hidden="true" />
                )}
              </button>

              {showContactChange && (
                <div className="pt-4 mt-3 border-t border-border-warm space-y-3">
                  <ul className="space-y-1.5">
                    {account.verifiedContacts.map((c, idx) => (
                      <li
                        key={`${c.contactType}-${c.contactValue}-${idx}`}
                        className="p-2 bg-cream rounded-xs border border-border-warm flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="truncate font-medium text-ink">{c.contactValue}</span>
                        <Badge variant="forest" size="sm">
                          {c.primary ? "Primary" : "Verified"}
                        </Badge>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setChangeChannel("EMAIL");
                        setChangeStep("IDLE");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xs border ${
                        changeChannel === "EMAIL"
                          ? "bg-forest text-white border-forest"
                          : "bg-cream text-forest border-border-warm"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangeChannel("PHONE");
                        setChangeStep("IDLE");
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xs border ${
                        changeChannel === "PHONE"
                          ? "bg-forest text-white border-forest"
                          : "bg-cream text-forest border-border-warm"
                      }`}
                    >
                      Phone SMS
                    </button>
                  </div>

                  {changeStep === "IDLE" ? (
                    <div className="space-y-2">
                      <Input
                        label={changeChannel === "EMAIL" ? "New Email Address" : "New Phone Number"}
                        value={changeTarget}
                        onChange={(e) => setChangeTarget(e.target.value)}
                        placeholder={changeChannel === "EMAIL" ? "new@example.com" : "+91 98765 43210"}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={savingContact}
                        onClick={handleRequestContactChangeOtp}
                        className="w-full"
                      >
                        {savingContact ? "Sending Code..." : "Send Verification Code"}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyContactChange} className="space-y-2">
                      <Input
                        label="6-Digit Verification Code"
                        value={changeOtp}
                        onChange={(e) => setChangeOtp(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={6}
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={savingContact} className="flex-1 bg-forest text-white">
                          Verify Contact
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setChangeStep("IDLE");
                            setChangeOtp("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </Card>

            {/* Progressive Disclosure: Data Rights & Deletion */}
            <Card padding="md" className="bg-white border border-border-warm">
              <button
                type="button"
                onClick={() => setShowDeletionPanel((prev) => !prev)}
                aria-expanded={showDeletionPanel}
                className="w-full flex items-center justify-between text-xs font-bold text-forest"
              >
                <span className="inline-flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-terracotta" aria-hidden="true" />
                  <span>Privacy &amp; Account Deletion Request</span>
                </span>
                {showDeletionPanel ? (
                  <ChevronUp className="w-4 h-4 text-terracotta" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-terracotta" aria-hidden="true" />
                )}
              </button>

              {showDeletionPanel && (
                <div className="pt-3 mt-3 border-t border-border-warm space-y-3">
                  <p className="text-[11px] text-ink-sand leading-relaxed">
                    You may request deactivation of your portal profile anytime. Under Indian Trust &amp; tax compliance regulations, any completed donation &amp; receipt records are retained in statutory ledgers.
                  </p>
                  {account.deletionRequested ? (
                    <Badge variant="terracotta" size="sm">
                      Deletion Request Logged for Review
                    </Badge>
                  ) : (
                    <form onSubmit={handleDeletionRequest} className="space-y-2">
                      <Input
                        label="Reason (Optional)"
                        value={deletionReason}
                        onChange={(e) => setDeletionReason(e.target.value)}
                        placeholder="Optional note for Trust administration"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={savingDelete}
                        className="w-full text-terracotta-dark border-terracotta/40 hover:bg-terracotta/10"
                      >
                        {savingDelete ? "Recording Request..." : "Request Account Deletion"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function PortalProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-cream text-sm text-ink-sand">
          Loading Supporter Profile...
        </div>
      }
    >
      <PortalProfileInner />
    </Suspense>
  );
}
