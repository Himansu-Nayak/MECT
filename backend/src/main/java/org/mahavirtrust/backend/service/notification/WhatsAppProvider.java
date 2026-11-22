package org.mahavirtrust.backend.service.notification;

import java.util.List;

public interface WhatsAppProvider {
    boolean isConfigured();
    default String getProviderName() { return "META_WHATSAPP_CLOUD"; }
    ProviderDispatchResult sendTemplateMessage(
            String toPhone,
            String templateName,
            String languageCode,
            List<String> bodyParameters
    );
    boolean verifyWebhookSignature(String payload, String signatureHeader);

    default boolean isEnabled() { return isConfigured(); }
    default String getPhoneNumberId() { return ""; }
    default String getBusinessAccountId() { return ""; }
    default String getApiVersion() { return "v21.0"; }
    default String getWebhookVerifyToken() { return ""; }
    default String getMaskedToken() { return "CONFIGURED"; }
}
