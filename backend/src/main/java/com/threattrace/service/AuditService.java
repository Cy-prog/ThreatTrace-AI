package com.threattrace.service;

import com.threattrace.entity.AuditLog;
import com.threattrace.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Async
    @Transactional
    public void record(String actor, String action, String resourceType, String resourceId, String ipAddress, String metadata) {
        try {
            AuditLog log = new AuditLog(actor, action, resourceType, resourceId, ipAddress, metadata);
            auditLogRepository.save(log);
            logger.info("AUDIT: [{}] {} {} on {} (ip: {})", actor, action, resourceType, resourceId, ipAddress);
        } catch (Exception ex) {
            logger.error("Failed to persist security audit record: {}", ex.getMessage());
        }
    }
}
