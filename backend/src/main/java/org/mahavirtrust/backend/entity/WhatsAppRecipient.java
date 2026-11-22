package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "whatsapp_recipients")
public class WhatsAppRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, unique = true, length = 30)
    private String phoneNumber;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 50)
    private String role = "ADMIN";

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "notify_on_donation", nullable = false)
    private boolean notifyOnDonation = true;

    @Column(name = "notify_on_claim", nullable = false)
    private boolean notifyOnClaim = true;

    @Column(name = "notify_on_refund", nullable = false)
    private boolean notifyOnRefund = true;

    @Column(name = "notify_daily_summary", nullable = false)
    private boolean notifyDailySummary = false;

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

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isNotifyOnDonation() { return notifyOnDonation; }
    public void setNotifyOnDonation(boolean notifyOnDonation) { this.notifyOnDonation = notifyOnDonation; }

    public boolean isNotifyOnClaim() { return notifyOnClaim; }
    public void setNotifyOnClaim(boolean notifyOnClaim) { this.notifyOnClaim = notifyOnClaim; }

    public boolean isNotifyOnRefund() { return notifyOnRefund; }
    public void setNotifyOnRefund(boolean notifyOnRefund) { this.notifyOnRefund = notifyOnRefund; }

    public boolean isNotifyDailySummary() { return notifyDailySummary; }
    public void setNotifyDailySummary(boolean notifyDailySummary) { this.notifyDailySummary = notifyDailySummary; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
