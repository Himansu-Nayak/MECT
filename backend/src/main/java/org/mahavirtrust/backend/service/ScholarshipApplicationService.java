package org.mahavirtrust.backend.service;

import org.mahavirtrust.backend.dto.scholarship.*;
import org.mahavirtrust.backend.entity.ApplicationStatus;
import org.mahavirtrust.backend.entity.ScholarshipApplication;
import org.mahavirtrust.backend.entity.ScholarshipDocument;
import org.mahavirtrust.backend.exception.ResourceNotFoundException;
import org.mahavirtrust.backend.repository.ScholarshipApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScholarshipApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ScholarshipApplicationService.class);
    private static final String CHARACTERS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ScholarshipApplicationRepository repository;
    private final AuditLogService auditLogService;

    public ScholarshipApplicationService(ScholarshipApplicationRepository repository, AuditLogService auditLogService) {
        this.repository = repository;
        this.auditLogService = auditLogService;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public ScholarshipApplicationResponse submitApplication(CreateScholarshipApplicationRequest req, String clientIp) {
        if (req.getSwornDeclaration() == null || !req.getSwornDeclaration()) {
            throw new IllegalArgumentException("Applicant must accept the institutional sworn declaration.");
        }

        String appNumber = generateUniqueApplicationNumber();

        ScholarshipApplication app = new ScholarshipApplication();
        app.setApplicationNumber(appNumber);
        app.setFullName(sanitize(req.getFullName()));
        app.setEmail(req.getEmail().trim().toLowerCase());
        app.setPhone(req.getPhone().trim());
        app.setAadhaarLastFour(req.getAadhaarLastFour().trim());
        app.setDateOfBirth(req.getDateOfBirth());
        app.setGender(req.getGender().trim());
        app.setCategory(req.getCategory().trim());
        app.setDistrict(req.getDistrict().trim());
        app.setPinCode(req.getPinCode().trim());
        app.setPermanentAddress(sanitize(req.getPermanentAddress()));
        app.setSchemeCode(req.getSchemeCode().trim());
        app.setInstitutionName(sanitize(req.getInstitutionName()));
        app.setInstitutionDistrict(req.getInstitutionDistrict().trim());
        app.setCourseName(sanitize(req.getCourseName()));
        app.setCurrentYearSemester(req.getCurrentYearSemester().trim());
        app.setRollOrRegistrationNumber(req.getRollOrRegistrationNumber().trim());
        app.setAnnualFamilyIncome(req.getAnnualFamilyIncome());
        app.setTahasildarCertNumber(req.getTahasildarCertNumber().trim());
        app.setTahasildarCertIssueDate(req.getTahasildarCertIssueDate());
        app.setCollegeBankName(sanitize(req.getCollegeBankName()));
        app.setCollegeBankAccountNumber(req.getCollegeBankAccountNumber().trim());
        app.setCollegeBankIfsc(req.getCollegeBankIfsc().trim().toUpperCase());
        app.setCollegeAccountHolderName(sanitize(req.getCollegeAccountHolderName()));
        app.setTuitionFeeDemanded(req.getTuitionFeeDemanded());
        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setSwornDeclaration(true);

        if (req.getDocuments() != null) {
            for (DocumentUploadDto docDto : req.getDocuments()) {
                ScholarshipDocument doc = new ScholarshipDocument(
                        app,
                        docDto.getDocumentType().trim(),
                        sanitize(docDto.getFileName()),
                        docDto.getFileSizeBytes(),
                        docDto.getMimeType().trim(),
                        docDto.getSha256Hash().trim().toLowerCase()
                );
                app.addDocument(doc);
            }
        }

        ScholarshipApplication saved = repository.save(app);

        auditLogService.record("SYSTEM_PUBLIC", "SCHOLARSHIP_APPLIED", "SCHOLARSHIP",
                saved.getApplicationNumber(), clientIp, "Scheme=" + saved.getSchemeCode() + ", District=" + saved.getDistrict());

        log.info("New scholarship application submitted: ref='{}' scheme='{}' district='{}'",
                saved.getApplicationNumber(), saved.getSchemeCode(), saved.getDistrict());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public ScholarshipTrackResponse trackApplication(String applicationNumber, String phone) {
        ScholarshipApplication app = repository.findByApplicationNumber(applicationNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("No scholarship application found for reference: " + applicationNumber));

        if (phone != null && !phone.isBlank()) {
            if (!app.getPhone().equals(phone.trim())) {
                throw new ResourceNotFoundException("Application reference and phone number combination does not match our records.");
            }
        }

        ScholarshipTrackResponse res = new ScholarshipTrackResponse();
        res.setApplicationNumber(app.getApplicationNumber());
        res.setMaskedName(maskName(app.getFullName()));
        res.setInstitutionName(app.getInstitutionName());
        res.setCourseName(app.getCourseName());
        res.setSchemeCode(app.getSchemeCode());
        res.setStatus(app.getStatus());
        res.setStatusMessage(buildStatusMessage(app));
        res.setSubmittedAt(app.getCreatedAt());
        res.setLastUpdatedAt(app.getUpdatedAt());
        res.setActionRequiredNote(app.getActionRequiredNote());
        res.setRejectionReason(app.getRejectionReason());
        res.setDisbursalDate(app.getDisbursalDate());
        res.setStages(buildTrackingStages(app.getStatus()));

        return res;
    }

    @Transactional(readOnly = true)
    public List<ScholarshipApplicationResponse> getAllApplications(ApplicationStatus status, String district) {
        List<ScholarshipApplication> list;
        if (status != null) {
            list = repository.findByStatus(status);
        } else if (district != null && !district.isBlank()) {
            list = repository.findByDistrict(district.trim());
        } else {
            list = repository.findAll();
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScholarshipApplicationResponse getApplicationById(Long id) {
        ScholarshipApplication app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship application not found with ID: " + id));
        return mapToResponse(app);
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public ScholarshipApplicationResponse updateStatus(Long id, ScholarshipStatusUpdateRequest req, String actor, String clientIp) {
        ScholarshipApplication app = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship application not found with ID: " + id));

        if (req.getExpectedVersion() != null && !app.getVersion().equals(req.getExpectedVersion())) {
            throw new ObjectOptimisticLockingFailureException(ScholarshipApplication.class, id);
        }

        ApplicationStatus oldStatus = app.getStatus();
        ApplicationStatus newStatus = req.getStatus();

        app.setStatus(newStatus);
        if (req.getRejectionReason() != null) {
            app.setRejectionReason(req.getRejectionReason().trim());
        }
        if (req.getActionRequiredNote() != null) {
            app.setActionRequiredNote(req.getActionRequiredNote().trim());
        }
        if (req.getDisbursalTransactionRef() != null) {
            app.setDisbursalTransactionRef(req.getDisbursalTransactionRef().trim());
        }

        if (newStatus == ApplicationStatus.DISBURSED && app.getDisbursalDate() == null) {
            app.setDisbursalDate(Instant.now());
        }

        ScholarshipApplication updated = repository.saveAndFlush(app);

        auditLogService.record(actor, "SCHOLARSHIP_STATUS_UPDATE", "SCHOLARSHIP",
                updated.getApplicationNumber(), clientIp,
                String.format("Transition: %s -> %s", oldStatus, newStatus));

        log.info("Scholarship application {} status updated: {} -> {} by actor='{}'",
                updated.getApplicationNumber(), oldStatus, newStatus, actor);

        return mapToResponse(updated);
    }

    private String generateUniqueApplicationNumber() {
        for (int i = 0; i < 10; i++) {
            StringBuilder sb = new StringBuilder("MT-SCH-2026-");
            for (int j = 0; j < 4; j++) {
                sb.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
            }
            String candidate = sb.toString();
            if (repository.findByApplicationNumber(candidate).isEmpty()) {
                return candidate;
            }
        }
        return "MT-SCH-2026-" + System.currentTimeMillis() % 100000;
    }

    private String maskName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "***";
        String[] parts = fullName.trim().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.length; i++) {
            String p = parts[i];
            if (p.length() <= 1) {
                sb.append(p).append("*");
            } else {
                sb.append(p.charAt(0));
                for (int j = 1; j < p.length(); j++) {
                    sb.append("*");
                }
            }
            if (i < parts.length - 1) sb.append(" ");
        }
        return sb.toString();
    }

    private String buildStatusMessage(ScholarshipApplication app) {
        return switch (app.getStatus()) {
            case SUBMITTED -> "Application successfully logged and queued for administrative scrutiny.";
            case UNDER_SCRUTINY -> "Documents and income eligibility are undergoing scrutiny by trust verification officers.";
            case INSTITUTION_VERIFIED -> "Institutional enrollment and bank details verified with college authorities.";
            case COMMITTEE_APPROVED -> "Scholarship grant sanctioned by the Board of Trustees committee.";
            case DISBURSED -> "Grant disbursed directly to college institutional accounts via RTGS/NEFT.";
            case REJECTED -> "Application could not be approved: " + (app.getRejectionReason() != null ? app.getRejectionReason() : "Eligibility criteria not met.");
            case ACTION_REQUIRED -> "Action required from applicant: " + (app.getActionRequiredNote() != null ? app.getActionRequiredNote() : "Please upload clearer copies of certificates.");
        };
    }

    private List<ScholarshipTrackResponse.TrackingStage> buildTrackingStages(ApplicationStatus currentStatus) {
        List<ScholarshipTrackResponse.TrackingStage> stages = new ArrayList<>();

        stages.add(new ScholarshipTrackResponse.TrackingStage("SUBMITTED", "Application Intake",
                getStageState(1, currentStatus), "Online intake with document hashes verified."));

        stages.add(new ScholarshipTrackResponse.TrackingStage("UNDER_SCRUTINY", "Document Scrutiny",
                getStageState(2, currentStatus), "Income certificate and marksheets verified against official portals."));

        stages.add(new ScholarshipTrackResponse.TrackingStage("INSTITUTION_VERIFIED", "College Verification",
                getStageState(3, currentStatus), "Enrollment status and institutional bank accounts confirmed."));

        stages.add(new ScholarshipTrackResponse.TrackingStage("COMMITTEE_APPROVED", "Committee Approval",
                getStageState(4, currentStatus), "Sanction approved under Trust deed statutory guidelines."));

        stages.add(new ScholarshipTrackResponse.TrackingStage("DISBURSED", "Direct Disbursal",
                getStageState(5, currentStatus), "Direct electronic transfer to college treasury."));

        return stages;
    }

    private String getStageState(int stageNumber, ApplicationStatus current) {
        if (current == ApplicationStatus.REJECTED) {
            return stageNumber == 1 ? "COMPLETED" : "REJECTED";
        }
        if (current == ApplicationStatus.ACTION_REQUIRED) {
            return stageNumber == 2 ? "ACTION_NEEDED" : (stageNumber < 2 ? "COMPLETED" : "PENDING");
        }

        int currentRank = switch (current) {
            case SUBMITTED -> 1;
            case UNDER_SCRUTINY -> 2;
            case INSTITUTION_VERIFIED -> 3;
            case COMMITTEE_APPROVED -> 4;
            case DISBURSED -> 5;
            default -> 1;
        };

        if (stageNumber < currentRank) return "COMPLETED";
        if (stageNumber == currentRank) return "CURRENT";
        return "PENDING";
    }

    private ScholarshipApplicationResponse mapToResponse(ScholarshipApplication app) {
        ScholarshipApplicationResponse res = new ScholarshipApplicationResponse();
        res.setId(app.getId());
        res.setApplicationNumber(app.getApplicationNumber());
        res.setFullName(app.getFullName());
        res.setEmail(app.getEmail());
        res.setPhone(app.getPhone());
        res.setAadhaarLastFour(app.getAadhaarLastFour());
        res.setDateOfBirth(app.getDateOfBirth());
        res.setGender(app.getGender());
        res.setCategory(app.getCategory());
        res.setDistrict(app.getDistrict());
        res.setPinCode(app.getPinCode());
        res.setPermanentAddress(app.getPermanentAddress());
        res.setSchemeCode(app.getSchemeCode());
        res.setInstitutionName(app.getInstitutionName());
        res.setInstitutionDistrict(app.getInstitutionDistrict());
        res.setCourseName(app.getCourseName());
        res.setCurrentYearSemester(app.getCurrentYearSemester());
        res.setRollOrRegistrationNumber(app.getRollOrRegistrationNumber());
        res.setAnnualFamilyIncome(app.getAnnualFamilyIncome());
        res.setTahasildarCertNumber(app.getTahasildarCertNumber());
        res.setTahasildarCertIssueDate(app.getTahasildarCertIssueDate());
        res.setCollegeBankName(app.getCollegeBankName());
        res.setCollegeBankAccountNumber(app.getCollegeBankAccountNumber());
        res.setCollegeBankIfsc(app.getCollegeBankIfsc());
        res.setCollegeAccountHolderName(app.getCollegeAccountHolderName());
        res.setTuitionFeeDemanded(app.getTuitionFeeDemanded());
        res.setStatus(app.getStatus());
        res.setRejectionReason(app.getRejectionReason());
        res.setActionRequiredNote(app.getActionRequiredNote());
        res.setDisbursalTransactionRef(app.getDisbursalTransactionRef());
        res.setDisbursalDate(app.getDisbursalDate());
        res.setVersion(app.getVersion());
        res.setCreatedAt(app.getCreatedAt());
        res.setUpdatedAt(app.getUpdatedAt());

        if (app.getDocuments() != null) {
            res.setDocuments(app.getDocuments().stream().map(d -> new ScholarshipApplicationResponse.DocumentDto(
                    d.getId(), d.getDocumentType(), d.getFileName(), d.getFileSizeBytes(),
                    d.getMimeType(), d.getSha256Hash(), d.getUploadedAt()
            )).collect(Collectors.toList()));
        }

        return res;
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("[\\r\\n]+", " ");
    }
}
