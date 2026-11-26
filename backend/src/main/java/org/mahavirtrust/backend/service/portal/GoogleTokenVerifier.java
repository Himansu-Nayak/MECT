package org.mahavirtrust.backend.service.portal;

public interface GoogleTokenVerifier {

    record GoogleIdTokenClaims(
            String sub,
            String email,
            boolean emailVerified,
            String name,
            String picture
    ) {}

    GoogleIdTokenClaims verifyToken(String idToken);
}
