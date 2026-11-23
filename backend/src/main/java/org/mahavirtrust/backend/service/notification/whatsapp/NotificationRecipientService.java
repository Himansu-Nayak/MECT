package org.mahavirtrust.backend.service.notification.whatsapp;

import org.mahavirtrust.backend.entity.WhatsAppRecipient;
import org.mahavirtrust.backend.repository.WhatsAppRecipientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationRecipientService {

    private final WhatsAppRecipientRepository recipientRepository;

    public NotificationRecipientService(WhatsAppRecipientRepository recipientRepository) {
        this.recipientRepository = recipientRepository;
    }

    public List<WhatsAppRecipient> getAllRecipients() {
        return recipientRepository.findAll();
    }

    public List<WhatsAppRecipient> getActiveRecipients() {
        return recipientRepository.findByActiveTrue();
    }

    public List<WhatsAppRecipient> getActiveRecipientsForEvent(String eventType) {
        List<WhatsAppRecipient> active = recipientRepository.findByActiveTrue();
        if (eventType == null) {
            return active;
        }
        String type = eventType.toUpperCase();
        return active.stream().filter(r -> {
            if (type.contains("REFUND")) {
                return r.isNotifyOnRefund();
            }
            if (type.contains("CLAIM")) {
                return r.isNotifyOnClaim();
            }
            if (type.contains("SUMMARY")) {
                return r.isNotifyDailySummary();
            }
            if (type.contains("DONATION")) {
                return r.isNotifyOnDonation();
            }
            return true;
        }).toList();
    }

    public Optional<WhatsAppRecipient> getRecipientById(Long id) {
        return recipientRepository.findById(id);
    }

    @Transactional
    public WhatsAppRecipient createRecipient(WhatsAppRecipient recipient) {
        String cleanPhone = WhatsAppCloudApiClient.sanitizePhoneNumber(recipient.getPhoneNumber());
        if (cleanPhone.length() < 10) {
            throw new IllegalArgumentException("Invalid phone number format: " + recipient.getPhoneNumber());
        }
        recipient.setPhoneNumber(cleanPhone);
        return recipientRepository.save(recipient);
    }

    @Transactional
    public WhatsAppRecipient updateRecipient(Long id, WhatsAppRecipient update) {
        WhatsAppRecipient existing = recipientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found: " + id));

        if (update.getPhoneNumber() != null && !update.getPhoneNumber().isBlank()) {
            existing.setPhoneNumber(WhatsAppCloudApiClient.sanitizePhoneNumber(update.getPhoneNumber()));
        }
        if (update.getName() != null) {
            existing.setName(update.getName().trim());
        }
        if (update.getRole() != null) {
            existing.setRole(update.getRole().trim().toUpperCase());
        }
        existing.setActive(update.isActive());
        existing.setNotifyOnDonation(update.isNotifyOnDonation());
        existing.setNotifyOnClaim(update.isNotifyOnClaim());
        existing.setNotifyOnRefund(update.isNotifyOnRefund());
        existing.setNotifyDailySummary(update.isNotifyDailySummary());

        return recipientRepository.save(existing);
    }

    @Transactional
    public WhatsAppRecipient toggleActive(Long id) {
        WhatsAppRecipient existing = recipientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found: " + id));
        existing.setActive(!existing.isActive());
        return recipientRepository.save(existing);
    }

    @Transactional
    public void deleteRecipient(Long id) {
        recipientRepository.deleteById(id);
    }
}
