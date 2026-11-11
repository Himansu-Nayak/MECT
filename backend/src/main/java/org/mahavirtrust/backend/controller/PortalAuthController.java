package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.auth.TokenRefreshRequest;
import org.mahavirtrust.backend.dto.portal.OtpRequestPayload;
import org.mahavirtrust.backend.dto.portal.OtpVerifyPayload;
import org.mahavirtrust.backend.dto.portal.PortalAuthResponse;
import org.mahavirtrust.backend.security.PortalUserDetailsService.PortalPrincipal;
import org.mahavirtrust.backend.service.portal.OtpAuthService;
import org.mahavirtrust.backend.service.portal.PortalAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/portal/auth")
public class PortalAuthController {

    private final OtpAuthService otpAuthService;
    private final PortalAccountService portalAccountService;

    public PortalAuthController(OtpAuthService otpAuthService, PortalAccountService portalAccountService) {
        this.otpAuthService = otpAuthService;
        this.portalAccountService = portalAccountService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestOtp(
            @Valid @RequestBody OtpRequestPayload request,
            Authentication authentication,
            HttpServletRequest httpRequest) {
        Long portalUserId = extractPortalUserId(authentication);
        Map<String, Object> result = otpAuthService.requestOtp(request, portalUserId, getClientIp(httpRequest));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<PortalAuthResponse> verifyOtp(
            @Valid @RequestBody OtpVerifyPayload request,
            HttpServletRequest httpRequest) {
        PortalAuthResponse response = otpAuthService.verifyOtpAndLogin(request, getClientIp(httpRequest));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<PortalAuthResponse> refresh(
            @Valid @RequestBody TokenRefreshRequest request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(otpAuthService.refreshPortalToken(request.refreshToken(), getClientIp(httpRequest)));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(Authentication authentication, HttpServletRequest httpRequest) {
        Long portalUserId = extractPortalUserId(authentication);
        if (portalUserId != null && authentication.getPrincipal() instanceof PortalPrincipal p) {
            otpAuthService.logoutPortalUser(portalUserId, p.getUserUuid(), getClientIp(httpRequest));
        }
        return ResponseEntity.ok(Map.of("message", "Portal session terminated cleanly."));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        Long portalUserId = extractPortalUserId(authentication);
        if (portalUserId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(portalAccountService.getDashboardAndAccount(portalUserId));
    }

    private Long extractPortalUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof PortalPrincipal p) {
            return p.getId();
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

