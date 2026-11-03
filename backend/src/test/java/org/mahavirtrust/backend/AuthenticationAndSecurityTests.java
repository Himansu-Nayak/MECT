package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.CreateInquiryRequest;
import org.mahavirtrust.backend.dto.auth.LoginRequest;
import org.mahavirtrust.backend.dto.auth.TokenRefreshRequest;
import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.Role;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.AuditLogRepository;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.mahavirtrust.backend.repository.RefreshTokenRepository;
import org.mahavirtrust.backend.security.JwtTokenProvider;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthenticationAndSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PublicInquiryRepository inquiryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        auditLogRepository.deleteAll();
        inquiryRepository.deleteAll();
    }

    private AdminUser createTestUser(String username, String rawPassword, Role role) {
        AdminUser user = new AdminUser(
                username,
                username + "@mahavirtrust.org",
                passwordEncoder.encode(rawPassword),
                "Institutional User " + username,
                role
        );
        return userRepository.save(user);
    }

    @Test
    void testSuccessfulAuthenticationReturnsJwtTokens() throws Exception {
        createTestUser("superadmin", "SecurePass123!", Role.ROLE_SUPER_ADMIN);

        LoginRequest request = new LoginRequest("superadmin", "SecurePass123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andExpect(jsonPath("$.role").value("ROLE_SUPER_ADMIN"))
                .andExpect(jsonPath("$.username").value("superadmin"));

        assertThat(auditLogRepository.findAll()).anyMatch(log -> log.getAction().equals("LOGIN_SUCCESS"));
    }

    @Test
    void testInvalidCredentialsRejectedWithUnauthorized() throws Exception {
        createTestUser("trustee1", "CorrectPass123!", Role.ROLE_TRUSTEE);

        LoginRequest invalidRequest = new LoginRequest("trustee1", "WrongPassword!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void testBruteForceLockoutAfterFiveConsecutiveFailures() throws Exception {
        createTestUser("reviewer1", "ReviewerPass123!", Role.ROLE_APPLICATION_REVIEWER);

        LoginRequest badRequest = new LoginRequest("reviewer1", "BadPassword!");

        // First 4 attempts -> Unauthorized (401)
        for (int i = 0; i < 4; i++) {
            mockMvc.perform(post("/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(badRequest)))
                    .andExpect(status().isUnauthorized());
        }

        // 5th attempt triggers lockout -> Locked (423)
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isLocked())
                .andExpect(jsonPath("$.error").value("Account Locked"));

        AdminUser lockedUser = userRepository.findByUsername("reviewer1").orElseThrow();
        assertThat(lockedUser.getStatus()).isEqualTo(AccountStatus.LOCKED);
        assertThat(lockedUser.getLockedUntil()).isNotNull();
    }

    @Test
    void testTokenRefreshRotation() throws Exception {
        createTestUser("finance1", "FinancePass123!", Role.ROLE_FINANCE_OFFICER);

        LoginRequest login = new LoginRequest("finance1", "FinancePass123!");
        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String originalRefreshToken = objectMapper.readTree(responseBody).get("refreshToken").asText();

        TokenRefreshRequest refreshReq = new TokenRefreshRequest(originalRefreshToken);

        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.refreshToken").isNotEmpty())
                .andReturn();

        String newRefreshToken = objectMapper.readTree(refreshResult.getResponse().getContentAsString()).get("refreshToken").asText();
        assertThat(newRefreshToken).isNotEqualTo(originalRefreshToken);

        // Previous refresh token is now revoked -> should be rejected
        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshReq)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testRoleBasedAccessControlAndPrivilegeSeparation() throws Exception {
        createTestUser("reviewer2", "RevPass123!", Role.ROLE_APPLICATION_REVIEWER);
        createTestUser("trustee2", "TrustPass123!", Role.ROLE_TRUSTEE);

        String reviewerToken = tokenProvider.generateAccessToken("reviewer2", "ROLE_APPLICATION_REVIEWER");
        String trusteeToken = tokenProvider.generateAccessToken("trustee2", "ROLE_TRUSTEE");

        // Unauthenticated access to /admin/inquiries returns 401
        mockMvc.perform(get("/admin/inquiries"))
                .andExpect(status().isUnauthorized());

        // Reviewer accessing /admin/inquiries succeeds (200)
        mockMvc.perform(get("/admin/inquiries")
                        .header("Authorization", "Bearer " + reviewerToken))
                .andExpect(status().isOk());

        // Reviewer accessing /admin/audit-logs is denied (403 Forbidden)
        mockMvc.perform(get("/admin/audit-logs")
                        .header("Authorization", "Bearer " + reviewerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Forbidden"));

        // Trustee accessing /admin/audit-logs succeeds (200)
        mockMvc.perform(get("/admin/audit-logs")
                        .header("Authorization", "Bearer " + trusteeToken))
                .andExpect(status().isOk());
    }

    @Test
    void testPublicInquiryDuplicateDefenseAndSanitization() throws Exception {
        CreateInquiryRequest request = new CreateInquiryRequest(
                "Ramesh Sahoo",
                "ramesh.sahoo@example.org",
                "+91 91234 56789",
                "Scholarship Guidance",
                "<script>alert('xss')</script>Need information regarding scholarship."
        );

        // First submission
        MvcResult res1 = mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        long refId1 = objectMapper.readTree(res1.getResponse().getContentAsString()).get("referenceId").asLong();

        // Immediate duplicate submission with identical email & message
        MvcResult res2 = mockMvc.perform(post("/public/inquiries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        long refId2 = objectMapper.readTree(res2.getResponse().getContentAsString()).get("referenceId").asLong();

        // Duplicate defense returns original reference ID and suppresses duplicate database row
        assertThat(refId2).isEqualTo(refId1);

        List<?> inquiries = inquiryRepository.findByEmailOrderByCreatedAtDesc("ramesh.sahoo@example.org");
        assertThat(inquiries).hasSize(1);
    }

    @Test
    void testSqlInjectionAttemptNeutralizedByOrm() throws Exception {
        // Attack payload attempting SQL boolean bypass
        String sqlInjectionPayload = "admin' OR '1'='1";

        LoginRequest attackLogin = new LoginRequest(sqlInjectionPayload, "password");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(attackLogin)))
                .andExpect(status().isUnauthorized());

        assertThat(userRepository.findByUsername(sqlInjectionPayload)).isEmpty();
    }
}
