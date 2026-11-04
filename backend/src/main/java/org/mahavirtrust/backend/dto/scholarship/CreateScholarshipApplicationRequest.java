package org.mahavirtrust.backend.dto.scholarship;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateScholarshipApplicationRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 150, message = "Full name cannot exceed 150 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian mobile number")
    private String phone;

    @NotBlank(message = "Last 4 digits of Aadhaar are required")
    @Pattern(regexp = "^\\d{4}$", message = "Aadhaar must be exactly the last 4 digits")
    private String aadhaarLastFour;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "PIN code is required")
    @Pattern(regexp = "^[1-9]\\d{5}$", message = "PIN code must be a valid 6-digit Indian postal code")
    private String pinCode;

    @NotBlank(message = "Permanent address is required")
    private String permanentAddress;

    @NotBlank(message = "Scheme code is required")
    private String schemeCode;

    @NotBlank(message = "Institution name is required")
    @Size(max = 200, message = "Institution name cannot exceed 200 characters")
    private String institutionName;

    @NotBlank(message = "Institution district is required")
    private String institutionDistrict;

    @NotBlank(message = "Course name is required")
    private String courseName;

    @NotBlank(message = "Current year or semester is required")
    private String currentYearSemester;

    @NotBlank(message = "Roll or Registration number is required")
    private String rollOrRegistrationNumber;

    @NotNull(message = "Annual family income is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Income cannot be negative")
    @DecimalMax(value = "2500000.0", message = "Income exceeds institutional scholarship ceiling")
    private BigDecimal annualFamilyIncome;

    @NotBlank(message = "Tahasildar Income Certificate number is required")
    private String tahasildarCertNumber;

    @NotNull(message = "Tahasildar Certificate issue date is required")
    private LocalDate tahasildarCertIssueDate;

    @NotBlank(message = "College bank name is required")
    private String collegeBankName;

    @NotBlank(message = "College bank account number is required")
    private String collegeBankAccountNumber;

    @NotBlank(message = "College bank IFSC is required")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC format")
    private String collegeBankIfsc;

    @NotBlank(message = "College account holder name is required")
    private String collegeAccountHolderName;

    @NotNull(message = "Tuition fee demanded is required")
    @DecimalMin(value = "1.0", inclusive = true, message = "Tuition fee demanded must be greater than zero")
    private BigDecimal tuitionFeeDemanded;

    @AssertTrue(message = "Applicant must agree to the institutional sworn declaration")
    private Boolean swornDeclaration;

    @NotEmpty(message = "At least one verified document must be uploaded")
    @Valid
    private List<DocumentUploadDto> documents;

    public CreateScholarshipApplicationRequest() {
    }

    // Getters and Setters
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

    public Boolean getSwornDeclaration() {
        return swornDeclaration;
    }

    public void setSwornDeclaration(Boolean swornDeclaration) {
        this.swornDeclaration = swornDeclaration;
    }

    public List<DocumentUploadDto> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentUploadDto> documents) {
        this.documents = documents;
    }
}
