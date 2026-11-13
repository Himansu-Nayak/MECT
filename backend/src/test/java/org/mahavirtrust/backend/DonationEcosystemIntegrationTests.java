package org.mahavirtrust.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.cms.CmsPageUpsertRequest;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.donation.ReviewManualSbiClaimRequest;
import org.mahavirtrust.backend.dto.donation.SubmitManualSbiUtrRequest;
import org.mahavirtrust.backend.dto.donation.UpdatePaymentConfigurationRequest;
import org.mahavirtrust.backend.entity.*;
import org.mahavirtrust.backend.repository.*;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.mahavirtrust.backend.service.notification.EmailProvider;
import org.mahavirtrust.backend.service.notification.WhatsAppProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DonationEcosystemIntegrationTests {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private ManualBankTransferClaimRepository manualClaimRepository;
    @Autowired private ContentRevisionRepository contentRevisionRepository;
    @Autowired private ContentPageRepository contentPageRepository;
    @Autowired private MediaAssetRepository mediaAssetRepository;
    @Autowired private NotificationDeliveryLogRepository deliveryLogRepository;
    @Autowired private NotificationOutboxRepository outboxRepository;
    @Autowired private DonationReceiptRepository receiptRepository;
    @Autowired private PaymentReconciliationLogRepository reconciliationRepository;
    @Autowired private PaymentEventRepository paymentEventRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private PortalVerifiedContactRepository contactRepository;
    @Autowired private PortalUserRoleRepository portalUserRoleRepository;
    @Autowired private PortalUserRepository portalUserRepository;
    @Autowired private AdminUserRepository adminUserRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;

    @MockitoBean private EmailProvider emailProvider;
    @MockitoBean private WhatsAppProvider whatsAppProvider;

    private String superAdminToken;
    private String contentAdminToken;
    private String verificationOfficerToken;
    private String auditorToken;

    @BeforeEach
    void setup() {
        manualClaimRepository.deleteAll();
        contentRevisionRepository.deleteAll();
        contentPageRepository.deleteAll();
        mediaAssetRepository.deleteAll();
        deliveryLogRepository.deleteAll();
        outboxRepository.deleteAll();
        receiptRepository.deleteAll();
        reconciliationRepository.deleteAll();
        paymentEventRepository.deleteAll();
        paymentRepository.deleteAll();
        donationRepository.deleteAll();
        contactRepository.deleteAll();
        portalUserRoleRepository.deleteAll();
        portalUserRepository.deleteAll();

        superAdminToken = ensureAdminToken("eco_super@mahavirtrust.org", Role.ROLE_SUPER_ADMIN);
        contentAdminToken = ensureAdminToken("eco_cms@mahavirtrust.org", Role.ROLE_CONTENT_ADMIN);
        verificationOfficerToken = ensureAdminToken("eco_verify@mahavirtrust.org", Role.ROLE_DONATION_VERIFICATION_OFFICER);
        auditorToken = ensureAdminToken("eco_auditor@mahavirtrust.org", Role.ROLE_AUDITOR);
    }

    private String ensureAdminToken(String email, Role role) {
        AdminUser admin = adminUserRepository.findByEmail(email).orElseGet(() -> {
            AdminUser u = new AdminUser();
            u.setUsername(email);
            u.setEmail(email);
            u.setFullName(role.name());
            u.setRole(role);
            u.setPasswordHash(passwordEncoder.encode("StrongTest@1234"));
            return adminUserRepository.save(u);
        });
        return jwtTokenProvider.generateAccessToken(admin.getUsername(), admin.getRole().name());
    }

    @Test
    void publicConfigAndAdminLimitsValidation() throws Exception {
        MvcResult configRes = mockMvc.perform(get("/public/donations/config"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.config.sbiAccountNumber").value("33341302498"))
                .andExpect(jsonPath("$.config.sbiIfsc").value("SBIN0001701"))
                .andExpect(jsonPath("$.config.sbiUpiId").value("86971610172@sbi"))
                .andExpect(jsonPath("$.config.statutoryClaimApproved").value(false))
                .andExpect(jsonPath("$.config.generalFundEnabled").value(false))
                .andReturn();

        JsonNode body = objectMapper.readTree(configRes.getResponse().getContentAsString());
        List<String> codes = new java.util.ArrayList<>();
        for (JsonNode p : body.get("programmes")) {
            codes.add(p.get("code").asString());
        }
        assertThat(codes).contains(
                "EDUCATION_LEARNING",
                "WOMEN_EMPOWERMENT",
                "SAFE_WATER_SANITATION",
                "FOOD_SECURITY_RELIEF",
                "COMMUNITY_WELFARE"
        );
        assertThat(codes).doesNotContain("GENERAL_FUND");

        UpdatePaymentConfigurationRequest updateReq = new UpdatePaymentConfigurationRequest(
                true, true, "CASHFREE", true,
                new BigDecimal("100.00"), new BigDecimal("500000.00"),
                List.of(500, 1000, 2500, 5000), true,
                "State Bank of India", "MAHAVEER EDUCATIONAL & CHARITABLE TRUST",
                "33341302498", "SBIN0001701", "Rajendra College Square, Bolangir, Odisha",
                "86971610172@sbi", "/images/mect-sbi-upi-qr.png",
                "Verify beneficiary before paying.",
                "Online via Cashfree or manual SBI.",
                "UNCONFIRMED_FY_2026_27", "FY 2026-27", "2024-01-29", "2026-03-31",
                "AADTM5474FF20241", "AADTM5474FE20231", false,
                "Factual statutory disclosure."
        );

        mockMvc.perform(put("/admin/payment-config")
                        .header("Authorization", "Bearer " + superAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.minAmount").value(100.00))
                .andExpect(jsonPath("$.generalFundEnabled").value(true));

        InitiateDonationRequest tooLow = new InitiateDonationRequest(
                "EDUCATION_LEARNING", new BigDecimal("50.00"), "Test Donor", "low@example.org",
                "9876543210", null, null, null, false, "GATEWAY_CHECKOUT", true
        );
        mockMvc.perform(post("/public/donations/initiate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tooLow)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sbiUtrSubmissionDuplicateDetectionAndVerificationIssuesReceipt() throws Exception {
        SubmitManualSbiUtrRequest utrReq = new SubmitManualSbiUtrRequest(
                "SAFE_WATER_SANITATION",
                new BigDecimal("1500.00"),
                "Suresh Patnaik",
                "suresh.patnaik@example.org",
                "+919876501234",
                "Bolangir, Odisha",
                null,
                "For clean water",
                false,
                true,
                "sbi utr 412345678901",
                LocalDate.now(),
                "UPI App Transfer",
                "Screenshot ref 412345",
                null
        );

        MvcResult submitRes = mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(utrReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.claimStatus").value("UTR_SUBMITTED"))
                .andExpect(jsonPath("$.donationStatus").value("PENDING_VERIFICATION"))
                .andExpect(jsonPath("$.utrNormalized").value("SBIUTR412345678901"))
                .andExpect(jsonPath("$.receiptIssued").value(false))
                .andReturn();

        JsonNode submitted = objectMapper.readTree(submitRes.getResponse().getContentAsString());
        String claimRef = submitted.get("claimReference").asString();
        String donationRef = submitted.get("donationReference").asString();

        assertThat(receiptRepository.findAll()).isEmpty();

        // Duplicate UTR must return 409 Conflict and not create a second donation
        mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(utrReq)))
                .andExpect(status().isConflict());
        assertThat(donationRepository.count()).isEqualTo(1);

        // Auditor can view queue but cannot approve
        mockMvc.perform(get("/admin/manual-claims?status=UTR_SUBMITTED")
                        .header("Authorization", "Bearer " + auditorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].claimReference").value(claimRef));

        ReviewManualSbiClaimRequest verifyReq = new ReviewManualSbiClaimRequest(
                "VERIFIED", "SBI-STMT-2026-889", "Matched with SBI statement credit"
        );
        mockMvc.perform(post("/admin/manual-claims/" + claimRef + "/review")
                        .header("Authorization", "Bearer " + auditorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isForbidden());

        // Verification Officer approves -> donation SUCCESSFUL, receipt generated, email queued
        mockMvc.perform(post("/admin/manual-claims/" + claimRef + "/review")
                        .header("Authorization", "Bearer " + verificationOfficerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("VERIFIED"))
                .andExpect(jsonPath("$.donationStatus").value("SUCCESSFUL"))
                .andExpect(jsonPath("$.receiptNumber").isNotEmpty());

        Donation verifiedDonation = donationRepository.findByDonationReference(donationRef).orElseThrow();
        assertThat(verifiedDonation.getStatus()).isEqualTo("SUCCESSFUL");
        assertThat(receiptRepository.findByDonationId(verifiedDonation.getId())).isPresent();
        assertThat(outboxRepository.findAll()).isNotEmpty();

        mockMvc.perform(get("/admin/donations/summary")
                        .header("Authorization", "Bearer " + auditorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verifiedDonationCount").value(1))
                .andExpect(jsonPath("$.sbiVerifiedAmount").value(1500.00));
    }

    @Test
    void authenticatedPortalUserCanClaimVerifiedGuestDonations() throws Exception {
        SubmitManualSbiUtrRequest guestUtr = new SubmitManualSbiUtrRequest(
                "EDUCATION_LEARNING",
                new BigDecimal("1000.00"),
                "Guest Donor",
                "claim.me@example.org",
                null, null, null, null, false, true,
                "UTRCLAIM99887766",
                LocalDate.now(),
                "NEFT", null, null
        );
        MvcResult res = mockMvc.perform(post("/public/donations/sbi/submit-utr")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(guestUtr)))
                .andExpect(status().isCreated())
                .andReturn();
        String claimRef = objectMapper.readTree(res.getResponse().getContentAsString()).get("claimReference").asString();

        mockMvc.perform(post("/admin/manual-claims/" + claimRef + "/review")
                        .header("Authorization", "Bearer " + verificationOfficerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ReviewManualSbiClaimRequest("VERIFIED", "STMT-1", "Verified"))))
                .andExpect(status().isOk());

        PortalUser user = new PortalUser();
        user.setUserUuid(UUID.randomUUID().toString());
        user.setPrimaryEmail("claim.me@example.org");
        user.setStatus("ACTIVE");
        user = portalUserRepository.save(user);
        portalUserRoleRepository.save(new PortalUserRole(user, PortalRoleName.ROLE_GENERAL_USER));

        PortalVerifiedContact vc = new PortalVerifiedContact(user, "EMAIL", "claim.me@example.org", true);
        contactRepository.save(vc);

        String portalToken = jwtTokenProvider.generatePortalAccessToken(
                user.getUserUuid(),
                List.of(PortalRoleName.ROLE_GENERAL_USER.name())
        );

        mockMvc.perform(post("/portal/me/donations/claim")
                        .header("Authorization", "Bearer " + portalToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.claimedCount").value(1));

        assertThat(portalUserRoleRepository.existsByPortalUserIdAndRoleName(user.getId(), PortalRoleName.ROLE_DONOR))
                .isTrue();
    }

    @Test
    void cmsDraftPublishAndMediaUploadWithRbacBoundaries() throws Exception {
        CmsPageUpsertRequest draftReq = new CmsPageUpsertRequest(
                "About MECT",
                "{\"heroTitle\":\"Transparent Governance\",\"mission\":\"Balangir Odisha\"}",
                "Initial institutional draft"
        );

        // Draft saved by CONTENT_ADMIN is NOT yet public
        mockMvc.perform(put("/admin/cms/pages/about/draft")
                        .header("Authorization", "Bearer " + contentAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(draftReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.revisions.length()").value(1));

        mockMvc.perform(get("/public/cms/pages/about"))
                .andExpect(status().isNotFound());

        // Publish -> now visible publicly
        mockMvc.perform(post("/admin/cms/pages/about/publish")
                        .header("Authorization", "Bearer " + contentAdminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.revisions.length()").value(2));

        mockMvc.perform(get("/public/cms/pages/about"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("About MECT"));

        // Unpublish -> transitions to ARCHIVED and returns 404 to public requests
        mockMvc.perform(post("/admin/cms/pages/about/unpublish")
                        .header("Authorization", "Bearer " + contentAdminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));

        mockMvc.perform(get("/public/cms/pages/about"))
                .andExpect(status().isNotFound());

        // CONTENT_ADMIN cannot alter payment configuration
        mockMvc.perform(get("/admin/payment-config")
                        .header("Authorization", "Bearer " + contentAdminToken))
                .andExpect(status().isForbidden());

        // Media upload & public retrieval
        MockMultipartFile file = new MockMultipartFile(
                "file", "banner.png", "image/png", "fakepngbytes".getBytes(StandardCharsets.UTF_8));
        MvcResult mediaRes = mockMvc.perform(multipart("/admin/media")
                        .file(file)
                        .param("altText", "MECT Banner")
                        .param("focalPoint", "center")
                        .header("Authorization", "Bearer " + contentAdminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.assetKey").isNotEmpty())
                .andReturn();

        String publicUrl = objectMapper.readTree(mediaRes.getResponse().getContentAsString()).get("publicUrl").asString();
        String assetKey = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);

        mockMvc.perform(get("/public/cms/media/" + assetKey))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG));
    }
}
