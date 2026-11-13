package org.mahavirtrust.backend.service.donation;

import org.mahavirtrust.backend.dto.donation.UpdatePaymentConfigurationRequest;
import org.mahavirtrust.backend.entity.PaymentConfiguration;
import org.mahavirtrust.backend.repository.DonationProgrammeRepository;
import org.mahavirtrust.backend.repository.PaymentConfigurationRepository;
import org.mahavirtrust.backend.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentConfigurationService {

    private static final List<Integer> DEFAULT_PRESETS = List.of(500, 1000, 1500, 3000, 5000, 10000);

    private final PaymentConfigurationRepository configRepository;
    private final DonationProgrammeRepository programmeRepository;
    private final AuditLogService auditLogService;

    public PaymentConfigurationService(
            PaymentConfigurationRepository configRepository,
            DonationProgrammeRepository programmeRepository,
            AuditLogService auditLogService) {
        this.configRepository = configRepository;
        this.programmeRepository = programmeRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public PaymentConfiguration getOrCreateConfig() {
        return configRepository.findById(1L).orElseGet(() -> {
            PaymentConfiguration cfg = new PaymentConfiguration();
            cfg.setId(1L);
            return configRepository.save(cfg);
        });
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicConfigMap() {
        PaymentConfiguration cfg = configRepository.findById(1L).orElseGet(PaymentConfiguration::new);
        return toConfigMap(cfg, false);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminConfigMap() {
        PaymentConfiguration cfg = configRepository.findById(1L).orElseGet(PaymentConfiguration::new);
        return toConfigMap(cfg, true);
    }

    @Transactional(readOnly = true)
    public void validateDonationAmount(BigDecimal amount) {
        PaymentConfiguration cfg = configRepository.findById(1L).orElseGet(PaymentConfiguration::new);
        if (amount == null) {
            throw new IllegalArgumentException("Donation amount is required.");
        }
        if (amount.compareTo(cfg.getMinAmount()) < 0) {
            throw new IllegalArgumentException("Minimum permitted contribution is INR " + cfg.getMinAmount().toPlainString() + ".");
        }
        if (amount.compareTo(cfg.getMaxAmount()) > 0) {
            throw new IllegalArgumentException("Maximum permitted single contribution is INR " + cfg.getMaxAmount().toPlainString() + ".");
        }
    }

    @Transactional(readOnly = true)
    public String getStatutoryReceiptNote() {
        PaymentConfiguration cfg = configRepository.findById(1L).orElseGet(PaymentConfiguration::new);
        String base = "Acknowledges voluntary contribution received into Mahaveer Educational & Charitable Trust's verified ledger "
                + "(Registered Trust Deed Balangir Doc No. 40311302194; Trust PAN: AADTM5474F; MCA CSR-1: CSR00081063). ";
        if (cfg.isStatutoryClaimApproved() && cfg.getStatutoryUrn80g() != null && !cfg.getStatutoryUrn80g().isBlank()) {
            String validity = "";
            if (cfg.getStatutoryEffectiveDate() != null && cfg.getStatutoryExpiryDate() != null) {
                validity = " (Valid " + cfg.getStatutoryEffectiveDate() + " to " + cfg.getStatutoryExpiryDate() + ")";
            }
            return base + "Section 80G URN: " + cfg.getStatutoryUrn80g().trim() + validity + ". "
                    + cfg.getStatutoryDisclosureText();
        }
        return base + cfg.getStatutoryDisclosureText();
    }

    @Transactional
    public Map<String, Object> updateConfig(UpdatePaymentConfigurationRequest req, String actor, String clientIp) {
        if (req.minAmount().compareTo(req.maxAmount()) > 0) {
            throw new IllegalArgumentException("Minimum donation amount cannot exceed maximum donation amount.");
        }
        List<Integer> cleanedPresets = req.presetAmounts().stream()
                .filter(Objects::nonNull)
                .filter(v -> v >= req.minAmount().intValue() && v <= req.maxAmount().intValue())
                .distinct()
                .sorted()
                .toList();
        if (cleanedPresets.isEmpty()) {
            throw new IllegalArgumentException("Preset amounts must contain at least one value within the configured min/max range.");
        }

        PaymentConfiguration cfg = getOrCreateConfig();
        cfg.setCashfreeEnabled(req.cashfreeEnabled());
        cfg.setSbiQrEnabled(req.sbiQrEnabled());
        cfg.setPrimaryMethod(req.primaryMethod().trim().toUpperCase(Locale.ROOT));
        cfg.setFallbackEnabled(req.fallbackEnabled());
        cfg.setMinAmount(req.minAmount());
        cfg.setMaxAmount(req.maxAmount());
        cfg.setSuggestedAmounts(cleanedPresets.stream().map(String::valueOf).collect(Collectors.joining(",")));
        cfg.setGeneralFundEnabled(req.generalFundEnabled());
        cfg.setSbiBankName(req.sbiBankName().trim());
        cfg.setSbiAccountName(req.sbiAccountName().trim());
        cfg.setSbiAccountNumber(req.sbiAccountNumber().trim());
        cfg.setSbiIfsc(req.sbiIfsc().trim().toUpperCase(Locale.ROOT));
        cfg.setSbiBranch(req.sbiBranch().trim());
        cfg.setSbiUpiId(req.sbiUpiId().trim());
        cfg.setSbiQrImageUrl(req.sbiQrImageUrl().trim());
        cfg.setPaymentInstructions(req.paymentInstructions().trim());
        cfg.setGatewayNoticeText(req.gatewayNoticeText().trim());
        cfg.setStatutoryStatus(req.statutoryStatus().trim().toUpperCase(Locale.ROOT));
        cfg.setStatutoryFinancialYear(req.statutoryFinancialYear().trim());
        cfg.setStatutoryEffectiveDate(req.statutoryEffectiveDate() != null && !req.statutoryEffectiveDate().isBlank()
                ? req.statutoryEffectiveDate().trim() : null);
        cfg.setStatutoryExpiryDate(req.statutoryExpiryDate() != null && !req.statutoryExpiryDate().isBlank()
                ? req.statutoryExpiryDate().trim() : null);
        cfg.setStatutoryUrn80g(req.statutoryUrn80g() != null && !req.statutoryUrn80g().isBlank()
                ? req.statutoryUrn80g().trim() : null);
        cfg.setStatutoryUrn12a(req.statutoryUrn12a() != null && !req.statutoryUrn12a().isBlank()
                ? req.statutoryUrn12a().trim() : null);
        cfg.setStatutoryClaimApproved(req.statutoryClaimApproved());
        cfg.setStatutoryDisclosureText(req.statutoryDisclosureText().trim());
        cfg.setUpdatedBy(actor);

        cfg = configRepository.save(cfg);

        programmeRepository.findByCode("GENERAL_FUND").ifPresent(gf -> {
            if (gf.isActive() != req.generalFundEnabled()) {
                gf.setActive(req.generalFundEnabled());
                programmeRepository.save(gf);
            }
        });

        auditLogService.record(
                actor,
                "PAYMENT_CONFIG_UPDATED",
                "PAYMENT_CONFIGURATION",
                "1",
                clientIp,
                "cashfree=" + cfg.isCashfreeEnabled()
                        + ", sbiQr=" + cfg.isSbiQrEnabled()
                        + ", min=" + cfg.getMinAmount()
                        + ", max=" + cfg.getMaxAmount()
                        + ", generalFund=" + cfg.isGeneralFundEnabled()
                        + ", 80gApproved=" + cfg.isStatutoryClaimApproved()
        );

        return toConfigMap(cfg, true);
    }

    private Map<String, Object> toConfigMap(PaymentConfiguration cfg, boolean includeAuditMeta) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("cashfreeEnabled", cfg.isCashfreeEnabled());
        m.put("sbiQrEnabled", cfg.isSbiQrEnabled());
        m.put("primaryMethod", cfg.getPrimaryMethod());
        m.put("fallbackEnabled", cfg.isFallbackEnabled());
        m.put("minAmount", cfg.getMinAmount());
        m.put("maxAmount", cfg.getMaxAmount());
        m.put("presetAmounts", parsePresets(cfg.getSuggestedAmounts()));
        m.put("generalFundEnabled", cfg.isGeneralFundEnabled());
        m.put("sbiBankName", cfg.getSbiBankName());
        m.put("sbiAccountName", cfg.getSbiAccountName());
        m.put("sbiAccountNumber", cfg.getSbiAccountNumber());
        m.put("sbiIfsc", cfg.getSbiIfsc());
        m.put("sbiBranch", cfg.getSbiBranch());
        m.put("sbiUpiId", cfg.getSbiUpiId());
        m.put("sbiQrImageUrl", cfg.getSbiQrImageUrl());
        m.put("paymentInstructions", cfg.getPaymentInstructions());
        m.put("gatewayNoticeText", cfg.getGatewayNoticeText());
        m.put("statutoryStatus", cfg.getStatutoryStatus());
        m.put("statutoryFinancialYear", cfg.getStatutoryFinancialYear());
        m.put("statutoryEffectiveDate", cfg.getStatutoryEffectiveDate());
        m.put("statutoryExpiryDate", cfg.getStatutoryExpiryDate());
        m.put("statutoryUrn80g", cfg.getStatutoryUrn80g());
        m.put("statutoryUrn12a", cfg.getStatutoryUrn12a());
        m.put("statutoryClaimApproved", cfg.isStatutoryClaimApproved());
        m.put("statutoryDisclosureText", cfg.getStatutoryDisclosureText());
        if (includeAuditMeta) {
            m.put("updatedBy", cfg.getUpdatedBy());
            m.put("updatedAt", cfg.getUpdatedAt());
        }
        return m;
    }

    private List<Integer> parsePresets(String csv) {
        if (csv == null || csv.isBlank()) {
            return DEFAULT_PRESETS;
        }
        try {
            List<Integer> parsed = Arrays.stream(csv.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .map(Integer::parseInt)
                    .toList();
            return !parsed.isEmpty() ? parsed : DEFAULT_PRESETS;
        } catch (Exception ignored) {
            return DEFAULT_PRESETS;
        }
    }
}
