package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record OtpVerifyPayload(
        @NotBlank(message = "Verification channel is required")
        @Pattern(regexp = "EMAIL|PHONE", message = "Channel must be EMAIL or PHONE")
        String channel,

        @NotBlank(message = "Email address or mobile number is required")
        String target,

        @NotBlank(message = "6-digit verification code is required")
        @Size(min = 6, max = 6, message = "Verification code must be 6 digits")
        @Pattern(regexp = "^[0-9]{6}$", message = "Verification code must contain digits only")
        String otpCode,

        @Pattern(regexp = "LOGIN|CONTACT_CHANGE", message = "Invalid OTP purpose")
        String purpose
) {}

