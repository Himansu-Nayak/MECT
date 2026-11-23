package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.document.DocumentStatusUpdateRequest;
import org.mahavirtrust.backend.dto.document.PublicDocumentDto;
import org.mahavirtrust.backend.service.document.PublicDocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/documents")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'AUDITOR')")
public class AdminDocumentController {

    private final PublicDocumentService documentService;

    public AdminDocumentController(PublicDocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<PublicDocumentDto>> listAllDocuments() {
        return ResponseEntity.ok(documentService.listAllDocumentsForAdmin());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<PublicDocumentDto> uploadDocument(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "documentKey", required = false) String documentKey,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("financialYear") String financialYear,
            @RequestParam(value = "issueDate", required = false) String issueDate,
            @RequestParam(value = "publicationDate", required = false) String publicationDate,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam("issuingAuthority") String issuingAuthority,
            @RequestParam("summary") String summary,
            @RequestParam(value = "visibility", required = false) String visibility,
            @RequestParam(value = "status", required = false) String status,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        PublicDocumentDto dto = documentService.uploadDocument(
                file, documentKey, title, category, financialYear, issueDate, publicationDate,
                version, issuingAuthority, summary, visibility, status,
                authentication.getName(), getClientIp(httpRequest)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<PublicDocumentDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody DocumentStatusUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        PublicDocumentDto dto = documentService.updateDocumentStatus(
                id, request, authentication.getName(), getClientIp(httpRequest)
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{oldId}/supersede/{newId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<PublicDocumentDto> supersedeDocument(
            @PathVariable Long oldId,
            @PathVariable Long newId,
            Authentication authentication,
            HttpServletRequest httpRequest
    ) {
        PublicDocumentDto dto = documentService.supersedeDocument(
                oldId, newId, authentication.getName(), getClientIp(httpRequest)
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadAdminDocument(@PathVariable Long id) {
        PublicDocumentService.DocumentFileResult fileResult = documentService.getAdminDocumentFile(id);
        String filename = fileResult.fileName() != null ? fileResult.fileName() : ("document-" + id + ".pdf");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileResult.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header("X-Content-Type-Options", "nosniff")
                .body(fileResult.bytes());
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
