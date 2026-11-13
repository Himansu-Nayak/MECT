package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment_configurations")
public class PaymentConfiguration {

    @Id
    private Long id = 1L;

    @Column(name = "cashfree_enabled", nullable = false)
    private boolean cashfreeEnabled = true;

    @Column(name = "sbi_qr_enabled", nullable = false)
    private boolean sbiQrEnabled = true;

    @Column(name = "primary_method", nullable = false, length = 30)
    private String primaryMethod = "CASHFREE";

    @Column(name = "fallback_enabled", nullable = false)
    private boolean fallbackEnabled = true;

    @Column(name = "min_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal minAmount = new BigDecimal("1.00");

    @Column(name = "max_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal maxAmount = new BigDecimal("10000000.00");

    @Column(name = "suggested_amounts", nullable = false, length = 200)
    private String suggestedAmounts = "500,1000,1500,3000,5000,10000";

    @Column(name = "general_fund_enabled", nullable = false)
    private boolean generalFundEnabled = false;

    @Column(name = "sbi_bank_name", nullable = false, length = 120)
    private String sbiBankName = "State Bank of India";

    @Column(name = "sbi_account_name", nullable = false, length = 160)
    private String sbiAccountName = "MAHAVEER EDUCATIONAL & CHARITABLE TRUST";

    @Column(name = "sbi_account_number", nullable = false, length = 60)
    private String sbiAccountNumber = "33341302498";

    @Column(name = "sbi_ifsc", nullable = false, length = 30)
    private String sbiIfsc = "SBIN0001701";

    @Column(name = "sbi_branch", nullable = false, length = 160)
    private String sbiBranch = "Rajendra College Square, Bolangir, Odisha";

    @Column(name = "sbi_upi_id", nullable = false, length = 120)
    private String sbiUpiId = "86971610172@sbi";

    @Column(name = "sbi_qr_image_url", nullable = false, length = 500)
    private String sbiQrImageUrl = "/images/mect-sbi-upi-qr.png";

    @Column(name = "payment_instructions", nullable = false, columnDefinition = "TEXT")
    private String paymentInstructions = "Verify beneficiary name MAHAVEER EDUCATIONAL CHARITA in your UPI app before confirming transfer, then submit your 12-digit UTR/reference for verification.";

    @Column(name = "gateway_notice_text", nullable = false, length = 500)
    private String gatewayNoticeText = "Online payments are processed via Cashfree. Direct SBI UPI/bank transfers are verified manually by MECT Accounts before final receipt issuance.";

    @Column(name = "statutory_status", nullable = false, length = 40)
    private String statutoryStatus = "UNCONFIRMED_FY_2026_27";

    @Column(name = "statutory_financial_year", nullable = false, length = 30)
    private String statutoryFinancialYear = "FY 2026-27";

    @Column(name = "statutory_effective_date", length = 30)
    private String statutoryEffectiveDate = "2024-01-29";

    @Column(name = "statutory_expiry_date", length = 30)
    private String statutoryExpiryDate = "2026-03-31";

    @Column(name = "statutory_urn_80g", length = 80)
    private String statutoryUrn80g = "AADTM5474FF20241";

    @Column(name = "statutory_urn_12a", length = 80)
    private String statutoryUrn12a = "AADTM5474FE20231";

    @Column(name = "statutory_claim_approved", nullable = false)
    private boolean statutoryClaimApproved = false;

    @Column(name = "statutory_disclosure_text", nullable = false, columnDefinition = "TEXT")
    private String statutoryDisclosureText = "Historical Form 10AC Section 12A (URN: AADTM5474FE20231) and Section 80G (URN: AADTM5474FF20241) orders dated 29-01-2024 covered AY 2024-25 to AY 2026-27. Current tax year 2026-27 eligibility is pending Chartered Accountant confirmation.";

    @Column(name = "updated_by", nullable = false, length = 100)
    private String updatedBy = "SYSTEM";

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public boolean isCashfreeEnabled() { return cashfreeEnabled; }
    public void setCashfreeEnabled(boolean cashfreeEnabled) { this.cashfreeEnabled = cashfreeEnabled; }
    public boolean isSbiQrEnabled() { return sbiQrEnabled; }
    public void setSbiQrEnabled(boolean sbiQrEnabled) { this.sbiQrEnabled = sbiQrEnabled; }
    public String getPrimaryMethod() { return primaryMethod; }
    public void setPrimaryMethod(String primaryMethod) { this.primaryMethod = primaryMethod; }
    public boolean isFallbackEnabled() { return fallbackEnabled; }
    public void setFallbackEnabled(boolean fallbackEnabled) { this.fallbackEnabled = fallbackEnabled; }
    public BigDecimal getMinAmount() { return minAmount; }
    public void setMinAmount(BigDecimal minAmount) { this.minAmount = minAmount; }
    public BigDecimal getMaxAmount() { return maxAmount; }
    public void setMaxAmount(BigDecimal maxAmount) { this.maxAmount = maxAmount; }
    public String getSuggestedAmounts() { return suggestedAmounts; }
    public void setSuggestedAmounts(String suggestedAmounts) { this.suggestedAmounts = suggestedAmounts; }
    public boolean isGeneralFundEnabled() { return generalFundEnabled; }
    public void setGeneralFundEnabled(boolean generalFundEnabled) { this.generalFundEnabled = generalFundEnabled; }
    public String getSbiBankName() { return sbiBankName; }
    public void setSbiBankName(String sbiBankName) { this.sbiBankName = sbiBankName; }
    public String getSbiAccountName() { return sbiAccountName; }
    public void setSbiAccountName(String sbiAccountName) { this.sbiAccountName = sbiAccountName; }
    public String getSbiAccountNumber() { return sbiAccountNumber; }
    public void setSbiAccountNumber(String sbiAccountNumber) { this.sbiAccountNumber = sbiAccountNumber; }
    public String getSbiIfsc() { return sbiIfsc; }
    public void setSbiIfsc(String sbiIfsc) { this.sbiIfsc = sbiIfsc; }
    public String getSbiBranch() { return sbiBranch; }
    public void setSbiBranch(String sbiBranch) { this.sbiBranch = sbiBranch; }
    public String getSbiUpiId() { return sbiUpiId; }
    public void setSbiUpiId(String sbiUpiId) { this.sbiUpiId = sbiUpiId; }
    public String getSbiQrImageUrl() { return sbiQrImageUrl; }
    public void setSbiQrImageUrl(String sbiQrImageUrl) { this.sbiQrImageUrl = sbiQrImageUrl; }
    public String getPaymentInstructions() { return paymentInstructions; }
    public void setPaymentInstructions(String paymentInstructions) { this.paymentInstructions = paymentInstructions; }
    public String getGatewayNoticeText() { return gatewayNoticeText; }
    public void setGatewayNoticeText(String gatewayNoticeText) { this.gatewayNoticeText = gatewayNoticeText; }
    public String getStatutoryStatus() { return statutoryStatus; }
    public void setStatutoryStatus(String statutoryStatus) { this.statutoryStatus = statutoryStatus; }
    public String getStatutoryFinancialYear() { return statutoryFinancialYear; }
    public String getStatutoryFinancialYearOrDefault() { return statutoryFinancialYear; }
    public void setStatutoryFinancialYear(String statutoryFinancialYear) { this.statutoryFinancialYear = statutoryFinancialYear; }
    public String getStatutoryEffectiveDate() { return statutoryEffectiveDate; }
    public void setStatutoryEffectiveDate(String statutoryEffectiveDate) { this.statutoryEffectiveDate = statutoryEffectiveDate; }
    public String getStatutoryExpiryDate() { return statutoryExpiryDate; }
    public void setStatutoryExpiryDate(String statutoryExpiryDate) { this.statutoryExpiryDate = statutoryExpiryDate; }
    public String getStatutoryUrn80g() { return statutoryUrn80g; }
    public void setStatutoryUrn80g(String statutoryUrn80g) { this.statutoryUrn80g = statutoryUrn80g; }
    public String getStatutoryUrn12a() { return statutoryUrn12a; }
    public void setStatutoryUrn12a(String statutoryUrn12a) { this.statutoryUrn12a = statutoryUrn12a; }
    public boolean isStatutoryClaimApproved() { return statutoryClaimApproved; }
    public void setStatutoryClaimApproved(boolean statutoryClaimApproved) { this.statutoryClaimApproved = statutoryClaimApproved; }
    public String getStatutoryDisclosureText() { return statutoryDisclosureText; }
    public void setStatutoryDisclosureText(String statutoryDisclosureText) { this.statutoryDisclosureText = statutoryDisclosureText; }
    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    public Long getVersion() { return version; }
    public Instant getUpdatedAt() { return updatedAt; }
}

