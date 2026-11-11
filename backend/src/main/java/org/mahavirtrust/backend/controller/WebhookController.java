package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {

    private final DonationLifecycleService donationService;
    private final EmailProvider emailProvider;
    private final WhatsAppProvider whatsAppProvider;
    private final NotificationOutboxService outboxService;
    private final ObjectMapper objectMapper;
    private final String whatsappVerifyToken;

    public WebhookController(
            DonationLifecycleService donationService,
            EmailProvider emailProvider,
            WhatsAppProvider whatsAppProvider,
            NotificationOutboxService outboxService,
            ObjectMapper objectMapper,
            @Value("${app.whatsapp.verify-token:}") String whatsappVerifyToken) {
        this.donationService = donationService;
        this.emailProvider = emailProvider;
        this.whatsAppProvider = whatsAppProvider;
        this.outboxService = outboxService;
        this.objectMapper = objectMapper;
        this.whatsappVerifyToken = whatsappVerifyToken != null ? whatsappVerifyToken.trim() : "";
    }

    @PostMapping("/payments/razorpay")
    public ResponseEntity<Map<String, Object>> handleRazorpayWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Event-Id", required = false) String eventId,
            HttpServletRequest request) {
        Map<String, Object> result = donationService.processRazorpayWebhook(rawPayload, signature, eventId, getClientIp(request));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/resend")
    public ResponseEntity<Map<String, String>> handleResendWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "svix-id", required = false) String svixId,
            @RequestHeader(value = "svix-timestamp", required = false) String svixTimestamp,
            @RequestHeader(value = "svix-signature", required = false) String svixSignature) {

        if (!emailProvider.verifyWebhookSignature(svixId, svixTimestamp, rawPayload, svixSignature)) {
            throw new BadCredentialsException("Invalid Resend Svix webhook signature.");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventType = root.path("type").asString("unknown");
            String emailId = root.path("data").path("email_id").asString(null);
            boolean recorded = outboxService.recordWebhookDeliveryUpdate("EMAIL", "RESEND", emailId, eventType, rawPayload, svixId);
            return ResponseEntity.ok(Map.of("status", recorded ? "RECORDED" : "IGNORED"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "INVALID_PAYLOAD"));
        }
    }

    @GetMapping("/whatsapp")
    public ResponseEntity<String> verifyWhatsAppWebhook(
            @RequestParam(name = "hub.mode", required = false) String mode,
            @RequestParam(name = "hub.verify_token", required = false) String verifyToken,
            @RequestParam(name = "hub.challenge", required = false) String challenge) {
        if ("subscribe".equals(mode) && !whatsappVerifyToken.isBlank()
                && whatsappVerifyToken.equals(verifyToken) && challenge != null) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.status(403).body("Verification failed");
    }

    @PostMapping("/whatsapp")
    public ResponseEntity<Map<String, String>> handleWhatsAppWebhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signatureHeader) {

        if (!whatsAppProvider.verifyWebhookSignature(rawPayload, signatureHeader)) {
            throw new BadCredentialsException("Invalid WhatsApp webhook signature.");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            if (root.has("entry") && root.get("entry").isArray()) {
                for (JsonNode entry : root.get("entry")) {
                    for (JsonNode change : entry.path("changes")) {
                        JsonNode statuses = change.path("value").path("statuses");
                        if (statuses.isArray()) {
                            for (JsonNode st : statuses) {
                                String msgId = st.path("id").asString(null);
                                String statusVal = st.path("status").asString("unknown");
                                String dedupEventId = (msgId != null && !msgId.isBlank()) ? (msgId + ":" + statusVal) : null;
                                outboxService.recordWebhookDeliveryUpdate("WHATSAPP", "META_CLOUD", msgId, statusVal, rawPayload, dedupEventId);
                            }
                        }
                    }
                }
            }
            return ResponseEntity.ok(Map.of("status", "RECORDED"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "INVALID_PAYLOAD"));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

