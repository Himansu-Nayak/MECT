package org.mahavirtrust.backend.exception;

public class ProviderUnconfiguredException extends RuntimeException {
    private final String provider;

    public ProviderUnconfiguredException(String provider, String message) {
        super(message);
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}

