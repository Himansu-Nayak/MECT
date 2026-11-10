package org.mahavirtrust.backend.service.portal;

import org.mahavirtrust.backend.dto.portal.AccountDeletionRequest;
import org.mahavirtrust.backend.dto.portal.UpdateNotificationPreferencesRequest;
import org.mahavirtrust.backend.dto.portal.UpdatePortalProfileRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.AuditLogService;
import org.mahavirtrust.backend.service.notification.EmailTemplateRenderer;
import org.mahavirtrust.backend.service.notification.NotificationOutboxService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
public class PortalAccountService {

    private static final String WHATSAPP_CONSENT_TEXT =
            "I agree to receive donation confirmations and relevant service updates from MECT on WhatsApp.";

    private final PortalUserRepository userRepository;
    private final PortalUserRoleRepository roleRepository;
    private final PortalUserProfileRepository profileRepository;
    private final PortalVerifiedContactRepository contactRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final CommunicationConsentRepository consentRepository;
    private final DonationRepository donationRepository;
    private final PaymentRepository paymentRepository;
    private final DonationReceiptRepository receiptRepository;
    private final NotificationOutboxService outboxService;
    private final EmailTemplateRenderer emailRenderer;
    private final AuditLogService auditLogService;

    public PortalAccountService(
            PortalUserRepository userRepository,
            PortalUserRoleRepository roleRepository,
            PortalUserProfileRepository profileRepository,
            PortalVerifiedContactRepository contactRepository,
            NotificationPreferenceRepository preferenceRepository,
            CommunicationConsentRepository consentRepository,
            DonationRepository donationRepository,
            PaymentRepository paymentRepository,
            DonationReceiptRepository receiptRepository,
            NotificationOutboxService outboxService,
            EmailTemplateRenderer emailRenderer,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.profileRepository = profileRepository;
        this.contactRepository = contactRepository;
        this.preferenceRepository = preferenceRepository;
        this.consentRepository = consentRepository;
        this.donationRepository = donationRepository;
        this.paymentRepository = paymentRepository;
        this.receiptRepository = receiptRepository;
        this.outboxService = outboxService;
        this.emailRenderer = emailRenderer;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardAndAccount(Long portalUserId) {
        PortalUser user = userRepository.findById(portalUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Portal user not found"));

        PortalUserProfile profile = profileRepository.findByPortalUserId(portalUserId).orElse(null);
        List<String> roles = roleRepository.findByPortalUserId(portalUserId).stream()
                .map(r -> r.getRoleName().name())
                .toList();

        List<Map<String, Object>> verifiedContacts = contactRepository.findByPortalUserIdOrderByVerifiedAtAsc(portalUserId)
                .stream()
                .map(c -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("contactType", c.getContactType());
                    m.put("contactValue", c.getContactValue());
                    m.put("primary", c.isPrimary());
                    m.put("verifiedAt", c.getVerifiedAt());
                    return m;
                })
                .toList();

        NotificationPreference pref = preferenceRepository.findByPortalUserId(portalUserId).orElse(null);
        CommunicationConsent waConsent = consentRepository.findByPortalUserIdAndChannel(portalUserId, "WHATSAPP").orElse(null);

        List<Donation> donations = donationRepository.findByPortalUserIdOrderByCreatedAtDesc(portalUserId);
        BigDecimal totalSuccessfulAmount = donationRepository.sumSuccessfulAmountByUserId(portalUserId);
        long successfulCount = donationRepository.countSuccessfulByUserId(portalUserId);
        long pendingCount = donations.stream().filter(d -> "PENDING".equals(d.getStatus()) || "CREATED".equals(d.getStatus())).count();
        long failedCount = donations.stream().filter(d -> "FAILED".equals(d.getStatus()) || "EXPIRED".equals(d.getStatus())).count();

        List<Map<String, Object>> history = new ArrayList<>();
        Map<String, Object> latestSuccessful = null;

        for (Donation d : donations) {
            Payment payment = paymentRepository.findTopByDonationIdOrderByCreatedAtDesc(d.getId()).orElse(null);
            DonationReceipt receipt = receiptRepository.findByDonationId(d.getId()).orElse(null);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("donationReference", d.getDonationReference());
            row.put("date", d.getCreatedAt());
            row.put("confirmedAt", d.getConfirmedAt());
            row.put("programmeCode", d.getProgramme().getCode());
            row.put("programmeName", d.getProgramme().getName());
            row.put("amount", d.getAmount());
            row.put("currency", d.getCurrency());
            row.put("paymentMethod", d.getPaymentMethod());
            row.put("status", d.getStatus());
            row.put("anonymous", d.isAnonymous());
            row.put("dedicationMessage", d.getDedicationMessage());
            row.put("provider", payment != null ? payment.getProvider() : null);
            row.put("providerOrderId", payment != null ? payment.getProviderOrderId() : null);
            row.put("providerPaymentId", payment != null ? payment.getProviderPaymentId() : null);
            row.put("receiptNumber", receipt != null ? receipt.getReceiptNumber() : null);
            row.put("receiptAvailable", receipt != null);

            history.add(row);
            if (latestSuccessful == null && "SUCCESSFUL".equals(d.getStatus())) {
                latestSuccessful = row;
            }
        }

        Map<String, Object> profileMap = null;
        if (profile != null) {
            profileMap = new LinkedHashMap<>();
            profileMap.put("fullName", profile.getFullName());
            profileMap.put("addressLine", profile.getAddressLine());
            profileMap.put("city", profile.getCity());
            profileMap.put("state", profile.getState());
            profileMap.put("pinCode", profile.getPinCode());
            profileMap.put("country", profile.getCountry());
            profileMap.put("dateOfBirth", profile.getDateOfBirth());
            profileMap.put("avatarUrl", profile.getAvatarUrl());
            profileMap.put("preferredLanguage", profile.getPreferredLanguage());
            profileMap.put("panProvided", profile.getPanOptional() != null && !profile.getPanOptional().isBlank());
            profileMap.put("panMasked", maskPan(profile.getPanOptional()));
            profileMap.put("updatedAt", profile.getUpdatedAt());
        }

        Map<String, Object> accountOverview = new LinkedHashMap<>();
        accountOverview.put("userUuid", user.getUserUuid());
        accountOverview.put("primaryEmail", user.getPrimaryEmail());
        accountOverview.put("primaryPhone", user.getPrimaryPhone());
        accountOverview.put("status", user.getStatus());
        accountOverview.put("profileCompleted", user.isProfileCompleted());
        accountOverview.put("deletionRequested", user.isDeletionRequested());
        accountOverview.put("roles", roles);
        accountOverview.put("isDonor", roles.contains(PortalRoleName.ROLE_DONOR.name()));
        accountOverview.put("verifiedContacts", verifiedContacts);
        accountOverview.put("profile", profileMap);
        accountOverview.put("preferences", Map.of(
                "emailReceiptsEnabled", pref == null || pref.isEmailReceiptsEnabled(),
                "emailUpdatesEnabled", pref == null || pref.isEmailUpdatesEnabled(),
                "whatsappOptIn", waConsent != null && "OPTED_IN".equals(waConsent.getConsentStatus()),
                "whatsappPhoneNumber", waConsent != null && waConsent.getPhoneNumber() != null ? waConsent.getPhoneNumber() : "",
                "whatsappConsentUpdatedAt", waConsent != null ? waConsent.getUpdatedAt() : ""
        ));

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalSuccessfulAmount", totalSuccessfulAmount);
        summary.put("successfulCount", successfulCount);
        summary.put("pendingCount", pendingCount);
        summary.put("failedCount", failedCount);
        summary.put("latestDonation", latestSuccessful);

        return Map.of(
                "account", accountOverview,
                "donationSummary", summary,
                "donationHistory", history
        );
    }

    @Transactional
    public Map<String, Object> completeOrUpdateProfile(Long portalUserId, UpdatePortalProfileRequest req, String clientIp) {
        PortalUser user = userRepository.findById(portalUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Portal user not found"));

        boolean firstCompletion = !user.isProfileCompleted();

        PortalUserProfile profile = profileRepository.findByPortalUserId(portalUserId)
                .orElseGet(() -> {
                    PortalUserProfile p = new PortalUserProfile();
                    p.setPortalUser(user);
                    return p;
                });

        profile.setFullName(req.fullName().trim());
        profile.setAddressLine(req.addressLine().trim());
        profile.setCity(req.city().trim());
        profile.setState(req.state().trim());
        profile.setPinCode(req.pinCode().trim());
        profile.setCountry(req.country().trim());
        profile.setDateOfBirth(req.dateOfBirth());
        profile.setAvatarUrl(req.avatarUrl() != null && !req.avatarUrl().isBlank() ? req.avatarUrl().trim() : null);
        profile.setPreferredLanguage(req.preferredLanguage() != null && !req.preferredLanguage().isBlank() ? req.preferredLanguage().trim() : "en");
        if (req.panOptional() != null && !req.panOptional().isBlank()) {
            profile.setPanOptional(req.panOptional().trim().toUpperCase(Locale.ROOT));
        }
        profileRepository.save(profile);

        user.setProfileCompleted(true);
        userRepository.save(user);

        if (req.whatsappOptIn() != null) {
            recordWhatsAppConsent(
                    user,
                    req.whatsappOptIn(),
                    req.whatsappPhoneNumber() != null && !req.whatsappPhoneNumber().isBlank()
                            ? req.whatsappPhoneNumber().trim()
                            : user.getPrimaryPhone(),
                    req.whatsappConsentVersion() != null && !req.whatsappConsentVersion().isBlank()
                            ? req.whatsappConsentVersion()
                            : "wa-v1.0",
                    firstCompletion ? "PROFILE_COMPLETION" : "PROFILE_SETTINGS"
            );
        }

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                firstCompletion ? "PORTAL_PROFILE_COMPLETED" : "PORTAL_PROFILE_UPDATED",
                "PORTAL_USER",
                user.getId().toString(),
                clientIp,
                "City=" + profile.getCity() + ", State=" + profile.getState()
        );

        if (firstCompletion && user.getPrimaryEmail() != null) {
            outboxService.enqueueEmail(
                    "PROFILE_COMPLETED:" + user.getId(),
                    "PROFILE_COMPLETED",
                    user.getId(),
                    null,
                    user.getPrimaryEmail(),
                    false,
                    emailRenderer.renderProfileCompletedEmail(profile.getFullName()),
                    null,
                    Map.of()
            );
        }

        return getDashboardAndAccount(portalUserId);
    }

    @Transactional
    public Map<String, Object> updatePreferencesAndConsent(Long portalUserId, UpdateNotificationPreferencesRequest req, String clientIp) {
        PortalUser user = userRepository.findById(portalUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Portal user not found"));

        NotificationPreference pref = preferenceRepository.findByPortalUserId(portalUserId)
                .orElseGet(() -> {
                    NotificationPreference p = new NotificationPreference();
                    p.setPortalUser(user);
                    return p;
                });
        pref.setEmailReceiptsEnabled(req.emailReceiptsEnabled());
        pref.setEmailUpdatesEnabled(req.emailUpdatesEnabled());
        preferenceRepository.save(pref);

        String targetPhone = req.whatsappPhoneNumber() != null && !req.whatsappPhoneNumber().isBlank()
                ? req.whatsappPhoneNumber().trim()
                : user.getPrimaryPhone();
        String version = req.consentVersion() != null && !req.consentVersion().isBlank() ? req.consentVersion() : "wa-v1.0";

        recordWhatsAppConsent(user, req.whatsappOptIn(), targetPhone, version, "PREFERENCES_PORTAL");

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                "PORTAL_PREFERENCES_UPDATED",
                "COMMUNICATION_CONSENT",
                user.getId().toString(),
                clientIp,
                "EmailReceipts=" + req.emailReceiptsEnabled() + ", EmailUpdates=" + req.emailUpdatesEnabled() + ", WhatsAppOptIn=" + req.whatsappOptIn()
        );

        return getDashboardAndAccount(portalUserId);
    }

    @Transactional
    public Map<String, Object> requestDeletionOrCorrection(Long portalUserId, AccountDeletionRequest req, String clientIp) {
        PortalUser user = userRepository.findById(portalUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Portal user not found"));

        user.setDeletionRequested(true);
        user.setDeletionRequestedAt(Instant.now());
        user.setDeletionReason(req.reason().trim());
        userRepository.save(user);

        // Immediately stop promotional updates & WhatsApp consent on deletion request
        preferenceRepository.findByPortalUserId(portalUserId).ifPresent(p -> {
            p.setEmailUpdatesEnabled(false);
            preferenceRepository.save(p);
        });
        recordWhatsAppConsent(user, false, user.getPrimaryPhone(), "wa-v1.0", "DELETION_REQUEST_OPTOUT");

        auditLogService.record(
                "portal:" + user.getUserUuid(),
                "PORTAL_ACCOUNT_DELETION_REQUESTED",
                "PORTAL_USER",
                user.getId().toString(),
                clientIp,
                "Deletion/Correction request logged (statutory financial records retained as required by Indian Trust & tax law)"
        );

        return Map.of(
                "accepted", true,
                "deletionRequested", true,
                "message", "Your account deletion/correction request has been recorded for Secretariat review. Non-essential updates have been opted out immediately; verified donation receipts and financial accounting entries are retained as mandated under statutory Indian Trust accounting laws."
        );
    }

    private void recordWhatsAppConsent(PortalUser user, boolean optedIn, String phone, String version, String source) {
        if (optedIn && (phone == null || phone.isBlank())) {
            throw new IllegalArgumentException("A mobile number is required to enable WhatsApp notifications.");
        }
        CommunicationConsent consent = consentRepository.findByPortalUserIdAndChannel(user.getId(), "WHATSAPP")
                .orElseGet(() -> {
                    CommunicationConsent c = new CommunicationConsent();
                    c.setPortalUser(user);
                    c.setChannel("WHATSAPP");
                    return c;
                });

        consent.setPhoneNumber(phone);
        consent.setConsentVersion(version);
        consent.setConsentSource(source);
        consent.setConsentText(WHATSAPP_CONSENT_TEXT);
        if (optedIn) {
            consent.setConsentStatus("OPTED_IN");
            consent.setConsentedAt(Instant.now());
            consent.setOptOutAt(null);
        } else {
            consent.setConsentStatus("OPTED_OUT");
            consent.setOptOutAt(Instant.now());
        }
        consentRepository.save(consent);
    }

    private String maskPan(String pan) {
        if (pan == null || pan.length() < 10) return null;
        return pan.substring(0, 2) + "XXXX" + pan.substring(6);
    }
}

