package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.donation.SubmitManualSbiUtrRequest;
import org.mahavirtrust.backend.dto.donation.VerifyGatewayPaymentRequest;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * MECT Phase 28 — Comprehensive Test Suite for Mandatory Mobile OTP Authentication,
 * Server-Side Access Control, District Support, and Authenticated Donation Security.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DonorAuthenticationAndDonationSecurityPhase28Tests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OtpVerificationRepository otpRepository;
    @Autowired private DonationProgrammeRepository programmeRepository;
    @Autowired private PortalUserRepository portalUserRepository;
    @Autowired private PortalUserProfileRepository profileRepository;
    @Autowired private PortalUserRoleRepository portalUserRoleRepository;
    @Autowired private PortalVerifiedContactRepository contactRepository;
    @Autowired private PortalRefreshTokenRepository refreshTokenRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private ManualBankTransferClaimRepository manualClaimRepository;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private SmsProvider smsProvider;

    private final AtomicReference<String> dispatchedSmsOtp = new AtomicReference<>();

    @BeforeEach
    void setup() {
        receiptRepository.deleteAll();
        manualClaimRepository.deleteAll();
        paymentRepository.deleteAll();
        donationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        contactRepository.deleteAll();
        profileRepository.deleteAll();
        portalUserRoleRepository.deleteAll();
        portalUserRepository.deleteAll();
        otpRepository.deleteAll();

        dispatchedSmsOtp.set(null);

        when(smsProvider.isConfigured()).thenReturn(true);
        when(smsProvider.getProviderName()).thenReturn("MOCK_SMS");
        when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt())).thenAnswer(inv -> {
            dispatchedSmsOtp.set(inv.getArgument(1, String.class));
            return ProviderDispatchResult.sent("sms_test_" + System.currentTimeMillis(), "{\"status\":\"ok\"}");
        });

        when(emailProvider.isConfigured()).thenReturn(true);
        when(emailProvider.getProviderName()).thenReturn("RESEND");
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenReturn(ProviderDispatchResult.sent("email_test_1", "{}"));
    }

    private String createTestDonorUser(String phone, String name) {
        PortalUser user = new PortalUser();
        user.setUserUuid(UUID.randomUUID().toString());
        user.setPrimaryPhone(phone);
        user.setStatus("ACTIVE");
        user.setProfileCompleted(true);
        user = portalUserRepository.save(user);

        portalUserRoleRepository.save(new PortalUserRole(user, PortalRoleName.ROLE_GENERAL_USER));

        PortalUserProfile profile = new PortalUserProfile();
        profile.setPortalUser(user);
        profile.setFullName(name);
        profile.setAddressLine("Station Road, Balangir");
        profile.setCity("Balangir");
        profile.setDistrict("Balangir");
        profile.setState("Odisha");
        profile.setPinCode("767001");
        profile.setCountry("India");
        profileRepository.save(profile);

        return jwtTokenProvider.generatePortalAccessToken(user.getUserUuid(), List.of("ROLE_GENERAL_USER"));
    }

    @Test
    void test1_guestRequestsToInitiateDonationSucceedWith201Created() throws Exception {
        InitiateDonationRequest req = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1000.00"),
                "Unauthenticated Visitor",
                "visitor@example.org",
                "+919876543210",
                "Balangir",
                null,
                null,
                false,
                "GATEWAY_CHECKOUT"
        );

        mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.donationReference").isNotEmpty())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void test2_unregisteredOrderVerificationReturns404NotFound() throws Exception {
        VerifyGatewayPaymentRequest req = new VerifyGatewayPaymentRequest(
                "MECT-DON-NONEXISTENT",
                "cf_order_test_101",
                "GATEWAY_CHECKOUT",
                "CF_ORDER_101"
        );

        mockMvc.perform(post("/public/donations/verify-checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound());
    }

    @Test
    void test3_guestRequestsToSubmitSbiUtrSucceedWith201Created() throws Exception {
        SubmitManualSbiUtrRequest req = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("2000.00"),
                "Guest Remitter",
                "guest@example.org",
                "+919876543210",
                "Balangir",
                null,
                null,
                false,
                true,
                "SBIN987654321012",
                LocalDate.now(),
                "UPI App",
                null,
                null
        );

        mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.claimReference").isNotEmpty())
                .andExpect(jsonPath("$.receiptIssued").value(false));
    }

    @Test
    void test4_mobileOtpRequestNormalizesIndian10DigitPhoneNumberToE164AndDispatches() throws Exception {
        OtpRequestPayload payload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accepted").value(true))
                .andExpect(jsonPath("$.channel").value("PHONE"))
                .andExpect(jsonPath("$.cooldownSeconds").value(60));

        assertThat(dispatchedSmsOtp.get()).isNotNull();
        assertThat(dispatchedSmsOtp.get()).matches("^[0-9]{6}$");

        List<OtpVerification> otps = otpRepository.findAll();
        assertThat(otps).hasSize(1);
        assertThat(otps.get(0).getTargetValue()).isEqualTo("+919853608113");
        assertThat(otps.get(0).getOtpHash()).isNotEqualTo(dispatchedSmsOtp.get()); // Stored hashed
    }

    @Test
    void test5_mobileOtpRequestEnforcesResendCooldown() throws Exception {
        OtpRequestPayload payload = new OtpRequestPayload("PHONE", "+919853608113", "LOGIN");

        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());

        // Second immediate request must be blocked by rate-limiting cooldown
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Please wait")));
    }

    @Test
    void test6_mobileOtpVerifyCreatesNewUserAndAssignsGeneralUserRole() throws Exception {
        OtpRequestPayload reqPayload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPayload)))
                .andExpect(status().isOk());

        String generatedOtp = dispatchedSmsOtp.get();
        assertThat(generatedOtp).isNotNull();

        OtpVerifyPayload verifyPayload = new OtpVerifyPayload("PHONE", "9853608113", generatedOtp, "LOGIN");
        MvcResult result = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.primaryPhone").value("+919853608113"))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_GENERAL_USER"))
                .andReturn();

        JsonNode authResp = objectMapper.readTree(result.getResponse().getContentAsString());
        String token = authResp.get("accessToken").asString();

        // User record is persisted cleanly with verified phone
        PortalUser user = portalUserRepository.findByPrimaryPhone("+919853608113").orElseThrow();
        assertThat(user.getStatus()).isEqualTo("ACTIVE");
        assertThat(contactRepository.findByContactTypeAndContactValueIgnoreCase("PHONE", "+919853608113")).isPresent();
    }

    @Test
    void test7_mobileOtpVerifyExistingUserReturnsTokensWithoutDuplicateRecords() throws Exception {
        String token1 = createTestDonorUser("+919853608113", "Biswajit Sahu");

        OtpRequestPayload reqPayload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPayload)))
                .andExpect(status().isOk());

        OtpVerifyPayload verifyPayload = new OtpVerifyPayload("PHONE", "+919853608113", dispatchedSmsOtp.get(), "LOGIN");
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Biswajit Sahu"));

        assertThat(portalUserRepository.findAll()).hasSize(1); // Zero duplicates
    }

    @Test
    void test8_invalidOtpCodeIncrementsAttemptsAndReturns401() throws Exception {
        OtpRequestPayload reqPayload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPayload)))
                .andExpect(status().isOk());

        OtpVerifyPayload badPayload = new OtpVerifyPayload("PHONE", "9853608113", "000000", "LOGIN");
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Incorrect verification code")));

        OtpVerification otp = otpRepository.findAll().get(0);
        assertThat(otp.getAttempts()).isEqualTo(1);
    }

    @Test
    void test9_expiredOtpCodeIsRejected() throws Exception {
        OtpRequestPayload reqPayload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPayload)))
                .andExpect(status().isOk());

        // Fast-forward expiry in db
        OtpVerification otp = otpRepository.findAll().get(0);
        otp.setExpiresAt(Instant.now().minus(5, ChronoUnit.MINUTES));
        otpRepository.save(otp);

        OtpVerifyPayload verifyPayload = new OtpVerifyPayload("PHONE", "9853608113", dispatchedSmsOtp.get(), "LOGIN");
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("expired")));
    }

    @Test
    void test10_reusedOtpCodeIsRejected() throws Exception {
        OtpRequestPayload reqPayload = new OtpRequestPayload("PHONE", "9853608113", "LOGIN");
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqPayload)))
                .andExpect(status().isOk());

        String code = dispatchedSmsOtp.get();

        // First verification succeeds
        OtpVerifyPayload verifyPayload = new OtpVerifyPayload("PHONE", "9853608113", code, "LOGIN");
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isOk());

        // Immediate second attempt with same code fails
        mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyPayload)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already been used")));
    }

    @Test
    void test11_authenticatedDonorCanInitiateDonationAndLinkToPortalAccount() throws Exception {
        String donorToken = createTestDonorUser("+919853608113", "Rasmita Meher");

        InitiateDonationRequest req = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("2500.00"),
                "Rasmita Meher",
                "rasmita@example.org",
                "+919853608113",
                "Balangir, Odisha",
                "ABCDE1234F",
                "For student tuition grant",
                false,
                "GATEWAY_CHECKOUT"
        );

        MvcResult initResult = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.donationReference").isNotEmpty())
                .andExpect(jsonPath("$.amount").value(2500.00))
                .andExpect(jsonPath("$.programmeCode").value("EDUCATION_LEARNING"))
                .andReturn();

        JsonNode initNode = objectMapper.readTree(initResult.getResponse().getContentAsString());
        String ref = initNode.get("donationReference").asString();

        Donation donation = donationRepository.findByDonationReference(ref).orElseThrow();
        assertThat(donation.getPortalUser()).isNotNull();
        assertThat(donation.getAmount()).isEqualByComparingTo("2500.00");
    }

    @Test
    void test12_authenticatedDonorCanUpdateProfileWithDistrictJurisdiction() throws Exception {
        String donorToken = createTestDonorUser("+919853608113", "Debasish Rath");

        UpdatePortalProfileRequest profReq = new UpdatePortalProfileRequest(
                "Debasish Rath",
                "Ward 12, Sub-Division Complex",
                "Titilagarh",
                "Balangir", // District
                "Odisha",
                "767033",
                "India",
                LocalDate.of(1988, 5, 14),
                null,
                "en",
                "ABCDE1234F",
                true,
                "+919853608113",
                "v1.0"
        );

        mockMvc.perform(put("/portal/me/profile")
                        .header("Authorization", "Bearer " + donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account.profile.district").value("Balangir"))
                .andExpect(jsonPath("$.account.profile.city").value("Titilagarh"));

        // Verify profile in dashboard endpoint includes district
        mockMvc.perform(get("/portal/auth/me")
                        .header("Authorization", "Bearer " + donorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account.profile.city").value("Titilagarh"))
                .andExpect(jsonPath("$.account.profile.district").value("Balangir"))
                .andExpect(jsonPath("$.account.profile.state").value("Odisha"))
                .andExpect(jsonPath("$.account.profile.panMasked").value("ABXXXX234F"));
    }

    @Test
    void test13_donorDashboardReflectsOnlyConfirmedDonationsTowardsSuccessfulTotal() throws Exception {
        String donorToken = createTestDonorUser("+919853608113", "Pradeep Das");
        PortalUser user = portalUserRepository.findByPrimaryPhone("+919853608113").orElseThrow();

        DonationProgramme prog = programmeRepository.findByCode("EDUCATION_LEARNING").orElseThrow();

        // 1. Confirmed donation of 3000
        Donation confirmed = new Donation();
        confirmed.setDonationReference("MECT-DON-CONF-001");
        confirmed.setPortalUser(user);
        confirmed.setProgramme(prog);
        confirmed.setAmount(new BigDecimal("3000.00"));
        confirmed.setDonorName("Pradeep Das");
        confirmed.setDonorPhone("+919853608113");
        confirmed.setStatus("SUCCESSFUL");
        confirmed.setPaymentMethod("GATEWAY_CHECKOUT");
        confirmed.setConfirmedAt(Instant.now());
        donationRepository.save(confirmed);

        // 2. Pending donation of 5000 (must NOT be counted in totalSuccessfulAmount)
        Donation pending = new Donation();
        pending.setDonationReference("MECT-DON-PEND-002");
        pending.setPortalUser(user);
        pending.setProgramme(prog);
        pending.setAmount(new BigDecimal("5000.00"));
        pending.setDonorName("Pradeep Das");
        pending.setDonorPhone("+919853608113");
        pending.setStatus("PENDING");
        pending.setPaymentMethod("GATEWAY_CHECKOUT");
        donationRepository.save(pending);

        // 3. Failed donation of 2000 (must NOT be counted in totalSuccessfulAmount)
        Donation failed = new Donation();
        failed.setDonationReference("MECT-DON-FAIL-003");
        failed.setPortalUser(user);
        failed.setProgramme(prog);
        failed.setAmount(new BigDecimal("2000.00"));
        failed.setDonorName("Pradeep Das");
        failed.setDonorPhone("+919853608113");
        failed.setStatus("FAILED");
        failed.setPaymentMethod("GATEWAY_CHECKOUT");
        donationRepository.save(failed);

        mockMvc.perform(get("/portal/auth/me")
                        .header("Authorization", "Bearer " + donorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationSummary.totalSuccessfulAmount").value(3000.00))
                .andExpect(jsonPath("$.donationSummary.successfulCount").value(1))
                .andExpect(jsonPath("$.donationSummary.pendingCount").value(1))
                .andExpect(jsonPath("$.donationSummary.failedCount").value(1));
    }
}
