package org.mahavirtrust.backend.service.document;

import org.mahavirtrust.backend.dto.document.DocumentStatusUpdateRequest;
import org.mahavirtrust.backend.dto.document.PublicDocumentDto;
import org.mahavirtrust.backend.entity.PublicDocument;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.PublicDocumentRepository;
import org.mahavirtrust.backend.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

@Service
public class PublicDocumentService {

    private static final Logger log = LoggerFactory.getLogger(PublicDocumentService.class);
    private static final long MAX_FILE_BYTES = 10L * 1024 * 1024; // 10 MB limit
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "application/x-pdf"
    );

    private final PublicDocumentRepository documentRepository;
    private final AuditLogService auditLogService;

    public PublicDocumentService(PublicDocumentRepository documentRepository, AuditLogService auditLogService) {
        this.documentRepository = documentRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<PublicDocumentDto> listPublicDocuments(String category, String financialYear, String query) {
        List<PublicDocument> docs = documentRepository.findByStatusAndVisibilityOrderByDisplayOrderAscCreatedAtDesc("PUBLISHED", "PUBLIC");
        return docs.stream()
                .filter(d -> category == null || category.isBlank() || category.equalsIgnoreCase("ALL") || d.getCategory().equalsIgnoreCase(category.trim()))
                .filter(d -> financialYear == null || financialYear.isBlank() || financialYear.equalsIgnoreCase("ALL") || d.getFinancialYear().equalsIgnoreCase(financialYear.trim()))
                .filter(d -> {
                    if (query == null || query.isBlank()) return true;
                    String q = query.trim().toLowerCase(Locale.ROOT);
                    return d.getTitle().toLowerCase(Locale.ROOT).contains(q)
                            || d.getSummary().toLowerCase(Locale.ROOT).contains(q)
                            || d.getIssuingAuthority().toLowerCase(Locale.ROOT).contains(q)
                            || d.getDocumentKey().toLowerCase(Locale.ROOT).contains(q);
                })
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicDocumentDto getPublicDocument(String documentKey) {
        PublicDocument doc = documentRepository.findByDocumentKey(documentKey)
                .filter(d -> "PUBLISHED".equals(d.getStatus()) && "PUBLIC".equals(d.getVisibility()))
                .orElseThrow(() -> new ResourceNotFoundException("Published document not found: " + documentKey));
        return toDto(doc);
    }

    @Transactional(readOnly = true)
    public DocumentFileResult getPublicDocumentFile(String documentKey) {
        PublicDocument doc = documentRepository.findByDocumentKey(documentKey)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentKey));

        if (!"PUBLISHED".equals(doc.getStatus()) || !"PUBLIC".equals(doc.getVisibility())) {
            throw new AccessDeniedException("This document is restricted or pending formal publication.");
        }

        if (doc.getFileDataBase64() == null || doc.getFileDataBase64().isBlank()) {
            throw new ResourceNotFoundException("Document file binary is not stored online. Official certified copy is retained at the Secretariat.");
        }

        byte[] bytes = Base64.getDecoder().decode(doc.getFileDataBase64());
        return new DocumentFileResult(bytes, doc.getContentType(), doc.getFileName());
    }

    @Transactional(readOnly = true)
    public List<PublicDocumentDto> listAllDocumentsForAdmin() {
        return documentRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public DocumentFileResult getAdminDocumentFile(Long id) {
        PublicDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        if (doc.getFileDataBase64() == null || doc.getFileDataBase64().isBlank()) {
            throw new ResourceNotFoundException("Document file binary is not stored online. Official certified copy is retained at the Secretariat.");
        }

        byte[] bytes = Base64.getDecoder().decode(doc.getFileDataBase64());
        return new DocumentFileResult(bytes, doc.getContentType(), doc.getFileName());
    }

    @Transactional
    public PublicDocumentDto uploadDocument(
            MultipartFile file,
            String documentKey,
            String title,
            String category,
            String financialYear,
            String issueDate,
            String publicationDate,
            String version,
            String issuingAuthority,
            String summary,
            String visibility,
            String initialStatus,
            String actor,
            String clientIp
    ) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Document title is required.");
        }
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Document category is required.");
        }
        if (financialYear == null || financialYear.isBlank()) {
            throw new IllegalArgumentException("Financial year or reporting period is required.");
        }
        if (issuingAuthority == null || issuingAuthority.isBlank()) {
            throw new IllegalArgumentException("Issuing authority is required.");
        }
        if (summary == null || summary.isBlank()) {
            throw new IllegalArgumentException("Document summary is required.");
        }

        String safeKey = documentKey != null && !documentKey.isBlank()
                ? documentKey.trim().toUpperCase(Locale.ROOT)
                : "DOC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);

        if (documentRepository.findByDocumentKey(safeKey).isPresent()) {
            throw new IllegalArgumentException("Document with key " + safeKey + " already exists.");
        }

        PublicDocument doc = new PublicDocument();
        doc.setDocumentKey(safeKey);
        doc.setTitle(title.trim());
        doc.setCategory(category.trim().toUpperCase(Locale.ROOT));
        doc.setFinancialYear(financialYear.trim());
        doc.setIssueDate(issueDate != null && !issueDate.isBlank() ? issueDate.trim() : null);
        doc.setPublicationDate(publicationDate != null && !publicationDate.isBlank() ? publicationDate.trim() : Instant.now().toString().substring(0, 10));
        doc.setVersion(version != null && !version.isBlank() ? version.trim() : "1.0");
        doc.setIssuingAuthority(issuingAuthority.trim());
        doc.setSummary(summary.trim());
        doc.setVisibility(visibility != null && !visibility.isBlank() ? visibility.trim().toUpperCase(Locale.ROOT) : "PUBLIC");
        doc.setStatus(initialStatus != null && !initialStatus.isBlank() ? initialStatus.trim().toUpperCase(Locale.ROOT) : "DRAFT");
        doc.setUploadedBy(actor != null ? actor : "SECRETARIAT");

        if (file != null && !file.isEmpty()) {
            if (file.getSize() > MAX_FILE_BYTES) {
                throw new IllegalArgumentException("File size exceeds 10 MB maximum limit.");
            }
            String rawContentType = file.getContentType() != null ? file.getContentType().toLowerCase(Locale.ROOT) : "";
            if (!ALLOWED_CONTENT_TYPES.contains(rawContentType)) {
                throw new IllegalArgumentException("Invalid file format. Only official PDF documents are accepted.");
            }
            try {
                byte[] bytes = file.getBytes();
                String sha256 = calculateSha256(bytes);
                doc.setFileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : safeKey + ".pdf");
                doc.setContentType("application/pdf");
                doc.setFileSize((long) bytes.length);
                doc.setSha256Hash(sha256);
                doc.setStorageType("DATABASE_BLOB");
                doc.setFileDataBase64(Base64.getEncoder().encodeToString(bytes));
            } catch (Exception ex) {
                throw new IllegalArgumentException("Failed to process document binary: " + ex.getMessage());
            }
        } else {
            doc.setStorageType("PHYSICAL_ARCHIVE_SECRETARIAT");
        }

        doc = documentRepository.save(doc);
        auditLogService.record(actor, "PUBLIC_DOCUMENT_UPLOADED", "PUBLIC_DOCUMENT", doc.getDocumentKey(), clientIp,
                "Title=" + doc.getTitle() + ", Category=" + doc.getCategory() + ", Status=" + doc.getStatus());

        return toDto(doc);
    }

    @Transactional
    public PublicDocumentDto updateDocumentStatus(Long id, DocumentStatusUpdateRequest request, String actor, String clientIp) {
        PublicDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID: " + id));

        String targetStatus = request.status().trim().toUpperCase(Locale.ROOT);
        Set<String> validStatuses = Set.of("DRAFT", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "SUPERSEDED", "WITHDRAWN");
        if (!validStatuses.contains(targetStatus)) {
            throw new IllegalArgumentException("Invalid document status: " + targetStatus);
        }

        String oldStatus = doc.getStatus();
        doc.setStatus(targetStatus);
        doc.setUpdatedAt(Instant.now());

        if ("APPROVED".equals(targetStatus) || "PUBLISHED".equals(targetStatus)) {
            if (doc.getApprovedBy() == null) {
                doc.setApprovedBy(actor);
                doc.setApprovedAt(Instant.now());
            }
        }

        if ("WITHDRAWN".equals(targetStatus)) {
            doc.setWithdrawalReason(request.withdrawalReason() != null && !request.withdrawalReason().isBlank()
                    ? request.withdrawalReason().trim()
                    : "Withdrawn by administration");
        }

        doc = documentRepository.save(doc);
        auditLogService.record(actor, "PUBLIC_DOCUMENT_STATUS_UPDATED", "PUBLIC_DOCUMENT", doc.getDocumentKey(), clientIp,
                "Transitioned from " + oldStatus + " to " + targetStatus + (doc.getWithdrawalReason() != null ? " Reason=" + doc.getWithdrawalReason() : ""));

        return toDto(doc);
    }

    @Transactional
    public PublicDocumentDto supersedeDocument(Long oldId, Long newId, String actor, String clientIp) {
        PublicDocument oldDoc = documentRepository.findById(oldId)
                .orElseThrow(() -> new ResourceNotFoundException("Old document not found: " + oldId));
        PublicDocument newDoc = documentRepository.findById(newId)
                .orElseThrow(() -> new ResourceNotFoundException("New superseding document not found: " + newId));

        oldDoc.setStatus("SUPERSEDED");
        oldDoc.setSupersededById(newDoc.getId());
        oldDoc.setUpdatedAt(Instant.now());
        documentRepository.save(oldDoc);

        auditLogService.record(actor, "PUBLIC_DOCUMENT_SUPERSEDED", "PUBLIC_DOCUMENT", oldDoc.getDocumentKey(), clientIp,
                "Superseded by " + newDoc.getDocumentKey());

        return toDto(oldDoc);
    }

    private PublicDocumentDto toDto(PublicDocument d) {
        boolean hasDownload = d.getFileDataBase64() != null && !d.getFileDataBase64().isBlank();
        String downloadUrl = hasDownload && "PUBLISHED".equals(d.getStatus()) && "PUBLIC".equals(d.getVisibility())
                ? "/api/v1/public/documents/" + d.getDocumentKey() + "/download"
                : null;

        return new PublicDocumentDto(
                d.getId(),
                d.getDocumentKey(),
                d.getTitle(),
                d.getCategory(),
                d.getFinancialYear(),
                d.getIssueDate(),
                d.getPublicationDate(),
                d.getVersion(),
                d.getIssuingAuthority(),
                d.getSummary(),
                d.getFileName(),
                d.getContentType(),
                d.getFileSize(),
                d.getSha256Hash(),
                d.getStatus(),
                d.getVisibility(),
                d.getStorageType(),
                hasDownload,
                downloadUrl,
                d.getUploadedBy(),
                d.getApprovedBy(),
                d.getApprovedAt(),
                d.getWithdrawalReason(),
                d.getDisplayOrder(),
                d.getCreatedAt()
        );
    }

    private String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Could not calculate SHA-256 hash", e);
        }
    }

    public record DocumentFileResult(byte[] bytes, String contentType, String fileName) {}
}
