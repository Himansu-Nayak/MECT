package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.NotificationOutbox;
import org.mahavirtrust.backend.entity.WhatsAppMessageLog;
import org.mahavirtrust.backend.repository.WhatsAppMessageLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class WhatsAppMessageLogService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppMessageLogService.class);

    private final WhatsAppMessageLogRepository messageLogRepository;

    public WhatsAppMessageLogService(WhatsAppMessageLogRepository messageLogRepository) {
        this.messageLogRepository = messageLogRepository;
    }

    @Transactional
    public WhatsAppMessageLog recordQueued(
            NotificationOutbox outbox,
            String recipientPhone,
            String recipientType,
            String templateName,
            String eventType,
            Donation donation,
            String rawPayload) {

        WhatsAppMessageLog logEntry = new WhatsAppMessageLog();
        logEntry.setOutbox(outbox);
        logEntry.setRecipientPhone(WhatsAppCloudApiClient.sanitizePhoneNumber(recipientPhone));
        logEntry.setRecipientType(recipientType != null ? recipientType : "DONOR");
        logEntry.setTemplateName(templateName);
        logEntry.setEventType(eventType);
        logEntry.setDonation(donation);
        logEntry.setStatus("QUEUED");
        logEntry.setRawPayload(rawPayload);

        return messageLogRepository.save(logEntry);
    }

    @Transactional
    public void recordDispatched(Long logId, String wamid, String rawResponse) {
        if (logId == null) return;
        messageLogRepository.findById(logId).ifPresent(entry -> {
            entry.setWamid(wamid);
            entry.setStatus("SENT");
            entry.setSentAt(Instant.now());
            entry.setRawPayload(rawResponse);
            messageLogRepository.save(entry);
        });
    }

    @Transactional
    public void updateDeliveryStatus(String wamid, String status, String errorCode, String errorMessage) {
        if (wamid == null || wamid.isBlank()) return;

        Optional<WhatsAppMessageLog> existing = messageLogRepository.findByWamid(wamid);
        if (existing.isPresent()) {
            WhatsAppMessageLog entry = existing.get();
            String st = status != null ? status.toUpperCase() : "UNKNOWN";
            entry.setStatus(st);
            if ("DELIVERED".equals(st)) {
                entry.setDeliveredAt(Instant.now());
            } else if ("READ".equals(st)) {
                if (entry.getDeliveredAt() == null) {
                    entry.setDeliveredAt(Instant.now());
                }
                entry.setReadAt(Instant.now());
            } else if ("FAILED".equals(st)) {
                entry.setErrorCode(errorCode);
                entry.setErrorMessage(errorMessage);
            }
            messageLogRepository.save(entry);
        } else {
            log.debug("No WhatsApp message log found for wamid: {}", wamid);
        }
    }

    public List<WhatsAppMessageLog> getRecentLogs() {
        return messageLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    public List<WhatsAppMessageLog> getLogsForDonation(Long donationId) {
        return messageLogRepository.findByDonationId(donationId);
    }

    public Map<String, Object> getMetrics() {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("total", messageLogRepository.count());
        metrics.put("sent", messageLogRepository.countByStatus("SENT"));
        metrics.put("delivered", messageLogRepository.countByStatus("DELIVERED"));
        metrics.put("read", messageLogRepository.countByStatus("READ"));
        metrics.put("failed", messageLogRepository.countByStatus("FAILED"));
        metrics.put("queued", messageLogRepository.countByStatus("QUEUED"));
        return metrics;
    }
}
