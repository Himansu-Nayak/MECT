package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TRUSTEE', 'ADMIN', 'FINANCE_OFFICER')")
public class AdminDonorController {

    private final PortalUserRepository portalUserRepository;
    private final PortalUserRoleRepository roleRepository;
    private final PortalUserProfileRepository profileRepository;
    private final CommunicationConsentRepository consentRepository;
    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentReconciliationLogRepository reconciliationRepository;
    private final DonationReceiptRepository receiptRepository;
    private final DonationProgrammeRepository programmeRepository;
    private final NotificationOutboxRepository outboxRepository;
    private final DonationLifecycleService donationService;
    private final NotificationOutboxService outboxService;
    private final AuditLogService auditLogService;

    public AdminDonorController(
            PortalUserRepository portalUserRepository,
            PortalUserRoleRepository roleRepository,
            PortalUserProfileRepository profileRepository,
            CommunicationConsentRepository consentRepository,
            DonationRepository donationRepository,
            PaymentRepository paymentRepository,
            PaymentReconciliationLogRepository reconciliationRepository,
            DonationReceiptRepository receiptRepository,
            DonationProgrammeRepository programmeRepository,
            NotificationOutboxRepository outboxRepository,
            DonationLifecycleService donationService,
            NotificationOutboxService outboxService,
            AuditLogService auditLogService) {
        this.portalUserRepository = portalUserRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.consentRepository = consentRepository;
        this.donationRepository = donationRepository;
        this.paymentRepository = paymentRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.receiptRepository = receiptRepository;
        this.programmeRepository = programmeRepository;
        this.outboxRepository = outboxRepository;
        this.donationService = donationService;
        this.outboxService = outboxService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/donors")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> listDonorsAndUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "ALL") String roleFilter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        Page<PortalUser> usersPage = search.isBlank()
                ? portalUserRepository.findAll(PageRequest.of(page, Math.min(size, 100)))
                : portalUserRepository.searchUsers(search.trim(), PageRequest.of(page, Math.min(size, 100)));

        List<Map<String, Object>> rows = new ArrayList<>();
        for (PortalUser u : usersPage.getContent()) {
            List<String> roles = roleRepository.findByPortalUserId(u.getId()).stream()
                    .map(r -> r.getRoleName().name())
                    .toList();
            if ("DONOR".equalsIgnoreCase(roleFilter) && !roles.contains(PortalRoleName.ROLE_DONOR.name())) {
                continue;
            }
            if ("GENERAL_USER".equalsIgnoreCase(roleFilter) && roles.contains(PortalRoleName.ROLE_DONOR.name())) {
                continue;
            }

            PortalUserProfile p = profileRepository.findByPortalUserId(u.getId()).orElse(null);
            CommunicationConsent wa = consentRepository.findByPortalUserIdAndChannel(u.getId(), "WHATSAPP").orElse(null);
            BigDecimal totalDonated = donationRepository.sumSuccessfulAmountByUserId(u.getId());
            long donationCount = donationRepository.countSuccessfulByUserId(u.getId());

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("userUuid", u.getUserUuid());
            m.put("fullName", p != null ? p.getFullName() : "Profile Pending");
            m.put("primaryEmail", u.getPrimaryEmail());
            m.put("primaryPhone", u.getPrimaryPhone());
            m.put("city", p != null ? p.getCity() : null);
            m.put("state", p != null ? p.getState() : null);
            m.put("profileCompleted", u.isProfileCompleted());
            m.put("deletionRequested", u.isDeletionRequested());
            m.put("roles", roles);
            m.put("whatsappConsentStatus", wa != null ? wa.getConsentStatus() : "NOT_SET");
            m.put("successfulDonationsCount", donationCount);
            m.put("totalDonatedAmount", totalDonated);
            m.put("createdAt", u.getCreatedAt());
            rows.add(m);
        }

        return ResponseEntity.ok(Map.of(
                "content", rows,
                "totalElements", usersPage.getTotalElements(),
                "totalPages", usersPage.getTotalPages(),
                "page", page
        ));
    }

