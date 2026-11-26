package org.mahavirtrust.backend.service.portal;

import org.mahavirtrust.backend.dto.portal.GoogleAuthPayload;
import org.mahavirtrust.backend.dto.portal.PortalAuthResponse;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class GoogleOidcService {

    private static final Logger log = LoggerFactory.getLogger(GoogleOidcService.class);

    private final GoogleTokenVerifier googleTokenVerifier;
    private final PortalUserRepository userRepository;
    private final PortalUserRoleRepository roleRepository;
    private final PortalUserProfileRepository profileRepository;
    private final PortalVerifiedContactRepository contactRepository;
    private final PortalRefreshTokenRepository refreshTokenRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;

    public GoogleOidcService(
            GoogleTokenVerifier googleTokenVerifier,
            PortalUserRepository userRepository,
            PortalUserRoleRepository roleRepository,
            PortalUserProfileRepository profileRepository,
            PortalVerifiedContactRepository contactRepository,
            PortalRefreshTokenRepository refreshTokenRepository,
            NotificationPreferenceRepository preferenceRepository,
            JwtTokenProvider jwtTokenProvider,
            AuditLogService auditLogService) {
        this.googleTokenVerifier = googleTokenVerifier;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.contactRepository = contactRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.preferenceRepository = preferenceRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditLogService = auditLogService;
    }

    /**
     * Authenticates a user via verified Google ID token.
     * Enforces strict account linking rules:
     * - Look up solely by stable immutable Google `sub`.
     * - If Google `sub` not found, never silently overwrite an existing account by email alone.
     * - Require authenticated in-session linking to prevent unauthorized account takeover.
     */
    @Transactional
    public PortalAuthResponse authenticateGoogleUser(GoogleAuthPayload payload, String clientIp) {
        GoogleTokenVerifier.GoogleIdTokenClaims claims = googleTokenVerifier.verifyToken(payload.idToken());

        boolean isNewUser = false;
        // 1. Primary lookup by stable immutable Google sub
        PortalUser user = userRepository.findByGoogleSub(claims.sub()).orElse(null);

        // 2. Strict Account Linking Safety Check
        if (user == null) {
            Optional<PortalUser> existingByEmail = userRepository.findByPrimaryEmailIgnoreCase(claims.email());
            if (existingByEmail.isPresent()) {
                PortalUser existing = existingByEmail.get();
                if (existing.getGoogleSub() != null) {
                    throw new BadCredentialsException(
                            "An existing donor account with this email is already linked to a different Google account."
                    );
                }
                // Unauthenticated linking via email alone is disallowed to prevent account takeover.
                // The donor must sign in with their existing authentication method (Mobile OTP) first.
                log.warn("Unauthenticated Google sign-in attempted for existing email userUuid={}. Challenging for verified login.",
                        existing.getUserUuid());
                throw new BadCredentialsException(
                        "An existing donor account was found for " + claims.email() +
                        ". For your security, please sign in with your Mobile OTP first, then link your Google account in Portal Security Settings."
                );
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

            String preferredName = (claims.name() != null && !claims.name().isBlank())
                    ? claims.name().trim()
                    : ((payload.proposedName() != null && !payload.proposedName().isBlank())
                    ? payload.proposedName().trim()
                    : "Google Supporter");

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
        }

        // 4. Issue standard authenticated JWT and refresh token
        List<String> roles = roleRepository.findByPortalUserId(user.getId())
                .stream()
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

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                isNewUser ? "PORTAL_GOOGLE_REGISTERED" : "PORTAL_GOOGLE_LOGIN_SUCCESS",
                "PORTAL_USER",
                user.getId().toString(),
                clientIp,
                "GoogleSub=" + claims.sub() + ", Roles=" + roles
        );

        String fullName = profileRepository.findByPortalUserId(user.getId())
                .map(PortalUserProfile::getFullName)
                .orElse(claims.name() != null ? claims.name() : user.getPrimaryEmail());

        boolean profileCompleted = profileRepository.findByPortalUserId(user.getId())
                .map(p -> p.getAddressLine() != null && !p.getAddressLine().isBlank() && p.getPinCode() != null && !p.getPinCode().isBlank())
                .orElse(false);

        return PortalAuthResponse.of(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getAccessTokenValiditySeconds(),
                user.getUserUuid(),
                user.getPrimaryEmail(),
                user.getPrimaryPhone(),
                fullName,
                profileCompleted,
                roles
        );
    }

    /**
     * Secure In-Session Account Linking:
     * Only permitted for an already-authenticated donor holding an active session.
     * Prevents account takeover by ensuring the user has already proven control of their donor account.
     */
    @Transactional
    public void linkGoogleToAuthenticatedUser(Long portalUserId, GoogleAuthPayload payload, String clientIp) {
        if (portalUserId == null) {
            throw new BadCredentialsException("Authentication required to link a Google account.");
        }

        GoogleTokenVerifier.GoogleIdTokenClaims claims = googleTokenVerifier.verifyToken(payload.idToken());

        PortalUser currentUser = userRepository.findById(portalUserId)
                .orElseThrow(() -> new BadCredentialsException("Donor account not found."));

        if (!"ACTIVE".equals(currentUser.getStatus())) {
            throw new BadCredentialsException("Donor account is inactive.");
        }

        // Verify that this Google identity is not already linked to another account
        Optional<PortalUser> conflicting = userRepository.findByGoogleSub(claims.sub());
        if (conflicting.isPresent() && !conflicting.get().getId().equals(currentUser.getId())) {
            throw new BadCredentialsException("This Google account is already linked to another donor account.");
        }

        if (currentUser.getGoogleSub() != null && !currentUser.getGoogleSub().equals(claims.sub())) {
            throw new BadCredentialsException("Your account is already linked to a different Google account.");
        }

        currentUser.setGoogleSub(claims.sub());
        currentUser.setGoogleEmail(claims.email());
        userRepository.save(currentUser);

        // Also add verified email contact if not already present
        boolean contactExists = contactRepository.findByPortalUserIdOrderByVerifiedAtAsc(currentUser.getId())
                .stream()
                .anyMatch(c -> "EMAIL".equalsIgnoreCase(c.getContactType()) && claims.email().equalsIgnoreCase(c.getContactValue()));

        if (!contactExists) {
            contactRepository.save(new PortalVerifiedContact(currentUser, "EMAIL", claims.email(), currentUser.getPrimaryEmail() == null));
        }

        auditLogService.record(
                "portal:" + currentUser.getUserUuid(),
                "PORTAL_GOOGLE_LINKED",
                "PORTAL_USER",
                currentUser.getId().toString(),
                clientIp,
                "GoogleSub=" + claims.sub()
        );

        log.info("Securely linked Google identity sub={} to authenticated userUuid={}", claims.sub(), currentUser.getUserUuid());
    }
}
