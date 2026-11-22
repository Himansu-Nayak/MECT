package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.WhatsAppTemplateConfig;
import org.mahavirtrust.backend.repository.WhatsAppTemplateConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class NotificationTemplateService {

    private static final Logger log = LoggerFactory.getLogger(NotificationTemplateService.class);

    private final WhatsAppTemplateConfigRepository templateRepository;
    private final ObjectMapper objectMapper;

    public NotificationTemplateService(WhatsAppTemplateConfigRepository templateRepository, ObjectMapper objectMapper) {
        this.templateRepository = templateRepository;
        this.objectMapper = objectMapper;
    }

    public List<WhatsAppTemplateConfig> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<WhatsAppTemplateConfig> getTemplateByKey(String templateKey) {
        return templateRepository.findByTemplateKey(templateKey);
    }

    @Transactional
    public WhatsAppTemplateConfig saveTemplate(WhatsAppTemplateConfig config) {
        return templateRepository.save(config);
    }

    @Transactional
    public WhatsAppTemplateConfig updateTemplate(String templateKey, WhatsAppTemplateConfig update) {
        WhatsAppTemplateConfig existing = templateRepository.findByTemplateKey(templateKey)
                .orElseThrow(() -> new IllegalArgumentException("Template not found: " + templateKey));

        if (update.getTemplateName() != null && !update.getTemplateName().isBlank()) {
            existing.setTemplateName(update.getTemplateName().trim());
        }
        if (update.getLanguageCode() != null && !update.getLanguageCode().isBlank()) {
            existing.setLanguageCode(update.getLanguageCode().trim());
        }
        if (update.getStatus() != null && !update.getStatus().isBlank()) {
            existing.setStatus(update.getStatus().trim().toUpperCase());
        }
        if (update.getParameterMappings() != null) {
            existing.setParameterMappings(update.getParameterMappings());
        }
        if (update.getSampleBody() != null) {
            existing.setSampleBody(update.getSampleBody());
        }

        return templateRepository.save(existing);
    }

    public List<String> buildParameters(String templateKey, Map<String, String> values) {
        WhatsAppTemplateConfig config = templateRepository.findByTemplateKey(templateKey).orElse(null);
        if (config == null || config.getParameterMappings() == null || config.getParameterMappings().isBlank()) {
            return Collections.emptyList();
        }

        List<String> result = new ArrayList<>();
        try {
            JsonNode mappings = objectMapper.readTree(config.getParameterMappings());
            if (mappings.isArray()) {
                for (JsonNode fieldNode : mappings) {
                    String fieldName = fieldNode.asText();
                    String val = values != null ? values.getOrDefault(fieldName, "") : "";
                    result.add(val != null ? val : "");
                }
            }
        } catch (Exception ex) {
            log.warn("Failed to parse parameter mappings for template {}: {}", templateKey, ex.getMessage());
        }
        return result;
    }
}
