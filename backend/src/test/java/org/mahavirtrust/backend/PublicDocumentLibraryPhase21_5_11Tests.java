package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.document.DocumentStatusUpdateRequest;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.PublicDocument;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.PublicDocumentRepository;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class PublicDocumentLibraryPhase21_5_11Tests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PublicDocumentRepository documentRepository;

    @Autowired
    private AdminUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private AdminUser createAdmin(String username, Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            AdminUser user = new AdminUser(
                    username,
                    username + "@mect.org.in",
                    passwordEncoder.encode("SecretPass2026!"),
                    "Admin " + username,
                    role
            );
            return userRepository.save(user);
        });
    }

    private String getAuthToken(String username, Role role) {
        AdminUser user = createAdmin(username, role);
        return tokenProvider.generateAccessToken(user.getUsername(), user.getRole().name());
    }

    @Test
    @DisplayName("1. Public endpoint /public/documents returns seeded verified records")
    void testPublicDocumentListingReturnsSeededRecords() throws Exception {
        mockMvc.perform(get("/public/documents"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(10))))
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-TR-2013-DEED')].title", hasItem("Registered Public Charitable Trust Deed (Foundational Charter)")))
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-IT-PAN-2013')].category", hasItem("INSTITUTIONAL_IDENTITY")))
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-IT-12A-2024')].category", hasItem("STATUTORY_REGISTRATION")))
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-IT-80G-2024')].category", hasItem("STATUTORY_REGISTRATION")))
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-MCA-CSR1-2024')].issuingAuthority", hasItem(containsString("Ministry of Corporate Affairs"))));
    }

    @Test
    @DisplayName("2. Category filtering returns only matching documents")
    void testCategoryFiltering() throws Exception {
        mockMvc.perform(get("/public/documents").param("category", "ANNUAL_REPORT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[*].category", everyItem(is("ANNUAL_REPORT"))));
    }

    @Test
    @DisplayName("3. Financial year filtering returns matching documents")
    void testFinancialYearFiltering() throws Exception {
        mockMvc.perform(get("/public/documents").param("financialYear", "FY 2023-24"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[*].financialYear", everyItem(is("FY 2023-24"))));
    }

    @Test
    @DisplayName("4. Search query matches title, summary, or authority")
    void testSearchFiltering() throws Exception {
        mockMvc.perform(get("/public/documents").param("q", "Balangir"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("5. Accessing unstored binary download returns 404 with helpful message")
    void testUnstoredBinaryDownloadReturns404() throws Exception {
        mockMvc.perform(get("/public/documents/DOC-TR-2013-DEED/download"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("6. Unauthenticated request to /admin/documents returns 401")
    void testUnauthenticatedAdminAccessReturns401() throws Exception {
        mockMvc.perform(get("/admin/documents"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("7. Unauthorized role (VOLUNTEER_COORDINATOR) upload returns 403")
    void testUnauthorizedRoleAdminUploadReturns403() throws Exception {
        String token = getAuthToken("volunteer_user", Role.ROLE_VOLUNTEER_COORDINATOR);
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "%PDF-1.4 test".getBytes()
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("title", "Unauthorized Doc")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2023-24")
                        .param("issuingAuthority", "Board")
                        .param("summary", "Summary"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("8. Authorized ADMIN uploads document with PDF binary and calculates SHA-256")
    void testAuthorizedAdminUploadSucceeds() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        byte[] pdfContent = "%PDF-1.4 sample institutional test report binary".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "annual-report-test.pdf", "application/pdf", pdfContent
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("documentKey", "DOC-TEST-UPLOAD-01")
                        .param("title", "Test Upload Report")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2024-25")
                        .param("issueDate", "2024-11-01")
                        .param("publicationDate", "2024-11-01")
                        .param("version", "1.0")
                        .param("issuingAuthority", "Trust Secretariat")
                        .param("summary", "Sample uploaded document for testing")
                        .param("visibility", "PUBLIC")
                        .param("status", "PUBLISHED"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.documentKey", is("DOC-TEST-UPLOAD-01")))
                .andExpect(jsonPath("$.title", is("Test Upload Report")))
                .andExpect(jsonPath("$.sha256Hash", notNullValue()))
                .andExpect(jsonPath("$.fileSize", is(pdfContent.length)))
                .andExpect(jsonPath("$.hasDownload", is(true)))
                .andExpect(jsonPath("$.downloadUrl", is("/api/v1/public/documents/DOC-TEST-UPLOAD-01/download")));

        // Verify public download
        mockMvc.perform(get("/public/documents/DOC-TEST-UPLOAD-01/download"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", is("application/pdf")))
                .andExpect(header().string("X-Content-Type-Options", is("nosniff")))
                .andExpect(content().bytes(pdfContent));
    }

    @Test
    @DisplayName("9. Invalid file MIME type (text/plain) upload is rejected with 400")
    void testInvalidMimeTypeUploadRejected() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        MockMultipartFile file = new MockMultipartFile(
                "file", "script.sh", "text/plain", "echo malicious".getBytes()
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("title", "Malicious Upload")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2024-25")
                        .param("issuingAuthority", "Hacker")
                        .param("summary", "Should fail"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("10. Excessive file upload (>10MB) is rejected with 400")
    void testExcessiveFileUploadRejected() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        byte[] largeBytes = new byte[11 * 1024 * 1024]; // 11MB
        MockMultipartFile file = new MockMultipartFile(
                "file", "huge.pdf", "application/pdf", largeBytes
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("title", "Huge Doc")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2024-25")
                        .param("issuingAuthority", "Board")
                        .param("summary", "Exceeds limit"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("11. Admin updates document status and logs withdrawal reason")
    void testAdminStatusLifecycleTransitions() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        PublicDocument doc = documentRepository.findByDocumentKey("DOC-IT-80G-2024")
                .orElseThrow();

        DocumentStatusUpdateRequest req = new DocumentStatusUpdateRequest("WITHDRAWN", "Superseded by revised audit notification");

        mockMvc.perform(patch("/admin/documents/" + doc.getId() + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("WITHDRAWN")))
                .andExpect(jsonPath("$.withdrawalReason", is("Superseded by revised audit notification")));

        // Verify withdrawn document is hidden from public list
        mockMvc.perform(get("/public/documents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.documentKey == 'DOC-IT-80G-2024')]", hasSize(0)));
    }

    @Test
    @DisplayName("12. Admin supersedes an older document preserving traceability")
    void testSupersedeDocumentPreservesHistory() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        PublicDocument oldDoc = documentRepository.findByDocumentKey("DOC-AR-2021-22").orElseThrow();
        PublicDocument newDoc = documentRepository.findByDocumentKey("DOC-AR-2022-23").orElseThrow();

        mockMvc.perform(post("/admin/documents/" + oldDoc.getId() + "/supersede/" + newDoc.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SUPERSEDED")));

        PublicDocument updatedOld = documentRepository.findById(oldDoc.getId()).orElseThrow();
        assertEquals("SUPERSEDED", updatedOld.getStatus());
        assertEquals(newDoc.getId(), updatedOld.getSupersededById());
    }

    @Test
    @DisplayName("13. Draft document with binary cannot be downloaded via public URL")
    void testDraftDocumentCannotBeDownloadedPublicly() throws Exception {
        String token = getAuthToken("admin_user", Role.ROLE_ADMIN);
        byte[] pdfContent = "%PDF-1.4 draft doc".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "draft.pdf", "application/pdf", pdfContent
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("documentKey", "DOC-DRAFT-PRIVATE")
                        .param("title", "Draft Private Doc")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2024-25")
                        .param("issuingAuthority", "Board")
                        .param("summary", "Draft under review")
                        .param("status", "DRAFT"))
                .andExpect(status().isCreated());

        // Public download must return 403 Forbidden
        mockMvc.perform(get("/public/documents/DOC-DRAFT-PRIVATE/download"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("14. Auditor role can view all admin documents but cannot upload")
    void testAuditorCanViewAdminDocumentsButCannotUpload() throws Exception {
        String token = getAuthToken("auditor_user", Role.ROLE_AUDITOR);
        mockMvc.perform(get("/admin/documents")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(10))));

        MockMultipartFile file = new MockMultipartFile(
                "file", "test.pdf", "application/pdf", "%PDF-1.4 test".getBytes()
        );

        mockMvc.perform(multipart("/admin/documents")
                        .file(file)
                        .header("Authorization", "Bearer " + token)
                        .param("title", "Auditor Upload")
                        .param("category", "ANNUAL_REPORT")
                        .param("financialYear", "FY 2024-25")
                        .param("issuingAuthority", "Auditor")
                        .param("summary", "Should fail"))
                .andExpect(status().isForbidden());
    }
}
