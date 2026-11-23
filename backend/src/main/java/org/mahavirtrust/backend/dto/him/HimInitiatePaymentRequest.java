package org.mahavirtrust.backend.dto.him;

import jakarta.validation.constraints.NotBlank;

public record HimInitiatePaymentRequest(
        @NotBlank(message = "Donation reference is required")
        String donationReference,
        String idempotencyKey
) {}

