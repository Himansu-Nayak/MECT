package org.mahavirtrust.backend.service.notification;

import java.util.List;

public interface WhatsAppProvider {
    boolean isConfigured();
    String getProviderName();
    ProviderDispatchResult sendTemplateMessage(
            String toPhone,
            String templateName,
            String languageCode,
            List<String> bodyParameters
    );
    boolean verifyWebhookSignature(String payload, String signatureHeader);
}

