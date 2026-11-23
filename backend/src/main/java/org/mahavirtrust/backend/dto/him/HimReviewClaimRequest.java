package org.mahavirtrust.backend.dto.him;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record HimReviewClaimRequest(
        @NotBlank(message = "Review action is required")
        @Pattern(regexp = "^(APPROVE|REJECT|INVESTIGATE)$", message = "Action must be APPROVE, REJECT, or INVESTIGATE")
        String action,
        String bankStatementRef,
        String notes,
        String rejectionReason
) {}

