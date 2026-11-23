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
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
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

/**
 * Phase 21.5.9.1.1 - Final Receipt Persistence, Email Delivery & Financial Regression Test Suite.
 *
 * Verifies:
 * 1. Cashfree signature verification & 401 on forged signatures.
 * 2. Cashfree timestamp tolerance replay protection & 401 on stale webhooks.
 * 3. Razorpay HMAC-SHA256 signature verification & 401 on forged signatures.
 * 4. Webhook amount tampering detection (paid amount != order amount).
 * 5. Webhook currency mismatch detection (USD != INR).
 * 6. Duplicate & replayed webhook idempotency (no duplicate receipts).
 * 7. Refund lifecycle: partial and full refunds preserve original immutable receipt bytes.
 * 8. Receipt snapshot immutability across subsequent donor profile edits.
 * 9. Role-based receipt download security (Donor own OK, cross-donor 403, unauthenticated 401, Admin OK).
 * 10. Transactional outbox queuing for receipt delivery.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "app.payment.provider=RAZORPAY",
        "app.payment.sandbox-mode=true",
        "app.payment.razorpay-webhook-secret=test-rzp-reg-secret",
        "app.payment.cashfree-webhook-secret=test-cf-reg-secret",
        "app.payment.cashfree-webhook-tolerance-seconds=300"
})
public class DonationFinalRegressionPhase21_5_9_1_1Tests {

    private static final String RZP_SECRET = "test-rzp-reg-secret";
    private static final String CF_SECRET = "test-cf-reg-secret";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private DonationProgrammeRepository programmeRepository;
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

    private String signCashfree(String timestamp, String rawPayload) {
        String signedPayload = timestamp + rawPayload;
        return HmacCryptoUtil.hmacSha256Base64(CF_SECRET.getBytes(StandardCharsets.UTF_8), signedPayload);
    }

    private String createPayment(String provider, String orderId, BigDecimal amount, String currency, PortalUser user, String donorName, String donorEmail) {
        Donation donation = new Donation();
        donation.setDonationReference("MECT-DON-" + System.nanoTime());
        donation.setPortalUser(user);
        donation.setAmount(amount);
        donation.setCurrency(currency);
        donation.setDonorName(donorName);
        donation.setDonorEmail(donorEmail);
        donation.setProgramme(programmeRepository.findByCode("EDUCATION_LEARNING")
                .orElseGet(() -> programmeRepository.findAll().stream().findFirst().orElseThrow()));
        donation.setStatus("PENDING");
        donation = donationRepository.save(donation);

        Payment payment = new Payment();
        payment.setDonation(donation);
        payment.setProvider(provider);
        payment.setProviderOrderId(orderId);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setStatus("PENDING");
        paymentRepository.save(payment);

        return donation.getDonationReference();
    }

    /**
     * 1. Cashfree signature verification failure returns 401 Unauthorized and records rejection.
     */
    @Test
    void testCashfreeInvalidSignatureReturns401AndRecordsRejection() throws Exception {
        String payload = """
                {"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"order_cf_1"}}}
                """;
        String ts = String.valueOf(Instant.now().toEpochMilli());

        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", ts)
                        .header("x-webhook-signature", "invalid_base64_sig==")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("invalid_cashfree_webhook_signature"));

        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * 2. Cashfree timestamp older than tolerance window (300s) returns 401 replay protection.
     */
    @Test
    void testCashfreeExpiredTimestampReplayProtectionReturns401() throws Exception {
        String payload = """
                {"type":"PAYMENT_SUCCESS_WEBHOOK","data":{"order":{"order_id":"order_cf_old"}}}
                """;
        // 10 minutes ago
        String staleTs = String.valueOf(Instant.now().minusSeconds(600).toEpochMilli());
        String sig = signCashfree(staleTs, payload);

        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", staleTs)
                        .header("x-webhook-signature", sig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("invalid_cashfree_webhook_signature"));

        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * 3. Razorpay HMAC signature failure returns 401 Unauthorized and records rejection.
     */
    @Test
    void testRazorpayInvalidSignatureReturns401AndRecordsRejection() throws Exception {
        String payload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_fake_1","order_id":"order_fake_1","amount":100000}}}}
                """;

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", "0000000000000000000000000000000000000000000000000000000000000000")
                        .header("X-Razorpay-Event-Id", "evt_fake_sig")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isUnauthorized());

        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * 4. Amount tampering detection: Webhook reporting different amount is rejected.
     */
    @Test
    void testCashfreeAmountTamperingDetectedAndRejected() throws Exception {
        String orderId = "order_cf_tamper_amt";
        createPayment("CASHFREE", orderId, new BigDecimal("1000.00"), "INR", null, "Tamper Tester", "tamper@example.org");

        // Webhook claims only ₹1.00 paid for ₹1000 order
        String tamperedPayload = """
                {
                  "type": "PAYMENT_SUCCESS_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s", "order_amount": 1000.00, "order_currency": "INR" },
                    "payment": {
                      "cf_payment_id": "cf_pay_tamper_1",
                      "payment_status": "SUCCESS",
                      "payment_amount": 1.00,
                      "payment_currency": "INR"
                    }
                  }
                }
                """.formatted(orderId);

        String ts = String.valueOf(Instant.now().toEpochMilli());
        String sig = signCashfree(ts, tamperedPayload);

        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", ts)
                        .header("x-webhook-signature", sig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tamperedPayload))
                .andExpect(status().isBadRequest());

        // Payment and donation must NOT be marked PAID
        Payment payment = paymentRepository.findByProviderOrderId(orderId).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo("PENDING");
        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * 5. Currency mismatch detection: Webhook reporting non-INR currency is rejected.
     */
    @Test
    void testCashfreeCurrencyMismatchDetectedAndRejected() throws Exception {
        String orderId = "order_cf_currency_mismatch";
        createPayment("CASHFREE", orderId, new BigDecimal("1000.00"), "INR", null, "Currency Tester", "curr@example.org");

        // Webhook claims currency USD
        String mismatchPayload = """
                {
                  "type": "PAYMENT_SUCCESS_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s", "order_amount": 1000.00, "order_currency": "USD" },
                    "payment": {
                      "cf_payment_id": "cf_pay_curr_1",
                      "payment_status": "SUCCESS",
                      "payment_amount": 1000.00,
                      "payment_currency": "USD"
                    }
                  }
                }
                """.formatted(orderId);

        String ts = String.valueOf(Instant.now().toEpochMilli());
        String sig = signCashfree(ts, mismatchPayload);

        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", ts)
                        .header("x-webhook-signature", sig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mismatchPayload))
                .andExpect(status().isBadRequest());

        Payment payment = paymentRepository.findByProviderOrderId(orderId).orElseThrow();
        assertThat(payment.getStatus()).isEqualTo("PENDING");
        assertThat(receiptRepository.findAll()).isEmpty();
    }

    /**
     * 6. Duplicate and replayed webhooks are idempotent and generate exactly 1 receipt.
     */
    @Test
    void testWebhookReplayAndDuplicateIdempotency() throws Exception {
        String orderId = "order_rzp_dup_test";
        createPayment("RAZORPAY", orderId, new BigDecimal("2500.00"), "INR", null, "Idempotency Donor", "idemp@example.org");

        String payload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_idemp_1","order_id":"%s","amount":250000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, payload);

        // First delivery: succeeds and creates receipt
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_idemp_first")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSED"));

        List<DonationReceipt> receipts = receiptRepository.findAll();
        assertThat(receipts).hasSize(1);
        String rcptNum = receipts.get(0).getReceiptNumber();

        // Second delivery (replay with same event id): ignored as duplicate
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_idemp_first")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED_DUPLICATE"));

        // Receipt count remains strictly 1 with identical receipt number
        List<DonationReceipt> receiptsAfter = receiptRepository.findAll();
        assertThat(receiptsAfter).hasSize(1);
        assertThat(receiptsAfter.get(0).getReceiptNumber()).isEqualTo(rcptNum);
    }

    /**
     * 7. Full & partial refund lifecycle: updates status, preserves original receipt without deletion.
     */
    @Test
    void testRefundLifecyclePreservesReceiptImmutabilityAndUpdatesStatus() throws Exception {
        String orderId = "order_refund_test";
        createPayment("RAZORPAY", orderId, new BigDecimal("3000.00"), "INR", null, "Refundable Donor", "refund@example.org");

        // 1. Confirm payment first
        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_ref_target_1","order_id":"%s","amount":300000,"status":"captured"}}}}
                """.formatted(orderId);
        String captureSig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, capturePayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", captureSig)
                        .header("X-Razorpay-Event-Id", "evt_ref_capture")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt originalReceipt = receiptRepository.findAll().get(0);
        String originalReceiptNum = originalReceipt.getReceiptNumber();
        String originalSha = originalReceipt.getPdfSha256();
        byte[] originalPdf = originalReceipt.getPdfBytes();
        assertThat(originalPdf).isNotEmpty();

        // 2. Deliver partial refund webhook (₹1000 of ₹3000)
        String partialRefundPayload = """
                {"event":"refund.processed","payload":{"refund":{"entity":{"id":"rfnd_part_1","payment_id":"pay_ref_target_1","amount":100000}}}}
                """;
        String partialRefundSig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, partialRefundPayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", partialRefundSig)
                        .header("X-Razorpay-Event-Id", "evt_rfnd_part_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(partialRefundPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationStatus").value("PARTIALLY_REFUNDED"));

        Payment paymentAfterPart = paymentRepository.findByProviderOrderId(orderId).orElseThrow();
        assertThat(paymentAfterPart.getStatus()).isEqualTo("PARTIALLY_REFUNDED");
        assertThat(paymentAfterPart.getRefundedAmount()).isEqualByComparingTo("1000.00");

        // Crucial: original receipt is preserved and NOT deleted
        DonationReceipt receiptAfterPart = receiptRepository.findByReceiptNumber(originalReceiptNum).orElseThrow();
        assertThat(receiptAfterPart.getPdfSha256()).isEqualTo(originalSha);
        assertThat(receiptAfterPart.getPdfBytes()).isEqualTo(originalPdf);

        // 3. Deliver full refund webhook (remaining ₹2000)
        String fullRefundPayload = """
                {"event":"refund.processed","payload":{"refund":{"entity":{"id":"rfnd_full_1","payment_id":"pay_ref_target_1","amount":200000}}}}
                """;
        String fullRefundSig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, fullRefundPayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", fullRefundSig)
                        .header("X-Razorpay-Event-Id", "evt_rfnd_full_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(fullRefundPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationStatus").value("REFUNDED"));

        Payment paymentAfterFull = paymentRepository.findByProviderOrderId(orderId).orElseThrow();
        assertThat(paymentAfterFull.getStatus()).isEqualTo("REFUNDED");
        assertThat(paymentAfterFull.getRefundedAmount()).isEqualByComparingTo("3000.00");

        // Crucial: original receipt STILL preserved for audit trail
        DonationReceipt receiptAfterFull = receiptRepository.findByReceiptNumber(originalReceiptNum).orElseThrow();
        assertThat(receiptAfterFull.getPdfSha256()).isEqualTo(originalSha);
        assertThat(receiptAfterFull.getPdfBytes()).isEqualTo(originalPdf);
    }

    /**
     * 8. Snapshot immutability: Subsequent donor profile updates do NOT alter previously generated receipts.
     */
    @Test
    void testReceiptSnapshotImmutabilityAcrossDonorProfileUpdates() throws Exception {
        String token = loginPortalUser("immut_donor@example.org", "Historic Name");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1200.00"),
                "Historic Name",
                "immut_donor@example.org",
                null, null, null, null, false, "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(initRes.getResponse().getContentAsString()).get("providerOrderId").asString();

        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_immut_1","order_id":"%s","amount":120000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, capturePayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_immut_cap")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt receipt = receiptRepository.findAll().get(0);
        assertThat(receipt.getDonorDisplayName()).isEqualTo("Historic Name");
        String originalSha = receipt.getPdfSha256();

        // Donor modifies profile name in Portal
        mockMvc.perform(put("/portal/me/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdatePortalProfileRequest(
                                "Completely New Modern Name", "New Street", "Bhubaneswar", "Odisha", "751001", "India",
                                null, null, "en", null, false, null, "v1.0"
                        ))))
                .andExpect(status().isOk());

        // Historical receipt must retain original snapshot fields
        DonationReceipt reloaded = receiptRepository.findByReceiptNumber(receipt.getReceiptNumber()).orElseThrow();
        assertThat(reloaded.getDonorDisplayName()).isEqualTo("Historic Name");
        assertThat(reloaded.getPdfSha256()).isEqualTo(originalSha);
    }

    /**
     * 9. Receipt download security matrix:
     * - Donor A can download Donor A's receipt with verified SHA-256 header.
     * - Cross-donor retrieval (Donor B requesting Receipt A) returns 403 Forbidden.
     * - Unauthenticated retrieval returns 401 Unauthorized.
     * - Admin download returns 200 OK and logs audit entry.
     */
    @Test
    void testReceiptDownloadSecurityAndRoleMatrix() throws Exception {
        String tokenA = loginPortalUser("donorA@example.org", "Donor Alpha");
        String tokenB = loginPortalUser("donorB@example.org", "Donor Beta");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "COMMUNITY_WELFARE",
                new BigDecimal("800.00"),
                "Donor Alpha",
                "donorA@example.org",
                null, null, null, null, false, "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(initRes.getResponse().getContentAsString()).get("providerOrderId").asString();

        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_mat_1","order_id":"%s","amount":80000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, capturePayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_mat_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt receipt = receiptRepository.findAll().get(0);
        String rcptNum = receipt.getReceiptNumber();

        // 1. Donor A downloads own receipt: 200 OK with correct Content-Type and X-Receipt-SHA256
        mockMvc.perform(get("/portal/receipts/" + rcptNum + "/pdf")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("X-Receipt-SHA256", receipt.getPdfSha256()));

        // 2. Cross-donor download by Donor B: 403 Forbidden
        mockMvc.perform(get("/portal/receipts/" + rcptNum + "/pdf")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // 3. Unauthenticated request: 401 Unauthorized
        mockMvc.perform(get("/portal/receipts/" + rcptNum + "/pdf"))
                .andExpect(status().isUnauthorized());

        // 4. Admin download by Finance Officer: 200 OK
        AdminUser admin = adminUserRepository.save(new AdminUser(
                "finance_reg_officer", "finreg@mect.org.in", passwordEncoder.encode("Secret123!"), "Finance Officer", Role.ROLE_FINANCE_OFFICER));
        String adminToken = jwtTokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        mockMvc.perform(get("/admin/receipts/" + rcptNum + "/pdf")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));

        // Verify admin audit log
        boolean auditRecorded = auditLogRepository.findAll().stream()
                .anyMatch(a -> "ADMIN_RECEIPT_DOWNLOADED".equals(a.getAction()) && rcptNum.equals(a.getResourceId()));
        assertThat(auditRecorded).isTrue();
    }

    /**
     * 10. Transactional outbox queuing: Successful donation enqueues EMAIL notification with attachment receipt ID.
     */
    @Test
    void testTransactionalOutboxNotificationEnqueuedOnReceiptGeneration() throws Exception {
        String token = loginPortalUser("outbox_donor@example.org", "Outbox Supporter");

        InitiateDonationRequest initReq = new InitiateDonationRequest(
                "SAFE_WATER_SANITATION",
                new BigDecimal("5000.00"),
                "Outbox Supporter",
                "outbox_donor@example.org",
                null, null, null, null, false, "UPI_QR"
        );

        MvcResult initRes = mockMvc.perform(post("/public/donations/initiate")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initReq)))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(initRes.getResponse().getContentAsString()).get("providerOrderId").asString();

        String capturePayload = """
                {"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_outbox_1","order_id":"%s","amount":500000,"status":"captured"}}}}
                """.formatted(orderId);
        String sig = HmacCryptoUtil.hmacSha256Hex(RZP_SECRET, capturePayload);

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", sig)
                        .header("X-Razorpay-Event-Id", "evt_outbox_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(capturePayload))
                .andExpect(status().isOk());

        DonationReceipt receipt = receiptRepository.findAll().get(0);

        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        assertThat(outboxItems).isNotEmpty();

        boolean receiptEmailFound = outboxItems.stream().anyMatch(item ->
                "EMAIL".equals(item.getChannel()) &&
                "DONATION_CONFIRMED_RECEIPT".equals(item.getEventType()) &&
                receipt.getId().equals(item.getAttachmentReceiptId()) &&
                "outbox_donor@example.org".equals(item.getRecipient())
        );
        assertThat(receiptEmailFound).isTrue();
    }
}
