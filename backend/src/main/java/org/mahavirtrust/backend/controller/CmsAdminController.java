package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.cms.CmsPageUpsertRequest;
import org.mahavirtrust.backend.service.cms.CmsAndMediaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN', 'AUDITOR')")
public class CmsAdminController {

    private final CmsAndMediaService cmsService;

    public CmsAdminController(CmsAndMediaService cmsService) {
        this.cmsService = cmsService;
    }

    @GetMapping("/cms/pages")
    public ResponseEntity<List<Map<String, Object>>> listPages() {
        return ResponseEntity.ok(cmsService.listPagesForAdmin());
    }

    @GetMapping("/cms/pages/{slug}")
    public ResponseEntity<Map<String, Object>> getPage(@PathVariable String slug) {
        return ResponseEntity.ok(cmsService.getPageForAdmin(slug));
    }

    @PutMapping("/cms/pages/{slug}/draft")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<Map<String, Object>> saveDraft(
            @PathVariable String slug,
            @Valid @RequestBody CmsPageUpsertRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cmsService.saveDraft(slug, request, authentication.getName(), getClientIp(httpRequest)));
    }

    @PostMapping("/cms/pages/{slug}/publish")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<Map<String, Object>> publishPage(
            @PathVariable String slug,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cmsService.publishPage(slug, authentication.getName(), getClientIp(httpRequest)));
    }

    @PostMapping("/cms/pages/{slug}/unpublish")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<Map<String, Object>> unpublishPage(
            @PathVariable String slug,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(cmsService.unpublishPage(slug, authentication.getName(), getClientIp(httpRequest)));
    }

    @GetMapping("/media")
    public ResponseEntity<List<Map<String, Object>>> listMedia() {
        return ResponseEntity.ok(cmsService.listMediaAssets());
    }

    @PostMapping(value = "/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "altText", required = false) String altText,
            @RequestParam(value = "focalPoint", required = false) String focalPoint,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cmsService.uploadMedia(file, altText, focalPoint, authentication.getName(), getClientIp(httpRequest)));
    }

    @DeleteMapping("/media/{assetKey}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'CONTENT_ADMIN')")
    public ResponseEntity<Void> deleteMedia(
            @PathVariable String assetKey,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        cmsService.deleteMediaAsset(assetKey, authentication.getName(), getClientIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
