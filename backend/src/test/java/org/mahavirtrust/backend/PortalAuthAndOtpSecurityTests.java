package org.mahavirtrust.backend;

import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.portal.GoogleAuthPayload;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.UpdateNotificationPreferencesRequest;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.CommunicationConsent;
import org.mahavirtrust.backend.entity.OtpVerification;
import org.mahavirtrust.backend.entity.PortalUser;
import org.mahavirtrust.backend.entity.PortalUserProfile;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.SmsProvider;
import org.mahavirtrust.backend.service.portal.DefaultGoogleTokenVerifier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PortalAuthAndOtpSecurityTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OtpVerificationRepository otpRepository;
    @Autowired private PortalRefreshTokenRepository portalRefreshTokenRepository;
    @Autowired private PortalVerifiedContactRepository contactRepository;
    @Autowired private CommunicationConsentRepository consentRepository;
    @Autowired private NotificationPreferenceRepository preferenceRepository;
    @Autowired private NotificationDeliveryLogRepository deliveryLogRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private PortalUserProfileRepository profileRepository;
    @Autowired private PortalUserRoleRepository portalUserRoleRepository;
    @Autowired private PortalUserRepository portalUserRepository;
    @Autowired private org.mahavirtrust.backend.service.notification.EmailTemplateRenderer emailTemplateRenderer;
    @Autowired private DefaultGoogleTokenVerifier defaultGoogleTokenVerifier;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private SmsProvider smsProvider;

    private final AtomicReference<String> capturedEmailOtp = new AtomicReference<>();
    private final AtomicReference<String> capturedSmsOtp = new AtomicReference<>();

    private KeyPair validGoogleKeyPair;
    private KeyPair untrustedKeyPair;
    private static final String TEST_KID = "test-google-kid-2026";

    @BeforeEach
    void setup() throws Exception {
        deliveryLogRepository.deleteAll();
        outboxRepository.deleteAll();
        otpRepository.deleteAll();
        portalRefreshTokenRepository.deleteAll();
        contactRepository.deleteAll();
        consentRepository.deleteAll();
        preferenceRepository.deleteAll();
        profileRepository.deleteAll();
        portalUserRoleRepository.deleteAll();
        portalUserRepository.deleteAll();

        capturedEmailOtp.set(null);
        capturedSmsOtp.set(null);

        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        validGoogleKeyPair = kpg.generateKeyPair();
        untrustedKeyPair = kpg.generateKeyPair();

        defaultGoogleTokenVerifier.clearKeyCache();
        defaultGoogleTokenVerifier.registerTestPublicKey(TEST_KID, validGoogleKeyPair.getPublic());

        when(emailProvider.isConfigured()).thenReturn(true);
        when(emailProvider.getProviderName()).thenReturn("RESEND");
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenAnswer(inv -> {
                    String html = inv.getArgument(3, String.class);
                    Matcher m = Pattern.compile("\\b([0-9]{6})\\b").matcher(html.replaceAll("<[^>]+>", " "));
                    if (m.find()) {
                        capturedEmailOtp.set(m.group(1));
                    }
                    return ProviderDispatchResult.sent("re_test_" + System.nanoTime(), "{}");
                });

        when(smsProvider.isConfigured()).thenReturn(false);
        when(smsProvider.getProviderName()).thenReturn("NONE");
    }

    @Test
    void testEmailOtpFlowHashesSecretPreventsReuseAndAssignsGeneralUserOnly() throws Exception {
        String email = "donor.candidate@example.org";
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", email, "LOGIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accepted").value(true));

        String rawOtp = capturedEmailOtp.get();
        assertThat(rawOtp).matches("^[0-9]{6}$");

        // Plaintext OTP must NEVER be stored in database
        OtpVerification stored = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc("EMAIL", email, "LOGIN").orElseThrow();
        assertThat(stored.getOtpHash()).isNotEqualTo(rawOtp);
        assertThat(stored.getOtpHash()).hasSize(64);

        // Resend immediately blocked by cooldown
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", email, "LOGIN"))))
                .andExpect(status().isTooManyRequests());

        // Verify OTP
        MvcResult verifyRes = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", email, rawOtp, "LOGIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.roles[0]").value("ROLE_GENERAL_USER"))
                .andExpect(jsonPath("$.profileCompleted").value(false))
                .andReturn();

        JsonNode authJson = objectMapper.readTree(verifyRes.getResponse().getContentAsString());
        String accessToken = authJson.get("accessToken").asString();

        // Single-use OTP replay must fail
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", email, rawOtp, "LOGIN"))))
                .andExpect(status().isUnauthorized());

        // Portal token must NOT access /admin endpoints (role isolation)
        mockMvc.perform(get("/admin/donors")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden());

        // Profile completion + explicit optional WhatsApp consent
        UpdatePortalProfileRequest profReq = new UpdatePortalProfileRequest(
                "Asha Patnaik",
                "Lane 2, Shastri Nagar",
                "Balangir",
                "Odisha",
                "767001",
                "India",
                null,
                null,
                "en",
                null,
                true,
                "+919876543210",
                "wa-v1.0"
        );
        mockMvc.perform(put("/portal/me/profile")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account.profileCompleted").value(true))
                .andExpect(jsonPath("$.account.isDonor").value(false))
                .andExpect(jsonPath("$.account.preferences.whatsappOptIn").value(true));

        PortalUser u = portalUserRepository.findByPrimaryEmailIgnoreCase(email).orElseThrow();
        CommunicationConsent consent = consentRepository.findByPortalUserIdAndChannel(u.getId(), "WHATSAPP").orElseThrow();
        assertThat(consent.getConsentStatus()).isEqualTo("OPTED_IN");
        assertThat(consent.getConsentedAt()).isNotNull();

        // Opt-out updates optOutAt cleanly
        mockMvc.perform(put("/portal/me/preferences")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateNotificationPreferencesRequest(true, false, false, "+919876543210", "wa-v1.0"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account.preferences.whatsappOptIn").value(false));

        CommunicationConsent updatedConsent = consentRepository.findByPortalUserIdAndChannel(u.getId(), "WHATSAPP").orElseThrow();
        assertThat(updatedConsent.getConsentStatus()).isEqualTo("OPTED_OUT");
        assertThat(updatedConsent.getOptOutAt()).isNotNull();
    }

    @Test
    void testPhoneOtpFailsClosedWhenUnconfiguredAndWorksWithSmsProviderAndNoDuplicates() throws Exception {
        // Fails closed honestly when SMS provider unconfigured
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", "9876543210", "LOGIN"))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.error").value("Provider Configuration Required"));

        // Configure SMS provider cleanly
        otpRepository.deleteAll();
        when(smsProvider.isConfigured()).thenReturn(true);
        when(smsProvider.getProviderName()).thenReturn("TWILIO");
        when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt()))
                .thenAnswer(inv -> {
                    capturedSmsOtp.set(inv.getArgument(1, String.class));
                    return ProviderDispatchResult.sent("sm_test_1", "{}");
                });

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", "9876543210", "LOGIN"))))
                .andExpect(status().isOk());

        // Incorrect OTP attempts increment & lock on 5th miss
        OtpVerification rec = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc("PHONE", "+919876543210", "LOGIN").orElseThrow();
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/portal/auth/verify-otp")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", "9876543210", "000000", "LOGIN"))))
                    .andExpect(status().isUnauthorized());
        }
        // Correct code must now also fail because maxAttempts was reached
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", "9876543210", capturedSmsOtp.get(), "LOGIN"))))
                .andExpect(status().isUnauthorized());

        // Reset cooldown & request fresh OTP for existing/new account deduplication check
        otpRepository.deleteAll();
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", "+919876543210", "LOGIN"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", "9876543210", capturedSmsOtp.get(), "LOGIN"))))
                .andExpect(status().isOk());

        assertThat(portalUserRepository.count()).isEqualTo(1L);

        // Login again later with same phone -> still 1 user row!
        OtpVerification latest = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc("PHONE", "+919876543210", "LOGIN").orElseThrow();
        latest.setResendAvailableAt(Instant.now().minusSeconds(10));
        otpRepository.save(latest);

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", "9876543210", "LOGIN"))))
                .andExpect(status().isOk());
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", "+919876543210", capturedSmsOtp.get(), "LOGIN"))))
                .andExpect(status().isOk());

        assertThat(portalUserRepository.count()).isEqualTo(1L);
    }

    @Test
    void testExpiredOtpAndUnauthenticatedProtection() throws Exception {
        mockMvc.perform(get("/portal/me/dashboard")).andExpect(status().isUnauthorized());

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", "expired@example.org", "LOGIN"))))
                .andExpect(status().isOk());

        OtpVerification rec = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc("EMAIL", "expired@example.org", "LOGIN").orElseThrow();
        rec.setExpiresAt(Instant.now().minusSeconds(60));
        otpRepository.save(rec);

        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", "expired@example.org", capturedEmailOtp.get(), "LOGIN"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Verification code expired. Please request a new verification code."));
    }

    @Test
    void testUnconfiguredResendAndDispatchFailureReturnSanitizedMessagesWithNoOrphanOtp() throws Exception {
        // 1. Unconfigured RESEND_API_KEY must return 503 with user-friendly message, empty validationErrors (never "RESEND"), and zero saved OTP rows
        when(emailProvider.isConfigured()).thenReturn(false);

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", "missing-key@example.org", "LOGIN"))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.error").value("Provider Configuration Required"))
                .andExpect(jsonPath("$.message").value("Email service is temporarily unavailable. Please try again shortly."))
                .andExpect(jsonPath("$.validationErrors").isEmpty());

        assertThat(otpRepository.count()).isZero();

        // 2. Resend HTTP/API failure must return 503 user-friendly error and roll back OTP row so retry isn't cooldown-locked
        when(emailProvider.isConfigured()).thenReturn(true);
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenReturn(ProviderDispatchResult.failed("RESEND_FORBIDDEN (HTTP 403)"));

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", "api-fail@example.org", "LOGIN"))))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.error").value("Service Temporarily Unavailable"))
                .andExpect(jsonPath("$.message").value("Unable to send verification code right now. Please try again shortly."))
                .andExpect(jsonPath("$.validationErrors").isEmpty());

        assertThat(otpRepository.count()).isZero();
    }

    @Test
    void testCentralizedEmailTemplatesAndWelcomeDeduplication() throws Exception {
        var otpMail = emailTemplateRenderer.renderOtpEmail("482913", 10, "Portal Sign-In");
        assertThat(otpMail.subject()).isEqualTo("Your MECT Verification Code");
        assertThat(otpMail.templateVersion()).isEqualTo("otp-v2.0");
        assertThat(otpMail.htmlBody())
                .contains("Verify Your Email Address")
                .contains("482913")
                .contains("mect-official-emblem.png")
                .contains("#283730")
                .contains("#A45E44")
                .contains("Do not share this code")
                .doesNotContain("RESEND");

        var welcomeMail = emailTemplateRenderer.renderWelcomeEmail("Asha Patnaik");
        assertThat(welcomeMail.subject()).isEqualTo("Welcome to the MECT Community");
        assertThat(welcomeMail.templateVersion()).isEqualTo("welcome-v2.0");
        assertThat(welcomeMail.htmlBody())
                .contains("Welcome, Asha!")
                .contains("Go to My Dashboard")
                .contains("/portal/dashboard")
                .doesNotContain("Your donation total");

        // Verify registration sends welcome email once and returning login does NOT duplicate it
        String email = "welcome.dedup@example.org";
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", email, "LOGIN"))))
                .andExpect(status().isOk());
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", email, capturedEmailOtp.get(), "LOGIN"))))
                .andExpect(status().isOk());

        long welcomeCountAfterReg = outboxRepository.findAll().stream()
                .filter(o -> "WELCOME".equals(o.getEventType()))
                .count();
        assertThat(welcomeCountAfterReg).isEqualTo(1L);

        // Second login
        OtpVerification rec = otpRepository.findTopByChannelAndTargetValueAndPurposeOrderByIdDesc("EMAIL", email, "LOGIN").orElseThrow();
        rec.setResendAvailableAt(Instant.now().minusSeconds(10));
        otpRepository.save(rec);

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", email, "LOGIN"))))
                .andExpect(status().isOk());
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", email, capturedEmailOtp.get(), "LOGIN"))))
                .andExpect(status().isOk());

        long welcomeCountAfterSecondLogin = outboxRepository.findAll().stream()
                .filter(o -> "WELCOME".equals(o.getEventType()))
                .count();
        assertThat(welcomeCountAfterSecondLogin).isEqualTo(1L);
    }

    private String createSignedGoogleToken(
            String sub, String email, boolean emailVerified, String name, String aud,
            long expEpochSeconds, PrivateKey privateKey, String kid, String iss) {
        return Jwts.builder()
                .header()
                .keyId(kid)
                .and()
                .issuer(iss)
                .audience().add(aud).and()
                .subject(sub)
                .claim("email", email)
                .claim("email_verified", emailVerified)
                .claim("name", name)
                .expiration(Date.from(Instant.ofEpochSecond(expEpochSeconds)))
                .signWith(privateKey, Jwts.SIG.RS256)
                .compact();
    }

    @Test
    void testGoogleSignIdTokenCryptographicAuthenticationAndUserCreation() throws Exception {
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        String validToken = createSignedGoogleToken(
                "google-sub-001", "ananya.mishra@example.org", true, "Ananya Mishra",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        GoogleAuthPayload payload = new GoogleAuthPayload(validToken, "Ananya Mishra", "Bhubaneswar");

        MvcResult res = mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.primaryEmail").value("ananya.mishra@example.org"))
                .andExpect(jsonPath("$.fullName").value("Ananya Mishra"))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(res.getResponse().getContentAsString());
        String userUuid = responseNode.path("userUuid").asString();

        PortalUser createdUser = portalUserRepository.findByGoogleSub("google-sub-001").orElseThrow();
        assertThat(createdUser.getUserUuid()).isEqualTo(userUuid);
        assertThat(createdUser.getAuthProvider()).isEqualTo("GOOGLE");
        assertThat(createdUser.getGoogleSub()).isEqualTo("google-sub-001");
        assertThat(createdUser.getGoogleEmail()).isEqualTo("ananya.mishra@example.org");
        assertThat(createdUser.getPrimaryEmail()).isEqualTo("ananya.mishra@example.org");

        PortalUserProfile profile = profileRepository.findByPortalUserId(createdUser.getId()).orElseThrow();
        assertThat(profile.getFullName()).isEqualTo("Ananya Mishra");
        assertThat(profile.getCity()).isEqualTo("Bhubaneswar");
    }

    @Test
    void testGoogleSignInRejectsCryptographicallyInvalidSignature() throws Exception {
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        // Token signed with untrusted/rogue private key
        String forgedToken = createSignedGoogleToken(
                "google-sub-hacker", "victim@example.org", true, "Hacker",
                "test-google-client-id", futureExp, untrustedKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(forgedToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid Google ID token cryptographic signature."));
    }

    @Test
    void testGoogleSignInRejectsInvalidOrExpiredToken() throws Exception {
        // Expired token
        long pastExp = Instant.now().minusSeconds(3600).getEpochSecond();
        String expiredToken = createSignedGoogleToken(
                "google-sub-exp", "expired@example.org", true, "Expired User",
                "test-google-client-id", pastExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(expiredToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Google ID token has expired."));

        // Audience mismatch
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        String wrongAudToken = createSignedGoogleToken(
                "google-sub-aud", "aud@example.org", true, "Wrong Aud",
                "unauthorized-aud-client", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(wrongAudToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Audience mismatch for Google ID token."));

        // Invalid issuer
        String wrongIssToken = createSignedGoogleToken(
                "google-sub-iss", "iss@example.org", true, "Wrong Issuer",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://untrusted-issuer.org"
        );

        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(wrongIssToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid Google ID token issuer: https://untrusted-issuer.org"));

        // Missing subject claim
        String missingSubToken = createSignedGoogleToken(
                "", "nosub@example.org", true, "No Sub User",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(missingSubToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Missing subject claim in Google ID token."));
    }

    @Test
    void testGoogleSignInRejectsUnauthenticatedEmailAccountTakeover() throws Exception {
        // Register an existing user via Phone OTP
        when(smsProvider.isConfigured()).thenReturn(true);
        when(smsProvider.getProviderName()).thenReturn("FAST2SMS");
        when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt()))
                .thenAnswer(inv -> {
                    capturedSmsOtp.set(inv.getArgument(1, String.class));
                    return ProviderDispatchResult.sent("sms_test_" + System.nanoTime(), "{}");
                });

        String phone = "+919876543210";
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", phone, "LOGIN"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", phone, capturedSmsOtp.get(), "LOGIN", "Preexisting User", "Balangir"))))
                .andExpect(status().isOk());

        PortalUser preexisting = portalUserRepository.findByPrimaryPhone(phone).orElseThrow();
        preexisting.setPrimaryEmail("target.victim@example.org");
        portalUserRepository.save(preexisting);

        // An unauthenticated Google sign-in attempts to claim target.victim@example.org
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        String googleToken = createSignedGoogleToken(
                "google-attacker-sub", "target.victim@example.org", true, "Attacker",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        // MUST be rejected to prevent silent account takeover
        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(googleToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("An existing donor account was found for target.victim@example.org. For your security, please sign in with your Mobile OTP first, then link your Google account in Portal Security Settings."));

        // Ensure preexisting account was NOT modified
        PortalUser reloaded = portalUserRepository.findById(preexisting.getId()).orElseThrow();
        assertThat(reloaded.getGoogleSub()).isNull();
    }

    @Test
    void testAuthenticatedGoogleAccountLinkingFlow() throws Exception {
        // 1. Authenticate user via SMS OTP
        when(smsProvider.isConfigured()).thenReturn(true);
        when(smsProvider.getProviderName()).thenReturn("FAST2SMS");
        when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt()))
                .thenAnswer(inv -> {
                    capturedSmsOtp.set(inv.getArgument(1, String.class));
                    return ProviderDispatchResult.sent("sms_test_" + System.nanoTime(), "{}");
                });

        String phone = "+919876543219";
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", phone, "LOGIN"))))
                .andExpect(status().isOk());

        MvcResult loginRes = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", phone, capturedSmsOtp.get(), "LOGIN", "Verified Donor", "Bhubaneswar"))))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginRes.getResponse().getContentAsString()).path("accessToken").asString();

        // 2. Perform in-session Google account linking
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        String validGoogleToken = createSignedGoogleToken(
                "google-sub-verified-link-888", "verified.donor@example.org", true, "Verified Donor",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/me/link-google")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(validGoogleToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        PortalUser linkedUser = portalUserRepository.findByPrimaryPhone(phone).orElseThrow();
        assertThat(linkedUser.getGoogleSub()).isEqualTo("google-sub-verified-link-888");
        assertThat(linkedUser.getGoogleEmail()).isEqualTo("verified.donor@example.org");

        // 3. Subsequent login via Google authenticates into the SAME user account
        mockMvc.perform(post("/portal/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(validGoogleToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userUuid").value(linkedUser.getUserUuid()))
                .andExpect(jsonPath("$.primaryPhone").value(phone));

        // 4. Conflicting linking: Another user cannot claim this already-linked Google account
        String anotherPhone = "+919876543222";
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", anotherPhone, "LOGIN"))))
                .andExpect(status().isOk());

        MvcResult loginRes2 = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", anotherPhone, capturedSmsOtp.get(), "LOGIN", "Second Donor", "Balangir"))))
                .andExpect(status().isOk())
                .andReturn();

        String token2 = objectMapper.readTree(loginRes2.getResponse().getContentAsString()).path("accessToken").asString();

        mockMvc.perform(post("/portal/me/link-google")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(validGoogleToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("This Google account is already linked to another donor account."));
    }

    @Test
    void testUnauthenticatedGoogleAccountLinkingRejected() throws Exception {
        long futureExp = Instant.now().plusSeconds(3600).getEpochSecond();
        String validGoogleToken = createSignedGoogleToken(
                "google-sub-unauth-link", "unauth@example.org", true, "Unauth User",
                "test-google-client-id", futureExp, validGoogleKeyPair.getPrivate(), TEST_KID, "https://accounts.google.com"
        );

        mockMvc.perform(post("/portal/me/link-google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GoogleAuthPayload(validGoogleToken))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testMobileOtpRegistrationWithProgressiveProfile() throws Exception {
        when(smsProvider.isConfigured()).thenReturn(true);
        when(smsProvider.getProviderName()).thenReturn("FAST2SMS");
        when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt()))
                .thenAnswer(inv -> {
                    capturedSmsOtp.set(inv.getArgument(1, String.class));
                    return ProviderDispatchResult.sent("sms_test_" + System.nanoTime(), "{}");
                });

        String phone = "+919876543210";

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("PHONE", phone, "LOGIN"))))
                .andExpect(status().isOk());

        assertThat(capturedSmsOtp.get()).isNotNull().hasSize(6);

        OtpVerifyPayload verifyPayload = new OtpVerifyPayload("PHONE", phone, capturedSmsOtp.get(), "LOGIN", "Rohan Das", "Balangir");

        MvcResult res = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.primaryPhone").value(phone))
                .andExpect(jsonPath("$.fullName").value("Rohan Das"))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(res.getResponse().getContentAsString());
        String userUuid = responseNode.path("userUuid").asString();

        PortalUser user = portalUserRepository.findByPrimaryPhone(phone).orElseThrow();
        assertThat(user.getUserUuid()).isEqualTo(userUuid);

        PortalUserProfile profile = profileRepository.findByPortalUserId(user.getId()).orElseThrow();
        assertThat(profile.getFullName()).isEqualTo("Rohan Das");
        assertThat(profile.getCity()).isEqualTo("Balangir");
    }
}

