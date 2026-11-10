package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "communication_consents")
public class CommunicationConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "portal_user_id", nullable = false)
    private PortalUser portalUser;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "consent_status", nullable = false, length = 20)
    private String consentStatus;

    @Column(name = "consent_version", nullable = false, length = 30)
    private String consentVersion;

    @Column(name = "consent_source", nullable = false, length = 60)
    private String consentSource;

    @Column(name = "consent_text", nullable = false, columnDefinition = "TEXT")
    private String consentText;

    @Column(name = "consented_at")
    private Instant consentedAt;

    @Column(name = "opt_out_at")
    private Instant optOutAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public PortalUser getPortalUser() { return portalUser; }
    public void setPortalUser(PortalUser portalUser) { this.portalUser = portalUser; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getConsentStatus() { return consentStatus; }
    public void setConsentStatus(String consentStatus) { this.consentStatus = consentStatus; }
    public String getConsentVersion() { return consentVersion; }
    public void setConsentVersion(String consentVersion) { this.consentVersion = consentVersion; }
    public String getConsentSource() { return consentSource; }
    public void setConsentSource(String consentSource) { this.consentSource = consentSource; }
    public String getConsentText() { return consentText; }
    public void setConsentText(String consentText) { this.consentText = consentText; }
    public Instant getConsentedAt() { return consentedAt; }
    public void setConsentedAt(Instant consentedAt) { this.consentedAt = consentedAt; }
    public Instant getOptOutAt() { return optOutAt; }
    public void setOptOutAt(Instant optOutAt) { this.optOutAt = optOutAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

