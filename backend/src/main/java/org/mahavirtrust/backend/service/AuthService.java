package org.mahavirtrust.backend.service;

import org.mahavirtrust.backend.dto.auth.AuthResponse;
import org.mahavirtrust.backend.dto.auth.LoginRequest;
import org.mahavirtrust.backend.dto.auth.TokenRefreshRequest;
import org.mahavirtrust.backend.entity.AccountStatus;
import org.mahavirtrust.backend.entity.AdminUser;
import org.mahavirtrust.backend.entity.RefreshToken;
import org.mahavirtrust.backend.repository.AdminUserRepository;
import org.mahavirtrust.backend.repository.RefreshTokenRepository;
import org.mahavirtrust.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    private final AdminUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public AuthService(AdminUserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Transactional(noRollbackFor = {BadCredentialsException.class, LockedException.class})
    public AuthResponse login(LoginRequest request, String clientIp) {
        AdminUser user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> {
                    auditLogService.record(request.username(), "LOGIN_FAILED", "AUTH", null, clientIp, "User not found");
                    return new BadCredentialsException("Invalid username or password");
                });

        // Check if locked
        if (!user.isAccountNonLocked()) {
            auditLogService.record(user.getUsername(), "LOGIN_BLOCKED", "AUTH", user.getId().toString(), clientIp, "Account locked");
            throw new LockedException("Account is locked due to multiple failed login attempts. Try again later.");
        }

        // Auto-unlock if lock period has elapsed
        if (user.getStatus() == AccountStatus.LOCKED && user.getLockedUntil() != null && Instant.now().isAfter(user.getLockedUntil())) {
            user.setStatus(AccountStatus.ACTIVE);
            user.setFailedLoginAttempts(0);
            user.setLockedUntil(null);
        }

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= MAX_FAILED_ATTEMPTS) {
                user.setStatus(AccountStatus.LOCKED);
                user.setLockedUntil(Instant.now().plus(LOCKOUT_MINUTES, ChronoUnit.MINUTES));
                userRepository.save(user);
                auditLogService.record(user.getUsername(), "ACCOUNT_LOCKED", "AUTH", user.getId().toString(), clientIp, "Max failed attempts reached");
                throw new LockedException("Account locked due to 5 consecutive failed login attempts.");
            }

            userRepository.save(user);
            auditLogService.record(user.getUsername(), "LOGIN_FAILED", "AUTH", user.getId().toString(), clientIp, "Incorrect password. Attempt " + attempts);
            throw new BadCredentialsException("Invalid username or password");
        }

        // Successful authentication
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        // Generate Access Token and Rotated Refresh Token
        String accessToken = tokenProvider.generateAccessToken(user.getUsername(), user.getRole().name());
        String rawRefreshToken = tokenProvider.generateRawRefreshToken();
        String hashedRefreshToken = tokenProvider.hashToken(rawRefreshToken);

        Instant refreshExpiry = Instant.now().plusSeconds(tokenProvider.getRefreshTokenValiditySeconds());
        RefreshToken refreshToken = new RefreshToken(user, hashedRefreshToken, refreshExpiry);
        refreshTokenRepository.save(refreshToken);

        auditLogService.record(user.getUsername(), "LOGIN_SUCCESS", "AUTH", user.getId().toString(), clientIp, "Institutional session created");

        return AuthResponse.of(
                accessToken,
                rawRefreshToken,
                tokenProvider.getAccessTokenValiditySeconds(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request, String clientIp) {
        String hashed = tokenProvider.hashToken(request.refreshToken());

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHashAndRevokedFalse(hashed)
                .orElseThrow(() -> new BadCredentialsException("Invalid or revoked refresh token"));

        if (refreshToken.isExpired()) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new BadCredentialsException("Refresh token has expired");
        }

        AdminUser user = refreshToken.getUser();
        if (!user.isEnabled() || !user.isAccountNonLocked()) {
            throw new LockedException("Account is disabled or locked");
        }

        // Token rotation: Revoke used token
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        // Issue new token pair
        String newAccessToken = tokenProvider.generateAccessToken(user.getUsername(), user.getRole().name());
        String newRawRefreshToken = tokenProvider.generateRawRefreshToken();
        String newHashedRefreshToken = tokenProvider.hashToken(newRawRefreshToken);

        Instant refreshExpiry = Instant.now().plusSeconds(tokenProvider.getRefreshTokenValiditySeconds());
        RefreshToken newRefreshToken = new RefreshToken(user, newHashedRefreshToken, refreshExpiry);
        refreshTokenRepository.save(newRefreshToken);

        auditLogService.record(user.getUsername(), "TOKEN_REFRESH", "AUTH", user.getId().toString(), clientIp, "Rotated refresh token issued");

        return AuthResponse.of(
                newAccessToken,
                newRawRefreshToken,
                tokenProvider.getAccessTokenValiditySeconds(),
                user.getUsername(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Transactional
    public void logout(String username, String clientIp) {
        userRepository.findByUsername(username).ifPresent(user -> {
            refreshTokenRepository.revokeAllUserTokens(user);
            auditLogService.record(user.getUsername(), "LOGOUT", "AUTH", user.getId().toString(), clientIp, "All active refresh tokens revoked");
        });
    }
}
