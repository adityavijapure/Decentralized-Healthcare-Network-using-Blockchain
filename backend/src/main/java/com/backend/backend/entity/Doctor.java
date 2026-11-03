package com.backend.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String licenseNumber;
    private String specialization;
    private String medicalCouncil;
    private String regYear;

    private String walletAddress;
    private String proofFilePath;

    // Blockchain Verification Hash (CID)
    private String validityHash;

    // Status: e.g., "AUTHORIZED_NODE", "PENDING_VERIFICATION", or "VERIFIED"
    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Doctor() {
    }

    public Doctor(String fullname, String email, String password, String licenseNumber, 
                  String specialization, String medicalCouncil, String regYear, 
                  String walletAddress, String proofFilePath, String validityHash, String status) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.licenseNumber = licenseNumber;
        this.specialization = specialization;
        this.medicalCouncil = medicalCouncil;
        this.regYear = regYear;
        this.walletAddress = walletAddress;
        this.proofFilePath = proofFilePath;
        this.validityHash = validityHash;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

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

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }

    public String getProofFilePath() { return proofFilePath; }
    public void setProofFilePath(String proofFilePath) { this.proofFilePath = proofFilePath; }

    public String getValidityHash() { return validityHash; }
    public void setValidityHash(String validityHash) { this.validityHash = validityHash; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
