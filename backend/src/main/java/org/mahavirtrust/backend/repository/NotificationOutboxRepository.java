package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.NotificationOutbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationOutboxRepository extends JpaRepository<NotificationOutbox, Long> {
    boolean existsByEventKey(String eventKey);
    Optional<NotificationOutbox> findByProviderMessageId(String providerMessageId);
    List<NotificationOutbox> findTop25ByStatusInAndNextRetryAtBeforeOrderByCreatedAtAsc(
            List<String> statuses, Instant now);
    List<NotificationOutbox> findByDonationIdOrderByCreatedAtDesc(Long donationId);
    Page<NotificationOutbox> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

