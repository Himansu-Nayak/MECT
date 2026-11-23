package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.HimWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HimWebhookEventRepository extends JpaRepository<HimWebhookEvent, Long> {
    Optional<HimWebhookEvent> findByDeliveryId(String deliveryId);
    boolean existsByDeliveryId(String deliveryId);
}

