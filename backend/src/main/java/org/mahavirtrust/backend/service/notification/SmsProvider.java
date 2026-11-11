package org.mahavirtrust.backend.service.notification;

public interface SmsProvider {
    boolean isConfigured();
    String getProviderName();
    ProviderDispatchResult sendOtpSms(String phoneNumber, String otpCode, int expiryMinutes);
}

