package org.mahavirtrust.backend.service.payment;

import org.mahavirtrust.backend.entity.Donation;

import java.time.Instant;

public interface PaymentGatewayProvider {
    record GatewayStatus(
            String provider,
            boolean configured,
            boolean sandboxMode,
            boolean dynamicQrSupported,
            String reason,
            String checkoutMode,
            String checkoutEnvironment
    ) {
        public GatewayStatus(
                String provider,
                boolean configured,
                boolean sandboxMode,
                boolean dynamicQrSupported,
                String reason
        ) {
            this(
                    provider,
                    configured,
                    sandboxMode,
                    dynamicQrSupported,
                    reason,
                    dynamicQrSupported ? "DYNAMIC_QR" : "CHECKOUT",
                    sandboxMode ? "sandbox" : "production"
            );
        }
    }

    record InitiatedPayment(
            String provider,
            String providerOrderId,
            String providerQrId,
            String upiUri,
            String qrImageUrl,
            String qrSvg,
            Instant expiresAt,
            String cfOrderId,
            String paymentSessionId,
            String checkoutEnvironment
    ) {
        public InitiatedPayment(
                String provider,
                String providerOrderId,
                String providerQrId,
                String upiUri,
                String qrImageUrl,
                String qrSvg,
                Instant expiresAt
        ) {
            this(provider, providerOrderId, providerQrId, upiUri, qrImageUrl, qrSvg, expiresAt, null, null, null);
        }
    }

    GatewayStatus getGatewayStatus();
    InitiatedPayment createDynamicQrOrder(Donation donation, Instant expiresAt);
    boolean verifyWebhookSignature(String payload, String signatureHeader);
    boolean verifyCheckoutSignature(String providerOrderId, String providerPaymentId, String signature);
}
