package org.mahavirtrust.backend.controller;

import org.mahavirtrust.backend.entity.NotificationOutbox;
import org.mahavirtrust.backend.entity.WhatsAppMessageLog;
import org.mahavirtrust.backend.entity.WhatsAppRecipient;
import org.mahavirtrust.backend.entity.WhatsAppTemplateConfig;
import org.mahavirtrust.backend.repository.NotificationOutboxRepository;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.mahavirtrust.backend.service.notification.whatsapp.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin/whatsapp")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'FINANCE_OFFICER', 'AUDITOR')")
public class AdminWhatsAppController {

    private final WhatsAppProvider whatsAppProvider;
    private final NotificationRecipientService recipientService;
    private final NotificationTemplateService templateService;
    private final WhatsAppMessageLogService logService;
    private final NotificationOutboxService outboxService;
    private final NotificationOutboxRepository outboxRepository;

    public AdminWhatsAppController(
            WhatsAppProvider whatsAppProvider,
            NotificationRecipientService recipientService,
            NotificationTemplateService templateService,
            WhatsAppMessageLogService logService,
            NotificationOutboxService outboxService,
            NotificationOutboxRepository outboxRepository) {
        this.whatsAppProvider = whatsAppProvider;
        this.recipientService = recipientService;
        this.templateService = templateService;
        this.logService = logService;
        this.outboxService = outboxService;
        this.outboxRepository = outboxRepository;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("configured", whatsAppProvider.isConfigured());
        resp.put("enabled", whatsAppProvider.isEnabled());
        resp.put("provider", whatsAppProvider.getProviderName());
        resp.put("apiVersion", whatsAppProvider.getApiVersion());
        resp.put("phoneNumberId", whatsAppProvider.getPhoneNumberId());
        resp.put("maskedToken", whatsAppProvider.getMaskedToken());
        resp.put("businessAccountId", whatsAppProvider.getBusinessAccountId());

        List<WhatsAppRecipient> recipients = recipientService.getAllRecipients();
        resp.put("totalRecipients", recipients.size());
        resp.put("activeRecipients", recipients.stream().filter(WhatsAppRecipient::isActive).count());

        List<WhatsAppTemplateConfig> templates = templateService.getAllTemplates();
        resp.put("templatesCount", templates.size());
        resp.put("approvedTemplatesCount", templates.stream().filter(t -> "APPROVED".equalsIgnoreCase(t.getStatus())).count());

        resp.put("metrics", logService.getMetrics());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/recipients")
    public ResponseEntity<List<WhatsAppRecipient>> getRecipients() {
        return ResponseEntity.ok(recipientService.getAllRecipients());
    }

    @PostMapping("/recipients")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<WhatsAppRecipient> createRecipient(@RequestBody WhatsAppRecipient recipient) {
        return ResponseEntity.ok(recipientService.createRecipient(recipient));
    }

    @PutMapping("/recipients/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<WhatsAppRecipient> updateRecipient(@PathVariable Long id, @RequestBody WhatsAppRecipient update) {
        return ResponseEntity.ok(recipientService.updateRecipient(id, update));
    }

    @DeleteMapping("/recipients/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteRecipient(@PathVariable Long id) {
        recipientService.deleteRecipient(id);
        return ResponseEntity.ok(Map.of("status", "DELETED"));
    }

    @PatchMapping("/recipients/{id}/toggle")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<WhatsAppRecipient> toggleRecipient(@PathVariable Long id) {
        return ResponseEntity.ok(recipientService.toggleActive(id));
    }

    @GetMapping("/templates")
    public ResponseEntity<List<WhatsAppTemplateConfig>> getTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    @PutMapping("/templates/{key}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<WhatsAppTemplateConfig> updateTemplate(
            @PathVariable String key,
            @RequestBody WhatsAppTemplateConfig update) {
        return ResponseEntity.ok(templateService.updateTemplate(key, update));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<WhatsAppMessageLog>> getLogs() {
        return ResponseEntity.ok(logService.getRecentLogs());
    }

    @PostMapping("/test")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> sendTestMessage(@RequestBody Map<String, Object> req) {
        String phone = (String) req.get("phone");
        String template = (String) req.getOrDefault("template", "mect_donation_admin_alert");
        @SuppressWarnings("unchecked")
        List<String> params = (List<String>) req.getOrDefault("params", List.of("Test Donor", "100.00", "UPI_DIRECT", "TEST-REF-001", "General Fund"));

        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required."));
        }

        ProviderDispatchResult result = whatsAppProvider.sendTemplateMessage(phone, template, "en", params);
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("status", result.status());
        resp.put("providerMessageId", result.providerMessageId());
        resp.put("errorMessage", result.errorMessage());
        resp.put("rawResponse", result.rawResponse());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/retry/{outboxId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> retryOutboxItem(@PathVariable Long outboxId) {
        Optional<NotificationOutbox> outboxOpt = outboxRepository.findById(outboxId);
        if (outboxOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        NotificationOutbox item = outboxOpt.get();
        outboxService.dispatchSingleSafe(item);

        NotificationOutbox refreshed = outboxRepository.findById(outboxId).orElse(item);
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("outboxId", refreshed.getId());
        resp.put("status", refreshed.getStatus());
        resp.put("retryCount", refreshed.getRetryCount());
        resp.put("lastError", refreshed.getLastError());
        return ResponseEntity.ok(resp);
    }
}
