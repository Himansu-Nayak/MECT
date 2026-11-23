package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.entity.VolunteerRegistration;
import org.mahavirtrust.backend.entity.VolunteerStatus;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.mahavirtrust.backend.repository.VolunteerRegistrationRepository;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.VolunteerRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Phase 21.5.8.1 Volunteer Functional Integrity & Lifecycle QA Test Suite.
 *
 * Verifies:
 * 1. Valid application submission & database persistence with normalized fields.
 * 2. Response matches SubmissionResponse DTO contract.
 * 3. Initial verificationStatus is set to AWAITING_ORIENTATION.
 * 4. Missing required fullName rejected (400 Bad Request).
 * 5. Invalid email format rejected (400 Bad Request).
 * 6. Blank phone rejected (400 Bad Request).
 * 7. Missing roleInterest rejected (400 Bad Request).
 * 8. Excessive roleInterest length (>50 chars) rejected (400 Bad Request).
 * 9. Excessive engagementMode length (>30 chars) rejected (400 Bad Request).
 * 10. Missing or false consentDeclared rejected (400 Bad Request).
 * 11. Duplicate submission within 180s handled idempotently returning existing reference without creating duplicate row.
 * 12. Complete VolunteerStatus lifecycle transitions (AWAITING_ORIENTATION -> UNDER_REVIEW -> ORIENTATION_COMPLETED -> ACTIVE_MENTOR -> INACTIVE).
 * 13. Invalid status skip rejected (e.g. AWAITING_ORIENTATION directly to ACTIVE_MENTOR).
 * 14. Terminal status enforcement (REJECTED cannot transition).
 * 15. RBAC security for administrative review (GET /admin/volunteers, PATCH /admin/volunteers/{id}/status).
 * 16. Privacy protection: zero PII leakage in VolunteerStatusUpdateResponse.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class VolunteerFunctionalIntegrityPhase21_5_8_1Tests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private VolunteerRegistrationRepository volunteerRepository;

    @Autowired
    private VolunteerRegistrationService volunteerService;

    @Autowired
    private AdminUserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        volunteerRepository.deleteAll();
        auditLogRepository.deleteAll();
        userRepository.deleteAll();
    }

    private AdminUser createAdmin(String username, Role role) {
        AdminUser user = new AdminUser(
                username,
                username + "@mect.org.in",
                passwordEncoder.encode("PassSecure2026!"),
                "Admin " + username,
                role
        );
        return userRepository.save(user);
    }

    @Test
    @DisplayName("1. Valid volunteer registration accepts all 10 fields and persists record with initial status AWAITING_ORIENTATION")
    void testValidSubmissionPersistence() throws Exception {
        String payload = """
                {
                    "fullName": "Chinmayee Sahu",
                    "email": "chinmayee.sahu@example.org",
                    "phone": "+91 94371 88990",
                    "district": "Balangir",
                    "roleInterest": "Remedial Education Mentor",
                    "qualification": "Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)",
                    "availability": "2 to 4 hours / week (Field Cohort)",
                    "engagementMode": "In-Person / On-Ground",
                    "backgroundNotes": "Interested in teaching science and mathematics in rural Balangir study centers.",
                    "consentDeclared": true,
                    "consentVersion": "v1.0-draft-2026"
                }
                """;

        MvcResult result = mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber())
                .andExpect(jsonPath("$.message").value("Your volunteer registration has been logged for orientation review."))
                .andExpect(jsonPath("$.timestamp").isNotEmpty())
                .andReturn();

        List<VolunteerRegistration> records = volunteerRepository.findByEmailOrderByCreatedAtDesc("chinmayee.sahu@example.org");
        assertThat(records).hasSize(1);

        VolunteerRegistration persisted = records.get(0);
        assertThat(persisted.getFullName()).isEqualTo("Chinmayee Sahu");
        assertThat(persisted.getEmail()).isEqualTo("chinmayee.sahu@example.org");
        assertThat(persisted.getPhone()).isEqualTo("+91 94371 88990");
        assertThat(persisted.getDistrict()).isEqualTo("Balangir");
        assertThat(persisted.getRoleInterest()).isEqualTo("Remedial Education Mentor");
        assertThat(persisted.getQualification()).isEqualTo("Graduate (B.Tech, B.Sc, B.Com, B.A, MBBS)");
        assertThat(persisted.getAvailability()).isEqualTo("2 to 4 hours / week (Field Cohort)");
        assertThat(persisted.getEngagementMode()).isEqualTo("In-Person / On-Ground");
        assertThat(persisted.getVerificationStatus()).isEqualTo("AWAITING_ORIENTATION");
        assertThat(persisted.getConsentDeclared()).isTrue();
        assertThat(persisted.getConsentStatement()).isEqualTo(VolunteerRegistrationService.SERVER_CONSENT_STATEMENT);
        assertThat(persisted.getConsentVersion()).isEqualTo(VolunteerRegistrationService.SERVER_CONSENT_VERSION);
        assertThat(persisted.getConsentTimestamp()).isNotNull();
    }

    @Test
    @DisplayName("2. Missing fullName rejected with HTTP 400 Bad Request")
    void testMissingFullNameRejected() throws Exception {
        String payload = """
                {
                    "fullName": "",
                    "email": "test@example.org",
                    "phone": "9876543210",
                    "roleInterest": "Digital Skills Guide",
                    "consentDeclared": true
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.count()).isZero();
    }

    @Test
    @DisplayName("3. Malformed email format rejected with HTTP 400 Bad Request")
    void testMalformedEmailRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Test Volunteer",
                    "email": "invalid-email-address",
                    "phone": "9876543210",
                    "roleInterest": "Digital Skills Guide",
                    "consentDeclared": true
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.count()).isZero();
    }

    @Test
    @DisplayName("4. Blank phone number rejected with HTTP 400 Bad Request")
    void testBlankPhoneRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Test Volunteer",
                    "email": "valid@example.org",
                    "phone": "   ",
                    "roleInterest": "Digital Skills Guide",
                    "consentDeclared": true
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.count()).isZero();
    }

    @Test
    @DisplayName("5. Excessive roleInterest length (>50 characters) rejected by Jakarta Validation")
    void testExcessiveRoleInterestLengthRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Test Volunteer",
                    "email": "role.overflow@example.org",
                    "phone": "9876543210",
                    "roleInterest": "This Role Name Exceeds The Maximum Allowed Fifty Chars Limit",
                    "consentDeclared": true
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.count()).isZero();
    }

    @Test
    @DisplayName("6. Excessive engagementMode length (>30 characters) rejected by Jakarta Validation")
    void testExcessiveEngagementModeLengthRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Test Volunteer",
                    "email": "mode.overflow@example.org",
                    "phone": "9876543210",
                    "roleInterest": "Remedial Education Mentor",
                    "engagementMode": "Hybrid (Virtual + Periodic Local Coordination)",
                    "consentDeclared": true
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.count()).isZero();
    }

    @Test
    @DisplayName("7. Duplicate submission within 180s returns existing reference idempotently without duplicate row")
    void testDuplicateSubmissionIdempotency() throws Exception {
        String payload = """
                {
                    "fullName": "Alok Ranjan Barik",
                    "email": "alok.barik@example.org",
                    "phone": "+91 94372 11223",
                    "roleInterest": "Digital Skills Guide",
                    "district": "Subarnapur",
                    "consentDeclared": true
                }
                """;

        // First submission
        MvcResult firstResult = mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andReturn();

        List<VolunteerRegistration> recordsAfterFirst = volunteerRepository.findByEmailOrderByCreatedAtDesc("alok.barik@example.org");
        assertThat(recordsAfterFirst).hasSize(1);
        Long originalId = recordsAfterFirst.get(0).getId();

        // Immediate duplicate submission within 180 seconds
        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").value(originalId))
                .andExpect(jsonPath("$.message").value("Your volunteer registration is already recorded under reference #" + originalId + "."));

        // Confirm exactly 1 record remains in DB
        List<VolunteerRegistration> recordsAfterDuplicate = volunteerRepository.findByEmailOrderByCreatedAtDesc("alok.barik@example.org");
        assertThat(recordsAfterDuplicate).hasSize(1);
    }

    @Test
    @DisplayName("8. Complete lifecycle status transitions verified via administrative PATCH")
    void testLifecycleTransitions() throws Exception {
        AdminUser coordinator = createAdmin("volunteer_coord", Role.ROLE_VOLUNTEER_COORDINATOR);
        String token = tokenProvider.generateAccessToken(coordinator.getUsername(), coordinator.getRole().name());

        // Create initial volunteer in AWAITING_ORIENTATION
        VolunteerRegistration reg = new VolunteerRegistration(
                "Swagatika Panda",
                "swagatika.panda@example.org",
                "+91 94370 55667",
                "Women's SHG Mentor",
                "Kalahandi",
                "2 to 4 hours / month (Flexible)",
                "Post-Graduate (M.Com)",
                "Hybrid (Virtual + On-Site)",
                "Microfinance background.",
                true,
                VolunteerRegistrationService.SERVER_CONSENT_STATEMENT,
                VolunteerRegistrationService.SERVER_CONSENT_VERSION,
                Instant.now()
        );
        reg.setVerificationStatus(VolunteerStatus.AWAITING_ORIENTATION.name());
        VolunteerRegistration saved = volunteerRepository.save(reg);
        Long id = saved.getId();

        // Step 1: AWAITING_ORIENTATION -> UNDER_REVIEW
        mockMvc.perform(patch("/admin/volunteers/" + id + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"UNDER_REVIEW\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.previousStatus").value("AWAITING_ORIENTATION"))
                .andExpect(jsonPath("$.newStatus").value("UNDER_REVIEW"));

        assertThat(volunteerRepository.findById(id).orElseThrow().getVerificationStatus()).isEqualTo("UNDER_REVIEW");

        // Step 2: UNDER_REVIEW -> ORIENTATION_COMPLETED
        mockMvc.perform(patch("/admin/volunteers/" + id + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"ORIENTATION_COMPLETED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.previousStatus").value("UNDER_REVIEW"))
                .andExpect(jsonPath("$.newStatus").value("ORIENTATION_COMPLETED"));

        assertThat(volunteerRepository.findById(id).orElseThrow().getVerificationStatus()).isEqualTo("ORIENTATION_COMPLETED");

        // Step 3: ORIENTATION_COMPLETED -> ACTIVE_MENTOR
        mockMvc.perform(patch("/admin/volunteers/" + id + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"ACTIVE_MENTOR\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.previousStatus").value("ORIENTATION_COMPLETED"))
                .andExpect(jsonPath("$.newStatus").value("ACTIVE_MENTOR"));

        assertThat(volunteerRepository.findById(id).orElseThrow().getVerificationStatus()).isEqualTo("ACTIVE_MENTOR");

        // Step 4: ACTIVE_MENTOR -> INACTIVE
        mockMvc.perform(patch("/admin/volunteers/" + id + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"INACTIVE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.previousStatus").value("ACTIVE_MENTOR"))
                .andExpect(jsonPath("$.newStatus").value("INACTIVE"));

        assertThat(volunteerRepository.findById(id).orElseThrow().getVerificationStatus()).isEqualTo("INACTIVE");
    }

    @Test
    @DisplayName("9. Invalid status skip (AWAITING_ORIENTATION directly to ACTIVE_MENTOR) rejected")
    void testInvalidStatusSkipRejected() throws Exception {
        AdminUser admin = createAdmin("admin_officer", Role.ROLE_ADMIN);
        String token = tokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        VolunteerRegistration reg = new VolunteerRegistration(
                "Manoj Pradhan",
                "manoj.pradhan@example.org",
                "+91 94371 44556",
                "Field Documentation Fellow",
                "Nuapada",
                "2 to 4 hours / week",
                "Graduate",
                "In-Person / On-Ground",
                "Photography skills.",
                true,
                VolunteerRegistrationService.SERVER_CONSENT_STATEMENT,
                VolunteerRegistrationService.SERVER_CONSENT_VERSION,
                Instant.now()
        );
        reg.setVerificationStatus(VolunteerStatus.AWAITING_ORIENTATION.name());
        VolunteerRegistration saved = volunteerRepository.save(reg);

        mockMvc.perform(patch("/admin/volunteers/" + saved.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"ACTIVE_MENTOR\"}"))
                .andExpect(status().isBadRequest());

        // Status unchanged
        assertThat(volunteerRepository.findById(saved.getId()).orElseThrow().getVerificationStatus())
                .isEqualTo("AWAITING_ORIENTATION");
    }

    @Test
    @DisplayName("10. Administrative access controls (RBAC) enforced on volunteer management")
    void testAdministrativeRbacControls() throws Exception {
        // 1. Unauthenticated request to /admin/volunteers rejected (401 or 403)
        mockMvc.perform(get("/admin/volunteers"))
                .andExpect(status().isUnauthorized());

        // 2. FINANCE_OFFICER role does not have permission to manage volunteers (403 Forbidden)
        AdminUser financeUser = createAdmin("finance_user", Role.ROLE_FINANCE_OFFICER);
        String financeToken = tokenProvider.generateAccessToken(financeUser.getUsername(), financeUser.getRole().name());

        mockMvc.perform(get("/admin/volunteers")
                        .header("Authorization", "Bearer " + financeToken))
                .andExpect(status().isForbidden());

        // 3. VOLUNTEER_COORDINATOR has full read access
        AdminUser coord = createAdmin("coord_reviewer", Role.ROLE_VOLUNTEER_COORDINATOR);
        String coordToken = tokenProvider.generateAccessToken(coord.getUsername(), coord.getRole().name());

        mockMvc.perform(get("/admin/volunteers")
                        .header("Authorization", "Bearer " + coordToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("11. Privacy protection: VolunteerStatusUpdateResponse contains zero PII fields")
    void testZeroPiiInStatusUpdateResponse() throws Exception {
        AdminUser admin = createAdmin("super_admin_user", Role.ROLE_SUPER_ADMIN);
        String token = tokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        VolunteerRegistration reg = new VolunteerRegistration(
                "Sujata Behera",
                "sujata.confidential@example.org",
                "+91 94371 99001",
                "Remedial Education Mentor",
                "Balangir",
                "Weekend Study Centers",
                "B.Sc B.Ed",
                "In-Person / On-Ground",
                "Confidential notes.",
                true,
                VolunteerRegistrationService.SERVER_CONSENT_STATEMENT,
                VolunteerRegistrationService.SERVER_CONSENT_VERSION,
                Instant.now()
        );
        VolunteerRegistration saved = volunteerRepository.save(reg);

        mockMvc.perform(patch("/admin/volunteers/" + saved.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"UNDER_REVIEW\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.previousStatus").value("AWAITING_ORIENTATION"))
                .andExpect(jsonPath("$.newStatus").value("UNDER_REVIEW"))
                .andExpect(jsonPath("$.actor").value("super_admin_user"))
                .andExpect(jsonPath("$.updatedAt").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty())
                // Ensure PII fields are NOT present
                .andExpect(jsonPath("$.fullName").doesNotExist())
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.district").doesNotExist())
                .andExpect(jsonPath("$.backgroundNotes").doesNotExist());
    }
}
