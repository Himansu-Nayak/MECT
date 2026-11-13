import { API_BASE_URL } from "@/lib/api";

export interface OtpDispatchResponse {
  accepted: boolean;
  message: string;
  channel: "EMAIL" | "PHONE";
  cooldownSeconds: number;
  expiresInSeconds: number;
}

export interface PortalAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userUuid: string;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  fullName?: string | null;
  profileCompleted: boolean;
  roles: string[];
}

export interface VerifiedContactItem {
  contactType: "EMAIL" | "PHONE";
  contactValue: string;
  primary: boolean;
  verifiedAt: string;
}

export interface PortalUserProfileData {
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  preferredLanguage: string;
  panProvided: boolean;
  panMasked?: string | null;
  updatedAt: string;
}

export interface PortalDonationHistoryItem {
  donationReference: string;
  date: string;
  confirmedAt?: string | null;
  programmeCode: string;
  programmeName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  anonymous: boolean;
  dedicationMessage?: string | null;
  provider?: string | null;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  receiptNumber?: string | null;
  receiptAvailable: boolean;
}

export interface PortalDashboardData {
  account: {
    userUuid: string;
    primaryEmail?: string | null;
    primaryPhone?: string | null;
    status: string;
    profileCompleted: boolean;
    deletionRequested: boolean;
    roles: string[];
    isDonor: boolean;
    verifiedContacts: VerifiedContactItem[];
    profile: PortalUserProfileData | null;
    preferences: {
      emailReceiptsEnabled: boolean;
      emailUpdatesEnabled: boolean;
      whatsappOptIn: boolean;
      whatsappPhoneNumber: string;
      whatsappConsentUpdatedAt: string;
    };
  };
  donationSummary: {
    totalSuccessfulAmount: number;
    successfulCount: number;
    pendingCount: number;
    failedCount: number;
    claimableGuestDonationsCount?: number;
    latestDonation: PortalDonationHistoryItem | null;
  };
  donationHistory: PortalDonationHistoryItem[];
  manualClaims?: Array<{
    claimReference: string;
    donationReference: string;
    programmeName: string;
    utrNormalized: string;
    claimedAmount: number;
    transferDate: string;
    status: string;
    verificationNotes?: string | null;
    createdAt: string;
    reviewedAt?: string | null;
  }>;
}

export interface DonationProgrammeItem {
  id: number;
  code: string;
  name: string;
  tagline: string;
  description: string;
  generalFund: boolean;
  active: boolean;
  displayOrder: number;
}

export interface GatewayStatusResponse {
  provider: string;
  configured: boolean;
  sandboxMode: boolean;
  dynamicQrSupported: boolean;
  reason: string;
  checkoutMode?: string;
  checkoutEnvironment?: string;
}

export interface InitiatedDonationResponse {
  donationReference: string;
  orderId?: string | null;
  status: string;
  amount: number;
  currency: string;
  programmeCode: string;
  programmeName: string;
  paymentMethod: string;
  provider: string;
  providerOrderId?: string | null;
  providerQrId?: string | null;
  cfOrderId?: string | null;
  paymentSessionId?: string | null;
  checkoutEnvironment?: string | null;
  checkoutMode?: string | null;
  upiUri?: string | null;
  qrImageUrl?: string | null;
  qrSvg?: string | null;
  expiresAt?: string | null;
}

export interface DonationStatusResponse {
  donationReference: string;
  orderId?: string | null;
  cfOrderId?: string | null;
  provider?: string | null;
  status: string;
  amount: number;
  currency: string;
  programmeName: string;
  paymentMethod: string;
  paymentStatus: string;
  gatewayStatus?: string | null;
  paymentGroup?: string | null;
  bankReference?: string | null;
  failureReason?: string | null;
  expiresAt?: string | null;
  confirmedAt?: string | null;
  receiptNumber?: string | null;
  receiptAvailable: boolean;
}

export interface UpdatePortalProfilePayload {
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  panOptional?: string;
  whatsappOptIn?: boolean;
  whatsappPhoneNumber?: string;
  whatsappConsentVersion?: string;
}

