package org.mahavirtrust.backend;

import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mahavirtrust.backend.dto.CreateInquiryRequest;
import org.mahavirtrust.backend.dto.CreateVolunteerRequest;
import org.mahavirtrust.backend.repository.PublicInquiryRepository;
import org.mahavirtrust.backend.repository.VolunteerRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MahavirTrustBackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PublicInquiryRepository inquiryRepository;

    @Autowired
    private VolunteerRegistrationRepository volunteerRepository;

    @Test
    void contextLoads() {
        // Confirms Spring Context, Flyway migrations, and JPA initialize cleanly
    }

    @Test
    void healthEndpointReturnsSuccess() throws Exception {
        mockMvc.perform(get("/health")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.application").value("mahavir-trust-backend"));
    }

    @Test
    void submitInquirySavesAndReturnsCreated() throws Exception {
        CreateInquiryRequest request = new CreateInquiryRequest(
                "Ananya Dash",
                "ananya.dash@example.org",
                "+91 98765 43210",
                "Scholarship Guidance",
                "Requesting detailed procedural guidance for rural merit scholarship."
        );

        mockMvc.perform(post("/public/inquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber())
                .andExpect(jsonPath("$.message").isNotEmpty());

        assertThat(inquiryRepository.findByEmailOrderByCreatedAtDesc("ananya.dash@example.org")).isNotEmpty();
    }

    @Test
    void submitInquiryValidationRejectsBlankFields() throws Exception {
        CreateInquiryRequest invalidRequest = new CreateInquiryRequest(
                "",
                "invalid-email",
                "",
                "",
                ""
        );

        mockMvc.perform(post("/public/inquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.validationErrors").isArray());
    }

    @Test
    void submitVolunteerSavesAndReturnsCreated() throws Exception {
        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Sandeep Mohanty",
                "sandeep.m@example.org",
                "+91 98765 12345",
                "Teaching & Mentorship",
                "Cuttack",
                "2-4 hrs/week",
                "M.Sc Mathematics",
                "In-Person",
                "Experience teaching higher secondary mathematics in rural Cuttack.",
                true,
                "v1.0-draft-2026"
        );

        mockMvc.perform(post("/public/volunteers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber());

        assertThat(volunteerRepository.findByEmailOrderByCreatedAtDesc("sandeep.m@example.org")).isNotEmpty();
    }

    @Test
    void submitVolunteerWithStructuredConsentAndDistrictPersistsAccurately() throws Exception {
        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Dr. Ananya Ray",
                "ananya.ray@example.edu.in",
                "+91 98765 99999",
                "Academic & Entrance Exam Mentor",
                "Mayurbhanj",
                "2-4 hrs/month",
                "Ph.D. in Physics",
                "Virtual / Remote",
                "10 years university teaching experience in physics.",
                true,
                "client-provided-version-v9"
        );

        mockMvc.perform(post("/public/volunteers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.referenceId").isNumber());

        var list = volunteerRepository.findByEmailOrderByCreatedAtDesc("ananya.ray@example.edu.in");
        assertThat(list).isNotEmpty();
        var saved = list.get(0);
        assertThat(saved.getDistrict()).isEqualTo("Mayurbhanj");
        assertThat(saved.getConsentDeclared()).isTrue();
        // Server overrides arbitrary client version with institutional draft version
        assertThat(saved.getConsentVersion()).isEqualTo(org.mahavirtrust.backend.service.VolunteerRegistrationService.SERVER_CONSENT_VERSION);
        assertThat(saved.getConsentStatement()).isEqualTo(org.mahavirtrust.backend.service.VolunteerRegistrationService.SERVER_CONSENT_STATEMENT);
        assertThat(saved.getConsentTimestamp()).isNotNull();
        assertThat(saved.getAvailability()).isEqualTo("2-4 hrs/month");
        assertThat(saved.getQualification()).isEqualTo("Ph.D. in Physics");
        assertThat(saved.getEngagementMode()).isEqualTo("Virtual / Remote");
    }

    @Test
    void submitVolunteerWithoutConsentRejectedWithBadRequest() throws Exception {
        CreateVolunteerRequest request = new CreateVolunteerRequest(
                "Ramesh Chandra Patra",
                "ramesh.patra@example.org",
                "+91 91234 56789",
                "Project Samarth Hub Steward",
                "Local community leader interested in volunteering."
        );

        mockMvc.perform(post("/public/volunteers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        var list = volunteerRepository.findByEmailOrderByCreatedAtDesc("ramesh.patra@example.org");
        assertThat(list).isEmpty();
    }
}
