package org.mahavirtrust.backend;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.donation.CashfreeVerifyRequest;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.Payment;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.mahavirtrust.backend.service.payment.CashfreePaymentGatewayService;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.client.match.MockRestRequestMatchers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "app.payment.provider=CASHFREE",
        "app.payment.sandbox-mode=true",
        "app.payment.cashfree-env=SANDBOX",
        "app.payment.cashfree-api-version=2023-08-01",
        "app.payment.cashfree-app-id=cf_test_app_id_2026",
        "app.payment.cashfree-secret-key=cf_test_secret_key_2026",
        "app.payment.cashfree-webhook-secret=cf_test_webhook_secret_2026",
        "app.payment.cashfree-webhook-tolerance-seconds=300",
        "app.payment.cashfree-return-url=https://mect.org.in/donate?order_id={order_id}"
})
public class CashfreePaymentGatewayIntegrationTests {

    private static final String TEST_WEBHOOK_SECRET = "cf_test_webhook_secret_2026";
    private static final String TEST_SECRET_KEY = "cf_test_secret_key_2026";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private CashfreePaymentGatewayService cashfreeGatewayService;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private PaymentEventRepository paymentEventRepository;
    @Autowired private PaymentReconciliationLogRepository reconciliationRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private NotificationDeliveryLogRepository deliveryLogRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private AdminUserRepository adminUserRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private WhatsAppProvider whatsAppProvider;

    private MockRestServiceServer mockCashfreeServer;

    @BeforeEach
    void setup() {
        deliveryLogRepository.deleteAll();
        outboxRepository.deleteAll();
        receiptRepository.deleteAll();
        reconciliationRepository.deleteAll();
        paymentEventRepository.deleteAll();
        paymentRepository.deleteAll();
        donationRepository.deleteAll();
        adminUserRepository.deleteAll();

        RestClient.Builder builder = RestClient.builder();
        mockCashfreeServer = MockRestServiceServer.bindTo(builder).build();
        cashfreeGatewayService.setRestClientForTesting(builder.build());

        when(emailProvider.isConfigured()).thenReturn(true);
        when(emailProvider.getProviderName()).thenReturn("RESEND");
        when(emailProvider.sendEmail(anyString(), anyString(), anyString(), anyString(), any(), any(), anyMap()))
                .thenReturn(ProviderDispatchResult.sent("resend_cf_ok", "{}"));
        when(whatsAppProvider.isConfigured()).thenReturn(false);
    }

    @AfterEach
    void teardown() {
        cashfreeGatewayService.setRestClientForTesting(RestClient.create());
    }

