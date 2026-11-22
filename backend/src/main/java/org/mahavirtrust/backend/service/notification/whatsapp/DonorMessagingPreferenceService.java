package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.DonorMessagingPreference;
import org.mahavirtrust.backend.entity.PortalUser;
import org.mahavirtrust.backend.repository.DonorMessagingPreferenceRepository;
import org.mahavirtrust.backend.repository.PortalUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class DonorMessagingPreferenceService {

    private final DonorMessagingPreferenceRepository preferenceRepository;
    private final PortalUserRepository portalUserRepository;

    public DonorMessagingPreferenceService(
            DonorMessagingPreferenceRepository preferenceRepository,
            PortalUserRepository portalUserRepository) {
        this.preferenceRepository = preferenceRepository;
        this.portalUserRepository = portalUserRepository;
    }

    public boolean hasWhatsAppConsent(String phone) {
        if (phone == null || phone.isBlank()) {
            return false;
        }
        String cleanPhone = WhatsAppCloudApiClient.sanitizePhoneNumber(phone);
        return preferenceRepository.findByDonorPhone(cleanPhone)
                .map(DonorMessagingPreference::isWhatsappConsent)
                .orElse(false);
    }

    public Optional<DonorMessagingPreference> getPreference(String phone) {
        if (phone == null || phone.isBlank()) {
            return Optional.empty();
        }
        return preferenceRepository.findByDonorPhone(WhatsAppCloudApiClient.sanitizePhoneNumber(phone));
    }

    @Transactional
    public DonorMessagingPreference saveOrUpdateConsent(
            String rawPhone,
            String email,
            Long portalUserId,
            boolean whatsappConsent,
            boolean smsConsent,
            String clientIp,
            String source) {

        String cleanPhone = WhatsAppCloudApiClient.sanitizePhoneNumber(rawPhone);
        if (cleanPhone.length() < 10) {
            return null;
        }

        DonorMessagingPreference pref = preferenceRepository.findByDonorPhone(cleanPhone)
                .orElseGet(() -> {
                    DonorMessagingPreference newPref = new DonorMessagingPreference();
                    newPref.setDonorPhone(cleanPhone);
                    return newPref;
                });

        if (email != null && !email.isBlank()) {
            pref.setDonorEmail(email.trim().toLowerCase());
        }

        if (portalUserId != null && pref.getPortalUser() == null) {
            PortalUser user = portalUserRepository.findById(portalUserId).orElse(null);
            pref.setPortalUser(user);
        }

        pref.setWhatsappConsent(whatsappConsent);
        pref.setSmsConsent(smsConsent);

        if (whatsappConsent || smsConsent) {
            pref.setConsentTimestamp(Instant.now());
            pref.setOptOutTimestamp(null);
        } else {
            pref.setOptOutTimestamp(Instant.now());
        }

        pref.setConsentIp(clientIp);
        pref.setConsentSource(source != null ? source : "DONATION_CHECKOUT");
        pref.setPolicyVersion("v1.0");

        return preferenceRepository.save(pref);
    }
}
