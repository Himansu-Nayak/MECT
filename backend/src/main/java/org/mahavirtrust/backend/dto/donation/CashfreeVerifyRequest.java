package org.mahavirtrust.backend.dto.donation;

import jakarta.validation.constraints.NotBlank;

public record CashfreeVerifyRequest(
        @NotBlank(message = "Order ID is required for payment verification")
        String orderId
) {}

