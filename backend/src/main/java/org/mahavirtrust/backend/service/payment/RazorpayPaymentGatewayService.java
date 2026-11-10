package org.mahavirtrust.backend.service.payment;

import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.exception.ProviderUnconfiguredException;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
public class RazorpayPaymentGatewayService implements PaymentGatewayProvider {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentGatewayService.class);

    private final boolean sandboxMode;
    private final String keyId;
    private final String keySecret;
    private final String webhookSecret;
    private final DynamicQrSvgService qrSvgService;
    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.create();

    public RazorpayPaymentGatewayService(
            @Value("${app.payment.sandbox-mode:false}") boolean sandboxMode,
            @Value("${app.payment.razorpay-key-id:}") String keyId,
            @Value("${app.payment.razorpay-key-secret:}") String keySecret,
            @Value("${app.payment.razorpay-webhook-secret:}") String webhookSecret,
            DynamicQrSvgService qrSvgService,
            ObjectMapper objectMapper) {
        this.sandboxMode = sandboxMode;
        this.keyId = keyId != null ? keyId.trim() : "";
        this.keySecret = keySecret != null ? keySecret.trim() : "";
        this.webhookSecret = webhookSecret != null ? webhookSecret.trim() : "";
        this.qrSvgService = qrSvgService;
        this.objectMapper = objectMapper;
    }

    @Override
    public GatewayStatus getGatewayStatus() {
        boolean keysPresent = !keyId.isBlank() && !keySecret.isBlank();
        if (keysPresent) {
            return new GatewayStatus("RAZORPAY", true, false, true, "Razorpay live/test API credentials configured.");
        }
        if (sandboxMode) {
            return new GatewayStatus("SANDBOX", false, true, true, "Running in explicitly enabled test/sandbox mode without live gateway credentials.");
        }
        return new GatewayStatus(
                "RAZORPAY",
                false,
                false,
                false,
                "Payment gateway credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are not configured. Verified SBI bank remittance remains active."
        );
    }

    @Override
    public InitiatedPayment createDynamicQrOrder(Donation donation, Instant expiresAt) {
        boolean keysPresent = !keyId.isBlank() && !keySecret.isBlank();
        if (!keysPresent) {
            if (!sandboxMode) {
                throw new ProviderUnconfiguredException(
                        "RAZORPAY",
                        "Online Payment Gateway & Dynamic UPI QR requires Razorpay API credentials in server environment configuration. Please use the verified SBI institutional bank details below."
                );
            }
            // Isolated test/sandbox deterministic dynamic UPI QR payload (never active in prod)
            String orderId = "order_sbx_" + donation.getDonationReference().replaceAll("[^A-Za-z0-9]", "");
            String qrId = "qr_sbx_" + UUID.randomUUID().toString().substring(0, 10);
            String upiUri = "upi://pay?pa=mect.sandbox@okaxis&pn="
                    + URLEncoder.encode("Mahaveer Educational & Charitable Trust", StandardCharsets.UTF_8)
                    + "&am=" + donation.getAmount().toPlainString()
                    + "&cu=INR&tr=" + URLEncoder.encode(donation.getDonationReference(), StandardCharsets.UTF_8)
                    + "&tn=" + URLEncoder.encode("MECT " + donation.getProgramme().getCode(), StandardCharsets.UTF_8);
            String qrSvg = qrSvgService.generateSvg(upiUri);
            return new InitiatedPayment("SANDBOX", orderId, qrId, upiUri, null, qrSvg, expiresAt);
        }

        try {
            long amountPaise = donation.getAmount().multiply(BigDecimal.valueOf(100)).longValueExact();
            String basicAuth = Base64.getEncoder().encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));

            Map<String, Object> orderReq = Map.of(
                    "amount", amountPaise,
                    "currency", donation.getCurrency(),
                    "receipt", donation.getDonationReference(),
                    "notes", Map.of(
                            "donation_reference", donation.getDonationReference(),
                            "programme", donation.getProgramme().getCode()
                    )
            );
            String orderResp = restClient.post()
                    .uri("https://api.razorpay.com/v1/orders")
                    .header("Authorization", "Basic " + basicAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(orderReq))
                    .retrieve()
                    .body(String.class);

            JsonNode orderJson = objectMapper.readTree(orderResp);
            String providerOrderId = orderJson.get("id").asString();

            Map<String, Object> qrReq = new LinkedHashMap<>();
            qrReq.put("type", "upi_qr");
            qrReq.put("name", "MECT " + donation.getDonationReference());
            qrReq.put("usage", "single_use");
            qrReq.put("fixed_amount", true);
            qrReq.put("payment_amount", amountPaise);
            qrReq.put("description", "Voluntary donation towards " + donation.getProgramme().getName());
            qrReq.put("close_by", expiresAt.getEpochSecond());
            qrReq.put("notes", Map.of(
                    "donation_reference", donation.getDonationReference(),
                    "order_id", providerOrderId
            ));

            String qrResp = restClient.post()
                    .uri("https://api.razorpay.com/v1/payments/qr_codes")
                    .header("Authorization", "Basic " + basicAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(qrReq))
                    .retrieve()
                    .body(String.class);

            JsonNode qrJson = objectMapper.readTree(qrResp);
            String providerQrId = qrJson.get("id").asString();
            String imageUrl = qrJson.has("image_url") ? qrJson.get("image_url").asString(null) : null;
            String upiUri = qrJson.has("qr_string") ? qrJson.get("qr_string").asString(null) : null;
            String svg = upiUri != null ? qrSvgService.generateSvg(upiUri) : "";

            log.info("Created Razorpay order={} and dynamic UPI QR={}", providerOrderId, providerQrId);
            return new InitiatedPayment("RAZORPAY", providerOrderId, providerQrId, upiUri, imageUrl, svg, expiresAt);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to initiate Razorpay payment order: " + ex.getMessage(), ex);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        return HmacCryptoUtil.verifyHmacSha256Hex(webhookSecret, payload, signatureHeader);
    }

    @Override
    public boolean verifyCheckoutSignature(String providerOrderId, String providerPaymentId, String signature) {
        if (keySecret.isBlank() || providerOrderId == null || providerPaymentId == null || signature == null) {
            return false;
        }
        return HmacCryptoUtil.verifyHmacSha256Hex(keySecret, providerOrderId + "|" + providerPaymentId, signature);
    }

    public String getKeyId() {
        return keyId;
    }
}

