package org.mahavirtrust.backend.dto.auth;

import java.time.Instant;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
        String username,
        String fullName,
        String role,
        Instant issuedAt
) {
    public static AuthResponse of(String accessToken, String refreshToken, long expiresInSeconds,
                                  String username, String fullName, String role) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                expiresInSeconds,
                username,
                fullName,
                role,
                Instant.now()
        );
    }
}
