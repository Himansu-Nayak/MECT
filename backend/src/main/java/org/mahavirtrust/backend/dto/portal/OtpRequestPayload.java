package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record OtpRequestPayload(
        @NotBlank(message = "Verification channel is required")
        @Pattern(regexp = "EMAIL|PHONE", message = "Channel must be EMAIL or PHONE")
        String channel,

        @NotBlank(message = "Email address or mobile number is required")
        String target,

        @Pattern(regexp = "LOGIN|CONTACT_CHANGE", message = "Invalid OTP purpose")
        String purpose
) {}

