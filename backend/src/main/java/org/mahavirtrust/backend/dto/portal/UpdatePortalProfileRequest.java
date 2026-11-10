package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdatePortalProfileRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 150, message = "Full name must not exceed 150 characters")
        String fullName,

        @NotBlank(message = "Address line is required")
        @Size(max = 300, message = "Address line must not exceed 300 characters")
        String addressLine,

        @NotBlank(message = "City is required")
        @Size(max = 100)
        String city,

        @NotBlank(message = "State is required")
        @Size(max = 100)
        String state,

        @NotBlank(message = "PIN code is required")
        @Size(min = 4, max = 12, message = "PIN / Postal code must be 4 to 12 characters")
        String pinCode,

        @NotBlank(message = "Country is required")
        @Size(max = 80)
        String country,

        LocalDate dateOfBirth,

        @Size(max = 500)
        String avatarUrl,

        @Size(max = 30)
        String preferredLanguage,

        @Pattern(regexp = "^$|^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Optional PAN must match valid 10-character PAN format (e.g. ABCDE1234F)")
        String panOptional,

        // Optional separate WhatsApp consent flag
        Boolean whatsappOptIn,
        String whatsappPhoneNumber,
        String whatsappConsentVersion
) {}

