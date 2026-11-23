package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.WhatsAppWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppWebhookEventRepository extends JpaRepository<WhatsAppWebhookEvent, Long> {
    boolean existsByEventId(String eventId);
    Optional<WhatsAppWebhookEvent> findByEventId(String eventId);
    List<WhatsAppWebhookEvent> findByWamid(String wamid);
    List<WhatsAppWebhookEvent> findByProcessedFalse();
}
