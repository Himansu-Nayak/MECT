package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.donation.CashfreeVerifyRequest;
import org.mahavirtrust.backend.dto.donation.InitiateDonationRequest;
import org.mahavirtrust.backend.security.PortalUserDetailsService;
import org.mahavirtrust.backend.service.donation.DonationLifecycleService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments/cashfree")
public class CashfreePaymentController {

    private final DonationLifecycleService donationService;

    public CashfreePaymentController(DonationLifecycleService donationService) {
        this.donationService = donationService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(
            @Valid @RequestBody InitiateDonationRequest req,
            Authentication authentication,
            HttpServletRequest request) {
        Long portalUserId = extractPortalUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.initiateCashfreeDonation(portalUserId, req, getClientIp(request)));
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderStatus(
            @PathVariable String orderId,
            @RequestParam(defaultValue = "true") boolean refreshFromGateway,
            HttpServletRequest request) {
        try {
            return ResponseEntity.ok(donationService.verifyCashfreeOrderStatus(
                    orderId,
                    refreshFromGateway,
                    "STATUS_API",
                    getClientIp(request)
            ));
        } catch (ObjectOptimisticLockingFailureException | DataIntegrityViolationException race) {
            // Concurrent webhook settled the transaction simultaneously; return authoritative persisted status
            return ResponseEntity.ok(donationService.verifyCashfreeOrderStatus(
                    orderId,
                    false,
                    "STATUS_API_RACE_READ",
                    getClientIp(request)
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyReturnOrder(
            @Valid @RequestBody CashfreeVerifyRequest req,
            HttpServletRequest request) {
        String orderId = req.orderId().trim();
        try {
            return ResponseEntity.ok(donationService.verifyCashfreeOrderStatus(
                    orderId,
                    true,
                    "RETURN_VERIFY",
                    getClientIp(request)
            ));
        } catch (ObjectOptimisticLockingFailureException | DataIntegrityViolationException race) {
            return ResponseEntity.ok(donationService.verifyCashfreeOrderStatus(
                    orderId,
                    false,
                    "RETURN_VERIFY_RACE_READ",
                    getClientIp(request)
            ));
        }
    }

    private Long extractPortalUserId(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof PortalUserDetailsService.PortalPrincipal pp) {
            return pp.getId();
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
