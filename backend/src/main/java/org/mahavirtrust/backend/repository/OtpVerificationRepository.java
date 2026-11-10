package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByChannelAndTargetValueAndPurposeOrderByIdDesc(
            String channel, String targetValue, String purpose);
    long countByChannelAndTargetValueAndCreatedAtAfter(String channel, String targetValue, Instant since);
    void deleteByExpiresAtBefore(Instant cutoff);
}

