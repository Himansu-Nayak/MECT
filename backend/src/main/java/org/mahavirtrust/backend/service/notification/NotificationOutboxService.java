package org.mahavirtrust.backend.service.notification;

import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
public class NotificationOutboxService {

    private static final Logger log = LoggerFactory.getLogger(NotificationOutboxService.class);

    private final NotificationOutboxRepository outboxRepository;
    private final NotificationDeliveryLogRepository deliveryLogRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final CommunicationConsentRepository consentRepository;
    private final DonationReceiptRepository receiptRepository;
    private final EmailProvider emailProvider;
    private final WhatsAppProvider whatsAppProvider;
    private final EmailTemplateRenderer emailRenderer;
    private final ObjectMapper objectMapper;

    private final String fromNotifications;
    private final String fromDonations;
    private final String publicBaseUrl;
    private final String whatsappWelcomeTemplate;
    private final String whatsappDonationTemplate;
    private final boolean schedulingEnabled;

    public NotificationOutboxService(
            NotificationOutboxRepository outboxRepository,
            NotificationDeliveryLogRepository deliveryLogRepository,
            NotificationPreferenceRepository preferenceRepository,
            CommunicationConsentRepository consentRepository,
            DonationReceiptRepository receiptRepository,
            EmailProvider emailProvider,
            WhatsAppProvider whatsAppProvider,
            EmailTemplateRenderer emailRenderer,
            ObjectMapper objectMapper,
            @Value("${app.resend.from-notifications:MECT Notifications <notifications@mect.org.in>}") String fromNotifications,
            @Value("${app.resend.from-donations:MECT Donations <donations@mect.org.in>}") String fromDonations,
            @Value("${app.resend.public-base-url:https://mect.org.in}") String publicBaseUrl,
            @Value("${app.whatsapp.welcome-template:}") String whatsappWelcomeTemplate,
            @Value("${app.whatsapp.donation-template:}") String whatsappDonationTemplate,
            @Value("${app.scheduling.enabled:true}") boolean schedulingEnabled) {
        this.outboxRepository = outboxRepository;
        this.deliveryLogRepository = deliveryLogRepository;
        this.preferenceRepository = preferenceRepository;
        this.consentRepository = consentRepository;
        this.receiptRepository = receiptRepository;
        this.emailProvider = emailProvider;
        this.whatsAppProvider = whatsAppProvider;
        this.emailRenderer = emailRenderer;
        this.objectMapper = objectMapper;
        this.fromNotifications = fromNotifications;
        this.fromDonations = fromDonations;
        this.publicBaseUrl = publicBaseUrl;
        this.whatsappWelcomeTemplate = whatsappWelcomeTemplate != null ? whatsappWelcomeTemplate : "";
        this.whatsappDonationTemplate = whatsappDonationTemplate != null ? whatsappDonationTemplate : "";
        this.schedulingEnabled = schedulingEnabled;
    }

    public NotificationOutbox enqueueEmail(
            String eventKey,
            String eventType,
            Long portalUserId,
            Long donationId,
            String recipientEmail,
            boolean isDonationSender,
            EmailTemplateRenderer.RenderedEmail rendered,
            Long attachmentReceiptId,
            Map<String, Object> extraPayload) {

        if (recipientEmail == null || recipientEmail.isBlank()) {
            return null;
        }
        if (outboxRepository.existsByEventKey(eventKey)) {
            return null;
        }

        boolean suppressed = shouldSuppressEmail(portalUserId, eventType);

        NotificationOutbox outbox = new NotificationOutbox();
        outbox.setEventKey(eventKey);
        outbox.setEventType(eventType);
        outbox.setPortalUserId(portalUserId);
        outbox.setDonationId(donationId);
        outbox.setChannel("EMAIL");
        outbox.setRecipient(recipientEmail.trim());
        outbox.setSenderIdentity(isDonationSender ? fromDonations : fromNotifications);
        outbox.setSubject(rendered.subject());
        outbox.setTemplateCode(rendered.templateVersion());
        outbox.setAttachmentReceiptId(attachmentReceiptId);
        outbox.setPayloadJson(writeJsonSafe(Map.of("html", rendered.htmlBody(), "meta", extraPayload != null ? extraPayload : Map.of())));

        if (suppressed) {
            outbox.setStatus("SUPPRESSED");
            outbox.setLastError("Suppressed due to user notification preferences.");
            return outboxRepository.save(outbox);
        }

        outbox.setStatus("QUEUED");
        outbox.setNextRetryAt(Instant.now());
        NotificationOutbox saved = outboxRepository.save(outbox);
        dispatchSingleSafe(saved);
        return saved;
    }

