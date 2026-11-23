package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.NotificationDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationDeliveryLogRepository extends JpaRepository<NotificationDeliveryLog, Long> {
    List<NotificationDeliveryLog> findByOutboxIdOrderByLoggedAtDesc(Long outboxId);
    boolean existsByWebhookEventId(String webhookEventId);
}

