package org.mahavirtrust.backend.dto.portal;

import java.util.List;

public record PortalAuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        String userUuid,
        String primaryEmail,
        String primaryPhone,
        String fullName,
        boolean profileCompleted,
        List<String> roles
) {
    public static PortalAuthResponse of(
            String accessToken,
            String refreshToken,
            long expiresIn,
            String userUuid,
            String primaryEmail,
            String primaryPhone,
            String fullName,
            boolean profileCompleted,
            List<String> roles) {
        return new PortalAuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                expiresIn,
                userUuid,
                primaryEmail,
                primaryPhone,
                fullName,
                profileCompleted,
                roles
        );
    }
}

