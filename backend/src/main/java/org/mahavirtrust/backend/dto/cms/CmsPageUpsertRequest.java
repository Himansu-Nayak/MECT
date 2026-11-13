package org.mahavirtrust.backend.dto.cms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CmsPageUpsertRequest(
        @NotBlank(message = "Page title is required")
        @Size(max = 200)
        String title,

        @NotBlank(message = "Draft section JSON is required")
        String draftJson,

        @Size(max = 300)
        String changeSummary
) {}
