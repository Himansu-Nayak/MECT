package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.NotificationDeliveryLog;
import org.mahavirtrust.backend.entity.NotificationOutbox;
import org.mahavirtrust.backend.entity.Payment;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.ResendEmailService;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WebhookSecurityAndDeliveryTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private PaymentEventRepository paymentEventRepository;
    @Autowired private PaymentReconciliationLogRepository reconciliationLogRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private NotificationDeliveryLogRepository deliveryLogRepository;
    @Autowired private NotificationOutboxService outboxService;

    @Value("${app.payment.razorpay-webhook-secret}")
    private String razorpayWebhookSecret;

    @Value("${app.resend.webhook-secret}")
    private String resendWebhookSecret;

    @BeforeEach
    void cleanDatabase() {
        deliveryLogRepository.deleteAll();
        outboxRepository.deleteAll();
        receiptRepository.deleteAll();
        reconciliationLogRepository.deleteAll();
        paymentEventRepository.deleteAll();
        paymentRepository.deleteAll();
        donationRepository.deleteAll();
    }

    @Test
    void testRazorpayWebhookSignaturesPayloadsDuplicatesFailuresRefundsAndUnknownEvents() throws Exception {
        // Initiate UPI QR donation in sandbox profile
        InitiateDonationRequest req = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1500.00"),
                "Suresh Kulkarni",
                "suresh@example.org",
                "+919876543211",
                "Balangir",
                null,
                null,
                false,
                "UPI_QR"
        );
        MvcResult init = mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        String qrId = objectMapper.readTree(init.getResponse().getContentAsString()).get("providerQrId").asString();
        String orderId = objectMapper.readTree(init.getResponse().getContentAsString()).get("providerOrderId").asString();

        // 1. Missing signature -> 401
        String qrCreditedPayload = """
                {"event":"qr_code.credited","payload":{"payment":{"entity":{"id":"pay_qr_101","amount":150000,"status":"captured"}},"qr_code":{"entity":{"id":"%s"}}}}
                """.formatted(qrId);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(qrCreditedPayload))
                .andExpect(status().isUnauthorized());

        // 2. Modified payload with original signature -> 401
        String validQrSig = HmacCryptoUtil.hmacSha256Hex(razorpayWebhookSecret, qrCreditedPayload);
        String tamperedPayload = qrCreditedPayload.replace("150000", "999999");
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", validQrSig)
                        .header("X-Razorpay-Event-Id", "evt_tamper_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tamperedPayload))
                .andExpect(status().isUnauthorized());

        // 3. Valid qr_code.credited signature -> PROCESSED & receipt generated & DB consistent
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", validQrSig)
                        .header("X-Razorpay-Event-Id", "evt_qr_101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(qrCreditedPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSED"))
                .andExpect(jsonPath("$.eventType").value("qr_code.credited"));

        assertThat(receiptRepository.count()).isEqualTo(1L);

        // 4. Duplicate qr_code.credited -> IGNORED_DUPLICATE, still 1 receipt
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", validQrSig)
                        .header("X-Razorpay-Event-Id", "evt_qr_101")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(qrCreditedPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED_DUPLICATE"));
        assertThat(receiptRepository.count()).isEqualTo(1L);

        // 5. Unknown event with valid signature -> IGNORED (200 OK)
        String unknownPayload = """
                {"event":"payment.authorized","payload":{"payment":{"entity":{"id":"pay_qr_101","order_id":"%s"}}}}
                """.formatted(orderId);
        String unknownSig = HmacCryptoUtil.hmacSha256Hex(razorpayWebhookSecret, unknownPayload);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", unknownSig)
                        .header("X-Razorpay-Event-Id", "evt_auth_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(unknownPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED"));

        // 6. Refund deduplication: refund.created followed by refund.processed with SAME refund ID rfnd_dup_55 must NOT double refundedAmount
        String refundCreated = """
                {"event":"refund.created","payload":{"refund":{"entity":{"id":"rfnd_dup_55","payment_id":"pay_qr_101","amount":150000}}}}
                """;
        String refundProcessed = """
                {"event":"refund.processed","payload":{"refund":{"entity":{"id":"rfnd_dup_55","payment_id":"pay_qr_101","amount":150000}}}}
                """;
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", HmacCryptoUtil.hmacSha256Hex(razorpayWebhookSecret, refundCreated))
                        .header("X-Razorpay-Event-Id", "evt_rfnd_created_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refundCreated))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationStatus").value("REFUNDED"));

        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", HmacCryptoUtil.hmacSha256Hex(razorpayWebhookSecret, refundProcessed))
                        .header("X-Razorpay-Event-Id", "evt_rfnd_processed_2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refundProcessed))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED_DUPLICATE_REFUND"));

        Payment paymentAfterRefund = paymentRepository.findByProviderPaymentId("pay_qr_101").orElseThrow();
        assertThat(paymentAfterRefund.getRefundedAmount()).isEqualByComparingTo("1500.00");

        // 7. Payment failure webhook on a second fresh order marks FAILED with zero receipt
        MvcResult init2 = mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        String orderId2 = objectMapper.readTree(init2.getResponse().getContentAsString()).get("providerOrderId").asString();
        String failPayload = """
                {"event":"payment.failed","payload":{"payment":{"entity":{"id":"pay_fail_1","order_id":"%s","error_description":"Insufficient balance"}}}}
                """.formatted(orderId2);
        mockMvc.perform(post("/webhooks/payments/razorpay")
                        .header("X-Razorpay-Signature", HmacCryptoUtil.hmacSha256Hex(razorpayWebhookSecret, failPayload))
                        .header("X-Razorpay-Event-Id", "evt_fail_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(failPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSED_FAILURE"));

        Donation failedDonation = donationRepository.findAll().stream()
                .filter(d -> "FAILED".equals(d.getStatus()))
                .findFirst()
                .orElseThrow();
        assertThat(receiptRepository.findByDonationId(failedDonation.getId())).isEmpty();
    }

    @Test
    void testResendSvixWebhookReplayTimestampValidationDeliveryBounceAndDeduplication() throws Exception {
        // Create an outbox row matching Resend messageId "re_email_live_99"
        NotificationOutbox box = new NotificationOutbox();
        box.setEventKey("TEST_DELIVERY_99");
        box.setEventType("DONATION_CONFIRMED_RECEIPT");
        box.setChannel("EMAIL");
        box.setRecipient("donor@example.org");
        box.setSenderIdentity("MECT Donations <donations@mect.org.in>");
        box.setSubject("Receipt");
        box.setTemplateCode("don-rcpt-v2.0");
        box.setPayloadJson("{\"html\":\"<p>ok</p>\"}");
        box.setStatus("SENT");
        box.setProviderMessageId("re_email_live_99");
        outboxRepository.save(box);

        String deliveredPayload = """
                {"type":"email.delivered","data":{"email_id":"re_email_live_99"}}
                """;
        String nowTs = String.valueOf(Instant.now().getEpochSecond());
        String staleTs = String.valueOf(Instant.now().minusSeconds(900).getEpochSecond());

        // 1. Missing headers -> 401
        mockMvc.perform(post("/webhooks/resend")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload))
                .andExpect(status().isUnauthorized());

        // 2. Expired timestamp (> 5 mins old) even with mathematically valid HMAC -> 401 replay protection!
        String staleSig = signSvix(resendWebhookSecret, "msg_stale_1", staleTs, deliveredPayload);
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_stale_1")
                        .header("svix-timestamp", staleTs)
                        .header("svix-signature", staleSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload))
                .andExpect(status().isUnauthorized());

        // 3. Valid signature + fresh timestamp -> RECORDED
        String validSig = signSvix(resendWebhookSecret, "msg_deliv_1", nowTs, deliveredPayload);
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_deliv_1")
                        .header("svix-timestamp", nowTs)
                        .header("svix-signature", validSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECORDED"));

        // 4. Modified payload with valid headers -> 401
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_deliv_1")
                        .header("svix-timestamp", nowTs)
                        .header("svix-signature", validSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload.replace("email.delivered", "email.bounced")))
                .andExpect(status().isUnauthorized());

        // 5. Duplicate svix-id retry -> IGNORED (no duplicate NotificationDeliveryLog row)
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_deliv_1")
                        .header("svix-timestamp", nowTs)
                        .header("svix-signature", validSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(deliveredPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED"));

        assertThat(deliveryLogRepository.findByOutboxIdOrderByLoggedAtDesc(box.getId())).hasSize(1);

        // 6. Email bounce event -> logs bounce & flags lastError on NotificationOutbox
        String bouncePayload = """
                {"type":"email.bounced","data":{"email_id":"re_email_live_99"}}
                """;
        String bounceSig = signSvix(resendWebhookSecret, "msg_bounce_2", nowTs, bouncePayload);
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_bounce_2")
                        .header("svix-timestamp", nowTs)
                        .header("svix-signature", bounceSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bouncePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECORDED"));

        NotificationOutbox updatedBox = outboxRepository.findById(box.getId()).orElseThrow();
        assertThat(updatedBox.getLastError()).contains("EMAIL.BOUNCED");

        // 7. Unknown/non-matching message ID does not error
        String unknownMsgPayload = """
                {"type":"email.sent","data":{"email_id":"re_nonexistent_id"}}
                """;
        String unknownSig = signSvix(resendWebhookSecret, "msg_unk_3", nowTs, unknownMsgPayload);
        mockMvc.perform(post("/webhooks/resend")
                        .header("svix-id", "msg_unk_3")
                        .header("svix-timestamp", nowTs)
                        .header("svix-signature", unknownSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(unknownMsgPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED"));
    }

    private String signSvix(String secret, String svixId, String timestamp, String payload) {
        byte[] keyBytes = secret.startsWith("whsec_")
                ? Base64.getDecoder().decode(secret.substring(6))
                : secret.getBytes(StandardCharsets.UTF_8);
        String sig = HmacCryptoUtil.hmacSha256Base64(keyBytes, svixId + "." + timestamp + "." + payload);
        return "v1," + sig;
    }
}

