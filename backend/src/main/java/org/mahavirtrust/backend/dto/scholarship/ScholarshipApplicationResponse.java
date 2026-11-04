package org.mahavirtrust.backend.dto.scholarship;

import org.mahavirtrust.backend.entity.ApplicationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class ScholarshipApplicationResponse {

    private Long id;
    private String applicationNumber;
    private String fullName;
    private String email;
    private String phone;
    private String aadhaarLastFour;
    private LocalDate dateOfBirth;
    private String gender;
    private String category;
    private String district;
    private String pinCode;
    private String permanentAddress;
    private String schemeCode;
    private String institutionName;
    private String institutionDistrict;
    private String courseName;
    private String currentYearSemester;
    private String rollOrRegistrationNumber;
    private BigDecimal annualFamilyIncome;
    private String tahasildarCertNumber;
    private LocalDate tahasildarCertIssueDate;
    private String collegeBankName;
    private String collegeBankAccountNumber;
    private String collegeBankIfsc;
    private String collegeAccountHolderName;
    private BigDecimal tuitionFeeDemanded;
    private ApplicationStatus status;
    private String rejectionReason;
    private String actionRequiredNote;
    private String disbursalTransactionRef;
    private Instant disbursalDate;
    private Long version;
    private Instant createdAt;
    private Instant updatedAt;
    private List<DocumentDto> documents;

    public static class DocumentDto {
        private Long id;
        private String documentType;
        private String fileName;
        private Long fileSizeBytes;
        private String mimeType;
        private String sha256Hash;
        private Instant uploadedAt;

        public DocumentDto() {}

        public DocumentDto(Long id, String documentType, String fileName, Long fileSizeBytes, String mimeType, String sha256Hash, Instant uploadedAt) {
            this.id = id;
            this.documentType = documentType;
            this.fileName = fileName;
            this.fileSizeBytes = fileSizeBytes;
            this.mimeType = mimeType;
            this.sha256Hash = sha256Hash;
            this.uploadedAt = uploadedAt;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getDocumentType() { return documentType; }
        public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public Long getFileSizeBytes() { return fileSizeBytes; }
        public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }
        public String getMimeType() { return mimeType; }
        public void setMimeType(String mimeType) { this.mimeType = mimeType; }
        public String getSha256Hash() { return sha256Hash; }
        public void setSha256Hash(String sha256Hash) { this.sha256Hash = sha256Hash; }
        public Instant getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
    }

    public ScholarshipApplicationResponse() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAadhaarLastFour() { return aadhaarLastFour; }
    public void setAadhaarLastFour(String aadhaarLastFour) { this.aadhaarLastFour = aadhaarLastFour; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }
    public String getPermanentAddress() { return permanentAddress; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }
    public String getSchemeCode() { return schemeCode; }
    public void setSchemeCode(String schemeCode) { this.schemeCode = schemeCode; }
    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }
    public String getInstitutionDistrict() { return institutionDistrict; }
    public void setInstitutionDistrict(String institutionDistrict) { this.institutionDistrict = institutionDistrict; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getCurrentYearSemester() { return currentYearSemester; }
    public void setCurrentYearSemester(String currentYearSemester) { this.currentYearSemester = currentYearSemester; }
    public String getRollOrRegistrationNumber() { return rollOrRegistrationNumber; }
    public void setRollOrRegistrationNumber(String rollOrRegistrationNumber) { this.rollOrRegistrationNumber = rollOrRegistrationNumber; }
    public BigDecimal getAnnualFamilyIncome() { return annualFamilyIncome; }
    public void setAnnualFamilyIncome(BigDecimal annualFamilyIncome) { this.annualFamilyIncome = annualFamilyIncome; }
    public String getTahasildarCertNumber() { return tahasildarCertNumber; }
    public void setTahasildarCertNumber(String tahasildarCertNumber) { this.tahasildarCertNumber = tahasildarCertNumber; }
    public LocalDate getTahasildarCertIssueDate() { return tahasildarCertIssueDate; }
    public void setTahasildarCertIssueDate(LocalDate tahasildarCertIssueDate) { this.tahasildarCertIssueDate = tahasildarCertIssueDate; }
    public String getCollegeBankName() { return collegeBankName; }
    public void setCollegeBankName(String collegeBankName) { this.collegeBankName = collegeBankName; }
    public String getCollegeBankAccountNumber() { return collegeBankAccountNumber; }
    public void setCollegeBankAccountNumber(String collegeBankAccountNumber) { this.collegeBankAccountNumber = collegeBankAccountNumber; }
    public String getCollegeBankIfsc() { return collegeBankIfsc; }
    public void setCollegeBankIfsc(String collegeBankIfsc) { this.collegeBankIfsc = collegeBankIfsc; }
    public String getCollegeAccountHolderName() { return collegeAccountHolderName; }
    public void setCollegeAccountHolderName(String collegeAccountHolderName) { this.collegeAccountHolderName = collegeAccountHolderName; }
    public BigDecimal getTuitionFeeDemanded() { return tuitionFeeDemanded; }
    public void setTuitionFeeDemanded(BigDecimal tuitionFeeDemanded) { this.tuitionFeeDemanded = tuitionFeeDemanded; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getActionRequiredNote() { return actionRequiredNote; }
    public void setActionRequiredNote(String actionRequiredNote) { this.actionRequiredNote = actionRequiredNote; }
    public String getDisbursalTransactionRef() { return disbursalTransactionRef; }
    public void setDisbursalTransactionRef(String disbursalTransactionRef) { this.disbursalTransactionRef = disbursalTransactionRef; }
    public Instant getDisbursalDate() { return disbursalDate; }
    public void setDisbursalDate(Instant disbursalDate) { this.disbursalDate = disbursalDate; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public List<DocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<DocumentDto> documents) { this.documents = documents; }
}
