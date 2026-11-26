package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.*;

@Primary
@Component
public class WhatsAppCloudApiClient implements WhatsAppProvider {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppCloudApiClient.class);

    private final boolean enabled;
    private final String provider;
    private final String apiVersion;
    private final String phoneNumberId;
    private final String businessAccountId;
    private final String accessToken;
    private final String appSecret;
    private final String webhookVerifyToken;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public WhatsAppCloudApiClient(
            @Value("${app.whatsapp.enabled:false}") boolean enabled,
            @Value("${app.whatsapp.provider:META_CLOUD}") String provider,
            @Value("${app.whatsapp.api-version:v21.0}") String apiVersion,
            @Value("${app.whatsapp.phone-number-id:}") String phoneNumberId,
            @Value("${app.whatsapp.business-account-id:}") String businessAccountId,
            @Value("${app.whatsapp.access-token:}") String accessToken,
            @Value("${app.whatsapp.app-secret:}") String appSecret,
            @Value("${app.whatsapp.verify-token:}") String webhookVerifyToken,
            ObjectMapper objectMapper) {
        this.enabled = enabled;
        this.provider = provider != null ? provider.trim().toUpperCase() : "META_CLOUD";
        this.apiVersion = apiVersion != null && !apiVersion.isBlank() ? apiVersion.trim() : "v21.0";
        this.phoneNumberId = phoneNumberId != null ? phoneNumberId.trim() : "";
        this.businessAccountId = businessAccountId != null ? businessAccountId.trim() : "";
        this.accessToken = accessToken != null ? accessToken.trim() : "";
        this.appSecret = appSecret != null ? appSecret.trim() : "";
        this.webhookVerifyToken = webhookVerifyToken != null ? webhookVerifyToken.trim() : "";
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(10));
        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    @Override
    public boolean isConfigured() {
        return enabled && "META_CLOUD".equals(provider) && !phoneNumberId.isBlank() && !accessToken.isBlank();
    }

    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String getProviderName() {
        return "META_CLOUD";
    }

    public String getPhoneNumberId() {
        return phoneNumberId;
    }

    public String getBusinessAccountId() {
        return businessAccountId;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public String getWebhookVerifyToken() {
        return webhookVerifyToken;
    }

    public String getMaskedToken() {
        if (accessToken == null || accessToken.isBlank()) {
            return "NOT_CONFIGURED";
        }
        if (accessToken.length() <= 8) {
            return "********";
        }
        return accessToken.substring(0, 4) + "..." + accessToken.substring(accessToken.length() - 4);
    }

    public static String sanitizePhoneNumber(String phone) {
        if (phone == null) {
            return "";
        }
        String digits = phone.replaceAll("[^0-9]", "");
        // If 10-digit standard Indian mobile number, prefix country code 91
        if (digits.length() == 10 && (digits.startsWith("6") || digits.startsWith("7") || digits.startsWith("8") || digits.startsWith("9"))) {
            digits = "91" + digits;
        }
        return digits;
    }

    @Override
    public ProviderDispatchResult sendTemplateMessage(
            String toPhone,
            String templateName,
            String languageCode,
            List<String> bodyParameters) {

        if (!isConfigured()) {
            return ProviderDispatchResult.unconfigured(
                    "WhatsApp Business Cloud API is disabled or unconfigured (WHATSAPP_ENABLED=true, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN required)."
            );
        }

        if (templateName == null || templateName.isBlank()) {
            return ProviderDispatchResult.templateRequired(
                    "Meta WhatsApp template name is missing or unapproved."
            );
        }

        String recipientPhone = sanitizePhoneNumber(toPhone);
        if (recipientPhone.length() < 10) {
            return ProviderDispatchResult.failed("Invalid recipient phone number format: " + toPhone);
        }

        try {
            List<Map<String, Object>> params = (bodyParameters != null ? bodyParameters : Collections.<String>emptyList())
                    .stream()
                    .map(val -> Map.<String, Object>of("type", "text", "text", val != null ? val : ""))
                    .toList();

            Map<String, Object> templateMap = new LinkedHashMap<>();
            templateMap.put("name", templateName);
            templateMap.put("language", Map.of("code", languageCode != null && !languageCode.isBlank() ? languageCode : "en"));

            if (!params.isEmpty()) {
                templateMap.put("components", List.of(Map.of("type", "body", "parameters", params)));
            }

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("recipient_type", "individual");
            body.put("to", recipientPhone);
            body.put("type", "template");
            body.put("template", templateMap);

            String url = "https://graph.facebook.com/" + apiVersion + "/" + phoneNumberId + "/messages";
            String response = restClient.post()
                    .uri(url)
                    .header("Authorization", "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(objectMapper.writeValueAsString(body))
                    .retrieve()
                    .body(String.class);

            String messageId = null;
            if (response != null) {
                JsonNode root = objectMapper.readTree(response);
                if (root.has("messages") && root.get("messages").isArray() && !root.get("messages").isEmpty()) {
                    messageId = root.get("messages").get(0).path("id").asString(null);
                }
            }

            log.info("WhatsApp Cloud API dispatch successful to {} [template={}, wamid={}]",
                    recipientPhone.replaceAll("\\d(?=\\d{4})", "*"), templateName, messageId);

            return ProviderDispatchResult.sent(messageId, response);
        } catch (org.springframework.web.client.RestClientResponseException ex) {
            String respBody = ex.getResponseBodyAsString();
            String err = ex.getStatusCode() + ": " + (respBody != null && !respBody.isBlank() ? respBody : ex.getMessage());
            log.warn("WhatsApp Cloud API HTTP error {} dispatching to {}: {}",
                    ex.getStatusCode(), recipientPhone.replaceAll("\\d(?=\\d{4})", "*"), err);
            if (err.length() > 450) {
                err = err.substring(0, 450);
            }
            if (ex.getStatusCode().value() == 400 && respBody != null && respBody.toLowerCase().contains("template")) {
                return ProviderDispatchResult.templateRequired(err);
            }
            return ProviderDispatchResult.failed(err);
        } catch (Exception ex) {
            String err = ex.getMessage() != null ? ex.getMessage() : "WhatsApp dispatch failure";
            log.warn("WhatsApp Cloud API dispatch failed to {}: {}",
                    recipientPhone.replaceAll("\\d(?=\\d{4})", "*"), err);
            if (err.length() > 450) {
                err = err.substring(0, 450);
            }
            return ProviderDispatchResult.failed(err);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        if (appSecret == null || appSecret.isBlank()) {
            log.warn("WhatsApp app secret not configured; unable to verify webhook signature.");
            return false;
        }
        return HmacCryptoUtil.verifyHmacSha256Hex(appSecret, payload, signatureHeader);
    }
}
