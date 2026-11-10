package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "portal_verified_contacts")
public class PortalVerifiedContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "portal_user_id", nullable = false)
    private PortalUser portalUser;

    @Column(name = "contact_type", nullable = false, length = 20)
    private String contactType;

    @Column(name = "contact_value", nullable = false, length = 255)
    private String contactValue;

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary = false;

    @Column(name = "verified_at", nullable = false, updatable = false)
    private Instant verifiedAt = Instant.now();

    public PortalVerifiedContact() {}

    public PortalVerifiedContact(PortalUser portalUser, String contactType, String contactValue, boolean isPrimary) {
        this.portalUser = portalUser;
        this.contactType = contactType;
        this.contactValue = contactValue;
        this.isPrimary = isPrimary;
    }

    public Long getId() { return id; }
    public PortalUser getPortalUser() { return portalUser; }
    public String getContactType() { return contactType; }
    public String getContactValue() { return contactValue; }
    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }
    public Instant getVerifiedAt() { return verifiedAt; }
}

