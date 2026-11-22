package com.backend.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_permissions")
public class AccessPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientEmail;

    @Column(nullable = false)
    private String doctorEmail;

    private String doctorName;

    private String specialization;

    private String requestType = "Full Medical History";

    private String status = "PENDING"; // PENDING, APPROVED, REVOKED

    private LocalDateTime requestedAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public AccessPermission() {
    }

    public AccessPermission(String patientEmail, String doctorEmail, String doctorName, String specialization, String requestType, String status) {
        this.patientEmail = patientEmail;
        this.doctorEmail = doctorEmail;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.requestType = requestType != null ? requestType : "Full Medical History";
        this.status = status != null ? status : "PENDING";
        this.requestedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getDoctorEmail() { return doctorEmail; }
    public void setDoctorEmail(String doctorEmail) { this.doctorEmail = doctorEmail; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