export interface AdminDonorRow {
  id: number;
  userUuid: string;
  fullName: string;
  primaryEmail?: string | null;
  primaryPhone?: string | null;
  city?: string | null;
  state?: string | null;
  profileCompleted: boolean;
  deletionRequested: boolean;
  roles: string[];
  whatsappConsentStatus: string;
  successfulDonationsCount: number;
  totalDonatedAmount: number;
  createdAt: string;
}

export interface AdminDonationRow {
  donationReference: string;
  donorName: string;
  donorEmail?: string | null;
  donorPhone?: string | null;
  programmeCode: string;
  programmeName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  provider?: string | null;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  cfOrderId?: string | null;
  paymentGroup?: string | null;
  bankReference?: string | null;
  receiptNumber?: string | null;
  createdAt: string;
  confirmedAt?: string | null;
}

export interface AdminOutboxItem {
  id: number;
  eventKey: string;
  eventType: string;
  channel: string;
  recipient: string;
  senderIdentity: string;
  subject?: string | null;
  templateCode: string;
  status: string;
  retryCount: number;
  providerMessageId?: string | null;
  lastError?: string | null;
  createdAt: string;
}

const INTERNAL_PROVIDER_CODES = new Set(["RESEND", "NONE", "TWILIO", "MSG91", "RAZORPAY", "CASHFREE", "META_CLOUD"]);

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  const err = await response.json().catch(() => ({}));
  const firstValidation = Array.isArray(err?.validationErrors) ? err.validationErrors[0] : null;
  if (
    response.status === 400 &&
    typeof firstValidation === "string" &&
    firstValidation.trim().length > 0 &&
    !INTERNAL_PROVIDER_CODES.has(firstValidation.trim().toUpperCase())
  ) {
    return firstValidation;
  }
  const serverMessage = typeof err?.message === "string" ? err.message.trim() : "";
  if (serverMessage && !INTERNAL_PROVIDER_CODES.has(serverMessage.toUpperCase())) {
    return serverMessage;
  }
  if (response.status === 503) {
    return "This service is temporarily unavailable. Please try again shortly.";
  }
  return fallback;
}

export async function requestPortalOtp(
  payload: { channel: "EMAIL" | "PHONE"; target: string; purpose: "LOGIN" | "CONTACT_CHANGE" },
  token?: string | null
): Promise<OtpDispatchResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/portal/auth/request-otp`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  }).catch(() => {
    throw new Error("Unable to reach the verification server. Please try again shortly.");
  });
  const fallback =
    payload.channel === "PHONE"
      ? "SMS verification is currently unavailable. Please use Email OTP instead."
      : "Unable to send verification code. Please try again.";
  if (!res.ok) throw new Error(await parseErrorMessage(res, fallback));
  return res.json();
}

export async function verifyPortalOtp(payload: {
  channel: "EMAIL" | "PHONE";
  target: string;
  otpCode: string;
  purpose: "LOGIN" | "CONTACT_CHANGE";
}): Promise<PortalAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/portal/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Invalid or expired verification code."));
  return res.json();
}

export async function refreshPortalToken(refreshToken: string): Promise<PortalAuthResponse> {
  const res = await fetch(`${API_BASE_URL}/portal/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("Portal session expired.");
  return res.json();
}

export async function logoutPortal(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/portal/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}

