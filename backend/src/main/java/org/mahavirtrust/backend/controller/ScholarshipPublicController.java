package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.scholarship.CreateScholarshipApplicationRequest;
import org.mahavirtrust.backend.dto.scholarship.ScholarshipApplicationResponse;
import org.mahavirtrust.backend.dto.scholarship.ScholarshipTrackResponse;
import org.mahavirtrust.backend.service.ScholarshipApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/scholarships")
public class ScholarshipPublicController {

    private final ScholarshipApplicationService scholarshipService;

    public ScholarshipPublicController(ScholarshipApplicationService scholarshipService) {
        this.scholarshipService = scholarshipService;
    }

    @PostMapping("/apply")
    public ResponseEntity<ScholarshipApplicationResponse> apply(
            @Valid @RequestBody CreateScholarshipApplicationRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        ScholarshipApplicationResponse response = scholarshipService.submitApplication(request, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/track/{applicationNumber}")
    public ResponseEntity<ScholarshipTrackResponse> track(
            @PathVariable String applicationNumber,
            @RequestParam(required = false) String phone) {
        ScholarshipTrackResponse response = scholarshipService.trackApplication(applicationNumber, phone);
        return ResponseEntity.ok(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
