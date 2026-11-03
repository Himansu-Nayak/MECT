package org.mahavirtrust.backend.entity;

/**
 * Permitted lifecycle statuses and transition rules for volunteer applications.
 */
public enum VolunteerStatus {
    AWAITING_ORIENTATION,
    UNDER_REVIEW,
    ORIENTATION_COMPLETED,
    ACTIVE_MENTOR,
    INACTIVE,
    REJECTED;

    /**
     * Determines whether transitioning from this status to the target status is permitted.
     * Idempotent transitions (same -> same) are permitted.
     * REJECTED is a terminal state.
     */
    public boolean canTransitionTo(VolunteerStatus target) {
        if (target == null) {
            return false;
        }
        if (this == target) {
            return true;
        }
        return switch (this) {
            case AWAITING_ORIENTATION -> target == UNDER_REVIEW || target == REJECTED;
            case UNDER_REVIEW -> target == ORIENTATION_COMPLETED || target == REJECTED || target == AWAITING_ORIENTATION;
            case ORIENTATION_COMPLETED -> target == ACTIVE_MENTOR || target == INACTIVE || target == REJECTED;
            case ACTIVE_MENTOR -> target == INACTIVE;
            case INACTIVE -> target == UNDER_REVIEW || target == ACTIVE_MENTOR;
            case REJECTED -> false;
        };
    }
}