export async function fetchPortalDashboard(token: string): Promise<PortalDashboardData> {
  const res = await fetch(`${API_BASE_URL}/portal/me/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to load portal dashboard."));
  return res.json();
}

export async function updatePortalProfile(
  token: string,
  payload: UpdatePortalProfilePayload
): Promise<PortalDashboardData> {
  const res = await fetch(`${API_BASE_URL}/portal/me/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to update profile."));
  return res.json();
}

export async function verifyPortalContactChange(
  token: string,
  payload: { channel: "EMAIL" | "PHONE"; target: string; otpCode: string; purpose: "CONTACT_CHANGE" }
): Promise<PortalDashboardData> {
  const res = await fetch(`${API_BASE_URL}/portal/me/contacts/verify-change`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to verify new contact."));
  return res.json();
}

export async function updatePortalPreferences(
  token: string,
  payload: {
    emailReceiptsEnabled: boolean;
    emailUpdatesEnabled: boolean;
    whatsappOptIn: boolean;
    whatsappPhoneNumber?: string;
    consentVersion?: string;
  }
): Promise<PortalDashboardData> {
  const res = await fetch(`${API_BASE_URL}/portal/me/preferences`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to update preferences."));
  return res.json();
}

export async function requestPortalDeletion(
  token: string,
  reason: string
): Promise<{ accepted: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/portal/me/deletion-request`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to record request."));
  return res.json();
}

export async function downloadPortalReceiptPdf(token: string, receiptNumber: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/portal/receipts/${encodeURIComponent(receiptNumber)}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to download receipt PDF."));
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${receiptNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function fetchDonationProgrammes(): Promise<DonationProgrammeItem[]> {
  const res = await fetch(`${API_BASE_URL}/public/donations/programmes`);
  if (!res.ok) throw new Error("Unable to load approved donation programmes.");
  return res.json();
}

export async function fetchGatewayStatus(): Promise<GatewayStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/public/donations/gateway-status`);
  if (!res.ok) throw new Error("Unable to check payment gateway availability.");
  return res.json();
}

export async function initiateDonation(
  payload: {
    programmeCode: string;
    amount: number;
    donorName: string;
    donorEmail?: string;
    donorPhone?: string;
    donorAddress?: string;
    donorPan?: string;
    dedicationMessage?: string;
    anonymous: boolean;
    paymentMethod: "UPI_QR" | "GATEWAY_CHECKOUT";
  },
  token?: string | null
): Promise<InitiatedDonationResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/public/donations/initiate`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to initiate donation payment."));
  return res.json();
}

export async function fetchDonationStatus(donationReference: string): Promise<DonationStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/public/donations/${encodeURIComponent(donationReference)}/status`);
  if (!res.ok) throw new Error("Unable to fetch donation status.");
  return res.json();
}

export async function verifyCashfreePayment(orderId: string): Promise<DonationStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/cashfree/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to verify payment status with gateway."));
  return res.json();
}

export async function fetchCashfreeOrderStatus(orderId: string): Promise<DonationStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/payments/cashfree/status/${encodeURIComponent(orderId)}`);
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to fetch payment status."));
  return res.json();
}

export async function fetchAdminDonors(token: string, search = "", roleFilter = "ALL") {
  const params = new URLSearchParams({ search, roleFilter, page: "0", size: "50" });
  const res = await fetch(`${API_BASE_URL}/admin/donors?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load donors directory."));
  return res.json() as Promise<{ content: AdminDonorRow[]; totalElements: number }>;
}