    @Test
    void testCashfreeGatewayStatusAndOrderCreationAndValidationAndSecretIsolation() throws Exception {
        mockMvc.perform(get("/public/donations/gateway-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.provider").value("CASHFREE"))
                .andExpect(jsonPath("$.configured").value(true))
                .andExpect(jsonPath("$.checkoutMode").value("CASHFREE_SDK_V3"))
                .andExpect(jsonPath("$.checkoutEnvironment").value("sandbox"));

        // Invalid small amount rejected cleanly (< INR 10)
        InitiateDonationRequest badAmount = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("5.00"),
                "Invalid Donor",
                "bad@example.org",
                null,
                null,
                null,
                null,
                false,
                "GATEWAY_CHECKOUT"
        );
        mockMvc.perform(post("/payments/cashfree/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badAmount)))
                .andExpect(status().isBadRequest());

        // Expect outbound Cashfree POST /pg/orders call
        mockCashfreeServer.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders"))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.POST))
                .andExpect(MockRestRequestMatchers.header("x-client-id", "cf_test_app_id_2026"))
                .andExpect(MockRestRequestMatchers.header("x-client-secret", TEST_SECRET_KEY))
                .andExpect(MockRestRequestMatchers.header("x-api-version", "2023-08-01"))
                .andRespond(request -> {
                    JsonNode sent = objectMapper.readTree(request.getBody().toString());
                    String sentOrderId = sent.get("order_id").asString();
                    String resp = """
                            {
                              "cf_order_id": 2147483901,
                              "order_id": "%s",
                              "order_currency": "INR",
                              "order_amount": 3000.00,
                              "order_status": "ACTIVE",
                              "payment_session_id": "session_cf_test_xyz_9988"
                            }
                            """.formatted(sentOrderId);
                    return withSuccess(resp, MediaType.APPLICATION_JSON).createResponse(request);
                });

        InitiateDonationRequest validReq = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("3000.00"),
                "Ramesh Mohanty",
                "ramesh@example.org",
                "+91 9876543210",
                "Balangir",
                "ABCDE1234F",
                "Shiksha Setu scholarship",
                false,
                "GATEWAY_CHECKOUT"
        );

        MvcResult res = mockMvc.perform(post("/payments/cashfree/create-order")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.provider").value("CASHFREE"))
                .andExpect(jsonPath("$.cfOrderId").value("2147483901"))
                .andExpect(jsonPath("$.paymentSessionId").value("session_cf_test_xyz_9988"))
                .andExpect(jsonPath("$.checkoutEnvironment").value("sandbox"))
                .andExpect(content().string(not(containsString(TEST_SECRET_KEY))))
                .andExpect(content().string(not(containsString("cf_test_app_id_2026"))))
                .andReturn();

        mockCashfreeServer.verify();

        String ref = objectMapper.readTree(res.getResponse().getContentAsString()).get("donationReference").asString();
        Donation d = donationRepository.findByDonationReference(ref).orElseThrow();
        Payment p = paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(d.getId()).orElseThrow();
        assertThat(d.getStatus()).isEqualTo("PENDING");
        assertThat(p.getCfOrderId()).isEqualTo("2147483901");
        assertThat(p.getPaymentSessionId()).isEqualTo("session_cf_test_xyz_9988");
        assertThat(p.getGatewayRawStatus()).isEqualTo("ACTIVE");
    }

    @Test
    void testCashfreeWebhookSignaturesReplayProtectionAmountTamperingIdempotencyAndNonDowngrade() throws Exception {
        String orderId = createSampleCashfreeDonation(new BigDecimal("5000.00"), "cf_sess_webhook_1");

        String successPayload = """
                {
                  "type": "PAYMENT_SUCCESS_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s", "cf_order_id": 9001122, "order_amount": 5000.00, "order_currency": "INR" },
                    "payment": {
                      "cf_payment_id": "cf_pay_987654321",
                      "payment_status": "SUCCESS",
                      "payment_amount": 5000.00,
                      "payment_currency": "INR",
                      "payment_group": "upi",
                      "bank_reference": "UTR4455667788"
                    }
                  }
                }
                """.formatted(orderId);

        String validTs = String.valueOf(Instant.now().toEpochMilli());
        String validSig = signCashfreeWebhook(validTs, successPayload);

        // 1. Invalid signature -> 401
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", validTs)
                        .header("x-webhook-signature", "bad_signature==")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(successPayload))
                .andExpect(status().isUnauthorized());

        // 2. Stale timestamp (> 300s old) even with valid signature -> 401 replay protection
        String staleTs = String.valueOf(Instant.now().minusSeconds(900).toEpochMilli());
        String staleSig = signCashfreeWebhook(staleTs, successPayload);
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", staleTs)
                        .header("x-webhook-signature", staleSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(successPayload))
                .andExpect(status().isUnauthorized());

        // 3. Valid signature but tampered amount (1.00 instead of 5000.00) -> 400 and NOT confirmed
        String tamperedPayload = """
                {
                  "type": "PAYMENT_SUCCESS_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s", "order_amount": 5000.00, "order_currency": "INR" },
                    "payment": {
                      "cf_payment_id": "cf_pay_tampered_1",
                      "payment_status": "SUCCESS",
                      "payment_amount": 1.00,
                      "payment_currency": "INR"
                    }
                  }
                }
                """.formatted(orderId);
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", validTs)
                        .header("x-webhook-signature", signCashfreeWebhook(validTs, tamperedPayload))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(tamperedPayload))
                .andExpect(status().isBadRequest());
        assertThat(donationRepository.findByDonationReference(orderId).orElseThrow().getStatus()).isEqualTo("PENDING");
        assertThat(receiptRepository.count()).isZero();

