// Frontend API Client configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export interface CreateInquiryPayload {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
}

export interface CreateVolunteerPayload {
  fullName: string;
  email: string;
  phone: string;
  roleInterest: string;
  district?: string;
  availability?: string;
  qualification?: string;
  engagementMode?: string;
  backgroundNotes?: string;
  consentDeclared?: boolean;
  consentVersion?: string;
}

export interface DocumentUploadDto {
  documentType: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
}

export interface CreateScholarshipPayload {
  fullName: string;
  email: string;
  phone: string;
  aadhaarLastFour: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: string;
  category: string;
  district: string;
  pinCode: string;
  permanentAddress: string;
  schemeCode: string;
  institutionName: string;
  institutionDistrict: string;
  courseName: string;
  currentYearSemester: string;
  rollOrRegistrationNumber: string;
  annualFamilyIncome: number;
  tahasildarCertNumber: string;
  tahasildarCertIssueDate: string; // YYYY-MM-DD
  collegeBankName: string;
  collegeBankAccountNumber: string;
  collegeBankIfsc: string;
  collegeAccountHolderName: string;
  tuitionFeeDemanded: number;
  swornDeclaration: boolean;
  documents: DocumentUploadDto[];
}

export interface ScholarshipDocumentItem {
  id: number;
  documentType: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  uploadedAt: string;
}

export interface ScholarshipApplicationData {
  id: number;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarLastFour: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  district: string;
  pinCode: string;
  permanentAddress: string;
  schemeCode: string;
  institutionName: string;
  institutionDistrict: string;
  courseName: string;
  currentYearSemester: string;
  rollOrRegistrationNumber: string;
  annualFamilyIncome: number;
  tahasildarCertNumber: string;
  tahasildarCertIssueDate: string;
  collegeBankName: string;
  collegeBankAccountNumber: string;
  collegeBankIfsc: string;
  collegeAccountHolderName: string;
  tuitionFeeDemanded: number;
  status: string;
  rejectionReason?: string;
  actionRequiredNote?: string;
  disbursalTransactionRef?: string;
  disbursalDate?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  documents: ScholarshipDocumentItem[];
}

export interface TrackingStage {
  stageKey: string;
  label: string;
  state: "COMPLETED" | "CURRENT" | "PENDING" | "REJECTED" | "ACTION_NEEDED";
  description: string;
}

export interface ScholarshipTrackData {
  applicationNumber: string;
  maskedName: string;
  institutionName: string;
  courseName: string;
  schemeCode: string;
  status: string;
  statusMessage: string;
  submittedAt: string;
  lastUpdatedAt: string;
  actionRequiredNote?: string;
  rejectionReason?: string;
  disbursalDate?: string;
  stages: TrackingStage[];
}

export interface AdminDashboardStats {
  totalVolunteers: number;
  pendingVolunteers: number;
  approvedVolunteers: number;
  totalInquiries: number;
  pendingInquiries?: number;
  totalScholarships: number;
  submittedScholarships: number;
  underScrutinyScholarships: number;
  approvedScholarships: number;
  disbursedScholarships: number;
  totalDisbursalDemand: number;
  totalDisbursedAmount: number;
  totalAdminUsers: number;
}

export interface AdminLoginPayload {
  username: string;
  password: string;
}

export interface AdminAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AdminUserSummary {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  failedLoginAttempts: number;
  createdAt: string;
}

export interface AdminAuditLog {
  id: number;
  actorUsername: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  details?: string;
  createdAt: string;
}

export interface AdminVolunteer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roleInterest: string;
  district?: string;
  qualification?: string;
  availability?: string;
  engagementMode?: string;
  backgroundNotes?: string;
  verificationStatus: string;
  version: number;
  createdAt: string;
}

export interface AdminInquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: string;
  referenceId?: number;
  message: string;
  timestamp: string;
  validationErrors?: string[];
}

// ---------------- Public Endpoints ----------------

async function safeParseResponse<T = any>(
  response: Response,
  fallbackErrorMessage: string
): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  let data: any = null;
  let text = "";

  try {
    text = await response.text();
    if (text && text.trim().length > 0) {
      if (
        contentType.includes("application/json") ||
        text.startsWith("{") ||
        text.startsWith("[")
      ) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }
    }
  } catch {
    text = "";
    data = null;
  }

  if (!response.ok) {
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(
        `MECT Secretariat server is temporarily unreachable (HTTP ${response.status}). Please check backend status.`
      );
    }
    if (response.status === 404) {
      throw new Error(`Requested resource or API endpoint not found (HTTP 404).`);
    }
    if (response.status === 409) {
      throw new Error(
        data?.message ||
          "Conflict detected: This resource was modified concurrently by another process. Please reload."
      );
    }
    if (response.status === 423) {
      throw new Error(
        data?.message ||
          "Account locked due to consecutive failed attempts. Contact Super Admin."
      );
    }
    if (
      data?.validationErrors &&
      Array.isArray(data.validationErrors) &&
      data.validationErrors.length > 0
    ) {
      throw new Error(data.validationErrors.join("; "));
    }
    throw new Error(data?.message || fallbackErrorMessage);
  }

  // Handle 204 No Content or empty successful body
  if (response.status === 204 || !text || text.trim().length === 0) {
    return null as T;
  }

  if (data === null) {
    throw new Error(
      `Unexpected non-JSON response from server (HTTP ${response.status}).`
    );
  }

  return data as T;
}

