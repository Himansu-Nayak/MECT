package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "donor_messaging_preferences")
public class DonorMessagingPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "donor_phone", nullable = false, unique = true, length = 30)
    private String donorPhone;

    @Column(name = "donor_email", length = 255)
    private String donorEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portal_user_id")
    private PortalUser portalUser;

    @Column(name = "whatsapp_consent", nullable = false)
    private boolean whatsappConsent = false;

    @Column(name = "sms_consent", nullable = false)
    private boolean smsConsent = false;

    @Column(name = "consent_timestamp")
    private Instant consentTimestamp;

    @Column(name = "consent_ip", length = 60)
    private String consentIp;

    @Column(name = "consent_source", length = 100)
    private String consentSource = "DONATION_CHECKOUT";

    @Column(name = "policy_version", length = 20)
    private String policyVersion = "v1.0";

    @Column(name = "opt_out_timestamp")
    private Instant optOutTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDonorPhone() { return donorPhone; }
    public void setDonorPhone(String donorPhone) { this.donorPhone = donorPhone; }

    public String getDonorEmail() { return donorEmail; }
    public void setDonorEmail(String donorEmail) { this.donorEmail = donorEmail; }

    public PortalUser getPortalUser() { return portalUser; }
    public void setPortalUser(PortalUser portalUser) { this.portalUser = portalUser; }

    public boolean isWhatsappConsent() { return whatsappConsent; }
    public void setWhatsappConsent(boolean whatsappConsent) { this.whatsappConsent = whatsappConsent; }

    public boolean isSmsConsent() { return smsConsent; }
    public void setSmsConsent(boolean smsConsent) { this.smsConsent = smsConsent; }

    public Instant getConsentTimestamp() { return consentTimestamp; }
    public void setConsentTimestamp(Instant consentTimestamp) { this.consentTimestamp = consentTimestamp; }

    public String getConsentIp() { return consentIp; }
    public void setConsentIp(String consentIp) { this.consentIp = consentIp; }

    public String getConsentSource() { return consentSource; }
    public void setConsentSource(String consentSource) { this.consentSource = consentSource; }

    public String getPolicyVersion() { return policyVersion; }
    public void setPolicyVersion(String policyVersion) { this.policyVersion = policyVersion; }

    public Instant getOptOutTimestamp() { return optOutTimestamp; }
    public void setOptOutTimestamp(Instant optOutTimestamp) { this.optOutTimestamp = optOutTimestamp; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
