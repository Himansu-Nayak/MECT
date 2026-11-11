package org.mahavirtrust.backend.service.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
public class ConfigurableSmsService implements SmsProvider {

    private static final Logger log = LoggerFactory.getLogger(ConfigurableSmsService.class);

    private final String provider;
    private final String twilioSid;
    private final String twilioToken;
    private final String twilioFrom;
    private final String msg91Key;
    private final String msg91TemplateId;
    private final RestClient restClient = RestClient.create();

    public ConfigurableSmsService(
            @Value("${app.sms.provider:NONE}") String provider,
            @Value("${app.sms.twilio-account-sid:}") String twilioSid,
            @Value("${app.sms.twilio-auth-token:}") String twilioToken,
            @Value("${app.sms.twilio-from-number:}") String twilioFrom,
            @Value("${app.sms.msg91-auth-key:}") String msg91Key,
            @Value("${app.sms.msg91-template-id:}") String msg91TemplateId) {
        this.provider = provider != null ? provider.trim().toUpperCase() : "NONE";
        this.twilioSid = twilioSid != null ? twilioSid.trim() : "";
        this.twilioToken = twilioToken != null ? twilioToken.trim() : "";
        this.twilioFrom = twilioFrom != null ? twilioFrom.trim() : "";
        this.msg91Key = msg91Key != null ? msg91Key.trim() : "";
        this.msg91TemplateId = msg91TemplateId != null ? msg91TemplateId.trim() : "";
    }

    @Override
    public boolean isConfigured() {
        return switch (provider) {
            case "TWILIO" -> !twilioSid.isBlank() && !twilioToken.isBlank() && !twilioFrom.isBlank();
            case "MSG91" -> !msg91Key.isBlank() && !msg91TemplateId.isBlank();
            default -> false;
        };
    }

    @Override
    public String getProviderName() {
        return provider;
    }

    @Override
    public ProviderDispatchResult sendOtpSms(String phoneNumber, String otpCode, int expiryMinutes) {
        if (!isConfigured()) {
            return ProviderDispatchResult.unconfigured(
                    "Phone SMS OTP provider is not configured (SMS_PROVIDER=" + provider + "). Configure Twilio or MSG91 credentials in backend environment variables."
            );
        }

        if ("TWILIO".equals(provider)) {
            try {
                MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
                form.add("To", phoneNumber);
                form.add("From", twilioFrom);
                form.add("Body", "Your MECT verification code is " + otpCode + ". Valid for " + expiryMinutes + " minutes. Never share this code with anyone.");

                String basicAuth = Base64.getEncoder().encodeToString((twilioSid + ":" + twilioToken).getBytes(StandardCharsets.UTF_8));
                String resp = restClient.post()
                        .uri("https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json")
                        .header("Authorization", "Basic " + basicAuth)
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .body(form)
                        .retrieve()
                        .body(String.class);
                log.info("SMS OTP dispatched via Twilio");
                return ProviderDispatchResult.sent("twilio_dispatched", resp);
            } catch (Exception ex) {
                return ProviderDispatchResult.failed("Twilio SMS dispatch failed: " + ex.getMessage());
            }
        }

        if ("MSG91".equals(provider)) {
            try {
                Map<String, Object> body = Map.of(
                        "template_id", msg91TemplateId,
                        "recipients", java.util.List.of(Map.of("mobiles", phoneNumber.replace("+", ""), "var1", otpCode))
                );
                String resp = restClient.post()
                        .uri("https://control.msg91.com/api/v5/flow/")
                        .header("authkey", msg91Key)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(String.class);
                log.info("SMS OTP dispatched via MSG91");
                return ProviderDispatchResult.sent("msg91_dispatched", resp);
            } catch (Exception ex) {
                return ProviderDispatchResult.failed("MSG91 SMS dispatch failed: " + ex.getMessage());
            }
        }

        return ProviderDispatchResult.unconfigured("Unsupported SMS provider: " + provider);
    }
}

