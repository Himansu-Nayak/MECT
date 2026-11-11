package org.mahavirtrust.backend;

import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.DonationProgramme;
import org.mahavirtrust.backend.exception.ProviderUnconfiguredException;
import org.mahavirtrust.backend.service.payment.CashfreePaymentGatewayService;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class CashfreeSecurityAndSchedulerUnitTests {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testUnconfiguredCashfreeNeverFakesSessionsAndSelectsEnvironmentSafely() {
        CashfreePaymentGatewayService unconfiguredSandbox = new CashfreePaymentGatewayService(
                objectMapper, "", "", "SANDBOX", "2023-08-01", "", 300,
                "https://mect.org.in/donate?order_id={order_id}", "", true
        );
        assertThat(unconfiguredSandbox.isConfigured()).isFalse();
        assertThat(unconfiguredSandbox.getBaseUrl()).isEqualTo("https://sandbox.cashfree.com/pg");
        assertThat(unconfiguredSandbox.getCheckoutEnvironmentName()).isEqualTo("sandbox");
        assertThat(unconfiguredSandbox.getGatewayStatus().configured()).isFalse();

        Donation d = new Donation();
        d.setDonationReference("MECT-DON-2026-UNCONF");
        d.setAmount(new BigDecimal("500.00"));
        d.setCurrency("INR");
        d.setDonorName("Test Donor");
        DonationProgramme prog = new DonationProgramme();
        prog.setCode("EDUCATION_LEARNING");
        d.setProgramme(prog);

        assertThatThrownBy(() -> unconfiguredSandbox.createOrder(d, Instant.now().plus(15, ChronoUnit.MINUTES)))
                .isInstanceOf(ProviderUnconfiguredException.class);

        CashfreePaymentGatewayService prodConfigured = new CashfreePaymentGatewayService(
                objectMapper, "prod_app_id", "prod_secret", "PRODUCTION", "2025-01-01", "wh_sec", 300,
                "https://mect.org.in/donate?order_id={order_id}", "", false
        );
        assertThat(prodConfigured.isConfigured()).isTrue();
        assertThat(prodConfigured.isProductionEnvironment()).isTrue();
        assertThat(prodConfigured.getBaseUrl()).isEqualTo("https://api.cashfree.com/pg");
        assertThat(prodConfigured.getCheckoutEnvironmentName()).isEqualTo("production");
    }

    @Test
    void testCashfreeWebhookHmacRejectsTamperedBodySkewedTimestampAndClientBypass() {
        String secret = "cf_wh_secret_strict_2026";
        CashfreePaymentGatewayService service = new CashfreePaymentGatewayService(
                objectMapper, "app_1", "sec_1", "SANDBOX", "2023-08-01", secret, 300,
                "https://mect.org.in/donate?order_id={order_id}", "", true
        );

        String rawPayload = "{\"type\":\"PAYMENT_SUCCESS_WEBHOOK\",\"data\":{\"order\":{\"order_id\":\"MECT-DON-1\"}}}";
        String nowMs = String.valueOf(Instant.now().toEpochMilli());
        String sig = HmacCryptoUtil.hmacSha256Base64(secret.getBytes(StandardCharsets.UTF_8), nowMs + rawPayload);

        assertThat(service.verifyWebhookSignature(nowMs, rawPayload, sig)).isTrue();
        assertThat(service.verifyWebhookSignature(nowMs, rawPayload + " ", sig)).isFalse();
        assertThat(service.verifyWebhookSignature(null, rawPayload, sig)).isFalse();
        assertThat(service.verifyWebhookSignature("", rawPayload, sig)).isFalse();
        assertThat(service.verifyWebhookSignature(rawPayload, sig)).isFalse();

        String staleSeconds = String.valueOf(Instant.now().minusSeconds(601).getEpochSecond());
        String staleSig = HmacCryptoUtil.hmacSha256Base64(secret.getBytes(StandardCharsets.UTF_8), staleSeconds + rawPayload);
        assertThat(service.verifyWebhookSignature(staleSeconds, rawPayload, staleSig)).isFalse();

        // Client checkout signature bypass must always return false for Cashfree v3 (must use server GET /orders/{id})
        assertThat(service.verifyCheckoutSignature("ord_1", "pay_1", "any_sig")).isFalse();
    }

    @Test
    void testMultiAttemptPaymentSelectionAndNumericDecimalParsing() {
        CashfreePaymentGatewayService service = new CashfreePaymentGatewayService(
                objectMapper, "app_1", "sec_1", "SANDBOX", "2023-08-01", "wh_1", 300,
                "https://mect.org.in/donate?order_id={order_id}", "", true
        );
        org.springframework.web.client.RestClient.Builder builder = org.springframework.web.client.RestClient.builder();
        org.springframework.test.web.client.MockRestServiceServer server = org.springframework.test.web.client.MockRestServiceServer.bindTo(builder).build();
        service.setRestClientForTesting(builder.build());

        server.expect(org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/ORD_MULTI_1"))
                .andRespond(org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess(
                        "{\"cf_order_id\":101,\"order_id\":\"ORD_MULTI_1\",\"order_status\":\"ACTIVE\",\"order_amount\":1500.5,\"order_currency\":\"INR\"}",
                        org.springframework.http.MediaType.APPLICATION_JSON));
        server.expect(org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo("https://sandbox.cashfree.com/pg/orders/ORD_MULTI_1/payments"))
                .andRespond(org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess(
                        "[{\"cf_payment_id\":\"att_1\",\"payment_status\":\"USER_DROPPED\",\"payment_amount\":1500.50,\"payment_currency\":\"INR\"}," +
                        "{\"cf_payment_id\":\"att_2\",\"payment_status\":\"PENDING\",\"payment_amount\":1500.50,\"payment_currency\":\"INR\"}]",
                        org.springframework.http.MediaType.APPLICATION_JSON));

        CashfreePaymentGatewayService.CashfreeVerifiedOrder res = service.fetchAndNormalizeOrderStatus(
                "ORD_MULTI_1", new BigDecimal("1500.50"), "INR"
        );
        server.verify();
        assertThat(res.normalizedStatus()).isEqualTo("PENDING");
        assertThat(res.cfPaymentId()).isEqualTo("att_2");
    }

    @Test
    void testRefusesEnvironmentKeyPrefixMismatchFailClosed() {
        Donation d = new Donation();
        d.setDonationReference("MECT-DON-2026-MISMATCH");
        d.setAmount(new BigDecimal("500.00"));
        d.setCurrency("INR");
        d.setDonorName("Test Donor");
        DonationProgramme prog = new DonationProgramme();
        prog.setCode("EDUCATION_LEARNING");
        d.setProgramme(prog);

        CashfreePaymentGatewayService prodKeyInSandbox = new CashfreePaymentGatewayService(
                objectMapper, "app_1", "cfsk_ma_prod_dummy_mismatch", "SANDBOX", "2023-08-01", "", 300,
                "https://mect.org.in/donate?order_id={order_id}", "", true
        );
        assertThat(prodKeyInSandbox.isEnvironmentMismatch()).isTrue();
        assertThat(prodKeyInSandbox.isConfigured()).isFalse();
        assertThat(prodKeyInSandbox.getGatewayStatus().configured()).isFalse();
        assertThatThrownBy(() -> prodKeyInSandbox.createOrder(d, Instant.now().plus(20, ChronoUnit.MINUTES)))
                .isInstanceOf(ProviderUnconfiguredException.class);

        CashfreePaymentGatewayService sandboxKeyInProd = new CashfreePaymentGatewayService(
                objectMapper, "app_1", "cfsk_ma_test_dummy_mismatch", "PRODUCTION", "2023-08-01", "", 300,
                "https://mect.org.in/donate?order_id={order_id}", "", false
        );
        assertThat(sandboxKeyInProd.isEnvironmentMismatch()).isTrue();
        assertThat(sandboxKeyInProd.isConfigured()).isFalse();
        assertThatThrownBy(() -> sandboxKeyInProd.createOrder(d, Instant.now().plus(20, ChronoUnit.MINUTES)))
                .isInstanceOf(ProviderUnconfiguredException.class);
    }
}

