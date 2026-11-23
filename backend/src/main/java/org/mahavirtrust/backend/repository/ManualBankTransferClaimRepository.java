package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.ManualBankTransferClaim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManualBankTransferClaimRepository extends JpaRepository<ManualBankTransferClaim, Long> {
    Optional<ManualBankTransferClaim> findByClaimReference(String claimReference);
    Optional<ManualBankTransferClaim> findByUtrNormalized(String utrNormalized);
    List<ManualBankTransferClaim> findByDonationIdOrderByCreatedAtDesc(Long donationId);
    Page<ManualBankTransferClaim> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<ManualBankTransferClaim> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(String status);
}

