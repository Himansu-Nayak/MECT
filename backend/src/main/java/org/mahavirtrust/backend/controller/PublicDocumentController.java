package org.mahavirtrust.backend.controller;

import org.mahavirtrust.backend.dto.document.PublicDocumentDto;
import org.mahavirtrust.backend.service.document.PublicDocumentService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/public/documents")
public class PublicDocumentController {

    private final PublicDocumentService documentService;

    public PublicDocumentController(PublicDocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<PublicDocumentDto>> listDocuments(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "financialYear", required = false) String financialYear,
            @RequestParam(value = "q", required = false) String query
    ) {
        return ResponseEntity.ok(documentService.listPublicDocuments(category, financialYear, query));
    }

    @GetMapping("/{documentKey}")
    public ResponseEntity<PublicDocumentDto> getDocument(@PathVariable String documentKey) {
        return ResponseEntity.ok(documentService.getPublicDocument(documentKey));
    }

    @GetMapping("/{documentKey}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable String documentKey) {
        PublicDocumentService.DocumentFileResult fileResult = documentService.getPublicDocumentFile(documentKey);
        String filename = fileResult.fileName() != null ? fileResult.fileName() : (documentKey + ".pdf");

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .contentType(MediaType.parseMediaType(fileResult.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .header("X-Content-Type-Options", "nosniff")
                .body(fileResult.bytes());
    }
}
