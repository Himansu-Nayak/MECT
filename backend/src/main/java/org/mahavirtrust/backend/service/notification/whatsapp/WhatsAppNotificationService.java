package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.Donation;
import org.mahavirtrust.backend.entity.DonationReceipt;
import org.mahavirtrust.backend.entity.NotificationOutbox;
import org.mahavirtrust.backend.entity.WhatsAppRecipient;
import org.mahavirtrust.backend.repository.NotificationOutboxRepository;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WhatsAppNotificationService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppNotificationService.class);

    private final WhatsAppProvider whatsAppProvider;
    private final NotificationRecipientService recipientService;
    private final NotificationTemplateService templateService;
    private final DonorMessagingPreferenceService consentService;
    private final WhatsAppMessageLogService logService;
    private final NotificationOutboxRepository outboxRepository;
    private final NotificationOutboxService outboxService;
    private final ObjectMapper objectMapper;

    private final String adminAlertTemplate;
    private final String donorReceiptTemplate;
    private final String pendingTemplate;
    private final String verifiedTemplate;
    private final String rejectedTemplate;
    private final String publicBaseUrl;

    public WhatsAppNotificationService(
            WhatsAppProvider whatsAppProvider,
            NotificationRecipientService recipientService,
            NotificationTemplateService templateService,
            DonorMessagingPreferenceService consentService,
            WhatsAppMessageLogService logService,
            NotificationOutboxRepository outboxRepository,
            NotificationOutboxService outboxService,
            ObjectMapper objectMapper,
            @Value("${app.whatsapp.admin-template:mect_donation_admin_alert}") String adminAlertTemplate,
            @Value("${app.whatsapp.donor-receipt-template:mect_donation_receipt}") String donorReceiptTemplate,
            @Value("${app.whatsapp.pending-template:mect_donation_pending}") String pendingTemplate,
            @Value("${app.whatsapp.verified-template:mect_donation_verified}") String verifiedTemplate,
            @Value("${app.whatsapp.rejected-template:mect_donation_rejected}") String rejectedTemplate,
            @Value("${app.resend.public-base-url:https://mect.org.in}") String publicBaseUrl) {
        this.whatsAppProvider = whatsAppProvider;
        this.recipientService = recipientService;
        this.templateService = templateService;
        this.consentService = consentService;
        this.logService = logService;
        this.outboxRepository = outboxRepository;
        this.outboxService = outboxService;
        this.objectMapper = objectMapper;
        this.adminAlertTemplate = adminAlertTemplate;
        this.donorReceiptTemplate = donorReceiptTemplate;
        this.pendingTemplate = pendingTemplate;
        this.verifiedTemplate = verifiedTemplate;
        this.rejectedTemplate = rejectedTemplate;
        this.publicBaseUrl = publicBaseUrl != null ? publicBaseUrl : "https://mect.org.in";
    }

    /**
     * Notify administrators when ANY donation is confirmed (Cashfree, Razorpay, or Direct).
     */
    @Transactional
    public void notifyAdminsOnDonation(Donation donation, String paymentMode, String referenceNumber) {
        List<WhatsAppRecipient> admins = recipientService.getActiveRecipientsForEvent("DONATION");
        String programmeName = donation.getProgramme() != null ? donation.getProgramme().getName() : "General Fund";

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("payment_mode", paymentMode != null ? paymentMode : "DIRECT");
        params.put("reference_number", referenceNumber != null ? referenceNumber : donation.getDonationReference());
        params.put("campaign_name", programmeName);

        List<String> bodyParams = templateService.buildParameters("mect_donation_admin_alert", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("payment_mode"),
                    params.get("reference_number"),
                    params.get("campaign_name")
            );
        }

        for (WhatsAppRecipient admin : admins) {
            String eventKey = "WA_ADMIN_DONATION_" + donation.getId() + "_" + admin.getPhoneNumber();
            enqueueWhatsAppOutbox(
                    eventKey,
                    "DONATION_CONFIRMED_ADMIN_ALERT",
                    null,
                    donation.getId(),
                    admin.getPhoneNumber(),
                    "ADMIN",
                    adminAlertTemplate,
                    bodyParams,
                    donation
            );
        }
    }

    /**
     * Notify administrators when a manual bank transfer / UPI claim is submitted.
     */
    @Transactional
    public void notifyAdminsOnClaim(Donation donation, String utr) {
        List<WhatsAppRecipient> admins = recipientService.getActiveRecipientsForEvent("CLAIM");
        String programmeName = donation.getProgramme() != null ? donation.getProgramme().getName() : "General Fund";

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("payment_mode", "SBI_DIRECT_CLAIM");
        params.put("reference_number", utr != null ? utr : donation.getDonationReference());
        params.put("campaign_name", programmeName);

        List<String> bodyParams = templateService.buildParameters("mect_donation_admin_alert", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("payment_mode"),
                    params.get("reference_number"),
                    params.get("campaign_name")
            );
        }

        for (WhatsAppRecipient admin : admins) {
            String eventKey = "WA_ADMIN_CLAIM_" + donation.getId() + "_" + admin.getPhoneNumber();
            enqueueWhatsAppOutbox(
                    eventKey,
                    "CLAIM_SUBMITTED_ADMIN_ALERT",
                    null,
                    donation.getId(),
                    admin.getPhoneNumber(),
                    "ADMIN",
                    adminAlertTemplate,
                    bodyParams,
                    donation
            );
        }
    }

    /**
     * Notify administrators when a refund occurs.
     */
    @Transactional
    public void notifyAdminsOnRefund(Donation donation, String refundRef, BigDecimal refundAmount) {
        List<WhatsAppRecipient> admins = recipientService.getActiveRecipientsForEvent("REFUND");
        String programmeName = donation.getProgramme() != null ? donation.getProgramme().getName() : "General Fund";

        List<String> bodyParams = List.of(
                donation.getDonorName(),
                refundAmount != null ? refundAmount.toPlainString() : donation.getAmount().toPlainString(),
                "REFUND",
                refundRef != null ? refundRef : donation.getDonationReference(),
                programmeName
        );

        for (WhatsAppRecipient admin : admins) {
            String eventKey = "WA_ADMIN_REFUND_" + donation.getId() + "_" + admin.getPhoneNumber();
            enqueueWhatsAppOutbox(
                    eventKey,
                    "DONATION_REFUNDED_ADMIN_ALERT",
                    null,
                    donation.getId(),
                    admin.getPhoneNumber(),
                    "ADMIN",
                    adminAlertTemplate,
                    bodyParams,
                    donation
            );
        }
    }

    /**
     * Notify donor when donation is confirmed (with receipt details), IF opted in.
     */
    @Transactional
    public void notifyDonorOnDonation(Donation donation, DonationReceipt receipt) {
        if (!hasDonorOptedIn(donation)) return;

        String phone = donation.getDonorPhone();
        String receiptNumber = receipt != null ? receipt.getReceiptNumber() : "RECEIPT-PENDING";
        String dateStr = DateTimeFormatter.ISO_INSTANT.format(Instant.now()).substring(0, 10);
        String receiptUrl = publicBaseUrl + "/receipts/" + (receipt != null ? receipt.getReceiptNumber() : "");

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("receipt_number", receiptNumber);
        params.put("transaction_date", dateStr);
        params.put("receipt_url", receiptUrl);

        List<String> bodyParams = templateService.buildParameters("mect_donation_receipt", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("receipt_number"),
                    params.get("transaction_date"),
                    params.get("receipt_url")
            );
        }

        String eventKey = "WA_DONOR_RECEIPT_" + donation.getId();
        enqueueWhatsAppOutbox(
                eventKey,
                "DONATION_RECEIPT_WHATSAPP",
                donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                donation.getId(),
                phone,
                "DONOR",
                donorReceiptTemplate,
                bodyParams,
                donation
        );
    }

    /**
     * Notify donor when manual bank transfer / UPI claim is submitted.
     */
    @Transactional
    public void notifyDonorOnClaimSubmitted(Donation donation, String utr) {
        if (!hasDonorOptedIn(donation)) return;

        String phone = donation.getDonorPhone();
        String dateStr = DateTimeFormatter.ISO_INSTANT.format(Instant.now()).substring(0, 10);

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("reference_number", utr != null ? utr : donation.getDonationReference());
        params.put("date", dateStr);

        List<String> bodyParams = templateService.buildParameters("mect_donation_pending", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("reference_number"),
                    params.get("date")
            );
        }

        String eventKey = "WA_DONOR_CLAIM_PENDING_" + donation.getId();
        enqueueWhatsAppOutbox(
                eventKey,
                "CLAIM_SUBMITTED_WHATSAPP",
                donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                donation.getId(),
                phone,
                "DONOR",
                pendingTemplate,
                bodyParams,
                donation
        );
    }

    /**
     * Notify donor when manual claim is verified and numbered receipt generated.
     */
    @Transactional
    public void notifyDonorOnClaimVerified(Donation donation, DonationReceipt receipt) {
        if (!hasDonorOptedIn(donation)) return;

        String phone = donation.getDonorPhone();
        String receiptNumber = receipt != null ? receipt.getReceiptNumber() : "RECEIPT-VERIFIED";

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("reference_number", donation.getDonationReference());
        params.put("receipt_number", receiptNumber);

        List<String> bodyParams = templateService.buildParameters("mect_donation_verified", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("reference_number"),
                    params.get("receipt_number")
            );
        }

        String eventKey = "WA_DONOR_CLAIM_VERIFIED_" + donation.getId();
        enqueueWhatsAppOutbox(
                eventKey,
                "CLAIM_VERIFIED_WHATSAPP",
                donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                donation.getId(),
                phone,
                "DONOR",
                verifiedTemplate,
                bodyParams,
                donation
        );
    }

    /**
     * Notify donor if manual claim could not be verified against bank statements.
     */
    @Transactional
    public void notifyDonorOnClaimRejected(Donation donation, String reason) {
        if (!hasDonorOptedIn(donation)) return;

        String phone = donation.getDonorPhone();

        Map<String, String> params = new LinkedHashMap<>();
        params.put("donor_name", donation.getDonorName());
        params.put("amount", donation.getAmount() != null ? donation.getAmount().toPlainString() : "0.00");
        params.put("reference_number", donation.getDonationReference());
        params.put("reason", reason != null ? reason : "Bank transfer details could not be matched against Trust accounts.");

        List<String> bodyParams = templateService.buildParameters("mect_donation_rejected", params);
        if (bodyParams.isEmpty()) {
            bodyParams = List.of(
                    params.get("donor_name"),
                    params.get("amount"),
                    params.get("reference_number"),
                    params.get("reason")
            );
        }

        String eventKey = "WA_DONOR_CLAIM_REJECTED_" + donation.getId();
        enqueueWhatsAppOutbox(
                eventKey,
                "CLAIM_REJECTED_WHATSAPP",
                donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                donation.getId(),
                phone,
                "DONOR",
                rejectedTemplate,
                bodyParams,
                donation
        );
    }

    private boolean hasDonorOptedIn(Donation donation) {
        if (donation.isWhatsappConsent()) {
            return true;
        }
        if (donation.getDonorPhone() != null && consentService.hasWhatsAppConsent(donation.getDonorPhone())) {
            return true;
        }
        return false;
    }

    private void enqueueWhatsAppOutbox(
            String eventKey,
            String eventType,
            Long portalUserId,
            Long donationId,
            String rawPhone,
            String recipientType,
            String templateCode,
            List<String> bodyParams,
            Donation donation) {

        if (rawPhone == null || rawPhone.isBlank()) return;

        try {
            if (outboxRepository.existsByEventKey(eventKey)) return;

            String cleanPhone = WhatsAppCloudApiClient.sanitizePhoneNumber(rawPhone);
            String payloadJson = writeJsonSafe(Map.of("params", bodyParams != null ? bodyParams : Collections.emptyList()));

            NotificationOutbox outbox = new NotificationOutbox();
            outbox.setEventKey(eventKey);
            outbox.setEventType(eventType);
            outbox.setPortalUserId(portalUserId);
            outbox.setDonationId(donationId);
            outbox.setChannel("WHATSAPP");
            outbox.setRecipient(cleanPhone);
            String sender = whatsAppProvider != null && whatsAppProvider.getProviderName() != null && !whatsAppProvider.getProviderName().isBlank()
                    ? whatsAppProvider.getProviderName()
                    : "META_WHATSAPP_CLOUD";
            outbox.setSenderIdentity(sender);
            outbox.setSubject(eventType);
            outbox.setTemplateCode(templateCode != null && !templateCode.isBlank() ? templateCode : "UNAPPROVED_TEMPLATE");
            outbox.setPayloadJson(payloadJson);
            outbox.setStatus("QUEUED");
            outbox.setNextRetryAt(Instant.now());

            NotificationOutbox saved = outboxRepository.save(outbox);

            // Record initial log
            logService.recordQueued(
                    saved,
                    cleanPhone,
                    recipientType,
                    outbox.getTemplateCode(),
                    eventType,
                    donation,
                    payloadJson
            );

            // Dispatch immediately in isolated try/catch so transaction never fails
            try {
                outboxService.dispatchSingleSafe(saved);
            } catch (Exception ex) {
                log.warn("Isolated instant WhatsApp dispatch failed for eventKey={}: {}", eventKey, ex.getMessage());
            }
        } catch (Exception ex) {
            log.error("Failed to safely enqueue WhatsApp outbox notification for eventKey={}: {}", eventKey, ex.getMessage(), ex);
        }
    }

    private String writeJsonSafe(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}
