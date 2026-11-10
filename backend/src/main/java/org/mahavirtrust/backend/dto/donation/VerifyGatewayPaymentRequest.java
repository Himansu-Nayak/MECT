package org.mahavirtrust.backend.dto.donation;

import jakarta.validation.constraints.NotBlank;

public record VerifyGatewayPaymentRequest(
        @NotBlank String donationReference,
        @NotBlank String providerOrderId,
        @NotBlank String providerPaymentId,
        @NotBlank String signature
) {}

