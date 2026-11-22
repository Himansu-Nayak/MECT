package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.WhatsAppMessageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppMessageLogRepository extends JpaRepository<WhatsAppMessageLog, Long> {
    Optional<WhatsAppMessageLog> findByWamid(String wamid);
    List<WhatsAppMessageLog> findByOutboxId(Long outboxId);
    List<WhatsAppMessageLog> findByDonationId(Long donationId);
    List<WhatsAppMessageLog> findTop100ByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
