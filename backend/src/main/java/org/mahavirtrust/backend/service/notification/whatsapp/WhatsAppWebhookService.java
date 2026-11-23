package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.WhatsAppWebhookEvent;
import org.mahavirtrust.backend.repository.WhatsAppWebhookEventRepository;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;

@Service
public class WhatsAppWebhookService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppWebhookService.class);

    private final WhatsAppProvider whatsAppProvider;
    private final WhatsAppMessageLogService logService;
    private final WhatsAppWebhookEventRepository webhookEventRepository;
    private final NotificationOutboxService outboxService;
    private final ObjectMapper objectMapper;

    public WhatsAppWebhookService(
            WhatsAppProvider whatsAppProvider,
            WhatsAppMessageLogService logService,
            WhatsAppWebhookEventRepository webhookEventRepository,
            NotificationOutboxService outboxService,
            ObjectMapper objectMapper) {
        this.whatsAppProvider = whatsAppProvider;
        this.logService = logService;
        this.webhookEventRepository = webhookEventRepository;
        this.outboxService = outboxService;
        this.objectMapper = objectMapper;
    }

    public boolean verifyChallenge(String mode, String token, String challenge) {
        String expected = whatsAppProvider.getWebhookVerifyToken();
        return "subscribe".equals(mode) && !expected.isBlank() && expected.equals(token) && challenge != null;
    }

    public boolean verifySignature(String payload, String signatureHeader) {
        return whatsAppProvider.verifyWebhookSignature(payload, signatureHeader);
    }

    @Transactional
    public void processPayload(String rawPayload) {
        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            if (!root.has("entry") || !root.get("entry").isArray()) {
                return;
            }

            for (JsonNode entry : root.get("entry")) {
                JsonNode changes = entry.path("changes");
                if (!changes.isArray()) continue;

                for (JsonNode change : changes) {
                    JsonNode value = change.path("value");
                    JsonNode statuses = value.path("statuses");
                    if (!statuses.isArray()) continue;

                    for (JsonNode st : statuses) {
                        String wamid = st.path("id").asString(null);
                        String statusVal = st.path("status").asString("unknown");
                        String recipientPhone = st.path("recipient_id").asString(null);
                        String eventId = (wamid != null ? wamid : "none") + ":" + statusVal;

                        // Deduplication check
                        if (webhookEventRepository.existsByEventId(eventId)) {
                            log.debug("WhatsApp webhook event already processed: {}", eventId);
                            continue;
                        }

                        WhatsAppWebhookEvent event = new WhatsAppWebhookEvent();
                        event.setEventId(eventId);
                        event.setEventType("messages.status");
                        event.setWamid(wamid);
                        event.setStatus(statusVal);
                        event.setRecipientPhone(recipientPhone);
                        event.setPayloadJson(st.toString());

                        String errorCode = null;
                        String errorMessage = null;
                        if (st.has("errors") && st.get("errors").isArray() && !st.get("errors").isEmpty()) {
                            JsonNode errNode = st.get("errors").get(0);
                            errorCode = errNode.path("code").asString(null);
                            errorMessage = errNode.path("message").asString(null);
                            event.setErrorMessage(errorCode + ": " + errorMessage);
                        }

                        event.setProcessed(true);
                        event.setProcessedAt(Instant.now());
                        webhookEventRepository.save(event);

                        // Update delivery logs & message logs
                        logService.updateDeliveryStatus(wamid, statusVal, errorCode, errorMessage);
                        outboxService.recordWebhookDeliveryUpdate("WHATSAPP", "META_CLOUD", wamid, statusVal, rawPayload, eventId);
                    }
                }
            }
        } catch (Exception ex) {
            log.error("Error processing WhatsApp webhook payload: {}", ex.getMessage(), ex);
            throw new RuntimeException("Webhook processing failure: " + ex.getMessage(), ex);
        }
    }
}
