package org.mahavirtrust.backend.dto.scholarship;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public class DocumentUploadDto {

    @NotBlank(message = "Document type is required")
    private String documentType;

    @NotBlank(message = "File name is required")
    private String fileName;

    @NotNull(message = "File size is required")
    @Positive(message = "File size must be positive")
    private Long fileSizeBytes;

    @NotBlank(message = "MIME type is required")
    private String mimeType;

    @NotBlank(message = "SHA-256 hash is required")
    @Pattern(regexp = "^[a-fA-F0-9]{64}$", message = "SHA-256 hash must be 64 hexadecimal characters")
    private String sha256Hash;

    public DocumentUploadDto() {
    }

    public DocumentUploadDto(String documentType, String fileName, Long fileSizeBytes, String mimeType, String sha256Hash) {
        this.documentType = documentType;
        this.fileName = fileName;
        this.fileSizeBytes = fileSizeBytes;
        this.mimeType = mimeType;
        this.sha256Hash = sha256Hash;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Long getFileSizeBytes() {
        return fileSizeBytes;
    }

    public void setFileSizeBytes(Long fileSizeBytes) {
        this.fileSizeBytes = fileSizeBytes;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getSha256Hash() {
        return sha256Hash;
    }

    public void setSha256Hash(String sha256Hash) {
        this.sha256Hash = sha256Hash;
    }
}
