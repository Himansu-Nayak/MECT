package org.mahavirtrust.backend.dto.document;

import jakarta.validation.constraints.NotBlank;

public record DocumentStatusUpdateRequest(
        @NotBlank(message = "Status is required")
        String status,
        String withdrawalReason
) {}
