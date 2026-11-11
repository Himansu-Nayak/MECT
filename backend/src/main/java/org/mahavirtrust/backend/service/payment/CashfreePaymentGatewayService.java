package org.mahavirtrust.backend.service.payment;

import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.exception.ProviderDispatchException;
import org.mahavirtrust.backend.exception.ProviderUnconfiguredException;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service("cashfreeGateway")
public class CashfreePaymentGatewayService implements PaymentGatewayProvider {

    private static final Logger log = LoggerFactory.getLogger(CashfreePaymentGatewayService.class);
    private static final String SANDBOX_BASE_URL = "https://sandbox.cashfree.com/pg";
    private static final String PRODUCTION_BASE_URL = "https://api.cashfree.com/pg";

    private final ObjectMapper objectMapper;
    private volatile RestClient restClient;
    private final String appId;
    private final String secretKey;
    private final String environment;
    private final String apiVersion;
    private final String webhookSecret;
    private final long webhookToleranceSeconds;
    private final String returnUrlTemplate;
    private final String notifyUrl;
    private final boolean sandboxMode;

    public void setRestClientForTesting(RestClient restClient) {
        this.restClient = Objects.requireNonNull(restClient);
    }

    public record CashfreeOrderResult(
            String orderId,
            String cfOrderId,
            String paymentSessionId,
            String orderStatus,
            String environment
    ) {}

    public record CashfreeVerifiedOrder(
            String orderId,
            String cfOrderId,
            String orderStatus,
            BigDecimal orderAmount,
            String orderCurrency,
            String cfPaymentId,
            String paymentStatus,
            BigDecimal paymentAmount,
            String paymentCurrency,
            String paymentGroup,
            String bankReference,
            String failureReason,
            String normalizedStatus
    ) {}

