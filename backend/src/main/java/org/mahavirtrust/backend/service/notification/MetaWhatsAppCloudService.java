package org.mahavirtrust.backend.service.notification;

import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class MetaWhatsAppCloudService implements WhatsAppProvider {

    private static final Logger log = LoggerFactory.getLogger(MetaWhatsAppCloudService.class);

    private final String provider;
    private final String apiVersion;
    private final String phoneNumberId;
    private final String accessToken;
    private final String appSecret;
    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.create();

    public MetaWhatsAppCloudService(
            @Value("${app.whatsapp.provider:NONE}") String provider,
            @Value("${app.whatsapp.api-version:v21.0}") String apiVersion,
            @Value("${app.whatsapp.phone-number-id:}") String phoneNumberId,
            @Value("${app.whatsapp.access-token:}") String accessToken,
            @Value("${app.whatsapp.app-secret:}") String appSecret,
            ObjectMapper objectMapper) {
        this.provider = provider != null ? provider.trim().toUpperCase() : "NONE";
        this.apiVersion = apiVersion;
        this.phoneNumberId = phoneNumberId != null ? phoneNumberId.trim() : "";
        this.accessToken = accessToken != null ? accessToken.trim() : "";
        this.appSecret = appSecret != null ? appSecret.trim() : "";
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isConfigured() {
        return "META_CLOUD".equals(provider) && !phoneNumberId.isBlank() && !accessToken.isBlank();
    }

    @Override
    public String getProviderName() {
        return provider;
    }

    @Override
    public ProviderDispatchResult sendTemplateMessage(
            String toPhone,
            String templateName,
            String languageCode,
            List<String> bodyParameters) {

        if (!isConfigured()) {
            return ProviderDispatchResult.unconfigured(
                    "WhatsApp Business Cloud API credentials (WHATSAPP_PROVIDER=META_CLOUD, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN) are not configured."
            );
        }

        if (templateName == null || templateName.isBlank()) {
            return ProviderDispatchResult.templateRequired(
                    "Approved Meta WhatsApp template name is not configured in environment variables."
            );
        }

        try {
            List<Map<String, Object>> params = bodyParameters.stream()
                    .map(val -> Map.<String, Object>of("type", "text", "text", val))
                    .toList();

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("messaging_product", "whatsapp");
            body.put("to", toPhone.replaceAll("[^0-9]", ""));
            body.put("type", "template");
            body.put("template", Map.of(
                    "name", templateName,
                    "language", Map.of("code", languageCode != null ? languageCode : "en"),
                    "components", List.of(Map.of("type", "body", "parameters", params))
            ));

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
            log.info("WhatsApp template message sent (messageId={})", messageId);
            return ProviderDispatchResult.sent(messageId, response);
        } catch (Exception ex) {
            String err = ex.getMessage() != null ? ex.getMessage() : "WhatsApp dispatch failure";
            if (err.length() > 450) {
                err = err.substring(0, 450);
            }
            return ProviderDispatchResult.failed(err);
        }
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        return HmacCryptoUtil.verifyHmacSha256Hex(appSecret, payload, signatureHeader);
    }
}

