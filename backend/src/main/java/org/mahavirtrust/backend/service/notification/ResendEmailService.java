package org.mahavirtrust.backend.service.notification;

import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
public class ResendEmailService implements EmailProvider {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailService.class);

    private final String apiKey;
    private final String baseUrl;
    private final String webhookSecret;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public ResendEmailService(
            @Value("${app.resend.api-key:}") String apiKey,
            @Value("${app.resend.base-url:https://api.resend.com}") String baseUrl,
            @Value("${app.resend.webhook-secret:}") String webhookSecret,
            ObjectMapper objectMapper) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = baseUrl;
        this.webhookSecret = webhookSecret != null ? webhookSecret.trim() : "";
        this.objectMapper = objectMapper;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(10));
        this.restClient = RestClient.builder()
                .baseUrl(this.baseUrl)
                .requestFactory(requestFactory)
                .build();
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    @Override
    public String getProviderName() {
        return "RESEND";
    }

    @Override
    public ProviderDispatchResult sendEmail(
            String fromAddress,
            String toAddress,
            String subject,
            String htmlBody,
            byte[] attachmentBytes,
            String attachmentFilename,
            Map<String, String> tags) {

        if (!isConfigured()) {
            return ProviderDispatchResult.unconfigured("RESEND_API_KEY is not configured.");
        }

        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("from", fromAddress);
            payload.put("to", List.of(toAddress));
            payload.put("subject", subject);
            payload.put("html", htmlBody);

            if (attachmentBytes != null && attachmentBytes.length > 0 && attachmentFilename != null) {
                Map<String, String> att = new LinkedHashMap<>();
                att.put("filename", attachmentFilename);
                att.put("content", Base64.getEncoder().encodeToString(attachmentBytes));
                payload.put("attachments", List.of(att));
            }
            if (tags != null && !tags.isEmpty()) {
                List<Map<String, String>> tagList = tags.entrySet().stream()
                        .map(e -> Map.of("name", e.getKey(), "value", e.getValue()))
                        .toList();
                payload.put("tags", tagList);
            }

            String jsonBody = objectMapper.writeValueAsString(payload);
            String response = restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .header("User-Agent", "MECT-Portal-Backend/1.0")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(jsonBody)
                    .retrieve()
                    .body(String.class);

            String messageId = null;
            if (response != null && !response.isBlank()) {
                JsonNode node = objectMapper.readTree(response);
                if (node.has("id")) {
                    messageId = node.get("id").asString();
                }
            }
            log.info("Resend email dispatched successfully (messageId={})", messageId);
            return ProviderDispatchResult.sent(messageId, response);
        } catch (RestClientResponseException ex) {
            int status = ex.getStatusCode().value();
            String body = ex.getResponseBodyAsString();
            String safeCategory = switch (status) {
                case 401 -> "RESEND_INVALID_API_KEY";
                case 403 -> "RESEND_DOMAIN_OR_ACCESS_RESTRICTED";
                case 422 -> "RESEND_UNPROCESSABLE_SENDER_OR_PAYLOAD";
                case 429 -> "RESEND_RATE_LIMITED";
                default -> "RESEND_HTTP_" + status;
            };
            String truncatedBody = body != null && body.length() > 300 ? body.substring(0, 300) : body;
            log.error("Resend API error category={} httpStatus={} responseBody={}", safeCategory, status, truncatedBody);
            return ProviderDispatchResult.failed(safeCategory + " (HTTP " + status + ")");
        } catch (Exception ex) {
            String err = ex.getMessage() != null ? ex.getMessage() : "Resend transport error";
            if (err.length() > 350) {
                err = err.substring(0, 350);
            }
            log.error("Resend dispatch transport failure: {}", err);
            return ProviderDispatchResult.failed("RESEND_TRANSPORT_ERROR");
        }
    }

    @Override
    public boolean verifyWebhookSignature(String svixId, String svixTimestamp, String payload, String svixSignatureHeader) {
        if (webhookSecret.isBlank() || svixId == null || svixId.isBlank()
                || svixTimestamp == null || svixTimestamp.isBlank()
                || svixSignatureHeader == null || svixSignatureHeader.isBlank()
                || payload == null) {
            return false;
        }
        try {
            long tsSeconds = Long.parseLong(svixTimestamp.trim());
            long nowSeconds = Instant.now().getEpochSecond();
            // Svix/Resend replay protection: enforce +-300 seconds (5-minute) tolerance window
            if (Math.abs(nowSeconds - tsSeconds) > 300L) {
                log.warn("Rejected Resend webhook with expired/skewed svix-timestamp={} (now={})", tsSeconds, nowSeconds);
                return false;
            }

            byte[] keyBytes = webhookSecret.startsWith("whsec_")
                    ? Base64.getDecoder().decode(webhookSecret.substring(6))
                    : webhookSecret.getBytes(StandardCharsets.UTF_8);

            String signedContent = svixId.trim() + "." + svixTimestamp.trim() + "." + payload;
            String expectedBase64 = HmacCryptoUtil.hmacSha256Base64(keyBytes, signedContent);

            for (String token : svixSignatureHeader.split(" ")) {
                String[] parts = token.split(",", 2);
                if (parts.length == 2 && "v1".equals(parts[0].trim())) {
                    if (java.security.MessageDigest.isEqual(
                            expectedBase64.getBytes(StandardCharsets.UTF_8),
                            parts[1].trim().getBytes(StandardCharsets.UTF_8))) {
                        return true;
                    }
                }
            }
            return false;
        } catch (Exception ex) {
            return false;
        }
    }
}

