package org.mahavirtrust.backend.dto.him;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record HimSubmitUtrRequest(
        @NotBlank(message = "UTR reference number is required")
        @Pattern(regexp = "^[A-Za-z0-9]{10,22}$", message = "UTR must be a valid 10 to 22 character alphanumeric reference")
        String utrNumber,
        String remitterName
) {}

