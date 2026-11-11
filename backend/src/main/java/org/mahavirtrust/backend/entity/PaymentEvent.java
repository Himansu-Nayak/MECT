package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "payment_events")
public class PaymentEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "provider_event_id", nullable = false, unique = true, length = 150)
    private String providerEventId;

    @Column(name = "event_type", nullable = false, length = 80)
    private String eventType;

    @Column(name = "signature_verified", nullable = false)
    private boolean signatureVerified = false;

    @Column(name = "payload_sha256", nullable = false, length = 64)
    private String payloadSha256;

    @Column(name = "raw_payload", nullable = false, columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "processing_status", nullable = false, length = 30)
    private String processingStatus = "PROCESSED";

    @Column(name = "error_message", length = 500)
    private String errorMessage;

    @Column(name = "received_at", nullable = false, updatable = false)
    private Instant receivedAt = Instant.now();

    @Column(name = "processed_at")
    private Instant processedAt;

    public Long getId() { return id; }
    public Payment getPayment() { return payment; }
    public void setPayment(Payment payment) { this.payment = payment; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderEventId() { return providerEventId; }
    public void setProviderEventId(String providerEventId) { this.providerEventId = providerEventId; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public boolean isSignatureVerified() { return signatureVerified; }
    public void setSignatureVerified(boolean signatureVerified) { this.signatureVerified = signatureVerified; }
    public String getPayloadSha256() { return payloadSha256; }
    public void setPayloadSha256(String payloadSha256) { this.payloadSha256 = payloadSha256; }
    public String getRawPayload() { return rawPayload; }
    public void setRawPayload(String rawPayload) { this.rawPayload = rawPayload; }
    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public Instant getReceivedAt() { return receivedAt; }
    public Instant getProcessedAt() { return processedAt; }
    public void setProcessedAt(Instant processedAt) { this.processedAt = processedAt; }
}