    public NotificationOutbox enqueueWhatsAppIfConsented(
            String eventKey,
            String eventType,
            Long portalUserId,
            Long donationId,
            List<String> templateParams) {

        if (portalUserId == null || outboxRepository.existsByEventKey(eventKey)) {
            return null;
        }

        CommunicationConsent consent = consentRepository.findByPortalUserIdAndChannel(portalUserId, "WHATSAPP").orElse(null);
        if (consent == null || !"OPTED_IN".equals(consent.getConsentStatus()) || consent.getPhoneNumber() == null || consent.getPhoneNumber().isBlank()) {
            return null;
        }

        String templateName = "DONATION_CONFIRMED_WHATSAPP".equals(eventType) ? whatsappDonationTemplate : whatsappWelcomeTemplate;
        NotificationOutbox outbox = new NotificationOutbox();
        outbox.setEventKey(eventKey);
        outbox.setEventType(eventType);
        outbox.setPortalUserId(portalUserId);
        outbox.setDonationId(donationId);
        outbox.setChannel("WHATSAPP");
        outbox.setRecipient(consent.getPhoneNumber());
        outbox.setSenderIdentity(whatsAppProvider.getProviderName());
        outbox.setSubject(eventType);
        outbox.setTemplateCode(templateName.isBlank() ? "UNAPPROVED_TEMPLATE" : templateName);
        outbox.setPayloadJson(writeJsonSafe(Map.of("params", templateParams)));
        outbox.setStatus("QUEUED");
        outbox.setNextRetryAt(Instant.now());

        NotificationOutbox saved = outboxRepository.save(outbox);
        dispatchSingleSafe(saved);
        return saved;
    }

