package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PortalRoleName;
import org.mahavirtrust.backend.entity.PortalUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortalUserRoleRepository extends JpaRepository<PortalUserRole, Long> {
    List<PortalUserRole> findByPortalUserId(Long portalUserId);
    boolean existsByPortalUserIdAndRoleName(Long portalUserId, PortalRoleName roleName);
}

