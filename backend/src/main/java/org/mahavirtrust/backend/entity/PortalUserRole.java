package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "portal_user_roles")
public class PortalUserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "portal_user_id", nullable = false)
    private PortalUser portalUser;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false, length = 40)
    private PortalRoleName roleName;

    @Column(name = "granted_at", nullable = false, updatable = false)
    private Instant grantedAt = Instant.now();

    public PortalUserRole() {}

    public PortalUserRole(PortalUser portalUser, PortalRoleName roleName) {
        this.portalUser = portalUser;
        this.roleName = roleName;
    }

    public Long getId() { return id; }
    public PortalUser getPortalUser() { return portalUser; }
    public PortalRoleName getRoleName() { return roleName; }
    public Instant getGrantedAt() { return grantedAt; }
}