    @Autowired
    public CashfreePaymentGatewayService(
            ObjectMapper objectMapper,
            @Value("${app.payment.cashfree-app-id:}") String appId,
            @Value("${app.payment.cashfree-secret-key:}") String secretKey,
            @Value("${app.payment.cashfree-env:SANDBOX}") String environment,
            @Value("${app.payment.cashfree-api-version:2023-08-01}") String apiVersion,
            @Value("${app.payment.cashfree-webhook-secret:}") String webhookSecret,
            @Value("${app.payment.cashfree-webhook-tolerance-seconds:300}") long webhookToleranceSeconds,
            @Value("${app.payment.cashfree-return-url:https://mect.org.in/donate?order_id={order_id}}") String returnUrlTemplate,
            @Value("${app.payment.cashfree-notify-url:https://mect.org.in/api/v1/webhooks/payments/cashfree}") String notifyUrl,
            @Value("${app.payment.sandbox-mode:false}") boolean sandboxMode
    ) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.create();
        this.appId = appId != null ? appId.trim() : "";
        this.secretKey = secretKey != null ? secretKey.trim() : "";
        this.environment = environment != null ? environment.trim().toUpperCase() : "SANDBOX";
        this.apiVersion = apiVersion != null && !apiVersion.isBlank() ? apiVersion.trim() : "2023-08-01";
        this.webhookSecret = webhookSecret != null ? webhookSecret.trim() : "";
        this.webhookToleranceSeconds = webhookToleranceSeconds > 0 ? webhookToleranceSeconds : 300L;
        this.returnUrlTemplate = returnUrlTemplate != null ? returnUrlTemplate.trim() : "https://mect.org.in/donate?order_id={order_id}";
        this.notifyUrl = notifyUrl != null ? notifyUrl.trim() : "";
        this.sandboxMode = sandboxMode;
    }

    public boolean isEnvironmentMismatch() {
        if (secretKey.isBlank()) {
            return false;
        }
        boolean prod = isProductionEnvironment();
        return (!prod && secretKey.startsWith("cfsk_ma_prod_"))
                || (prod && secretKey.startsWith("cfsk_ma_test_"));
    }

    public boolean isConfigured() {
        return !appId.isBlank() && !secretKey.isBlank() && !isEnvironmentMismatch();
    }

    public boolean isProductionEnvironment() {
        return ("PRODUCTION".equalsIgnoreCase(environment) || "PROD".equalsIgnoreCase(environment)) && !sandboxMode;
    }

    public String getCheckoutEnvironmentName() {
        return isProductionEnvironment() ? "production" : "sandbox";
    }

    public String getBaseUrl() {
        return isProductionEnvironment() ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
    }

    @Override
    public GatewayStatus getGatewayStatus() {
        if (isEnvironmentMismatch()) {
            return new GatewayStatus(
                    "CASHFREE",
                    false,
                    !isProductionEnvironment(),
                    false,
                    "Cashfree API key environment mismatch detected (verify CASHFREE_ENV matches your Sandbox vs Production key).",
                    "CASHFREE_SDK_V3",
                    getCheckoutEnvironmentName()
            );
        }
        boolean configured = isConfigured();
        String envName = getCheckoutEnvironmentName();
        return new GatewayStatus(
                "CASHFREE",
                configured,
                !isProductionEnvironment(),
                false,
                configured
                        ? "Cashfree Payment Gateway active (" + envName + ")"
                        : "Cashfree credentials are not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in backend environment.",
                "CASHFREE_SDK_V3",
                envName
        );
    }

    @Override
    public InitiatedPayment createDynamicQrOrder(Donation donation, Instant expiresAt) {
        CashfreeOrderResult order = createOrder(donation, expiresAt);
        return new InitiatedPayment(
                "CASHFREE",
                order.orderId(),
                null,
                null,
                null,
                null,
                expiresAt,
                order.cfOrderId(),
                order.paymentSessionId(),
                order.environment()
        );
    }

    public CashfreeOrderResult createOrder(Donation donation, Instant expiresAt) {
        if (isEnvironmentMismatch()) {
            throw new ProviderUnconfiguredException(
                    "CASHFREE",
                    "Cashfree API key environment mismatch: refusing to send requests when CASHFREE_ENV conflicts with key prefix."
            );
        }
        if (!isConfigured()) {
            throw new ProviderUnconfiguredException(
                    "CASHFREE",
                    "Cashfree Payment Gateway is not configured on the backend. Please configure CASHFREE_APP_ID and CASHFREE_SECRET_KEY or remit directly via MECT SBI Bank Transfer."
            );
        }

        // Cashfree PG API requires expiry at least ~16 minutes ahead of gateway server time
        Instant minSafeExpiry = Instant.now().plus(20, ChronoUnit.MINUTES);
        Instant effectiveExpiry = (expiresAt != null && expiresAt.isAfter(minSafeExpiry)) ? expiresAt : minSafeExpiry;

        String orderId = donation.getDonationReference();
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("order_id", orderId);
        payload.put("order_amount", donation.getAmount().setScale(2, RoundingMode.HALF_UP));
        payload.put("order_currency", donation.getCurrency());
        payload.put("order_expiry_time", effectiveExpiry.truncatedTo(ChronoUnit.SECONDS).toString());
        payload.put("order_note", "MECT Voluntary Donation - " + donation.getProgramme().getCode());

        Map<String, Object> customer = new LinkedHashMap<>();
        customer.put("customer_id", buildSafeCustomerId(donation));
        customer.put("customer_name", sanitizeName(donation.getDonorName()));
        customer.put("customer_email", hasText(donation.getDonorEmail()) ? donation.getDonorEmail().trim() : "supporter@mect.org.in");
        customer.put("customer_phone", normalizeCustomerPhone(donation.getDonorPhone()));
        payload.put("customer_details", customer);

        Map<String, Object> meta = new LinkedHashMap<>();
        meta.put("return_url", resolveReturnUrl(orderId));
        if (hasText(notifyUrl) && notifyUrl.startsWith("https://")) {
            meta.put("notify_url", notifyUrl);
        }
        payload.put("order_meta", meta);

        Map<String, Object> tags = new LinkedHashMap<>();
        tags.put("programme_code", truncate(donation.getProgramme().getCode(), 50));
        tags.put("donation_reference", truncate(orderId, 50));
        tags.put("source", "mect.org.in");
        payload.put("order_tags", tags);

        try {
            String raw = restClient.post()
                    .uri(getBaseUrl() + "/orders")
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .header("x-api-version", apiVersion)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(payload))
                    .retrieve()
                    .body(String.class);

            JsonNode json = objectMapper.readTree(raw);
            String returnedOrderId = textOrNull(json, "order_id");
            String cfOrderId = scalarTextOrNull(json, "cf_order_id");
            String paymentSessionId = textOrNull(json, "payment_session_id");
            String orderStatus = textOrNull(json, "order_status");

            if (!hasText(paymentSessionId) || !hasText(returnedOrderId)) {
                throw new ProviderDispatchException("CASHFREE", "Cashfree order response did not return a valid payment_session_id.");
            }
            return new CashfreeOrderResult(
                    returnedOrderId,
                    cfOrderId,
                    paymentSessionId,
                    orderStatus != null ? orderStatus : "ACTIVE",
                    getCheckoutEnvironmentName()
            );
        } catch (ProviderDispatchException e) {
            throw e;
        } catch (RestClientException e) {
            log.warn("Cashfree order creation HTTP call failed for reference={}: {}", orderId, e.getMessage());
            throw new ProviderDispatchException("CASHFREE", "Unable to create Cashfree payment order: " + e.getMessage());
        } catch (Exception e) {
            throw new ProviderDispatchException("CASHFREE", "Cashfree order creation failed: " + e.getMessage());
        }
    }

    public CashfreeVerifiedOrder fetchAndNormalizeOrderStatus(String orderId, BigDecimal expectedAmount, String expectedCurrency) {
        if (!isConfigured()) {
            throw new ProviderUnconfiguredException("CASHFREE", "Cashfree Payment Gateway credentials are not configured.");
        }
        try {
            String orderRaw = restClient.get()
                    .uri(getBaseUrl() + "/orders/{orderId}", orderId)
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .header("x-api-version", apiVersion)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);

            JsonNode orderJson = objectMapper.readTree(orderRaw);
            String orderStatus = textOrNull(orderJson, "order_status");
            String cfOrderId = scalarTextOrNull(orderJson, "cf_order_id");
            BigDecimal orderAmount = decimalOrNull(orderJson, "order_amount");
            String orderCurrency = textOrNull(orderJson, "order_currency");

            String paymentsRaw = restClient.get()
                    .uri(getBaseUrl() + "/orders/{orderId}/payments", orderId)
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .header("x-api-version", apiVersion)
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(String.class);

            JsonNode paymentsArray = objectMapper.readTree(paymentsRaw);
            JsonNode selectedPayment = selectRelevantPaymentAttempt(paymentsArray);

            String cfPaymentId = selectedPayment != null ? scalarTextOrNull(selectedPayment, "cf_payment_id") : null;
            String paymentStatus = selectedPayment != null ? textOrNull(selectedPayment, "payment_status") : null;
            BigDecimal paymentAmount = selectedPayment != null ? decimalOrNull(selectedPayment, "payment_amount") : null;
            String paymentCurrency = selectedPayment != null ? textOrNull(selectedPayment, "payment_currency") : null;
            String paymentGroup = selectedPayment != null ? textOrNull(selectedPayment, "payment_group") : null;
            String bankReference = selectedPayment != null ? textOrNull(selectedPayment, "bank_reference") : null;
            String paymentMessage = selectedPayment != null ? textOrNull(selectedPayment, "payment_message") : null;

            String normalized = normalizeStatus(
                    orderStatus,
                    paymentStatus,
                    expectedAmount,
                    expectedCurrency,
                    orderAmount,
                    orderCurrency,
                    paymentAmount,
                    paymentCurrency
            );

            String failureReason = null;
            if ("FAILED".equals(normalized) || "USER_DROPPED".equals(normalized) || "EXPIRED".equals(normalized)) {
                failureReason = hasText(paymentMessage) ? paymentMessage : ("Gateway status: " + (paymentStatus != null ? paymentStatus : orderStatus));
            }
            if ("FAILED".equals(normalized) && "PAID".equalsIgnoreCase(orderStatus)) {
                failureReason = "Payment amount or currency verification mismatch";
            }

            return new CashfreeVerifiedOrder(
                    orderId,
                    cfOrderId,
                    orderStatus != null ? orderStatus : "UNKNOWN",
                    orderAmount,
                    orderCurrency,
                    cfPaymentId,
                    paymentStatus,
                    paymentAmount,
                    paymentCurrency,
                    paymentGroup,
                    bankReference,
                    failureReason,
                    normalized
            );
        } catch (RestClientException e) {
            log.warn("Cashfree order status query failed for orderId={}: {}", orderId, e.getMessage());
            throw new ProviderDispatchException("CASHFREE", "Unable to verify Cashfree order status: " + e.getMessage());
        } catch (Exception e) {
            throw new ProviderDispatchException("CASHFREE", "Cashfree status verification failed: " + e.getMessage());
        }
    }

    public boolean verifyWebhookSignature(String timestampHeader, String payload, String signatureHeader) {
        String effectiveSecret = hasText(webhookSecret) ? webhookSecret : secretKey;
        if (!hasText(effectiveSecret) || !hasText(timestampHeader) || payload == null || !hasText(signatureHeader)) {
            return false;
        }
        if (!isTimestampWithinTolerance(timestampHeader.trim())) {
            log.warn("Cashfree webhook rejected due to stale or invalid x-webhook-timestamp={}", timestampHeader);
            return false;
        }
        String signedPayload = timestampHeader.trim() + payload;
        String expected = HmacCryptoUtil.hmacSha256Base64(effectiveSecret.getBytes(StandardCharsets.UTF_8), signedPayload);
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signatureHeader.trim().getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        // Without timestamp header Cashfree webhook signature cannot be verified cleanly.
        return false;
    }

    @Override
    public boolean verifyCheckoutSignature(String providerOrderId, String providerPaymentId, String signature) {
        // Cashfree v3 verification uses server-to-server GET /orders/{orderId} & webhooks, never trust client strings.
        return false;
    }

    private boolean isTimestampWithinTolerance(String timestampHeader) {
        try {
            long rawEpoch = Long.parseLong(timestampHeader);
            Instant eventInstant = rawEpoch > 10_000_000_000L
                    ? Instant.ofEpochMilli(rawEpoch)
                    : Instant.ofEpochSecond(rawEpoch);
            long diffSeconds = Math.abs(Duration.between(eventInstant, Instant.now()).getSeconds());
            return diffSeconds <= webhookToleranceSeconds;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private JsonNode selectRelevantPaymentAttempt(JsonNode paymentsArray) {
        if (paymentsArray == null || !paymentsArray.isArray() || paymentsArray.isEmpty()) {
            return null;
        }
        for (JsonNode p : paymentsArray) {
            if ("SUCCESS".equalsIgnoreCase(textOrNull(p, "payment_status"))) {
                return p;
            }
        }
        for (JsonNode p : paymentsArray) {
            String st = textOrNull(p, "payment_status");
            if ("PENDING".equalsIgnoreCase(st) || "NOT_ATTEMPTED".equalsIgnoreCase(st)) {
                return p;
            }
        }
        return paymentsArray.get(0);
    }

    private String normalizeStatus(
            String orderStatus,
            String paymentStatus,
            BigDecimal expectedAmount,
            String expectedCurrency,
            BigDecimal orderAmount,
            String orderCurrency,
            BigDecimal paymentAmount,
            String paymentCurrency
    ) {
        if ("PAID".equalsIgnoreCase(orderStatus) && "SUCCESS".equalsIgnoreCase(paymentStatus)) {
            if (!amountsAndCurrencyMatch(expectedAmount, expectedCurrency, orderAmount, orderCurrency, paymentAmount, paymentCurrency)) {
                return "FAILED";
            }
            return "SUCCESSFUL";
        }
        if ("EXPIRED".equalsIgnoreCase(orderStatus)) {
            return "EXPIRED";
        }
        if ("USER_DROPPED".equalsIgnoreCase(paymentStatus) || "CANCELLED".equalsIgnoreCase(paymentStatus) || "CANCELLED".equalsIgnoreCase(orderStatus)) {
            return "USER_DROPPED";
        }
        if ("TERMINATED".equalsIgnoreCase(orderStatus) || "FAILED".equalsIgnoreCase(paymentStatus)) {
            return "FAILED";
        }
        return "PENDING";
    }

    private boolean amountsAndCurrencyMatch(
            BigDecimal expectedAmount,
            String expectedCurrency,
            BigDecimal orderAmount,
            String orderCurrency,
            BigDecimal paymentAmount,
            String paymentCurrency
    ) {
        if (expectedAmount == null || orderAmount == null || paymentAmount == null) {
            return false;
        }
        boolean orderAmountOk = expectedAmount.setScale(2, RoundingMode.HALF_UP)
                .compareTo(orderAmount.setScale(2, RoundingMode.HALF_UP)) == 0;
        boolean paymentAmountOk = expectedAmount.setScale(2, RoundingMode.HALF_UP)
                .compareTo(paymentAmount.setScale(2, RoundingMode.HALF_UP)) == 0;
        boolean orderCurrOk = expectedCurrency.equalsIgnoreCase(orderCurrency);
        boolean paymentCurrOk = paymentCurrency == null || expectedCurrency.equalsIgnoreCase(paymentCurrency);
        return orderAmountOk && paymentAmountOk && orderCurrOk && paymentCurrOk;
    }

    private String resolveReturnUrl(String orderId) {
        if (returnUrlTemplate.contains("{order_id}")) {
            return returnUrlTemplate.replace("{order_id}", orderId);
        }
        String sep = returnUrlTemplate.contains("?") ? "&" : "?";
        return returnUrlTemplate + sep + "order_id=" + orderId;
    }

    private String buildSafeCustomerId(Donation donation) {
        if (donation.getPortalUser() != null && hasText(donation.getPortalUser().getUserUuid())) {
            return "mect_u_" + truncate(donation.getPortalUser().getUserUuid().replaceAll("[^a-zA-Z0-9_-]", ""), 36);
        }
        return "mect_d_" + truncate(donation.getDonationReference().replaceAll("[^a-zA-Z0-9_-]", ""), 36);
    }

    private String sanitizeName(String name) {
        String cleaned = name != null ? name.replaceAll("[^a-zA-Z0-9 .'-]", " ").trim() : "MECT Supporter";
        return cleaned.isBlank() ? "MECT Supporter" : truncate(cleaned, 80);
    }

    private String normalizeCustomerPhone(String rawPhone) {
        if (rawPhone != null) {
            String digits = rawPhone.replaceAll("\\D", "");
            if (digits.length() >= 10) {
                return digits.substring(digits.length() - 10);
            }
        }
        return "9999999999";
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    private String truncate(String s, int max) {
        return s.length() <= max ? s : s.substring(0, max);
    }

    private String textOrNull(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return null;
        return node.get(field).asString();
    }

    private String scalarTextOrNull(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return null;
        JsonNode val = node.get(field);
        return val.isString() ? val.asString() : val.toString();
    }

    private BigDecimal decimalOrNull(JsonNode node, String field) {
        if (node == null || !node.has(field) || node.get(field).isNull()) return null;
        try {
            JsonNode val = node.get(field);
            return val.isNumber() ? val.decimalValue() : new BigDecimal(val.asString());
        } catch (Exception e) {
            return null;
        }
    }
}
