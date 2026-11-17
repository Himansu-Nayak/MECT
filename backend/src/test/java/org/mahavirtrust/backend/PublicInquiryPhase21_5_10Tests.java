package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.PublicInquiry;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.PublicInquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Phase 21.5.10 Public Secretariat Inquiry & Guidance Desk Verification Suite.
 *
 * Verifies:
 * 1. Valid inquiry submission accepts standard fields, assigns reference ID, and persists with status PENDING_REVIEW.
 * 2. Duplicate submission defense: submitting the same email and message within 3 minutes returns existing reference without creating duplicate record.
 * 3. Validation rejection: Blank full name (400 Bad Request).
 * 4. Validation rejection: Invalid email format (400 Bad Request).
 * 5. Validation rejection: Blank phone number (400 Bad Request).
 * 6. Validation rejection: Blank category (400 Bad Request).
 * 7. Validation rejection: Blank message content (400 Bad Request).
 * 8. Validation rejection: Message exceeding 5000 characters (400 Bad Request).
 * 9. XSS / Script Sanitization: Strips `<script>` tags and HTML entities from persisted message.
 * 10. Role-based security: Unauthenticated GET /api/v1/admin/inquiries returns 401 Unauthorized.
 * 11. Role-based security: Unauthorized role (e.g. ROLE_VOLUNTEER_COORDINATOR) returns 403 Forbidden.
 * 12. Role-based security: Authorized roles (ROLE_ADMIN, ROLE_SUPER_ADMIN, ROLE_APPLICATION_REVIEWER) can retrieve inquiries.
 * 13. Status lifecycle update: PATCH /api/v1/admin/inquiries/{id}/status transitions status (e.g. UNDER_REVIEW, RESPONDED).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PublicInquiryPhase21_5_10Tests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PublicInquiryRepository inquiryRepository;

    @Autowired
    private PublicInquiryService inquiryService;

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
        inquiryRepository.deleteAll();
        auditLogRepository.deleteAll();
        userRepository.deleteAll();
    }

    private AdminUser createAdmin(String username, Role role) {
        AdminUser user = new AdminUser(
                username,
                username + "@mect.org.in",
                passwordEncoder.encode("SecretPass2026!"),
                "Admin " + username,
                role
        );
        return userRepository.save(user);
    }

    @Test
    @DisplayName("1. Valid inquiry submission persists to database with PENDING_REVIEW and returns reference ID")
    void testValidInquirySubmission() throws Exception {
        String payload = """
                {
                    "fullName": "Sradhanjali Mishra",
                    "email": "sradhanjali.mishra@example.org",
                    "phone": "+91 94371 55667",
                    "category": "Scholarship Guidance & Applications",
                    "message": "Inquiring about eligibility documentation for degree college grants in Balangir district."
                }
                """;

        MvcResult result = mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber())
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andReturn();

        List<PublicInquiry> saved = inquiryRepository.findAll();
        assertThat(saved).hasSize(1);
        PublicInquiry inquiry = saved.get(0);
        assertThat(inquiry.getFullName()).isEqualTo("Sradhanjali Mishra");
        assertThat(inquiry.getEmail()).isEqualTo("sradhanjali.mishra@example.org");
        assertThat(inquiry.getPhone()).isEqualTo("+91 94371 55667");
        assertThat(inquiry.getCategory()).isEqualTo("Scholarship Guidance & Applications");
        assertThat(inquiry.getStatus()).isEqualTo("PENDING_REVIEW");
        assertThat(inquiry.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("2. Duplicate submission within 180s returns existing reference ID without duplicate record")
    void testDuplicateSubmissionDefense() throws Exception {
        String payload = """
                {
                    "fullName": "Debendra Padhi",
                    "email": "debendra.padhi@example.org",
                    "phone": "+91 94371 11223",
                    "category": "General Institutional Inquiry",
                    "message": "Requesting information regarding the registered office working hours in Balangir."
                }
                """;

        // First submission
        MvcResult firstResult = mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        long firstRef = objectMapper.readTree(firstResult.getResponse().getContentAsString())
                .get("referenceId").asLong();

        // Second submission with exact same email and message immediately after
        MvcResult secondResult = mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        long secondRef = objectMapper.readTree(secondResult.getResponse().getContentAsString())
                .get("referenceId").asLong();

        assertThat(secondRef).isEqualTo(firstRef);

        // Verify total records in DB is strictly 1 (no duplicate insertion)
        List<PublicInquiry> all = inquiryRepository.findAll();
        assertThat(all).hasSize(1);
    }

    @Test
    @DisplayName("3. Rejection of blank full name")
    void testBlankFullNameRejected() throws Exception {
        String payload = """
                {
                    "fullName": "   ",
                    "email": "valid@example.org",
                    "phone": "+91 94371 11223",
                    "category": "General Institutional Inquiry",
                    "message": "Valid message context."
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("4. Rejection of invalid email format")
    void testInvalidEmailFormatRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Valid Name",
                    "email": "not-an-email",
                    "phone": "+91 94371 11223",
                    "category": "General Institutional Inquiry",
                    "message": "Valid message context."
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("5. Rejection of blank phone number")
    void testBlankPhoneRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Valid Name",
                    "email": "valid@example.org",
                    "phone": "   ",
                    "category": "General Institutional Inquiry",
                    "message": "Valid message context."
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("6. Rejection of blank category")
    void testBlankCategoryRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Valid Name",
                    "email": "valid@example.org",
                    "phone": "+91 94371 11223",
                    "category": "   ",
                    "message": "Valid message context."
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("7. Rejection of blank message content")
    void testBlankMessageRejected() throws Exception {
        String payload = """
                {
                    "fullName": "Valid Name",
                    "email": "valid@example.org",
                    "phone": "+91 94371 11223",
                    "category": "General Institutional Inquiry",
                    "message": "   "
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("8. Rejection of message exceeding 5000 characters")
    void testOversizedMessageRejected() throws Exception {
        String longMessage = "A".repeat(5001);
        String payload = String.format("""
                {
                    "fullName": "Valid Name",
                    "email": "valid@example.org",
                    "phone": "+91 94371 11223",
                    "category": "General Institutional Inquiry",
                    "message": "%s"
                }
                """, longMessage);

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("9. XSS / script tags sanitized from stored message")
    void testXssSanitization() throws Exception {
        String payload = """
                {
                    "fullName": "<script>alert('xss')</script>Priyanka Das",
                    "email": "priyanka.das@example.org",
                    "phone": "+91 94371 99887",
                    "category": "Education & Learning Programmes",
                    "message": "<script>document.cookie='hacked';</script><b>Inquiry regarding</b> study centers."
                }
                """;

        mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated());

        List<PublicInquiry> saved = inquiryRepository.findAll();
        assertThat(saved).hasSize(1);
        PublicInquiry inq = saved.get(0);
        assertThat(inq.getFullName()).doesNotContain("<script>");
        assertThat(inq.getMessage()).doesNotContain("<script>");
        assertThat(inq.getMessage()).doesNotContain("<b>");
        assertThat(inq.getMessage()).contains("Inquiry regarding study centers.");
    }

    @Test
    @DisplayName("10. Unauthenticated GET /admin/inquiries returns 401 Unauthorized")
    void testUnauthenticatedAdminAccessReturns401() throws Exception {
        mockMvc.perform(get("/admin/inquiries"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("11. Unauthorized role returns 403 Forbidden")
    void testUnauthorizedRoleReturns403() throws Exception {
        AdminUser coordinator = createAdmin("coordinator_user", Role.ROLE_VOLUNTEER_COORDINATOR);
        String token = tokenProvider.generateAccessToken(coordinator.getUsername(), coordinator.getRole().name());

        mockMvc.perform(get("/admin/inquiries")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("12. Authorized admin role can retrieve all public inquiries")
    void testAuthorizedAdminCanRetrieveInquiries() throws Exception {
        AdminUser admin = createAdmin("admin_user", Role.ROLE_ADMIN);
        String token = tokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        PublicInquiry inq = new PublicInquiry(
                "Subhashree Sahoo",
                "subhashree@example.org",
                "+91 94371 44556",
                "Scholarship Guidance & Applications",
                "Application query for higher education."
        );
        inquiryRepository.save(inq);

        mockMvc.perform(get("/admin/inquiries")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].fullName").value("Subhashree Sahoo"))
                .andExpect(jsonPath("$[0].email").value("subhashree@example.org"));
    }

    @Test
    @DisplayName("13. Authorized admin can update inquiry status via PATCH")
    void testUpdateInquiryStatus() throws Exception {
        AdminUser admin = createAdmin("super_admin_user", Role.ROLE_SUPER_ADMIN);
        String token = tokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());

        PublicInquiry inq = new PublicInquiry(
                "Tarun Pradhan",
                "tarun.pradhan@example.org",
                "+91 94371 77889",
                "Donations & Receipts Assistance",
                "Requesting confirmation of receipt dispatch."
        );
        PublicInquiry saved = inquiryRepository.save(inq);
        assertThat(saved.getStatus()).isEqualTo("PENDING_REVIEW");

        String updatePayload = """
                {
                    "status": "UNDER_REVIEW"
                }
                """;

        mockMvc.perform(patch("/admin/inquiries/" + saved.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.status").value("UNDER_REVIEW"));

        PublicInquiry reloaded = inquiryRepository.findById(saved.getId()).orElseThrow();
        assertThat(reloaded.getStatus()).isEqualTo("UNDER_REVIEW");
    }
}
