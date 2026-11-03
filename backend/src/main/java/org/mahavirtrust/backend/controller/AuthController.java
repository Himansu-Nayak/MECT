package org.mahavirtrust.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.mahavirtrust.backend.dto.auth.AuthResponse;
import org.mahavirtrust.backend.dto.auth.LoginRequest;
import org.mahavirtrust.backend.dto.auth.TokenRefreshRequest;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AdminUserRepository userRepository;

    public AuthController(AuthService authService, AdminUserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        AuthResponse response = authService.login(request, clientIp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request, HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        AuthResponse response = authService.refreshToken(request, clientIp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(Authentication authentication, HttpServletRequest httpRequest) {
        if (authentication != null && authentication.getName() != null) {
            String clientIp = getClientIp(httpRequest);
            authService.logout(authentication.getName(), clientIp);
        }
        return ResponseEntity.ok(Map.of("message", "Session successfully terminated and tokens revoked."));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        AdminUser user = userRepository.findByUsername(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().name(),
                "status", user.getStatus().name()
        ));
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