        // 4. Genuine PAYMENT_SUCCESS_WEBHOOK -> 200 PROCESSED, receipt generated, verifiedAt stamped
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", validTs)
                        .header("x-webhook-signature", validSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(successPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PROCESSED"));

        Donation confirmed = donationRepository.findByDonationReference(orderId).orElseThrow();
        Payment confirmedPayment = paymentRepository.findByProviderOrderId(orderId).orElseThrow();
        assertThat(confirmed.getStatus()).isEqualTo("SUCCESSFUL");
        assertThat(confirmedPayment.getStatus()).isEqualTo("SUCCESSFUL");
        assertThat(confirmedPayment.getVerifiedAt()).isNotNull();
        assertThat(confirmedPayment.getBankReference()).isEqualTo("UTR4455667788");
        assertThat(confirmedPayment.getPaymentGroup()).isEqualTo("upi");
        assertThat(receiptRepository.findByDonationId(confirmed.getId())).isPresent();

        // 5. Duplicate replay -> 200 IGNORED_DUPLICATE, zero duplicate receipts
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", validTs)
                        .header("x-webhook-signature", validSig)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(successPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IGNORED_DUPLICATE"));
        assertThat(receiptRepository.count()).isEqualTo(1);

        // 6. Late USER_DROPPED/FAILED webhook must NEVER downgrade SUCCESSFUL payment
        String lateDropPayload = """
                {
                  "type": "PAYMENT_USER_DROPPED_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s" },
                    "payment": { "cf_payment_id": "cf_pay_late_drop_77", "payment_status": "USER_DROPPED" }
                  }
                }
                """.formatted(orderId);
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", validTs)
                        .header("x-webhook-signature", signCashfreeWebhook(validTs, lateDropPayload))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(lateDropPayload))
                .andExpect(status().isOk());
        assertThat(donationRepository.findByDonationReference(orderId).orElseThrow().getStatus()).isEqualTo("SUCCESSFUL");
    }

    @Test
    void testCashfreeServerSideReturnVerificationUserDroppedRecoveryRefundAndAdminReconcile() throws Exception {
        String orderId = createSampleCashfreeDonation(new BigDecimal("2500.00"), "cf_sess_recover_1");

        // 1. Initial return check shows USER_DROPPED from Cashfree server
        mockCashfreeServer.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/" + orderId))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        {"cf_order_id": 7711, "order_id": "%s", "order_status": "ACTIVE", "order_amount": 2500.00, "order_currency": "INR"}
                        """.formatted(orderId), MediaType.APPLICATION_JSON));
        mockCashfreeServer.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/" + orderId + "/payments"))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        [{"cf_payment_id": "cf_att_1", "payment_status": "USER_DROPPED", "payment_amount": 2500.00, "payment_currency": "INR", "payment_message": "Donor closed UPI prompt"}]
                        """, MediaType.APPLICATION_JSON));

