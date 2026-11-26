package org.mahavirtrust.backend.service.portal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DefaultGoogleTokenVerifier implements GoogleTokenVerifier {

    private static final Logger log = LoggerFactory.getLogger(DefaultGoogleTokenVerifier.class);
    private static final String GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

    private final String configuredClientId;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    // In-memory public key cache: kid -> PublicKey
    private final Map<String, PublicKey> keyCache = new ConcurrentHashMap<>();
    private Instant cacheExpiry = Instant.MIN;

    public DefaultGoogleTokenVerifier(
            @Value("${app.google.client-id:}") String configuredClientId,
            ObjectMapper objectMapper) {
        this.configuredClientId = configuredClientId != null ? configuredClientId.trim() : "";
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(10));
        this.restClient = RestClient.builder().requestFactory(requestFactory).build();
    }

    /**
     * Allows test harnesses to register in-memory test public keys for hermetic, offline cryptographic validation.
     */
    public void registerTestPublicKey(String kid, PublicKey publicKey) {
        if (kid != null && publicKey != null) {
            keyCache.put(kid, publicKey);
            this.cacheExpiry = Instant.now().plus(Duration.ofDays(365));
        }
    }

    public void clearKeyCache() {
        keyCache.clear();
        this.cacheExpiry = Instant.MIN;
    }

    @Override
    public GoogleIdTokenClaims verifyToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new BadCredentialsException("Google ID token is required.");
        }

        String[] parts = idToken.split("\\.");
        if (parts.length != 3) {
            throw new BadCredentialsException("Malformed Google ID token: expected 3 JWS parts.");
        }

        // 1. Extract header to determine Key ID (kid) and algorithm
        String kid;
        String alg;
        try {
            String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
            JsonNode headerNode = objectMapper.readTree(headerJson);
            kid = headerNode.path("kid").asString(null);
            alg = headerNode.path("alg").asString("RS256");

            if (!"RS256".equalsIgnoreCase(alg)) {
                throw new BadCredentialsException("Unsupported JWS algorithm for Google ID token: " + alg);
            }
        } catch (BadCredentialsException bce) {
            throw bce;
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid Google ID token header format.");
        }

        // 2. Resolve RSA Public Key for signature verification
        PublicKey publicKey = resolvePublicKey(kid);
        if (publicKey == null) {
            throw new BadCredentialsException("Unable to resolve Google public key for token verification (kid=" + kid + ").");
        }

        // 3. Cryptographically verify signature and parse signed claims
        Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(publicKey)
                    .clockSkewSeconds(60) // 60s tolerance for clock drift
                    .build()
                    .parseSignedClaims(idToken)
                    .getPayload();
        } catch (SignatureException se) {
            log.warn("Google ID token cryptographic signature verification failed: {}", se.getMessage());
            throw new BadCredentialsException("Invalid Google ID token cryptographic signature.");
        } catch (ExpiredJwtException eje) {
            log.warn("Google ID token has expired: {}", eje.getMessage());
            throw new BadCredentialsException("Google ID token has expired.");
        } catch (MalformedJwtException mje) {
            log.warn("Malformed Google ID token: {}", mje.getMessage());
            throw new BadCredentialsException("Malformed Google ID token.");
        } catch (Exception ex) {
            log.warn("Failed to parse Google ID token claims: {}", ex.getMessage());
            throw new BadCredentialsException("Invalid Google ID token: " + ex.getMessage());
        }

        // 4. Validate Issuer
        String iss = claims.getIssuer();
        if (!"https://accounts.google.com".equals(iss) && !"accounts.google.com".equals(iss)) {
            throw new BadCredentialsException("Invalid Google ID token issuer: " + iss);
        }

        // 5. Validate Audience
        if (!configuredClientId.isBlank()) {
            Set<String> audiences = claims.getAudience();
            boolean audMatch = audiences != null && audiences.contains(configuredClientId);
            if (!audMatch) {
                // Also check single string representation
                Object rawAud = claims.get("aud");
                audMatch = configuredClientId.equals(rawAud);
            }
            if (!audMatch) {
                throw new BadCredentialsException("Audience mismatch for Google ID token.");
            }
        }

        // 6. Validate Subject
        String sub = claims.getSubject();
        if (sub == null || sub.isBlank()) {
            throw new BadCredentialsException("Missing subject claim in Google ID token.");
        }

        // 7. Validate Email and Email Verified
        String email = claims.get("email", String.class);
        if (email == null || email.isBlank()) {
            throw new BadCredentialsException("Missing email claim in Google ID token.");
        }

        Boolean emailVerified = claims.get("email_verified", Boolean.class);
        if (emailVerified == null || !emailVerified) {
            throw new BadCredentialsException("Google account email is not verified.");
        }

        String name = claims.get("name", String.class);
        String picture = claims.get("picture", String.class);

        return new GoogleIdTokenClaims(
                sub.trim(),
                email.trim().toLowerCase(Locale.ROOT),
                true,
                name != null ? name.trim() : null,
                picture != null ? picture.trim() : null
        );
    }

    private synchronized PublicKey resolvePublicKey(String kid) {
        // Check cache first
        if (kid != null && keyCache.containsKey(kid)) {
            return keyCache.get(kid);
        }

        // Refresh cache if expired or kid is missing
        if (Instant.now().isAfter(cacheExpiry) || (kid != null && !keyCache.containsKey(kid))) {
            refreshGoogleJwks();
        }

        if (kid != null && keyCache.containsKey(kid)) {
            return keyCache.get(kid);
        }

        // If kid is null and we have exactly 1 key (e.g. test key), return it
        if (kid == null && keyCache.size() == 1) {
            return keyCache.values().iterator().next();
        }

        return null;
    }

    private void refreshGoogleJwks() {
        try {
            log.info("Refreshing Google OAuth2 JWKS public keys from {}", GOOGLE_JWKS_URL);
            String jwksJson = restClient.get()
                    .uri(GOOGLE_JWKS_URL)
                    .retrieve()
                    .body(String.class);

            if (jwksJson == null || jwksJson.isBlank()) {
                return;
            }

            JsonNode root = objectMapper.readTree(jwksJson);
            JsonNode keysNode = root.path("keys");
            if (!keysNode.isArray()) {
                return;
            }

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            for (JsonNode kNode : keysNode) {
                String kty = kNode.path("kty").asString("");
                if (!"RSA".equalsIgnoreCase(kty)) continue;

                String keyId = kNode.path("kid").asString(null);
                String nStr = kNode.path("n").asString(null);
                String eStr = kNode.path("e").asString(null);

                if (keyId != null && nStr != null && eStr != null) {
                    BigInteger modulus = new BigInteger(1, Base64.getUrlDecoder().decode(nStr));
                    BigInteger exponent = new BigInteger(1, Base64.getUrlDecoder().decode(eStr));
                    RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
                    PublicKey pubKey = keyFactory.generatePublic(spec);
                    keyCache.put(keyId, pubKey);
                }
            }
            this.cacheExpiry = Instant.now().plus(Duration.ofHours(6));
            log.info("Successfully cached {} Google public verification keys", keyCache.size());
        } catch (Exception ex) {
            log.warn("Failed to refresh Google JWKS public certs: {}", ex.getMessage());
        }
    }
}
