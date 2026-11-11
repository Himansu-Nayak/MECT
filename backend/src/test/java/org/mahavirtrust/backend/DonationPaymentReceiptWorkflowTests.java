package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
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
public class DonationPaymentReceiptWorkflowTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private PaymentEventRepository paymentEventRepository;
    @Autowired private PaymentReconciliationLogRepository reconciliationRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private NotificationDeliveryLogRepository deliveryLogRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private OtpVerificationRepository otpRepository;
    @Autowired private PortalRefreshTokenRepository portalRefreshTokenRepository;
    @Autowired private PortalVerifiedContactRepository contactRepository;
    @Autowired private CommunicationConsentRepository consentRepository;
    @Autowired private NotificationPreferenceRepository preferenceRepository;
    @Autowired private PortalUserProfileRepository profileRepository;
    @Autowired private PortalUserRoleRepository portalUserRoleRepository;
    @Autowired private PortalUserRepository portalUserRepository;
    @Autowired private AdminUserRepository adminUserRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private NotificationOutboxService outboxService;

    @Value("${app.payment.razorpay-webhook-secret}")
    private String webhookSecret;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private WhatsAppProvider whatsAppProvider;

    private final AtomicReference<String> capturedOtp = new AtomicReference<>();

    @BeforeEach
    void setup() {
        deliveryLogRepository.deleteAll();
        outboxRepository.deleteAll();
        receiptRepository.deleteAll();
        reconciliationRepository.deleteAll();
        paymentEventRepository.deleteAll();
        paymentRepository.deleteAll();
        donationRepository.deleteAll();
        otpRepository.deleteAll();
        portalRefreshTokenRepository.deleteAll();
        contactRepository.deleteAll();
        consentRepository.deleteAll();
        preferenceRepository.deleteAll();
        profileRepository.deleteAll();
        portalUserRoleRepository.deleteAll();
        portalUserRepository.deleteAll();
        adminUserRepository.deleteAll();

        capturedOtp.set(null);

        when(emailProvider.isConfigured()).thenReturn(true);
        when(emailProvider.getProviderName()).thenReturn("RESEND");
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenAnswer(inv -> {
                    String html = inv.getArgument(3, String.class);
                    Matcher m = Pattern.compile("\\b([0-9]{6})\\b").matcher(html.replaceAll("<[^>]+>", " "));
                    if (m.find()) {
                        capturedOtp.set(m.group(1));
                    }
                    return ProviderDispatchResult.sent("re_msg_" + System.nanoTime(), "{}");
                });

        when(whatsAppProvider.isConfigured()).thenReturn(true);
        when(whatsAppProvider.getProviderName()).thenReturn("META_CLOUD");
        when(whatsAppProvider.sendTemplateMessage(anyString(), anyString(), anyString(), anyList()))
                .thenReturn(ProviderDispatchResult.unconfigured("Template config test check"));
    }

    private String loginPortalUser(String email, boolean optInWhatsApp) throws Exception {
        mockMvc.perform(post("/portal/auth/request-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpRequestPayload("EMAIL", email, "LOGIN"))))
                .andExpect(status().isOk());

        MvcResult verify = mockMvc.perform(post("/portal/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new OtpVerifyPayload("EMAIL", email, capturedOtp.get(), "LOGIN"))))
                .andExpect(status().isOk())
                .andReturn();
        String token = objectMapper.readTree(verify.getResponse().getContentAsString()).get("accessToken").asString();

        mockMvc.perform(put("/portal/me/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdatePortalProfileRequest(
                                "Subham Sahoo", "Lewis Road", "Bhubaneswar", "Odisha", "751014", "India",
                                null, null, "en", null, optInWhatsApp, optInWhatsApp ? "+919437000111" : null, "wa-v1.0"
                        ))))
                .andExpect(status().isOk());
        return token;
    }

    @Test
    void testFullDonationLifecycleDynamicQrWebhookIdempotencyPdfAndRoleUpgrade() throws Exception {
        String portalToken = loginPortalUser("subham@example.org", true);

        // Initiate Dynamic UPI QR donation in sandbox test profile
        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("2500.00"),
                "Subham Sahoo",
                "subham@example.org",
                "+919437000111",
                "Bhubaneswar, Odisha",
                null,
                "Supporting Shiksha Setu students",
                false,
                "UPI_QR"
        );
        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + portalToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.upiUri").isNotEmpty())
                .andExpect(jsonPath("$.qrSvg").value(org.hamcrest.Matchers.containsString("<svg")))
                .andReturn();

        JsonNode initJson = objectMapper.readTree(initRes.getResponse().getContentAsString());
        String donationRef = initJson.get("donationReference").asString();
        String orderId = initJson.get("providerOrderId").asString();

        // Dashboard before webhook confirmation must NOT treat pending as successful
        mockMvc.perform(get("/portal/me/dashboard").header("Authorization", "Bearer " + portalToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationSummary.successfulCount").value(0))
                .andExpect(jsonPath("$.donationSummary.pendingCount").value(1))
                .andExpect(jsonPath("$.account.isDonor").value(false));

        // Spoofed webhook with invalid signature MUST fail and not confirm donation
        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test_9001","order_id":"%s","amount":250000,"status":"captured"}}}}
                """.formatted(orderId);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", "invalid_sig")
                        .header("X-Razorpay-Event-Id", "evt_bad_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isUnauthorized());

        assertThat(receiptRepository.count()).isZero();

        // Signed genuine webhook confirms donation, upgrades role to ROLE_DONOR, generates PDF receipt, enqueues email+whatsapp
        String validSig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayload);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", validSig)
                        .header("X-Razorpay-Event-Id", "evt_capture_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSED"));

        // Duplicate webhook must be idempotently ignored without issuing a second receipt or second confirmation email
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", validSig)
                        .header("X-Razorpay-Event-Id", "evt_capture_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED_DUPLICATE"));

        assertThat(receiptRepository.count()).isEqualTo(1L);
        DonationReceipt receipt = receiptRepository.findAll().get(0);
        assertThat(receipt.getPdfBytes()).isNotEmpty();
        assertThat(new String(receipt.getPdfBytes(), 0, 5, StandardCharsets.ISO_8859_1)).isEqualTo("%PDF-");

        // Owner dashboard shows updated verified donation + ROLE_DONOR granted
        mockMvc.perform(get("/portal/me/dashboard").header("Authorization", "Bearer " + portalToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationSummary.successfulCount").value(1))
                .andExpect(jsonPath("$.donationSummary.totalSuccessfulAmount").value(2500.0))
                .andExpect(jsonPath("$.account.isDonor").value(true))
                .andExpect(jsonPath("$.donationHistory[0].receiptNumber").value(receipt.getReceiptNumber()));

        // Owner can download PDF receipt
        MvcResult pdfRes = mockMvc.perform(get("/portal/receipts/" + receipt.getReceiptNumber() + "/pdf")
                        .header("Authorization", "Bearer " + portalToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();
        assertThat(pdfRes.getResponse().getContentAsByteArray()).isEqualTo(receipt.getPdfBytes());

        // Cross-user unauthorized receipt download attempt blocked (403 Forbidden)
        String otherUserToken = loginPortalUser("other.user@example.org", false);
        mockMvc.perform(get("/portal/receipts/" + receipt.getReceiptNumber() + "/pdf")
                        .header("Authorization", "Bearer " + otherUserToken))
                .andExpect(status().isForbidden());

        // Refund webhook transitions payment cleanly and retains ledger + reconciliation log
        String refundPayload = """
                {"event":"refund.processed","payload":{"refund":{"entity":{"id":"rfnd_1","payment_id":"pay_test_9001","amount":250000}}}}
                """;
        String refundSig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, refundPayload);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", refundSig)
                        .header("X-Razorpay-Event-Id", "evt_refund_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refundPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationStatus").value("REFUNDED"));

        mockMvc.perform(get("/public/donations/" + donationRef + "/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REFUNDED"));
    }

    @Test
    void testAnonymousDonationPrivacyEmailRetryAndAdminCsvExportAuthorization() throws Exception {
        // Anonymous guest donation (no portal token) + simulate Resend failure & retry recovery
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenReturn(ProviderDispatchResult.failed("Temporary upstream 502"))
                .thenReturn(ProviderDispatchResult.sent("re_retry_ok", "{}"));

        InitiateDonationRequest anonReq = new InitiateDonationRequest(
                "SAFE_WATER_SANITATION",
                new BigDecimal("1000.00"),
                "Private Philanthropist",
                "anon.donor@example.org",
                null,
                null,
                null,
                null,
                true,
                "UPI_QR"
        );
        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(anonReq)))
                .andExpect(status().isCreated())
                .andReturn();
        String orderId = objectMapper.readTree(initRes.getResponse().getContentAsString()).get("providerOrderId").asString();

        // Email failure queued as RETRY_SCHEDULED; donation remained intact!
        List<NotificationOutbox> outboxAfterInit = outboxRepository.findAll();
        assertThat(outboxAfterInit).hasSize(1);
        assertThat(outboxAfterInit.get(0).getStatus()).isEqualTo("RETRY_SCHEDULED");

        // Retry recovers cleanly
        outboxService.dispatchSingleSafe(outboxAfterInit.get(0));
        assertThat(outboxRepository.findById(outboxAfterInit.get(0).getId()).orElseThrow().getStatus()).isEqualTo("SENT");

        // Capture webhook verifies anonymous receipt hides real name on receipt PDF metadata
        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_anon_1","order_id":"%s","amount":100000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayload);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_anon_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt receipt = receiptRepository.findAll().get(0);
        assertThat(receipt.getDonorDisplayName()).isEqualTo("Anonymous Donor");

        // Internal Admin Finance Officer can view donor ledger & export CSV; Coordinator role cannot
        AdminUser financeUser = adminUserRepository.save(new AdminUser(
                "fin_officer", "fin@mect.org.in", passwordEncoder.encode("Secret123!"), "Finance Officer", Role.ROLE_FINANCE_OFFICER));
        AdminUser volCoord = adminUserRepository.save(new AdminUser(
                "vol_coord", "coord@mect.org.in", passwordEncoder.encode("Secret123!"), "Volunteer Coord", Role.ROLE_VOLUNTEER_COORDINATOR));

        String finJwt = jwtTokenProvider.generateAccessToken(financeUser.getUsername(), financeUser.getRole().name());
        String coordJwt = jwtTokenProvider.generateAccessToken(volCoord.getUsername(), volCoord.getRole().name());

        mockMvc.perform(get("/admin/donations").header("Authorization", "Bearer " + coordJwt))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/admin/donations").header("Authorization", "Bearer " + finJwt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary.successfulCount").value(1));

        mockMvc.perform(get("/admin/donations/export.csv").header("Authorization", "Bearer " + finJwt))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString(receipt.getReceiptNumber())));
    }
}

