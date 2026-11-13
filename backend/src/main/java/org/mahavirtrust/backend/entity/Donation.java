package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donation_reference", nullable = false, unique = true, length = 40)
    private String donationReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portal_user_id")
    private PortalUser portalUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "programme_id", nullable = false)
    private DonationProgramme programme;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(nullable = false, length = 20)
    private String frequency = "ONE_TIME";

    @Column(name = "donor_name", nullable = false, length = 160)
    private String donorName;

    @Column(name = "donor_email", length = 255)
    private String donorEmail;

    @Column(name = "donor_phone", length = 30)
    private String donorPhone;

    @Column(name = "donor_address", columnDefinition = "TEXT")
    private String donorAddress;

    @Column(name = "donor_pan", length = 16)
    private String donorPan;

    @Column(name = "dedication_message", length = 300)
    private String dedicationMessage;

    @Column(name = "is_anonymous", nullable = false)
    private boolean anonymous = false;

    @Column(name = "communication_consent", nullable = false)
    private boolean communicationConsent = false;

    @Column(nullable = false, length = 30)
    private String status = "CREATED";

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod = "UPI_QR";

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

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
    public String getDonationReference() { return donationReference; }
    public void setDonationReference(String donationReference) { this.donationReference = donationReference; }
    public PortalUser getPortalUser() { return portalUser; }
    public void setPortalUser(PortalUser portalUser) { this.portalUser = portalUser; }
    public DonationProgramme getProgramme() { return programme; }
    public void setProgramme(DonationProgramme programme) { this.programme = programme; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }
    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }
    public String getDonorAddress() { return donorAddress; }
    public void setDonorAddress(String donorAddress) { this.donorAddress = donorAddress; }
    public String getDonorPan() { return donorPan; }
    public void setDonorPan(String donorPan) { this.donorPan = donorPan; }
    public String getDedicationMessage() { return dedicationMessage; }
    public void setDedicationMessage(String dedicationMessage) { this.dedicationMessage = dedicationMessage; }
    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
    public boolean isCommunicationConsent() { return communicationConsent; }
    public void setCommunicationConsent(boolean communicationConsent) { this.communicationConsent = communicationConsent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Instant getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(Instant confirmedAt) { this.confirmedAt = confirmedAt; }
    public Long getVersion() { return version; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

