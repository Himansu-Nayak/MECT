package org.mahavirtrust.backend.dto.scholarship;

import jakarta.validation.constraints.NotNull;
import org.mahavirtrust.backend.entity.ApplicationStatus;

public class ScholarshipStatusUpdateRequest {

    @NotNull(message = "New status is required")
    private ApplicationStatus status;

    private String rejectionReason;

    private String actionRequiredNote;

    private String disbursalTransactionRef;

    private Long expectedVersion;

    public ScholarshipStatusUpdateRequest() {}

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getActionRequiredNote() { return actionRequiredNote; }
    public void setActionRequiredNote(String actionRequiredNote) { this.actionRequiredNote = actionRequiredNote; }

    public String getDisbursalTransactionRef() { return disbursalTransactionRef; }
    public void setDisbursalTransactionRef(String disbursalTransactionRef) { this.disbursalTransactionRef = disbursalTransactionRef; }

    public Long getExpectedVersion() { return expectedVersion; }
    public void setExpectedVersion(Long expectedVersion) { this.expectedVersion = expectedVersion; }
}
