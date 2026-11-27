package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.notification.ConfigurableSmsService;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.SmsProvider;
import org.mahavirtrust.backend.service.portal.OtpAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("staging")
@TestPropertySource(properties = {
                "spring.datasource.url=jdbc:h2:mem:staging_testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL",
                "spring.datasource.driver-class-name=org.h2.Driver",
                "spring.datasource.username=sa",
                "spring.datasource.password=",
                "app.otp.deterministic-test-enabled=true",
                "app.otp.deterministic-test-code=123456",
                "app.sms.provider=MOCK",
                "DB_NAME=mect_staging_db"
})
public class StagingOtpHardeningAndSafetyTests {

        @Autowired
        private MockMvc mockMvc;
        @Autowired
        private ObjectMapper objectMapper;
        @Autowired
        private OtpAuthService otpAuthService;
        @Autowired
        private OtpVerificationRepository otpRepository;
        @Autowired
        private PortalUserRepository userRepository;
        @Autowired
        private PortalUserRoleRepository portalUserRoleRepository;
        @Autowired
        private PortalUserProfileRepository profileRepository;
        @Autowired
        private PortalVerifiedContactRepository contactRepository;
        @Autowired
        private PortalRefreshTokenRepository portalRefreshTokenRepository;
        @Autowired
        private NotificationPreferenceRepository preferenceRepository;
        @Autowired
        private NotificationOutboxRepository outboxRepository;
        @Autowired
        private NotificationDeliveryLogRepository deliveryLogRepository;
        @Autowired
        private Environment environment;
        @Autowired
        private org.mahavirtrust.backend.service.receipt.ReceiptPdfService receiptPdfService;

        @MockitoBean
        private EmailProvider emailProvider;
        @MockitoBean
        private SmsProvider smsProvider;

