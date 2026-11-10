package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "donation_receipts")
public class DonationReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "donation_id", nullable = false, unique = true)
    private Donation donation;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 40)
    private String receiptNumber;

    @Column(name = "donor_display_name", nullable = false, length = 160)
    private String donorDisplayName;

    @Column(name = "programme_name", nullable = false, length = 160)
    private String programmeName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "receipt_type", nullable = false, length = 50)
    private String receiptType = "INSTITUTIONAL_PAYMENT_RECEIPT";

    @Column(name = "statutory_note", nullable = false, columnDefinition = "TEXT")
    private String statutoryNote;

    @Column(name = "template_version", nullable = false, length = 30)
    private String templateVersion = "v1.0";

    @Column(name = "pdf_bytes", nullable = false)
    private byte[] pdfBytes;

    @Column(name = "pdf_sha256", nullable = false, length = 64)
    private String pdfSha256;

    @Column(name = "issued_at", nullable = false, updatable = false)
    private Instant issuedAt = Instant.now();

    public Long getId() { return id; }
    public Donation getDonation() { return donation; }
    public void setDonation(Donation donation) { this.donation = donation; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    public String getDonorDisplayName() { return donorDisplayName; }
    public void setDonorDisplayName(String donorDisplayName) { this.donorDisplayName = donorDisplayName; }
    public String getProgrammeName() { return programmeName; }
    public void setProgrammeName(String programmeName) { this.programmeName = programmeName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getReceiptType() { return receiptType; }
    public void setReceiptType(String receiptType) { this.receiptType = receiptType; }
    public String getStatutoryNote() { return statutoryNote; }
    public void setStatutoryNote(String statutoryNote) { this.statutoryNote = statutoryNote; }
    public String getTemplateVersion() { return templateVersion; }
    public void setTemplateVersion(String templateVersion) { this.templateVersion = templateVersion; }
    public byte[] getPdfBytes() { return pdfBytes; }
    public void setPdfBytes(byte[] pdfBytes) { this.pdfBytes = pdfBytes; }
    public String getPdfSha256() { return pdfSha256; }
    public void setPdfSha256(String pdfSha256) { this.pdfSha256 = pdfSha256; }
    public Instant getIssuedAt() { return issuedAt; }
}

