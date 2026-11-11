package org.mahavirtrust.backend.service.portal;

import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.PortalAuthResponse;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.exception.ProviderDispatchException;
import org.mahavirtrust.backend.exception.ProviderUnconfiguredException;
import org.mahavirtrust.backend.exception.RateLimitExceededException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.notification.*;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class OtpAuthService {

    private static final Logger log = LoggerFactory.getLogger(OtpAuthService.class);
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,63}$");
    private static final Pattern E164_PHONE_PATTERN = Pattern.compile("^\\+[1-9][0-9]{7,14}$");

    private final OtpVerificationRepository otpRepository;
    private final PortalUserRepository userRepository;
    private final PortalUserRoleRepository roleRepository;
    private final PortalUserProfileRepository profileRepository;
    private final PortalVerifiedContactRepository contactRepository;
    private final PortalRefreshTokenRepository refreshTokenRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final EmailProvider emailProvider;
    private final SmsProvider smsProvider;
    private final EmailTemplateRenderer emailRenderer;
    private final NotificationOutboxService outboxService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditLogService auditLogService;

    private final SecureRandom secureRandom = new SecureRandom();
    private final int expirySeconds;
    private final int resendCooldownSeconds;
    private final int maxAttempts;
    private final String otpPepper;
    private final String fromNotifications;
    private final boolean schedulingEnabled;

    public OtpAuthService(
            OtpVerificationRepository otpRepository,
            PortalUserRepository userRepository,
            PortalUserRoleRepository roleRepository,
            PortalUserProfileRepository profileRepository,
            PortalVerifiedContactRepository contactRepository,
            PortalRefreshTokenRepository refreshTokenRepository,
            NotificationPreferenceRepository preferenceRepository,
            EmailProvider emailProvider,
            SmsProvider smsProvider,
            EmailTemplateRenderer emailRenderer,
            NotificationOutboxService outboxService,
            JwtTokenProvider jwtTokenProvider,
            AuditLogService auditLogService,
            @Value("${app.otp.expiry-seconds:600}") int expirySeconds,
            @Value("${app.otp.resend-cooldown-seconds:60}") int resendCooldownSeconds,
            @Value("${app.otp.max-attempts:5}") int maxAttempts,
            @Value("${app.otp.pepper:mect-otp-default-dev-pepper}") String otpPepper,
            @Value("${app.resend.from-notifications:MECT Notifications <notifications@mect.org.in>}") String fromNotifications,
            @Value("${app.scheduling.enabled:true}") boolean schedulingEnabled) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.contactRepository = contactRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.preferenceRepository = preferenceRepository;
        this.emailProvider = emailProvider;
        this.smsProvider = smsProvider;
        this.emailRenderer = emailRenderer;
        this.outboxService = outboxService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditLogService = auditLogService;
        this.expirySeconds = expirySeconds;
        this.resendCooldownSeconds = resendCooldownSeconds;
        this.maxAttempts = maxAttempts;
        this.otpPepper = otpPepper;
        this.fromNotifications = fromNotifications;
        this.schedulingEnabled = schedulingEnabled;
    }

    @Transactional
    public Map<String, Object> requestOtp(OtpRequestPayload request, Long currentPortalUserId, String clientIp) {
        String channel = request.channel().trim().toUpperCase(Locale.ROOT);
        String purpose = (request.purpose() == null || request.purpose().isBlank()) ? "LOGIN" : request.purpose().trim().toUpperCase(Locale.ROOT);

        if ("CONTACT_CHANGE".equals(purpose) && currentPortalUserId == null) {
            throw new BadCredentialsException("Authentication required to verify a new contact.");
        }

        String normalizedTarget = normalizeAndValidateContact(channel, request.target());

        if ("EMAIL".equals(channel) && !emailProvider.isConfigured()) {
            log.error("Email OTP requested for purpose={} but RESEND_API_KEY is not configured in backend runtime.", purpose);
            throw new ProviderUnconfiguredException(
                    "RESEND",
                    "Email service is temporarily unavailable. Please try again shortly."
            );
        }
        if ("PHONE".equals(channel) && !smsProvider.isConfigured()) {
            log.warn("Phone SMS OTP requested for purpose={} while SMS provider={}", purpose, smsProvider.getProviderName());
            throw new ProviderUnconfiguredException(
                    smsProvider.getProviderName(),
                    "SMS verification is currently unavailable. Please use Email OTP to sign in."
            );
        }

        Instant now = Instant.now();
        Optional<OtpVerification> latestOpt = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc(
                channel, normalizedTarget, purpose);
        if (latestOpt.isPresent()) {
            OtpVerification latest = latestOpt.get();
            if (latest.getUsedAt() == null && now.isBefore(latest.getResendAvailableAt())) {
                long waitSeconds = ChronoUnit.SECONDS.between(now, latest.getResendAvailableAt()) + 1;
                throw new RateLimitExceededException("Please wait " + waitSeconds + " seconds before requesting another verification code.");
            }
        }

        long recentCount = otpRepository.countByChannelAndTargetValueAndCreatedAtAfter(
                channel, normalizedTarget, now.minus(15, ChronoUnit.MINUTES));
        if (recentCount >= 5) {
            throw new RateLimitExceededException("Too many verification code requests. Please try again after 15 minutes.");
        }

        // Invalidate prior active OTP on new request
        latestOpt.ifPresent(prev -> {
            if (prev.getUsedAt() == null) {
                prev.setUsedAt(now);
                otpRepository.save(prev);
            }
        });

        String rawOtp = String.format("%06d", secureRandom.nextInt(1_000_000));
        String otpHash = hashOtp(channel, purpose, normalizedTarget, rawOtp);

        OtpVerification otp = new OtpVerification();
        otp.setChannel(channel);
        otp.setPurpose(purpose);
        otp.setTargetValue(normalizedTarget);
        otp.setPortalUserId(currentPortalUserId);
        otp.setOtpHash(otpHash);
        otp.setAttempts(0);
        otp.setMaxAttempts(maxAttempts);
        otp.setExpiresAt(now.plusSeconds(expirySeconds));
        otp.setResendAvailableAt(now.plusSeconds(resendCooldownSeconds));
        otp.setRequestIp(clientIp);
        otpRepository.save(otp);

        int expiryMinutes = Math.max(1, expirySeconds / 60);
        ProviderDispatchResult dispatch;
        if ("EMAIL".equals(channel)) {
            EmailTemplateRenderer.RenderedEmail rendered = emailRenderer.renderOtpEmail(
                    rawOtp,
                    expiryMinutes,
                    "CONTACT_CHANGE".equals(purpose) ? "Contact Verification" : "Portal Sign-In"
            );
            dispatch = emailProvider.sendEmail(
                    fromNotifications,
                    normalizedTarget,
                    rendered.subject(),
                    rendered.htmlBody(),
                    null,
                    null,
                    Map.of("category", "otp_verification")
            );
            if (!"SENT".equals(dispatch.status())) {
                log.error("OTP email delivery failed status={} error={} from={}",
                        dispatch.status(), dispatch.errorMessage(), fromNotifications);
                throw new ProviderDispatchException(
                        emailProvider.getProviderName(),
                        "Unable to send verification code right now. Please try again shortly."
                );
            }
        } else {
            dispatch = smsProvider.sendOtpSms(normalizedTarget, rawOtp, expiryMinutes);
            if (!"SENT".equals(dispatch.status())) {
                log.error("OTP SMS delivery failed status={} error={}", dispatch.status(), dispatch.errorMessage());
                throw new ProviderDispatchException(
                        smsProvider.getProviderName(),
                        "Unable to deliver SMS verification code right now. Please try again or use Email OTP."
                );
            }
        }

        auditLogService.record(
                currentPortalUserId != null ? "portal:" + currentPortalUserId : "PORTAL_PUBLIC",
                "OTP_DISPATCHED",
                "PORTAL_OTP",
                channel,
                clientIp,
                "Purpose=" + purpose + ", TargetHash=" + HmacCryptoUtil.sha256Hex(normalizedTarget).substring(0, 12)
        );

        String successMessage = "EMAIL".equals(channel)
                ? "Verification code sent successfully. Please check your inbox."
                : "Verification code sent successfully via SMS.";

        return Map.of(
                "accepted", true,
                "message", successMessage,
                "channel", channel,
                "cooldownSeconds", resendCooldownSeconds,
                "expiresInSeconds", expirySeconds
        );
    }

    @Transactional(noRollbackFor = BadCredentialsException.class)
    public PortalAuthResponse verifyOtpAndLogin(OtpVerifyPayload request, String clientIp) {
        String channel = request.channel().trim().toUpperCase(Locale.ROOT);
        String purpose = (request.purpose() == null || request.purpose().isBlank()) ? "LOGIN" : request.purpose().trim().toUpperCase(Locale.ROOT);
        if (!"LOGIN".equals(purpose)) {
            throw new IllegalArgumentException("Use contact-change endpoint to complete CONTACT_CHANGE verification.");
        }

        String normalizedTarget = normalizeAndValidateContact(channel, request.target());
        OtpVerification record = verifyOtpRecordOrThrow(channel, "LOGIN", normalizedTarget, request.otpCode(), clientIp);

        // Locate existing user cleanly via verified contact or primary column (zero duplicates!)
        boolean isNewUser = false;
        PortalUser user = contactRepository.findByContactTypeAndContactValueIgnoreCase(channel, normalizedTarget)
                .map(PortalVerifiedContact::getPortalUser)
                .orElseGet(() -> "EMAIL".equals(channel)
                        ? userRepository.findByPrimaryEmailIgnoreCase(normalizedTarget).orElse(null)
                        : userRepository.findByPrimaryPhone(normalizedTarget).orElse(null));

        if (user == null) {
            isNewUser = true;
            user = new PortalUser();
            user.setUserUuid(UUID.randomUUID().toString());
            if ("EMAIL".equals(channel)) {
                user.setPrimaryEmail(normalizedTarget);
            } else {
                user.setPrimaryPhone(normalizedTarget);
            }
            user.setStatus("ACTIVE");
            user.setProfileCompleted(false);
            user = userRepository.save(user);

            roleRepository.save(new PortalUserRole(user, PortalRoleName.ROLE_GENERAL_USER));
            NotificationPreference pref = new NotificationPreference();
            pref.setPortalUser(user);
            preferenceRepository.save(pref);
            contactRepository.save(new PortalVerifiedContact(user, channel, normalizedTarget, true));
        } else {
            if (!"ACTIVE".equals(user.getStatus())) {
                throw new BadCredentialsException("This portal account is currently inactive. Please contact MECT support.");
            }
            if (!contactRepository.existsByContactTypeAndContactValueIgnoreCase(channel, normalizedTarget)) {
                contactRepository.save(new PortalVerifiedContact(user, channel, normalizedTarget, false));
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
                .orElse(null);

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                isNewUser ? "PORTAL_REGISTERED" : "PORTAL_LOGIN_SUCCESS",
                "PORTAL_USER",
                user.getId().toString(),
                clientIp,
                "Channel=" + channel + ", Roles=" + roles
        );

        if (isNewUser && user.getPrimaryEmail() != null) {
            outboxService.enqueueEmail(
                    "WELCOME_USER:" + user.getId(),
                    "WELCOME",
                    user.getId(),
                    null,
                    user.getPrimaryEmail(),
                    false,
                    emailRenderer.renderWelcomeEmail(fullName != null ? fullName : "Supporter"),
                    null,
                    Map.of("userUuid", user.getUserUuid())
            );
        }

        return PortalAuthResponse.of(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getAccessTokenValiditySeconds(),
                user.getUserUuid(),
                user.getPrimaryEmail(),
                user.getPrimaryPhone(),
                fullName,
                user.isProfileCompleted(),
                roles
        );
    }

    @Transactional(noRollbackFor = BadCredentialsException.class)
    public void verifyContactChange(Long portalUserId, OtpVerifyPayload request, String clientIp) {
        String channel = request.channel().trim().toUpperCase(Locale.ROOT);
        String normalizedTarget = normalizeAndValidateContact(channel, request.target());

        verifyOtpRecordOrThrow(channel, "CONTACT_CHANGE", normalizedTarget, request.otpCode(), clientIp);

        PortalUser currentUser = userRepository.findById(portalUserId)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        Optional<PortalVerifiedContact> existingOwner = contactRepository.findByContactTypeAndContactValueIgnoreCase(channel, normalizedTarget);
        if (existingOwner.isPresent() && !existingOwner.get().getPortalUser().getId().equals(portalUserId)) {
            throw new IllegalArgumentException("This contact is already associated with another verified portal account.");
        }

        if ("EMAIL".equals(channel)) {
            currentUser.setPrimaryEmail(normalizedTarget);
        } else {
            currentUser.setPrimaryPhone(normalizedTarget);
        }
        userRepository.save(currentUser);

        if (existingOwner.isEmpty()) {
            contactRepository.save(new PortalVerifiedContact(currentUser, channel, normalizedTarget, true));
        }

        auditLogService.record(
                "portal:" + currentUser.getUserUuid(),
                "PORTAL_CONTACT_VERIFIED",
                "PORTAL_USER",
                currentUser.getId().toString(),
                clientIp,
                "Updated verified contact channel=" + channel
        );

        if (currentUser.getPrimaryEmail() != null) {
            String fullName = profileRepository.findByPortalUserId(currentUser.getId())
                    .map(PortalUserProfile::getFullName).orElse("Supporter");
            outboxService.enqueueEmail(
                    "SEC_CONTACT_CHANGE:" + currentUser.getId() + ":" + Instant.now().getEpochSecond(),
                    "ACCOUNT_SECURITY_NOTICE",
                    currentUser.getId(),
                    null,
                    currentUser.getPrimaryEmail(),
                    false,
                    emailRenderer.renderSecurityNoticeEmail(fullName, "A new verified " + channel.toLowerCase() + " contact was linked to your MECT portal account."),
                    null,
                    Map.of()
            );
        }
    }

    @Transactional
    public PortalAuthResponse refreshPortalToken(String rawRefreshToken, String clientIp) {
        String hash = jwtTokenProvider.hashToken(rawRefreshToken);
        PortalRefreshToken tokenEntity = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BadCredentialsException("Invalid or expired portal refresh token."));

        if (tokenEntity.isRevoked() || tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new BadCredentialsException("Portal refresh token has expired or been revoked.");
        }

        PortalUser user = tokenEntity.getPortalUser();
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BadCredentialsException("Portal user account is inactive.");
        }

        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        List<String> roles = roleRepository.findByPortalUserId(user.getId()).stream()
                .map(r -> r.getRoleName().name())
                .toList();
        if (roles.isEmpty()) {
            roles = List.of(PortalRoleName.ROLE_GENERAL_USER.name());
        }

        String accessToken = jwtTokenProvider.generatePortalAccessToken(user.getUserUuid(), roles);
        String newRawRefresh = jwtTokenProvider.generateRawRefreshToken();
        refreshTokenRepository.save(new PortalRefreshToken(
                user,
                jwtTokenProvider.hashToken(newRawRefresh),
                Instant.now().plusSeconds(jwtTokenProvider.getRefreshTokenValiditySeconds())
        ));

        String fullName = profileRepository.findByPortalUserId(user.getId())
                .map(PortalUserProfile::getFullName)
                .orElse(null);

        return PortalAuthResponse.of(
                accessToken,
                newRawRefresh,
                jwtTokenProvider.getAccessTokenValiditySeconds(),
                user.getUserUuid(),
                user.getPrimaryEmail(),
                user.getPrimaryPhone(),
                fullName,
                user.isProfileCompleted(),
                roles
        );
    }

    @Transactional
    public void logoutPortalUser(Long portalUserId, String userUuid, String clientIp) {
        refreshTokenRepository.revokeAllForUser(portalUserId);
        auditLogService.record("portal:" + userUuid, "PORTAL_LOGOUT", "PORTAL_USER", portalUserId.toString(), clientIp, "Portal session terminated");
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupExpiredOtps() {
        if (!schedulingEnabled) {
            return;
        }
        otpRepository.deleteByExpiresAtBefore(Instant.now().minus(24, ChronoUnit.HOURS));
    }

    private OtpVerification verifyOtpRecordOrThrow(String channel, String purpose, String normalizedTarget, String otpCode, String clientIp) {
        OtpVerification record = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc(
                        channel, normalizedTarget, purpose)
                .orElseThrow(() -> new BadCredentialsException("No active verification code found. Please request a new code."));

        Instant now = Instant.now();
        if (record.getUsedAt() != null) {
            throw new BadCredentialsException("This verification code has already been used. Please request a new code.");
        }
        if (record.getExpiresAt().isBefore(now)) {
            throw new BadCredentialsException("Verification code expired. Please request a new verification code.");
        }
        if (record.getAttempts() >= record.getMaxAttempts()) {
            throw new BadCredentialsException("Maximum verification attempts exceeded. Please request a new code.");
        }

        String providedHash = hashOtp(channel, purpose, normalizedTarget, otpCode.trim());
        boolean match = MessageDigest.isEqual(
                record.getOtpHash().getBytes(StandardCharsets.UTF_8),
                providedHash.getBytes(StandardCharsets.UTF_8)
        );

        if (!match) {
            record.setAttempts(record.getAttempts() + 1);
            otpRepository.save(record);
            auditLogService.record(
                    "PORTAL_PUBLIC",
                    "OTP_VERIFY_FAILED",
                    "PORTAL_OTP",
                    channel,
                    clientIp,
                    "Attempt " + record.getAttempts() + "/" + record.getMaxAttempts()
            );
            throw new BadCredentialsException("Incorrect verification code. Please check the 6-digit code and try again.");
        }

        record.setUsedAt(now);
        return otpRepository.save(record);
    }

    public String normalizeAndValidateContact(String channel, String rawTarget) {
        String trimmed = rawTarget == null ? "" : rawTarget.trim();
        if ("EMAIL".equals(channel)) {
            String normalized = trimmed.toLowerCase(Locale.ROOT);
            if (!EMAIL_PATTERN.matcher(normalized).matches()) {
                throw new IllegalArgumentException("Please enter a valid email address.");
            }
            return normalized;
        }
        // Normalize phone numbers to E.164 (default +91 for 10-digit Indian mobile numbers)
        String digitsOnly = trimmed.replaceAll("[\\s\\-()]", "");
        if (digitsOnly.matches("^[6-9][0-9]{9}$")) {
            digitsOnly = "+91" + digitsOnly;
        } else if (digitsOnly.matches("^91[6-9][0-9]{9}$")) {
            digitsOnly = "+" + digitsOnly;
        }
        if (!E164_PHONE_PATTERN.matcher(digitsOnly).matches()) {
            throw new IllegalArgumentException("Please enter a valid 10-digit Indian mobile number or international E.164 phone number (e.g. +919876543210).");
        }
        return digitsOnly;
    }

    private String hashOtp(String channel, String purpose, String normalizedTarget, String rawOtp) {
        return HmacCryptoUtil.hmacSha256Hex(otpPepper, channel + "|" + purpose + "|" + normalizedTarget + "|" + rawOtp);
    }
}

