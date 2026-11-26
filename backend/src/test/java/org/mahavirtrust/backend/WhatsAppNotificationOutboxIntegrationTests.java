package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.CreateInquiryRequest;
import org.mahavirtrust.backend.dto.CreateVolunteerRequest;
import org.mahavirtrust.backend.dto.donation.ReviewManualSbiClaimRequest;
import org.mahavirtrust.backend.dto.donation.SubmitManualSbiUtrRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.service.PublicInquiryService;
import org.mahavirtrust.backend.service.VolunteerRegistrationService;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.notification.whatsapp.DonorMessagingPreferenceService;
import org.mahavirtrust.backend.service.notification.whatsapp.WhatsAppCloudApiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class WhatsAppNotificationOutboxIntegrationTests {

    @Autowired private DonationLifecycleService donationService;
    @Autowired private WhatsAppRecipientRepository recipientRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private WhatsAppMessageLogRepository messageLogRepository;
    @Autowired private DonorMessagingPreferenceRepository preferenceRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private DonationProgrammeRepository programmeRepository;
    @Autowired private VolunteerRegistrationService volunteerService;
    @Autowired private PublicInquiryService inquiryService;

    private DonationProgramme testProgramme;

    @BeforeEach
    void setUp() {
        testProgramme = programmeRepository.findByCode("EDUCATION_LEARNING").orElseGet(() -> {
            DonationProgramme p = new DonationProgramme();
            p.setCode("EDUCATION_LEARNING");
            p.setName("Education & Learning (Shiksha Setu)");
            p.setTagline("Education Support");
            p.setDescription("Test programme");
            p.setActive(true);
            return programmeRepository.save(p);
        });

        // Ensure at least one active admin recipient exists
        if (recipientRepository.findByPhoneNumber("919876543210").isEmpty()) {
            WhatsAppRecipient admin = new WhatsAppRecipient();
            admin.setName("Sri Trustee Nayak");
            admin.setPhoneNumber("919876543210");
            admin.setRole("TRUSTEE");
            admin.setActive(true);
            admin.setNotifyOnDonation(true);
            admin.setNotifyOnClaim(true);
            admin.setNotifyOnRefund(true);
            recipientRepository.save(admin);
        }
    }

    @Test
    @DisplayName("Manual SBI claim submission enqueues admin alert and donor pending notification when opted in")
    void testManualClaimSubmissionEnqueuesWhatsAppNotifications() {
        long outboxBefore = outboxRepository.count();
        long logsBefore = messageLogRepository.count();

        String utr = "SBIN" + System.currentTimeMillis();
        SubmitManualSbiUtrRequest req = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("2500.00"),
                "Ramesh Kumar",
                "ramesh@example.com",
                "9876500001",
                "Balangir, Odisha",
                "ABCDE1234F",
                "In honor of teachers",
                false,
                true,
                true, // whatsappConsent = true
                utr,
                LocalDate.now(),
                "Direct Transfer",
                "Bank Ref",
                null
        );

        Map<String, Object> result = donationService.submitManualSbiUtrClaim(null, req, "127.0.0.1");
        assertThat(result).containsKey("claimReference");
        String claimRef = (String) result.get("claimReference");

        // Verify donor messaging preference saved
        DonorMessagingPreference pref = preferenceRepository.findByDonorPhone("919876500001").orElse(null);
        assertThat(pref).isNotNull();
        assertThat(pref.isWhatsappConsent()).isTrue();

        // Verify outbox entries created (admin alert + donor pending status)
        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        assertThat(outboxItems.size()).isGreaterThan((int) outboxBefore);

        boolean hasAdminAlert = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventKey().contains("WA_ADMIN_CLAIM_") &&
                o.getRecipient().equals("919876543210")
        );
        assertThat(hasAdminAlert).isTrue();

        boolean hasDonorPending = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventKey().contains("WA_DONOR_CLAIM_PENDING_") &&
                o.getRecipient().equals("919876500001")
        );
        assertThat(hasDonorPending).isTrue();

        // Verify WhatsApp message logs were recorded
        assertThat(messageLogRepository.count()).isGreaterThan(logsBefore);
    }

    @Test
    @DisplayName("Manual claim verification triggers admin verified alert and donor verified receipt")
    void testManualClaimVerificationEnqueuesWhatsAppNotifications() {
        String utr = "SBINVERIF" + System.currentTimeMillis();
        SubmitManualSbiUtrRequest req = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("5000.00"),
                "Priya Patel",
                "priya@example.com",
                "9876500002",
                "Bhubaneswar, Odisha",
                null,
                null,
                false,
                true,
                true,
                utr,
                LocalDate.now(),
                "UPI Transfer",
                "Proof summary",
                null
        );

        Map<String, Object> claimRes = donationService.submitManualSbiUtrClaim(null, req, "127.0.0.1");
        String claimRef = (String) claimRes.get("claimReference");

        // Admin verifies the claim
        ReviewManualSbiClaimRequest reviewReq = new ReviewManualSbiClaimRequest(
                "VERIFIED",
                "SBI-STMT-OCT-2026-001",
                "Bank credit matched on Oct 20 statement"
        );

        Map<String, Object> reviewRes = donationService.reviewManualSbiClaim(
                claimRef, reviewReq, "admin_user", "127.0.0.1"
        );
        assertThat(reviewRes.get("status")).isEqualTo("VERIFIED");

        // Verify that donor received verified donation receipt notification
        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        boolean hasDonorReceipt = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventKey().contains("WA_DONOR_RECEIPT_") &&
                o.getRecipient().equals("919876500002")
        );
        assertThat(hasDonorReceipt).isTrue();

        boolean hasClaimVerified = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventKey().contains("WA_DONOR_CLAIM_VERIFIED_") &&
                o.getRecipient().equals("919876500002")
        );
        assertThat(hasClaimVerified).isTrue();
    }

    @Test
    @DisplayName("Manual claim rejection enqueues donor rejection notification")
    void testManualClaimRejectionEnqueuesNotification() {
        String utr = "SBINREJ" + System.currentTimeMillis();
        SubmitManualSbiUtrRequest req = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1000.00"),
                "Anand Sharma",
                "anand@example.com",
                "9876500003",
                "Cuttack",
                null,
                null,
                false,
                true,
                true,
                utr,
                LocalDate.now(),
                "NEFT",
                "Notes",
                null
        );

        Map<String, Object> claimRes = donationService.submitManualSbiUtrClaim(null, req, "127.0.0.1");
        String claimRef = (String) claimRes.get("claimReference");

        // Reviewer rejects the claim due to invalid UTR
        ReviewManualSbiClaimRequest reviewReq = new ReviewManualSbiClaimRequest(
                "REJECTED",
                null,
                "No credit found with this UTR in bank statements for given date"
        );

        donationService.reviewManualSbiClaim(claimRef, reviewReq, "reviewer_user", "127.0.0.1");

        // Verify rejection notification outbox entry
        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        boolean hasDonorRejected = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventKey().contains("WA_DONOR_CLAIM_REJECTED_") &&
                o.getRecipient().equals("919876500003")
        );
        assertThat(hasDonorRejected).isTrue();
    }

    @Test
    @DisplayName("Donor who explicitly declines WhatsApp consent does NOT receive WhatsApp notifications")
    void testDeclinedConsentDoesNotEnqueueDonorWhatsApp() {
        String utr = "SBINNOCONSENT" + System.currentTimeMillis();
        SubmitManualSbiUtrRequest req = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("3000.00"),
                "Silent Donor",
                "silent@example.com",
                "9876500004",
                "Sambalpur",
                null,
                null,
                false,
                false,
                false, // whatsappConsent = false
                utr,
                LocalDate.now(),
                "Direct",
                null,
                null
        );

        donationService.submitManualSbiUtrClaim(null, req, "127.0.0.1");

        // Admin STILL receives the alert
        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        boolean hasAdminAlert = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getRecipient().equals("919876543210")
        );
        assertThat(hasAdminAlert).isTrue();

        // But donor does NOT receive WhatsApp notification
        boolean hasDonorMessage = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getRecipient().equals("919876500004")
        );
        assertThat(hasDonorMessage).isFalse();
    }

    @Test
    @DisplayName("Volunteer registration enqueues volunteer WhatsApp acknowledgement notification")
    void testVolunteerRegistrationEnqueuesWhatsAppNotification() {
        CreateVolunteerRequest req = new CreateVolunteerRequest(
                "Subhashree Sahu",
                "subhashree@example.org",
                "9876500005",
                "Teaching Assistant",
                "Angul",
                "WEEKENDS",
                "B.Ed",
                "IN_PERSON",
                "Passion for rural literacy",
                true,
                "v1.0-draft-2026"
        );

        var res = volunteerService.registerVolunteer(req);
        assertThat(res.status()).isEqualTo("SUCCESS");

        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        boolean hasVolunteerNotification = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventType().equals("VOLUNTEER_REGISTRATION_WHATSAPP") &&
                o.getRecipient().equals("919876500005")
        );
        assertThat(hasVolunteerNotification).isTrue();
    }

    @Test
    @DisplayName("Public contact inquiry submission enqueues citizen WhatsApp acknowledgement notification")
    void testPublicInquirySubmissionEnqueuesWhatsAppNotification() {
        CreateInquiryRequest req = new CreateInquiryRequest(
                "Manoj Patnaik",
                "manoj@example.org",
                "9876500006",
                "Programme Information",
                "Seeking details about the Shiksha Setu programme schedule."
        );

        var res = inquiryService.createInquiry(req);
        assertThat(res.status()).isEqualTo("SUCCESS");

        List<NotificationOutbox> outboxItems = outboxRepository.findAll();
        boolean hasInquiryNotification = outboxItems.stream().anyMatch(o ->
                "WHATSAPP".equals(o.getChannel()) &&
                o.getEventType().equals("PUBLIC_INQUIRY_WHATSAPP") &&
                o.getRecipient().equals("919876500006")
        );
        assertThat(hasInquiryNotification).isTrue();
    }
}
