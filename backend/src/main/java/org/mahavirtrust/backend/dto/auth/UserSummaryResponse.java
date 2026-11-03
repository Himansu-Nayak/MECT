package org.mahavirtrust.backend.dto.auth;

import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.Role;

import java.time.Instant;

public record UserSummaryResponse(
        Long id,
        String username,
        String email,
        String fullName,
        Role role,
        AccountStatus status,
        Instant createdAt
) {
    public static UserSummaryResponse fromEntity(AdminUser user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }
}
