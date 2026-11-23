package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "him_payment_attempts")
public class HimPaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_reference", nullable = false, unique = true, length = 50)
    private String attemptReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "upi_uri", columnDefinition = "TEXT")
    private String upiUri;

    @Column(name = "qr_svg", columnDefinition = "TEXT")
    private String qrSvg;

    @Column(nullable = false, length = 40)
    private String status = "INITIATED";

    @Column(name = "donor_utr", length = 80)
    private String donorUtr;

    @Column(name = "donor_utr_normalized", length = 80, unique = true)
    private String donorUtrNormalized;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "verified_by", length = 100)
    private String verifiedBy;

    @Column(name = "bank_statement_ref", length = 120)
    private String bankStatementRef;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

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
    public String getAttemptReference() { return attemptReference; }
    public void setAttemptReference(String attemptReference) { this.attemptReference = attemptReference; }
    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getUpiUri() { return upiUri; }
    public void setUpiUri(String upiUri) { this.upiUri = upiUri; }
    public String getQrSvg() { return qrSvg; }
    public void setQrSvg(String qrSvg) { this.qrSvg = qrSvg; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDonorUtr() { return donorUtr; }
    public void setDonorUtr(String donorUtr) { this.donorUtr = donorUtr; }
    public String getDonorUtrNormalized() { return donorUtrNormalized; }
    public void setDonorUtrNormalized(String donorUtrNormalized) { this.donorUtrNormalized = donorUtrNormalized; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }
    public String getBankStatementRef() { return bankStatementRef; }
    public void setBankStatementRef(String bankStatementRef) { this.bankStatementRef = bankStatementRef; }
    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Long getVersion() { return version; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

