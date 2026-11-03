package org.mahavirtrust.backend.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateVolunteerRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 150, message = "Full name must not exceed 150 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid email address")
        @Size(max = 255, message = "Email must not exceed 255 characters")
        String email,

        @NotBlank(message = "Phone number is required")
        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone,

        @NotBlank(message = "Role of interest is required")
        @Size(max = 50, message = "Role interest must not exceed 50 characters")
        String roleInterest,

        @Size(max = 100, message = "District must not exceed 100 characters")
        String district,

        @Size(max = 50, message = "Availability must not exceed 50 characters")
        String availability,

        @Size(max = 100, message = "Qualification must not exceed 100 characters")
        String qualification,

        @Size(max = 30, message = "Engagement mode must not exceed 30 characters")
        String engagementMode,

        @Size(max = 2000, message = "Background notes must not exceed 2000 characters")
        String backgroundNotes,

        @NotNull(message = "Consent declaration is mandatory")
        @AssertTrue(message = "Affirmative consent to the voluntary service declaration is required")
        Boolean consentDeclared,

        @Size(max = 50, message = "Consent version must not exceed 50 characters")
        String consentVersion
) {
    public CreateVolunteerRequest(String fullName, String email, String phone, String roleInterest, String backgroundNotes) {
        this(fullName, email, phone, roleInterest, null, null, null, null, backgroundNotes, false, null);
    }
}
