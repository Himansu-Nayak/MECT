package org.mahavirtrust.backend.service;

import org.mahavirtrust.backend.dto.auth.CreateUserRequest;
import org.mahavirtrust.backend.dto.auth.UserSummaryResponse;
import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.AuditLog;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final AdminUserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AdminUserService(AdminUserRepository userRepository,
                            AuditLogRepository auditLogRepository,
                            PasswordEncoder passwordEncoder,
                            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public UserSummaryResponse createUser(CreateUserRequest request, String actorUsername, String clientIp) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already registered: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered: " + request.email());
        }

        String passwordHash = passwordEncoder.encode(request.password());
        AdminUser user = new AdminUser(
                request.username(),
                request.email(),
                passwordHash,
                request.fullName(),
                request.role()
        );

        AdminUser saved = userRepository.save(user);

        auditLogService.record(
                actorUsername,
                "USER_CREATED",
                "ADMIN_USER",
                saved.getId().toString(),
                clientIp,
                "Created user " + saved.getUsername() + " with role " + saved.getRole()
        );

        return UserSummaryResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserSummaryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSummaryResponse updateUserStatus(Long userId, AccountStatus newStatus, String actorUsername, String clientIp) {
        AdminUser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        AccountStatus oldStatus = user.getStatus();
        user.setStatus(newStatus);
        if (newStatus == AccountStatus.ACTIVE) {
            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
        }

        AdminUser updated = userRepository.save(user);

        auditLogService.record(
                actorUsername,
                "USER_STATUS_UPDATED",
                "ADMIN_USER",
                updated.getId().toString(),
                clientIp,
                "Changed status from " + oldStatus + " to " + newStatus
        );

        return UserSummaryResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }
}
