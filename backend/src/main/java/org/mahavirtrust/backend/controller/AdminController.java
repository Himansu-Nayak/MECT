package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.VolunteerStatusUpdateResponse;
import org.mahavirtrust.backend.dto.admin.AdminDashboardStatsResponse;
import org.mahavirtrust.backend.dto.auth.CreateUserRequest;
import org.mahavirtrust.backend.dto.auth.UserSummaryResponse;
import org.mahavirtrust.backend.dto.scholarship.ScholarshipApplicationResponse;
import org.mahavirtrust.backend.dto.scholarship.ScholarshipStatusUpdateRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.mahavirtrust.backend.repository.ScholarshipApplicationRepository;
import org.mahavirtrust.backend.repository.VolunteerRegistrationRepository;
import org.mahavirtrust.backend.service.AdminUserService;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.ScholarshipApplicationService;
import org.mahavirtrust.backend.service.VolunteerRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminUserService adminUserService;
    private final AdminUserRepository adminUserRepository;
    private final PublicInquiryRepository inquiryRepository;
    private final VolunteerRegistrationRepository volunteerRepository;
    private final ScholarshipApplicationRepository scholarshipRepository;
    private final AuditLogService auditLogService;
    private final VolunteerRegistrationService volunteerRegistrationService;
    private final ScholarshipApplicationService scholarshipApplicationService;

    public AdminController(AdminUserService adminUserService,
                           AdminUserRepository adminUserRepository,
                           PublicInquiryRepository inquiryRepository,
                           VolunteerRegistrationRepository volunteerRepository,
                           ScholarshipApplicationRepository scholarshipRepository,
                           AuditLogService auditLogService,
                           VolunteerRegistrationService volunteerRegistrationService,
                           ScholarshipApplicationService scholarshipApplicationService) {
        this.adminUserService = adminUserService;
        this.adminUserRepository = adminUserRepository;
        this.inquiryRepository = inquiryRepository;
        this.volunteerRepository = volunteerRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.auditLogService = auditLogService;
        this.volunteerRegistrationService = volunteerRegistrationService;
        this.scholarshipApplicationService = scholarshipApplicationService;
    }

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TRUSTEE', 'APPLICATION_REVIEWER', 'FINANCE_OFFICER', 'VOLUNTEER_COORDINATOR')")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        AdminDashboardStatsResponse stats = new AdminDashboardStatsResponse();
        stats.setTotalVolunteers(volunteerRepository.count());
        stats.setPendingVolunteers(volunteerRepository.countByVerificationStatus("AWAITING_ORIENTATION"));
        stats.setApprovedVolunteers(volunteerRepository.countByVerificationStatus("ACTIVE_MENTOR"));

        stats.setTotalInquiries(inquiryRepository.count());

        stats.setTotalScholarships(scholarshipRepository.count());
        stats.setSubmittedScholarships(scholarshipRepository.countByStatus(ApplicationStatus.SUBMITTED));
        stats.setUnderScrutinyScholarships(scholarshipRepository.countByStatus(ApplicationStatus.UNDER_SCRUTINY));
        stats.setApprovedScholarships(scholarshipRepository.countByStatus(ApplicationStatus.COMMITTEE_APPROVED));
        stats.setDisbursedScholarships(scholarshipRepository.countByStatus(ApplicationStatus.DISBURSED));

        stats.setTotalDisbursalDemand(scholarshipRepository.sumTotalTuitionFee());
        stats.setTotalDisbursedAmount(scholarshipRepository.sumTuitionFeeByStatus(ApplicationStatus.DISBURSED));

        stats.setTotalAdminUsers(adminUserRepository.count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/scholarships")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER', 'TRUSTEE', 'FINANCE_OFFICER')")
    public ResponseEntity<List<ScholarshipApplicationResponse>> getScholarships(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(scholarshipApplicationService.getAllApplications(status, district));
    }

    @GetMapping("/scholarships/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER', 'TRUSTEE', 'FINANCE_OFFICER')")
    public ResponseEntity<ScholarshipApplicationResponse> getScholarshipById(@PathVariable Long id) {
        return ResponseEntity.ok(scholarshipApplicationService.getApplicationById(id));
    }

    @PatchMapping("/scholarships/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'APPLICATION_REVIEWER', 'FINANCE_OFFICER')")
    public ResponseEntity<ScholarshipApplicationResponse> updateScholarshipStatus(
            @PathVariable Long id,
            @Valid @RequestBody ScholarshipStatusUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        String actor = authentication.getName();
        String clientIp = getClientIp(httpRequest);
        ScholarshipApplicationResponse response = scholarshipApplicationService.updateStatus(id, request, actor, clientIp);
        return ResponseEntity.ok(response);
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
