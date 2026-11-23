package org.mahavirtrust.backend.dto.document;

import java.time.Instant;

public record PublicDocumentDto(
        Long id,
        String documentKey,
        String title,
        String category,
        String financialYear,
        String issueDate,
        String publicationDate,
        String version,
        String issuingAuthority,
        String summary,
        String fileName,
        String contentType,
        Long fileSize,
        String sha256Hash,
        String status,
        String visibility,
        String storageType,
        boolean hasDownload,
        String downloadUrl,
        String uploadedBy,
        String approvedBy,
        Instant approvedAt,
        String withdrawalReason,
        int displayOrder,
        Instant createdAt
) {}
