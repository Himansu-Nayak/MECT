package org.mahavirtrust.backend.dto.admin;

import java.math.BigDecimal;

public class AdminDashboardStatsResponse {

    private long totalVolunteers;
    private long pendingVolunteers;
    private long approvedVolunteers;
    private long totalInquiries;
    private long totalScholarships;
    private long submittedScholarships;
    private long underScrutinyScholarships;
    private long approvedScholarships;
    private long disbursedScholarships;
    private BigDecimal totalDisbursalDemand;
    private BigDecimal totalDisbursedAmount;
    private long totalAdminUsers;

    public AdminDashboardStatsResponse() {}

    // Getters and Setters
    public long getTotalVolunteers() { return totalVolunteers; }
    public void setTotalVolunteers(long totalVolunteers) { this.totalVolunteers = totalVolunteers; }

    public long getPendingVolunteers() { return pendingVolunteers; }
    public void setPendingVolunteers(long pendingVolunteers) { this.pendingVolunteers = pendingVolunteers; }

    public long getApprovedVolunteers() { return approvedVolunteers; }
    public void setApprovedVolunteers(long approvedVolunteers) { this.approvedVolunteers = approvedVolunteers; }

    public long getTotalInquiries() { return totalInquiries; }
    public void setTotalInquiries(long totalInquiries) { this.totalInquiries = totalInquiries; }

    public long getTotalScholarships() { return totalScholarships; }
    public void setTotalScholarships(long totalScholarships) { this.totalScholarships = totalScholarships; }

    public long getSubmittedScholarships() { return submittedScholarships; }
    public void setSubmittedScholarships(long submittedScholarships) { this.submittedScholarships = submittedScholarships; }

    public long getUnderScrutinyScholarships() { return underScrutinyScholarships; }
    public void setUnderScrutinyScholarships(long underScrutinyScholarships) { this.underScrutinyScholarships = underScrutinyScholarships; }

    public long getApprovedScholarships() { return approvedScholarships; }
    public void setApprovedScholarships(long approvedScholarships) { this.approvedScholarships = approvedScholarships; }

    public long getDisbursedScholarships() { return disbursedScholarships; }
    public void setDisbursedScholarships(long disbursedScholarships) { this.disbursedScholarships = disbursedScholarships; }

    public BigDecimal getTotalDisbursalDemand() { return totalDisbursalDemand; }
    public void setTotalDisbursalDemand(BigDecimal totalDisbursalDemand) { this.totalDisbursalDemand = totalDisbursalDemand; }

    public BigDecimal getTotalDisbursedAmount() { return totalDisbursedAmount; }
    public void setTotalDisbursedAmount(BigDecimal totalDisbursedAmount) { this.totalDisbursedAmount = totalDisbursedAmount; }

    public long getTotalAdminUsers() { return totalAdminUsers; }
    public void setTotalAdminUsers(long totalAdminUsers) { this.totalAdminUsers = totalAdminUsers; }
}
