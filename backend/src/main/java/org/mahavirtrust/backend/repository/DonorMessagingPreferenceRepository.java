package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.DonorMessagingPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DonorMessagingPreferenceRepository extends JpaRepository<DonorMessagingPreference, Long> {
    Optional<DonorMessagingPreference> findByDonorPhone(String donorPhone);
    Optional<DonorMessagingPreference> findByPortalUserId(Long portalUserId);
    boolean existsByDonorPhone(String donorPhone);
}
