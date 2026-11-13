package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.dto.donation.SubmitManualSbiUtrRequest;
import org.mahavirtrust.backend.dto.donation.VerifyGatewayPaymentRequest;
import org.mahavirtrust.backend.security.PortalUserDetailsService.PortalPrincipal;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.mahavirtrust.backend.service.donation.PaymentConfigurationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public/donations")
public class DonationController {

    private final DonationLifecycleService donationService;
    private final PaymentConfigurationService paymentConfigurationService;

    public DonationController(
            DonationLifecycleService donationService,
            PaymentConfigurationService paymentConfigurationService) {
        this.donationService = donationService;
        this.paymentConfigurationService = paymentConfigurationService;
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> publicConfig() {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("programmes", donationService.listActiveProgrammes());
        res.put("gatewayStatus", donationService.getGatewayStatus());
        res.put("config", paymentConfigurationService.getPublicConfigMap());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/programmes")
    public ResponseEntity<List<Map<String, Object>>> listProgrammes() {
        return ResponseEntity.ok(donationService.listActiveProgrammes());
    }

    @GetMapping("/gateway-status")
    public ResponseEntity<Map<String, Object>> gatewayStatus() {
        return ResponseEntity.ok(donationService.getGatewayStatus());
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiateDonation(
            @Valid @RequestBody InitiateDonationRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long portalUserId = (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p)
                ? p.getId()
                : null;
        Map<String, Object> initiated = donationService.initiateDonation(portalUserId, request, getClientIp(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(initiated);
    }

    @GetMapping("/{donationReference}/status")
    public ResponseEntity<Map<String, Object>> status(@PathVariable String donationReference) {
        return ResponseEntity.ok(donationService.getPublicStatus(donationReference));
    }

    @PostMapping("/verify-checkout")
    public ResponseEntity<Map<String, Object>> verifyCheckout(
            @Valid @RequestBody VerifyGatewayPaymentRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long portalUserId = (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p)
                ? p.getId()
                : null;
        return ResponseEntity.ok(donationService.verifyGatewayCheckoutCallback(portalUserId, request, getClientIp(httpRequest)));
    }

    @PostMapping("/sbi/submit-utr")
    public ResponseEntity<Map<String, Object>> submitSbiUtrClaim(
            @Valid @RequestBody SubmitManualSbiUtrRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long portalUserId = (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p)
                ? p.getId()
                : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.submitManualSbiUtrClaim(portalUserId, request, getClientIp(httpRequest)));
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

