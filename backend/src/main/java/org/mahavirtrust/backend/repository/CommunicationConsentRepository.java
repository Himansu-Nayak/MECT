package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.CommunicationConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunicationConsentRepository extends JpaRepository<CommunicationConsent, Long> {
    Optional<CommunicationConsent> findByPortalUserIdAndChannel(Long portalUserId, String channel);
    List<CommunicationConsent> findByPortalUserId(Long portalUserId);
}

