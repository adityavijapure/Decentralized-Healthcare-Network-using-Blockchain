package com.backend.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullname;
    private String email;
    private String password;
    private String licenseNumber;
    private String specialization;
    private String medicalCouncil;
    private String regYear;

    // Blockchain Verification Hash (CID)
    private String validityHash;

    // Status: e.g., "AUTHORIZED_NODE", "PENDING", or "VERIFIED"
    private String status;

    // Default Constructor (Required by JPA)
    public Doctor() {}

    // Parameterized Constructor for easier object creation
    public Doctor(String fullname, String email, String password, String licenseNumber, 
                  String specialization, String medicalCouncil, String regYear, 
                  String validityHash, String status) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.licenseNumber = licenseNumber;
        this.specialization = specialization;
        this.medicalCouncil = medicalCouncil;
        this.regYear = regYear;
        this.validityHash = validityHash;
        this.status = status;
    }

    // --- MANUAL GETTERS AND SETTERS ---
    // (Note: If @Data is working, these are technically redundant but safe to keep)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullname() { return fullname; }
    public void setFullname(String fullname) { this.fullname = fullname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getMedicalCouncil() { return medicalCouncil; }
    public void setMedicalCouncil(String medicalCouncil) { this.medicalCouncil = medicalCouncil; }

    public String getRegYear() { return regYear; }
    public void setRegYear(String regYear) { this.regYear = regYear; }

    public String getValidityHash() { return validityHash; }
    public void setValidityHash(String validityHash) { this.validityHash = validityHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}