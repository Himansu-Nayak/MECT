package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "whatsapp_template_configs")
public class WhatsAppTemplateConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "template_key", nullable = false, unique = true, length = 80)
    private String templateKey;

    @Column(name = "template_name", nullable = false, length = 120)
    private String templateName;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode = "en";

    @Column(nullable = false, length = 50)
    private String category = "UTILITY";

    @Column(nullable = false, length = 30)
    private String status = "APPROVED";

    @Column(name = "parameter_mappings", columnDefinition = "TEXT")
    private String parameterMappings;

    @Column(name = "sample_body", columnDefinition = "TEXT")
    private String sampleBody;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTemplateKey() { return templateKey; }
    public void setTemplateKey(String templateKey) { this.templateKey = templateKey; }

    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }

    public String getLanguageCode() { return languageCode; }
    public void setLanguageCode(String languageCode) { this.languageCode = languageCode; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getParameterMappings() { return parameterMappings; }
    public void setParameterMappings(String parameterMappings) { this.parameterMappings = parameterMappings; }

    public String getSampleBody() { return sampleBody; }
    public void setSampleBody(String sampleBody) { this.sampleBody = sampleBody; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
