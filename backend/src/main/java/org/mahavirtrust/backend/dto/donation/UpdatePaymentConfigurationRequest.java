package org.mahavirtrust.backend.dto.donation;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record UpdatePaymentConfigurationRequest(
        boolean cashfreeEnabled,
        boolean sbiQrEnabled,

        @NotBlank @Pattern(regexp = "CASHFREE|SBI_QR", message = "Primary method must be CASHFREE or SBI_QR")
        String primaryMethod,

        boolean fallbackEnabled,

        @NotNull @DecimalMin("1.00")
        BigDecimal minAmount,

        @NotNull @DecimalMax("50000000.00")
        BigDecimal maxAmount,

        @NotEmpty(message = "At least one preset amount is required")
        List<Integer> presetAmounts,

        boolean generalFundEnabled,

        @NotBlank @Size(max = 120)
        String sbiBankName,

        @NotBlank @Size(max = 160)
        String sbiAccountName,

        @NotBlank @Size(max = 60)
        String sbiAccountNumber,

        @NotBlank @Size(max = 30)
        String sbiIfsc,

        @NotBlank @Size(max = 160)
        String sbiBranch,

        @NotBlank @Size(max = 120)
        String sbiUpiId,

        @NotBlank @Size(max = 500)
        String sbiQrImageUrl,

        @NotBlank @Size(max = 2000)
        String paymentInstructions,

        @NotBlank @Size(max = 500)
        String gatewayNoticeText,

        @NotBlank @Size(max = 40)
        String statutoryStatus,

        @NotBlank @Size(max = 30)
        String statutoryFinancialYear,

        @Size(max = 30)
        String statutoryEffectiveDate,

        @Size(max = 30)
        String statutoryExpiryDate,

        @Size(max = 80)
        String statutoryUrn80g,

        @Size(max = 80)
        String statutoryUrn12a,

        boolean statutoryClaimApproved,

        @NotBlank @Size(max = 2000)
        String statutoryDisclosureText
) {}
