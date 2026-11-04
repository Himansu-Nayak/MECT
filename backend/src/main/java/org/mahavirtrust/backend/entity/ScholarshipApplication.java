package org.mahavirtrust.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scholarship_applications")
public class ScholarshipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_number", nullable = false, unique = true, length = 32)
    private String applicationNumber;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 15)
    private String phone;

    @Column(name = "aadhaar_last_four", nullable = false, length = 4)
    private String aadhaarLastFour;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "gender", nullable = false, length = 20)
    private String gender;

    @Column(name = "category", nullable = false, length = 30)
    private String category;

    @Column(name = "district", nullable = false, length = 50)
    private String district;

    @Column(name = "pin_code", nullable = false, length = 6)
    private String pinCode;

    @Column(name = "permanent_address", nullable = false, columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "scheme_code", nullable = false, length = 50)
    private String schemeCode;

    @Column(name = "institution_name", nullable = false, length = 200)
    private String institutionName;

    @Column(name = "institution_district", nullable = false, length = 50)
    private String institutionDistrict;

    @Column(name = "course_name", nullable = false, length = 100)
    private String courseName;

    @Column(name = "current_year_semester", nullable = false, length = 50)
    private String currentYearSemester;

    @Column(name = "roll_or_registration_number", nullable = false, length = 100)
    private String rollOrRegistrationNumber;

    @Column(name = "annual_family_income", nullable = false, precision = 12, scale = 2)
    private BigDecimal annualFamilyIncome;

    @Column(name = "tahasildar_cert_number", nullable = false, length = 100)
    private String tahasildarCertNumber;

    @Column(name = "tahasildar_cert_issue_date", nullable = false)
    private LocalDate tahasildarCertIssueDate;

    @Column(name = "college_bank_name", nullable = false, length = 100)
    private String collegeBankName;

    @Column(name = "college_bank_account_number", nullable = false, length = 50)
    private String collegeBankAccountNumber;

    @Column(name = "college_bank_ifsc", nullable = false, length = 20)
    private String collegeBankIfsc;

    @Column(name = "college_account_holder_name", nullable = false, length = 150)
    private String collegeAccountHolderName;

    @Column(name = "tuition_fee_demanded", nullable = false, precision = 12, scale = 2)
    private BigDecimal tuitionFeeDemanded;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "action_required_note", columnDefinition = "TEXT")
    private String actionRequiredNote;

    @Column(name = "disbursal_transaction_ref", length = 100)
    private String disbursalTransactionRef;

    @Column(name = "disbursal_date")
    private Instant disbursalDate;

    @Column(name = "sworn_declaration", nullable = false)
    private Boolean swornDeclaration = false;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ScholarshipDocument> documents = new ArrayList<>();

    public ScholarshipApplication() {
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public void addDocument(ScholarshipDocument document) {
        documents.add(document);
        document.setApplication(this);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAadhaarLastFour() {
        return aadhaarLastFour;
    }

    public void setAadhaarLastFour(String aadhaarLastFour) {
        this.aadhaarLastFour = aadhaarLastFour;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public void setPermanentAddress(String permanentAddress) {
        this.permanentAddress = permanentAddress;
    }

    public String getSchemeCode() {
        return schemeCode;
    }

    public void setSchemeCode(String schemeCode) {
        this.schemeCode = schemeCode;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getInstitutionDistrict() {
        return institutionDistrict;
    }

    public void setInstitutionDistrict(String institutionDistrict) {
        this.institutionDistrict = institutionDistrict;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCurrentYearSemester() {
        return currentYearSemester;
    }

    public void setCurrentYearSemester(String currentYearSemester) {
        this.currentYearSemester = currentYearSemester;
    }

    public String getRollOrRegistrationNumber() {
        return rollOrRegistrationNumber;
    }

    public void setRollOrRegistrationNumber(String rollOrRegistrationNumber) {
        this.rollOrRegistrationNumber = rollOrRegistrationNumber;
    }

    public BigDecimal getAnnualFamilyIncome() {
        return annualFamilyIncome;
    }

    public void setAnnualFamilyIncome(BigDecimal annualFamilyIncome) {
        this.annualFamilyIncome = annualFamilyIncome;
    }

    public String getTahasildarCertNumber() {
        return tahasildarCertNumber;
    }

    public void setTahasildarCertNumber(String tahasildarCertNumber) {
        this.tahasildarCertNumber = tahasildarCertNumber;
    }

    public LocalDate getTahasildarCertIssueDate() {
        return tahasildarCertIssueDate;
    }

    public void setTahasildarCertIssueDate(LocalDate tahasildarCertIssueDate) {
        this.tahasildarCertIssueDate = tahasildarCertIssueDate;
    }

    public String getCollegeBankName() {
        return collegeBankName;
    }

    public void setCollegeBankName(String collegeBankName) {
        this.collegeBankName = collegeBankName;
    }

    public String getCollegeBankAccountNumber() {
        return collegeBankAccountNumber;
    }

    public void setCollegeBankAccountNumber(String collegeBankAccountNumber) {
        this.collegeBankAccountNumber = collegeBankAccountNumber;
    }

    public String getCollegeBankIfsc() {
        return collegeBankIfsc;
    }

    public void setCollegeBankIfsc(String collegeBankIfsc) {
        this.collegeBankIfsc = collegeBankIfsc;
    }

    public String getCollegeAccountHolderName() {
        return collegeAccountHolderName;
    }

    public void setCollegeAccountHolderName(String collegeAccountHolderName) {
        this.collegeAccountHolderName = collegeAccountHolderName;
    }

    public BigDecimal getTuitionFeeDemanded() {
        return tuitionFeeDemanded;
    }

    public void setTuitionFeeDemanded(BigDecimal tuitionFeeDemanded) {
        this.tuitionFeeDemanded = tuitionFeeDemanded;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getActionRequiredNote() {
        return actionRequiredNote;
    }

    public void setActionRequiredNote(String actionRequiredNote) {
        this.actionRequiredNote = actionRequiredNote;
    }

    public String getDisbursalTransactionRef() {
        return disbursalTransactionRef;
    }

    public void setDisbursalTransactionRef(String disbursalTransactionRef) {
        this.disbursalTransactionRef = disbursalTransactionRef;
    }

    public Instant getDisbursalDate() {
        return disbursalDate;
    }

    public void setDisbursalDate(Instant disbursalDate) {
        this.disbursalDate = disbursalDate;
    }

    public Boolean getSwornDeclaration() {
        return swornDeclaration;
    }

    public void setSwornDeclaration(Boolean swornDeclaration) {
        this.swornDeclaration = swornDeclaration;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ScholarshipDocument> getDocuments() {
        return documents;
    }

    public void setDocuments(List<ScholarshipDocument> documents) {
        this.documents = documents;
    }
}
