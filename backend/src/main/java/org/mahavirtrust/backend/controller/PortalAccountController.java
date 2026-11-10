package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.portal.*;
import org.mahavirtrust.backend.entity.DonationReceipt;
import org.mahavirtrust.backend.security.PortalUserDetailsService.PortalPrincipal;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.portal.OtpAuthService;
import org.mahavirtrust.backend.service.portal.PortalAccountService;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/portal")
@PreAuthorize("hasAnyRole('GENERAL_USER', 'DONOR')")
public class PortalAccountController {

    private final PortalAccountService accountService;
    private final OtpAuthService otpAuthService;
    private final DonationLifecycleService donationService;

    public PortalAccountController(
            PortalAccountService accountService,
            OtpAuthService otpAuthService,
            DonationLifecycleService donationService) {
        this.accountService = accountService;
        this.otpAuthService = otpAuthService;
        this.donationService = donationService;
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(Authentication authentication) {
        Long userId = requirePortalUserId(authentication);
        return ResponseEntity.ok(accountService.getDashboardAndAccount(userId));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @Valid @RequestBody UpdatePortalProfileRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long userId = requirePortalUserId(authentication);
        return ResponseEntity.ok(accountService.completeOrUpdateProfile(userId, request, getClientIp(httpRequest)));
    }

    @PostMapping("/me/contacts/verify-change")
    public ResponseEntity<Map<String, Object>> verifyContactChange(
            @Valid @RequestBody OtpVerifyPayload request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long userId = requirePortalUserId(authentication);
        otpAuthService.verifyContactChange(userId, request, getClientIp(httpRequest));
        return ResponseEntity.ok(accountService.getDashboardAndAccount(userId));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            @Valid @RequestBody UpdateNotificationPreferencesRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long userId = requirePortalUserId(authentication);
        return ResponseEntity.ok(accountService.updatePreferencesAndConsent(userId, request, getClientIp(httpRequest)));
    }

    @PostMapping("/me/deletion-request")
    public ResponseEntity<Map<String, Object>> requestDeletion(
            @Valid @RequestBody AccountDeletionRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long userId = requirePortalUserId(authentication);
        return ResponseEntity.ok(accountService.requestDeletionOrCorrection(userId, request, getClientIp(httpRequest)));
    }

    @GetMapping("/receipts/{receiptNumber}/pdf")
    public ResponseEntity<byte[]> downloadMyReceipt(
            @PathVariable String receiptNumber,
            Authentication authentication) {
        Long userId = requirePortalUserId(authentication);
        DonationReceipt receipt = donationService.getReceiptForPortalUser(receiptNumber, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename(receipt.getReceiptNumber() + ".pdf").build());
        headers.set("X-Receipt-SHA256", receipt.getPdfSha256());

        return ResponseEntity.ok().headers(headers).body(receipt.getPdfBytes());
    }

    private Long requirePortalUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p) {
            return p.getId();
        }
        throw new IllegalStateException("Portal authentication principal missing.");
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

