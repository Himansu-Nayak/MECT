package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findTopByDonationIdOrderByCreatedAtDesc(Long donationId);
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByProviderQrId(String providerQrId);
    Optional<Payment> findByProviderPaymentId(String providerPaymentId);
    List<Payment> findByStatusInAndExpiresAtBefore(List<String> statuses, Instant cutoff);
}

