package org.mahavirtrust.backend;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.service.notification.ProviderDispatchResult;
import org.mahavirtrust.backend.service.notification.whatsapp.WhatsAppCloudApiClient;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class WhatsAppCloudApiClientTests {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Phone sanitization converts 10-digit Indian numbers to E.164 without plus")
    void testPhoneSanitizationStandardIndian() {
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("9876543210")).isEqualTo("919876543210");
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("7008123456")).isEqualTo("917008123456");
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("8123456789")).isEqualTo("918123456789");
    }

    @Test
    @DisplayName("Phone sanitization removes plus signs, spaces, hyphens and non-digits")
    void testPhoneSanitizationFormattingChars() {
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("+91 98765-43210")).isEqualTo("919876543210");
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("+91 (987) 654-3210")).isEqualTo("919876543210");
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber("91-9876543210")).isEqualTo("919876543210");
        assertThat(WhatsAppCloudApiClient.sanitizePhoneNumber(null)).isEqualTo("");
    }

    @Test
    @DisplayName("isConfigured returns false when disabled or credentials missing")
    void testIsConfiguredFalseWhenDisabled() {
        WhatsAppCloudApiClient client = new WhatsAppCloudApiClient(
                false, "META_CLOUD", "v21.0", "123456", "biz123", "token123", "secret123", "verify123", objectMapper
        );
        assertThat(client.isConfigured()).isFalse();

        WhatsAppCloudApiClient missingToken = new WhatsAppCloudApiClient(
                true, "META_CLOUD", "v21.0", "123456", "biz123", "", "secret123", "verify123", objectMapper
        );
        assertThat(missingToken.isConfigured()).isFalse();

        WhatsAppCloudApiClient missingPhoneId = new WhatsAppCloudApiClient(
                true, "META_CLOUD", "v21.0", "", "biz123", "token123", "secret123", "verify123", objectMapper
        );
        assertThat(missingPhoneId.isConfigured()).isFalse();
    }

    @Test
    @DisplayName("isConfigured returns true when enabled and required Meta credentials provided")
    void testIsConfiguredTrueWhenValid() {
        WhatsAppCloudApiClient client = new WhatsAppCloudApiClient(
                true, "META_CLOUD", "v21.0", "10987654321", "biz123", "EAABxxxxxxx", "secret123", "verify123", objectMapper
        );
        assertThat(client.isConfigured()).isTrue();
        assertThat(client.getProviderName()).isEqualTo("META_CLOUD");
        assertThat(client.getPhoneNumberId()).isEqualTo("10987654321");
    }

    @Test
    @DisplayName("Masked token never exposes full secret in logs or status responses")
    void testMaskedTokenSecurity() {
        WhatsAppCloudApiClient client = new WhatsAppCloudApiClient(
                true, "META_CLOUD", "v21.0", "10987654321", "biz123", "EAABw1234567890zzyyxx", "secret123", "verify123", objectMapper
        );
        String masked = client.getMaskedToken();
        assertThat(masked).startsWith("EAAB...");
        assertThat(masked).endsWith("yyxx");
        assertThat(masked).doesNotContain("1234567890");
    }

    @Test
    @DisplayName("HMAC SHA-256 signature verification validates authentic Meta webhook payloads")
    void testWebhookSignatureVerification() {
        String appSecret = "test-meta-app-secret-12345";
        WhatsAppCloudApiClient client = new WhatsAppCloudApiClient(
                true, "META_CLOUD", "v21.0", "10987654321", "biz123", "token123", appSecret, "verify123", objectMapper
        );

        String payload = "{\"entry\":[{\"id\":\"10987654321\",\"changes\":[]}]}";
        String validSig = "sha256=" + HmacCryptoUtil.hmacSha256Hex(appSecret, payload);

        assertThat(client.verifyWebhookSignature(payload, validSig)).isTrue();
        assertThat(client.verifyWebhookSignature(payload, "sha256=invalidhex0000000000")).isFalse();
        assertThat(client.verifyWebhookSignature("{\"tampered\":true}", validSig)).isFalse();
    }

    @Test
    @DisplayName("Unconfigured client returns clean status without throwing unhandled exceptions")
    void testUnconfiguredDispatchFailsGracefully() {
        WhatsAppCloudApiClient client = new WhatsAppCloudApiClient(
                false, "NONE", "v21.0", "", "", "", "", "", objectMapper
        );
        ProviderDispatchResult result = client.sendTemplateMessage(
                "9876543210", "mect_donation_receipt", "en", List.of("Donor", "1000")
        );
        assertThat(result.status()).isEqualTo("REQUIRES_PROVIDER_CONFIG");
    }
}
