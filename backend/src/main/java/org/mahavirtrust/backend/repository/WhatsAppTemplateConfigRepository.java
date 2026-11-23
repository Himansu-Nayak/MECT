package org.mahavirtrust.backend.repository;

import org.mahavirtrust.backend.entity.WhatsAppTemplateConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhatsAppTemplateConfigRepository extends JpaRepository<WhatsAppTemplateConfig, Long> {
    Optional<WhatsAppTemplateConfig> findByTemplateKey(String templateKey);
    List<WhatsAppTemplateConfig> findByStatus(String status);
}
