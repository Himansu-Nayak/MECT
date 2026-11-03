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

export interface ApiResponse<T> {
  status: string;
  referenceId?: number;
  message: string;
  timestamp: string;
  validationErrors?: string[];
}

export async function submitInquiry(
  payload: CreateInquiryPayload
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/public/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data.validationErrors && data.validationErrors.length > 0
        ? data.validationErrors.join(", ")
        : data.message || "Failed to submit inquiry. Please check your inputs.";
    throw new Error(errorMsg);
  }

  return data;
}

export async function submitVolunteerRegistration(
  payload: CreateVolunteerPayload
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/public/volunteers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data.validationErrors && data.validationErrors.length > 0
        ? data.validationErrors.join(", ")
        : data.message || "Failed to register volunteer. Please check your inputs.";
    throw new Error(errorMsg);
  }

  return data;
}
