package org.mahavirtrust.backend.service;

import org.mahavirtrust.backend.entity.AuditLog;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void record(String actorUsername, String action, String resourceType, String resourceId, String ipAddress, String details) {
        AuditLog auditLog = new AuditLog(actorUsername, action, resourceType, resourceId, ipAddress, details);
        auditLogRepository.save(auditLog);
        log.info("AUDIT: user='{}' action='{}' resource='{}:{}' ip='{}'",
                actorUsername, action, resourceType, resourceId, ipAddress);
    }
}
