package org.mahavirtrust.backend.dto;

import java.time.Instant;

/**
 * Administrative response for volunteer status modifications.
 * Intentionally avoids returning applicant personal data (PII) to minimize data exposure.
 */
public record VolunteerStatusUpdateResponse(
        Long id,
        String previousStatus,
        String newStatus,
        String actor,
        Instant updatedAt,
        String message
) {}
