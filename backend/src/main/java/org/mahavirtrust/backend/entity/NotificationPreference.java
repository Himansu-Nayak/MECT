package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "portal_user_id", nullable = false, unique = true)
    private PortalUser portalUser;

    @Column(name = "email_receipts_enabled", nullable = false)
    private boolean emailReceiptsEnabled = true;

    @Column(name = "email_updates_enabled", nullable = false)
    private boolean emailUpdatesEnabled = true;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public PortalUser getPortalUser() { return portalUser; }
    public void setPortalUser(PortalUser portalUser) { this.portalUser = portalUser; }
    public boolean isEmailReceiptsEnabled() { return emailReceiptsEnabled; }
    public void setEmailReceiptsEnabled(boolean emailReceiptsEnabled) { this.emailReceiptsEnabled = emailReceiptsEnabled; }
    public boolean isEmailUpdatesEnabled() { return emailUpdatesEnabled; }
    public void setEmailUpdatesEnabled(boolean emailUpdatesEnabled) { this.emailUpdatesEnabled = emailUpdatesEnabled; }
    public Instant getUpdatedAt() { return updatedAt; }
}

