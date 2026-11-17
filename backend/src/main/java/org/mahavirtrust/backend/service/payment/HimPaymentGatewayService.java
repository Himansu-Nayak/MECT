package org.mahavirtrust.backend.service.payment;

import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.PaymentConfiguration;
import org.mahavirtrust.backend.repository.PaymentConfigurationRepository;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.UUID;

@Service("himGateway")
public class HimPaymentGatewayService implements PaymentGatewayProvider {

    private static final Logger log = LoggerFactory.getLogger(HimPaymentGatewayService.class);

    private final DynamicQrSvgService qrSvgService;
    private final PaymentConfigurationRepository configRepository;
    private final String defaultUpiId;
    private final String defaultMerchantName;
    private final String webhookSecret;
    private final boolean productionEnabled;

    public HimPaymentGatewayService(
            DynamicQrSvgService qrSvgService,
            PaymentConfigurationRepository configRepository,
            @Value("${app.payment.him.upi-id:86971610172@sbi}") String defaultUpiId,
            @Value("${app.payment.him.merchant-name:MAHAVEER EDUCATIONAL & CHARITABLE TRUST}") String defaultMerchantName,
            @Value("${app.payment.him.webhook-secret:}") String webhookSecret,
            @Value("${app.payment.him.production-enabled:false}") boolean productionEnabled) {
        this.qrSvgService = qrSvgService;
        this.configRepository = configRepository;
        this.defaultUpiId = defaultUpiId != null ? defaultUpiId.trim() : "86971610172@sbi";
        this.defaultMerchantName = defaultMerchantName != null ? defaultMerchantName.trim() : "MAHAVEER EDUCATIONAL & CHARITABLE TRUST";
        this.webhookSecret = webhookSecret != null ? webhookSecret.trim() : "";
        this.productionEnabled = productionEnabled;
    }

    @Override
    public GatewayStatus getGatewayStatus() {
        PaymentConfiguration cfg = configRepository.findById(1L).orElse(null);
        boolean enabled = cfg != null ? cfg.isHimEnabled() : productionEnabled;
        return new GatewayStatus(
                "HIM",
                true,
                !productionEnabled,
                true,
                enabled ? "HIM Manual UPI Gateway active" : "HIM Gateway configured (Staging/Manual mode)",
                "DYNAMIC_QR",
                productionEnabled ? "production" : "staging"
        );
    }

    @Override
    public InitiatedPayment createDynamicQrOrder(Donation donation, Instant expiresAt) {
        PaymentConfiguration cfg = configRepository.findById(1L).orElse(null);
        String upiId = (cfg != null && cfg.getHimUpiId() != null && !cfg.getHimUpiId().isBlank())
                ? cfg.getHimUpiId().trim()
                : defaultUpiId;
        String merchantName = (cfg != null && cfg.getHimMerchantName() != null && !cfg.getHimMerchantName().isBlank())
                ? cfg.getHimMerchantName().trim()
                : defaultMerchantName;

        String orderId = "HIM-ORD-" + donation.getDonationReference() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String qrId = "HIM-QR-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        // Standard NPCI UPI URI specifications
        String encMerchant = URLEncoder.encode(merchantName, StandardCharsets.UTF_8);
        String encNote = URLEncoder.encode("MECT " + donation.getDonationReference(), StandardCharsets.UTF_8);
        String upiUri = String.format(
                "upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tn=%s&tr=%s",
                upiId,
                encMerchant,
                donation.getAmount().toPlainString(),
                encNote,
                donation.getDonationReference()
        );

        String qrSvg = qrSvgService.generateSvg(upiUri);

        return new InitiatedPayment(
                "HIM",
                orderId,
                qrId,
                upiUri,
                null,
                qrSvg,
                expiresAt,
                null,
                null,
                productionEnabled ? "production" : "staging"
        );
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            return false;
        }
        String secret = (configRepository.findById(1L).map(PaymentConfiguration::getHimWebhookSecret).orElse(""));
        if (secret.isBlank()) {
            secret = this.webhookSecret;
        }
        if (secret.isBlank()) {
            log.warn("[HIM Gateway] Webhook secret not configured. Signature verification failed.");
            return false;
        }
        return HmacCryptoUtil.verifyHmacSha256Hex(secret, payload, signatureHeader);
    }

    @Override
    public boolean verifyCheckoutSignature(String providerOrderId, String providerPaymentId, String signature) {
        // HIM manual verification uses banking officer verification
        return true;
    }
}

