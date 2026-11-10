package org.mahavirtrust.backend.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public final class HmacCryptoUtil {

    private HmacCryptoUtil() {}

    public static String sha256Hex(String input) {
        return sha256Hex(input.getBytes(StandardCharsets.UTF_8));
    }

    public static String sha256Hex(byte[] input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input);
            return bytesToHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public static String hmacSha256Hex(String secret, String message) {
        byte[] mac = hmacSha256Bytes(secret.getBytes(StandardCharsets.UTF_8), message.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(mac);
    }

    public static boolean verifyHmacSha256Hex(String secret, String message, String providedHex) {
        if (secret == null || secret.isBlank() || providedHex == null || providedHex.isBlank()) {
            return false;
        }
        String expected = hmacSha256Hex(secret, message);
        String normalized = providedHex.startsWith("sha256=") ? providedHex.substring(7) : providedHex;
        return MessageDigest.isEqual(
                expected.toLowerCase().getBytes(StandardCharsets.UTF_8),
                normalized.trim().toLowerCase().getBytes(StandardCharsets.UTF_8)
        );
    }

    public static String hmacSha256Base64(byte[] keyBytes, String message) {
        byte[] mac = hmacSha256Bytes(keyBytes, message.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(mac);
    }

    private static byte[] hmacSha256Bytes(byte[] keyBytes, byte[] dataBytes) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(keyBytes, "HmacSHA256"));
            return mac.doFinal(dataBytes);
        } catch (Exception e) {
            throw new IllegalStateException("HmacSHA256 failure", e);
        }
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}

