package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.HimPaymentAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HimPaymentAttemptRepository extends JpaRepository<HimPaymentAttempt, Long> {
    Optional<HimPaymentAttempt> findByAttemptReference(String attemptReference);
    Optional<HimPaymentAttempt> findByIdempotencyKey(String idempotencyKey);
    Optional<HimPaymentAttempt> findByDonorUtrNormalized(String donorUtrNormalized);
    List<HimPaymentAttempt> findByDonationIdOrderByCreatedAtDesc(Long donationId);
    Page<HimPaymentAttempt> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<HimPaymentAttempt> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

