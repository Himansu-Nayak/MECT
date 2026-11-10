package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.PaymentEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentEventRepository extends JpaRepository<PaymentEvent, Long> {
    boolean existsByProviderEventId(String providerEventId);
    Optional<PaymentEvent> findByProviderEventId(String providerEventId);
}

