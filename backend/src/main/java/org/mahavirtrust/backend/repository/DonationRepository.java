package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Optional<Donation> findByDonationReference(String donationReference);
    List<Donation> findByPortalUserIdOrderByCreatedAtDesc(Long portalUserId);
    List<Donation> findByDonorEmailIgnoreCaseAndPortalUserIsNull(String donorEmail);
    List<Donation> findByDonorPhoneAndPortalUserIsNull(String donorPhone);
    Page<Donation> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<Donation> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.portalUser.id = :userId AND d.status = 'SUCCESSFUL'")
    BigDecimal sumSuccessfulAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Donation d WHERE d.portalUser.id = :userId AND d.status = 'SUCCESSFUL'")
    long countSuccessfulByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.status = 'SUCCESSFUL'")
    BigDecimal sumTotalSuccessfulAmount();

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.status = 'SUCCESSFUL' AND d.confirmedAt >= :since")
    BigDecimal sumSuccessfulAmountSince(@Param("since") Instant since);

    long countByStatus(String status);
}

