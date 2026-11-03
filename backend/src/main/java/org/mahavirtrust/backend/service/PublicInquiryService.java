package org.mahavirtrust.backend.service;

import org.mahavirtrust.backend.dto.CreateInquiryRequest;
import org.mahavirtrust.backend.dto.SubmissionResponse;
import org.mahavirtrust.backend.entity.PublicInquiry;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.List;

@Service
public class PublicInquiryService {

    private static final Logger log = LoggerFactory.getLogger(PublicInquiryService.class);

    private final PublicInquiryRepository repository;

    public PublicInquiryService(PublicInquiryRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SubmissionResponse createInquiry(CreateInquiryRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();
        String cleanMessage = sanitizeInput(request.message().trim());

        // Duplicate Submission Defense: Check if identical submission occurred in last 3 minutes
        List<PublicInquiry> recent = repository.findByEmailOrderByIdDesc(cleanEmail);
        if (!recent.isEmpty()) {
            PublicInquiry latest = recent.get(0);
            long rawSeconds = latest.getCreatedAt() != null
                    ? Math.abs(Duration.between(latest.getCreatedAt(), Instant.now()).toSeconds())
                    : 0;
            
            // Normalize against system timezone offset to ensure robustness across JDBC driver environments
            int tzOffsetSeconds = ZoneId.systemDefault().getRules().getOffset(Instant.now()).getTotalSeconds();
            long normalizedSeconds = Math.min(rawSeconds, Math.abs(rawSeconds - tzOffsetSeconds));

            boolean match = latest.getMessage() != null && latest.getMessage().equals(cleanMessage);

            if (match && normalizedSeconds < 180) {
                log.warn("Duplicate inquiry submission detected for email: {}. Returning existing ref.", cleanEmail);
                return new SubmissionResponse(
                        "SUCCESS",
                        latest.getId(),
                        "Your inquiry has already been received and logged under reference #" + latest.getId() + ".",
                        latest.getCreatedAt()
                );
            }
        }

        log.info("Received public inquiry under category: {}", request.category());

        PublicInquiry inquiry = new PublicInquiry(
                sanitizeInput(request.fullName().trim()),
                cleanEmail,
                sanitizeInput(request.phone().trim()),
                sanitizeInput(request.category().trim()),
                cleanMessage
        );

        PublicInquiry saved = repository.save(inquiry);
        log.info("Successfully recorded inquiry with referenceId: {}", saved.getId());

        return new SubmissionResponse(
                "SUCCESS",
                saved.getId(),
                "Your inquiry has been successfully received by the MAHAVIR TRUST Secretariat.",
                Instant.now()
        );
    }

    private String sanitizeInput(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)<script.*?>.*?</script>", "")
                    .replaceAll("<[^>]*>", "");
    }
}
