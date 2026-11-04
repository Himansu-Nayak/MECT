package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.auth.LoginRequest;
import org.mahavirtrust.backend.dto.scholarship.CreateScholarshipApplicationRequest;
import org.mahavirtrust.backend.dto.scholarship.DocumentUploadDto;
import org.mahavirtrust.backend.dto.scholarship.ScholarshipStatusUpdateRequest;
import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.ApplicationStatus;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.mahavirtrust.backend.repository.ScholarshipApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ScholarshipApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ScholarshipApplicationRepository scholarshipRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;

    @BeforeEach
    void setUp() throws Exception {
        scholarshipRepository.deleteAll();
        auditLogRepository.deleteAll();

        if (adminUserRepository.findByUsername("scholarship_admin").isEmpty()) {
            AdminUser user = new AdminUser(
                    "scholarship_admin",
                    "scholarship_admin@mahavirtrust.org",
                    passwordEncoder.encode("SecureAdminPass123!"),
                    "Scholarship Administrator",
                    Role.ROLE_SUPER_ADMIN
            );
            user.setStatus(AccountStatus.ACTIVE);
            adminUserRepository.save(user);
        }

        LoginRequest loginRequest = new LoginRequest("scholarship_admin", "SecureAdminPass123!");

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        adminToken = objectMapper.readTree(responseBody).get("accessToken").asText();
    }

    private CreateScholarshipApplicationRequest buildValidRequest() {
        CreateScholarshipApplicationRequest req = new CreateScholarshipApplicationRequest();
        req.setFullName("Chandan Mohapatra");
        req.setEmail("chandan.m@example.com");
        req.setPhone("9876543210");
        req.setAadhaarLastFour("8842");
        req.setDateOfBirth(LocalDate.of(2004, 5, 15));
        req.setGender("Male");
        req.setCategory("SEBC");
        req.setDistrict("Khordha");
        req.setPinCode("751001");
        req.setPermanentAddress("Plot 42, Bapuji Nagar, Bhubaneswar");
        req.setSchemeCode("ENG-AID-DIP");
        req.setInstitutionName("College of Engineering and Technology, Bhubaneswar");
        req.setInstitutionDistrict("Khordha");
        req.setCourseName("B.Tech in Computer Science");
        req.setCurrentYearSemester("3rd Year / 5th Sem");
        req.setRollOrRegistrationNumber("CET-2023-CS-042");
        req.setAnnualFamilyIncome(new BigDecimal("120000.00"));
        req.setTahasildarCertNumber("INC-OD-2026-88912");
        req.setTahasildarCertIssueDate(LocalDate.of(2026, 1, 10));
        req.setCollegeBankName("State Bank of India");
        req.setCollegeBankAccountNumber("30192847561");
        req.setCollegeBankIfsc("SBIN0001023");
        req.setCollegeAccountHolderName("Principal, CET Bhubaneswar");
        req.setTuitionFeeDemanded(new BigDecimal("45000.00"));
        req.setSwornDeclaration(true);

        DocumentUploadDto doc1 = new DocumentUploadDto(
                "INCOME_CERTIFICATE",
                "income_certificate.pdf",
                245120L,
                "application/pdf",
                "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
        DocumentUploadDto doc2 = new DocumentUploadDto(
                "COLLEGE_FEE_DEMAND",
                "fee_demand_letter.pdf",
                185000L,
                "application/pdf",
                "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
        );
        req.setDocuments(List.of(doc1, doc2));
        return req;
    }

    @Test
    @DisplayName("Test 1: Public scholarship application intake successfully creates record with document hashes")
    void testScholarshipApplicationSuccess() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();

        MvcResult result = mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.applicationNumber").exists())
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.fullName").value("Chandan Mohapatra"))
                .andExpect(jsonPath("$.documents.length()").value(2))
                .andExpect(jsonPath("$.documents[0].sha256Hash").value("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"))
                .andReturn();

        String appNumber = objectMapper.readTree(result.getResponse().getContentAsString()).get("applicationNumber").asText();
        assertThat(appNumber).startsWith("MT-SCH-2026-");

        // Verify audit log
        boolean auditFound = auditLogRepository.findAll().stream()
                .anyMatch(a -> "SCHOLARSHIP_APPLIED".equals(a.getAction()) && appNumber.equals(a.getResourceId()));
        assertThat(auditFound).isTrue();
    }

    @Test
    @DisplayName("Test 2: Rejection on missing sworn declaration")
    void testScholarshipApplicationMissingDeclaration() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();
        req.setSwornDeclaration(false);

        mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test 3: Rejection on excessive family income")
    void testScholarshipApplicationExcessiveIncome() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();
        req.setAnnualFamilyIncome(new BigDecimal("3500000.00"));

        mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Test 4: Tracking public application with masked name and timeline stages")
    void testTrackScholarshipApplication() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();

        MvcResult result = mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        String appNumber = objectMapper.readTree(result.getResponse().getContentAsString()).get("applicationNumber").asText();

        mockMvc.perform(get("/public/scholarships/track/" + appNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.applicationNumber").value(appNumber))
                .andExpect(jsonPath("$.maskedName").value("C****** M********"))
                .andExpect(jsonPath("$.institutionName").value("College of Engineering and Technology, Bhubaneswar"))
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andExpect(jsonPath("$.stages.length()").value(5))
                .andExpect(jsonPath("$.stages[0].state").value("CURRENT"))
                .andExpect(jsonPath("$.stages[1].state").value("PENDING"));
    }

    @Test
    @DisplayName("Test 5: Tracking non-existent application returns 404")
    void testTrackNonExistentApplication() throws Exception {
        mockMvc.perform(get("/public/scholarships/track/MT-SCH-2026-INVALID"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Test 6: Administrative status progression and disbursal recording")
    void testAdminScholarshipStatusProgression() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();

        MvcResult createResult = mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();
        Long version = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("version").asLong();

        ScholarshipStatusUpdateRequest updateReq = new ScholarshipStatusUpdateRequest();
        updateReq.setStatus(ApplicationStatus.UNDER_SCRUTINY);
        updateReq.setExpectedVersion(version);

        MvcResult updateResult = mockMvc.perform(patch("/admin/scholarships/" + id + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UNDER_SCRUTINY"))
                .andExpect(jsonPath("$.version").value(1))
                .andReturn();

        Long newVersion = objectMapper.readTree(updateResult.getResponse().getContentAsString()).get("version").asLong();

        ScholarshipStatusUpdateRequest disbursalReq = new ScholarshipStatusUpdateRequest();
        disbursalReq.setStatus(ApplicationStatus.DISBURSED);
        disbursalReq.setDisbursalTransactionRef("RTGS-SBI-20261103-99128");
        disbursalReq.setExpectedVersion(newVersion);

        mockMvc.perform(patch("/admin/scholarships/" + id + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(disbursalReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DISBURSED"))
                .andExpect(jsonPath("$.disbursalTransactionRef").value("RTGS-SBI-20261103-99128"))
                .andExpect(jsonPath("$.disbursalDate").exists());
    }

    @Test
    @DisplayName("Test 7: Optimistic locking conflict detection (HTTP 409) on concurrent update")
    void testOptimisticLockingConflict() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();

        MvcResult createResult = mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Long id = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        ScholarshipStatusUpdateRequest staleReq = new ScholarshipStatusUpdateRequest();
        staleReq.setStatus(ApplicationStatus.COMMITTEE_APPROVED);
        staleReq.setExpectedVersion(99L);

        mockMvc.perform(patch("/admin/scholarships/" + id + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(staleReq)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Test 8: Dashboard stats aggregates volunteer and scholarship figures correctly")
    void testDashboardStats() throws Exception {
        CreateScholarshipApplicationRequest req = buildValidRequest();

        mockMvc.perform(post("/public/scholarships/apply")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/admin/dashboard/stats")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalScholarships").value(1))
                .andExpect(jsonPath("$.submittedScholarships").value(1))
                .andExpect(jsonPath("$.totalDisbursalDemand").value(45000.00));
    }
}
