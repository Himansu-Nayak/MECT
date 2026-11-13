package org.mahavirtrust.backend.dto.donation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ReviewManualSbiClaimRequest(
        @NotBlank(message = "Review decision is required")
        @Pattern(
                regexp = "UNDER_REVIEW|VERIFIED|REJECTED|NEEDS_REVIEW",
                message = "Decision must be UNDER_REVIEW, VERIFIED, REJECTED, or NEEDS_REVIEW"
        )
        String decision,

        @Size(max = 120)
        String bankStatementReference,

        @Size(max = 1000)
        String verificationNotes
) {}