        mockMvc.perform(post("/payments/cashfree/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CashfreeVerifyRequest(orderId))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("USER_DROPPED"))
                .andExpect(jsonPath("$.receiptAvailable").value(false));
        mockCashfreeServer.verify();

        // 2. Re-setup mock server & test Admin Manual Reconcile RBAC + recovery to SUCCESSFUL
        AdminUser financeAdmin = adminUserRepository.save(new AdminUser(
                "fin_cf_officer",
                "finance_cf@mect.org.in",
                passwordEncoder.encode("StrongPass#2026"),
                "MECT Finance Trustee",
                Role.ROLE_FINANCE_OFFICER
        ));
        String adminJwt = jwtTokenProvider.generateAccessToken(financeAdmin.getUsername(), financeAdmin.getRole().name());

        // Unauthenticated admin reconcile -> 401
        mockMvc.perform(post("/admin/donations/" + orderId + "/reconcile"))
                .andExpect(status().isUnauthorized());

        RestClient.Builder builder2 = RestClient.builder();
        MockRestServiceServer server2 = MockRestServiceServer.bindTo(builder2).build();
        cashfreeGatewayService.setRestClientForTesting(builder2.build());

        server2.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/" + orderId))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        {"cf_order_id": 7711, "order_id": "%s", "order_status": "PAID", "order_amount": 2500.00, "order_currency": "INR"}
                        """.formatted(orderId), MediaType.APPLICATION_JSON));
        server2.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/" + orderId + "/payments"))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.GET))
                .andRespond(withSuccess("""
                        [{"cf_payment_id": "cf_pay_settled_22", "payment_status": "SUCCESS", "payment_amount": 2500.00, "payment_currency": "INR", "payment_group": "net_banking", "bank_reference": "NB990011"}]
                        """, MediaType.APPLICATION_JSON));

        mockMvc.perform(post("/admin/donations/" + orderId + "/reconcile")
                        .header("Authorization", "Bearer " + adminJwt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESSFUL"))
                .andExpect(jsonPath("$.receiptAvailable").value(true))
                .andExpect(jsonPath("$.paymentGroup").value("net_banking"));
        server2.verify();

        // Admin filter by provider=CASHFREE & status=SUCCESSFUL returns the row
        mockMvc.perform(get("/admin/donations?provider=CASHFREE&status=SUCCESSFUL")
                        .header("Authorization", "Bearer " + adminJwt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].donationReference").value(orderId))
                .andExpect(jsonPath("$.content[0].provider").value("CASHFREE"));

        // 3. Refund webhook transitions settled donation cleanly to REFUNDED
        String ts = String.valueOf(Instant.now().toEpochMilli());
        String refundPayload = """
                {
                  "type": "REFUND_STATUS_WEBHOOK",
                  "data": {
                    "order": { "order_id": "%s" },
                    "refund": { "cf_refund_id": "cf_ref_100", "cf_payment_id": "cf_pay_settled_22", "refund_amount": 2500.00, "refund_status": "SUCCESS" }
                  }
                }
                """.formatted(orderId);
        mockMvc.perform(post("/webhooks/payments/cashfree")
                        .header("x-webhook-timestamp", ts)
                        .header("x-webhook-signature", signCashfreeWebhook(ts, refundPayload))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refundPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.donationStatus").value("REFUNDED"));
    }

    private String createSampleCashfreeDonation(BigDecimal amount, String sessionId) throws Exception {
        mockCashfreeServer.expect(MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders"))
                .andExpect(MockRestRequestMatchers.method(HttpMethod.POST))
                .andRespond(request -> {
                    JsonNode sent = objectMapper.readTree(request.getBody().toString());
                    String orderId = sent.get("order_id").asString();
                    return withSuccess("""
                            {
                              "cf_order_id": 9001122,
                              "order_id": "%s",
                              "order_currency": "INR",
                              "order_amount": %s,
                              "order_status": "ACTIVE",
                              "payment_session_id": "%s"
                            }
                            """.formatted(orderId, amount.toPlainString(), sessionId), MediaType.APPLICATION_JSON).createResponse(request);
                });

        InitiateDonationRequest req = new InitiateDonationRequest(
                "EDUCATION_LEARNING",
                amount,
                "Ananya Panda",
                "ananya@example.org",
                "+919123456789",
                "Balangir",
                null,
                null,
                false,
                "GATEWAY_CHECKOUT"
        );
        MvcResult init = mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        mockCashfreeServer.verify();
        mockCashfreeServer.reset();
        return objectMapper.readTree(init.getResponse().getContentAsString()).get("providerOrderId").asString();
    }

    private String signCashfreeWebhook(String timestamp, String rawPayload) {
        return HmacCryptoUtil.hmacSha256Base64(TEST_WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), timestamp + rawPayload);
    }
}
