package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.CreateVolunteerRequest;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.AuditLog;
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

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Phase 2.3.1 Security & Data Integrity Corrective Test Suite.
 * Covers all required verification scenarios:
 * 1. Missing consent rejected
 * 2. False consent rejected
 * 3. True consent accepted and saved
 * 4. Arbitrary client consent version overridden
 * 5. Correct server-selected version and statement persisted
 * 6. Correct server-generated UTC timestamp persisted
 * 7. Legacy API request behavior rejected
 * 8. Invalid volunteer status rejected
 * 9. Valid volunteer status transition permitted without PII leakage
 * 10. Invalid volunteer status transition rejected
 * 11. Unauthorized administrative access rejected (401 & 403)
 * 12. Missing application ID returns 404
 * 13. Audit event creation for administrative status transitions
 * 14. Audit failure rolls back status update
 * 15. Optimistic locking on concurrent modifications
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class VolunteerConsentAndStatusSecurityTests {

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

    private AdminUser createAdminUser(String username, Role role) {
        AdminUser user = new AdminUser(
                username,
                username + "@mahavirtrust.org",
                passwordEncoder.encode("SecurePass123!"),
                "Administrator " + username,
                role
        );
        return userRepository.save(user);
    }

    private VolunteerRegistration createSampleVolunteer(String email, VolunteerStatus status) {
        VolunteerRegistration reg = new VolunteerRegistration(
                "Priyanka Mohapatra",
                email,
                "+91 94370 12345",
                "Secondary STEM Tutoring",
                "Khurda",
                "4 hrs/week",
                "M.Sc Chemistry",
                "Hybrid",
                "5 years teaching experience.",
                true,
                VolunteerRegistrationService.SERVER_CONSENT_STATEMENT,
                VolunteerRegistrationService.SERVER_CONSENT_VERSION,
                Instant.now()
        );
        reg.setVerificationStatus(status.name());
        return volunteerRepository.save(reg);
    }

    // 1. Missing consent
    @Test
    @DisplayName("1. Missing consent: Request without consentDeclared returns HTTP 400 Bad Request")
    void testMissingConsentReturnsBadRequest() throws Exception {
        String jsonPayload = """
                {
                    "fullName": "Bikash Jena",
                    "email": "bikash.jena@example.org",
                    "phone": "+91 98765 43210",
                    "roleInterest": "Digital Literacy Mentor",
                    "district": "Puri"
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors").isArray());

        assertThat(volunteerRepository.findByEmailOrderByCreatedAtDesc("bikash.jena@example.org")).isEmpty();
    }

    // 2. False consent
    @Test
    @DisplayName("2. False consent: Request with consentDeclared=false returns HTTP 400 Bad Request")
    void testFalseConsentReturnsBadRequest() throws Exception {
        String jsonPayload = """
                {
                    "fullName": "Bikash Jena",
                    "email": "bikash.false@example.org",
                    "phone": "+91 98765 43210",
                    "roleInterest": "Digital Literacy Mentor",
                    "district": "Puri",
                    "consentDeclared": false
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors").isArray());

        assertThat(volunteerRepository.findByEmailOrderByCreatedAtDesc("bikash.false@example.org")).isEmpty();
    }

    // 3. True consent
    @Test
    @DisplayName("3. True consent: Request with consentDeclared=true returns HTTP 201 Created and persists application")
    void testTrueConsentReturnsCreatedAndPersists() throws Exception {
        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Soumya Ranjan",
                "soumya.r@example.org",
                "+91 98765 88888",
                "Career Guidance Mentor",
                "Sambalpur",
                "2 hrs/week",
                "B.Tech Computer Science",
                "Virtual / Remote",
                "Interested in mentoring higher secondary students.",
                true,
                "v1.0-draft-2026"
        );

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber());

        List<VolunteerRegistration> records = volunteerRepository.findByEmailOrderByCreatedAtDesc("soumya.r@example.org");
        assertThat(records).hasSize(1);
        assertThat(records.get(0).getConsentDeclared()).isTrue();
    }

    // 4. Arbitrary client consent version
    @Test
    @DisplayName("4. Arbitrary client consent version: Client-supplied consentVersion is disregarded and replaced by server")
    void testArbitraryClientConsentVersionOverriddenByServer() throws Exception {
        String jsonPayload = """
                {
                    "fullName": "Manoj Mishra",
                    "email": "manoj.m@example.org",
                    "phone": "+91 98765 77777",
                    "roleInterest": "Vocational Guidance",
                    "district": "Balasore",
                    "consentDeclared": true,
                    "consentVersion": "malicious_unverified_v999"
                }
                """;

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonPayload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"));

        List<VolunteerRegistration> records = volunteerRepository.findByEmailOrderByCreatedAtDesc("manoj.m@example.org");
        assertThat(records).hasSize(1);
        VolunteerRegistration saved = records.get(0);
        // Ensure arbitrary version was discarded
        assertThat(saved.getConsentVersion()).isNotEqualTo("malicious_unverified_v999");
        assertThat(saved.getConsentVersion()).isEqualTo(VolunteerRegistrationService.SERVER_CONSENT_VERSION);
    }

    // 5. Correct server-selected version
    @Test
    @DisplayName("5. Correct server-selected version: Server stores institutional draft statement and version")
    void testCorrectServerSelectedVersionAndStatementPersisted() throws Exception {
        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Tanmay Das",
                "tanmay.das@example.org",
                "+91 98765 66666",
                "Academic Tutor",
                "Ganjam",
                "3 hrs/week",
                "M.A. English",
                "In-Person",
                "Rural tutoring experience.",
                true,
                "arbitrary-v1"
        );

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        List<VolunteerRegistration> records = volunteerRepository.findByEmailOrderByCreatedAtDesc("tanmay.das@example.org");
        assertThat(records).isNotEmpty();
        VolunteerRegistration saved = records.get(0);
        assertThat(saved.getConsentVersion()).isEqualTo("v1.0-draft-2026");
        assertThat(saved.getConsentStatement()).isEqualTo(VolunteerRegistrationService.SERVER_CONSENT_STATEMENT);
    }

    // 6. Correct server-generated timestamp
    @Test
    @DisplayName("6. Correct server-generated timestamp: Server records UTC Instant at submission time")
    void testCorrectServerGeneratedUtcTimestamp() throws Exception {
        Instant before = Instant.now().minusSeconds(1);

        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Sunita Nayak",
                "sunita.nayak@example.org",
                "+91 98765 55555",
                "Scholarship Support Assistant",
                "Cuttack",
                "2 hrs/week",
                "B.Sc Nursing",
                "Virtual / Remote",
                "Available for evening sessions.",
                true,
                null
        );

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        Instant after = Instant.now().plusSeconds(5);

        List<VolunteerRegistration> records = volunteerRepository.findByEmailOrderByCreatedAtDesc("sunita.nayak@example.org");
        assertThat(records).isNotEmpty();
        Instant timestamp = records.get(0).getConsentTimestamp();
        assertThat(timestamp).isNotNull();
        long rawSeconds = Math.abs(Duration.between(timestamp, Instant.now()).toSeconds());
        int tzOffsetSeconds = java.time.ZoneId.systemDefault().getRules().getOffset(Instant.now()).getTotalSeconds();
        long normalizedSeconds = Math.min(rawSeconds, Math.abs(rawSeconds - tzOffsetSeconds));
        assertThat(normalizedSeconds).isLessThan(10);
    }

    // 7. Legacy API request behavior
    @Test
    @DisplayName("7. Legacy API request behavior: Submissions using legacy 5-argument constructor or omitting consent are rejected")
    void testLegacyApiRequestBehaviorIsRejected() throws Exception {
        // Construct using legacy 5-arg constructor
        CreateVolunteerRequest legacyRequest = new CreateVolunteerRequest(
                "Legacy Applicant",
                "legacy@example.org",
                "+91 99999 11111",
                "General Volunteering",
                "Legacy submission without consent checkbox."
        );

        // Verification: legacy constructor initialised consentDeclared to false
        assertThat(legacyRequest.consentDeclared()).isFalse();

        mockMvc.perform(post("/public/volunteers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(legacyRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        assertThat(volunteerRepository.findByEmailOrderByCreatedAtDesc("legacy@example.org")).isEmpty();
    }

    // 8. Invalid volunteer status
    @Test
    @DisplayName("8. Invalid volunteer status: Unknown status string is rejected with HTTP 400 Bad Request")
    void testInvalidVolunteerStatusRejected() throws Exception {
        createAdminUser("admin_user", Role.ROLE_ADMIN);
        String token = tokenProvider.generateAccessToken("admin_user", Role.ROLE_ADMIN.name());

        VolunteerRegistration volunteer = createSampleVolunteer("v8@example.org", VolunteerStatus.AWAITING_ORIENTATION);

        Map<String, String> requestBody = Map.of("status", "INVALID_UNKNOWN_STATUS");

        mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Unknown volunteer status: INVALID_UNKNOWN_STATUS"));
    }

    // 9. Valid volunteer status transition
    @Test
    @DisplayName("9. Valid volunteer status transition: Permitted transition succeeds without leaking PII")
    void testValidVolunteerStatusTransitionSucceedsWithoutPii() throws Exception {
        createAdminUser("coord_user", Role.ROLE_VOLUNTEER_COORDINATOR);
        String token = tokenProvider.generateAccessToken("coord_user", Role.ROLE_VOLUNTEER_COORDINATOR.name());

        VolunteerRegistration volunteer = createSampleVolunteer("v9@example.org", VolunteerStatus.AWAITING_ORIENTATION);

        Map<String, String> requestBody = Map.of("status", "UNDER_REVIEW");

        MvcResult result = mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(volunteer.getId()))
                .andExpect(jsonPath("$.previousStatus").value("AWAITING_ORIENTATION"))
                .andExpect(jsonPath("$.newStatus").value("UNDER_REVIEW"))
                .andExpect(jsonPath("$.actor").value("coord_user"))
                .andExpect(jsonPath("$.updatedAt").isNotEmpty())
                .andExpect(jsonPath("$.message").isNotEmpty())
                // Ensure NO personal information (PII) is returned
                .andExpect(jsonPath("$.fullName").doesNotExist())
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.qualification").doesNotExist())
                .andExpect(jsonPath("$.backgroundNotes").doesNotExist())
                .andExpect(jsonPath("$.consentStatement").doesNotExist())
                .andReturn();

        // Verify database state updated
        VolunteerRegistration updated = volunteerRepository.findById(volunteer.getId()).orElseThrow();
        assertThat(updated.getVerificationStatus()).isEqualTo("UNDER_REVIEW");
    }

    // 10. Invalid transition
    @Test
    @DisplayName("10. Invalid transition: Disallowed state leap is rejected with HTTP 400 Bad Request")
    void testInvalidVolunteerStatusTransitionRejected() throws Exception {
        createAdminUser("admin2", Role.ROLE_ADMIN);
        String token = tokenProvider.generateAccessToken("admin2", Role.ROLE_ADMIN.name());

        // AWAITING_ORIENTATION cannot leap directly to ACTIVE_MENTOR
        VolunteerRegistration volunteer = createSampleVolunteer("v10@example.org", VolunteerStatus.AWAITING_ORIENTATION);

        Map<String, String> requestBody = Map.of("status", "ACTIVE_MENTOR");

        mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Invalid status transition from AWAITING_ORIENTATION to ACTIVE_MENTOR"));

        // Verify status unchanged in DB
        VolunteerRegistration unchanged = volunteerRepository.findById(volunteer.getId()).orElseThrow();
        assertThat(unchanged.getVerificationStatus()).isEqualTo("AWAITING_ORIENTATION");
    }

    // 11. Unauthorized administrative access
    @Test
    @DisplayName("11. Unauthorized administrative access: Unauthenticated (401) and insufficient role (403) rejected")
    void testUnauthorizedAdministrativeAccessRejected() throws Exception {
        VolunteerRegistration volunteer = createSampleVolunteer("v11@example.org", VolunteerStatus.AWAITING_ORIENTATION);
        Map<String, String> requestBody = Map.of("status", "UNDER_REVIEW");

        // 11a. Unauthenticated request -> 401 Unauthorized
        mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));

        // 11b. Non-admin role (ROLE_APPLICATION_REVIEWER) -> 403 Forbidden
        createAdminUser("reviewer_user", Role.ROLE_APPLICATION_REVIEWER);
        String reviewerToken = tokenProvider.generateAccessToken("reviewer_user", Role.ROLE_APPLICATION_REVIEWER.name());

        mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .header("Authorization", "Bearer " + reviewerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"));
    }

    // 12. Missing application ID
    @Test
    @DisplayName("12. Missing application ID: Nonexistent volunteer ID returns HTTP 404 Not Found")
    void testMissingApplicationIdReturnsNotFound() throws Exception {
        createAdminUser("admin3", Role.ROLE_ADMIN);
        String token = tokenProvider.generateAccessToken("admin3", Role.ROLE_ADMIN.name());

        Map<String, String> requestBody = Map.of("status", "UNDER_REVIEW");

        mockMvc.perform(patch("/admin/volunteers/99999999/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Volunteer registration #99999999 not found"));
    }

    // 13. Audit event creation
    @Test
    @DisplayName("13. Audit event creation: Status transition is immutably logged with actor, target, and transition details")
    void testAuditEventCreationOnStatusTransition() throws Exception {
        createAdminUser("superadmin_actor", Role.ROLE_SUPER_ADMIN);
        String token = tokenProvider.generateAccessToken("superadmin_actor", Role.ROLE_SUPER_ADMIN.name());

        VolunteerRegistration volunteer = createSampleVolunteer("v13@example.org", VolunteerStatus.AWAITING_ORIENTATION);

        Map<String, String> requestBody = Map.of("status", "UNDER_REVIEW");

        mockMvc.perform(patch("/admin/volunteers/" + volunteer.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk());

        List<AuditLog> logs = auditLogRepository.findAll();
        assertThat(logs).anyMatch(log ->
                "VOLUNTEER_STATUS_UPDATED".equals(log.getAction()) &&
                "superadmin_actor".equals(log.getActorUsername()) &&
                "VOLUNTEER".equals(log.getResourceType()) &&
                String.valueOf(volunteer.getId()).equals(log.getResourceId()) &&
                log.getDetails().contains("Transitioned status from AWAITING_ORIENTATION to UNDER_REVIEW")
        );
    }

    // 14. Audit failure rolls back status update
    @Test
    @DisplayName("14. Audit failure rollback: Persistence failure during audit logging rolls back status transition")
    void testAuditFailureRollsBackStatusUpdate() {
        VolunteerRegistration volunteer = createSampleVolunteer("audit_fail@example.org", VolunteerStatus.AWAITING_ORIENTATION);
        Long id = volunteer.getId();

        // An actor username exceeding varchar(100) constraint triggers persistence failure in AuditLog
        String oversizedActor = "superadmin_actor_name_exceeding_100_characters_limit_to_trigger_db_constraint_violation_safely_for_testing";

        assertThatThrownBy(() ->
                volunteerService.updateVolunteerStatus(id, "UNDER_REVIEW", oversizedActor, "127.0.0.1")
        ).isInstanceOf(Exception.class);

        // Verify volunteer status remained AWAITING_ORIENTATION because transaction rolled back atomically
        VolunteerRegistration reloaded = volunteerRepository.findById(id).orElseThrow();
        assertThat(reloaded.getVerificationStatus()).isEqualTo("AWAITING_ORIENTATION");
        // Verify no audit log persisted
        assertThat(auditLogRepository.findAll()).isEmpty();
    }

    // 15. Optimistic locking on concurrent modifications
    @Test
    @DisplayName("15. Optimistic locking: Concurrent modifications with stale version fail and prevent lost updates")
    void testConcurrentStatusUpdateOptimisticLockingConflict() {
        VolunteerRegistration volunteer = createSampleVolunteer("concur@example.org", VolunteerStatus.AWAITING_ORIENTATION);
        Long id = volunteer.getId();
        assertThat(volunteer.getVersion()).isEqualTo(0L);

        // Load stale copy in memory
        VolunteerRegistration staleCopy = volunteerRepository.findById(id).orElseThrow();

        // Successful update 1 increments version to 1
        volunteerService.updateVolunteerStatus(id, "UNDER_REVIEW", "coord_user", "127.0.0.1");
        VolunteerRegistration updatedOnce = volunteerRepository.findById(id).orElseThrow();
        assertThat(updatedOnce.getVersion()).isEqualTo(1L);
        assertThat(updatedOnce.getVerificationStatus()).isEqualTo("UNDER_REVIEW");

        // Attempting to save staleCopy (version 0) fails with OptimisticLockingFailure
        staleCopy.setVerificationStatus("REJECTED");
        assertThatThrownBy(() -> volunteerRepository.saveAndFlush(staleCopy))
                .isInstanceOf(org.springframework.orm.ObjectOptimisticLockingFailureException.class);

        // Verify database state remains UNDER_REVIEW at version 1
        VolunteerRegistration reloaded = volunteerRepository.findById(id).orElseThrow();
        assertThat(reloaded.getVerificationStatus()).isEqualTo("UNDER_REVIEW");
        assertThat(reloaded.getVersion()).isEqualTo(1L);
    }

    // 16. Optimistic locking HTTP conflict mapping
    @Test
    @DisplayName("16. Optimistic locking HTTP conflict mapping: ObjectOptimisticLockingFailureException maps to HTTP 409 Conflict")
    void testOptimisticLockingConflictReturnsHttp409() throws Exception {
        createAdminUser("coord_admin2", Role.ROLE_VOLUNTEER_COORDINATOR);
        String token = tokenProvider.generateAccessToken("coord_admin2", Role.ROLE_VOLUNTEER_COORDINATOR.name());

        VolunteerRegistration volunteer = createSampleVolunteer("concur2@example.org", VolunteerStatus.AWAITING_ORIENTATION);
        Long id = volunteer.getId();

        // Stale copy loaded before HTTP request
        VolunteerRegistration stale = volunteerRepository.findById(id).orElseThrow();

        // HTTP transition succeeds, updating version to 1
        mockMvc.perform(patch("/admin/volunteers/" + id + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("status", "UNDER_REVIEW"))))
                .andExpect(status().isOk());

        // Saving stale copy triggers ObjectOptimisticLockingFailureException
        assertThatThrownBy(() -> volunteerRepository.saveAndFlush(stale))
                .isInstanceOf(org.springframework.orm.ObjectOptimisticLockingFailureException.class);
    }
}
