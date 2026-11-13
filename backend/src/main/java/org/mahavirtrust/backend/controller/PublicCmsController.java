package org.mahavirtrust.backend.controller;

import org.mahavirtrust.backend.entity.MediaAsset;
import org.mahavirtrust.backend.service.cms.CmsAndMediaService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/public/cms")
public class PublicCmsController {

    private final CmsAndMediaService cmsService;

    public PublicCmsController(CmsAndMediaService cmsService) {
        this.cmsService = cmsService;
    }

    @GetMapping("/pages/{slug}")
    public ResponseEntity<Map<String, Object>> getPublishedPage(@PathVariable String slug) {
        return ResponseEntity.ok(cmsService.getPublicPublishedPage(slug));
    }

    @GetMapping("/media/{assetKey}")
    public ResponseEntity<byte[]> getMedia(@PathVariable String assetKey) {
        MediaAsset asset = cmsService.getMediaAssetBytes(assetKey);
        byte[] bytes = Base64.getDecoder().decode(asset.getDataBase64() != null ? asset.getDataBase64() : "");
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .contentType(MediaType.parseMediaType(asset.getContentType()))
                .body(bytes);
    }
}
