package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PortalUserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortalUserProfileRepository extends JpaRepository<PortalUserProfile, Long> {
    Optional<PortalUserProfile> findByPortalUserId(Long portalUserId);
}

