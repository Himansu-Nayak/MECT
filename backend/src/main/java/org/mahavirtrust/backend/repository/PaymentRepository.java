package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findTopByDonationIdOrderByCreatedAtDesc(Long donationId);
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByProviderAndProviderOrderId(String provider, String providerOrderId);

    @Query("SELECT p FROM Payment p WHERE p.providerOrderId = :orderId")
    Optional<Payment> findByProviderOrderIdForUpdate(@Param("orderId") String orderId);

    Optional<Payment> findByProviderQrId(String providerQrId);
    Optional<Payment> findByProviderPaymentId(String providerPaymentId);
    List<Payment> findByStatusInAndExpiresAtBefore(List<String> statuses, Instant cutoff);
    List<Payment> findByProviderAndStatusInAndCreatedAtBefore(String provider, List<String> statuses, Instant cutoff);
}
