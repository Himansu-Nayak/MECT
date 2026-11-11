package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notification_outbox")
public class NotificationOutbox {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_key", nullable = false, unique = true, length = 160)
    private String eventKey;

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType;

    @Column(name = "portal_user_id")
    private Long portalUserId;

    @Column(name = "donation_id")
    private Long donationId;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(nullable = false, length = 255)
    private String recipient;

    @Column(name = "sender_identity", nullable = false, length = 255)
    private String senderIdentity;

    @Column(length = 255)
    private String subject;

    @Column(name = "template_code", nullable = false, length = 80)
    private String templateCode;

    @Column(name = "payload_json", nullable = false, columnDefinition = "TEXT")
    private String payloadJson;

    @Column(name = "attachment_receipt_id")
    private Long attachmentReceiptId;

    @Column(nullable = false, length = 35)
    private String status = "QUEUED";

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    @Column(name = "max_retries", nullable = false)
    private int maxRetries = 3;

    @Column(name = "next_retry_at")
    private Instant nextRetryAt;

    @Column(name = "provider_message_id", length = 150)
    private String providerMessageId;

    @Column(name = "last_error", length = 500)
    private String lastError;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    public void onUpdate() { this.updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getEventKey() { return eventKey; }
    public void setEventKey(String eventKey) { this.eventKey = eventKey; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public Long getPortalUserId() { return portalUserId; }
    public void setPortalUserId(Long portalUserId) { this.portalUserId = portalUserId; }
    public Long getDonationId() { return donationId; }
    public void setDonationId(Long donationId) { this.donationId = donationId; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    public String getSenderIdentity() { return senderIdentity; }
    public void setSenderIdentity(String senderIdentity) { this.senderIdentity = senderIdentity; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getTemplateCode() { return templateCode; }
    public void setTemplateCode(String templateCode) { this.templateCode = templateCode; }
    public String getPayloadJson() { return payloadJson; }
    public void setPayloadJson(String payloadJson) { this.payloadJson = payloadJson; }
    public Long getAttachmentReceiptId() { return attachmentReceiptId; }
    public void setAttachmentReceiptId(Long attachmentReceiptId) { this.attachmentReceiptId = attachmentReceiptId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getRetryCount() { return retryCount; }
    public void setRetryCount(int retryCount) { this.retryCount = retryCount; }
    public int getMaxRetries() { return maxRetries; }
    public void setMaxRetries(int maxRetries) { this.maxRetries = maxRetries; }
    public Instant getNextRetryAt() { return nextRetryAt; }
    public void setNextRetryAt(Instant nextRetryAt) { this.nextRetryAt = nextRetryAt; }
    public String getProviderMessageId() { return providerMessageId; }
    public void setProviderMessageId(String providerMessageId) { this.providerMessageId = providerMessageId; }
    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

