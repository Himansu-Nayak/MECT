package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "provider_order_id", length = 100)
    private String providerOrderId;

    @Column(name = "provider_qr_id", length = 100)
    private String providerQrId;

    @Column(name = "provider_payment_id", length = 100)
    private String providerPaymentId;

    @Column(name = "upi_uri", columnDefinition = "TEXT")
    private String upiUri;

    @Column(name = "qr_image_url", columnDefinition = "TEXT")
    private String qrImageUrl;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(nullable = false, length = 30)
    private String status = "CREATED";

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "verified_signature_present", nullable = false)
    private boolean verifiedSignaturePresent = false;

    @Column(name = "failure_reason", length = 500)
    private String failureReason;

    @Column(name = "refunded_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal refundedAmount = BigDecimal.ZERO;

    @Version
    @Column(nullable = false)
    private Long version = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderOrderId() { return providerOrderId; }
    public void setProviderOrderId(String providerOrderId) { this.providerOrderId = providerOrderId; }
    public String getProviderQrId() { return providerQrId; }
    public void setProviderQrId(String providerQrId) { this.providerQrId = providerQrId; }
    public String getProviderPaymentId() { return providerPaymentId; }
    public void setProviderPaymentId(String providerPaymentId) { this.providerPaymentId = providerPaymentId; }
    public String getUpiUri() { return upiUri; }
    public void setUpiUri(String upiUri) { this.upiUri = upiUri; }
    public String getQrImageUrl() { return qrImageUrl; }
    public void setQrImageUrl(String qrImageUrl) { this.qrImageUrl = qrImageUrl; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public boolean isVerifiedSignaturePresent() { return verifiedSignaturePresent; }
    public void setVerifiedSignaturePresent(boolean verifiedSignaturePresent) { this.verifiedSignaturePresent = verifiedSignaturePresent; }
    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }
    public BigDecimal getRefundedAmount() { return refundedAmount; }
    public void setRefundedAmount(BigDecimal refundedAmount) { this.refundedAmount = refundedAmount; }
    public Long getVersion() { return version; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

