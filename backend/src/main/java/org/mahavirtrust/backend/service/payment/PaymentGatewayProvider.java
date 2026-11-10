package org.mahavirtrust.backend.service.payment;

import org.mahavirtrust.backend.entity.Donation;

import java.time.Instant;

public interface PaymentGatewayProvider {
    record GatewayStatus(
            String provider,
            boolean configured,
            boolean sandboxMode,
            boolean dynamicQrSupported,
            String reason
    ) {}

    record InitiatedPayment(
            String provider,
            String providerOrderId,
            String providerQrId,
            String upiUri,
            String qrImageUrl,
            String qrSvg,
            Instant expiresAt
    ) {}

    GatewayStatus getGatewayStatus();
    InitiatedPayment createDynamicQrOrder(Donation donation, Instant expiresAt);
    boolean verifyWebhookSignature(String payload, String signatureHeader);
    boolean verifyCheckoutSignature(String providerOrderId, String providerPaymentId, String signature);
}

