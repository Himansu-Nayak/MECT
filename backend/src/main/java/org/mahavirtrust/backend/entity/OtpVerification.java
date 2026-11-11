package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String purpose;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(name = "target_value", nullable = false, length = 255)
    private String targetValue;

    @Column(name = "portal_user_id")
    private Long portalUserId;

    @Column(name = "otp_hash", nullable = false, length = 255)
    private String otpHash;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts = 5;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "resend_available_at", nullable = false)
    private Instant resendAvailableAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "request_ip", length = 60)
    private String requestIp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getTargetValue() { return targetValue; }
    public void setTargetValue(String targetValue) { this.targetValue = targetValue; }
    public Long getPortalUserId() { return portalUserId; }
    public void setPortalUserId(Long portalUserId) { this.portalUserId = portalUserId; }
    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }
    public int getAttempts() { return attempts; }
    public void setAttempts(int attempts) { this.attempts = attempts; }
    public int getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(int maxAttempts) { this.maxAttempts = maxAttempts; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getResendAvailableAt() { return resendAvailableAt; }
    public void setResendAvailableAt(Instant resendAvailableAt) { this.resendAvailableAt = resendAvailableAt; }
    public Instant getUsedAt() { return usedAt; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
    public String getRequestIp() { return requestIp; }
    public void setRequestIp(String requestIp) { this.requestIp = requestIp; }
    public Instant getCreatedAt() { return createdAt; }
}

