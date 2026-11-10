package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PortalVerifiedContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortalVerifiedContactRepository extends JpaRepository<PortalVerifiedContact, Long> {
    List<PortalVerifiedContact> findByPortalUserIdOrderByVerifiedAtAsc(Long portalUserId);
    Optional<PortalVerifiedContact> findByContactTypeAndContactValueIgnoreCase(String contactType, String contactValue);
    boolean existsByContactTypeAndContactValueIgnoreCase(String contactType, String contactValue);
}

