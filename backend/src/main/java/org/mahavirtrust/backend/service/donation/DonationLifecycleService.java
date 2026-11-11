package org.mahavirtrust.backend.service.donation;

import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.donation.VerifyGatewayPaymentRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.notification.EmailTemplateRenderer;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.payment.PaymentGatewayProvider;
import org.mahavirtrust.backend.service.receipt.ReceiptPdfService;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DonationLifecycleService {

    private static final String FACTUAL_STATUTORY_NOTE =
            "Acknowledges voluntary contribution received into Mahaveer Educational & Charitable Trust's verified ledger (Registered Trust Deed Balangir Doc No. 40311302194; Trust PAN: AADTM5474F; MCA CSR-1: CSR00081063). " +
            "This receipt is an Institutional Payment Acknowledgement and does NOT itself constitute a Section 80G tax-exemption certificate for FY 2026-27 unless issued alongside an active verified 80G approval order.";

    private final DonationProgrammeRepository programmeRepository;
    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentEventRepository paymentEventRepository;
    private final PaymentReconciliationLogRepository reconciliationLogRepository;
    private final DonationReceiptRepository receiptRepository;
    private final PortalUserRepository portalUserRepository;
    private final PortalUserRoleRepository portalUserRoleRepository;
    private final PaymentGatewayProvider paymentGatewayProvider;
    private final ReceiptPdfService receiptPdfService;
    private final NotificationOutboxService outboxService;
    private final EmailTemplateRenderer emailRenderer;
    private final AuditLogService auditLogService;

    private final int qrExpiryMinutes;
    private final boolean schedulingEnabled;

    public DonationLifecycleService(
            DonationProgrammeRepository programmeRepository,
            DonationRepository donationRepository,
            PaymentRepository paymentRepository,
            PaymentEventRepository paymentEventRepository,
            PaymentReconciliationLogRepository reconciliationLogRepository,
            DonationReceiptRepository receiptRepository,
            PortalUserRepository portalUserRepository,
            PortalUserRoleRepository portalUserRoleRepository,
            PaymentGatewayProvider paymentGatewayProvider,
            ReceiptPdfService receiptPdfService,
            NotificationOutboxService outboxService,
            EmailTemplateRenderer emailRenderer,
            AuditLogService auditLogService,
            @Value("${app.payment.qr-expiry-minutes:15}") int qrExpiryMinutes,
            @Value("${app.scheduling.enabled:true}") boolean schedulingEnabled) {
        this.programmeRepository = programmeRepository;
        this.donationRepository = donationRepository;
        this.paymentRepository = paymentRepository;
        this.paymentEventRepository = paymentEventRepository;
        this.reconciliationLogRepository = reconciliationLogRepository;
        this.receiptRepository = receiptRepository;
        this.portalUserRepository = portalUserRepository;
        this.portalUserRoleRepository = portalUserRoleRepository;
        this.paymentGatewayProvider = paymentGatewayProvider;
        this.receiptPdfService = receiptPdfService;
        this.outboxService = outboxService;
        this.emailRenderer = emailRenderer;
        this.auditLogService = auditLogService;
        this.qrExpiryMinutes = qrExpiryMinutes;
        this.schedulingEnabled = schedulingEnabled;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listActiveProgrammes() {
        return programmeRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapProgramme)
                .toList();
    }

    public Map<String, Object> getGatewayStatus() {
        PaymentGatewayProvider.GatewayStatus st = paymentGatewayProvider.getGatewayStatus();
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("provider", st.provider());
        res.put("configured", st.configured());
        res.put("sandboxMode", st.sandboxMode());
        res.put("dynamicQrSupported", st.dynamicQrSupported());
        res.put("reason", st.reason());
        return res;
    }

    @Transactional
    public Map<String, Object> initiateDonation(Long optionalPortalUserId, InitiateDonationRequest req, String clientIp) {
        DonationProgramme programme = programmeRepository.findByCode(req.programmeCode().trim())
                .filter(DonationProgramme::isActive)
                .orElseThrow(() -> new IllegalArgumentException("Selected donation programme is unavailable or inactive."));

        PortalUser portalUser = optionalPortalUserId != null
                ? portalUserRepository.findById(optionalPortalUserId).orElse(null)
                : null;

        Donation donation = new Donation();
        donation.setDonationReference("MECT-DON-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(Locale.ROOT));
        donation.setPortalUser(portalUser);
        donation.setProgramme(programme);
        donation.setAmount(req.amount().setScale(2));
        donation.setCurrency("INR");
        donation.setFrequency("ONE_TIME");
        donation.setDonorName(req.donorName().trim());
        donation.setDonorEmail(req.donorEmail() != null && !req.donorEmail().isBlank()
                ? req.donorEmail().trim().toLowerCase(Locale.ROOT)
                : (portalUser != null ? portalUser.getPrimaryEmail() : null));
        donation.setDonorPhone(req.donorPhone() != null && !req.donorPhone().isBlank()
                ? req.donorPhone().trim()
                : (portalUser != null ? portalUser.getPrimaryPhone() : null));
        donation.setDonorAddress(req.donorAddress() != null && !req.donorAddress().isBlank() ? req.donorAddress().trim() : null);
        donation.setDonorPan(req.donorPan() != null && !req.donorPan().isBlank() ? req.donorPan().trim().toUpperCase(Locale.ROOT) : null);
        donation.setDedicationMessage(req.dedicationMessage() != null && !req.dedicationMessage().isBlank() ? req.dedicationMessage().trim() : null);
        donation.setAnonymous(req.anonymous());
        donation.setPaymentMethod(req.paymentMethod() != null && !req.paymentMethod().isBlank() ? req.paymentMethod() : "UPI_QR");
        donation.setStatus("CREATED");
        donation = donationRepository.save(donation);

        Instant expiresAt = Instant.now().plus(qrExpiryMinutes, ChronoUnit.MINUTES);
        PaymentGatewayProvider.InitiatedPayment gw = paymentGatewayProvider.createDynamicQrOrder(donation, expiresAt);

        Payment payment = new Payment();
        payment.setDonation(donation);
        payment.setProvider(gw.provider());
        payment.setProviderOrderId(gw.providerOrderId());
        payment.setProviderQrId(gw.providerQrId());
        payment.setUpiUri(gw.upiUri());
        payment.setQrImageUrl(gw.qrImageUrl());
        payment.setAmount(donation.getAmount());
        payment.setCurrency(donation.getCurrency());
        payment.setStatus("PENDING");
        payment.setExpiresAt(gw.expiresAt());
        payment = paymentRepository.save(payment);

        donation.setStatus("PENDING");
        donationRepository.save(donation);

        recordReconciliation(donation, payment, "CREATED", "PENDING", "INITIATION",
                portalUser != null ? "portal:" + portalUser.getUserUuid() : "PUBLIC_CHECKOUT",
                "Dynamic payment initiated via " + gw.provider());

        if (donation.getDonorEmail() != null) {
            outboxService.enqueueEmail(
                    "DON_INIT:" + donation.getId(),
                    "DONATION_INITIATED",
                    portalUser != null ? portalUser.getId() : null,
                    donation.getId(),
                    donation.getDonorEmail(),
                    true,
                    emailRenderer.renderDonationInitiatedEmail(
                            donation.isAnonymous() ? "Supporter" : donation.getDonorName(),
                            "INR " + donation.getAmount().toPlainString(),
                            programme.getName(),
                            donation.getDonationReference()
                    ),
                    null,
                    Map.of("donationReference", donation.getDonationReference())
            );
        }

        auditLogService.record(
                portalUser != null ? "portal:" + portalUser.getUserUuid() : "PUBLIC_CHECKOUT",
                "DONATION_INITIATED",
                "DONATION",
                donation.getDonationReference(),
                clientIp,
                "Programme=" + programme.getCode() + ", Amount=" + donation.getAmount() + ", Provider=" + gw.provider()
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("donationReference", donation.getDonationReference());
        response.put("status", donation.getStatus());
        response.put("amount", donation.getAmount());
        response.put("currency", donation.getCurrency());
        response.put("programmeCode", programme.getCode());
        response.put("programmeName", programme.getName());
        response.put("paymentMethod", donation.getPaymentMethod());
        response.put("provider", payment.getProvider());
        response.put("providerOrderId", payment.getProviderOrderId());
        response.put("providerQrId", payment.getProviderQrId());
        response.put("upiUri", payment.getUpiUri());
        response.put("qrImageUrl", payment.getQrImageUrl());
        response.put("qrSvg", gw.qrSvg());
        response.put("expiresAt", payment.getExpiresAt());
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicStatus(String donationReference) {
        Donation d = donationRepository.findByDonationReference(donationReference)
                .orElseThrow(() -> new ResourceNotFoundException("Donation reference not found: " + donationReference));
        Payment p = paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(d.getId()).orElse(null);
        DonationReceipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("donationReference", d.getDonationReference());
        res.put("status", d.getStatus());
        res.put("amount", d.getAmount());
        res.put("currency", d.getCurrency());
        res.put("programmeName", d.getProgramme().getName());
        res.put("paymentMethod", d.getPaymentMethod());
        res.put("paymentStatus", p != null ? p.getStatus() : d.getStatus());
        res.put("expiresAt", p != null ? p.getExpiresAt() : null);
        res.put("confirmedAt", d.getConfirmedAt());
        res.put("receiptNumber", r != null ? r.getReceiptNumber() : null);
        res.put("receiptAvailable", r != null);
        return res;
    }

    @Transactional
    public Map<String, Object> verifyGatewayCheckoutCallback(Long optionalPortalUserId, VerifyGatewayPaymentRequest req, String clientIp) {
        Donation donation = donationRepository.findByDonationReference(req.donationReference())
                .orElseThrow(() -> new ResourceNotFoundException("Donation reference not found"));

        if (donation.getPortalUser() != null && optionalPortalUserId != null
                && !donation.getPortalUser().getId().equals(optionalPortalUserId)) {
            throw new AccessDeniedException("Not authorised to verify this donation.");
        }

        boolean valid = paymentGatewayProvider.verifyCheckoutSignature(
                req.providerOrderId(), req.providerPaymentId(), req.signature());
        if (!valid) {
            throw new BadCredentialsException("Payment gateway signature verification failed.");
        }

        String syntheticEventId = "checkout_verify:" + req.providerPaymentId();
        confirmSuccessfulPaymentInternal(
                "RAZORPAY",
                syntheticEventId,
                req.providerOrderId(),
                null,
                req.providerPaymentId(),
                "CHECKOUT_SIGNATURE_VERIFIED",
                true,
                "GATEWAY_VERIFY",
                clientIp
        );

        return getPublicStatus(donation.getDonationReference());
    }

    @Transactional
    public Map<String, Object> processRazorpayWebhook(String rawPayload, String signatureHeader, String eventIdHeader, String clientIp) {
        boolean sigValid = paymentGatewayProvider.verifyWebhookSignature(rawPayload, signatureHeader);
        String payloadSha = HmacCryptoUtil.sha256Hex(rawPayload != null ? rawPayload : "");
        String providerEventId = (eventIdHeader != null && !eventIdHeader.isBlank())
                ? eventIdHeader.trim()
                : "rzp_hash_" + payloadSha.substring(0, 24);

        if (!sigValid) {
            PaymentEvent rejected = new PaymentEvent();
            rejected.setProvider("RAZORPAY");
            rejected.setProviderEventId("REJECTED:" + providerEventId + ":" + UUID.randomUUID().toString().substring(0, 6));
            rejected.setEventType("INVALID_SIGNATURE");
            rejected.setSignatureVerified(false);
            rejected.setPayloadSha256(payloadSha);
            rejected.setRawPayload(rawPayload != null ? rawPayload : "");
            rejected.setProcessingStatus("REJECTED");
            rejected.setErrorMessage("HMAC-SHA256 webhook signature mismatch");
            paymentEventRepository.save(rejected);
            auditLogService.record("WEBHOOK_RAZORPAY", "WEBHOOK_SIGNATURE_INVALID", "PAYMENT_EVENT", providerEventId, clientIp, "Rejected spoofed/invalid webhook");
            throw new BadCredentialsException("Invalid webhook signature.");
        }

        if (paymentEventRepository.existsByProviderEventId(providerEventId)) {
            return Map.of("status", "IGNORED_DUPLICATE", "providerEventId", providerEventId);
        }

        // Parse JSON fields safely using tools.jackson.databind
        try {
            tools.jackson.databind.ObjectMapper mapper = new tools.jackson.databind.ObjectMapper();
            tools.jackson.databind.JsonNode root = mapper.readTree(rawPayload);
            String eventType = root.path("event").asString("unknown");
            tools.jackson.databind.JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
            tools.jackson.databind.JsonNode qrEntity = root.path("payload").path("qr_code").path("entity");
            tools.jackson.databind.JsonNode refundEntity = root.path("payload").path("refund").path("entity");

            String orderId = textOrNull(paymentEntity, "order_id");
            String paymentId = textOrNull(paymentEntity, "id");
            String qrId = textOrNull(qrEntity, "id");
            if (qrId == null) {
                qrId = textOrNull(paymentEntity, "notes", "qr_code_id");
            }
            if ("refund.created".equals(eventType) || "refund.processed".equals(eventType)) {
                String refundId = textOrNull(refundEntity, "id");
                String refundPaymentId = textOrNull(refundEntity, "payment_id");
                long refundAmountPaise = refundEntity.path("amount").asLong(0L);
                return processRefundEventInternal(
                        providerEventId,
                        eventType,
                        refundId,
                        refundPaymentId != null ? refundPaymentId : paymentId,
                        BigDecimal.valueOf(refundAmountPaise).divide(BigDecimal.valueOf(100)),
                        rawPayload,
                        clientIp
                );
            }

            if ("payment.captured".equals(eventType) || "order.paid".equals(eventType) || "qr_code.credited".equals(eventType)) {
                confirmSuccessfulPaymentInternal("RAZORPAY", providerEventId, orderId, qrId, paymentId, rawPayload, true, "WEBHOOK", clientIp);
                return Map.of("status", "PROCESSED", "eventType", eventType, "providerEventId", providerEventId);
            }

            if ("payment.failed".equals(eventType)) {
                String reason = paymentEntity.path("error_description").asString("Payment failed at gateway");
                markFailedPaymentInternal(providerEventId, orderId, qrId, paymentId, reason, rawPayload, clientIp);
                return Map.of("status", "PROCESSED_FAILURE", "eventType", eventType);
            }

            if ("qr_code.closed".equals(eventType)) {
                markExpiredQrInternal(providerEventId, qrId, rawPayload);
                return Map.of("status", "PROCESSED_EXPIRED", "eventType", eventType);
            }

            PaymentEvent ignored = new PaymentEvent();
            ignored.setProvider("RAZORPAY");
            ignored.setProviderEventId(providerEventId);
            ignored.setEventType(eventType);
            ignored.setSignatureVerified(true);
            ignored.setPayloadSha256(payloadSha);
            ignored.setRawPayload(rawPayload);
            ignored.setProcessingStatus("IGNORED_EVENT_TYPE");
            ignored.setProcessedAt(Instant.now());
            paymentEventRepository.save(ignored);
            return Map.of("status", "IGNORED", "eventType", eventType);
        } catch (BadCredentialsException | ResourceNotFoundException e) {
            throw e;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Malformed webhook payload: " + ex.getMessage(), ex);
        }
    }

    private void confirmSuccessfulPaymentInternal(
            String provider,
            String providerEventId,
            String orderId,
            String qrId,
            String providerPaymentId,
            String rawPayload,
            boolean signatureVerified,
            String source,
            String actor) {

        if (!signatureVerified) {
            throw new BadCredentialsException("Unverified payment event cannot confirm a donation.");
        }
        if (paymentEventRepository.existsByProviderEventId(providerEventId)) {
            return;
        }

        Payment payment = locatePaymentForUpdate(orderId, qrId, providerPaymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Matching payment record not found for webhook event."));

        PaymentEvent event = new PaymentEvent();
        event.setPayment(payment);
        event.setProvider(provider);
        event.setProviderEventId(providerEventId);
        event.setEventType("PAYMENT_CONFIRMED");
        event.setSignatureVerified(true);
        event.setPayloadSha256(HmacCryptoUtil.sha256Hex(rawPayload));
        event.setRawPayload(rawPayload);
        event.setProcessingStatus("PROCESSED");
        event.setProcessedAt(Instant.now());
        paymentEventRepository.save(event);

        Donation donation = payment.getDonation();
        String prevStatus = payment.getStatus();

        // Idempotent guard: never generate duplicate receipts on repeated capture events
        if ("SUCCESSFUL".equals(payment.getStatus()) && receiptRepository.findByDonationId(donation.getId()).isPresent()) {
            return;
        }

        Instant confirmedNow = Instant.now();
        payment.setStatus("SUCCESSFUL");
        payment.setVerifiedSignaturePresent(true);
        if (providerPaymentId != null && !providerPaymentId.isBlank()) {
            payment.setProviderPaymentId(providerPaymentId);
        }
        paymentRepository.save(payment);

        donation.setStatus("SUCCESSFUL");
        donation.setConfirmedAt(confirmedNow);
        donationRepository.save(donation);

        recordReconciliation(donation, payment, prevStatus, "SUCCESSFUL", source, actor,
                "Payment verified (" + source + "), providerPaymentId=" + payment.getProviderPaymentId());

        // Promote linked General User -> Donor safely without creating a separate account
        PortalUser portalUser = donation.getPortalUser();
        if (portalUser != null && !portalUserRoleRepository.existsByPortalUserIdAndRoleName(portalUser.getId(), PortalRoleName.ROLE_DONOR)) {
            portalUserRoleRepository.save(new PortalUserRole(portalUser, PortalRoleName.ROLE_DONOR));
            auditLogService.record("portal:" + portalUser.getUserUuid(), "ROLE_DONOR_GRANTED", "PORTAL_USER_ROLE",
                    portalUser.getId().toString(), actor, "Granted upon verified donation " + donation.getDonationReference());
        }

        // Deterministic PDF Receipt Generation
        DonationReceipt receipt = receiptRepository.findByDonationId(donation.getId()).orElseGet(() -> {
            String rcptNum = "MECT-RCPT-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
            String donorDisplay = donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName();
            byte[] pdfBytes = receiptPdfService.generateReceiptPdf(
                    rcptNum,
                    donation,
                    payment,
                    donorDisplay,
                    FACTUAL_STATUTORY_NOTE
            );

            DonationReceipt dr = new DonationReceipt();
            dr.setDonation(donation);
            dr.setReceiptNumber(rcptNum);
            dr.setDonorDisplayName(donorDisplay);
            dr.setProgrammeName(donation.getProgramme().getName());
            dr.setAmount(donation.getAmount());
            dr.setCurrency(donation.getCurrency());
            dr.setReceiptType("INSTITUTIONAL_PAYMENT_RECEIPT");
            dr.setStatutoryNote(FACTUAL_STATUTORY_NOTE);
            dr.setTemplateVersion("v1.0");
            dr.setPdfBytes(pdfBytes);
            dr.setPdfSha256(HmacCryptoUtil.sha256Hex(pdfBytes));
            return receiptRepository.save(dr);
        });

        // Enqueue Idempotent Outbox Notifications (Email with PDF + Optional Consented WhatsApp)
        String amountText = "INR " + donation.getAmount().toPlainString();
        String portalDashboardUrl = outboxService.getPublicBaseUrl() + "/portal/dashboard";

        if (donation.getDonorEmail() != null) {
            outboxService.enqueueEmail(
                    "DONATION_CONFIRMED_EMAIL:" + donation.getId(),
                    "DONATION_CONFIRMED_RECEIPT",
                    portalUser != null ? portalUser.getId() : null,
                    donation.getId(),
                    donation.getDonorEmail(),
                    true,
                    emailRenderer.renderDonationConfirmedReceiptEmail(
                            donation.isAnonymous() ? "Supporter" : donation.getDonorName(),
                            amountText,
                            donation.getProgramme().getName(),
                            donation.getDonationReference(),
                            receipt.getReceiptNumber(),
                            portalDashboardUrl
                    ),
                    receipt.getId(),
                    Map.of("receiptNumber", receipt.getReceiptNumber())
            );
        }

        if (portalUser != null) {
            outboxService.enqueueWhatsAppIfConsented(
                    "DONATION_CONFIRMED_WHATSAPP:" + donation.getId(),
                    "DONATION_CONFIRMED_WHATSAPP",
                    portalUser.getId(),
                    donation.getId(),
                    List.of(
                            donation.isAnonymous() ? "Supporter" : donation.getDonorName().split("\\s+")[0],
                            amountText,
                            receipt.getReceiptNumber(),
                            portalDashboardUrl
                    )
            );
        }
    }

    private void markFailedPaymentInternal(String providerEventId, String orderId, String qrId, String paymentId, String reason, String rawPayload, String actor) {
        Payment payment = locatePaymentForUpdate(orderId, qrId, paymentId).orElse(null);
        PaymentEvent event = new PaymentEvent();
        event.setPayment(payment);
        event.setProvider("RAZORPAY");
        event.setProviderEventId(providerEventId);
        event.setEventType("payment.failed");
        event.setSignatureVerified(true);
        event.setPayloadSha256(HmacCryptoUtil.sha256Hex(rawPayload));
        event.setRawPayload(rawPayload);
        event.setProcessingStatus("PROCESSED");
        event.setProcessedAt(Instant.now());
        paymentEventRepository.save(event);

        if (payment == null || "SUCCESSFUL".equals(payment.getStatus())) {
            return;
        }
        String prev = payment.getStatus();
        payment.setStatus("FAILED");
        payment.setFailureReason(reason);
        if (paymentId != null) payment.setProviderPaymentId(paymentId);
        paymentRepository.save(payment);

        Donation donation = payment.getDonation();
        donation.setStatus("FAILED");
        donationRepository.save(donation);

        recordReconciliation(donation, payment, prev, "FAILED", "WEBHOOK", actor, reason);

        if (donation.getDonorEmail() != null) {
            outboxService.enqueueEmail(
                    "DONATION_FAILED_EMAIL:" + donation.getId(),
                    "DONATION_FAILED",
                    donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                    donation.getId(),
                    donation.getDonorEmail(),
                    true,
                    emailRenderer.renderDonationFailedEmail(
                            donation.isAnonymous() ? "Supporter" : donation.getDonorName(),
                            "INR " + donation.getAmount().toPlainString(),
                            donation.getProgramme().getName(),
                            donation.getDonationReference(),
                            reason
                    ),
                    null,
                    Map.of()
            );
        }
    }

    private void markExpiredQrInternal(String providerEventId, String qrId, String rawPayload) {
        Payment payment = qrId != null ? paymentRepository.findByProviderQrId(qrId).orElse(null) : null;
        PaymentEvent event = new PaymentEvent();
        event.setPayment(payment);
        event.setProvider("RAZORPAY");
        event.setProviderEventId(providerEventId);
        event.setEventType("qr_code.closed");
        event.setSignatureVerified(true);
        event.setPayloadSha256(HmacCryptoUtil.sha256Hex(rawPayload));
        event.setRawPayload(rawPayload);
        event.setProcessingStatus("PROCESSED");
        event.setProcessedAt(Instant.now());
        paymentEventRepository.save(event);

        if (payment != null && "PENDING".equals(payment.getStatus())) {
            payment.setStatus("EXPIRED");
            paymentRepository.save(payment);
            Donation d = payment.getDonation();
            d.setStatus("EXPIRED");
            donationRepository.save(d);
            recordReconciliation(d, payment, "PENDING", "EXPIRED", "WEBHOOK", "RAZORPAY", "Dynamic QR expired/closed before payment");
        }
    }

    private Map<String, Object> processRefundEventInternal(String providerEventId, String eventType, String refundId, String providerPaymentId, BigDecimal refundedAmount, String rawPayload, String actor) {
        if (refundId != null && paymentEventRepository.existsByProviderEventId("REFUND_REF:" + refundId)) {
            return Map.of("status", "IGNORED_DUPLICATE_REFUND", "refundId", refundId);
        }
        Payment payment = providerPaymentId != null
                ? paymentRepository.findByProviderPaymentId(providerPaymentId).orElseThrow(() -> new ResourceNotFoundException("Payment not found for refund"))
                : null;
        if (payment == null) {
            throw new ResourceNotFoundException("Payment reference missing in refund webhook.");
        }

        PaymentEvent event = new PaymentEvent();
        event.setPayment(payment);
        event.setProvider("RAZORPAY");
        event.setProviderEventId(providerEventId);
        event.setEventType(eventType);
        event.setSignatureVerified(true);
        event.setPayloadSha256(HmacCryptoUtil.sha256Hex(rawPayload));
        event.setRawPayload(rawPayload);
        event.setProcessingStatus("PROCESSED");
        event.setProcessedAt(Instant.now());
        paymentEventRepository.save(event);

        if (refundId != null) {
            PaymentEvent dedupMarker = new PaymentEvent();
            dedupMarker.setPayment(payment);
            dedupMarker.setProvider("RAZORPAY");
            dedupMarker.setProviderEventId("REFUND_REF:" + refundId);
            dedupMarker.setEventType(eventType);
            dedupMarker.setSignatureVerified(true);
            dedupMarker.setPayloadSha256(HmacCryptoUtil.sha256Hex(rawPayload));
            dedupMarker.setRawPayload("{}");
            dedupMarker.setProcessingStatus("PROCESSED");
            dedupMarker.setProcessedAt(Instant.now());
            paymentEventRepository.save(dedupMarker);
        }

        String prevStatus = payment.getStatus();
        BigDecimal totalRefunded = payment.getRefundedAmount().add(refundedAmount);
        String targetStatus = totalRefunded.compareTo(payment.getAmount()) >= 0 ? "REFUNDED" : "PARTIALLY_REFUNDED";
        payment.setRefundedAmount(totalRefunded);
        payment.setStatus(targetStatus);
        paymentRepository.save(payment);

        Donation donation = payment.getDonation();
        donation.setStatus(targetStatus);
        donationRepository.save(donation);

        recordReconciliation(donation, payment, prevStatus, targetStatus, "WEBHOOK", actor,
                "Refund recorded: INR " + refundedAmount.toPlainString());

        if (donation.getDonorEmail() != null) {
            outboxService.enqueueEmail(
                    "DONATION_REFUND:" + providerEventId,
                    "DONATION_REFUNDED",
                    donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                    donation.getId(),
                    donation.getDonorEmail(),
                    true,
                    emailRenderer.renderRefundEmail(
                            donation.isAnonymous() ? "Supporter" : donation.getDonorName(),
                            "INR " + refundedAmount.toPlainString(),
                            donation.getDonationReference()
                    ),
                    null,
                    Map.of()
            );
        }

        return Map.of("status", "PROCESSED_REFUND", "donationStatus", targetStatus);
    }

    @Scheduled(fixedDelay = 120000)
    @Transactional
    public void expireStalePendingQrPayments() {
        if (!schedulingEnabled) return;
        List<Payment> stale = paymentRepository.findByStatusInAndExpiresAtBefore(List.of("CREATED", "PENDING"), Instant.now());
        for (Payment p : stale) {
            String prev = p.getStatus();
            p.setStatus("EXPIRED");
            paymentRepository.save(p);
            Donation d = p.getDonation();
            if ("PENDING".equals(d.getStatus()) || "CREATED".equals(d.getStatus())) {
                d.setStatus("EXPIRED");
                donationRepository.save(d);
            }
            recordReconciliation(d, p, prev, "EXPIRED", "EXPIRY_JOB", "SYSTEM", "QR payment window expired");
        }
    }

    @Transactional(readOnly = true)
    public DonationReceipt getReceiptForPortalUser(String receiptNumber, Long portalUserId) {
        DonationReceipt receipt = receiptRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found: " + receiptNumber));
        Donation donation = receipt.getDonation();
        if (donation.getPortalUser() == null || !donation.getPortalUser().getId().equals(portalUserId)) {
            throw new AccessDeniedException("You are not authorised to download this donation receipt.");
        }
        return receipt;
    }

    @Transactional(readOnly = true)
    public DonationReceipt getReceiptForAdmin(String receiptNumber) {
        return receiptRepository.findByReceiptNumber(receiptNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found: " + receiptNumber));
    }

    private Optional<Payment> locatePaymentForUpdate(String orderId, String qrId, String paymentId) {
        if (orderId != null && !orderId.isBlank()) {
            Optional<Payment> byOrder = paymentRepository.findByProviderOrderId(orderId);
            if (byOrder.isPresent()) return byOrder;
        }
        if (qrId != null && !qrId.isBlank()) {
            Optional<Payment> byQr = paymentRepository.findByProviderQrId(qrId);
            if (byQr.isPresent()) return byQr;
        }
        if (paymentId != null && !paymentId.isBlank()) {
            return paymentRepository.findByProviderPaymentId(paymentId);
        }
        return Optional.empty();
    }

    private void recordReconciliation(Donation d, Payment p, String prev, String next, String source, String actor, String note) {
        PaymentReconciliationLog log = new PaymentReconciliationLog();
        log.setDonation(d);
        log.setPayment(p);
        log.setPreviousStatus(prev);
        log.setNewStatus(next);
        log.setSource(source);
        log.setActor(actor);
        log.setNote(note);
        reconciliationLogRepository.save(log);
    }

    private Map<String, Object> mapProgramme(DonationProgramme p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("code", p.getCode());
        m.put("name", p.getName());
        m.put("tagline", p.getTagline());
        m.put("description", p.getDescription());
        m.put("generalFund", p.isGeneralFund());
        m.put("active", p.isActive());
        m.put("displayOrder", p.getDisplayOrder());
        return m;
    }

    private String textOrNull(tools.jackson.databind.JsonNode node, String field) {
        if (node == null || node.isMissingNode() || !node.has(field)) return null;
        String val = node.get(field).asString(null);
        return (val != null && !val.isBlank()) ? val : null;
    }

    private String textOrNull(tools.jackson.databind.JsonNode node, String f1, String f2) {
        if (node == null || node.isMissingNode()) return null;
        return textOrNull(node.path(f1), f2);
    }
}

