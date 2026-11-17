package org.mahavirtrust.backend.service.him;

import org.mahavirtrust.backend.dto.him.HimReviewClaimRequest;
import org.mahavirtrust.backend.dto.him.HimSubmitUtrRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.exception.DuplicateResourceException;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.notification.EmailTemplateRenderer;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.mahavirtrust.backend.service.payment.HimPaymentGatewayService;
import org.mahavirtrust.backend.service.payment.PaymentGatewayProvider.InitiatedPayment;
import org.mahavirtrust.backend.service.receipt.ReceiptPdfService;
import org.mahavirtrust.backend.service.donation.PaymentConfigurationService;
import org.mahavirtrust.backend.util.HmacCryptoUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class HimPaymentService {

    private static final Logger log = LoggerFactory.getLogger(HimPaymentService.class);

    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final HimPaymentAttemptRepository himAttemptRepository;
    private final ManualBankTransferClaimRepository manualClaimRepository;
    private final PaymentReconciliationLogRepository reconciliationLogRepository;
    private final DonationReceiptRepository receiptRepository;
    private final HimPaymentGatewayService himGatewayService;
    private final ReceiptPdfService receiptPdfService;
    private final NotificationOutboxService outboxService;
    private final EmailTemplateRenderer emailRenderer;
    private final PaymentConfigurationService paymentConfigurationService;
    private final AuditLogService auditLogService;
    private final int sessionExpiryMinutes;

    public HimPaymentService(
            DonationRepository donationRepository,
            PaymentRepository paymentRepository,
            HimPaymentAttemptRepository himAttemptRepository,
            ManualBankTransferClaimRepository manualClaimRepository,
            PaymentReconciliationLogRepository reconciliationLogRepository,
            DonationReceiptRepository receiptRepository,
            HimPaymentGatewayService himGatewayService,
            ReceiptPdfService receiptPdfService,
            NotificationOutboxService outboxService,
            EmailTemplateRenderer emailRenderer,
            PaymentConfigurationService paymentConfigurationService,
            AuditLogService auditLogService,
            @Value("${app.payment.him.session-expiry-minutes:20}") int sessionExpiryMinutes) {
        this.donationRepository = donationRepository;
        this.paymentRepository = paymentRepository;
        this.himAttemptRepository = himAttemptRepository;
        this.manualClaimRepository = manualClaimRepository;
        this.reconciliationLogRepository = reconciliationLogRepository;
        this.receiptRepository = receiptRepository;
        this.himGatewayService = himGatewayService;
        this.receiptPdfService = receiptPdfService;
        this.outboxService = outboxService;
        this.emailRenderer = emailRenderer;
        this.paymentConfigurationService = paymentConfigurationService;
        this.auditLogService = auditLogService;
        this.sessionExpiryMinutes = sessionExpiryMinutes > 0 ? sessionExpiryMinutes : 20;
    }

    @Transactional
    public Map<String, Object> initiateHimPayment(String donationReference, String optionalIdempotencyKey, String clientIp) {
        Donation donation = donationRepository.findByDonationReference(donationReference)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found: " + donationReference));

        if ("SUCCESSFUL".equalsIgnoreCase(donation.getStatus())) {
            throw new IllegalStateException("Donation is already confirmed and successful.");
        }

        String idempotencyKey = (optionalIdempotencyKey != null && !optionalIdempotencyKey.isBlank())
                ? optionalIdempotencyKey.trim()
                : "HIM-IDEM-" + donationReference + "-" + UUID.randomUUID().toString().substring(0, 8);

        // Check for existing active attempt with this idempotency key
        Optional<HimPaymentAttempt> existing = himAttemptRepository.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent() && existing.get().getExpiresAt().isAfter(Instant.now())) {
            return toInitiatedResponse(existing.get());
        }

        Instant expiresAt = Instant.now().plus(sessionExpiryMinutes, ChronoUnit.MINUTES);
        InitiatedPayment gatewayOrder = himGatewayService.createDynamicQrOrder(donation, expiresAt);

        String attemptRef = "HIM-ATT-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();

        HimPaymentAttempt attempt = new HimPaymentAttempt();
        attempt.setAttemptReference(attemptRef);
        attempt.setDonation(donation);
        attempt.setAmount(donation.getAmount());
        attempt.setCurrency(donation.getCurrency());
        attempt.setUpiUri(gatewayOrder.upiUri());
        attempt.setQrSvg(gatewayOrder.qrSvg());
        attempt.setStatus("PENDING_PAYMENT");
        attempt.setIdempotencyKey(idempotencyKey);
        attempt.setExpiresAt(expiresAt);

        HimPaymentAttempt saved = himAttemptRepository.save(attempt);

        // Record payment attempt in global payments table
        Payment payment = new Payment();
        payment.setDonation(donation);
        payment.setProvider("HIM");
        payment.setProviderOrderId(gatewayOrder.providerOrderId());
        payment.setProviderQrId(gatewayOrder.providerQrId());
        payment.setUpiUri(gatewayOrder.upiUri());
        payment.setAmount(donation.getAmount());
        payment.setCurrency(donation.getCurrency());
        payment.setStatus("PENDING");
        payment.setExpiresAt(expiresAt);
        paymentRepository.save(payment);

        auditLogService.record(
                "SYSTEM",
                "HIM_PAYMENT_INITIATED",
                "HIM_ATTEMPT",
                saved.getAttemptReference(),
                clientIp,
                "Amount: " + donation.getAmount() + " INR for donation " + donationReference
        );

        return toInitiatedResponse(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStatus(String attemptReference) {
        HimPaymentAttempt attempt = himAttemptRepository.findByAttemptReference(attemptReference)
                .orElseThrow(() -> new ResourceNotFoundException("HIM payment attempt not found: " + attemptReference));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("attemptReference", attempt.getAttemptReference());
        res.put("donationReference", attempt.getDonation().getDonationReference());
        res.put("amount", attempt.getAmount());
        res.put("currency", attempt.getCurrency());
        res.put("status", attempt.getStatus());
        res.put("donorUtr", attempt.getDonorUtr());
        res.put("isExpired", attempt.getExpiresAt().isBefore(Instant.now()));
        res.put("expiresAt", attempt.getExpiresAt());
        res.put("verifiedAt", attempt.getVerifiedAt());
        res.put("rejectionReason", attempt.getRejectionReason());
        return res;
    }

    @Transactional
    public Map<String, Object> submitUtr(String attemptReference, HimSubmitUtrRequest req, String clientIp) {
        HimPaymentAttempt attempt = himAttemptRepository.findByAttemptReference(attemptReference)
                .orElseThrow(() -> new ResourceNotFoundException("HIM payment attempt not found: " + attemptReference));

        if ("VERIFIED".equalsIgnoreCase(attempt.getStatus())) {
            throw new IllegalStateException("Payment attempt has already been verified.");
        }

        String rawUtr = req.utrNumber().trim();
        String normalized = rawUtr.toUpperCase().replaceAll("[^A-Z0-9]", "");

        // 1. Cross-check against other HIM payment attempts
        Optional<HimPaymentAttempt> dupHim = himAttemptRepository.findByDonorUtrNormalized(normalized);
        if (dupHim.isPresent() && !dupHim.get().getId().equals(attempt.getId())) {
            throw new DuplicateResourceException("This UTR / transaction reference number has already been submitted for another payment attempt.");
        }

        // 2. Cross-check against manual SBI claims
        if (manualClaimRepository.findByUtrNormalized(normalized).isPresent()) {
            throw new DuplicateResourceException("This UTR / transaction reference number has already been registered in the trust ledger.");
        }

        attempt.setDonorUtr(rawUtr);
        attempt.setDonorUtrNormalized(normalized);
        attempt.setStatus("PENDING_VERIFICATION");
        himAttemptRepository.save(attempt);

        // Update donation status
        Donation donation = attempt.getDonation();
        donation.setStatus("PENDING_VERIFICATION");
        donationRepository.save(donation);

        // Update payment record bank reference
        paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(donation.getId()).ifPresent(p -> {
            p.setBankReference(rawUtr);
            p.setStatus("PENDING_VERIFICATION");
            paymentRepository.save(p);
        });

        auditLogService.record(
                "DONOR",
                "HIM_UTR_SUBMITTED",
                "HIM_ATTEMPT",
                attemptReference,
                clientIp,
                "Submitted UTR: " + normalized + " for amount " + attempt.getAmount()
        );

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("attemptReference", attemptReference);
        res.put("donationReference", donation.getDonationReference());
        res.put("status", "PENDING_VERIFICATION");
        res.put("message", "Your payment reference has been submitted. MECT will verify the bank credit before confirming your donation and issuing the official receipt.");
        return res;
    }

    @Transactional(readOnly = true)
    public Page<Map<String, Object>> listPendingHimPayments(String status, Pageable pageable) {
        Page<HimPaymentAttempt> page = (status == null || status.isBlank() || "ALL".equalsIgnoreCase(status))
                ? himAttemptRepository.findAllByOrderByCreatedAtDesc(pageable)
                : himAttemptRepository.findByStatusOrderByCreatedAtDesc(status.trim().toUpperCase(), pageable);

        return page.map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("attemptReference", a.getAttemptReference());
            m.put("donationReference", a.getDonation().getDonationReference());
            m.put("donorName", a.getDonation().getDonorName());
            m.put("donorEmail", a.getDonation().getDonorEmail());
            m.put("donorPhone", a.getDonation().getDonorPhone());
            m.put("programmeName", a.getDonation().getProgramme().getName());
            m.put("amount", a.getAmount());
            m.put("currency", a.getCurrency());
            m.put("status", a.getStatus());
            m.put("donorUtr", a.getDonorUtr());
            m.put("donorUtrNormalized", a.getDonorUtrNormalized());
            m.put("bankStatementRef", a.getBankStatementRef());
            m.put("verificationNotes", a.getVerificationNotes());
            m.put("verifiedBy", a.getVerifiedBy());
            m.put("verifiedAt", a.getVerifiedAt());
            m.put("rejectionReason", a.getRejectionReason());
            m.put("createdAt", a.getCreatedAt());
            m.put("expiresAt", a.getExpiresAt());
            return m;
        });
    }

    @Transactional
    public Map<String, Object> reviewHimPayment(
            String attemptReference,
            HimReviewClaimRequest req,
            String reviewer,
            String clientIp) {

        HimPaymentAttempt attempt = himAttemptRepository.findByAttemptReference(attemptReference)
                .orElseThrow(() -> new ResourceNotFoundException("HIM payment attempt not found: " + attemptReference));

        if ("VERIFIED".equalsIgnoreCase(attempt.getStatus())) {
            throw new IllegalStateException("Payment has already been approved and verified.");
        }

        Donation donation = attempt.getDonation();
        String action = req.action().trim().toUpperCase();

        if ("APPROVE".equals(action)) {
            attempt.setStatus("VERIFIED");
            attempt.setVerifiedBy(reviewer);
            attempt.setVerifiedAt(Instant.now());
            attempt.setBankStatementRef(req.bankStatementRef());
            attempt.setVerificationNotes(req.notes());
            himAttemptRepository.save(attempt);

            // Update donation
            donation.setStatus("SUCCESSFUL");
            donation.setConfirmedAt(Instant.now());
            donationRepository.save(donation);

            // Update payment
            paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(donation.getId()).ifPresent(p -> {
                p.setStatus("SUCCESSFUL");
                p.setVerifiedAt(Instant.now());
                p.setVerifiedSignaturePresent(true);
                paymentRepository.save(p);
            });

            // Issue official PDF receipt
            generateReceiptForApprovedDonation(donation, attempt);

            // Record reconciliation audit
            PaymentReconciliationLog logEntry = new PaymentReconciliationLog();
            logEntry.setDonation(donation);
            logEntry.setPreviousStatus("PENDING_VERIFICATION");
            logEntry.setNewStatus("SUCCESSFUL");
            logEntry.setSource("HIM_OFFICER_VERIFICATION");
            logEntry.setActor(reviewer);
            logEntry.setNote("Approved via bank credit statement ref: " + req.bankStatementRef());
            reconciliationLogRepository.save(logEntry);

            auditLogService.record(
                    reviewer,
                    "HIM_PAYMENT_APPROVED",
                    "HIM_ATTEMPT",
                    attemptReference,
                    clientIp,
                    "Verified bank credit with statement ref: " + req.bankStatementRef()
            );

        } else if ("REJECT".equals(action)) {
            if (req.rejectionReason() == null || req.rejectionReason().isBlank()) {
                throw new IllegalArgumentException("Rejection reason is mandatory when rejecting a payment claim.");
            }
            attempt.setStatus("REJECTED");
            attempt.setVerifiedBy(reviewer);
            attempt.setVerifiedAt(Instant.now());
            attempt.setRejectionReason(req.rejectionReason());
            attempt.setVerificationNotes(req.notes());
            himAttemptRepository.save(attempt);

            donation.setStatus("FAILED");
            donationRepository.save(donation);

            paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(donation.getId()).ifPresent(p -> {
                p.setStatus("FAILED");
                p.setFailureReason(req.rejectionReason());
                paymentRepository.save(p);
            });

            auditLogService.record(
                    reviewer,
                    "HIM_PAYMENT_REJECTED",
                    "HIM_ATTEMPT",
                    attemptReference,
                    clientIp,
                    "Rejection reason: " + req.rejectionReason()
            );

        } else if ("INVESTIGATE".equals(action)) {
            attempt.setStatus("UNDER_INVESTIGATION");
            attempt.setVerificationNotes(req.notes());
            himAttemptRepository.save(attempt);

            donation.setStatus("UNDER_INVESTIGATION");
            donationRepository.save(donation);

            auditLogService.record(
                    reviewer,
                    "HIM_PAYMENT_INVESTIGATION",
                    "HIM_ATTEMPT",
                    attemptReference,
                    clientIp,
                    "Marked under investigation: " + req.notes()
            );
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("attemptReference", attemptReference);
        res.put("newStatus", attempt.getStatus());
        res.put("reviewedBy", reviewer);
        res.put("reviewedAt", attempt.getVerifiedAt());
        return res;
    }

    private void generateReceiptForApprovedDonation(Donation donation, HimPaymentAttempt attempt) {
        if (receiptRepository.findByDonationId(donation.getId()).isPresent()) {
            return;
        }

        Payment payment = paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(donation.getId())
                .orElse(null);

        String rcptNum = "MECT-RCPT-" + Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        String donorDisplay = donation.isAnonymous() ? "Anonymous Donor" : donation.getDonorName();
        String statutoryNote = paymentConfigurationService.getStatutoryReceiptNote();

        byte[] pdfBytes = receiptPdfService.generateReceiptPdf(
                rcptNum,
                donation,
                payment,
                donorDisplay,
                statutoryNote
        );

        DonationReceipt receipt = new DonationReceipt();
        receipt.setDonation(donation);
        receipt.setReceiptNumber(rcptNum);
        receipt.setDonorDisplayName(donorDisplay);
        receipt.setProgrammeName(donation.getProgramme() != null ? donation.getProgramme().getName() : "General Charitable Fund");
        receipt.setAmount(donation.getAmount());
        receipt.setCurrency(donation.getCurrency());
        receipt.setReceiptType("INSTITUTIONAL_PAYMENT_RECEIPT");
        receipt.setStatutoryNote(statutoryNote);
        receipt.setTemplateVersion("v1.1");
        receipt.setPdfBytes(pdfBytes);
        receipt.setPdfSha256(HmacCryptoUtil.sha256Hex(pdfBytes));
        receipt = receiptRepository.save(receipt);

        // Queue email notification with PDF receipt to donor if email is provided
        if (donation.getDonorEmail() != null && !donation.getDonorEmail().isBlank()) {
            String amountText = "INR " + donation.getAmount().toPlainString();
            String portalDashboardUrl = outboxService.getPublicBaseUrl() + "/portal/dashboard";
            EmailTemplateRenderer.RenderedEmail rendered = emailRenderer.renderDonationConfirmedReceiptEmail(
                    donation.isAnonymous() ? "Supporter" : donation.getDonorName(),
                    amountText,
                    donation.getProgramme() != null ? donation.getProgramme().getName() : "General Charitable Fund",
                    donation.getDonationReference(),
                    receipt.getReceiptNumber(),
                    portalDashboardUrl
            );

            outboxService.enqueueEmail(
                    "HIM_DONATION_CONFIRMED_EMAIL:" + donation.getId(),
                    "DONATION_CONFIRMED_RECEIPT",
                    donation.getPortalUser() != null ? donation.getPortalUser().getId() : null,
                    donation.getId(),
                    donation.getDonorEmail(),
                    true,
                    rendered,
                    receipt.getId(),
                    Map.of("receiptNumber", receipt.getReceiptNumber())
            );
        }
    }

    private Map<String, Object> toInitiatedResponse(HimPaymentAttempt a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("attemptReference", a.getAttemptReference());
        m.put("donationReference", a.getDonation().getDonationReference());
        m.put("amount", a.getAmount());
        m.put("currency", a.getCurrency());
        m.put("status", a.getStatus());
        m.put("upiUri", a.getUpiUri());
        m.put("qrSvg", a.getQrSvg());
        m.put("expiresAt", a.getExpiresAt());
        return m;
    }
}

