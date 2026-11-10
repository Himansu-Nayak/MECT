package org.mahavirtrust.backend.dto.portal;

import jakarta.validation.constraints.NotNull;

public record UpdateNotificationPreferencesRequest(
        @NotNull Boolean emailReceiptsEnabled,
        @NotNull Boolean emailUpdatesEnabled,
        @NotNull Boolean whatsappOptIn,
        String whatsappPhoneNumber,
        String consentVersion
) {}

