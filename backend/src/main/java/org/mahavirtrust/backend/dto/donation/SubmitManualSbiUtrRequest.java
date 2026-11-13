package org.mahavirtrust.backend.dto.donation;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record SubmitManualSbiUtrRequest(
        @NotBlank(message = "Please select a donation programme")
        String programmeCode,

        @NotNull(message = "Donation amount is required")
        @DecimalMin(value = "1.00", message = "Minimum voluntary contribution is INR 1")
        @DecimalMax(value = "10000000.00", message = "Contribution exceeds maximum limit")
        BigDecimal amount,

        @NotBlank(message = "Donor full name is required for accounting records")
        @Size(max = 160)
        String donorName,

        @Email(message = "Please enter a valid email address")
        @Size(max = 255)
        String donorEmail,

        @Size(max = 30)
        String donorPhone,

        @Size(max = 500)
        String donorAddress,

        @Pattern(regexp = "^$|^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Optional PAN must be a valid 10-character PAN")
        String donorPan,

        @Size(max = 300)
        String dedicationMessage,

        boolean anonymous,

        Boolean communicationConsent,

        @NotBlank(message = "UTR / bank transaction reference is required")
        @Size(min = 8, max = 64, message = "UTR / bank reference must be between 8 and 64 characters")
        String utrReference,

        @NotNull(message = "Transfer date is required")
        LocalDate transferDate,

        @Size(max = 120)
        String paymentModeNote,

        @Size(max = 500)
        String proofSummary,

        @Size(max = 64)
        String existingDonationReference
) {}

