package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AccountDeletionRequest(
        @NotBlank(message = "Please specify a brief reason for your correction or deletion request")
        @Size(max = 500)
        String reason
) {}

