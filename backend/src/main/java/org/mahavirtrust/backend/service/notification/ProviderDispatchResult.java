package org.mahavirtrust.backend.service.notification;

public record ProviderDispatchResult(
        String status, // SENT, REQUIRES_PROVIDER_CONFIG, REQUIRES_TEMPLATE_APPROVAL, FAILED
        String providerMessageId,
        String rawResponse,
        String errorMessage
) {
    public static ProviderDispatchResult sent(String messageId, String rawResponse) {
        return new ProviderDispatchResult("SENT", messageId, rawResponse, null);
    }

    public static ProviderDispatchResult unconfigured(String reason) {
        return new ProviderDispatchResult("REQUIRES_PROVIDER_CONFIG", null, reason, reason);
    }

    public static ProviderDispatchResult templateRequired(String reason) {
        return new ProviderDispatchResult("REQUIRES_TEMPLATE_APPROVAL", null, reason, reason);
    }

    public static ProviderDispatchResult failed(String error) {
        return new ProviderDispatchResult("FAILED", null, error, error);
    }
}

