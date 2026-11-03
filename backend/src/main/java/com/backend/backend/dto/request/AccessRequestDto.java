package com.backend.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccessRequestDto {

    @NotBlank(message = "Doctor email is required")
    @Email
    private String doctorEmail;

    @NotBlank(message = "Patient email is required")
    @Email
    private String patientEmail;

    private String type;
}