export async function submitInquiry(
  payload: CreateInquiryPayload
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/public/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return safeParseResponse<ApiResponse<void>>(
    response,
    "Failed to submit inquiry. Please check your inputs."
  );
}

export async function submitVolunteerRegistration(
  payload: CreateVolunteerPayload
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/public/volunteers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return safeParseResponse<ApiResponse<void>>(
    response,
    "Failed to register volunteer. Please check your inputs."
  );
}

export async function submitScholarshipApplication(
  payload: CreateScholarshipPayload
): Promise<ScholarshipApplicationData> {
  const response = await fetch(`${API_BASE_URL}/public/scholarships/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return safeParseResponse<ScholarshipApplicationData>(
    response,
    "Failed to submit scholarship application. Please review all fields."
  );
}

export async function trackScholarshipApplication(
  applicationNumber: string,
  phone?: string
): Promise<ScholarshipTrackData> {
  const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  const response = await fetch(
    `${API_BASE_URL}/public/scholarships/track/${encodeURIComponent(applicationNumber)}${query}`
  );

  return safeParseResponse<ScholarshipTrackData>(
    response,
    "Scholarship application not found."
  );
}

// ---------------- Admin Auth & Protected Endpoints ----------------

export async function loginAdmin(
  payload: AdminLoginPayload
): Promise<AdminAuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Unable to connect to MECT Secretariat API. Please verify backend server is running."
    );
  }

  return safeParseResponse<AdminAuthResponse>(
    response,
    "Invalid administrative credentials."
  );
}

export async function refreshAdminToken(
  refreshToken: string
): Promise<AdminAuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    throw new Error("Unable to connect to MECT Secretariat API.");
  }

  return safeParseResponse<AdminAuthResponse>(
    response,
    "Session expired. Please log in again."
  );
}

export async function getAdminDashboardStats(
  token: string
): Promise<AdminDashboardStats> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<AdminDashboardStats>(
    response,
    "Failed to load dashboard metrics"
  );
}

export async function getAdminScholarships(
  token: string,
  status?: string,
  district?: string
): Promise<ScholarshipApplicationData[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (district) params.append("district", district);
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${API_BASE_URL}/admin/scholarships${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<ScholarshipApplicationData[]>(
    response,
    "Failed to load scholarships list"
  );
}

export async function getAdminScholarshipById(
  token: string,
  id: number
): Promise<ScholarshipApplicationData> {
  const response = await fetch(`${API_BASE_URL}/admin/scholarships/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<ScholarshipApplicationData>(
    response,
    "Failed to load scholarship details"
  );
}

export async function updateAdminScholarshipStatus(
  token: string,
  id: number,
  payload: {
    status: string;
    rejectionReason?: string;
    actionRequiredNote?: string;
    disbursalTransactionRef?: string;
    expectedVersion?: number;
  }
): Promise<ScholarshipApplicationData> {
  const response = await fetch(`${API_BASE_URL}/admin/scholarships/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return safeParseResponse<ScholarshipApplicationData>(
    response,
    "Failed to update scholarship status"
  );
}

export async function getAdminVolunteers(
  token: string
): Promise<AdminVolunteer[]> {
  const response = await fetch(`${API_BASE_URL}/admin/volunteers`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<AdminVolunteer[]>(
    response,
    "Failed to load volunteers registry"
  );
}

export async function updateAdminVolunteerStatus(
  token: string,
  id: number,
  status: string
): Promise<{ status: string; verificationStatus: string; version: number }> {
  const response = await fetch(`${API_BASE_URL}/admin/volunteers/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return safeParseResponse<{ status: string; verificationStatus: string; version: number }>(
    response,
    "Failed to update volunteer status"
  );
}

export async function getAdminInquiries(
  token: string
): Promise<AdminInquiry[]> {
  const response = await fetch(`${API_BASE_URL}/admin/inquiries`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<AdminInquiry[]>(
    response,
    "Failed to load inquiries"
  );
}

export async function updateAdminInquiryStatus(
  id: number,
  status: string,
  token: string
): Promise<AdminInquiry> {
  const response = await fetch(`${API_BASE_URL}/admin/inquiries/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return safeParseResponse<AdminInquiry>(
    response,
    "Failed to update inquiry status"
  );
}

export async function getAdminAuditLogs(
  token: string
): Promise<AdminAuditLog[]> {
  const response = await fetch(`${API_BASE_URL}/admin/audit-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<AdminAuditLog[]>(
    response,
    "Failed to load audit logs"
  );
}

export async function getAdminUsers(
  token: string
): Promise<AdminUserSummary[]> {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return safeParseResponse<AdminUserSummary[]>(
    response,
    "Failed to load institutional users"
  );
}

export async function createAdminUser(
  token: string,
  payload: { username: string; email: string; password: string; fullName: string; role: string }
): Promise<AdminUserSummary> {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return safeParseResponse<AdminUserSummary>(
    response,
    "Failed to create administrator"
  );
}

export async function updateAdminUserStatus(
  token: string,
  id: number,
  status: string
): Promise<AdminUserSummary> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  return safeParseResponse<AdminUserSummary>(
    response,
    "Failed to update user status"
  );
}
