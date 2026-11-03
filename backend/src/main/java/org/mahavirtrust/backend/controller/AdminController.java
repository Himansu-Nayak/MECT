package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.VolunteerStatusUpdateResponse;
import org.mahavirtrust.backend.dto.auth.CreateUserRequest;
import org.mahavirtrust.backend.dto.auth.UserSummaryResponse;
import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AuditLog;
import org.mahavirtrust.backend.entity.PublicInquiry;
import org.mahavirtrust.backend.entity.VolunteerRegistration;
import org.mahavirtrust.backend.entity.VolunteerStatus;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.mahavirtrust.backend.repository.VolunteerRegistrationRepository;
import org.mahavirtrust.backend.service.AdminUserService;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.VolunteerRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminUserService adminUserService;
    private final PublicInquiryRepository inquiryRepository;
    private final VolunteerRegistrationRepository volunteerRepository;
    private final AuditLogService auditLogService;
    private final VolunteerRegistrationService volunteerRegistrationService;

    public AdminController(AdminUserService adminUserService,
                           PublicInquiryRepository inquiryRepository,
                           VolunteerRegistrationRepository volunteerRepository,
                           AuditLogService auditLogService,
                           VolunteerRegistrationService volunteerRegistrationService) {
        this.adminUserService = adminUserService;
        this.inquiryRepository = inquiryRepository;
        this.volunteerRepository = volunteerRepository;
        this.auditLogService = auditLogService;
        this.volunteerRegistrationService = volunteerRegistrationService;
    }

    @PostMapping("/users")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<UserSummaryResponse> createUser(
            @Valid @RequestBody CreateUserRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String actor = authentication.getName();
        String clientIp = getClientIp(httpRequest);
        UserSummaryResponse response = adminUserService.createUser(request, actor, clientIp);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TRUSTEE')")
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PatchMapping("/users/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<UserSummaryResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String actor = authentication.getName();
        String clientIp = getClientIp(httpRequest);
        AccountStatus status = AccountStatus.valueOf(body.get("status"));
        UserSummaryResponse response = adminUserService.updateUserStatus(id, status, actor, clientIp);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TRUSTEE')")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminUserService.getRecentAuditLogs());
    }

    @GetMapping("/inquiries")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER')")
    public ResponseEntity<List<PublicInquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAll());
    }

    @GetMapping("/volunteers")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'VOLUNTEER_COORDINATOR')")
    public ResponseEntity<List<VolunteerRegistration>> getAllVolunteers() {
        return ResponseEntity.ok(volunteerRepository.findAll());
    }

    @PatchMapping("/volunteers/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'VOLUNTEER_COORDINATOR')")
    public ResponseEntity<VolunteerStatusUpdateResponse> updateVolunteerStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String actor = authentication.getName();
        String clientIp = getClientIp(httpRequest);
        String newStatusStr = body != null ? body.get("status") : null;

        VolunteerStatusUpdateResponse response = volunteerRegistrationService.updateVolunteerStatus(
                id, newStatusStr, actor, clientIp);

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