    @Transactional
    public void dispatchSingleSafe(NotificationOutbox outbox) {
        try {
            outbox.setStatus("PROCESSING");
            outboxRepository.save(outbox);

            if ("EMAIL".equals(outbox.getChannel())) {
                JsonNode root = objectMapper.readTree(outbox.getPayloadJson());
                String html = root.path("html").asString("");
                byte[] pdfBytes = null;
                String filename = null;
                if (outbox.getAttachmentReceiptId() != null) {
                    DonationReceipt receipt = receiptRepository.findById(outbox.getAttachmentReceiptId()).orElse(null);
                    if (receipt != null) {
                        pdfBytes = receipt.getPdfBytes();
                        filename = receipt.getReceiptNumber() + ".pdf";
                    }
                }
                ProviderDispatchResult result = emailProvider.sendEmail(
                        outbox.getSenderIdentity(),
                        outbox.getRecipient(),
                        outbox.getSubject(),
                        html,
                        pdfBytes,
                        filename,
                        Map.of("eventType", outbox.getEventType())
                );
                recordAttempt(outbox, emailProvider.getProviderName(), result);
            } else if ("WHATSAPP".equals(outbox.getChannel())) {
                JsonNode root = objectMapper.readTree(outbox.getPayloadJson());
                List<String> params = new java.util.ArrayList<>();
                if (root.has("params") && root.get("params").isArray()) {
                    for (JsonNode p : root.get("params")) {
                        params.add(p.asString(""));
                    }
                }
                String tpl = "UNAPPROVED_TEMPLATE".equals(outbox.getTemplateCode()) ? "" : outbox.getTemplateCode();
                ProviderDispatchResult result = whatsAppProvider.sendTemplateMessage(outbox.getRecipient(), tpl, "en", params);
                recordAttempt(outbox, whatsAppProvider.getProviderName(), result);
            }
        } catch (Exception ex) {
            log.warn("Isolated notification dispatch error (outboxId={}): {}", outbox.getId(), ex.getMessage());
            recordAttempt(outbox, outbox.getChannel(), ProviderDispatchResult.failed(ex.getMessage()));
        }
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void retryScheduledOutboxItems() {
        if (!schedulingEnabled) {
            return;
        }
        List<NotificationOutbox> due = outboxRepository.findTop25ByStatusInAndNextRetryAtBeforeOrderByCreatedAtAsc(
                List.of("QUEUED", "RETRY_SCHEDULED"), Instant.now());
        for (NotificationOutbox item : due) {
            dispatchSingleSafe(item);
        }
    }

    @Transactional
    public boolean recordWebhookDeliveryUpdate(String channel, String provider, String providerMessageId, String deliveryStatus, String rawPayload, String webhookEventId) {
        if (webhookEventId != null && !webhookEventId.isBlank() && deliveryLogRepository.existsByWebhookEventId(webhookEventId)) {
            return false;
        }
        if (providerMessageId == null || providerMessageId.isBlank()) {
            return false;
        }
        NotificationOutbox outbox = outboxRepository.findByProviderMessageId(providerMessageId).orElse(null);
        if (outbox == null) {
            return false;
        }
        NotificationDeliveryLog logEntry = new NotificationDeliveryLog();
        logEntry.setOutbox(outbox);
        logEntry.setChannel(channel);
        logEntry.setProvider(provider);
        logEntry.setProviderMessageId(providerMessageId);
        logEntry.setDeliveryStatus(deliveryStatus);
        logEntry.setProviderResponse(rawPayload);
        logEntry.setWebhookEventId(webhookEventId);
        deliveryLogRepository.save(logEntry);

        if ("email.bounced".equalsIgnoreCase(deliveryStatus) || "email.complained".equalsIgnoreCase(deliveryStatus)) {
            outbox.setLastError(truncate("RESEND_WEBHOOK_" + deliveryStatus.toUpperCase()));
            outboxRepository.save(outbox);
        }
        return true;
    }

    private void recordAttempt(NotificationOutbox outbox, String provider, ProviderDispatchResult result) {
        String status = result.status();
        if ("SENT".equals(status)) {
            outbox.setStatus("SENT");
            outbox.setProviderMessageId(result.providerMessageId());
            outbox.setNextRetryAt(null);
            outbox.setLastError(null);
        } else if ("REQUIRES_PROVIDER_CONFIG".equals(status) || "REQUIRES_TEMPLATE_APPROVAL".equals(status)) {
            outbox.setStatus(status);
            outbox.setNextRetryAt(null);
            outbox.setLastError(truncate(result.errorMessage()));
        } else {
            int nextRetries = outbox.getRetryCount() + 1;
            outbox.setRetryCount(nextRetries);
            outbox.setLastError(truncate(result.errorMessage()));
            if (nextRetries >= outbox.getMaxRetries()) {
                outbox.setStatus("FAILED");
                outbox.setNextRetryAt(null);
            } else {
                outbox.setStatus("RETRY_SCHEDULED");
                long delayMinutes = nextRetries == 1 ? 1L : (nextRetries == 2 ? 5L : 15L);
                outbox.setNextRetryAt(Instant.now().plus(delayMinutes, ChronoUnit.MINUTES));
            }
        }
        outboxRepository.save(outbox);

        NotificationDeliveryLog entry = new NotificationDeliveryLog();
        entry.setOutbox(outbox);
        entry.setChannel(outbox.getChannel());
        entry.setProvider(provider);
        entry.setProviderMessageId(result.providerMessageId());
        entry.setDeliveryStatus(outbox.getStatus());
        entry.setProviderResponse(result.rawResponse());
        deliveryLogRepository.save(entry);
    }

    private boolean shouldSuppressEmail(Long portalUserId, String eventType) {
        if (portalUserId == null) {
            return false;
        }
        // Mandatory transactional confirmations / security alerts / OTPs are never suppressed
        if (eventType.contains("SECURITY") || eventType.contains("FAILED") || eventType.contains("REFUND")) {
            return false;
        }
        NotificationPreference pref = preferenceRepository.findByPortalUserId(portalUserId).orElse(null);
        if (pref == null) {
            return false;
        }
        if (eventType.contains("RECEIPT") || eventType.contains("DONATION")) {
            return !pref.isEmailReceiptsEnabled();
        }
        if (eventType.contains("WELCOME") || eventType.contains("PROFILE")) {
            return !pref.isEmailUpdatesEnabled();
        }
        return false;
    }

    public EmailTemplateRenderer getEmailRenderer() {
        return emailRenderer;
    }

    public String getPublicBaseUrl() {
        return publicBaseUrl;
    }

    private String writeJsonSafe(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }

    private String truncate(String s) {
        if (s == null) return null;
        return s.length() > 480 ? s.substring(0, 480) : s;
    }
}

