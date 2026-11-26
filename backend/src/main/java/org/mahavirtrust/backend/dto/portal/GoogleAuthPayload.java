package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotBlank;

public record GoogleAuthPayload(
        @NotBlank(message = "Google ID token is required")
        String idToken,
        String clientIntent, // e.g. "LOGIN", "REGISTER", "DONATE"
        String proposedName,
        String proposedCity
) {
    public GoogleAuthPayload(String idToken) {
        this(idToken, "LOGIN", null, null);
    }

    public GoogleAuthPayload(String idToken, String proposedName, String proposedCity) {
        this(idToken, "LOGIN", proposedName, proposedCity);
    }
}
