package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.donation.SubmitManualSbiUtrRequest;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.notification.EmailProvider;
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
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
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
public class DonationFinancialIntegrityPhase21_5_9_1Tests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private PaymentEventRepository paymentEventRepository;
    @Autowired private PaymentReconciliationLogRepository reconciliationRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private ManualBankTransferClaimRepository manualBankTransferClaimRepository;
    @Autowired private AuditLogRepository auditLogRepository;
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
    @Autowired private DonationLifecycleService donationLifecycleService;

    @Value("${app.payment.razorpay-webhook-secret}")
    private String webhookSecret;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private WhatsAppProvider whatsAppProvider;

    private final AtomicReference<String> capturedOtp = new AtomicReference<>();

    @BeforeEach
    void setup() {
        outboxRepository.deleteAll();
        receiptRepository.deleteAll();
        manualBankTransferClaimRepository.deleteAll();
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

    private String loginPortalUser(String email, String fullName) throws Exception {
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
                                fullName, "Main Road", "Balangir", "Odisha", "767001", "India",
                                null, null, "en", null, false, null, "v1.0"
                        ))))
                .andExpect(status().isOk());
        return token;
    }

    /**
     * Requirement: Successful payment generates a persisted receipt with verified SHA-256 hash.
     * Label must be institutional payment receipt, not government Form 114/10BE.
     */
    @Test
    void testSuccessfulPaymentGeneratesPersistedReceiptWithSha256() throws Exception {
        String token = loginPortalUser("donor1@example.org", "Donor One");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1500.00"),
                "Donor One",
                "donor1@example.org",
                "+919437000101",
                "Balangir, Odisha",
                "ABCDE1234F",
                "For Remedial Education",
                false,
                "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        JsonNode initJson = objectMapper.readTree(initRes.getResponse().getContentAsString());
        String orderId = initJson.get("providerOrderId").asString();

        // 1. Pending payment must NOT have created any receipt
        assertThat(receiptRepository.findAll()).isEmpty();

        // 2. Deliver verified webhook to transition payment to SUCCESS
        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_succ_1","order_id":"%s","amount":150000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_succ_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        // 3. Exactly one receipt must now exist
        List<DonationReceipt> receipts = receiptRepository.findAll();
        assertThat(receipts).hasSize(1);

        DonationReceipt receipt = receipts.get(0);
        assertThat(receipt.getReceiptNumber()).startsWith("MECT-RCPT-");
        assertThat(receipt.getAmount()).isEqualByComparingTo("1500.00");
        assertThat(receipt.getReceiptType()).isEqualTo("INSTITUTIONAL_PAYMENT_RECEIPT");
        assertThat(receipt.getPdfBytes()).isNotNull();
        assertThat(receipt.getPdfBytes().length).isGreaterThan(100);

        // 4. SHA-256 hash must be verified against actual generated PDF bytes
        String expectedHash = HmacCryptoUtil.sha256Hex(receipt.getPdfBytes());
        assertThat(receipt.getPdfSha256()).isEqualTo(expectedHash);
    }

    /**
     * Requirement: Failed payment must NOT generate a paid receipt.
     */
    @Test
    void testFailedPaymentDoesNotGenerateReceipt() throws Exception {
        String token = loginPortalUser("donor_fail@example.org", "Donor Fail");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "SAFE_WATER_SANITATION",
                new BigDecimal("500.00"),
                "Donor Fail",
                "donor_fail@example.org",
                null, null, null, null, false, "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode initJson = objectMapper.readTree(initRes.getResponse().getContentAsString());
        String orderId = initJson.get("providerOrderId").asString();

        // Deliver payment.failed webhook
        String failPayload = """
                {"event":"payment.failed","payload":{"payment":{"entity":{"id":"pay_fail_1","order_id":"%s","amount":50000,"status":"failed"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, failPayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_fail_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(failPayload))
                .andExpect(status().isOk());

        // Zero receipts must exist
        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * Requirement: Duplicate webhook deliveries or duplicate verification calls must NOT generate duplicate receipts.
     */
    @Test
    void testDuplicateWebhookDoesNotGenerateDuplicateReceipts() throws Exception {
        String token = loginPortalUser("donor_dup@example.org", "Donor Duplicate");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "WOMEN_EMPOWERMENT",
                new BigDecimal("2000.00"),
                "Donor Duplicate",
                "donor_dup@example.org",
                null, null, null, null, false, "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode initJson = objectMapper.readTree(initRes.getResponse().getContentAsString());
        String orderId = initJson.get("providerOrderId").asString();

        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_dup_1","order_id":"%s","amount":200000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayload);

        // First delivery: processes successfully and generates receipt
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_dup_first")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        assertThat(receiptRepository.findAll()).hasSize(1);
        String initialReceiptNumber = receiptRepository.findAll().get(0).getReceiptNumber();

        // Second delivery (duplicate event ID or replay): must remain exactly 1 receipt with identical number
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_dup_replay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        assertThat(receiptRepository.findAll()).hasSize(1);
        assertThat(receiptRepository.findAll().get(0).getReceiptNumber()).isEqualTo(initialReceiptNumber);
    }

    /**
     * Requirement: Cross-donor access prevention.
     * Donor A cannot download Donor B's receipt.
     */
    @Test
    void testCrossDonorReceiptRetrievalIsDenied() throws Exception {
        String tokenA = loginPortalUser("donor_a@example.org", "Donor Alpha");
        String tokenB = loginPortalUser("donor_b@example.org", "Donor Beta");

        // Donor A makes a successful donation
        InitiateDonationRequest initReqA = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1000.00"),
                "Donor Alpha",
                "donor_a@example.org",
                null, null, null, null, false, "UPI_QR"
        );
        MvcResult resA = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReqA)))
                .andExpect(status().isCreated())
                .andReturn();
        String orderIdA = objectMapper.readTree(resA.getResponse().getContentAsString()).get("providerOrderId").asString();

        String capturePayloadA = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_a_1","order_id":"%s","amount":100000,"status":"captured"}}}}
                """.formatted(orderIdA);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayloadA))
                        .header("X-Razorpay-Event-Id", "evt_a_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayloadA))
                .andExpect(status().isOk());

        DonationReceipt receiptA = receiptRepository.findAll().get(0);
        String receiptNumberA = receiptA.getReceiptNumber();

        // 1. Donor A can download their own receipt
        mockMvc.perform(get("/portal/receipts/" + receiptNumberA + "/pdf")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("X-Receipt-SHA256", receiptA.getPdfSha256()));

        // 2. Donor B MUST BE DENIED access to Donor A's receipt (HTTP 403 Forbidden)
        mockMvc.perform(get("/portal/receipts/" + receiptNumberA + "/pdf")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // 3. Unauthenticated request MUST BE DENIED
        mockMvc.perform(get("/portal/receipts/" + receiptNumberA + "/pdf"))
                .andExpect(status().isUnauthorized());

        // 4. Authorized Admin CAN download the receipt
        AdminUser admin = adminUserRepository.save(new AdminUser(
                "admin_fin", "fin@mect.org.in", passwordEncoder.encode("Secret123!"), "Admin Fin", Role.ROLE_ADMIN));
        String adminJwt = jwtTokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        mockMvc.perform(get("/admin/receipts/" + receiptNumberA + "/pdf")
                        .header("Authorization", "Bearer " + adminJwt))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"));
    }

    /**
     * Requirement: Stored SHA-256 hash detection of altered PDF bytes.
     */
    @Test
    void testHashVerificationDetectsAlteredPdfContent() throws Exception {
        String token = loginPortalUser("donor_hash@example.org", "Donor Hash");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "COMMUNITY_WELFARE",
                new BigDecimal("3000.00"),
                "Donor Hash",
                "donor_hash@example.org",
                null, null, null, null, false, "UPI_QR"
        );
        MvcResult res = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();
        String orderId = objectMapper.readTree(res.getResponse().getContentAsString()).get("providerOrderId").asString();

        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_h_1","order_id":"%s","amount":300000,"status":"captured"}}}}
                """.formatted(orderId);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", HmacCryptoUtil.hmacSha256Hex(webhookSecret, capturePayload))
                        .header("X-Razorpay-Event-Id", "evt_h_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt receipt = receiptRepository.findAll().get(0);
        byte[] originalPdf = receipt.getPdfBytes();
        String storedSha256 = receipt.getPdfSha256();

        // Original matches
        assertThat(HmacCryptoUtil.sha256Hex(originalPdf)).isEqualTo(storedSha256);

        // Tamper with single byte
        byte[] tamperedPdf = originalPdf.clone();
        tamperedPdf[tamperedPdf.length - 1] = (byte) (tamperedPdf[tamperedPdf.length - 1] ^ 0xFF);

        // Verification fails on tampered content
        String tamperedSha256 = HmacCryptoUtil.sha256Hex(tamperedPdf);
        assertThat(tamperedSha256).isNotEqualTo(storedSha256);
    }

    /**
     * Requirement: SBI direct bank transfer UTR is a claim only.
     * Receipt is generated ONLY after an authorized admin review confirms credit.
     */
    @Test
    void testManualSbiUtrIsClaimOnlyAndRequiresAdminVerification() throws Exception {
        String donorToken = loginPortalUser("sbi_donor@example.org", "SBI Remitter");

        // Donor submits UTR claim
        SubmitManualSbiUtrRequest utrReq = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("5000.00"),
                "SBI Remitter",
                "sbi_donor@example.org",
                "+919437000222",
                "Balangir Town",
                "ABCDE5678G",
                "Dedicated to library books",
                false,
                true,
                "SBIN412345678901",
                LocalDate.now(),
                "YONO SBI App",
                "Ref: 412345678901",
                null
        );

        MvcResult utrRes = mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .header("Authorization", "Bearer " + donorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(utrReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.claimStatus").value("UTR_SUBMITTED"))
                .andExpect(jsonPath("$.claimReference").value(org.hamcrest.Matchers.startsWith("MECT-UTR-")))
                .andReturn();

        String claimRef = objectMapper.readTree(utrRes.getResponse().getContentAsString()).get("claimReference").asString();

        // 1. Claim is pending; zero receipts must exist
        assertThat(receiptRepository.findAll()).isEmpty();

        // 2. Admin verifies manual bank transfer claim
        AdminUser finOfficer = adminUserRepository.save(new AdminUser(
                "fin_admin", "fin@mect.org.in", passwordEncoder.encode("Secret123!"), "Finance Officer", Role.ROLE_FINANCE_OFFICER));
        String finJwt = jwtTokenProvider.generateAccessToken(finOfficer.getUsername(), finOfficer.getRole().name());

        mockMvc.perform(post("/admin/manual-claims/" + claimRef + "/review")
                        .header("Authorization", "Bearer " + finJwt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new org.mahavirtrust.backend.dto.donation.ReviewManualSbiClaimRequest(
                                "VERIFIED",
                                "SBI-STMT-2026-11-17",
                                "Verified in SBI Bank Statement on 17-11-2026"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VERIFIED"));

        // 3. Receipt is generated now that funds are verified
        List<DonationReceipt> receipts = receiptRepository.findAll();
        assertThat(receipts).hasSize(1);
        DonationReceipt r = receipts.get(0);
        assertThat(r.getAmount()).isEqualByComparingTo("5000.00");
        assertThat(r.getPdfSha256()).isEqualTo(HmacCryptoUtil.sha256Hex(r.getPdfBytes()));
    }

    /**
     * Requirement: Duplicate UTR submission must be rejected.
     */
    @Test
    void testDuplicateUtrSubmissionIsRejected() throws Exception {
        SubmitManualSbiUtrRequest utrReq = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1000.00"),
                "Remitter Two",
                "remitter2@example.org",
                null, null, null, null, false, true,
                "SBIN999888777666",
                LocalDate.now(),
                "SBI UPI", null, null
        );

        // First submission succeeds
        mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(utrReq)))
                .andExpect(status().isCreated());

        // Duplicate submission of the exact same UTR returns 409 Conflict
        mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(utrReq)))
                .andExpect(status().isConflict());
    }
}
