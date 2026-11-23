package org.mahavirtrust.backend.service.cms;

import org.mahavirtrust.backend.dto.cms.CmsPageUpsertRequest;
import org.mahavirtrust.backend.entity.ContentPage;
import org.mahavirtrust.backend.entity.ContentRevision;
import org.mahavirtrust.backend.entity.MediaAsset;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.ContentPageRepository;
import org.mahavirtrust.backend.repository.ContentRevisionRepository;
import org.mahavirtrust.backend.repository.MediaAssetRepository;
import org.mahavirtrust.backend.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;

@Service
public class CmsAndMediaService {

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp", "image/svg+xml"
    );
    private static final long MAX_MEDIA_BYTES = 2L * 1024 * 1024;

    private final ContentPageRepository pageRepository;
    private final ContentRevisionRepository revisionRepository;
    private final MediaAssetRepository mediaRepository;
    private final AuditLogService auditLogService;

    public CmsAndMediaService(
            ContentPageRepository pageRepository,
            ContentRevisionRepository revisionRepository,
            MediaAssetRepository mediaRepository,
            AuditLogService auditLogService) {
        this.pageRepository = pageRepository;
        this.revisionRepository = revisionRepository;
        this.mediaRepository = mediaRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listPagesForAdmin() {
        return pageRepository.findAllByOrderBySlugAsc().stream()
                .map(p -> mapPageSummary(p, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPageForAdmin(String slug) {
        String normalized = normalizeSlug(slug);
        ContentPage page = pageRepository.findBySlug(normalized)
                .orElseThrow(() -> new ResourceNotFoundException("CMS page not found: " + normalized));
        Map<String, Object> result = mapPageSummary(page, true);
        List<Map<String, Object>> revisions = revisionRepository.findByContentPageIdOrderByRevisionNumberDesc(page.getId())
                .stream()
                .map(r -> {
                    Map<String, Object> rm = new LinkedHashMap<>();
                    rm.put("revisionNumber", r.getRevisionNumber());
                    rm.put("changeSummary", r.getChangeSummary());
                    rm.put("editedBy", r.getEditedBy());
                    rm.put("createdAt", r.getCreatedAt());
                    rm.put("snapshotJson", r.getSnapshotJson());
                    return rm;
                })
                .toList();
        result.put("revisions", revisions);
        return result;
    }

    @Transactional
    public Map<String, Object> saveDraft(String slug, CmsPageUpsertRequest req, String actor, String clientIp) {
        String normalized = normalizeSlug(slug);
        ContentPage page = pageRepository.findBySlug(normalized).orElseGet(() -> {
            ContentPage created = new ContentPage();
            created.setSlug(normalized);
            created.setSectionJson("{}");
            created.setStatus("DRAFT");
            return created;
        });

        page.setTitle(req.title().trim());
        page.setDraftJson(req.draftJson());
        if (page.getPublishedAt() != null) {
            page.setStatus("DRAFT_PENDING_PUBLISH");
        } else {
            page.setStatus("DRAFT");
        }
        page = pageRepository.save(page);

        int nextRev = revisionRepository.findByContentPageIdOrderByRevisionNumberDesc(page.getId())
                .stream()
                .mapToInt(ContentRevision::getRevisionNumber)
                .max()
                .orElse(0) + 1;

        ContentRevision rev = new ContentRevision();
        rev.setContentPage(page);
        rev.setRevisionNumber(nextRev);
        rev.setSnapshotJson(req.draftJson());
        rev.setEditedBy(actor);
        rev.setChangeSummary(req.changeSummary() != null && !req.changeSummary().isBlank() ? req.changeSummary().trim() : "Draft saved");
        revisionRepository.save(rev);

        auditLogService.record(actor, "CMS_DRAFT_SAVED", "CONTENT_PAGE", normalized, clientIp, "Revision=" + nextRev);
        return getPageForAdmin(normalized);
    }

    @Transactional
    public Map<String, Object> publishPage(String slug, String actor, String clientIp) {
        String normalized = normalizeSlug(slug);
        ContentPage page = pageRepository.findBySlug(normalized)
                .orElseThrow(() -> new ResourceNotFoundException("CMS page not found: " + normalized));

        if (page.getDraftJson() != null && !page.getDraftJson().isBlank()) {
            page.setSectionJson(page.getDraftJson());
        }
        page.setStatus("PUBLISHED");
        page.setPublishedBy(actor);
        page.setPublishedAt(Instant.now());
        page = pageRepository.save(page);

        int nextRev = revisionRepository.findByContentPageIdOrderByRevisionNumberDesc(page.getId())
                .stream()
                .mapToInt(ContentRevision::getRevisionNumber)
                .max()
                .orElse(0) + 1;

        ContentRevision rev = new ContentRevision();
        rev.setContentPage(page);
        rev.setRevisionNumber(nextRev);
        rev.setSnapshotJson(page.getSectionJson());
        rev.setEditedBy(actor);
        rev.setChangeSummary("Published live");
        revisionRepository.save(rev);

        auditLogService.record(actor, "CMS_PAGE_PUBLISHED", "CONTENT_PAGE", normalized, clientIp, "Revision=" + nextRev);
        return getPageForAdmin(normalized);
    }

    @Transactional
    public Map<String, Object> unpublishPage(String slug, String actor, String clientIp) {
        String normalized = normalizeSlug(slug);
        ContentPage page = pageRepository.findBySlug(normalized)
                .orElseThrow(() -> new ResourceNotFoundException("CMS page not found: " + normalized));

        page.setStatus("ARCHIVED");
        page = pageRepository.save(page);

        auditLogService.record(actor, "CMS_PAGE_UNPUBLISHED", "CONTENT_PAGE", normalized, clientIp, "Status changed to ARCHIVED");
        return getPageForAdmin(normalized);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicPublishedPage(String slug) {
        String normalized = normalizeSlug(slug);
        ContentPage page = pageRepository.findBySlug(normalized)
                .filter(p -> "PUBLISHED".equals(p.getStatus()) && p.getSectionJson() != null && !p.getSectionJson().isBlank())
                .orElseThrow(() -> new ResourceNotFoundException("Published content not found for slug: " + normalized));

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("slug", page.getSlug());
        m.put("title", page.getTitle());
        m.put("sectionJson", page.getSectionJson());
        m.put("publishedAt", page.getPublishedAt());
        return m;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listMediaAssets() {
        return mediaRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapMediaAsset)
                .toList();
    }

    @Transactional
    public Map<String, Object> uploadMedia(MultipartFile file, String altText, String focalPoint, String actor, String clientIp) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Media file is required.");
        }
        if (file.getSize() > MAX_MEDIA_BYTES) {
            throw new IllegalArgumentException("Media file exceeds 2 MB size limit.");
        }
        String contentType = file.getContentType() != null ? file.getContentType().toLowerCase(Locale.ROOT) : "";
        if (!ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Unsupported image format. Allowed: PNG, JPEG, WEBP, SVG.");
        }
        try {
            MediaAsset asset = new MediaAsset();
            String safeKey = "media-" + UUID.randomUUID().toString().substring(0, 12);
            asset.setAssetKey(safeKey);
            asset.setFileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : safeKey);
            asset.setContentType(contentType);
            asset.setFileSize(file.getSize());
            asset.setAltText(altText != null && !altText.isBlank() ? altText.trim() : asset.getFileName());
            asset.setFocalPoint(focalPoint != null && !focalPoint.isBlank() ? focalPoint.trim() : "center");
            asset.setPublicUrl("/api/v1/public/cms/media/" + safeKey);
            asset.setDataBase64(Base64.getEncoder().encodeToString(file.getBytes()));
            asset.setUploadedBy(actor);
            asset = mediaRepository.save(asset);

            auditLogService.record(actor, "CMS_MEDIA_UPLOADED", "MEDIA_ASSET", safeKey, clientIp,
                    "filename=" + asset.getFileName() + ", bytes=" + asset.getFileSize());

            return mapMediaAsset(asset);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Failed to store media asset: " + ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public MediaAsset getMediaAssetBytes(String assetKey) {
        return mediaRepository.findByAssetKey(assetKey)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found: " + assetKey));
    }

    @Transactional
    public void deleteMediaAsset(String assetKey, String actor, String clientIp) {
        MediaAsset asset = mediaRepository.findByAssetKey(assetKey)
                .orElseThrow(() -> new ResourceNotFoundException("Media asset not found: " + assetKey));
        mediaRepository.delete(asset);
        auditLogService.record(actor, "CMS_MEDIA_DELETED", "MEDIA_ASSET", assetKey, clientIp,
                "filename=" + asset.getFileName());
    }

    private Map<String, Object> mapPageSummary(ContentPage p, boolean includeJson) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("slug", p.getSlug());
        m.put("title", p.getTitle());
        m.put("status", p.getStatus());
        m.put("publishedAt", p.getPublishedAt());
        m.put("publishedBy", p.getPublishedBy());
        m.put("updatedAt", p.getUpdatedAt());
        if (includeJson) {
            m.put("sectionJson", p.getSectionJson());
            m.put("draftJson", p.getDraftJson());
        }
        return m;
    }

    private Map<String, Object> mapMediaAsset(MediaAsset a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("assetKey", a.getAssetKey());
        m.put("fileName", a.getFileName());
        m.put("contentType", a.getContentType());
        m.put("fileSize", a.getFileSize());
        m.put("altText", a.getAltText());
        m.put("focalPoint", a.getFocalPoint());
        m.put("publicUrl", a.getPublicUrl());
        m.put("uploadedBy", a.getUploadedBy());
        m.put("createdAt", a.getCreatedAt());
        return m;
    }

    private String normalizeSlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Page slug is required.");
        }
        String cleaned = slug.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9-_]", "-");
        if (cleaned.isBlank()) {
            throw new IllegalArgumentException("Invalid CMS page slug.");
        }
        return cleaned;
    }
}