    @GetMapping("/donations")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> listDonations(
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {

        Page<Donation> dPage = "ALL".equalsIgnoreCase(status)
                ? donationRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 100)))
                : donationRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(Locale.ROOT), PageRequest.of(page, Math.min(size, 100)));

        List<Map<String, Object>> rows = new ArrayList<>();
        for (Donation d : dPage.getContent()) {
            Payment p = paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(d.getId()).orElse(null);
            DonationReceipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("donationReference", d.getDonationReference());
            row.put("donorName", d.isAnonymous() ? d.getDonorName() + " (Anonymous Public)" : d.getDonorName());
            row.put("donorEmail", d.getDonorEmail());
            row.put("donorPhone", d.getDonorPhone());
            row.put("programmeCode", d.getProgramme().getCode());
            row.put("programmeName", d.getProgramme().getName());
            row.put("amount", d.getAmount());
            row.put("currency", d.getCurrency());
            row.put("status", d.getStatus());
            row.put("paymentMethod", d.getPaymentMethod());
            row.put("provider", p != null ? p.getProvider() : null);
            row.put("providerOrderId", p != null ? p.getProviderOrderId() : null);
            row.put("providerPaymentId", p != null ? p.getProviderPaymentId() : null);
            row.put("receiptNumber", r != null ? r.getReceiptNumber() : null);
            row.put("createdAt", d.getCreatedAt());
            row.put("confirmedAt", d.getConfirmedAt());
            rows.add(row);
        }

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalSuccessfulAmount", donationRepository.sumTotalSuccessfulAmount());
        summary.put("successfulCount", donationRepository.countByStatus("SUCCESSFUL"));
        summary.put("pendingCount", donationRepository.countByStatus("PENDING"));
        summary.put("failedCount", donationRepository.countByStatus("FAILED"));
        summary.put("expiredCount", donationRepository.countByStatus("EXPIRED"));
        summary.put("refundedCount", donationRepository.countByStatus("REFUNDED"));

        return ResponseEntity.ok(Map.of(
                "summary", summary,
                "content", rows,
                "totalElements", dPage.getTotalElements(),
                "totalPages", dPage.getTotalPages()
        ));
    }

    @GetMapping("/donations/{donationReference}/reconciliation")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getReconciliationLogs(@PathVariable String donationReference) {
        Donation donation = donationRepository.findByDonationReference(donationReference)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
        List<Map<String, Object>> logs = reconciliationRepository.findByDonationIdOrderByCreatedAtDesc(donation.getId())
                .stream()
                .map(l -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", l.getId());
                    m.put("previousStatus", l.getPreviousStatus());
                    m.put("newStatus", l.getNewStatus());
                    m.put("source", l.getSource());
                    m.put("actor", l.getActor());
                    m.put("note", l.getNote());
                    m.put("createdAt", l.getCreatedAt());
                    return m;
                })
                .toList();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/receipts/{receiptNumber}/pdf")
    public ResponseEntity<byte[]> downloadReceiptAdmin(
            @PathVariable String receiptNumber,
            Authentication authentication,
            HttpServletRequest request) {
        DonationReceipt receipt = donationService.getReceiptForAdmin(receiptNumber);
        auditLogService.record(
                authentication.getName(),
                "ADMIN_RECEIPT_DOWNLOADED",
                "DONATION_RECEIPT",
                receiptNumber,
                getClientIp(request),
                "Downloaded institutional receipt PDF"
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(receipt.getReceiptNumber() + ".pdf").build());
        return ResponseEntity.ok().headers(headers).body(receipt.getPdfBytes());
    }

    @GetMapping("/donations/export.csv")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TRUSTEE', 'FINANCE_OFFICER')")
    @Transactional
    public ResponseEntity<byte[]> exportDonationsCsv(Authentication authentication, HttpServletRequest request) {
        List<Donation> list = donationRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 500)).getContent();
        StringBuilder csv = new StringBuilder();
        csv.append("DonationReference,Date,Programme,Amount,Currency,Status,PaymentMethod,DonorName,Anonymous,ReceiptNumber\n");
        for (Donation d : list) {
            DonationReceipt r = receiptRepository.findByDonationId(d.getId()).orElse(null);
            csv.append(escapeCsv(d.getDonationReference())).append(",")
               .append(escapeCsv(d.getCreatedAt().toString())).append(",")
               .append(escapeCsv(d.getProgramme().getName())).append(",")
               .append(d.getAmount().toPlainString()).append(",")
               .append(escapeCsv(d.getCurrency())).append(",")
               .append(escapeCsv(d.getStatus())).append(",")
               .append(escapeCsv(d.getPaymentMethod())).append(",")
               .append(escapeCsv(d.getDonorName())).append(",")
               .append(d.isAnonymous()).append(",")
               .append(escapeCsv(r != null ? r.getReceiptNumber() : ""))
               .append("\n");
        }

        auditLogService.record(
                authentication.getName(),
                "DONATION_CSV_EXPORTED",
                "DONATION_LEDGER",
                "CSV",
                getClientIp(request),
                "Exported " + list.size() + " donation records"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        headers.setContentDisposition(ContentDisposition.attachment().filename("mect-donations-export.csv").build());
        return ResponseEntity.ok().headers(headers).body(csv.toString().getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/outbox")
    public ResponseEntity<Page<NotificationOutbox>> listOutbox(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(outboxRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 100))));
    }

    @PostMapping("/outbox/{id}/retry")
    public ResponseEntity<Map<String, Object>> retryOutbox(
            @PathVariable Long id,
            Authentication authentication,
            HttpServletRequest request) {
        NotificationOutbox item = outboxRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outbox item not found"));
        outboxService.dispatchSingleSafe(item);
        auditLogService.record(authentication.getName(), "OUTBOX_MANUAL_RETRY", "NOTIFICATION_OUTBOX", id.toString(), getClientIp(request), "Status after retry=" + item.getStatus());
        return ResponseEntity.ok(Map.of("id", item.getId(), "status", item.getStatus(), "lastError", item.getLastError() != null ? item.getLastError() : ""));
    }

    @GetMapping("/programmes")
    public ResponseEntity<List<DonationProgramme>> listAllProgrammes() {
        return ResponseEntity.ok(programmeRepository.findAllByOrderByDisplayOrderAsc());
    }

    @PatchMapping("/programmes/{id}/toggle")
    public ResponseEntity<DonationProgramme> toggleProgramme(
            @PathVariable Long id,
            Authentication authentication,
            HttpServletRequest request) {
        DonationProgramme p = programmeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Programme not found"));
        p.setActive(!p.isActive());
        DonationProgramme saved = programmeRepository.save(p);
        auditLogService.record(authentication.getName(), "CAMPAIGN_TOGGLED", "DONATION_PROGRAMME", saved.getCode(), getClientIp(request), "Active=" + saved.isActive());
        return ResponseEntity.ok(saved);
    }

    private String escapeCsv(String v) {
        if (v == null) return "";
        String cleaned = v.replace("\"", "\"\"");
        if (cleaned.startsWith("=") || cleaned.startsWith("+") || cleaned.startsWith("-") || cleaned.startsWith("@")) {
            cleaned = "'" + cleaned;
        }
        return "\"" + cleaned + "\"";
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