export async function fetchAdminDonations(token: string, status = "ALL", provider = "ALL", search = "") {
  const params = new URLSearchParams({ status, provider, search, page: "0", size: "50" });
  const res = await fetch(`${API_BASE_URL}/admin/donations?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load donations ledger."));
  return res.json() as Promise<{
    summary: {
      totalSuccessfulAmount: number;
      successfulCount: number;
      pendingCount: number;
      failedCount: number;
      userDroppedCount?: number;
      expiredCount: number;
      refundedCount: number;
    };
    content: AdminDonationRow[];
    totalElements: number;
  }>;
}

export async function reconcileAdminDonation(token: string, donationReference: string): Promise<DonationStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/admin/donations/${encodeURIComponent(donationReference)}/reconcile`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to reconcile donation status."));
  return res.json();
}

export async function fetchDonationReconciliationLogs(token: string, donationReference: string) {
  const res = await fetch(`${API_BASE_URL}/admin/donations/${encodeURIComponent(donationReference)}/reconciliation`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load reconciliation logs.");
  return res.json() as Promise<Array<{ id: number; previousStatus: string; newStatus: string; source: string; actor: string; note: string; createdAt: string }>>;
}

export async function downloadAdminReceiptPdf(token: string, receiptNumber: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/receipts/${encodeURIComponent(receiptNumber)}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unable to download receipt PDF.");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${receiptNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportAdminDonationsCsv(token: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/donations/export.csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Your administrative role is not permitted to export financial ledgers."));
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mect-donations-export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function fetchAdminOutbox(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/outbox?page=0&size=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load notification outbox.");
  return res.json() as Promise<{ content: AdminOutboxItem[] }>;
}

export async function retryAdminOutbox(token: string, id: number) {
  const res = await fetch(`${API_BASE_URL}/admin/outbox/${id}/retry`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Unable to retry outbox notification.");
  return res.json();
}

export async function fetchAdminProgrammes(token: string): Promise<DonationProgrammeItem[]> {
  const res = await fetch(`${API_BASE_URL}/admin/programmes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load campaigns.");
  return res.json();
}

export async function toggleAdminProgramme(token: string, id: number): Promise<DonationProgrammeItem> {
  const res = await fetch(`${API_BASE_URL}/admin/programmes/${id}/toggle`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to update programme status.");
  return res.json();
}

export interface PaymentConfigurationDto {
  cashfreeEnabled: boolean;
  sbiQrEnabled: boolean;
  primaryMethod: "CASHFREE" | "SBI_QR";
  fallbackEnabled: boolean;
  minAmount: number;
  maxAmount: number;
  presetAmounts: number[];
  generalFundEnabled: boolean;
  sbiBankName: string;
  sbiAccountName: string;
  sbiAccountNumber: string;
  sbiIfsc: string;
  sbiBranch: string;
  sbiUpiId: string;
  sbiQrImageUrl: string;
  paymentInstructions: string;
  gatewayNoticeText: string;
  statutoryStatus: string;
  statutoryFinancialYear: string;
  statutoryEffectiveDate?: string | null;
  statutoryExpiryDate?: string | null;
  statutoryUrn80g?: string | null;
  statutoryUrn12a?: string | null;
  statutoryClaimApproved: boolean;
  statutoryDisclosureText: string;
  updatedBy?: string | null;
  updatedAt?: string | null;
}

export interface PublicDonationConfigResponse {
  programmes: DonationProgrammeItem[];
  gatewayStatus: GatewayStatusResponse;
  config: PaymentConfigurationDto;
}

export interface SubmitSbiUtrPayload {
  programmeCode: string;
  amount: number;
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  donorAddress?: string;
  donorPan?: string;
  dedicationMessage?: string;
  anonymous: boolean;
  communicationConsent?: boolean;
  utrReference: string;
  transferDate: string;
  paymentModeNote?: string;
  proofSummary?: string;
  existingDonationReference?: string;
}

export interface SubmitSbiUtrResponse {
  claimReference: string;
  donationReference: string;
  claimStatus: string;
  donationStatus: string;
  utrNormalized: string;
  claimedAmount: number;
  transferDate: string;
  programmeName: string;
  receiptIssued: boolean;
  message: string;
}

export interface AdminManualClaimRow {
  claimReference: string;
  donationReference: string;
  programmeName: string;
  donorName: string;
  donorEmail?: string | null;
  donorPhone?: string | null;
  utrReference: string;
  utrNormalized: string;
  claimedAmount: number;
  transferDate: string;
  paymentModeNote?: string | null;
  proofSummary?: string | null;
  status: string;
  donationStatus: string;
  bankStatementReference?: string | null;
  verificationNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  receiptNumber?: string | null;
  createdAt: string;
}

export interface AdminDonationSummaryDto {
  totalVerifiedAmount: number;
  last30DaysVerifiedAmount: number;
  cashfreeVerifiedAmount: number;
  sbiVerifiedAmount: number;
  verifiedDonationCount: number;
  pendingVerificationCount: number;
  utrReviewQueueCount: number;
  pendingGatewayCount: number;
  failedOrExpiredCount: number;
  activeProgrammeCount: number;
}

export interface CmsPageSummary {
  id: number;
  slug: string;
  title: string;
  status: string;
  publishedAt?: string | null;
  publishedBy?: string | null;
  updatedAt: string;
  sectionJson?: string;
  draftJson?: string | null;
  revisions?: Array<{
    revisionNumber: number;
    changeSummary?: string | null;
    editedBy: string;
    createdAt: string;
    snapshotJson: string;
  }>;
}

export interface MediaAssetDto {
  assetKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  altText: string;
  focalPoint: string;
  publicUrl: string;
  uploadedBy: string;
  createdAt: string;
}

export async function fetchPublicDonationConfig(): Promise<PublicDonationConfigResponse> {
  const res = await fetch(`${API_BASE_URL}/public/donations/config`, { cache: "no-store" });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to load donation configuration."));
  return res.json();
}

export async function submitManualSbiUtrClaim(
  payload: SubmitSbiUtrPayload,
  portalToken?: string | null
): Promise<SubmitSbiUtrResponse> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (portalToken) headers.Authorization = `Bearer ${portalToken}`;
  const res = await fetch(`${API_BASE_URL}/public/donations/sbi/submit-utr`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to submit SBI UTR claim."));
  return res.json();
}

export async function claimGuestDonations(portalToken: string): Promise<{
  claimedCount: number;
  claimedReferences: string[];
  message: string;
}> {
  const res = await fetch(`${API_BASE_URL}/portal/me/donations/claim`, {
    method: "POST",
    headers: { Authorization: `Bearer ${portalToken}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Unable to claim previous donations."));
  return res.json();
}

export async function fetchAdminDonationSummary(token: string): Promise<AdminDonationSummaryDto> {
  const res = await fetch(`${API_BASE_URL}/admin/donations/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load donation summary."));
  return res.json();
}

export async function fetchAdminManualClaims(token: string, status = "ALL"): Promise<AdminManualClaimRow[]> {
  const res = await fetch(`${API_BASE_URL}/admin/manual-claims?status=${encodeURIComponent(status)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load SBI UTR verification queue."));
  return res.json();
}

export async function reviewAdminManualClaim(
  token: string,
  claimReference: string,
  payload: { decision: "UNDER_REVIEW" | "VERIFIED" | "REJECTED" | "NEEDS_REVIEW"; bankStatementReference?: string; verificationNotes?: string }
): Promise<AdminManualClaimRow> {
  const res = await fetch(`${API_BASE_URL}/admin/manual-claims/${encodeURIComponent(claimReference)}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to update verification decision."));
  return res.json();
}

export async function fetchAdminPaymentConfig(token: string): Promise<PaymentConfigurationDto> {
  const res = await fetch(`${API_BASE_URL}/admin/payment-config`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load payment settings."));
  return res.json();
}

export async function updateAdminPaymentConfig(
  token: string,
  payload: Omit<PaymentConfigurationDto, "updatedBy" | "updatedAt">
): Promise<PaymentConfigurationDto> {
  const res = await fetch(`${API_BASE_URL}/admin/payment-config`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to update payment settings."));
  return res.json();
}

export async function fetchAdminCmsPages(token: string): Promise<CmsPageSummary[]> {
  const res = await fetch(`${API_BASE_URL}/admin/cms/pages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load CMS pages."));
  return res.json();
}

export async function fetchAdminCmsPage(token: string, slug: string): Promise<CmsPageSummary> {
  const res = await fetch(`${API_BASE_URL}/admin/cms/pages/${encodeURIComponent(slug)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load CMS page."));
  return res.json();
}

export async function saveAdminCmsDraft(
  token: string,
  slug: string,
  payload: { title: string; draftJson: string; changeSummary?: string }
): Promise<CmsPageSummary> {
  const res = await fetch(`${API_BASE_URL}/admin/cms/pages/${encodeURIComponent(slug)}/draft`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to save CMS draft."));
  return res.json();
}

export async function publishAdminCmsPage(token: string, slug: string): Promise<CmsPageSummary> {
  const res = await fetch(`${API_BASE_URL}/admin/cms/pages/${encodeURIComponent(slug)}/publish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to publish CMS page."));
  return res.json();
}

export async function fetchAdminMedia(token: string): Promise<MediaAssetDto[]> {
  const res = await fetch(`${API_BASE_URL}/admin/media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to load media library."));
  return res.json();
}

export async function uploadAdminMedia(
  token: string,
  file: File,
  altText: string,
  focalPoint = "center"
): Promise<MediaAssetDto> {
  const form = new FormData();
  form.append("file", file);
  form.append("altText", altText);
  form.append("focalPoint", focalPoint);
  const res = await fetch(`${API_BASE_URL}/admin/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to upload media."));
  return res.json();
}

export async function deleteAdminMedia(token: string, assetKey: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/media/${encodeURIComponent(assetKey)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res, "Failed to delete media asset."));
}


