package org.mahavirtrust.backend.service.notification;

import java.util.Map;

public interface EmailProvider {
    boolean isConfigured();
    String getProviderName();
    ProviderDispatchResult sendEmail(
            String fromAddress,
            String toAddress,
            String subject,
            String htmlBody,
            byte[] attachmentBytes,
            String attachmentFilename,
            Map<String, String> tags
    );
    boolean verifyWebhookSignature(String svixId, String svixTimestamp, String payload, String svixSignatureHeader);
}

