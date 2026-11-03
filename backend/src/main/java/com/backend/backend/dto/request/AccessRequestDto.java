package com.backend.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AccessRequestDto {

    @NotBlank(message = "Doctor email is required")
    @Email
    private String doctorEmail;

    @NotBlank(message = "Patient email is required")
    @Email
    private String patientEmail;

    private String type;

    public AccessRequestDto() {
    }

    public AccessRequestDto(String doctorEmail, String patientEmail, String type) {
        this.doctorEmail = doctorEmail;
        this.patientEmail = patientEmail;
        this.type = type;
    }

    public String getDoctorEmail() { return doctorEmail; }
    public void setDoctorEmail(String doctorEmail) { this.doctorEmail = doctorEmail; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
