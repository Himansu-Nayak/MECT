package org.mahavirtrust.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "public_documents")
public class PublicDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_key", nullable = false, unique = true, length = 100)
    private String documentKey;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "financial_year", nullable = false, length = 50)
    private String financialYear;

    @Column(name = "issue_date", length = 50)
    private String issueDate;

    @Column(name = "publication_date", nullable = false, length = 50)
    private String publicationDate;

    @Column(name = "version", nullable = false, length = 20)
    private String version = "1.0";

    @Column(name = "issuing_authority", nullable = false, length = 200)
    private String issuingAuthority;

    @Column(name = "summary", nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "content_type", length = 100)
    private String contentType = "application/pdf";

    @Column(name = "file_size")
    private Long fileSize = 0L;

    @Column(name = "sha256_hash", length = 64)
    private String sha256Hash;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PUBLISHED";

    @Column(name = "visibility", nullable = false, length = 30)
    private String visibility = "PUBLIC";

    @Column(name = "storage_type", nullable = false, length = 50)
    private String storageType = "PHYSICAL_ARCHIVE_SECRETARIAT";

    @Column(name = "file_data_base64", columnDefinition = "TEXT")
    private String fileDataBase64;

    @Column(name = "uploaded_by", nullable = false, length = 100)
    private String uploadedBy = "SECRETARIAT";

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "superseded_by_id")
    private Long supersededById;

    @Column(name = "withdrawal_reason", length = 300)
    private String withdrawalReason;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Long getId() { return id; }
    public String getDocumentKey() { return documentKey; }
    public void setDocumentKey(String documentKey) { this.documentKey = documentKey; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    public String getPublicationDate() { return publicationDate; }
    public void setPublicationDate(String publicationDate) { this.publicationDate = publicationDate; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getSha256Hash() { return sha256Hash; }
    public void setSha256Hash(String sha256Hash) { this.sha256Hash = sha256Hash; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    public String getStorageType() { return storageType; }
    public void setStorageType(String storageType) { this.storageType = storageType; }
    public String getFileDataBase64() { return fileDataBase64; }
    public void setFileDataBase64(String fileDataBase64) { this.fileDataBase64 = fileDataBase64; }
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public Instant getApprovedAt() { return approvedAt; }
    public void setApprovedAt(Instant approvedAt) { this.approvedAt = approvedAt; }
    public Long getSupersededById() { return supersededById; }
    public void setSupersededById(Long supersededById) { this.supersededById = supersededById; }
    public String getWithdrawalReason() { return withdrawalReason; }
    public void setWithdrawalReason(String withdrawalReason) { this.withdrawalReason = withdrawalReason; }
    public int getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(int displayOrder) { this.displayOrder = displayOrder; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
