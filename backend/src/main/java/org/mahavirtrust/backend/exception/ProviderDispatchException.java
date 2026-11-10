package org.mahavirtrust.backend.exception;

public class ProviderDispatchException extends RuntimeException {
    private final String provider;

    public ProviderDispatchException(String provider, String publicMessage) {
        super(publicMessage);
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}

