package org.mahavirtrust.backend.dto.scholarship;

import org.mahavirtrust.backend.entity.ApplicationStatus;
import java.time.Instant;
import java.util.List;

public class ScholarshipTrackResponse {

    private String applicationNumber;
    private String maskedName;
    private String institutionName;
    private String courseName;
    private String schemeCode;
    private ApplicationStatus status;
    private String statusMessage;
    private Instant submittedAt;
    private Instant lastUpdatedAt;
    private String actionRequiredNote;
    private String rejectionReason;
    private Instant disbursalDate;
    private List<TrackingStage> stages;

    public static class TrackingStage {
        private String stageKey;
        private String label;
        private String state; // COMPLETED, CURRENT, PENDING, REJECTED, ACTION_NEEDED
        private String description;

        public TrackingStage() {}

        public TrackingStage(String stageKey, String label, String state, String description) {
            this.stageKey = stageKey;
            this.label = label;
            this.state = state;
            this.description = description;
        }

        public String getStageKey() { return stageKey; }
        public void setStageKey(String stageKey) { this.stageKey = stageKey; }
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public ScholarshipTrackResponse() {}

    // Getters and Setters
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getMaskedName() { return maskedName; }
    public void setMaskedName(String maskedName) { this.maskedName = maskedName; }
    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(Instant lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }
    public String getActionRequiredNote() { return actionRequiredNote; }
    public void setActionRequiredNote(String actionRequiredNote) { this.actionRequiredNote = actionRequiredNote; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Instant getDisbursalDate() { return disbursalDate; }
    public void setDisbursalDate(Instant disbursalDate) { this.disbursalDate = disbursalDate; }
    public List<TrackingStage> getStages() { return stages; }
    public void setStages(List<TrackingStage> stages) { this.stages = stages; }
}
