package org.mahavirtrust.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.entity.WhatsAppMessageLog;
import org.mahavirtrust.backend.entity.WhatsAppWebhookEvent;
import org.mahavirtrust.backend.repository.WhatsAppMessageLogRepository;
import org.mahavirtrust.backend.repository.WhatsAppWebhookEventRepository;
import org.mahavirtrust.backend.service.notification.whatsapp.WhatsAppCloudApiClient;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WhatsAppWebhookSecurityTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private WhatsAppMessageLogRepository messageLogRepository;
    @Autowired private WhatsAppWebhookEventRepository webhookEventRepository;

    @Value("${app.whatsapp.verify-token:}")
    private String configuredVerifyToken;

    @Value("${app.whatsapp.app-secret:}")
    private String configuredAppSecret;

    @Test
    @DisplayName("GET /webhooks/whatsapp verifies challenge with matching verify token")
    void testGetWebhookChallengeVerificationSuccess() throws Exception {
        String token = configuredVerifyToken != null && !configuredVerifyToken.isBlank()
                ? configuredVerifyToken : "test_token";
        String challenge = "challenge_token_abc123";

        mockMvc.perform(get("/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", token)
                        .param("hub.challenge", challenge))
                .andExpect(status().isOk())
                .andExpect(content().string(challenge));
    }

    @Test
    @DisplayName("GET /webhooks/whatsapp rejects invalid verify token with 403 Forbidden")
    void testGetWebhookChallengeVerificationFailure() throws Exception {
        mockMvc.perform(get("/webhooks/whatsapp")
                        .param("hub.mode", "subscribe")
                        .param("hub.verify_token", "completely_wrong_verify_token")
                        .param("hub.challenge", "challenge_abc"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /webhooks/whatsapp rejects requests with missing or invalid signature")
    void testPostWebhookInvalidSignature() throws Exception {
        String payload = "{\"entry\":[{\"id\":\"123\",\"changes\":[]}]}";

        mockMvc.perform(post("/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Hub-Signature-256", "sha256=invalid000000000000000000000000000000000000000000000000000000000000")
                        .content(payload))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /webhooks/whatsapp processes status callback and updates message log")
    void testPostWebhookStatusCallback() throws Exception {
        String secret = configuredAppSecret != null && !configuredAppSecret.isBlank()
                ? configuredAppSecret : "mect-test-whatsapp-secret-default";

        String testWamid = "wamid.HBgLMjAyNjExMjJBQUFB" + System.currentTimeMillis();

        // Seed an existing message log entry
        WhatsAppMessageLog logEntry = new WhatsAppMessageLog();
        logEntry.setWamid(testWamid);
        logEntry.setRecipientPhone("919876543210");
        logEntry.setRecipientType("DONOR");
        logEntry.setTemplateName("mect_donation_receipt");
        logEntry.setEventType("DONATION_CONFIRMED_WHATSAPP");
        logEntry.setStatus("SENT");
        messageLogRepository.save(logEntry);

        String payload = """
                {
                  "object": "whatsapp_business_account",
                  "entry": [
                    {
                      "id": "100000001",
                      "changes": [
                        {
                          "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                              "display_phone_number": "919876543210",
                              "phone_number_id": "10987654321"
                            },
                            "statuses": [
                              {
                                "id": "%s",
                                "status": "delivered",
                                "timestamp": "1732300000",
                                "recipient_id": "919876543210"
                              }
                            ]
                          },
                          "field": "messages"
                        }
                      ]
                    }
                  ]
                }
                """.formatted(testWamid);

        String signature = "sha256=" + HmacCryptoUtil.hmacSha256Hex(secret, payload);

        mockMvc.perform(post("/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Hub-Signature-256", signature)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECORDED"));

        // Verify status was updated in message logs
        WhatsAppMessageLog updated = messageLogRepository.findByWamid(testWamid).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getStatus()).isEqualTo("DELIVERED");
        assertThat(updated.getDeliveredAt()).isNotNull();

        // Verify idempotency: re-posting the same payload does not throw an error
        mockMvc.perform(post("/webhooks/whatsapp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Hub-Signature-256", signature)
                        .content(payload))
                .andExpect(status().isOk());
    }
}
