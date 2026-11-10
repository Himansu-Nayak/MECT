package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.UpdateNotificationPreferencesRequest;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.CommunicationConsent;
import org.mahavirtrust.backend.entity.OtpVerification;
import org.mahavirtrust.backend.entity.PortalUser;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.SmsProvider;
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

import java.time.Instant;
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

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private SmsProvider smsProvider;

    private final AtomicReference<String> capturedEmailOtp = new AtomicReference<>();
    private final AtomicReference<String> capturedSmsOtp = new AtomicReference<>();

    @BeforeEach
    void setup() {
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
}

