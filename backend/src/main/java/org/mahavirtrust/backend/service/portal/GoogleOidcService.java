package org.mahavirtrust.backend.service.portal;

import org.mahavirtrust.backend.dto.portal.GoogleAuthPayload;
import org.mahavirtrust.backend.dto.portal.PortalAuthResponse;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
public class GoogleOidcService {

    private static final Logger log = LoggerFactory.getLogger(GoogleOidcService.class);

    private final PortalUserRepository userRepository;
    private final PortalUserRoleRepository roleRepository;
    private final PortalUserProfileRepository profileRepository;
    private final PortalVerifiedContactRepository contactRepository;
    private final PortalRefreshTokenRepository refreshTokenRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    private final String configuredClientId;

    public record GoogleIdTokenClaims(
            String sub,
            String email,
            boolean emailVerified,
            String name,
            String picture
    ) {}

    public GoogleOidcService(
            PortalUserRepository userRepository,
            PortalUserRoleRepository roleRepository,
            PortalUserProfileRepository profileRepository,
            PortalVerifiedContactRepository contactRepository,
            PortalRefreshTokenRepository refreshTokenRepository,
            NotificationPreferenceRepository preferenceRepository,
            JwtTokenProvider jwtTokenProvider,
            AuditLogService auditLogService,
            ObjectMapper objectMapper,
            @Value("${app.google.client-id:}") String configuredClientId) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.contactRepository = contactRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.preferenceRepository = preferenceRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
        this.configuredClientId = configuredClientId != null ? configuredClientId.trim() : "";
    }

    public GoogleIdTokenClaims parseAndValidateToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new BadCredentialsException("Google ID token is required.");
        }

        try {
            String[] parts = idToken.split("\\.");
            if (parts.length < 2) {
                throw new BadCredentialsException("Malformed Google ID token format.");
            }

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            JsonNode payload = objectMapper.readTree(payloadJson);

            // 1. Verify Issuer
            String iss = payload.path("iss").asString("");
            if (!"https://accounts.google.com".equals(iss) && !"accounts.google.com".equals(iss)) {
                throw new BadCredentialsException("Invalid token issuer: " + iss);
            }

            // 2. Verify Audience if configured
            if (!configuredClientId.isBlank()) {
                String aud = payload.path("aud").asString("");
                if (!configuredClientId.equals(aud)) {
                    throw new BadCredentialsException("Audience mismatch for Google ID token.");
                }
            }

            // 3. Verify Expiry
            long expSeconds = payload.path("exp").asLong(0);
            Instant exp = Instant.ofEpochSecond(expSeconds);
            if (exp.isBefore(Instant.now().minusSeconds(60))) { // 60s clock skew tolerance
                throw new BadCredentialsException("Google ID token has expired.");
            }

            // 4. Verify Email & Email Verified
            String sub = payload.path("sub").asString(null);
            String email = payload.path("email").asString(null);
            boolean emailVerified = payload.path("email_verified").asBoolean(false);

            if (sub == null || sub.isBlank()) {
                throw new BadCredentialsException("Missing subject claim in Google ID token.");
            }
            if (email == null || email.isBlank()) {
                throw new BadCredentialsException("Missing email claim in Google ID token.");
            }
            if (!emailVerified) {
                throw new BadCredentialsException("Google account email is not verified.");
            }

            String name = payload.path("name").asString(null);
            String picture = payload.path("picture").asString(null);

            return new GoogleIdTokenClaims(sub.trim(), email.trim().toLowerCase(Locale.ROOT), emailVerified, name, picture);
        } catch (BadCredentialsException bce) {
            throw bce;
        } catch (Exception ex) {
            log.warn("Failed to parse Google ID token: {}", ex.getMessage());
            throw new BadCredentialsException("Invalid Google ID token: " + ex.getMessage());
        }
    }

    @Transactional
    public PortalAuthResponse authenticateGoogleUser(GoogleAuthPayload payload, String clientIp) {
        GoogleIdTokenClaims claims = parseAndValidateToken(payload.idToken());

        boolean isNewUser = false;
        // 1. Primary lookup by google_sub
        PortalUser user = userRepository.findByGoogleSub(claims.sub()).orElse(null);

        // 2. Secondary lookup by primary_email or verified contact (Account Linking)
        if (user == null) {
            user = userRepository.findByPrimaryEmailIgnoreCase(claims.email())
                    .orElseGet(() -> contactRepository.findByContactTypeAndContactValueIgnoreCase("EMAIL", claims.email())
                            .map(PortalVerifiedContact::getPortalUser)
                            .orElse(null));

            if (user != null) {
                // Link Google identity to existing canonical account
                user.setGoogleSub(claims.sub());
                user.setGoogleEmail(claims.email());
                user = userRepository.save(user);
                log.info("Linked Google identity sub={} to existing userUuid={}", claims.sub(), user.getUserUuid());
            }
        }

        // 3. Register new donor if user does not exist
        if (user == null) {
            isNewUser = true;
            user = new PortalUser();
            user.setUserUuid(UUID.randomUUID().toString());
            user.setPrimaryEmail(claims.email());
            user.setGoogleSub(claims.sub());
            user.setGoogleEmail(claims.email());
            user.setAuthProvider("GOOGLE");
            user.setStatus("ACTIVE");
            user.setProfileCompleted(false);
            user = userRepository.save(user);

            roleRepository.save(new PortalUserRole(user, PortalRoleName.ROLE_GENERAL_USER));
            NotificationPreference pref = new NotificationPreference();
            pref.setPortalUser(user);
            preferenceRepository.save(pref);

            contactRepository.save(new PortalVerifiedContact(user, "EMAIL", claims.email(), true));

            String preferredName = (payload.proposedName() != null && !payload.proposedName().isBlank())
                    ? payload.proposedName().trim()
                    : (claims.name() != null ? claims.name() : "Google Supporter");

            String city = (payload.proposedCity() != null && !payload.proposedCity().isBlank())
                    ? payload.proposedCity().trim()
                    : "Balangir";

            PortalUserProfile profile = new PortalUserProfile();
            profile.setPortalUser(user);
            profile.setFullName(preferredName);
            profile.setCity(city);
            profile.setState("Odisha");
            profile.setCountry("India");
            profile.setPinCode("767001");
            profile.setAddressLine("Registered via Google Account");
            profile.setAvatarUrl(claims.picture());
            profile.setPreferredLanguage("en");
            profileRepository.save(profile);
        } else {
            if (!"ACTIVE".equals(user.getStatus())) {
                throw new BadCredentialsException("This supporter account is currently inactive. Please contact MECT support.");
            }
            if (user.getGoogleSub() == null) {
                user.setGoogleSub(claims.sub());
                user.setGoogleEmail(claims.email());
                userRepository.save(user);
            }
        }

        List<String> roles = roleRepository.findByPortalUserId(user.getId()).stream()
                .map(r -> r.getRoleName().name())
                .toList();
        if (roles.isEmpty()) {
            roles = List.of(PortalRoleName.ROLE_GENERAL_USER.name());
        }

        String accessToken = jwtTokenProvider.generatePortalAccessToken(user.getUserUuid(), roles);
        String rawRefreshToken = jwtTokenProvider.generateRawRefreshToken();
        String hashedRefresh = jwtTokenProvider.hashToken(rawRefreshToken);

        refreshTokenRepository.save(new PortalRefreshToken(
                user,
                hashedRefresh,
                Instant.now().plusSeconds(jwtTokenProvider.getRefreshTokenValiditySeconds())
        ));

        String fullName = profileRepository.findByPortalUserId(user.getId())
                .map(PortalUserProfile::getFullName)
                .orElse(claims.name());

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                isNewUser ? "PORTAL_GOOGLE_REGISTERED" : "PORTAL_GOOGLE_LOGIN_SUCCESS",
                "PORTAL_USER",
                user.getId().toString(),
                clientIp,
                "Email=" + claims.email() + ", Sub=" + claims.sub()
        );

        return new PortalAuthResponse(
                accessToken,
                rawRefreshToken,
                "Bearer",
                900L,
                user.getUserUuid(),
                user.getPrimaryEmail(),
                user.getPrimaryPhone(),
                fullName,
                user.isProfileCompleted(),
                roles
        );
    }
}
