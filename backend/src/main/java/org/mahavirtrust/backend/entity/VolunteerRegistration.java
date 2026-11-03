package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "volunteer_registrations")
public class VolunteerRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "role_interest", nullable = false, length = 50)
    private String roleInterest;

    @Column(name = "background_notes", columnDefinition = "TEXT")
    private String backgroundNotes;

    @Column(length = 100)
    private String district;

    @Column(name = "consent_declared", nullable = false)
    private Boolean consentDeclared = false;

    @Column(name = "consent_statement", length = 255)
    private String consentStatement;

    @Column(name = "consent_version", length = 50)
    private String consentVersion;

    @Column(name = "consent_timestamp")
    private Instant consentTimestamp;

    @Column(length = 50)
    private String availability;

    @Column(length = 100)
    private String qualification;

    @Column(name = "engagement_mode", length = 30)
    private String engagementMode;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "AWAITING_ORIENTATION";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public VolunteerRegistration() {}

    public VolunteerRegistration(String fullName, String email, String phone, String roleInterest, String backgroundNotes) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.roleInterest = roleInterest;
        this.backgroundNotes = backgroundNotes;
        this.verificationStatus = "AWAITING_ORIENTATION";
        this.createdAt = Instant.now();
    }

    public VolunteerRegistration(String fullName, String email, String phone, String roleInterest, 
                                 String district, String availability, String qualification, 
                                 String engagementMode, String backgroundNotes, 
                                 Boolean consentDeclared, String consentStatement, 
                                 String consentVersion, Instant consentTimestamp) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.roleInterest = roleInterest;
        this.district = district;
        this.availability = availability;
        this.qualification = qualification;
        this.engagementMode = engagementMode;
        this.backgroundNotes = backgroundNotes;
        this.consentDeclared = consentDeclared != null ? consentDeclared : false;
        this.consentStatement = consentStatement;
        this.consentVersion = consentVersion;
        this.consentTimestamp = consentTimestamp;
        this.verificationStatus = "AWAITING_ORIENTATION";
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRoleInterest() {
        return roleInterest;
    }

    public void setRoleInterest(String roleInterest) {
        this.roleInterest = roleInterest;
    }

    public String getBackgroundNotes() {
        return backgroundNotes;
    }

    public void setBackgroundNotes(String backgroundNotes) {
        this.backgroundNotes = backgroundNotes;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Boolean getConsentDeclared() {
        return consentDeclared;
    }

    public void setConsentDeclared(Boolean consentDeclared) {
        this.consentDeclared = consentDeclared;
    }

    public String getConsentStatement() {
        return consentStatement;
    }

    public void setConsentStatement(String consentStatement) {
        this.consentStatement = consentStatement;
    }

    public String getConsentVersion() {
        return consentVersion;
    }

    public void setConsentVersion(String consentVersion) {
        this.consentVersion = consentVersion;
    }

    public Instant getConsentTimestamp() {
        return consentTimestamp;
    }

    public void setConsentTimestamp(Instant consentTimestamp) {
        this.consentTimestamp = consentTimestamp;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getEngagementMode() {
        return engagementMode;
    }

    public void setEngagementMode(String engagementMode) {
        this.engagementMode = engagementMode;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