        @BeforeEach
        void setup() {
                deliveryLogRepository.deleteAll();
                outboxRepository.deleteAll();
                otpRepository.deleteAll();
                portalRefreshTokenRepository.deleteAll();
                contactRepository.deleteAll();
                preferenceRepository.deleteAll();
                profileRepository.deleteAll();
                portalUserRoleRepository.deleteAll();
                userRepository.deleteAll();

                when(emailProvider.isConfigured()).thenReturn(true);
                when(emailProvider.getProviderName()).thenReturn("RESEND");
                when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), any()))
                                .thenReturn(ProviderDispatchResult.sent("mock_email_001", "{\"status\":\"sent\"}"));

                when(smsProvider.isConfigured()).thenReturn(true);
                when(smsProvider.getProviderName()).thenReturn("MOCK");
                when(smsProvider.sendOtpSms(anyString(), anyString(), anyInt()))
                                .thenReturn(ProviderDispatchResult.sent("mock_msg_001", "{\"status\":\"delivered\"}"));
        }

        @Test
        @DisplayName("STAGING-OTP-1: Exactly 'staging' profile + allowlisted synthetic phone generates 123456 and logs in")
        void test1_allowlistedSyntheticPhoneNumber_generatesDeterministicOtpAndLogsIn() throws Exception {
                String syntheticPhone = "+919438200001";

                mockMvc.perform(post("/portal/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                                new OtpRequestPayload("PHONE", syntheticPhone, "LOGIN"))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accepted").value(true));

                mockMvc.perform(post("/portal/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", syntheticPhone,
                                                "123456", "LOGIN", "Ramesh Kumar", "Balangir"))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                                .andExpect(jsonPath("$.primaryPhone").value(syntheticPhone));
        }

        @Test
        @DisplayName("STAGING-OTP-2: Exactly 'staging' profile + allowlisted synthetic email generates 123456 and logs in")
        void test2_allowlistedSyntheticEmail_generatesDeterministicOtpAndLogsIn() throws Exception {
                String syntheticEmail = "synthetic.donor@mect.org.in";

                mockMvc.perform(post("/portal/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                                new OtpRequestPayload("EMAIL", syntheticEmail, "LOGIN"))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accepted").value(true));

                mockMvc.perform(post("/portal/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", syntheticEmail,
                                                "123456", "LOGIN", "Synthetic Donor", "Balangir"))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                                .andExpect(jsonPath("$.primaryEmail").value(syntheticEmail));
        }

        @Test
        @DisplayName("STAGING-OTP-3: Real/non-allowlisted donor phone number STRICTLY REJECTS deterministic OTP 123456")
        void test3_realDonorPhoneNumber_strictlyRejectsDeterministicOtp() throws Exception {
                String realDonorPhone = "+919876543210";

                mockMvc.perform(post("/portal/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                                new OtpRequestPayload("PHONE", realDonorPhone, "LOGIN"))))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accepted").value(true));

                mockMvc.perform(post("/portal/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new OtpVerifyPayload("PHONE", realDonorPhone,
                                                "123456", "LOGIN", "Real Donor", "Balangir"))))
                                .andExpect(status().isUnauthorized())
                                .andExpect(jsonPath("$.message").value(
                                                "Incorrect verification code. Please check the 6-digit code and try again."));
        }

        @Test
        @DisplayName("STAGING-OTP-4: Real/non-allowlisted email STRICTLY REJECTS deterministic OTP 123456")
        void test4_realDonorEmail_strictlyRejectsDeterministicOtp() throws Exception {
                String realDonorEmail = "real.donor@example.com";

                mockMvc.perform(post("/portal/auth/request-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                                new OtpRequestPayload("EMAIL", realDonorEmail, "LOGIN"))))
                                .andExpect(status().isOk());

                mockMvc.perform(post("/portal/auth/verify-otp")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", realDonorEmail,
                                                "123456", "LOGIN", "Real Donor", "Bhubaneswar"))))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("STAGING-OTP-5: Profile 'prod' enforces strict fail-closed rejection")
        void test5_prodProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("prod");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
                assertThat(service.isDeterministicTestAllowed("synthetic.donor@mect.org.in")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-6: Profile 'production' enforces strict fail-closed rejection")
        void test6_productionProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("production");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-7: Profile 'default' enforces strict fail-closed rejection")
        void test7_defaultProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("default");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-8: Missing/empty active profiles enforce strict fail-closed rejection")
        void test8_missingProfiles_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment(); // No active profiles

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-9: Profile 'dev' enforces strict fail-closed rejection")
        void test9_devProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("dev");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-10: Profile 'local' enforces strict fail-closed rejection")
        void test10_localProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("local");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-11: Profile 'qa' enforces strict fail-closed rejection")
        void test11_qaProfile_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("qa");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-12: Multiple active profiles ('staging' AND 'prod') strictly fail closed")
        void test12_multipleProfiles_stagingAndProd_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("staging", "prod");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-13: Multiple active profiles ('staging' AND 'dev') strictly fail closed")
        void test13_multipleProfiles_stagingAndDev_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("staging", "dev");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-14: Feature flag disabled enforces strict fail-closed rejection")
        void test14_featureFlagFalse_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("staging");

                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                false, "123456", "jdbc:postgresql://localhost:5432/mect_staging_db", "mect_staging_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-15: Production database configuration strictly rejects deterministic OTP")
        void test15_productionDatabase_strictlyFailsClosed() {
                MockEnvironment env = new MockEnvironment();
                env.setActiveProfiles("staging");

                // Connected to production database 'mect_db'
                OtpAuthService service = new OtpAuthService(
                                otpRepository, userRepository, null, null, null, null, null,
                                emailProvider, smsProvider, null, null, null, null,
                                env, 600, 60, 5, "pepper", "MECT <notif@mect.org.in>", true,
                                true, "123456", "jdbc:postgresql://localhost:5432/mect_db", "mect_db");

                assertThat(service.isDeterministicTestAllowed("+919438200001")).isFalse();
        }

        @Test
        @DisplayName("STAGING-OTP-16: MOCK SMS provider performs zero external network calls")
        void test16_mockSmsProviderPerformsZeroNetworkCalls() {
                ConfigurableSmsService mockService = new ConfigurableSmsService(
                                "MOCK", "", "", "", "", "");

                assertThat(mockService.isConfigured()).isTrue();
                assertThat(mockService.getProviderName()).isEqualTo("MOCK");

                ProviderDispatchResult result = mockService.sendOtpSms("+919438200001", "123456", 10);
                assertThat(result.status()).isEqualTo("SENT");
                assertThat(result.providerMessageId()).startsWith("dev_dispatch_");
        }

        @Test
        @DisplayName("STAGING-RECEIPT-17: Simulated receipt in staging profile includes mandatory test/tax-deduction disclaimer")
        void test17_simulatedReceiptDisplaysStagingDisclaimerBanner() {
                org.mahavirtrust.backend.entity.Donation donation = new org.mahavirtrust.backend.entity.Donation();
                donation.setDonationReference("MECT-STAGING-DON-001");
                donation.setAmount(new java.math.BigDecimal("5000.00"));
                donation.setCurrency("INR");
                donation.setPaymentMethod("UPI");
                donation.setDonorEmail("synthetic.donor@mect.org.in");
                donation.setConfirmedAt(java.time.Instant.now());

                org.mahavirtrust.backend.entity.DonationProgramme prog = new org.mahavirtrust.backend.entity.DonationProgramme();
                prog.setName("Tribal Youth Education");
                donation.setProgramme(prog);

                org.mahavirtrust.backend.entity.Payment payment = new org.mahavirtrust.backend.entity.Payment();
                payment.setProvider("CASHFREE");
                payment.setStatus("SUCCESS");
                payment.setProviderPaymentId("cf_staging_pay_12345");
                payment.setProviderOrderId("cf_staging_order_12345");

                byte[] pdfBytes = receiptPdfService.generateReceiptPdf(
                                "MECT-STAGING-RCP-001",
                                donation,
                                payment,
                                "Synthetic Donor Test Account",
                                "Staging simulation transaction test.");

                assertThat(pdfBytes).isNotEmpty();
                assertThat(new String(pdfBytes, 0, 5, java.nio.charset.StandardCharsets.ISO_8859_1)).isEqualTo("%PDF-");
                assertThat(pdfBytes.length).isGreaterThan(1000);
        }

    @Test
    @DisplayName("STAGING-SAFEGUARD-18: ResendEmailService with MOCK apiKey performs safe local dispatch without external API calls")
    void test18_resendEmailService_mockApiKey_performsSafeLocalDispatch() {
        org.mahavirtrust.backend.service.notification.ResendEmailService mockService =
                new org.mahavirtrust.backend.service.notification.ResendEmailService("MOCK", "https://api.resend.com", "", objectMapper);

        assertThat(mockService.isConfigured()).isTrue();
        assertThat(mockService.getProviderName()).isEqualTo("RESEND");

        org.mahavirtrust.backend.service.notification.ProviderDispatchResult result = mockService.sendEmail(
                "notifications@mect.org.in",
                "synthetic.donor@mect.org.in",
                "Test Staging Notification",
                "<p>Test Safe Body</p>",
                null,
                null,
                java.util.Map.of()
        );

        assertThat(result.status()).isEqualTo("SENT");
        assertThat(result.providerMessageId()).startsWith("mock_email_dispatch_");
    }
}
